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

import { send_nui_callback, extract_dataset } from "./../utils.js";

export class OptionsSelector {
    constructor() {
        this.options = [];
        this.title = "SELECT OPTION";
    }

    set_options(title = null, options = []) {
        if (!$("#options_selector_section").length) {
            this.build();
        }

        this.options = options;
        if (title) this.title = title;
        this.render_options();
        $("#options_selector_section h3").text(this.title);
    }

    build() {
        const content = `
            <div id="options_selector_section">
                <h3>SELECT OPTION</h3>
                <div class="options_selector_list" id="options_selector_list"></div>
                <p class="options_selector_close">Press ESC to close</p>
            </div>
        `;
        $("#ui_focus").append(content);
        this.add_listeners();
        $("#options_selector_section").hide();
    }

    render_options() {
        const options_array = Array.isArray(this.options) ? this.options : Object.values(this.options);
        const options_html = options_array.map(option => {
            const is_disabled = option.enabled === false || (option.quantity !== undefined && option.quantity <= 0);
            const dataset = Object.entries(option.dataset || {}).map(([k, v]) => `data-${k}="${v}"`).join(" ");
            return `
                <div class="options_selector_item ${is_disabled ? "disabled" : ""}" 
                    data-action="${option.action || ""}"
                    data-option-id="${option.id}"
                    ${dataset}
                    style="pointer-events: ${is_disabled ? "none" : "auto"};">
                    <img class="options_selector_image" src="${option.image}" alt="${option.label}">
                    <div style="display: flex; width: 90%; justify-content: space-between;">
                        <p>${option.label}</p>
                        ${option.quantity !== undefined ? `<p>${option.quantity}x</p>` : ""}
                    </div>
                </div>
            `;
        }).join("");
        $("#options_selector_list").html(options_html);
    }

    add_listeners() {
        $(document).off("click.options_selector");
        $(document).off("keyup.options_selector");

        $(document).on("click.options_selector", ".options_selector_item", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const $item = $(e.currentTarget);
            if ($item.hasClass("disabled")) return;

            if ($item.data("locked")) return;
            $item.data("locked", true);

            const action = $item.data("action");
            if (!action) return;

            const dataset = extract_dataset($item);
            send_nui_callback(action, dataset);
            this.hide();
        });

        $(document).on("keyup.options_selector", (e) => {
            if (e.key === "Escape" && $("#options_selector_section").is(":visible")) {
                this.hide();
            }
        });
    }

    show() {
        $("#options_selector_section").fadeIn(500);
    }

    hide() {
        $.post(`https://${GetParentResourceName()}/nui:remove_focus`, JSON.stringify({}));
        $("#options_selector_section").fadeOut(500, () => {
            $(".options_selector_item").removeData("locked");
        });
    }

    destroy() {
        $(document).off("click.options_selector");
        $(document).off("keyup.options_selector");
        $("#options_selector_section").remove();
    }
}
