import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  User,
  MessageCircle,
  Check,
  Quote,
  Facebook,
  Instagram,
  Linkedin,
  X,
  ArrowLeft,
  ArrowRight,
  Send,
} from 'lucide-react'
import BlogSidebar from '@components/blog/BlogSidebar'
import ImageLightbox from '@components/ui/ImageLightbox'
import RichText from '@components/ui/RichText'
import { getInitials } from '@utils/text'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { displayTitleLabel } from '@i18n/typography'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import {
  postNotFoundText,
  backToBlogLabel,
  shareLabel,
  relatedPostsLabel,
  commentsLabel,
  leaveCommentLabel,
  commentFormDisclaimer,
  commentFormFields,
} from '@data/blog/BlogPostContent'
import styles from './BlogPostContent.module.css'

const socialIcons = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, x: X }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function collectPostImages(post) {
  const images = []
  if (post.coverImage) {
    images.push({ src: post.coverImage, alt: post.title || 'Featured image' })
  }
  ;(post.content || []).forEach((block) => {
    if (block.type === 'image' && block.src) {
      images.push({ src: block.src, alt: block.caption || '' })
    }
    if (block.type === 'gallery' && Array.isArray(block.images)) {
      block.images.forEach((src) => {
        if (src) images.push({ src, alt: '' })
      })
    }
  })
  return images
}

