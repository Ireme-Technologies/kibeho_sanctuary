import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { User, MessageCircle, ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import BlogSidebar from '@components/blog/BlogSidebar'
import Pagination from '@components/Pagination'
import { PAGE_SIZE, paginate, sortByLatest } from '@utils/paginate'
import { formatDateBadge } from '@utils/localeDate'
import styles from './BlogGrid.module.css'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'

function BlogCard({ post, index, inView, authors, locale, t }) {
  const { day, month } = formatDateBadge(post.publishedAt, locale)
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
          {t('readMore')} <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default function BlogGrid() {
  const { blogPosts, blogAuthors } = useContent()
  const { locale, t } = useLocale()
  const [sectionRef, inView] = useInView(0.1)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = (searchParams.get('category') || '').trim()
  const page = Number(searchParams.get('page') || 1)

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const cat = category.toLowerCase()
    const matched = blogPosts.filter((p) => {
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
    return sortByLatest(matched, (p) => p.publishedAt)
  }, [blogPosts, query, category])

  const paged = paginate(filteredPosts, page, PAGE_SIZE)

  const heading = category
    ? category === 'Rector'
      ? t('rectorsMessages')
      : category === 'Bishop'
        ? t('bishopsMessages')
        : category
    : t('newsFromShrine')

  const handleSearch = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('q', value)
    else next.delete('q')
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={`container ${styles.layout}`}>
        <div ref={sectionRef} className={styles.grid}>
          {paged.items.length > 0 ? (
            paged.items.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                inView={inView}
                authors={blogAuthors}
                locale={locale}
                t={t}
              />
            ))
          ) : (
            <p className={styles.noResults}>{t('noArticlesMatch')}</p>
          )}
          <Pagination
            page={paged.page}
            pageCount={paged.pageCount}
            total={paged.total}
            pageSize={PAGE_SIZE}
          />
        </div>

        <BlogSidebar initialQuery={query} onSearch={handleSearch} />
      </div>
    </section>
  )
}
