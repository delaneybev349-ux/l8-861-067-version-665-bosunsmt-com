(function () {
  var movies = window.SITE_MOVIES || [];
  var input = document.getElementById('searchInput');
  var year = document.getElementById('searchYear');
  var type = document.getElementById('searchType');
  var region = document.getElementById('searchRegion');
  var button = document.getElementById('searchButton');
  var results = document.getElementById('searchResults');

  if (!input || !results) {
    return;
  }

  function fillOptions(select, values) {
    values.filter(Boolean).sort().reverse().forEach(function (value) {
      if (!Array.prototype.some.call(select.options, function (option) { return option.value === value; })) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      }
    });
  }

  fillOptions(year, Array.from(new Set(movies.map(function (movie) { return movie.year; }))));
  fillOptions(type, Array.from(new Set(movies.map(function (movie) { return movie.type; }))));
  fillOptions(region, Array.from(new Set(movies.map(function (movie) { return movie.region; }))));

  function card(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster" href="./' + escapeHtml(movie.file) + '">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-play">▶</span></a>' +
      '<div class="movie-info"><div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
      '<h2><a href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h2>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p><div class="tag-row">' + tags + '</div>' +
      '<div class="card-actions"><a href="./' + escapeHtml(movie.file) + '">立即观看</a><a href="./category-' + escapeHtml(movie.categorySlug) + '.html">' + escapeHtml(movie.categoryName) + '</a></div></div></article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function runSearch() {
    var keyword = input.value.trim().toLowerCase();
    var selectedYear = year.value;
    var selectedType = type.value;
    var selectedRegion = region.value;
    var matched = movies.filter(function (movie) {
      var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' '), movie.oneLine].join(' ').toLowerCase();
      return (!keyword || haystack.indexOf(keyword) !== -1) &&
        (!selectedYear || movie.year === selectedYear) &&
        (!selectedType || movie.type === selectedType) &&
        (!selectedRegion || movie.region === selectedRegion);
    }).slice(0, 120);
    results.innerHTML = matched.map(card).join('');
    results.classList.toggle('is-empty', matched.length === 0);
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    input.value = params.get('q');
  }

  [input, year, type, region].forEach(function (control) {
    control.addEventListener('input', runSearch);
    control.addEventListener('change', runSearch);
  });

  button.addEventListener('click', runSearch);
  runSearch();
})();
