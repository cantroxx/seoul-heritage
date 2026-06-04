/* ===== js/ranking.js ===== */
/* =========================================================================
 *  ranking.js  —  랭킹전 (1~10등)
 *  정렬: ① 사수 개수 많은 순  ② 같으면 완료자(finishedMs 있는 사람) 우선
 *        ③ 완료자끼리는 완료시간 짧은 순  ④ 그 외 플레이타임 짧은 순
 *  의존: window.FB, window.CURRENT_USER
 * ========================================================================= */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function fmtMs(ms) {
    if (ms == null) return "-";
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return (h > 0 ? h + ":" : "") + p(m) + ":" + p(sec);
  }

  function rankSort(a, b) {
    var sa = a.savedCount || 0, sb = b.savedCount || 0;
    if (sb !== sa) return sb - sa;                   // 사수 많은 순
    var ca = !!a.cleared, cb2 = !!b.cleared;
    if (ca !== cb2) return ca ? -1 : 1;              // 클리어 우선
    return (a.timeMs || Infinity) - (b.timeMs || Infinity); // 시간 짧은 순
  }

  function open() {
    var overlay = $("ranking-overlay");
    overlay.classList.add("show");
    var body = $("ranking-body");
    body.innerHTML = '<div class="rank-loading">랭킹을 불러오는 중...</div>';

    var diff = (window.GameState && window.GameState.getDifficulty) ? window.GameState.getDifficulty() : "normal";
    var diffLabel = (diff === "deep") ? "🔥 심층" : "📖 일반";
    var titleEl = $("ranking-title");
    if (titleEl) titleEl.textContent = "🏆 랭킹전 TOP 10 · " + diffLabel;

    if (!window.FB || !window.FB.ready) {
      body.innerHTML = '<div class="rank-loading">온라인 랭킹에 연결하지 못했어요.<br>인터넷 연결을 확인해 주세요.</div>';
      return;
    }

    window.FB.loadRankings(function (users, err) {
      if (err || !users) {
        body.innerHTML = '<div class="rank-loading">랭킹을 불러오지 못했어요: ' + (err || "") + '</div>';
        return;
      }
      users.sort(rankSort);
      var top = users.slice(0, 10);
      var me = window.CURRENT_USER;

      var rows = top.map(function (u, i) {
        var rank = i + 1;
        var medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
        var done = !!u.cleared;
        var isMe = me && u.school === me.school && String(u.number) === String(me.number) && u.nick === me.nick;
        return '<div class="rank-row' + (isMe ? " me" : "") + (done ? " done" : "") + '">' +
          '<div class="rank-no">' + medal + '</div>' +
          '<div class="rank-who">' +
            '<div class="rank-nick">' + esc(u.nick || "?") + (done ? ' <span class="rank-clear">CLEAR</span>' : '') + '</div>' +
            '<div class="rank-school">' + esc(u.school || "") + ' · ' + (u.number || "?") + '번</div>' +
          '</div>' +
          '<div class="rank-stat">' +
            '<div class="rank-saved">' + (u.savedCount || 0) + '<span>개 사수</span></div>' +
            '<div class="rank-time">⏱️ ' + fmtMs(u.timeMs || 0) + '</div>' +
          '</div>' +
        '</div>';
      }).join("");

      if (!rows) rows = '<div class="rank-loading">이번 주 기록이 아직 없어요.<br>랭킹전에서 첫 기록을 세워 보세요!</div>';

      var myRankInfo = "";
      if (me) {
        var idx = users.findIndex(function (u) {
          return u.school === me.school && String(u.number) === String(me.number) && u.nick === me.nick;
        });
        if (idx >= 10) {
          var u = users[idx];
          myRankInfo = '<div class="rank-myrow">내 순위 ' + (idx + 1) + '위 · ' +
            (u.savedCount || 0) + '개 사수 · ⏱️ ' + fmtMs(u.timeMs || 0) + '</div>';
        }
      }

      body.innerHTML = '<div class="rank-list">' + rows + '</div>' + myRankInfo;
    }, diff);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function init() {
    var btn = $("ranking-btn");
    if (btn) btn.onclick = open;
    var close = $("ranking-close");
    if (close) close.onclick = function () { $("ranking-overlay").classList.remove("show"); };
    var overlay = $("ranking-overlay");
    if (overlay) overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("show");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();

