import { createAction } from "@reduxjs/toolkit";
import { TaskType } from "api/todolists-api";
import { TodolistDomainType } from "features/TodolistsList/todolistsSlice";

export type ClearTasksAndTodolistsType = {
  tasks: TaskType;
  todolists: TodolistDomainType[];
};

export const clearTasksAndTodolists = createAction(
  "common/clear-task-todolists",
  (tasks: TaskType, todolists: TodolistDomainType[]) => {
    // передаем параметры в ф-ю
    // можно писать логику для настройки payload
    return {
      payload: {
        tasks,
        todolists,
      },
    };
  },
);
