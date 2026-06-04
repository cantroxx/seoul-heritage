/* ===== js/login.js ===== */
/* =========================================================================
 *  login.js  —  로그인 화면 (학교 검색 → 확인 → 번호·닉네임 → 신규/기존)
 *  흐름: 로그인 완료 → window.CURRENT_USER 설정 → 인트로 표시
 *  의존: window.SCHOOLS, window.FB, window.GameState
 * ========================================================================= */
(function () {
  "use strict";

  var selectedSchool = null; // {name, district, address}

  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function init() {
    var searchInput = $("school-search");
    if (!searchInput) return;

    // ----- 1단계: 학교 검색 -----
    searchInput.addEventListener("input", function () {
      renderResults(this.value.trim());
    });

    // ----- 2단계: 확인 버튼 -----
    $("confirm-no").onclick = function () {
      goStep("school");
      $("school-search").value = "";
      $("school-results").innerHTML = "";
      $("school-search").focus();
    };
    $("confirm-yes").onclick = function () {
      $("confirm-mini").textContent = "🏫 " + selectedSchool.name;
      goStep("id");
      $("login-number").focus();
    };

    // ----- 3단계: 입장 -----
    $("login-back-id").onclick = function () { goStep("school"); };
    $("login-enter").onclick = function () { tryEnter(); };
    $("login-nick").addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryEnter();
    });
  }

  function renderResults(q) {
    var box = $("school-results");
    box.innerHTML = "";
    if (!q) return;
    var list = window.SCHOOLS || [];
    // 이름에 검색어 포함(공백 무시)
    var qn = q.replace(/\s+/g, "");
    var matches = list.filter(function (s) {
      return s.name.replace(/\s+/g, "").indexOf(qn) !== -1;
    }).slice(0, 30); // 너무 많으면 30개까지

    if (matches.length === 0) {
      box.innerHTML = '<div class="school-empty">검색 결과가 없어요. 다른 이름으로 찾아보세요.</div>';
      return;
    }
    matches.forEach(function (s) {
      var item = document.createElement("button");
      item.className = "school-item";
      item.innerHTML = '<span class="si-name">' + s.name + '</span>' +
                       '<span class="si-dist">' + s.district + '</span>';
      item.onclick = function () {
        selectedSchool = s;
        $("confirm-school-name").textContent = s.name;
        $("confirm-school-addr").textContent = s.address;
        goStep("confirm");
      };
      box.appendChild(item);
    });
  }

  function goStep(step) {
    hide($("login-step-school"));
    hide($("login-step-confirm"));
    hide($("login-step-id"));
    if (step === "school") show($("login-step-school"));
    else if (step === "confirm") show($("login-step-confirm"));
    else if (step === "id") show($("login-step-id"));
  }

  function setMsg(text, kind) {
    var el = $("login-msg");
    el.textContent = text || "";
    el.className = "login-msg" + (kind ? " " + kind : "");
  }

  function tryEnter() {
    var number = $("login-number").value.trim();
    var nick = $("login-nick").value.trim();
    if (!selectedSchool) { goStep("school"); return; }
    if (!number) { setMsg("번호를 입력해 주세요.", "warn"); return; }
    if (!/^[0-9]{1,2}$/.test(number) || Number(number) < 1 || Number(number) > 99) {
      setMsg("번호는 1~99 사이 숫자로 정해 주세요.", "warn"); return;
    }
    if (!nick) { setMsg("닉네임을 입력해 주세요.", "warn"); return; }
    // 공백 정리(연속 공백 제거)
    nick = nick.replace(/\s+/g, " ").trim();
    var nickLen = nick.length;
    if (nickLen < 2 || nickLen > 10) {
      setMsg("닉네임은 2~10자로 정해 주세요.", "warn"); return;
    }
    if (!/^[가-힣a-zA-Z0-9 ]+$/.test(nick)) {
      setMsg("닉네임은 한글·영문·숫자만 쓸 수 있어요.", "warn"); return;
    }

    var btn = $("login-enter");
    btn.disabled = true;
    setMsg("확인 중...", "");

    var school = selectedSchool.name;

    if (!window.FB || !window.FB.ready) {
      // Firebase 미연결 — 오프라인이라도 진행은 가능(로컬만 저장)
      setMsg("온라인 저장에 연결하지 못했어요. 기록이 이 기기에만 저장될 수 있어요.", "warn");
      finishLogin({ school: school, number: number, nick: nick,
                    district: selectedSchool.district, address: selectedSchool.address,
                    record: null, isNew: true });
      btn.disabled = false;
      return;
    }

    window.FB.loadUser(school, number, nick, function (record, err) {
      btn.disabled = false;
      if (err) {
        setMsg("연결 오류: " + err, "warn");
        return;
      }
      if (record) {
        // 기존 유저
        setMsg("이미 있는 유저입니다! 저장된 기록으로 들어갑니다.", "ok");
        setTimeout(function () {
          finishLogin({ school: school, number: number, nick: nick,
                        district: selectedSchool.district, address: selectedSchool.address,
                        record: record, isNew: false });
        }, 700);
      } else {
        // 신규 유저
        setMsg("새롭게 문화유산을 사수하러 갑니다!", "ok");
        window.FB.createUser(school, number, nick, function (rec) {
          setTimeout(function () {
            finishLogin({ school: school, number: number, nick: nick,
                          district: selectedSchool.district, address: selectedSchool.address,
                          record: rec, isNew: true });
          }, 700);
        });
      }
    });
  }

  function finishLogin(user) {
    window.CURRENT_USER = user;

    // 기존 기록이 있으면 난이도별 사수 상태 복원
    if (user.record && window.GameState && window.GameState.restoreSaved) {
      window.GameState.restoreSaved(user.record.saved, user.record.savedDeep);
    }

    // 로그인 화면 닫고 모드 선택 표시
    hide($("login-overlay"));
    var greet = $("mode-greeting");
    if (greet) greet.textContent = (user.nick || "") + "님, 반가워요!";
    var modeOv = $("mode-overlay");
    if (modeOv) modeOv.classList.remove("hidden");
    if (window.applyRankLock) window.applyRankLock();

    // 로그인 이벤트 알림(학교 핀·플레이타임 등 준비)
    if (window.onLoginDone) window.onLoginDone(user);
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();

