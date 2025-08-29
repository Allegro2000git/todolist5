import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, string>({
      query: (todolistId) => ({
        method: "get",
        url: `/todo-lists/${todolistId}/tasks`,
      }),
      providesTags: ["Task"],
    }),
    deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        method: "delete",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
      }),
      invalidatesTags: ["Task"],
    }),
    createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        method: "post",
        url: `/todo-lists/${todolistId}/tasks`,
        body: { title },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        method: "put",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        body: model,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
})

export const { useGetTasksQuery, useDeleteTaskMutation, useCreateTaskMutation, useUpdateTaskMutation } = tasksApi
