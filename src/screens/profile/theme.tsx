import { CaretRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const THEMES = [
  { name: 'CLARO', key: 'light' },
  { name: 'ESCURO', key: 'dark' },
]

export function Theme() {
  const [theme, setTheme] = useState(
    localStorage.getItem('@zaalcashback:theme'),
  )

  function toggleTheme(theme: string) {
    const doc = document.documentElement

    setTheme(theme)

    if (theme === 'light' && doc.classList.contains('dark')) {
      doc.classList.remove('dark')
    }

    if (theme === 'dark') {
      doc.classList.add('dark')
    }
  }

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 200, opacity: 0 }}
      transition={{ type: 'time' }}
      className="flex items-start flex-col relative border-r border-r-zinc-200 dark:border-r-zinc-700 min-h-screen"
    >
      <header className="mt-10 mb-20 flex flex-col items-start px-10">
        <h1 className="font-bold text-2xl -tracking-wide font-urbanist">
          Tema
        </h1>
        <span className="text-[13px] text-zinc-700 dark:text-zinc-200 mt-2.5">
          Escolha uma tema para a sua aplicação
        </span>
      </header>

      <ul className="w-full">
        {THEMES.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => toggleTheme(item.key)}
              data-selected={item.key === theme}
              className="data-[selected='true']:bg-[#305a96]/10 group hover:bg-[#305a96]/5 flex px-8 items-center justify-between w-full h-14 relative"
            >
              <span className="text-xs font-medium">{item.name}</span>

              <CaretRight size={16} weight="bold" />

              <div className="h-14 w-[2px] group-data-[selected='true']:visible invisible bg-[#305a96] absolute right-0"></div>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
