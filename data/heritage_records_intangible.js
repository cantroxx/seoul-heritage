/* ===== data/heritage_records_intangible.js ===== */
/* =========================================================================
 *  heritage_records_intangible.js  —  콘텐츠 데이터 2-C: 기록유산 / 무형유산
 *
 *  [규칙 5 적용 - 기록유산] 서울 내 전시·소장 기관이 확인되는 것만 포함:
 *    · 조선왕조실록  → 서울대 규장각한국학연구원 (관악구)
 *    · 훈민정음 해례본 → 간송미술관 (성북구)
 *    · 동의보감       → 구립 허준박물관 (강서구)
 *    · 조선왕조의궤   → 국립중앙박물관 외규장각 의궤실 (용산구)
 *
 *  [규칙 5·12 적용 - 무형유산] 장소가 분명한 공동체 종목만 포함.
 *    칠장·침선장은 '사람이 지닌 기술'이라 고정 위치가 없어 제외(억지 배치 금지).
 *
 *  officialLink: 모두 실제 검색 확인된 공식 페이지(국가유산포털/국사편찬위/
 *    국립중앙박물관/허준박물관 공식)만 사용.
 * ========================================================================= */
(function () {
  "use strict";
  window.HERITAGE_DATA = window.HERITAGE_DATA || [];

  var HER = "https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=";

  var items = [
    /* ---------------- 기록유산 ---------------- */
    {
      id: "sillok", name: "조선왕조실록", category: "기록유산", district: "관악구",
      type: "record", lat: 37.4659, lng: 126.9518, photoQuery: "조선왕조실록",
      holder: "서울대학교 규장각한국학연구원",
      desc: "조선 시대의 역사가 연도와 날짜별로 기록되어 있는 책입니다. 조선 시대의 다양한 역사적 사실이 담겨 있으며, 현재 서울대학교 규장각한국학연구원 등에 보관되어 있습니다.",
      officialLink: "https://sillok.history.go.kr", officialLinkName: "국사편찬위원회 – 조선왕조실록",
      quiz: [
        { q: "조선왕조실록에는 무엇이 기록되어 있나요?", choices: ["조선 시대의 역사", "요리법", "노래 가사", "지도"], answer: 0 },
        { q: "조선왕조실록은 무엇으로 등재되어 있나요?", choices: ["유네스코 세계기록유산", "천연기념물", "무형유산", "사적"], answer: 0 },
        { q: "조선왕조실록이 보관되어 있는 서울의 기관은?", choices: ["서울대학교 규장각", "남산타워", "올림픽공원", "한강공원"], answer: 0 }
      ]
    },
    {
      id: "hunminjeongeum", name: "훈민정음 해례본", category: "기록유산", district: "성북구",
      type: "record", lat: 37.5927, lng: 127.0086, photoQuery: "훈민정음 해례본",
      holder: "간송미술관",
      desc: "조선 세종 때 만들어진 훈민정음(한글)을 집현전 학자들이 해설한 책입니다. 한글의 제작 원리와 사용 방법이 자세히 드러나 있어 한글의 높은 과학성을 알 수 있습니다. 현재 간송미술관(성북구)에 보관되어 있습니다.",
      officialLink: HER + "1111100700000", officialLinkName: "국가유산포털 – 국보 훈민정음",
      quiz: [
        { q: "훈민정음 해례본은 무엇을 해설한 책인가요?", choices: ["훈민정음(한글)", "한자", "그림", "음악"], answer: 0 },
        { q: "훈민정음을 만든 조선의 임금은?", choices: ["세종대왕", "태조", "정조", "고종"], answer: 0 },
        { q: "훈민정음 해례본이 보관된 서울의 미술관은?", choices: ["간송미술관", "국립현대미술관", "리움미술관", "예술의전당"], answer: 0 }
      ]
    },
    {
      id: "donguibogam", name: "동의보감", category: "기록유산", district: "강서구",
      type: "record", lat: 37.5616, lng: 126.8208, photoQuery: "동의보감",
      holder: "허준박물관",
      desc: "조선 시대에 허준이 우리나라와 중국의 의학 서적, 그리고 자신의 의학 경험을 모아 만든 한의학 서적입니다. 병을 예방하는 방법과 치료 방법을 밝혔으며, 후에 일본과 중국에서도 그 가치를 인정받았습니다.",
      officialLink: "https://culture.gangseo.seoul.kr/gsfc/main/contents.do?menuNo=800097", officialLinkName: "강서구 구립 허준박물관",
      quiz: [
        { q: "동의보감을 만든 사람은 누구인가요?", choices: ["허준", "세종", "정약용", "이순신"], answer: 0 },
        { q: "동의보감은 어떤 분야의 책인가요?", choices: ["의학(한의학)", "수학", "음악", "건축"], answer: 0 },
        { q: "동의보감의 가치를 인정해 책을 펴낸 다른 나라는?", choices: ["일본과 중국", "미국과 영국", "프랑스와 독일", "인도와 태국"], answer: 0 }
      ]
    },
    {
      id: "uigwe", name: "조선왕조의궤", category: "기록유산", district: "용산구",
      type: "record", lat: 37.5238, lng: 126.9805, photoQuery: "조선왕조의궤",
      holder: "국립중앙박물관(외규장각 의궤)",
      desc: "조선 왕실과 국가의 중요 행사를 그림 중심으로 기록하고 정리한 기록유산입니다. 왕실의 혼인, 장례, 궁궐 건축 등 중요 행사가 상세히 기록되어 있어 조선 시대 왕실의 격식을 알 수 있습니다. 프랑스에서 돌아온 외규장각 의궤는 국립중앙박물관에서 볼 수 있습니다.",
      officialLink: "https://www.museum.go.kr/uigwe/", officialLinkName: "국립중앙박물관 – 외규장각 의궤",
      quiz: [
        { q: "조선왕조의궤는 무엇을 중심으로 기록했나요?", choices: ["그림", "노래", "숫자", "지도"], answer: 0 },
        { q: "의궤에 기록된 행사가 아닌 것은?", choices: ["야구 경기", "왕실의 혼인", "왕실의 장례", "궁궐 건축"], answer: 0 },
        { q: "외규장각 의궤는 어느 나라에서 돌아왔나요?", choices: ["프랑스", "일본", "미국", "중국"], answer: 0 }
      ]
    },

    /* ---------------- 무형유산 (장소가 분명한 공동체 종목) ---------------- */
    {
      id: "songpa_darbi", name: "송파다리밟기", category: "무형유산", district: "송파구",
      type: "intangible", lat: 37.5045, lng: 127.1140, photoQuery: "송파다리밟기",
      desc: "정월 대보름에 다리를 밟으면 복을 불러들인다는 믿음에서 시작된 민속놀이입니다. 다리를 밟으며 흥겨운 노래와 춤을 함께합니다.",
      officialLink: "https://www.heritage.go.kr/heri/cul/culSelectDetail.do?VdkVgwKey=22,00030000,11", officialLinkName: "국가유산포털 – 서울시 무형유산 송파다리밟기",
      quiz: [
        { q: "송파다리밟기는 언제 하는 놀이인가요?", choices: ["정월 대보름", "추석", "한식", "동지"], answer: 0 },
        { q: "다리를 밟으면 무엇을 불러들인다고 믿었나요?", choices: ["복", "비", "바람", "눈"], answer: 0 },
        { q: "송파다리밟기는 무엇에 해당하나요?", choices: ["무형유산(민속놀이)", "왕릉", "궁궐", "성문"], answer: 0 }
      ]
    },
    {
      id: "bawijeol_hosang", name: "바위절마을 호상놀이", category: "무형유산", district: "강동구",
      type: "intangible", lat: 37.5510, lng: 127.1300, photoQuery: "바위절마을 호상놀이",
      desc: "사람이 죽었을 때 노래를 부르고 발을 맞추는 놀이입니다. 죽은 사람이 좋은 곳으로 가기를 바라는 마음이 담겨 있습니다.",
      officialLink: HER + "2221100100000", officialLinkName: "국가유산포털 – 서울시 무형유산 바위절마을 호상놀이",
      quiz: [
        { q: "바위절마을 호상놀이는 언제 하는 놀이인가요?", choices: ["사람이 죽었을 때(장례)", "결혼할 때", "생일에", "이사할 때"], answer: 0 },
        { q: "이 놀이에 담긴 마음으로 알맞은 것은?", choices: ["죽은 사람이 좋은 곳으로 가기를 바라는 마음", "전쟁에서 이기려는 마음", "농사가 잘되기를 바라는 마음", "비가 오기를 바라는 마음"], answer: 0 },
        { q: "바위절마을 호상놀이가 전해 오는 서울의 지역은?", choices: ["강동", "강서", "도봉", "양천"], answer: 0 }
      ]
    },
    {
      id: "samgaksan_dodang", name: "삼각산 도당제", category: "무형유산", district: "강북구",
      type: "intangible", lat: 37.6550, lng: 127.0100, photoQuery: "삼각산 도당제",
      desc: "삼각산 주변 마을에서 마을의 평화와 풍요를 기원하며 지내는 제사 의식입니다.",
      officialLink: HER + "2221100420000", officialLinkName: "국가유산포털 – 서울시 무형유산 삼각산 도당제",
      quiz: [
        { q: "삼각산 도당제는 무엇을 기원하는 의식인가요?", choices: ["마을의 평화와 풍요", "전쟁의 승리", "임금의 건강", "많은 비"], answer: 0 },
        { q: "삼각산 도당제는 어떤 종류의 행사인가요?", choices: ["마을 제사 의식", "운동 경기", "시장 행사", "왕실 잔치"], answer: 0 },
        { q: "삼각산 도당제는 어디에서 지내나요?", choices: ["삼각산 주변 마을", "궁궐 안", "한강 위", "바닷가"], answer: 0 }
      ]
    },
    {
      id: "jongmyo_jerye", name: "종묘제례·종묘제례악", category: "무형유산", district: "종로구",
      type: "intangible", lat: 37.5740, lng: 126.9960, photoQuery: "종묘제례악",
      desc: "종묘에서 제사를 지내는 의식을 종묘제례라 하고, 이때 춤·악기·노래와 함께 연주되는 음악을 종묘제례악이라고 합니다. 우리나라의 문화적 전통과 특성이 잘 드러나 그 가치를 인정받아 유네스코 무형유산으로 지정되었습니다.",
      officialLink: HER + "1271100560000", officialLinkName: "국가유산포털 – 국가무형유산 종묘제례",
      quiz: [
        { q: "종묘에서 제사를 지내는 의식을 무엇이라 하나요?", choices: ["종묘제례", "종묘제례악", "도당제", "다리밟기"], answer: 0 },
        { q: "제사 때 춤·악기·노래와 함께 연주되는 음악은?", choices: ["종묘제례악", "판소리", "아리랑", "사물놀이"], answer: 0 },
        { q: "종묘제례와 종묘제례악은 무엇으로 지정되었나요?", choices: ["유네스코 무형유산", "국보", "천연기념물", "사적"], answer: 0 }
      ]
    }
  ];

  items.forEach(function (it) { window.HERITAGE_DATA.push(it); });
})();

