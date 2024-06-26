export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': '*',
    Authorization: authorization ?? '',
  }

  const PROD_SERVER = 'http://zaal.no-ip.info:8083/api/v1/'

  // const BASE_URL = PROD_SERVER

  const BASE_URL =
    import.meta.env.MODE === 'development' ? '/api/v1/' : PROD_SERVER

  return fetch(BASE_URL.concat(path), {
    ...init,
    headers,
  })
}
