export function api(path: string, init?: RequestInit) {
  const authorization = localStorage.getItem('@zaalcashback:token')

  const headers = {
    ...init?.headers,
    'Access-Control-Allow-Origin': 'no-cors',
    authorization: authorization ?? '',
  }

  return import.meta.env.MODE === 'development'
    ? fetch('/api/v1/'.concat(path), {
        ...init,
        headers,
      })
    : fetch('http://zaal.no-ip.info:8083/api/v1/'.concat(path), {
        ...init,
        headers,
      })
}
