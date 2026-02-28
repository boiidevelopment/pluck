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

import { Modal } from "../core/modal.js"
import { send_nui_callback } from "./../utils.js";

export class Buttons {
    constructor({ buttons = [], classes = "", global = true }) {
        this.buttons = Array.isArray(buttons) ? buttons : Object.values(buttons);
        this.classes = classes;
        this.global = global;
    }

    get_html() {
        return `<div class="button_group ${this.classes}">` + this.buttons.map((b, i) => {
            const id = b.id || `btn_${i}`;
            const dataset = Object.entries(b.dataset || {}).map(([k, v]) => `data-${k}="${v}"`).join(" ");
            const modal = b.modal ? JSON.stringify(b.modal).replace(/'/g, "&apos;").replace(/"/g, "&quot;") : "";
            const icon = b.icon ? `<i class="${b.icon}"></i>` : "";
            return `<button id="${id}" class="${this.global ? "btn" : ""} ${b.class || ""}" data-button="${id}" data-action="${b.action || ""}" ${b.should_close ? 'data-should_close="true"' : ""} ${dataset} data-modal="${modal}">${icon}${b.label || ""}</button>`;
        }).join("") + `</div>`;
    }

    append_to(container = ".content") {
        $(container).append($(this.get_html()));
    }
}

$(document).off("click", ".btn").on("click", ".btn", function () {
    const $btn = $(this);
    const $modal = $btn.closest(".modal");
    const is_modal = $modal.length > 0;

    const action = $btn.data("action");

    if (!action) {
        console.warn("[Buttons] No action defined on clicked button.");
        return;
    }

    if (action === "close_modal" && is_modal) {
        $modal.remove();
        $("#ui_focus").removeClass("active").empty();
        return;
    }

    if (action === "close_builder" && window.ui_instance) {
        if (window.audio_player) {
            window.audio_player.destroy();
            window.audio_player = null;
        }
        window.ui_instance.destroy();
        window.ui_instance = null;
        return;
    }

    const dataset = {};
    let should_close = false;

    for (const attr of $btn[0].attributes) {
        if (attr.name.startsWith("data-") && !["data-modal", "data-action", "data-action_type", "data-button"].includes(attr.name)) {
            const key = attr.name.replace("data-", "").replace(/-+/g, "_");
            if (key === "should_close") {
                should_close = attr.value === "true";
            } else {
                dataset[key] = attr.value;
            }
        }
    }

    const modal_raw = $btn.attr("data-modal");
    if (modal_raw && !is_modal) {
        try {
            const parsed = JSON.parse(modal_raw.replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
            Modal.show(parsed);
            return;
        } catch (e) {
            console.error("[Buttons] Failed to parse modal JSON:", e);
            return;
        }
    }

    if (is_modal) {
        $modal.find("input, select, textarea").each(function () {
            const $el = $(this);
            const key = $el.attr("name") || $el.attr("id");
            if (!key) return;

            let val;
            if ($el.is(":checkbox")) val = $el.is(":checked");
            else val = $el.val();

            dataset[key] = val;

            for (const attr of $el[0].attributes) {
                if (attr.name.startsWith("data-")) {
                    const key = attr.name.slice(5).replace(/-+/g, "_");
                    dataset[key] = attr.value;
                }
            }
        });

        $modal.find(".modal_select").each(function () {
            const id = $(this).data("id");
            const val = $(this).attr("data-value");
            const source = $(this).attr("data-source");
            if (id) dataset[id] = val;
            if (source) dataset.source = source;
        });

        $("#ui_focus").removeClass("active").empty();
    }

    send_nui_callback(action, dataset, { should_close }).then(() => {
        if (should_close && window.ui_instance) {
            if (window.audio_player) {
                window.audio_player.destroy();
                window.audio_player = null;
            }
            window.ui_instance.destroy();
            window.ui_instance = null;
        }
    }).catch((err) => {
        console.error("[Buttons] Callback failed:", err);
    });
});