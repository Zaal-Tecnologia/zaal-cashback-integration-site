/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Outlet } from 'react-router-dom'
import { Storefront } from '@phosphor-icons/react'

import { Toaster } from '@/components/ui/toaster'
import { Theme } from '@/components/theme'

import { MenuItem } from './menu-item'

export function Layout() {
  const groupName = window.localStorage.getItem('@zaalcashback:group-name')

  return (
    <div className="w-screen min-h-screen bg-[#fefefe] dark:bg-zinc-900">
      <Toaster />

      <aside className="fixed left-0 top-0 bottom-0 w-[18%] overflow-hidden px-2.5 bg-white/25 dark:bg-zinc-900 flex flex-col items-start border-r border-zinc-200 dark:border-zinc-700">
        <header className="h-12 flex items-center w-full">
          <img src="/logo-preto.png" alt="" className="h-[25px] w-[25px]" />

          <button className="flex items-center justify-center ml-2 gap-1.5">
            <span className="text-xs font-semibold -tracking-[0.01]">
              Grupo {groupName}
            </span>
          </button>
        </header>

        <nav className="flex flex-col items-start w-full mt-2.5">
          <MenuItem.Root to={['branches', 'ads']}>
            <Storefront size={16} weight="bold" className="mb-[1.5px]" />
            <MenuItem.Title>Filiais</MenuItem.Title>
          </MenuItem.Root>

          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold mt-5 mb-2.5">
            Configurações
          </span>

          <Theme />
        </nav>
      </aside>

      <div className="ml-[18%] relative flex z-50 min-h-screen h-auto bg-[#fefefe] dark:bg-zinc-900">
        <Outlet />
      </div>
    </div>
  )
}
