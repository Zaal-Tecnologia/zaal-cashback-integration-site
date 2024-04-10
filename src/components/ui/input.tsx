/* eslint-disable react/display-name */
import InputMask from 'react-input-mask'
import { ComponentProps, ElementRef, forwardRef } from 'react'

function Root(props: ComponentProps<'fieldset'>) {
  return (
    <fieldset className="flex flex-col w-full" {...props}>
      {props.children}
    </fieldset>
  )
}

function Label(
  props: ComponentProps<'label'> & {
    required?: boolean
    errorMessage?: string
  },
) {
  return (
    <label htmlFor="" className="text-xs mb-1" {...props}>
      {props.children}{' '}
      {!props.errorMessage && props.required ? (
        <span className="text-red-500">*</span>
      ) : null}
      {props.errorMessage ? (
        <span className="text-red-500 font-medium truncate">
          {props.errorMessage}
        </span>
      ) : null}
    </label>
  )
}

const Write = forwardRef<ElementRef<'input'>, ComponentProps<'input'>>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        className="text-[13px] focus:outline-none w-full flex bg-zinc-100/30 dark:bg-zinc-700/50 dark:border-zinc-600/50 h-12 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-md px-2.5"
        {...props}
      />
    )
  },
)

const Area = forwardRef<ElementRef<'textarea'>, ComponentProps<'textarea'>>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        className="resize-none h-32 text-[13px] focus:outline-none w-full flex bg-zinc-100/30 dark:bg-zinc-700/50 dark:border-zinc-600/50 border focus:border-[#305a96] dark:focus:ring-blue-700/50 focus:ring-2 focus:ring-blue-200/50 rounded-md p-2.5"
        {...props}
      />
    )
  },
)

const Mask = forwardRef<
  ElementRef<typeof InputMask>,
  ComponentProps<typeof InputMask>
>((props, ref) => (
  <InputMask
    ref={ref}
    className="text-[13px] focus:outline-none w-full flex bg-zinc-100/30 h-12 dark:bg-zinc-700/50 dark:border-zinc-600/50 border focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 rounded-md px-2.5"
    maskChar="_"
    {...props}
  />
))

export const Input = {
  Root,
  Label,
  Write,
  Area,
  Mask,
}
