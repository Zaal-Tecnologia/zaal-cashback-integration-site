export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': '*',
    authorization: authorization ?? '',
  }

  // http://zaal.no-ip.info:8083/api/v1/

  const BASE_URL =
    // import.meta.env.MODE === 'development'
    import.meta.env.MODE === ''
      ? '/api/v1/'
      : 'https://1290-200-164-236-60.ngrok-free.app/api/v1/'

  return fetch(BASE_URL.concat(path), {
    ...init,
    // mode: 'no-cors',
    headers,
    referrerPolicy: 'no-referrer',
  })
}
