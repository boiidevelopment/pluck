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

    --- Sets controls in control display
    --- @param source number: Player source
    --- @param title string: Title for the control display
    --- @param controls table: Table of control objects { key, action }
    local function set_control_display(source, title, controls)
        if not source or not title or not controls then
            pluck.log("error", "Player source, title, or controls missing")
            return
        end
        TriggerClientEvent("pluck:set_control_display", source, title, controls)
    end

    pluck.set_control_display = set_control_display
    exports("set_control_display", set_control_display)

    --- Shows control display
    --- @param source number: Player source
    local function show_control_display(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:show_control_display", source)
    end

    pluck.show_control_display = show_control_display
    exports("show_control_display", show_control_display)

    --- Hides control display
    --- @param source number: Player source
    local function hide_control_display(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:hide_control_display", source)
    end

    pluck.hide_control_display = hide_control_display
    exports("hide_control_display", hide_control_display)

    --- Destroys control display
    --- @param source number: Player source
    local function destroy_control_display(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:destroy_control_display", source)
    end

    pluck.destroy_control_display = destroy_control_display
    exports("destroy_control_display", destroy_control_display)

end

if not pluck.is_server then 

    --- @section Functions

    --- Sets controls in control display
    --- @param title string: Title for the control display
    --- @param controls table: Table of control objects { key, action }
    local function set_control_display(title, controls)
        SendNUIMessage({
            func = "set_controls",
            payload = {
                title = title,
                controls = controls
            }
        })
    end

    pluck.set_control_display = set_control_display
    exports("set_control_display", set_control_display)

    --- Shows control display
    local function show_control_display()
        SendNUIMessage({ func = "show_controls" })
    end

    pluck.show_control_display = show_control_display
    exports("show_control_display", show_control_display)

    --- Hides control display
    local function hide_control_display()
        SendNUIMessage({ func = "hide_controls" })
    end

    pluck.hide_control_display = hide_control_display
    exports("hide_control_display", hide_control_display)

    --- Destroys control display
    local function destroy_control_display()
        SendNUIMessage({ func = "destroy_controls" })
    end

    pluck.destroy_control_display = destroy_control_display
    exports("destroy_control_display", destroy_control_display)

    --- @section Events

    --- Event to set controls
    --- @param title string: Title for the control display
    --- @param controls table: Table of control objects
    RegisterNetEvent("pluck:set_control_display", function(title, controls)
        if not title or not controls then return print("title or controls missing") end
        set_control_display(title, controls)
    end)

    --- Event to show controls
    RegisterNetEvent("pluck:show_control_display", function()
        show_control_display()
    end)

    --- Event to hide controls
    RegisterNetEvent("pluck:hide_control_display", function()
        hide_control_display()
    end)

    --- Event to destroy controls
    RegisterNetEvent("pluck:destroy_control_display", function()
        destroy_control_display()
    end)

    --- @section Test Commands

    RegisterCommand("test_controls", function()
        print("testing controls")
        set_control_display("PLACEMENT MODE", {
            {
                key = "W",
                action = "Move Forward"
            },
            {
                key = "A",
                action = "Move Left"
            },
            {
                key = "S",
                action = "Move Backward"
            },
            {
                key = "D",
                action = "Move Right"
            },
            {
                key = "G",
                action = "Rotate Left"
            },
            {
                key = "H",
                action = "Rotate Right"
            },
            {
                key = "Enter",
                action = "Confirm"
            },
            {
                key = "Backspace",
                action = "Cancel"
            }
        })
        show_control_display()
    end)

    RegisterCommand("test_controls_hide", function()
        hide_control_display()
    end)

    RegisterCommand("test_controls_show", function()
        show_control_display()
    end)

    RegisterCommand("test_controls_destroy", function()
        destroy_control_display()
    end)

end