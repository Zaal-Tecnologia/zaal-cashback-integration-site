export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    authorization: authorization ?? '',
  }

  return fetch('/api/v1/'.concat(path), {
    ...init,
    headers,
  })
}
