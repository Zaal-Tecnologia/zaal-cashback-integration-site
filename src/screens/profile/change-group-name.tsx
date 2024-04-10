import { motion } from 'framer-motion'
import { FormEvent, useRef } from 'react'

import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export function ChangeGroupName() {
  const name = localStorage.getItem('@zaalcashback:group-name')

  const ref = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  function onSubmit(e: FormEvent) {
    e.preventDefault()

    if (ref.current) {
      localStorage.setItem('@zaalcashback:group-name', ref.current.value)

      toast({
        title: 'Alterado',
        description: `Alterado de ${name} para ${ref.current.value}.`,
      })
    }
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="flex items-start flex-col relative px-10"
    >
      <header className="mt-10 mb-12 flex flex-col items-start">
        <h1 className="font-bold text-2xl -tracking-wide font-urbanist">
          Alterar o nome do grupo
        </h1>
        <span className="text-[13px] text-zinc-700 mt-2.5">
          Altere o nome do grupo, preencha o campo abaixo.
        </span>
      </header>

      <form
        action=""
        onSubmit={onSubmit}
        className="flex items-end w-full gap-2.5"
      >
        <Input.Root>
          <Input.Label>Nome do grupo</Input.Label>
          <Input.Write
            ref={ref}
            placeholder="Altere o nome do grupo"
            defaultValue={name || ''}
          />
        </Input.Root>

        <button
          type="submit"
          className="flex items-center justify-center h-12 ring-4 ring-[#305a96]/50 rounded-md w-44 bg-[#305a96]"
        >
          <span className="text-xs font-medium text-white">Confirmar</span>
        </button>
      </form>
    </motion.div>
  )
}
