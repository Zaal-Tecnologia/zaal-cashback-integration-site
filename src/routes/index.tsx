import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Onboarding } from '@/screens/onboarding'
import { Ads } from '@/screens/ads'
import { History } from '@/screens/history'

import { Layout } from '@/components/layout'
import { NotFound } from '@/screens/not-found'
import { Protected } from '@/components/protected'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Onboarding />} />

        <Route path="/" element={<Layout />}>
          <Route
            path="/ads"
            element={
              <Protected to="/">
                <Ads />
              </Protected>
            }
          />
          <Route
            path="/history"
            element={
              <Protected to="/">
                <History />
              </Protected>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
