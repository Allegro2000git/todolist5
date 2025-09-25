import { z } from "zod/v4"

export const captchaResponseSchema = z.object({
  url: z.string(),
})

export type CaptchaResponse = z.infer<typeof captchaResponseSchema>
