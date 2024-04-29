import axios from "axios"
import { AppDispatch } from "app/store"
import { appActions } from "app/appSlice"

/**
 * handleServerNetworkError - Обрабатывает ошибку сервера или сети, определяет текст ошибки и обновляет соответствующие
 * состояния в Redux.
 * @param err - Объект ошибки, который необходимо обработать.
 * @param dispatch - Функция диспетча Redux для отправки действий.
 * @param isGlobalError - Флаг, указывающий, является ли ошибка глобальной. По умолчанию true.
 */

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch, isGlobalError: boolean = true): void => {
  let errorMessage = "Some error occurred"

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
