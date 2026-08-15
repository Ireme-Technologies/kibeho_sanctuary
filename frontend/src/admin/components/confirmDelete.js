import { confirmAction } from './notify'

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
    text: message || 'Delete this item?',
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
