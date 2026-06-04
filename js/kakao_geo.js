/* ===== js/kakao_geo.js ===== */
/* =========================================================================
 *  kakao_geo.js  —  카카오 주소→좌표 변환 + 거리/시간 계산
 *  지도는 Leaflet 유지. 카카오는 '주소를 좌표로 바꾸는' 용도로만 사용.
 *  전역: window.KakaoGeo = { ready, geocode(addr), haversine(...), estimate(...) }
 * ========================================================================= */
(function () {
  "use strict";

  var KG = { ready: false, geocoder: null };
  window.KakaoGeo = KG;

  // 카카오 SDK 로드(autoload=false 이므로 수동 로드)
  function load() {
    if (typeof kakao === "undefined" || !kakao.maps) {
      console.warn("카카오 SDK 미로드(인터넷/도메인 확인)");
      return;
    }
    kakao.maps.load(function () {
      try {
        KG.geocoder = new kakao.maps.services.Geocoder();
        KG.ready = true;
        console.log("카카오 지오코더 준비됨");
      } catch (e) {
        console.error("카카오 지오코더 오류:", e);
      }
    });
  }
  load();

  /* 주소 → {lat, lng} (Promise). 실패 시 reject */
  KG.geocode = function (address) {
    return new Promise(function (resolve, reject) {
      if (!KG.ready || !KG.geocoder) { reject("지오코더 미준비"); return; }
      KG.geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
        } else {
          reject("주소 변환 실패: " + status);
        }
      });
    });
  };

  /* 두 좌표 간 직선거리(km) — 하버사인 */
  KG.haversine = function (lat1, lng1, lat2, lng2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  /* 직선거리 → 어림 소요시간 텍스트
     (도보 4km/h, 자동차 시내 평균 20km/h 가정. 직선거리라 실제보다 짧을 수 있어 1.3배 보정) */
  KG.estimate = function (km) {
    var road = km * 1.3; // 도로 우회 보정
    var walkMin = Math.round(road / 4 * 60);
    var carMin = Math.max(1, Math.round(road / 20 * 60));
    var kmText = km < 1 ? Math.round(km * 1000) + "m" : km.toFixed(1) + "km";
    return { km: km, kmText: kmText, walkMin: walkMin, carMin: carMin };
  };

  /* 방향(8방위) */
  KG.bearing = function (lat1, lng1, lat2, lng2) {
    var dLng = (lng2 - lng1);
    var y = Math.sin(dLng * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    var x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLng * Math.PI / 180);
    var deg = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    var dirs = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
    return dirs[Math.round(deg / 45) % 8];
  };
})();

