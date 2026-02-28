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

    --- @section Function

    --- Shows a modal
    --- @param source number: Player source
    --- @param opts table: Modal options
    local function build_modal(source, opts)
        if not source or not opts then
            pluck.log("error", "Player source or opts missing")
            return
        end
        TriggerClientEvent("pluck:build_modal", source, opts)
    end

    pluck.build_modal = build_modal
    exports("build_modal", build_modal)
    
    -- will be removed switch to `build_modal` export :) 
    exports("show_modal", build_modal)

end

if not pluck.is_server then 

    --- @section Function

    --- Shows a modal without accessing builder
    --- @param opts table: Modal options
    local function build_modal(opts)
        if not opts then 
            pluck.log("error", "build_modal: Modal config missing.") 
            return 
        end

        local safe_opts = pluck.sanitize_ui(opts, "modal")
        if not safe_opts then 
            pluck.log("error", "build_modal: Modal config wasn't returned after sanitize.") 
            return 
        end

        SetNuiFocus(true, true)
        SendNUIMessage({
            func = "show_modal",
            payload = safe_opts
        })
    end

    pluck.build_modal = build_modal
    exports("build_modal", build_modal)

    -- will be removed switch to `build_modal` export :) 
    exports("show_modal", build_modal)

    --- @section Events

    --- Event to show modal
    --- @param opts table: Modal options
    RegisterNetEvent("pluck:build_modal", function(opts)
        if not opts then return print("opts missing") end
        build_modal(opts)
    end)

end