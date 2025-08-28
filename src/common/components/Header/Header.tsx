import {
  changeThemeModeAC,
  selectAppIsLoggedIn,
  selectAppStatus,
  selectThemeMode,
  setIsLoggedIn,
} from "@/app/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { NavButton } from "@/common/components/NavButton/NavButton"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import LinearProgress from "@mui/material/LinearProgress"
import { NavLink } from "react-router"
import { Path } from "@/common/routing"
import { useLogoutMutation } from "@/features/auth/api/authApi"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)
  const isLoggedIn = useAppSelector(selectAppIsLoggedIn)

  const dispatch = useAppDispatch()

  const [logoutMutation] = useLogoutMutation()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {
    logoutMutation()
      .unwrap()
      .then((data) => {
        if (data.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(setIsLoggedIn({ isLoggedIn: false }))
        }
      })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Sign out</NavButton>}
            <NavLink
              style={{
                margin: "0px 15px",
                padding: "10px 20px",
                textDecoration: "none",
                fontSize: "15px",
                color: "white",
                fontWeight: "600",
              }}
              to={Path.Faq}
            >
              Faq
            </NavLink>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
