/* ===== data/heritage_museums.js ===== */
/* =========================================================================
 *  heritage_museums.js  —  콘텐츠 데이터 2-E(1): 박물관 12곳
 *  - 설명: 교과서 본문 재서술
 *  - officialLink: 실제 검색 확인된 공식 사이트만 사용
 *      · 서울생활사박물관·청계천박물관 → 정확한 분관 URL이 확인되지 않아
 *        운영 주체인 '서울역사박물관' 공식 포털(museum.seoul.go.kr)로 연결
 *        (officialLinkName에 분관 표기). 추정 URL 금지 원칙 적용.
 * ========================================================================= */
(function () {
  "use strict";
  window.HERITAGE_DATA = window.HERITAGE_DATA || [];

  var items = [
    {
      id: "m_jungang", name: "국립중앙박물관", category: "박물관", district: "용산구",
      type: "museum", lat: 37.5238, lng: 126.9803, photoQuery: "국립중앙박물관",
      desc: "우리나라의 역사를 한눈에 볼 수 있는 곳입니다. 구석기 시대부터 현대에 이르기까지의 역사를 배울 수 있는, 우리나라에서 가장 큰 종합 박물관입니다.",
      officialLink: "https://www.museum.go.kr", officialLinkName: "국립중앙박물관 공식 누리집",
      quiz: [
        { q: "국립중앙박물관은 어떤 박물관인가요?", choices: ["우리나라에서 가장 큰 종합 박물관", "비행기 박물관", "한글 박물관", "공예 박물관"], answer: 0 },
        { q: "국립중앙박물관에서 배울 수 있는 시대 범위는?", choices: ["구석기 시대부터 현대까지", "조선 시대만", "삼국 시대만", "고려 시대만"], answer: 0 },
        { q: "국립중앙박물관이 있는 서울의 구는?", choices: ["용산구", "종로구", "강서구", "송파구"], answer: 0 }
      ]
    },
    {
      id: "m_gogung", name: "국립고궁박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5759, lng: 126.9760, photoQuery: "국립고궁박물관",
      desc: "조선 시대와 대한제국기 왕실의 유물을 전시하는 곳입니다. 왕실 사람들이 사용하던 물건과 궁궐 생활의 모습을 볼 수 있습니다.",
      officialLink: "https://www.gogung.go.kr", officialLinkName: "국립고궁박물관 공식 누리집",
      quiz: [
        { q: "국립고궁박물관이 전시하는 것은?", choices: ["왕실의 유물", "비행기", "공룡 화석", "현대 미술"], answer: 0 },
        { q: "국립고궁박물관에서 볼 수 있는 생활 모습은?", choices: ["궁궐 생활", "농촌 생활", "어촌 생활", "산촌 생활"], answer: 0 },
        { q: "국립고궁박물관은 어느 궁궐 가까이에 있나요?", choices: ["경복궁", "창경궁", "덕수궁", "경희궁"], answer: 0 }
      ]
    },
    {
      id: "m_minsok", name: "국립민속박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5816, lng: 126.9790, photoQuery: "국립민속박물관",
      desc: "우리 조상들의 생활 모습을 재현해 놓은 곳입니다. 옛날 사람들이 사용하던 도구와 즐겨 먹던 음식, 생활 문화와 의례, 세시풍속의 모습을 알 수 있습니다.",
      officialLink: "https://www.nfm.go.kr", officialLinkName: "국립민속박물관 공식 누리집",
      quiz: [
        { q: "국립민속박물관은 무엇을 재현해 놓은 곳인가요?", choices: ["조상들의 생활 모습", "우주선 내부", "왕의 무덤", "외국의 풍경"], answer: 0 },
        { q: "국립민속박물관에서 알 수 있는 것이 아닌 것은?", choices: ["최신 스마트폰 기술", "옛날 도구", "세시풍속", "생활 의례"], answer: 0 },
        { q: "세시풍속은 무엇과 관련된 풍속인가요?", choices: ["계절과 명절", "전쟁", "건축", "외교"], answer: 0 }
      ]
    },
    {
      id: "m_history_kr", name: "대한민국역사박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5723, lng: 126.9769, photoQuery: "대한민국역사박물관",
      desc: "우리나라의 최근 130여 년간의 정치, 경제, 사회, 문화의 발전 과정을 연구하고 전시하는 곳입니다.",
      officialLink: "https://www.much.go.kr", officialLinkName: "대한민국역사박물관 공식 누리집",
      quiz: [
        { q: "대한민국역사박물관이 다루는 시기는?", choices: ["최근 130여 년의 근현대", "신석기 시대", "삼국 시대", "고려 시대"], answer: 0 },
        { q: "이 박물관이 전시하는 발전 과정이 아닌 것은?", choices: ["공룡의 진화", "정치", "경제", "문화"], answer: 0 },
        { q: "대한민국역사박물관은 광화문 근처 어느 구에 있나요?", choices: ["종로구", "강남구", "노원구", "강동구"], answer: 0 }
      ]
    },
    {
      id: "m_aviation", name: "국립항공박물관", category: "박물관", district: "강서구",
      type: "museum", lat: 37.5575, lng: 126.8085, photoQuery: "국립항공박물관",
      desc: "비행기와 우주선에 대한 전시가 있는 곳입니다. 항공의 역사와 기술을 배울 수 있고, 실제 비행기도 볼 수 있습니다.",
      officialLink: "https://www.aviation.or.kr", officialLinkName: "국립항공박물관 공식 누리집",
      quiz: [
        { q: "국립항공박물관에서 주로 볼 수 있는 것은?", choices: ["비행기와 우주선", "왕실 유물", "전통 공예품", "신석기 토기"], answer: 0 },
        { q: "국립항공박물관에서 배울 수 있는 것은?", choices: ["항공의 역사와 기술", "한글의 원리", "왕릉의 구조", "성곽 쌓는 법"], answer: 0 },
        { q: "국립항공박물관이 있는, 김포공항이 위치한 구는?", choices: ["강서구", "종로구", "용산구", "성동구"], answer: 0 }
      ]
    },
    {
      id: "m_hangeul", name: "국립한글박물관", category: "박물관", district: "용산구",
      type: "museum", lat: 37.5202, lng: 126.9806, photoQuery: "국립한글박물관",
      desc: "한글의 역사와 가치를 배우는 곳입니다. 다양한 체험활동을 통해 한글을 재미있게 익힐 수 있고, 한글 놀이터에서 한글의 과학성을 직접 체험할 수 있습니다.",
      officialLink: "https://www.hangeul.go.kr", officialLinkName: "국립한글박물관 공식 누리집",
      quiz: [
        { q: "국립한글박물관에서 배우는 것은?", choices: ["한글의 역사와 가치", "비행기 기술", "왕실 유물", "공룡 화석"], answer: 0 },
        { q: "한글 놀이터에서 직접 체험할 수 있는 것은?", choices: ["한글의 과학성", "비행 훈련", "토성 쌓기", "왕릉 답사"], answer: 0 },
        { q: "국립한글박물관은 국립중앙박물관과 같은 어느 구에 있나요?", choices: ["용산구", "강서구", "송파구", "노원구"], answer: 0 }
      ]
    },
    {
      id: "m_baekje", name: "한성백제박물관", category: "박물관", district: "송파구",
      type: "museum", lat: 37.5170, lng: 127.1190, photoQuery: "한성백제박물관",
      desc: "백제 시대의 역사를 배우는 곳입니다. 그 시대에 토성을 쌓는 방법과 토성을 쌓는 사람들을 살펴볼 수 있고, 고대의 역사와 문화를 보여주는 유물을 만날 수 있습니다.",
      officialLink: "https://baekjemuseum.seoul.go.kr", officialLinkName: "한성백제박물관 공식 누리집",
      quiz: [
        { q: "한성백제박물관에서 배우는 시대는?", choices: ["백제 시대", "조선 시대", "고려 시대", "신라 통일기"], answer: 0 },
        { q: "이 박물관에서 살펴볼 수 있는 것은?", choices: ["토성을 쌓는 방법", "비행기 조종", "한글 창제", "궁궐 건축"], answer: 0 },
        { q: "한성백제박물관이 있는, 토성이 남아 있는 구는?", choices: ["송파구", "종로구", "용산구", "강서구"], answer: 0 }
      ]
    },
    {
      id: "m_seoul_history", name: "서울역사박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5705, lng: 126.9707, photoQuery: "서울역사박물관",
      desc: "유서 깊은 서울의 역사와 전통문화를 정리하여 보여주는 곳입니다. 서울 시민과 서울을 방문하는 관광객에게 서울의 문화를 알리고 체험할 기회를 제공하고 있습니다.",
      officialLink: "https://museum.seoul.go.kr", officialLinkName: "서울역사박물관 공식 누리집",
      quiz: [
        { q: "서울역사박물관이 정리하여 보여주는 것은?", choices: ["서울의 역사와 전통문화", "비행기의 역사", "공룡의 역사", "우주의 역사"], answer: 0 },
        { q: "서울역사박물관은 누구에게 서울의 문화를 알리나요?", choices: ["시민과 관광객", "군인만", "외국 정상만", "어린이만"], answer: 0 },
        { q: "서울역사박물관은 어느 궁궐 옆에 있나요?", choices: ["경희궁", "창경궁", "덕수궁", "창덕궁"], answer: 0 }
      ]
    },
    {
      id: "m_saenghwalsa", name: "서울생활사박물관", category: "박물관", district: "노원구",
      type: "museum", lat: 37.6550, lng: 127.0660, photoQuery: "서울생활사박물관",
      desc: "서울 시민들의 옛날 생활 모습을 보여주는 곳입니다. 엄마·아빠 또는 할머니·할아버지께서 어린 시절에 사용하시던 다양한 추억의 물건들이 전시되어 있습니다.",
      officialLink: "https://museum.seoul.go.kr", officialLinkName: "서울역사박물관(서울생활사박물관 분관) 공식 누리집",
      quiz: [
        { q: "서울생활사박물관이 보여주는 것은?", choices: ["서울 시민들의 옛날 생활 모습", "왕실의 유물", "비행기", "공룡 화석"], answer: 0 },
        { q: "이곳에 전시된 물건은 주로 누구의 추억의 물건인가요?", choices: ["부모님·조부모님 세대", "외국 왕족", "삼국시대 사람", "신석기 사람"], answer: 0 },
        { q: "서울생활사박물관이 있는 서울의 구는?", choices: ["노원구", "종로구", "강서구", "용산구"], answer: 0 }
      ]
    },
    {
      id: "m_doseong", name: "한양도성박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5713, lng: 127.0080, photoQuery: "한양도성박물관",
      desc: "서울을 지켜온 옛 성곽의 역사를 배우는 곳입니다. 조선 시대부터 현재까지 한양도성의 변화를 알 수 있습니다. 흥인지문 공원에 있어 성곽을 직접 볼 수도 있습니다.",
      officialLink: "https://museum.seoul.go.kr/scwm/NR_index.do", officialLinkName: "한양도성박물관 공식 누리집",
      quiz: [
        { q: "한양도성박물관에서 배우는 것은?", choices: ["옛 성곽(한양도성)의 역사", "비행기의 역사", "한글의 역사", "공예의 역사"], answer: 0 },
        { q: "한양도성박물관은 어느 문 옆 공원에 있나요?", choices: ["흥인지문", "숭례문", "돈의문", "숙정문"], answer: 0 },
        { q: "이 박물관에서 알 수 있는 한양도성의 변화 기간은?", choices: ["조선 시대부터 현재까지", "신석기부터 삼국시대까지", "고려 시대만", "최근 10년만"], answer: 0 }
      ]
    },
    {
      id: "m_cheonggyecheon", name: "청계천박물관", category: "박물관", district: "성동구",
      type: "museum", lat: 37.5630, lng: 127.0360, photoQuery: "청계천박물관",
      desc: "서울 도시하천의 역사를 살펴보고, 서울의 경관이 변화된 역사를 알 수 있는 곳입니다.",
      officialLink: "https://museum.seoul.go.kr", officialLinkName: "서울역사박물관(청계천박물관 분관) 공식 누리집",
      quiz: [
        { q: "청계천박물관에서 살펴보는 것은?", choices: ["서울 도시하천의 역사", "비행기의 역사", "왕릉의 구조", "한글의 원리"], answer: 0 },
        { q: "청계천박물관을 통해 알 수 있는 것은?", choices: ["서울 경관이 변화된 역사", "외국의 역사", "우주의 역사", "공룡의 역사"], answer: 0 },
        { q: "청계천은 무엇인가요?", choices: ["서울을 흐르는 도시하천", "산", "바다", "섬"], answer: 0 }
      ]
    },
    {
      id: "m_craft", name: "서울공예박물관", category: "박물관", district: "종로구",
      type: "museum", lat: 37.5765, lng: 126.9850, photoQuery: "서울공예박물관",
      desc: "전통부터 현대까지 다양한 시대와 분야를 아우르는 공예품과 공예 자료를 수집·전시하고 있습니다. 한국의 전통 솜씨와 문화를 알 수 있습니다.",
      officialLink: "https://craftmuseum.seoul.go.kr", officialLinkName: "서울공예박물관 공식 누리집",
      quiz: [
        { q: "서울공예박물관이 수집·전시하는 것은?", choices: ["공예품과 공예 자료", "비행기", "왕릉 유물", "공룡 화석"], answer: 0 },
        { q: "서울공예박물관이 아우르는 시대 범위는?", choices: ["전통부터 현대까지", "조선 시대만", "삼국 시대만", "미래만"], answer: 0 },
        { q: "서울공예박물관을 통해 알 수 있는 것은?", choices: ["한국의 전통 솜씨와 문화", "외국의 항공 기술", "우주 탐사", "해양 생물"], answer: 0 }
      ]
    }
  ];

  items.forEach(function (it) { window.HERITAGE_DATA.push(it); });
})();

