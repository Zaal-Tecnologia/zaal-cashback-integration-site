import { useQuery } from '@/hooks/use-query'

import { getRandomColor } from '@/utils/get-random-color'

import { api } from '@/data/api'

import type { BranchDTO } from '@/@types/dto/branch-dto'

interface Props extends Pick<BranchDTO, 'id' | 'razao'> {}

export function BranchImage(props: Props) {
  const { data, isLoading } = useQuery(
    ['get-branch-image-query', String(props.id)],
    async () => {
      const response = await api(`filiais/${props.id}/logo`)

      if (!response.ok) {
        return null
      }

      const data = await response.blob()

      const reader = new FileReader()

      reader.onloadend = () => {
        return reader.result?.toString().split(',')[1]
      }

      reader.readAsDataURL(data)

      return data
    },
    {
      refetchOnMount: false,
    },
  )

  return (
    <div
      data-logo={!data}
      className="data-[logo=true]:bg-zinc-50 dark:data-[logo=true]:bg-zinc-700/50 data-[logo=true]:rounded-md relative group w-[35px] h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center"
    >
      {data ? (
        <img
          src={URL.createObjectURL(data as Blob)}
          alt=""
          className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] transition-all duration-300 object-fill"
        />
      ) : !isLoading ? (
        <div
          className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] rounded-full flex items-center justify-center"
          style={{ backgroundColor: getRandomColor() }}
        >
          <span className="font-semibold text-white text-xs">
            {props.razao.split('')[0]}
          </span>
        </div>
      ) : (
        <div className="h-[35px] w-[35px] min-w-[35px] rounded-lg min-h-[35px] animate-pulse bg-zinc-200 dark:bg-zinc-700" />
      )}
    </div>
  )
}
