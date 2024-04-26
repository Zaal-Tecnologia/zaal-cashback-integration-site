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
import { CurrencyDollar, Pencil, Ticket, Timer, X } from '@phosphor-icons/react'
import { DialogClose } from '@radix-ui/react-dialog'

import { RemoveBranch } from '@/components/remove-branch'
import { ImageProvider } from '@/contexts/image'
import { Lightbox } from '@/components/lightbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUpdateForm } from '@/hooks/use-update-form'

import { useNavigate } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GoBackButton } from '@/components/go-back-button'

export function History() {
  const { branch } = useBranch()
  const navigate = useNavigate()
  const { setForm } = useUpdateForm()

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

  const [selectedAds, setSelectedAds] = useState<
    (AdsDTO & { src: string }) | null
  >(null)

  const handleCloseModal = useCallback(() => {
    setSelectedAds(null)
  }, [])

  const [openLightbox, setOpenLightbox] = useState(false)

  const handleCloseLightbox = useCallback(() => {
    setOpenLightbox(false)
  }, [])

  const handleGetDefaultValuesToUpdateForm = useCallback(() => {
    const [day, month, year] = selectedAds
      ? selectedAds.validade.split('-')
      : []

    setForm({
      ...selectedAds!,
      validade: `${year}-${month}-${day}`,
    })

    navigate('/ads', { replace: true })
  }, [navigate, selectedAds, setForm])

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="min-h-screen flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-700"
    >
      <ScrollArea className="w-full p-10">
        <header className="flex items-center w-full justify-start mb-10">
          <GoBackButton />
          <span className="ml-2.5 text-sm group-hover:translate-x-2 uppercase font-medium transition-transform duration-300">
            {branch ? `ANÚNCIOS DE ${branch?.razao}` : 'TODOS OS ANÚNCIOS'}
          </span>
        </header>

        {isLoading ? (
          <ul className="grid grid-cols-3 gap-2 animate-pulse w-full h-screen">
            <li className="flex flex-1 first:row-span-2 first:col-span-2 max-w-[350px] max-h-[350px] bg-zinc-100 dark:bg-zinc-700/50" />

            <span className="sr-only">Loading...</span>
          </ul>
        ) : ads && ads.length > 0 ? (
          <ImageProvider>
            <Lightbox onClose={handleCloseLightbox} open={openLightbox} />

            <ul className="grid grid-cols-3 gap-2">
              {ads.map((item) => (
                <li
                  key={item.id}
                  className="first:row-span-2 first:col-span-2 first:max-w-[400px] first:max-h-[400px]"
                >
                  <AdsImage
                    adsId={item.id}
                    onSelectAds={(src) => setSelectedAds({ ...item, src })}
                  />
                </li>
              ))}
            </ul>
          </ImageProvider>
        ) : (
          <div className="w-full h-[calc(100vh_-_120px)] flex items-center justify-center">
            <span className="text-sm -tracking-wide">
              Ainda não existe anúncios para {branch?.razao}
            </span>
          </div>
        )}
      </ScrollArea>

      <Dialog
        open={!!selectedAds}
        onOpenChange={(event) => event === false && handleCloseModal()}
      >
        <DialogContent className="max-w-[800px]">
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
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        onClick={handleGetDefaultValuesToUpdateForm}
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
                </div>
              </div>

              <DialogHeader>
                <DialogTitle>{selectedAds.conteudo}</DialogTitle>
                <DialogDescription>{selectedAds.descricao}</DialogDescription>
              </DialogHeader>

              <div className="flex items-center mt-5">
                <img
                  src={selectedAds.src}
                  alt=""
                  className="w-[300px] h-[300px] rounded-lg mr-5"
                />

                <div className="grid grid-cols-2 gap-2.5 grid-rows-8 h-[300px]">
                  <div className="row-span-2 rounded-lg bg-green-200/50 hover:bg-green-200 transition-all duration-300 cursor-not-allowed flex gap-2.5 items-center justify-center px-5">
                    <Ticket size={20} weight="bold" color={green[700]} />

                    <p className="font-urbanist font-semibold text-sm text-green-700">
                      {selectedAds.cupom}
                    </p>
                  </div>

                  <div className="row-span-2 rounded-lg bg-orange-200/50 hover:bg-orange-200 transition-all duration-300 cursor-not-allowed flex gap-2.5 items-center justify-center px-5">
                    <Timer size={20} weight="bold" color={orange[700]} />

                    <p className="font-urbanist text-sm font-semibold text-orange-700">
                      {dayjs(selectedAds.validade).format('DD/MM/YYYY')}
                    </p>
                  </div>

                  <div className="row-span-6 rounded-lg bg-cyan-200/50 hover:bg-cyan-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center px-10">
                    <CurrencyDollar size={20} weight="bold" color="#305a96" />

                    <p className="text-[11px] font-medium tracking-wide text-cyan-700 my-5">
                      VALOR MÁXIMO
                    </p>

                    <p className="font-urbanist font-semibold text-cyan-700">
                      R$ {selectedAds.valorMaximo}
                    </p>
                  </div>

                  <div className="rounded-lg bg-yellow-200/50 hover:bg-yellow-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center row-span-3 px-10">
                    <p className="text-[11px] font-medium tracking-wide text-yellow-700 mb-2.5">
                      VALOR MÍNIMO
                    </p>

                    <p className="font-urbanist font-semibold text-yellow-700">
                      R$ {selectedAds.valorMinimo}
                    </p>
                  </div>

                  <div className="rounded-lg bg-rose-200/50 hover:bg-rose-200 transition-all duration-300 cursor-not-allowed flex flex-col justify-center row-span-3 px-10">
                    <p className="text-[11px] font-medium tracking-wide text-rose-700 mb-2.5">
                      VALOR DE DESCONTO
                    </p>

                    <p className="font-urbanist font-semibold text-rose-700">
                      {selectedAds.tipoDesconto === 'PORCENTAGEM'
                        ? `${selectedAds.valorDesconto}%`
                        : `R$ ${selectedAds.valorDesconto}`}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
