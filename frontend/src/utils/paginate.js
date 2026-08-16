export const PAGE_SIZE = 6

export function sortByLatest(items, getDate) {
  return [...(items || [])].sort((a, b) => {
    const da = new Date(getDate(a) || 0).getTime()
    const db = new Date(getDate(b) || 0).getTime()
    if (db !== da) return db - da
    return (Number(b.id) || 0) - (Number(a.id) || 0)
  })
}

export function paginate(items, page, size = PAGE_SIZE) {
  const list = items || []
  const total = list.length
  const pageCount = Math.max(1, Math.ceil(total / size) || 1)
  const current = Math.min(Math.max(1, Number(page) || 1), pageCount)
  const start = (current - 1) * size
  return {
    items: list.slice(start, start + size),
    page: current,
    pageCount,
    total,
  }
}
