/* ===== data/heritage_palaces.js ===== */
/* =========================================================================
 *  heritage_palaces.js  —  콘텐츠 데이터 2-A: 궁궐
 *  - 설명: 교과서 본문 + 국가유산포털/궁능유적본부 공식 정보 기반(재서술)
 *  - officialLink: 실제 검색으로 확인된 공식 페이지만 사용(추정 링크 없음)
 *  - buildings[].relX/relY: 6단계(궁궐 내부 도식)에서 채울 0~1 상대좌표 자리
 *  - photoQuery: 이미지 단계에서 실제 사진으로 치환할 검색어
 *  전역 배열 window.HERITAGE_DATA 에 push
 * ========================================================================= */
(function () {
  "use strict";
  window.HERITAGE_DATA = window.HERITAGE_DATA || [];

  var palaces = [
    {
      id: "gyeongbokgung",
      name: "경복궁",
      category: "궁궐",
      district: "종로구",
      type: "palace",
      lat: 37.5796, lng: 126.9770,
      photoQuery: "경복궁 근정전",
      desc: "조선시대 으뜸이 되는 궁궐로, '조선이 큰 복을 누려 번영할 것'이라는 뜻을 담고 있습니다. 1395년에 처음 세워졌으나 임진왜란 때 불타 사라졌다가 조선 말에 다시 지어졌습니다.",
      officialLink: "https://www.heritage.go.kr/heri/html/HtmlPage.do?pg=/palaces/palacesRoyalInfo.jsp",
      officialLinkName: "국가유산포털 – 경복궁 소개",
      buildings: [
        { name: "광화문", desc: "경복궁의 정문이자 남문입니다.", photoQuery: "경복궁 광화문", relX: 0.50, relY: 0.92 },
        { name: "근정전", desc: "경복궁에서 중심이 되는 건물로, 나라의 중요한 행사를 치르던 곳입니다.", photoQuery: "경복궁 근정전", relX: 0.5, relY: 0.66 },
        { name: "사정전", desc: "왕이 신하들과 더불어 나랏일을 이야기하고 백성을 위해 일하던 곳입니다.", photoQuery: "경복궁 사정전", relX: 0.5, relY: 0.48 },
        { name: "강녕전", desc: "왕이 독서를 하고 휴식을 취하던 생활 공간입니다.", photoQuery: "경복궁 강녕전", relX: 0.5, relY: 0.32 },
        { name: "교태전", desc: "왕비가 휴식을 취하던 생활 공간입니다.", photoQuery: "경복궁 교태전", relX: 0.5, relY: 0.16 },
        { name: "경회루", desc: "왕과 신하들이 연회를 베풀거나 외국 사신을 만나던 곳으로, 인공 연못 가운데 지어진 누각입니다.", photoQuery: "경복궁 경회루", relX: 0.24, relY: 0.42 }
      ],
      quiz: [
        { q: "경복궁이라는 이름에는 어떤 뜻이 담겨 있나요?", choices: ["조선이 큰 복을 누려 번영할 것", "전쟁에서 이기기를 바람", "오래 살기를 바람", "비가 많이 오기를 바람"], answer: 0 },
        { q: "경복궁이 불타 사라진 사건은 무엇인가요?", choices: ["임진왜란", "병자호란", "6·25 전쟁", "갑오개혁"], answer: 0 },
        { q: "경복궁에서 나라의 중요한 행사를 치르던 중심 건물은?", choices: ["근정전", "경회루", "광화문", "교태전"], answer: 0 }
      ]
    },
    {
      id: "changdeokgung",
      name: "창덕궁",
      category: "궁궐",
      district: "종로구",
      type: "palace",
      lat: 37.5794, lng: 126.9910,
      photoQuery: "창덕궁 인정전",
      desc: "1405년에 경복궁의 보조 궁궐로 지어졌다가 후에 조선을 대표하는 궁궐의 역할을 했습니다. 주변 자연환경과 조화가 잘 이루어져 유네스코 세계유산에 등재되었습니다.",
      officialLink: "https://royal.khs.go.kr/ROYAL/contents/menuInfo-gbg.do?grpCode=cdg",
      officialLinkName: "궁능유적본부 – 창덕궁",
      buildings: [
        { name: "인정전", desc: "창덕궁의 정전으로, '어진 정치를 펼치겠다'는 뜻을 담고 있습니다.", photoQuery: "창덕궁 인정전", relX: 0.42, relY: 0.62 },
        { name: "후원", desc: "우리나라를 대표하는 아름다운 궁궐 정원입니다.", photoQuery: "창덕궁 후원", relX: 0.6, relY: 0.2 }
      ],
      quiz: [
        { q: "창덕궁은 처음에 어떤 궁궐로 지어졌나요?", choices: ["경복궁의 보조 궁궐", "왕릉", "관청", "절"], answer: 0 },
        { q: "창덕궁이 유네스코 세계유산에 등재된 까닭으로 알맞은 것은?", choices: ["주변 자연환경과 조화가 잘 이루어져서", "가장 높은 건물이어서", "가장 최근에 지어져서", "바다에 가까워서"], answer: 0 },
        { q: "'어진 정치를 펼치겠다'는 뜻을 담은 창덕궁의 정전은?", choices: ["인정전", "근정전", "명정전", "숭정전"], answer: 0 }
      ]
    },
    {
      id: "changgyeonggung",
      name: "창경궁",
      category: "궁궐",
      district: "종로구",
      type: "palace",
      lat: 37.5789, lng: 126.9947,
      photoQuery: "창경궁 명정전",
      desc: "조선 성종이 세 분의 대비(왕의 어머니)를 위해 지은 궁궐입니다. 일제강점기 때 공원으로 만들어지는 등 많이 훼손되었으나, 지금은 예전의 모습으로 복원되었습니다.",
      officialLink: "https://www.heritage.go.kr/heri/html/HtmlPage.do?pg=/palaces/palacesCggInfo.jsp",
      officialLinkName: "국가유산포털 – 창경궁 소개",
      buildings: [
        { name: "명정전", desc: "창경궁의 정전으로, 현재 남아 있는 궁궐의 정전 중 가장 오래된 건물입니다.", photoQuery: "창경궁 명정전", relX: 0.50, relY: 0.55 }
      ],
      quiz: [
        { q: "창경궁은 누구를 위해 지은 궁궐인가요?", choices: ["세 분의 대비(왕의 어머니)", "외국 사신", "장군들", "신하들"], answer: 0 },
        { q: "창경궁이 크게 훼손된 시기는 언제인가요?", choices: ["일제강점기", "삼국시대", "고려 초기", "신석기 시대"], answer: 0 },
        { q: "현재 남아 있는 궁궐의 정전 중 가장 오래된 건물은?", choices: ["창경궁 명정전", "경복궁 근정전", "덕수궁 중화전", "경희궁 숭정전"], answer: 0 }
      ]
    },
    {
      id: "deoksugung",
      name: "덕수궁",
      category: "궁궐",
      district: "중구",
      type: "palace",
      lat: 37.5658, lng: 126.9751,
      photoQuery: "덕수궁 석조전",
      desc: "처음부터 궁궐로 지어진 것은 아니지만 임진왜란 때 경복궁과 창덕궁 등이 불타면서 정식 궁궐이 되었습니다. 처음 이름은 경운궁이었으나 나중에 덕수궁으로 바뀌었고, 고종황제와 그 가족이 생활하던 곳으로 조선 말기와 대한제국의 역사가 담겨 있습니다.",
      officialLink: "https://royal.khs.go.kr/ROYAL/contents/menuInfo-gbg.do?grpCode=dsg",
      officialLinkName: "궁능유적본부 – 덕수궁",
      buildings: [
        { name: "석조전", desc: "전통 건축물과 서양식 건축물이 조화를 이루는 덕수궁의 서양식 건물입니다.", photoQuery: "덕수궁 석조전", relX: 0.68, relY: 0.40 },
        { name: "중화전", desc: "덕수궁의 정전입니다.", photoQuery: "덕수궁 중화전", relX: 0.42, relY: 0.55 }
      ],
      quiz: [
        { q: "덕수궁의 처음 이름은 무엇이었나요?", choices: ["경운궁", "경덕궁", "수강궁", "창덕궁"], answer: 0 },
        { q: "덕수궁에서 생활하며 대한제국을 세운 인물은?", choices: ["고종황제", "세종대왕", "이순신", "정도전"], answer: 0 },
        { q: "덕수궁에서 서양식 건축의 모습을 볼 수 있는 건물은?", choices: ["석조전", "근정전", "인정전", "명정전"], answer: 0 }
      ]
    },
    {
      id: "gyeonghuigung",
      name: "경희궁",
      category: "궁궐",
      district: "종로구",
      type: "palace",
      lat: 37.5716, lng: 126.9690,
      photoQuery: "경희궁 숭정전",
      desc: "1623년 지어질 당시에는 경덕궁이라 불렸으나, 훗날 지금의 이름으로 바뀌었습니다. 임진왜란 이후 창덕궁과 더불어 주요 궁궐로 사용되었습니다.",
      officialLink: "https://www.heritage.go.kr/heri/html/HtmlPage.do?pg=/palaces/palacesHistory.jsp",
      officialLinkName: "국가유산포털 – 궁궐의 역사(경희궁)",
      buildings: [
        { name: "숭정전", desc: "경희궁의 정전입니다.", photoQuery: "경희궁 숭정전", relX: 0.50, relY: 0.55 }
      ],
      quiz: [
        { q: "경희궁이 지어질 당시의 이름은 무엇이었나요?", choices: ["경덕궁", "경운궁", "수강궁", "경복궁"], answer: 0 },
        { q: "경희궁은 임진왜란 이후 어떤 궁궐과 더불어 주요 궁궐로 쓰였나요?", choices: ["창덕궁", "수원화성", "남한산성", "북한산성"], answer: 0 },
        { q: "경희궁의 정전은 무엇인가요?", choices: ["숭정전", "근정전", "인정전", "중화전"], answer: 0 }
      ]
    }
  ];

  palaces.forEach(function (p) { window.HERITAGE_DATA.push(p); });
})();

