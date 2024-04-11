import { instance } from "common/instance/instance"
import { ResponseType } from "common/types/ResponseType"
import { LoginParamsType } from "features/TodolistsList/todolists-api"

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>("auth/login", data)
  },
  logout() {
    return instance.delete<ResponseType<{ userId?: number }>>("auth/login")
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me")
  },
}
