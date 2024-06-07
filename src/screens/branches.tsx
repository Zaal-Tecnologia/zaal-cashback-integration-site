import { BranchDTO } from '@/@types/dto/branch-dto'
import { BranchDetails } from '@/components/branch-details'
import { BranchImage } from '@/components/branch-image'
import { CreateBranch } from '@/components/create-branch'
import { api } from '@/data/api'
import { useBranch } from '@/hooks/use-branch'
import { CaretDown } from '@phosphor-icons/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Branches() {
  const { setBranch } = useBranch()
  const navigate = useNavigate()

  const [page, setPage] = useState(0)

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['get-all-branches-query'],
      initialPageParam: 0,
      queryFn: async ({ pageParam = 0 }) => {
        const response = await api(`filiais?size=30&page=${pageParam}`)

        const json = await response.json()

        return json
      },
      getNextPageParam: (lastPage) => lastPage.number + 1,
    })

  return (
    <>
      <header className="h-12 fixed top-0 left-[18%] right-0 border-b flex items-center px-10 z-50 bg-white/50 backdrop-blur-md">
        <strong className="text-[13px] font-medium">Filiais</strong>

        <div className="h-6 w-[1px] bg-zinc-200 ml-8 mr-2.5"></div>

        <CreateBranch />
      </header>

      <div className="flex items-start p-10 h-auto mt-12">
        <div className="pb-10 relative">
          <BranchDetails />

          <div className="grid grid-cols-10">
            <ul className="grid col-span-7 grid-cols-3 gap-x-3 gap-y-10 pb-10">
              {isLoading ? (
                <li className="animate-pulse">
                  <div className="bg-gradient-to-br border border-zinc-100/50 from-zinc-100 to-zinc-200/50 h-32 w-60 mb-2.5 rounded-lg"></div>

                  <div className="flex items-center gap-1.5">
                    <div className="h-[35px] w-[35px] min-w-[35px] rounded-lg min-h-[35px]  bg-zinc-200 dark:bg-zinc-700" />

                    <div className="flex flex-col ml-1.5 max-w-[60%]">
                      <div className="h-[13px] w-[100px] rounded bg-zinc-200 dark:bg-zinc-700 mb-[2px]" />
                      <div className="h-[11px] w-[35px] rounded bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                  </div>
                </li>
              ) : (
                data &&
                data.pages[page].content.map((item: BranchDTO) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setBranch(item)

                      navigate('/ads')
                    }}
                    className="cursor-pointer"
                  >
                    <div className="bg-gradient-to-br border border-zinc-100/50 from-zinc-100 to-zinc-200/50 h-32 w-60 mb-2.5 rounded-lg"></div>

                    <div className="flex items-center gap-1.5">
                      <BranchImage id={item.id} razao={item.razao} />

                      <div className="flex flex-col ml-1.5 max-w-[60%]">
                        <strong className="text-[13px] font-semibold truncate">
                          {item.razao}
                        </strong>
                        <p className="text-[11px] font-medium text-zinc-600 truncate">
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex items-center">
            <button
              className="gap-1.5 h-8 px-2.5 rounded-full w-44 flex items-center justify-center bg-zinc-100 mr-2.5 hover:bg-zinc-200/50"
              onClick={() => setPage((prev) => prev + 1)}
            >
              <span className="text-xs font-medium">
                Carregar mais{' '}
                {data ? data.pages[0].totalElements - (page + 1) * 10 : 0}
              </span>

              <CaretDown weight="bold" size={14} />
            </button>

            <div className="h-[1px] w-full bg-zinc-200"></div>
          </div>
        </div>
      </div>
    </>
  )
}
