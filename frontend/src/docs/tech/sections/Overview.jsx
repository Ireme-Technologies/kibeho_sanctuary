import { Inventory } from '../Inventory'
import styles from '../../DocsLayout.module.css'

const MODULES = [
  {
    slug: 'hosting',
    label: 'Hosting & domain',
    detail: 'Recommended DigitalOcean droplet (~$7/month) or a Diocese vhost with SSH — not FTP-only.',
  },
  {
    slug: 'access',
    label: 'Server access',
    detail: 'SSH (key preferred), Git, PHP 8.1+, Composer. FTP is not used.',
  },
  {
    slug: 'database',
    label: 'Database',
    detail: 'MySQL credentials and the location of the latest content backup.',
  },
  {
    slug: 'email',
    label: 'Email',
    detail: 'Resend (or SMTP) account and API key ownership for enquiry notifications.',
  },
  {
    slug: 'messaging',
    label: 'Messaging',
    detail: 'WhatsApp number shown to pilgrims. Staff change the number in Admin → Settings.',
  },
  {
    slug: 'admin',
    label: 'Admin access',
    detail: 'Top-level administrator accounts. Day-to-day content stays in the CMS.',
  },
  {
    slug: 'backups',
    label: 'Backups',
    detail: 'DigitalOcean snapshots (developer) plus the admin ZIP staff download and keep off the server.',
  },
  {
    slug: 'checklist',
    label: 'Hosting checklist',
    detail: 'What the hosting partner should confirm before issuing logins.',
  },
]

export default function TechOverview() {
  return (
    <div>
      <p>
        Technical handoff for the Shrine of Our Lady of Kibeho website — for the Diocese evaluation
        committee and for the hosting partner. Open any row for that topic. Use <strong>Back</strong> /{' '}
        <strong>Next</strong> to walk the full list.
      </p>

      <div className={styles.notice}>
        <strong>For the Diocese IT contact (Juta / hosting partner):</strong> thank you for confirming
        vhost capacity. This application is <strong>React + Laravel + MySQL</strong> — not WordPress files
        you upload by FTP. We need <strong>SSH and Git</strong>, not an FTP login. If the current plan is
        FTP-only <code>public_html</code>, please use the recommended hosting in the{' '}
        <a href="/docs/server-requirements/hosting">Hosting &amp; domain</a> chapter instead (~$7/month
        droplet, Diocese-owned account).
      </div>

      <p>
        Live passwords and API keys are <strong>not</strong> printed here. Sanctuary staff change public
        details (phone, WhatsApp, map, bank accounts) in the admin panel — they do not need this document
        for daily publishing.
      </p>

      <h2>Inventory</h2>
      <Inventory rows={MODULES} />

      <h2>Application stack</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Public website &amp; admin UI</td>
            <td>React (Vite) — pages, language switcher, forms</td>
          </tr>
          <tr>
            <td>API &amp; CMS backend</td>
            <td>Laravel 10 (PHP 8.1+) — content, auth, mail, media, multilingual API</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>MySQL 5.7+ / 8.x or MariaDB</td>
          </tr>
          <tr>
            <td>Build tooling</td>
            <td>Node.js LTS + npm (on a build machine; optional on the live server)</td>
          </tr>
          <tr>
            <td>Source &amp; deploy</td>
            <td>Git repository + SSH + Composer on the server</td>
          </tr>
          <tr>
            <td>HTTPS</td>
            <td>SSL (Let’s Encrypt or host-provided)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Production is one deployable application on one domain (built React files served from Laravel’s{' '}
        <code>public</code> folder). After go-live, editors publish in <code>/admin</code> and do not use
        Git or FTP.
      </p>

      <p style={{ marginTop: '1.75rem', color: 'var(--docs-muted)', fontSize: '0.92rem' }}>
        Shrine of Our Lady of Kibeho — Technical details · Handoff &amp; system guide · v1.0
        <br />
        Prepared as a technical handoff document for the Diocese / hosting partner.
      </p>
    </div>
  )
}
