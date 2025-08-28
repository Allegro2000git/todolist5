import { instance } from "@/common/instance"
import type { LoginInputs } from "@/features/auth/lib/schemas"
import type { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => ({ method: "get", url: "/auth/me" }),
    }),
    login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (body) => ({ method: "post", url: "/auth/login", body }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({ method: "delete", url: "/auth/login" }),
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi

export const _authApi = {
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>("/auth/login", payload)
  },
  logout() {
    return instance.delete<BaseResponse>("/auth/login")
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("/auth/me")
  },
}
