import { api } from '@/data/api'
import { useMutation } from '@/hooks/use-mutation'
import { CircleNotch, Trash } from '@phosphor-icons/react'
import { useToast } from './ui/use-toast'
import { client } from '@/App'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
  id: number
}

export function RemoveBranch({ id }: Props) {
  const { toast } = useToast()

  const { isPending, mutate } = useMutation(
    ['remove-ads-by-id-mutation', String(id)],
    async (id) => {
      const response = await api(`/anuncios/${id}`, {
        method: 'DELETE',
      })

      return response.status
    },
    async () => {
      toast({
        title: 'Removido com sucesso!',
        description: `Anúncio removido com sucesso!`,
        variant: 'success',
      })

      // setSelectedAds(null)

      await client.invalidateQueries({
        queryKey: ['get-ads-by-branch-id-query'],
      })
    },
  )

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          onClick={() => mutate(id)}
          className="h-12 w-12 rounded-full hover:bg-zinc-200/50 flex items-center justify-center translate-all duration-300 font-urbanist"
        >
          {isPending ? (
            <CircleNotch
              weight="bold"
              size={20}
              className="text-white animate-spin"
            />
          ) : (
            <Trash className="w-4 h-4 text-red-500" weight="bold" size={18} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Remover anúncio</p>
      </TooltipContent>
    </Tooltip>
  )
}
