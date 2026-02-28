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

import { resolve_image_path } from "../utils.js";

export class Slots {
    /**
     * @param {Object} config
     * @param {string} [config.title=""]
     * @param {Object} [config.layout={}]
     * @param {number} [config.slot_count=40]
     * @param {Array<Object>|null} [config.groups=null]
     * @param {Function|null} [config.on_swap=null]
     * @param {string|null} [config.section_key=null]
     * @param {Object} [config.page_items={}]
     * @param {boolean} [config.draggable=true]
     */
    constructor({ title = "", layout = {}, slot_count = 40, groups = null, on_swap = null, section_key = null, page_items = {}, draggable = true }) {
        this.title = title;
        this.layout = layout;
        this.slot_count = slot_count;
        this.groups = groups;
        this.on_swap = on_swap;
        this.section_key = section_key;
        this.page_items = page_items;
        this.draggable = draggable;

        this.scroll_y = layout.scroll_y === "none" ? "scroll_y_none" : layout.scroll_y === "auto" ? "scroll_y_auto" : "scroll_y_on";
        this.scroll_x = layout.scroll_x === "none" ? "scroll_x_none" : layout.scroll_x === "auto" ? "scroll_x_auto" : "scroll_x_on";
        this.grid_columns = Number(layout.columns) || 5;
        this.slot_size = layout.slot_size || "64px";
        this.container_selector = null;
    }

    get_html() {
        if (this.groups && Array.isArray(this.groups)) {
            return this.get_grouped_html();
        }

        const style = `style="grid-template-columns: repeat(${this.grid_columns}, ${this.slot_size}); grid-auto-rows: ${this.slot_size};"`;
        const group_items = this.page_items["_default"] || {};

        const slots = Array(this.slot_count).fill(null);
        Object.entries(group_items).forEach(([num, item]) => {
            const idx = parseInt(num) - 1;
            if (idx >= 0 && idx < this.slot_count) {
                slots[idx] = { ...item, slot_num: num, group_id: "_default" };
            }
        });

        const content = slots.map((item, i) => this.create_slot(item, i, "_default")).join("");
        return `<div class="slots_container ${this.scroll_x} ${this.scroll_y}" ${style}>${content}</div>`.trim();
    }

    get_grouped_html() {
        const groups_html = this.groups.map((group, group_index) => {
            const group_id = group.id || `group_${group_index}`;
            const group_title = group.title || "";
            const group_span = group.span || "";
            const layout_type = group.layout_type || "grid";
            const slot_count = group.slot_count || 10;
            const columns = group.columns || this.grid_columns;
            const slot_size = group.slot_size || this.slot_size;
            const collapsible = group.collapsible !== false;
            const collapsed = group.collapsed || false;
            const show_slot_numbers = group.show_slot_numbers;
            const group_items = this.page_items[group_id] || {};

            let slots_html = "";
            let container_class = "slots_container";
            let style = "";

            if (layout_type === "positioned" && group.slots) {
                container_class = "slots_container_positioned";
                slots_html = this.create_positioned_slots(group.slots, group_id, group_items);
            } else {
                style = `style="grid-template-columns: repeat(${columns}, ${slot_size}); grid-auto-rows: ${slot_size};"`;

                const slots = Array(slot_count).fill(null);
                Object.entries(group_items).forEach(([num, item]) => {
                    const idx = parseInt(num) - 1;
                    if (idx >= 0 && idx < slot_count) {
                        slots[idx] = { ...item, slot_num: num, group_id };
                    }
                });

                slots_html = slots.map((item, i) => {
                    let slot_number = null;

                    if (Array.isArray(show_slot_numbers)) {
                        if (show_slot_numbers.includes(i + 1)) {
                            slot_number = i + 1;
                        }
                    } else if (show_slot_numbers === true) {
                        slot_number = i + 1;
                    }

                    return this.create_slot(item, i, group_id, slot_number);
                }).join("");
            }

            const title_html = group_title ? `
                <div class="slot_group_title ${collapsible ? 'collapsible' : ''}" data-group-id="${group_id}">
                    <div class="slot_group_title_label">
                        ${collapsible ? `<i class="fa-solid fa-chevron-${collapsed ? 'right' : 'down'}"></i>` : ''}
                        <span>${group_title}</span>
                    </div>
                    ${group_span ? `<span>${group_span}</span>` : ''}
                </div>
            ` : '';

            return `
                <div class="slot_group" data-group-id="${group_id}">
                    ${title_html}
                    <div class="${container_class} ${collapsed ? 'collapsed' : ''} ${this.scroll_x} ${this.scroll_y}"
                        data-group-id="${group_id}"
                        ${style}>
                        ${slots_html}
                    </div>
                </div>
            `.trim();
        }).join("");

        return `<div class="slot_groups_wrapper">${groups_html}</div>`;
    }

