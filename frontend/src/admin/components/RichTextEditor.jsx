import { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import Youtube from '@tiptap/extension-youtube'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  FolderOpen,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  Youtube as YoutubeIcon,
} from 'lucide-react'
import { fetchMedia, uploadMedia } from '@api/cms'
import { compressImageFile, MAX_IMAGE_BYTES } from '@utils/compressImage'
import styles from '../admin.module.css'

const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Navy', value: '#1a365d' },
  { label: 'Sky', value: '#2b6cb0' },
  { label: 'Gold', value: '#b7791f' },
  { label: 'Green', value: '#276749' },
  { label: 'Red', value: '#c53030' },
  { label: 'Gray', value: '#4a5568' },
]

const HIGHLIGHT_COLORS = [
  { label: 'None', value: '' },
  { label: 'Yellow', value: '#fef3c7' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Green', value: '#d1fae5' },
  { label: 'Pink', value: '#fce7f3' },
]

function ToolBtn({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      className={`${styles.editorToolBtn} ${active ? styles.editorToolBtnActive : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className={styles.editorDivider} aria-hidden="true" />
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write content…',
  minHeight = 220,
}) {
  const [mediaOpen, setMediaOpen] = useState(false)
  const [library, setLibrary] = useState([])
  const [uploading, setUploading] = useState(false)
  const [mediaError, setMediaError] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'rich-image' },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: 'rich-youtube' },
      }),
      TableKit.configure({
        table: { resizable: false },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    editorProps: {
      attributes: {
        class: styles.editorProse,
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || ''
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  const loadLibrary = useCallback(async () => {
    setMediaError('')
    try {
      const items = await fetchMedia()
      setLibrary(items.filter((item) => (item.mime_type || '').startsWith('image/')))
    } catch (err) {
      setMediaError(err.message || 'Failed to load media library')
    }
  }, [])

  useEffect(() => {
    if (mediaOpen) loadLibrary()
  }, [mediaOpen, loadLibrary])

  if (!editor) return null

  const setLink = () => {
    const previous = editor.getAttributes('link').href
    const url = window.prompt('Link URL', previous || 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const insertYoutube = () => {
    const url = window.prompt('YouTube URL', 'https://www.youtube.com/watch?v=')
    if (!url?.trim()) return
    editor.commands.setYoutubeVideo({ src: url.trim(), width: 640, height: 360 })
  }

  const insertImageUrl = () => {
    const url = window.prompt('Image URL', 'https://')
    if (!url?.trim()) return
    editor.chain().focus().setImage({ src: url.trim() }).run()
  }

  const insertFromLibrary = (url) => {
    editor.chain().focus().setImage({ src: url }).run()
    setMediaOpen(false)
  }

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setMediaError('')
    try {
      let uploadFile = file
      if (file.type?.startsWith('image/') && file.size > MAX_IMAGE_BYTES) {
        const compressed = await compressImageFile(file)
        uploadFile = compressed.file
      }
      const result = await uploadMedia(uploadFile, 'editor')
      insertFromLibrary(result.url)
    } catch (err) {
      setMediaError(err.errors?.file?.[0] || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorToolbar} role="toolbar" aria-label="Formatting">
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={15} />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={15} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Paragraph"
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow size={15} />
        </ToolBtn>
        <ToolBtn
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={15} />
        </ToolBtn>
        <ToolBtn
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolBtn>

        <Divider />

        <ToolBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </ToolBtn>
        <ToolBtn
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </ToolBtn>

        <label className={styles.editorSelectWrap} title="Text color">
          <span className={styles.editorSelectIcon} aria-hidden="true">
            A
          </span>
          <select
            className={styles.editorSelect}
            value={editor.getAttributes('textStyle').color || ''}
            onChange={(e) => {
              const color = e.target.value
              if (!color) editor.chain().focus().unsetColor().run()
              else editor.chain().focus().setColor(color).run()
            }}
          >
            {TEXT_COLORS.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.editorSelectWrap} title="Highlight">
          <Highlighter size={14} aria-hidden="true" />
          <select
            className={styles.editorSelect}
            value={editor.getAttributes('highlight').color || ''}
            onChange={(e) => {
              const color = e.target.value
              if (!color) editor.chain().focus().unsetHighlight().run()
              else editor.chain().focus().toggleHighlight({ color }).run()
            }}
          >
            {HIGHLIGHT_COLORS.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <Divider />

        <ToolBtn
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={15} />
        </ToolBtn>
        <ToolBtn
          title="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={15} />
        </ToolBtn>
        <ToolBtn
          title="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={15} />
        </ToolBtn>
        <ToolBtn
          title="Justify"
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify size={15} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolBtn>
        <ToolBtn
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn
          title="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolBtn>
        <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </ToolBtn>
        <ToolBtn title="Insert table" onClick={insertTable}>
          <TableIcon size={15} />
        </ToolBtn>

        <Divider />

        <ToolBtn title="Add / edit link" active={editor.isActive('link')} onClick={setLink}>
          <Link2 size={15} />
        </ToolBtn>
        <ToolBtn
          title="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <Unlink size={15} />
        </ToolBtn>
        <ToolBtn title="Insert image from URL" onClick={insertImageUrl}>
          <ImageIcon size={15} />
        </ToolBtn>
        <ToolBtn title="Insert image from media library" onClick={() => setMediaOpen((v) => !v)}>
          <FolderOpen size={15} />
        </ToolBtn>
        <ToolBtn title="Embed YouTube video" onClick={insertYoutube}>
          <YoutubeIcon size={15} />
        </ToolBtn>
        <ToolBtn
          title="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <Eraser size={15} />
        </ToolBtn>
      </div>

      {mediaOpen ? (
        <div className={styles.editorMediaPanel}>
          <div className={styles.actions}>
            <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setMediaOpen(false)}
            >
              Close
            </button>
          </div>
          {mediaError ? <p className={styles.error}>{mediaError}</p> : null}
          <div className={styles.mediaGrid}>
            {library.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.mediaThumb}
                onClick={() => insertFromLibrary(item.url)}
                title={item.original_name || item.url}
              >
                <img src={item.url} alt={item.alt || ''} />
              </button>
            ))}
            {!library.length && !mediaError ? (
              <p className={styles.muted}>No images in the library yet.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={styles.editorContent} style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
