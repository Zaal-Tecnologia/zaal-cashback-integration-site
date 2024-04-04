import { Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'

export function Theme() {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('@zaalcashback:theme') || 'light',
  )

  function toggleTheme() {
    document.documentElement.classList.toggle('dark')

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      onClick={toggleTheme}
      className="sm:flex min-h-28 items-start bg-zinc-50 rounded-md p-7 dark:bg-zinc-700/40 hidden flex-col justify-between"
    >
      {theme === 'dark' ? (
        <Moon size={24} weight="duotone" />
      ) : (
        <Sun size={24} weight="duotone" />
      )}
      <span className="text-[12px]">TROCAR TEMA</span>
    </button>
  )
}
