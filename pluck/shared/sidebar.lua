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

    --- Builds a standalone sidebar on the specified client.
    --- @param source number: Player source ID.
    --- @param opts table: Sidebar configuration.
    local function build_sidebar(source, opts)
        if not source or not opts then
            pluck.log("error", "build_sidebar: Player source or opts missing.")
            return
        end
        local safe_opts = pluck.sanitize_ui(opts, "sidebar")
        TriggerClientEvent("pluck:build_sidebar", source, safe_opts)
    end

    pluck.build_sidebar = build_sidebar
    exports("build_sidebar", build_sidebar)

    --- Closes the standalone sidebar on the specified client.
    --- @param source number: Player source ID.
    local function close_sidebar(source)
        if not source then
            pluck.log("error", "close_sidebar: Player source missing.")
            return
        end
        TriggerClientEvent("pluck:close_sidebar", source)
    end

    pluck.close_sidebar = close_sidebar
    exports("close_sidebar", close_sidebar)

end

if not pluck.is_server then

    --- Builds a standalone sidebar without accessing the builder.
    --- @param opts table: Sidebar configuration.
    local function build_sidebar(opts)
        if not opts then
            pluck.log("error", "build_sidebar: Sidebar config missing.")
            return
        end

        local safe_opts = pluck.sanitize_ui(opts, "sidebar")
        if not safe_opts then
            pluck.log("error", "build_sidebar: Sidebar config wasn't returned after sanitize.")
            return
        end

        SetNuiFocus(true, true)
        SendNUIMessage({
            func = "build_sidebar",
            payload = safe_opts
        })
    end

    pluck.build_sidebar = build_sidebar
    exports("build_sidebar", build_sidebar)

    --- Closes the standalone sidebar.
    local function close_sidebar()
        SendNUIMessage({ func = "close_sidebar" })
        SetNuiFocus(false, false)
    end

    pluck.close_sidebar = close_sidebar
    exports("close_sidebar", close_sidebar)

    --- @section Events

    RegisterNetEvent("pluck:build_sidebar", function(opts)
        if not opts then return pluck.log("error", "pluck:build_sidebar - opts missing.") end
        build_sidebar(opts)
    end)

    RegisterNetEvent("pluck:close_sidebar", function()
        close_sidebar()
    end)

end