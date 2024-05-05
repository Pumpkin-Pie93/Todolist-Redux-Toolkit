import { instance } from "../../../common/instance/instance"
import { BaseResponseType } from "../../../common/types"
import { GetTasksResponse, TaskType, UpdateTaskModelType } from "./tasksApi.types"

export const tasksApi = {

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
  }
}