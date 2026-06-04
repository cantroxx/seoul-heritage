/* ===== js/mode.js ===== */
/* =========================================================================
 *  mode.js  —  학습 / 랭킹전 모드 선택 및 제어
 *  - 로그인 후 모드 선택 → window.GAME_MODE = "study" | "rank"
 *  - 랭킹전: 타이머·랭킹 버튼 표시 / 학습: 숨김(기록 저장은 둘 다)
 *  - 모드 선택 후 인트로 표시
 *  의존: window.PlayTime
 * ========================================================================= */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }

  window.GAME_MODE = null;
  window.GAME_DIFF = "normal"; // "normal" | "deep"

  var RANK_UNLOCK = 31; // 이 개수 이상 사수해야 랭킹전 입장 가능

  function choose(mode) {
    // 난이도 확정 후 GameState에 반영(사수 현황이 그 난이도 기준으로 전환됨)
    if (window.GameState && window.GameState.setDifficulty) {
      window.GameState.setDifficulty(window.GAME_DIFF);
    }
    // 랭킹전 잠금 확인
    if (mode === "rank" && !rankUnlocked()) {
      var savedN = currentSavedCount();
      alert("랭킹전은 문화유산을 " + RANK_UNLOCK + "개 이상 사수한 뒤에 열려요!\n지금까지 " + savedN + "개 사수했어요.\n먼저 학습 모드에서 더 공부해 볼까요?");
      return;
    }
    window.GAME_MODE = mode; // "study" | "rank"
    var ov = $("mode-overlay");
    if (ov) ov.classList.add("hidden");

    // 모드별 UI
    var isRank = (mode === "rank");
    var hud = $("playtime-hud");
    var rankBtn = $("ranking-btn");
    if (hud) hud.style.display = isRank ? "" : "none";       // 학습 모드는 타이머 숨김
    if (rankBtn) rankBtn.textContent = "🏆 랭킹";            // 게임 중엔 '랭킹'으로 표시
    if (rankBtn) rankBtn.style.display = isRank ? "" : "none"; // 학습 모드는 랭킹 버튼 숨김

    // 플레이타임은 랭킹전에서만 카운트(학습은 기록만, 시간 무의미)
    if (window.PlayTime) {
      window.PlayTime.countTime = isRank;
    }

    // 인트로 표시(최초 선택 때만. 게임 중 재선택이면 스킵)
    if (!window._modeChosenOnce) {
      var intro = $("intro-overlay");
      if (intro) intro.classList.remove("hidden");
      window._modeChosenOnce = true;
    }
  }

  // 현재까지 사수한 개수(현재 상태 우선, 없으면 로그인 기록)
  function currentSavedCount() {
    if (window.GameState && window.GameState.totals) {
      var t = window.GameState.totals();
      if (t && typeof t.saved === "number") return t.saved;
    }
    var u = window.CURRENT_USER;
    if (u && u.record && typeof u.record.savedCount === "number") return u.record.savedCount;
    return 0;
  }
  function rankUnlocked() { return currentSavedCount() >= RANK_UNLOCK; }

  // 모드 화면 표시 시 랭킹전 버튼 잠금 모양 반영
  function applyLock() {
    var r = $("mode-rank");
    if (!r) return;
    if (rankUnlocked()) {
      r.classList.remove("locked");
      var d = r.querySelector(".mode-opt-desc");
      if (d) d.innerHTML = "시간을 재서 빠르게!<br>전국 친구들과 순위 대결";
      var lk = r.querySelector(".mode-lock");
      if (lk) lk.remove();
    } else {
      r.classList.add("locked");
      var savedN = currentSavedCount();
      var desc = r.querySelector(".mode-opt-desc");
      if (desc) desc.innerHTML = "🔒 " + RANK_UNLOCK + "개 이상 사수하면 열려요<br>(지금 " + savedN + "개)";
    }
  }
  window.applyRankLock = applyLock;

  function init() {
    var s = $("mode-study"), r = $("mode-rank");
    if (s) s.onclick = function () { choose("study"); };
    if (r) r.onclick = function () { choose("rank"); };
    // 헤더의 모드 선택 버튼 → 모드 화면 다시 열기
    var mb = $("mode-btn");
    if (mb) mb.onclick = function () {
      var ov = $("mode-overlay");
      if (ov) ov.classList.remove("hidden");
      if (window.applyRankLock) window.applyRankLock();
      // 이미 모드를 고른 상태면 '돌아가기' 노출
      var back = $("mode-back");
      if (back) back.classList.toggle("hidden", !window.GAME_MODE);
    };
    // 돌아가기: 모드 화면만 닫고 게임 복귀(인트로 안 거침)
    var back = $("mode-back");
    if (back) back.onclick = function () {
      var ov = $("mode-overlay");
      if (ov) ov.classList.add("hidden");
    };

    // 난이도 선택(일반/심층)
    var dn = $("diff-normal"), dd = $("diff-deep");
    function setDiff(diff) {
      window.GAME_DIFF = diff;
      if (dn) dn.classList.toggle("active", diff === "normal");
      if (dd) dd.classList.toggle("active", diff === "deep");
    }
    if (dn) dn.onclick = function () { setDiff("normal"); };
    if (dd) dd.onclick = function () { setDiff("deep"); };
  }
  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();

