/* ===== data/fix_links.js ===== */
/* =========================================================================
 *  fix_links.js  —  공식 링크 교체(3순위)
 *  '실제 검색으로 확인된' 정확한 공식 링크만 덮어씀.
 *  - 대부분의 heritage.go.kr culSelectDetail 링크는 유효하여 그대로 둠.
 *  - 메인/중복/부정확 링크만 교체.
 * ========================================================================= */
(function () {
  "use strict";
  var DATA = window.HERITAGE_DATA || [];
  function fix(id, link, name) {
    for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) {
      DATA[i].officialLink = link;
      if (name) DATA[i].officialLinkName = name;
      return;
    }
  }

  // 탑골공원: 메인 → 사적 제354호 상세 페이지
  fix("ind_tapgol",
    "https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=1331103540000",
    "국가유산포털 – 서울 탑골공원(사적)");

  // 동의보감: 겸재미술관과 겹치던 강서구 링크 → 허준박물관 공식 누리집
  fix("donguibogam",
    "http://www.heojun.seoul.kr/",
    "구립 허준박물관 공식 누리집");

  // 빗살무늬토기: museum.go.kr 메인 → e뮤지엄(국립박물관 소장품 검색) 대표
  fix("bitsalmunui",
    "https://www.emuseum.go.kr/",
    "e뮤지엄(국립박물관 소장품)");

  console.log("공식 링크 교체 완료");
})();

