/*
--------------------------------------------------

This file is part of PLUCK.
You are free to use these files within your own resources.
Please retain the original credit and attached MIT license.
Support honest development.

Author: Case @ BOII Development
License: https://github.com/boiidevelopment/pluck/blob/main/LICENSE
GitHub: https://github.com/boiidevelopment/pluck

--------------------------------------------------
*/

import { get_base_path } from "./../utils.js";

export class AudioPlayer {
    constructor(autoplay = true, randomize = true) {
        this.audio = new Audio();
        this.tracklist = [];
        this.current_index = 0;
        this.volume_levels = [0, 0.5, 1];
        this.volume_index = 1;
        this.audio.volume = this.volume_levels[this.volume_index];
        this.randomize = randomize;
        this.autoplay = autoplay;
        this.init();
    }

    async init() {
        const base = get_base_path();
        await this.load_json_data([`${base}/ui/data/tracklist.json`]);

        if (this.tracklist.length === 0) return;

        this.current_index = this.randomize
            ? Math.floor(Math.random() * this.tracklist.length)
            : 0;

        this.setup_controls();
        this.play_song(this.current_index, this.autoplay);
    }

    async load_json_data(file_paths) {
        const promises = file_paths.map(path => $.getJSON(path));
        try {
            const results = await Promise.all(promises);
            this.tracklist = results[0];
        } catch (error) {
            console.error("Failed to load JSON data:", error);
        }
    }

    play_song(index, autoplay = true) {
        const song = this.tracklist[index];
        const base = get_base_path();

        this.audio.pause();
        this.audio.src = `${base}/ui/assets/audio/${song.file}`;
        this.audio.load();

        this.update_ui(song);

        if (autoplay) {
            this.audio.play().then(() => {
                this.update_play_icon();
            }).catch(() => {
                this.update_play_icon();
            });
        } else {
            this.update_play_icon();
        }
    }

    update_play_icon() {
        const icon = $("#toggle_play_pause i");
        if (!icon.length) return;

        icon.removeClass("fa-play fa-pause").addClass("fa-solid").addClass(this.audio.paused ? "fa-play" : "fa-pause");
    }

    get_html() {
        return `
            <div class="audio_player">
                <div class="audio_info">
                    <div class="audio_info_left">
                        <div class="audio_artwork" id="song_artwork"></div>
                        <div class="audio_text">
                            <span id="current_song_title">Loading...</span><br>
                            <span id="current_song_artist">Loading...</span> 
                        </div>
                    </div>
                    <div class="audio_controls">
                        <button id="volume_control"></button>
                        <button id="toggle_play_pause"><i class="fa-solid fa-pause"></i></button>    
                        <button id="prev_song"><i class="fa-solid fa-backward"></i></button>
                        <button id="next_song"><i class="fa-solid fa-forward"></i></button>
                    </div>
                </div>
                <div class="audio_progress">
                    <div id="progress_bar" class="progress_bar"></div>
                </div>
            </div>
        `;
    }

    update_ui(song) {
        const base = get_base_path();
        $("#progress_bar").css("width", "0%");
        $("#song_artwork").css("background-image", song.artwork ? `url(${base}/ui/assets/artwork/${song.artwork})` : "");
        $("#current_song_title").text(song.title);
        $("#current_song_artist").text(song.artist);
    }

    setup_controls() {
        this.audio.onended = () => {
            this.current_index = (this.current_index + 1) % this.tracklist.length;
            this.play_song(this.current_index);
        };

        $("#toggle_play_pause").click(() => {
            if (this.audio.paused) this.audio.play();
            else this.audio.pause();
            this.update_play_icon();
        });

        this.audio.onloadedmetadata = () => {
            $("#progress_bar").attr("max", this.audio.duration);
        };

        this.audio.ontimeupdate = () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            $("#progress_bar").css("width", `${progress}%`);
        };

        $("#next_song").click(() => {
            this.current_index = (this.current_index + 1) % this.tracklist.length;
            this.play_song(this.current_index);
        });

        $("#prev_song").click(() => {
            this.current_index =
                (this.current_index - 1 + this.tracklist.length) % this.tracklist.length;
            this.play_song(this.current_index);
        });

        $("#volume_control").click(() => {
            this.volume_index =
                (this.volume_index + 1) % this.volume_levels.length;
            this.audio.volume = this.volume_levels[this.volume_index];
            this.update_volume_icon();
        });

        this.update_volume_icon();
    }

    update_volume_icon() {
        const icon = $("#volume_control");
        icon.removeClass().addClass("fa");

        if (this.audio.volume === 0) icon.addClass("fa-volume-off");
        else if (this.audio.volume <= 0.5) icon.addClass("fa-volume-down");
        else icon.addClass("fa-volume-up");
    }

    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = "";
            this.audio.onended = null;
            this.audio.onloadedmetadata = null;
            this.audio.ontimeupdate = null;
        }

        $("#toggle_play_pause").off("click");
        $("#next_song").off("click");
        $("#prev_song").off("click");
        $("#volume_control").off("click");
    }
}