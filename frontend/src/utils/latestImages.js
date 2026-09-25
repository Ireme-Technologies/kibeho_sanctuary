export function latestImages(images, { exclude = '', limit = 3 } = {}) {
  const list = (images || []).filter((src) => src && src !== exclude)
  if (list.length <= limit) return list
  return list.slice(-limit)
}
