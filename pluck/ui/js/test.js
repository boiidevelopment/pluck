import { Builder } from "../js/builder.js";

const GRID_MODE = true;

const make_text = (title, subtitle) => ({ type: "text", ...(title && { title }), ...(subtitle && { subtitle }) });
const make_actions = (...actions) => ({ type: "actions", actions });
const make_buttons = (...buttons) => ({ type: "buttons", buttons });
const make_modal = (title, options, buttons) => ({ title, options, buttons });
const make_btn = (id, label, action, cls = "primary", dataset = {}, modal = null) => ({
    id, label, action, class: cls, dataset, ...(modal && { modal })
});
const make_card = (title, description, layout, on_hover, buttons = []) => ({
    title, description, layout, on_hover, ...(buttons.length && { buttons })
});
const make_on_hover = (title, description, values = [], actions = [], rarity = "common") => ({
    title, description, values, actions, rarity
});

const default_dataset = { target_id: "some_target", source: "some_source" };
const modal_dataset = { source: "some_source", section: "some_section", item: "some_item" };

const shared_modal = make_modal(
    "Some Modal Title",
    [{ id: "some_option", label: "Some Option", type: "text" }],
    [
        make_btn("some_modal_button_1", "Modal Btn 1", "some_modal_action_1", "primary", modal_dataset),
        make_btn("some_modal_button_2", "Modal Btn 2", "some_modal_action_2", "secondary", modal_dataset)
    ]
);

const single_modal = make_modal(
    "Some Modal Title",
    [{ id: "some_option", label: "Some Option", type: "text" }],
    [make_btn("some_modal_button_1", "Some Label", "some_modal_action_1", "primary", modal_dataset)]
);

const card_hover_john = make_on_hover(
    "Card Info",
    ["Info descriptions can support arrays", "- like so", "- you get the idea"],
    [{ key: "Key", value: "Value Pairs" }, { key: "Name", value: "John Doe" }],
    [{ id: "test_action", key: "E", label: "Action on Keypress" }]
);

const card_hover_case = make_on_hover(
    "Card Info",
    ["Info descriptions can support arrays", "- like so", "- you get the idea"],
    [{ key: "Key", value: "Value Pairs" }, { key: "Name", value: "Case" }],
    [{ id: "test_action", key: "E", label: "Action on Keypress" }]
);

const shared_card_btn = make_btn("some_button", "Some Btn", "some_action", "primary", default_dataset, shared_modal);
const single_card_btn = make_btn("some_button", "Some Btn", "some_action", "primary", default_dataset, single_modal);

