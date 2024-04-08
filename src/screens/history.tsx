import { AdsImage } from '@/components/ads-image'

import { api } from '@/data/api'
import { motion } from 'framer-motion'

import { useBranch } from '@/hooks/use-branch'
import { useQuery } from '@/hooks/use-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { AdsDTO } from '@/@types/dto/ads-dto'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { green, orange } from 'tailwindcss/colors'
import {
  CurrencyDollar,
  Pencil,
  Slideshow,
  Ticket,
  Timer,
  X,
} from '@phosphor-icons/react'
import { DialogClose } from '@radix-ui/react-dialog'

import { RemoveBranch } from '@/components/remove-branch'
import { ImageProvider } from '@/contexts/image'
import { Lightbox } from '@/components/lightbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function History() {
  const { branch } = useBranch()

  const { data: ads, isLoading } = useQuery<AdsDTO[]>(
    ['get-ads-by-branch-id-query', String(branch?.id)],
    async () => {
      const response = await api(
        branch?.id ? `anuncios?filialId=${branch?.id}` : 'anuncios',
      )

      const json = await response.json()

      return json
    },
    /** {
      refetchOnMount: false,
    }, */
  )

  const [selectedAds, setSelectedAds] = useState<AdsDTO | null>(null)

  const handleCloseModal = useCallback(() => {
    setSelectedAds(null)
  }, [])

  const [openLightbox, setOpenLightbox] = useState(false)

  const handleCloseLightbox = useCallback(() => {
    setOpenLightbox(false)
  }, [])

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
            HISTÓRICO
          </span>
          <div className="h-5 mx-5 w-[1px] bg-zinc-200" />
          <span className="text-sm text-zinc-500">Veja seu histórico</span>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setOpenLightbox(true)}
            className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300 font-urbanist"
          >
            <Slideshow size={18} />
          </button>
          <button
            // onClick={() => setCreate((prev) => !prev)}
            className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300 font-urbanist"
          >
            {ads?.length}
          </button>
        </div>
      </header>

      {isLoading ? (
        <ul className="grid grid-cols-3 gap-2 animate-pulse">
          <li className="min-h-[320px] min-w-[320px] col-span-2 row-span-2 bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></li>
          <li className="min-h-[160px] min-w-[160px] bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></li>
          <li className="min-h-[160px] min-w-[160px] bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></li>
          <li className="min-h-[160px] min-w-[160px] bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></li>
          <li className="min-h-[160px] min-w-[160px] bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></li>

          <span className="sr-only">Loading...</span>
        </ul>
      ) : ads && ads.length > 0 ? (
        <ImageProvider>
          <Lightbox onClose={handleCloseLightbox} open={openLightbox} />

          <ul className="grid grid-cols-3 gap-2">
            {ads.map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedAds(item)}
                className="cursor-pointer first:col-span-2 first:row-span-2"
              >
                <AdsImage adsId={item.id} />
              </li>
            ))}
          </ul>
        </ImageProvider>
      ) : (
        <div className="w-full h-[calc(100vh_-_120px)] flex items-center justify-center">
          <span className="text-sm -tracking-wide text-zinc-700">
            Ainda não existe anúncios para {branch?.razao}
          </span>
        </div>
      )}

      <Dialog
        open={!!selectedAds}
        onOpenChange={(event) => event === false && handleCloseModal()}
      >
        <DialogContent>
          {selectedAds ? (
            <>
              <div className="flex items-center justify-between">
                <DialogClose
                  onClick={() => setSelectedAds(null)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" weight="bold" />
                  <span className="sr-only">Close</span>
                </DialogClose>

                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          onClick={() => setOpenLightbox(true)}
                          className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300 font-urbanist"
                        >
                          <Pencil
                            className="w-4 h-4 text-blue-500"
                            weight="bold"
                            size={18}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Editar anúncio</p>
                      </TooltipContent>
                    </Tooltip>

                    <RemoveBranch id={selectedAds.id} />
                  </TooltipProvider>
                </div>
              </div>

              <DialogHeader>
                <DialogTitle>{selectedAds.conteudo}</DialogTitle>
                <DialogDescription>
                  Veja informações sobre o anúncio {selectedAds.conteudo}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2.5 grid-rows-8 h-96 mt-5">
                <div className="row-span-2 rounded-3xl bg-green-200/50 hover:bg-green-200 transition-all duration-300 cursor-not-allowed flex gap-2.5 items-center justify-center px-5">
                  <Ticket size={20} weight="bold" color={green[700]} />

                  <p className="font-urbanist font-semibold text-sm text-green-700">
                    {selectedAds.cupom}
                  </p>
                </div>

                <div className="row-span-2 rounded-3xl bg-orange-200/50 hover:bg-orange-200 transition-all duration-300 cursor-not-allowed flex gap-2.5 items-center justify-center px-5">
                  <Timer size={20} weight="bold" color={orange[700]} />

                  <p className="font-urbanist text-sm font-semibold text-orange-700">
                    {dayjs(selectedAds.validade).format('DD/MM/YYYY')}
                  </p>
                </div>

                <div className="row-span-6 rounded-3xl bg-cyan-200/50 hover:bg-cyan-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center px-10">
                  <CurrencyDollar size={20} weight="bold" color="#305a96" />

                  <p className="text-[11px] font-medium tracking-wide text-cyan-700 my-5">
                    VALOR MÁXIMO
                  </p>

                  <p className="font-urbanist font-semibold text-cyan-700">
                    R$ {selectedAds.valorMaximo}
                  </p>
                </div>

                <div className="rounded-3xl bg-yellow-200/50 hover:bg-yellow-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center row-span-3 px-10">
                  <p className="text-[11px] font-medium tracking-wide text-yellow-700 mb-2.5">
                    VALOR MÍNIMO
                  </p>

                  <p className="font-urbanist font-semibold text-yellow-700">
                    R$ {selectedAds.valorMinimo}
                  </p>
                </div>

                <div className="rounded-3xl bg-rose-200/50 hover:bg-rose-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center row-span-3 px-10">
                  <p className="text-[11px] font-medium tracking-wide text-rose-700 mb-2.5">
                    VALOR DE DESCONTO
                  </p>

                  <p className="font-urbanist font-semibold text-rose-700">
                    R$ {selectedAds.valorDesconto}
                  </p>
                </div>
              </div>

              {/** <footer className="flex items-center gap-5">
                <button
                  type="submit"
                  className="mt-5 h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-full rounded-md ring-2 ring-[#305a96]/50"
                >
                  <p className="-tracking-wide text-[13px] font-medium text-white">
                    Atualizar
                  </p>

                  <ArrowUpRight weight="bold" className="text-white" />
                </button>

                <RemoveBranch id={selectedAds?.id} />
              </footer> */}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
