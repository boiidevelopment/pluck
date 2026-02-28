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

    --- Updates interaction hint
    --- @param source number: Player source
    --- @param data table: Interaction hint data { image, label, quantity, status_text, action_text }
    local function update_interaction_hint(source, data)
        if not source or not data then
            pluck.log("error", "Player source or data missing")
            return
        end
        TriggerClientEvent("pluck:update_interaction_hint", source, data)
    end

    pluck.update_interaction_hint = update_interaction_hint
    exports("update_interaction_hint", update_interaction_hint)

    --- Updates interaction hint quantity
    --- @param source number: Player source
    --- @param amount number: New quantity amount
    local function update_hint_quantity(source, amount)
        if not source or not amount then
            pluck.log("error", "Player source or amount missing")
            return
        end
        TriggerClientEvent("pluck:update_hint_quantity", source, amount)
    end

    pluck.update_hint_quantity = update_hint_quantity
    exports("update_hint_quantity", update_hint_quantity)

    --- Clears interaction hint
    --- @param source number: Player source
    local function clear_interaction_hint(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:clear_interaction_hint", source)
    end

    pluck.clear_interaction_hint = clear_interaction_hint
    exports("clear_interaction_hint", clear_interaction_hint)

    --- Destroys interaction hint
    --- @param source number: Player source
    local function destroy_interaction_hint(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:destroy_interaction_hint", source)
    end

    pluck.destroy_interaction_hint = destroy_interaction_hint
    exports("destroy_interaction_hint", destroy_interaction_hint)

end

if not pluck.is_server then 

    --- @section Functions

    --- Updates interaction hint
    --- @param data table: Interaction hint data { image, label, quantity, status_text, action_text }
    local function update_interaction_hint(data)
        SendNUIMessage({
            func = "update_interaction_hint",
            payload = data
        })
    end

    pluck.update_interaction_hint = update_interaction_hint
    exports("update_interaction_hint", update_interaction_hint)

    --- Updates interaction hint quantity
    --- @param amount number: New quantity amount
    local function update_hint_quantity(amount)
        SendNUIMessage({
            func = "update_hint_quantity",
            payload = { amount = amount }
        })
    end

    pluck.update_hint_quantity = update_hint_quantity
    exports("update_hint_quantity", update_hint_quantity)

    local function update_hint_status(text)
        SendNUIMessage({ func = "update_hint_status", payload = { text = text } })
    end
    pluck.update_hint_status = update_hint_status

    --- Clears interaction hint
    local function clear_interaction_hint()
        SendNUIMessage({ func = "clear_interaction_hint" })
    end

    pluck.clear_interaction_hint = clear_interaction_hint
    exports("clear_interaction_hint", clear_interaction_hint)

    --- Destroys interaction hint
    local function destroy_interaction_hint()
        SendNUIMessage({ func = "destroy_interaction_hint" })
    end

    pluck.destroy_interaction_hint = destroy_interaction_hint
    exports("destroy_interaction_hint", destroy_interaction_hint)

    --- @section Events

    --- Event to update interaction hint
    --- @param data table: Interaction hint data
    RegisterNetEvent("pluck:update_interaction_hint", function(data)
        if not data then return print("data missing") end
        update_interaction_hint(data)
    end)

    --- Event to update hint quantity
    --- @param amount number: New quantity amount
    RegisterNetEvent("pluck:update_hint_quantity", function(amount)
        if not amount then return print("amount missing") end
        update_hint_quantity(amount)
    end)

    --- Event to clear interaction hint
    RegisterNetEvent("pluck:clear_interaction_hint", function()
        clear_interaction_hint()
    end)

    --- Event to destroy interaction hint
    RegisterNetEvent("pluck:destroy_interaction_hint", function()
        destroy_interaction_hint()
    end)

    --- @section Test Commands

    RegisterCommand("test_hint", function()
        print("testing hint")
        update_interaction_hint({
            image = "/pluck/ui/assets/items/water.png",
            label = "Water Bottle",
            quantity = 5,
            action_text = "Press F to drink"
        })
    end)

    RegisterCommand("test_hint_update", function()
        update_hint_quantity(2)
    end)

    RegisterCommand("test_hint_clear", function()
        clear_interaction_hint()
    end)

    RegisterCommand("test_hint_destroy", function()
        destroy_interaction_hint()
    end)

end