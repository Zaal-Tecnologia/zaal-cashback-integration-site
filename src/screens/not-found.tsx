import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="w-screen h-screen max-w-[1120px] mx-auto flex items-center justify-center flex-col">
      <img alt="" src="/logo-preto.png" className="w-[100px] h-[100px] mb-10" />

      <h1 className="font-urbanist text-[44px] font-semibold text-[#305a96]">
        Ops! 404.
      </h1>

      <span className="text-sm text-zinc-700 -tracking-wide block my-10">
        Página não encontrada, volte para um lugar seguro.
      </span>

      <Link
        to="/history"
        className="h-10 bg-[#305a96] flex items-center justify-center rounded-full px-10 ring-4 ring-[#305a96]/50"
      >
        <span className="text-[13px] text-white -tracking-wide">
          Sair daqui
        </span>
      </Link>
    </div>
  )
}
