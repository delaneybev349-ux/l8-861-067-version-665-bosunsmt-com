(function() {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var summary = document.getElementById('searchSummary');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    function escapeHTML(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function(tag) {
            return '<span>' + escapeHTML(tag) + '</span>';
        }).join('');

        return [
            '<a class="movie-card" href="' + escapeHTML(movie.url) + '">',
            '    <div class="poster">',
            '        <img src="' + escapeHTML(movie.cover) + '" alt="' + escapeHTML(movie.title) + '" loading="lazy" />',
            '        <span class="card-category">' + escapeHTML(movie.category) + '</span>',
            '    </div>',
            '    <div class="movie-body">',
            '        <h3>' + escapeHTML(movie.title) + '</h3>',
            '        <p>' + escapeHTML(movie.oneLine) + '</p>',
            '        <div class="meta-line">',
            '            <span>' + escapeHTML(movie.year) + '</span>',
            '            <span>' + escapeHTML(movie.region) + '</span>',
            '        </div>',
            '        <div class="tag-row">' + tags + '</div>',
            '    </div>',
            '</a>'
        ].join('\n');
    }

    function runSearch(keyword) {
        var text = normalize(keyword);
        var movies = window.MOVIE_INDEX || [];

        if (input) {
            input.value = keyword;
        }

        if (!text) {
            results.innerHTML = '';
            summary.textContent = '请输入关键词开始搜索。';
            return;
        }

        var matched = movies.filter(function(movie) {
            var searchable = [
                movie.title,
                movie.year,
                movie.region,
                movie.type,
                movie.genre,
                movie.oneLine,
                movie.category,
                (movie.tags || []).join(' ')
            ].join(' ').toLowerCase();

            return searchable.indexOf(text) !== -1;
        });

        summary.textContent = '关键词“' + keyword + '”共找到 ' + matched.length + ' 部影片。';
        results.innerHTML = matched.slice(0, 240).map(cardTemplate).join('\n');

        if (matched.length > 240) {
            summary.textContent += ' 当前显示前 240 部，请继续细化关键词。';
        }
    }

    runSearch(query);
})();
