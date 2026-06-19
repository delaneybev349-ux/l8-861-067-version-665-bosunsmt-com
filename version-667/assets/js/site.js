(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  var prev = document.querySelector('.hero-control.prev');
  var next = document.querySelector('.hero-control.next');
  if (prev) {
    prev.addEventListener('click', function () {
      setSlide(current - 1);
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      setSlide(current + 1);
    });
  }
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
    });
  });
  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var queryInput = document.querySelector('[data-search-input]');
  var resultCards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function filterCards(value) {
    var keyword = String(value || '').trim().toLowerCase();
    var visible = 0;
    resultCards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search-card') || '').toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.style.display = visible ? 'none' : '';
    }
  }

  if (queryInput && resultCards.length) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || queryInput.value || '';
    queryInput.value = initial;
    filterCards(initial);
    queryInput.addEventListener('input', function () {
      filterCards(queryInput.value);
    });
  }
})();