const inventory_slots_page = {
    index: 1,
    title: "Inventory",
    layout: { left: 4, center: 4, right: 4 },

    center: {
        type: "slots",
        layout: { scroll_y: "none" },
        allow_cross_group_swap: true,
        groups: [{
            id: "loadout",
            layout_type: "positioned",
            collapsible: false,
            slots: [
                { id: "helmet",    label: "Helmet",    position: { top: "2%",  left: "20%"  }, size: "80px" },
                { id: "mask",      label: "Mask",      position: { top: "2%",  right: "20%" }, size: "80px" },
                { id: "backpack",  label: "Backpack",  position: { top: "22%", left: "5%"   }, size: "80px" },
                { id: "primary",   label: "Primary",   position: { top: "22%", right: "5%"  }, size: "80px" },
                { id: "vest",      label: "Vest",      position: { top: "42%", left: "5%"   }, size: "80px" },
                { id: "secondary", label: "Secondary", position: { top: "42%", right: "5%"  }, size: "80px" },
                { id: "shirt",     label: "Shirt",     position: { top: "62%", left: "5%"   }, size: "80px" },
                { id: "melee",     label: "Melee",     position: { top: "62%", right: "5%"  }, size: "80px" },
                { id: "pants",     label: "Pants",     position: { top: "82%", left: "20%"  }, size: "80px" },
                { id: "shoes",     label: "Shoes",     position: { top: "82%", right: "20%" }, size: "80px" }
            ],
            items: {}
        }]
    },

    left: {
        type: "slots",
        title: { text: "Equipment", span: `<i class="fa-solid fa-weight-hanging"></i> 45/120` },
        groups: [
            {
                id: "vest", title: "Tactical Vest", span: `<i class="fa-solid fa-shield"></i> 8/8`,
                slot_count: 16, columns: 8, slot_size: "65px", collapsible: true, collapsed: false,
                items: {
                    "1": {
                        id: "ammo_pistol",
                        image: "/pluck/ui/assets/items/ammo_pistol.png",
                        quantity: 50,
                        category: "ammunition",
                        on_hover: {
                            title: "9mm Ammunition",
                            description: ["Standard 9mm rounds for pistols", "- Compatible with all 9mm weapons", "- Standard pressure rounds"],
                            values: [
                                { key: "Weight", value: "0.1kg" },
                                { key: "Category", value: "Ammunition" },
                                { key: "Caliber", value: "9mm" }
                            ],
                            actions: [
                                { id: "use_ammo", key: "E", label: "Load Magazine" },
                                { id: "drop_ammo", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    "2": {
                        id: "pistol_mag_extended",
                        image: "/pluck/ui/assets/items/pistol_mag_extended.png",
                        quantity: 2,
                        category: "magazine",
                        on_hover: {
                            title: "Extended Pistol Magazine",
                            description: ["High-capacity magazine for pistols", "- Holds up to 30 rounds", "- Compatible with 9mm pistols"],
                            values: [
                                { key: "Weight", value: "0.3kg" },
                                { key: "Capacity", value: "30 rounds" },
                                { key: "Caliber", value: "9mm" }
                            ],
                            actions: [
                                { id: "equip_mag", key: "E", label: "Equip Magazine" },
                                { id: "drop_mag", key: "G", label: "Drop" }
                            ],
                            rarity: "rare"
                        }
                    }
                }
            },
            {
                id: "backpack", title: "Backpack", span: `<i class="fa-solid fa-bag-shopping"></i> 20/20`,
                slot_count: 32, columns: 8, slot_size: "65px", collapsible: true, collapsed: false,
                items: {
                    "1": {
                        id: "cabbage",
                        image: "/pluck/ui/assets/items/cabbage.png",
                        quantity: 5,
                        category: "food",
                        on_hover: {
                            title: "Cabbage",
                            description: ["Fresh cabbage. Restores hunger.", "- Grown locally", "- Can be eaten raw or cooked"],
                            values: [
                                { key: "Weight", value: "0.5kg" },
                                { key: "Hunger", value: "+15%" },
                                { key: "Category", value: "Food" }
                            ],
                            actions: [
                                { id: "eat_cabbage", key: "E", label: "Eat" },
                                { id: "drop_cabbage", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    "2": {
                        id: "corn",
                        image: "/pluck/ui/assets/items/corn.png",
                        quantity: 8,
                        category: "food",
                        on_hover: {
                            title: "Corn",
                            description: ["Sweet corn. Can be eaten or cooked.", "- High calorie content", "- Used in cooking recipes"],
                            values: [
                                { key: "Weight", value: "0.3kg" },
                                { key: "Hunger", value: "+10%" },
                                { key: "Category", value: "Food" }
                            ],
                            actions: [
                                { id: "eat_corn", key: "E", label: "Eat" },
                                { id: "drop_corn", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    }
                }
            },
            {
                id: "belt", title: "Utility Belt", span: `<i class="fa-solid fa-circle"></i> 6/6`,
                slot_count: 8, columns: 8, slot_size: "65px", collapsible: true, collapsed: false,
                items: {
                    "1": {
                        id: "weapon_pistol",
                        image: "/pluck/ui/assets/items/weapon_pistol.png",
                        quantity: 1,
                        category: "weapon",
                        progress: { value: 72 },
                        on_hover: {
                            title: "9mm Pistol",
                            description: ["Holstered sidearm.", "- Reliable semi-automatic pistol", "- Standard issue sidearm"],
                            values: [
                                { key: "Weight", value: "1.2kg" },
                                { key: "Condition", value: "72%" },
                                { key: "Caliber", value: "9mm" },
                                { key: "Category", value: "Weapon" }
                            ],
                            actions: [
                                { id: "equip_pistol", key: "E", label: "Equip" },
                                { id: "drop_pistol", key: "G", label: "Drop" }
                            ],
                            rarity: "uncommon"
                        }
                    }
                }
            },
            {
                id: "pockets", title: "Pockets", span: `<i class="fa-solid fa-hand"></i> 4/4`,
                slot_count: 8, columns: 8, slot_size: "65px", collapsible: true, collapsed: false, show_slot_numbers: true,
                items: {
                    "1": {
                        id: "weed",
                        image: "/pluck/ui/assets/items/weed.png",
                        quantity: 3,
                        category: "plant",
                        on_hover: {
                            title: "Cannabis",
                            description: ["Medicinal plant material.", "- Illegally obtained", "- Has street value"],
                            values: [
                                { key: "Weight", value: "0.1kg" },
                                { key: "Category", value: "Contraband" },
                                { key: "Street Value", value: "$45" }
                            ],
                            actions: [
                                { id: "use_weed", key: "E", label: "Use" },
                                { id: "drop_weed", key: "G", label: "Drop" }
                            ],
                            rarity: "uncommon"
                        }
                    }
                }
            }
        ]
    },

    right: {
        type: "slots",
        title: { text: "Vicinity", span: `<i class="fa-solid fa-location-dot"></i> Ground` },
        layout: { columns: 8, slot_size: "65px" },
        slot_count: 200,
        items: {
            "1": {
                id: "weapon_pistol",
                image: "/pluck/ui/assets/items/weapon_pistol.png",
                quantity: 1,
                category: "weapon",
                progress: { value: 55 },
                on_hover: {
                    title: "9mm Pistol",
                    description: ["Found on the ground.", "- Reliable semi-automatic pistol", "- Showing signs of wear"],
                    values: [
                        { key: "Weight", value: "1.2kg" },
                        { key: "Condition", value: "55%" },
                        { key: "Caliber", value: "9mm" },
                        { key: "Category", value: "Weapon" }
                    ],
                    actions: [{ id: "pickup_pistol", key: "E", label: "Pick Up" }],
                    rarity: "uncommon"
                }
            },
            "2": {
                id: "ammo_pistol",
                image: "/pluck/ui/assets/items/ammo_pistol.png",
                quantity: 48,
                category: "ammunition",
                on_hover: {
                    title: "9mm Ammunition",
                    description: ["Standard 9mm rounds.", "- Compatible with all 9mm weapons"],
                    values: [
                        { key: "Weight", value: "0.1kg" },
                        { key: "Caliber", value: "9mm" },
                        { key: "Category", value: "Ammunition" }
                    ],
                    actions: [{ id: "pickup_ammo", key: "E", label: "Pick Up" }],
                    rarity: "common"
                }
            },
            "3": {
                id: "cabbage",
                image: "/pluck/ui/assets/items/cabbage.png",
                quantity: 3,
                category: "food",
                on_hover: {
                    title: "Cabbage",
                    description: ["Fresh cabbage. Restores hunger."],
                    values: [
                        { key: "Weight", value: "0.5kg" },
                        { key: "Hunger", value: "+15%" },
                        { key: "Category", value: "Food" }
                    ],
                    actions: [{ id: "pickup_cabbage", key: "E", label: "Pick Up" }],
                    rarity: "common"
                }
            }
        }
    }
};

const inventory_grid_page = {
    index: 1,
    title: "Inventory",
    layout: { left: 4, center: 4, right: 4 },

    center: {
        type: "slots",
        layout: { scroll_y: "none" },
        allow_cross_group_swap: true,
        groups: [{
            id: "loadout",
            layout_type: "positioned",
            collapsible: false,
            slots: [
                { id: "helmet",    label: "Helmet",    position: { top: "2%",  left: "20%"  }, size: "80px" },
                { id: "mask",      label: "Mask",      position: { top: "2%",  right: "20%" }, size: "80px" },
                { id: "backpack",  label: "Backpack",  position: { top: "22%", left: "5%"   }, size: "80px" },
                { id: "primary",   label: "Primary",   position: { top: "22%", right: "5%"  }, size: "80px" },
                { id: "vest",      label: "Vest",      position: { top: "42%", left: "5%"   }, size: "80px" },
                { id: "secondary", label: "Secondary", position: { top: "42%", right: "5%"  }, size: "80px" },
                { id: "shirt",     label: "Shirt",     position: { top: "62%", left: "5%"   }, size: "80px" },
                { id: "melee",     label: "Melee",     position: { top: "62%", right: "5%"  }, size: "80px" },
                { id: "pants",     label: "Pants",     position: { top: "82%", left: "20%"  }, size: "80px" },
                { id: "shoes",     label: "Shoes",     position: { top: "82%", right: "20%" }, size: "80px" }
            ],
            items: {}
        }]
    },

    left: {
        type: "grid",
        title: { text: "Equipment", span: `<i class="fa-solid fa-weight-hanging"></i> 45/120` },
        layout: { scroll_x: "none", scroll_y: "scroll" },
        groups: [
            {
                id: "vest",
                title: "Tactical Vest",
                span: `<i class="fa-solid fa-shield"></i>`,
                layout: { columns: 10, rows: 3, cell_size: "3vw" },
                collapsible: true,
                collapsed: false,
                items: [
                    {
                        id: "ammo_pistol",
                        image: "/pluck/ui/assets/items/ammo_pistol.png",
                        label: "9mm",
                        col: 1, row: 1, w: 1, h: 1,
                        quantity: 50,
                        category: "ammunition",
                        on_hover: {
                            title: "9mm Ammunition",
                            description: ["Standard 9mm rounds for pistols", "- Compatible with all 9mm weapons"],
                            values: [
                                { key: "Weight", value: "0.1kg" },
                                { key: "Caliber", value: "9mm" }
                            ],
                            actions: [
                                { id: "use_ammo", key: "E", label: "Load Magazine" },
                                { id: "drop_ammo", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    {
                        id: "pistol_mag_extended",
                        image: "/pluck/ui/assets/items/pistol_mag_extended.png",
                        label: "Mag",
                        col: 2, row: 1, w: 1, h: 2,
                        quantity: 2,
                        category: "magazine",
                        on_hover: {
                            title: "Extended Pistol Magazine",
                            description: ["High-capacity magazine for pistols", "- Holds up to 30 rounds"],
                            values: [
                                { key: "Weight", value: "0.3kg" },
                                { key: "Capacity", value: "30 rounds" },
                                { key: "Caliber", value: "9mm" }
                            ],
                            actions: [
                                { id: "equip_mag", key: "E", label: "Equip Magazine" },
                                { id: "drop_mag", key: "G", label: "Drop" }
                            ],
                            rarity: "rare"
                        }
                    },
                    {
                        id: "tomato",
                        image: "/pluck/ui/assets/items/tomato.png",
                        label: "Tomato",
                        col: 3, row: 1, w: 1, h: 1,
                        quantity: 4,
                        category: "medical",
                        on_hover: {
                            title: "Tomato",
                            description: ["Basic wound dressing.", "- Stops bleeding"],
                            values: [
                                { key: "Weight", value: "0.05kg" },
                                { key: "Category", value: "Medical" }
                            ],
                            actions: [
                                { id: "use_tomato", key: "E", label: "Apply" },
                                { id: "drop_tomato", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    }
                ]
            },
            {
                id: "backpack",
                title: "Backpack",
                span: `<i class="fa-solid fa-bag-shopping"></i>`,
                layout: { columns: 10, rows: 6, cell_size: "3vw" },
                collapsible: true,
                collapsed: false,
                items: [
                    {
                        id: "cabbage",
                        image: "/pluck/ui/assets/items/cabbage.png",
                        label: "Cabbage",
                        col: 1, row: 1, w: 2, h: 2,
                        quantity: 5,
                        category: "food",
                        on_hover: {
                            title: "Cabbage",
                            description: ["Fresh cabbage. Restores hunger.", "- Grown locally"],
                            values: [
                                { key: "Weight", value: "0.5kg" },
                                { key: "Hunger", value: "+15%" }
                            ],
                            actions: [
                                { id: "eat_cabbage", key: "E", label: "Eat" },
                                { id: "drop_cabbage", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    {
                        id: "corn",
                        image: "/pluck/ui/assets/items/corn.png",
                        label: "Corn",
                        col: 3, row: 1, w: 1, h: 2,
                        quantity: 8,
                        category: "food",
                        on_hover: {
                            title: "Corn",
                            description: ["Sweet corn. Can be eaten or cooked.", "- High calorie content"],
                            values: [
                                { key: "Weight", value: "0.3kg" },
                                { key: "Hunger", value: "+10%" }
                            ],
                            actions: [
                                { id: "eat_corn", key: "E", label: "Eat" },
                                { id: "drop_corn", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    {
                        id: "water_bottle",
                        image: "/pluck/ui/assets/items/water.png",
                        label: "Water",
                        col: 4, row: 1, w: 1, h: 2,
                        quantity: 2,
                        category: "drink",
                        on_hover: {
                            title: "Water Bottle",
                            description: ["Clean drinking water.", "- Restores thirst"],
                            values: [
                                { key: "Weight", value: "0.5kg" },
                                { key: "Thirst", value: "+40%" }
                            ],
                            actions: [
                                { id: "drink_water", key: "E", label: "Drink" },
                                { id: "drop_water", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    },
                    {
                        id: "weapon_pistol",
                        image: "/pluck/ui/assets/items/weapon_pistol.png",
                        label: "Pistol",
                        col: 1, row: 3, w: 3, h: 2,
                        quantity: 1,
                        category: "weapon",
                        progress: { value: 72 },
                        on_hover: {
                            title: "9mm Pistol",
                            description: ["Compact sidearm stowed in backpack.", "- Reliable semi-automatic"],
                            values: [
                                { key: "Weight", value: "1.2kg" },
                                { key: "Condition", value: "72%" },
                                { key: "Caliber", value: "9mm" }
                            ],
                            actions: [
                                { id: "equip_pistol", key: "E", label: "Equip" },
                                { id: "drop_pistol", key: "G", label: "Drop" }
                            ],
                            rarity: "uncommon"
                        }
                    }
                ]
            },
            {
                id: "pockets",
                title: "Pockets",
                span: `<i class="fa-solid fa-hand"></i>`,
                layout: { columns: 10, rows: 2, cell_size: "3vw" },
                collapsible: true,
                collapsed: false,
                items: [
                    {
                        id: "weed",
                        image: "/pluck/ui/assets/items/weed.png",
                        label: "Weed",
                        col: 1, row: 1, w: 1, h: 1,
                        quantity: 3,
                        category: "plant",
                        on_hover: {
                            title: "Cannabis",
                            description: ["Medicinal plant material.", "- Has street value"],
                            values: [
                                { key: "Weight", value: "0.1kg" },
                                { key: "Street Value", value: "$45" }
                            ],
                            actions: [
                                { id: "use_weed", key: "E", label: "Use" },
                                { id: "drop_weed", key: "G", label: "Drop" }
                            ],
                            rarity: "uncommon"
                        }
                    },
                    {
                        id: "cash",
                        image: "/pluck/ui/assets/items/cash.png",
                        label: "cash",
                        col: 2, row: 1, w: 1, h: 1,
                        quantity: 1,
                        category: "misc",
                        on_hover: {
                            title: "Cash",
                            description: ["Cash moves everything around me."],
                            values: [
                                { key: "Weight", value: "0.2kg" }
                            ],
                            actions: [
                                { id: "use_cash", key: "E", label: "Use" },
                                { id: "drop_cash", key: "G", label: "Drop" }
                            ],
                            rarity: "common"
                        }
                    }
                ]
            }
        ]
    },

    right: {
        type: "grid",
        title: { text: "Vicinity", span: `<i class="fa-solid fa-location-dot"></i> Ground` },
        layout: { scroll_x: "none", scroll_y: "scroll", columns: 10, rows: 20, cell_size: "3vw" },
        items: [
            {
                id: "weapon_pistol_ground",
                image: "/pluck/ui/assets/items/weapon_pistol.png",
                label: "Pistol",
                col: 1, row: 1, w: 3, h: 2,
                quantity: 1,
                category: "weapon",
                progress: { value: 55 },
                on_hover: {
                    title: "9mm Pistol",
                    description: ["Found on the ground.", "- Showing signs of wear"],
                    values: [
                        { key: "Weight", value: "1.2kg" },
                        { key: "Condition", value: "55%" },
                        { key: "Caliber", value: "9mm" }
                    ],
                    actions: [{ id: "pickup_pistol", key: "E", label: "Pick Up" }],
                    rarity: "uncommon"
                }
            },
            {
                id: "ammo_pistol_ground",
                image: "/pluck/ui/assets/items/ammo_pistol.png",
                label: "9mm",
                col: 4, row: 1, w: 1, h: 1,
                quantity: 48,
                category: "ammunition",
                on_hover: {
                    title: "9mm Ammunition",
                    description: ["Standard 9mm rounds."],
                    values: [
                        { key: "Weight", value: "0.1kg" },
                        { key: "Caliber", value: "9mm" }
                    ],
                    actions: [{ id: "pickup_ammo", key: "E", label: "Pick Up" }],
                    rarity: "common"
                }
            },
            {
                id: "cabbage_ground",
                image: "/pluck/ui/assets/items/cabbage.png",
                label: "Cabbage",
                col: 5, row: 1, w: 2, h: 2,
                quantity: 3,
                category: "food",
                on_hover: {
                    title: "Cabbage",
                    description: ["Fresh cabbage. Restores hunger."],
                    values: [
                        { key: "Weight", value: "0.5kg" },
                        { key: "Hunger", value: "+15%" }
                    ],
                    actions: [{ id: "pickup_cabbage", key: "E", label: "Pick Up" }],
                    rarity: "common"
                }
            }
        ]
    }
};

const input_groups_test = {
    index: 2,
    title: "Page 1",
    layout: { left: 3 },
    left: {
        type: "input_groups",
        title: "Page 1 Content",
        id: "test_inputs",
        layout: { columns: 1, scroll_x: "none" },
        groups: [
            {
                header: "Some Group",
                expandable: false,
                inputs: [
                    { id: "option_1", type: "number", label: "Some Option", category: "group_1" },
                    { id: "option_2", type: "text", label: "Some Other Option", placeholder: "Enter value..." }
                ]
            },
            {
                header: "Another Group",
                expandable: true,
                inputs: [
                    { id: "option_3", type: "number", label: "Yet Another Option", category: "group_2" },
                    { id: "option_4", type: "text", label: "And Another One", default: "Default Value" }
                ]
            }
        ],
        buttons: [make_btn("some_button", "Button 1", "confirm_options", "primary", { target_id: "test_button", source: "input_groups_test" })]
    }
};

const cards_test = {
    index: 1,
    title: "Page 2",
    layout: { left: 3, center: 6, right: 3 },

    left: {
        type: "cards",
        layout: { columns: 2, flex: "column", scroll_x: "none" },
        title: { text: "Left Section", span: "Span" },
        cards: [
            {
                image: "https://placehold.co/252x126",
                title: "Card In Column",
                description: "Card Description.",
                layout: "column",
                on_hover: card_hover_john,
                buttons: [shared_card_btn]
            },
            {
                image: "https://placehold.co/252x126",
                title: "Card In Column",
                description: "Card Description.",
                layout: "column",
                on_hover: card_hover_case,
                buttons: [single_card_btn]
            }
        ]
    },

    center: {
        type: "input_groups",
        title: "Select Inputs",
        id: "select_test_inputs",
        layout: { columns: 2, scroll_x: "none" },
        groups: [
            {
                header: "Select Group 1",
                expandable: false,
                inputs: [{
                    id: "select_1", type: "select", label: "Choose Option 1", value: "b", copyable: true,
                    options: [{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }, { value: "c", label: "Option C" }]
                }]
            },
            {
                header: "Select Group 2",
                expandable: true,
                inputs: [{
                    id: "select_3", type: "select", label: "Another Select", value: "x",
                    options: [{ value: "x", label: "X" }, { value: "y", label: "Y" }, { value: "z", label: "Z" }]
                }]
            }
        ]
    },

    right: {
        type: "cards",
        layout: { columns: 1, flex: "row", scroll_x: "scroll", scroll_y: "scroll" },
        title: "Right Section",
        cards: [
            make_card("Card In Row", "Card Description.", undefined, make_on_hover(
                "Card Info",
                ["Info descriptions can support arrays", "- like so", "- you get the idea"],
                [{ key: "Key", value: "Value Pairs" }, { key: "Name", value: "Case" }],
                [{ id: "test_action", key: "E", label: "Action on Keypress" }],
                "rare"
            ))
        ]
    }
};

/*
$(document).ready(() => {
    const builder = new Builder({
        header: {
            layout: { left: { justify: "flex-start" }, center: { justify: "center" }, right: { justify: "flex-end" } },
            elements: {
                left: [{ type: "group", items: [{ type: "logo", image: "/libs/pluck/ui/assets/logos/logo.png" }, make_text("PLUCK", "Predefined Lua UI Component Kit")] }],
                center: [{ type: "tabs" }],
                right: [
                    {
                        type: "namecard",
                        avatar: "/libs/pluck/ui/assets/namecards/avatars/avatar_placeholder.jpg",
                        background: "/libs/pluck/ui/assets/namecards/backgrounds/namecard_bg_1.jpg",
                        name: "Player Name",
                        title: "Some Player Title",
                        level: 99,
                        tier: "bronze"
                    },
                    make_buttons(
                        { id: "save", label: "Save", icon: "fa-solid fa-gear", action: "save_changes", class: "primary" },
                        { id: "exit", label: "Exit", action: "exit_builder", class: "secondary" }
                    )
                ]
            }
        },

        footer: {
            layout: { left: { justify: "flex-start", gap: "1vw" }, center: { justify: "center" }, right: { justify: "flex-end", gap: "1vw" } },
            elements: {
                left: [make_buttons(
                    {
                        id: "deploy",
                        label: "Deploy",
                        action: "deploy",
                        class: "primary",
                        modal: {
                            title: "Confirm Deploy",
                            options: [
                                { id: "deploy_name", label: "Deploy Name", type: "text", placeholder: "Enter name..." },
                                { id: "deploy_count", label: "Deploy Count", type: "number", min: 1, max: 100 }
                            ],
                            buttons: [
                                make_btn("confirm_deploy", "Confirm", "confirm_deploy", "primary", { source: "deploy_modal" }),
                                make_btn("cancel_deploy", "Cancel", "cancel_deploy", "secondary", { source: "deploy_modal" })
                            ]
                        }
                    },
                    { id: "cancel", label: "Cancel", action: "cancel", class: "secondary" }
                )],
                center: [{ type: "text", text: "Ready to deploy." }],
                right: [make_actions({ key: "ESCAPE", label: "Close" }, { key: "E", label: "Confirm" })]
            }
        },

        content: {
            pages: {
                inventory_page: GRID_MODE ? inventory_grid_page : inventory_slots_page,
                input_groups_test,
                cards_test
            }
        }
    });

});
*/