import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import { white } from 'tailwindcss/colors'
import { Toaster } from '@/components/ui/toaster'

import { Theme } from './theme'
import { Branches } from './branches'
import clsx from 'clsx'

export function Layout() {
  const { pathname } = useLocation()

  const path = pathname.replace('/', '')

  const [menu, setMenu] = useState(false)

  return (
    <>
      <Toaster />

      <aside
        data-menu={menu}
        className="data-[menu=true]:fixed data-[menu=false]:hidden inset-0 z-10"
      >
        <div className="border-r h-screen fixed w-[40%] left-0 bg-white"></div>
        <button
          onClick={() => setMenu(false)}
          className="w-[60%] fixed right-0 backdrop-blur-sm bg-zinc-50/50 h-screen"
        ></button>
      </aside>

      <header className="py-7 sm:w-screen flex items-center justify-between sm:max-w-[1120px] sm:mx-auto">
        <div className="flex items-center px-5 sm:px-0">
          <img src="/logo-preto.png" alt="" className="h-[60px] w-[60px]" />
        </div>

        <nav className="flex items-center space-x-5">
          {/** <Link
            to="/history"
            className={clsx(
              'flex items-center h-10 px-5 hover:bg-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full',
              {
                'bg-zinc-100 dark:bg-zinc-800': path === '',
              },
            )}
          >
            <span className="sm:flex hidden text-xs tracking-wider">
              DASHBOARD
            </span>
          </Link> */}

          <Theme />

          <Link
            to="/history"
            className={clsx(
              'flex items-center h-10 px-5 hover:bg-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full',
              {
                'bg-zinc-100 dark:bg-zinc-800': path === 'history',
              },
            )}
          >
            <span className="sm:flex hidden text-xs tracking-wider">
              HISTÓRICO
            </span>
          </Link>

          <Branches />

          <Link to="ads">
            <div className="sm:flex hidden gap-2 ring-4 ring-[#305a96]/50 bg-[#305a96] h-10 px-5 items-center justify-center rounded-full">
              <Plus size={18} color={white} weight="bold" />
              <span className="text-xs text-white">Criar anúncio</span>
            </div>
          </Link>
        </nav>
      </header>

      {/** <button className="sm:flex hidden gap-2 ring-4 ring-yellow-100/50 bg-yellow-300 h-14 w-14 fixed bottom-10 right-10 items-center justify-center rounded-full">
        <ShootingStar size={20} color={yellow[600]} weight="duotone" />
      </button> */}

      <Outlet />
    </>
  )
}
