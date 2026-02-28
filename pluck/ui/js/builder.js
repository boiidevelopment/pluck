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

import { Content } from "./core/content.js"
import { Footer } from "./core/footer.js"
import { Header } from "./core/header.js"
import { Sidebar } from "./core/sidebar.js"
import { Tooltip } from "./core/tooltip.js"

export class Builder {
    constructor({ header = null, footer = null, sidebar = null, content = {} }) {
        this.header_config = header; 
        this.footer_config = footer; 
        this.sidebar_config = sidebar; 
        this.content_config = content; 
        this.tooltip = new Tooltip();
        window.ui_instance = this;
        this.main_container = $("#ui_main");
        this.build();
    }

    build() {
        this.main_container.empty().append(`
            <div class="vignette"></div>
            <div id="header_container"></div>
            <div id="sidebar_container"></div>
            <div id="content_container"></div>
            <div id="footer_container"></div>
        `);
        this.build_content();
        this.build_header();
        this.build_sidebar();
        this.build_footer();
        const default_tab = this.get_default_page();
        this.adjust_vignette(default_tab ?? null);
    }

    build_header() {
        if (!this.header_config) return;

        const pages = this.content_config.pages;
        if (pages) {
            const tabs = Object.entries(pages).map(([id, cfg]) => ({ id, label: cfg.label ?? cfg.title ?? id, index: cfg.index ?? 999 })).sort((a, b) => a.index - b.index);
            const center = (this.header_config.elements ||= {}).center ||= [];
            const tab_elem = center.find(e => e.type === "tabs") || (center.push({ type: "tabs", tabs: [] }), center.at(-1));
            tab_elem.tabs = tabs;
            this.header_config.on_tab_click = id => this.content.show_page(id).then(() => this.adjust_vignette(id));
        }

        this.header = new Header(this.header_config);
        this.header.append_to("#header_container");
        this.header.trigger_default_tab?.();
    }

    build_footer() {
        if (!this.footer_config) return;
        this.footer = new Footer(this.footer_config);
        this.footer.append_to("#footer_container");
    }

    build_sidebar() {
        if (!this.sidebar_config || !Array.isArray(this.sidebar_config.sections) || !this.sidebar_config.sections.length) return;
        this.sidebar = new Sidebar(this.sidebar_config);
        this.sidebar.append_to("#sidebar_container");
    }

    build_content() {
        if (!this.content_config.pages || typeof this.content_config.pages !== "object") return this.set_content();
        this.content = new Content(this.content_config.pages, "builder_content");
        this.content.append_to("#content_container");

        const default_tab = this.get_default_page();
        if (default_tab) this.content.show_page(default_tab).then(() => this.adjust_vignette(default_tab));
    }

    get_default_page() {
        const entries = Object.entries(this.content_config.pages || {}).filter(([_, c]) => typeof c === "object" && c.index !== undefined).sort((a, b) => (a[1].index ?? 999) - (b[1].index ?? 999));

        return entries.length ? entries[0][0] : null;
    }

    set_content() {
        const html = this.content_config.html || `<div class="placeholder_content">No content defined.</div>`;
        this.content?.set_content(html);
    }

    adjust_vignette(page_id) {
        const $vignette = $(".vignette");

        if (!$vignette.length) { console.warn("[Builder] No .vignette element found."); return; }

        const config = this.content_config.pages?.[page_id];
        const layout = config?.layout || {};

        const has_header = !!this.header_config;
        const has_footer = !!this.footer_config;
        const has_sidebar = !!this.sidebar_config;

        const has_left = !!(layout.left && config?.left);
        const has_center = !!(layout.center && config?.center);
        const has_right = !!(layout.right && config?.right);
        const has_content = has_left || has_center || has_right;

        if (has_sidebar && !has_header && !has_footer && !has_content) {
            $vignette.css("background", "none");
            return;
        }

        if (has_left && has_right) {
            $vignette.css("background", "var(--gradient_fade_both)");
        } else if (has_right) {
            $vignette.css("background", "var(--gradient_fade_right)");
        } else {
            $vignette.css("background", "var(--gradient_fade_left)");
        }
    }

    destroy() {
        if ($("#tooltip").length) {
            $(document).off(".tooltip");
            $("#tooltip").remove();
        }

        if ($("#modal_container").length) {
            $("#modal_container").remove();
        }

        this.main_container.empty();
        this.header = null;
        this.footer = null;
        this.sidebar = null;
        this.content = null;
        this.tooltip = null;
    }

    close() {
        $.post(`https://${GetParentResourceName()}/nui:remove_focus`, JSON.stringify({}));
    }
}