import { ComponentProps, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface RootProps {
  to?: string[]
  children: ReactNode
}

function Root({ to, ...props }: RootProps) {
  const { pathname } = useLocation()

  return (
    <Link
      to={to ? to[0] : ''}
      data-path={to?.includes(pathname.replace('/', ''))}
      className="font-medium flex items-center w-full h-8 dark:hover:bg-[#305a96]/20 rounded hover:text-zinc-900 dark:hover:text-zinc-200 gap-x-2.5 group data-[path=true]:bg-[#305a96]/5 dark:data-[path=true]:bg-[#305a96]/20 hover:bg-[#305a96]/5 px-2.5"
      {...props}
    >
      {props.children}
    </Link>
  )
}

function Title({ children, ...props }: ComponentProps<'span'>) {
  return (
    <span className="text-[13px]" {...props}>
      {children}
    </span>
  )
}

export const MenuItem = {
  Root,
  Title,
}
