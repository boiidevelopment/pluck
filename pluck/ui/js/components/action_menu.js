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

import { send_nui_callback } from "./../utils.js";

export class ActionMenu {
    constructor() {
        this.menu_stack = [];
        this.is_menu_active = false;
        this.default_settings = {
            font: 'Kanit',
            icon_colour: '#e4ad29',
        };
        this.create_menu_container();
        this.bind_exit_event();
    }

    bind_exit_event() {
        $(document).ready(() => {
            $(document).keyup((e) => this.handle_exit(e));
        });
    }

    handle_exit(e) {
        if (e.key === 'Escape' || e.key === 'Backspace') {
            this.close();
        }
    }

    create_menu_container() {
        this.menu_container = $('<div>').addClass('action_menu_container');
        $('#ui_main').append(this.menu_container);
    }

    create_menu(actions) {
        this.menu_stack.push(actions);
        this.render_menu(actions);
        this.is_menu_active = true;
    }

    render_menu(actions) {
        const colour = this.default_settings.icon_colour;
        this.menu_container.empty();
        const menu_left = $('<div>').addClass('actions left');
        const menu_right = $('<div>').addClass('actions right');
        const icon = this.menu_stack.length > 1 ? 'fa fa-rotate-left' : 'fa fa-times';
        const center_button = $('<div>').addClass('center_button').html(`<i class='${icon}' style='color:${colour}'></i>`);
        center_button.on('click', () => this.handle_center_button_click());
        actions.forEach((action, index) => {
            let action_html = this.create_action_element(action, index);
            action_html.on('click', () => this.handle_action_click(action));
            if (index % 2 === 0) {
                menu_right.append(action_html);
            } else {
                menu_left.append(action_html);
            }
        });
        this.adjust_action_positions(menu_left, menu_right);
        this.menu_container.append(menu_left, center_button, menu_right);
    }

    create_action_element(action, index) {
        const colour = action.colour || this.default_settings.icon_colour;
        const font = this.default_settings.font;
        const label_html = `<span class='label' style='font-family: ${font};'>${action.label}</span>`;
        const icon_html = `<span class='icon' style='color:${colour}'><i class='${action.icon}'></i></span>`;
        let action_html = $('<div>').addClass('action');
        if (index % 2 === 0) {
            action_html.html(`<div class='label_container'>${icon_html}${label_html}</div>`);
        } else {
            action_html.html(`<div class='label_container'>${label_html}${icon_html}</div>`);
        }
        return action_html;
    }

    adjust_action_positions(menu_left, menu_right) {
        const count_left = menu_left.children().length;
        const count_right = menu_right.children().length;
        if (count_left > 2) {
            menu_left.children().first().css('transform', 'translateX(10%)');
            menu_left.children().last().css('transform', 'translateX(10%)');
        } else {
            menu_left.children().first().css('transform', '');
            menu_left.children().last().css('transform', '');
        }
        if (count_right > 2) {
            menu_right.children().first().css('transform', 'translateX(-10%)');
            menu_right.children().last().css('transform', 'translateX(-10%)');
        } else {
            menu_right.children().first().css('transform', '');
            menu_right.children().last().css('transform', '');
        }
    }

    async handle_action_click(action) {
        if (action.submenu) {
            this.create_menu(action.submenu);
        } else if (action.action) {
            const should_close = this.menu_stack.length === 1;
            await send_nui_callback(action.action, {}, { should_close });
            
            if (should_close) {
                this.is_menu_active = false;
                this.close();
            }
        }
    }

    handle_center_button_click() {
        if (this.menu_stack.length > 1) {
            this.menu_stack.pop();
            this.render_menu(this.menu_stack[this.menu_stack.length - 1]);
        } else {
            this.close();
        }
    }

    close() {
        this.menu_container.empty();
        this.menu_stack = [];
        this.is_menu_active = false;

        fetch(`https://pluck/action_menu:close`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
    }
}