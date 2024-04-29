import { AppDispatch, AppRootStateType } from "app/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BaseResponseType } from "common/types"

/**
 * Создает асинхронный Thunk для приложения с заранее определенными типами состояния, диспетчера и значения отклонения.
 * @function createAppAsyncThunk
 * @param withTypes - Метод для определения типов состояния, диспетчера и значения отклонения.
 * @returns Асинхронный Thunk для приложения, интегрированный с определенными заранее типами.
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | BaseResponseType
}>()
