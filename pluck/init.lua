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

pluck = {}

pluck.debug_enabled = true
pluck.debug_colours = {
    reset = "^7",
    debug = "^6",
    info = "^5",
    success = "^2",
    warn = "^3",
    error = "^8",
    critical = "^1",
    dev = "^9"
}
pluck.is_server = IsDuplicityVersion()
pluck.resource_name = GetCurrentResourceName()
pluck.embedded_path = false
pluck.registered_functions = {
    client = {},
    server = {}
}

--- @section Utility Functions

--- Registers a function under a unique key for callbacks.
--- @param label string: The unique key to associate with the function.
--- @param func function: The function to register.
function pluck.register_function(label, func)
    local context = pluck.is_server and "server" or "client"
    pluck.registered_functions[context][label] = func
end

--- Calls a registered function by its label.
--- @param label string: The key associated with the function.
--- @return The result of the function, or false if not found.
function pluck.call_registered_function(label, data)
    if not label then pluck.log("error", "function label is required") return false end
    local funcs = pluck.is_server and pluck.registered_functions.server or pluck.registered_functions.client
    local func = funcs[label]
    if not func then pluck.log("error", ("function with label %s not found"):format(label)) return false end
    return func(data)
end

--- Recursively sanitizes a UI config by replacing functions with labels and storing them
--- @param data table: The original UI configuration table
--- @param path string: Current traversal path (used to generate unique labels)
--- @return table: A version of the UI config safe to send to JS
function pluck.sanitize_ui(data, path)
    path = path or "root"
    local out = {}

    for k, v in pairs(data) do
        local p = ("%s_%s"):format(path, tostring(k)):gsub("[^%w_]", "")

        if (k == "on_action" or k == "on_increment" or k == "on_decrement" or k == "on_select") then
            pluck.register_function(p, v)
            out.action = p
        elseif type(v) == "table" then
            out[k] = pluck.sanitize_ui(v, p)
        else
            out[k] = v
        end
    end

    return out
end

--- Returns the current timestamp as a formatted string.
--- @return string: Formatted time (YYYY-MM-DD HH:MM:SS)
function pluck.get_current_time()
    if pluck.is_server then return os.date("%Y-%m-%d %H:%M:%S") end
    if GetLocalTime then
        local y, m, d, h, min, s = GetLocalTime()
        return string.format("%04d-%02d-%02d %02d:%02d:%02d", y, m, d, h, min, s)
    end
    return "0000-00-00 00:00:00"
end

--- Prints a formatted debug message to the console.
--- @param level string: One of "debug", "info", "success", "warn", "error", "critical", "dev".
--- @param message string: Pre-formatted message to display.
function pluck.log(level, message)
    if not pluck.debug_enabled then return end

    local clr = pluck.debug_colours[level] or "^7"
    local time = pluck.get_current_time()

    print(("%s[%s] [PLUCK] [%s]:^7 %s"):format(clr, time, level:upper(), message))
end

--- Creates a deep copy of a table, ensuring changes to the copy won't affect the original table.
--- @param t table: The table to copy.
--- @return table: A deep copy of the table.
function pluck.deep_copy(t)
    local orig_type = type(t)
    local copy

    if orig_type == 'table' then
        copy = {}
        for orig_key, orig_value in next, t, nil do
            copy[pluck.deep_copy(orig_key)] = pluck.deep_copy(orig_value)
        end
        setmetatable(copy, pluck.deep_copy(getmetatable(t)))
    else
        copy = t
    end

    return copy
end

--- @section UI Builder Functions

if pluck.is_server then

    --- Builds a UI on the specified client.
    --- @param source number: The player source ID to send the UI to.
    --- @param ui table: The UI configuration table.
    local function build_ui(source, ui)
        if not source or not ui then 
            pluck.log("error", "build_ui: Invalid params provided.") 
            return 
        end

        pluck.log("info", ("build_ui: Sending UI to [%s]"):format(source))
        TriggerClientEvent("pluck:build_ui", source, ui)
    end

    pluck.build_ui = build_ui
    exports("build_ui", build_ui)
    exports("build", build_ui) -- added back for back compat may remove in future switch to `build_ui` 

    --- Closes the UI on the specified client.
    --- @param source number: The player source ID to close the UI for.
    local function close_ui(source)
        if not source then
            pluck.log("error", "close_ui: Player source missing")
            return
        end
        TriggerClientEvent("pluck:close_ui", source)
    end

    pluck.close_ui = close_ui
    exports("close_ui", close_ui)

    --- Handles server side functions when UI elements are built from server.
    RegisterNetEvent("pluck:sv:handler", function(data)
        local source = source
        local success, result = pcall(pluck.call_registered_function, data.action, data)
        if not success then
            pluck.log("error", ("sv:handler: Function call failed - %s"):format(result))
        end
    end)

