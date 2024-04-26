import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export function Logout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('@zaalcashback:token')

    navigate('/')
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="flex items-start flex-col relative px-10 min-h-screen border-r border-zinc-200 dark:border-zinc-800"
    >
      <header className="mt-10 mb-12 flex flex-col items-start">
        <h1 className="font-bold text-2xl -tracking-wide font-urbanist">
          Deseja mesmo sair?
        </h1>
        <span className="text-[13px] mt-2.5">
          Ao sair você vai perder todos os seus cookies, para recuperar é
          necessário fazer login novamente.
        </span>
      </header>

      <button
        onClick={handleLogout}
        className="h-10 px-8 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 dark:bg-red-700/40 flex items-center space-x-2"
      >
        <span className="text-[13px] text-white">SAIR</span>
      </button>
    </motion.div>
  )
}
