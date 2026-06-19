(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-main-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var active = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = parseInt(dot.getAttribute("data-hero-dot") || "0", 10);
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(active + 1);
      }, 5000);
    }
  }

  function setupGlobalSearch() {
    Array.prototype.slice.call(document.querySelectorAll("[data-global-search]")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[type='search']");
        var query = input ? input.value.trim() : "";
        window.location.href = "search.html" + (query ? "?q=" + encodeURIComponent(query) : "");
      });
    });
  }

  function setupFiltering() {
    var input = document.querySelector("[data-filter-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var tokens = Array.prototype.slice.call(document.querySelectorAll("[data-filter-token]"));
    if (!input || !cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    if (initialQuery) {
      input.value = initialQuery;
    }

    function normalize(value) {
      return (value || "").toString().toLowerCase().replace(/\s+/g, "");
    }

    function applyFilter(value) {
      var query = normalize(value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.textContent
        ].join(" "));
        card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
      });
    }

    input.addEventListener("input", function () {
      applyFilter(input.value);
    });

    tokens.forEach(function (button) {
      button.addEventListener("click", function () {
        tokens.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        input.value = button.getAttribute("data-filter-token") || "";
        applyFilter(input.value);
      });
    });

    applyFilter(input.value);
  }

  function setupPlayer() {
    var player = document.querySelector("[data-player]");
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-player-button]");
    var json = document.getElementById("player-json");
    if (!player || !video || !button || !json) {
      return;
    }

    var source = "";
    try {
      source = JSON.parse(json.textContent || "{}").source || "";
    } catch (error) {
      source = "";
    }
    if (!source) {
      return;
    }

    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    }

    function start() {
      attach();
      button.classList.add("is-hidden");
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    button.addEventListener("click", start);
    player.addEventListener("click", function (event) {
      if (event.target === video && video.paused) {
        start();
      }
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupGlobalSearch();
    setupFiltering();
    setupPlayer();
  });
})();
