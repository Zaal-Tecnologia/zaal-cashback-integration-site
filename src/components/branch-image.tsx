import { Image } from '@phosphor-icons/react'

import { useQuery } from '@/hooks/use-query'
// import { useToast } from './ui/use-toast'

import { api } from '@/data/api'

import type { BranchDTO } from '@/@types/dto/branch-dto'

interface Props extends Pick<BranchDTO, 'id' | 'razao'> {}

export function BranchImage(props: Props) {
  /**  const [logo, setLogo] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function getBranchLogo() {
      const response = await api(`filiais/${props.id}/logo`, {
        headers: {
          'Content-Type': 'image/png',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar a imagem'.concat(response.statusText))
      }

      const data = await response.blob()

      const reader = new FileReader()

      reader.onloadend = () => {
        const base = reader.result?.toString().split(',')[1]

        setLogo(base)
      }

      reader.readAsDataURL(data)
    }

    getBranchLogo()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) */

  // const { toast } = useToast()

  const { data } = useQuery(
    ['get-branch-image-query', String(props.id)],
    async () => {
      const response = await api(`filiais/${props.id}/logo`, {
        headers: {
          'Content-Type': 'image/png',
        },
      })

      if (!response.ok) {
        /** toast({
          title: 'Não foi possível carregar a imagem',
          description:
            'Houve um problema ao carregar a imagem, tente novamente mais tarde.',
          variant: 'error',
        }) */

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
      className="data-[logo=true]:bg-zinc-50 data-[logo=true]:rounded-md relative group w-[35px] h-[35px] min-w-[35px] min-h-[35px] flex items-center justify-center"
    >
      {data ? (
        <img
          src={URL.createObjectURL(data as Blob)}
          alt=""
          className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] transition-all duration-300 object-fill"
        />
      ) : (
        <span className="text-[13px] font-medium uppercase text-zinc-700 dark:text-white">
          <Image size={15} weight="bold" alt="" />
        </span>
      )}
    </div>
  )
}
