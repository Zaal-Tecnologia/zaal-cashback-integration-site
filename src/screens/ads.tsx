import {
  ArrowUpRight,
  CameraSlash,
  CircleNotch,
  CurrencyDollarSimple,
  DeviceMobileSpeaker,
  Image,
  Images,
  Package,
  Timer,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { FormSession } from '@/components/form-session'
import { Switch } from '@/components/ui/switch'
import { DeviceMockup } from '@/components/device-mockup'

import { useBranch } from '@/hooks/use-branch'
import { useMutation } from '@/hooks/use-mutation'

import { api } from '@/data/api'
import { useToast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  ativo: z.boolean().default(true),
  tipoDesconto: z.enum(['PORCENTAGEM', 'VALOR']), // precisa confirmar com o maicon
  imagemBase64: z.string(),
  descricao: z.string().max(250, 'deve ter no máximo 250 caracteres.'),
  conteudo: z.string(),
  cupom: z.string(),
  valorDesconto: z.number({ required_error: 'é obrigarório' }),
  valorMinimo: z.number({ required_error: 'é obrigarório' }),
  valorMaximo: z.number({ required_error: 'é obrigarório' }),
  inicio: z.string().transform((value, ctx) => {
    const [day, month, year] = value.split('/')

    const date = `${year}-${month}-${day}`

    if (dayjs(date).isBefore(new Date())) {
      return ctx.addIssue({
        message: 'abaixo da data atual.',
        code: 'custom',
      })
    }

    if (+day > 31 || +month > 12 || +year < +dayjs().format('YYYY')) {
      return ctx.addIssue({
        message: 'não é válido.',
        code: 'custom',
      })
    }

    return date
  }),
  validade: z.string().transform((value, ctx) => {
    const [day, month, year] = value.split('/')

    const date = `${year}-${month}-${day}`

    if (dayjs(date).isBefore(new Date())) {
      return ctx.addIssue({
        message: 'abaixo da data atual.',
        code: 'custom',
      })
    }

    if (+day > 31 || +month > 12 || +year < +dayjs().format('YYYY')) {
      return ctx.addIssue({
        message: 'não é válido.',
        code: 'custom',
      })
    }

    return date
  }),
})

type FormData = z.input<typeof FormSchema>

interface Image {
  base64: string
  lastModified: number
  name: string
  size: number
  type: string
}

const array = [1, 2, 3]

