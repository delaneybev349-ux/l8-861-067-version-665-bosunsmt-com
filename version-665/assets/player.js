(function (global) {
    global.setupMoviePlayer = function (source) {
        var shell = document.querySelector('[data-player]');

        if (!shell) {
            return;
        }

        var video = shell.querySelector('video');
        var overlay = shell.querySelector('[data-play-overlay]');
        var status = shell.querySelector('[data-player-status]');
        var initialized = false;
        var hls = null;

        var setStatus = function (message) {
            if (status) {
                status.textContent = message;
            }
        };

        var initialize = function () {
            if (initialized) {
                return true;
            }

            if (!video || !source) {
                setStatus('播放暂时不可用');
                return false;
            }

            if (global.Hls && global.Hls.isSupported()) {
                hls = new global.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(global.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('播放暂时不可用');
                    }
                });
                initialized = true;
                return true;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                initialized = true;
                return true;
            }

            setStatus('播放暂时不可用');
            return false;
        };

        var startPlayback = function () {
            if (!initialize()) {
                return;
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(function () {
                    if (overlay) {
                        overlay.hidden = true;
                    }
                    setStatus('');
                }).catch(function () {
                    setStatus('点击播放');
                });
            } else if (overlay) {
                overlay.hidden = true;
            }
        };

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayback();
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})(window);
