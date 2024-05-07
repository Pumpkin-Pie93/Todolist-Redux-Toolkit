import React, { useEffect } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { TaskType } from "features/TodolistsList/api/tasksApi.types"
import { useActions } from "common/hooks/useActions"
import { FilterTasksButton } from "features/TodolistsList/ui/Todolist/FilterTasksButton"
import Tasks from "features/TodolistsList/ui/Todolist/Tasks/Tasks"
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle"

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = function({ demo = false, ...props }: Props) {

  const { addTask, fetchTasks } = useActions()
  const { todolist,tasks} = props

  useEffect(() => {
    if (demo) {
      return
    }
    fetchTasks(todolist.id)
  }, [])

  const addTaskCb = (title: string) => {
    addTask({ title, todolistId: todolist.id })
  }

  return (
    <div>
     <TodolistTitle  todolist={todolist}/>
      <AddItemForm addItem={addTaskCb} disabled={todolist.entityStatus === "loading"} />
     <Tasks tasks={tasks} todolist={todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton todolist={props.todolist}/>
      </div>
    </div>
  )
}
