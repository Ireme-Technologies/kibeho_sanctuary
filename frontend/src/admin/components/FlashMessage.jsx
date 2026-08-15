import { useEffect, useRef } from 'react'
import { closeNotify, notifyFlash } from './notify'

export default function FlashMessage({ type = 'success', message, onClear, duration = 3200 }) {
  const onClearRef = useRef(onClear)
  onClearRef.current = onClear

  useEffect(() => {
    if (!message) return undefined

    let active = true
    notifyFlash(type, message, { duration: type === 'error' ? undefined : duration }).then(() => {
      if (active) onClearRef.current?.()
    })

    return () => {
      active = false
      closeNotify()
    }
  }, [type, message, duration])

  return null
}
