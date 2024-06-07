import { createContext } from 'react'

import { ContentFormData } from '../components/content'
import { ValuesFormData } from '../components/values'

export type Base64Form = {
  imagemBase64: string
}

type Branch = {
  filialCnpj: string
  filialInscricaoEstadual: string
}

type ActiveForm = {
  ativo: boolean
}

export type Form =
  | ContentFormData
  | ValuesFormData
  | Base64Form
  | Branch
  | ActiveForm
  | null

type FormContextData = {
  step: 1 | 2 | 3 | 4
  setStep(step: 1 | 2 | 3 | 4): void

  form: Form
  setForm(form: Form): void

  updateId: number | null
  setUpdateId(updateId: number | null): void

  setOpen(open: boolean): void
}

export const FormContext = createContext<FormContextData>({} as FormContextData)
