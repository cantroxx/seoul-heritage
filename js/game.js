/* ===== js/game.js ===== */
/* =========================================================================
 *  game.js  —  7단계: 게임 진행 컨트롤
 *  - 도굴꾼 스토리 인트로 / 도움말 다시보기
 *  - 전체 문화재 사수 시 승리 화면
 *  - 진행 초기화(리셋)
 *  의존: window.GameState, window.SeoulMap
 * ========================================================================= */
(function () {
  "use strict";
  var GS = window.GameState, SM = window.SeoulMap;

  var Game = {
    showIntro: function () {
      var el = document.getElementById("intro-overlay");
      if (el) el.classList.remove("hidden");
    },
    hideIntro: function () {
      var el = document.getElementById("intro-overlay");
      if (el) el.classList.add("hidden");
    },
    checkWin: function () {
      var t = GS.totals();
      if (t.saved >= t.total && t.total > 0) {
        if (window.PlayTime && window.PlayTime.submitToRanking) window.PlayTime.submitToRanking();
        var w = document.getElementById("win-overlay");
        if (w) w.classList.add("show");
      }
    }
  };

  // 인트로 시작 버튼
  document.addEventListener("DOMContentLoaded", function () {
    bind();
  });
  function bind() {
    var startBtn = document.getElementById("intro-start");
    if (startBtn) startBtn.onclick = function () { Game.hideIntro(); };

    var helpBtn = document.getElementById("help-btn");
    if (helpBtn) helpBtn.onclick = function () { Game.showIntro(); };

    var winAgain = document.getElementById("win-again");
    if (winAgain) winAgain.onclick = function () {
      if (confirm("모든 사수 기록을 지우고 처음부터 다시 시작할까요?")) {
        GS.resetAll();
        var w = document.getElementById("win-overlay");
        if (w) w.classList.remove("show");
        if (SM.exitDistrict && SM._mode === "district") SM.exitDistrict();
      }
    };

    var resetBtn = document.getElementById("reset-btn");
    if (resetBtn) resetBtn.onclick = function () {
      if (confirm("사수 기록을 모두 지울까요? (처음부터 다시 시작)")) {
        if (window.PlayTime && window.PlayTime.submitToRanking) window.PlayTime.submitToRanking(); // 현재까지 랭킹 저장
        GS.resetAll();
        if (SM.exitDistrict && SM._mode === "district") SM.exitDistrict();
      }
    };
  }

  // 사수할 때마다 승리 체크
  GS.onChange(function () { Game.checkWin(); });

  window.Game = Game;
  // DOMContentLoaded가 이미 지난 경우 대비
  if (document.readyState !== "loading") bind();
})();

