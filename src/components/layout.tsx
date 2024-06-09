/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'
import { Theme } from '@/components/theme'

import { MenuItem } from './menu-item'
import { Logout } from './logout'

export function Layout() {
  const groupName = window.localStorage.getItem('@zaalcashback:group-name')

  return (
    <div className="w-screen min-h-screen bg-[#fefefe] dark:bg-zinc-900">
      <Toaster />

      <aside className="fixed left-0 top-0 bottom-0 w-[18%] overflow-hidden px-2.5 bg-white/25 dark:bg-zinc-900 flex flex-col items-start border-r border-zinc-200 dark:border-zinc-700">
        <header className="h-12 flex items-center w-full">
          <img
            loading="lazy"
            src="/logo-preto.png"
            alt=""
            className="h-[25px] w-[25px]"
          />

          <button className="flex items-center justify-center ml-2 gap-1.5">
            <span className="text-xs font-semibold -tracking-[0.01]">
              Grupo {groupName}
            </span>
          </button>
        </header>

        <nav className="flex flex-col items-start w-full">
          <span className="text-[9px] text-zinc-700 dark:text-zinc-400 uppercase tracking-wider font-semibold my-5">
            Ações
          </span>

          <MenuItem.Root to={['branches', 'ads']}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
            >
              <path
                d="M3 10.9871V15.4925C3 18.3243 3 19.7403 3.87868 20.62C4.75736 21.4998 6.17157 21.4998 9 21.4998H15C17.8284 21.4998 19.2426 21.4998 20.1213 20.62C21 19.7403 21 18.3243 21 15.4925V10.9871"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M15 16.9768C14.3159 17.584 13.2268 17.9768 12 17.9768C10.7732 17.9768 9.68409 17.584 9 16.9768"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M17.7957 2.50294L6.14983 2.53202C4.41166 2.44248 3.966 3.78259 3.966 4.43768C3.966 5.02359 3.89055 5.87774 2.82524 7.4831C1.75993 9.08846 1.83998 9.56536 2.44071 10.6767C2.93928 11.5991 4.20741 11.9594 4.86862 12.02C6.96883 12.0678 7.99065 10.2517 7.99065 8.97523C9.03251 12.1825 11.9955 12.1825 13.3158 11.8157C14.6385 11.4483 15.7717 10.1331 16.0391 8.97523C16.195 10.4142 16.6682 11.2538 18.0663 11.8308C19.5145 12.4284 20.7599 11.515 21.3848 10.9294C22.0096 10.3439 22.4107 9.04401 21.2967 7.6153C20.5285 6.63001 20.2084 5.7018 20.1032 4.73977C20.0423 4.18234 19.9888 3.58336 19.5971 3.20219C19.0247 2.64515 18.2035 2.47613 17.7957 2.50294Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <MenuItem.Title>Filiais</MenuItem.Title>
          </MenuItem.Root>

          <span className="text-[9px] text-zinc-700 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-10 mb-5">
            Configurações
          </span>

          <Theme />

          <span className="text-[9px] text-zinc-700 dark:text-zinc-400 uppercase tracking-wider font-semibold mt-10 mb-5">
            Conta
          </span>

          <Logout />
        </nav>
      </aside>

      <div className="ml-[18%] relative flex z-50 min-h-screen h-auto bg-[#fefefe] dark:bg-zinc-900">
        <Outlet />
      </div>
    </div>
  )
}
