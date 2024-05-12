import { Dispatch } from "redux"
import { appActions } from "app/appSlice"
import { BaseResponseType } from "common/types/BaseResponseType"

/**
 * Обработка ошибки от сервера.
 *
 * @template D - обобщенный тип данных.
 * @param data - объект с данными ответа от сервера.
 * @param dispatch - функция для отправки действий в Redux хранилище.
 * @param showGlobalError - флаг, определяющий, нужно ли показывать глобальную ошибку. По умолчанию true.
 * @returns void - ничего не возвращает.
 */

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showGlobalError: boolean = true,
) => {
  if (showGlobalError) {
    ;("")
    dispatch(
      appActions.setAppError({
        error: data.messages.length ? data.messages[0] : "Some error occurred",
      }),
    )
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
