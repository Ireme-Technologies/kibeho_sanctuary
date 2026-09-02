import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronRight, Church, Heart, Leaf, Sparkles } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchPastoralTeam } from '@api/cms'
import { getPageFallback } from '@data/pages/content'
import { mergePageContent } from '@data/pages/mergePageContent'
import { welcomePageDefaults } from '@data/welcomePage'
import { getInvolvedHref } from '@utils/giveServices'
import { applyPageSeo, stripHtml } from '@utils/seo'
import { cardExcerpt } from '@utils/text'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import styles from './WelcomePage.module.css'

const VALUE_ICONS = [Sparkles, Heart, Church, Leaf]
const GUIDELINES_PATH = '/pilgrimage/practical-guidelines'
const MAP_PAGE_PATH = '/shrine/map'
const TEAM_PAGE_PATH = '/shrine/pastoral-team'
const LEADERSHIP_LIMIT = 4

function pick(data, path, fallback = '') {
  const parts = path.split('.')
  let cur = data
  for (const part of parts) {
    if (cur == null) return fallback
    cur = cur[part]
  }
  return cur ?? fallback
}

export default function WelcomePage() {
  const { section, pages, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const record = pages?.['shrine.welcome']
  const fallback = getPageFallback('shrine.welcome') || {}
  const data = mergePageContent(fallback, section('shrine.welcome', {}))
  const defaults = welcomePageDefaults

  const [team, setTeam] = useState([])
  const [teamError, setTeamError] = useState('')

  useEffect(() => {
    fetchPastoralTeam({ locale })
      .then(setTeam)
      .catch((err) => setTeamError(err.message))
  }, [locale])

  const heroImage = resolveHeaderImage(data.heroImage, '/images/sanctuary/welcome.jpg')
  const welcomeImage = resolveHeaderImage(data.welcomeImage || data.heroImage, '/images/sanctuary/welcome.jpg')
  const mapImage = resolveHeaderImage(
    pick(data, 'map.image') || data.mapImage,
    defaults.map.image,
  )

  const mission = {
    eyebrow: pick(data, 'mission.eyebrow', defaults.mission.eyebrow),
    title: pick(data, 'mission.title', defaults.mission.title),
    text: pick(data, 'mission.text', defaults.mission.text),
  }
  const vision = {
    eyebrow: pick(data, 'vision.eyebrow', defaults.vision.eyebrow),
    title: pick(data, 'vision.title', defaults.vision.title),
    text: pick(data, 'vision.text', defaults.vision.text),
  }
  const values = (Array.isArray(data.values) && data.values.length ? data.values : defaults.values).filter(
    (item) => item?.title,
  )
  const leadershipTitle = pick(data, 'leadership.title', defaults.leadership.title)
  const leadershipIntro = pick(data, 'leadership.intro', defaults.leadership.intro)
  const mapCaption = pick(data, 'map.caption', defaults.map.caption)
  const mapAlt = pick(data, 'map.alt', defaults.map.alt)
  const exploreLinks = useMemo(() => {
    const links = Array.isArray(data.exploreLinks) && data.exploreLinks.length ? data.exploreLinks : defaults.exploreLinks
    return links.filter((item) => item?.label && item?.path && item.path !== '/shrine/welcome')
  }, [data.exploreLinks, defaults.exploreLinks])

  const featuredTeam = team.slice(0, LEADERSHIP_LIMIT)
  const [welcomeRef, welcomeInView] = useInView(0.12)

  /* Same heading pattern as HomeWelcome below the homepage hero */
  const welcomeEyebrow = data.subtitle || ''
  const welcomeHeading = data.title || 'Welcome to Kibeho'

  useEffect(() => {
    applyPageSeo({
      title: data.title || 'Welcome',
      description: data.seoDescription || stripHtml(data.intro) || data.subtitle,
      image: heroImage,
      path: '/shrine/welcome',
    })
  }, [data.title, data.seoDescription, data.intro, data.subtitle, heroImage])

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.52)), url(${heroImage})`,
        }}
      >
        <div className="container">
          {data.eyebrow ? <p className={styles.eyebrow}>{data.eyebrow}</p> : null}
          <h1>{data.title || 'Welcome to Kibeho'}</h1>
          {data.subtitle ? <p className={styles.subtitle}>{data.subtitle}</p> : null}
        </div>
      </header>

      <section className={styles.welcomeSection} aria-labelledby="welcome-intro-heading">
        <div className="container">
          <ContentLocaleNotice translations={record?.translations} />
          <div
            ref={welcomeRef}
            className={`${styles.welcomeGrid} ${welcomeInView ? styles.welcomeVisible : ''}`}
          >
            <div className={styles.welcomeCopy}>
              {welcomeEyebrow ? <p className={styles.eyebrow}>{welcomeEyebrow}</p> : null}
              <h2 id="welcome-intro-heading" className={styles.welcomeHeading}>
                {welcomeHeading}
              </h2>
              <span className={styles.rule} aria-hidden="true" />
              {data.intro ? <RichText html={data.intro} className={styles.introText} /> : null}
            </div>
            <div className={styles.mediaWrap}>
              <div className={styles.mediaFrame}>
                <div className={styles.mediaAccent} aria-hidden="true" />
                <div className={styles.media}>
                  <img src={welcomeImage} alt="" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="mission-vision-heading">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Who we are</p>
            <h2 id="mission-vision-heading">Mission & vision</h2>
          </div>
          <div className={styles.mvGrid}>
            <article className={styles.mvCard}>
              <p className={styles.eyebrow}>{mission.eyebrow}</p>
              <h3>{mission.title}</h3>
              <p>{mission.text}</p>
            </article>
            <article className={styles.mvCard}>
              <p className={styles.eyebrow}>{vision.eyebrow}</p>
              <h3>{vision.title}</h3>
              <p>{vision.text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="values-heading">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>What guides us</p>
            <h2 id="values-heading">Core values</h2>
            <p>These principles shape how the Shrine welcomes pilgrims and serves the message of Our Lady of Kibeho.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((item, index) => {
              const Icon = VALUE_ICONS[index] || Heart
              return (
                <article key={item.title} className={styles.valueCard}>
                  <span className={styles.valueIcon} aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="leadership-heading">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Pastoral life</p>
            <h2 id="leadership-heading">{leadershipTitle}</h2>
            {leadershipIntro ? <p>{leadershipIntro}</p> : null}
          </div>

          {teamError ? <p className={styles.emptyNote}>{teamError}</p> : null}
          {!teamError && !featuredTeam.length ? (
            <p className={styles.emptyNote}>Team members will appear here once published.</p>
          ) : null}

          {featuredTeam.length ? (
            <div className={styles.teamGrid}>
              {featuredTeam.map((member) => (
                <LocalizedLink
                  key={member.id || member.slug}
                  to={member.path || `${TEAM_PAGE_PATH}/${member.slug}`}
                  className={styles.teamCard}
                >
                  <div className={styles.teamPhoto}>
                    <img
                      src={member.photo || member.coverImage || defaultHeaderImage}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.teamBody}>
                    {member.role ? <p className={styles.teamRole}>{member.role}</p> : null}
                    <h3>{member.name}</h3>
                    {cardExcerpt({ description: member.bio || member.description }) ? (
                      <span>{cardExcerpt({ description: member.bio || member.description })}</span>
                    ) : (
                      <span>View profile →</span>
                    )}
                  </div>
                </LocalizedLink>
              ))}
            </div>
          ) : null}

          <p className={styles.teamMore}>
            <LocalizedLink to={TEAM_PAGE_PATH}>
              Meet the full pastoral team →
            </LocalizedLink>
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.exploreSection}`} aria-labelledby="explore-heading">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>The Shrine</p>
            <h2 id="explore-heading">Explore the Shrine</h2>
            <p>Walk through history, apparition sites, the schedule, communities, and the places pilgrims come to pray.</p>
          </div>
          <nav className={styles.exploreGrid} aria-label="Shrine pages">
            {exploreLinks.map((link) => (
              <LocalizedLink key={link.path} to={link.path} className={styles.exploreLink}>
                {link.label}
                <ChevronRight size={18} aria-hidden="true" />
              </LocalizedLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <LocalizedLink to={GUIDELINES_PATH} className={styles.btnPrimary}>
              Guidelines before you come
              <ArrowRight size={16} aria-hidden="true" />
            </LocalizedLink>
            <LocalizedLink to={getInvolvedHref()} className={styles.btnGhost}>
              Get involved
              <Heart size={16} aria-hidden="true" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      <div className={styles.mapBand}>
        <LocalizedLink to={MAP_PAGE_PATH} className={styles.mapLink}>
          <img src={mapImage} alt={mapAlt} className={styles.mapImage} loading="lazy" />
          <div className={styles.mapOverlay}>
            <div className="container">
              <div className={styles.mapPanel}>
                <h2>Shrine map</h2>
                {mapCaption ? <p>{mapCaption}</p> : null}
                <span className={styles.mapCta}>
                  Open the interactive map
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </LocalizedLink>
      </div>
    </div>
  )
}
