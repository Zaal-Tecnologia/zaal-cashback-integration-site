export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': 'cors',
    authorization: authorization ?? '',
  }

  // http://zaal.no-ip.info:8083/api/v1/

  return import.meta.env.MODE === 'development'
    ? fetch('/api/v1/'.concat(path), {
        ...init,
        headers,
      })
    : fetch('/api/v1/'.concat(path), {
        ...init,
        headers,
      })
}
