import { Dispatch } from "redux"
import { authActions } from "features/Login/authSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authAPI } from "features/Login/authApi"

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
  extraReducers: (builder) => {},
})

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
    } else {
    }

    dispatch(appActions.setAppInitialized({ isInitialized: true }))
  })
}

export const appReducer = slice.reducer
export const appActions = slice.actions
