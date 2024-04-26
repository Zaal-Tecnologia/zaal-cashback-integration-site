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
    <label htmlFor="" className="text-xs font-medium mb-1" {...props}>
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
        className="font-medium text-[13px] focus:outline-none w-full flex dark:border-zinc-600/50 h-10 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-blue-700/50 rounded-lg px-2.5 dark:bg-zinc-700/50"
        onChange={props.onChange}
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
        className="font-medium resize-none h-32 text-[13px] focus:outline-none w-full flex dark:border-zinc-600/50 border focus:border-[#305a96] dark:focus:ring-blue-700/50 focus:ring-2 focus:ring-blue-200/50 rounded-lg p-2.5 dark:bg-zinc-700/50"
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
    className="font-medium text-[13px] focus:outline-none w-full flex h-10 dark:border-zinc-600/50 border focus:border-[#305a96] focus:ring-2 focus:ring-blue-200/50 rounded-lg px-2.5 dark:bg-zinc-700/50"
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
