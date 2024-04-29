import { useMemo } from "react"
import { ActionCreatorsMapObject, bindActionCreators } from "redux"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { tasksThunks } from "features/TodolistsList/tasksSlice"
import { authThunks } from "features/Login/authSlice"
import { todolistActions, todolistThunks } from "features/TodolistsList/todolistsSlice"

// ❗ упаковываем actions и соответсвенно при вызове хука не нужно
// будет передавать actions
const actionsAll = { ...tasksThunks, ...todolistThunks, ...todolistActions, ...authThunks }

type AllActions = typeof actionsAll

export const useActions = () => {
  const dispatch = useAppDispatch()

  return useMemo(
    () => bindActionCreators<AllActions, RemapActionCreators<AllActions>>(actionsAll, dispatch),
    [dispatch],
  )
}

// Types
type ReplaceReturnType<T> = T extends (...args: any[]) => any
  ? (...args: Parameters<T>) => ReturnType<ReturnType<T>>
  : () => T

type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K]>
}
