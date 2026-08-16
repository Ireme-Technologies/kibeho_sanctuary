import { Link, useSearchParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import styles from './Pagination.module.css'

export default function Pagination({ page, pageCount, total, pageSize }) {
  const { t } = useLocale()
  const [params] = useSearchParams()
  if (pageCount <= 1) return null
  const hrefFor = (n) => {
    const next = new URLSearchParams(params)
    if (n <= 1) next.delete('page')
    else next.set('page', String(n))
    const q = next.toString()
    return { search: q ? `?${q}` : '' }
  }

  const pages = []
  for (let n = 1; n <= pageCount; n += 1) pages.push(n)

  return (
    <nav className={styles.bar} aria-label={t('page.pagination')}>
      {page > 1 ? (
        <Link className={styles.btn} to={hrefFor(page - 1)}>
          {t('page.previous')}
        </Link>
      ) : (
        <span className={`${styles.btn} ${styles.disabled}`}>{t('page.previous')}</span>
      )}
      <ol className={styles.pages}>
        {pages.map((n) => (
          <li key={n}>
            {n === page ? (
              <span className={`${styles.num} ${styles.current}`} aria-current="page">
                {n}
              </span>
            ) : (
              <Link className={styles.num} to={hrefFor(n)}>
                {n}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {page < pageCount ? (
        <Link className={styles.btn} to={hrefFor(page + 1)}>
          {t('page.next')}
        </Link>
      ) : (
        <span className={`${styles.btn} ${styles.disabled}`}>{t('page.next')}</span>
      )}
      {typeof total === 'number' ? (
        <p className={styles.meta}>
          {total} {total === 1 ? t('page.item') : t('page.items')}
          {pageSize ? ` · ${pageSize} ${t('page.perPage')}` : ''}
        </p>
      ) : null}
    </nav>
  )
}
