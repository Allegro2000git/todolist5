import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { Todolist } from "./todolistsApi.types"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import { baseApi } from "@/app/baseApi"

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

export const _todolistsApi = {
  getTodolists() {
    // yes
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    //yes
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    //yes
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
}
