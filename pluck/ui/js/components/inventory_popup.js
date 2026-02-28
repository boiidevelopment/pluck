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

export class SlotPopup {
    constructor(config = {}) {
        this.position = config.position || "top-center";
        this.container = null;
        this.init();
    }

    init() {
        if (this.container) return;

        this.container = document.createElement("div");
        this.container.className = `slot_popups slot_popups_${this.position}`;
        document.body.appendChild(this.container);
    }

    show({ item_id, image, quantity, action, rarity = "common" }) {
        const notification = document.createElement("div");
        notification.className = `inventory_popup rarity_${rarity} slot_popup_${action}`;

        const action_symbol = action === "added" ? "+" : "-";
        const action_class = action === "added" ? "action_added" : "action_removed";

        notification.innerHTML = `
            <div class="slot_popup_inner">
                <div class="slot_popup_image">
                    <img src="${resolve_image_path(image, "/pluck/ui/assets/items/")}" />
                </div>
                <div class="slot_popup_quantity ${action_class}">
                    ${action_symbol}${Math.abs(quantity)}
                </div>
            </div>
        `;

        this.container.appendChild(notification);

        setTimeout(() => notification.classList.add("visible"), 10);

        setTimeout(() => {
            notification.classList.remove("visible");
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}