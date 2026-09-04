import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { useInView } from '@hooks/useInView'
import { formatLocaleDate } from '@utils/localeDate'
import { firstUsableImage } from '@utils/siteImages'
import styles from './HomeNewsSimple.module.css'

const SANCTUARY_COVERS = [
  '/images/sanctuary/welcome.jpg',
  '/images/sanctuary/mary.jpg',
  '/images/sanctuary/hills.jpg',
  '/images/sanctuary/crest.jpg',
]

const LEGACY_COVER =
  /construction|structural|mep-engineering|interior-design|building-compliance|sustainable-construction|professional-project|kigali-business|nyarutarama|musanze|kacyiru/i

function resolveCover(src, index = 0) {
  const fallback = SANCTUARY_COVERS[index % SANCTUARY_COVERS.length]
  if (!src || LEGACY_COVER.test(src)) return firstUsableImage([fallback])
  return firstUsableImage([src, fallback])
}

function formatDate(value, locale) {
  if (!value) return 'Update'
  const formatted = formatLocaleDate(value, locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return formatted || String(value)
}

export default function HomeNewsSimple() {
  const { blogPosts } = useContent()
  const { locale, t } = useLocale()
  const posts = (blogPosts || []).slice(0, 3)
  const [ref, inView] = useInView(0.12)

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{t('home.newsEyebrow')}</p>
            <h2>{t('home.newsHeading')}</h2>
            <p>{t('home.newsSubtext')}</p>
          </div>
          <Link to="/news" className={styles.more}>
            {t('home.allNews')} →
          </Link>
        </div>
        <div className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {posts.map((post, index) => (
            <Link
              key={post.slug || post.id}
              to={`/news/${post.slug}`}
              className={styles.card}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className={styles.imageWrap}>
                <img
                  src={resolveCover(post.coverImage, index)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = SANCTUARY_COVERS[index % SANCTUARY_COVERS.length]
                  }}
                />
              </div>
              <div className={styles.body}>
                <span>{formatDate(post.publishedAt || post.date, locale)}</span>
                <h3>{post.title}</h3>
                {post.category ? <em>{post.category}</em> : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
