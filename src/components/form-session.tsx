import { ComponentProps } from 'react'

function Root(props: ComponentProps<'div'>) {
  return (
    <div className="mb-10 flex items-center gap-2" {...props}>
      {props.children}
    </div>
  )
}

function Title(props: ComponentProps<'span'>) {
  return (
    <span className="text-xl -tracking-wider font-light text-zinc-700 dark:text-zinc-50">
      {props.children}
    </span>
  )
}

export const FormSession = {
  Root,
  Title,
}