export function Ads() {
  const { branch } = useBranch()
  const { toast } = useToast()

  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      descricao: 'lorem ipsum',
      ativo: true,
      conteudo: 'lorem ipsum',
      cupom: 'LOREM13',
      imagemBase64: 'lorem',
      inicio: '12/10/2024',
      validade: '12/11/2024',
      tipoDesconto: 'PORCENTAGEM',
      valorDesconto: 90,
      valorMaximo: 9,
      valorMinimo: 89,
    },
  })

  const { mutate, isPending } = useMutation(
    ['create-ads-mutation'],
    async (input) => {
      const response = await api('anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (response.ok) {
        console.log('error')

        return
      }

      const json = await response.json()

      return json
    },
    async () => {
      toast({
        title: 'Criado',
        description: 'Anúncio criado com sucesso.',
        variant: 'success',
      })

      reset()

      setImage(null)
    },
  )

  async function onSubmit(input: FormData) {
    mutate({
      ...(input as FormData),
      imagemBase64: image?.base64,
      filialCnpj: branch?.cnpj,
      filialInscricaoEstadual: branch?.inscricaoEstadual,
    })
  }

  const [percentage, setPercentage] = useState(false)
  const [image, setImage] = useState<Image | null>(null)

  function handleSelectImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]

    const name = file.name
    const type = file.type
    const size = file.size
    const lastModified = file.lastModified

    setImage({
      name,
      type,
      size,
      lastModified,
      base64: '',
    })

    const reader = new FileReader()

    reader.onload = () => {
      setImage((prev) => ({
        ...prev!,
        base64: String(reader.result),
      }))
    }

    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen sm:w-[1120px] sm:mx-auto grid sm:grid-cols-2"
    >
      <h3 className="col-span-2 text-2xl -tracking-wider font-light text-zinc-700 dark:text-zinc-50 mt-10">
        Criar anúncio
      </h3>

      <div className="py-5 sm:py-10 px-5 sm:px-0 relative">
        {/** <div className="flex flex-col absolute -left-16 top-16 items-center justify-start mb-10 gap-2">
          <button
            onClick={() => setShowDevice(false)}
            className={clsx(
              'h-10 w-10 flex items-center justify-center rounded-full',
              {
                'bg-[#305a96] text-white ring-2 ring-[#305a96]/20': !showDevice,
              },
            )}
          >
            <Images size={20} />
          </button>

          <button
            onClick={() => setShowDevice(true)}
            className={clsx(
              'h-10 w-10 flex items-center justify-center rounded-full',
              {
                'bg-[#305a96] text-white ring-2 ring-[#305a96]/20': showDevice,
              },
            )}
          >
            <DeviceMobileSpeaker size={20} />
          </button>
        </div> */}

        <div className="flex sm:flex-wrap items-start sm:items-center sticky top-10 gap-2.5">
          <div className="relative items-center justify-center flex border-dashed h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700/50 rounded-md border border-zinc-200 hover:bg-zinc-100/50">
            {image ? (
              <>
                <div className="flex flex-col items-center absolute top-0 -right-12 gap-y-1.5">
                  <button
                    onClick={() => setImage(null)}
                    className="flex items-center justify-center h-10 w-10 bg-red-200/50 rounded-md hover:bg-red-300/50"
                  >
                    <XCircle size={20} className="text-red-500" />
                  </button>
                </div>

                {image.type !== 'image/jpeg' && image.type !== 'image/jpg' ? (
                  <div className="flex flex-1 h-[450px] flex-col w-[450px] items-center justify-center">
                    <div className="flex items-center gap-2.5 mb-10">
                      <CameraSlash size={40} weight="duotone" />

                      <p className="text-[13px] -tracking-wide font-medium">
                        Sua imagem não atende ao requisitos necessários
                      </p>
                    </div>

                    <div className="p-5 bg-zinc-200/50 rounded-md w-96">
                      <div className="flex items-center gap-2.5">
                        <X size={20} weight="bold" className="text-red-500" />
                        <p className="text-xs font-medium -tracking-wide">
                          .PNG não é suportado, apenas .JPG
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setImage(null)}
                      className="flex items-center justify-center mt-10"
                    >
                      <p className="text-[13px] font-medium -tracking-wide mr-2.5">
                        Clique aqui para{' '}
                        <span className="text-[#305a96]">trocar a imagem</span>
                      </p>

                      <ArrowUpRight color="#305a96" weight="bold" />
                    </button>
                  </div>
                ) : (
                  <img
                    src={image.base64}
                    alt=""
                    className="w-[440px] h-[440px] rounded-md"
                  />
                )}
              </>
            ) : (
              <>
                <p className="text-xs">Imagem JPG com 400x400</p>
                <input
                  type="file"
                  className="absolute inset-0 flex flex-1 opacity-0 cursor-pointer"
                  onChange={handleSelectImage}
                />
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            {array.map((item) => (
              <button
                key={item}
                className="border-dashed h-[50px] w-[50px] bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700/50 rounded-md border border-zinc-200 hover:bg-zinc-100/50"
              ></button>
            ))}
          </div>
        </div>
      </div>

      <div className="sm:ml-5 p-5">
        <form action="" className="flex flex-col gap-y-5">
          <FormSession.Root>
            <Package size={18} weight="bold" />
            <FormSession.Title>Conteúdo</FormSession.Title>
          </FormSession.Root>

          <Input.Root>
            <Input.Label
              required
              errorMessage={formState.errors?.descricao?.message}
            >
              Descrição
            </Input.Label>

            <Input.Area
              {...register('descricao')}
              placeholder="Faça uma breve descrição do anúncio"
            />
          </Input.Root>

          <div className="grid grid-cols-2 gap-5">
            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.conteudo?.message}
              >
                Conteúdo
              </Input.Label>

              <Input.Write
                {...register('conteudo')}
                placeholder="Qual o conteúdo do anúncio?"
              />
            </Input.Root>

            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.cupom?.message}
              >
                Cupom
              </Input.Label>

              <Input.Write
                {...register('cupom')}
                placeholder="Cupom de desconto"
              />
            </Input.Root>
          </div>

          <FormSession.Root>
            <CurrencyDollarSimple size={18} weight="bold" />
            <FormSession.Title>Valores</FormSession.Title>

            <Switch onChange={() => setPercentage((prev) => !prev)}>
              em porcentagem
            </Switch>
          </FormSession.Root>

          <div className="grid grid-cols-2 gap-5">
            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.valorDesconto?.message}
              >
                Valor do desconto • {!percentage ? 'R$' : '%'}
              </Input.Label>

              <Input.Write
                placeholder="Valor do desconto"
                {...register('valorDesconto', { valueAsNumber: true })}
              />
            </Input.Root>

            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.valorMinimo?.message}
              >
                Valor mínimo • {!percentage ? 'R$' : '%'}
              </Input.Label>

              <Input.Write
                placeholder="Valor mínimo"
                {...register('valorMinimo', { valueAsNumber: true })}
              />
            </Input.Root>

            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.valorMaximo?.message}
              >
                Valor máximo • {!percentage ? 'R$' : '%'}
              </Input.Label>

              <Input.Write
                placeholder="Valor máximo"
                {...register('valorMaximo', { valueAsNumber: true })}
              />
            </Input.Root>
          </div>

          <FormSession.Root>
            <Timer size={18} weight="bold" />
            <FormSession.Title>Data & Vencimento</FormSession.Title>
          </FormSession.Root>

          <div className="grid grid-cols-2 gap-5">
            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.inicio?.message}
              >
                Data de início
              </Input.Label>

              <Input.Mask
                mask="99/99/9999"
                placeholder="Data de início"
                {...register('inicio')}
              />
            </Input.Root>

            <Input.Root>
              <Input.Label
                required
                errorMessage={formState.errors?.validade?.message}
              >
                Data de validade
              </Input.Label>

              <Input.Mask
                mask="99/99/9999"
                placeholder="Data de validade"
                {...register('validade')}
              />
            </Input.Root>
          </div>

          {/** <FormSession.Root>
              <Storefront size={18} weight="bold" />
              <FormSession.Title>Filial</FormSession.Title>
            </FormSession.Root>

            <div className="grid grid-cols-2 gap-5">
              <Input.Root>
                <Input.Label
                  required
                  errorMessage={formState.errors?.filialCnpj?.message}
                >
                  CNPJ da filial
                </Input.Label>

                <Input.Mask
                  mask="99.999.999/9999-99"
                  placeholder="CNPJ da filial"
                  {...register('filialCnpj')}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label
                  required
                  errorMessage={
                    formState.errors?.filialInscricaoEstadual?.message
                  }
                >
                  IE da filial
                </Input.Label>

                <Input.Mask
                  mask="99.999.99-9"
                  placeholder="IE da filial"
                  {...register('filialInscricaoEstadual')}
                />
              </Input.Root>
            </div> */}

          <button
            type="submit"
            className="h-[50px] flex items-center justify-between px-5 bg-[#305a96] rounded-md ring-2 ring-[#305a96]/50"
            onClick={handleSubmit(onSubmit)}
          >
            <p className="-tracking-wide text-[13px] font-medium text-white">
              Enviar anúncio
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
    </motion.div>
  )
}
