import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { mergePageContent } from '@data/pages/mergePageContent'
import { getPageFallback } from '@data/pages/content'
import { applyPageSeo, stripHtml } from '@utils/seo'
import { isValidServiceKey, resolveGiveWays } from '@utils/giveServices'
import GiveWayCards from '@components/payments/GiveWayCards'
import OfferingForm from '@components/OfferingForm'
import RichText from '@components/ui/RichText'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './GetInvolvedPage.module.css'

export default function GetInvolvedPage() {
  const { section, offerings, resolveHeaderImage } = useContent()
  const { t } = useLocale()
  const [params, setParams] = useSearchParams()
  const rawService = params.get('service') || ''
  const serviceKey = isValidServiceKey(rawService) ? rawService : 'offerings'

  const page = mergePageContent(getPageFallback('support.donations') || {}, section('support.donations', {}))
  const heroImage = resolveHeaderImage(page.heroImage, '/images/sanctuary/hills.jpg')
  const giveWays = resolveGiveWays(offerings)

  useEffect(() => {
    applyPageSeo({
      title: page.title || 'Get involved',
      description: page.seoDescription || stripHtml(page.intro) || page.subtitle,
      image: heroImage,
      path: window.location.pathname,
    })
  }, [page.title, page.seoDescription, page.intro, page.subtitle, heroImage])

  const setService = (key) => {
    setParams(key && key !== 'offerings' ? { service: key } : {}, { replace: true })
    const form = document.getElementById('pledge')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(
          heroImage,
          'linear-gradient(120deg, rgba(18,40,71,.9), rgba(26,54,93,.62))',
        )}
      >
        <div className="container">
          {page.eyebrow ? <p className={styles.eyebrow}>{page.eyebrow}</p> : null}
          <h1>{page.title || 'Get involved'}</h1>
          {page.subtitle ? <p className={styles.subtitle}>{page.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {page.intro ? <RichText html={page.intro} className={styles.intro} /> : null}

        <GiveWayCards
          items={giveWays}
          variant="page"
          activeKey={serviceKey}
          onSelect={setService}
        />

        <OfferingForm
          serviceKey={serviceKey}
          showServicePicker={false}
          onServiceChange={setService}
          showShare={false}
        />

        <p className={styles.back}>
          <Link to="/support/projects">{t('home.viewProjects')} →</Link>
        </p>
      </div>
    </div>
  )
}
