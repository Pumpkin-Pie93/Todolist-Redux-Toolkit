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

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    const thunk = todolistThunks.fetchTodolists()
    dispatch(thunk)
  }, [])

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    const thunk = tasksThunks.removeTask({ taskId, todolistId })
    dispatch(thunk)
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = tasksThunks.addTask({ title, todolistId })
    dispatch(thunk)
  }, [])

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId }))
  }, [])

  const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId, domainModel: { title: newTitle }, todolistId }))
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = todolistActions.changeTodolistFilter({ id: todolistId, filter: value })
    dispatch(action)
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    dispatch(todolistThunks.removeTodolist({ id }))
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistThunks.changeTodolistTitle({ id, title }))
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistThunks.addTodolist({ title }))
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
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
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
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
