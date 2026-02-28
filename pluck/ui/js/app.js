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

import { Builder } from "./builder.js";
import { Sidebar } from "./core/sidebar.js";
import { Notify } from "./components/notify.js";
import { DUISprite } from "./components/dui_sprite.js";
import { ProgressCircle } from "./components/progress_circle.js";
import { ProgressBar } from "./components/progress_bar.js";
import { Modal } from "./core/modal.js";
import { ActionMenu } from "./components/action_menu.js";
import { SlotPopup } from "./components/inventory_popup.js";
import { InteractionHint } from "./components/interaction_hint.js";
import { OptionsSelector } from "./components/option_selector.js";
import { TaskList } from "./components/task_list.js";
import { ControlDisplay } from "./components/control_display.js";
import { StatusHUD } from "./components/status_hud.js";

let interact_dui = null;
let action_menu = null;
let interaction_hint = null;
let options_selector = null;
let task_list = null;
let control_display = null;
let sidebar = null;
let status_hud = null;

/**
 * Notification instance
 * Will move settings to somewhere toggleable at some point?.. maybe..
 * @type {Notify}
 */
const notify = new Notify({
    position: "right-center",
    fill_direction: "up"
});

/**
 * Slot popup instance
 * @type {SlotPopup}
 */
const inventory_popup = new SlotPopup({
    position: "bottom-center"
});


/**
 * Registered message handlers for NUI callbacks.
 * @type {Object<string, Function>}
 */
const handlers = {};

/**
 * Builds a UI from a provided config payload.
 * @function handlers.build_ui
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - The UI configuration to render.
 */
handlers.build_ui = (data) => {
    if (!data.payload) {
        console.warn("No UI data provided");
        return;
    }

    if (window.ui_instance && typeof window.ui_instance.destroy === "function") {
        window.ui_instance.destroy();
        window.ui_instance = null;
    }

    const builder = new Builder(data.payload);
    window.ui_instance = builder;
};

/**
 * Destroys the currently active UI instance, if any.
 * @function handlers.close_ui
 */
handlers.close_ui = () => {
    if (window.ui_instance && typeof window.ui_instance.destroy === "function") {
        window.ui_instance.close();
        window.ui_instance.destroy();
        window.ui_instance = null;
    }

    if (window.audio_player) {
        window.audio_player.destroy();
        window.audio_player = null;
    }
};

/**
 * Displays a notification using the Notify component.
 * @function handlers.notify
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Notification content/config.
 */
handlers.notify = (data) => {
    if (!data || !data.payload) {
        console.warn("[Notify] Missing payload.");
        return;
    }

    notify.show(data.payload);
};

/**
 * Show progress circle.
 * @function handlers.show_circle
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Circle payload.
 */
handlers.show_circle = (data) => {
    new ProgressCircle(data.payload);
}

/**
 * Show progress bar.
 * @function handlers.show_circle
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Bar payload.
 */
handlers.show_progressbar = (data) => {
    new ProgressBar(data.payload);
}

/**
 * Displays a modal window using the Modal class.
 * @function handlers.show_modal
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Modal configuration.
 * @param {string} data.payload.title - Title of the modal.
 * @param {Array<Object>} [data.payload.options=[]] - Array of input definitions.
 * @param {Array<Object>} [data.payload.buttons=[]] - Array of button definitions.
 */
handlers.show_modal = (data) => {
    if (!data || !data.payload) {
        console.warn("[Modal] Missing payload.");
        return;
    }

    Modal.show({
        title: data.payload.title,
        options: data.payload.options || [],
        buttons: data.payload.buttons || []
    });
};

/**
 * Creates action menu
 * 
 */
handlers.create_action_menu = (data) => {
    action_menu = new ActionMenu();
    action_menu.create_menu(data.payload);
}

handlers.close_action_menu = () => {
    if (action_menu) {
        action_menu.close();
    }
}


/**
 * Updates interaction hint
 */
handlers.update_interaction_hint = (data) => {
    if (!interaction_hint) {
        interaction_hint = new InteractionHint();
    }
    interaction_hint.set_data(data.payload);
}

