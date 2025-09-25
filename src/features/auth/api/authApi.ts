import type { LoginInputs } from "@/features/auth/lib/schemas"
import type { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/api/baseApi"
import type { CaptchaResponse } from "@/features/auth/api/authApi.types"

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
    captcha: builder.query<CaptchaResponse, void>({
      query: () => ({ method: "get", url: "/security/get-captcha-url" }),
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation, useLazyCaptchaQuery } = authApi
