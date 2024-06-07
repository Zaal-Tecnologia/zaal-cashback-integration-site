/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Outlet } from 'react-router-dom'
import { Storefront, CaretDown, MagnifyingGlass } from '@phosphor-icons/react'

import { Toaster } from '@/components/ui/toaster'

import { MenuItem } from './menu-item'

export function Layout() {
  return (
    <div className="w-screen min-h-screen bg-[#fefefe] dark:bg-zinc-900">
      <Toaster />

      <aside className="fixed left-0 top-0 bottom-0 w-[18%] overflow-hidden px-2.5 bg-white/25 dark:bg-zinc-900 flex flex-col items-start border-r border-zinc-200 dark:border-zinc-700">
        <header className="h-12 flex items-center w-full">
          <img src="/logo-preto.png" alt="" className="h-[25px] w-[25px]" />

          <button className="flex items-center justify-center ml-2 gap-1.5">
            <span className="text-xs font-semibold -tracking-[0.01]">
              Grupo 101
            </span>

            <CaretDown className="text-xs" weight="bold" />
          </button>
        </header>

        <form
          action=""
          className="flex items-center border border-zinc-100 hover:border-[#305a96]/20 hover:focus-within:border-[#305a96] focus-within:border-[#305a96] h-8 w-full bg-zinc-100 rounded-md outline-none text-xs font-medium px-1.5 placeholder:text-zinc-500 placeholder:text-[11px]"
        >
          <MagnifyingGlass size={13} weight="bold" />
          <input
            type="text"
            className="h-[28px] w-full bg-inherit outline-none border-inherit pl-1.5"
            placeholder="Pesquise por filial"
          />
        </form>

        <nav className="flex flex-col items-start w-full mt-2.5">
          <MenuItem.Root to={['branches', 'ads']}>
            <Storefront size={16} weight="bold" className="mb-[1.5px]" />
            <MenuItem.Title>Filiais</MenuItem.Title>
          </MenuItem.Root>

          {/** <MenuItem.Root to="/profile/change-group-name">
              <User size={20} weight="bold" />
              <MenuItem.Title>PERFIL</MenuItem.Title>
        
            </MenuItem.Root> */}
        </nav>
      </aside>

      <div className="ml-[18%] relative flex z-50 h-screen bg-[#fefefe] dark:bg-zinc-900">
        <Outlet />

        {/** {pathname.split('/')[1] !== 'profile' ? (
          <Branches />
        ) : (
          <ProfileActions />
        )}

        <ScrollArea className="mt-14">
          <Outlet />
        </ScrollArea> */}
      </div>
    </div>
  )
}
