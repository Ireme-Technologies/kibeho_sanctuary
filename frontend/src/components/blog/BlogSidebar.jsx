import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchPlaceholder, popularPostsLabel } from '@data/blog/BlogGrid'
import styles from './BlogSidebar.module.css'
import { useContent } from '@context/ContentContext'
import { sortByLatest } from '@utils/paginate'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function formatDateBadge(dateStr) {
  const d = new Date(dateStr)
  return { day: d.getDate(), month: MONTHS[d.getMonth()] }
}

/**
 * Shared between BlogGrid (list page) and BlogPostContent (detail page).
 * `excludeId`: omit the current post from its own "Popular Posts" list.
 * `initialQuery`: pre-fill the search input (used by BlogGrid when
 * arriving via /blog?q=...).
 * `onSearch`: if provided (BlogGrid only), filters in place instead of
 * navigating — lets the grid page update live as you type.
 */
export default function BlogSidebar({ excludeId, initialQuery = '', onSearch }) {
  const { blogPosts } = useContent()
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)

  const popularPosts = sortByLatest(
    blogPosts.filter((p) => p.id !== excludeId),
    (post) => post.publishedAt,
  ).slice(0, 4)

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) onSearch(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!onSearch) {
      navigate(`/blog?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.widget}>
        <form className={styles.searchBox} onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={searchPlaceholder}
            aria-label="Search blog posts"
          />
          <button type="submit" className={styles.searchIcon} aria-label="Search">
            <Search size={16} />
          </button>
        </form>
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>{popularPostsLabel}</h4>
        <ul className={styles.popularList}>
          {popularPosts.map((post) => {
            const { day, month } = formatDateBadge(post.publishedAt)
            return (
              <li key={post.id}>
                <Link to={`/news/${post.slug}`} className={styles.popularItem}>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" className={styles.popularThumb} />
                  ) : null}
                  <div>
                    <span className={styles.popularDate}>
                      {day} {month}
                    </span>
                    <p className={styles.popularTitle}>{post.title}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}