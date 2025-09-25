import { selectThemeMode, setIsLoggedIn } from "@/app/model/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { useLazyCaptchaQuery, useLoginMutation } from "@/features/auth/api/authApi"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"
import { useState } from "react"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const [loginMutation] = useLoginMutation()
  const [trigger, { data: dataCaptcha }] = useLazyCaptchaQuery()

  const [isCaptcha, setIsCaptcha] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false, captcha: undefined },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    loginMutation(data)
      .unwrap()
      .then((data) => {
        if (data?.resultCode === ResultCode.Success) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          if ("token" in data.data) {
            localStorage.setItem(AUTH_TOKEN, data.data.token)
          }
          reset()
        }
        if (data?.resultCode === ResultCode.CaptchaError) {
          trigger()
            .unwrap()
            .then(() => {
              setIsCaptcha(true)
              const errorMessage = JSON.stringify(data.messages?.[0])
              setError("captcha", { message: errorMessage })
            })
        }
      })
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.email}
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            {isCaptcha && (
              <>
                <img src={dataCaptcha?.url} alt="captcha" />
                {errors.captcha && <span className={styles.errorMessage}>{errors.captcha.message}</span>}
                <TextField
                  size="small"
                  label="Type the text from the image"
                  margin="normal"
                  error={!!errors.captcha}
                  autoComplete="off"
                  {...register("captcha")}
                />
              </>
            )}
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
