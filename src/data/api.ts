export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': '*',
    authorization: authorization ?? '',
  }

  // http://zaal.no-ip.info:8083/api/v1/

  return fetch('/api/v1/'.concat(path), {
    ...init,
    headers,
    referrerPolicy: 'no-referrer',
  })
}
