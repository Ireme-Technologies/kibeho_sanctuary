import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchShrineProjects } from '@api/cms'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import { getInvolvedHref } from '@utils/giveServices'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import catalog from './CatalogPage.module.css'
import styles from './SupportProject.module.css'

export default function SupportProjectsPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const hero = resolveSectionContent(section, 'support.projects')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchShrineProjects({ locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')
  const staleIntro = /principal places of worship|listed below/i.test(String(hero.intro || ''))

  return (
    <div className={catalog.page}>
      <header
        className={catalog.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'Sanctuary projects'}</h1>
          <p className={catalog.subtitle}>
            {hero.subtitle && !/already in place/i.test(hero.subtitle)
              ? hero.subtitle
              : t('project.listingSubtitle')}
          </p>
        </div>
      </header>

      <div className={`container ${catalog.body}`}>
        {staleIntro || !hero.intro ? (
          <p className={styles.lead}>{t('project.listingFallback')}</p>
        ) : (
          <RichText html={hero.intro} className={catalog.intro} />
        )}

        {error ? <p className={catalog.empty}>{error}</p> : null}

        {!error && !items.length ? (
          <p className={catalog.empty}>{t('project.emptyList')}</p>
        ) : null}

        <div className={catalog.gridThree}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path || `/support/projects/${item.slug}`}
              className={catalog.card}
            >
              <div className={catalog.cardMedia}>
                <img src={item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={catalog.cardBody}>
                {item.status ? <p className={catalog.meta}>{item.status}</p> : null}
                <h2>{item.title}</h2>
                {cardExcerpt(item) ? <p className={catalog.excerpt}>{cardExcerpt(item)}</p> : null}
                <span className={catalog.cta}>{t('project.cardCta')}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className={styles.funding}>
          {t('project.orGift')
            .split('{link}')
            .map((part, index) =>
              index === 0 ? (
                part
              ) : (
                <span key="gift">
                  <Link to={getInvolvedHref('offerings')}>{t('project.generalGift')}</Link>
                  {part}
                </span>
              )
            )}
        </p>
      </div>
    </div>
  )
}
