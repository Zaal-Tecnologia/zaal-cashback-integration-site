import { ArrowLeft } from '@phosphor-icons/react'

import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormContext } from '../contexts/form'
import { useContext } from 'react'

const FormSchema = z.object({
  razao: z.string(),
  fantasia: z.string(),
  descricao: z.string(),
  categoria: z.string(),
})

export type FormInput = z.input<typeof FormSchema>

export function Info() {
  const { setStep, setForm, form } = useContext(FormContext)

  const { register, formState, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: form as FormInput,
    /** defaultValues: {
      categoria: 'Tecnologia e comunicações',
      descricao: 'Empresa de tecnologia e comunicações do ramo de educação.',
      fantasia: 'Circles',
      razao: 'Circles',
    }, */
  })

  function onSubmit(input: FormInput) {
    setForm(input)

    setStep(3)
  }

  return (
    <form
      className="grid grid-cols-2 gap-2.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input.Root>
        <Input.Label errorMessage={formState.errors.razao?.message}>
          Nome razão
        </Input.Label>
        <Input.Write placeholder="Digite o nome razão" {...register('razao')} />
      </Input.Root>

      <Input.Root>
        <Input.Label errorMessage={formState.errors.fantasia?.message}>
          Nome fantasia
        </Input.Label>
        <Input.Write
          placeholder="Digite a categoria"
          {...register('fantasia')}
        />
      </Input.Root>

      <Input.Root>
        <Input.Label errorMessage={formState.errors.categoria?.message}>
          Categoria
        </Input.Label>
        <Input.Write
          placeholder="Digite a categoria"
          {...register('categoria')}
        />
      </Input.Root>

      <Input.Root>
        <Input.Label errorMessage={formState.errors.descricao?.message}>
          Descrição
        </Input.Label>
        <Input.Write
          placeholder="Digite a descrição"
          {...register('descricao')}
        />
      </Input.Root>

      <footer className="flex items-center col-span-2 justify-between mt-5">
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
