import styles from './DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav, DocsToc } from './DocsChrome'

const TOC = [
  { href: '#summary', label: 'Summary' },
  { href: '#stack', label: 'Application stack' },
  { href: '#git-not-ftp', label: 'Git / SSH — not FTP' },
  { href: '#requirements', label: 'Server requirements' },
  { href: '#shared-hosting', label: 'Shared hosting?' },
  { href: '#access', label: 'Access we need' },
  { href: '#checklist', label: 'IT checklist' },
]

export default function ServerRequirementsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Handover · Hosting</p>
        <h1>Server requirements &amp; deployment access</h1>
        <p className={styles.lede}>
          What the Diocese hosting environment must provide so we can install and maintain the Shrine
          website on your vhost. This page is for IT and hosting contacts — share it when requesting
          server access.
        </p>
      </div>

      <DocsToolbar
        downloadHref="/evaluation-downloads/server-requirements.md"
        downloadLabel="Download server requirements (.md)"
      />

      <div className={styles.layout}>
        <DocsToc items={TOC} />
        <article className={styles.article}>
          <section id="summary">
            <h2>1. Summary</h2>
            <p>
              The website is a modern <strong>React</strong> application (public site and administration
              panel), built and maintained with <strong>Node.js</strong>. Content is stored in{' '}
              <strong>MySQL</strong>. We deploy and update the site with <strong>Git over SSH</strong>.
            </p>
            <p>
              <strong>Please do not send FTP credentials.</strong> FTP cannot install or update this
              application safely. We need SSH access (preferably with a public key), Git, Node.js, and a
              MySQL database on a vhost or VPS owned by the Diocese / Shrine.
            </p>
          </section>

          <section id="stack">
            <h2>2. Application stack (client-facing)</h2>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Technology</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Public website</td>
                  <td>React (Vite) — interactive pages, language switcher, forms</td>
                </tr>
                <tr>
                  <td>Administration panel</td>
                  <td>Same React application (<code>/admin</code>)</td>
                </tr>
                <tr>
                  <td>Build &amp; tooling</td>
                  <td>Node.js (LTS) and npm</td>
                </tr>
                <tr>
                  <td>Database</td>
                  <td>MySQL 5.7+ / 8.x (or MariaDB equivalent)</td>
                </tr>
                <tr>
                  <td>Source control &amp; deploy</td>
                  <td>Git repository + SSH on the server</td>
                </tr>
                <tr>
                  <td>HTTPS</td>
                  <td>SSL certificate (Let’s Encrypt or host-provided)</td>
                </tr>
              </tbody>
            </table>
            <p>
              Production is one site on one domain: visitors and editors use the same host. Day-to-day
              publishing stays in the admin panel and does not require Git.
            </p>
          </section>

          <section id="git-not-ftp">
            <h2>3. Why we use Git / SSH — not FTP</h2>
            <p>
              This is not a classic set of HTML files that can be uploaded with an FTP client. Installation
              and updates involve:
            </p>
            <ul>
              <li>
                Pulling the approved source from Git
              </li>
              <li>
                Installing dependencies and building the React application with Node.js
              </li>
              <li>
                Applying database updates and linking uploaded media
              </li>
              <li>
                Keeping secrets (database password, mail keys) in a server environment file — never in the
                public web folder
              </li>
            </ul>
            <p>
              FTP cannot run those steps. Uploading the whole project into a public folder would also risk
              exposing configuration and source files. <strong>Git over SSH</strong> is the correct, safer
              method for this stack, and it is what we use for every update after go-live.
            </p>
          </section>

          <section id="requirements">
            <h2>4. Server requirements</h2>
            <table>
              <thead>
                <tr>
                  <th>Requirement</th>
                  <th>Minimum / note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account ownership</td>
                  <td>Hosting and domain registered in the name of the Diocese / Shrine</td>
                </tr>
                <tr>
                  <td>Operating system</td>
                  <td>Linux (or equivalent Unix) vhost / VPS</td>
                </tr>
                <tr>
                  <td>Remote access</td>
                  <td>
                    <strong>SSH</strong> (key-based preferred). FTP alone is not accepted.
                  </td>
                </tr>
                <tr>
                  <td>Git</td>
                  <td>Git available on the server so we can clone and pull</td>
                </tr>
                <tr>
                  <td>Node.js</td>
                  <td>
                    Node.js <strong>LTS</strong> (18.x or 20.x recommended) and npm — required to build the
                    React site; used in our standard deploy workflow
                  </td>
                </tr>
                <tr>
                  <td>Database</td>
                  <td>MySQL 5.7+ / 8.x or MariaDB; one empty database + user we can configure</td>
                </tr>
                <tr>
                  <td>Web server</td>
                  <td>
                    Nginx or Apache with HTTPS; document root / reverse proxy must serve the application’s
                    public web folder (not the full project tree)
                  </td>
                </tr>
                <tr>
                  <td>Disk</td>
                  <td>
                    Enough for the application plus media (photos, PDFs); plan for growth
                  </td>
                </tr>
                <tr>
                  <td>Upload limits</td>
                  <td>
                    Allow large media and backup ZIPs (at least 64&nbsp;MB; 256&nbsp;MB preferred)
                  </td>
                </tr>
                <tr>
                  <td>Writable storage</td>
                  <td>
                    Application can write uploads and cache under its data directories
                  </td>
                </tr>
                <tr>
                  <td>Cron (recommended)</td>
                  <td>One scheduled task for background jobs / reminders if enabled</td>
                </tr>
                <tr>
                  <td>Outbound email</td>
                  <td>SMTP or transactional API (e.g. Resend) for enquiry notifications</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="shared-hosting">
            <h2>5. Does shared hosting work?</h2>
            <p>
              <strong>Only if</strong> the shared plan (or vhost) provides everything in the table above —
              especially <strong>SSH</strong>, <strong>Git</strong>, <strong>Node.js</strong>,{' '}
              <strong>MySQL</strong>, and the ability to point the site document root at the application’s
              public folder.
            </p>
            <p>
              <strong>Typical cheap shared hosting with FTP only</strong> (no SSH, no Git, no Node, fixed{' '}
              <code>public_html</code>) is <strong>not suitable</strong>. That model works for simple
              static sites or older CMS uploads; it does not support a modern React + Node.js deploy.
            </p>
            <p>
              A Diocese <strong>vhost</strong> or small <strong>VPS</strong> with SSH usually meets the
              needs. If your provider already confirmed “good vhost capacity,” please confirm the checklist
              below before issuing logins.
            </p>
          </section>

          <section id="access">
            <h2>6. Access we need from Diocese IT</h2>
            <p>Instead of FTP, please provide:</p>
            <ol>
              <li>
                <strong>SSH</strong> — host, port, username (we can send our public SSH key)
              </li>
              <li>
                Confirmation that <strong>Git</strong> and <strong>Node.js (LTS)</strong> work over SSH
              </li>
              <li>
                <strong>MySQL</strong> — database name, user, password (or permission to create one)
              </li>
              <li>
                Confirmation that the <strong>document root</strong> (or reverse proxy) can target the app’s
                public web folder
              </li>
              <li>
                Production <strong>domain</strong> (and whether <code>www</code> should redirect)
              </li>
              <li>
                Current <strong>Node.js</strong> version on the server (if already installed)
              </li>
            </ol>
            <p>
              Domain DNS and SSL remain under Diocese control. After install, content editors use{' '}
              <code>/admin</code> only; they do not need SSH.
            </p>
          </section>

          <section id="checklist">
            <h2>7. Quick checklist for the hosting contact</h2>
            <ul>
              <li>Hosting account in Diocese / Shrine name</li>
              <li>SSH enabled (not FTP-only)</li>
              <li>Git available</li>
              <li>Node.js LTS + npm available</li>
              <li>MySQL (or MariaDB) database ready</li>
              <li>HTTPS / SSL possible on the production domain</li>
              <li>Document root can be set to the application public folder</li>
              <li>Disk and upload size adequate for photos and backups</li>
            </ul>
            <p>
              Related:{' '}
              <a href="/docs/sitemap-and-admin-guide">Administrator user guide</a> (day-to-day CMS) ·{' '}
              <a href="/docs/proposed-solution">Proposed solution</a> (evaluation overview) ·{' '}
              <a href="/docs">Documentation hub</a>
            </p>
          </section>

          <DocsCrossNav
            prev={{ to: '/docs/sitemap-and-admin-guide', label: 'Administrator guide' }}
            next={{ to: '/docs', label: 'Back to documentation hub' }}
          />
        </article>
      </div>
    </div>
  )
}
