import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchVisionaries } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { VISIONARY_FALLBACKS, usePublicDirectory } from '@data/directories'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function VisionariesPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.visionaries', ['our-lady.visionaries'])
  const items = usePublicDirectory(
    () => fetchVisionaries({ locale }),
    VISIONARY_FALLBACKS,
    locale,
    ['name', 'summary', 'description', 'periodLabel'],
  )

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/welcome.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'The Visionaries'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {!items.length ? (
          <p className={styles.empty}>Visionaries will appear here once published.</p>
        ) : null}

        <div className={styles.gridThree}>
          {items.map((item) => {
            const detailPath = item.path || `/shrine/visionaries/${item.slug}`
            const teaser = item.summary || cardExcerpt(item)
            return (
              <article key={item.id || item.slug} className={styles.card}>
                <div className={styles.cardMedia}>
                  <img src={item.photo || item.coverImage || defaultHeaderImage} alt={item.name} />
                </div>
                <div className={styles.cardBody}>
                  {item.periodLabel ? <p className={styles.meta}>{item.periodLabel}</p> : null}
                  <h2>{item.name}</h2>
                  {item.isApproved === false ? (
                    <p className={styles.meta}>Not approved by the Church</p>
                  ) : null}
                  {teaser ? <p className={styles.excerpt}>{teaser}</p> : null}
                  <Link to={detailPath} className={styles.cta}>
                    View details →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
