import React, { ChangeEvent } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Delete } from "@mui/icons-material"
import { TaskStatuses } from "common/enums"
import { useActions } from "common/hooks/useActions"
import { TaskType } from "features/TodolistsList/api/tasksApi.types"
import s from './Task.module.css'

type Props = {
  task: TaskType
  todolistId: string
}

export const Task = ({task,todolistId}: Props) => {

  const { removeTask, updateTask } = useActions()

  const removeTaskHandler = () => {
    removeTask({ taskId: task.id, todolistId })
  }

  const updateTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: task.id, domainModel: { status }, todolistId }
    )
  }

  const updateTaskTitleHandler =
    (title: string) => {
      updateTask({ taskId: task.id, domainModel: { title }, todolistId })
    }

  let isTaskCompleted = task.status === TaskStatuses.Completed
  return (
    <div key={task.id} className={isTaskCompleted ? s.isDdone : ""}>
      <Checkbox checked={isTaskCompleted} color="primary"
                onChange={updateTaskStatusHandler} />
      <EditableSpan value={task.title} onChange={updateTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  )
}
