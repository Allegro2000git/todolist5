import { createAction } from "@reduxjs/toolkit"
import type { TasksState } from "@/features/todolists/model/tasks-slice"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"

export type Props = {
  tasks: TasksState
  todolists: DomainTodolist[]
}

export const clearDataAC = createAction<Props>("common/clearData")
