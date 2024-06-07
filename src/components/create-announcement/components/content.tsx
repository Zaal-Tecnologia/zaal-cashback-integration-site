import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from '@phosphor-icons/react'
import { useContext } from 'react'

import { FormContext } from '../contexts/form'

const FormSchema = z.object({
  descricao: z.string().max(60, 'deve ter no máximo 60 caracteres.'),
  conteudo: z.string().max(250, 'deve ter no máximo 250 caracteres.'),
  cupom: z.string(),
})

export type ContentFormData = z.input<typeof FormSchema>

export function Content() {
  const { setStep, setForm, form } = useContext(FormContext)

  const { register, formState, watch, handleSubmit } = useForm<ContentFormData>(
    {
      resolver: zodResolver(FormSchema),
      defaultValues: form as ContentFormData,
    },
  )

  function onSubmit(input: ContentFormData) {
    setForm(input)

    setStep(3)
  }

  return (
    <form className="gap-3 grid" onSubmit={handleSubmit(onSubmit)}>
      <Input.Root>
        <div className="flex items-center justify-between">
          <Input.Label
            required
            errorMessage={formState.errors?.conteudo?.message}
          >
            Conteúdo
          </Input.Label>

          <span className="text-xs font-medium text-zinc-500 -tracking-wider mr-2.5">
            {watch('conteudo')?.length || 0} de 250
          </span>
        </div>

        <Input.Area
          {...register('conteudo')}
          maxLength={250}
          placeholder="Conteúdo do anúncio"
        />
      </Input.Root>

      <div className="grid grid-cols-7 gap-x-3">
        <Input.Root className="col-span-4">
          <Input.Label
            required
            errorMessage={formState.errors?.descricao?.message}
          >
            Descrição
          </Input.Label>

          <Input.Write
            {...register('descricao')}
            maxLength={60}
            placeholder="Qual a descrição do anúncio?"
          />
        </Input.Root>

        <Input.Root className="col-span-3">
          <Input.Label required errorMessage={formState.errors?.cupom?.message}>
            Cupom
          </Input.Label>

          <Input.Write {...register('cupom')} placeholder="Cupom de desconto" />
        </Input.Root>
      </div>

      <footer className="flex items-center justify-between mt-5">
        <button type="button" onClick={() => setStep(1)}>
          <ArrowLeft weight="bold" />
        </button>

        <button
          type="submit"
          className="ml-auto rounded-md h-9 bg-[#305a96] w-40 flex items-center gap-2 justify-center hover:ring-4 hover:ring-[#305a96]/20"
        >
          <p className="text-xs font-semibold text-white">Próximo</p>
        </button>
      </footer>
    </form>
  )
}
