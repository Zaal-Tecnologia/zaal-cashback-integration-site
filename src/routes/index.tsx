import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Onboarding } from '@/screens/onboarding'
import { Ads } from '@/screens/ads'
import { History } from '@/screens/history'

import { Layout } from '@/components/layout'
import { NotFound } from '@/screens/not-found'
import { Protected } from '@/components/protected'
import { Branch } from '@/screens/branch'

import { ChangeGroupName } from '@/screens/profile/change-group-name'
import { Logout } from '@/screens/profile/logout'

export function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
