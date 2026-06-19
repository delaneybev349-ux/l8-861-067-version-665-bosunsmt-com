(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.textContent = isOpen ? '×' : '☰';
    });
  }

  var slider = document.querySelector('.hero-slider');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prev = slider.querySelector('.hero-control.prev');
    var next = slider.querySelector('.hero-control.next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide') || 0));
        startTimer();
      });
    });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var filterInput = document.querySelector('[data-card-filter]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var typeSelect = document.querySelector('[data-type-filter]');
  var targets = Array.prototype.slice.call(document.querySelectorAll('.filter-target .movie-card, .filter-target .rank-item'));

  function hydrateSelect(select, attr) {
    if (!select || select.options.length > 1) {
      return;
    }
    var values = [];
    targets.forEach(function (card) {
      var value = card.getAttribute(attr) || '';
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    values.sort().reverse().forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function applyCardFilter() {
    if (!targets.length) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var visible = 0;
    targets.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var ok = (!keyword || haystack.indexOf(keyword) !== -1) && (!year || card.getAttribute('data-year') === year) && (!type || card.getAttribute('data-type') === type);
      card.classList.toggle('is-hidden-card', !ok);
      if (ok) {
        visible += 1;
      }
    });
    var shell = document.querySelector('.filter-target');
    if (shell) {
      shell.classList.toggle('is-empty', visible === 0);
    }
  }

  hydrateSelect(yearSelect, 'data-year');
  hydrateSelect(typeSelect, 'data-type');

  [filterInput, yearSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyCardFilter);
      control.addEventListener('change', applyCardFilter);
    }
  });
})();
