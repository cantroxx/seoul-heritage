/* ===== js/map.js ===== */
/* =========================================================================
 *  map.js  —  3-A: 서울 전체 지도 골격
 *  - Leaflet 사용(타일 없음): 구 경계 GeoJSON + 한강만 그려 교과서 톤 표현
 *  - 휠 줌/팬 지원, 서울 전체 보기로 맞춤
 *  - 전역 window.SeoulMap 으로 이후 단계(구 색상/클릭/드릴다운)에서 확장
 *
 *  의존: Leaflet(L), window.SEOUL_GEO (data/geo.js)
 * ========================================================================= */
(function () {
  "use strict";

  var G = window.SEOUL_GEO;

  var SeoulMap = {
    map: null,
    districtLayer: null,
    riverLayer: null,
    labelLayer: null,
    homeBadge: null,
    _byName: {},            // 구 이름 -> Leaflet layer
    onDistrictClick: null,  // 3-B/4 에서 주입할 콜백(name, layer)

    /* GeoJSON feature 에서 구 이름 안전 추출 */
    featureName: function (f) {
      var p = (f && f.properties) || {};
      return p.name || p.SIG_KOR_NM || p.sig_kor_nm || p.adm_nm || p.NAME || null;
    },

    /* 구 기본 스타일(미사수=회색). 3-B에서 상태별로 갱신 */
    baseStyle: function () {
      return {
        color: getCSS("--d-stroke", "#8A7458"),
        weight: 1.5,
        fillColor: getCSS("--d-none", "#C9BBA8"),
        fillOpacity: 0.85,
        opacity: 1
      };
    },

    hoverStyle: function () {
      return { weight: 4, fillColor: getCSS("--accent", "#F39C12"), fillOpacity: 0.25 };
    },

    init: function () {
      var self = this;
      this.map = L.map("map", {
        zoomControl: false,        // 기본 줌(좌상단) 끄고 아래에서 우상단에 추가
        scrollWheelZoom: true,     // 휠 확대/축소
        attributionControl: true,  // 타일 저작권 표기(의무)
        minZoom: 10,
        maxZoom: 18,
        zoomSnap: 0.25,
        wheelPxPerZoomLevel: 90
      });
      L.control.zoom({ position: "topright" }).addTo(this.map);
      // 실제 지도 타일 (CARTO Voyager — 파스텔·부드러운 톤)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(this.map);

      // 서울 전체 보기
      this.map.fitBounds(G.SEOUL_BOUNDS);
      this.map.setMaxBounds(expandBounds(G.SEOUL_BOUNDS, 0.15));

      // 구 경계 로딩(실제 지도 위에 경계선만 얇게)
      return G.loadDistrictGeoJSON()
        .then(function (geojson) {
          self._addDistricts(geojson);
          return true;
        });
    },

    _addRiver: function () {
      // 한강 경로를 부드러운 곡선으로 보간(Catmull-Rom)
      var coords = G.HAN_RIVER.geometry.coordinates.map(function (c) { return [c[1], c[0]]; }); // [lat,lng]
      var smooth = smoothLatLngs(coords, 8);
      this.riverLayer = L.polyline(smooth, {
        color: getCSS("--river-edge", "#6FB6DE"),
        weight: 18, opacity: 0.5, lineCap: "round", lineJoin: "round", smoothFactor: 1.5
      }).addTo(this.map);
      this.riverInner = L.polyline(smooth, {
        color: getCSS("--river", "#9AD0EF"),
        weight: 11, opacity: 0.7, lineCap: "round", lineJoin: "round", smoothFactor: 1.5
      }).addTo(this.map);
    },

    _addRiverOnTop: function () {
      // 한강은 구 위에 올리되 매우 은은하게(아래로 깔리면 구에 가려지므로)
      if (this.riverLayer) this.riverLayer.bringToFront();
      if (this.riverInner) this.riverInner.bringToFront();
      // 한강 라벨은 표시하지 않음(가시성 위해 제거)
    },

    /* 배경 장식 일러스트(산·나무·빌딩·궁궐·구름·랜드마크) */
    _addLandmarks: function () {
      var self = this;
      this.landmarkLayer = L.layerGroup().addTo(this.map);
      var decos = window.MAP_DECORATIONS || [];
      var sizePx = { sm: 18, md: 26, lg: 36 };
      decos.forEach(function (m) {
        var px = sizePx[m.size] || 22;
        var html = '<div class="deco deco-' + (m.size || "md") + '">' + m.emoji +
          (m.label ? '<span class="deco-label">' + m.label + '</span>' : '') + '</div>';
        L.marker([m.lat, m.lng], {
          icon: L.divIcon({ className: "", html: html, iconSize: [px, px], iconAnchor: [px / 2, px / 2] }),
          interactive: false, zIndexOffset: 200
        }).addTo(self.landmarkLayer);
      });
    },

    _addDistricts: function (geojson) {
      var self = this;
      this.districtLayer = L.geoJSON(geojson, {
        style: function () { return self.baseStyle(); },
        onEachFeature: function (feature, layer) {
          var name = self.featureName(feature);
          if (!name) return;
          self._byName[name] = layer;

          // 구 이름 라벨(중심에 영구 툴팁) — 일부 구는 경계 걸침 보정
          var LABEL_OFFSET = {
            "종로구": [10, 28],   // 아래로 내려 경계 걸침 방지
            "강남구": [0, 6],
            "용산구": [0, 4]
          };
          var off = LABEL_OFFSET[name] || [0, 0];
          layer.bindTooltip(name, {
            permanent: true, direction: "center",
            className: "district-label", offset: off
          });

          layer.on({
            mouseover: function () {
              if (self._mode === "district" && self._currentDistrict !== name) return; // 진입 중 다른 구 무시
              if (!self._isLocked(name)) layer.setStyle(self.hoverStyle());
              else layer.setStyle({ fillOpacity: 0.15, color: "#7A7F85", weight: 2.5 }); // 빈 구: 약한 강조
            },
            mouseout: function () {
              if (self._mode === "district" && self._currentDistrict !== name) return;
              self._applyStatusStyle(name); // 구 고유색/진행도 복원
            },
            click: function () {
              if (self._mode === "district" && self._currentDistrict !== name) return; // 진입 중 다른 구 클릭 차단
              if (typeof self.onDistrictClick === "function") {
                self.onDistrictClick(name, layer);
              }
            }
          });
        }
      }).addTo(this.map);

      // (구 '우리지역' 배지는 로그인한 학교 핀으로 대체됨)
    },

    _addHomeBadge: function () {
      var layer = this._byName[G.HOME_DISTRICT];
      var center;
      if (layer && layer.getBounds) {
        try { center = layer.getBounds().getCenter(); } catch (e) {}
      }
      if (!center) {
        var home = G.DISTRICTS.filter(function (d) { return d.name === G.HOME_DISTRICT; })[0];
        if (!home) return;
        center = { lat: home.lat, lng: home.lng };
      }
      // 구 중심에서 살짝 위(구 안에 머무르도록 작은 오프셋만)
      this.homeBadge = L.marker([center.lat + 0.012, center.lng], {
        icon: L.divIcon({
          className: "home-badge",
          html: '<span class="pin">★</span> 우리지역',
          iconSize: [76, 22]
        }),
        interactive: false,
        zIndexOffset: 1000
      }).addTo(this.map);
    },

    /* 3-B에서 구현될 자리(상태색/잠금). 지금은 no-op */
    _applyStatusStyle: function (name) { /* 3-B */ },
    _isLocked: function (name) { return false; /* 3-B */ }
  };

  /* ---------- 유틸 ---------- */
  function getCSS(varName, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function expandBounds(b, ratio) {
    var dLat = (b[1][0] - b[0][0]) * ratio, dLng = (b[1][1] - b[0][1]) * ratio;
    return [[b[0][0] - dLat, b[0][1] - dLng], [b[1][0] + dLat, b[1][1] + dLng]];
  }
  /* Catmull-Rom 스플라인으로 점들을 부드러운 곡선으로 보간 */
  function smoothLatLngs(pts, seg) {
    if (pts.length < 3) return pts;
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i === 0 ? 0 : i - 1];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      for (var t = 0; t < seg; t++) {
        var s = t / seg, s2 = s * s, s3 = s2 * s;
        var lat = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * s +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3);
        var lng = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * s +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3);
        out.push([lat, lng]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  window.SeoulMap = SeoulMap;
})();

