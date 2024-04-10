/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FlagBanner, ArrowUpRight, User } from '@phosphor-icons/react'

import { Toaster } from '@/components/ui/toaster'

import { Branches } from './branches'
import { MenuItem } from './menu-item'
import { ScrollArea } from './ui/scroll-area'
import { ProfileActions } from './profile-actions'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="w-screen min-h-screen bg-[#fefefe] dark:bg-zinc-800">
      <Toaster />

      <div className="sm:max-w-[1180px] h-screen sm:mx-auto sm:w-screen dark:bg-zinc-800 grid grid-cols-10">
        <aside className="overflow-hidden relative bg-white/25 pr-10 pl-4 dark:bg-zinc-800 backdrop-blur-md flex flex-col items-start col-span-2 py-10">
          <img src={'/logo-preto.png'} alt="" className="h-[45px] w-[45px]" />

          <nav className="mt-20 flex flex-col items-start gap-y-7 w-full">
            <MenuItem.Root to="history">
              <FlagBanner size={20} weight="bold" />
              <MenuItem.Title>ANÚNCIOS</MenuItem.Title>
            </MenuItem.Root>

            <MenuItem.Root to="/profile/change-group-name">
              <User size={20} weight="bold" />
              <MenuItem.Title>PERFIL</MenuItem.Title>
            </MenuItem.Root>

            <Link
              to="ads"
              className="h-14 px-7 mt-5 flex items-center justify-between bg-[#305a96] ring-4 ring-[#305a96]/40 hover:bg-[#305a96]/90 rounded-full w-full"
            >
              <span className="text-sm text-white group-hover:translate-x-2 transition-transform duration-300">
                CRIAR
              </span>

              <ArrowUpRight size={16} className="text-white" weight="bold" />
            </Link>
          </nav>
        </aside>

        {pathname.split('/')[1] !== 'profile' ? (
          <Branches />
        ) : (
          <ProfileActions />
        )}

        <ScrollArea className="col-span-5">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  )
}
