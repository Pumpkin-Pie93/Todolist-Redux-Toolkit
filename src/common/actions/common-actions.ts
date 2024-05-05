import { createAction } from "@reduxjs/toolkit"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { TaskType } from "../../features/TodolistsList/api/tasksApi.types"

export type ClearTasksAndTodolistsType = {
  tasks: TaskType
  todolists: TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction("common/clear-tasks-todolists")
