import { CaretRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  { name: 'ESCOLHER TEMA ', action: '/profile/theme' },
  { name: 'ALTERAR NOME DO GRUPO', action: '/profile/change-group-name' },
  { name: 'SAIR', action: '/profile/logout' },
]

export function ProfileActions() {
  const navigate = useNavigate()

  const [action, setAction] = useState('ALTERAR NOME DO GRUPO')

  return (
    <div className="overflow-hidden shadow-sm col-span-3 border-x border-zinc-200 dark:border-zinc-700 flex flex-col pt-10">
      <header className="mb-20 flex flex-col items-start px-10">
        <strong className="text-2xl group-hover:translate-x-2 font-extrabold font-urbanist transition-transform duration-300">
          Perfil
        </strong>
        <span className="text-[13px] text-zinc-700 dark:text-zinc-200 mt-2.5">
          Configurações de perfil e mais
        </span>
      </header>

      <ul>
        {ACTIONS.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => {
                setAction(item.name)

                navigate(item.action)
              }}
              data-selected={item.name === action}
              className="data-[selected='true']:bg-[#305a96]/10 group hover:bg-[#305a96]/5 flex px-8 items-center justify-between w-full h-14 relative"
            >
              <span className="text-xs font-medium">{item.name}</span>

              <CaretRight size={16} weight="bold" />

              <div className="h-14 w-[2px] group-data-[selected='true']:visible invisible bg-[#305a96] absolute right-0"></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