    create_slot(item, index, group_id, slot_number = null, slot_id = null, size = null) {
        const slot_num = item ? item.slot_num : String(index + 1);
        const hotkey_display = item?.hotkey || slot_number;
        const hotkey_html = hotkey_display ? `<div class="slot_hotkey">${hotkey_display}</div>` : "";
        const size_style = size ? `style="width: ${size}; height: ${size};"` : '';

        if (!item) {
            return `<div class="body_slot slot_empty" ${size_style}
                         data-slot-index="${index}"
                         data-slot-num="${slot_num}"
                         data-group-id="${group_id}"
                         ${slot_id ? `data-slot-id="${slot_id}"` : ''}
                         data-section-key="${this.section_key}"
                         ${hotkey_display ? `data-hotkey="${hotkey_display}"` : ''}>
                         ${hotkey_html}
                    </div>`;
        }

        const category = item.category?.toLowerCase() || "uncategorized";
        const rarity = item.on_hover?.rarity?.toLowerCase() || "common";
        const rarity_class = `rarity_${rarity}`;
        const dataset_attrs = item.dataset ? Object.entries(item.dataset).map(([k, v]) => `data-${k}="${v}"`).join(" ") : "";
        const tooltip_data = item.on_hover ? `data-tooltip='${JSON.stringify({ on_hover: item.on_hover }).replace(/'/g, "&apos;").replace(/"/g, "&quot;")}'` : "";
        const img = item.image ? `<div class="body_slot_image"><img src="${resolve_image_path(item.image, "/core/pluck/ui/assets/items/")}" /></div>` : "";
        const quantity = item.quantity > 1 ? `<div class="slot_quantity">${item.quantity}</div>` : "";
        const progress = item.progress?.value >= 0 ? `<div class="slot_progress"><div class="slot_progress_fill" style="width:${Math.min(100, Math.max(0, item.progress.value))}%"></div></div>` : "";
        const footer = quantity || progress ? `<div class="slot_footer">${quantity}${progress}</div>` : "";

        return `
            <div class="body_slot ${rarity_class} slot_occupied"
                 ${size_style}
                 data-slot-index="${index}"
                 data-slot-num="${slot_num}"
                 data-group-id="${group_id}"
                 ${slot_id ? `data-slot-id="${slot_id}"` : ''}
                 data-section-key="${this.section_key}"
                 data-category="${category}"
                 ${hotkey_display ? `data-hotkey="${hotkey_display}"` : ''}
                 ${dataset_attrs}
                 ${tooltip_data}>
                ${hotkey_html}${img}${footer}
            </div>
        `.trim();
    }

    create_positioned_slots(slot_definitions, group_id, group_items) {
        return slot_definitions.map((slot_def, index) => {
            const slot_id = slot_def.id || `slot_${index}`;
            const position = slot_def.position || {};
            const size = slot_def.size || this.slot_size;
            const label = slot_def.label || "";

            let pos_style = "";
            if (position.top) pos_style += ` top: ${position.top};`;
            if (position.bottom) pos_style += ` bottom: ${position.bottom};`;
            if (position.left) pos_style += ` left: ${position.left};`;
            if (position.right) pos_style += ` right: ${position.right};`;
            if (position.transform) pos_style += ` transform: ${position.transform};`;

            const slot_num = String(index + 1);
            const item_data = group_items[slot_num];
            const item = item_data ? { ...item_data, slot_num, group_id } : null;

            const slot_html = this.create_slot(item, index, group_id, null, slot_id, size);
            const label_html = label ? `<div class="slot_label">${label}</div>` : "";

            return `
                <div class="positioned_slot_wrapper" style="${pos_style}">
                    ${label_html}
                    ${slot_html}
                </div>
            `.trim();
        }).join("");
    }

    render_to(selector) {
        const $target = $(selector);
        if ($target.length === 0) return;

        $target.html(this.get_html());

        if (this.groups) {
            this.init_collapse_handlers(selector);
        }

        this.init_drag_and_drop(selector);
        window.ui_instance?.tooltip?.bind_tooltips();
    }

