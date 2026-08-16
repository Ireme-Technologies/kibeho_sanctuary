/**
 * Shared payment rules for offerings, donations, and registration.
 * Local telecoms → clickable MoMo Pay USSD.
 * Internationals → online gateway when set; otherwise bank transfer.
 */

export function hasOnlineGateway(offerings) {
  return /^https?:\/\//i.test(String(offerings?.onlinePaymentUrl || '').trim())
}

export function momoTelHref(code) {
  const raw = String(code || '').trim()
  if (!raw) return ''
  return `tel:${raw.replace(/#/g, '%23')}`
}

export function giftAmounts(offerings) {
  const raw = offerings?.giftAmounts
  const list = Array.isArray(raw)
    ? raw
    : String(raw || '')
        .split(/[,\s]+/)
        .filter(Boolean)
  const nums = list.map(Number).filter((n) => n > 0)
  return nums.length ? nums : [10, 25, 50, 100]
}

export async function copyText(text) {
  const value = String(text || '')
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = value
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export async function shareOrCopyPage({ title, text } = {}) {
  const url = window.location.href
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: title || document.title, text, url })
      return 'shared'
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
    }
  }
  const copied = await copyText(url)
  return copied ? 'copied' : 'failed'
}
