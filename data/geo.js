/* ===== data/geo.js ===== */
/* =========================================================================
 *  geo.js  —  지도 데이터 계층 (1단계)
 *  - 서울 25개 자치구 경계: 공개 GeoJSON에서 실행 시 1회 자동 로딩
 *    (출처: github.com/southkorea/seoul-maps, KOSTAT 2013 센서스 경계)
 *  - 한강 경로: 오프라인 내장(스타일용 근사 폴리라인 — 교과서 톤 표현용)
 *  - 25개 구 중심좌표 / 한글명 목록
 *  전역: window.SEOUL_GEO
 * ========================================================================= */
(function () {
  "use strict";

  // 구 경계 GeoJSON 1차/예비 주소 (브라우저에서 직접 fetch)
  var DISTRICT_GEOJSON_URLS = [
    "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json",
    "https://cdn.jsdelivr.net/gh/southkorea/seoul-maps@master/kostat/2013/json/seoul_municipalities_geo_simple.json"
  ];

  // 25개 자치구: 한글명 + 근사 중심좌표(lat, lng) — 라벨/뱃지/예비 줌용
  var DISTRICTS = [
    { name: "종로구",   lat: 37.5730, lng: 126.9790 },
    { name: "중구",     lat: 37.5636, lng: 126.9976 },
    { name: "용산구",   lat: 37.5326, lng: 126.9905 },
    { name: "성동구",   lat: 37.5634, lng: 127.0369 },
    { name: "광진구",   lat: 37.5385, lng: 127.0823 },  // ← '우리지역'
    { name: "동대문구", lat: 37.5744, lng: 127.0396 },
    { name: "중랑구",   lat: 37.6063, lng: 127.0925 },
    { name: "성북구",   lat: 37.5894, lng: 127.0167 },
    { name: "강북구",   lat: 37.6396, lng: 127.0257 },
    { name: "도봉구",   lat: 37.6688, lng: 127.0471 },
    { name: "노원구",   lat: 37.6542, lng: 127.0568 },
    { name: "은평구",   lat: 37.6027, lng: 126.9291 },
    { name: "서대문구", lat: 37.5791, lng: 126.9368 },
    { name: "마포구",   lat: 37.5663, lng: 126.9019 },
    { name: "양천구",   lat: 37.5170, lng: 126.8664 },
    { name: "강서구",   lat: 37.5510, lng: 126.8495 },
    { name: "구로구",   lat: 37.4954, lng: 126.8874 },
    { name: "금천구",   lat: 37.4569, lng: 126.8956 },
    { name: "영등포구", lat: 37.5264, lng: 126.8963 },
    { name: "동작구",   lat: 37.5124, lng: 126.9393 },
    { name: "관악구",   lat: 37.4784, lng: 126.9516 },
    { name: "서초구",   lat: 37.4837, lng: 127.0324 },
    { name: "강남구",   lat: 37.5172, lng: 127.0473 },
    { name: "송파구",   lat: 37.5145, lng: 127.1059 },
    { name: "강동구",   lat: 37.5301, lng: 127.1238 }
  ];

  var HOME_DISTRICT = "광진구"; // '우리지역' 표시 대상

  // 한강 경로 (서→동, [lng, lat]). 도로지도가 아니므로 강을 직접 그려 교과서 톤을 냄.
  // 정밀 측량값이 아니라 한강 흐름을 따른 근사 표현용 라인입니다.
  var HAN_RIVER = {
    type: "Feature",
    properties: { name: "한강" },
    geometry: {
      type: "LineString",
      coordinates: [
        [126.7900, 37.5840], [126.8200, 37.5790], [126.8500, 37.5720],
        [126.8800, 37.5660], [126.9050, 37.5560], [126.9200, 37.5380],
        [126.9350, 37.5280], [126.9550, 37.5210], [126.9720, 37.5165],
        [126.9920, 37.5170], [127.0120, 37.5210], [127.0350, 37.5235],
        [127.0600, 37.5255], [127.0820, 37.5255], [127.1010, 37.5300],
        [127.1200, 37.5450], [127.1380, 37.5600], [127.1520, 37.5720]
      ]
    }
  };

  // 서울 전체 보기 기준 영역 (Leaflet fitBounds 용) [ [south,west],[north,east] ]
  var SEOUL_BOUNDS = [[37.42, 126.76], [37.70, 127.19]];

  /* 구 경계 GeoJSON 로더: 내장 데이터 우선, 없으면 네트워크 폴백 */
  function loadDistrictGeoJSON() {
    // 1순위: 파일에 내장된 데이터(오프라인 동작)
    if (window.SEOUL_DISTRICTS_GEOJSON) {
      return Promise.resolve(window.SEOUL_DISTRICTS_GEOJSON);
    }
    // 2순위: 네트워크(내장 데이터가 없을 때만)
    var i = 0;
    function tryNext() {
      if (i >= DISTRICT_GEOJSON_URLS.length) {
        return Promise.reject(new Error("구 경계 데이터를 불러오지 못했습니다(인터넷 연결 확인)."));
      }
      var url = DISTRICT_GEOJSON_URLS[i++];
      return fetch(url)
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .catch(function () { return tryNext(); });
    }
    return tryNext();
  }

  window.SEOUL_GEO = {
    DISTRICTS: DISTRICTS,
    HOME_DISTRICT: HOME_DISTRICT,
    HAN_RIVER: HAN_RIVER,
    SEOUL_BOUNDS: SEOUL_BOUNDS,
    DISTRICT_GEOJSON_URLS: DISTRICT_GEOJSON_URLS,
    loadDistrictGeoJSON: loadDistrictGeoJSON
  };
})();

