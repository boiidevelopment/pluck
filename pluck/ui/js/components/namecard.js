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

import { resolve_image_path } from "./../utils.js";

export class Namecard {
    constructor({ avatar, background = "avatar_placeholder.png", name = "Player Name", title = "Player Title", level = "99", tier = "bronze" }) {
        this.avatar = avatar;
        this.background = background;
        this.name = name;
        this.title = title;
        this.level = level;
        this.tier = tier;
    }

    get_html() {
        const frame_class = this.frame ? `namecard_frame_${this.frame}` : "";

        const bg_url = resolve_image_path(this.background, "/pluck/ui/assets/namecards/backgrounds/");
        const avatar_url = resolve_image_path(this.avatar, "/pluck/ui/assets/namecards/avatars/");

        return `
            <div class="namecard ${this.tier} ${frame_class}" style="background-image:url(${bg_url})">
                <div class="namecard_avatar" style="background-image:url(${avatar_url})"></div>
                ${this.frame ? `<div class="namecard_frame_overlay"></div>` : ""}
                <div class="namecard_info">
                    <div class="namecard_name">${this.name}</div>
                    <div class="namecard_title">${this.title}</div>
                </div>
                <div class="namecard_level ${this.tier}">Lv. ${this.level}</div>
            </div>
        `.trim();
    }

    /** @todo Add a method to update dynamically at some point.. */ 
}
