(function() {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var siteNav = document.querySelector('[data-site-nav]');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function(slide, position) {
                slide.classList.toggle('is-active', position === current);
            });

            dots.forEach(function(dot, position) {
                dot.classList.toggle('is-active', position === current);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5000);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (previous) {
            previous.addEventListener('click', function() {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                var index = Number(dot.getAttribute('data-hero-dot'));
                showSlide(index);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function(panel) {
        var root = panel.parentElement;
        var input = panel.querySelector('[data-filter-input]');
        var yearSelect = panel.querySelector('[data-year-filter]');
        var regionSelect = panel.querySelector('[data-region-filter]');
        var resetButton = panel.querySelector('[data-filter-reset]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-filter-list] .movie-card'));
        var empty = root.querySelector('[data-filter-empty]');

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(input && input.value);
            var year = normalize(yearSelect && yearSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var visibleCount = 0;

            cards.forEach(function(card) {
                var searchable = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var matched = true;

                if (keyword && searchable.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                if (region && cardRegion !== region) {
                    matched = false;
                }

                card.hidden = !matched;

                if (matched) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.hidden = visibleCount !== 0;
            }
        }

        [input, yearSelect, regionSelect].forEach(function(control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function() {
                if (input) {
                    input.value = '';
                }

                if (yearSelect) {
                    yearSelect.value = '';
                }

                if (regionSelect) {
                    regionSelect.value = '';
                }

                applyFilter();
            });
        }
    });
})();
