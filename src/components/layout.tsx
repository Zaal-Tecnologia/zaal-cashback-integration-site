/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Outlet } from 'react-router-dom'
import { Sun, HourglassSimpleHigh, FlagBanner } from '@phosphor-icons/react'

import { Toaster } from '@/components/ui/toaster'

import { Branches } from './branches'
import { MenuItem } from './menu-item'
import { Logout } from './logout'
import { ScrollArea } from './ui/scroll-area'

export function Layout() {
  return (
    <div className="w-screen min-h-screen bg-[#fefefe] dark:bg-zinc-800">
      <Toaster />

      <div className="sm:max-w-[1180px] h-screen sm:mx-auto sm:w-screen dark:bg-zinc-800 grid grid-cols-10">
        <aside className="overflow-hidden relative bg-white/25 dark:bg-zinc-800 backdrop-blur-md flex flex-col items-start col-span-2 border-r py-10">
          <img src="/logo-preto.png" alt="" className="h-[45px] w-[45px]" />

          <nav className="mt-20 flex flex-col items-start space-y-7">
            <MenuItem.Root to="ads">
              <FlagBanner size={20} weight="bold" />
              <MenuItem.Title>ANÚNCIO</MenuItem.Title>
            </MenuItem.Root>

            <MenuItem.Root to="history">
              <HourglassSimpleHigh size={20} weight="bold" />
              <MenuItem.Title>HISTÓRICO</MenuItem.Title>
            </MenuItem.Root>

            <MenuItem.Root onAction={() => console.log('change theme')}>
              <Sun size={20} weight="bold" />
              <MenuItem.Title>TEMA</MenuItem.Title>
            </MenuItem.Root>

            <Logout />
          </nav>
        </aside>

        <Branches />

        <ScrollArea className="col-span-5">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  )
}
