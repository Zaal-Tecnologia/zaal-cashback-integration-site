import { ComponentProps } from 'react'

function Root(props: ComponentProps<'div'>) {
  return (
    <div
      className="border-b pb-2.5 mt-10 flex items-center gap-2 dark:border-b-zinc-700"
      {...props}
    >
      {props.children}
    </div>
  )
}

function Title(props: ComponentProps<'span'>) {
  return (
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-100">
      {props.children}
    </span>
  )
}

export const FormSession = {
  Root,
  Title,
}
