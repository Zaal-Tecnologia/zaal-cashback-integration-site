export function formatZipCode(cep: string) {
  cep = cep.replace(/\D/g, '')

  cep = cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')

  return cep
}
