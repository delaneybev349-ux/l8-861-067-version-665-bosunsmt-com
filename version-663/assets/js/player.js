import { H as Hls } from './hls.js';

export function initializeVideoPlayer(videoSelector, layerSelector, source) {
    var video = document.querySelector(videoSelector);
    var layer = document.querySelector(layerSelector);
    var loaded = false;
    var hls = null;

    if (!video) {
        return;
    }

    var load = function () {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    };

    var play = function () {
        load();

        if (layer) {
            layer.classList.add('is-hidden');
        }

        var request = video.play();

        if (request && typeof request.catch === 'function') {
            request.catch(function () {});
        }
    };

    if (layer) {
        layer.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', function () {
        if (layer) {
            layer.classList.add('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
