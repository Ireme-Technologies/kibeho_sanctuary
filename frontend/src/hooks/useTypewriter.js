import { useState, useEffect } from 'react'

/**
 * Animates text appearing one character at a time.
 * Automatically resets and restarts when `text` changes.
 *
 * NOTE: not currently wired into any section — kept available on request.
 * Reserve for a low-stakes use case if used at all; a typewriter effect
 * reads more "startup/tech" than the luxury/professional direction agreed
 * on for the rest of the site.
 *
 * @param {string} text  - The full string to type out
 * @param {number} speed - Milliseconds per character (default: 45ms)
 * @returns {{ displayed: string, isDone: boolean }}
 */
export function useTypewriter(text = '', speed = 45) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Reset immediately when text changes
    setDisplayed('')
    setIsDone(false)

    if (!text) return

    let index = 0

    const interval = setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))

      if (index >= text.length) {
        clearInterval(interval)
        setIsDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return { displayed, isDone }
}
