import { ChangeEvent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  ArrowUpRight,
  Check,
  CheckCircle,
  CircleNotch,
  Dot,
  ImagesSquare as IconImage,
  Trash,
  Warning,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import cep from 'cep-promise'

import { api } from '@/data/api'

import { useMutation } from '@/hooks/use-mutation'

import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { client } from '@/App'
import { ieLength } from '@/utils/ie'

const FormSchema = z.object({
  cnpj: z.string(),
  inscest: z.string(),
  razao: z.string(),
  fantasia: z.string(),
  descricao: z.string(),
  categoria: z.string(),
  endereco: z.object({
    cep: z.string(),
    bairro: z.string(),
    numero: z.string(),
    complemento: z.string(),
    logradouro: z.string(),
    pais: z.string(),
  }),
})

type FormInput = z.input<typeof FormSchema>
type CreateBranchResponse = { id: string }

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

export function CreateBranchForm() {
  const { register, handleSubmit, setValue, formState } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // cnpj: '80853473000170',
      // inscest: '66562778',
    },
  })

  const { toast } = useToast()

  const [image, setImage] = useState<string | null>(null)
  const [errorsInTheImage, setErrorsInTheImage] = useState<string[]>([])

  async function getCity(name: string) {
    const response = await api(`cidades?descricao=${name.trim()}`)

    const json = await response.json()

    const city = json.content[0]

    return city ? city.id : null
  }

  async function createBranchImage(branchId: string) {
    const response = await api(`filiais/${branchId}/logo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64: image }),
    })

    const json = await response.json()

    return json.id
  }

  const { isPending, mutate } = useMutation<CreateBranchResponse, FormInput>(
    ['create-branch-mutation'],
    async (input) => {
      const response = await api('filiais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          createBranchImage(data.id).then(() =>
            toast({
              title: 'Criado com sucesso',
              description: 'Sua filial foi criada com sucesso.',
            }),
          )
        })
    },
    (error) => toast({ title: 'Ocorreu um erro', description: error.message }),
  )

  async function onSubmit(input: FormInput) {
    const city = input.endereco.logradouro.split(',')[1]

    const cidadeId = await getCity(city)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    input.endereco.cidadeId = cidadeId

    console.log(input)

    mutate(input)
  }

  const handleSelectBranchImage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event && event.target.files) {
        const file = event.target.files[0]

        if (file) {
          const reader = new FileReader()

          reader.onload = (event) => {
            const image = new Image()

            if (event.target && event.target.result) {
              image.src = String(event.target.result)

              image.onload = () => {
                const width = image.width
                const height = image.height

                const isSmaller = width < 100 && height < 100
                const isBigger = width > 400 && height > 400
                const itHasADifferentHeightAndWidth = width !== height

                if (file.type !== 'image/png') {
                  setErrorsInTheImage((prev) => [...prev, 'Ter formato PNG'])
                }

                if (isSmaller || isBigger) {
                  setErrorsInTheImage((prev) => [
                    ...prev,
                    'Estar entre 100x100 e 400x400',
                  ])
                }

                if (itHasADifferentHeightAndWidth) {
                  setErrorsInTheImage((prev) => [...prev, 'Ter lados iguais'])
                }

                setImage(String(event.target!.result))
              }

              setImage(String(event.target.result))
            }
          }

          reader.readAsDataURL(file)
        }
      }
    },
    [],
  )

  function onRemoveImage() {
    setImage(null)

    setErrorsInTheImage([])
  }

  const [zipCodeStatus, setZipCodeStatus] =
    useState<keyof typeof ZIP_CODE_COMPONENTS>('SLEEP')

  const [state, setState] = useState('')

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

  const showTheFormAfterValidatingTheImage =
    image && errorsInTheImage.length === 0

  return (
    <div className="w-full pb-32">
      <form
        action="grid grid-cols-2 relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-start gap-7">
          <div className="relative cursor-pointer p-5 rounded-md mb-5 dark:border-zinc-700 dark:hover:border-zinc-600 hover:border-zinc-900 transition-all duration-500 flex items-center justify-center h-[200px] w-[200px] group border border-dashed dark:bg-zinc-800/50">
            <input
              type="file"
              className="opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleSelectBranchImage}
            />

            {image ? (
              <img src={image} alt="" className="h-[100px] w-[100px]" />
            ) : (
              <IconImage
                size={24}
                weight="duotone"
                className="group-hover:scale-110 transition-all duration-500"
                alt=""
              />
            )}
          </div>

          <div className="flex flex-col gap-x-5">
            <ul className="mt-1.5 mb-2">
              <span className="text-xs font-medium block mb-5">
                Regras para a imagem da filial
              </span>

              {[
                'Ter formato PNG',
                'Estar entre 100x100 e 400x400',
                'Ter lados iguais',
              ].map((rule) => (
                <li key={rule} className="flex items-center gap-x-2 mb-2.5">
                  <div className="w-5 flex items-center justify-center">
                    {errorsInTheImage.find((error) => error === rule) ? (
                      <X className="text-red-500" />
                    ) : (
                      <Dot size={20} />
                    )}
                  </div>

                  <span className="text-xs">{rule}</span>
                </li>
              ))}
            </ul>

            {image ? (
              <footer
                data-background={errorsInTheImage.length === 0}
                className="flex data-[background=true]:bg-[#305a96]/10 data-[background=false]:bg-red-500/10 py-2.5 data-[background=false]:pl-2.5 data-[background=false]:pr-5 rounded-full items-center justify-center gap-x-5"
              >
                {errorsInTheImage.length === 0 ? (
                  <div className="flex items-center justify-center gap-x-1">
                    <CheckCircle weight="bold" className="text-[#305a96]" />
                    <span className="text-xs font-medium text-[#305a96]">
                      Requisitos atendidos
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={onRemoveImage}
                      className="bg-red-500 h-8 w-24 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-red-500/90"
                    >
                      <Trash weight="bold" className="text-white" />
                      <span className="text-xs text-white ml-1">Remover</span>
                    </button>

                    <div className="flex items-center justify-center gap-x-1">
                      <XCircle weight="bold" className="text-red-500" />
                      <span className="text-xs font-medium text-red-500">
                        Ocorreu um erro
                      </span>
                    </div>
                  </>
                )}
              </footer>
            ) : null}
          </div>
        </div>

        {showTheFormAfterValidatingTheImage ? (
          <>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Nome, categoria & descrição
                </span>
              </div>

              <Input.Root>
                <Input.Label errorMessage={formState.errors.razao?.message}>
                  Nome razão
                </Input.Label>
                <Input.Write
                  placeholder="Digite o nome razão"
                  {...register('razao')}
                />
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

              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Endereço
                </span>
              </div>

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
                <Input.Label
                  errorMessage={formState.errors.endereco?.numero?.message}
                >
                  Número
                </Input.Label>
                <Input.Write
                  placeholder="Digite o número"
                  {...register('endereco.numero')}
                />
              </Input.Root>

              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Documentos
                </span>
              </div>

              <Input.Root>
                <Input.Label errorMessage={formState.errors.cnpj?.message}>
                  CNPJ
                </Input.Label>
                <Input.Write
                  // mask="99.999.999/9999-99"
                  placeholder="CNPJ da filial"
                  {...register('cnpj')}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label errorMessage={formState.errors.inscest?.message}>
                  Inscrição estadual
                </Input.Label>
                <Input.Write
                  // mask="99.999.999-9"
                  placeholder="Digite a inscrição estadual"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  maxLength={ieLength[state] || 0}
                  {...register('inscest')}
                />
              </Input.Root>
            </div>

            <footer className="absolute p-5 bottom-0 right-0 left-0 bg-white dark:bg-zinc-900 z-50 shadow-lg shadow-zinc-500 border-r border-t border-zinc-200 dark:border-zinc-700">
              <button
                type="submit"
                className="group ml-auto w-[200px] h-[50px] flex items-center justify-between px-5 bg-[#305a96] rounded-full ring-2 ring-[#305a96]/50"
              >
                <p
                  data-pending={isPending}
                  className="transition-all duration-300 data-[pending=true]:translate-x-0 group-hover:translate-x-1/2 text-xs text-white font-medium"
                >
                  CRIAR FILIAL
                </p>

                {isPending ? (
                  <CircleNotch
                    weight="bold"
                    size={20}
                    className="text-white animate-spin"
                  />
                ) : (
                  <ArrowUpRight
                    weight="bold"
                    className="text-white transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0"
                  />
                )}
              </button>
            </footer>
          </>
        ) : null}
      </form>
    </div>
  )
}
