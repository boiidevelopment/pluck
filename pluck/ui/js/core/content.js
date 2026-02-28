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

import { Cards } from "../components/cards.js";
import { Slots } from "../components/slots.js";
import { Grid } from "../components/grid.js";
import { InputGroups } from "../components/input_groups.js";
import { send_nui_callback } from "./../utils.js";

/**
 * @class Content
 * @description Manages page-based UI content layout, rendering sections and components dynamically.
 */
export class Content {
    /**
     * @param {Object} [pages={}]
     * @param {string} [classes=""]
     * @param {Object} [layout={ left: 1, center: 2, right: 1 }]
     */
    constructor(pages = {}, classes = "", layout = { left: 1, center: 2, right: 1 }) {
        this.pages = pages;
        this.classes = classes;
        this.layout = layout;

        this.page_items = Object.create(null);

        this.current_slots_instances = [];
        this.current_grid_instances = [];
        this.current_page_id = null;
    }

    /** @returns {string} HTML for content grid layout */
    get_html() {
        return `<div class="content_grid ${this.classes}">` +
            ["left", "center", "right"].map(s => `
                <div class="content_section ${s}" style="grid-column: span ${this.layout[s] || 0};">
                    <div class="content_title ${s}"></div><div class="content_body ${s}"></div>
                </div>`).join("") +
        `</div>`.trim();
    }

