import { motion } from 'framer-motion'
import { NavigationArrow, Info as InfoIcon } from '@phosphor-icons/react'
import { yellow } from 'tailwindcss/colors'

import { useBranch } from '@/hooks/use-branch'

import { GoBackButton } from '@/components/go-back-button'

export function Info() {
  const { branch } = useBranch()

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="min-h-screen flex flex-col items-center border-r border-t border-zinc-200 dark:border-zinc-800 p-10"
    >
      {branch && (
        <>
          <header className="flex items-center w-full justify-start mb-20">
            <GoBackButton />

            <span className="ml-2.5 text-sm group-hover:translate-x-2 uppercase font-medium transition-transform duration-300">
              {branch ? `INFORMAÇÕES DE ${branch?.razao}` : 'TODOS OS ANÚNCIOS'}
            </span>
          </header>

          <div className="grid grid-cols-2 grid-rows-8 gap-2.5 min-w-full min-h-[70%]">
            <div className="col-span-2 rounded flex items-start justify-center flex-col border hover:shadow-lg dark:border-zinc-800 transition-all duration-300 row-span-4 p-10">
              <div className="p-5 mb-5 rounded-full bg-yellow-500/20">
                <InfoIcon weight="bold" size={20} color={yellow[500]} />
              </div>

              <strong className="font-medium -tracking-wider">Sobre</strong>

              <span className="text-xs font-medium leading-5 text-zinc-500 text-left block mt-5">
                {branch.cnpj.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                  '$1.$2.$3/$4-$5',
                )}
                , {branch.descricao}, {branch.categoria}.
              </span>
            </div>

            <div className="col-span-2 rounded flex items-start justify-center flex-col border hover:shadow-lg dark:border-zinc-800 transition-all duration-300 row-span-4 p-10">
              <div className="p-5 mb-5 rounded-full bg-[#305a96]/20">
                <NavigationArrow weight="bold" size={20} color="#305a96" />
              </div>

              <strong className="font-medium -tracking-wider">Endereço</strong>

              <span className="text-xs font-medium text-zinc-500 text-left block mt-5 capitalize leading-5">
                {branch.endereco.paisNome}, {branch.endereco.cidadeNome},{' '}
                {branch.endereco.uf}, {branch.endereco.bairro},{' '}
                {branch.endereco.bairro}, {branch.endereco.numero},{' '}
                {branch.endereco.logradouro}.
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
