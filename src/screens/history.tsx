import { useToast } from '@/components/ui/use-toast'

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
  ArrowUpRight,
  CircleNotch,
  CurrencyDollar,
  Ticket,
  Timer,
  Trash,
  X,
} from '@phosphor-icons/react'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@/hooks/use-mutation'
import { client } from '@/App'
import { Title } from '@/components/title'

export function History() {
  const { branch } = useBranch()
  const { toast } = useToast()

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

  /** REMOVE */
  const { isPending, mutate } = useMutation(
    ['remove-ads-by-id-mutation', String(selectedAds?.id)],
    async (id) => {
      const response = await api(`/anuncios/${id}`, {
        method: 'DELETE',
      })

      return response.status
    },
    async () => {
      toast({
        title: 'Removido com sucesso!',
        description: `O anúncio ${selectedAds?.conteudo} foi removido com sucesso!`,
        variant: 'success',
      })

      setSelectedAds(null)

      await client.invalidateQueries({
        queryKey: ['get-ads-by-branch-id-query'],
      })
    },
  )

  const handleCloseModal = useCallback(() => {
    setSelectedAds(null)
  }, [])

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="sm:w-[1120px] sm:mx-auto relative"
    >
      <header className="mt-10 mb-20 flex items-center justify-between">
        <Title>Seu histórico</Title>

        <span className="text-xs font-semibold font-urbanist text-zinc-700 dark:text-zinc-50">
          {ads?.length}
        </span>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-x-5 gap-y-4 pb-40 animate-pulse">
          <div className="group relative h-[355px] w-[355px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
          <div className="group relative h-[355px] w-[355px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
          <div className="group relative h-[355px] w-[355px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
          <div className="group relative h-[355px] w-[355px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
          <div className="group relative h-[355px] w-[355px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>

          <span className="sr-only">Loading...</span>
        </div>
      ) : ads && ads.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-5 gap-y-4 pb-40">
          {ads.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAds(item)}
              className="group relative h-[365px] w-[365px] bg-zinc-100 dark:bg-zinc-800/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"
            >
              <AdsImage adsId={item.id} />

              <div className="bg-zinc-800/20 backdrop-blur-md rounded-b-md w-full group-hover:opacity-100 absolute bottom-0 will-change-transform duration-300 p-5 opacity-0">
                <span className="text-sm text-zinc-50">{item.conteudo}</span>
              </div>
            </button>
          ))}
        </div>
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
          <DialogClose
            onClick={() => setSelectedAds(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedAds ? (
            <>
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

              <footer className="flex items-center gap-5">
                <button
                  type="submit"
                  className="mt-5 h-[50px] flex items-center justify-between px-5 bg-[#305a96] w-full rounded-md ring-2 ring-[#305a96]/50"
                >
                  <p className="-tracking-wide text-[13px] font-medium text-white">
                    Atualizar
                  </p>

                  <ArrowUpRight weight="bold" className="text-white" />
                </button>

                <button
                  onClick={() => mutate(selectedAds.id)}
                  className="mt-5 h-[50px] flex items-center justify-between px-5 bg-red-500 w-full rounded-md ring-2 ring-red-500/50"
                >
                  <p className="-tracking-wide text-[13px] font-medium text-white">
                    Remover anúncio
                  </p>

                  {isPending ? (
                    <CircleNotch
                      weight="bold"
                      size={20}
                      className="text-white animate-spin"
                    />
                  ) : (
                    <Trash weight="bold" className="text-white" />
                  )}
                </button>
              </footer>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
