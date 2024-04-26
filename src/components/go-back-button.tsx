import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function GoBackButton() {
  const navigate = useNavigate()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => navigate(-1)}
          className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
        >
          <CaretLeft weight="bold" size={14} />
        </button>
      </TooltipTrigger>
      <TooltipContent>Voltar</TooltipContent>
    </Tooltip>
  )
}
