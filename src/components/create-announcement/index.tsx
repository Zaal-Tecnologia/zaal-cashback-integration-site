import { useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

import { useBranch } from '@/hooks/use-branch'

import { Dates } from './components/dates'
import { Content } from './components/content'
import { Values } from './components/values'
import { Photo } from './components/photo'

import { Form, FormContext } from './contexts/form'

const TITLE = {
  1: 'Imagem',
  2: 'Informações',
  3: 'Valor',
  4: 'Data',
}

const COMPONENT = {
  1: <Photo />,
  2: <Content />,
  3: <Values />,
  4: <Dates />,
}

type Step = 1 | 2 | 3 | 4

export function CreateAnnouncement() {
  const { branch } = useBranch()

  const [open, _setOpen] = useState(false)
  const [step, _setStep] = useState<Step>(1)
  const [form, _setForm] = useState<Form>(null)

  const setStep = useCallback((step: Step) => {
    _setStep(step)
  }, [])

  const setOpen = useCallback((open: boolean) => {
    _setOpen(open)
  }, [])

  const onSubmit = useCallback(
    (data: Form) => {
      if (branch) {
        if (form) {
          _setForm({ ...form, ...data })
        } else {
          _setForm({
            ...data,
            filialCnpj: branch.cnpj,
            filialInscricaoEstadual: branch.inscricaoEstadual,
            ativo: true,
          })
        }
      }
    },
    [branch, form],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="flex items-center gap-2.5 group">
          <div className="h-6 w-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              color="#000000"
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

          <p className="text-[13px] font-medium text-zinc-900 hover:underline">
            Anunciar [+2 restantes]
          </p>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crie um novo anúncio</DialogTitle>
          <DialogDescription>
            Você ainda tem 3 anúncios para criar, preencha os campos abaixo.
          </DialogDescription>
        </DialogHeader>

        <nav className="w-full grid grid-cols-4 gap-2 mt-5 mb-1.5">
          {[1, 2, 3, 4].map((item) => (
            <button
              key={item}
              className="hover:ring-4 hover:ring-[#305a96]/20 rounded-full"
              onClick={() => _setStep(item as Step)}
            >
              <div
                data-fill={step >= item}
                className="data-[fill=true]:bg-[#305a96] h-[2px] rounded-full bg-zinc-200"
              />
            </button>
          ))}
        </nav>

        <p className="text-xs font-medium text-zinc-500">{step} de 4</p>

        <strong className="text-[13px] font-semibold -tracking-normal text-zinc-800">
          {TITLE[step]}
        </strong>

        <FormContext.Provider
          value={{ setStep, step, form, setForm: onSubmit, setOpen }}
        >
          {COMPONENT[step]}
        </FormContext.Provider>
      </DialogContent>
    </Dialog>
  )
}
