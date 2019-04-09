// Sample Media Player using HTML5's Media API
//
// Ian Devlin (c) 2012
// http://iandevlin.com
// http://twitter.com/iandevlin
//
// This was written as part of an article for the February 2013 edition of .net magazine (http://netmagazine.com/)

// Wait for the DOM to be loaded before initialising the media player
document.addEventListener("DOMContentLoaded", function () {
    initialiseMediaPlayer();
}, false);

// Variables to store handles to various required elements
let mediaPlayer;
let playPauseBtn;
let muteBtn;
let progressBar;

function initialiseMediaPlayer() {
    // Get a handle to the player
    mediaPlayer = document.getElementById('media-video');

    // Get handles to each of the buttons and required elements
    playPauseBtn = document.getElementById('play-pause-button');
    muteBtn = document.getElementById('mute-button');
    progressBar = document.getElementById('progress-bar');

    // Hide the browser's default controls
    mediaPlayer.controls = false;

    // Add a listener for the timeupdate event so we can update the progress bar
    mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);

    // Add a listener for the play and pause events so the buttons state can be updated
    mediaPlayer.addEventListener('play', function () {
        // Change the button to be a pause button
        changeButtonType(playPauseBtn, 'pause');
    }, false);
    mediaPlayer.addEventListener('pause', function () {
        // Change the button to be a play button
        changeButtonType(playPauseBtn, 'play');
    }, false);

    // need to work on this one more...how to know it's muted?
    mediaPlayer.addEventListener('volumechange', function (e) {
        // Update the button to be mute/unmute
        if (mediaPlayer.muted) changeButtonType(muteBtn, 'unmute');
        else changeButtonType(muteBtn, 'mute');
    }, false);
    mediaPlayer.addEventListener('ended', function () {
        this.pause();
    }, false);
}

function togglePlayPause() {
    // If the mediaPlayer is currently paused or has ended
    if (mediaPlayer.paused || mediaPlayer.ended) {
        // Change the button to be a pause button
        changeButtonType(playPauseBtn, 'pause');
        // Play the media
        mediaPlayer.play();
    }
    // Otherwise it must currently be playing
    else {
        // Change the button to be a play button
        changeButtonType(playPauseBtn, 'play');
        // Pause the media
        mediaPlayer.pause();
    }
}

// Stop the current media from playing, and return it to the start position
function stopPlayer() {
    mediaPlayer.pause();
    mediaPlayer.currentTime = 0;
}

// Changes the volume on the media player
function changeVolume(direction) {
    if (direction === '+') mediaPlayer.volume += mediaPlayer.volume === 1 ? 0 : 0.1;
    else mediaPlayer.volume -= (mediaPlayer.volume === 0 ? 0 : 0.1);
    mediaPlayer.volume = parseFloat(mediaPlayer.volume).toFixed(1);
}

// Toggles the media player's mute and unmute status
function toggleMute() {
    if (mediaPlayer.muted) {
        // Change the cutton to be a mute button
        changeButtonType(muteBtn, 'mute');
        // Unmute the media player
        mediaPlayer.muted = false;
    } else {
        // Change the button to be an unmute button
        changeButtonType(muteBtn, 'unmute');
        // Mute the media player
        mediaPlayer.muted = true;
    }
}

// Replays the media currently loaded in the player
function replayMedia() {
    resetPlayer();
    mediaPlayer.play();
}

// Update the progress bar
function updateProgressBar() {
    // Work out how much of the media has played via the duration and currentTime parameters
    let percentage = Math.floor((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
    // Update the progress bar's value
    progressBar.value = percentage;
    // Update the progress bar's text (for browsers that don't support the progress element)
    progressBar.innerHTML = percentage + '% played';
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonType(btn, value) {
    btn.title = value;
    btn.innerHTML = value;
    btn.className = value;
}

// Loads a video item into the media player
function loadVideo() {
    let arguments = arguments.length === 1 && typeof arguments === 'object' ? arguments[0] : arguments;

    for (let i = 0; i < arguments.length; i++) {
        let file = arguments[i].split('.');
        let ext = file[file.length - 1];
        // Check if this media can be played
        if (canPlayVideo(ext)) {
            // Reset the player, change the source file and load it
            resetPlayer();
            mediaPlayer.src = 'medias/videos/' + ext + '/' + arguments[i];
            mediaPlayer.load();
            break;
        }
    }
}

// Checks if the browser can play this particular type of file or not
function canPlayVideo(ext) {
    let ableToPlay = mediaPlayer.canPlayType('video/' + ext);
    return ableToPlay !== '';
}

// Resets the media player
function resetPlayer() {
    // Reset the progress bar to 0
    progressBar.value = 0;

    // Move the media back to the start
    mediaPlayer.currentTime = 0;

    // Ensure that the play pause button is set as 'play'
    changeButtonType(playPauseBtn, 'play');
}

window.addEventListener('load', () => {

    let _video = document.querySelector('#media-video');
    let video_duration = _video.duration;

    document.querySelectorAll('.play-item').forEach(elem => {
        // if (elem.getAttribute('data-type') !== 'time') {
            elem.innerHTML = elem.getAttribute('data-name');
            elem.addEventListener('click', () => {
                let video = elem.getAttribute('data-video');
                let exts = JSON.parse(elem.getAttribute('data-formats'));
                let videos = [];
                for (let i = 0; i < exts.length; i++) {
                    videos.push(video + '.' + exts[i]);
                }
                loadVideo(videos);
                if(elem.getAttribute('data-type') === 'video') {
                    video_duration = _video.duration;
                }
                if (elem.getAttribute('data-type') === 'time') {
                    let time = elem.getAttribute('data-time');
                    let h = parseInt(time.split(':')[0]);
                    let m = parseInt(time.split(':')[1]);
                    let s = parseInt(time.split(':')[2]);

                    let _time = (h * 3600) + (m * 60) + s;
                    _video.currentTime = _time;
                    _video.play();
                }
            });

            // window.addEventListener('load', () => {
            //     let video_container = document.querySelector('.mejs-mediaelement');
            //     let div = document.createElement('div');
            //     div.classList.add('video_anchores_links');
            //     div.style.display = 'inline-block';
            //     video_container.append(div);
            //     video_container.style.width = '750px';
            //     let video = document.querySelector('.mejs-mediaelement #video-1286-1');
            //     video.style.display = 'inline-block';
            //     let anchores = {'DBB': {h: 0, m: 0, s: 5}, 'Syntaxe': {h: 0, m: 0, s: 10}};
            //     let anchores_title = document.createElement('h3');
            //     anchores_title.innerHTML = 'Parties de video';
            //     div.append(anchores_title);
            //     for(let anchor in anchores) {
            //         let link = document.createElement('a');
            //         link.href = '#';
            //         link.innerHTML = anchor;
            //         link.addEventListener('click', e => {
            //             e.preventDefault();
            //             let anchor = anchores[e.target.innerHTML];
            //             let secondes = (anchor.h * 3600) + (anchor.m * 60) + anchor.s;
            //             video.currentTime = secondes;
            //             video.play();
            //         });
            //         div.append(link);
            //         div.append(document.createElement('br'));
            //     }
            //     div.style.height = '100%';
            //     div.style.position = 'absolute';
            //     div.style.padding = '5px';
            //     console.log(anchores);
            // });
        // }
    });
});
