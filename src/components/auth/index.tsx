import { useStep } from '../../contexts/step'

// import { CreateFirstBranch } from './create-first-branch'
import { CreateGroupForm } from './create-group-form'

const COMPONENTS = [<CreateGroupForm key={0} />]

export function Auth() {
  const { step } = useStep()

  return (
    <div className="w-[560px] flex flex-col items-center shadow-md justify-center min-h-screen h-auto border-x border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      {COMPONENTS[step]}
    </div>
  )
}
