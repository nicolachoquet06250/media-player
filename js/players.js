'use strict';

window.addEventListener('load', () => {
    let setText = (e, text) => {
        e.innerHTML = text;
    };
    let buttons_values_alternatives = {
        play: {
            play: 'Pause',
            pause: 'Play'
        },
        mute: {
            mute: 'Unmute',
            unmute: 'Mute'
        },
        stop: {
            stop: 'none',
            play: 'inline-block',
            value: 'Stop'
        }
    };

    document.querySelectorAll('mp3Player').forEach((player, i) => {
        let track = player.getAttribute('src');
        let preload_attr = player.getAttribute('preload');
        let track_name = player.getAttribute('track-name');
        let track_image = player.getAttribute('track-image');
        let progressbar_size = player.getAttribute('narrow-progressbar');
        progressbar_size = !progressbar_size ? 20 : (progressbar_size === 'true' ? 5 : 20);

        let progressbar_color = player.getAttribute('progressbar-color');
        if(!progressbar_color) {
            progressbar_color = 'orange';
        }
        let time_text_color = 'black';
        let border = '';
        if(progressbar_color === 'black' || progressbar_color === '#000000' || progressbar_color === 'rgb(\'0, 0, 0\')') {
            time_text_color = 'gray';
            border = 'border: 1px solid white;';
        }

        let init_audio = (audio, callbacks) => {
            audio.addEventListener('volumechange', callbacks.volumizer);
            audio.addEventListener('ended', callbacks.finish);
            audio.addEventListener('timeupdate', callbacks.updatePlayhead);
        };
        let init_control_buttons = (play, mute, stop, audio, callbacks) => {
            stop.style.display = 'none';
            setText(
                mute,
                (audio.volume > 0 ? buttons_values_alternatives.mute.unmute : buttons_values_alternatives.mute.mute)
            );
            play.addEventListener('click', callbacks.play_pause);
            mute.addEventListener('click', callbacks.mute_unmute);
            stop.addEventListener('click', callbacks.stop_player);
        };
        let init_volume = (volume, audio, volumizer) => {
            volume.addEventListener('change', volumizer);
            volume.value = audio.volume;
        };

        console.log(track, track_name, preload_attr);

        let mute_unmute = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelectorAll(`#mp3player${i} .controls button`)[1];
            if(audio.volume === 0) {
                setText(mute_button, buttons_values_alternatives.mute.unmute);
                audio.volume = 1;
            }
            else {
                setText(mute_button, buttons_values_alternatives.mute.mute);
                audio.volume = 0;
            }
        };
        let play_pause = () => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let play_button = document.querySelectorAll(`#mp3player${i} .controls button`)[0];
            let stop_button = document.querySelectorAll(`#mp3player${i} .controls button`)[2];
            if(stop_button.style.display === 'none') {
                stop_button.style.display = buttons_values_alternatives.stop.play;
            }
            if(audio.paused) {
                setText(play_button, buttons_values_alternatives.play.play);
                audio.play();
            }
            else {
                setText(play_button, buttons_values_alternatives.play.pause);
                audio.pause();
            }
        };
        let volumizer = element => {
            let audio = document.querySelector(`#mp3player${i} .audiotrack`);
            let mute_button = document.querySelectorAll(`#mp3player${i} .controls button`)[1];
            if(element.target.nodeName === 'INPUT' && element.target.getAttribute('type') === 'range') {
                audio.volume = element.target.value;
            }
            setText(
                mute_button,
                (audio.volume === 0 ? buttons_values_alternatives.mute.mute : buttons_values_alternatives.mute.unmute)
            );
        };
        let finish = track => {
            if(!track) {
                track = document.querySelector(`#mp3player${i} .audiotrack`);
            }
            let play_button = document.querySelectorAll(`#mp3player${i} .controls button`)[0];

            track.currentTime = 0;
            setText(play_button, buttons_values_alternatives.play.pause);
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
            stop_button.style.display = buttons_values_alternatives.stop.stop;
        };

        setText(player, `<div class="mp3player" 
    id="mp3player${i}">
    <figure itemprop="track"
            itemscope
            itemtype="https://schema.org/MusicRecording">
        <div class="trackname">
            <b>${track_name}</b>
        </div>
        <div class="trackimage">
            <img src="${track_image}" 
                 alt="${track_name}" 
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
        <div class="progress" style="height: ${progressbar_size}px; ${border}">
            <div class="loading" style="background-color: ${progressbar_color}; width: 0;"></div>
            <span class="playbacktime" style="color: ${time_text_color};">00:00</span>
        </div>
        <div class="controls">
            <button class="play" type="button">${buttons_values_alternatives.play.pause}</button>
            <button class="mute" type="button"></button>
            <button class="stop" type="button">${buttons_values_alternatives.stop.value}</button>
        </div>
    </figure>
</div>`);

        let controls_buttons = document.querySelectorAll(`#mp3player${i} .controls button`);
        let audio = document.querySelector(`#mp3player${i} .audiotrack`);
        let volume_control = document.querySelector(`#mp3player${i} .volume_control input`);
        let play_button = controls_buttons[0];
        let mute_button = controls_buttons[1];
        let stop_button = controls_buttons[2];
        init_control_buttons(play_button, mute_button, stop_button, audio, {
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