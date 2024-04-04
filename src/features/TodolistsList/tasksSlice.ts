// import {
//   AddTodolistActionType,
//   RemoveTodolistActionType,
//   SetTodolistsActionType,
// } from "features/TodolistsList/todolistsSlice";
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppDispatch, AppRootStateType, AppThunk } from "app/store";
// import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/appSlice";
import { todolistActions, TodolistDomainType } from "features/TodolistsList/todolistsSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      // const index = state[action.payload.todolistId].findIndex((el) => el.id === action.payload.taskId);
      // if (index !== -1) {
      //   state[action.payload.todolistId].splice(index, 1);
      // }
      const currentTasksForTodolist = state[action.payload.todolistId];
      const index = currentTasksForTodolist.findIndex((el) => el.id === action.payload.taskId);
      if (index !== -1) {
        currentTasksForTodolist.splice(index, 1);
      }
    },
    _removeTask: {
      // исп-е prepare reducer
      reducer: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
        const currentTasksForTodolist = state[action.payload.todolistId];
        const index = currentTasksForTodolist.findIndex((el) => el.id === action.payload.taskId);
        if (index !== -1) {
          currentTasksForTodolist.splice(index, 1);
        }
      },
      prepare: (taskId: string, todolistId: string) => {
        // всегда выполнится первым(преоразует payload)
        return {
          payload: {
            taskId,
            todolistId,
          },
        };
      },
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const currentTasksForTodolist = state[action.payload.task.todoListId];
      currentTasksForTodolist.unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
    ) => {
      //  return {...state, [action.todolistId]: state[action.todolistId].map((t) =>
      //   t.id === action.taskId ? { ...t, ...action.model } : t)}
      // state[action.payload.todolistId]: action.payload.model
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(todolistActions.addTodolist, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(todolistActions.removeTodolist, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(todolistActions.setTodolists, (state, action) => {
      action.payload.todolists.forEach((t) => {
        state[t.id] = [];
      });
    });
    builder.addCase(todolistActions.cleanTodolists, () => {
      return {};
    });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(tasksActions.setTasks({ tasks, todolistId }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = tasksActions.removeTask({ taskId, todolistId });
      dispatch(action);
    });
  };
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const task = res.data.data.item;
          const action = tasksActions.addTask({ task });
          dispatch(action);
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = tasksActions.updateTask({ taskId, model: domainModel, todolistId });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
type ActionsType = any;
// | ReturnType<typeof removeTaskAC>
// | ReturnType<typeof addTaskAC>
// ReturnType<typeof updateTaskAC> | any | ReturnType<typeof setTasksAC>;
type ThunkDispatch = Dispatch;