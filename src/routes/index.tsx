import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { Onboarding } from '@/screens/onboarding'
import { Ads } from '@/screens/ads'

import { Layout } from '@/components/layout'
import { NotFound } from '@/screens/not-found'
import { Protected } from '@/components/protected'
import { Branch } from '@/screens/branch'

import { ChangeGroupName } from '@/screens/profile/change-group-name'
import { Logout } from '@/screens/profile/logout'
import { Branches } from '@/screens/branches'

export function AppRouter() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('@zaalcashback:token')

    if (isAuthenticated && pathname === '/') navigate('/branches')
  }, [navigate, pathname])

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<Onboarding />} />

      <Route path="/" element={<Layout />}>
        <Route path="/ads" element={<Ads />} />
        <Route path="/branches" element={<Branches />} />

        <Route
          path="/branch"
          element={
            <Protected to="/">
              <Branch />
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
