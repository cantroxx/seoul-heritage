# Seoul Heritage Asset Notice

이 문서는 `seoul-heritage` 공개 배포 전 저작권과 라이선스 확인을 위한 고지입니다.
비영리 공개라도 저작권, 공공누리, 오픈소스 라이선스 조건은 그대로 적용됩니다.

## 배포 전 필수 조치

1. `heritage image/` 아래 로컬 사진 25장은 출처가 확인되지 않았습니다.
   공개 배포 전 각 파일마다 저작자, 원본 URL, 라이선스, 변경 여부, 확인일을 기록하거나 검증된 이미지로 교체해야 합니다.
   현재 코드는 `data/asset_credits.js`에서 `verified:false`로 표시된 로컬 사진을 화면에 표시하지 않습니다.
2. `data/thief_images.js`의 도굴꾼 캐릭터 이미지는 GPT로 생성한 자체 사용 이미지입니다.
   특정 저작물/캐릭터/작가풍을 요구하지 않았고, 타인 이미지를 참고 이미지로 넣지 않았으며, 사람 얼굴/상표/로고도 포함하지 않은 것으로 확인했습니다.
   원본 생성 파일인 `model image/`는 앱 실행에 필요하지 않아 배포에서 제외합니다.
3. Vercel, Netlify, Firebase Hosting 배포에서는 `.vercelignore`, `.netlifyignore`, `.firebaseignore`를 통해 미확인 이미지 폴더와 백업 HTML을 제외합니다.
   GitHub Pages처럼 저장소 전체를 그대로 공개하는 방식으로 배포할 경우, 미확인 이미지 파일을 브랜치/배포 루트에서 제거해야 합니다.
4. `js/photos.js`는 Wikimedia Commons API의 `imageinfo.extmetadata`로 저작자와 라이선스가 확인되는 이미지만 표시합니다.
   허용 범위는 Public Domain, CC0, CC BY, CC BY-SA, 공공누리 제1유형/KOGL Type 1이며, 확인되지 않는 이미지는 표시하지 않습니다.
   사진 하단에는 저작자, 라이선스, Wikimedia Commons 원본/라이선스 링크를 표시합니다.
5. 공공기관 자료는 공공누리 유형별 조건을 확인해야 합니다.
   제1유형은 출처 표시 조건으로 활용할 수 있으나, 제4유형은 비영리라도 변경 이용이 금지됩니다.

## 현재 코드에서 사용하는 외부 자료 및 서비스

- Leaflet 1.9.4: BSD 2-Clause License
  - https://github.com/Leaflet/Leaflet/blob/main/LICENSE
- Google Fonts: Jua, Gowun Dodum
  - Google Fonts 저장소의 각 폰트 라이선스 파일 기준. Gowun Dodum은 SIL Open Font License로 공개되어 있습니다.
  - https://github.com/google/fonts
  - https://github.com/yangheeryu/Gowun-Dodum
- 지도 타일: CARTO Voyager, OpenStreetMap 기반
  - 앱 지도 하단에 OpenStreetMap 및 CARTO attribution을 표시합니다.
  - https://www.openstreetmap.org/copyright
  - https://carto.com/attribution/
- 서울 자치구 경계 데이터: `southkorea/seoul-maps`, KOSTAT 2013 센서스 경계 기반
  - 코드: `data/geo.js`, `data/geo_data.js`
  - https://github.com/southkorea/seoul-maps
- Kakao 지도 Web API
  - 주소 좌표 변환에 사용합니다.
  - 공개 배포 도메인은 Kakao Developers 콘솔에 등록하고, API 키 도메인 제한을 설정해야 합니다.
  - https://apis.map.kakao.com/web/guide/
- Firebase
  - 랭킹/상태 저장에 사용합니다.
  - 공개 배포 전 Realtime Database 보안 규칙과 쓰기 권한을 확인해야 합니다.
- Wikimedia Commons 이미지
  - 앱은 Commons API에서 저작자/라이선스 메타데이터가 확인되는 이미지만 표시합니다.
  - 사진 크레딧과 원본/라이선스 링크는 각 이미지 하단에 표시합니다.
  - https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
  - https://commons.wikimedia.org/wiki/Commons:Credit_line/en

## 텍스트 자료 출처

앱의 문화유산 설명은 국가유산청, 국가유산포털, 궁능유적본부, 서울시 및 각 기관 공식 누리집 자료를 바탕으로 어린이용 문장으로 재서술한 콘텐츠입니다.
공개 배포 전 각 항목의 원자료가 공공누리 몇 유형인지 확인하고, 제4유형 또는 변경금지 조건 자료를 바탕으로 한 문구는 별도 허락을 받거나 독자 작성 문장으로 교체해야 합니다.

## 로컬 사진 확인 대상

- `heritage image/amsadong.jpg`
- `heritage image/bawijeol_hosang.jpg`
- `heritage image/bitsalmunui.jpg`
- `heritage image/gb_gyeonghoeru.jpg`
- `heritage image/gb_gyotaejeon.jpg`
- `heritage image/gb_sajeongjeon.jpg`
- `heritage image/heunginjimun.jpg`
- `heritage image/hunminjeongeum.jpg`
- `heritage image/jeongneung_sd.jpg`
- `heritage image/jongmyo_jerye.jpg`
- `heritage image/m_craft.jpg`
- `heritage image/m_doseong.jpg`
- `heritage image/m_hangeul.jpg`
- `heritage image/m_jungang.jpg`
- `heritage image/mm_baeknamjun.jpg`
- `heritage image/mm_gyeomjae.jpg`
- `heritage image/mm_modern.jpg`
- `heritage image/mm_sejong.jpg`
- `heritage image/munmyo_ginkgo.jpg`
- `heritage image/nakseongdae.jpg`
- `heritage image/samgaksan_dodang.jpg`
- `heritage image/songpa_darbi.jpg`
- `heritage image/toseong.jpg`
- `heritage image/uigwe.jpg`
- `heritage image/uireung.jpg`

## 권장 사진 출처 기록 형식

```text
파일:
표시 대상:
저작자:
원본 URL:
라이선스/이용조건:
변경 여부:
확인일:
비고:
```
