/* ===== js/drilldown.js ===== */
/* =========================================================================
 *  drilldown.js  —  4단계(4-A): 구 진입 화면
 *  - 구 클릭 → 해당 구로 확대, 다른 구는 흐리게, 돌아가기 버튼 노출
 *  - 구 안 문화유산 위치에 [회색 별 + 아래 화살표 + 물음표] 마커 표시
 *  - 물음표 클릭 → 정보창(5단계) / 궁궐이면 궁궐 내부 지도(6단계) 훅
 *  - 사수 완료 항목은 마커가 황금(✓)으로 표시
 *  의존: window.SeoulMap, window.GameState, Leaflet(L)
 * ========================================================================= */
(function () {
  "use strict";
  var SM = window.SeoulMap, GS = window.GameState;

  SM._mode = "seoul";
  SM._markerLayer = null;
  SM._currentDistrict = null;

  /* 구 진입 */
  SM.enterDistrict = function (name, layer) {
    if (SM._mode === "district") return;     // 이미 구 화면이면 무시
    var lyr = layer || SM._byName[name];
    if (!lyr) return;

    SM._mode = "district";
    SM._currentDistrict = name;
    SM._declutterDone = false;
    if (SM.clearDistrictBadges) SM.clearDistrictBadges();
    document.body.classList.add("district-mode");

    // 선택 구만 또렷하게, 나머지 구는 거의 보이지 않게(집중)
    Object.keys(SM._byName).forEach(function (n) {
      var l = SM._byName[n];
      if (n === name) {
        l.setStyle({ fillOpacity: 0.18, weight: 3, color: getCSS("--accent-deep", "#E07A00"), dashArray: null });
        if (l.closeTooltip) l.closeTooltip();
        if (l.bringToFront) l.bringToFront();
      } else {
        l.setStyle({ fillOpacity: 0.02, weight: 0.5, opacity: 0.15 });
        if (l.closeTooltip) l.closeTooltip();
      }
    });

    // 확대 (그 구가 화면을 꽉 채우도록)
    try { SM.map.fitBounds(lyr.getBounds(), { padding: [20, 20], maxZoom: 18 }); }
    catch (e) { if (SM.map.setView) SM.map.setView([SM._byName[name]._latlng ? 0 : 0]); }

    // 돌아가기/타이틀
    var back = document.getElementById("back-btn");
    if (back) back.style.display = "inline-flex";
    var title = document.getElementById("district-title");
    if (title) {
      var desc = (window.districtDesc ? window.districtDesc(name) : "");
      title.innerHTML = '<span class="dt-name">' + name + '</span>' +
        (desc ? '<span class="dt-desc">' + desc + '</span>' : '');
    }

    // 마커 렌더
    SM._renderMarkers(name);
  };

  /* 서울 전체로 복귀 */
  SM.exitDistrict = function () {
    SM._mode = "seoul";
    SM._currentDistrict = null;
    document.body.classList.remove("district-mode");

    if (SM._markerLayer) { SM.map.removeLayer(SM._markerLayer); SM._markerLayer = null; }
    if (SM._landmarkLayer) { SM.map.removeLayer(SM._landmarkLayer); SM._landmarkLayer = null; }

    // 라벨 복원
    Object.keys(SM._byName).forEach(function (n) {
      var l = SM._byName[n];
      if (l.openTooltip) l.openTooltip();
    });
    if (typeof SM.recolorAll === "function") SM.recolorAll();

    var back = document.getElementById("back-btn");
    if (back) back.style.display = "none";

    SM.map.fitBounds(window.SEOUL_GEO.SEOUL_BOUNDS);
  };

  /* 구 안 문화유산 마커 생성 */
  SM._renderMarkers = function (name) {
    if (SM._markerLayer) { SM.map.removeLayer(SM._markerLayer); }
    SM._markerLayer = L.layerGroup().addTo(SM.map);

    var items = GS.itemsIn(name);
    SM._currentItems = items;
    items.forEach(function (item) {
      var saved = GS.isSaved(item.id);
      var cs = (window.categoryStyle ? window.categoryStyle(item.category) : { color: "#9A9A9A", icon: "📍", label: item.category });
      var icon = L.divIcon({
        className: "",
        html:
          '<div class="hm-pin' + (saved ? " saved" : "") + '" data-id="' + item.id + '" title="' + cs.label + '">' +
            '<div class="hm-pin-body" style="background:' + (saved ? "var(--gold)" : cs.color) + '">' +
              '<span class="hm-pin-icon">' + (saved ? "✓" : cs.icon) + '</span>' +
            '</div>' +
            '<div class="hm-pin-tip" style="border-top-color:' + (saved ? "var(--gold)" : cs.color) + '"></div>' +
          '</div>',
        iconSize: [48, 60],
        iconAnchor: [24, 56]    // 핀 아래 꼭지가 실제 위치를 가리킴
      });
      var m = L.marker([item.lat, item.lng], { icon: icon, riseOnHover: true });
      m.on("click", function () { SM._openItem(item); });
      m.addTo(SM._markerLayer);
      item._marker = m;
      item._trueLatLng = [item.lat, item.lng];
    });

    // 확대 이동이 끝난 뒤 겹침 분산 (투영 좌표가 확정된 시점)
    SM.map.once("moveend", function () { SM._declutter(items); });
    // 이동이 없던 경우 대비
    setTimeout(function () { if (SM._mode === "district") SM._declutter(items); }, 400);

    // 구 안 명소(랜드마크) 핀 표시
    SM._renderLandmarks(name);
  };

  /* 구 명소(랜드마크) 핀 — 문화유산과 구분되는 회색 깃발 핀 */
  SM._renderLandmarks = function (districtName) {
    if (SM._landmarkLayer) { SM.map.removeLayer(SM._landmarkLayer); }
    SM._landmarkLayer = L.layerGroup().addTo(SM.map);
    var list = (window.DISTRICT_LANDMARKS || {})[districtName] || [];
    list.forEach(function (lm) {
      var icon = L.divIcon({
        className: "",
        html:
          '<div class="lm-pin" title="' + lm.name + '">' +
            '<div class="lm-pin-body"><span class="lm-pin-icon">' + lm.icon + '</span></div>' +
            '<div class="lm-pin-label">' + lm.name + '</div>' +
          '</div>',
        iconSize: [40, 50],
        iconAnchor: [20, 46]
      });
      var m = L.marker([lm.lat, lm.lng], { icon: icon, riseOnHover: true, zIndexOffset: -100 });
      m.on("click", function () {
        if (SM.openLandmarkInfo) SM.openLandmarkInfo(lm, districtName);
      });
      m.addTo(SM._landmarkLayer);
    });
  };

  /* 겹침 분산: 픽셀 좌표로 밀어내고, 많이 밀린 마커는 원위치 표시 */
  SM._declutterDone = false;
  SM._declutter = function (items) {
    if (SM._declutterDone) return;
    if (!SM.map.latLngToLayerPoint) return;
    SM._declutterDone = true;

    var pts = items.map(function (it) {
      var p = SM.map.latLngToLayerPoint(it._trueLatLng);
      return { it: it, x: p.x, y: p.y, ox: p.x, oy: p.y };
    });
    SM._declutterPoints(pts, 52);   // 핀 크기에 맞춘 최소 간격(과한 이탈 방지)

    pts.forEach(function (p) {
      var ll = SM.map.layerPointToLatLng(L.point(p.x, p.y));
      if (p.it._marker) p.it._marker.setLatLng(ll);
      var disp = Math.sqrt((p.x - p.ox) * (p.x - p.ox) + (p.y - p.oy) * (p.y - p.oy));
      if (disp > 24) {
        var orig = SM.map.layerPointToLatLng(L.point(p.ox, p.oy));
        L.polyline([orig, ll], { color: "#9A9A9A", weight: 1, opacity: 0.5, dashArray: "2 3", interactive: false }).addTo(SM._markerLayer);
        L.circleMarker(orig, { radius: 2.5, color: "#9A9A9A", fillColor: "#9A9A9A", fillOpacity: 0.75, weight: 0, interactive: false }).addTo(SM._markerLayer);
      }
    });
  };

  /* 순수 힘-완화(force relaxation): 두 점이 min(px)보다 가까우면 서로 밀어냄 */
  SM._declutterPoints = function (pts, min) {
    for (var iter = 0; iter < 80; iter++) {
      var moved = false;
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var a = pts[i], b = pts[j];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          if (d < min) {
            var push = (min - d) / 2, ux = dx / d, uy = dy / d;
            a.x -= ux * push; a.y -= uy * push;
            b.x += ux * push; b.y += uy * push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return pts;
  };

  /* 마커 한 개의 사수 상태 갱신(황금 전환) — 5단계 퀴즈 성공 시 호출 */
  SM.refreshMarker = function (item) {
    if (!item || !item._marker) return;
    var el = item._marker.getElement();
    if (!el) return;
    var pin = el.querySelector(".hm-pin");
    if (pin && GS.isSaved(item.id)) {
      pin.classList.add("saved");
      var body = pin.querySelector(".hm-pin-body");
      var tip = pin.querySelector(".hm-pin-tip");
      var ic = pin.querySelector(".hm-pin-icon");
      if (body) body.style.background = "var(--gold)";
      if (tip) tip.style.borderTopColor = "var(--gold)";
      if (ic) ic.textContent = "✓";
    }
  };

  /* 물음표 클릭 라우팅 */
  SM._openItem = function (item) {
    if (item.type === "palace" && typeof SM.openPalace === "function") {
      SM.openPalace(item);                 // 6단계: 궁궐 내부 지도
    } else if (typeof SM.openInfo === "function") {
      SM.openInfo(item);                   // 5단계: 정보창
    } else {
      // 아직 미연결: 안내
      if (SM.toast) SM.toast(item.name + " — 정보창은 5단계에서 연결됩니다.");
    }
  };

  /* 도감에서 호출: 현재 구의 특정 문화재 핀으로 이동 + 강조 + 정보창 */
  SM.focusItem = function (id) {
    var items = SM._currentItems || [];
    var item = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === id) { item = items[i]; break; } }
    if (!item) return;
    // 지도 중심 이동
    var ll = item._trueLatLng || [item.lat, item.lng];
    try { SM.map.panTo(ll, { animate: true }); } catch (e) {}
    // 핀 강조(잠깐 튕기는 효과)
    if (item._marker && item._marker.getElement) {
      var el = item._marker.getElement();
      if (el) {
        el.classList.add("pin-focus");
        setTimeout(function () { el.classList.remove("pin-focus"); }, 1600);
      }
    }
    // 정보창 열기
    setTimeout(function () { SM._openItem(item); }, 350);
  };

  /* 돌아가기 버튼 */
  var back = document.getElementById("back-btn");
  if (back) back.addEventListener("click", function () { SM.exitDistrict(); });

  function getCSS(v, f) {
    try { var x = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return x || f; }
    catch (e) { return f; }
  }
})();

