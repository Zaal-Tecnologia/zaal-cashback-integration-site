import { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface RootProps {
  to?: 'history' | 'ads'
  onAction?: () => void
  children: ReactNode
}

function Root({ to, onAction, ...props }: RootProps) {
  return to ? (
    <Link
      to={to}
      className="flex items-center h-8 hover:text-zinc-900 dark:hover:text-zinc-200 gap-x-5 group"
      {...props}
    >
      {props.children}
    </Link>
  ) : (
    <button
      onClick={onAction!}
      className="flex items-center h-8 hover:text-zinc-900 dark:hover:text-zinc-200 gap-x-5 group"
      {...props}
    >
      {props.children}
    </button>
  )
}

function Title({ children, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className="text-sm group-hover:translate-x-2 font-medium transition-transform duration-300"
      {...props}
    >
      {children}
    </span>
  )
}

export const MenuItem = {
  Root,
  Title,
}
