import { create } from 'zustand'

import { BranchDTO } from '@/@types/dto/branch-dto'

interface Props {
  branch: BranchDTO | null
  setBranch: (branch: BranchDTO | null) => void
}

export const useBranch = create<Props>((set) => ({
  branch: null,
  setBranch(branch) {
    set({
      branch,
    })
  },
}))