function ContentBlock({ block, onOpenImage }) {
  switch (block.type) {
    case 'html':
      return <RichText html={block.html} className={styles.htmlBody} />
    case 'paragraph':
      return <p className={styles.paragraph}>{block.text}</p>
    case 'heading':
      return <h3 className={styles.subheading}>{block.text}</h3>
    case 'image':
      return (
        <figure className={styles.imageBlock}>
          <button
            type="button"
            className={styles.imageButton}
            onClick={() => onOpenImage?.(block.src)}
            aria-label="View image"
          >
            <img src={block.src} alt={block.caption || ''} />
          </button>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'checklist':
      return (
        <ul className={styles.checklist}>
          {(block.items || []).map((item, i) => (
            <li key={i}>
              <Check size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className={styles.quoteBlock}>
          <Quote size={28} className={styles.quoteIcon} aria-hidden="true" />
          <p>{block.text}</p>
          {block.author && <cite>— {block.author}</cite>}
        </blockquote>
      )
    case 'gallery':
      return (
        <div className={styles.galleryBlock}>
          {(block.images || []).map((src, i) => (
            <button
              key={i}
              type="button"
              className={styles.imageButton}
              onClick={() => onOpenImage?.(src)}
              aria-label={`View gallery image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )
    default:
      return null
  }
}

function CommentForm() {
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' })

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const handleSubmit = (e) => e.preventDefault()

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <h4 className={styles.commentFormTitle}>{leaveCommentLabel}</h4>
      <div className={styles.formRow}>
        <input
          type="text"
          placeholder={commentFormFields.name}
          value={form.name}
          onChange={handleChange('name')}
        />
        <input
          type="email"
          placeholder={commentFormFields.email}
          value={form.email}
          onChange={handleChange('email')}
        />
      </div>
      <input
        type="text"
        placeholder={commentFormFields.website}
        value={form.website}
        onChange={handleChange('website')}
        className={styles.fullWidthInput}
      />
      <textarea
        placeholder={commentFormFields.message}
        value={form.message}
        onChange={handleChange('message')}
        rows={5}
      />
      <button type="submit" className={styles.submitBtn}>
        {commentFormFields.submit} <Send size={15} />
      </button>
      <p className={styles.formDisclaimer}>{commentFormDisclaimer}</p>
    </form>
  )
}

export default function BlogPostContent() {
  const { slug } = useParams()
  const { blogPosts, blogAuthors } = useContent()
  const { locale } = useLocale()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug)
  const post = blogPosts[currentIndex]

  if (!post) {
    return (
      <section className={styles.section}>
        <div className={`container ${styles.notFound}`}>
          <p>{postNotFoundText}</p>
          <Link to="/news" className={styles.backLink}>
            <ArrowLeft size={16} /> {backToBlogLabel}
          </Link>
        </div>
      </section>
    )
  }

  const author =
    post.author?.name
      ? post.author
      : blogAuthors.find((a) => a.id === post.authorId)
  const prevPost = blogPosts[(currentIndex - 1 + blogPosts.length) % blogPosts.length]
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length]
  const postImages = collectPostImages(post)

  const openImage = (src) => {
    const index = postImages.findIndex((item) => item.src === src)
    setLightboxIndex(index >= 0 ? index : 0)
  }

  const shareUrl =
    typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
  const shareText = encodeURIComponent(post.title)
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    instagram: '#',
    x: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <article className={styles.article}>
          <button
            type="button"
            className={`${styles.featuredImage} ${styles.imageButton}`}
            onClick={() => openImage(post.coverImage)}
            aria-label="View featured image"
          >
            <img src={post.coverImage} alt="" />
          </button>

          <h1 className={styles.title}>{displayTitleLabel(post.title, locale)}</h1>
          <ContentLocaleNotice translations={post.translations} />

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <User size={14} /> {author?.name ?? 'Kibeho Sanctuary Team'}
            </span>
            <span className={styles.metaItem}>
              <Calendar size={14} /> {formatDate(post.publishedAt)}
            </span>
            <span className={styles.metaItem}>
              <MessageCircle size={14} /> {(post.comments || []).length}
            </span>
          </div>

          <div className={styles.content}>
            {(post.content || []).map((block, i) => (
              <ContentBlock key={i} block={block} onOpenImage={openImage} />
            ))}
          </div>

          <div className={styles.tagsShareRow}>
            <div className={styles.tags}>
              {(post.tags || []).map((tag) => (
                <span key={tag} className={styles.tagPill}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.share}>
              <span className={styles.shareLabel}>{shareLabel}</span>
              {Object.entries(shareLinks).map(([key, href]) => {
                const Icon = socialIcons[key]
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${key}`}
                    className={styles.shareIcon}
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          {author && (
            <div className={styles.authorBio}>
              <div className={styles.authorAvatar}>
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} />
                ) : (
                  <span>{getInitials(author.name)}</span>
                )}
              </div>
              <div>
                <p className={styles.authorName}>{author.name}</p>
                <p className={styles.authorRole}>{author.role}</p>
                <p className={styles.authorBioText}>{author.bio}</p>
                <div className={styles.authorSocials}>
                  {(author.socials || []).map(({ iconKey, href }) => {
                    const Icon = socialIcons[iconKey]
                    if (!Icon || !href) return null
                    return (
                      <a key={iconKey} href={href} aria-label={iconKey} className={styles.shareIcon}>
                        <Icon size={14} />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <nav className={styles.prevNext} aria-label={relatedPostsLabel}>
            <Link to={`/news/${prevPost.slug}`} className={styles.prevNextLink}>
              <ArrowLeft size={16} />
              <div>
                <span className={styles.prevNextLabel}>Previous</span>
                <p className={styles.prevNextTitle}>{prevPost.title}</p>
              </div>
            </Link>
            <Link to={`/news/${nextPost.slug}`} className={`${styles.prevNextLink} ${styles.next}`}>
              <div>
                <span className={styles.prevNextLabel}>Next</span>
                <p className={styles.prevNextTitle}>{nextPost.title}</p>
              </div>
              <ArrowRight size={16} />
            </Link>
          </nav>

          <div className={styles.comments}>
            <h3 className={styles.commentsTitle}>
              {commentsLabel} ({(post.comments || []).length})
            </h3>
            {(post.comments || []).map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  {comment.avatar ? (
                    <img src={comment.avatar} alt={comment.name} />
                  ) : (
                    <span>{getInitials(comment.name)}</span>
                  )}
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentHeader}>
                    <div>
                      <p className={styles.commentName}>{comment.name}</p>
                      <p className={styles.commentDate}>{formatDate(comment.date)}</p>
                    </div>
                    <button type="button" className={styles.replyBtn}>
                      Reply
                    </button>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              </div>
            ))}

            <CommentForm />
          </div>
        </article>

        <BlogSidebar excludeId={post.id} />
      </div>

      <ImageLightbox
        open={lightboxIndex !== null}
        images={postImages}
        index={lightboxIndex ?? 0}
        onChangeIndex={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  )
}