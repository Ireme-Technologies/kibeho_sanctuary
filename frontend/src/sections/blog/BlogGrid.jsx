import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { User, MessageCircle, ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import BlogSidebar from '@components/blog/BlogSidebar'
import { blogGridHeading, noResultsText } from '@data/blog/BlogGrid'
import styles from './BlogGrid.module.css'
import { useContent } from '@context/ContentContext'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function formatDateBadge(dateStr) {
  const d = new Date(dateStr)
  return { day: d.getDate(), month: MONTHS[d.getMonth()] }
}

function BlogCard({ post, index, inView, authors }) {
  const { day, month } = formatDateBadge(post.publishedAt)
  const author = authors.find((a) => a.id === post.authorId)

  return (
    <Link
      to={`/news/${post.slug}`}
      className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className={styles.imageArea}>
        <img className={styles.image} src={post.coverImage} alt="" aria-hidden="true" />
        <div className={styles.dateBadge}>
          <span className={styles.dateDay}>{day}</span>
          <span className={styles.dateMonth}>{month}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <User size={13} /> {author?.name ?? 'Shrine of Our Lady of Kibeho'}
          </span>
          <span className={styles.metaItem}>
            <MessageCircle size={13} /> {post.comments.length}
          </span>
        </div>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <span className={styles.readMore}>
          Read More <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default function BlogGrid() {
  const { blogPosts, blogAuthors } = useContent()
  const [sectionRef, inView] = useInView(0.1)
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const category = (searchParams.get('category') || '').trim()

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const cat = category.toLowerCase()
    return blogPosts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      const postCat = String(p.category || '').toLowerCase()
      const matchesCategory =
        !cat ||
        postCat === cat ||
        postCat.includes(cat) ||
        (cat === 'rector' && postCat.includes('rector')) ||
        (cat === 'bishop' && postCat.includes('bishop'))
      return matchesQuery && matchesCategory
    })
  }, [blogPosts, query, category])

  const heading = category
    ? category === 'Rector'
      ? "Rector's Messages"
      : category === 'Bishop'
        ? "Bishop's Messages"
        : category
    : blogGridHeading

  return (
    <section className={styles.section}>
      <div className={`container ${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={`container ${styles.layout}`}>
        <div ref={sectionRef} className={styles.grid}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} inView={inView} authors={blogAuthors} />
            ))
          ) : (
            <p className={styles.noResults}>{noResultsText}</p>
          )}
        </div>

        <BlogSidebar initialQuery={query} onSearch={setQuery} />
      </div>
    </section>
  )
}