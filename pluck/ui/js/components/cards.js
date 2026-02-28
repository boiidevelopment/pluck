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
import { resolve_image_path } from "../utils.js"

export class Cards {
    constructor({ title = "", search = null, layout = {}, cards = [] }) {
        this.title = title;
        this.search = search;
        this.layout = layout;
        this.cards = Array.isArray(cards) ? cards : Object.values(cards);

        this.flex = layout.flex === "column" ? "column" : "row";
        this.scroll_y = layout.scroll_y === "none" ? "scroll_y_none" : layout.scroll_y === "auto" ? "scroll_y_auto" : "scroll_y_on";
        this.scroll_x = layout.scroll_x === "none" ? "scroll_x_none" : layout.scroll_x === "auto" ? "scroll_x_auto" : "scroll_x_on";
        this.grid_columns = Number(layout.columns) || 0;
    }

    get_html() {
        const style = this.grid_columns > 0 ? `style="grid-template-columns: repeat(${this.grid_columns}, 1fr);"` : "";
        const content = this.cards.map((c, i) => this.create_card(c, i)).join("");
        return `<div class="cards_container ${this.scroll_x} ${this.scroll_y}" ${style}>${content}</div>`.trim();
    }

    create_card(card, index) {
        const title = card.title ? `<h4>${card.title}</h4>` : "";
        const desc = card.description ? `<p>${card.description}</p>` : "";
        const category = card.category?.toLowerCase() || "uncategorized";
        const dataset_attrs = card.dataset ? Object.entries(card.dataset).map(([k, v]) => `data-${k}="${String(v)}"`).join(" ") : "";
        const tooltip_data = card.on_hover ? `data-tooltip='${JSON.stringify({ on_hover: card.on_hover }).replace(/'/g, "&apos;").replace(/"/g, "&quot;")}'` : "";

        const rarity = card.on_hover?.rarity?.toLowerCase() || "common";
        const rarity_class = rarity && rarity !== "common" ? `rarity_${rarity}` : "";
        const img_url = card.image ? resolve_image_path(card.image, "/pluck/ui/assets/cards/") : null;
        const img = img_url ? `<div class="body_card_image ${rarity_class}"><div class="body_card_image_wrapper"><img src="${img_url}" alt="cardimg"></div></div>` : "";

        const buttons = Array.isArray(card.buttons) && card.buttons.length ? new Buttons({
            buttons: card.buttons.map((b, i) => ({ ...b, id: b.id || `card_btn_${i}`, dataset: { card_id: card.id || `card_${index}`, ...(b.dataset || {}) } })),
            classes: "cards"
        }).get_html() : "";

        return `<div class="body_card ${this.flex} ${rarity_class}" data-card-index="${index}" data-category="${category}" ${dataset_attrs} ${tooltip_data}>${img}<div class="body_card_info">${title}${desc}</div>${buttons}</div>`.trim();
    }

}