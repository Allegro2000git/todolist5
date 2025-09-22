import { EditableSpan } from "@/common/components"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { useChangeTodolistTitleMutation, useDeleteTodolistMutation } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist } from "@/features/todolists/lib/types/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const [deleteTodolistMutation] = useDeleteTodolistMutation()
  const [changeTodolistTitleMutation] = useChangeTodolistTitleMutation()

  const deleteTodolist = () => deleteTodolistMutation(id)

  const changeTodolistTitle = (title: string) => {
    changeTodolistTitleMutation({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
