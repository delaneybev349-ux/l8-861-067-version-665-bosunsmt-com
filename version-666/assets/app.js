(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  function normalize(text) {
    return (text || "").toString().toLowerCase().trim();
  }

  function runFilter(input) {
    var list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }

    var query = normalize(input.value);
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var matched = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var visible = !query || text.indexOf(query) !== -1;
      card.toggleAttribute("data-hidden", !visible);
      if (visible) {
        matched += 1;
      }
    });

    var empty = list.querySelector(".no-results");

    if (!empty) {
      empty = document.createElement("div");
      empty.className = "no-results";
      empty.textContent = "没有找到匹配内容";
      list.appendChild(empty);
    }

    empty.toggleAttribute("data-hidden", matched !== 0);
  }

  var filterInput = document.querySelector(".filter-input");

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");

    if (initial) {
      filterInput.value = initial;
    }

    filterInput.addEventListener("input", function () {
      runFilter(filterInput);
    });

    runFilter(filterInput);
  }

  function startStage(stage) {
    var video = stage.querySelector("video");
    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    if (!stream) {
      return;
    }

    stage.classList.add("is-playing");

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    if (stage.getAttribute("data-ready") === "1") {
      playVideo();
      return;
    }

    stage.setAttribute("data-ready", "1");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      playVideo();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      hls.on(window.Hls.Events.ERROR, function () {
        playVideo();
      });
      video._hlsInstance = hls;
      playVideo();
      return;
    }

    video.src = stream;
    video.addEventListener("loadedmetadata", playVideo, { once: true });
    playVideo();
  }

  document.querySelectorAll(".player-stage").forEach(function (stage) {
    var button = stage.querySelector(".player-start");
    var video = stage.querySelector("video");

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        startStage(stage);
      });
    }

    stage.addEventListener("click", function () {
      if (stage.getAttribute("data-ready") !== "1") {
        startStage(stage);
      }
    });

    if (video) {
      video.addEventListener("play", function () {
        stage.classList.add("is-playing");
      });
    }
  });
})();
