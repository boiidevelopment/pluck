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

/**
 * @class Sidebar
 * @description Builds a flexible vertical sidebar with sections, actions, icons, and up to 3 levels of nesting.
 */
export class Sidebar {
    constructor({ sections = [], on_action = null, layout = {} }) {
        this.sections = Array.isArray(sections) ? sections : Object.values(sections);
        this.on_action = on_action;
        this.side = layout.side || "right";
    }

    _render_sub_subitems(items) {
        if (!items || !items.length) return ""
        return `
            <div class="sidebar_sub_submenu">
                ${items.map(sub => `
                    <div class="sidebar_sub_subitem" id="${sub.id}" data-id="${sub.id}" data-action="${sub.action || ""}" data-should_close="${sub.should_close || "false"}">
                        <div class="sidebar_text">${sub.label}</div>
                    </div>
                `).join("")}
            </div>
        `
    }

    _render_subitems(items) {
        if (!items || !items.length) return ""
        return `
            <div class="sidebar_submenu">
                ${items.map(sub => {
                    const sub_subitems = Array.isArray(sub.submenu) ? sub.submenu : Object.values(sub.submenu || {})
                    return `
                        <div class="sidebar_subitem_wrapper">
                            <div class="sidebar_subitem ${sub_subitems.length ? "has_children" : ""}" id="${sub.id}" data-id="${sub.id}" data-action="${sub.action || ""}" data-should_close="${sub.should_close || "false"}">
                                <div class="sidebar_text">${sub.label}</div>
                                ${sub_subitems.length ? `<i class="fas fa-chevron-right sidebar_chevron"></i>` : ""}
                            </div>
                            ${this._render_sub_subitems(sub_subitems)}
                        </div>
                    `
                }).join("")}
            </div>
        `
    }

    get_html() {
        return `<div class="sidebar ${this.side}">` +
            this.sections.map(section => {
                const items = Array.isArray(section.items) ? section.items : Object.values(section.items || {});
                return `
                    <div class="sidebar_section">
                        ${section.label ? `<div class="sidebar_title">${section.label}</div>` : ""}
                        <div class="sidebar_body">
                            ${items.map(item => {
                                const submenu = Array.isArray(item.submenu) ? item.submenu : Object.values(item.submenu || {})
                                return `
                                    <div class="sidebar_item_wrapper">
                                        <div class="sidebar_item ${item.class || ""} ${submenu.length ? "has_children" : ""}" id="${item.id}" data-id="${item.id}" data-action="${item.action || ""}" data-should_close="${item.should_close || "false"}">
                                            ${item.icon ? `<i class="${item.icon} sidebar_icon"></i>` : item.image ? `<img src="${item.image}" class="sidebar_icon">` : ""}
                                            <div class="sidebar_text">${item.label}</div>
                                            ${submenu.length ? `<i class="fas fa-chevron-down sidebar_chevron"></i>` : ""}
                                        </div>
                                        ${this._render_subitems(submenu)}
                                    </div>
                                `
                            }).join("")}
                        </div>
                    </div>
                `
            }).join("") +
        `</div>`.trim();
    }

    append_to(container = "#sidebar_container") {
        $(container).html(this.get_html());
        this.bind_events();
    }

    bind_events() {
        const handle_click = ($el) => {
            const action = $el.data("action");
            if (!action) return;
            const dataset = extract_dataset($el);
            let should_close = false;
            for (const attr of $el[0].attributes) {
                if (attr.name === "data-should_close" && attr.value === "true") {
                    should_close = true;
                }
            }
            send_nui_callback(action, dataset, { should_close }).then(() => {
                if (should_close && window.ui_instance) {
                    window.ui_instance.destroy();
                    window.ui_instance = null;
                }
            });
        };

        // Level 1 - sidebar items
        $(".sidebar_item").off("click").on("click", function () {
            const $item = $(this);
            const $wrapper = $item.closest(".sidebar_item_wrapper");
            const $submenu = $wrapper.find(".sidebar_submenu").first();

            if ($submenu.length) {
                $(".sidebar_item_wrapper > .sidebar_submenu").not($submenu).slideUp(150);
                $(".sidebar_item").not($item).removeClass("active");
                $(".sidebar_item .sidebar_chevron").not($item.find(".sidebar_chevron")).removeClass("open");
                const is_open = $submenu.is(":visible");
                $submenu.slideToggle(150);
                $item.toggleClass("active", !is_open);
                $item.find(".sidebar_chevron").toggleClass("open", !is_open);
            } else {
                $(".sidebar_submenu").slideUp(150);
                $(".sidebar_item").removeClass("active");
                handle_click($item);
            }
        });

        // Level 2 - subitems
        $(".sidebar_subitem").off("click").on("click", function () {
            const $sub = $(this);
            const $wrapper = $sub.closest(".sidebar_subitem_wrapper");
            const $sub_submenu = $wrapper.find(".sidebar_sub_submenu").first();

            if ($sub_submenu.length) {
                $(".sidebar_sub_submenu").not($sub_submenu).slideUp(150);
                $(".sidebar_subitem").not($sub).removeClass("active");
                $(".sidebar_subitem .sidebar_chevron").not($sub.find(".sidebar_chevron")).removeClass("open");
                const is_open = $sub_submenu.is(":visible");
                $sub_submenu.slideToggle(150);
                $sub.toggleClass("active", !is_open);
                $sub.find(".sidebar_chevron").toggleClass("open", !is_open);
            } else {
                $(".sidebar_sub_submenu").slideUp(150);
                $(".sidebar_subitem").removeClass("active");
                handle_click($sub);
            }
        });

        // Level 3 - sub-subitems
        $(".sidebar_sub_subitem").off("click").on("click", function () {
            handle_click($(this));
        });
    }
}