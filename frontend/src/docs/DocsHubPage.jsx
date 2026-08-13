import { Link } from 'react-router-dom'
import styles from './DocsLayout.module.css'

export default function DocsHubPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Start here</p>
        <h1>System documentation for Diocese evaluation</h1>
        <p className={styles.lede}>
          This demo presents the proposed Shrine website platform (React + Laravel CMS)—not WordPress—with
          full functional documentation, a live public site, an administration panel, and downloadable guides.
          Use the links below to move between documents and the working demo.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2>1. Proposed solution</h2>
          <p>
            Functional requirements (Phase 1 vs later), why React.js (interactive speed) and a Laravel API
            (payments, members, external services), multilingual concept, architecture, security, backups,
            ownership, and acceptance criteria.
          </p>
          <div className={styles.cardActions}>
            <Link className={styles.btnPrimary} to="/docs/proposed-solution">
              Open document
            </Link>
            <a className={styles.btnGhost} href="/evaluation-downloads/proposed-solution.md" download>
              Download .md
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <h2>2. Sitemap & admin user guide</h2>
          <p>
            Complete public sitemap, step-by-step administration for every CMS module, and the best way to
            manage languages (language tabs, Copy from default, page layout). Also covers menus, media,
            users, and recommended future upgrades.
          </p>
          <div className={styles.cardActions}>
            <Link className={styles.btnPrimary} to="/docs/sitemap-and-admin-guide">
              Open document
            </Link>
            <a className={styles.btnGhost} href="/evaluation-downloads/sitemap-and-admin-guide.md" download>
              Download .md
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <h2>3. Live public demo</h2>
          <p>
            Browse the six-pillar public website as pilgrims and visitors will see it. Used text and images
            will be replaced with approved content as it becomes available.
          </p>
          <div className={styles.cardActions}>
            <a className={styles.btnPrimary} href="/" target="_blank" rel="noreferrer">
              Open website demo
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <h2>4. Administration panel</h2>
          <p>
            Sign in with the demo credentials below to create pages, publish news, update menus, replace
            images, manage languages, and more.
          </p>
          <div className={styles.cardActions}>
            <a className={styles.btnPrimary} href="/admin/login" target="_blank" rel="noreferrer">
              Open admin login
            </a>
            <Link className={styles.btnSoft} to="/docs/sitemap-and-admin-guide#languages">
              How to manage languages
            </Link>
          </div>
        </article>
      </div>

      <div className={styles.notice} style={{ marginTop: '1.25rem' }}>
        <strong>Content note:</strong> Text and images on this demo are placeholders or draft material.
        Official content and photographs will be updated as the Diocese / Shrine provides them. The purpose
        of this environment is to evaluate structure, administration, and multilingual workflows.
      </div>

      <div className={styles.notice}>
        <strong>Suggested path for reviewers:</strong> read the proposed solution → open the live demo →
        sign in with the credentials below → follow the admin user guide → download or print PDF copies for
        committee circulation if needed.
      </div>

      <section className={styles.creds} aria-label="Demo admin credentials">
        <h2>Admin credentials (demo testing)</h2>
        <dl>
          <dt>Login URL</dt>
          <dd>
            <a href="/admin/login">/admin/login</a>
          </dd>
          <dt>Email</dt>
          <dd>admin@kibeho.org</dd>
          <dt>Password</dt>
          <dd>KibehoAdmin@202!</dd>
        </dl>
        <p>
          Use these credentials only on the evaluation demo. Follow the{' '}
          <Link to="/docs/sitemap-and-admin-guide#admin-guide">administrator user guide</Link> while
          signed in. Change passwords on handover to production.
        </p>
      </section>

      <section className={styles.card} style={{ marginTop: '1.25rem' }}>
        <h2>Direct URLs (share with the committee)</h2>
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Path on demo.iremetech.com</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Documentation hub (start here)</td>
              <td>
                <code>/docs</code>
              </td>
            </tr>
            <tr>
              <td>Proposed solution (detailed)</td>
              <td>
                <code>/docs/proposed-solution</code>
              </td>
            </tr>
            <tr>
              <td>Sitemap &amp; admin user guide</td>
              <td>
                <code>/docs/sitemap-and-admin-guide</code>
              </td>
            </tr>
            <tr>
              <td>Public website demo</td>
              <td>
                <code>/</code>
              </td>
            </tr>
            <tr>
              <td>CMS admin login</td>
              <td>
                <code>/admin/login</code>
              </td>
            </tr>
            <tr>
              <td>Download — proposed solution</td>
              <td>
                <code>/evaluation-downloads/proposed-solution.md</code>
              </td>
            </tr>
            <tr>
              <td>Download — sitemap &amp; admin guide</td>
              <td>
                <code>/evaluation-downloads/sitemap-and-admin-guide.md</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.85rem', color: 'var(--docs-muted)' }}>
          On each document page click <strong>Save as PDF</strong>. Margins are built into the document —
          choose destination <em>Save as PDF</em> in the dialog and save. No need to adjust margins
          manually.
        </p>
      </section>
    </div>
  )
}
