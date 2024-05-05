import { Button } from "@mui/material"
import React, { Fragment } from "react"
import { useActions } from "common/hooks/useActions"
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"

type Props = {
  todolist: TodolistDomainType
}

export const FilterTasksButton = ({todolist}:Props) => {

  const { changeTodolistFilter} = useActions()

  const {filter,id} = todolist

  const changeTodolistFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ id, filter })
  }

  return (
    <Fragment>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        onClick={()=>changeTodolistFilterHandler('all')}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        onClick={()=>changeTodolistFilterHandler('active')}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        onClick={()=>changeTodolistFilterHandler('completed')}
        color={"secondary"}
      >
        Completed
      </Button>
    </Fragment>
  )
}