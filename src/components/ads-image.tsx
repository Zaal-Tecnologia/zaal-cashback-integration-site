import { api } from '@/data/api'

import { useToast } from './ui/use-toast'

import { useQuery } from '@/hooks/use-query'

import { useImage } from '@/contexts/image'

interface Props {
  adsId: number
}

export function AdsImage(props: Props) {
  const { toast } = useToast()
  const { setImages } = useImage()

  const { data } = useQuery(
    ['get-image-query', String(props.adsId)],
    async () => {
      const response = await api(`anuncios/${props.adsId}/imagem`, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })

      if (!response.ok) {
        toast({
          title: 'Não foi possível carregar a imagem',
          description:
            'Houve um problema ao carregar a imagem, tente novamente mais tarde.',
          variant: 'error',
        })

        return null
      }

      const data = await response.blob()

      setImages(data as Blob)

      return data
    },
  )

  return data ? (
    <img
      className="ring-2 ring-zinc-200 rounded-md"
      // src={`data:image/png;base64, ${image}`}
      src={URL.createObjectURL(data as Blob)}
      alt=""
    />
  ) : (
    <div className="min-h-[160px] min-w-[160px] bg-zinc-100 dark:bg-zinc-700/50 rounded-md"></div>
  )
}
