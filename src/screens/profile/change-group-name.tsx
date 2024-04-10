import { motion } from 'framer-motion'

export function ChangeGroupName() {
  // const name = localStorage.getItem('@zaalcashback:group-name')

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="flex items-start flex-col relative px-10"
    >
      <header className="mt-10 mb-12 flex flex-col items-start">
        <h1 className="font-bold text-2xl -tracking-wide font-urbanist">
          Alterar o nome do grupo
        </h1>
        <span className="text-[13px] text-zinc-700 mt-2.5">
          Altere o nome do grupo, preencha o campo abaixo.
        </span>
      </header>
    </motion.div>
  )
}
