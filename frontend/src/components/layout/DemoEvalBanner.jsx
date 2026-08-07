import { Link } from 'react-router-dom'
import styles from './DemoEvalBanner.module.css'

function isEvaluationHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'demo.iremetech.com' || host === 'localhost' || host === '127.0.0.1'
}

/** Thin strip for Diocese evaluation demos — points reviewers to /docs first. */
export default function DemoEvalBanner() {
  if (!isEvaluationHost()) return null

  return (
    <div className={styles.banner} role="region" aria-label="Evaluation documentation">
      <p>
        <strong>Diocese evaluation demo.</strong> Start with documentation. Content and images will be
        updated as official material is provided. Admin: <code>admin@kibeho.org</code>
      </p>
      <div className={styles.actions}>
        <Link to="/docs">Documentation hub</Link>
        <Link to="/docs/proposed-solution">Proposed solution</Link>
        <Link to="/docs/sitemap-and-admin-guide">Admin guide</Link>
        <a href="/admin/login">Admin login</a>
      </div>
    </div>
  )
}
