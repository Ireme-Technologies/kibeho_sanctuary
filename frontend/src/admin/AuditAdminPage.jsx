import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCmsAudit } from '@api/cms'
import { AuditBar, AuditCriticalList, AuditScore, statusLabel } from './components/AuditPanel'
import styles from './admin.module.css'

export default function AuditAdminPage() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState('')

  const load = () => {
    setError('')
    fetchCmsAudit()
      .then(setReport)
      .catch((err) => setError(err.message || 'Could not load the content report.'))
  }

  useEffect(() => {
    load()
  }, [])

  if (error) {
    return (
      <div className={styles.card}>
        <h1>CMS audit</h1>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.btn} onClick={load}>
          Try again
        </button>
      </div>
    )
  }

  if (!report) {
    return (
      <div className={styles.card}>
        <h1>CMS audit</h1>
        <p className={styles.muted}>Checking site content…</p>
      </div>
    )
  }

  const { overall, settings, setup, pages, directories, translations, critical } = report

  return (
    <div>
      <div className={styles.topbar}>
        <h1>CMS audit</h1>
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={load}>
          Refresh
        </button>
      </div>
      <p className={styles.muted} style={{ marginTop: 0, maxWidth: '46rem' }}>
        A readiness score for this site. Official copy is seeded; photos are left empty on purpose so the
        site uses the default header image until you upload the real ones. Open any red or amber item to
        add a missing photo, social URL, contact detail, or translation.
      </p>

      <div className={styles.auditHero}>
        <div>
          <p className={styles.statLabel}>Overall readiness</p>
          <AuditScore percent={overall.percent} status={overall.status} size="lg" />
          <AuditBar percent={overall.percent} />
          <p className={styles.muted} style={{ marginBottom: 0 }}>
            {overall.critical
              ? `${overall.critical} item(s) need attention first.`
              : 'Core setup looks complete. Review details below when you can.'}
          </p>
        </div>
        <AuditCriticalList items={critical} />
      </div>

      <section className={styles.auditBlock}>
        <header className={styles.auditBlockHead}>
          <h2>Settings</h2>
          <AuditScore percent={settings.percent} status={settings.status} />
        </header>
        <AuditBar percent={settings.percent} />
        <ul className={styles.auditChecks}>
          {settings.checks.map((check) => (
            <li key={check.label} className={check.ok ? styles.auditCheckOk : styles.auditCheckMiss}>
              <Link to={check.href}>
                {check.ok ? 'Done' : 'Missing'} · {check.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.auditBlock}>
        <header className={styles.auditBlockHead}>
          <h2>Menus &amp; home</h2>
          <AuditScore percent={setup.percent} status={setup.status} />
        </header>
        <AuditBar percent={setup.percent} />
        <ul className={styles.auditChecks}>
          {setup.checks.map((check) => (
            <li key={check.label} className={check.ok ? styles.auditCheckOk : styles.auditCheckMiss}>
              <Link to={check.href}>
                {check.ok ? 'Done' : 'Missing'} · {check.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.auditBlock}>
        <header className={styles.auditBlockHead}>
          <div>
            <h2>Site pages</h2>
            <p className={styles.muted} style={{ margin: '0.2rem 0 0' }}>
              {pages.complete} of {pages.count} have title and text
              {pages.defaultPhotoCount
                ? ` · ${pages.defaultPhotoCount} still use the default header photo`
                : ''}
            </p>
          </div>
          <AuditScore percent={pages.percent} status={pages.status} />
        </header>
        <AuditBar percent={pages.percent} />
        {pages.incomplete?.length ? (
          <ul className={styles.auditItemList}>
            {pages.incomplete.map((item) => (
              <li key={item.id}>
                <Link to={item.href}>
                  {item.title}
                  <span>
                    {item.percent}% · {item.missing.join(', ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>All pages have title, text, and their own header photo.</p>
        )}
      </section>

      <section className={styles.auditBlock}>
        <h2>Directories</h2>
        <p className={styles.muted}>
          Counts and completeness for listings the public can browse. Items without their own photo still
          show the site default image. Click a card, then fill the missing fields.
        </p>
        <div className={styles.auditDirGrid}>
          {directories.map((dir) => (
            <article key={dir.id} className={styles.auditDirCard}>
              <header>
                <Link to={dir.href}>{dir.label}</Link>
                <AuditScore percent={dir.percent} status={dir.status} />
              </header>
              <AuditBar percent={dir.percent} />
              <p>
                {dir.count} item{dir.count === 1 ? '' : 's'}
                {dir.published != null ? ` · ${dir.published} published` : ''}
              </p>
              {dir.empty ? (
                <Link className={styles.auditFix} to={dir.href}>
                  Add the first item →
                </Link>
              ) : dir.incomplete?.length ? (
                <button
                  type="button"
                  className={styles.auditToggle}
                  onClick={() => setOpenId((id) => (id === dir.id ? '' : dir.id))}
                >
                  {openId === dir.id ? 'Hide gaps' : `Show ${dir.incomplete.length} with gaps`}
                </button>
              ) : (
                <p className={styles.muted}>Looks complete.</p>
              )}
              {openId === dir.id && dir.incomplete?.length ? (
                <ul className={styles.auditItemList}>
                  {dir.incomplete.map((item) => (
                    <li key={item.id}>
                      <Link to={item.href}>
                        {item.title}
                        <span>
                          {item.percent}% · {item.missing.join(', ')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.auditBlock}>
        <header className={styles.auditBlockHead}>
          <h2>Translations</h2>
          <Link to="/admin/translations">Open translations</Link>
        </header>
        <div className={styles.auditLangGrid}>
          {(translations.languages || []).map((lang) => (
            <article key={lang.code} className={styles.auditLangCard}>
              <header>
                <strong>
                  {lang.flag} {lang.label}
                  {lang.isDefault ? ' (default)' : ''}
                  {lang.public ? '' : ' · draft'}
                </strong>
                <span>{statusLabel(lang.status)}</span>
              </header>
              <AuditBar percent={lang.percent} />
              <p>
                {lang.percent}% overall · buttons {lang.uiPercent}% · pages &amp; listings {lang.contentPercent}%
              </p>
              {!lang.isDefault && lang.percent < 90 ? (
                <Link className={styles.auditFix} to="/admin/translations">
                  Continue this language →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
