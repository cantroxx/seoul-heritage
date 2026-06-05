/* ===== js/firebase_init.js ===== */
/* =========================================================================
 *  firebase_init.js  —  Firebase 연결 초기화 + 데이터 접근 헬퍼
 *  - compat SDK(전역 firebase)를 CDN으로 로드한 뒤 이 파일이 실행됨.
 *  - Firebase Auth + Realtime Database 사용.
 *  전역: window.FB = { ready, db, ... 헬퍼 }
 * ========================================================================= */
(function () {
  "use strict";

  var firebaseConfig = {
    apiKey: "AIzaSyD1KoJQtLBJI8nBi5xZ25jx9WS2Rb9Utro",
    authDomain: "seoul-heritage-9187f.firebaseapp.com",
    databaseURL: "https://seoul-heritage-9187f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "seoul-heritage-9187f",
    storageBucket: "seoul-heritage-9187f.firebasestorage.app",
    messagingSenderId: "770113870315",
    appId: "1:770113870315:web:7a78e30563041cb7d161ae"
  };

  var FB = {
    ready: false,
    authReady: false,
    auth: null,
    db: null,
    authUser: null,
    error: null
  };
  window.FB = FB;

  // firebase 전역이 로드되었는지 확인 후 초기화
  function tryInit() {
    if (typeof firebase === "undefined" || !firebase.initializeApp) {
      FB.error = "Firebase SDK 로드 실패(인터넷 연결 확인)";
      console.warn(FB.error);
      return;
    }
    try {
      firebase.initializeApp(firebaseConfig);
      FB.auth = firebase.auth ? firebase.auth() : null;
      FB.db = firebase.database();
      FB.ready = true;
      initAuth();
      console.log("Firebase 연결됨");
    } catch (e) {
      FB.error = String(e);
      console.error("Firebase 초기화 오류:", e);
    }
  }
  tryInit();

  function adminUids() {
    return (window.ADMIN_CONFIG && window.ADMIN_CONFIG.adminUids || [])
      .filter(function (uid) { return uid && uid.indexOf("REPLACE_") !== 0; });
  }

  function initAuth() {
    if (!FB.auth) return;
    FB.auth.onAuthStateChanged(function (user) {
      FB.authUser = user || null;
      FB.authReady = true;
      if (typeof window.onAdminAuthChanged === "function") {
        window.onAdminAuthChanged(FB.authUser);
      }
    });
  }

  /* ---------- 키 정규화: 번호/닉네임/학교를 안전한 키로 ---------- */
  // Firebase 키에 쓸 수 없는 문자(. # $ [ ] /)와 공백 제거
  function sanitize(s) {
    return String(s == null ? "" : s).trim().replace(/[.#$\[\]\/\s]+/g, "_");
  }
  FB.sanitize = sanitize;

  // 유저 고유 키: 학교__번호__닉네임
  FB.userKey = function (school, number, nick) {
    return sanitize(school) + "__" + sanitize(number) + "__" + sanitize(nick);
  };

  /* ---------- 유저 기록 읽기 ---------- */
  // 콜백(record|null, error) — record 없으면 신규 유저
  FB.loadUser = function (school, number, nick, cb) {
    if (!FB.ready) { cb(null, FB.error || "DB 미연결"); return; }
    var key = FB.userKey(school, number, nick);
    FB.db.ref("users/" + key).once("value")
      .then(function (snap) { cb(snap.exists() ? snap.val() : null, null); })
      .catch(function (e) { cb(null, String(e)); });
  };

  /* ---------- 유저 기록 저장(병합) ---------- */
  FB.saveUser = function (school, number, nick, data, cb) {
    if (!FB.ready) { if (cb) cb(FB.error || "DB 미연결"); return; }
    var key = FB.userKey(school, number, nick);
    FB.db.ref("users/" + key).update(data)
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e)); });
  };

  /* ---------- 관리자 기능 ---------- */
  // 관리자 계정 판별. 실제 삭제 권한은 Realtime Database Rules의 auth.uid 조건이 최종 보호선이다.
  FB.isAdmin = function () {
    return !!(FB.authUser && adminUids().indexOf(FB.authUser.uid) !== -1);
  };

  FB.signInAdmin = function (cb) {
    if (!FB.auth || !firebase.auth.GoogleAuthProvider) { if (cb) cb("Firebase Auth 로드 실패"); return; }
    var provider = new firebase.auth.GoogleAuthProvider();
    FB.auth.signInWithPopup(provider)
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e.message || e)); });
  };

  FB.signOutAdmin = function (cb) {
    if (!FB.auth) { if (cb) cb("Firebase Auth 로드 실패"); return; }
    FB.auth.signOut()
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e.message || e)); });
  };

  function requireAdmin(cb) {
    if (!FB.ready) { if (cb) cb("DB 미연결"); return false; }
    if (!FB.isAdmin()) { if (cb) cb("관리자 로그인이 필요합니다."); return false; }
    return true;
  };

  // 전체 학생 기록(users) 삭제
  FB.adminClearAllUsers = function (cb) {
    if (!requireAdmin(cb)) return;
    FB.db.ref("users").remove()
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e)); });
  };

  // 전체 랭킹(모든 주차) 삭제
  FB.adminClearAllRankings = function (cb) {
    if (!requireAdmin(cb)) return;
    FB.db.ref("rankings").remove()
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e)); });
  };

  // 이번 주 랭킹만 초기화(난이도 양쪽 모두)
  FB.adminClearThisWeekRanking = function (cb) {
    if (!requireAdmin(cb)) return;
    FB.db.ref("rankings/" + FB.weekKey()).remove()
      .then(function () { if (cb) cb(null); })
      .catch(function (e) { if (cb) cb(String(e)); });
  };

  /* ---------- 주간 랭킹 ---------- */
  // 이번 주 키(월요일 기준 ISO 주차). 매주 월요일 초기화 효과.
  FB.weekKey = function () {
    var d = new Date();
    // 월요일을 주 시작으로
    var day = (d.getDay() + 6) % 7; // 월=0..일=6
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  // 랭킹 기록 제출: 난이도별 경로(rankings/{주차}/{diff}/{key})에 최고기록만 갱신
  // entry: { nick, school, number, savedCount, timeMs, cleared }, diff: "normal"|"deep"
  FB.submitRanking = function (entry, cb, diff) {
    if (!FB.ready) { if (cb) cb("DB 미연결"); return; }
    diff = (diff === "deep") ? "deep" : "normal";
    var week = FB.weekKey();
    var key = FB.userKey(entry.school, entry.number, entry.nick);
    var ref = FB.db.ref("rankings/" + week + "/" + diff + "/" + key);
    ref.once("value").then(function (snap) {
      var prev = snap.exists() ? snap.val() : null;
      if (prev && !isBetter(entry, prev)) { if (cb) cb(null); return; }
      ref.set({
        nick: entry.nick, school: entry.school, number: entry.number,
        savedCount: entry.savedCount, timeMs: entry.timeMs,
        cleared: !!entry.cleared, at: Date.now()
      }).then(function () { if (cb) cb(null); }).catch(function (e) { if (cb) cb(String(e)); });
    }).catch(function (e) { if (cb) cb(String(e)); });
  };

  // 더 좋은 기록인가? ①사수 많음 ②같으면 클리어 우선 ③시간 짧음
  function isBetter(a, b) {
    if ((a.savedCount || 0) !== (b.savedCount || 0)) return (a.savedCount || 0) > (b.savedCount || 0);
    var ac = !!a.cleared, bc = !!b.cleared;
    if (ac !== bc) return ac;
    return (a.timeMs || Infinity) < (b.timeMs || Infinity);
  }

  // 이번 주 난이도별 랭킹 불러오기
  FB.loadRankings = function (cb, diff) {
    if (!FB.ready) { cb(null, "DB 미연결"); return; }
    diff = (diff === "deep") ? "deep" : "normal";
    var week = FB.weekKey();
    FB.db.ref("rankings/" + week + "/" + diff).once("value")
      .then(function (snap) {
        var val = snap.val() || {};
        cb(Object.keys(val).map(function (k) { return val[k]; }), null);
      })
      .catch(function (e) { cb(null, String(e)); });
  };

  /* ---------- 전체 유저 불러오기(랭킹용) ---------- */
  FB.loadAllUsers = function (cb) {
    if (!FB.ready) { cb(null, FB.error || "DB 미연결"); return; }
    FB.db.ref("users").once("value")
      .then(function (snap) {
        var val = snap.val() || {};
        var arr = Object.keys(val).map(function (k) { return val[k]; });
        cb(arr, null);
      })
      .catch(function (e) { cb(null, String(e)); });
  };

  /* ---------- 신규 유저 최초 생성 ---------- */
  FB.createUser = function (school, number, nick, cb) {
    var now = Date.now();
    var rec = {
      school: school, number: number, nick: nick,
      createdAt: now, lastSeen: now,
      saved: {},            // { itemId: true }
      savedCount: 0,
      playMs: 0,            // 누적 플레이타임(ms)
      finishedMs: null      // 61개 사수 완료까지 걸린 ms(완료 시 기록)
    };
    FB.saveUser(school, number, nick, rec, function (err) { cb(rec, err); });
  };
})();
