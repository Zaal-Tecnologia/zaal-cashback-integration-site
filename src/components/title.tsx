import { ComponentProps } from 'react'

export function Title(props: ComponentProps<'h3'>) {
  return (
    <h3 className="text-2xl -tracking-wider font-light text-zinc-700 dark:text-zinc-50">
      {props.children}
    </h3>
  )
}
