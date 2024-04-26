import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { Onboarding } from '@/screens/onboarding'
import { Ads } from '@/screens/ads'
import { History } from '@/screens/history'

import { Layout } from '@/components/layout'
import { NotFound } from '@/screens/not-found'
import { Protected } from '@/components/protected'
import { Branch } from '@/screens/branch'

import { ChangeGroupName } from '@/screens/profile/change-group-name'
import { Logout } from '@/screens/profile/logout'
import { Theme } from '@/screens/profile/theme'
import { Main } from '@/screens/main'
import { Info } from '@/screens/info'

export function AppRouter() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('@zaalcashback:token')

    if (isAuthenticated && pathname === '/') navigate('/main')
  }, [navigate, pathname])

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<Onboarding />} />

      <Route path="/" element={<Layout />}>
        <Route path="/ads" element={<Ads />} />
        <Route
          path="/history"
          element={
            <Protected to="/">
              <History />
            </Protected>
          }
        />

        <Route
          path="/branch"
          element={
            <Protected to="/">
              <Branch />
            </Protected>
          }
        />

        <Route
          path="/profile/theme"
          element={
            <Protected to="/">
              <Theme />
            </Protected>
          }
        />

        <Route
          path="/main"
          element={
            <Protected to="/">
              <Main />
            </Protected>
          }
        />

        <Route
          path="/info"
          element={
            <Protected to="/">
              <Info />
            </Protected>
          }
        />

        <Route
          path="/profile/change-group-name"
          element={
            <Protected to="/">
              <ChangeGroupName />
            </Protected>
          }
        />

        <Route
          path="/profile/logout"
          element={
            <Protected to="/">
              <Logout />
            </Protected>
          }
        />
      </Route>
    </Routes>
  )
}
