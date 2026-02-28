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

export class Notify {
    constructor({ position = "top-right", fill_direction = "down" } = {}) {
        this.position = position;
        this.fill_direction = fill_direction;
        this.container_id = "notify_container";
        this.create_container();
    }

    create_container() {
        if ($(`#${this.container_id}`).length) return;
        const style = this.resolve_position_style();
        const dir = this.fill_direction === "up" ? "column-reverse" : "column";
        $("body").append(`<div id="${this.container_id}" class="notify_container" style="position:absolute;${style.position};display:flex;flex-direction:${dir};align-items:${style.align};justify-content:${style.justify};gap:1.5vh;z-index:9999;pointer-events:none;"></div>`);
    }

    resolve_position_style() {
        const map = {
            "top-left": { position: "top:2vh;left:2vw;", align: "flex-start", justify: "flex-start" },
            "top-center": { position: "top:2vh;left:50%;transform:translateX(-50%);", align: "center", justify: "flex-start" },
            "top-right": { position: "top:2vh;right:2vw;", align: "flex-end", justify: "flex-start" },
            "bottom-left": { position: "bottom:2vh;left:2vw;", align: "flex-start", justify: "flex-end" },
            "bottom-center": { position: "bottom:2vh;left:50%;transform:translateX(-50%);", align: "center", justify: "flex-end" },
            "bottom-right": { position: "bottom:2vh;right:2vw;", align: "flex-end", justify: "flex-end" },
            "left-top": { position: "top:2vh;left:2vw;", align: "flex-start", justify: "flex-start" },
            "left-center": { position: "top:50%;left:2vw;transform:translateY(-50%);", align: "flex-start", justify: "center" },
            "left-bottom": { position: "bottom:2vh;left:2vw;", align: "flex-start", justify: "flex-end" },
            "right-top": { position: "top:2vh;right:2vw;", align: "flex-end", justify: "flex-start" },
            "right-center": { position: "top:50%;right:2vw;transform:translateY(-50%);", align: "flex-end", justify: "center" },
            "right-bottom": { position: "bottom:2vh;right:2vw;", align: "flex-end", justify: "flex-end" }
        };
        return map[this.position] || map["top-right"];
    }

    show({ type = "info", header = null, message = "", duration = 4000, icon = null }) {
        if (!message) return;
        const icon_html = icon ? `<i class="${icon} notify_icon"></i>` : "";
        const has_duration = duration > 0;
        const notify = `
            <div class="notify notify_${type} ${has_duration ? 'notify_has_bar' : ''}">
                ${header ? `<div class="notify_header">${header}</div>` : `<div class="notify_body" style="padding-top: 1vh;">${message}</div>`}
                ${header ? `<div class="notify_body">${message}</div>` : ""}
                ${has_duration ? `<div class="notify_bar"><div class="notify_fill"></div></div>` : ""}
            </div>
        `;
        const $el = $(notify);
        $(`#${this.container_id}`).append($el);
        if (has_duration) {
            $el.find(".notify_fill").animate({ width: "0%" }, duration, "linear");
            setTimeout(() => $el.fadeOut(300, () => $el.remove()), duration + 100);
        }
    }
}

/*
const notify = new Notify({
    position: "right-center",
    fill_direction: "up"
});

notify.show({
    type: "success",
    header: "Success",
    message: "Operation completed successfully.",
    icon: "fa-solid fa-check-circle",
    duration: 500000
});

notify.show({
    type: "error",
    header: "Error",
    message: "Something went wrong.",
    icon: "fa-solid fa-times-circle",
    duration: 500000
});

notify.show({
    type: "warning",
    header: "Warning",
    message: "Some basic regular notification.",
    icon: "fa-solid fa-exclamation-circle",
    duration: 0
});

notify.show({
    type: "info",
    message: "Some basic regular notification.",
    icon: "fa-solid fa-exclamation-circle",
    duration: 0
});
*/