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

import { send_nui_callback, extract_dataset } from "./../utils.js";

export class TaskList {
    constructor() {
        this.tasks = [];
        this.title = "TASK LIST";
    }

    set_tasks(title = null, tasks = []) {
        if (!$("#task_list_section").length) {
            this.build();
        }
        
        this.tasks = tasks;
        if (title) this.title = title;
        this.render_tasks();
        $("#task_list_section h3").text(this.title);
    }

    build() {
        const content = `
            <div id="task_list_section">
                <h3>TASK LIST</h3>
                <div class="task_list_container" id="task_list_container"></div>
                <p class="task_list_close">Press ESC to close</p>
            </div>
        `;
        $("#ui_focus").append(content);
        this.add_listeners();
        $("#task_list_section").hide();
    }

    render_tasks() {
        const tasks_array = Array.isArray(this.tasks) ? this.tasks : Object.values(this.tasks);
        const tasks_html = tasks_array.map(task => {
            const status = task.completed ? "completed" : task.in_progress ? "in_progress" : "pending";
            const status_text = task.completed ? "COMPLETE" : task.in_progress ? "IN PROGRESS" : "PENDING";
            const dataset = Object.entries(task.dataset || {}).map(([k, v]) => `data-${k}="${v}"`).join(" ");
            
            return `
                <div class="task_list_item ${status}" 
                    data-action="${task.action || ""}"
                    data-task-id="${task.id}"
                    ${dataset}>
                    <div class="task_list_status_badge ${status}">${status_text}</div>
                    <div class="task_list_content">
                        <div class="task_list_label">${task.label}</div>
                        ${task.description ? `<div class="task_list_description">${task.description}</div>` : ""}
                        ${task.progress !== undefined ? `
                            <div class="task_list_progress">
                                <div class="task_list_progress_bar">
                                    <div class="task_list_progress_fill" style="width: ${task.progress}%"></div>
                                </div>
                                <div class="task_list_progress_text">${task.progress}%</div>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }).join("");
        $("#task_list_container").html(tasks_html);
    }

    add_listeners() {
        $(document).on("click", ".task_list_item", (e) => {
            const $item = $(e.currentTarget);
            const action = $item.data("action");
            
            if (!action) return;

            const dataset = extract_dataset($item);
            send_nui_callback(action, dataset);
        });

        $(document).keyup((e) => {
            if (e.key === "Escape" && $("#task_list_section").is(":visible")) {
                this.hide();
            }
        });
    }

    show() {
        $("#task_list_section").fadeIn(500);
    }

    hide() {
        $.post(`https://${GetParentResourceName()}/nui:remove_focus`, JSON.stringify({}));
        $("#task_list_section").fadeOut(500);
    }

    destroy() {
        $("#task_list_section").remove();
    }
}