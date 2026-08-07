import { useState } from 'react'
import ImageField from './ImageField'
import { parseYoutubeId, youtubeThumbUrl } from '@utils/youtube'
import styles from '../admin.module.css'

/**
 * Media field that supports either an uploaded/library image or a YouTube URL.
 * value shape: { type: 'image'|'youtube', url: string }
 */
export { parseYoutubeId }

export default function MediaOrVideoField({
  label = 'Media',
  value,
  onChange,
  folder = 'uploads',
}) {
  const current = value && typeof value === 'object' ? value : { type: 'image', url: value || '' }
  const type = current.type === 'youtube' ? 'youtube' : 'image'
  const url = current.url || ''
  const [youtubeInput, setYoutubeInput] = useState(type === 'youtube' ? url : '')

  const setType = (next) => {
    if (next === 'youtube') {
      onChange?.({ type: 'youtube', url: youtubeInput || url })
    } else {
      onChange?.({ type: 'image', url: type === 'image' ? url : '' })
    }
  }

  const ytId = parseYoutubeId(youtubeInput || url)

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.mediaTypeTabs}>
        <button
          type="button"
          className={`${styles.btn} ${type === 'image' ? styles.btn : styles.btnSecondary}`}
          onClick={() => setType('image')}
        >
          Image
        </button>
        <button
          type="button"
          className={`${styles.btn} ${type === 'youtube' ? styles.btn : styles.btnSecondary}`}
          onClick={() => setType('youtube')}
        >
          YouTube URL
        </button>
      </div>

      {type === 'image' ? (
        <ImageField
          label="Image file"
          value={url}
          onChange={(nextUrl) => onChange?.({ type: 'image', url: nextUrl })}
          folder={folder}
        />
      ) : (
        <div className={styles.field}>
          <label>YouTube URL or video ID</label>
          <input
            value={youtubeInput}
            onChange={(e) => {
              setYoutubeInput(e.target.value)
              onChange?.({ type: 'youtube', url: e.target.value.trim() })
            }}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {ytId ? (
            <div className={styles.youtubePreview}>
              <img src={youtubeThumbUrl(ytId)} alt="YouTube thumbnail" />
              <p className={styles.muted}>Preview thumbnail · ID {ytId}</p>
            </div>
          ) : (
            <p className={styles.muted}>Paste a full YouTube link to preview the thumbnail.</p>
          )}
        </div>
      )}
    </div>
  )
}
