/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { useBranch } from '@/hooks/use-branch'

import { Dates } from './components/dates'
import { Content } from './components/content'
import { Values } from './components/values'
import { Photo } from './components/photo'

import { Form, FormContext } from './contexts/form'
import { api } from '@/data/api'

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

export function CreateAnnouncement({
  children,
  data,
}: {
  children: ReactNode
  data?: {
    conteudo: string
    cupom: string
    descricao: string
    filialId: number
    id: number
    imagemBase64: string
    inicio: Date
    tipoDesconto: string
    validade: Date
    valorDesconto: number
    valorMaximo: number
    valorMinimo: number
  }
}) {
  const { branch } = useBranch()

  const [open, _setOpen] = useState(false)
  const [step, _setStep] = useState<Step>(1)
  const [form, _setForm] = useState<Form>(null)
  const [updateId, setUpdateId] = useState<number | null>(null)

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

  useEffect(() => {
    if (data) {
      // _setForm(data)

      api(`filiais/${data.filialId}`, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((json) => {
          // @ts-ignore
          delete data.id
          // @ts-ignore
          delete data.filialId

          _setForm({
            ...data,
            filialCnpj: json.cnpj as string,
            filialInscricaoEstadual: json.inscricaoEstadual as string,
          })
        })

      setUpdateId(data.id)
    }
  }, [data])

  console.log(form)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

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
                className="dark:data-[fill=true]:bg-[#305a96] data-[fill=true]:bg-[#305a96] h-[2px] rounded-full bg-zinc-200 dark:bg-zinc-700"
              />
            </button>
          ))}
        </nav>

        <p className="text-xs font-medium text-zinc-500">{step} de 4</p>

        <strong className="text-[13px] font-semibold -tracking-normal">
          {TITLE[step]}
        </strong>

        <FormContext.Provider
          value={{
            setStep,
            step,
            form,
            setForm: onSubmit,
            setOpen,
            updateId,
            setUpdateId,
          }}
        >
          {COMPONENT[step]}
        </FormContext.Provider>
      </DialogContent>
    </Dialog>
  )
}
