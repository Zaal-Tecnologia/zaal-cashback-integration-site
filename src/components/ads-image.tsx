import { ComponentProps, useMemo } from 'react'

import { api } from '@/data/api'
import { useQuery } from '@/hooks/use-query'

import { useToast } from './ui/use-toast'
import clsx from 'clsx'

interface Props extends ComponentProps<'img'> {
  adsId: number
  onSelectAds(src: string): void
}

export default function AdsImage(props: Props) {
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

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = function () {
          const res = reader.result as string

          resolve(res?.split(',')[1])
        }
        reader.onerror = function (error) {
          reject(error)
        }

        reader.readAsDataURL(data)
      })
    },
  )

  const src = useMemo(() => (data ? `data:;base64,${data}` : ''), [data])

  return data ? (
    <button onClick={() => props.onSelectAds(src)}>
      <img
        src={src}
        alt=""
        className={clsx(
          'object-cover transition-all duration-300 group-hover:blur-[2px]',
          props.className,
        )}
      />
    </button>
  ) : null
}
