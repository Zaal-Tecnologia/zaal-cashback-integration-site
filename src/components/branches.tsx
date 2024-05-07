import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useBranch } from '@/hooks/use-branch'

import { api } from '@/data/api'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useInfiniteQuery } from '@tanstack/react-query'
import { BranchImage } from './branch-image'
import { BranchDTO } from '@/@types/dto/branch-dto'
// import { keepPreviousData } from '@tanstack/react-query'

export function Branches() {
  const { setBranch, branch } = useBranch()

  const [page, setPage] = useState(0)

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['get-all-branches-query'],
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        const response = await api(`filiais?size=6&page=${pageParam}`)

        const json = await response.json()

        return json
      },
      getNextPageParam: (lastPage) => lastPage.number + 1,
    })

  /** useEffect(() => {
    if (data && branch === null) setBranch(data.content[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, branch]) */

  // return null

  return (
    <div className="col-span-3 overflow-hidden min-h-screen h-auto p-10 border-x border-zinc-200 dark:border-zinc-700 flex flex-col">
      <header className="flex items-center justify-between mb-10">
        <span className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300">
          FILIAIS
        </span>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-start gap-1.5 mr-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled={page < 1}
                  onClick={() =>
                    setPage((prev) => (prev >= 1 ? prev - 1 : prev))
                  }
                  className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
                >
                  <CaretLeft weight="bold" size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Voltar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  // disabled={page === data?.totalPages}
                  onClick={() => {
                    fetchNextPage()

                    setPage((prev) => prev + 1)
                  }}
                  className="disabled:opacity-60 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
                >
                  <CaretRight weight="bold" size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Avançar</TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="branch"
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
              >
                <Plus weight="bold" size={14} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Nova filial</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <ul>
        {isLoading ? (
          <>
            <li className="animate-pulse flex items-center gap-x-5 group cursor-pointer h-16">
              <div className="relative group bg-zinc-200/50 rounded-md w-[35px] h-[35px] flex items-center justify-center" />

              <div className="flex flex-col items-start">
                <span className="h-[14px] w-40 bg-zinc-200/50 mb-1.5 rounded"></span>
                <span className="h-[12px] w-32 bg-zinc-200/50 rounded"></span>
              </div>
            </li>

            <li className="animate-pulse flex items-center gap-x-5 group cursor-pointer h-16">
              <div className="relative group bg-zinc-200/50 rounded-md w-[35px] h-[35px] flex items-center justify-center" />

              <div className="flex flex-col items-start">
                <span className="h-[14px] w-40 bg-zinc-200/50 mb-1.5 rounded"></span>
                <span className="h-[12px] w-32 bg-zinc-200/50 rounded"></span>
              </div>
            </li>
          </>
        ) : (
          <>
            {data &&
              !isFetchingNextPage &&
              data.pages[page].content.map((item: BranchDTO) => (
                <Link key={item.id} to="/main">
                  <li
                    data-selected={!branch ? true : item.id === branch?.id}
                    className="relative flex items-center group space-x-5 h-16 hover:data-[selected='false']:opacity-100 transition-[opacity] duration-300"
                  >
                    <BranchImage id={item.id} razao={item.razao} />
                    <button
                      className="flex-1 flex items-center gap-x-5 group cursor-pointer"
                      onClick={() =>
                        item.id === branch?.id
                          ? setBranch(null)
                          : setBranch(item)
                      }
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium capitalize -tracking-wide">
                          {item.razao.toLowerCase()}
                        </span>

                        <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5 font-medium">
                          {item.endereco.cidadeNome}
                        </span>
                      </div>
                    </button>

                    {item.id === branch?.id && (
                      <div className="hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center">
                        <CaretRight size={14} weight="bold" />
                      </div>
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
