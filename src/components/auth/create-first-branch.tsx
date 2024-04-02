import { ArrowLeft } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { useStep } from '../../contexts/step'

import { CreateBranchForm } from '../create-branch-form'

export function CreateFirstBranch() {
  const { setStep } = useStep()
  const navigate = useNavigate()

  function handleGoBack() {
    localStorage.removeItem('@zaalcashback:token')

    setStep(0)
  }

  return (
    <motion.div
      initial={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: 'tween' }}
      className="flex flex-col relative w-full px-20"
    >
      <div className="flex absolute -top-32 items-center space-x-5">
        <button className="items-end justify-start flex" onClick={handleGoBack}>
          <ArrowLeft size={16} weight="bold" />
        </button>

        <div className="h-10 rounded-full items-center flex justify-center px-5 bg-green-200/50">
          <p className="text-green-700 font-medium text-xs">Autorizado</p>
        </div>
      </div>

      <p className="text-zinc-700 font-secondary font-medium text-sm">2 de 2</p>

      <div className="my-10">
        <h1 className="text-[24px] font-bold font-secondary text-zinc-700 -tracking-wide">
          Crie um filial
        </h1>

        <p className="text-zinc-700 text-sm">
          Crie uma filial e comece a anunciar
        </p>
      </div>

      <CreateBranchForm onEnd={() => navigate('ads')} />
    </motion.div>
  )
}
