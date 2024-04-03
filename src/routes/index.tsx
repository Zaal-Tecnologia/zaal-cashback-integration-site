import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Onboarding } from '@/screens/onboarding'
import { Ads } from '@/screens/ads'
import { History } from '@/screens/history'

import { Layout } from '@/components/layout'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />

        <Route path="/" element={<Layout />}>
          <Route path="/ads" element={<Ads />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
