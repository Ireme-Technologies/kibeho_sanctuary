import { useContent } from '@context/ContentContext'
import { getPageFallback } from '@data/pages/content'
import { mergePageContent } from '@data/pages/mergePageContent'
import { welcomePageDefaults } from '@data/welcomePage'
import styles from './HomeQuickLinks.module.css'

function pick(data, path, fallback = '') {
  const parts = path.split('.')
  let cur = data
  for (const part of parts) {
    if (cur == null) return fallback
    cur = cur[part]
  }
  return cur ?? fallback
}

export default function HomeQuickLinks() {
  const { section } = useContent()
  const fallback = getPageFallback('shrine.welcome') || {}
  const data = mergePageContent(fallback, section('shrine.welcome', {}))
  const defaults = welcomePageDefaults

  const mission = {
    title: pick(data, 'mission.title', defaults.mission.title),
    text: pick(data, 'mission.text', defaults.mission.text),
  }
  const vision = {
    title: pick(data, 'vision.title', defaults.vision.title),
    text: pick(data, 'vision.text', defaults.vision.text),
  }

  return (
    <section className={styles.section} aria-labelledby="home-mission-vision-heading">
      <div className="container">
        <h2 id="home-mission-vision-heading" className={styles.heading}>
          Mission & vision
        </h2>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>{mission.title}</h3>
            <p>{mission.text}</p>
          </article>
          <article className={styles.card}>
            <h3>{vision.title}</h3>
            <p>{vision.text}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