    init_collapse_handlers(container) {
        $(container).off('click.slot_group_collapse').on('click.slot_group_collapse', '.slot_group_title.collapsible', (e) => {
            const $title = $(e.currentTarget);
            const group_id = $title.data('group-id');
            const $slots_container = $(container).find(`.slots_container[data-group-id="${group_id}"], .slots_container_positioned[data-group-id="${group_id}"]`);
            const $icon = $title.find('h4 > i').first();

            $slots_container.toggleClass('collapsed');

            if ($slots_container.hasClass('collapsed')) {
                $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
            } else {
                $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
            }
        });
    }

    init_drag_and_drop(container) {
        if (!this.draggable) return;
        
        this.container_selector = container;
        $(container).off(`pointerdown.invdrag_${this.section_key}`);

        Slots._drag ??= null;
        Slots._ghost ??= null;
        Slots._global_bound ??= false;

        const cleanup = () => {
            Slots._drag = null;
            if (Slots._ghost) {
                Slots._ghost.remove();
                Slots._ghost = null;
            }
            $(".slot_dragging, .slot_drop_target").removeClass("slot_dragging slot_drop_target");
            window.ui_instance?.tooltip?.hide?.();
        };

        if (!Slots._global_bound) {
            Slots._global_bound = true;

            $(document).on("pointermove.invdrag_global", (e) => {
                if (!Slots._drag || !Slots._ghost) return;
                
                Slots._ghost.css({ left: e.clientX + 8, top: e.clientY + 8 });

                const under = document.elementFromPoint(e.clientX, e.clientY);
                const to_el = under ? under.closest(".body_slot") || under.closest(".positioned_slot_wrapper")?.querySelector(".body_slot") || under.closest(".slot_group")?.querySelector(".body_slot") : null;

                $(".slot_drop_target").removeClass("slot_drop_target");
                
                if (to_el) {
                    const $to = $(to_el);
                    const to_section = $to.attr("data-section-key");
                    const to_group = $to.attr("data-group-id");
                    const to_slot = $to.attr("data-slot-num");
                    const d = Slots._drag;

                    if (!(d.from_section === to_section && d.from_group === to_group && d.from_slot === to_slot)) {
                        $to.addClass("slot_drop_target");
                    }
                }
            });

            $(document).on("pointerup.invdrag_global pointercancel.invdrag_global", async (e) => {
                if (!Slots._drag) return;

                const under = document.elementFromPoint(e.clientX, e.clientY);
                const to_el = under ? under.closest(".body_slot") || under.closest(".positioned_slot_wrapper")?.querySelector(".body_slot") || under.closest(".slot_group")?.querySelector(".body_slot") : null;

                if (!to_el) {
                    cleanup();
                    return;
                }

                const $to = $(to_el);
                const to_section = $to.attr("data-section-key");
                const to_group = $to.attr("data-group-id");
                const to_slot = $to.attr("data-slot-num");

                if (!to_section || !to_group || !to_slot) {
                    cleanup();
                    return;
                }

                const d = Slots._drag;

                if (d.from_section === to_section && d.from_group === to_group && d.from_slot === to_slot) {
                    cleanup();
                    return;
                }

                if (typeof d.on_swap === "function") {
                    await d.on_swap(String(d.from_slot), String(to_slot), String(d.from_group), String(to_group), String(d.from_section), String(to_section));
                }

                cleanup();
            });
        }

        $(container).on(`pointerdown.invdrag_${this.section_key}`, ".slot_occupied", (e) => {
            const el = e.currentTarget;
            const $slot = $(el);

            const from_section = $slot.attr("data-section-key");
            const from_group = $slot.attr("data-group-id");
            const from_slot = $slot.attr("data-slot-num");

            if (!from_section || !from_group || !from_slot) return;

            Slots._drag = { from_section, from_group, from_slot, on_swap: this.on_swap };

            el.classList.add("slot_dragging");

            Slots._ghost?.remove();
            Slots._ghost = $(el).clone();
            Slots._ghost.css({
                position: "fixed",
                left: e.clientX + 8,
                top: e.clientY + 8,
                pointerEvents: "none",
                zIndex: 999999,
                width: $(el).outerWidth(),
                height: $(el).outerHeight(),
                opacity: 0.9
            });
            $("body").append(Slots._ghost);

            e.preventDefault();
        });
    }

    update_items(new_page_items) {
        this.page_items = new_page_items || {};
        if (!this.container_selector) return;

        const $target = $(this.container_selector);
        if (!$target.length) return;

        $target.html(this.get_html());

        if (this.groups) {
            this.init_collapse_handlers(this.container_selector);
        }

        this.init_drag_and_drop(this.container_selector);
        window.ui_instance?.tooltip?.bind_tooltips();
    }
}