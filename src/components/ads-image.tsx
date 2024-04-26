import { api } from '@/data/api'

import { useToast } from './ui/use-toast'

import { useQuery } from '@/hooks/use-query'

import { useImage } from '@/contexts/image'
// import { AdsDTO } from '@/@types/dto/ads-dto'

interface Props {
  adsId: number
  onSelectAds(src: string): void
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

  return (
    <button
      onClick={() => props.onSelectAds(URL.createObjectURL(data as Blob))}
      className="flex flex-1 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {data ? <img src={URL.createObjectURL(data as Blob)} alt="" /> : null}
    </button>
  )
}
