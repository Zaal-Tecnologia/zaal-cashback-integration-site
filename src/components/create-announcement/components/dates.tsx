import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleNotch,
} from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useContext, useState } from 'react'

import { FormContext } from '../contexts/form'

import { CalendarArrowUpSVG } from '@/components/svgs/calendar-arrow-up-svg'
import { CalendarArrowDownSVG } from '@/components/svgs/calendar-arrow-down-svg'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

import { useMutation } from '@/hooks/use-mutation'

import { api } from '@/data/api'
import { useQueryClient } from '@tanstack/react-query'

type SelectedDate = {
  dueDate: Date | undefined
  startDate: Date | undefined
}

export function Dates() {
  const { setStep, form, setForm, setOpen, updateId } = useContext(FormContext)

  const { toast } = useToast()

  const [date, setDate] = useState<SelectedDate>({
    dueDate: undefined,
    startDate: undefined,
  })

  const { setQueryData } = useQueryClient()

  const { mutate, isPending } = useMutation(
    ['CREATE-ADS-MUTATION', String(updateId)],
    async (input) => {
      const response = await api(
        updateId ? `anuncios/${updateId}` : 'anuncios',
        {
          method: updateId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        },
      )

      if (!response.ok) {
        toast({
          variant: 'error',
          title: 'Erro ao criar anúncio',
          description:
            'Ocorreu um erro ao criar o seu anúncio, verifique tudo e tente novamente.',
        })

        return null
      }
    },
    (_, variables) => {
      setQueryData(['GET-ADDS-QUERY'], (cached: []) => {
        return [
          ...cached,
          {
            ...(variables as object),
            id: crypto.randomUUID(),
          },
        ]
      })

      toast({
        title: 'Criado',
        description: 'Anúncio criado com sucesso.',
        variant: 'success',
      })

      setForm(null)

      setStep(1)

      setOpen(false)
    },
  )

  async function handleConclude() {
    mutate(form)
  }

  return (
    <>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-start flex-1 text-[13px] focus:outline-none dark:border-zinc-600/50 h-8 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-lg px-2.5 dark:bg-zinc-700/50">
              <CalendarArrowUpSVG />

              <p
                data-fill={!!date.startDate}
                className="data-[fill=true]:text-zinc-900 text-zinc-400 font-medium ml-2.5"
              >
                {date.startDate
                  ? dayjs(date.startDate).format('DD/MM/YYYY')
                  : 'Data de início'}
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date.startDate}
              onSelect={(date) =>
                setDate((prev) => ({ ...prev, startDate: date! }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <ArrowRight size={14} weight="bold" className="mx-2.5" />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-start flex-1 text-[13px] focus:outline-none dark:border-zinc-600/50 h-8 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-lg px-2.5 dark:bg-zinc-700/50">
              <CalendarArrowDownSVG />

              <p
                data-fill={!!date.dueDate}
                className="data-[fill=true]:text-zinc-900 text-zinc-400 font-medium ml-2.5"
              >
                {date.dueDate
                  ? dayjs(date.dueDate).format('DD/MM/YYYY')
                  : 'Data de vencimento'}
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date.dueDate}
              onSelect={(date) =>
                setDate((prev) => ({ ...prev, dueDate: date }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <footer className="flex items-center justify-between mt-5">
        <button type="button" onClick={() => setStep(3)}>
          <ArrowLeft weight="bold" />
        </button>

        <button
          onClick={handleConclude}
          disabled={!date.dueDate || !date.startDate}
          className="group relative disabled:opacity-70 disabled:cursor-not-allowed ml-auto rounded-md h-9 bg-[#305a96] w-40 flex items-center gap-2 justify-center hover:ring-4 hover:ring-[#305a96]/20"
        >
          {isPending ? (
            <div className="absolute top-1/2 translate-x-4 left-0 -translate-y-1/2">
              <CircleNotch className="text-white animate-spin" weight="bold" />
            </div>
          ) : (
            <Check
              weight="bold"
              size={14}
              className="transition-all duration-300 text-xs font-semibold absolute top-1/2 opacity-0 group-hover:opacity-100 -translate-y-1/2 group-hover:translate-x-4 text-white left-0"
            />
          )}

          <p className="text-xs font-semibold text-white">Concluir</p>
        </button>
      </footer>
    </>
  )
}
