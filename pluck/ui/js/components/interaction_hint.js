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

export class InteractionHint {
    constructor() {
        this.current_item = null;
    }

    set_data(data) {
        if (!$(".interaction_hint").length) {
            this.build(data.image !== undefined);
        }
        this.current_item = data;
        this.update_display();
    }

    build(show_image) {
        const content = `
            <div class="interaction_hint">
                ${show_image ? `<div class="hint_item"><img id="hint_image" src="" alt="Item Image"></div>` : ""}
                <div class="hint_message">
                    <p id="hint_status">NO ITEM EQUIPPED</p>
                    <p id="hint_action">Press E to Equip Item</p>
                </div>
            </div>
        `;
        $("#ui_focus").append(content);
    }

    update_display() {
        if (!this.current_item) {
            $("#hint_status").text("No Item Equipped");
            $("#hint_action").text("Press E to equip item");
            if ($("#hint_image").length) $("#hint_image").attr("src", "/pluck/ui/assets/items/no_item.png");
            return;
        }

        if (this.current_item.image && $("#hint_image").length) {
            $("#hint_image").attr("src", this.current_item.image);
        }

        if (this.current_item.quantity !== undefined) {
            $("#hint_status").html(`<div><span>${this.current_item.label || ""}</span><span id="hint_quantity">${this.current_item.quantity}x</span></div>`);
        } else {
            $("#hint_status").text(this.current_item.status_text || this.current_item.label || "");
        }

        $("#hint_action").text(this.current_item.action_text || "Press F to interact");
    }

    update_quantity(amount) {
        if (!this.current_item) return;
        this.current_item.quantity = amount;
        $("#hint_quantity").text(amount + "x");
        if (amount === 0) this.clear();
    }

    update_status_text(text) {
        $("#hint_status").text(text);
    }

    clear() {
        this.current_item = null;
        this.update_display();
    }

    destroy() {
        $(".interaction_hint").remove();
    }
}