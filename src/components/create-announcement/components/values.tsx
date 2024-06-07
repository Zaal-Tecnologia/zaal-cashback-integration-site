import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from '@phosphor-icons/react'
import { useContext, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { FormContext } from '../contexts/form'

const FormSchema = z.object({
  tipoDesconto: z.enum(['PORCENTAGEM', 'VALOR']),
  valorDesconto: z.number({
    required_error: 'é obrigarório',
    invalid_type_error: 'é obrigarório',
  }),
  valorMinimo: z.number({
    required_error: 'é obrigarório',
    invalid_type_error: 'é obrigarório',
  }),
  valorMaximo: z.number({
    required_error: 'é obrigarório',
    invalid_type_error: 'é obrigarório',
  }),
})

export type ValuesFormData = z.input<typeof FormSchema>

export function Values() {
  const { setForm, setStep, form } = useContext(FormContext)

  const { register, formState, watch, setValue, handleSubmit } =
    useForm<ValuesFormData>({
      resolver: zodResolver(FormSchema),
      defaultValues: form as ValuesFormData,
    })

  function onSubmit(input: ValuesFormData) {
    setForm(input)

    setStep(4)
  }

  useEffect(() => {
    setValue('tipoDesconto', 'PORCENTAGEM')
  }, [setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 flex items-center justify-between bg-zinc-100 p-5 rounded-md dark:bg-zinc-700/50">
          <div className="flex flex-col">
            <span className="font-medium text-[13px]">
              Desconto em porcentagem
            </span>
            <span className="text-[11px] text-zinc-500 font-medium dark:text-zinc-400">
              Ao fazer isso o valor do desconto vai ser feito por porcentagem
            </span>
          </div>

          <Switch
            onChecked={(e) =>
              setValue('tipoDesconto', e ? 'PORCENTAGEM' : 'VALOR')
            }
            checked={watch('tipoDesconto') === 'PORCENTAGEM'}
          />
        </div>

        <Input.Root>
          <Input.Label
            required
            errorMessage={formState.errors?.valorMinimo?.message}
          >
            Valor mínimo • R$
          </Input.Label>

          <Input.Write
            type="number"
            placeholder="Valor mínimo"
            {...register('valorMinimo', { valueAsNumber: true })}
          />
        </Input.Root>

        <Input.Root>
          <Input.Label
            required
            errorMessage={formState.errors?.valorMaximo?.message}
          >
            Valor máximo • R$
          </Input.Label>

          <Input.Write
            type="number"
            placeholder="Valor máximo"
            {...register('valorMaximo', { valueAsNumber: true })}
          />
        </Input.Root>

        <Input.Root>
          <Input.Label
            required
            errorMessage={formState.errors?.valorDesconto?.message}
          >
            Valor do desconto • {watch('tipoDesconto') === 'VALOR' ? 'R$' : '%'}
          </Input.Label>

          <Input.Write
            type="number"
            placeholder="Valor do desconto"
            {...register('valorDesconto', { valueAsNumber: true })}
          />
        </Input.Root>
      </div>

      <footer className="flex items-center justify-between mt-5">
        <button type="button" onClick={() => setStep(2)}>
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
