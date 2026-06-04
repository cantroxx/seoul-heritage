/* ===== data/categories.js ===== */
/* =========================================================================
 *  categories.js  —  카테고리별 색 + 아이콘(이모지) 정의
 *  드릴다운 마커의 '종류 표시'에 사용. 회색 별 아래 둥근 배지로 표시.
 *  전역: window.CATEGORY_STYLE[카테고리] = { color, icon, label }
 * ========================================================================= */
(function () {
  "use strict";
  window.CATEGORY_STYLE = {
    "궁궐":            { color: "#C0392B", icon: "🏯", label: "궁궐" },
    "성곽·대문":       { color: "#7F8C8D", icon: "🧱", label: "성곽·대문" },
    "왕릉":            { color: "#27AE60", icon: "⚰️", label: "왕릉" },
    "종묘":            { color: "#8E44AD", icon: "🕯️", label: "종묘" },
    "기록유산":        { color: "#2980B9", icon: "📜", label: "기록유산" },
    "무형유산":        { color: "#E67E22", icon: "🎎", label: "무형유산" },
    "자연유산":        { color: "#16A085", icon: "🌳", label: "자연유산" },
    "시대별 문화유산":  { color: "#B9770E", icon: "🏺", label: "시대별 문화유산" },
    "유적지":          { color: "#7D6608", icon: "🏛️", label: "유적지" },
    "박물관":          { color: "#2C77B8", icon: "🏛️", label: "박물관" },
    "기념관":          { color: "#CB4335", icon: "🗿", label: "기념관" },
    "독립운동 유적지":  { color: "#34495E", icon: "🏴", label: "독립운동 유적지" }
  };
  window.categoryStyle = function (cat) {
    return window.CATEGORY_STYLE[cat] || { color: "#9A9A9A", icon: "📍", label: cat || "" };
  };
})();

