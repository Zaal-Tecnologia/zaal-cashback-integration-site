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
import { AdsImage } from '@/components/ads-image'
import { AdsDTO } from '@/@types/dto/ads-dto'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RemoveAd } from '@/components/remove-ad'
import dayjs from 'dayjs'
import { CreateAnnouncement } from '@/components/create-announcement'
import { DialogTrigger } from '@/components/ui/dialog'

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

  return (
    <>
      <header className="h-12 fixed top-0 left-[18%] right-0 border-b flex items-center px-5 z-50 bg-white dark:bg-zinc-900 backdrop-blur-md">
        <strong className="text-[13px] font-medium">Anúncios</strong>
      </header>

      <div className="flex items-start p-5 h-auto mt-12">
        <BranchDetails className="top-20" />
        <div className="pb-10 relative">
          <h1 className="font-urbanist text-3xl font-bold">{branch?.razao}</h1>

          {isLoading ? (
            <div className="mt-10 animate-pulse bg-zinc-100 h-[250px] w-[250px] mb-2.5 rounded-lg"></div>
          ) : null}

          {data && data.length === 0 ? (
            <p className="text-[13px] font-medium text-zinc-500 mt-5">
              Nenhum anúncio criado para {branch?.razao}
            </p>
          ) : null}

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
                  {/** <p className="text-xs font-semibold">
                    {dayjs(ad.validade).format('DD/MM/YYYY')}
                  </p> */}

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
