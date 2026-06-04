/* ===== data/district_colors.js ===== */
/* =========================================================================
 *  district_colors.js  —  구별 고정 파스텔 색(4순위: 지도 가독성)
 *  교과서 톤 파스텔 팔레트. 인접 구끼리 다른 색이 되도록 손으로 배정.
 *  진행도(사수)는 색이 아니라 테두리/배지로 표시 → 구 구분과 진행도 둘 다 보존.
 *  전역: window.DISTRICT_COLORS[구이름] = "#hex"
 * ========================================================================= */
(function () {
  "use strict";

  // 교과서 톤 파스텔 7색
  var PAL = {
    rose:   "#F4C9C0",
    peach:  "#F8DCB0",
    lemon:  "#F1E6A6",
    mint:   "#C3E3C4",
    sky:    "#BFE0EC",
    lilac:  "#D8CBE9",
    sand:   "#E7D6BE"
  };

  // 인접 구 색 충돌을 피해 손으로 배정
  var MAP = {
    "도봉구": PAL.rose,   "노원구": PAL.mint,
    "강북구": PAL.peach,  "중랑구": PAL.sky,
    "성북구": PAL.lemon,  "은평구": PAL.sky,
    "종로구": PAL.mint,   "동대문구": PAL.rose,
    "서대문구": PAL.lilac,"중구": PAL.peach,    "성동구": PAL.lemon,
    "광진구": PAL.rose,   "마포구": PAL.rose,
    "용산구": PAL.sky,    "강동구": PAL.mint,
    "강서구": PAL.lemon,  "양천구": PAL.sky,    "구로구": PAL.peach,
    "영등포구": PAL.lilac,"동작구": PAL.mint,   "금천구": PAL.mint,
    "관악구": PAL.peach,  "서초구": PAL.sky,    "강남구": PAL.lemon,
    "송파구": PAL.peach
  };

  window.DISTRICT_COLORS = MAP;
  window.DISTRICT_PALETTE = PAL;
})();

