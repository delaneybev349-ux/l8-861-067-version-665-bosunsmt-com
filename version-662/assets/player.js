(function () {
  function mount(video, source) {
    if (!video || !source) return null;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return null;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return hls;
    }
    video.src = source;
    return null;
  }

  window.MoviePlayer = {
    init: function (source) {
      var video = document.getElementById('movie-video');
      var button = document.querySelector('.player-cover-button');
      mount(video, source);
      function play() {
        if (!video) return;
        if (button) button.classList.add('is-hidden');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
      if (button) {
        button.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('play', function () {
          if (button) button.classList.add('is-hidden');
        });
        video.addEventListener('click', function () {
          if (video.paused) play();
        });
      }
    }
  };
})();
