import { BranchDTO } from '@/@types/dto/branch-dto'
import { BranchDetails } from '@/components/branch-details'
import { BranchImage } from '@/components/branch-image'
import { CreateBranch } from '@/components/create-branch'
import { SearchBranch } from '@/components/search-branch'
import { api } from '@/data/api'
import { useBranch } from '@/hooks/use-branch'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Branches() {
  const { setBranch } = useBranch()
  const navigate = useNavigate()

  const [page] = useState(0)

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['GET-ALL-BRANCHES-QUERY'],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api(`filiais?size=30&page=${pageParam}`)

      const json = await response.json()

      return json
    },
    getNextPageParam: (lastPage) => lastPage.number + 1,
  })

  console.log(data)

  return (
    <>
      <header className="h-12 fixed top-0 left-[18%] right-0 border-b flex items-center justify-between px-5 z-50 bg-white dark:bg-zinc-900">
        <div className="flex items-center">
          <strong className="text-[13px] font-medium text-nowrap text-ellipsis">
            Filiais
          </strong>

          <SearchBranch />
        </div>

        <CreateBranch />
      </header>

      <div className="flex flex-col items-start p-5 h-auto mt-12">
        <div className="pb-10 relative">
          <BranchDetails />

          <div className="grid grid-cols-10">
            <ul className="grid col-span-7 grid-cols-3 gap-x-3 gap-y-10 pb-10">
              {isLoading ? (
                <li className="animate-pulse">
                  <div className="bg-gradient-to-br from-zinc-100 to-zinc-200/50 dark:from-zinc-700 dark:to-zinc-700/50 h-32 w-60 mb-2.5 rounded-lg"></div>

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
                    <div className="bg-gradient-to-br border border-zinc-100/50 dark:from-zinc-800 dark:to-zinc-800/50 dark:border-zinc-800 from-zinc-100 to-zinc-200/50 h-32 w-60 mb-2.5 rounded-lg"></div>

                    <div className="flex items-center gap-1.5">
                      <BranchImage id={item.id} razao={item.razao} />

                      <div className="flex flex-col ml-1.5 max-w-[60%]">
                        <strong className="text-[13px] font-semibold truncate">
                          {item.razao}
                        </strong>
                        <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 truncate">
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
