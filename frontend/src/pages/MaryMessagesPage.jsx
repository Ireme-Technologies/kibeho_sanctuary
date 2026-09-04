import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchMaryMessages } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { MESSAGE_FALLBACKS, usePublicDirectory } from '@data/directories'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function MaryMessagesPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.messages')
  const items = usePublicDirectory(
    () => fetchMaryMessages({ locale }),
    MESSAGE_FALLBACKS,
    locale,
    ['title', 'summary', 'body', 'theme'],
  )

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'The Messages'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {!items.length ? (
          <p className={styles.empty}>Messages will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id || item.number} className={styles.card}>
              {item.image ? (
                <div className={styles.cardMedia}>
                  <img src={item.image || item.coverImage || defaultHeaderImage} alt="" />
                </div>
              ) : null}
              <div className={styles.cardBody}>
                {item.number ? <p className={styles.meta}>Message {item.number}</p> : null}
                <h2>{item.title}</h2>
                {item.theme ? <p className={styles.meta}>{item.theme}</p> : null}
                {item.dateContext ? <p className={styles.meta}>{item.dateContext}</p> : null}
                {item.body ? (
                  <RichText html={item.body} className={styles.excerpt} />
                ) : cardExcerpt({ description: item.summary }) ? (
                  <p className={styles.excerpt}>{cardExcerpt({ description: item.summary })}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
