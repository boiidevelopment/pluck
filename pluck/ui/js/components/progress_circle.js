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

export class ProgressCircle {
    constructor(options) {
        this.settings = {
            font: "Kanit",
            segment_color: "#e4ad29",
            background_color: "rgba(20, 20, 20, 0.9)",
            inactive_color: "rgba(255, 255, 255, 0.25)",
            segment_count: options.segments ?? 30,
            gap_angle: options.gap ?? 3,
            message: options.message,
            duration: options.duration
        };

        this.build();
    }

    build() {
        const { font, message } = this.settings;

        const content = `
            <div id="prog_timer" class="prog_timer">
                <div class="progress_circle">
                    <canvas id="progress_canvas" width="120" height="120"></canvas>
                    <div class="timer" id="timer" style="font-family: ${font};"></div>
                </div>
                <div class="status_message" id="status_message" style="font-family: ${font};">${message}</div>
            </div>
        `;
        $("#ui_focus").append(content);
        $("#prog_timer").fadeIn("slow");

        const canvas = document.getElementById("progress_canvas");
        const ctx = canvas.getContext("2d");
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 30;

        const { segment_color, background_color, inactive_color, segment_count, gap_angle, duration } = this.settings;

        const draw_segments = (progress) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(cx, cy, radius - 4, 0, 2 * Math.PI);
            ctx.fillStyle = background_color;
            ctx.fill();

            const angle_per_segment = (360 / segment_count) * (Math.PI / 180);
            const gap = gap_angle * (Math.PI / 180);
            const segments_to_draw = Math.floor(progress * segment_count);

            for (let i = 0; i < segment_count; i++) {
                const start = (i * angle_per_segment) - (gap / 2);
                const end = start + angle_per_segment - gap;

                ctx.beginPath();
                ctx.arc(cx, cy, radius, start, end);
                ctx.strokeStyle = inactive_color;
                ctx.lineWidth = 4;
                ctx.stroke();

                if (i < segments_to_draw) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, start, end);
                    ctx.strokeStyle = segment_color;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }
        };


        const animate = (timestamp) => {
            if (!this.start_time) this.start_time = timestamp;
            const elapsed = (timestamp - this.start_time) / 1000;
            const time_left = Math.max(0, duration - elapsed);
            const progress = time_left / duration;

            draw_segments(progress);
            $("#timer").text(Math.ceil(time_left));

            if (time_left > 0) {
                requestAnimationFrame(animate);
            } else {
                this.cleanup();
            }
        };

        requestAnimationFrame(animate);
    }

    cleanup() {
        $("#prog_timer").fadeOut("slow", () => {
            $("#prog_timer").remove();
            $.post(`https://${GetParentResourceName()}/circle_end`, JSON.stringify({}));
        });
    }
}

/*
const test_prog_circle = new ProgressCircle({
    message: "Repairing vehicle...",
    duration: 99,
    segments: 15,
    gap: 3
});
*/