    /**
     * @param {string} [container="#ui_main"]
     */
    append_to(container = "#ui_main") {
        $(container).append(this.get_html());
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async show_page(id) {
        this.current_page_id = id;

        const config = this.pages[id];
        if (!config || typeof config !== "object") {
            $(".content_body.center").html(`<div class="placeholder_content"></div>`);
            return;
        }

        if (!this.page_items[id]) {
            this.page_items[id] = { left: {}, center: {}, right: {} };

            for (const section of ["left", "center", "right"]) {
                const sec = config[section];
                if (!sec) continue;

                if (sec.groups) {
                    sec.groups.forEach(group => {
                        const group_id = group.id;
                        if (group.items) {
                            this.page_items[id][section][group_id] =
                                JSON.parse(JSON.stringify(group.items));
                        }
                    });
                } else if (sec.items) {
                    this.page_items[id][section]["_default"] =
                        JSON.parse(JSON.stringify(sec.items));
                }
            }
        }

        const slots_instances = [];
        const grid_instances = [];

        for (const s of ["left", "center", "right"]) {
            const section = config[s] || null;
            const span = config.layout?.[s] ?? this.layout[s] ?? 0;

            const $section = $(`.content_section.${s}`);
            const $title = $section.find(`.content_title.${s}`);
            const $body = $section.find(`.content_body.${s}`);

            $section.css("grid-column", `span ${span || 0}`).toggle(span > 0);
            $title.empty();
            $body.empty();

            if (!section) {
                $body.html(`<div class="placeholder_section"></div>`);
                continue;
            }

            if (section.title) {
                $title.html(
                    typeof section.title === "object"
                        ? `<h3>${section.title.text}${section.title.span ? ` <span>${section.title.span}</span>` : ""}</h3>`
                        : `<h3>${section.title}</h3>`
                );
            }

            if (section.type === "slots") {
                const slots_instance = new Slots({
                    ...section,
                    section_key: s,
                    page_items: this.page_items[id][s],
                    on_swap: this.create_swap_handler(id)
                });
                slots_instance.render_to($body);
                slots_instances.push(slots_instance);
            } else if (section.type === "grid") {
                if (section.groups) {
                    const $groups_wrapper = $(`<div class="grid_groups_wrapper"></div>`);
                    $body.append($groups_wrapper);

                    for (const group of section.groups) {
                        const group_key = `${s}_${group.id}`;
                        const container_id = `grid_group_${group_key}`;
                        const collapsible = group.collapsible !== false;
                        const collapsed = group.collapsed === true;
                        const span_html = group.span ? `<span>${group.span}</span>` : "";
                        const title_html = group.title ? `<div class="grid_group_title${collapsible ? " collapsible" : ""}" data-target="${container_id}"><div class="grid_group_title_inner"><div class="grid_group_title_label">${group.title}</div></div>${span_html}</div>` : "";

                        const $group_el = $(`<div class="grid_group">${title_html}<div class="grid_container${collapsed ? " collapsed" : ""}" id="${container_id}"></div></div>`);
                        $groups_wrapper.append($group_el);

                        const items = this.page_items[id][s][group.id] || [];

                        const grid_instance = new Grid({
                            layout: { ...(section.layout || {}), ...(group.layout || {}) },
                            items: Array.isArray(items) ? items : Object.values(items),
                            section_key: group_key,
                            on_move: this.create_move_handler(id),
                            draggable: group.draggable ?? true
                        });

                        grid_instance.render_to(`#${container_id}`);
                        grid_instances.push(grid_instance);
                    }

                    $groups_wrapper.on("click", ".grid_group_title.collapsible", function() {
                        $(`#${$(this).data("target")}`).toggleClass("collapsed");
                    });
                } else {
                    // Flat single grid — items stored under _default.
                    const items = this.page_items[id][s]["_default"] || [];

                    const flat_container_id = `grid_flat_${s}`;
                    $body.append(`<div class="grid_container" id="${flat_container_id}"></div>`);

                    const grid_instance = new Grid({
                        layout: section.layout || {},
                        section_key: s,
                        items: Array.isArray(items) ? items : Object.values(items),
                        on_move: this.create_move_handler(id)
                    });

                    grid_instance.render_to(`#${flat_container_id}`);
                    grid_instances.push(grid_instance);
                }
            } else {
                const html = await this.render_content(section);
                $body.html(html);
            }
        }

        this.current_slots_instances = slots_instances;
        this.current_grid_instances = grid_instances;
        window.ui_instance?.tooltip?.bind_tooltips();
    }

    /**
     * @param {string} page_id
     * @returns {Function}
     */
    create_swap_handler(page_id) {
        return async (from_slot_num, to_slot_num, from_group_id, to_group_id, from_section, to_section) => {
            const items = this.page_items[page_id];

            items[from_section] ??= {};
            items[to_section] ??= {};
            items[from_section][from_group_id] ??= {};
            items[to_section][to_group_id] ??= {};

            const src = items[from_section][from_group_id];
            const dst = items[to_section][to_group_id];

            const from_item = src[from_slot_num];
            if (!from_item) return;

            const to_item = dst[to_slot_num];

            if (to_item) {
                src[from_slot_num] = to_item;
                dst[to_slot_num] = from_item;
            } else {
                dst[to_slot_num] = from_item;
                delete src[from_slot_num];
            }

            this.on_item_moved({
                page_id,
                from_section,
                to_section,
                from_group: from_group_id,
                to_group: to_group_id,
                from_slot: from_slot_num,
                to_slot: to_slot_num,
                swap: !!to_item
            });

            for (const inst of this.current_slots_instances) {
                inst.update_items(this.page_items[page_id][inst.section_key]);
            }
        };
    }

    /**
     * @param {string} page_id
     * @returns {Function}
     */
    create_move_handler(page_id) {
        return async (item_id, from_col, from_row, to_col, to_row, from_section, to_section) => {
            // Update local cache.
            // section_key for grouped grids is "{section}_{group_id}", for flat grids just "{section}".
            // We locate the item by its old position and update col/row in place.
            const page = this.page_items[page_id];
            if (page) {
                // Resolve which cache bucket this section_key maps to.
                // Grouped: from_section = "left_vest" → section = "left", group = "vest"
                // Flat:    from_section = "right"     → section = "right", key = "_default"
                const resolve = (section_key) => {
                    for (const s of ["left", "center", "right"]) {
                        if (section_key === s) return { bucket: page[s], key: "_default" };
                        if (section_key.startsWith(`${s}_`)) {
                            const group_id = section_key.slice(s.length + 1);
                            return { bucket: page[s], key: group_id };
                        }
                    }
                    return null;
                };

                const src = resolve(from_section);
                const dst = resolve(to_section);

                if (src && dst) {
                    const src_items = src.bucket[src.key];
                    const dst_items = dst.bucket[dst.key];

                    if (Array.isArray(src_items)) {
                        const item = src_items.find(i => String(i.col) === String(from_col) && String(i.row) === String(from_row));
                        if (item) {
                            if (from_section !== to_section) {
                                src_items.splice(src_items.indexOf(item), 1);
                                if (Array.isArray(dst_items)) {
                                    item.col = Number(to_col);
                                    item.row = Number(to_row);
                                    dst_items.push(item);
                                }
                            } else {
                                item.col = Number(to_col);
                                item.row = Number(to_row);
                            }
                        }
                    }
                }
            }

            this.on_grid_item_moved({
                page_id,
                item_id,
                from_col,
                from_row,
                to_col,
                to_row,
                from_section,
                to_section
            });
        };
    }

    /**
     * @param {Object} move_data
     */
    on_item_moved(move_data) {
        send_nui_callback("slots_moved_item", move_data);
    }

    /**
     * @param {Object} move_data
     */
    on_grid_item_moved(move_data) {
        send_nui_callback("grid_moved_item", move_data);
    }

    /**
     * @param {Object} server_items
     */
    update_slots_from_server(server_items) {
        if (!this.current_page_id) return;

        const page = this.page_items[this.current_page_id];
        if (!page) return;

        for (const section of ["left", "center", "right"]) {
            const sec = page[section];
            if (!sec) continue;

            for (const [group_id, slots] of Object.entries(server_items)) {
                if (sec[group_id]) {
                    sec[group_id] = JSON.parse(JSON.stringify(slots));
                }
            }
        }

        for (const inst of this.current_slots_instances) {
            inst.update_items(page[inst.section_key]);
        }
    }

    /**
     * @param {Array<Object>} server_items
     * @param {string} section_key - Either a bare section ("right") or grouped key ("left_vest").
     */
    update_grid_from_server(server_items, section_key = "center") {
        if (!this.current_page_id) return;

        const page = this.page_items[this.current_page_id];
        if (!page) return;

        // Resolve section + cache key from section_key.
        for (const s of ["left", "center", "right"]) {
            if (section_key === s) {
                page[s]["_default"] = JSON.parse(JSON.stringify(server_items));
                break;
            }
            if (section_key.startsWith(`${s}_`)) {
                const group_id = section_key.slice(s.length + 1);
                if (page[s]) page[s][group_id] = JSON.parse(JSON.stringify(server_items));
                break;
            }
        }

        for (const inst of this.current_grid_instances) {
            if (inst.section_key === section_key) {
                inst.update_items(server_items);
            }
        }
    }

    /**
     * @param {string} html
     * @param {string} [section="center"]
     */
    set_content(html, section = "center") {
        $(`.content_body.${section}`).html(html);
    }

    /** @returns {void} */
    clear() {
        $(".content_body, .content_title").empty();
    }

    /**
     * @param {Object} data
     * @returns {Promise<string>}
     */
    async render_content(data) {
        const map = {
            cards: () => this.build_cards(data),
            slots: () => this.build_slots(data),
            grid: () => this.build_grid(data),
            input_groups: () => this.build_input_groups(data)
        };
        return map[data.type]?.() || "";
    }

    /** @param {Object} data */
    build_cards(data) {
        return new Cards(data).get_html();
    }

    /** @param {Object} data */
    build_slots(data) {
        return new Slots(data).get_html();
    }

    /** @param {Object} data */
    build_grid(data) {
        return new Grid(data).get_html();
    }

    /**
     * @param {Object} data
     * @returns {string}
     */
    build_input_groups(data) {
        return new InputGroups({
            id: data.id || "input_groups",
            title: data.title || "",
            layout: data.layout || {},
            groups: Array.isArray(data.groups) ? data.groups : Object.values(data.groups || {}),
            buttons: Array.isArray(data.buttons) ? data.buttons : Object.values(data.buttons || {})
        }).get_html();
    }
}