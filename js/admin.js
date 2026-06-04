/* ===== js/admin.js ===== */
/* =========================================================================
 *  admin.js  —  관리자 패널 (동자초/22번/kdw 전용)
 *  로그인 시 관리자면 헤더에 ⚙️ 버튼 노출. 데이터/랭킹 초기화 기능.
 *  ※ 클라이언트 측 UI 제어일 뿐, 진짜 보안은 Firebase 보안 규칙으로 해야 함.
 * ========================================================================= */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }

  function setMsg(t, kind) {
    var el = $("admin-msg");
    if (!el) return;
    el.textContent = t || "";
    el.className = "admin-msg" + (kind ? " " + kind : "");
  }

  function confirmTwice(what) {
    if (!confirm(what + "\n\n정말 진행할까요? 되돌릴 수 없어요.")) return false;
    if (!confirm("마지막 확인입니다.\n" + what + " — 정말 삭제하시겠어요?")) return false;
    return true;
  }

  function init() {
    var btn = $("admin-btn");
    if (btn) btn.onclick = function () { $("admin-overlay").classList.add("show"); };
    var close = $("admin-close");
    if (close) close.onclick = function () { $("admin-overlay").classList.remove("show"); };
    var ov = $("admin-overlay");
    if (ov) ov.addEventListener("click", function (e) { if (e.target === ov) ov.classList.remove("show"); });

    var wk = $("admin-clear-week");
    if (wk) wk.onclick = function () {
      if (!confirmTwice("이번 주 랭킹을 초기화합니다.")) return;
      setMsg("처리 중...");
      window.FB.adminClearThisWeekRanking(function (err) {
        setMsg(err ? ("오류: " + err) : "이번 주 랭킹을 초기화했어요.", err ? "warn" : "ok");
      });
    };
    var ar = $("admin-clear-rank");
    if (ar) ar.onclick = function () {
      if (!confirmTwice("전체 랭킹(모든 주차)을 삭제합니다.")) return;
      setMsg("처리 중...");
      window.FB.adminClearAllRankings(function (err) {
        setMsg(err ? ("오류: " + err) : "전체 랭킹을 삭제했어요.", err ? "warn" : "ok");
      });
    };
    var au = $("admin-clear-users");
    if (au) au.onclick = function () {
      if (!confirmTwice("전체 학생 기록을 삭제합니다. 모든 학생의 사수 기록이 사라져요.")) return;
      setMsg("처리 중...");
      window.FB.adminClearAllUsers(function (err) {
        setMsg(err ? ("오류: " + err) : "전체 학생 기록을 삭제했어요.", err ? "warn" : "ok");
      });
    };
  }

  // 로그인 완료 시 관리자면 버튼 노출(기존 onLoginDone 체이닝)
  var prev = window.onLoginDone;
  window.onLoginDone = function (user) {
    if (typeof prev === "function") prev(user);
    if (window.FB && window.FB.isAdmin && window.FB.isAdmin(user)) {
      var b = $("admin-btn");
      if (b) b.style.display = "";
    }
  };

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();

