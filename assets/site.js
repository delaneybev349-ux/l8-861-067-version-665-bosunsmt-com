(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var backTop = document.querySelector('[data-back-top]');

    if (backTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 320) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        });

        backTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    document.querySelectorAll('[data-card-filter]').forEach(function (input) {
        var selector = input.getAttribute('data-card-filter');
        var grid = document.querySelector(selector);

        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                card.hidden = keyword !== '' && text.indexOf(keyword) === -1;
            });
        });
    });

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        var showSlide = function (nextIndex) {
            index = nextIndex;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                showSlide((index + 1) % slides.length);
            }, 5600);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }
})();
