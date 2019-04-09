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
        },
        fullscreen: {
            fullscreen: 'Not fullscreen',
            not_fullscreen: 'Fullscreen'
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
            let volume = document.querySelector(`#mp3player${i} .volume_control input[type="range"]`);
            let mute_button = document.querySelectorAll(`#mp3player${i} .controls button`)[1];
            if(audio.volume === 0) {
                setText(mute_button, buttons_values_alternatives.mute.unmute);
                audio.volume = volume.value;
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
        <div class="progress" style="height: ${progressbar_size + 'px'}; ${border}">
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

    document.querySelectorAll('mp4Player').forEach((player, i) => {
        let track = player.getAttribute('src');
        let preload_attr = player.getAttribute('preload');
        let track_name = player.getAttribute('video-name');
        let track_image = player.getAttribute('video-image');
        let progressbar_size = player.getAttribute('narrow-progressbar');
        let width = parseInt(player.getAttribute('width'));
        let height = parseInt(player.getAttribute('height'));
        progressbar_size = !progressbar_size ? 20 : (progressbar_size === 'true' ? 5 : 20);

        let progressbar_color = player.getAttribute('progressbar-color');
        if(!progressbar_color) {
            progressbar_color = 'orange';
        }
        let time_text_color = 'black';
        let border = '';
        if(progressbar_color === 'black' || progressbar_color === '#000000' || progressbar_color === 'rgb(\'0, 0, 0\')' || progressbar_color.indexOf('dark') === 0) {
            time_text_color = 'gray';
            border = 'border: 1px solid white;';
        }

        let init_video = (video, callbacks) => {
            video.addEventListener('volumechange', callbacks.volumizer);
            video.addEventListener('ended', callbacks.finish);
            video.addEventListener('timeupdate', callbacks.updatePlayhead);
        };
        let init_control_buttons = (play, mute, stop, fs, video, callbacks) => {
            stop.style.display = 'none';
            setText(
                mute,
                (video.volume > 0 ? buttons_values_alternatives.mute.unmute : buttons_values_alternatives.mute.mute)
            );
            play.addEventListener('click', callbacks.play_pause);
            mute.addEventListener('click', callbacks.mute_unmute);
            stop.addEventListener('click', callbacks.stop_player);
            fs.addEventListener('click', callbacks.fullscreen);
        };
        let init_volume = (volume, video, volumizer) => {
            volume.addEventListener('change', volumizer);
            volume.value = video.volume;
        };

        console.log(track, track_name, preload_attr);

        let mute_unmute = () => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let mute_button = document.querySelectorAll(`#mp4player${i} .controls button`)[1];
            if(video.volume === 0) {
                setText(mute_button, buttons_values_alternatives.mute.unmute);
                video.volume = 1;
            }
            else {
                setText(mute_button, buttons_values_alternatives.mute.mute);
                video.volume = 0;
            }
        };
        let play_pause = () => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let play_button = document.querySelectorAll(`#mp4player${i} .controls button`)[0];
            let stop_button = document.querySelectorAll(`#mp4player${i} .controls button`)[2];
            if(video.style.display === 'none') {
                video.style.display = 'block';
                document.querySelector(`#mp4player${i} .videoimage`).style.display = 'none';
            }
            if(stop_button.style.display === 'none') {
                stop_button.style.display = buttons_values_alternatives.stop.play;
            }
            if(video.paused) {
                setText(play_button, buttons_values_alternatives.play.play);
                video.play();
            }
            else {
                setText(play_button, buttons_values_alternatives.play.pause);
                video.pause();
            }
        };
        let volumizer = element => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let mute_button = document.querySelectorAll(`#mp4player${i} .controls button`)[1];
            if(element.target.nodeName === 'INPUT' && element.target.getAttribute('type') === 'range') {
                video.volume = element.target.value;
            }
            setText(
                mute_button,
                (video.volume === 0 ? buttons_values_alternatives.mute.mute : buttons_values_alternatives.mute.unmute)
            );
        };
        let finish = track => {
            if(!track) {
                track = document.querySelector(`#mp4player${i} .audiotrack`);
            }
            let play_button = document.querySelectorAll(`#mp4player${i} .controls button`)[0];

            stop_player();
            track.currentTime = 0;
            setText(play_button, buttons_values_alternatives.play.pause);
        };
        let updatePlayhead = () => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let play_head = document.querySelector(`#mp4player${i} .progress`);
            let playback_time = document.querySelector(`#mp4player${i} .playbacktime`);
            let loading = document.querySelector(`#mp4player${i} .progress .loading`);
            play_head.value = video.currentTime;
            let s = video.currentTime % 60;
            let m = (video.currentTime / 60) % 60;
            s = (s >= 10) ? s : "0" + s;
            m = (m >= 10) ? m : "0" + m;
            playback_time.innerHTML = m + ':' + s ;
            loading.style.width = `${play_head.value * 100 / video.duration}%`;
        };
        let updatePlayheadWidthPercentage = percentage => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let play_head = document.querySelector(`#mp4player${i} .progress`);
            let playback_time = document.querySelector(`#mp4player${i} .playbacktime`);
            let loading = document.querySelector(`#mp4player${i} .progress .loading`);
            play_head.value = video.currentTime;
            let s = ((video.duration * 60 * 60) * (percentage / 100)) % 60;
            let m = (((video.duration * 60 * 60) * (percentage / 100)) / 60) % 60;
            s = (s >= 10) ? s : "0" + s;
            m = (m >= 10) ? m : "0" + m;
            playback_time.innerHTML = m + ':' + s ;
            loading.style.width = `${percentage}%`;
        };
        let stop_player = () => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            let stop_button = document.querySelectorAll(`#mp4player${i} .controls button`)[2];
            video.style.display = 'none';
            document.querySelector(`#mp4player${i} .videoimage`).style.display = 'block';
            finish(video);
            video.pause();
            stop_button.style.display = buttons_values_alternatives.stop.stop;
        };
        let fullscreen = () => {
            let video = document.querySelector(`#mp4player${i} .videotrack`);
            (video.requestFullscreen ? video.requestFullscreen() : video.mozRequestFullScreen());
        };
        let progressbar_click = progressbar => {
            let x = progressbar.clientX;
            let width = progressbar.target.offsetWidth;
            let position = x - width;
            let percentage = ( 100 * position ) / width;
            updatePlayheadWidthPercentage(percentage);
            console.log(x, width, position, percentage);
        };

        setText(player, `<div class="mp4player" 
    id="mp4player${i}" style="text-align: center; width: ${width + 'px'}; height: ${height + 'px'};">
    <figure itemprop="track"
            itemscope
            itemtype="https://schema.org/VideoRecording" 
            style="width: ${(width + 50) + 'px'};">
        <div class="videoname">
            <b>${track_name}</b>
        </div>
        <div class="videoimage">
            <img src="${track_image}" 
                 alt="${track_name}" 
                 style="width: ${width + 'px'}; height: ${height + 'px'};"
                 width="${width}" height="${height}" />
        </div>
        <div id="fader"></div>
        <div id="playback"></div>
        <video class="videotrack" style="margin-left: 1%; display: none;" itemprop="video" preload="${preload_attr}" width="${width }" height="${height}">
            <source src='${track}' type='video/mp4'>
            <source src='${track.replace('.mp4', '.webm').replace('/mp4', '/webm')}' type='video/webm'>
        </video>
        <div class="volume_control">
            <input type="range" min="0" max="1" step="any" />
        </div>
        <div class="progress" style="height: ${progressbar_size + 'px'}; ${border}">
            <div class="loading" style="background-color: ${progressbar_color}; width: 0;"></div>
            <span class="playbacktime" style="color: ${time_text_color};">00:00</span>
        </div>
        <div class="controls">
            <button class="play" type="button">${buttons_values_alternatives.play.pause}</button>
            <button class="mute" type="button"></button>
            <button class="stop" type="button">${buttons_values_alternatives.stop.value}</button>
            <button class="fullscreen" type="button">${buttons_values_alternatives.fullscreen.not_fullscreen}</button>
        </div>
    </figure>
</div>`);

        let controls_buttons = document.querySelectorAll(`#mp4player${i} .controls button`);
        let video = document.querySelector(`#mp4player${i} .videotrack`);
        let volume_control = document.querySelector(`#mp4player${i} .volume_control input`);
        let play_button = controls_buttons[0];
        let mute_button = controls_buttons[1];
        let stop_button = controls_buttons[2];
        let fs_button = controls_buttons[3];
        init_control_buttons(play_button, mute_button, stop_button, fs_button, video, {
            play_pause: play_pause,
            mute_unmute: mute_unmute,
            stop_player: stop_player,
            fullscreen: fullscreen
        });
        init_video(video, {
            volumizer: volumizer,
            finish: finish,
            updatePlayhead: updatePlayhead
        });
        init_volume(volume_control, video, volumizer);
        document.querySelector(`#mp4player${i} .progress`).addEventListener('click', progressbar_click)

    });
});