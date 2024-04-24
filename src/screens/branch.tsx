import { CreateBranchForm } from '@/components/create-branch-form'
import { X } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export function Branch() {
  const navigate = useNavigate()

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen p-10 flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-800"
    >
      <header className="mb-20 flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
            CRIE UMA FILIAL
          </span>
          <div className="h-5 mx-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-sm text-zinc-500 dark:text-zinc-300 dark:font-light">
            Responda o formulário abaixo
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300 font-urbanist"
        >
          <X />
        </button>
      </header>

      <CreateBranchForm />
    </motion.div>
  )
}
