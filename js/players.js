'use strict';

window.addEventListener('load', () => {
    let setText = (e, text) => {
        e.innerHTML = text;
    };

    let setTextButton = (e, text) => {
        e.value = text;
    };

    let audioPlayers = document.querySelectorAll('mp3Player');
    audioPlayers.forEach((player, i) => {
        let track = player.getAttribute('src');
        let preload_attr = player.getAttribute('preload');
        let trackname = player.getAttribute('trackname');
        let trackimage = player.getAttribute('trackimage');
        console.log(track, trackname, preload_attr);
        let mute_unmute = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelector(`#mp3player${i} .controls`)[3];
            if(audio.volume === 0) {
                setText(mute_button, "Mute");
                audio.volume = 1;
            }
            else {
                setText(mute_button, 'Unmute');
                audio.volume = 0;
            }
        };
        let play_pause = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let play_button = document.querySelector(`#mp3player${i} .controls`)[1];
            if(audio.paused) {
                setText(play_button, "Pause");
                audio.play();
            }
            else {
                setText(play_button, 'Play');
                audio.pause();
            }
        };
        let volumizer = volume => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelector(`#mp3player${i} .audiotrack`)[3];
            if(audio.volume === 0) {
                setText(mute_button, "Unmute");
            }
            else {
                setText(mute_button, "Mute");
            }
        };
        let finish = track => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let play_button = document.querySelector(`#mp3player${i} .controls`)[1];

            audio.currentTime = 0;
            setText(play_button, 'Play');
        };
        let updatePlayhead = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let playhead = document.querySelector(`#mp3player${i} .progress`);
            let playbacktime = document.querySelector(`#mp3player${i} .playbacktime`);
            playhead.value = audio.currentTime;
            let s = parseInt(audio.currentTime % 60);
            let m = parseInt((audio.currentTime / 60) % 60);
            s = (s >= 10) ? s : "0" + s;
            m = (m >= 10) ? m : "0" + m;
            playbacktime.innerHTML = m + ':' + s ;

        };
        let stop_player = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            finish(audio);
            audio.pause();
        };
        setText(
            player,
            `
<div class="mp3player" 
    id="mp3player${i}">
    <figure itemprop="track"
            itemscope
            itemtype="https://schema.org/MusicRecording">
        <div class="trackname">
            <b>${trackname}</b>
        </div>
        <div class="trackimage">
            <img src="${trackimage}" 
                 alt="${trackname}" 
                 width="150" height="150" />
        </div>
        <figcaption>
            <div class="time">
                Time
                <span class="playbacktime">
                    00:00 
                </span>
            </div>
        </figcaption>
        <meta itemprop="duration" 
                content="PT2M29S">
        <div id="fader"></div>
        <div id="playback"></div>
        <audio 
            src="${track}" 
            class="audiotrack" 
            preload="${preload_attr}"
            itemprop="audio"></audio>
        <div class="volume_control">
            <input type="range" min="0" max="1" step="any" value="1" />
        </div>
        <div class="progress"></div>
        <div class="controls">
            <button class="play" type="button">Play</button>
            <button class="mute" type="button">Mute</button>
            <button class="stop" type="button">Stop</button>
        </div>
    </figure>
</div>`);
        let controls_buttons = document.querySelector(`#mp3player${i} .controls`);
        let audio = document.querySelector(`#mp3player${i} .audiotrack`);
        let play_button = controls_buttons.childNodes[1];
        let mute_button = controls_buttons.childNodes[3];
        let stop_button = controls_buttons.childNodes[5];
        play_button.addEventListener('click', play_pause);
        mute_button.addEventListener('click', mute_unmute);
        stop_button.addEventListener('click', stop_player);
        audio.addEventListener('volumechange', volumizer);
        audio.addEventListener('ended', finish);
        audio.addEventListener('timeupdate', updatePlayhead);
    });
});