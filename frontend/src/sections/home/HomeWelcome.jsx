import { ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { getPageFallback } from '@data/pages/content'
import { mergePageContent } from '@data/pages/mergePageContent'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import styles from './HomeWelcome.module.css'

const WELCOME_PATH = '/shrine/welcome'

export default function HomeWelcome() {
  const { section, resolveHeaderImage } = useContent()
  const { t } = useLocale()
  const data = mergePageContent(getPageFallback('shrine.welcome') || {}, section('shrine.welcome', {}))
  const [ref, inView] = useInView(0.15)

  const title = data.title || 'Welcome'
  const subtitle = data.subtitle || ''
  const intro = data.intro || ''
  const image = resolveHeaderImage(data.heroImage, '/images/sanctuary/welcome.jpg')

  return (
    <section className={styles.section} aria-labelledby="home-welcome-heading" ref={ref}>
      <div className={`container ${styles.layout} ${inView ? styles.visible : ''}`}>
        <div className={styles.copy}>
          {subtitle ? <p className={styles.eyebrow}>{subtitle}</p> : null}
          <h2 id="home-welcome-heading" className={styles.heading}>
            {title}
          </h2>
          <span className={styles.rule} aria-hidden="true" />
          {intro ? (
            <RichText html={intro} className={styles.text} />
          ) : null}
          <LocalizedLink to={WELCOME_PATH} className={styles.btn}>
            {t('viewMore')}
            <ArrowRight size={16} aria-hidden="true" />
          </LocalizedLink>
        </div>

        <div className={styles.mediaWrap}>
          <div className={styles.mediaFrame} aria-hidden="true">
            <div className={styles.mediaAccent} />
            <div className={styles.media}>
              <img src={image} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
