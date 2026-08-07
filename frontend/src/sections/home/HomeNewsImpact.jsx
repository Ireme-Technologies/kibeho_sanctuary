import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { impact } from '@data/home/sanctuaryHome'
import styles from './HomeNewsImpact.module.css'

export default function HomeNewsImpact() {
  const { blogPosts } = useContent()
  const posts = (blogPosts || []).slice(0, 3)

  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.headRow}>
            <h2 className={styles.heading}>Recent News & Events</h2>
            <Link to="/news" className={styles.more}>
              View all
            </Link>
          </div>
          <ul className={styles.newsList}>
            {posts.map((post) => (
              <li key={post.slug || post.id}>
                <Link to={`/news/${post.slug}`} className={styles.newsItem}>
                  <img
                    src={post.coverImage || post.image || '/images/blog/authors/team.jpg'}
                    alt=""
                    className={styles.thumb}
                  />
                  <span>
                    <span className={styles.date}>{post.publishedAt || post.date || 'Upcoming'}</span>
                    <strong className={styles.newsTitle}>{post.title}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.impact}>
          <img src={impact.image} alt="" className={styles.impactImg} />
          <div className={styles.impactBody}>
            <h2 className={styles.heading}>{impact.heading}</h2>
            <p className={styles.impactText}>{impact.text}</p>
            <ul className={styles.points}>
              {impact.points.map((point) => (
                <li key={point}>
                  <Check size={18} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to={impact.cta.path} className={styles.btn}>
              {impact.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
