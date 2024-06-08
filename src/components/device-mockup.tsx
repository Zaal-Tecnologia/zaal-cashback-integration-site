import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function DeviceMockup(props: Props) {
  return (
    <div className="mb-20 pt-5 border-t border-zinc-200 dark:border-t-zinc-800">
      <div className="relative border-gray-800 dark:border-gray-800 bg-gray-800 border-[12px] rounded-[2rem] flex items-center justify-center h-[498px] w-[250px] shadow-lg">
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute" />
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[15px] top-[50px] rounded-s-lg" />
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[15px] top-[100px] rounded-s-lg" />
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[15px] top-[50px] rounded-e-lg" />

        <div className="rounded-[1.5rem] overflow-hidden w-[228px] h-[475px] bg-white dark:bg-gray-800 relative">
          {props.children}
        </div>
      </div>
    </div>
  )
}
