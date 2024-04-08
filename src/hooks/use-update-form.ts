import { AdsDTO } from '@/@types/dto/ads-dto'
import { create } from 'zustand'

interface Props {
  form: (AdsDTO & { src: string }) | null
  setForm: (form: (AdsDTO & { src: string }) | null) => void
}

export const useUpdateForm = create<Props>((set) => ({
  form: null,
  setForm(form) {
    set({ form })
  },
}))
