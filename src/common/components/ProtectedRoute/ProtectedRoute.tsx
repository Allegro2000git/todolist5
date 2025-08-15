import { Navigate, Outlet } from "react-router"
import type { PropsWithChildren } from "react"
import { Path } from "@/common/routing"

type Props = {
  isAllowed: boolean
  redirectPath?: string
}

export const ProtectedRoute = ({ children, isAllowed, redirectPath = Path.Login }: PropsWithChildren<Props>) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children ? children : <Outlet />
}
