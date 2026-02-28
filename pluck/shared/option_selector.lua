--[[
--------------------------------------------------

This file is part of PLUCK.
You are free to use these files within your own resources.
Please retain the original credit and attached MIT license.
Support honest development.

Author: Case @ BOII Development
License: https://github.com/boiidevelopment/pluck/blob/main/LICENSE
GitHub: https://github.com/boiidevelopment/pluck

--------------------------------------------------
]]

if pluck.is_server then

    --- @section Functions

    --- Builds options in selector and shows it
    --- @param source number: Player source
    --- @param title string: Title for the selector
    --- @param options table: Array of option items
    local function build_options_selector(source, title, options)
        if not source or not title or not options then
            pluck.log("error", "Player source, ui title or options missing")
            return
        end
        TriggerClientEvent("pluck:build_options_selector", source, title, options)
    end

    pluck.build_options_selector = build_options_selector
    exports("build_options_selector", build_options_selector)

    --- Shows options selector
    --- @param source number: Player source
    local function show_options_selector(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:show_options_selector", source)
    end

    pluck.show_options_selector = show_options_selector
    exports("show_options_selector", show_options_selector)

    --- Hides options selector
    --- @param source number: Player source
    local function hide_options_selector(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:hide_options_selector", source)
    end

    pluck.hide_options_selector = hide_options_selector
    exports("hide_options_selector", hide_options_selector)

    --- Destroys options selector
    --- @param source number: Player source
    local function destroy_options_selector(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:destroy_options_selector", source)
    end

    pluck.destroy_options_selector = destroy_options_selector
    exports("destroy_options_selector", destroy_options_selector)

end

if not pluck.is_server then 

    --- @section Functions

    --- Builds options in selector and shows it
    --- @param title string: Title for the selector
    --- @param options table: Array of option items
    local function build_options_selector(title, options)
        local sanitized_options = {}
        for i, option in ipairs(options) do
            sanitized_options[i] = pluck.sanitize_ui(option, ("option_%d"):format(i))
        end

        SetNuiFocus(true, true)
        SendNUIMessage({
            func = "set_options",
            payload = {
                options = sanitized_options,
                title = title
            }
        })
    end

    pluck.build_options_selector = build_options_selector
    exports("build_options_selector", build_options_selector)

    --- Shows options selector
    local function show_options_selector()
        SendNUIMessage({ func = "show_options" })
    end

    pluck.show_options_selector = show_options_selector
    exports("show_options_selector", show_options_selector)

    --- Hides options selector
    local function hide_options_selector()
        SendNUIMessage({ func = "hide_options" })
    end

    pluck.hide_options_selector = hide_options_selector
    exports("hide_options_selector", hide_options_selector)

    --- Destroys options selector
    local function destroy_options_selector()
        SendNUIMessage({ func = "destroy_options_selector" })
    end

    pluck.destroy_options_selector = destroy_options_selector
    exports("destroy_options_selector", destroy_options_selector)

    --- @section Events

    --- Event to build options
    --- @param title string: Title for the selector
    --- @param options table: Array of option items
    RegisterNetEvent("pluck:build_options_selector", function(title, options)
        if not options then return print("options missing") end
        build_options_selector(title, options)
    end)

    --- Event to show options selector
    RegisterNetEvent("pluck:show_options_selector", function()
        show_options_selector()
    end)

    --- Event to hide options selector
    RegisterNetEvent("pluck:hide_options_selector", function()
        hide_options_selector()
    end)

    --- Event to destroy options selector
    RegisterNetEvent("pluck:destroy_options_selector", function()
        destroy_options_selector()
    end)

    --- @section Test Commands

    RegisterCommand("test_options", function()
        build_options_selector("SELECT ITEM", {
            {
                id = "water",
                label = "Water",
                image = "/pluck/ui/assets/items/water.png",
                quantity = 5,
                enabled = true,
                on_action = function(data)
                    print("Selected: " .. data.dataset.option_id)
                end
            },
            {
                id = "bread",
                label = "Bread",
                image = "/pluck/ui/assets/items/bread.png",
                quantity = 3,
                enabled = true,
                on_action = function(data)
                    print("Selected: " .. data.dataset.option_id)
                end
            },
            {
                id = "weapon",
                label = "Weapon",
                image = "/pluck/ui/assets/items/weapon_pistol.png",
                quantity = 0,
                enabled = false
            }
        })
        show_options_selector()
    end)

    RegisterCommand("test_options_hide", function()
        hide_options_selector()
    end)

    RegisterCommand("test_options_destroy", function()
        destroy_options_selector()
    end)

end