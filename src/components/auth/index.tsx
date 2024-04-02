import { useStep } from '../../contexts/step'

import { CreateFirstBranch } from './create-first-branch'
import { CreateGroupForm } from './create-group-form'

const COMPONENTS = {
  0: <CreateGroupForm />,
  1: <CreateFirstBranch />,
}

export function Auth() {
  const { step } = useStep()

  return (
    <div className="w-[560px] flex flex-col items-center shadow-md justify-center min-h-screen h-auto border-x border-zinc-200 bg-white">
      {COMPONENTS[step]}
    </div>
  )
}
