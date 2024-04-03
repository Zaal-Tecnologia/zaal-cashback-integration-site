import { StepProvider } from '../contexts/step'

import { Auth } from '../components/auth'

export function Onboarding() {
  return (
    <div className="h-screen relative bg-dotted-spacing-2 bg-dotted-zinc-100">
      <div className="max-w-[1120px] mx-auto">
        <header className="h-28 flex items-center fixed top-0 space-x-10">
          <img
            src="/logo-preto.png"
            alt=""
            className="w-[50px] h-[50px] mr-10"
          />

          <span className="text-sm text-zinc-700 hover:text-zinc-900">
            <a target="_blank" href="https://zaal.com.br/" rel="noreferrer">
              Nosso site
            </a>
          </span>

          <span className="text-sm text-zinc-700 hover:text-zinc-900">
            <a target="_blank" href="https://zaal.com.br/" rel="noreferrer">
              Instagram
            </a>
          </span>

          <span className="text-sm text-zinc-700 hover:text-zinc-900">
            <a target="_blank" href="https://zaal.com.br/" rel="noreferrer">
              Suporte
            </a>
          </span>
        </header>

        <div className="flex items-center">
          <div className="sticky top-40 w-[560px]">
            <h1 className="text-[32px] font-bold font-secondary text-zinc-700 -tracking-wide leading-[60px] mt-10">
              Um jeito fácil de{' '}
              <span className="font-secondary text-[#305a96]">anunciar</span>{' '}
              <br />
              seus{' '}
              <span className="font-secondary text-[#305a96]">produtos</span>
            </h1>

            <p className="text-zinc-900 text-sm leading-8 w-[90%] my-10">
              Você tem algo para vender ou promover? Com o Clube de Vantagens
              Zaal, você pode criar anúncios de forma rápida e simples para
              alcançar milhares de potenciais compradores em nossa plataforma.
            </p>
          </div>

          <StepProvider>
            <Auth />
          </StepProvider>
        </div>
      </div>
    </div>
  )
}