import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchMaryMessages } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { MESSAGE_FALLBACKS, usePublicDirectory } from '@data/directories'
import {
  maryMessagePageCopy,
  resolveMaryMessages,
} from '@data/directories/maryMessages'
import { heroBackgroundStyle } from '@utils/heroBackground'
import catalog from './CatalogPage.module.css'
import styles from './MaryMessagesPage.module.css'

function MessageBlocks({ blocks }) {
  if (!Array.isArray(blocks) || !blocks.length) return null
  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) => {
        if (block?.type === 'quotes') {
          return (
            <div key={index} className={styles.quotes}>
              {(block.items || []).map((quote, quoteIndex) => (
                <blockquote key={`${index}-${quoteIndex}`}>{quote}</blockquote>
              ))}
            </div>
          )
        }
        if (block?.text) {
          return (
            <p key={index} className={styles.prose}>
              {block.text}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

export default function MaryMessagesPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.messages')
  const apiItems = usePublicDirectory(
    () => fetchMaryMessages({ locale }),
    MESSAGE_FALLBACKS,
    locale,
    ['title', 'summary', 'body', 'theme', 'blocks'],
  )
  const items = resolveMaryMessages(apiItems, locale)
  const copy = maryMessagePageCopy(locale)
  const heroImage = resolveHeaderImage(hero.heroImage)
  const pageTitle = copy.heroTitle || hero.title || 'The Messages'
  const showCmsIntro = Boolean(hero.intro) && !copy.heading

  return (
    <div className={catalog.page}>
      <header className={catalog.hero} style={heroBackgroundStyle(heroImage)}>
        <div className="container">
          <h1>{pageTitle}</h1>
          {hero.subtitle && !copy.heading ? <p className={catalog.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${catalog.body}`}>
        <div className={styles.wrap}>
          {copy.heading ? <h2 className={styles.docTitle}>{copy.heading}</h2> : null}
          {showCmsIntro ? <RichText html={hero.intro} className={catalog.intro} /> : null}

          {!items.length ? (
            <p className={catalog.empty}>Messages will appear here once published.</p>
          ) : (
            <ol className={styles.list}>
              {items.map((item) => (
                <li key={item.id || item.number} className={styles.item}>
                  <span className={styles.num} aria-hidden="true">
                    {String(item.number || '').padStart(2, '0')}
                  </span>
                  <div className={styles.content}>
                    <h3>{item.title}</h3>
                    {item.blocks ? (
                      <MessageBlocks blocks={item.blocks} />
                    ) : item.body ? (
                      <RichText html={item.body} className={styles.prose} />
                    ) : item.summary ? (
                      <p className={styles.prose}>{item.summary}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {copy.citation ? <p className={styles.source}>{copy.citation}</p> : null}
        </div>
      </div>
    </div>
  )
}
