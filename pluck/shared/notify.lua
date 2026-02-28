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

    --- Sends a notification to a specific player client.
    --- @param source number: The player source ID to send the notification to.
    --- @param opts table: The notification configuration.
    local function notify(source, opts)
        if not source or not opts then pluck.log("error", "notify: Invalid params provided.") return end

        pluck.log("info", ("notify: Sending to [%s] with %s"):format(source, json.encode(opts)))
        TriggerClientEvent("pluck:notify", source, opts)
    end

    pluck.notify = notify
    exports("notify", notify)

else

    --- @section Functions

    --- Sends a notification to the NUI layer.
    --- @param opts table: Notification options (type, message, header, icon, duration, etc.)
    local function notify(opts)
        if not opts then pluck.log("error", "notify: Options missing.") return end

        pluck.log("success", ("notify: Dispatching %s"):format(json.encode(opts)))
        SendNUIMessage({
            func = "notify",
            payload = opts
        })
    end

    pluck.notify = notify
    exports("notify", notify)

    --- @section Events

    --- Receives and displays a notification triggered by the server.
    --- @param opts table: Notification options.
    RegisterNetEvent("pluck:notify", function(opts)
        pluck.log("dev", ("Event triggered: notify %s"):format(json.encode(opts)))
        notify(opts)
    end)
    
end