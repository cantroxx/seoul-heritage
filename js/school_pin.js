/* ===== js/school_pin.js ===== */
/* =========================================================================
 *  school_pin.js  —  '우리학교' 핀 + 거리/시간
 *  로그인 후 학교 주소를 카카오로 좌표 변환 → 지도에 핀 표시.
 *  문화재까지 거리/도보/차 시간 계산 제공.
 *  의존: window.KakaoGeo, window.SeoulMap(L), window.CURRENT_USER
 *  전역: window.SchoolPin = { latlng, ready, place(), distanceTo(lat,lng) }
 * ========================================================================= */
(function () {
  "use strict";

  var SP = { latlng: null, ready: false, marker: null, name: null };
  window.SchoolPin = SP;

  // 카카오 좌표 변환 재시도(지오코더 준비 대기)
  function geocodeWhenReady(address, tries, cb) {
    if (window.KakaoGeo && window.KakaoGeo.ready) {
      window.KakaoGeo.geocode(address).then(function (c) { cb(c, null); })
        .catch(function (e) { cb(null, e); });
      return;
    }
    if (tries <= 0) { cb(null, "지오코더 준비 안 됨"); return; }
    setTimeout(function () { geocodeWhenReady(address, tries - 1, cb); }, 400);
  }

  // 로그인 완료 시 호출됨
  window.onLoginDone = function (user) {
    if (!user || !user.address) return;
    SP.name = user.school;
    geocodeWhenReady(user.address, 12, function (coord, err) {
      if (err || !coord) {
        console.warn("학교 좌표 변환 실패:", err);
        return;
      }
      SP.latlng = coord;
      SP.ready = true;
      placePin();
    });
  };

  function placePin() {
    var SM = window.SeoulMap;
    if (!SM || !SM.map || !SP.latlng) return;
    if (SP.marker) { SM.map.removeLayer(SP.marker); }

    var icon = L.divIcon({
      className: "",
      html:
        '<div class="school-pin" title="' + (SP.name || "우리 학교") + '">' +
          '<div class="school-pin-body">🏫</div>' +
          '<div class="school-pin-label">우리 학교</div>' +
        '</div>',
      iconSize: [54, 64],
      iconAnchor: [27, 60]
    });
    SP.marker = L.marker([SP.latlng.lat, SP.latlng.lng], {
      icon: icon, zIndexOffset: 1000, riseOnHover: true
    });
    SP.marker.on("click", function () {
      if (SP.name) {
        // 간단 팝업(학교 이름)
        SP.marker.bindPopup('<b>' + SP.name + '</b>').openPopup();
      }
    });
    SP.marker.addTo(SM.map);
  }

  // 지도가 나중에 준비될 수도 있으니, 외부에서 재배치 호출 가능
  SP.place = placePin;

  /* 문화재 좌표까지 거리/시간 텍스트 반환. 학교 없으면 null */
  SP.infoTo = function (lat, lng) {
    if (!SP.ready || !SP.latlng || !window.KakaoGeo) return null;
    var km = window.KakaoGeo.haversine(SP.latlng.lat, SP.latlng.lng, lat, lng);
    var est = window.KakaoGeo.estimate(km);
    var dir = window.KakaoGeo.bearing(SP.latlng.lat, SP.latlng.lng, lat, lng);
    return { km: km, kmText: est.kmText, walkMin: est.walkMin, carMin: est.carMin, dir: dir };
  };
})();

