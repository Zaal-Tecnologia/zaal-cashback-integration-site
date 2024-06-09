import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export function Branch() {
  const navigate = useNavigate()

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen p-10 flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-700"
    >
      <header className="mb-20 flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
            NOVA FILIAL
          </span>
          <div className="h-5 mx-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-sm text-zinc-500 dark:text-zinc-300 dark:font-light">
            Responda o formulário abaixo
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate(-1)}
              className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
            >
              <X size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Voltar</TooltipContent>
        </Tooltip>
      </header>

      {/** <CreateBranchForm /> */}
    </motion.div>
  )
}
