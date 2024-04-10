import { useEffect, useState } from 'react'

import { api } from '@/data/api'

import type { BranchDTO } from '@/@types/dto/branch-dto'

interface Props extends Pick<BranchDTO, 'id' | 'razao'> {}

export function BranchImage(props: Props) {
  const [logo, setLogo] = useState<string | undefined>(undefined)

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
  }, [])

  return (
    <div
      data-logo={!logo}
      className="data-[logo=true]:rounded-full data-[logo=true]:border border-zinc-900 relative group w-[45px] h-[45px] min-w-[45px] min-h-[45px] flex items-center justify-center"
    >
      {logo ? (
        <img
          src={`data:image/png;base64, ${logo}`}
          alt=""
          className="h-[45px] w-[45px] group-hover:scale-110 rounded-full min-w-[45px] min-h-[45px] transition-all duration-300 object-fill"
        />
      ) : (
        <span className="text-[13px] font-medium uppercase text-zinc-700 dark:text-white">
          {props.razao.slice(0, 2)}
        </span>
      )}
    </div>
  )
}
