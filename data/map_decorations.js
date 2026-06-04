/* ===== data/map_decorations.js ===== */
/* =========================================================================
 *  map_decorations.js  —  배경 장식 일러스트(교과서 지도풍)
 *  구 곳곳에 산·나무·빌딩·궁궐·구름·랜드마크 이모지를 흩뿌려 생동감 부여.
 *  좌표는 대략치(장식용). 클릭 안 됨(interactive:false).
 *  전역: window.MAP_DECORATIONS = [{lat, lng, emoji, size}]
 * ========================================================================= */
(function () {
  "use strict";

  // size: 'sm'(작게) | 'md' | 'lg'(크게). 라벨 없는 순수 장식.
  window.MAP_DECORATIONS = [
    // ── 산 (서울 외곽·북쪽) ──
    { lat: 37.6700, lng: 127.0150, emoji: "🏔️", size: "lg" },  // 도봉산 일대
    { lat: 37.6450, lng: 127.0400, emoji: "⛰️", size: "md" },  // 수락/불암
    { lat: 37.6550, lng: 126.9650, emoji: "🌲", size: "md" },  // 북한산 자락
    { lat: 37.5980, lng: 126.9350, emoji: "⛰️", size: "md" },  // 인왕산
    { lat: 37.5470, lng: 126.9700, emoji: "🌳", size: "sm" },  // 남산 자락
    { lat: 37.4780, lng: 126.9550, emoji: "⛰️", size: "md" },  // 관악산
    { lat: 37.4650, lng: 127.0850, emoji: "🌲", size: "sm" },  // 대모산
    { lat: 37.6200, lng: 127.0850, emoji: "🌲", size: "sm" },

    // ── 나무·숲 (곳곳) ──
    { lat: 37.5850, lng: 127.0500, emoji: "🌳", size: "sm" },
    { lat: 37.5550, lng: 126.9100, emoji: "🌳", size: "sm" },
    { lat: 37.5050, lng: 126.9650, emoji: "🌲", size: "sm" },
    { lat: 37.5750, lng: 127.0700, emoji: "🌳", size: "sm" },
    { lat: 37.4900, lng: 127.0400, emoji: "🌳", size: "sm" },
    { lat: 37.5300, lng: 127.1000, emoji: "🌲", size: "sm" },

    // ── 궁궐·전통건축 (도심) ──
    { lat: 37.5850, lng: 126.9770, emoji: "🏯", size: "md" },  // 경복궁 위
    { lat: 37.5780, lng: 127.0000, emoji: "⛩️", size: "sm" },  // 종묘 근처
    { lat: 37.5600, lng: 126.9830, emoji: "🏯", size: "sm" },  // 도심

    // ── 빌딩·집 (도심·강남) ──
    { lat: 37.5100, lng: 127.0600, emoji: "🏙️", size: "md" },  // 강남
    { lat: 37.5250, lng: 127.0300, emoji: "🏢", size: "sm" },
    { lat: 37.5300, lng: 126.9250, emoji: "🏢", size: "sm" },  // 여의도
    { lat: 37.5450, lng: 127.0550, emoji: "🏘️", size: "sm" },
    { lat: 37.4950, lng: 126.8950, emoji: "🏘️", size: "sm" },
    { lat: 37.6050, lng: 127.0250, emoji: "🏘️", size: "sm" },

    // ── 랜드마크 (대표) ──
    { lat: 37.5512, lng: 126.9882, emoji: "🗼", size: "lg", label: "남산서울타워" },
    { lat: 37.5125, lng: 127.1025, emoji: "🏗️", size: "lg", label: "롯데타워" },
    { lat: 37.5663, lng: 126.9779, emoji: "🏛️", size: "md", label: "광화문" },
    { lat: 37.5290, lng: 126.9320, emoji: "🏛️", size: "sm", label: "국회" },
    { lat: 37.5202, lng: 127.1212, emoji: "🏟️", size: "md", label: "올림픽공원" },
    { lat: 37.5704, lng: 126.9997, emoji: "🏮", size: "sm", label: "광장시장" },

    // ── 구름·자연물 (하늘 곳곳) ──
    { lat: 37.6400, lng: 126.9100, emoji: "☁️", size: "md" },
    { lat: 37.6300, lng: 127.0700, emoji: "☁️", size: "sm" },
    { lat: 37.5900, lng: 126.8700, emoji: "☁️", size: "md" },
    { lat: 37.4750, lng: 127.0200, emoji: "☁️", size: "sm" },
    { lat: 37.5150, lng: 126.8300, emoji: "☁️", size: "md" },
    { lat: 37.6150, lng: 127.1100, emoji: "☁️", size: "sm" },
    { lat: 37.4700, lng: 126.9000, emoji: "☁️", size: "sm" },

    // ── 강변 자연물 ──
    { lat: 37.5170, lng: 126.9550, emoji: "🌊", size: "sm" },
    { lat: 37.5350, lng: 127.0700, emoji: "⛵", size: "sm" },
    { lat: 37.5250, lng: 126.8800, emoji: "🦆", size: "sm" }
  ];
})();