else

    --- Sends a full UI to the NUI layer and sets focus.
    --- @param ui table: UI config table to build.
    local function build_ui(ui)
        if not ui then 
            pluck.log("error", "build_ui: UI config missing.") 
            return 
        end

        local safe_ui = pluck.sanitize_ui(ui, "ui")
        if not safe_ui then 
            pluck.log("error", "build_ui: UI config wasn't returned after sanitize.") 
            return 
        end

        print("ui data: ", json.encode(safe_ui, {indent = true}))
        
        pluck.log("info", "build_ui: Building UI and setting NUI focus.")
        SetNuiFocus(true, true)
        SendNUIMessage({ 
            func = "build_ui",
            payload = safe_ui 
        })
    end

    pluck.build_ui = build_ui
    exports("build_ui", build_ui)
    exports("build", build_ui) -- added back for back compat may remove in future switch to `build_ui` 

    --- Closes the UI and removes NUI focus.
    local function close_ui()
        SendNUIMessage({ func = "close_ui" })
        SetNuiFocus(false, false)
    end

    pluck.close_ui = close_ui
    exports("close_ui", close_ui)

    --- Updates inventory slots UI from raw item data.
    --- Handles sanitizing and sending to NUI.
    --- @param items table: Raw UI item table (not sanitized).
    local function update_slots(items)
        if type(items) ~= "table" then
            pluck.log("warn", "update_slots: invalid items table")
            return
        end

        local safe_items = pluck.sanitize_ui(items, "inventory_update")

        SendNUIMessage({ func = "update_slots", items = safe_items })
    end

    pluck.update_slots = update_slots
    exports("update_slots", update_slots)

    pluck.slot_move_handler = nil

    --- Allows setting a custom hook to handle slot movement logic.
    --- This runs on the client and is NOT a security boundary.
    --- A malicious client could override this and fire any server event they want. 
    --- But before screaming at me... they could already do that without this hook existing.
    --- If this lets someone exploit your server, your server event was already broken.
    --- Always validate and enforce slot states server-side.
    --- @param func function: Function handler
    local function set_slot_move_handler(func)
        pluck.slot_move_handler = func
    end

    pluck.set_slot_move_handler = set_slot_move_handler
    exports("set_slot_move_handler", set_slot_move_handler)

    pluck.grid_move_handler = nil

    --- Allows setting a custom hook to handle grid movement logic.
    --- This runs on the client and is NOT a security boundary.
    --- A malicious client could override this and fire any server event they want. 
    --- But before screaming at me... they could already do that without this hook existing.
    --- If this lets someone exploit your server, your server event was already broken.
    --- Always validate and enforce grid states server-side.
    local function set_grid_move_handler(func)
        pluck.grid_move_handler = func
    end

    pluck.set_grid_move_handler = set_grid_move_handler
    exports("set_grid_move_handler", set_grid_move_handler)

    --- Returns NUI-compatible headshot image URL for the local player
    --- @return string: Headshot image path or placeholder if headshot unavailable
    local function get_player_headshot()
        local ped = PlayerPedId()
        local headshot = RegisterPedheadshotTransparent(ped)
        if not (headshot and IsPedheadshotValid(headshot)) then
            return nil
        end

        local timeout, txd = 1000, nil
        while not IsPedheadshotReady(headshot) and timeout > 0 do
            Wait(10)
            timeout = timeout - 10
        end

        if IsPedheadshotReady(headshot) then
            txd = GetPedheadshotTxdString(headshot)
            SetTimeout(2000, function() UnregisterPedheadshot(headshot) end)
        else
            UnregisterPedheadshot(headshot)
        end

        return txd and ("https://nui-img/%s/%s?v=%d"):format(txd, txd, GetGameTimer())
    end

    pluck.get_player_headshot = get_player_headshot
    exports("get_player_headshot", get_player_headshot)

    --- @section Events

    --- Receives and builds a UI triggered by the server.
    --- @param ui table: UI configuration.
    RegisterNetEvent("pluck:build_ui", function(ui)
        build_ui(ui)
    end)

    --- Event to close builder ui.
    RegisterNetEvent("pluck:close_ui", function()
        close_ui()
    end)

    --- @section NUI Callbacks

    --- Removes focus from the NUI.
    --- Triggered by NUI when UI needs to close.
    RegisterNUICallback("nui:remove_focus", function()
        pluck.log("debug", "nui:remove_focus - Focus cleared.")
        SetNuiFocus(false, false)
    end)

    --- Handles generic action callbacks sent from the UI.
    --- @param data table: Data from the NUI containing the action to perform.
    --- @param cb function: Callback to signal response.
    RegisterNUICallback("nui:handler", function(data, cb)
        pluck.log("debug", ("nui:handler invoked with: %s"):format(json.encode(data)))
        if not data or not data.action then
            if cb then cb(false) end
            return
        end

        if data.action == "slots_moved_item" then
            if pluck.slot_move_handler then
                pluck.slot_move_handler(data.dataset)
            end
            if cb then cb({ success = true }) end
            return
        end

        if data.action == "grid_moved_item" then
            if pluck.grid_move_handler then
                pluck.grid_move_handler(data.dataset)
            end
            if cb then cb({ success = true }) end
            return
        end

        local func = pluck.registered_functions.client[data.action]
        if func then
            local success, result = pcall(func, data)
            if not success then
                pluck.log("error", ("NUI handler: Function call failed - %s"):format(result))
            end
        else
            TriggerServerEvent("pluck:sv:handler", data)
        end

        if data.should_close then
            SetNuiFocus(false, false)
        end

        if cb then cb(true) end
    end)
    
end