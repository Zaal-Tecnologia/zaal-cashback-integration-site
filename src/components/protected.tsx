import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export function Protected({
  children,
  to,
}: {
  children: ReactNode
  to: string
}) {
  const token = localStorage.getItem('@zaalcashback:token')

  if (!token) {
    return <Navigate replace to={to} />
  }

  return children
}
