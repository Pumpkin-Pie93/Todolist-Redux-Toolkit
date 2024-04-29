import { TaskType, todolistsAPI, UpdateTaskModelType } from "features/TodolistsList/todolists-api"
import { AppThunk } from "app/store"
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils"
import { appActions } from "app/appSlice"
import { todolistActions, todolistThunks } from "features/TodolistsList/todolistsSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums/enums"
import { clearTasksAndTodolists } from "common/actions/common-actions"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      const currentTasksForTodolist = state[action.payload.task.todoListId]
      currentTasksForTodolist.unshift(action.payload.task)
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((el) => el.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.domainModel }
      }
    })
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const currentTasksForTodolist = state[action.payload.todolistId]
      const index = currentTasksForTodolist.findIndex((el) => el.id === action.payload.taskId)
      if (index !== -1) {
        currentTasksForTodolist.splice(index, 1)
      }
    })
    builder.addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
      console.log("id todo from tasks" + action.payload.id)
      delete state[action.payload.id]
    })
    builder.addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(clearTasksAndTodolists, () => {
      return {}
    })
  },
})
// thunks

export const _fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.getTasks(todolistId)
      const tasks = res.data.items
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { tasks, todolistId }
    } catch (error) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    //const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTasks(todolistId)
      const tasks = res.data.items
      return { tasks, todolistId }
    })
  },
)

export const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
      if (res.data.resultCode === ResultCode.success) {
        const task = res.data.data.item
        return { task }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

export const _addTask = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
      if (res.data.resultCode === ResultCode.success) {
        const task = res.data.data.item
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { task }
      } else {
        handleServerNetworkError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

const updateTask = createAppAsyncThunk<
  { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType },
  { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType }
>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found" }))
      return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }

    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

export const removeTask = createAppAsyncThunk<
  { taskId: string; todolistId: string },
  { taskId: string; todolistId: string }
>(`${slice.name}/removeTask`, async ({ taskId, todolistId }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    const res = await todolistsAPI.deleteTask(todolistId, taskId)
    if (res.data.resultCode === ResultCode.success) {
      return { taskId, todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }
