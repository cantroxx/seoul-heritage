/* ===== js/playtime.js ===== */
/* =========================================================================
 *  playtime.js  —  플레이타임 타이머 + 5분 무활동 일시정지 + Firebase 저장
 *  - 로그인 후 시작. 활동(클릭/문제풀이)마다 갱신.
 *  - 5분(IDLE_MS) 무활동 → 일시정지(타이머 멈춤 + 아이콘 표시), 활동 시 재개.
 *  - 사수할 때마다, 주기적으로 Firebase에 누적 저장.
 *  의존: window.GameState, window.FB, window.CURRENT_USER
 *  전역: window.PlayTime = { totalMs(), start(), addActivity(), paused }
 * ========================================================================= */
(function () {
  "use strict";

  var IDLE_MS = 5 * 60 * 1000;   // 5분
  var TICK_MS = 1000;            // 1초마다 갱신
  var SAVE_EVERY_MS = 20 * 1000; // 20초마다 Firebase 저장(과한 호출 방지)

  var PT = {
    baseMs: 0,           // 이전 세션까지 누적(로그인 시 불러옴)
    sessionMs: 0,        // 이번 세션 활동 시간
    paused: true,        // 시작 전엔 멈춤
    countTime: true,     // 랭킹전만 true(학습 모드는 시간 무의미)
    lastActivity: 0,     // 마지막 활동 시각
    lastTick: 0,
    started: false,
    lastSaveMs: 0,
    finishedMs: null     // 61개 완료까지 걸린 누적 ms
  };
  window.PlayTime = PT;

  PT.totalMs = function () { return PT.baseMs + PT.sessionMs; };

  /* 로그인 완료 시 이전 기록 불러와 시작 */
  function startFromUser(user) {
    if (user && user.record) {
      PT.baseMs = user.record.playMs || 0;
      PT.finishedMs = (typeof user.record.finishedMs === "number") ? user.record.finishedMs : null;
      PT.finishedMsDeep = (typeof user.record.finishedMsDeep === "number") ? user.record.finishedMsDeep : null;
    }
    PT.start();
  }

  PT.start = function () {
    if (PT.started) return;
    PT.started = true;
    PT.paused = false;
    PT.lastActivity = Date.now();
    PT.lastTick = Date.now();
    loop();
    bindActivity();
    renderHud();
  };

  function loop() {
    setInterval(function () {
      var now = Date.now();
      if (!PT.paused) {
        // 무활동 검사
        if (now - PT.lastActivity >= IDLE_MS) {
          PT.paused = true;
          renderHud();
        } else {
          if (PT.countTime) PT.sessionMs += (now - PT.lastTick);
        }
      }
      PT.lastTick = now;
      renderHud();
    }, TICK_MS);
  }

  /* 활동 발생: 타이머 재개 + 시각 갱신 */
  PT.addActivity = function () {
    var now = Date.now();
    if (PT.paused && PT.started) {
      PT.paused = false;
      PT.lastTick = now;     // 멈춰있던 동안은 시간 안 셈
      renderHud();
    }
    PT.lastActivity = now;
  };

  function bindActivity() {
    // 지도/문서 클릭, 키 입력을 활동으로 간주
    ["click", "keydown", "touchstart"].forEach(function (ev) {
      document.addEventListener(ev, function () { PT.addActivity(); }, true);
    });
  }

  /* ---------- HUD(상단 타이머) ---------- */
  function fmt(ms) {
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return (h > 0 ? h + ":" : "") + p(m) + ":" + p(sec);
  }
  function renderHud() {
    var el = document.getElementById("playtime-hud");
    if (!el) return;
    var timeEl = document.getElementById("pt-time");
    var pauseEl = document.getElementById("pt-pause");
    if (timeEl) timeEl.textContent = fmt(PT.totalMs());
    if (pauseEl) pauseEl.style.display = PT.paused ? "inline" : "none";
    el.classList.toggle("paused", PT.paused);
  }

  /* ---------- Firebase 저장 ---------- */
  function saveToFB(force) {
    var u = window.CURRENT_USER;
    if (u && u.guest) return;
    if (!u || !window.FB || !window.FB.ready) return;
    var now = Date.now();
    if (!force && now - PT.lastSaveMs < SAVE_EVERY_MS) return;
    PT.lastSaveMs = now;

    var GS = window.GameState;
    var listN = GS.savedListOf ? GS.savedListOf("normal") : [];
    var listD = GS.savedListOf ? GS.savedListOf("deep") : [];
    var objN = {}; listN.forEach(function (id) { objN[id] = true; });
    var objD = {}; listD.forEach(function (id) { objD[id] = true; });

    var data = {
      playMs: PT.totalMs(),
      saved: objN,             // 일반 사수
      savedDeep: objD,         // 심층 사수
      savedCount: listN.length,
      savedCountDeep: listD.length,
      lastSeen: now
    };
    // 현재 난이도 기준 완주 시점 기록(최초 1회)
    var t = GS.totals();
    if (t.saved >= t.total && t.total > 0) {
      var dnow = GS.getDifficulty ? GS.getDifficulty() : "normal";
      if (dnow === "deep" && PT.finishedMsDeep == null) {
        PT.finishedMsDeep = PT.totalMs(); data.finishedMsDeep = PT.finishedMsDeep;
      } else if (dnow === "normal" && PT.finishedMs == null) {
        PT.finishedMs = PT.totalMs(); data.finishedMs = PT.finishedMs;
      }
    }
    window.FB.saveUser(u.school, u.number, u.nick, data);
  }
  PT.save = saveToFB;

  // 랭킹 제출: 랭킹전 모드에서만, 현재 난이도의 랭킹에 최고기록 제출
  PT.submitToRanking = function () {
    if (window.GAME_MODE !== "rank") return;          // 학습 모드는 랭킹 제출 안 함
    var u = window.CURRENT_USER;
    if (u && u.guest) return;
    if (!u || !window.FB || !window.FB.ready) return;
    var GS = window.GameState;
    var t = GS.totals();                              // 현재 난이도 기준
    var cleared = (t.saved >= t.total && t.total > 0);
    var diff = GS.getDifficulty ? GS.getDifficulty() : "normal";
    window.FB.submitRanking({
      nick: u.nick, school: u.school, number: u.number,
      savedCount: t.saved, timeMs: PT.totalMs(), cleared: cleared
    }, null, diff);
  };

  // 사수 등 상태 변화 시 활동+저장
  if (window.GameState && window.GameState.onChange) {
    window.GameState.onChange(function () {
      PT.addActivity();
      saveToFB(true);  // 사수 순간은 즉시 저장
    });
  }
  // 주기 저장
  setInterval(function () { saveToFB(false); }, SAVE_EVERY_MS);
  // 페이지 떠날 때 마지막 저장
  window.addEventListener("beforeunload", function () { saveToFB(true); });

  // 로그인 완료에 연결(school_pin의 onLoginDone과 공존하도록 체이닝)
  var prevHandler = window.onLoginDone;
  window.onLoginDone = function (user) {
    if (typeof prevHandler === "function") prevHandler(user);
    startFromUser(user);
  };
})();
