/* eslint-disable no-unused-expressions */
import {
  ArrowUpRight,
  CameraSlash,
  List,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { LoginModal } from './components/login-modal'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from './components/ui/input'

const array = [1, 2, 3, 4]

const FormSchema = z.object({
  ativo: z.boolean().default(true),
  tipoDesconto: z.enum(['PORCENTAGEM', 'VALOR']), // precisa confirmar com o maicon
  filialCnpj: z.string(),
  filialInscricaoEstadual: z.string(),
  imagemBase64: z.string(),
  descricao: z.string().max(250, 'deve ter no máximo 250 caracteres.'),
  conteudo: z.string(),
  cupom: z.string(),
  valorDesconto: z.number(),
  valorMinimo: z.number(),
  valorMaximo: z.number(),
  inicio: z.string().transform((value) => value), // 2023-09-01
  validade: z.string().transform((value) => value), // 2023-09-01
})

type FormData = z.input<typeof FormSchema>

interface Image {
  base64: string
  lastModifiedDate: string
  name: string
  size: number
  type: string
}

function App() {
  const isAuth = window.localStorage.getItem('@zaal-cashback:auth-state')

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(input: FormData) {
    console.log(input)
  }

  const [percentage, setPercentage] = useState(false)
  const [image, setImage] = useState<Image | null>(null)

  const handleSelectImage = (e: any) => {
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

  const [menu, setMenu] = useState(false)
  console.log(image)
  return (
    <>
      {!isAuth ? <LoginModal /> : null}

      <aside
        data-menu={menu}
        className="data-[menu=true]:fixed data-[menu=false]:hidden inset-0 z-10"
      >
        <div className="border-r h-screen fixed w-[40%] left-0 bg-white"></div>
        <button
          onClick={() => setMenu(false)}
          className="w-[60%] fixed right-0 backdrop-blur-sm bg-zinc-50/50 h-screen"
        ></button>
      </aside>

      <header className="py-7 w-screen flex items-center justify-between max-w-[1120px] mx-auto">
        <div className="flex items-center">
          <button className="mr-10" onClick={() => setMenu((prev) => !prev)}>
            <List size={24} />
          </button>

          <img src="/logo-preto.png" alt="" className="h-[60px] w-[60px]" />
          <span className="-tracking-wide font-medium text-sm ml-2.5">
            Zaal Tecnologia
          </span>
        </div>

        <span className="text-xs border border-zinc-200 h-10 px-5 items-center justify-center flex rounded-full">
          Você ainda tem 3 anúncios
        </span>
      </header>

      <div className="bg-white h-screen w-[1120px] mx-auto grid grid-cols-2">
        <div className="py-10">
          <header className="mb-10">
            <h3 className="text-2xl -tracking-wide">Cole a imagem aqui</h3>
          </header>

          <div className="flex flex-wrap items-center sticky top-10 gap-2.5">
            <div className="relative items-center justify-center flex border-dashed h-[500px] w-[500px] bg-zinc-50 rounded-md border border-zinc-200 hover:bg-zinc-100/50">
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
                          <span className="text-[#305a96]">
                            trocar a imagem
                          </span>
                        </p>

                        <ArrowUpRight color="#305a96" weight="bold" />
                      </button>
                    </div>
                  ) : (
                    <img src={image.base64} alt="" />
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

            <div className="flex items-center gap-2.5">
              {array.map((item) => (
                <button
                  key={item}
                  className="border-dashed h-[50px] w-[50px] bg-zinc-50 rounded-md border border-zinc-200 hover:bg-zinc-100/50"
                ></button>
              ))}
            </div>

            {/** {!images[idx] ? (
                  <>
                    <input
                      type="file"
                      className="absolute inset-0 flex flex-1 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        handleSelectImage(e)

                        setIndex(idx)
                      }}
                    />
                    <div className="flex items-center space-x-2.5 w-full justify-center">
                      <p className="font-light text-2xl">{item}</p>
                      <Camera weight="duotone" size={20} />
                    </div>
                    <p className="text-xs font-medium mt-5 text-zinc-500">
                      Arquivo do tipo .jpg (400x400)
                    </p>
                  </>
                ) : (
                  <img src={images[index]} alt="Imagem pré-visualizada" />
                )} */}
          </div>
        </div>

        <div className="ml-5 p-10">
          <header className="mb-10">
            <h3 className="text-2xl -tracking-wide">Descrição e cashback</h3>
          </header>

          <form action="" className="flex flex-col gap-5">
            <span className="text-sm font-medium text-zinc-700 border-b pb-2.5">
              Conteúdo
            </span>

            <Input.Root>
              <Input.Label>Descrição</Input.Label>

              <Input.Area
                {...register('descricao')}
                placeholder="Faça uma breve descrição do anúncio"
              />
            </Input.Root>

            <div className="flex items-center w-full gap-5">
              <Input.Root>
                <Input.Label>Conteúdo</Input.Label>

                <Input.Write
                  {...register('conteudo')}
                  placeholder="Qual o conteúdo do anúncio?"
                />
              </Input.Root>

              <Input.Root>
                <Input.Label>Cupom</Input.Label>

                <Input.Write
                  {...register('cupom')}
                  placeholder="Cupom de desconto"
                />
              </Input.Root>
            </div>

            <div className="border-b pb-2.5 flex items-center justify-center w-full">
              <p className="text-sm font-medium text-zinc-700">Valores</p>

              <label className="inline-flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onChange={(event) => setPercentage(event.target.checked)}
                />
                <div className="relative w-[40px] h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#305a96] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#305a96]"></div>
                <span className="ml-2 text-xs">em porcentagem</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input.Root>
                <Input.Label>
                  Valor do desconto • {!percentage ? 'R$' : '%'}
                </Input.Label>

                <Input.Write
                  {...register('valorDesconto')}
                  placeholder="Valor do desconto"
                />
              </Input.Root>

              <Input.Root>
                <Input.Label>
                  Valor mínimo • {!percentage ? 'R$' : '%'}
                </Input.Label>

                <Input.Write
                  {...register('valorMinimo')}
                  placeholder="Valor mínimo"
                />
              </Input.Root>

              <Input.Root>
                <Input.Label>
                  Valor máximo • {!percentage ? 'R$' : '%'}
                </Input.Label>

                <Input.Write
                  {...register('valorMaximo')}
                  placeholder="Valor máximo"
                />
              </Input.Root>
            </div>

            <span className="text-sm font-medium text-zinc-700 border-b pb-2.5">
              Data
            </span>

            <div className="grid grid-cols-2 gap-5">
              <Input.Root>
                <Input.Label>Data de início</Input.Label>

                <Input.Mask
                  mask="__/__/__"
                  placeholder="Data de início"
                  {...register('inicio')}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label>Data de validade</Input.Label>

                <Input.Mask
                  mask="__/__/__"
                  placeholder="Data de validade"
                  {...register('validade')}
                />
              </Input.Root>
            </div>

            <span className="text-sm font-medium text-zinc-700 border-b pb-2.5">
              Filiais
            </span>

            <div className="grid grid-cols-2 gap-5">
              <Input.Root>
                <Input.Label>CNPJ da filial</Input.Label>

                <Input.Mask
                  mask="__.___.___/____-__"
                  placeholder="CNPJ da filial"
                  {...register('filialCnpj')}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label>IE da filial</Input.Label>

                <Input.Mask
                  mask="__/__/__"
                  placeholder="IE da filial"
                  {...register('filialInscricaoEstadual')}
                />
              </Input.Root>
            </div>

            <button
              type="button"
              className="h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-full rounded-md ring-2 ring-[#305a96]/50"
            >
              <p className="-tracking-wide text-[13px] font-medium text-white">
                Enviar anúncio
              </p>

              <ArrowUpRight weight="bold" className="text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
