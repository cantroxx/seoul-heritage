/* ===== js/districts.js ===== */
/* =========================================================================
 *  districts.js  —  3-B: 구별 사수 진행도 색상 + 클릭 라우팅 + 진행도 배지
 *  - 미사수(절반미만)=회색 / 절반이상=파스텔파랑 / 전부=황금 / 문화유산0개=빈 구
 *  - 구 클릭 → (4단계) 구 진입. 지금은 토스트로 안내.
 *  의존: window.SeoulMap, window.GameState
 * ========================================================================= */
(function () {
  "use strict";
  var SM = window.SeoulMap, GS = window.GameState;

  function css(v, f) {
    try { var x = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return x || f; }
    catch (e) { return f; }
  }
  var COLORS = window.DISTRICT_COLORS || {};
  function baseColor(name) { return COLORS[name] || "#D8CBE9"; }

  // 진행도 배지(체크/왕관)를 담는 레이어
  var badgeLayer = null;
  function ensureBadgeLayer() {
    if (!badgeLayer && SM.map && window.L) badgeLayer = L.layerGroup().addTo(SM.map);
    return badgeLayer;
  }
  var badgeMarkers = {};

  /* 구 스타일: 고유 파스텔 색 채우기, 진행도는 테두리 두께/색으로 */
  SM._applyStatusStyle = function (name) {
    var layer = SM._byName[name];
    if (!layer) return;
    var st = GS.districtStats(name);
    var style;
    var ROUND = { lineJoin: "round", lineCap: "round" };
    // 실제 지도 위 → 면은 거의 투명, 경계선으로만 구분/진행도 표시
    if (st.status === "empty") {
      style = { fillColor: "#000000", fillOpacity: 0.0,
                dashArray: "3 6", color: "#9AA0A6", weight: 1.5, opacity: 0.7 };
    } else if (st.status === "all") {
      style = { fillColor: css("--gold", "#E8B02E"), fillOpacity: 0.18,
                dashArray: null, color: css("--gold", "#E8B02E"), weight: 4, opacity: 1 };
    } else if (st.status === "half") {
      style = { fillColor: "#5AA9D6", fillOpacity: 0.1,
                dashArray: null, color: "#3E92CC", weight: 3.5, opacity: 1 };
    } else {
      style = { fillColor: baseColor(name), fillOpacity: 0.12,
                dashArray: null, color: css("--accent-deep", "#E07A00"), weight: 2.5, opacity: 0.85 };
    }
    for (var k in ROUND) style[k] = ROUND[k];
    layer.setStyle(style);
    updateBadgeFor(name, st);
  };

  /* 구 중심에 진행도 배지(절반↑ 체크, 완료 왕관) */
  function updateBadgeFor(name, st) {
    if (!window.L || !SM.map) return;
    var lg = ensureBadgeLayer();
    if (badgeMarkers[name]) { lg.removeLayer(badgeMarkers[name]); delete badgeMarkers[name]; }
    if (SM._mode === "district") return;   // 구 진입 화면에선 숨김
    var html = null;
    if (st.status === "all") html = '<div class="d-badge gold">👑</div>';
    else if (st.status === "half") html = '<div class="d-badge half">✓</div>';
    if (!html) return;
    var layer = SM._byName[name];
    var c;
    try { c = layer.getBounds().getCenter(); } catch (e) { return; }
    var m = L.marker(c, {
      icon: L.divIcon({ className: "", html: html, iconSize: [26, 26], iconAnchor: [13, 13] }),
      interactive: false, zIndexOffset: 500
    });
    m.addTo(lg); badgeMarkers[name] = m;
  }
  // 빈 구(문화유산 0개)는 hover 강조/진입 대상에서 제외
  SM._isLocked = function (name) { return GS.districtStats(name).total === 0; };

  function recolorAll() {
    Object.keys(SM._byName).forEach(function (name) { SM._applyStatusStyle(name); });
    updateBadge();
  }
  // 진입 시 진행도 배지 전부 제거(드릴다운에서 호출)
  SM.clearDistrictBadges = function () {
    if (badgeLayer) { badgeLayer.clearLayers(); badgeMarkers = {}; }
  };
  function updateBadge() {
    var t = GS.totals();
    var el = document.getElementById("progress-badge");
    if (el) el.textContent = "사수 " + t.saved + " / " + t.total;
  }

  /* 구 클릭 라우팅 */
  SM.onDistrictClick = function (name, layer) {
    // 구 진입 중에는 현재 구가 아닌 다른 구(빈 구 포함) 클릭 무시
    if (SM._mode === "district" && SM._currentDistrict !== name) return;
    var st = GS.districtStats(name);
    if (st.total === 0) {
      if (typeof SM.openDistrictInfo === "function" && window.EMPTY_DISTRICT_INFO && window.EMPTY_DISTRICT_INFO[name]) {
        SM.openDistrictInfo(name);
      } else {
        toast(name + "에는 지도에 등록된 문화유산이 없어요.");
      }
      return;
    }
    if (typeof SM.enterDistrict === "function") {
      SM.enterDistrict(name, layer);          // 4단계에서 주입
    } else {
      toast(name + " · 문화유산 " + st.total + "개 (사수 " + st.saved + "개) — 구 진입은 4단계에서 연결됩니다.");
    }
  };

  /* 상태 변경 시 자동 재채색 */
  GS.onChange(recolorAll);
  // 지도 init 완료 후 호출용
  SM.recolorAll = recolorAll;

  /* ---------- 간단 토스트 ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }
  SM.toast = toast;

  window.Districts = { recolorAll: recolorAll, toast: toast };
})();

