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

--- @script dui_sprite
--- Handles DUI interactions.
--- Uses DrawInteractiveSprite to display the ui in the game world.

if not pluck.is_server then

    --- @section DUI Sprites

    --- Key list copied from BDTK to keep PLUCK standalone <3
    local key_list = {
        ["enter"] = 191,
        ["escape"] = 322,
        ["backspace"] = 177,
        ["tab"] = 37,
        ["arrowleft"] = 174,
        ["arrowright"] = 175,
        ["arrowup"] = 172,
        ["arrowdown"] = 173,
        ["space"] = 22,
        ["delete"] = 178,
        ["insert"] = 121,
        ["home"] = 213,
        ["end"] = 214,
        ["pageup"] = 10,
        ["pagedown"] = 11,
        ["leftcontrol"] = 36,
        ["leftshift"] = 21,
        ["leftalt"] = 19,
        ["rightcontrol"] = 70,
        ["rightshift"] = 70,
        ["rightalt"] = 70,
        ["numpad0"] = 108,
        ["numpad1"] = 117,
        ["numpad2"] = 118,
        ["numpad3"] = 60,
        ["numpad4"] = 107,
        ["numpad5"] = 110,
        ["numpad6"] = 109,
        ["numpad7"] = 117,
        ["numpad8"] = 111,
        ["numpad9"] = 112,
        ["numpad+"] = 96,
        ["numpad-"] = 97,
        ["numpadenter"] = 191,
        ["numpad."] = 108,
        ["f1"] = 288,
        ["f2"] = 289,
        ["f3"] = 170,
        ["f4"] = 168,
        ["f5"] = 166,
        ["f6"] = 167,
        ["f7"] = 168,
        ["f8"] = 169,
        ["f9"] = 56,
        ["f10"] = 57,
        ["a"] = 34,
        ["b"] = 29,
        ["c"] = 26,
        ["d"] = 30,
        ["e"] = 46,
        ["f"] = 49,
        ["g"] = 47,
        ["h"] = 74,
        ["i"] = 27,
        ["j"] = 36,
        ["k"] = 311,
        ["l"] = 182,
        ["m"] = 244,
        ["n"] = 249,
        ["o"] = 39,
        ["p"] = 199,
        ["q"] = 44,
        ["r"] = 45,
        ["s"] = 33,
        ["t"] = 245,
        ["u"] = 303,
        ["v"] = 0,
        ["w"] = 32,
        ["x"] = 73,
        ["y"] = 246,
        ["z"] = 20,
        ["mouse1"] = 24,
        ["mouse2"] = 25
    }

    --- @section Constants

    local dui_range = 1.5
    local dui_range_squared = dui_range * dui_range

    --- @section Native Localization

    local GetActiveScreenResolution = GetActiveScreenResolution
    local CreateDui = CreateDui
    local CreateRuntimeTxd = CreateRuntimeTxd
    local CreateRuntimeTextureFromDuiHandle = CreateRuntimeTextureFromDuiHandle
    local GetDuiHandle = GetDuiHandle
    local IsControlJustReleased = IsControlJustReleased
    local TriggerEvent = TriggerEvent
    local TriggerServerEvent = TriggerServerEvent
    local SetDrawOrigin = SetDrawOrigin
    local HasStreamedTextureDictLoaded = HasStreamedTextureDictLoaded
    local GetClosestObjectOfType = GetClosestObjectOfType
    local GetHashKey = GetHashKey
    local DrawInteractiveSprite = DrawInteractiveSprite
    local SendDuiMessage = SendDuiMessage
    local DoesEntityExist = DoesEntityExist
    local SetEntityDrawOutline = SetEntityDrawOutline
    local SetEntityDrawOutlineColor = SetEntityDrawOutlineColor
    local SetEntityDrawOutlineShader = SetEntityDrawOutlineShader
    local Wait = Wait
    local GetEntityCoords = GetEntityCoords
    local ClearDrawOrigin = ClearDrawOrigin

    --- @section Tables

    local dui_locations = {}

    --- @section Functions

    --- Creates a DUI object for a specified location.
    --- @param location_id string: The unique ID of the location.
    --- @return table: A table containing the DUI object and texture data.
    local function create_dui(location_id)
        local txd_name, txt_name = location_id, location_id
        local ui_path = pluck.embedded_path and (pluck.embedded_path .. "/pluck/ui/dui.html") or "/pluck/ui/dui.html"
        local dui_url = ("https://cfx-nui-%s/%s"):format(pluck.resource_name, ui_path)
        local screen_width, screen_height = GetActiveScreenResolution()
        local dui_object = CreateDui(dui_url, screen_width, screen_height)
        local txd = CreateRuntimeTxd(txd_name)
        CreateRuntimeTextureFromDuiHandle(txd, txt_name, GetDuiHandle(dui_object))

        return {
            dui_object = dui_object,
            txd_name = txd_name,
            txt_name = txt_name,
            initialized_at = GetGameTimer() + 250
        }
    end

    --- Adds a new zone to the DUI system.
    --- @param options table: A table containing zone options.
    local function add_dui_zone(options)
        if not options.id or not options.coords or not options.header then return end

        local valid_keys = {}

        for _, key_data in ipairs(options.keys or {}) do
            local key_control = key_list[string.lower(key_data.key)]
            if key_control then
                key_data.key_control = key_control
                valid_keys[#valid_keys + 1] = key_data
            end
        end

        local entity = nil
        if options.entity and options.model then
            entity = GetClosestObjectOfType(options.coords.x, options.coords.y, options.coords.z, 1.0, GetHashKey(options.model), false, false, false)
        end

        dui_locations[options.id] = {
            _state_dirty = true,
            _last_outline_state = nil,
            _last_access_check = 0,
            _last_access_result = true,
            id = options.id,
            model = options.model,
            entity = entity or nil,
            coords = vector3(options.coords.x + 0.025, options.coords.y + 0.025, options.coords.z),
            header = options.header,
            icon = options.icon or "",
            image = options.image or nil,
            keys = valid_keys,
            outline = options.outline,
            can_access = options.can_access,
            dui_object = create_dui(options.id),
            in_proximity = false,
            is_destroyed = false,
            is_hidden = false,
            additional = options.additional or {}
        }
    end

    pluck.add_dui_zone = add_dui_zone
    exports("add_dui_zone", add_dui_zone)

    --- Removes a DUI zone by its ID.
    --- @param id string: The unique ID of the zone to remove.
    local function remove_dui_zone(id)
        local data = dui_locations[id]
        if not data then return end

        if data.dui_object and data.dui_object.dui_object then
            DestroyDui(data.dui_object.dui_object)
        end

        dui_locations[id] = nil
    end

    pluck.remove_dui_zone = remove_dui_zone
    exports("remove_dui_zone", remove_dui_zone)

    --- Handles key press interactions for a location.
    --- @param location table: The location table.
    local function handle_key_presses(location)
        for i = 1, #location.keys do
            local key_data = location.keys[i]
            if IsControlJustReleased(0, key_data.key_control) then
                key_data.on_action()
            end
        end
    end

    --- Toggles an entity's outline visibility.
    --- Only calls natives when the state actually changes to avoid per-frame native overhead.
    --- @param location table: The location table.
    --- @param state boolean: Whether to enable or disable the outline.
    local function toggle_outline(location, state)
        if location._last_outline_state == state then return end
        location._last_outline_state = state

        local entity = location.entity
        if not entity or not DoesEntityExist(entity) then return end

        SetEntityDrawOutline(entity, state)
        if state then
            SetEntityDrawOutlineColor(255, 255, 255, 255)
            SetEntityDrawOutlineShader(1)
        end
    end

    --- Renders a single zone's DUI.
    --- Drawing happens every frame to prevent flickering.
    --- SendDuiMessage is gated behind a dirty flag so we only encode and send when data actually changed.
    --- @param location table: The location table.
    --- @param player_coords vector3: The player's coordinates.
    local function render_dui(location, player_coords)
        if location.is_hidden then return end
        if GetGameTimer() < (location.dui_object.initialized_at or 0) then return end

        local dui = location.dui_object
        if not dui then return end

        if HasStreamedTextureDictLoaded(dui.txd_name) then
            SetDrawOrigin(location.coords.x, location.coords.y, player_coords.z + 0.5)
            DrawInteractiveSprite(dui.txd_name, dui.txt_name, 0, 0, 0.7, 0.7, 0.0, 255, 255, 255, 255)
            ClearDrawOrigin()
        end

        if location._state_dirty then
            location._state_dirty = false
            local safe_keys = {}
            for i = 1, #location.keys do
                local k = location.keys[i]
                safe_keys[i] = { key = k.key, label = k.label, key_control = k.key_control }
            end
            SendDuiMessage(dui.dui_object, json.encode({
                func = "show_dui",
                payload = {
                    image = location.image,
                    header = location.header,
                    model = location.model,
                    icon = location.icon,
                    keys = safe_keys,
                    outline = location.outline,
                    is_destroyed = location.is_destroyed,
                    is_hidden = location.is_hidden,
                    additional = location.additional
                }
            }))
        end
    end

    --- @section Events

    --- Syncs DUI updates from server with client UI.
    --- @param id string: Zone ID.
    --- @param updated_data table: The new data.
    RegisterNetEvent("pluck:cl:sync_dui_data", function(id, updated_data)
        local location = dui_locations[id]
        if not location then return end

        for key, value in pairs(updated_data) do
            if key == "keys" and type(value) == "table" then
                local valid_keys = {}
                for _, key_data in ipairs(value) do
                    local key_name = string.lower(key_data.key or "")
                    local key_control = key_list[key_name]
                    if key_control then
                        key_data.key_control = key_control
                        valid_keys[#valid_keys + 1] = key_data
                    end
                end
                location[key] = valid_keys
            else
                location[key] = value
            end
        end

        location._state_dirty = true
    end)

    --- @section Threads

    --- Proximity check thread — runs on a slower tick to avoid iterating all zones every frame.
    --- Updates in_proximity flag and handles access checks and outline state.
    --- Separated from the render loop so drawing is never blocked by this work.
    CreateThread(function()
        while true do
            local player_ped = PlayerPedId()
            local player_coords = GetEntityCoords(player_ped)
            local now = GetGameTimer()

            for _, location in pairs(dui_locations) do
                if location.is_destroyed then
                    remove_dui_zone(location.id)
                else
                    local should_show = true

                    if location.can_access then
                        if now - location._last_access_check > 2000 then
                            location._last_access_check = now
                            local ok, result = pcall(location.can_access)
                            location._last_access_result = ok and result == true
                        end
                        should_show = location._last_access_result
                    end

                    if should_show and not location.is_hidden then
                        local dx = player_coords.x - location.coords.x
                        local dy = player_coords.y - location.coords.y
                        local dz = player_coords.z - location.coords.z
                        local distance_squared = dx * dx + dy * dy + dz * dz

                        if distance_squared <= dui_range_squared then
                            location.in_proximity = true
                            if location.outline and location.entity then
                                toggle_outline(location, true)
                            end
                        else
                            if location.in_proximity then
                                location.in_proximity = false
                                if location.outline and location.entity then
                                    toggle_outline(location, false)
                                end
                            end
                        end
                    else
                        if location.in_proximity then
                            location.in_proximity = false
                            if location.outline and location.entity then
                                toggle_outline(location, false)
                            end
                        end
                    end
                end
            end

            Wait(250)
        end
    end)

    --- Render thread — runs every frame for zones in proximity so DUI never flickers.
    --- Drawing and SendDuiMessage are handled here; proximity logic is on the slower tick above.
    CreateThread(function()
        while true do
            local player_ped = PlayerPedId()
            local player_coords = GetEntityCoords(player_ped)
            local any_nearby = false

            for _, location in pairs(dui_locations) do
                if location.in_proximity and not location.is_hidden and not location.is_destroyed then
                    render_dui(location, player_coords)
                    handle_key_presses(location)
                    any_nearby = true
                end
            end

            Wait(any_nearby and 0 or 250)
        end
    end)

    --- @section Test Commands

    RegisterCommand("testdui", function()
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        local offsets = {
            { x = 2.0,  y = 0.0  },
            { x = -2.0, y = 0.0  },
            { x = 0.0,  y = 2.0  },
            { x = 0.0,  y = -2.0 },
            { x = 2.0,  y = 2.0  },
        }

        for i, offset in ipairs(offsets) do
            add_dui_zone({
                id = ("test_zone_%d"):format(i),
                coords = { x = coords.x + offset.x, y = coords.y + offset.y, z = coords.z },
                header = ("Test Zone %d"):format(i),
                icon = "fa-solid fa-star",
                keys = {
                    { key = "e", label = "Interact", on_action = function()
                        print(("Zone %d interact pressed"):format(i))
                    end }
                }
            })
        end

        print("^2[testdui] 5 zones spawned around player")
    end, false)

    RegisterCommand("cleardui", function()
        for i = 1, 5 do
            remove_dui_zone(("test_zone_%d"):format(i))
        end
        print("^2[cleardui] zones cleared")
    end, false)

end