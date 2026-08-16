import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCmsAudit } from '@api/cms'
import { AuditBar, AuditScore } from '@admin/components/AuditPanel'
import styles from './DocsLayout.module.css'

export default function DocsAuditPanel() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCmsAudit()
      .then(setReport)
      .catch((err) => setError(err.status === 401 || err.status === 403 ? 'signin' : err.message || 'unavailable'))
  }, [])

  if (error === 'signin' || (!report && !error)) {
    return (
      <div className={styles.auditBox}>
        {!report && !error ? (
          <p>Checking readiness…</p>
        ) : (
          <>
            <p>
              Sign in to the admin to see this site’s live readiness score and the items that still need
              official content.
            </p>
            <p>
              <a className={styles.btnPrimary} href="/admin/login">
                Sign in
              </a>{' '}
              <a className={styles.btnGhost} href="/admin/audit">
                Open CMS audit
              </a>
            </p>
          </>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.auditBox}>
        <p>The live score could not be loaded. Open CMS audit in admin after you sign in.</p>
        <p>
          <a className={styles.btnPrimary} href="/admin/audit">
            Open CMS audit
          </a>
        </p>
      </div>
    )
  }

  const { overall, critical } = report

  return (
    <div className={styles.auditBox}>
      <div className={styles.auditBoxScore}>
        <p className={styles.auditEyebrow}>Live readiness</p>
        <AuditScore percent={overall.percent} status={overall.status} size="lg" />
        <AuditBar percent={overall.percent} />
        <p>
          <Link to="/admin/audit">Open the full CMS audit</Link> to jump into each gap.
        </p>
      </div>
      <div>
        <h3>Critical items to update</h3>
        {critical?.length ? (
          <ol className={styles.auditList}>
            {critical.slice(0, 8).map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link to={item.href}>{item.label}</Link>
                <span>
                  {' '}
                  ({item.area}
                  {item.reason ? ` · ${item.reason}` : ''})
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p>No urgent gaps right now. Add unique photos and live social URLs when they are available.</p>
        )}
      </div>
    </div>
  )
}
