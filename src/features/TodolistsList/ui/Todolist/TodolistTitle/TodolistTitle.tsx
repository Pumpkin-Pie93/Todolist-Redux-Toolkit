import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import React from "react"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { useActions } from "common/hooks/useActions"

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle = ({ todolist }: Props) => {

  const {id ,entityStatus,title}= todolist

  const { removeTodolist, changeTodolistTitle } = useActions()

  const removeTodolistHandler = () => {
    removeTodolist({ id })
  }

  const changeTodolistTitleHandler = (title: string) => {
      changeTodolistTitle({ id, title })
    }

  return (
    <h3>
      <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}