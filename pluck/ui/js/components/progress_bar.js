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

export class ProgressBar {
    static current = null;
    constructor(data) {
        if (ProgressBar.current) {
            ProgressBar.current.destroy();
        }
        ProgressBar.current = this;

        this.header = data.header || "No header";
        this.duration = data.duration || 5000;
        this._interval_id = null;

        this.create_progress();
    }

    create_progress() {
        if ($('.progress_container').length === 0) {
            $('<div>').addClass('progress_container').appendTo('#ui_focus');
        }
        this.create();
    }

    create() {
        this.progress_end(false);

        const segments = 30;
        let segment_html = "";
        for (let i = 0; i < segments; i++) {
            segment_html += `<div class="progress_segment" data-index="${i}"></div>`;
        }

        const content = `
            <div class="progressbar">
                <div class="progressbar_header">
                    <h3>${this.header}</h3>
                </div>
                <div class="progressbar_body">
                    ${segment_html}
                </div>
            </div>
        `;

        $('.progress_container').stop(true, true).html(content).fadeIn(200);

        this.animate_progressbar(this.duration, segments);
    }

    animate_progressbar(duration, segment_count = 30) {
        if (this._interval_id) clearInterval(this._interval_id);

        const interval = duration / segment_count;
        let current = 0;

        this._interval_id = setInterval(() => {
            const index = segment_count - 1 - current;
            const segment = $(`.progress_segment[data-index="${index}"]`);
            if (segment.length > 0) {
                segment.addClass("progress_segment_used");
            }
            current++;
            if (current >= segment_count) {
                this.progress_end(true);
            }
        }, interval);
    }

    progress_end() {
        if (this._interval_id) {
            clearInterval(this._interval_id);
            this._interval_id = null;
        }

        this.hide_progress();
    }

    hide_progress() {
        $('.progress_container').stop(true, true).fadeOut(300, function () {
            $(this).empty();
        });
    }

    destroy() {
        this.progress_end(false);
        if (ProgressBar.current === this) {
            ProgressBar.current = null;
        }
    }
}


//new ProgressBar({ header: "Uploading...", duration: 800000 });
