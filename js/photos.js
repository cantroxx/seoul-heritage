/* ===== js/photos.js ===== */
/* =========================================================================
 *  photos.js  —  위키미디어 공용 이미지 자동 로더(2순위)
 *  - 각 문화유산의 photoQuery(또는 이름)로 위키미디어 API에서 대표 사진 검색
 *  - 우선순위: item.photo(직접 URL) > item.wikimedia(고정 파일명) > API 검색
 *  - 키 불필요, CORS 허용(origin=*). 실패 시 기존 폴백으로 자연스럽게 떨어짐
 *  - 한 번 찾은 결과는 메모리 + localStorage에 캐시(다음 실행 때 빠르고 조용함)
 *  전역: window.Photos.resolve(item) -> Promise<url|null>
 * ========================================================================= */
(function () {
  "use strict";

  var memCache = {};
  var LS_KEY = "seoul_photo_cache_v1";
  var lsCache = loadLS();

  function loadLS() {
    try { return JSON.parse(window.localStorage.getItem(LS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveLS() {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(lsCache)); } catch (e) {}
  }

  function filePathUrl(filename, width) {
    return "https://commons.wikimedia.org/wiki/Special:FilePath/" +
           encodeURIComponent(filename) + "?width=" + (width || 800);
  }

  /* 위키미디어(공용 우선, 없으면 한국어 위키) 대표 이미지 검색 */
  function apiSearch(query) {
    // 1) 공용(Commons)에서 파일 검색
    var commons = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*" +
      "&generator=search&gsrnamespace=6&gsrlimit=1&gsrsearch=" + encodeURIComponent(query) +
      "&prop=imageinfo&iiprop=url&iiurlwidth=800";
    // 2) 한국어 위키백과 문서의 대표 이미지(pageimages)
    var kowiki = "https://ko.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
      "&prop=pageimages&piprop=thumbnail&pithumbsize=800&redirects=1&titles=" + encodeURIComponent(query);

    return fetchJSON(commons).then(function (d) {
      var url = firstImageInfo(d);
      if (url) return url;
      return fetchJSON(kowiki).then(function (d2) { return firstPageImage(d2); });
    });
  }

  function fetchJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  function firstImageInfo(d) {
    try {
      var pages = d.query.pages, k = Object.keys(pages)[0];
      var ii = pages[k].imageinfo[0];
      return ii.thumburl || ii.url;
    } catch (e) { return null; }
  }
  function firstPageImage(d) {
    try {
      var pages = d.query.pages, k = Object.keys(pages)[0];
      return pages[k].thumbnail.source;
    } catch (e) { return null; }
  }

  // 로컬 이미지 존재 여부 캐시(있으면 url, 없으면 false)
  var localProbe = {};
  var LOCAL_PHOTOS = {
    amsadong: "heritage image/amsadong.jpg",
    bawijeol_hosang: "heritage image/bawijeol_hosang.jpg",
    bitsalmunui: "heritage image/bitsalmunui.jpg",
    gb_gangnyeongjeon: null,
    gb_geunjeongjeon: null,
    gb_gyeonghoeru: "heritage image/gb_gyeonghoeru.jpg",
    gb_gyotaejeon: "heritage image/gb_gyotaejeon.jpg",
    gb_gwanghwamun: null,
    gb_sajeongjeon: "heritage image/gb_sajeongjeon.jpg",
    heunginjimun: "heritage image/heunginjimun.jpg",
    hunminjeongeum: "heritage image/hunminjeongeum.jpg",
    jeongneung_sd: "heritage image/jeongneung_sd.jpg",
    jongmyo_jerye: "heritage image/jongmyo_jerye.jpg",
    m_craft: "heritage image/m_craft.jpg",
    m_doseong: "heritage image/m_doseong.jpg",
    m_hangeul: "heritage image/m_hangeul.jpg",
    m_jungang: "heritage image/m_jungang.jpg",
    mm_baeknamjun: "heritage image/mm_baeknamjun.jpg",
    mm_gyeomjae: "heritage image/mm_gyeomjae.jpg",
    mm_modern: "heritage image/mm_modern.jpg",
    mm_sejong: "heritage image/mm_sejong.jpg",
    munmyo_ginkgo: "heritage image/munmyo_ginkgo.jpg",
    nakseongdae: "heritage image/nakseongdae.jpg",
    samgaksan_dodang: "heritage image/samgaksan_dodang.jpg",
    songpa_darbi: "heritage image/songpa_darbi.jpg",
    toseong: "heritage image/toseong.jpg",
    uigwe: "heritage image/uigwe.jpg",
    uireung: "heritage image/uireung.jpg"
  };

  function tryLocal(id) {
    if (!id) return Promise.resolve(null);
    if (Object.prototype.hasOwnProperty.call(LOCAL_PHOTOS, id)) {
      return Promise.resolve(LOCAL_PHOTOS[id]);
    }
    if (localProbe[id] !== undefined) return Promise.resolve(localProbe[id]);
    return new Promise(function (resolve) {
      var url = "images/" + id + ".jpg";
      var im = new Image();
      var done = false;
      im.onload = function () { if (done) return; done = true; localProbe[id] = url; resolve(url); };
      im.onerror = function () {
        if (done) return;
        // .jpg 없으면 .png 시도
        var url2 = "images/" + id + ".png";
        var im2 = new Image();
        im2.onload = function () { localProbe[id] = url2; resolve(url2); };
        im2.onerror = function () { localProbe[id] = false; resolve(null); };
        im2.src = url2;
      };
      im.src = url;
    });
  }

  var Photos = {
    /* item 의 대표 이미지 URL 반환(없으면 null) */
    resolve: function (item) {
      // 1) 직접 URL
      if (item.photo) return Promise.resolve(item.photo);
      // 2) 고정 파일명(검증된 항목)
      if (item.wikimedia) return Promise.resolve(filePathUrl(item.wikimedia, 800));
      // 3) 로컬 이미지(images/{id}.jpg|png) → 있으면 사용
      return tryLocal(item.id).then(function (local) {
        if (local) return local;
        // 4) 캐시
        var key = item.id;
        if (memCache[key] !== undefined) return memCache[key];
        if (lsCache[key] !== undefined) { memCache[key] = lsCache[key]; return lsCache[key]; }
        // 5) 위키미디어 API 검색
        var q = item.photoQuery || item.name;
        return apiSearch(q)
          .then(function (url) {
            memCache[key] = url || null;
            lsCache[key] = url || null; saveLS();
            return url || null;
          })
          .catch(function () { memCache[key] = null; return null; });
      });
    }
  };

  window.Photos = Photos;
})();
