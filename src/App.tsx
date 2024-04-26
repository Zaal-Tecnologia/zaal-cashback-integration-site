import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppRouter } from './routes'
import { TooltipProvider } from './components/ui/tooltip'
import { useEffect } from 'react'

export const client = new QueryClient()

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('@zaalcashback:theme')

    const doc = document.documentElement

    if (theme === 'dark') doc.classList.add('dark')
  }, [])

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
