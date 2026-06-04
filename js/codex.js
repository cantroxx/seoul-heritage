/* ===== js/codex.js ===== */
/* =========================================================================
 *  codex.js  —  문화유산 도감 (서울 전체 화면 우측 하단 버튼)
 *  61개 목록: 사수=컬러+볼드+아이콘 / 미사수=회색. 카테고리별 묶음.
 *  항목 클릭 → 그 문화재가 있는 구로 이동(드릴다운) + 핀 강조.
 *  의존: window.HERITAGE_DATA, window.GameState, window.SeoulMap, window.categoryStyle
 * ========================================================================= */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  var GS = window.GameState, SM = window.SeoulMap;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 카테고리 표시 순서
  var CAT_ORDER = ["궁궐","성곽·대문","왕릉","종묘","기록유산","무형유산","자연유산","시대별 문화유산","유적지","독립운동 유적지","박물관","기념관"];

  function open() {
    var overlay = $("codex-overlay");
    overlay.classList.add("show");
    render();
  }
  function closeCodex() { $("codex-overlay").classList.remove("show"); }

  function render() {
    var DATA = window.HERITAGE_DATA || [];
    var body = $("codex-body");

    var total = DATA.length;
    var savedN = DATA.filter(function (d) { return GS.isSaved(d.id); }).length;
    var diff = (window.GameState.getDifficulty) ? window.GameState.getDifficulty() : "normal";
    var diffLabel = (diff === "deep") ? "🔥 심층" : "📖 일반";
    $("codex-progress").textContent = diffLabel + " · " + total + "개 중 " + savedN + "개 사수";
    var pct = total ? Math.round(savedN / total * 100) : 0;
    $("codex-bar-fill").style.width = pct + "%";

    // 카테고리별 그룹
    var groups = {};
    DATA.forEach(function (d) {
      (groups[d.category] = groups[d.category] || []).push(d);
    });
    var cats = Object.keys(groups).sort(function (a, b) {
      var ia = CAT_ORDER.indexOf(a), ib = CAT_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    var html = "";
    cats.forEach(function (cat) {
      var cs = window.categoryStyle ? window.categoryStyle(cat) : { color: "#9A9A9A", icon: "📍" };
      var items = groups[cat];
      var savedC = items.filter(function (d) { return GS.isSaved(d.id); }).length;
      html += '<div class="codex-group">' +
        '<div class="codex-cat" style="color:' + cs.color + '">' +
          '<span>' + cs.icon + ' ' + esc(cat) + '</span>' +
          '<span class="codex-cat-count">' + savedC + '/' + items.length + '</span>' +
        '</div>' +
        '<div class="codex-items">';
      items.forEach(function (d) {
        var saved = GS.isSaved(d.id);
        html += '<button class="codex-item ' + (saved ? "saved" : "locked") + '" data-id="' + d.id + '" data-dist="' + esc(d.district) + '">' +
          '<span class="ci-icon">' + (saved ? cs.icon : "🔒") + '</span>' +
          '<span class="ci-name">' + esc(d.name) + '</span>' +
          '<span class="ci-dist">' + esc(d.district) + '</span>' +
        '</button>';
      });
      html += '</div></div>';
    });
    body.innerHTML = html;

    Array.prototype.forEach.call(body.querySelectorAll(".codex-item"), function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute("data-id");
        var dist = btn.getAttribute("data-dist");
        goToItem(id, dist);
      };
    });
  }

  // 도감 항목 클릭 → 그 구로 이동 + 핀 강조
  function goToItem(id, district) {
    closeCodex();
    if (!SM) return;
    // 이미 다른 구에 있으면 먼저 나가기
    if (SM._mode === "district" && SM._currentDistrict !== district && SM.exitDistrict) {
      SM.exitDistrict();
    }
    setTimeout(function () {
      if (SM._mode !== "district") {
        if (SM.enterDistrict) SM.enterDistrict(district);
      }
      // 진입 애니메이션 후 해당 핀 열기/강조
      setTimeout(function () {
        if (SM.focusItem) SM.focusItem(id);
      }, 700);
    }, SM._mode === "district" ? 350 : 0);
  }

  function init() {
    var btn = $("codex-btn");
    if (btn) btn.onclick = open;
    var close = $("codex-close");
    if (close) close.onclick = closeCodex;
    var overlay = $("codex-overlay");
    if (overlay) overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeCodex();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();

