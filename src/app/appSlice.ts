import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { todolistThunks } from "features/TodolistsList/model/todolists/todolistsSlice"

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action: any) => {
        console.log(action.type)
        console.log(todolistThunks.addTodolist)
        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state, action: any) => {
        state.status = "succeeded"
      })
    // .addMatcher(isRejected, (state, action: any) => {
    //   state.status = "failed"
    //   if (action.payload) {
    //     // console.log(action.type)
    //     //if (action.type === todolistThunks.addTodolist.rejected.type) return;
    //     // ❓❓❓???Cannot read properties of undefined (reading 'createAppAsyncThunk')
    //     state.error = action.payload.messages[0]
    //   } else {
    //     state.error = action.error.message ? action.error.message : "Some error occurred"
    //   }
    // })
    // .addDefaultCase((state, action) => {
    //   console.log(action.type)
    // })
  },
})

//exports
export const appReducer = slice.reducer
export const appActions = slice.actions

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>
