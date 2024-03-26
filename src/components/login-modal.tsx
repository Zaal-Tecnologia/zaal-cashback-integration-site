import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Key, Lock } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import md5 from 'md5'

const FormSchema = z.object({
  usuario: z.string(),
  senha: z.string(),
})

type FormInput = z.input<typeof FormSchema>

export function LoginModal() {
  const { register, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usuario: '101',
      senha: 'HSH501BY17',
    },
  })

  async function onSubmit(input: FormInput) {
    input.senha = md5(input.senha)
    console.log('input', input)

    try {
      const response = await fetch(
        'https://zaal.no-ip:8083/api/v1/login/empresa',
        {
          method: 'POST',
          body: JSON.stringify(input),
          headers: { 'Content-Type': 'application/json' },
        },
      )

      if (!response.ok) console.log(response.status)

      const json = await response.json()

      console.log('json', json)
    } catch (error) {
      console.log(error)
    }

    // window.localStorage.setItem('@zaal-cashback:auth-state', 'true')
  }

  return (
    <div className="h-screen w-screen backdrop-blur-lg fixed inset-0 z-20">
      <div className="h-screen w-screen items-center justify-center flex">
        <form className="bg-white flex gap-5 flex-col rounded-md border items-center justify-center p-8 shadow-lg max-w-[500px]">
          <img
            src="/logo-cashback.png"
            alt=""
            className="w-[350px] h-[140px]"
          />

          <h3 className="-tracking-wide text-2xl">
            Entre com as suas credenciais
          </h3>

          <p className="-tracking-wide text-sm text-zinc-500 w-96 text-center">
            Anuncie seus produtos aqui, envie fotos, texto e cashback, tenha
            acesso a até 5 anúncios.
          </p>

          <fieldset className="flex flex-col">
            <label htmlFor="" className="text-xs">
              Código
            </label>

            <div className="mt-1 h-[50px] w-96 rounded-md bg-zinc-100/50 px-2.5 flex items-center gap-3 border-2 border-zinc-200 focus-within:border-[#305a96]">
              <Key size={20} />
              <input
                {...register('usuario')}
                type="text"
                placeholder="Digite o código do grupo"
                className="text-[13px] font-medium focus:outline-none flex flex-1 bg-zinc-100/30 h-full"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="" className="text-xs">
              Senha
            </label>

            <div className="mt-1 h-[50px] w-96 rounded-md bg-zinc-100/50 px-2.5 flex items-center gap-3 border-2 border-zinc-200 focus-within:border-[#305a96]">
              <Lock size={20} />
              <input
                {...register('senha')}
                type="password"
                placeholder="Digite a sua senha"
                className="text-[13px] font-medium focus:outline-none flex flex-1 bg-zinc-100/30 h-full"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-96 rounded-md ring-2 ring-[#305a96]/50"
            onClick={handleSubmit(onSubmit)}
          >
            <p className="-tracking-wide text-[13px] font-medium text-white">
              Entrar no app
            </p>

            <ArrowUpRight weight="bold" className="text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}
