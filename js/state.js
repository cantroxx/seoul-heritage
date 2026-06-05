/* ===== js/state.js ===== */
/* =========================================================================
 *  state.js  —  사수 상태 전역 관리 (난이도별 완전 분리)
 *  - 일반/심층 사수 목록을 별도 Set으로 관리(savedNormal / savedDeep)
 *  - "현재 활성 난이도"의 Set을 바라봄. setDifficulty()로 전환 시 화면 자동 갱신.
 *  의존: window.HERITAGE_DATA
 *  전역: window.GameState
 * ========================================================================= */
(function () {
  "use strict";
  var DATA = window.HERITAGE_DATA || [];
  var KEY_N = "seoul_heritage_saved_normal_v1";
  var KEY_D = "seoul_heritage_saved_deep_v1";

  var byDistrict = {};
  DATA.forEach(function (it) {
    (byDistrict[it.district] = byDistrict[it.district] || []).push(it);
  });

  var savedNormal = loadSet(KEY_N);
  var savedDeep   = loadSet(KEY_D);
  var diff = "normal";                 // 현재 활성 난이도
  var listeners = [];
  var memoryOnly = false;

  function activeSet() { return diff === "deep" ? savedDeep : savedNormal; }
  function activeKey() { return diff === "deep" ? KEY_D : KEY_N; }

  function loadSet(key) {
    try {
      var raw = window.localStorage.getItem(key);
      var arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) { return new Set(); }
  }
  function persist() {
    if (memoryOnly) return;
    try { window.localStorage.setItem(activeKey(), JSON.stringify(Array.from(activeSet()))); }
    catch (e) { /* 메모리 모드 */ }
  }
  function emit() {
    listeners.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  var GameState = {
    // 난이도 전환: 활성 Set 교체 후 화면 갱신
    setDifficulty: function (d) {
      diff = (d === "deep") ? "deep" : "normal";
      emit();
    },
    getDifficulty: function () { return diff; },
    setMemoryOnly: function (on) {
      memoryOnly = !!on;
      if (memoryOnly) {
        savedNormal.clear();
        savedDeep.clear();
        emit();
      }
    },

    isSaved: function (id) { return activeSet().has(id); },

    saveItem: function (id) {
      var s = activeSet();
      if (!s.has(id)) { s.add(id); persist(); emit(); }
    },

    resetAll: function () { activeSet().clear(); persist(); emit(); },

    // Firebase 기록 복원: 난이도별로 각각 복원
    restoreSaved: function (normalObj, deepObj) {
      if (memoryOnly) return;
      function fill(set, obj) {
        set.clear();
        if (!obj) return;
        if (Array.isArray(obj)) obj.forEach(function (id) { set.add(id); });
        else Object.keys(obj).forEach(function (id) { if (obj[id]) set.add(id); });
      }
      fill(savedNormal, normalObj);
      fill(savedDeep, deepObj);
      try {
        window.localStorage.setItem(KEY_N, JSON.stringify(Array.from(savedNormal)));
        window.localStorage.setItem(KEY_D, JSON.stringify(Array.from(savedDeep)));
      } catch (e) {}
      emit();
    },

    // 현재 활성 난이도의 사수 목록
    savedList: function () {
      var arr = []; activeSet().forEach(function (id) { arr.push(id); }); return arr;
    },
    // 특정 난이도 목록(저장용)
    savedListOf: function (d) {
      var set = (d === "deep") ? savedDeep : savedNormal;
      var arr = []; set.forEach(function (id) { arr.push(id); }); return arr;
    },

    itemsIn: function (districtName) { return byDistrict[districtName] || []; },

    getItem: function (id) {
      for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i];
      return null;
    },

    districtStats: function (name) {
      var items = byDistrict[name] || [];
      var total = items.length, s = 0, set = activeSet();
      items.forEach(function (it) { if (set.has(it.id)) s++; });
      var status;
      if (total === 0) status = "empty";
      else if (s === total) status = "all";
      else if (s / total >= 0.5) status = "half";
      else status = "none";
      return { total: total, saved: s, ratio: total ? s / total : 0, status: status };
    },

    totals: function () {
      var s = 0, set = activeSet();
      DATA.forEach(function (it) { if (set.has(it.id)) s++; });
      return { total: DATA.length, saved: s };
    },
    // 특정 난이도 사수 개수(방지턱·판단용)
    totalsOf: function (d) {
      var set = (d === "deep") ? savedDeep : savedNormal, s = 0;
      DATA.forEach(function (it) { if (set.has(it.id)) s++; });
      return { total: DATA.length, saved: s };
    },

    onChange: function (fn) { listeners.push(fn); }
  };

  window.GameState = GameState;
})();
