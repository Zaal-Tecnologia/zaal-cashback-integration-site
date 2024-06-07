import { useCallback, useState } from 'react'
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Photo } from './components/photo'
import { Form, FormContext, Step } from './contexts/form'
import { Info } from './components/info'
import { Address } from './components/address'
import { Documents } from './components/documents'

const TITLE = {
  1: 'Imagem',
  2: 'Informações',
  3: 'Endereço',
  4: 'Documentos',
}

const COMPONENT = {
  1: <Photo />,
  2: <Info />,
  3: <Address />,
  4: <Documents />,
}

export function CreateBranch() {
  const [open, _setOpen] = useState(false)
  const [step, _setStep] = useState<Step>(1)
  const [state, _setState] = useState<string | null>(null)
  const [form, _setForm] = useState<Form>(null)

  const setStep = useCallback((step: Step) => {
    _setStep(step)
  }, [])

  const setState = useCallback((state: string) => {
    _setState(state)
  }, [])

  const setOpen = useCallback((open: boolean) => {
    _setOpen(open)
  }, [])

  const onSubmit = useCallback(
    (data: Form) => {
      _setForm(form ? { ...form, ...data } : data)
    },
    [form],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="h-8 px-5 hover:bg-[#305a96]/10 rounded-md">
          <p className="font-medium text-zinc-900 text-xs">Criar</p>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crie uma nova filial</DialogTitle>
          <DialogDescription>
            Você poderá fazer 5 anúncios para essa filial.
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
          value={{
            form,
            setForm: onSubmit,
            setOpen,
            setStep,
            step,
            setState,
            state,
          }}
        >
          {COMPONENT[step]}
        </FormContext.Provider>
      </DialogContent>
    </Dialog>
  )
}
