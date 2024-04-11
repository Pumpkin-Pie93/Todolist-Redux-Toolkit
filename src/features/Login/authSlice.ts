import { LoginParamsType } from "features/TodolistsList/todolists-api"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "app/store"
import { appActions } from "app/appSlice"
import { todolistActions } from "features/TodolistsList/todolistsSlice"
import { handleServerNetworkError } from "common/utils"
import { authAPI } from "features/Login/authApi"

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {},
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {}

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
          dispatch(appActions.setAppStatus({ status: "succeeded" }))
        } else {
          handleServerNetworkError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }))

  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
        dispatch(todolistActions.cleanTodolists())
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
      } else {
        handleServerNetworkError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