/**
 * Updates interaction hint quantity
 */
handlers.update_hint_quantity = (data) => {
    if (interaction_hint) {
        interaction_hint.update_quantity(data.payload.amount);
    }
}

handlers.update_hint_status = (data) => {
    if (interaction_hint) {
        interaction_hint.update_status_text(data.payload.text);
    }
}

/**
 * Clears interaction hint
 */
handlers.clear_interaction_hint = () => {
    if (interaction_hint) {
        interaction_hint.clear();
    }
}

/**
 * Destroys interaction hint
 */
handlers.destroy_interaction_hint = () => {
    if (interaction_hint) {
        interaction_hint.destroy();
        interaction_hint = null;
    }
}

/**
 * Sets options in selector
 */
handlers.set_options = (data) => {
    if (!options_selector) {
        options_selector = new OptionsSelector();
    }
    options_selector.set_options(data.payload.title, data.payload.options);
}

/**
 * Shows options selector
 */
handlers.show_options = () => {
    if (options_selector) {
        options_selector.show();
    }
}

/**
 * Hides options selector
 */
handlers.hide_options = () => {
    if (options_selector) {
        options_selector.hide();
    }
}

/**
 * Destroys options selector
 */
handlers.destroy_options_selector = () => {
    if (options_selector) {
        options_selector.destroy();
        options_selector = null;
    }
}

/**
 * Sets controls in control display
 * @function handlers.set_controls
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Control display config.
 * @param {string} data.payload.title - Title for the control display.
 * @param {Array<Object>} data.payload.controls - Array of control objects.
 */
handlers.set_controls = (data) => {
    if (!control_display) {
        control_display = new ControlDisplay();
    }
    control_display.set_controls(data.payload.title, data.payload.controls);
}

/**
 * Shows control display
 * @function handlers.show_controls
 */
handlers.show_controls = () => {
    if (control_display) {
        control_display.show();
    }
}

/**
 * Hides control display
 * @function handlers.hide_controls
 */
handlers.hide_controls = () => {
    if (control_display) {
        control_display.hide();
    }
}

/**
 * Destroys control display
 * @function handlers.destroy_controls
 */
handlers.destroy_controls = () => {
    if (control_display) {
        control_display.destroy();
        control_display = null;
    }
}

/**
 * Update slots UI 
 */
handlers.update_slots = (data) => {
    if (!data || !data.items) return;

    const ui = window.ui_instance;
    if (!ui || !ui.content) return;

    ui.content.update_slots_from_server(data.items);
};

/**
 * Shows task list
 */
handlers.show_task_list = (data) => {
    if (!task_list) {
        task_list = new TaskList();
    }
    task_list.set_tasks(data.payload.title, data.payload.tasks);
    task_list.show();
}

/**
 * Hides task list
 */
handlers.hide_task_list = () => {
    if (task_list) {
        task_list.hide();
    }
}

/**
 * Destroys task list
 */
handlers.destroy_task_list = () => {
    if (task_list) {
        task_list.destroy();
        task_list = null;
    }
}

/**
 * Updates specific task in task list
 */
handlers.update_task = (data) => {
    if (!task_list) return;
    
    const { task_id, updates } = data.payload;
    const tasks = task_list.tasks;
    const task_index = tasks.findIndex(t => t.id === task_id);
    
    if (task_index !== -1) {
        tasks[task_index] = { ...tasks[task_index], ...updates };
        task_list.set_tasks(task_list.title, tasks);
    }
}

/**
 * Builds a standalone sidebar outside of the builder.
 * @function handlers.build_sidebar
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Sidebar configuration.
 */
handlers.build_sidebar = (data) => {
    if (!data || !data.payload) {
        console.warn("[Sidebar] Missing payload.");
        return;
    }

    if (sidebar) {
        $("#ui_focus .sidebar").remove();
    }

    sidebar = new Sidebar(data.payload);
    sidebar.append_to("#ui_focus");
};

/**
 * Closes the standalone sidebar.
 * @function handlers.close_sidebar
 */
handlers.close_sidebar = () => {
    if (sidebar) {
        $("#ui_focus .sidebar").remove();
        sidebar = null;
    }
};

