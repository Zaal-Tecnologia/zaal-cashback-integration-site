export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': '*',
    authorization: authorization ?? '',
  }

  // http://zaal.no-ip.info:8083/api/v1/

  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? '/api/v1/'
      : 'http://zaal.no-ip.info:8083/api/v1/'

  return fetch(BASE_URL.concat(path), {
    ...init,
    headers,
    referrerPolicy: 'no-referrer',
  })
}
