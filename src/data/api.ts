export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    authorization: authorization ?? '',
  }

  console.log('import.meta.env.MODE', import.meta.env.MODE)
  console.log('url', `${import.meta.env.VITE_BASE_URL}v1/`.concat(path))

  return fetch(
    import.meta.env.MODE === 'development'
      ? '/api/v1/'.concat(path)
      : `${import.meta.env.VITE_BASE_URL}v1/`.concat(path),
    {
      ...init,
      headers,
    },
  )
}
