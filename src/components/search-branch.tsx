import { useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/data/api'

import { useToast } from './ui/use-toast'

const Schema = z.object({
  search: z.string().min(1, 'deve ter no mínimo 1 letra.'),
})

type Input = z.infer<typeof Schema>

export function SearchBranch() {
  const { toast } = useToast()

  const { register, handleSubmit, formState } = useForm<Input>({
    resolver: zodResolver(Schema),
  })

  const queryClient = useQueryClient()

  async function onSearch(input: Input) {
    try {
      const response = await api(`filiais?filtro=${input.search}`)

      const json = await response.json()

      queryClient.setQueryData(['GET-ALL-BRANCHES-QUERY'], () => {
        return {
          pages: [json],
          pageParams: [0],
        }
      })
    } catch {
      toast({
        title: 'Nenhuma filial encontrado.',
        description: 'Não encontramos nenhuma filial com o nome' + input.search,
        variant: 'error',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      data-error={!!formState.errors.search?.message}
      className="data-[error=true]:ring-4 data-[error=true]:ring-red-200/50 data-[error=true]:border-red-500 flex ml-5 w-56 border rounded-md items-center bg-zinc-50 dark:bg-zinc-700/50 focus-within:ring-4 focus-within:border-[#305a96] focus-within:ring-[#305a96]/20 focus-within:hover:bg-zinc-100/50 focus-within:bg-zinc-100/50 dark:focus-within:hover:bg-zinc-700/50 dark:focus-within:bg-zinc-700/50 h-8 outline-none text-xs font-medium px-2 placeholder:text-zinc-500 placeholder:text-[11px]"
    >
      <Search size={16} className="font-black" />
      <input
        type="text"
        className="h-[28px] w-full outline-none border-inherit pl-2 bg-zinc-50 dark:bg-zinc-700/10 placeholder:italic"
        placeholder="Pesquise por filial"
        {...register('search')}
      />

      <button type="submit" className="opacity-0 invisible"></button>
    </form>
  )
}
