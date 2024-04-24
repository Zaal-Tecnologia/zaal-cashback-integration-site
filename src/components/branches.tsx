import { CaretLeft, CaretRight, Plus, X } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { BranchImage } from './branch-image'

import { useBranch } from '@/hooks/use-branch'
import { useQuery } from '@/hooks/use-query'

import { api } from '@/data/api'

import type { API } from '@/@types/dto/api'
import type { BranchDTO } from '@/@types/dto/branch-dto'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { keepPreviousData } from '@tanstack/react-query'

export function Branches() {
  const { setBranch, branch } = useBranch()

  const [page, setPage] = useState(0)

  const { data, isLoading, isPlaceholderData } = useQuery<API<BranchDTO>>(
    ['get-all-branches-query', String(page)],
    async () => {
      const response = await api(`filiais?size=6&page=${page}`)

      const json = await response.json()

      return json
    },
    {
      refetchOnMount: false,
      placeholderData: keepPreviousData,
    },
  )

  console.log(data)

  /** useEffect(() => {
    if (data) setBranch(data.content[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]) */

  const [info, setInfo] = useState(false)

  return (
    <div className="col-span-3 min-h-screen overflow-hidden pb-10 border-x border-zinc-200 dark:border-zinc-700 flex flex-col pt-10">
      <header className="flex items-center justify-between mb-20 px-8">
        <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
          FILIAIS
        </span>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-start gap-1.5 mr-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={page < 1}
                    onClick={() =>
                      setPage((prev) => (prev >= 1 ? prev - 1 : prev))
                    }
                    className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
                  >
                    <CaretLeft weight="bold" size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Voltar</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={page === data?.totalPages}
                    onClick={() => {
                      if (!isPlaceholderData) {
                        setPage((old) => old + 1)
                      }
                    }}
                    /** onClick={() =>
                  setPage((prev) =>
                    prev === data?.totalPages ? prev : prev + 1,
                  )
                } */
                    className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
                  >
                    <CaretRight weight="bold" size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Avançar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="branch"
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
                >
                  <Plus weight="bold" size={14} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Nova filial</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <Dialog
        open={info}
        // onOpenChange={(event) => event === false && handleCloseModal()}
      >
        {info && (
          <DialogContent>
            <DialogClose
              onClick={() => setInfo(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" weight="bold" />
              <span className="sr-only">Close</span>
            </DialogClose>

            <div className="duration-300 flex-col flex gap-2.5 py-5 h-auto w-full">
              {branch && (
                <>
                  <DialogHeader>
                    <DialogTitle>{branch?.razao}</DialogTitle>
                    <DialogDescription>
                      Veja informações sobre o anúncio {branch?.razao}.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="w-full bg-zinc-200 h-[1px] my-5"></div>

                  <p className="text-xs text-zinc-700 font-medium">
                    {branch.cnpj.replace(
                      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                      '$1.$2.$3/$4-$5',
                    )}
                  </p>

                  <div className="flex flex-col my-5">
                    <p className="text-xs text-zinc-900 font-semibold block mb-2.5">
                      Descrição
                    </p>

                    <p className="text-xs text-zinc-700 font-medium">
                      {branch.descricao}.
                    </p>
                  </div>

                  <div className="flex flex-col mb-5">
                    <p className="text-xs text-zinc-900 font-semibold block mb-2.5">
                      Categoria
                    </p>

                    <p className="text-xs text-zinc-700 font-medium">
                      {branch.categoria}.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-xs text-zinc-900 font-semibold block mb-2.5">
                      Endereço
                    </p>

                    <p className="text-xs text-zinc-700 font-medium">
                      {branch.endereco.paisNome}, {branch.endereco.cidadeNome},{' '}
                      {branch.endereco.uf}, {branch.endereco.bairro},{' '}
                      {branch.endereco.bairro}, {branch.endereco.numero},{' '}
                      {branch.endereco.logradouro}.
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <ul className="px-2.5 mb-10">
        {isLoading ? (
          <li className="animate-pulse flex items-center gap-x-5 group cursor-pointer">
            <div className="relative group bg-zinc-200/50 rounded-full w-[45px] h-[45px] flex items-center justify-center" />

            <div className="flex flex-col items-start">
              <span className="h-[14px] w-40 bg-zinc-200/50 mb-1.5 rounded-md"></span>
              <span className="h-[12px] w-32 bg-zinc-200/50 rounded-md"></span>
            </div>
          </li>
        ) : (
          <>
            {data?.content.map((item) => (
              <Link key={item.cnpj} to="/main">
                <li
                  data-selected={!branch ? true : item.id === branch?.id}
                  className="relative flex items-center group space-x-5 px-5 h-16 hover:data-[selected='false']:opacity-100 data-[selected='false']:opacity-70 transition-[opacity] duration-300"
                >
                  <BranchImage id={item.id} razao={item.razao} />
                  <button
                    className="w-full flex items-center gap-x-5 group cursor-pointer"
                    onClick={() =>
                      item.id === branch?.id ? setBranch(null) : setBranch(item)
                    }
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium capitalize -tracking-wide">
                        {item.razao.toLowerCase()}
                      </span>

                      <span className="text-xs text-zinc-500 block mt-0.5">
                        {item.endereco.cidadeNome}
                      </span>
                    </div>
                  </button>

                  {item.id === branch?.id && (
                    <button
                      className="group-data-[selected=true]:visible invisible h-12 w-12 rounded-full hover:bg-zinc-200/50 items-center justify-center translate-all duration-300 group-data-[selected='true']:flex hidden absolute right-2.5 top-2.5"
                      onClick={() => setInfo(true)}
                    >
                      <CaretRight size={16} weight="bold" />
                    </button>
                  )}
                </li>
              </Link>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}
