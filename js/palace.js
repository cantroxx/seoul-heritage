/* ===== js/palace.js ===== */
/* =========================================================================
 *  palace.js  —  6단계: 궁궐 내부 도식
 *  - 궁궐 물음표 클릭 → SM.openPalace(palace): 평면 도식 + 건물 마커
 *  - 건물 카드: 사진 + 건물명 + 설명 미리보기 + 물음표
 *  - 건물 물음표 클릭 → 건물 정보(사진+설명) 작은 모달
 *  - 도식 상단 우측 '문화재 사수' 버튼 → 궁궐 퀴즈(기존 info.js 퀴즈 재사용)
 *  의존: window.SeoulMap, window.GameState, info.js(openInfo)
 * ========================================================================= */
(function () {
  "use strict";
  var SM = window.SeoulMap, GS = window.GameState;
  var overlay, current = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "palace-overlay";
    document.body.appendChild(overlay);
  }

  SM.openPalace = function (palace) {
    ensureDom();
    current = palace;
    var saved = GS.isSaved(palace.id);

    var cards = palace.buildings.map(function (b, i) {
      return '<div class="bld-card' + (saved ? " saved" : "") + '" data-i="' + i + '">' +
               '<div class="card-photo" data-photo="' + i + '">' +
                 '<div class="ph-load">사진 불러오는 중…</div>' +
               '</div>' +
               '<div class="card-body">' +
                 '<div class="card-head">' +
                   '<span class="card-star">★</span>' +
                   '<span class="card-name">' + esc(b.name) + '</span>' +
                   '<span class="card-q">?</span>' +
                 '</div>' +
                 '<div class="card-desc">' + esc(b.desc) + '</div>' +
               '</div>' +
             '</div>';
    }).join("");

    overlay.innerHTML =
      '<div class="palace-head">' +
        '<button class="pback" id="palace-back">◀ 구 지도로</button>' +
        '<div style="flex:1">' +
          '<div class="ptitle">' + esc(palace.name) + '</div>' +
          '<div class="psub">교과서에 나온 건물을 눌러 살펴보고, 오른쪽에서 문화재를 사수하세요</div>' +
        '</div>' +
        '<button class="defend-btn ' + (saved ? "done" : "") + '" id="palace-defend">' +
          (saved ? "✓ 사수 완료" : "🛡️ 문화재 사수") + '</button>' +
      '</div>' +
      '<div class="palace-canvas">' +
        '<div class="palace-cards">' + cards +
          '<div class="palace-cards-hint">건물 카드를 누르면 사진과 설명을 자세히 볼 수 있어요</div>' +
        '</div>' +
      '</div>';

    overlay.classList.add("show");

    document.getElementById("palace-back").onclick = closePalace;
    document.getElementById("palace-defend").onclick = function () {
      SM.openInfo(palace);
    };

    Array.prototype.forEach.call(overlay.querySelectorAll(".bld-card"), function (el) {
      var idx = parseInt(el.getAttribute("data-i"), 10);
      el.onclick = function () { openBuilding(palace, palace.buildings[idx]); };
      loadCardPhoto(el.querySelector(".card-photo"), palace, palace.buildings[idx]);
    });
  };

  /* 카드 썸네일 사진 로딩(위키미디어 자동) */
  function loadCardPhoto(box, palace, b) {
    if (!box || !window.Photos) return;
    var item = { id: b.photoId || (palace.id + "__" + b.name), photo: b.photo || null, photoQuery: b.photoQuery, name: b.name };
    window.Photos.resolve(item).then(function (url) {
      if (!url) { box.innerHTML = '<div class="ph-fb">🏛️</div>'; return; }
      var im = new Image();
      im.onload = function () { box.innerHTML = ""; box.appendChild(im); };
      im.onerror = function () { box.innerHTML = '<div class="ph-fb">🏛️</div>'; };
      im.alt = b.name; im.src = url;
    }).catch(function () { box.innerHTML = '<div class="ph-fb">🏛️</div>'; });
  }

  function closePalace() {
    if (overlay) overlay.classList.remove("show");
    current = null;
    // 궁궐 사수 상태가 바뀌었을 수 있으니 구 마커 갱신
    if (SM.refreshMarker && current) SM.refreshMarker(current);
  }

  /* 건물 정보 — info.js의 정보창을 건물용으로 가볍게 재사용(퀴즈 없음) */
  function openBuilding(palace, b) {
    // info.js의 openInfo는 quiz가 필요하므로, 건물 전용 간단 모달을 별도로 띄움
    SM.openSimpleInfo({
      id: b.photoId || (palace.id + "__" + (b.name || "")),
      name: b.name,
      category: palace.name + "의 건물",
      district: palace.district,
      desc: b.desc,
      photo: b.photo || null,
      photoQuery: b.photoQuery,
      officialLink: palace.officialLink,
      officialLinkName: palace.officialLinkName
    });
  }

  // 궁궐 사수 상태 변화에 따라 도식 마커/버튼 갱신
  GS.onChange(function () {
    if (!overlay || !overlay.classList.contains("show") || !current) return;
    var saved = GS.isSaved(current.id);
    var db = document.getElementById("palace-defend");
    if (db && saved) { db.classList.add("done"); db.textContent = "✓ 사수 완료"; db.onclick = null; }
    Array.prototype.forEach.call(overlay.querySelectorAll(".bld-card"), function (el) {
      if (saved) el.classList.add("saved");
    });
  });

  window.PalaceView = { open: SM.openPalace, close: closePalace };
})();

