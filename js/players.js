'use strict';

window.addEventListener('load', () => {
    let setText = (e, text) => {
        e.innerHTML = text;
    };

    document.querySelectorAll('mp3Player').forEach((player, i) => {
        let track = player.getAttribute('src');
        let preload_attr = player.getAttribute('preload');
        let trackname = player.getAttribute('trackname');
        let trackimage = player.getAttribute('trackimage');

        let init_audio = (audio, calbacks) => {
            audio.addEventListener('volumechange', calbacks.volumizer);
            audio.addEventListener('ended', calbacks.finish);
            audio.addEventListener('timeupdate', calbacks.updatePlayhead);
        };
        let init_control_buttons = (play, mute, stop, callbacks) => {
            stop.style.display = 'none';
            play.addEventListener('click', callbacks.play_pause);
            mute.addEventListener('click', callbacks.mute_unmute);
            stop.addEventListener('click', callbacks.stop_player);
        };
        let init_volume = (volume, audio, volumizer) => {
            volume.addEventListener('change', volumizer);
            volume.value = audio.volume;
        };

        console.log(track, trackname, preload_attr);

        let mute_unmute = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelectorAll(`#mp3player${i} .controls button`)[1];
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
            let play_button = document.querySelectorAll(`#mp3player${i} .controls button`)[0];
            let stop_button = document.querySelectorAll(`#mp3player${i} .controls button`)[2];
            if(stop_button.style.display === 'none') {
                stop_button.style.display = 'inline-block';
            }
            if(audio.paused) {
                setText(play_button, "Pause");
                audio.play();
            }
            else {
                setText(play_button, 'Play');
                audio.pause();
            }
        };
        let volumizer = element => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelectorAll(`#mp3player${i} .controls button`)[1];
            if(element.target.nodeName === 'INPUT' && element.target.getAttribute('type') === 'range') {
                audio.volume = element.target.value;
            }
            if(audio.volume === 0) {
                setText(mute_button, "Unmute");
            }
            else {
                setText(mute_button, "Mute");
            }
        };
        let finish = track => {
            if(!track) {
                track = document.querySelector(`#mp3player${i} .audiotrack`);
            }
            let play_button = document.querySelectorAll(`#mp3player${i} .controls button`)[0];

            track.currentTime = 0;
            setText(play_button, 'Play');
        };
        let updatePlayhead = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let playhead = document.querySelector(`#mp3player${i} .progress`);
            let playbacktime = document.querySelector(`#mp3player${i} .playbacktime`);
            let loading = document.querySelector(`#mp3player${i} .progress .loading`);
            playhead.value = audio.currentTime;
            let s = parseInt(audio.currentTime % 60);
            let m = parseInt((audio.currentTime / 60) % 60);
            s = (s >= 10) ? s : "0" + s;
            m = (m >= 10) ? m : "0" + m;
            playbacktime.innerHTML = m + ':' + s ;
            loading.style.width = `${playhead.value * 100 / audio.duration}%`;
        };
        let stop_player = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let stop_button = document.querySelectorAll(`#mp3player${i} .controls button`)[2];
            finish(audio);
            audio.pause();
            stop_button.style.display = 'none';
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
            <input type="range" min="0" max="1" step="any" />
        </div>
        <div class="progress">
            <div class="loading" style="width: 0;"></div>
            <span class="playbacktime">00:00</span>
        </div>
        <div class="controls">
            <button class="play" type="button">Play</button>
            <button class="mute" type="button">Mute</button>
            <button class="stop" type="button">Stop</button>
        </div>
    </figure>
</div>`);
        let controls_buttons = document.querySelectorAll(`#mp3player${i} .controls button`);
        let audio = document.querySelector(`#mp3player${i} .audiotrack`);
        let volume_control = document.querySelector(`#mp3player${i} .volume_control input`);
        let play_button = controls_buttons[0];
        let mute_button = controls_buttons[1];
        let stop_button = controls_buttons[2];
        init_control_buttons(play_button, mute_button, stop_button, {
            play_pause: play_pause,
            mute_unmute: mute_unmute,
            stop_player: stop_player
        });

        init_audio(audio, {
            volumizer: volumizer,
            finish: finish,
            updatePlayhead: updatePlayhead
        });

        init_volume(volume_control, audio, volumizer);
    });
});