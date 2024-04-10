import { ArrowUpRight, CircleNotch, Info } from '@phosphor-icons/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { useBranch } from '@/hooks/use-branch'
import { useMutation } from '@/hooks/use-mutation'

import { api } from '@/data/api'
import { useToast } from '@/components/ui/use-toast'
import { Image, ImagePicker } from '@/components/image-picker'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DeviceMockup } from '@/components/device-mockup'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUpdateForm } from '@/hooks/use-update-form'
import {
  FormDivider,
  FormDividerLine,
  FormDividerTitle,
} from '@/components/form-divider'

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

export type FormData = z.input<typeof FormSchema>

export function Ads() {
  const { branch } = useBranch()
  const { form, setForm } = useUpdateForm()
  const { toast } = useToast()

  const [image, setImage] = useState<Image | null>(null)

  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm<FormData>({
      resolver: zodResolver(FormSchema),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValues: form as any,
    })

  const isUpdate = !!form

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

      setImage({ name, type, size, lastModified, base64: '' })

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

  async function onSubmit(input: FormData) {
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
      className="h-screen py-10 px-5 flex flex-col items-center"
    >
      <header className="mb-20 flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
            {isUpdate ? 'ATUALIZAR ANÚNCIO' : 'CRIAR ANÚNCIO'}
          </span>
          <div className="h-5 mx-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-sm text-zinc-500 dark:font-light dark:text-zinc-300">
            Preencha o formulário abaixo
          </span>
        </div>

        <Sheet>
          <SheetTrigger className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300">
            <Info weight="bold" size={18} />
          </SheetTrigger>

          <SheetContent>
            <ScrollArea>
              <SheetHeader className="mb-10">
                <SheetTitle>Preview</SheetTitle>
                <SheetDescription>
                  Aqui você pode ver um preview de como seus anúncios vão
                  aparecer no aplicativo.
                </SheetDescription>
              </SheetHeader>

              <DeviceMockup />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </header>

      <form
        className="flex flex-col space-y-8 relative w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isUpdate && (
          <div className="grid grid-cols-2 gap-5 px-2.5">
            <div className="col-span-2 flex items-center justify-between bg-zinc-100 p-5 rounded-md dark:bg-zinc-700/50">
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Ativo</span>
                <span className="text-[11px] text-zinc-500 font-medium dark:text-zinc-400">
                  Manter o anúncio ativo
                </span>
              </div>

              <Switch
                onChecked={(e) =>
                  setValue('tipoDesconto', e ? 'PORCENTAGEM' : 'VALOR')
                }
                checked={watch('tipoDesconto') === 'PORCENTAGEM'}
              />
            </div>
          </div>
        )}

        {!isUpdate ? (
          <>
            <FormDivider>
              <FormDividerTitle position="1">IMAGEM</FormDividerTitle>
              <FormDividerLine />
            </FormDivider>

            <ImagePicker image={image} onSelect={onSelect} />
          </>
        ) : null}

        <FormDivider>
          <FormDividerTitle position="2">CONTEÚDO</FormDividerTitle>
          <FormDividerLine />
        </FormDivider>

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

        <FormDivider>
          <FormDividerTitle position="3">VALORES</FormDividerTitle>
          <FormDividerLine />
        </FormDivider>

        <div className="grid grid-cols-2 gap-5 px-2.5">
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

        {!isUpdate && (
          <>
            <FormDivider>
              <FormDividerTitle position="4">DATAS</FormDividerTitle>
              <FormDividerLine />
            </FormDivider>

            <div className="grid grid-cols-2 gap-5 px-2.5">
              <div className="col-span-2 flex items-center justify-between bg-zinc-100 p-5 rounded-md dark:bg-zinc-700/50">
                <div className="flex flex-col">
                  <span className="font-medium text-[13px]">Começar hoje</span>
                  <span className="text-[11px] text-zinc-500 font-medium dark:text-zinc-400">
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
          </>
        )}

        <footer className="flex-row flex items-center space-x-2.5 mt-5 pb-10">
          {isUpdate ? (
            <button
              type="button"
              onClick={() => {
                setForm(null)

                reset()
              }}
              className="h-[50px] min-h-[50px] w-full transition-all duration-300 hover:bg-opacity-90 flex items-center justify-between px-5 border border-[#305a96] rounded-md ring-4 ring-[#305a96]/50"
            >
              <p className="-tracking-wide text-[13px] font-medium text-[#305a96]">
                Cancelar atualização
              </p>
            </button>
          ) : null}

          <button
            type="submit"
            className="h-[50px] min-h-[50px] w-full transition-all duration-300 hover:bg-opacity-90 flex items-center justify-between px-5 bg-[#305a96] rounded-md ring-4 ring-[#305a96]/50"
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
        </footer>
      </form>
    </motion.div>
  )
}
