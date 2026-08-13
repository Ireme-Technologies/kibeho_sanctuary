let openHost = null

/**
 * Two-step delete confirmation. Resolves true only after both checks succeed.
 * Falls back to two window.confirm dialogs if the host is not mounted.
 */
export function confirmDelete(message, options = {}) {
  const payload = {
    title:
      options.title ||
      (options.confirmLabel === 'Remove'
        ? 'Confirm removal'
        : options.confirmLabel === 'Restore'
          ? 'Confirm restore'
          : 'Confirm deletion'),
    message: message || 'Delete this item?',
    confirmLabel: options.confirmLabel || 'Delete',
    finalMessage: options.finalMessage || '',
  }

  return new Promise((resolve) => {
    if (!openHost) {
      const first = window.confirm(payload.message)
      if (!first) {
        resolve(false)
        return
      }
      resolve(window.confirm('This cannot be undone. Please confirm again to permanently delete.'))
      return
    }

    openHost({
      ...payload,
      resolve,
    })
  })
}

export function subscribeConfirmDelete(handler) {
  openHost = handler
  return () => {
    if (openHost === handler) openHost = null
  }
}
