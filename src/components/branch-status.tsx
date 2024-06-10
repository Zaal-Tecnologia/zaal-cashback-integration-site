import { api } from '@/data/api'
import { useQuery } from '@/hooks/use-query'

type AdsStatus = {
  anunciosRestantes: number
  anunciosAtivos: number
}

interface Props {
  id: number
}

export function BranchStatus(props: Props) {
  const { data } = useQuery<AdsStatus>(
    ['GET-BRANCH-ADS-STATUS-BY-ID-QUERY', String(props.id)],
    async () => {
      const response = await api(`filiais/${props.id}/status-anuncio`)

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      return data
    },
  )

  const statusArray = []

  for (const [status, count] of Object.entries(data || {})) {
    for (let i = 0; i < count; i++) {
      statusArray.push(status)
    }
  }

  return (
    <div className="bg-gradient-to-br gap-1 border grid grid-cols-3 grid-rows-2 p-2 border-zinc-100/50 dark:from-zinc-800 dark:to-zinc-800/50 dark:border-zinc-800 from-zinc-100 to-zinc-200/50 h-[140px] w-60 mb-2.5 rounded-lg">
      {statusArray.map((item, idx) => (
        <div
          key={item}
          data-inactive={item === 'anunciosRestantes'}
          data-active={item === 'anunciosAtivos'}
          className="shadow-inner flex items-center justify-center border-zinc-400/50 dark:border-zinc-700 first:rounded-tl [&:nth-last-child(3n)]:rounded-tr [&:nth-child(4n)]:rounded-bl data-[inactive=true]:bg-zinc-400/20 data-[active=true]:bg-green-500/20 flex-1"
        >
          <span className="text-sm font-urbanist font-bold text-zinc-700">
            {idx + 1}
          </span>
        </div>
      ))}
    </div>
  )
}
