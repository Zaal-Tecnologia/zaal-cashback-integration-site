import { motion } from 'framer-motion'

import { Title } from '@/components/title'
import { Theme } from '@/components/theme'
import { SignOut } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const navigate = useNavigate()

  const name = localStorage.getItem('@zaalcashback:group-name')

  function handleLogout() {
    localStorage.removeItem('@zaalcashback:token')

    navigate('/')
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="sm:w-[1120px] sm:mx-auto relative"
    >
      <header className="mt-10 mb-20 flex items-center justify-between">
        <Title>{name}</Title>
      </header>

      <div className="grid grid-cols-5 grid-rows-5 gap-5">
        <Theme />

        <button
          onClick={handleLogout}
          className="sm:flex min-h-28 items-start bg-zinc-50 rounded-md p-7 dark:bg-zinc-700/40 hidden flex-col justify-between"
        >
          <SignOut size={24} weight="bold" className="text-red-500" />
          <span className="text-[12px] text-red-500">SAIR</span>
        </button>
      </div>
    </motion.div>
  )
}
