import styles from './RichText.module.css'

/**
 * Renders CMS HTML from the rich text editor with consistent public typography.
 */
export default function RichText({ html, className = '', as: Tag = 'div' }) {
  const content = String(html || '').trim()
  if (!content || content === '<p></p>') return null

  return (
    <Tag
      className={[styles.richText, className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
