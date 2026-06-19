(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var buttons = document.querySelectorAll('.mobile-menu-button');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var header = button.closest('header');
        var menu = header ? header.querySelector('.mobile-menu') : null;
        if (!menu) return;
        menu.hidden = !menu.hidden;
      });
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var indicators = Array.prototype.slice.call(document.querySelectorAll('.hero-indicator'));
    if (!slides.length) return;
    var current = 0;
    function show(index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      indicators.forEach(function (indicator, i) {
        indicator.classList.toggle('is-active', i === current);
      });
    }
    indicators.forEach(function (indicator, index) {
      indicator.addEventListener('click', function () {
        show(index);
      });
    });
    show(0);
    if (slides.length > 1) {
      window.setInterval(function () {
        show((current + 1) % slides.length);
      }, 5200);
    }
  }

  function setupFilters() {
    var input = document.querySelector('[data-filter-input]');
    var year = document.querySelector('[data-filter-year]');
    var genre = document.querySelector('[data-filter-genre]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-search]'));
    if (!cards.length) return;
    function apply() {
      var q = normalize(input && input.value);
      var y = normalize(year && year.value);
      var g = normalize(genre && genre.value);
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var ok = true;
        if (q && haystack.indexOf(q) === -1) ok = false;
        if (y && cardYear !== y) ok = false;
        if (g && cardGenre.indexOf(g) === -1) ok = false;
        card.hidden = !ok;
      });
    }
    [input, year, genre].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) input.value = q;
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
