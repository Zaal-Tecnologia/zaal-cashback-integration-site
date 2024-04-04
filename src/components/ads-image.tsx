import { Images } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { api } from '@/data/api'

import { useToast } from './ui/use-toast'

interface Props {
  adsId: number
}

export function AdsImage(props: Props) {
  const { toast } = useToast()

  const [image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function getBranchLogo() {
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

        return
      }

      const data = await response.blob()

      const reader = new FileReader()

      reader.onloadend = () => {
        const base = reader.result?.toString().split(',')[1]

        setImage(base)
      }

      reader.readAsDataURL(data)
    }

    getBranchLogo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const data = null

  return (
    <div className="relative h-[350px] w-[350px] rounded-3xl flex items-center justify-center bg-contain">
      {image ? (
        <img
          src={`data:image/png;base64, ${image}`}
          alt=""
          className="h-[320px] w-[320px] rounded"
        />
      ) : (
        <div className="flex flex-col items-center">
          <Images weight="duotone" size={25} />
        </div>
      )}
    </div>
  )
}
