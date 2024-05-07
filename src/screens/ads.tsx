import {
  ArrowUpRight,
  ArrowsClockwise,
  CheckCircle,
  CircleNotch,
  Dot,
  Image as IconImage,
  Trash,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useBranch } from '@/hooks/use-branch'
import { useMutation } from '@/hooks/use-mutation'
import { useUpdateForm } from '@/hooks/use-update-form'

import { api } from '@/data/api'

const FormSchema = z.object({
  ativo: z.boolean().default(true),
  tipoDesconto: z.enum(['PORCENTAGEM', 'VALOR']), // precisa confirmar com o maicon
  imagemBase64: z.string(),
  descricao: z.string().max(60, 'deve ter no máximo 60 caracteres.'),
  conteudo: z.string(),
  cupom: z.string(),
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
  inicio: z.string().transform((value, ctx) => {
    const [day, month, year] = value.split('/')

    const date = `${year}-${month}-${day}`

    if (!dayjs().isBefore(dayjs(date))) {
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

    if (dayjs(date).isBefore(dayjs())) {
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
  const navigate = useNavigate()

  const [image, setImage] = useState<string | null>(null)

  const { register, handleSubmit, formState, watch, reset, setValue } =
    useForm<FormData>({
      resolver: zodResolver(FormSchema),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValues: form ? (form as any) : null,
    })

  const isUpdate = !!form

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

      if (!response.ok) {
        toast({
          variant: 'error',
          title: 'Erro ao criar anúncio',
          description:
            'Ocorreu um erro ao criar o seu anúncio, verifique tudo e tente novamente.',
        })

        return null
      }

      if (response.ok) {
        toast({
          title: 'Criado',
          description: 'Anúncio criado com sucesso.',
          variant: 'success',
        })

        reset()

        setImage(null)
      }
    },
  )

  async function onSubmit(input: FormData) {
    mutate({
      ...(input as FormData),
      filialCnpj: branch?.cnpj,
      filialInscricaoEstadual: branch?.inscricaoEstadual,
    })
  }

  const handleCancelUpdate = useCallback(() => {
    setForm(null)

    reset()

    navigate('/main')
  }, [reset, setForm, navigate])

  useEffect(() => {
    setValue('inicio', dayjs().format('DD/MM/YYYY'))
    setValue('tipoDesconto', 'PORCENTAGEM')
  }, [setValue])

  const [errorsInTheImage, setErrorsInTheImage] = useState<string[]>([])

  const handleSelectAdsImage = useCallback(
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

                const isSmaller = width < 200 && height < 200
                const isBigger = width > 2000 && height > 2000
                const itHasADifferentHeightAndWidth = width !== height

                if (
                  !(file.type === 'image/jpg' || file.type === 'image/jpeg')
                ) {
                  setErrorsInTheImage((prev) => [
                    ...prev,
                    'Ter formato JPG ou JPEG',
                  ])
                }

                if (isSmaller || isBigger) {
                  setErrorsInTheImage((prev) => [
                    ...prev,
                    'Estar entre 200x200 e 400x400',
                  ])
                }

                if (itHasADifferentHeightAndWidth) {
                  setErrorsInTheImage((prev) => [...prev, 'Ter lados iguais'])
                }

                setImage(String(event.target!.result))

                setValue('imagemBase64', String(event.target!.result))
              }

              setImage(String(event.target.result))
            }
          }

          reader.readAsDataURL(file)
        }
      }
    },
    [setValue],
  )

  function onRemoveImage() {
    setImage(null)

    setErrorsInTheImage([])
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen p-10 flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-700"
    >
      <header className="mb-10 flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
            {isUpdate ? 'ATUALIZE O ANÚNCIO' : 'CRIE UM ANÚNCIO'}
          </span>
          <div className="h-5 mx-5 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
            Responda o formulário abaixo
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => (isUpdate ? handleCancelUpdate() : navigate(-1))}
              className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
            >
              <X weight="bold" size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Voltar</TooltipContent>
        </Tooltip>
      </header>

      <div className="w-full pb-32">
        <form
          action="grid grid-cols-2 relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/** {isUpdate && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 flex items-center justify-between bg-zinc-100 p-5 rounded-md dark:bg-zinc-700/50">
                <div className="flex flex-col">
                  <span className="font-medium text-[13px]">Ativo</span>
                  <span className="text-[11px] text-zinc-500 font-medium dark:text-zinc-400">
                    Manter o anúncio ativo, ao desativar ele não vai mais
                    aparecer.
                  </span>
                </div>

                <Switch
                  onChecked={(e) => setValue('ativo', e)}
                  checked={!!watch('ativo')}
                />
              </div>
            </div>
          )} */}

          {!isUpdate ? (
            <>
              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5 mb-5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Imagem
                </span>
              </div>

              <div className="flex items-start gap-7">
                <div className="relative cursor-pointer p-5 rounded-md mb-5 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all duration-500 flex items-center justify-center h-[200px] w-[200px] group border border-dashed dark:bg-zinc-800/50 dark:border-zinc-700">
                  <input
                    type="file"
                    className="opacity-0 absolute inset-0 cursor-pointer"
                    onChange={handleSelectAdsImage}
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
                      'Ter formato JPG ou JPEG',
                      'Estar entre 200x200 e 2000x2000',
                      'Ter lados iguais',
                    ].map((rule) => (
                      <li
                        key={rule}
                        className="flex items-center gap-x-2 mb-2.5"
                      >
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
                      className="flex data-[background=true]:bg-[#305a96]/10 data-[background=false]:bg-red-500/10 py-2.5 pl-2.5 pr-5 rounded-full items-center justify-center gap-x-5"
                    >
                      {errorsInTheImage.length === 0 ? (
                        <>
                          <button
                            onClick={onRemoveImage}
                            type="button"
                            className="bg-[#305a96] h-8 w-24 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-[#305a96]/90"
                          >
                            <ArrowsClockwise
                              weight="bold"
                              className="text-white"
                            />
                            <span className="text-xs font-medium text-white ml-1">
                              Trocar
                            </span>
                          </button>

                          <div className="flex items-center justify-center gap-x-1">
                            <CheckCircle
                              weight="bold"
                              className="text-[#305a96]"
                            />
                            <span className="text-xs font-medium text-[#305a96]">
                              Tudo certo!
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={onRemoveImage}
                            type="button"
                            className="bg-red-500 h-8 w-24 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-red-500/90"
                          >
                            <Trash weight="bold" className="text-white" />
                            <span className="text-xs text-white ml-1">
                              Remover
                            </span>
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
            </>
          ) : null}

          {watch('imagemBase64') || (!watch('imagemBase64') && isUpdate) ? (
            <>
              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5 mb-5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Conteúdo
                </span>
              </div>

              <div className="gap-3 grid">
                <Input.Root>
                  <div className="flex items-center justify-between">
                    <Input.Label
                      required
                      errorMessage={formState.errors?.conteudo?.message}
                    >
                      Conteúdo
                    </Input.Label>

                    <span className="text-xs font-medium -tracking-wider mr-2.5">
                      {watch('conteudo')?.length} de 250
                    </span>
                  </div>

                  <Input.Area
                    {...register('conteudo')}
                    maxLength={250}
                    placeholder="Conteúdo do anúncio"
                  />
                </Input.Root>

                <div className="grid grid-cols-7 gap-x-3">
                  <Input.Root className="col-span-4">
                    <Input.Label
                      required
                      errorMessage={formState.errors?.descricao?.message}
                    >
                      Descrição
                    </Input.Label>

                    <Input.Write
                      {...register('descricao')}
                      maxLength={60}
                      placeholder="Qual a descrição do anúncio?"
                    />
                  </Input.Root>

                  <Input.Root className="col-span-3">
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

              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5 mb-5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Valores
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 flex items-center justify-between bg-zinc-100 p-5 rounded-md dark:bg-zinc-700/50">
                  <div className="flex flex-col">
                    <span className="font-medium text-[13px]">
                      Desconto em porcentagem
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium dark:text-zinc-400">
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

              <div className="col-span-2 border-b border-zinc-200 dark:border-zinc-700 pb-2.5 mt-2.5 mb-5">
                <span className="font-medium text-[13px] -tracking-wide">
                  Datas
                </span>
              </div>

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

              <footer className="absolute p-5 bottom-0 right-0 left-0 bg-white dark:bg-zinc-900 z-50 shadow-lg shadow-zinc-500 border-r border-t border-zinc-200 dark:border-zinc-700">
                <button
                  type="submit"
                  className="group ml-auto w-[200px] h-[50px] flex items-center justify-between px-5 bg-[#305a96] rounded-full ring-2 ring-[#305a96]/50"
                >
                  <p
                    data-pending={isPending}
                    className="transition-all duration-300 uppercase data-[pending=true]:translate-x-0 group-hover:translate-x-[18%] text-xs font-medium text-white"
                  >
                    {isUpdate ? 'salvar aterações' : 'criar anúncio'}
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
    </motion.div>
  )
}
