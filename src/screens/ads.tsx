import { ArrowRight } from '@phosphor-icons/react'

import { useBranch } from '@/hooks/use-branch'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { api } from '@/data/api'
import { BranchDetails } from '@/components/branch-details'
import { useQuery } from '@/hooks/use-query'

import { AdsDTO } from '@/@types/dto/ads-dto'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RemoveAd } from '@/components/remove-ad'
import dayjs from 'dayjs'
import { CreateAnnouncement } from '@/components/create-announcement'
import { DialogTrigger } from '@/components/ui/dialog'

import AdsImage from '@/components/ads-image'

type Ad = {
  id: number
  conteudo: string
  descricao: string
  cupom: string
  tipoDesconto: string
  valorDesconto: number
  valorMinimo: number
  valorMaximo: number
  inicio: string
  validade: string
  filialId: number
  src: string
}

export function Ads() {
  const { branch } = useBranch()

  const { data, isLoading } = useQuery<AdsDTO[]>(
    ['GET-ADDS-QUERY', String(branch?.id)],
    async () => {
      const response = await api(`anuncios?filialId=${branch?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()

      return data
    },
  )

  const [ad, setAd] = useState<Ad | null>(null)

  const daysDifference = dayjs(ad?.validade).diff(dayjs(), 'day')

  // const [mockup, setMockup] = useState(false)

  return (
    <>
      <header className="h-12 fixed top-0 left-[18%] right-0 border-b flex items-center px-5 z-50 bg-white dark:bg-zinc-900 backdrop-blur-md">
        <strong className="text-[13px] font-medium">Anúncios</strong>
      </header>

      <div className="flex items-start p-5 h-auto mt-12">
        <BranchDetails className="top-20">
          <button
            className="flex items-center gap-2.5 group"
            // onClick={() => setMockup((prev) => !prev)}
          >
            <div className="h-6 w-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
              >
                <path
                  d="M5 9C5 5.70017 5 4.05025 6.02513 3.02513C7.05025 2 8.70017 2 12 2C15.2998 2 16.9497 2 17.9749 3.02513C19 4.05025 19 5.70017 19 9V15C19 18.2998 19 19.9497 17.9749 20.9749C16.9497 22 15.2998 22 12 22C8.70017 22 7.05025 22 6.02513 20.9749C5 19.9497 5 18.2998 5 15V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 19H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 2L9.089 2.53402C9.28188 3.69129 9.37832 4.26993 9.77519 4.62204C10.1892 4.98934 10.7761 5 12 5C13.2239 5 13.8108 4.98934 14.2248 4.62204C14.6217 4.26993 14.7181 3.69129 14.911 2.53402L15 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-[13px] font-medium text-zinc-900 hover:underline">
              Ver disposição no app
            </p>
          </button>
        </BranchDetails>

        <div className="pb-10 relative">
          <h1 className="font-urbanist text-3xl font-bold">{branch?.razao}</h1>

          {isLoading ? (
            <div className="mt-10 animate-pulse bg-zinc-100 dark:bg-zinc-800 h-[250px] w-[250px] mb-2.5"></div>
          ) : null}

          {data && data.length === 0 ? (
            <p className="text-[13px] font-medium text-zinc-500 mt-5">
              Nenhum anúncio criado para {branch?.razao}
            </p>
          ) : null}

          {/** */}

          <ul
            style={{ columnGap: 10 }}
            className="columns-3 mt-10 w-[calc(100vw_-_18%)] max-w-[70%] pb-10"
          >
            {data
              ? data.map((item) => (
                  <li
                    key={item.id}
                    className="w-full break-inside-avoid mb-3 cursor-pointer relative group"
                  >
                    <AdsImage
                      adsId={item.id}
                      onSelectAds={(src) => setAd({ ...item, src })}
                    />

                    <div className="transition-all duration-300 flex items-center gap-2.5 right-8 left-8 justify-center p-1.5 opacity-0 translate-y-10 group-hover:translate-y-0 group-hover:opacity-100 absolute bottom-8 rounded-full h-12 bg-white">
                      <p className="font-medium text-xs text-zinc-900">
                        Ver informações
                      </p>

                      <ArrowRight className="text-zinc-900" weight="bold" />
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>

      <Sheet
        open={!!ad}
        onOpenChange={(event) => (!event ? setAd(null) : undefined)}
      >
        {ad ? (
          <SheetContent>
            {/** {mockup ? (
              <div className="relative">
                <div className="h-20 w-96 left-[300px] z-50 absolute top-[120px] flex items-start flex-col">
                  <motion.div
                    initial={{ opacity: 0, translateX: -50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'tween' }}
                    className="flex items-center mt-5 gap-2.5 ml-10"
                  >
                    <ArrowRight size={20} />
                    <div className="flex items-center bg-[#305a96] rounded-full h-8 justify-center w-8 ">
                      <p className="text-[13px] font-urbanist font-bold text-white">
                        1
                      </p>
                    </div>
                    <p className="text-[13px] font-medium">
                      Todos os anúncios ativos
                    </p>
                  </motion.div>
                </div>

                <div className="h-20 w-96 left-[300px] z-50 absolute top-[300px] flex items-start flex-col">
                  <motion.div
                    className="flex items-center mt-5 gap-2.5 ml-10"
                    initial={{ opacity: 0, translateX: -100 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ type: 'tween' }}
                  >
                    <ArrowRight size={20} />
                    <div className="flex items-center bg-[#305a96] rounded-full h-8 justify-center w-8 ">
                      <p className="text-[13px] font-urbanist font-bold text-white">
                        2
                      </p>
                    </div>
                    <p className="text-[13px] font-medium">
                      Anúncio selecionado
                    </p>
                  </motion.div>
                </div>

                <DeviceMockup>
                  <div className="flex items-center px-5 pb-5 pt-2.5 mt-2.5">
                    <ArrowLeft weight="bold" size={14} />

                    <div className="h-8 w-8 bg-zinc-200 rounded-full ml-3"></div>

                    <div className="flex flex-col items-start ml-3">
                      <div className="h-2 w-10 bg-zinc-200 mb-0.5 rounded"></div>
                      <div className="h-1.5 w-20 bg-zinc-200 rounded"></div>
                    </div>
                  </div>

                  <ul className="flex items-center gap-4 mt-3 pl-5 mb-3">
                    {data
                      ? data.map((item) => (
                          <li
                            key={item.id}
                            className="cursor-pointer relative group"
                          >
                            <AdsImage
                              className="min-h-[80px] h-[80px] z-50 min-w-[80px] w-[80px] max-w-[80px] max-h-[80px] rounded-lg ring-4 ring-zinc-200"
                              adsId={item.id}
                              onSelectAds={(src) => setAd({ ...item, src })}
                            />
                          </li>
                        ))
                      : null}
                  </ul>

                  <div className="px-5">
                    <img
                      src={ad?.src}
                      alt=""
                      className="rounded-lg ring-4 ring-zinc-200"
                    />

                    <div className="h-3 w-20 bg-zinc-200 mb-0.5 rounded mt-5"></div>

                    <div className="flex items-center gap-2 mt-5 mb-3">
                      <div className="h-6 w-16 bg-[#305a96] rounded-full"></div>
                      <div className="h-6 w-24 bg-red-200/50 rounded-full"></div>
                    </div>
                  </div>
                </DeviceMockup>
              </div>
            ) : (
              
            )} */}

            <ScrollArea className="w-full h-full px-4">
              <SheetHeader>
                <SheetTitle>{ad.descricao}</SheetTitle>
              </SheetHeader>

              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium block my-5">
                {ad.conteudo}
              </p>

              <div className="flex items-center gap-2.5 w-full my-5">
                <CreateAnnouncement
                  data={{
                    conteudo: ad.conteudo,
                    cupom: ad.cupom,
                    descricao: ad.descricao,
                    filialId: ad.filialId,
                    id: ad.id,
                    imagemBase64: ad.src,
                    inicio: dayjs(ad.inicio).toDate(),
                    tipoDesconto: ad.tipoDesconto,
                    validade: dayjs(ad.validade).toDate(),
                    valorDesconto: ad.valorDesconto,
                    valorMaximo: ad.valorMaximo,
                    valorMinimo: ad.valorMinimo,
                  }}
                >
                  <DialogTrigger asChild>
                    <button className="h-8 px-5 bg-[#305a96] rounded-full hover:ring-4 hover:ring-[#305a96]/20">
                      <p className="font-medium text-white text-xs">Editar</p>
                    </button>
                  </DialogTrigger>
                </CreateAnnouncement>

                <RemoveAd id={ad.id} />
              </div>

              <div className="grid grid-cols-3 gap-10 my-10">
                <div className="flex flex-col">
                  <p className="text-2xl font-bold font-urbanist">{ad.cupom}</p>

                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2.5">
                    cupom
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold font-urbanist">
                    {daysDifference} dias
                  </p>

                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2.5">
                    para acabar
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold font-urbanist">
                    R$ {ad.valorMaximo}
                  </p>

                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2.5">
                    no máximo
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold font-urbanist">
                    R$ {ad.valorMinimo}
                  </p>

                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2.5">
                    no mínimo
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold font-urbanist">
                    {ad.tipoDesconto === 'PORCENTAGEM'
                      ? `${ad.valorDesconto}%`
                      : `R$ ${ad.valorDesconto}`}
                  </p>

                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-2.5">
                    de desconto
                  </p>
                </div>
              </div>

              <img src={ad.src} alt="" className="mb-20" />
            </ScrollArea>
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  )
}
