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

    --- Shows task list
    --- @param source number: Player source
    --- @param title string: Title for the task list
    --- @param tasks table: Array of task items
    local function show_task_list(source, title, tasks)
        if not source or not title or not tasks then
            pluck.log("error", "Player source, title or tasks missing")
            return
        end
        TriggerClientEvent("pluck:show_task_list", source, title, tasks)
    end

    pluck.show_task_list = show_task_list
    exports("show_task_list", show_task_list)

    --- Hides task list
    --- @param source number: Player source
    local function hide_task_list(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:hide_task_list", source)
    end

    pluck.hide_task_list = hide_task_list
    exports("hide_task_list", hide_task_list)

    --- Destroys task list
    --- @param source number: Player source
    local function destroy_task_list(source)
        if not source then
            pluck.log("error", "Player source missing")
            return
        end
        TriggerClientEvent("pluck:destroy_task_list", source)
    end

    pluck.destroy_task_list = destroy_task_list
    exports("destroy_task_list", destroy_task_list)

    --- Updates a specific task
    --- @param source number: Player source
    --- @param task_id string: ID of the task to update
    --- @param updates table: Table of fields to update
    local function update_task(source, task_id, updates)
        if not source or not task_id or not updates then
            pluck.log("error", "Player source, task_id or updates missing")
            return
        end
        TriggerClientEvent("pluck:update_task", source, task_id, updates)
    end

    pluck.update_task = update_task
    exports("update_task", update_task)

end

if not pluck.is_server then 

    --- @section Functions

    --- Shows task list
    --- @param title string: Title for the task list
    --- @param tasks table: Array of task items
    local function show_task_list(title, tasks)
        local sanitized_tasks = {}
        for i, task in ipairs(tasks) do
            sanitized_tasks[i] = pluck.sanitize_ui(task, ("task_%d"):format(i))
        end

        SetNuiFocus(true, true)
        SendNUIMessage({
            func = "show_task_list",
            payload = {
                title = title,
                tasks = sanitized_tasks
            }
        })
    end

    pluck.show_task_list = show_task_list
    exports("show_task_list", show_task_list)

    --- Hides task list
    local function hide_task_list()
        SendNUIMessage({ func = "hide_task_list" })
    end

    pluck.hide_task_list = hide_task_list
    exports("hide_task_list", hide_task_list)

    --- Destroys task list
    local function destroy_task_list()
        SendNUIMessage({ func = "destroy_task_list" })
    end

    pluck.destroy_task_list = destroy_task_list
    exports("destroy_task_list", destroy_task_list)

    --- Updates a specific task
    --- @param task_id string: ID of the task to update
    --- @param updates table: Table of fields to update
    local function update_task(task_id, updates)
        SendNUIMessage({
            func = "update_task",
            payload = {
                task_id = task_id,
                updates = updates
            }
        })
    end

    pluck.update_task = update_task
    exports("update_task", update_task)

    --- @section Events

    --- Event to show task list
    --- @param title string: Title for the task list
    --- @param tasks table: Array of task items
    RegisterNetEvent("pluck:show_task_list", function(title, tasks)
        if not tasks then return print("tasks missing") end
        show_task_list(title, tasks)
    end)

    --- Event to hide task list
    RegisterNetEvent("pluck:hide_task_list", function()
        hide_task_list()
    end)

    --- Event to destroy task list
    RegisterNetEvent("pluck:destroy_task_list", function()
        destroy_task_list()
    end)

    --- Event to update task
    RegisterNetEvent("pluck:update_task", function(task_id, updates)
        if not task_id or not updates then return print("task_id or updates missing") end
        update_task(task_id, updates)
    end)

    --- @section Test Commands

    RegisterCommand("test_tasks", function()
        show_task_list("TASKS", {
            {
                id = "task_1",
                label = "Task 1",
                description = "This is the first task description",
                completed = true,
                on_action = function(data)
                    print("Task 1 clicked: " .. json.encode(data))
                end
            },
            {
                id = "task_2",
                label = "Task 2",
                description = "This is the second task description",
                in_progress = true,
                progress = 65,
                on_action = function(data)
                    print("Task 2 clicked: " .. json.encode(data))
                end
            },
            {
                id = "task_3",
                label = "Task 3",
                description = "This is the third task description",
                progress = 0,
                on_action = function(data)
                    print("Task 3 clicked: " .. json.encode(data))
                end
            },
            {
                id = "task_4",
                label = "Task 4",
                description = "This is the fourth task description",
                progress = 33,
                on_action = function(data)
                    print("Task 4 clicked: " .. json.encode(data))
                end
            }
        })
    end)

    RegisterCommand("test_task_update", function()
        update_task("task_2", {
            progress = 100,
            completed = true,
            in_progress = false
        })
    end)

    RegisterCommand("test_tasks_hide", function()
        hide_task_list()
    end)

    RegisterCommand("test_tasks_destroy", function()
        destroy_task_list()
    end)

end