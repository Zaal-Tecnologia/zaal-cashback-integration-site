import { Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'

import { MenuItem } from './menu-item'

export function Theme() {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('@zaalcashback:theme') || 'light',
  )

  function toggleTheme() {
    document.documentElement.classList.toggle('dark')

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <MenuItem.Root onAction={toggleTheme}>
      {theme === 'dark' ? (
        <Moon size={20} weight="bold" />
      ) : (
        <Sun size={20} weight="bold" />
      )}
      <MenuItem.Title>TEMA</MenuItem.Title>
    </MenuItem.Root>
  )
}
