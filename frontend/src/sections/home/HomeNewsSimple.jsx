import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useInView } from '@hooks/useInView'
import styles from './HomeNewsSimple.module.css'

const SANCTUARY_COVERS = [
  '/images/sanctuary/hero.jpg',
  '/images/sanctuary/welcome.jpg',
  '/images/sanctuary/mary.jpg',
  '/images/sanctuary/hills.jpg',
  '/images/sanctuary/crest.jpg',
]

const LEGACY_COVER =
  /construction|structural|mep-engineering|interior-design|building-compliance|sustainable-construction|professional-project|kigali-business|nyarutarama|musanze|kacyiru/i

function resolveCover(src, index = 0) {
  if (!src || LEGACY_COVER.test(src)) {
    return SANCTUARY_COVERS[index % SANCTUARY_COVERS.length]
  }
  return src
}

function formatDate(value) {
  if (!value) return 'Update'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function HomeNewsSimple() {
  const { blogPosts } = useContent()
  const posts = (blogPosts || []).slice(0, 3)
  const [ref, inView] = useInView(0.12)

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>From the Sanctuary</p>
            <h2>Latest News</h2>
            <p>Activities, recent events, and announcements for pilgrims.</p>
          </div>
          <Link to="/news" className={styles.more}>
            All news →
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
                <span>{formatDate(post.publishedAt || post.date)}</span>
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
