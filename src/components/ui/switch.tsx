import { ComponentProps } from 'react'

export function Switch(
  props: ComponentProps<'span'> & {
    onChange?: ComponentProps<'span'>['onChange']
  },
) {
  return (
    <label className="inline-flex items-center cursor-pointer ml-auto">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        onChange={props.onChange}
      />
      <div className="relative w-[40px] h-6 bg-zinc-200 dark:bg-zinc-700/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#305a96] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white dark:border-zinc-600 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#305a96]"></div>
      <span className="ml-2 text-xs">{props.children}</span>
    </label>
  )
}
