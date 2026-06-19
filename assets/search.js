(function () {
    var grid = document.querySelector('[data-search-grid]');

    if (!grid) {
        return;
    }

    var keywordInput = document.querySelector('[data-search-input]');
    var regionSelect = document.querySelector('[data-search-region]');
    var typeSelect = document.querySelector('[data-search-type]');
    var yearSelect = document.querySelector('[data-search-year]');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);
    var startKeyword = params.get('q') || '';

    if (keywordInput) {
        keywordInput.value = startKeyword;
    }

    var applyFilters = function () {
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        var region = regionSelect ? regionSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardRegion = card.getAttribute('data-region') || '';
            var cardType = card.getAttribute('data-type') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }

            if (region && cardRegion !== region) {
                matched = false;
            }

            if (type && cardType !== type) {
                matched = false;
            }

            if (year && cardYear !== year) {
                matched = false;
            }

            card.hidden = !matched;
        });
    };

    [keywordInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    applyFilters();
})();
