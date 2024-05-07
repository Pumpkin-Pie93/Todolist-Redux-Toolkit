import { todolistsApi } from "features/TodolistsList/api/todolistsApi"
import { appActions, RequestStatusType } from "app/appSlice"
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ResultCode } from "common/enums"
import { clearTasksAndTodolists } from "common/actions/common-actions"
import { TodolistType } from "../../api/todolistsApi.types"

//types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{
        id: string
        filter: FilterValuesType
      }>,
    ) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{
        id: string
        entityStatus: RequestStatusType
      }>,
    ) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" })
      })
    })
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
      const newTodolist: TodolistDomainType = {
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      } // можно аншифтнуть сразу объект нового тодуса и тогда не нужна типизация
      state.unshift(newTodolist)
    })
    builder.addCase(todolistThunks.changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    })
    // прииспользовании clearTasksAndTodolists из common actions:
    builder.addCase(clearTasksAndTodolists, (state, action) => {
      return []
    })
  },
})

// thunks

export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${slice.name}/fetchTodolists`,
  async (_, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsApi.getTodolists()
      return { todolists: res.data }
    })
  },
)

const removeTodolist = createAppAsyncThunk<{ id: string }, { id: string }>(
  `${slice.name}/removeTodolist`,
  async ({ id }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(todolistActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
      const res = await todolistsApi.deleteTodolist(id)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { id }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsApi.createTodolist(arg.title)
      if (res.data.resultCode === ResultCode.success) {
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch,false)
        dispatch(appActions.setAppStatus({ status: "failed" }))
        return rejectWithValue(res.data)
      }
    })
  },
)

export const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  `${slice.name}/changeTodolistTitle`,
  async ({ id, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsApi.updateTodolist(id, title)
      if (res.data.resultCode === ResultCode.success) {
        return { id, title }
      } else {
        handleServerAppError(res.data, dispatch)
        dispatch(appActions.setAppStatus({ status: "failed" }))
        return rejectWithValue(null)
      }
    })
  },
)

export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions
export const todolistThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }

// export const _fetchTodolists = createAppAsyncThunk<
//   {
//     todolists: TodolistType[]
//   },
//   void
// >(`${slice.name}/fetchTodolists`, async (arg, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI
//   try {
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//     const res = await todolistsApi.getTodolists()
//     dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     return { todolists: res.data }
//   } catch (error) {
//     handleServerNetworkError(error, dispatch)
//     // dispatch(appActions.setAppStatus({ status: "failed" }))
//     return rejectWithValue(null)
//   }
// })

// const _removeTodolist = createAppAsyncThunk<{ id: string }, { id: string }>(
//   `${slice.name}/removeTodolist`,
//   async ({ id }, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       dispatch(todolistActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
//       const res = await todolistsApi.deleteTodolist(id)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         return { id }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (e) {
//       handleServerNetworkError(e, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

// export const _addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
//   `${slice.name}/addTodolist`,
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await todolistsApi.createTodolist(arg.title)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         return { todolist: res.data.data.item }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         dispatch(appActions.setAppStatus({ status: "failed" }))
//         return rejectWithValue(null)
//       }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       dispatch(appActions.setAppStatus({ status: "failed" }))
//       return rejectWithValue(null)
//     }
//   },
// )

// export const _changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
//   `${slice.name}/changeTodolistTitle`,
//   async ({ id, title }, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await todolistsApi.updateTodolist(id, title)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         return { id, title }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         dispatch(appActions.setAppStatus({ status: "failed" }))
//         return rejectWithValue(null)
//       }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       dispatch(appActions.setAppStatus({ status: "failed" }))
//       return rejectWithValue(null)
//     }
//   },
// )
