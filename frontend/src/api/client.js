const API_BASE = import.meta.env.VITE_API_URL || ''
const IS_DEV = import.meta.env.DEV

function apiUnreachableMessage(detail = '') {
  if (IS_DEV) {
    return (
      'Could not reach the API server. Start Laravel with: php artisan serve --host=127.0.0.1 --port=8000' +
      (detail ? ` (${detail})` : '')
    )
  }
  return (
    'Could not reach the API. On the live server, ensure Nginx routes /api and /sanctum to Laravel (index.php), PHP-FPM is running, and APP_URL / SANCTUM_STATEFUL_DOMAINS match this domain.' +
    (detail ? ` (${detail})` : '')
  )
}

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
      throw new Error(apiUnreachableMessage(`HTTP ${res.status} on /sanctum/csrf-cookie`))
    }
  } catch (err) {
    if (err.message?.includes('Could not reach the API')) throw err
    throw new Error(apiUnreachableMessage(err.message || 'network error'))
  }
}

/** Hide Laravel "route could not be found" dumps on public catalog pages. */
export function catalogErrorMessage(error) {
  if (!error) return ''
  if (error.missingRoute || error.status === 404) return ''
  if (/route .+ could not be found/i.test(String(error.message || ''))) return ''
  return error.message || ''
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
  } catch (err) {
    const error = new Error(apiUnreachableMessage(err.message || 'network error'))
    error.status = 0
    throw error
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const raw = String(data.message || 'Request failed')
    const missingRoute = response.status === 404 && /route .+ could not be found/i.test(raw)
    const error = new Error(missingRoute ? 'This content is not available yet.' : raw)
    error.status = response.status
    error.errors = data.errors
    error.missingRoute = missingRoute
    throw error
  }

  return data
}
