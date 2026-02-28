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

    --- Shows the status HUD for a player
    --- @param source number: Player source
    local function show_status_hud(source)
        if not source then pluck.log("error", "Player source missing") return end
        TriggerClientEvent("pluck:show_status_hud", source)
    end

    pluck.show_status_hud = show_status_hud
    exports("show_status_hud", show_status_hud)

    --- Hides the status HUD for a player
    --- @param source number: Player source
    local function hide_status_hud(source)
        if not source then pluck.log("error", "Player source missing") return end
        TriggerClientEvent("pluck:hide_status_hud", source)
    end

    pluck.hide_status_hud = hide_status_hud
    exports("hide_status_hud", hide_status_hud)

    --- Updates the status HUD for a player
    --- @param source number: Player source
    --- @param data table: Status data payload
    local function update_status_hud(source, data)
        if not source or not data then pluck.log("error", "Player source or data missing") return end
        TriggerClientEvent("pluck:update_status_hud", source, data)
    end

    pluck.update_status_hud = update_status_hud
    exports("update_status_hud", update_status_hud)

    --- Destroys the status HUD for a player
    --- @param source number: Player source
    local function destroy_status_hud(source)
        if not source then pluck.log("error", "Player source missing") return end
        TriggerClientEvent("pluck:destroy_status_hud", source)
    end

    pluck.destroy_status_hud = destroy_status_hud
    exports("destroy_status_hud", destroy_status_hud)

end

if not pluck.is_server then

    --- @section Functions

    --- Sends the player headshot to the status HUD
    local function send_headshot()
        local src = pluck.get_player_headshot()
        SendNUIMessage({ func = "set_status_headshot", payload = { src = src } })
    end

    pluck.send_headshot = send_headshot
    exports("send_headshot", send_headshot)

    --- Shows the status HUD
    local function show_status_hud()
        SendNUIMessage({ func = "show_status_hud" })
    end

    pluck.show_status_hud = show_status_hud
    exports("show_status_hud", show_status_hud)

    --- Hides the status HUD
    local function hide_status_hud()
        SendNUIMessage({ func = "hide_status_hud" })
    end

    pluck.hide_status_hud = hide_status_hud
    exports("hide_status_hud", hide_status_hud)

    --- Updates the status HUD
    --- @param data table: Status data payload
    local function update_status_hud(data)
        if not data then return end
        SendNUIMessage({ func = "update_status_hud", payload = data })
    end

    pluck.update_status_hud = update_status_hud
    exports("update_status_hud", update_status_hud)

    --- Destroys the status HUD
    local function destroy_status_hud()
        SendNUIMessage({ func = "destroy_status_hud" })
    end

    pluck.destroy_status_hud = destroy_status_hud
    exports("destroy_status_hud", destroy_status_hud)

    --- @section Events

    RegisterNetEvent("pluck:show_status_hud", function() show_status_hud() end)
    RegisterNetEvent("pluck:hide_status_hud", function() hide_status_hud() end)
    RegisterNetEvent("pluck:update_status_hud", function(data) update_status_hud(data) end)
    RegisterNetEvent("pluck:destroy_status_hud", function() destroy_status_hud() end)

    --- @section Test Commands

    RegisterCommand("test_status_hud", function()
        show_status_hud()
        send_headshot()
        update_status_hud({
            health = 150,
            armour = 90,
            hunger = 53,
            thirst = 18,
            stamina = 12,
            oxygen = 23,
            temperature = 37,
            stress = 10,
            bleeding = 75,
            radiation = 2,
            infection = 5,
            poison = 15
        })
    end)

end