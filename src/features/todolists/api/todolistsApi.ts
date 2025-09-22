import type { BaseResponse } from "@/common/types"
import type { Todolist } from "./todolistsApi.types"
import { baseApi } from "@/app/api/baseApi"
import type { DomainTodolist } from "@/features/todolists/lib/types/types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<DomainTodolist[], void>({
      query: () => ({
        method: "get",
        url: "/todo-lists",
      }),
      transformResponse: (todolists: Todolist[]) => {
        return todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" }))
      },
      providesTags: ["Todolist"],
    }),
    createTodolists: builder.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({ method: "post", url: "/todo-lists", body: { title } }),
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: builder.mutation<BaseResponse, string>({
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
            const todolistIndex = state.findIndex((todolist: DomainTodolist) => todolist.id === id)

            if (todolistIndex !== -1) {
              state.splice(todolistIndex, 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch (err) {
          patchResult.undo()
        }
      },
      query: (id) => ({ method: "delete", url: `/todo-lists/${id}` }),
      invalidatesTags: ["Todolist"],
    }),
    changeTodolistTitle: builder.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({ method: "put", url: `/todo-lists/${id}`, body: { title } }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistsMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi
