import { createContext } from 'react'
import { FormInput as InfoFormInput } from '../components/info'
import { FormInput as AddressFormInput } from '../components/address'
import { FormInput as DocumentFormInput } from '../components/documents'

export type BranchPhoto = { image: string }

export type Form =
  | BranchPhoto
  | InfoFormInput
  | AddressFormInput
  | DocumentFormInput
  | null

export type Step = 1 | 2 | 3 | 4

type FormContextData = {
  step: Step
  setStep(step: Step): void

  form: Form
  setForm(form: Form): void

  setOpen(open: boolean): void

  state: string | null
  setState(state: string | null): void
}

export const FormContext = createContext<FormContextData>({} as FormContextData)
