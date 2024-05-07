import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { Navigate } from "react-router-dom"
import { selectTodolists } from "features/TodolistsList/model/todolists/todolists.selectors"
import { selectTasks } from "features/TodolistsList/model/tasks/tasks.selectors"
import { selectIsLoggedIn } from "features/Login/model/auth.selectors"
import { useActions } from "common/hooks/useActions"
import { Todolist } from "./Todolist/Todolist"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {

  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const { fetchTodolists, addTodolist } = useActions()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

  const addTodolistCb = useCallback((title: string) => {
   return addTodolist({ title }).unwrap()
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
