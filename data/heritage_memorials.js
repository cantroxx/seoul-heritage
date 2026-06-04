/* ===== data/heritage_memorials.js ===== */
/* =========================================================================
 *  heritage_memorials.js  —  콘텐츠 데이터 2-E(2): 기념관 10 / 독립운동 유적지 3
 *  officialLink: 실제 검색 확인된 공식 사이트.
 *    · 백남준기념관 → 서울시 공식 관광 누리집(전용 사이트 부재, 서울시 운영)
 *    · 근현대사기념관 → 운영 주체 강북구 공식 누리집(전용 사이트 미확인)
 *    · 탑골공원 → 국가유산포털(사적 상세 코드 미확인 → 포털 메인)
 *    추정 deep link는 넣지 않음.
 * ========================================================================= */
(function () {
  "use strict";
  window.HERITAGE_DATA = window.HERITAGE_DATA || [];
  var HER = "https://www.heritage.go.kr/heri/cul/culSelectDetail.do?ccbaCpno=";

  var items = [
    /* ---------------- 기념관 ---------------- */
    {
      id: "mm_sejong", name: "세종대왕기념관", category: "기념관", district: "동대문구",
      type: "memorial", lat: 37.5862, lng: 127.0497, photoQuery: "세종대왕기념관",
      desc: "세종대왕의 생애와 업적을 알리고, 한글 창제를 기념하는 공간입니다. 이곳에서는 다양한 전시와 한글 관련 교육 프로그램이 마련되어 있습니다.",
      officialLink: "http://sejongkorea.org", officialLinkName: "세종대왕기념사업회",
      quiz: [
        { q: "세종대왕기념관이 기념하는 임금은?", choices: ["세종대왕", "태조", "정조", "고종"], answer: 0 },
        { q: "세종대왕기념관이 특별히 기념하는 세종대왕의 업적은?", choices: ["한글 창제", "성곽 축조", "왕릉 조성", "궁궐 건축"], answer: 0 },
        { q: "기념관에서 마련하고 있는 것은?", choices: ["전시와 한글 교육 프로그램", "비행 체험", "운동 경기", "요리 수업"], answer: 0 }
      ]
    },
    {
      id: "mm_gyeomjae", name: "겸재정선미술관", category: "기념관", district: "강서구",
      type: "memorial", lat: 37.5704, lng: 126.8330, photoQuery: "겸재정선미술관",
      desc: "조선 시대 진경산수화의 대가인 겸재 정선을 기리기 위해 설립되었습니다. 그의 작품에는 우리나라의 아름다운 자연이 담겨 있습니다.",
      officialLink: "https://culture.gangseo.seoul.kr/gsfc/main/contents.do?menuNo=800097", officialLinkName: "강서구 겸재정선미술관",
      quiz: [
        { q: "겸재정선미술관이 기리는 화가는?", choices: ["겸재 정선", "김홍도", "신윤복", "안견"], answer: 0 },
        { q: "겸재 정선이 그린 그림의 종류는?", choices: ["진경산수화", "인물화", "동물화", "추상화"], answer: 0 },
        { q: "겸재 정선의 작품에 주로 담긴 것은?", choices: ["우리나라의 아름다운 자연", "외국의 도시", "우주의 모습", "미래의 기계"], answer: 0 }
      ]
    },
    {
      id: "mm_baeknamjun", name: "백남준기념관", category: "기념관", district: "종로구",
      type: "memorial", lat: 37.5745, lng: 127.0098, photoQuery: "백남준기념관",
      desc: "세계적인 현대 예술가 백남준을 기념하는 공간으로, 작가가 어린 시절을 보낸 동네에 만들어졌습니다.",
      officialLink: "https://korean.visitseoul.net/museum/NamJunePaik_/23460", officialLinkName: "서울시 공식 관광 – 백남준기념관",
      quiz: [
        { q: "백남준기념관이 기념하는 인물은?", choices: ["예술가 백남준", "장군 이순신", "임금 세종", "학자 정약용"], answer: 0 },
        { q: "백남준은 어떤 분야의 인물인가요?", choices: ["현대 예술", "정치", "과학", "체육"], answer: 0 },
        { q: "백남준기념관이 만들어진 곳은?", choices: ["백남준이 어린 시절을 보낸 동네", "외국의 도시", "궁궐 안", "산 정상"], answer: 0 }
      ]
    },
    {
      id: "mm_war", name: "전쟁기념관", category: "기념관", district: "용산구",
      type: "memorial", lat: 37.5366, lng: 126.9774, photoQuery: "전쟁기념관",
      desc: "전쟁 관련 자료와 역사 등을 전시하고, 전쟁의 희생자를 추모하는 곳입니다.",
      officialLink: "https://www.warmemo.or.kr", officialLinkName: "전쟁기념관 공식 누리집",
      quiz: [
        { q: "전쟁기념관이 전시하는 것은?", choices: ["전쟁 관련 자료와 역사", "왕실 유물", "공예품", "신석기 토기"], answer: 0 },
        { q: "전쟁기념관이 하는 또 다른 일은?", choices: ["전쟁의 희생자를 추모", "비행기 전시", "한글 교육", "왕릉 관리"], answer: 0 },
        { q: "전쟁기념관이 있는 서울의 구는?", choices: ["용산구", "종로구", "강서구", "노원구"], answer: 0 }
      ]
    },
    {
      id: "mm_provgov", name: "대한민국임시정부기념관", category: "기념관", district: "서대문구",
      type: "memorial", lat: 37.5760, lng: 126.9543, photoQuery: "대한민국임시정부기념관",
      desc: "대한민국 임시 정부의 역사와 관련된 자료를 전시하는 곳입니다.",
      officialLink: "https://www.nmkpg.go.kr", officialLinkName: "국립대한민국임시정부기념관 공식 누리집",
      quiz: [
        { q: "이 기념관이 전시하는 것은?", choices: ["대한민국 임시 정부의 역사", "조선 왕실의 보물", "비행기의 역사", "공룡 화석"], answer: 0 },
        { q: "대한민국 임시 정부는 언제 활동했나요?", choices: ["일제 강점기", "삼국시대", "고려 초기", "신석기 시대"], answer: 0 },
        { q: "임시 정부가 되찾으려 한 것은?", choices: ["나라의 독립", "넓은 땅", "많은 보물", "큰 궁궐"], answer: 0 }
      ]
    },
    {
      id: "mm_modern", name: "근현대사기념관", category: "기념관", district: "강북구",
      type: "memorial", lat: 37.6480, lng: 127.0130, photoQuery: "근현대사기념관",
      desc: "우리나라의 독립과 민주주의를 지켜 온 희생과 노력을 기억하기 위한 곳입니다.",
      officialLink: "https://www.gangbuk.go.kr", officialLinkName: "강북구(근현대사기념관 운영) 공식 누리집",
      quiz: [
        { q: "근현대사기념관이 기억하려는 것은?", choices: ["독립과 민주주의를 지킨 희생과 노력", "왕실의 보물", "비행 기술", "공예 솜씨"], answer: 0 },
        { q: "근현대사기념관이 있는 서울의 구는?", choices: ["강북구", "강남구", "종로구", "송파구"], answer: 0 },
        { q: "이 기념관과 관련 깊은 우리 역사의 가치는?", choices: ["독립과 민주주의", "농업 기술", "해양 탐험", "우주 개발"], answer: 0 }
      ]
    },
    {
      id: "mm_dosan", name: "도산안창호기념관", category: "기념관", district: "강남구",
      type: "memorial", lat: 37.5240, lng: 127.0354, photoQuery: "도산안창호기념관",
      desc: "안창호 선생의 나라 사랑 정신을 기리고, 그의 생애와 업적이 담긴 유품을 전시하는 곳입니다.",
      officialLink: "http://www.ahnchangho.or.kr", officialLinkName: "도산안창호기념관 공식 누리집",
      quiz: [
        { q: "도산안창호기념관이 기리는 인물은?", choices: ["안창호 선생", "김구 선생", "윤봉길 의사", "안중근 의사"], answer: 0 },
        { q: "이 기념관이 전시하는 것은?", choices: ["안창호 선생의 생애와 유품", "비행기", "공룡 화석", "왕릉 모형"], answer: 0 },
        { q: "도산안창호기념관이 있는 도산공원은 어느 구에 있나요?", choices: ["강남구", "강북구", "종로구", "용산구"], answer: 0 }
      ]
    },
    {
      id: "mm_kimku", name: "백범김구기념관", category: "기념관", district: "용산구",
      type: "memorial", lat: 37.5450, lng: 126.9610, photoQuery: "백범김구기념관",
      desc: "백범 김구 선생의 어린 시절부터 독립을 위한 임시 정부 활동에 이르기까지 다양한 자료와 유물을 살펴볼 수 있습니다.",
      officialLink: "https://www.kimkoomuseum.org", officialLinkName: "백범김구기념관 공식 누리집",
      quiz: [
        { q: "백범김구기념관이 기리는 인물은?", choices: ["김구 선생", "안창호 선생", "윤봉길 의사", "세종대왕"], answer: 0 },
        { q: "김구 선생이 활동한 정부는?", choices: ["대한민국 임시 정부", "조선 왕실", "신라 조정", "고려 조정"], answer: 0 },
        { q: "백범김구기념관이 있는 효창공원은 어느 구에 있나요?", choices: ["용산구", "강남구", "강북구", "종로구"], answer: 0 }
      ]
    },
    {
      id: "mm_yun", name: "매헌윤봉길의사기념관", category: "기념관", district: "서초구",
      type: "memorial", lat: 37.4700, lng: 127.0380, photoQuery: "매헌윤봉길의사기념관",
      desc: "독립운동가 윤봉길 의사의 삶과 업적을 전시하고 있습니다. 나라를 사랑한 사람들의 마음과 독립 정신을 배울 수 있습니다.",
      officialLink: "http://www.yunbonggil.or.kr", officialLinkName: "매헌윤봉길의사기념사업회",
      quiz: [
        { q: "이 기념관이 기리는 인물은?", choices: ["윤봉길 의사", "김구 선생", "안창호 선생", "정선"], answer: 0 },
        { q: "윤봉길 의사는 어떤 사람인가요?", choices: ["독립운동가", "임금", "화가", "과학자"], answer: 0 },
        { q: "이 기념관에서 배울 수 있는 것은?", choices: ["나라 사랑과 독립 정신", "비행 기술", "요리법", "운동 경기 규칙"], answer: 0 }
      ]
    },
    {
      id: "mm_ahn", name: "안중근의사기념관", category: "기념관", district: "중구",
      type: "memorial", lat: 37.5520, lng: 126.9870, photoQuery: "안중근의사기념관",
      desc: "독립운동가 안중근 의사의 삶과 업적을 전시하고 있습니다. 나라를 사랑한 사람들의 마음과 독립 정신을 배울 수 있습니다.",
      officialLink: "https://www.ahnjunggeun.or.kr", officialLinkName: "안중근의사기념관 공식 누리집",
      quiz: [
        { q: "이 기념관이 기리는 인물은?", choices: ["안중근 의사", "윤봉길 의사", "김구 선생", "세종대왕"], answer: 0 },
        { q: "안중근 의사는 어떤 사람인가요?", choices: ["독립운동가", "임금", "장군 출신 화가", "건축가"], answer: 0 },
        { q: "안중근의사기념관이 있는 남산은 어느 구에 있나요?", choices: ["중구", "강남구", "노원구", "강서구"], answer: 0 }
      ]
    },

    /* ---------------- 독립운동 유적지 ---------------- */
    {
      id: "ind_dongnimmun", name: "독립문", category: "독립운동 유적지", district: "서대문구",
      type: "site", lat: 37.5724, lng: 126.9590, photoQuery: "독립문",
      desc: "1897년에 완성된 독립문은 조선 시대에 중국 사신을 맞이하던 장소인 영은문을 헐고 그 인근에 만든 것입니다. 다른 나라들과 대등한 외교를 맺고 자주독립하겠다는 의지가 담겨 있습니다.",
      officialLink: HER + "1331100320000", officialLinkName: "국가유산포털 – 서울 독립문",
      quiz: [
        { q: "독립문은 무엇을 헐고 그 인근에 세웠나요?", choices: ["영은문", "숭례문", "흥인지문", "광화문"], answer: 0 },
        { q: "독립문에 담긴 의지로 알맞은 것은?", choices: ["자주독립의 의지", "전쟁의 의지", "농사의 다짐", "이사의 다짐"], answer: 0 },
        { q: "독립문이 완성된 해는?", choices: ["1897년", "1392년", "1945년", "2002년"], answer: 0 }
      ]
    },
    {
      id: "ind_seodaemun", name: "서대문형무소역사관", category: "독립운동 유적지", district: "서대문구",
      type: "site", lat: 37.5745, lng: 126.9560, photoQuery: "서대문형무소역사관",
      desc: "일제 강점기에 일본이 독립운동가들을 가두어 고문하고 목숨을 빼앗은 감옥입니다. 지금은 서대문형무소역사관으로 운영되며, 나라의 독립을 위하여 애쓴 많은 독립운동가의 노력을 알리고 있습니다.",
      officialLink: "https://sphh.sscmc.or.kr", officialLinkName: "서대문형무소역사관 공식 누리집",
      quiz: [
        { q: "서대문형무소는 일제 강점기에 어떤 곳이었나요?", choices: ["독립운동가를 가둔 감옥", "임금이 살던 궁궐", "물건을 파는 시장", "책을 보관한 도서관"], answer: 0 },
        { q: "지금 이곳은 무엇으로 운영되나요?", choices: ["역사관", "놀이공원", "호텔", "운동장"], answer: 0 },
        { q: "서대문형무소역사관이 알리는 것은?", choices: ["독립운동가들의 노력", "왕실의 보물", "비행 기술", "공예 솜씨"], answer: 0 }
      ]
    },
    {
      id: "ind_tapgol", name: "탑골공원", category: "독립운동 유적지", district: "종로구",
      type: "site", lat: 37.5710, lng: 126.9880, photoQuery: "탑골공원 팔각정",
      desc: "1919년 이곳 팔각정에서 3·1 운동이 시작되었으며, 학생들과 시민들이 모여 독립선언문을 낭독했습니다.",
      officialLink: "https://www.heritage.go.kr", officialLinkName: "국가유산포털(사적 탑골공원)",
      quiz: [
        { q: "1919년 탑골공원에서 시작된 운동은?", choices: ["3·1 운동", "갑오개혁", "임진왜란", "동학농민운동"], answer: 0 },
        { q: "탑골공원 팔각정에서 사람들이 모여 한 일은?", choices: ["독립선언문 낭독", "농사", "시장 개장", "운동 경기"], answer: 0 },
        { q: "3·1 운동에 참여한 사람들은 누구인가요?", choices: ["학생과 시민", "외국 군인", "왕과 신하", "외국 사신"], answer: 0 }
      ]
    }
  ];

  items.forEach(function (it) { window.HERITAGE_DATA.push(it); });
})();

