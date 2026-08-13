import ListEditor from './ListEditor'
import MultiImageField from './MultiImageField'
import RichTextEditor from './RichTextEditor'
import { confirmDelete } from './confirmDelete'
import { parseYoutubeId, youtubeThumbUrl } from '@utils/youtube'
import styles from '../admin.module.css'

const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'note', label: 'Note / callout' },
  { value: 'list', label: 'Bullet list' },
  { value: 'gallery', label: 'Image gallery' },
  { value: 'youtube', label: 'YouTube video' },
  { value: 'cards', label: 'Cards' },
  { value: 'steps', label: 'Steps' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'hotels', label: 'Hotels / lodging' },
]

function emptyBlock(type = 'paragraph') {
  switch (type) {
    case 'heading':
      return { type, text: '' }
    case 'paragraph':
    case 'note':
      return { type, text: '' }
    case 'list':
      return { type, items: [''] }
    case 'gallery':
      return { type, images: [] }
    case 'youtube':
      return { type, url: '', title: '' }
    case 'cards':
    case 'steps':
      return { type, items: [{ title: '', text: '', path: '' }] }
    case 'schedule':
      return { type, items: [{ when: '', title: '', time: '' }] }
    case 'hotels':
      return { type, items: [{ title: '', distance: '', contact: '', text: '', facilities: '' }] }
    default:
      return { type: 'paragraph', text: '' }
  }
}

function listToLines(items) {
  if (!Array.isArray(items)) return ''
  return items.map((item) => (typeof item === 'string' ? item : '')).join('\n')
}

