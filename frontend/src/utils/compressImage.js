/** Max upload size after compression (matches backend ImageOptimizer). */
export const MAX_IMAGE_BYTES = 700 * 1024

/**
 * Compress / resize a raster image in the browser so it fits under maxBytes.
 * Non-images and already-small files are returned unchanged.
 *
 * @param {File} file
 * @param {{ maxBytes?: number, maxEdge?: number }} [options]
 * @returns {Promise<{ file: File, optimized: boolean }>}
 */
export async function compressImageFile(file, options = {}) {
  const maxBytes = options.maxBytes ?? MAX_IMAGE_BYTES
  const maxEdge = options.maxEdge ?? 2400

  if (!file || !file.type?.startsWith('image/') || file.type.includes('svg')) {
    return { file, optimized: false }
  }
  if (file.size > 0 && file.size <= maxBytes) {
    return { file, optimized: false }
  }

  const bitmap = await loadBitmap(file)
  try {
    let scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height, 1))
    let quality = 0.85
    let blob = null

    for (let attempt = 0; attempt < 14; attempt += 1) {
      const width = Math.max(1, Math.round(bitmap.width * scale))
      const height = Math.max(1, Math.round(bitmap.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) break
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(bitmap, 0, 0, width, height)

      blob = await canvasToJpegBlob(canvas, quality)
      if (blob && blob.size <= maxBytes) break

      if (quality > 0.55) {
        quality -= 0.1
      } else {
        scale *= 0.85
        quality = 0.8
      }
    }

    if (!blob || blob.size > maxBytes) {
      throw new Error('Unable to compress this image under 700KB. Try a smaller source file.')
    }

    const name = replaceExtension(file.name || 'image.jpg', 'jpg')
    return {
      file: new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }),
      optimized: true,
    }
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close()
  }
}

function replaceExtension(name, ext) {
  const base = String(name).replace(/\.[^.]+$/, '') || 'image'
  return `${base}.${ext}`
}

async function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Unable to read image.'))
      el.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
      return
    }
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    const bytes = atob(dataUrl.split(',')[1] || '')
    const arr = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i += 1) arr[i] = bytes.charCodeAt(i)
    resolve(new Blob([arr], { type: 'image/jpeg' }))
  })
}
