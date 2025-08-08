import { Navigate, Outlet } from "react-router"
import type { ReactNode } from "react"

type Props = {
  children?: ReactNode
  isAllowed: boolean
  redirectPath: string
}

export const ProtectedRoute = ({ children, isAllowed, redirectPath }: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children ? children : <Outlet />
}
