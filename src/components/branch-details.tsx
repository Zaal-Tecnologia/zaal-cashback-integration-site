import { ArrowRight, X } from 'lucide-react'
import { motion } from 'framer-motion'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useBranch } from '@/hooks/use-branch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { formatZipCode } from '@/utils/format-zip-code'
import { formatDoc } from '@/utils/format-doc'
import { CreateAnnouncement } from './create-announcement'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function BranchDetails({ className }: { className?: string }) {
  /** const { data: ads, isLoading } = useQuery<AdsDTO[]>(
    ['get-ads-by-branch-id-query', String(branch.id)],
    async () => {
      const response = await api(`anuncios?filialId=${branch.id}`)

      const json = await response.json()

      return json
    },
  ) */

  const { setBranch, branch } = useBranch()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <motion.div
      animate={{ translateY: 0, opacity: 1 }}
      initial={{ translateY: 50, opacity: 0 }}
      transition={{ type: 'spring' }}
      className={cn('absolute w-[27%] top-0 bottom-0 z-50 right-0', className)}
    >
      {branch ? (
        <>
          <div className="top-14 sticky h-96 w-full">
            <header className="flex items-center justify-between mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      pathname === '/ads' ? navigate(-1) : setBranch(null)
                    }
                    className="h-6 w-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                  >
                    <X size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Fechar</TooltipContent>
              </Tooltip>
            </header>

            <div className="flex flex-col ml-1.5">
              <strong className="text-sm font-semibold mb-1.5">
                {branch.razao}
              </strong>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {branch.descricao}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              <Dialog>
                <DialogTrigger>
                  <button className="flex items-center gap-2.5 group">
                    <div className="h-6 w-6 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        // color="#000000"
                        fill="none"
                      >
                        <path
                          d="M15.1528 4.28405C13.9789 3.84839 13.4577 2.10473 12.1198 2.00447C12.0403 1.99851 11.9603 1.99851 11.8808 2.00447C10.5429 2.10474 10.0217 3.84829 8.8478 4.28405C7.60482 4.74524 5.90521 3.79988 4.85272 4.85239C3.83967 5.86542 4.73613 7.62993 4.28438 8.84747C3.82256 10.0915 1.89134 10.6061 2.0048 12.1195C2.10506 13.4574 3.84872 13.9786 4.28438 15.1525C4.73615 16.37 3.83962 18.1346 4.85272 19.1476C5.90506 20.2001 7.60478 19.2551 8.8478 19.7159C10.0214 20.1522 10.5431 21.8954 11.8808 21.9955C11.9603 22.0015 12.0403 22.0015 12.1198 21.9955C13.4575 21.8954 13.9793 20.1521 15.1528 19.7159C16.3704 19.2645 18.1351 20.1607 19.1479 19.1476C20.2352 18.0605 19.1876 16.2981 19.762 15.042C20.2929 13.8855 22.1063 13.3439 21.9958 11.8805C21.8957 10.5428 20.1525 10.021 19.7162 8.84747C19.2554 7.60445 20.2004 5.90473 19.1479 4.85239C18.0955 3.79983 16.3958 4.74527 15.1528 4.28405Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12.2422 16V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.9922 8H12.0012"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <p className="text-[13px] font-medium text-zinc-900 hover:underline dark:text-white">
                      Informações
                    </p>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{branch.razao}</DialogTitle>
                    <DialogDescription>
                      {branch.descricao} - {branch.categoria}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5">
                    <div className="flex flex-col gap-2.5 border-b pb-5 mb-5 cursor-not-allowed">
                      <div className="h-10 w-10 bg-violet-200/50 dark:bg-violet-800/50 rounded-xl flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          color="#5b21b6"
                          fill="none"
                        >
                          <path
                            d="M14.5 9.5H14.509"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.5 6C16.3941 6 18 7.61319 18 9.57031C18 11.5586 16.368 12.9539 14.8605 13.9027C14.7506 13.9665 14.6264 14 14.5 14C14.3736 14 14.2494 13.9665 14.1395 13.9027C12.6348 12.9446 11 11.5655 11 9.57031C11 7.61319 12.6059 6 14.5 6Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M9 15L5 19M15 21L3 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <p className="text-[13px] font-semibold">Endereço</p>

                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {formatZipCode(branch.endereco.cep)},{' '}
                        {branch.endereco.paisNome}, {branch.endereco.uf},{' '}
                        {branch.endereco.cidadeNome},{' '}
                        {branch.endereco.logradouro}, {branch.endereco.numero}.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 pb-5 mb-5 cursor-not-allowed">
                      <div className="h-10 w-10 bg-orange-200/50 dark:bg-orange-800/50 rounded-xl flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          color="#f97316"
                          fill="none"
                        >
                          <path
                            d="M14.9805 7.01562C14.9805 7.01562 15.4805 7.51562 15.9805 8.51562C15.9805 8.51562 17.5687 6.01562 18.9805 5.51562"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.99485 2.02141C7.49638 1.91562 5.56612 2.20344 5.56612 2.20344C4.34727 2.29059 2.01146 2.97391 2.01148 6.9646C2.0115 10.9214 1.98564 15.7993 2.01148 17.744C2.01148 18.932 2.7471 21.7034 5.29326 21.8519C8.3881 22.0324 13.9627 22.0708 16.5205 21.8519C17.2051 21.8133 19.4846 21.2758 19.7731 18.7957C20.072 16.2264 20.0125 14.4407 20.0125 14.0157"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21.9999 7.01562C21.9999 9.77705 19.7591 12.0156 16.995 12.0156C14.231 12.0156 11.9902 9.77705 11.9902 7.01562C11.9902 4.2542 14.231 2.01562 16.995 2.01562C19.7591 2.01562 21.9999 4.2542 21.9999 7.01562Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.98047 13.0156H10.9805"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.98047 17.0156H14.9805"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <p className="text-[13px] font-semibold">Documentos</p>

                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-5">
                        CNPJ - {formatDoc(branch.cnpj)}, IE -{' '}
                        {branch.inscricaoEstadual}.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <CreateAnnouncement>
                <DialogTrigger asChild>
                  <button className="h-12 group flex items-center justify-start px-5 gap-2.5 w-52 bg-gradient-to-r from-[#305a96] to-sky-800 rounded-full hover:ring-4 hover:ring-[#305a96]/20">
                    <div className="h-12 w-6 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        color="#FFFFFF"
                        fill="none"
                      >
                        <path
                          d="M14.9263 4.41103L8.27352 7.60452C7.76151 7.85029 7.21443 7.91187 6.65675 7.78693C6.29177 7.70517 6.10926 7.66429 5.9623 7.64751C4.13743 7.43912 3 8.88342 3 10.5443V11.4557C3 13.1166 4.13743 14.5609 5.9623 14.3525C6.10926 14.3357 6.29178 14.2948 6.65675 14.2131C7.21443 14.0881 7.76151 14.1497 8.27352 14.3955L14.9263 17.589C16.4534 18.3221 17.217 18.6886 18.0684 18.4029C18.9197 18.1172 19.2119 17.5041 19.7964 16.278C21.4012 12.9112 21.4012 9.08885 19.7964 5.72196C19.2119 4.49586 18.9197 3.88281 18.0684 3.5971C17.217 3.3114 16.4534 3.67794 14.9263 4.41103Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 17V17.5C13 18.7841 13 19.4261 12.776 19.7886C12.4773 20.2719 11.9312 20.545 11.3653 20.4939C10.9409 20.4557 10.4273 20.0704 9.4 19.3L8.2 18.4C7.22253 17.6669 7 17.2218 7 16V14.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.5 14V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <p className="font-medium text-white text-xs">Anunciar</p>

                    <div className="ml-auto h-12 w-6 flex items-center justify-center transition-all duration-300 opacity-0 -translate-x-10 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="text-white font-bold" size={14} />
                    </div>
                  </button>
                </DialogTrigger>
              </CreateAnnouncement>
            </div>

            {/** <ul className="grid grid-cols-2 gap-2 mt-5">
          {isLoading ? (
            <>
              <li className="animate-pulse bg-zinc-200 h-28"></li>
              <li className="animate-pulse bg-zinc-200 h-28"></li>
            </>
          ) : null}

          {ads
            ? ads.map((item) => (
                <li key={item.id}>
                  <AdsImage
                    adsId={item.id}
                    onSelectAds={(src) => console.log(src)}
                  />
                </li>
              ))
            : null}
        </ul> */}
          </div>
        </>
      ) : null}
    </motion.div>
  )
}
