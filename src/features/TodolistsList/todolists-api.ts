import { TaskPriorities, TaskStatuses } from "common/enums/enums"
import { instance } from "common/instance/instance"
import { BaseResponseType } from "common/types/BaseResponseType"

// api
export const todolistsAPI = {
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
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {
      title: taskTitile,
    })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<TaskType>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model,
    )
  },
}

// types
export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
