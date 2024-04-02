import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowUpRight, CircleNotch } from '@phosphor-icons/react'

import { useMutation } from '../../hooks/use-mutation'

import { Input } from '../ui/input'

import { useStep } from '../../contexts/step'

const FormSchema = z.object({
  usuario: z.string(),
  senha: z.string(),
})

type FormInput = z.input<typeof FormSchema>

interface MutationResponse {
  token: string
}

export function CreateGroupForm() {
  const { setStep } = useStep()

  const { register, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usuario: '101',
      senha: 'HSH501BY17',
    },
  })

  const { isPending, mutate } = useMutation<MutationResponse, FormInput>(
    ['get-token-mutation'],
    async (input) => {
      const response = await fetch('/api/v1/login/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) console.log(response.status)

      const json = await response.json()

      localStorage.setItem('@zaalcashback:token', json.token)

      setStep(1)

      return json
    },
  )

  async function onSubmit(input: FormInput) {
    mutate(input)
  }

  return (
    <div className="flex items-start flex-col">
      <p className="text-zinc-700 font-secondary font-medium text-sm">1 de 2</p>

      <div className="mb-10">
        <h1 className="text-[24px] font-bold font-secondary text-zinc-700 -tracking-wide leading-[60px] mt-10">
          Faça seu login
        </h1>

        <p className="text-zinc-700 text-sm">Preencha o formulário abaixo</p>
      </div>

      <form action="" className="gap-5 flex flex-col">
        <Input.Root>
          <Input.Label>Código</Input.Label>
          <Input.Write placeholder="Seu código" {...register('usuario')} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Senha</Input.Label>
          <Input.Write placeholder="Sua senha" {...register('senha')} />
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
            <CircleNotch
              weight="bold"
              size={20}
              className="text-white animate-spin"
            />
          ) : (
            <ArrowUpRight weight="bold" className="text-white" />
          )}
        </button>
      </form>
    </div>
  )
}
