import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@styles/globals.css'
import { applyThemeToDocument, DEFAULT_THEME } from '@utils/theme'

// Apply default theme fonts immediately (non-blocking) before React mounts.
applyThemeToDocument(DEFAULT_THEME)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

document.getElementById('boot-loader')?.remove()
