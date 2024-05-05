import React, { useCallback, useEffect } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Task } from "./Task/Task"
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { Button, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { addTask, tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { TaskStatuses } from "common/enums"
import { TaskType } from "features/TodolistsList/api/tasksApi.types"
import { useActions } from "common/hooks/useActions"
import { FilterTasksButton } from "features/TodolistsList/ui/Todolist/FilterTasksButton"

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = function({ demo = false, ...props }: Props) {

  const {  addTask, fetchTasks, removeTodolist, changeTodolistTitle } = useActions()
  const {todolist,tasks} = props

  useEffect(() => {
    if (demo) {
      return
    }
    fetchTasks(todolist.id)
  }, [])

  const addTaskCb = (title: string) => {
    addTask({ title, todolistId: todolist.id })
  }

  const removeTodolistCb = () => {
    removeTodolist({ id: todolist.id })
  }
  const changeTodolistTitleCb =
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title })
    }

  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleCb} />
        <IconButton onClick={removeTodolistCb} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCb} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton todolist={props.todolist}/>
      </div>
    </div>
  )
}
