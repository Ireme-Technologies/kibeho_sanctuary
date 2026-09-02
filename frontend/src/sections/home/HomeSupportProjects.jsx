import { Link } from 'react-router-dom'
import { useParallax } from '@hooks/useParallax'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { mergePageContent } from '@data/pages/mergePageContent'
import { homeGiveWays, getInvolvedHref } from '@utils/giveServices'
import GiveWayCards from '@components/payments/GiveWayCards'
import styles from './HomeSupportProjects.module.css'

export default function HomeSupportProjects() {
  const { section, offerings, resolveHeaderImage } = useContent()
  const { t } = useLocale()
  const meta = mergePageContent(
    {
      eyebrow: t('home.projectsEyebrow'),
      heading: t('home.projectsHeading'),
      subtext: t('home.projectsSubtext'),
      backgroundImage: '/images/sanctuary/hills.jpg',
    },
    section('home.supportProjects', {}),
  )
  const [parallaxRef, parallaxOffset] = useParallax(0.18)
  const [inViewRef, inView] = useInView(0.12)
  const cards = homeGiveWays(offerings)
  const backgroundImage = resolveHeaderImage(meta.backgroundImage, '/images/sanctuary/hills.jpg')

  if (!cards.length) return null

  return (
    <section className={styles.band} ref={parallaxRef} aria-labelledby="home-give-heading">
      <div className={styles.parallaxBg} aria-hidden="true">
        <div
          className={styles.bgImage}
          style={{
            backgroundImage: `linear-gradient(165deg, rgba(18, 40, 71, 0.88), rgba(26, 54, 93, 0.78)), url(${backgroundImage})`,
            transform: `translateY(${parallaxOffset}px) scale(1.08)`,
          }}
        />
      </div>

      <div className={`container ${styles.inner} ${inView ? styles.visible : ''}`} ref={inViewRef}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>{meta.eyebrow}</p>
            <h2 id="home-give-heading">{meta.heading}</h2>
            <p className={styles.lead}>{meta.subtext}</p>
          </div>
          <div className={styles.links}>
            <Link to={getInvolvedHref()} className={styles.ctaPrimary}>
              Get involved
            </Link>
            <Link to="/support/master-plan" className={styles.more}>
              {t('home.viewMasterPlan')} →
            </Link>
          </div>
        </div>

        <GiveWayCards items={cards} variant="home" />
      </div>
    </section>
  )
}
