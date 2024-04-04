import { motion } from 'framer-motion'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowUpRight, Camera, CircleNotch } from '@phosphor-icons/react'
import clsx from 'clsx'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/data/api'

import { useMutation } from '@/hooks/use-mutation'

import { Input } from './ui/input'

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
    console.log('branch', json)

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

  function handleSelectImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = () => {
      setImage(String(reader.result))
    }

    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      initial={{ translateY: -50, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: 'tween' }}
      className="flex flex-col relative"
    >
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <Input.Root>
          <Input.Label>Logo</Input.Label>
          <div
            className={clsx(
              'relative rounded-md p-2.5 mb-5 flex items-center gap-5 border border-dashed dark:bg-zinc-800/50',
              {
                'bg-zinc-50': !image,
                'border-green-500 bg-green-200/50': image,
              },
            )}
          >
            <input
              type="file"
              className="opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleSelectImage}
            />

            <div
              className={clsx(
                'rounded-md h-[50px] w-[50px] flex items-center justify-center',
                {
                  'bg-zinc-200 dark:bg-zinc-700 shadow-inner': !image,
                },
              )}
            >
              {image ? (
                <img src={image} alt="" />
              ) : (
                <Camera size={20} weight="duotone" />
              )}
            </div>

            <div className="flex flex-col">
              <p
                className={clsx('text-green-700 font-medium text-xs', {
                  'text-green-500': image,
                  'text-zinc-900 dark:text-white': !image,
                })}
              >
                {image
                  ? 'Foto adicionada com sucesso.'
                  : 'Adicione uma foto a sua filial'}
              </p>
            </div>
          </div>
        </Input.Root>

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
            Criar
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
    </motion.div>
  )
}
