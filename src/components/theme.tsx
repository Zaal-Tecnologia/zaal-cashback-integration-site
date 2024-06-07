import { Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'

const ICON = {
  dark: <Sun size={16} weight="bold" className="mb-[1.5px]" />,
  light: <Moon size={16} weight="bold" className="mb-[1.5px]" />,
}

export function Theme() {
  const theme = localStorage.getItem('@zaalcashback:theme')

  const [color, setColor] = useState<'light' | 'dark'>(
    (theme as 'light' | 'dark') || 'light',
  )

  function toggleTheme() {
    if (theme === 'light') {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      window.localStorage.setItem('@zaalcashback:theme', 'dark')
      setColor('dark')
    } else {
      document.body.classList.remove('dark')
      document.body.classList.add('light')
      window.localStorage.setItem('@zaalcashback:theme', 'light')
      setColor('light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="font-medium flex items-center w-full h-8 rounded hover:text-zinc-900 dark:hover:text-zinc-200 gap-x-2.5 group data-[path=true]:bg-[#305a96]/5 hover:bg-[#305a96]/5 dark:hover:bg-[#305a96]/20 px-2.5"
    >
      {ICON[color]}
      <span className="text-[13px]">Tema</span>
    </button>
  )
}
