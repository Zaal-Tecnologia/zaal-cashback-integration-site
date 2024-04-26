import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppRouter } from './routes'
import { TooltipProvider } from './components/ui/tooltip'

export const client = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
