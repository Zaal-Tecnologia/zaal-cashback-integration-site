import { useEffect, useState } from 'react'

import { useBranch } from '@/hooks/use-branch'

import { api } from '@/data/api'

import type { BranchDTO } from '@/@types/dto/branch-dto'

interface Props extends Pick<BranchDTO, 'id' | 'razao'> {}

export function BranchImage(props: Props) {
  const { branch } = useBranch()

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
    <div className="relative group h-16 rounded-full w-16 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200/50  dark:group-hover:bg-zinc-800/50">
      {branch?.id === props.id ? (
        <div className="absolute bottom-6 -left-7 ring-4 ring-white dark:ring-zinc-950 h-3 w-3 bg-[#305a96] rounded-full"></div>
      ) : null}

      {logo ? (
        <img
          src={`data:image/png;base64, ${logo}`}
          alt=""
          className="h-14 w-14 rounded-full group-hover:scale-110 transition-all duration-300"
        />
      ) : (
        <span className="text-[13px] font-medium uppercase text-zinc-700 dark:text-white">
          {props.razao.slice(0, 2)}
        </span>
      )}
    </div>
  )
}
