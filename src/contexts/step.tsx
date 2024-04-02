import { ReactNode, createContext, useContext, useState } from 'react'

interface StepContextData {
  step: number
  setStep(step: number): void
}

const StepContext = createContext({} as StepContextData)

export function StepProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(() => {
    const storage = localStorage.getItem('@zaalcashback:token')

    return !storage ? 0 : 1
  })

  return (
    <StepContext.Provider value={{ step, setStep }}>
      {children}
    </StepContext.Provider>
  )
}

export const useStep = () => useContext(StepContext)
