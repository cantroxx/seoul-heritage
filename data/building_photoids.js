/* ===== data/building_photoids.js ===== */
/* =========================================================================
 *  building_photoids.js  —  궁궐 건물에 영문 photoId 부여
 *  로컬 이미지 파일명을 영문으로 쓰기 위함(images/{photoId}.jpg).
 *  한글 파일명 인코딩 문제 회피.
 * ========================================================================= */
(function () {
  "use strict";
  var DATA = window.HERITAGE_DATA || [];
  var MAP = {
    "gyeongbokgung": {
      "광화문": "gb_gwanghwamun", "근정전": "gb_geunjeongjeon", "사정전": "gb_sajeongjeon",
      "강녕전": "gb_gangnyeongjeon", "교태전": "gb_gyotaejeon", "경회루": "gb_gyeonghoeru"
    },
    "changdeokgung": { "인정전": "cdg_injeongjeon", "후원": "cdg_huwon" },
    "changgyeonggung": { "명정전": "cgg_myeongjeongjeon" },
    "deoksugung": { "석조전": "dsg_seokjojeon", "중화전": "dsg_junghwajeon" },
    "gyeonghuigung": { "숭정전": "ghg_sungjeongjeon" }
  };
  DATA.forEach(function (p) {
    var m = MAP[p.id];
    if (!m || !p.buildings) return;
    p.buildings.forEach(function (b) {
      if (m[b.name]) b.photoId = m[b.name];
    });
  });
})();

