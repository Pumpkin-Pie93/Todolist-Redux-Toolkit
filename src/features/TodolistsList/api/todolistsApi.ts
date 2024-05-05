import { instance } from "common/instance/instance"
import { BaseResponseType } from "common/types/BaseResponseType"
import { TodolistType } from "./todolistsApi.types"

// api
export const todolistsApi = {

  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title: title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${id}`, { title: title })
  }
}
