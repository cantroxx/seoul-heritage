/* ===== data/heritage_walls_tombs.js ===== */
/* =========================================================================
 *  heritage_walls_tombs.js  —  콘텐츠 데이터 2-B: 성곽·대문 / 왕릉 / 종묘
 *  - 설명: 교과서 본문 + 국가유산포털 공식 정보 기반(재서술)
 *  - officialLink: 실제 검색 확인된 공식 페이지만 사용
 *      · 왕릉/종묘/한양도성 → 국가유산포털 상세(ccbaCpno 확인)
 *      · 대문 4개 → 한양도성 공식 사이트(서울시 운영, 4대문 관할)
 *  - 왕릉은 국가지정 공식 명칭(선릉과 정릉 등) 기준으로 묶음
 * ========================================================================= */
(function () {
  "use strict";
  window.HERITAGE_DATA = window.HERITAGE_DATA || [];

  var HER = "https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=";
  var WALL = "https://seoulcitywall.seoul.go.kr";

  var items = [
    /* ---------------- 성곽 · 대문 ---------------- */
    {
      id: "hanyangdoseong", name: "한양도성", category: "성곽·대문", district: "종로구",
      type: "site", lat: 37.5760, lng: 127.0090, photoQuery: "한양도성 성곽",
      desc: "조선을 세운 태조 이성계가 수도 한양을 방어하기 위해 쌓은 성곽입니다. 동서남북에 4개의 큰 문과 그 사이에 4개의 작은 문을 두었습니다.",
      officialLink: HER + "1331100100000", officialLinkName: "국가유산포털 – 서울 한양도성",
      quiz: [
        { q: "한양도성을 쌓게 한 임금은 누구인가요?", choices: ["태조 이성계", "세종대왕", "고종", "광해군"], answer: 0 },
        { q: "한양도성을 쌓은 가장 큰 까닭은?", choices: ["수도 한양을 방어하기 위해", "농사를 짓기 위해", "시장을 열기 위해", "물을 가두기 위해"], answer: 0 },
        { q: "한양도성에는 큰 문이 몇 개 있었나요?", choices: ["4개", "1개", "8개", "12개"], answer: 0 }
      ]
    },
    {
      id: "sungnyemun", name: "숭례문", category: "성곽·대문", district: "중구",
      type: "site", lat: 37.5600, lng: 126.9753, photoQuery: "숭례문 남대문",
      desc: "한양도성의 정문으로 남쪽에 있어서 남대문이라고도 불렸습니다. 우리나라 국보로 지정되어 있습니다.",
      officialLink: WALL, officialLinkName: "한양도성 공식 누리집",
      quiz: [
        { q: "숭례문을 다르게 부르는 이름은?", choices: ["남대문", "동대문", "북대문", "서대문"], answer: 0 },
        { q: "숭례문은 한양도성의 어느 쪽 문인가요?", choices: ["남쪽", "북쪽", "동쪽", "서쪽"], answer: 0 },
        { q: "숭례문은 무엇으로 지정되어 있나요?", choices: ["국보", "천연기념물", "사적 해제", "무형유산"], answer: 0 }
      ]
    },
    {
      id: "heunginjimun", name: "흥인지문", category: "성곽·대문", district: "종로구",
      type: "site", lat: 37.5713, lng: 127.0094, photoQuery: "흥인지문 동대문",
      desc: "한양도성의 동대문으로, 적을 공격하고 방어할 수 있는 시설(옹성)이 둘러싸고 있습니다.",
      officialLink: WALL, officialLinkName: "한양도성 공식 누리집",
      quiz: [
        { q: "흥인지문은 한양도성의 어느 쪽 문인가요?", choices: ["동쪽", "서쪽", "남쪽", "북쪽"], answer: 0 },
        { q: "흥인지문을 둘러싸 적을 막을 수 있게 한 시설의 이름은?", choices: ["옹성", "연못", "다리", "탑"], answer: 0 },
        { q: "흥인지문을 다르게 부르는 이름은?", choices: ["동대문", "남대문", "북대문", "서대문"], answer: 0 }
      ]
    },
    {
      id: "sukjeongmun", name: "숙정문", category: "성곽·대문", district: "종로구",
      type: "site", lat: 37.5963, lng: 126.9817, photoQuery: "숙정문 북대문",
      desc: "한양도성의 북대문으로, 외진 곳에 있어서 사람의 왕래가 거의 없는 문이었습니다.",
      officialLink: WALL, officialLinkName: "한양도성 공식 누리집",
      quiz: [
        { q: "숙정문은 한양도성의 어느 쪽 문인가요?", choices: ["북쪽", "남쪽", "동쪽", "서쪽"], answer: 0 },
        { q: "숙정문에 사람의 왕래가 거의 없었던 까닭은?", choices: ["외진 곳에 있어서", "물에 잠겨서", "너무 작아서", "임금만 다녀서"], answer: 0 },
        { q: "숙정문은 한양도성의 무엇에 해당하나요?", choices: ["4대문 중 하나", "작은 문(소문)", "궁궐 건물", "왕릉"], answer: 0 }
      ]
    },
    {
      id: "donuimun", name: "돈의문", category: "성곽·대문", district: "종로구",
      type: "site", lat: 37.5700, lng: 126.9680, photoQuery: "돈의문 터",
      desc: "한양도성의 서대문으로, 일제 강점기 때 철거되어 현재는 남아 있지 않습니다(터만 남아 있음).",
      officialLink: WALL, officialLinkName: "한양도성 공식 누리집",
      quiz: [
        { q: "돈의문은 한양도성의 어느 쪽 문인가요?", choices: ["서쪽", "동쪽", "남쪽", "북쪽"], answer: 0 },
        { q: "돈의문이 현재 남아 있지 않은 까닭은?", choices: ["일제 강점기 때 철거되어서", "지진으로 무너져서", "다른 곳으로 옮겨서", "불에 타서"], answer: 0 },
        { q: "돈의문을 다르게 부르는 이름은?", choices: ["서대문", "남대문", "동대문", "북대문"], answer: 0 }
      ]
    },

    /* ---------------- 왕릉 ---------------- */
    {
      id: "seonjeongneung", name: "선릉과 정릉(선정릉)", category: "왕릉", district: "강남구",
      type: "site", lat: 37.5092, lng: 127.0488, photoQuery: "서울 선정릉",
      desc: "성종과 정현왕후를 모신 선릉, 중종을 모신 정릉이 함께 있는 조선 왕릉입니다. 도심 한가운데 자리하며 유네스코 세계유산에 등재되어 있습니다.",
      officialLink: HER + "1331101990000", officialLinkName: "국가유산포털 – 서울 선릉과 정릉",
      quiz: [
        { q: "선정릉은 무엇인가요?", choices: ["조선 왕과 왕비의 무덤(왕릉)", "궁궐", "성문", "절"], answer: 0 },
        { q: "조선 왕릉은 무엇으로 등재되어 있나요?", choices: ["유네스코 세계유산", "천연기념물", "국보", "무형유산"], answer: 0 },
        { q: "선릉에 모셔진 임금은 누구인가요?", choices: ["성종", "태조", "세종", "고종"], answer: 0 }
      ]
    },
    {
      id: "taegangneung", name: "태릉과 강릉", category: "왕릉", district: "노원구",
      type: "site", lat: 37.6177, lng: 127.0855, photoQuery: "서울 태릉",
      desc: "중종의 비 문정왕후를 모신 태릉과, 명종과 인순왕후를 모신 강릉이 있는 조선 왕릉입니다.",
      officialLink: HER + "1331102010000", officialLinkName: "국가유산포털 – 서울 태릉과 강릉",
      quiz: [
        { q: "태릉에 모셔진 인물은 누구인가요?", choices: ["문정왕후", "신덕왕후", "원경왕후", "정현왕후"], answer: 0 },
        { q: "강릉에 모셔진 임금은 누구인가요?", choices: ["명종", "성종", "태종", "순조"], answer: 0 },
        { q: "왕릉은 왕과 누구의 무덤인가요?", choices: ["왕과 왕비", "신하", "백성", "장군"], answer: 0 }
      ]
    },
    {
      id: "heoninneung", name: "헌릉과 인릉(헌인릉)", category: "왕릉", district: "서초구",
      type: "site", lat: 37.4658, lng: 127.0890, photoQuery: "서울 헌인릉",
      desc: "태종과 원경왕후를 모신 헌릉, 순조와 순원왕후를 모신 인릉이 있는 조선 왕릉입니다.",
      officialLink: HER + "1331101940000", officialLinkName: "국가유산포털 – 서울 헌릉과 인릉",
      quiz: [
        { q: "헌릉에 모셔진 임금은 누구인가요?", choices: ["태종", "명종", "순조", "성종"], answer: 0 },
        { q: "인릉에 모셔진 임금은 누구인가요?", choices: ["순조", "태조", "중종", "경종"], answer: 0 },
        { q: "헌인릉은 무엇인가요?", choices: ["조선 왕릉", "궁궐", "성문", "박물관"], answer: 0 }
      ]
    },
    {
      id: "jeongneung_sd", name: "정릉(신덕왕후)", category: "왕릉", district: "성북구",
      type: "site", lat: 37.6089, lng: 127.0153, photoQuery: "서울 정릉 신덕왕후",
      desc: "조선을 세운 태조의 비, 신덕왕후를 모신 능입니다.",
      officialLink: HER + "1331102080000", officialLinkName: "국가유산포털 – 서울 정릉",
      quiz: [
        { q: "정릉에 모셔진 인물은 누구인가요?", choices: ["신덕왕후", "문정왕후", "정현왕후", "선의왕후"], answer: 0 },
        { q: "신덕왕후는 어느 임금의 왕비인가요?", choices: ["태조", "세종", "성종", "명종"], answer: 0 },
        { q: "정릉은 무엇에 해당하나요?", choices: ["왕릉", "궁궐", "성문", "사당"], answer: 0 }
      ]
    },
    {
      id: "uireung", name: "의릉", category: "왕릉", district: "성북구",
      type: "site", lat: 37.5928, lng: 127.0586, photoQuery: "서울 의릉",
      desc: "조선 제20대 임금 경종과 그의 비 선의왕후를 모신 능입니다.",
      officialLink: HER + "1331102040000", officialLinkName: "국가유산포털 – 서울 의릉",
      quiz: [
        { q: "의릉에 모셔진 임금은 누구인가요?", choices: ["경종", "태조", "성종", "명종"], answer: 0 },
        { q: "경종과 함께 의릉에 모셔진 왕비는?", choices: ["선의왕후", "신덕왕후", "원경왕후", "정현왕후"], answer: 0 },
        { q: "의릉은 무엇인가요?", choices: ["조선 왕릉", "궁궐", "박물관", "성문"], answer: 0 }
      ]
    },

    /* ---------------- 종묘 ---------------- */
    {
      id: "jongmyo", name: "종묘", category: "종묘", district: "종로구",
      type: "site", lat: 37.5745, lng: 126.9941, photoQuery: "종묘 정전",
      desc: "조선 시대 왕과 왕비에게 제사를 올리던 곳으로, 신주를 모신 사당입니다. 유네스코 세계유산에 등재되어 있습니다.",
      officialLink: HER + "1331101250000", officialLinkName: "국가유산포털 – 종묘",
      quiz: [
        { q: "종묘는 어떤 곳인가요?", choices: ["왕과 왕비에게 제사를 올리던 사당", "임금이 살던 궁궐", "성을 지키던 문", "책을 보관하던 곳"], answer: 0 },
        { q: "종묘에 모시는 것은 무엇인가요?", choices: ["왕과 왕비의 신주", "곡식", "무기", "그림"], answer: 0 },
        { q: "종묘는 무엇으로 등재되어 있나요?", choices: ["유네스코 세계유산", "천연기념물", "국보 해제", "무형유산"], answer: 0 }
      ]
    }
  ];

  items.forEach(function (it) { window.HERITAGE_DATA.push(it); });
})();

