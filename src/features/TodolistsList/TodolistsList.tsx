import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { FilterValuesType, todolistActions, todolistThunks } from "features/TodolistsList/todolistsSlice"
import { tasksThunks } from "features/TodolistsList/tasksSlice"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { Todolist } from "./Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { TaskStatuses } from "common/enums"
import { selectTodolists } from "features/TodolistsList/todolists.selectors"
import { selectTasks } from "features/TodolistsList/tasks.selectors"
import { selectIsLoggedIn } from "features/Login/auth.selectors"
import { useActions } from "common/hooks/useActions"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  //const dispatch = useAppDispatch()
  const {
    fetchTodolists,
    removeTask,
    addTask,
    updateTask,
    changeTodolistFilter,
    removeTodolist,
    changeTodolistTitle,
    addTodolist,
  } = useActions()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

  const removeTaskCb = useCallback(function (taskId: string, todolistId: string) {
    removeTask({ taskId, todolistId })
  }, [])

  const addTaskCb = useCallback(function (title: string, todolistId: string) {
    addTask({ title, todolistId })
  }, [])

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId, domainModel: { status }, todolistId })
  }, [])

  const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
    updateTask({ taskId, domainModel: { title: newTitle }, todolistId })
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    changeTodolistFilter({ id: todolistId, filter: value })
  }, [])

  const removeTodolistCb = useCallback(function (id: string) {
    removeTodolist({ id })
  }, [])

  const changeTodolistTitleCb = useCallback(function (id: string, title: string) {
    changeTodolistTitle({ id, title })
  }, [])

  const addTodolistCb = useCallback((title: string) => {
    addTodolist({ title })
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCb} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTaskCb}
                  changeFilter={changeFilter}
                  addTask={addTaskCb}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolistCb}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitleCb}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
