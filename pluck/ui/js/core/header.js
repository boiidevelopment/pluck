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

import { Buttons } from "../components/buttons.js"
import { Namecard } from "../components/namecard.js"
import { resolve_image_path } from "./../utils.js";

/**
 * @class Header
 * @description Renders the top UI header with support for tabs, buttons, namecards, and grouped elements.
 */
export class Header {
    /**
     * @param {Object} config
     * @param {Object} config.layout - Layout for each section.
     * @param {Object} config.elements - Elements for left/center/right sections.
     * @param {Function} [config.on_tab_click] - Callback for tab selection.
     * @param {Function} [config.on_button_action] - Callback for button clicks.
     */
    constructor({ layout = {}, elements = {}, on_tab_click = null, on_button_action = null }) {
        this.layout = layout;
        this.elements = elements;
        this.on_tab_click = on_tab_click;
        this.on_button_action = on_button_action;
    }

    /** @param {string} section @returns {string} Inline CSS string */
    get_section_style(section) {
        const c = this.layout[section] || {};
        return `justify-content:${c.justify || "flex-start"};align-items:${c.align || "center"};gap:${c.gap || "1vw"}`;
    }

    /** @param {Object} elem @returns {string} HTML for a header element */
    build_element(elem) {
        const { type } = elem;

        if (type === "logo") {
            const image = resolve_image_path(elem.image, "/pluck/ui/assets/logos/");
            return `<div class="header_logo" style="background-image:url(${image})"></div>`;
        }

        if (type === "text") {
            return `<div class="header_text">${elem.title || ""}${elem.subtitle ? `<span>${elem.subtitle}</span>` : ""}</div>`;
        }

        if (type === "tabs") {
            const pages = window.ui_instance?.content?.pages || {};
            const tabs = Array.isArray(elem.tabs) ? elem.tabs : Object.values(elem.tabs || {});
            const valid_tabs = tabs.sort((a, b) => (a.index ?? 999) - (b.index ?? 999)).map((t, i) => ({ ...t, default: i === 0 }));

            return `<div class="header_tabs">
                ${valid_tabs.map(t => `<div class="header_tab${t.default ? " active" : ""}" data-tab="${t.id}">${pages[t.id]?.title || t.label || t.id}</div>`).join("")}
            </div>`;
        }

        if (type === "button") {
            return `<button class="header_button" data-button="${elem.id}" data-action="${elem.action || ""}">${elem.label}</button>`;
        }

        if (type === "buttons") {
            return new Buttons({ buttons: elem.buttons, classes: "inline_header_buttons" }).get_html();
        }

        if (type === "group") {
            const items = Array.isArray(elem.items) ? elem.items : Object.values(elem.items || {});
            return `<div class="header_group">${items.map(i => this.build_element(i)).join("")}</div>`;
        }

        if (type === "namecard") {
            return new Namecard(elem).get_html();
        }

        return "";
    }

    /** @returns {string} Full header HTML */
    get_html() {
        return `<div class="header">
            ${["left", "center", "right"].map(s => {
                const items = Array.isArray(this.elements[s]) ? this.elements[s] : Object.values(this.elements[s] || {});
                return `<div class="header_section ${s}" style="${this.get_section_style(s)}">
                    ${items.map(e => this.build_element(e)).join("")}
                </div>`;
            }).join("")}
        </div>`.trim();
    }

    /** @param {string} [container="#ui_main"] Appends header and binds UI events */
    append_to(container = "#ui_main") {
        $(container).append(this.get_html());

        $(".header_tab").off("click").on("click", e => {
            $(".header_tab").removeClass("active");
            $(e.currentTarget).addClass("active");
            this.on_tab_click?.($(e.currentTarget).data("tab"));
        });
    }

    /** Triggers the currently active tab (used to initialize content) */
    trigger_default_tab() {
        $(".header_tab.active").trigger("click");
    }
}
