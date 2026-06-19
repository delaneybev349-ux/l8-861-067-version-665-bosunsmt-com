(function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('[data-mobile-toggle]');

    if (toggle && header) {
        toggle.addEventListener('click', function () {
            header.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;

        var showSlide = function (next) {
            current = (next + slides.length) % slides.length;
            slides.forEach(function (slide, index) {
                slide.classList.toggle('is-active', index === current);
            });
            dots.forEach(function (dot, index) {
                dot.classList.toggle('is-active', index === current);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(index);
                start();
            });
        });

        if (slides.length > 1) {
            showSlide(0);
            start();
        }
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    filterForms.forEach(function (form) {
        var keywordInput = form.querySelector('[data-filter-keyword]');
        var selectInput = form.querySelector('[data-filter-select]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
        var empty = document.querySelector('[data-empty-state]');

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');

        if (initialQuery && keywordInput) {
            keywordInput.value = initialQuery;
        }

        var apply = function () {
            var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
            var selected = selectInput ? selectInput.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags')).toLowerCase();
                var cardCategory = card.getAttribute('data-category') || '';
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchCategory = !selected || selected === cardCategory;
                var match = matchKeyword && matchCategory;

                card.classList.toggle('is-hidden-card', !match);

                if (match) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };

        if (keywordInput) {
            keywordInput.addEventListener('input', apply);
        }

        if (selectInput) {
            selectInput.addEventListener('change', apply);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });

        apply();
    });
})();
