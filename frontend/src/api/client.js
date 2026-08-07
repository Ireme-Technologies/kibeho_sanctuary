const API_BASE = import.meta.env.VITE_API_URL || ''

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export async function ensureCsrf() {
  try {
    const res = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
      credentials: 'include',
    })
    if (!res.ok) {
      throw new Error('Could not reach the API server. Is Laravel running on port 8000?')
    }
  } catch (err) {
    if (err.message?.includes('API server')) throw err
    throw new Error('Could not reach the API server. Start it with: php artisan serve --port=8000')
  }
}

export async function api(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...options.headers,
  }

  const xsrf = getCookie('XSRF-TOKEN')
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers,
      body:
        options.body && !(options.body instanceof FormData)
          ? JSON.stringify(options.body)
          : options.body,
    })
  } catch {
    const error = new Error(
      'Could not reach the API server. Start Laravel with: php artisan serve --host=127.0.0.1 --port=8000'
    )
    error.status = 0
    throw error
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    error.errors = data.errors
    throw error
  }

  return data
}
