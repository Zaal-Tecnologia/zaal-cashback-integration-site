/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import { white } from 'tailwindcss/colors'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Toaster } from '@/components/ui/toaster'

import { Branches } from './branches'

const MESSAGE = {
  ads: 'Criar anúncio',
  history: 'Seu histórico',
}

export function Layout() {
  const { pathname } = useLocation()

  const path = pathname.replace('/', '')

  const itemRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleScroll() {
      const position = window.scrollY

      if (position > 40) {
        if (itemRef.current) {
          itemRef.current.style.opacity = '1'
        }
      } else {
        if (itemRef.current) {
          itemRef.current.style.opacity = '0'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="sm:max-w-[1120px] sm:mx-auto sm:w-screen">
      <Toaster />

      <header className="bg-white/25 dark:bg-zinc-950/50 z-40 backdrop-blur-md fixed top-0 left-0 right-0">
        <div className="h-20 w-[1120px] mx-auto flex items-center justify-between">
          <div className="flex items-center px-5 sm:px-0">
            <img src="/logo-preto.png" alt="" className="h-[45px] w-[45px]" />

            <span
              ref={itemRef}
              className="text-sm text-zinc-700 dark:text-zinc-50 ml-5"
            >
              {/** @ts-ignore */}
              {MESSAGE[path]}
            </span>
          </div>

          <nav className="flex items-center">
            <Link
              to="/history"
              className={clsx(
                'flex items-center mr-2.5 h-8 px-2.5 hover:bg-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-md',
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
              <div className="ml-5 hover:opacity-90 transition-all duration-300 sm:flex hidden gap-2 ring-4 ring-[#305a96]/50 bg-[#305a96] h-10 px-5 items-center justify-center rounded-full">
                <Plus size={18} color={white} weight="bold" />
                <span className="text-xs text-white">Criar anúncio</span>
              </div>
            </Link>

            {/** <Theme /> */}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    to="/profile"
                    className="ml-7 h-8 w-8 hover:opacity-90 border-2 border-[#305a96] rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs text-zinc-800 font-medium">A</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Andres dos Santos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>

      {/** <button className="sm:flex hidden gap-2 ring-4 ring-yellow-100/50 bg-yellow-300 h-14 w-14 fixed bottom-10 right-10 items-center justify-center rounded-full">
        <ShootingStar size={20} color={yellow[600]} weight="duotone" />
      </button> */}

      <main className="mt-24">
        <Outlet />
      </main>
    </div>
  )
}
