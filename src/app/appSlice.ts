import { createSlice, PayloadAction, UnknownAction } from "@reduxjs/toolkit"

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
  extraReducers:(builder)=>{
    builder.addMatcher(
      (action:UnknownAction)=> {
        return action.type.endsWith('/pending')
      },
      (state, _)=>{
        state.status = 'loading'
      })
    builder.addMatcher(
      (action:UnknownAction)=> {
        return action.type.endsWith('/rejected')
      },
      (state, _)=>{
        state.status = 'failed'
      })
    builder.addMatcher(
      (action:UnknownAction)=> {
        return action.type.endsWith('/fulfilled')
      },
      (state, _)=>{
        state.status = 'succeeded'
      })
  }
})

//exports
export const appReducer = slice.reducer
export const appActions = slice.actions

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>
