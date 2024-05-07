import React from "react"
import { Task } from "features/TodolistsList/ui/Todolist/Tasks/Task/Task"
import { TaskType } from "features/TodolistsList/api/tasksApi.types"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { TaskStatuses } from "common/enums"

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
}

export const Tasks = ({tasks,todolist}: Props) => {

  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </>
  )
}

export default Tasks