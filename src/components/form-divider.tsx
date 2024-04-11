import clsx from 'clsx'
import { ComponentProps } from 'react'

function FormDivider(props: ComponentProps<'div'>) {
  return (
    <div className={clsx('flex items-center space-x-2', props.className)}>
      {props.children}
    </div>
  )
}

function FormDividerTitle(props: ComponentProps<'div'> & { position: string }) {
  return (
    <div className="flex items-center rounded-full h-8 pl-[3px] pr-5">
      <div className="h-6 w-6 bg-zinc-800 dark:bg-white flex items-center justify-center rounded-full mr-2.5">
        <span className="text-[12px] text-white dark:text-zinc-800 font-bold font-urbanist">
          {props.position}
        </span>
      </div>
      <span className="text-[11px] text-zinc-700 font-semibold dark:text-white">
        {props.children}
      </span>
    </div>
  )
}

function FormDividerLine() {
  return <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-700"></div>
}

export { FormDivider, FormDividerTitle, FormDividerLine }
