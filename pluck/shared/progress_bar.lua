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

    --- Show progress bar with options
    --- @param source number: Player source
    --- @param options table: Contains header, icon, and duration of the progress bar.
    local function show_progressbar(source, options)
        if not source or not options then
            pluck.log("error", "Player source or options missing")
            return
        end
        TriggerClientEvent("pluck:show_progressbar", source, options)
    end

    pluck.show_progressbar = show_progressbar
    exports("show_progressbar", show_progressbar)

end
    
if not pluck.is_server then

    --- @section Local Functions

    --- Show progress bar with options
    --- @param options table: Contains header, icon, and duration of the progress bar.
    local function show_progressbar(options)
        SetNuiFocus(false, false)
        SendNUIMessage({
            func = 'show_progressbar',
            payload = {
                header = options.header or 'Loading...',
                icon = options.icon or 'fa-solid fa-circle-notch',
                duration = options.duration or 5000
            }
        })
    end

    pluck.show_progressbar = show_progressbar
    exports('show_progressbar', show_progressbar)

    --- @section Events

    --- Event to show progress bar
    --- @param options table: Progress bar options
    RegisterNetEvent("pluck:show_progressbar", function(options)
        if not options then return print("options missing") end
        show_progressbar(options)
    end)

    --- @section Test Commands

    RegisterCommand("test_progbar", function()
        show_progressbar({
            header = "Testing Something...",
            icon = "fa-solid fa-gear",
            duration = 10000
        })
    end)

end