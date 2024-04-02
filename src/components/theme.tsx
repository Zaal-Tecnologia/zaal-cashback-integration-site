import { Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'

export function Theme() {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('@zaal-cashback:theme') || 'light',
  )

  function toggleTheme() {
    document.documentElement.classList.toggle('dark')

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <button onClick={toggleTheme} className="sm:flex hidden">
      {theme === 'dark' ? (
        <Moon size={20} weight="duotone" />
      ) : (
        <Sun size={20} weight="duotone" />
      )}
    </button>
  )
}
