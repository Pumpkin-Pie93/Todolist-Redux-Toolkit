import { AppDispatch, AppRootStateType } from "app/store"
import { handleServerNetworkError } from "common/utils/handle-server-network-error"
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk"
import { BaseResponseType } from "common/types"
import { appActions } from "app/appSlice"

/**
 * A utility function that encapsulates common asynchronous logic for Redux Thunks with error handling.
 * @template T - The type of the expected result of the asynchronous operation.
 * @param thunkAPI - The base Thunk API object provided by Redux Toolkit.
 * @param logic - The asynchronous operation to be executed, typically a Promise-based function.
 * @returns A Promise that resolves to the result of the asynchronous operation, or a rejectWithValue action on failure.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  dispatch(appActions.setAppStatus({ status: "loading" }))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }))
  }
}