/** Shows the status HUD, initializing it if needed.
 * @function handlers.show_status_hud
 */
handlers.show_status_hud = () => {
    if (!status_hud) status_hud = new StatusHUD()
    status_hud.show()
}

/** Hides the status HUD.
 * @function handlers.hide_status_hud
 */
handlers.hide_status_hud = () => {
    if (status_hud) status_hud.hide()
}

/** Updates the status HUD with new data.
 * @function handlers.update_status_hud
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Status data payload.
 */
handlers.update_status_hud = (data) => {
    if (!data || !data.payload) return
    if (!status_hud) status_hud = new StatusHUD()
    status_hud.update(data.payload)
}

/** Sets the player headshot image on the status HUD.
 * @function handlers.set_status_headshot
 * @param {Object} data - Message data object.
 * @param {Object} data.payload - Headshot payload.
 * @param {string} data.payload.src - Image source URL.
 */
handlers.set_status_headshot = (data) => {
    if (!data || !data.payload) return
    if (!status_hud) status_hud = new StatusHUD()
    status_hud.set_headshot(data.payload.src)
}

/** Destroys the status HUD instance.
 * @function handlers.destroy_status_hud
 */
handlers.destroy_status_hud = () => {
    if (status_hud) {
        status_hud.destroy()
        status_hud = null
    }
}

/**
 * Global message listener for all NUI messages.
 * Routes each message to its corresponding handler.
 */
window.addEventListener("message", (event) => {
    const { func } = event.data;
    const handler = handlers[func];

    if (typeof handler !== "function") {
        console.warn(`Handler missing: ${func}`);
        return;
    }

    handler(event.data);
});