function linesToList(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function BlocksEditor({ blocks = [], onChange }) {
  const list = Array.isArray(blocks) ? blocks : []

  const updateBlock = (index, patch) => {
    onChange?.(list.map((block, i) => (i === index ? { ...block, ...patch } : block)))
  }

  const changeType = (index, type) => {
    onChange?.(list.map((block, i) => (i === index ? emptyBlock(type) : block)))
  }

  const removeBlock = async (index) => {
    if (!(await confirmDelete('Remove this content block?', { confirmLabel: 'Remove' }))) return
    onChange?.(list.filter((_, i) => i !== index))
  }

  const removeBlockItem = async (index, itemIndex, message = 'Remove this item?') => {
    if (!(await confirmDelete(message, { confirmLabel: 'Remove' }))) return
    const items = (list[index]?.items || []).filter((_, i) => i !== itemIndex)
    updateBlock(index, { items })
  }

  const moveBlock = (index, direction) => {
    const next = [...list]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange?.(next)
  }

  return (
    <div className={styles.field}>
      <label>Page layout</label>
      <p className={styles.muted}>
        Build the page from blocks. Use the formatting toolbar inside text blocks for headings, lists,
        links, images, tables, and YouTube.
      </p>
      <div className={styles.blockPalette} role="group" aria-label="Add a layout block">
        {BLOCK_TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={styles.blockPaletteBtn}
            onClick={() => onChange?.([...list, emptyBlock(opt.value)])}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className={styles.listEditor}>
        {list.length === 0 && (
          <p className={styles.muted}>No blocks yet. Choose a block type above to start the layout.</p>
        )}
        {list.map((block, index) => (
          <div key={`block-${index}`} className={styles.listEditorRow}>
            <div>
              <div className={styles.listEditorFields}>
                <div className={styles.field}>
                  <label>Block type</label>
                  <select
                    value={block.type || 'paragraph'}
                    onChange={(e) => changeType(index, e.target.value)}
                  >
                    {BLOCK_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.actions} style={{ alignSelf: 'end' }}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === list.length - 1}
                  >
                    Down
                  </button>
                </div>
              </div>

              {(block.type === 'heading' || block.type === 'paragraph' || block.type === 'note') && (
                <div className={styles.field}>
                  <label>{block.type === 'heading' ? 'Heading text' : 'Text'}</label>
                  {block.type === 'heading' ? (
                    <input
                      value={block.text || ''}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                    />
                  ) : (
                    <RichTextEditor
                      value={block.text || ''}
                      onChange={(html) => updateBlock(index, { text: html })}
                    />
                  )}
                </div>
              )}

              {block.type === 'list' && (
                <div className={styles.field}>
                  <label>List items (one per line)</label>
                  <textarea
                    rows={5}
                    value={listToLines(block.items)}
                    onChange={(e) => updateBlock(index, { items: linesToList(e.target.value) })}
                  />
                </div>
              )}

              {block.type === 'gallery' && (
                <MultiImageField
                  label="Gallery images"
                  value={Array.isArray(block.images) ? block.images : []}
                  onChange={(images) => updateBlock(index, { images })}
                  folder="pages"
                />
              )}

              {block.type === 'youtube' && (
                <div>
                  <div className={styles.field}>
                    <label>Optional title</label>
                    <input
                      value={block.title || ''}
                      onChange={(e) => updateBlock(index, { title: e.target.value })}
                      placeholder="Video title"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>YouTube URL or video ID</label>
                    <input
                      value={block.url || ''}
                      onChange={(e) => updateBlock(index, { url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {parseYoutubeId(block.url) ? (
                      <div className={styles.youtubePreview}>
                        <img src={youtubeThumbUrl(block.url)} alt="YouTube thumbnail" />
                      </div>
                    ) : (
                      <p className={styles.muted}>Paste a YouTube link to preview the thumbnail.</p>
                    )}
                  </div>
                </div>
              )}

              {(block.type === 'cards' || block.type === 'steps') && (
                <div className={styles.nestedCard}>
                  {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                    <div key={`item-${itemIndex}`} className={styles.listEditorRow}>
                      <div>
                        <div className={styles.listEditorFields}>
                          <div className={styles.field}>
                            <label>Title</label>
                            <input
                              value={item.title || ''}
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = { ...items[itemIndex], title: e.target.value }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label>Link path (optional)</label>
                            <input
                              value={item.path || ''}
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = { ...items[itemIndex], path: e.target.value }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.field}>
                          <label>Description</label>
                          <RichTextEditor
                            value={item.text || ''}
                            onChange={(html) => {
                              const items = [...(block.items || [])]
                              items[itemIndex] = { ...items[itemIndex], text: html }
                              updateBlock(index, { items })
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => removeBlockItem(index, itemIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() =>
                      updateBlock(index, {
                        items: [...(block.items || []), { title: '', text: '', path: '' }],
                      })
                    }
                  >
                    Add {block.type === 'steps' ? 'step' : 'card'}
                  </button>
                </div>
              )}

              {block.type === 'schedule' && (
                <ListEditor
                  label="Schedule rows"
                  items={block.items || []}
                  onChange={(items) => updateBlock(index, { items })}
                  addLabel="Add schedule row"
                  emptyItem={{ when: '', title: '', time: '' }}
                  fields={[
                    { key: 'when', label: 'Day / when', placeholder: 'Sunday' },
                    { key: 'title', label: 'Event', placeholder: 'Holy Mass' },
                    { key: 'time', label: 'Time', placeholder: '10:00 AM' },
                  ]}
                />
              )}

              {block.type === 'hotels' && (
                <div className={styles.nestedCard}>
                  {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                    <div key={`hotel-${itemIndex}`} className={styles.listEditorRow}>
                      <div>
                        <div className={styles.listEditorFields}>
                          <div className={styles.field}>
                            <label>Name</label>
                            <input
                              value={item.title || ''}
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = { ...items[itemIndex], title: e.target.value }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label>Distance</label>
                            <input
                              value={item.distance || ''}
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = { ...items[itemIndex], distance: e.target.value }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label>Contact</label>
                            <input
                              value={item.contact || ''}
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = { ...items[itemIndex], contact: e.target.value }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label>Facilities (comma separated)</label>
                            <input
                              value={
                                Array.isArray(item.facilities)
                                  ? item.facilities.join(', ')
                                  : item.facilities || ''
                              }
                              onChange={(e) => {
                                const items = [...(block.items || [])]
                                items[itemIndex] = {
                                  ...items[itemIndex],
                                  facilities: e.target.value
                                    .split(',')
                                    .map((part) => part.trim())
                                    .filter(Boolean),
                                }
                                updateBlock(index, { items })
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.field}>
                          <label>Description</label>
                          <RichTextEditor
                            value={item.text || ''}
                            onChange={(html) => {
                              const items = [...(block.items || [])]
                              items[itemIndex] = { ...items[itemIndex], text: html }
                              updateBlock(index, { items })
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => removeBlockItem(index, itemIndex, 'Remove this lodging item?')}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() =>
                      updateBlock(index, {
                        items: [
                          ...(block.items || []),
                          { title: '', distance: '', contact: '', text: '', facilities: [] },
                        ],
                      })
                    }
                  >
                    Add lodging
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => removeBlock(index)}
            >
              Remove block
            </button>
          </div>
        ))}
        {list.length > 0 ? (
          <p className={styles.muted}>Use the buttons above to add another block to this language’s layout.</p>
        ) : null}
      </div>
    </div>
  )
}
