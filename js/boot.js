(function boot() {
    var loading = document.getElementById("loading");
    function showError() { loading.classList.add("error"); }

    if (typeof L === "undefined") { showError(); return; }

    window.SeoulMap.init()
      .then(function () {
        loading.classList.add("hidden");
        if (typeof window.SeoulMap.recolorAll === "function") {
          window.SeoulMap.recolorAll();   // 구별 진행도 색 + 배지 갱신
        }
      })
      .catch(function (e) {
        console.error(e);
        showError();
      });
  })();
