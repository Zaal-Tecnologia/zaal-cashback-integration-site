import { api } from '@/data/api'
import { useMutation } from '@/hooks/use-mutation'
import { CircleNotch } from '@phosphor-icons/react'
import { useToast } from './ui/use-toast'
import { client } from '@/App'
import { white } from 'tailwindcss/colors'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Props {
  id: number
}

export function RemoveAd({ id }: Props) {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="h-8 px-5 bg-red-500 rounded-full hover:ring-4 hover:ring-red-500/20">
          {isPending ? (
            <CircleNotch size={20} weight="bold" color={white} />
          ) : (
            <p className="font-medium text-white text-xs">Remover</p>
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Se confirmar esse anúncio será removido completamente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-5">
          <AlertDialogCancel asChild>
            <button className="h-8 px-5 rounded-full border">
              <p className="font-medium text-zinc-900 text-xs">Cancelar</p>
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              className="h-8 px-5 bg-red-500 rounded-full hover:ring-4 hover:ring-red-500/20"
              onClick={() => mutate(id)}
            >
              <p className="font-medium text-white text-xs">Confirmar</p>
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
