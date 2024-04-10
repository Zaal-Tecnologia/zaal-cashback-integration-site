import { ChangeEvent, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  ArrowDown,
  ArrowUpRight,
  CircleNotch,
  Image as IconImage,
  Trash,
} from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/data/api'

import { useMutation } from '@/hooks/use-mutation'

import { Input } from './ui/input'
import { useToast } from './ui/use-toast'

const FormSchema = z.object({
  cnpj: z.string(),
})

type FormInput = z.input<typeof FormSchema>

interface Branch {
  cnpj: string
  inscest: string
  razao: string
  fantasia: string
  descricao: string
  categoria: string
  endereco: {
    cep: string
    bairro: string
    numero: string
    complemento: string
    logradouro: string
    cidadeId: number
    pais: string
  }
}

interface Props {
  onEnd(): void
}

export function CreateBranchForm(props: Props) {
  const { register, handleSubmit } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cnpj: '05.804.925/0001-09',
    },
  })

  const [image, setImage] = useState<string | null>(null)

  async function getCity(name: string) {
    const response = await api(`cidades?descricao=${name}`)

    const json = await response.json()

    const city = json.content[0]
    console.log('city', city)

    return city ? city.id : null
  }

  async function createBranch(branch: Branch) {
    const response = await api('filiais', {
      method: 'POST',
      body: JSON.stringify(branch),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    return json.id
  }

  async function createBranchImage(branchId: string) {
    const response = await api(`filiais/${branchId}/logo`, {
      method: 'POST',
      body: JSON.stringify({ base64: image }),
    })

    const json = await response.json()
    console.log('branch image', json)

    return json.id
  }

  const { isPending } = useMutation<unknown, FormInput>(
    ['create-branch-mutation'],
    async (input) => {
      const code = input.cnpj.replace(/[^\d]/g, '')

      await fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${code}`)
        .then((response) => response.json())
        .then(async (data) => {
          const cidadeId = await getCity(data.MUNICIPIO)

          const branch = {
            cnpj: data.CNPJ,
            inscest: 'string',
            razao: data['RAZAO SOCIAL'],
            fantasia: data['NOME FANTASIA'],
            descricao: data['CNAE PRINCIPAL DESCRICAO'],
            categoria: data.SETOR,
            endereco: {
              cep: data.CEP,
              bairro: `${data.BAIRRO}, ${data.MUNICIPIO}, ${data.UF}`,
              numero: data.NUMERO,
              complemento: data.COMPLEMENTO,
              logradouro: `${data['TIPO LOGRADOURO']} ${data.LOGRADOURO}`,
              cidadeId,
              pais: 'Brasil',
            },
          }

          const branchId = await createBranch(branch)

          await createBranchImage(branchId)
        })
    },
    // props.onEnd,
  )

  async function onSubmit(input: FormInput) {
    // mutate(input)
    console.log(input)

    props.onEnd()
  }

  const { toast } = useToast()

  const handleSelectPicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target.files) {
        const file = event.target.files[0]

        let hasError = false

        const picture = new Image()

        if (picture.width > 100 || picture.height > 100) {
          toast({
            title: 'Ocorreu um erro',
            description: 'Imagem maior do que 100x100',
            variant: 'error',
          })

          hasError = true
        }

        if (picture.width < 80 || picture.height < 80) {
          toast({
            title: 'Ocorreu um erro',
            description: 'Imagem menor do que 80x80',
            variant: 'error',
          })

          hasError = true
        }

        if (file.type !== 'image/png') {
          toast({
            title: 'Ocorreu um erro',
            description: 'A imagem precisa ter o formato .png',
            variant: 'error',
          })

          hasError = true
        }

        if (!hasError) {
          const reader = new FileReader()

          reader.onload = () => {
            setImage(String(reader.result))
          }

          reader.readAsDataURL(file)
        }
      }
    },
    [toast],
  )

  return (
    <div className="w-full">
      <form action="grid grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start gap-5 border-b border-b-zinc-100 dark:border-b-zinc-700 mb-5">
          <div className="relative rounded-2xl mb-5 hover:border-zinc-900 transition-all duration-500 flex items-center justify-center h-[110px] w-[110px] group border border-dashed dark:bg-zinc-800/50">
            <input
              type="file"
              className="opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleSelectPicture}
            />

            {image ? (
              <img src={image} alt="" className="rounded-xl" />
            ) : (
              <>
                <ArrowDown
                  size={20}
                  weight="bold"
                  className="group-hover:translate-y-0 translate-y-4 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  alt=""
                />

                <IconImage
                  size={24}
                  weight="duotone"
                  className="absolute top-1/2 left-1/2 righ-auto bottom-auto -translate-y-1/2 -translate-x-1/2 -mr-1/2 group-hover:translate-y-4 transition-all duration-500 group-hover:opacity-0 opacity-100"
                  alt=""
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-xs block mt-4 text-zinc-700">
              É importante que a imagem tenha entre 80x80 e 100x100 e esteja em
              .png
            </span>

            {image ? (
              <button
                onClick={() => setImage(null)}
                className="bg-red-500 h-8 w-24 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-red-500/90"
              >
                <Trash weight="bold" className="text-white" />
                <span className="text-xs text-white ml-1">Remover</span>
              </button>
            ) : null}
          </div>
        </div>

        <Input.Root>
          <Input.Label>CNPJ</Input.Label>
          <Input.Mask
            mask="99.999.999/9999-99"
            placeholder="CNPJ da filial"
            {...register('cnpj')}
          />
        </Input.Root>

        <button
          type="submit"
          className="mt-5 h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-full rounded-md ring-2 ring-[#305a96]/50"
        >
          <p className="-tracking-wide text-[13px] font-medium text-white">
            Verificar CNPJ
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