/*
window.test_modal = () => {
    Modal.show({
        title: "Test Modal",
        options: [
            {
                id: "slider_1",
                label: "Slider 1",
                type: "range",
                min: 0,
                max: 100,
                value: 50
            },
            {
                id: "slider_2",
                label: "Slider 2",
                type: "range",
                min: 0,
                max: 100,
                value: 50
            }
        ],
        buttons: [
            {
                id: "confirm",
                label: "Confirm",
                on_action: function(ui_data) {
                    console.log(ui_data.dataset);
                }
            },
            {
                id: "cancel",
                label: "Cancel",
                action: "close_modal"
            }
        ]
    });
};

window.test_slot_popup = () => {
    const test_items = [
        { item_id: "water", image: "/libs/pluck/ui/assets/items/water.png", quantity: 5, action: "added", rarity: "common" },
        { item_id: "weapon_pistol", image: "/libs/pluck/ui/assets/items/weapon_pistol.png", quantity: 1, action: "added", rarity: "rare" },
        { item_id: "cash", image: "/libs/pluck/ui/assets/items/cash.png", quantity: 100, action: "removed", rarity: "uncommon" },
        { item_id: "ammo_pistol", image: "/libs/pluck/ui/assets/items/ammo_pistol.png", quantity: 50, action: "added", rarity: "legendary" }
    ];

    let delay = 0;
    test_items.forEach((item, index) => {
        setTimeout(() => {
            inventory_popup.show(item);
        }, delay);
        delay += 5000;
    });
};

window.test_fishing_ui = () => {
    const test_baits = [
        {
            id: 'weed',
            label: 'Weed',
            image: '/libs/pluck/ui/assets/items/weed.png',
            quantity: 5,
            enabled: true
        },
        {
            id: 'cash',
            label: 'Cash',
            image: '/libs/pluck/ui/assets/items/cash.png',
            quantity: 2,
            enabled: true
        },
        {
            id: 'weapon_pistol',
            label: 'Pistol',
            image: '/libs/pluck/ui/assets/items/weapon_pistol.png',
            quantity: 0,
            enabled: false
        },
        {
            id: 'tomato',
            label: 'Tomato',
            image: '/libs/pluck/ui/assets/items/tomato.png',
            quantity: 10,
            enabled: true
        }
    ];

    const interaction_hint = new InteractionHint('activities_container');
    const options_selector = new OptionsSelector('options_container');

    options_selector.set_options('SELECT ITEM', test_baits);
    options_selector.show();

    setTimeout(() => {
        interaction_hint.set_data({
            image: '/libs/pluck/ui/assets/items/tomato.png',
            label: 'Tomato',
            quantity: 5,
            action_text: 'Press F to thow or E to change item'
        });
    }, 2000);

    setTimeout(() => {
        interaction_hint.update_quantity(3);
    }, 5000);

    setTimeout(() => {
        interaction_hint.clear();
    }, 8000);
};

window.test_action_menu = () => {
    if (action_menu) {
        action_menu.close();
        action_menu = null;
    }

    action_menu = new ActionMenu();

    action_menu.create_menu([
        {
            label: "Main Menu",
            icon: "fa-solid fa-bars",
            colour: "#e4ad29",
            submenu: [
                {
                    label: "Submenu 1",
                    icon: "fa-solid fa-arrow-right",
                    colour: "#e4ad29",
                    submenu: [
                        {
                            label: "Do Something",
                            icon: "fa-solid fa-cog",
                            colour: "#e4ad29",
                            on_action: () => {
                                console.log("Do Something clicked");
                            }
                        },
                        {
                            label: "Another Thing",
                            icon: "fa-solid fa-bolt",
                            colour: "#4bc0c8",
                            on_action: () => {
                                console.log("Another Thing clicked");
                            }
                        }
                    ]
                },
                {
                    label: "Cloud Action",
                    icon: "fa-solid fa-cloud",
                    colour: "#4bc0c8",
                    on_action: () => {
                        console.log("Cloud action clicked");
                    }
                }
            ]
        },
        {
            label: "Quick Action",
            icon: "fa-solid fa-bolt",
            colour: "#ffcc00",
            on_action: () => {
                console.log("Quick action clicked");
            }
        },
        {
            label: "Quick Action",
            icon: "fa-solid fa-bolt",
            colour: "#ffcc00",
            on_action: () => {
                console.log("Quick action clicked");
            }
        },
        {
            label: "Quick Action",
            icon: "fa-solid fa-bolt",
            colour: "#ffcc00",
            on_action: () => {
                console.log("Quick action clicked");
            }
        },
        {
            label: "Quick Action",
            icon: "fa-solid fa-bolt",
            colour: "#ffcc00",
            on_action: () => {
                console.log("Quick action clicked");
            }
        }
    ]);
};

window.test_task_list = () => {
    if (!task_list) {
        task_list = new TaskList();
    }

    task_list.set_tasks("TASKS", [
        {
            id: "task_1",
            label: "Task 1",
            description: "This is the first task description",
            completed: true,
            action: "test_action"
        },
        {
            id: "task_2",
            label: "Task 2",
            description: "This is the second task description",
            in_progress: true,
            progress: 65,
            action: "test_action"
        },
        {
            id: "task_3",
            label: "Task 3",
            description: "This is the third task description",
            progress: 0,
            action: "test_action"
        },
        {
            id: "task_4",
            label: "Task 4",
            description: "This is the fourth task description",
            progress: 33,
            action: "test_action"
        }
    ]);
    
    task_list.show();
}

window.test_task_update = () => {
    if (!task_list) return;

    const tasks = task_list.tasks;
    const task = tasks.find(t => t.id === "task_2");
    
    if (task) {
        task.progress = 100;
        task.completed = true;
        task.in_progress = false;
        task_list.set_tasks(task_list.title, tasks);
    }
}

window.test_task_list_close = () => {
    if (task_list) {
        task_list.hide();
    }
}

window.test_controls = () => {
    if (!control_display) {
        control_display = new ControlDisplay();
    }
    control_display.set_controls("PLACEMENT MODE", [
        { key: 'W', action: 'Move Forward' },
        { key: 'A', action: 'Move Left' },
        { key: 'S', action: 'Move Backward' },
        { key: 'D', action: 'Move Right' },
        { key: 'G', action: 'Rotate Left' },
        { key: 'H', action: 'Rotate Right' },
        { key: 'Enter', action: 'Confirm' },
        { key: 'Backspace', action: 'Cancel' },
    ]);
    control_display.show();
}
*/