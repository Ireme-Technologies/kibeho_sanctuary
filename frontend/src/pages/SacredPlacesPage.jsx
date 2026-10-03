import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { useSacredPlaces } from '@hooks/useSacredPlaces'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { placeCardExcerpt } from '@utils/text'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './CatalogPage.module.css'

export default function SacredPlacesPage({ type: typeProp }) {
  const { pathname } = useLocation()
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()

  const type = useMemo(() => {
    if (typeProp) return typeProp
    if (pathname.includes('apparition-sites')) return 'apparition_site'
    return 'main_place'
  }, [typeProp, pathname])

  const sectionKey =
    type === 'apparition_site' ? 'shrine.apparition-sites' : 'shrine.places'
  const hero = resolveSectionContent(section, sectionKey)
  const { items, error, loaded } = useSacredPlaces(type, locale)

  const heroImage = resolveHeaderImage(
    hero.heroImage,
    type === 'main_place' ? '/images/sanctuary/church.jpg' : '',
  )

  const basePath = type === 'apparition_site' ? '/shrine/apparition-sites' : '/shrine/places'

  const pageTitle = hero.title || (type === 'main_place' ? 'Main Places' : 'Apparition Sites')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(heroImage)}
        aria-hidden="true"
      />

      <div className={`container ${styles.body}`}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!loaded && !error ? <p className={styles.empty}>{t('loading')}</p> : null}

        {loaded && !error && !items.length ? (
          <p className={styles.empty}>Places will appear here once published.</p>
        ) : null}

        <div className={styles.gridThree}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path || `${basePath}/${item.slug}`}
              className={styles.card}
            >
              <div className={styles.cardMedia}>
                <img src={item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                <h2>{item.name || item.title}</h2>
                {placeCardExcerpt(item) ? <p className={styles.excerpt}>{placeCardExcerpt(item)}</p> : null}
                <span className={styles.cta}>{t('learnMore')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
