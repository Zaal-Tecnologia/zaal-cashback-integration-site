export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': '*',
    Authorization: authorization ?? '',
  }

  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? '/api/v1/'
      : 'https://cc77-200-164-236-60.ngrok-free.app/api/v1/'

  return fetch(BASE_URL.concat(path), {
    ...init,
    headers,
  })
}
