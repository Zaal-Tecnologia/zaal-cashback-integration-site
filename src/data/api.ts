export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    authorization: authorization ?? '',
  }

  return fetch(
    import.meta.env.MODE === 'development'
      ? '/api/v1/'.concat(path)
      : `${import.meta.env.BASE_URL}/v1/`.concat(path),
    {
      ...init,
      headers,
    },
  )
}
