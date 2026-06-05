/* ===== js/photos.js ===== */
/* =========================================================================
 *  photos.js  —  검증된 대표 사진 로더
 *  - 출처가 불명확한 로컬 사진은 표시하지 않음
 *  - Wikimedia Commons에서 저작자/라이선스 메타데이터가 확인되는 이미지만 표시
 *  - 우선순위: item.wikimedia(고정 파일명) > 검증된 Commons 검색 > 로컬 매핑(검증된 경우만)
 *  전역: window.Photos.resolve(item) -> Promise<url|null>
 * ========================================================================= */
(function () {
  "use strict";

  var memCache = {};
  var creditCache = {};
  var LS_KEY = "seoul_photo_cache_v3";
  var ALLOW_UNVERIFIED_LOCAL_PHOTOS = false;
  var ENABLE_VERIFIED_COMMONS_SEARCH = true;
  var lsCache = loadLS();

  function loadLS() {
    try { return JSON.parse(window.localStorage.getItem(LS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveLS() {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify(lsCache)); } catch (e) {}
  }

  function fetchJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  function commonsApi(params) {
    return "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&formatversion=2" +
      "&prop=imageinfo&iiprop=url%7Cextmetadata%7Cmime&iiurlwidth=900&" + params;
  }

  function commonsFilePage(title) {
    return "https://commons.wikimedia.org/wiki/" + encodeURIComponent(title).replace(/%20/g, "_");
  }

  function stripHtml(s) {
    return String(s || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  function metaValue(meta, key) {
    return meta && meta[key] ? stripHtml(meta[key].value) : "";
  }

  function allowedLicense(meta) {
    var shortName = metaValue(meta, "LicenseShortName");
    var usage = metaValue(meta, "UsageTerms");
    var pd = metaValue(meta, "PublicDomain").toLowerCase() === "true";
    var joined = (shortName + " " + usage).toLowerCase();
    if (joined.indexOf("kogl type 1") >= 0 || joined.indexOf("공공누리 제1유형") >= 0) return true;
    if (pd || joined.indexOf("public domain") >= 0 || joined.indexOf("cc0") >= 0) return true;
    if (/cc\s*by(?:-sa)?(?:\s|$|-)/i.test(shortName) || /cc\s*by(?:-sa)?(?:\s|$|-)/i.test(usage)) {
      return joined.indexOf("nc") < 0 && joined.indexOf("nd") < 0;
    }
    return false;
  }

  function resultFromPage(page) {
    var ii = page && page.imageinfo && page.imageinfo[0];
    if (!ii || !ii.url || !ii.thumburl || !ii.extmetadata || !allowedLicense(ii.extmetadata)) return null;
    if (ii.mime && ii.mime.indexOf("image/") !== 0) return null;

    var meta = ii.extmetadata;
    var author = metaValue(meta, "Artist") || metaValue(meta, "Credit") || "Wikimedia Commons contributor";
    var license = metaValue(meta, "LicenseShortName") || metaValue(meta, "UsageTerms") || "free license";
    var licenseUrl = metaValue(meta, "LicenseUrl");
    var sourceUrl = metaValue(meta, "LicenseUrl") ? commonsFilePage(page.title) : commonsFilePage(page.title);
    var credit = {
      label: "사진: " + author + " / " + license + " / Wikimedia Commons",
      shortLabel: license + " / Commons",
      sourceUrl: sourceUrl,
      licenseUrl: licenseUrl,
      verified: true
    };
    creditCache[ii.thumburl] = credit;
    creditCache[ii.url] = credit;
    return { url: ii.thumburl, credit: credit };
  }

  function firstVerifiedResult(d) {
    var pages = (d.query && d.query.pages) || [];
    for (var i = 0; i < pages.length; i++) {
      var result = resultFromPage(pages[i]);
      if (result) return result;
    }
    return null;
  }

  function fixedCommonsFile(filename) {
    var title = filename.indexOf("File:") === 0 ? filename : "File:" + filename;
    return fetchJSON(commonsApi("titles=" + encodeURIComponent(title)))
      .then(firstVerifiedResult);
  }

  function searchCommons(query) {
    var params = "generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=" + encodeURIComponent(query);
    return fetchJSON(commonsApi(params)).then(firstVerifiedResult);
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

  function creditForUrl(url) {
    if (!url) return null;
    if (creditCache[url]) return creditCache[url];
    var credits = window.ASSET_CREDITS && window.ASSET_CREDITS.photos;
    if (credits && credits[url]) return credits[url];
    if (url.indexOf("commons.wikimedia.org/") >= 0 || url.indexOf("wikimedia.org/") >= 0) {
      return {
        label: "Wikimedia Commons 이미지 - 메타데이터 확인 필요",
        verified: false
      };
    }
    return null;
  }

  function canUseLocal(url) {
    var credit = creditForUrl(url);
    return ALLOW_UNVERIFIED_LOCAL_PHOTOS || !credit || credit.verified !== false;
  }

  var Photos = {
    /* item 의 대표 이미지 URL 반환(없으면 null) */
    resolve: function (item) {
      // 1) 직접 URL
      if (item.photo) return Promise.resolve(null);
      // 2) 고정 파일명(검증된 항목)
      if (item.wikimedia) {
        return fixedCommonsFile(item.wikimedia).then(function (result) {
          return result ? result.url : null;
        }).catch(function () { return null; });
      }
      // 3) 로컬 이미지(images/{id}.jpg|png) → 있으면 사용
      return tryLocal(item.id).then(function (local) {
        if (local && canUseLocal(local)) return local;
        // 4) Commons 메타데이터로 저작자/라이선스가 확인되는 이미지만 검색 사용
        if (!ENABLE_VERIFIED_COMMONS_SEARCH) return null;
        var key = item.id;
        if (memCache[key] !== undefined) return memCache[key] && memCache[key].url ? memCache[key].url : null;
        if (lsCache[key] !== undefined) {
          memCache[key] = lsCache[key];
          if (lsCache[key] && lsCache[key].url && lsCache[key].credit) creditCache[lsCache[key].url] = lsCache[key].credit;
          return lsCache[key] && lsCache[key].url ? lsCache[key].url : null;
        }
        // 5) 검증된 Commons 검색
        var q = item.photoQuery || item.name;
        return searchCommons(q)
          .then(function (result) {
            memCache[key] = result || null;
            lsCache[key] = result || null; saveLS();
            if (result && result.credit) creditCache[result.url] = result.credit;
            return result ? result.url : null;
          })
          .catch(function () { memCache[key] = null; return null; });
      });
    },
    credit: function (url) {
      return creditForUrl(url);
    }
  };

  window.Photos = Photos;
})();
