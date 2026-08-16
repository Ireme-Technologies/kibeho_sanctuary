import { confirmAction } from './notify'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Two-step delete confirmation. Resolves true only after both checks succeed.
 */
export async function confirmDelete(message, options = {}) {
  const confirmLabel = options.confirmLabel || 'Delete'
  const title =
    options.title ||
    (confirmLabel === 'Remove'
      ? 'Confirm removal'
      : confirmLabel === 'Restore'
        ? 'Confirm restore'
        : 'Confirm deletion')
  const label = confirmLabel.toLowerCase()
  const actionWord = label === 'remove' ? 'remove' : label === 'restore' ? 'restore' : 'delete'
  const secondMessage = options.finalMessage || `This cannot be undone. Permanently ${actionWord}?`

  const first = await confirmAction({
    icon: 'warning',
    title,
    text: options.html ? undefined : message || 'Delete this item?',
    html: options.html,
    confirmLabel: 'Continue',
  })
  if (!first) return false

  return confirmAction({
    icon: 'warning',
    title: 'Please confirm again',
    text: secondMessage,
    confirmLabel,
    danger: true,
  })
}

export async function confirmPermanentDelete({ name, usages = [] }) {
  const used = Array.isArray(usages) && usages.length > 0
  const items = (usages || [])
    .map((item) => {
      const area = escapeHtml(item.area || 'Content')
      const label = escapeHtml(item.label || '')
      const link = item.adminHref
        ? ` (<a href="${escapeHtml(item.adminHref)}">open in admin</a>)`
        : ''
      return `<li><strong>${area}</strong>${label ? ` — ${label}` : ''}${link}</li>`
    })
    .join('')

  const html = used
    ? `<p><strong>${escapeHtml(name)}</strong> is used in these places. Replace it there first if you still need a picture on the public site.</p><ul>${items}</ul>`
    : `<p><strong>${escapeHtml(name)}</strong> is not used on any page right now.</p>`

  return confirmDelete(
    used
      ? 'Review where this image is used, then continue only if you are ready to delete it.'
      : 'Delete this file permanently?',
    {
      title: 'Delete image permanently',
      confirmLabel: 'Delete permanently',
      html,
      finalMessage: 'This cannot be undone. The file will be removed from the server.',
    }
  )
}
