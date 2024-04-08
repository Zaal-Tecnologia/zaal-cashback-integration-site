import { SignOut } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

import { MenuItem } from './menu-item'

export function Logout() {
  const navigate = useNavigate()

  // const name = localStorage.getItem('@zaalcashback:group-name')

  function handleLogout() {
    localStorage.removeItem('@zaalcashback:token')

    navigate('/')
  }

  return (
    <MenuItem.Root onAction={handleLogout}>
      <SignOut size={20} weight="bold" />
      <MenuItem.Title>SAIR</MenuItem.Title>
    </MenuItem.Root>
  )
}
