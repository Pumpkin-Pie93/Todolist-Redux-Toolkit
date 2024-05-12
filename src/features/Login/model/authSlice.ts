import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/appSlice"
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils"
import { authAPI } from "features/Login/api/authApi"
import { clearTasksAndTodolists } from "common/actions/common-actions"
import { ResultCode } from "common/enums"
import { LoginParamsType } from "features/TodolistsList/api/todolistsApi.types"

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    )
  }
})

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { data: LoginParamsType }>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }))
      let res = await authAPI.login(arg.data)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(res.data, dispatch, isShowAppError)
        return rejectWithValue(res.data)
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    let res = await authAPI.logout()
    console.log(res)
    if (res.data.resultCode === ResultCode.success) {
      // dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
      dispatch(clearTasksAndTodolists())
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
  const {dispatch,rejectWithValue} = thunkAPI
  const res = await authAPI.me()
    .finally(()=>{
    dispatch(appActions.setAppInitialized({isInitialized: true}))
  })
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

// exports
export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout, initializeApp }
