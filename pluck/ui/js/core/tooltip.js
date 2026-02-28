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

import { Modal } from "./modal.js";
import { send_nui_callback } from "./../utils.js";

/**
 * @class Tooltip
 * @description Reusable tooltip system with keyboard actions and modal support.
 */
export class Tooltip {
    /**
     * @param {string} [selector="#tooltip"] - jQuery selector for the tooltip container.
     */
    constructor(selector = "#tooltip") {
        this.$el = $(selector);
        if (!this.$el.length) {
            $("body").append(`<div id="tooltip" style="display:none;"></div>`);
            this.$el = $('#tooltip');
        }
        this.bind_keypress();
    }

    /**
     * Sets tooltip content and internal metadata.
     * @param {Object} config
     * @param {Object} config.on_hover
     * @param {boolean} [config.suppress_actions=false]
     */
    set_content({ on_hover = {}, suppress_actions = false }) {
        const { title = "Details", description = [], values = [], actions = [], rarity = "common" } = on_hover;

        const rarity_color = rarity.toLowerCase() !== "common" ? `var(--rarity_${rarity.toLowerCase()})` : "var(--accent)";
        this.$el.css("--tooltip_rarity_colour", rarity_color);

        const desc_html = description.length
            ? `<div class="tooltip_subtitle">Description</div><div class="tooltip_description">${description.map(d => `<p>${d}</p>`).join("")}</div>`
            : "";

        const val_html = values.length
            ? `<div class="tooltip_subtitle">Details</div><div class="tooltip_values"><ul>${values.map(v => `<li>${v.key}: <span style="color:${rarity_color}">${v.value}</span></li>`).join("")}</ul></div>`
            : "";

        const acts_html = actions.length && !suppress_actions
            ? `<div class="tooltip_subtitle">Actions</div><div class="tooltip_actions">${actions.map(a =>
                `<div class="tooltip_key_hint" data-action-id="${a.id}">
                    <span class="tooltip_key">${a.key}</span> ${a.label}
                </div>`).join("")}</div>`
            : "";

        const header_html = `<div class="tooltip_title">${title}<div class="tooltip_rarity">${rarity}</div></div>`;

        this.$el.html(`${header_html}${desc_html}${val_html}${acts_html}`);
        this.$el.data("tooltip_actions", actions);
    }

    /**
     * Show the tooltip at (x, y)
     * @param {number} x
     * @param {number} y
     */
    show(x, y) {
        if ($('#modal_container').length > 0) return;
        const win_w = $(window).width(), win_h = $(window).height();
        const w = this.$el.outerWidth(), h = this.$el.outerHeight();
        const left = (x + 15 + w > win_w) ? x - 15 - w : x + 15;
        const top = (y + 15 + h > win_h) ? y - 15 - h : y + 15;
        this.$el.css({ left, top }).show();
    }

    /** Hides tooltip and clears metadata. */
    hide() {
        this.$el.hide().removeData("tooltip_actions").removeData("tooltip_element");
    }

    /** Attaches mousemove listener to reposition tooltip. */
    attach_mousemove() {
        $(document).on("mousemove.tooltip", e => this.show(e.pageX, e.pageY));
    }

    /** Detaches tooltip mousemove. */
    detach_mousemove() {
        $(document).off("mousemove.tooltip");
    }

    /**
     * Binds tooltips to `.body_card[data-tooltip] & .body_slot[data-tooltip]` elements.
     */
    bind_tooltips() {
        $(".body_card[data-tooltip], .body_slot[data-tooltip], .grid_item[data-tooltip]").each((_, el) => {
            let data = $(el).data("tooltip");

            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    console.error("[Tooltip] Failed to parse tooltip:", err);
                    return;
                }
            }

            if (!data || typeof data !== "object") return;

            $(el)
                .off("mouseenter mouseleave")
                .on("mouseenter", () => {
                    this.set_content(data);
                    this.$el.data("tooltip_element", el);
                    this.attach_mousemove();
                })
                .on("mouseleave", () => {
                    this.hide();
                    this.detach_mousemove();
                });
        });
    }


    /**
     * Handles keyboard input for tooltip actions, supporting modals.
     */
    bind_keypress() {
        $(document).off("keydown.tooltip_actions").on("keydown.tooltip_actions", (e) => {
            if (!this.$el.is(":visible")) return;

            const key = e.key.toUpperCase();
            const actions = this.$el.data("tooltip_actions") || [];
            const el = this.$el.data("tooltip_element");

            const action = actions.find(a => a.key.toUpperCase() === key);
            if (!action) return;

            let dataset = {};
            let should_close = action.should_close === true;

            if (el && el.dataset) {
                for (const [k, v] of Object.entries(el.dataset)) {
                    const key = k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
                    if (key === "should_close") {
                        should_close = v === "true";
                    } else {
                        dataset[key] = v;
                    }
                }
            }

            if (action.modal && typeof action.modal === "object") {
                this.hide();
                Modal.show(action.modal);
                return;
            }

            send_nui_callback(action.action, dataset, { should_close }).then(() => {
                if (should_close && window.ui_instance?.destroy) {
                    window.ui_instance.destroy();
                    window.ui_instance = null;
                }
            });
        });
    }
}
