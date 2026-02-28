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
import { Namecard } from "../components/namecard.js"
import { AudioPlayer } from "../components/audioplayer.js"
import { send_nui_callback } from "./../utils.js";

/**
 * @class Footer
 * @description Generates a footer with sections for buttons, keybinds, tooltips, and custom layout.
 */
export class Footer {
    /**
     * @param {Object} config
     * @param {Object} config.layout - Flex config for left, center, right.
     * @param {Object} config.elements - Footer elements for each section.
     * @param {Function} [config.on_action] - Callback when an action is clicked.
     * @param {Function} [config.on_button_action] - Callback for button clicks.
     */
    constructor({ layout = {}, elements = {}, on_action = null, on_button_action = null }) {
        this.layout = layout;
        this.elements = elements;
        this.on_action = on_action;
        this.on_button_action = on_button_action;
        this.audio_player = null;
        this.action_callbacks = {};
    }

    /** @param {string} section @returns {string} CSS style string for section */
    get_section_style(section) {
        const c = this.layout[section] || {};
        return `justify-content:${c.justify || "center"};align-items:${c.align || "center"};gap:${c.gap || "1vw"}`;
    }

    /** @param {Object} elem @returns {string} HTML for a single footer element */
    build_element(elem) {
        const { type } = elem;
        if (type === "text") return `<div class="footer_text">${elem.text}</div>`;
        if (type === "actions") {
            const actions = Array.isArray(elem.actions) ? elem.actions : [elem];
            return `
                <div class="footer_actions_group">
                    ${actions.map((a, idx) => {
                        let action_key = a.action;
                        if (typeof a.action === "function") {
                            action_key = `action_${idx}`;
                            this.action_callbacks[action_key] = a.action;
                        }
                        return `
                        <div class="footer_action ${a.class || ""}" ${a.id ? `id="${a.id}"` : ""} data-action="${action_key}" data-key="${a.key}" ${a.should_close ? 'data-should_close="true"' : ""}>
                            <span class="footer_key">${a.key}</span><span class="footer_label">${a.label}</span>
                        </div>`;
                    }).join("")}
                </div>
            `.trim();
        }
        if (type === "buttons") {
            const buttons = Array.isArray(elem.buttons) ? elem.buttons : Object.values(elem.buttons || {});
            return new Buttons({ buttons, classes: "footer_button_group" }).get_html();
        }
        if (type === "group") {
            const items = Array.isArray(elem.items) ? elem.items : Object.values(elem.items || {});
            return `<div class="footer_group">${items.map(i => this.build_element(i)).join("")}</div>`;
        }
        if (type === "namecard") return new Namecard(elem).get_html();
        if (type === "audioplayer") {
            if (AudioPlayer.instance && AudioPlayer.instance.initialized) {
                console.log("[Footer] AudioPlayer already exists, reusing");
                return AudioPlayer.instance.get_html();
            }
            this.audio_player = new AudioPlayer(elem.autoplay ?? true, elem.randomize ?? true);
            return this.audio_player.get_html();
        }
        return "";
    }

    /** @returns {string} Final footer HTML string */
    get_html() {
        return `
            <div class="footer">
                ${["left", "center", "right"].map(s => {
                    const items = Array.isArray(this.elements[s]) ? this.elements[s] : Object.values(this.elements[s] || {});
                    return `<div class="footer_section ${s}" style="${this.get_section_style(s)}">
                        ${items.map(e => this.build_element(e)).join("")}
                    </div>`;
                }).join("")}
            </div>`.trim();
    }

    /** @param {string} [container="#ui_main"] Appends footer HTML */
    append_to(container = "#ui_main") {
        $(container).append(this.get_html());
        this.bind_events();
        if (this.audio_player) {
            window.audio_player = this.audio_player;
        }
    }

    /** Binds events to footer */
    bind_events() {
        $(".footer_button_group .btn").off("click").on("click", e => {
            const id = $(e.currentTarget).data("button");
            const action = $(e.currentTarget).data("action");
            if (this.on_button_action) return this.on_button_action(id, action);
            if (action) {
                console.log("[Footer] Clicked footer button:", action);
                send_nui_callback(action, { source: "footer_button", id });
            }
        });

        $(document).off("keydown.footer").on("keydown.footer", e => {
            const key = e.key.toUpperCase();
            const $match = $(`.footer_action[data-key="${key}"]`);
            if ($match.length) {
                const action = $match.data("action");
                if (action) {
                    e.preventDefault();
                    const should_close = $match.data("should_close") === true;

                    if (this.action_callbacks[action]) {
                        this.action_callbacks[action]();

                        if (should_close && window.ui_instance) {
                            if (window.audio_player) {
                                window.audio_player.destroy();
                                window.audio_player = null;
                            }
                            window.ui_instance.destroy();
                            window.ui_instance = null;
                        }
                    } else {
                        if (this.on_action) {
                            this.on_action(action, { should_close });
                        } else {
                            send_nui_callback(action, { keypress: true }, { should_close }).then(() => {
                                if (should_close && window.ui_instance) {
                                    if (window.audio_player) {
                                        window.audio_player.destroy();
                                        window.audio_player = null;
                                    }
                                    window.ui_instance.destroy();
                                    window.ui_instance = null;
                                }
                            });
                        }
                    }
                }
            }
        });
    }

}