import { createAction } from "@reduxjs/toolkit"
import { TaskType } from "features/TodolistsList/todolists-api"
import { TodolistDomainType } from "features/TodolistsList/todolistsSlice"

export type ClearTasksAndTodolistsType = {
  tasks: TaskType
  todolists: TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction("common/clear-tasks-todolists")
