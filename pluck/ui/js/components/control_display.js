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

export class ControlDisplay {
    constructor() {
        this.controls = [];
        this.title = "CONTROLS";
        this.is_visible = false;
    }

    set_controls(title = "CONTROLS", controls = {}) {
        this.title = title;
        this.controls = Object.values(controls);
        
        if (!$("#control_display_section").length) {
            this.build();
        }
        
        this.render_controls();
    }

    build() {
        const content = `
            <div id="control_display_section">
                <div class="control_display_header">
                    <h3>${this.title}</h3>
                </div>
                <div class="control_display_grid" id="control_display_grid"></div>
            </div>
        `;
        $("#ui_focus").append(content);
    }

    render_controls() {
        $("#control_display_section h3").text(this.title);
        
        const controls_html = this.controls.map((control, idx) => {
            return `
                <div class="control_display_item" data-control-id="${idx}">
                    <div class="control_key">${control.key}</div>
                    <div class="control_action">${control.action}</div>
                </div>
            `;
        }).join("");
        
        $("#control_display_grid").html(controls_html);
    }

    show() {
        if (!this.is_visible) {
            $("#control_display_section").fadeIn(300);
            this.is_visible = true;
        }
    }

    hide() {
        if (this.is_visible) {
            $("#control_display_section").fadeOut(300);
            this.is_visible = false;
        }
    }

    toggle() {
        if (this.is_visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    destroy() {
        $("#control_display_section").remove();
        this.is_visible = false;
    }
}