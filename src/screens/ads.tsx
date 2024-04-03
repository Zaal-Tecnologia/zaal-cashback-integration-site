import { ArrowUpRight, CircleNotch } from '@phosphor-icons/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { useBranch } from '@/hooks/use-branch'
import { useMutation } from '@/hooks/use-mutation'

import { api } from '@/data/api'
import { useToast } from '@/components/ui/use-toast'
import { Title } from '@/components/title'
import { DateSVG } from '@/components/svgs/date-svg'
import { DollarSVG } from '@/components/svgs/dollar-svg'
import { FileSVG } from '@/components/svgs/file-svg'
import { Image, ImagePicker } from '@/components/image-picker'

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

export function Ads() {
  const { branch } = useBranch()
  const { toast } = useToast()

  const [image, setImage] = useState<Image | null>(null)

  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm<FormData>({
      resolver: zodResolver(FormSchema),
    })

  const onSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement> | null) => {
      if (!e) {
        setImage(null)

        return
      }

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

        setValue('imagemBase64', String(reader.result))
      }

      reader.readAsDataURL(file)
    },
    [setValue],
  )

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

  console.log(formState.errors)

  async function onSubmit(input: FormData) {
    console.log(input)

    mutate({
      ...(input as FormData),
      filialCnpj: branch?.cnpj,
      filialInscricaoEstadual: branch?.inscricaoEstadual,
    })
  }

  useEffect(() => {
    setValue('inicio', dayjs().format('DD/MM/YYYY'))
    setValue('tipoDesconto', 'PORCENTAGEM')
  }, [setValue])

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen sm:w-[1120px] sm:mx-auto grid-rows-10 grid sm:grid-cols-2"
    >
      <div className="col-span-2 row-span-1 flex items-center">
        <Title>Criar anúncio</Title>

        {branch ? (
          <span className="ml-5 text-[13px] -tracking-wide text-zinc-700 dark:text-zinc-50">
            Ainda existem 4 anúncios disponíveis para {branch?.razao}
          </span>
        ) : null}
      </div>

      <ImagePicker image={image} onSelect={onSelect} />

      <form
        className="flex flex-col gap-y-5 sm:ml-5 p-5 relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <FileSVG />
                <span className="text-sm uppercase -tracking-wider text-zinc-700 dark:text-zinc-50">
                  Conteúdo
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="gap-3 grid px-2.5">
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

                <div className="grid grid-cols-2 gap-x-3">
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
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <DollarSVG />
                <span className="text-sm uppercase -tracking-wider text-zinc-700 dark:text-zinc-50">
                  Valores
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid grid-cols-2 gap-5 px-2.5">
                <div className="col-span-2 flex items-center justify-between bg-zinc-50 p-5 rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px]">
                      Desconto em porcentagem
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Ao fazer isso o valor do desconto vai ser feito por
                      porcentagem
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
                    Valor do desconto •{' '}
                    {watch('tipoDesconto') === 'VALOR' ? 'R$' : '%'}
                  </Input.Label>

                  <Input.Write
                    type="number"
                    placeholder="Valor do desconto"
                    {...register('valorDesconto', { valueAsNumber: true })}
                  />
                </Input.Root>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center space-x-2">
                <DateSVG />
                <span className="text-sm uppercase -tracking-wider text-zinc-700 dark:text-zinc-50">
                  Datas
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid grid-cols-2 gap-5 px-2.5">
                <div className="col-span-2 flex items-center justify-between bg-zinc-50 p-5 rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px]">
                      Começar hoje
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Começar a promoção a partir de hoje
                    </span>
                  </div>

                  <Switch
                    onChecked={(e) =>
                      e
                        ? setValue('inicio', dayjs().format('DD-MM-YYYY'))
                        : setValue('inicio', '')
                    }
                    checked={watch('inicio') !== ''}
                  />
                </div>

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
            </AccordionContent>
          </AccordionItem>

          <button
            type="submit"
            className="h-[50px] mt-5 min-h-[50px] w-full transition-all duration-300 hover:bg-opacity-90 flex items-center justify-between px-5 bg-[#305a96] rounded-md ring-4 ring-[#305a96]/50"
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
        </Accordion>
      </form>
    </motion.div>
  )
}
