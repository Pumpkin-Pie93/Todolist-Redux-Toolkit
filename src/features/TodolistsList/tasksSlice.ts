import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/appSlice";
import { todolistActions } from "features/TodolistsList/todolistsSlice";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";

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
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      const currentTasksForTodolist = state[action.payload.task.todoListId];
      currentTasksForTodolist.unshift(action.payload.task);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      }
    });
  },
});

// thunks

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task };
      } else {
        handleServerNetworkError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const updateTask = createAppAsyncThunk<
  { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType },
  { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType }
>("tasks/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found" }));
      return rejectWithValue(null);
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    };

    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return arg;
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

// export const _updateTaskTC =
//   (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//   (dispatch, getState: () => AppRootStateType) => {
//     const state = getState();
//     const task = state.tasks[todolistId].find((t) => t.id === taskId);
//     if (!task) {
//       //throw new Error("task not found in the state");
//       console.warn("task not found in the state");
//       return;
//     }
//
//     const apiModel: UpdateTaskModelType = {
//       deadline: task.deadline,
//       description: task.description,
//       priority: task.priority,
//       startDate: task.startDate,
//       title: task.title,
//       status: task.status,
//       ...domainModel,
//     };
//
//     todolistsAPI
//       .updateTask(todolistId, taskId, apiModel)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           const action = tasksActions.updateTask({ taskId, model: domainModel, todolistId });
//           dispatch(action);
//         } else {
//           handleServerNetworkError(res.data, dispatch);
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };

// export const removeTask = createAppAsyncThunk('tasks/removeTask',({taskId: string, todolistId: string},ThunkApi)=>{

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = tasksActions.removeTask({ taskId, todolistId });
      dispatch(action);
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

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask };
