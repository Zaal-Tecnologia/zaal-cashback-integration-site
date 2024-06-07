import { api } from '@/data/api'

import { useToast } from './ui/use-toast'

import { useQuery } from '@/hooks/use-query'
import { useMemo } from 'react'

interface Props {
  adsId: number
  onSelectAds(src: string): void
}

export function AdsImage(props: Props) {
  const { toast } = useToast()

  const { data } = useQuery(
    ['GET-IMAGE-QUERY', String(props.adsId)],
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

      // setImages(data as Blob)

      return data
    },
  )

  const src = useMemo(
    () => (data ? URL.createObjectURL(data as Blob) : ''),
    [data],
  )

  return data ? (
    <button onClick={() => props.onSelectAds(src)}>
      <img
        src={URL.createObjectURL(data as Blob)}
        alt=""
        className="object-cover transition-all duration-300 group-hover:blur-[2px]"
      />
    </button>
  ) : null
}
