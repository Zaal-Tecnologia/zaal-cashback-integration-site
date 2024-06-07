import { Input } from '@/components/ui/input'
import { ArrowLeft, Check, CircleNotch, Warning } from '@phosphor-icons/react'
import { useContext, useState } from 'react'
import { FormContext } from '../contexts/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import cep from 'cep-promise'
import { useToast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  endereco: z.object({
    cep: z.string(),
    bairro: z.string(),
    numero: z.string(),
    complemento: z.string(),
    logradouro: z.string(),
    pais: z.string(),
  }),
})

export type FormInput = z.input<typeof FormSchema>

const ZIP_CODE_COMPONENTS = {
  LOADING: <CircleNotch className="animate-spin" />,
  SLEEP: null,
  ERROR: (
    <Tooltip>
      <TooltipTrigger asChild>
        <Warning weight="bold" className="text-red-500" />
      </TooltipTrigger>
      <TooltipContent asChild>
        <p className="text-xs">Ocorreu um erro ao buscar o CEP.</p>
      </TooltipContent>
    </Tooltip>
  ),
  SUCCESS: (
    <Tooltip>
      <TooltipTrigger asChild>
        <Check weight="bold" className="text-green-500" />
      </TooltipTrigger>
      <TooltipContent asChild>
        <p className="text-xs">Seu CEP é válido.</p>
      </TooltipContent>
    </Tooltip>
  ),
} as const

export function Address() {
  const { setStep, setForm, form, setState } = useContext(FormContext)

  const { register, formState, handleSubmit, setValue } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    /** defaultValues: {
      endereco: {
        complemento: 'Atrás do mercado',
        numero: '97',
      },
    }, */
    defaultValues: form as FormInput,
  })

  const { toast } = useToast()

  function onSubmit(input: FormInput) {
    setForm(input)

    setStep(4)
  }

  const [zipCodeStatus, setZipCodeStatus] =
    useState<keyof typeof ZIP_CODE_COMPONENTS>('SLEEP')

  // o state é usado para a inscrição estadual lá em documentos

  async function getZipCodeInfo(value: string) {
    if (value.length === 8) {
      setZipCodeStatus('LOADING')

      cep(value)
        .then((data) => {
          setState(data.state)

          setValue('endereco.cep', value)
          setValue('endereco.bairro', data.neighborhood)
          setValue(
            'endereco.logradouro',
            `${data.state}, ${data.city}, ${data.street}`,
          )
          setValue('endereco.pais', 'Brasil')

          setZipCodeStatus('SUCCESS')
        })
        .catch(() => {
          setZipCodeStatus('ERROR')

          toast({
            title: 'Erro no CEP',
            description:
              'Ocorreu um erro ao carregar seu CEP, preencha os campos manualmente.',
            variant: 'error',
            onEnded() {
              setZipCodeStatus('SLEEP')
            },
          })
        })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-2.5"
    >
      <Input.Root>
        <Input.Label>CEP</Input.Label>
        <div className="relative">
          <Input.Write
            placeholder="CEP da filial"
            maxLength={8}
            onChange={(e) => getZipCodeInfo(e.target.value)}
          />

          <div className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center">
            {ZIP_CODE_COMPONENTS[zipCodeStatus]}
          </div>
        </div>
      </Input.Root>

      <Input.Root>
        <Input.Label
          errorMessage={formState.errors.endereco?.complemento?.message}
        >
          Complemento
        </Input.Label>
        <Input.Write
          placeholder="Digite o complemento"
          {...register('endereco.complemento')}
        />
      </Input.Root>

      <Input.Root>
        <Input.Label errorMessage={formState.errors.endereco?.numero?.message}>
          Número
        </Input.Label>
        <Input.Write
          placeholder="Digite o número"
          {...register('endereco.numero')}
        />
      </Input.Root>

      <footer className="flex items-center justify-between mt-5 col-span-2">
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
