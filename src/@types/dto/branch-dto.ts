export interface Address {
  cep: string
  bairro: string
  numero: string
  complemento: string
  logradouro: string
  cidadeNome: string
  uf: string
  paisNome: string
}

export interface BranchDTO {
  id: number
  razao: string
  descricao: string
  categoria: string
  cnpj: string
  inscricaoEstadual: string
  endereco: Address
}
