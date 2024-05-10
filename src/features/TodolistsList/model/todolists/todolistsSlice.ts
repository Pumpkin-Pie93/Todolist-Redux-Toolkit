import { todolistsApi } from "features/TodolistsList/api/todolistsApi"
import { RequestStatusType } from "app/appSlice"
import { createAppAsyncThunk } from "common/utils"
import { createSlice, isRejected, PayloadAction } from "@reduxjs/toolkit"
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
      }>
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
      }>
    ) => {
      const index = state.findIndex((el) => el.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" })
        })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodolist: TodolistDomainType = {
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle"
        } // можно аншифтнуть сразу объект нового тодуса и тогда не нужна типизация
        state.unshift(newTodolist)
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((el) => el.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      // прииспользовании clearTasksAndTodolists из common actions:
      .addCase(clearTasksAndTodolists, () => {
        return []
      })
      .addMatcher(isRejected(todolistThunks.removeTodolist),(state,action)=>{
        const todo = state.find((todo)=> todo.id === action.meta.arg.id)
        if(todo){
          todo.entityStatus = 'idle'
        }
      })
  }
})

// thunks

export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  `${slice.name}/fetchTodolists`,
  async () => {
    debugger
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
  }
)

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, { rejectWithValue }) => {
    const res = await todolistsApi.createTodolist(arg.title)
    if (res.data.resultCode === ResultCode.success) {
      return { todolist: res.data.data.item }
    }
    else {
      // handleServerAppError(res.data, dispatch,false)

      return rejectWithValue(res.data)
    }
  }
)

const removeTodolist = createAppAsyncThunk<{ id: string }, {
  id: string
}>(`${slice.name}/removeTodolist`, async ({ id }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(todolistActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
    const res = await todolistsApi.deleteTodolist(id)
    if (res.data.resultCode === ResultCode.success) {
      return { id }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  `${slice.name}/changeTodolistTitle`,
  async ({ id, title }, thunkAPI) => {
    const {  rejectWithValue } = thunkAPI
    const res = await todolistsApi.updateTodolist(id, title)
    if (res.data.resultCode === ResultCode.success) {
      return { id, title }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions
export const todolistThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }
