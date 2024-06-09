import { Input } from '@/components/ui/input'
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormContext } from '../contexts/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { client } from '@/App'
import { api } from '@/data/api'
import { useMutation } from '@/hooks/use-mutation'
import { useToast } from '@/components/ui/use-toast'
import { ieLength } from '@/utils/ie'

const FormSchema = z.object({
  cnpj: z.string(),
  inscest: z.string(),
})

export type FormInput = z.input<typeof FormSchema>

type FormPayload = {
  endereco: {
    cep: string
    bairro: string
    numero: string
    complemento: string
    logradouro: string
    pais: string
    cidadeId: number
  }
  razao: string
  fantasia: string
  descricao: string
  categoria: string
  cnpj: string
  inscest: string
}

export function Documents() {
  const { toast } = useToast()

  const { setForm, form, setOpen, state, setStep } = useContext(FormContext)

  const content = form as FormPayload

  const { register, formState, reset, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: form as FormInput,
  })

  async function getCity(name: string) {
    const response = await api(`cidades?descricao=${name.trim()}`)

    const json = await response.json()

    const city = json.content[0]

    return city ? city.id : null
  }

  async function createBranchImage(branchId: string) {
    const base64 = form ? (form as { image: string }).image : ''

    const response = await api(`filiais/${branchId}/logo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64 }),
    })

    const json = await response.json()

    return json.id
  }

  const { isPending, mutate } = useMutation(
    ['CREATE-BRANCH-MUTATION'],
    async (input) => {
      const response = await api('filiais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const json = await response.json()

      return json
    },
    async (data) => {
      await client
        .invalidateQueries({
          queryKey: ['get-all-branches-query'],
        })
        .then(() => {
          createBranchImage(data.id).then(() => {
            toast({
              title: 'Criado com sucesso',
              description: 'Sua filial foi criada com sucesso.',
            })

            reset()

            setForm(null)

            setOpen(false)
          })
        })
    },
    (error) => toast({ title: 'Ocorreu um erro', description: error.message }),
  )

  async function onSubmit(input: FormInput) {
    const city = content.endereco.logradouro.split(',')[1]

    await getCity(city).then((cidadeId) => {
      mutate({
        cnpj: input.cnpj,
        inscest: input.inscest,
        razao: content.razao,
        fantasia: content.fantasia,
        descricao: content.descricao,
        categoria: content.categoria,
        endereco: {
          cep: content.endereco.cep,
          bairro: content.endereco.bairro,
          numero: content.endereco.numero,
          complemento: content.endereco.complemento,
          logradouro: content.endereco.logradouro,
          cidadeId,
          pais: content.endereco.pais,
        },
      })
    })

    // setStep(3)
  }

  return (
    <form
      className="grid grid-cols-2 gap-2.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input.Root>
        <Input.Label errorMessage={formState.errors.cnpj?.message}>
          CNPJ
        </Input.Label>
        <Input.Write placeholder="CNPJ da filial" {...register('cnpj')} />
      </Input.Root>

      <Input.Root>
        <Input.Label errorMessage={formState.errors.inscest?.message}>
          Inscrição estadual
        </Input.Label>
        <Input.Write
          placeholder="Digite a inscrição estadual"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          maxLength={ieLength[state] || 0}
          {...register('inscest')}
        />
      </Input.Root>

      <footer className="flex items-center justify-between mt-5 col-span-2">
        <button type="button" onClick={() => setStep(3)}>
          <ArrowLeft />
        </button>

        <button
          type="submit"
          className="group relative disabled:opacity-70 disabled:cursor-not-allowed ml-auto rounded-md h-9 bg-[#305a96] w-40 flex items-center gap-2 justify-center hover:ring-4 hover:ring-[#305a96]/20"
        >
          {isPending ? (
            <div className="absolute top-1/2 translate-x-4 left-0 -translate-y-1/2">
              <LoaderCircle className="text-white animate-spin" />
            </div>
          ) : (
            <Check
              size={14}
              className="transition-all duration-300 text-xs font-semibold absolute top-1/2 opacity-0 group-hover:opacity-100 -translate-y-1/2 group-hover:translate-x-4 text-white left-0"
            />
          )}

          <p className="text-xs font-semibold text-white">Concluir</p>
        </button>
      </footer>
    </form>
  )
}
