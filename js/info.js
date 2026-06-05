/* ===== js/info.js ===== */
/* =========================================================================
 *  info.js  —  5단계: 정보창(모달) + 사수 퀴즈
 *  - 물음표 클릭 → SM.openInfo(item): 사진/설명/공식링크 + '문화재 사수' 버튼
 *  - 사수 버튼 → 안내 → 3문제 퀴즈(타이머 없음) → 2개 이상 정답 시 사수 성공
 *  - 성공 시 GameState 저장 → 마커 회색→황금, 구 색/배지 자동 갱신
 *  의존: window.SeoulMap, window.GameState
 * ========================================================================= */
(function () {
  "use strict";
  var SM = window.SeoulMap, GS = window.GameState;

  var overlay, modal;
  var current = null;     // 현재 항목
  var quizState = null;   // { idx, correct, order }

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    overlay.innerHTML = '<div class="modal" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(overlay);
    modal = overlay.querySelector(".modal");
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();   // 바깥 클릭 닫기(단, 퀴즈 중엔 유지)
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 분 → "○시간 ○분" / "○분"
  function fmtMin(min) {
    if (min < 60) return min + "분";
    var h = Math.floor(min / 60), m = min % 60;
    return h + "시간" + (m ? " " + m + "분" : "");
  }

  /* ---------------- 정보창 ---------------- */
  SM.openInfo = function (item) {
    ensureDom();
    current = item;
    quizState = null;
    var saved = GS.isSaved(item.id);

    var holderLine = item.holder
      ? '<div class="modal-meta">전시·소장: ' + esc(item.holder) + '</div>' : "";

    // 우리 학교 거리 정보
    var schoolInfo = (window.SchoolPin && item.lat && item.lng)
      ? window.SchoolPin.infoTo(item.lat, item.lng) : null;
    var schoolPanel = schoolInfo
      ? '<div class="school-dist-panel" id="school-dist-panel">' +
          '<div class="sd-row"><span class="sd-k">거리</span><span class="sd-v">약 ' + schoolInfo.kmText + ' · ' + schoolInfo.dir + '쪽</span></div>' +
          '<div class="sd-row"><span class="sd-k">🚶 걸어서</span><span class="sd-v">약 ' + fmtMin(schoolInfo.walkMin) + '</span></div>' +
          '<div class="sd-row"><span class="sd-k">🚗 차로</span><span class="sd-v">약 ' + fmtMin(schoolInfo.carMin) + '</span></div>' +
          '<div class="sd-note">직선거리 기준 어림값이에요.</div>' +
        '</div>'
      : "";

    modal.innerHTML =
      '<div class="modal-head">' +
        '<button class="defend-btn ' + (saved ? "done" : "") + '" id="defend-btn">' +
          (saved ? "✓ 사수 완료" : "🛡️ 문화재 사수") + '</button>' +
        '<div class="title">' + esc(item.name) +
          '<span class="cat">' + esc(item.category) + ' · ' + esc(item.district) + '</span>' +
        '</div>' +
        '<button class="close" id="modal-close" aria-label="닫기">×</button>' +
      '</div>' +
      '<div class="modal-body">' +
        photoHtml(item) +
        '<div class="saved-badge ' + (saved ? "show" : "") + '" id="saved-badge">🏅 이 문화재는 도굴꾼으로부터 안전하게 지켜졌어요!</div>' +
        '<div class="modal-desc">' + esc(item.descLong || item.desc) + '</div>' +
        holderLine +
        '<div class="action-row">' +
          (item.officialLink
            ? '<a class="modal-link" href="' + esc(item.officialLink) + '" target="_blank" rel="noopener noreferrer">🔗 관련 사이트</a>'
            : "") +
          (schoolInfo
            ? '<button class="school-dist-btn" id="school-dist-btn">🏫 우리 학교에서는</button>'
            : "") +
        '</div>' +
        schoolPanel +
        '<div class="quiz" id="quiz"></div>' +
        '<div class="quiz-result" id="quiz-result"></div>' +
      '</div>';

    overlay.classList.add("show");
    bindPhoto(item);

    document.getElementById("modal-close").onclick = close;
    var db = document.getElementById("defend-btn");
    if (!saved) db.onclick = startQuiz;

    var sdBtn = document.getElementById("school-dist-btn");
    if (sdBtn) sdBtn.onclick = function () {
      var p = document.getElementById("school-dist-panel");
      if (p) p.classList.toggle("show");
      sdBtn.classList.toggle("active");
    };
  };

  function photoSrc(item) {
    if (item.photo) return item.photo;                 // 직접 URL
    if (item.wikimedia)                                  // 위키미디어 공용 파일명
      return "https://commons.wikimedia.org/wiki/Special:FilePath/" +
             encodeURIComponent(item.wikimedia) + "?width=800";
    return null;
  }
  function photoHtml(item) {
    // 슬롯만 그려두고, 실제 이미지는 비동기로 채움(bindPhoto)
    return '<div class="modal-photo" id="modal-photo">' +
             '<div class="photo-loading" id="photo-loading">사진 불러오는 중…</div>' +
             '<div class="photo-fallback" id="photo-fallback" style="display:none">' +
               '<div class="ic">🏛️</div>' +
               '<div>사진은 ' + (item.officialLink ? '공식 사이트' : '준비 중') + '에서 확인할 수 있어요.</div>' +
             '</div>' +
           '</div>';
  }
  function bindPhoto(item) {
    var box = document.getElementById("modal-photo");
    var loading = document.getElementById("photo-loading");
    var fb = document.getElementById("photo-fallback");
    function showFallback() { if (loading) loading.style.display = "none"; if (fb) fb.style.display = "flex"; }
    function showCredit(url) {
      if (!box || !(window.Photos && window.Photos.credit)) return;
      var credit = window.Photos.credit(url);
      if (!credit) return;
      var el = document.createElement("div");
      el.className = "photo-credit" + (credit.verified === false ? " needs-review" : "");
      el.appendChild(document.createTextNode(credit.label || "이미지 출처 확인 필요"));
      if (credit.sourceUrl) {
        el.appendChild(document.createTextNode(" · "));
        var src = document.createElement("a");
        src.href = credit.sourceUrl;
        src.target = "_blank";
        src.rel = "noopener noreferrer";
        src.textContent = "원본";
        el.appendChild(src);
      }
      if (credit.licenseUrl) {
        el.appendChild(document.createTextNode(" · "));
        var lic = document.createElement("a");
        lic.href = credit.licenseUrl;
        lic.target = "_blank";
        lic.rel = "noopener noreferrer";
        lic.textContent = "라이선스";
        el.appendChild(lic);
      }
      box.appendChild(el);
    }

    var resolver = (window.Photos && window.Photos.resolve)
      ? window.Photos.resolve(item)
      : Promise.resolve(photoSrc(item));

    resolver.then(function (url) {
      if (!url) { showFallback(); return; }
      var im = new Image();
      im.onload = function () {
        if (loading) loading.style.display = "none";
        im.className = "photo-img";
        if (box) box.insertBefore(im, box.firstChild);
        showCredit(url);
      };
      im.onerror = showFallback;
      im.alt = item.name;
      im.src = url;
    }).catch(showFallback);
  }
  /* ---------------- 문화유산 없는 구: 랜드마크 안내 ---------------- */
  SM.openDistrictInfo = function (districtName) {
    ensureDom();
    var info = (window.EMPTY_DISTRICT_INFO || {})[districtName];
    if (!info) return;

    var cards = info.landmarks.map(function (lm, i) {
      return '<div class="dl-card">' +
               '<div class="dl-icon">' + (lm.icon || "📍") + '</div>' +
               '<div class="dl-body">' +
                 '<div class="dl-name">' + esc(lm.name) + '</div>' +
                 '<div class="dl-desc">' + esc(lm.desc) + '</div>' +
               '</div>' +
             '</div>';
    }).join("");

    modal.innerHTML =
      '<div class="modal-head">' +
        '<div class="title">' + esc(districtName) +
          '<span class="cat">서울특별시 · 우리 동네 둘러보기</span>' +
        '</div>' +
        '<button class="close" id="modal-close" aria-label="닫기">×</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="dl-intro">' + esc(info.intro) + '</div>' +
        '<div class="dl-note">이 구에는 게임에 나오는 문화유산은 없지만, 이런 멋진 곳들이 있어요!</div>' +
        cards +
      '</div>';

    overlay.classList.add("show");
    document.getElementById("modal-close").onclick = close;
  };

  /* ---------------- 구 안 명소(랜드마크) 간단 안내 ---------------- */
  SM.openLandmarkInfo = function (lm, districtName) {
    ensureDom();
    modal.innerHTML =
      '<div class="modal-head landmark-head">' +
        '<div class="title">' + esc(lm.name) +
          '<span class="cat">' + esc(districtName) + ' · 우리 동네 명소</span>' +
        '</div>' +
        '<button class="close" id="modal-close" aria-label="닫기">×</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="lm-info-card">' +
          '<div class="lm-info-icon">' + lm.icon + '</div>' +
          '<div class="lm-info-desc">' + esc(lm.desc) + '</div>' +
        '</div>' +
        '<div class="dl-note">문화유산은 아니지만, ' + esc(districtName) + '에 가면 들러볼 만한 곳이에요!</div>' +
      '</div>';
    overlay.classList.add("show");
    document.getElementById("modal-close").onclick = close;
  };

  function close() {
    if (overlay) overlay.classList.remove("show");
    current = null; quizState = null;
  }

  /* ---------------- 사수 퀴즈 (도굴꾼 연출) ---------------- */
  function thiefImg(tag) {
    if (window.ASSET_CREDITS &&
        window.ASSET_CREDITS.generatedCharacters &&
        window.ASSET_CREDITS.generatedCharacters.verified === false) {
      return "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20240%20240'%3E%3Crect%20width='240'%20height='240'%20rx='28'%20fill='%23f5ead7'/%3E%3Ccircle%20cx='120'%20cy='92'%20r='42'%20fill='%238a6a44'/%3E%3Cpath%20d='M58%20198c10-42%2048-64%2082-55%2028%207%2048%2027%2052%2055z'%20fill='%23b5302e'/%3E%3Cpath%20d='M74%2078c24-34%2072-39%20102-6-42-10-76-8-102%206z'%20fill='%232e2017'/%3E%3Ccircle%20cx='104'%20cy='94'%20r='6'%20fill='%232e2017'/%3E%3Ccircle%20cx='138'%20cy='94'%20r='6'%20fill='%232e2017'/%3E%3Cpath%20d='M104%20122c13%208%2028%208%2041%200'%20fill='none'%20stroke='%232e2017'%20stroke-width='7'%20stroke-linecap='round'/%3E%3Ctext%20x='120'%20y='222'%20text-anchor='middle'%20font-size='18'%20font-family='sans-serif'%20fill='%236b5b43'%3Eimage%20pending%3C/text%3E%3C/svg%3E";
    }
    var src = (window.THIEF_IMAGES && window.THIEF_IMAGES[tag]) || "";
    return src;
  }

  function startQuiz(e) {
    if (e) e.stopPropagation();
    // 모달 본문을 통째로 퀴즈 전용 화면으로 교체(사진·설명 숨김)
    var body = modal.querySelector(".modal-body");
    if (!body) return;
    var isPalace = isPalaceItem(current);
    var deep = (window.GAME_DIFF === "deep");
    var qCount, passNeed;
    if (deep) {
      qCount = isPalace ? 10 : 5;
      passNeed = isPalace ? 8 : 4;
    } else {
      qCount = isPalace ? 5 : 3;
      passNeed = isPalace ? 3 : 2;
    }
    var pool = fullPool(current, deep);
    // 심층 문제가 부족하면(아직 안 채워진 항목) 일반 풀로 보완
    if (deep && pool.length < qCount) {
      pool = pool.concat(fullPool(current, false));
    }
    var qc = Math.min(qCount, pool.length);
    var pn = Math.min(passNeed, qc);
    body.innerHTML =
      '<div class="thief-stage" id="thief-stage">' +
        '<div class="thief-scene">' +
          '<img class="thief-img" src="' + thiefImg("thief_meet") + '" alt="도굴꾼" />' +
          '<div class="thief-bubble">' +
            '“여긴 내 구역이야! <b>' + esc(current.name) + '</b>은 내가 가져간다…<br>' +
            (deep ? '<b>[심층]</b> ' : '') + '막고 싶으면 내 문제 <b>' + qc + '개 중 ' + pn + '개</b>를 맞혀 봐!”' +
          '</div>' +
        '</div>' +
        '<div class="thief-actions">' +
          '<button class="ok-btn" id="quiz-start">문화재를 지킨다! ▶</button>' +
        '</div>' +
      '</div>';
    document.getElementById("quiz-start").onclick = function () {
      quizState = { idx: 0, correct: 0, results: [], pass: pn,
                    quiz: buildQuizSet(pool, qc) };
      renderQuestion();
    };
  }

  // 궁궐인지(시설 문제를 합칠 대상)
  function isPalaceItem(item) {
    return item && (item.category === "궁궐" || (window.QUIZ_BUILDINGS && window.QUIZ_BUILDINGS[item.id]));
  }

  // 문제 풀 구성. deep=true면 심층 풀(QUIZ_DEEP), 아니면 일반(quiz+extra+시설)
  function fullPool(item, deep) {
    if (deep) {
      var dpool = (window.QUIZ_DEEP && window.QUIZ_DEEP[item.id]) ? window.QUIZ_DEEP[item.id].slice() : [];
      if (window.QUIZ_DEEP_BUILDINGS && window.QUIZ_DEEP_BUILDINGS[item.id]) {
        dpool = dpool.concat(window.QUIZ_DEEP_BUILDINGS[item.id]);
      }
      return dpool;
    }
    var base = (item.quiz || []).slice();
    var extra = (window.QUIZ_EXTRA && window.QUIZ_EXTRA[item.id]) || [];
    var pool = base.concat(extra);
    if (window.QUIZ_BUILDINGS && window.QUIZ_BUILDINGS[item.id]) {
      pool = pool.concat(window.QUIZ_BUILDINGS[item.id]);
    }
    return pool;
  }

  // 배열 셔플(Fisher-Yates)
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 이번 회차 문제 세트: 풀에서 n개 랜덤 추출 + 각 문제 선택지 셔플
  function buildQuizSet(pool, n) {
    n = n || 3;
    var picked = shuffle(pool).slice(0, Math.min(n, pool.length));
    return picked.map(function (q) {
      var correctText = q.choices[q.answer];
      var shuffled = shuffle(q.choices);
      return { q: q.q, choices: shuffled, answer: shuffled.indexOf(correctText) };
    });
  }

  function renderQuestion() {
    var body = modal.querySelector(".modal-body");
    var q = quizState.quiz[quizState.idx];
    var dots = "";
    for (var i = 0; i < quizState.quiz.length; i++) {
      var cls = "dot";
      if (quizState.results[i] === true) cls += " ok";
      else if (quizState.results[i] === false) cls += " no";
      dots += '<span class="' + cls + '"></span>';
    }
    var choices = q.choices.map(function (c, i) {
      return '<button class="choice" data-i="' + i + '">' + esc(c) + '</button>';
    }).join("");

    body.innerHTML =
      '<div class="thief-quiz">' +
        '<div class="thief-quiz-top">' +
          '<img class="thief-mini" src="' + thiefImg("thief_angry") + '" alt="도굴꾼" />' +
          '<div class="thief-q-bubble">' +
            '<div class="dots">' + dots + '</div>' +
            '<div class="qnum">도굴꾼의 문제 ' + (quizState.idx + 1) + ' / ' + quizState.quiz.length + '</div>' +
            '<div class="qtext">' + esc(q.q) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="choices">' + choices + '</div>' +
        '<div class="feedback" id="feedback"></div>' +
      '</div>';

    Array.prototype.forEach.call(body.querySelectorAll(".choice"), function (btn) {
      btn.onclick = function () { answer(parseInt(btn.getAttribute("data-i"), 10)); };
    });
  }

  function answer(choiceIdx) {
    var body = modal.querySelector(".modal-body");
    var q = quizState.quiz[quizState.idx];
    var correct = q.answer;
    var ok = choiceIdx === correct;
    quizState.results[quizState.idx] = ok;
    if (ok) quizState.correct++;

    var btns = body.querySelectorAll(".choice");
    Array.prototype.forEach.call(btns, function (b, i) {
      b.disabled = true;
      if (i === correct) b.classList.add("correct");
      else if (i === choiceIdx) b.classList.add("wrong");
    });
    var fb = document.getElementById("feedback");
    fb.textContent = ok ? "정답이에요! 👏" : "아쉬워요, 정답은 \"" + q.choices[correct] + "\" 예요.";
    fb.className = "feedback " + (ok ? "ok" : "no");

    setTimeout(function () {
      quizState.idx++;
      if (quizState.idx < quizState.quiz.length) renderQuestion();
      else finishQuiz();
    }, 1150);
  }

  function finishQuiz() {
    var body = modal.querySelector(".modal-body");
    var totalQ = quizState.quiz.length;
    var need = quizState.pass || 2;
    var pass = quizState.correct >= need;

    if (pass) {
      GS.saveItem(current.id);                 // 사수 성공 저장
      if (SM.refreshMarker) SM.refreshMarker(current);
      body.innerHTML =
        '<div class="thief-stage result success">' +
          '<div class="thief-scene">' +
            '<img class="thief-img" src="' + thiefImg("thief_flee") + '" alt="도망가는 도굴꾼" />' +
            '<div class="thief-bubble flee">“으악, 들켰다! 다음에 두고 보자…!”</div>' +
          '</div>' +
          '<div class="result-banner success">🏅 문화재 사수 성공!</div>' +
          '<div class="result-sub">' + esc(current.name) + ' 을(를) 도굴꾼으로부터 지켜냈어요!<br>' +
          totalQ + '문제 중 ' + quizState.correct + '개 정답</div>' +
          '<button class="ok-btn" id="result-ok">좋아요!</button>' +
        '</div>';
      document.getElementById("result-ok").onclick = function () {
        SM.openInfo(current);
      };
    } else {
      body.innerHTML =
        '<div class="thief-stage result fail">' +
          '<div class="thief-scene">' +
            '<img class="thief-img" src="' + thiefImg("thief_angry") + '" alt="화난 도굴꾼" />' +
            '<div class="thief-bubble angry">“흐흐, 실력이 부족하군! 여긴 내가 접수한다. 썩 물러가!”</div>' +
          '</div>' +
          '<div class="result-banner fail">😢 사수 실패…</div>' +
          '<div class="result-sub">' + totalQ + '문제 중 ' + quizState.correct + '개 정답<br>' + need + '개 이상 맞히면 도굴꾼을 쫓아낼 수 있어요. 다시 도전!</div>' +
          '<button class="again-btn" id="result-again">다시 도전 ▶</button>' +
        '</div>';
      document.getElementById("result-again").onclick = function () {
        startQuiz();
      };
    }
  }

  // 외부에서 접근(테스트/디버그)
  SM._infoInternals = {
    getCurrent: function () { return current; },
    getQuizState: function () { return quizState; }
  };

  /* ---------------- 건물용 간단 정보창(퀴즈 없음) ---------------- */
  SM.openSimpleInfo = function (info) {
    ensureDom();
    modal.innerHTML =
      '<div class="modal-head">' +
        '<div class="title">' + esc(info.name) +
          '<span class="cat">' + esc(info.category) + '</span>' +
        '</div>' +
        '<button class="close" id="modal-close" aria-label="닫기">×</button>' +
      '</div>' +
      '<div class="modal-body">' +
        photoHtml(info) +
        '<div class="modal-desc">' + esc(info.desc) + '</div>' +
        (info.officialLink
          ? '<a class="modal-link" href="' + esc(info.officialLink) + '" target="_blank" rel="noopener noreferrer">🔗 관련 사이트</a>'
          : "") +
      '</div>';
    overlay.classList.add("show");
    bindPhoto(info);
    document.getElementById("modal-close").onclick = close;
  };
})();
