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

/**
 * @class Modal
 * @description Renders a modal window with input fields and buttons.
 */
export class Modal {
    /**
     * @param {Object} config
     * @param {string} [config.title="Input Required"]
     * @param {Array<Object>} [config.options=[]]
     * @param {Array<Object>} [config.buttons=[]]
     * @param {string} [config.classes=""]
     */
    constructor({ title = "Input Required", options = [], buttons = [], classes = "" } = {}) {
        this.title = title;
        this.options = Array.isArray(options) ? options : Object.values(options);
        this.buttons = Array.isArray(buttons) ? buttons : Object.values(buttons);
        this.classes = classes;
    }

    /** @private @returns HTML for modal inputs */
    get_input_html(opt) {
        const common = `id="${opt.id}" class="modal_input"`;
        let dataset_attrs = "";

        if (opt.dataset && typeof opt.dataset === "object") {
            for (const [k, v] of Object.entries(opt.dataset)) {
                dataset_attrs += ` data-${k.replace(/_/g, "-")}="${v}"`;
            }
        }

        if (opt.type === "select" && Array.isArray(opt.options)) {
            const opts = opt.options.map(o =>
                `<div class="custom_option" data-value="${o.value}" data-source="${o.source || o.value}">${o.label}</div>`
            ).join("");

            return `<div class="modal_field">
                <label for="${opt.id}">${opt.label || opt.id}</label>
                <div class="modal_select_wrapper">
                    <div class="modal_select" data-id="${opt.id}">Select a value...</div>
                    <div class="modal_select_options">${opts}</div>
                </div>
            </div>`;
        }

        if (opt.type === "textarea") {
            return `<div class="modal_field">
                <label for="${opt.id}">${opt.label || opt.id}</label>
                <textarea ${common}${dataset_attrs} placeholder="${opt.placeholder || ""}"></textarea>
            </div>`;
        }

        /**
         * Range slider input
         * @param {number} opt.min
         * @param {number} opt.max
         * @param {number} opt.step
         * @param {number} opt.value
         */
        if (opt.type === "range") {
            const start = opt.value ?? opt.min ?? 0;
            return `<div class="modal_field">
                <label for="${opt.id}">
                    ${opt.label || opt.id}
                    <span class="slider_value" data-for="${opt.id}">${start}</span>
                </label>
                <input type="range" ${common} ${dataset_attrs} min="${opt.min ?? 0}" max="${opt.max ?? 100}" step="${opt.step ?? 1}"  value="${start}"/>
            </div>`;
        }

        const attrs = [`type="${opt.type || "text"}"`, common, dataset_attrs, opt.placeholder ? `placeholder="${opt.placeholder}"` : "", opt.min !== undefined ? `min="${opt.min}"` : "", opt.max !== undefined ? `max="${opt.max}"` : ""].join(" ");

        return `<div class="modal_field">
            <label for="${opt.id}">${opt.label || opt.id}</label>
            <input ${attrs.trim()} />
        </div>`;
    }

    /** @returns {string} Full HTML for the modal */
    get_html() {
        const inputs = this.options.map(opt => this.get_input_html(opt)).join("\n");
        const buttons = new Buttons({ buttons: this.buttons, classes: "modal_button_group" }).get_html();
        return `<div id="modal_container">
            <div class="modal ${this.classes}">
                <h2 class="modal_title">${this.title}</h2>
                <div class="modal_inputs">${inputs}</div>
                <div class="modal_actions">${buttons}</div>
            </div>
        </div>`.trim();
    }

    /**
     * Appends the modal to DOM and binds events.
     * @param {string} [container="#ui_focus"]
     */
    append_to(container = "#ui_focus") {
        $(container).html(this.get_html()).addClass("active");

        $(".modal_select").off("click").on("click", function () {
            const $w = $(this).closest(".modal_select_wrapper");
            $(".modal_select_options").not($w.find(".modal_select_options")).hide();
            $w.find(".modal_select_options").toggle();
        });

        $(".modal_select_options .custom_option").off("click").on("click", function () {
            const val = $(this).data("value");
            const source = $(this).data("source");
            const label = $(this).text();
            const $w = $(this).closest(".modal_select_wrapper");
            const $sel = $w.find(".modal_select");
            $sel.text(label).attr("data-value", val).attr("data-source", source);
            $w.find(".modal_select_options").hide();
        });

        /** Update slider value display */
        $(".modal_field input[type='range']").off("input").on("input", function () {
            const id = $(this).attr("id");
            $(`.slider_value[data-for="${id}"]`).text($(this).val());
        });

        $(document).on("click", e => {
            if (!$(e.target).closest(".modal_select_wrapper").length) {
                $(".modal_select_options").hide();
            }
        });
    }

    /**
     * Static helper to quickly show a modal with.
     * @param {Object} config
     * @param {string} config.title
     * @param {Array<Object>} config.options
     * @param {Array<Object>} config.buttons
     */
    static show({ title = "Input Required", options = [], buttons = [] }) {
        new Modal({ title, options, buttons }).append_to("#ui_focus");
    }
}