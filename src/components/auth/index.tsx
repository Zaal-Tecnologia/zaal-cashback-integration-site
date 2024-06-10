import { z } from 'zod'

import { useNavigate } from 'react-router-dom'
import { useToast } from '../ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@/hooks/use-mutation'
import { api } from '@/data/api'
import { Input } from '../ui/input'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'

// import { CreateFirstBranch } from './create-first-branch'

const FormSchema = z.object({
  usuario: z.string(),
  name: z.string(),
  senha: z.string(),
})

type FormInput = z.input<typeof FormSchema>

interface MutationResponse {
  token: string
}

export function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const name = localStorage.getItem('@zaalcashback:group-name')

  const { register, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name || '',
      usuario: '101',
      senha: 'HSH501BY17',
    },
  })

  const { isPending, mutate } = useMutation<MutationResponse, FormInput>(
    ['get-token-mutation'],
    async (input) => {
      const response = await api('login/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        toast({
          variant: 'error',
          title: 'Ocorreu um erro.',
          description: 'Tivemos um problema com o seu login' + response.status,
        })

        return
      }

      const json = await response.json()

      localStorage.setItem('@zaalcashback:token', json.token)
      localStorage.setItem(
        '@zaalcashback:group-name',
        input.usuario || input.usuario,
      )

      return json
    },
    () => navigate('branches'),
  )

  async function onSubmit(input: FormInput) {
    localStorage.setItem('@zaalcashback:group-name', input.name)

    mutate(input)
  }

  return (
    <div className="w-[560px] flex flex-col items-center shadow-md justify-center min-h-screen h-auto border-x border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start flex-col">
        <p className="font-secondary font-medium text-sm">1 de 1</p>

        <div className="mb-10">
          <h1 className="text-[24px] font-bold font-secondary -tracking-wide leading-[60px] mt-10">
            Faça seu login
          </h1>

          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Preencha o formulário abaixo
          </p>
        </div>

        <form action="" className="gap-5 flex flex-col">
          <Input.Root>
            <Input.Label>Código</Input.Label>
            <Input.Write
              placeholder="Seu código"
              className="placeholder:text-zinc-400 font-medium text-[13px] focus:outline-none w-full flex dark:border-zinc-600/50 h-12 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-md px-2.5 dark:bg-zinc-700/50"
              {...register('usuario')}
            />
          </Input.Root>

          <Input.Root>
            <Input.Label>Senha</Input.Label>
            <Input.Write
              placeholder="Sua senha"
              className="placeholder:text-zinc-400 font-medium text-[13px] focus:outline-none w-full flex dark:border-zinc-600/50 h-12 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-md px-2.5 dark:bg-zinc-700/50"
              {...register('senha')}
            />
          </Input.Root>

          <button
            type="submit"
            className="h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-96 rounded-md ring-2 ring-[#305a96]/50"
            onClick={handleSubmit(onSubmit)}
          >
            <p className="-tracking-wide text-[13px] font-medium text-white">
              Avançar
            </p>

            {isPending ? (
              <LoaderCircle size={20} className="text-white animate-spin" />
            ) : (
              <ArrowUpRight className="text-white" />
            )}
          </button>

          {/** <p className="text-zinc-900 dark:text-white text-sm leading-8 w-[90%]">
          Ainda não tem um empresa registrada?
        </p> */}
        </form>
      </div>
    </div>
  )
}
