import { useEffect, useState } from 'react'
import { fetchSacredPlaces } from '@api/cms'
import { catalogErrorMessage } from '@api/client'

export function useSacredPlaces(type, locale) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoaded(false)
    setError('')

    fetchSacredPlaces({ type, locale })
      .then((rows) => {
        if (cancelled) return
        setItems(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (cancelled) return
        setItems([])
        setError(catalogErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [type, locale])

  return { items, error, loaded }
}
