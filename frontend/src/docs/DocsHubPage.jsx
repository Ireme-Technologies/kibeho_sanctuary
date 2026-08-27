import { Link } from 'react-router-dom'
import styles from './DocsLayout.module.css'

export default function DocsHubPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Start here</p>
        <h1>System documentation for Diocese evaluation</h1>
        <p className={styles.lede}>
          Start with the administrator guide and CMS audit if you will manage the site. The proposed
          solution document is for evaluation of the platform. The live demo and admin panel are linked
          below.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2>1. Administrator guide</h2>
          <p>
            Sign in, open CMS audit for a readiness score, then follow settings, languages, pages, listings,
            and backup. Critical gaps appear in the guide when you are signed in.
          </p>
          <div className={styles.cardActions}>
            <Link className={styles.btnPrimary} to="/docs/sitemap-and-admin-guide">
              Open the guide
            </Link>
            <a className={styles.btnGhost} href="/admin/audit">
              Open CMS audit
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <h2>2. Administration panel</h2>
          <p>
            Sign in to create pages, publish news, update menus, replace images, and manage languages. Use
            CMS audit after login to see what is still missing.
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

        <article className={styles.card}>
          <h2>3. Live public site</h2>
          <p>
            Browse the public website as pilgrims will see it. Demo text and images are replaced as official
            content is provided.
          </p>
          <div className={styles.cardActions}>
            <a className={styles.btnPrimary} href="/" target="_blank" rel="noreferrer">
              Open website
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <h2>4. Proposed solution</h2>
          <p>
            Evaluation document: Phase 1 vs later, why this CMS, multilingual concept, architecture,
            security, backups, ownership, and acceptance criteria.
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
          <h2>5. Server requirements</h2>
          <p>
            Hosting checklist for Diocese IT: React + Node.js stack, Git/SSH (not FTP), MySQL, and what to
            send instead of FTP logins when migrating to your vhost.
          </p>
          <div className={styles.cardActions}>
            <Link className={styles.btnPrimary} to="/docs/server-requirements">
              Open requirements
            </Link>
            <a className={styles.btnGhost} href="/evaluation-downloads/server-requirements.md" download>
              Download .md
            </a>
          </div>
        </article>
      </div>

      <div className={styles.notice} style={{ marginTop: '1.25rem' }}>
        <strong>Content note:</strong> Text and images on this demo are placeholders or draft material.
        Official content and photographs will be updated as the Diocese / Shrine provides them. The purpose
        of this environment is to evaluate structure, administration, and multilingual workflows.
      </div>

      <div className={styles.notice}>
        <strong>Suggested path:</strong> sign in → open CMS audit → follow the administrator guide in order
        (settings, languages, pages, listings, backup). Evaluators can also read the proposed solution.
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
              <td>Server requirements (handover / IT)</td>
              <td>
                <code>/docs/server-requirements</code>
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
            <tr>
              <td>Download — server requirements</td>
              <td>
                <code>/evaluation-downloads/server-requirements.md</code>
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
