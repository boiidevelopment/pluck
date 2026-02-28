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
import { send_nui_callback } from "./../utils.js";

export class InputGroups {
    constructor({ id = "", title = "Input Groups", groups = [], buttons = [], layout = {} }) {
        this.id = id;
        this.title = title;
        this.groups = Array.isArray(groups) ? groups : Object.values(groups);
        this.buttons = Array.isArray(buttons) ? buttons : Object.values(buttons);
        this.layout = layout;

        this.scroll_y = layout.scroll_y === "none" ? "scroll_y_none" : layout.scroll_y === "auto" ? "scroll_y_auto" : "scroll_y_on";
        this.scroll_x = layout.scroll_x === "none" ? "scroll_x_none" : layout.scroll_x === "auto" ? "scroll_x_auto" : "scroll_x_on";
        this.columns = layout.columns || 0;
    }

    get_html() {
        const style = this.columns > 0 ? `style="grid-template-columns: repeat(${this.columns}, 1fr);"` : "";
        const wrapper = `input_groups_container ${this.scroll_x} ${this.scroll_y}`.trim();
        const groups_html = this.groups.map((g, i) => this.create_group(g, i)).join("");
        const buttons_html = this.buttons.length ? new Buttons({ buttons: this.buttons, classes: "input_groups" }).get_html() : "";

        setTimeout(() => this.bind_events(), 10);

        return `<div class="${wrapper}" ${style}>${groups_html}</div>${buttons_html}`.trim();
    }

    create_group(group, index) {
        const expand = group.expandable ? `<button class="expand_button" data-group-index="${index}"><i class="fa-solid fa-plus"></i></button>` : "";
        const inputs = Array.isArray(group.inputs) ? group.inputs.map(i => this.create_input(i)).join("") : "";
        return `<div class="input_group">
            <h4>${group.header || "Group"} ${expand}</h4>
            <div class="group_inputs ${group.expandable ? "hidden" : ""}" data-group-index="${index}">${inputs}</div>
        </div>`;
    }

    create_input(input) {
        let copy_html = "";
        if (input.copyable) {
            copy_html = `<button type="button" class="input_copy_button" data-input-id="${input.id}"><i class="fa-solid fa-copy"></i></button>`;
        }

        if (input.type === "number") {
            const max = input.max !== undefined ? input.max : 100;
            const dataset = { target: input.id, ...(input.category ? { category: input.category } : {}) };
            const dec = new Buttons({ buttons: [{ id: `${input.id}_dec`, label: "REMOVE", action: input.action, class: "input_button decrement", dataset }], classes: "input_group_inline" }).get_html();
            const inc = new Buttons({ buttons: [{ id: `${input.id}_inc`, label: "ADD", action: input.action, class: "input_button increment", dataset }], classes: "input_group_inline" }).get_html();
            return `<div class="input_pair">
                <label for="${input.id}">${input.label || ""} <span>${copy_html}</span></label>
                <div class="input_controls">${dec}<input id="${input.id}" class="group_input" type="number" min="-1" max="${max}" value="${input.value !== undefined ? input.value : 0}" data-max="${max}" />${inc} ${copy_html}</div>
            </div>`;
        }

        if (input.type === "text") {
            return `<div class="input_pair">
                <label for="${input.id}">${input.label || ""} <span>${copy_html}</span></label>
                <input id="${input.id}" class="group_input" type="text" value="${input.default || ""}" placeholder="${input.placeholder || ""}" />
            </div>`;
        }

        if (input.type === "select" && Array.isArray(input.options)) {
            const selected_label = input.options.find(opt => (typeof opt === "object" ? opt.value : opt) === input.value)?.label || "none";

            const options_html = input.options.map(opt => {
                const value = typeof opt === "object" ? opt.value : opt;
                const label = typeof opt === "object" ? opt.label : opt;
                return `<div class="custom_select_option" data-value="${value}">${label}</div>`;
            }).join("");

            return `<div class="input_pair">
                <label for="${input.id}">${input.label || ""} <span>${copy_html}</span></label>
                <div id="${input.id}" class="custom_select" data-action="${input.action || ""}">
                    <div class="custom_select_display">${selected_label}</div>
                </div>
                <div class="custom_select_dropdown hidden">
                    ${options_html}
                </div>
            </div>`;
        }

        return `<p>Unsupported input type: ${input.type}</p>`;
    }

    bind_events() {
        $(document).off("click", ".expand_button").on("click", ".expand_button", e => {
            const i = $(e.currentTarget).data("group-index");
            $(`.group_inputs[data-group-index="${i}"]`).toggleClass("hidden");
        });

        $(document).off("click.input_button").on("click.input_button", ".input_button", e => {
            const $btn = $(e.currentTarget);
            const $input = $btn.closest(".input_controls").find(".group_input");
            const id = $input.attr("id");
            const category = $btn.data("category") || null;
            let value = parseInt($input.val(), 10);
            const max = parseInt($input.data("max"), 10);
            const min = parseInt($input.data("min"), 10) || -1;
            
            if ($btn.hasClass("increment")) {
                value = Math.min(value + 1, max);
            } else if ($btn.hasClass("decrement")) {
                value = Math.max(value - 1, min);
            }
            
            $input.val(value);
            
            const action = $btn.data("action");
            if (action) {
                send_nui_callback(action, { category, target: id, value });
            }
        });

        $(document).off("click.custom_select").on("click.custom_select", ".custom_select .custom_select_display", e => {
            const $dropdown = $(e.currentTarget).closest(".input_pair").find(".custom_select_dropdown");
            $(".custom_select_dropdown").not($dropdown).addClass("hidden");
            $dropdown.toggleClass("hidden");
        });

        $(document).off("click.custom_select_option").on("click.custom_select_option", ".custom_select_option", e => {
            const $option = $(e.currentTarget);
            const $container = $option.closest(".input_pair").find(".custom_select");
            const $dropdown = $option.closest(".custom_select_dropdown");
            const value = $option.data("value");

            $container.find(".custom_select_display").text($option.text());
            $dropdown.addClass("hidden");
            $container.data("value", value);

            const action = $container.data("action") || "input_change";
            const id = $container.attr("id");

            send_nui_callback(action, { target: id, value });
        });

        $(document).off("click", ".input_copy_button").on("click", ".input_copy_button", e => {
            const $btn = $(e.currentTarget);
            const $pair = $btn.closest(".input_pair");
            const $group = $pair.closest(".group_inputs");

            const clone = $pair.clone(true, true);

            const $input = clone.find(".group_input, .custom_select");
            let id = $input.attr("id");
            const match = id.match(/_(\d+)$/);
            let slot = match ? parseInt(match[1], 10) + 1 : 2;
            id = id.replace(/_(\d+)$/, "") + "_" + slot;
            $input.attr("id", id);

            const $label = clone.find("label");
            if ($label.length) {
                const text = $label.text().replace(/#\d+/, "#" + slot);
                $label.text(text);
            }

            $group.append(clone);
        });

    }
}