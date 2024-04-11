import { Info, Plus, X } from '@phosphor-icons/react'
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

export function Branches() {
  const { setBranch, branch } = useBranch()

  const { data, isLoading } = useQuery<API<BranchDTO>>(
    ['get-all-branches-query'],
    async (): Promise<API<BranchDTO>> => {
      const response = await api('filiais')

      const json = await response.json()

      return json
    },
    {
      refetchOnMount: false,
    },
  )

  /** useEffect(() => {
    if (data) setBranch(data.content[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]) */

  const [info, setInfo] = useState(false)

  return (
    <div className="overflow-hidden shadow-sm col-span-3 border-x border-zinc-200 dark:border-zinc-700 flex flex-col pt-10">
      <header className="flex items-center justify-between mb-20 px-8">
        <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
          SUAS FILIAIS
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="branch"
                className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300"
              >
                <Plus weight="bold" size={18} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Nova filial</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

      <ul className="space-y-5 px-5">
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
              <li
                key={item.cnpj}
                data-selected={!branch ? true : item.id === branch?.id}
                className="relative flex justify-between items-center group space-x-5"
              >
                <BranchImage id={item.id} razao={item.razao} />
                <button
                  className="group-data-[selected='false']:opacity-70 transition-[opacity] duration-300 flex items-center gap-x-5 group cursor-pointer"
                  onClick={() =>
                    item.id === branch?.id ? setBranch(null) : setBranch(item)
                  }
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{item.razao}</span>
                    <span className="text-xs text-zinc-500 truncate max-w-[70%]">
                      {item.endereco.cidadeNome}, {item.endereco.bairro},{' '}
                      {item.endereco.logradouro}
                    </span>
                  </div>
                </button>

                <button
                  className="h-12 w-12 rounded-full hover:bg-zinc-200/50 items-center justify-center translate-all duration-300 group-data-[selected='true']:flex hidden absolute right-0 top-1"
                  onClick={() => setInfo(true)}
                >
                  <Info size={18} weight="bold" />
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}

/** <Sheet>
      <SheetTrigger asChild>
        <button
          className={clsx(
            'flex items-center h-8 px-2.5 mr-2.5 hover:bg-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700',
            {
              'rounded-full bg-zinc-100 dark:bg-zinc-800 px-0 pl-1 pr-5':
                !!branch,
              'rounded-md': !branch,
            },
          )}
        >
          {branch && (
            <span className="sm:flex text-[10px] items-center justify-center flex tracking-wider uppercase h-6 w-6 bg-[#305a96] text-white rounded-full mr-2.5">
              {branch.razao.slice(0, 2)}
            </span>
          )}
          <span className="relative sm:flex hidden text-xs tracking-wider uppercase truncate">
            {branch
              ? ` ${branch.razao.length > 9 ? `${branch.razao.slice(0, 9)}...` : branch.razao}`
              : 'FILIAIS'}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="px-20">
        <div className="flex items-center justify-between">
          <SheetClose
            data-create={create}
            className="data-[create=true]:pointer-events-none rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 outline-none disabled:pointer-events-none data-[state=open]:bg-secondary"
          >
            <ArrowLeft weight="bold" size={18} />
            <span className="sr-only">Close</span>
          </SheetClose>

          <button
            onClick={() => setCreate(true)}
            data-create={create}
            className="data-[create=true]:hidden h-14 rounded-full gap-5 pl-2 pr-8 justify-center bg-[#305a96] flex items-center cursor-pointer"
          >
            <div className="bg-white flex items-center justify-center rounded-full h-10 w-10">
              <Plus weight="bold" className="text-[#305a96]" size={18} />
            </div>

            <span className="text-xs text-white">Adicionar filial</span>
          </button>

          <button
            onClick={() => setCreate(false)}
            data-create={create}
            className="data-[create=true]:flex hidden h-14 rounded-full w-14 justify-center border border-zinc-200 items-center cursor-pointer dark:border-zinc-700"
          >
            <X weight="bold" size={18} />
          </button>
        </div>

        <SheetHeader>
          <SheetTitle>
            {create ? 'Crie uma nova filial' : 'Selecione uma filial'}
          </SheetTitle>
          <SheetDescription>
            {create
              ? 'Crie uma filial e comece a anunciar'
              : 'Ao selecionar uma filial pode adicionar anúncios nela.'}
          </SheetDescription>
        </SheetHeader>

        <div
          className="mt-10 data-[create=true]:flex flex-col hidden"
          data-create={create}
        >
          <CreateBranchForm onEnd={() => {}} />
        </div>

        <ul data-create={create} className="data-[create=true]:hidden mt-10">
          {isLoading && (
            <div className="animate-pulse">
              <div className="group relative h-14 w-14 mb-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
              <div className="group relative h-14 w-14 mb-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
              <div className="group relative h-14 w-14 mb-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
              <div className="group relative h-14 w-14 mb-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>
              <div className="group relative h-14 w-14 mb-5 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200/50"></div>

              <span className="sr-only">Loading...</span>
            </div>
          )}

          {data ? (
            data.content.map((item) => (
              <li
                key={item.id}
                className="mb-5 flex items-center cursor-pointer group"
                onClick={() => setBranch(item)}
              >
                <BranchImage id={item.id} razao={item.razao} />

                <div className="flex flex-col ml-5">
                  <span className="font-medium text-sm text-zinc-700 dark:text-white">
                    {item.razao}
                  </span>
                  <span className="text-xs text-zinc-500 mt-1 dark:text-zinc-300">
                    {item.endereco.cidadeNome}, {item.endereco.logradouro}
                  </span>
                </div>

                <ArrowUpRight size={14} className="ml-auto" weight="bold" />
              </li>
            ))
          ) : (
            <p>lista vazia</p>
          )}
        </ul>
      </SheetContent>
    </Sheet> */
