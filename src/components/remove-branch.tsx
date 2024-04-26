import { api } from '@/data/api'
import { useMutation } from '@/hooks/use-mutation'
import { CircleNotch, Trash } from '@phosphor-icons/react'
import { useToast } from './ui/use-toast'
import { client } from '@/App'
import { white } from 'tailwindcss/colors'

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
    <button
      onClick={() => mutate(id)}
      className="group row-span-2 rounded-lg bg-red-500 transition-all duration-300 flex gap-2.5 items-center justify-center px-5"
    >
      {isPending ? (
        <CircleNotch size={20} weight="bold" color={white} />
      ) : (
        <Trash
          size={20}
          weight="bold"
          color={white}
          className="group-hover:translate-x-[32px] transition-all duration-300"
        />
      )}

      <p className="text-[13px] font-medium text-white transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-14">
        Remover
      </p>
    </button>
  )
}
