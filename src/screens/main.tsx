import { useBranch } from '@/hooks/use-branch'
import { Plus, ProjectorScreenChart, Storefront } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { green, yellow } from 'tailwindcss/colors'

export function Main() {
  // const navigate = useNavigate()

  const { branch } = useBranch()

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="h-screen p-10 flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-800"
    >
      <header className="flex items-center w-full justify-start mb-20">
        <span className="text-sm group-hover:translate-x-2 uppercase font-medium transition-transform duration-300">
          {branch?.razao}
        </span>
      </header>

      {/** <div className="flex flex-col items-start w-full mb-10">
        <strong className="font-medium text-zinc-700 text-sm -tracking-wide">
          Descubra o que você pode fazer com sua filial
        </strong>
        <span className="text-xs text-zinc-500 text-left block mt-5">
          Explore o potencial máximo de cada uma delas
        </span>
      </div> */}

      <div className="grid grid-cols-2 grid-rows-8 gap-2.5 min-w-full min-h-[70%]">
        <Link
          to="/ads"
          className="rounded flex items-start justify-center flex-col border hover:shadow-lg dark:border-zinc-800 transition-all duration-300 row-span-4 p-10"
        >
          <div className="p-5 mb-5 rounded-full bg-[#305a96]/20">
            <Plus weight="bold" size={20} color="#305a96" />
          </div>

          <strong className="font-medium -tracking-wider">Criar anúncio</strong>

          <span className="text-xs text-zinc-500 text-left block mt-5">
            Crie novos anúncios e leve sua filial para o próximo nível.
          </span>
        </Link>

        <Link
          to="/history"
          className="rounded flex items-start justify-center flex-col border hover:shadow-lg dark:border-zinc-800 transition-all duration-300 row-span-4 p-10"
        >
          <div className="p-5 mb-5 rounded-full bg-yellow-500/20">
            <ProjectorScreenChart weight="bold" size={20} color={yellow[500]} />
          </div>

          <strong className="font-medium -tracking-wider">Ver anúncios</strong>

          <span className="text-xs text-zinc-500 text-left block mt-5">
            Veja seus anúncios criados para essa filial.
          </span>
        </Link>

        <Link
          to="/info"
          className="rounded flex items-start justify-center flex-col border hover:shadow-lg dark:border-zinc-800 transition-all duration-300 row-span-4 p-10"
        >
          <div className="p-5 mb-5 rounded-full bg-green-500/20">
            <Storefront weight="bold" size={20} color={green[500]} />
          </div>

          <strong className="font-medium -tracking-wider">Informações</strong>

          <span className="text-xs text-zinc-500 text-left block mt-5">
            Obtenha informações da sua filial, endereço, nome razão, CNPJ, etc.
          </span>
        </Link>
      </div>
    </motion.div>
  )
}
