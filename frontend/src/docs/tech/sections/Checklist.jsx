import styles from '../../DocsLayout.module.css'

export default function TechChecklist() {
  return (
    <div>
      <h2>Confirm before issuing logins</h2>
      <p>
        Share this page with the Diocese IT / hosting contact. Ask them to confirm each line. If several
        items are “no”, use a DigitalOcean Basic droplet (~$7/month) in the Diocese name instead of
        FTP-only shared hosting.
      </p>
      <table>
        <thead>
          <tr>
            <th>Check</th>
            <th>Expected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account ownership</td>
            <td>Hosting and domain in the Diocese / Shrine name</td>
          </tr>
          <tr>
            <td>Remote access</td>
            <td>SSH enabled (key-based preferred). <strong>Not FTP-only.</strong></td>
          </tr>
          <tr>
            <td>Git</td>
            <td>Available on the server so we can clone and pull</td>
          </tr>
          <tr>
            <td>PHP</td>
            <td>8.1 or newer with standard Laravel extensions</td>
          </tr>
          <tr>
            <td>Composer</td>
            <td>Available over SSH for PHP dependencies</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>MySQL or MariaDB — empty database + user ready</td>
          </tr>
          <tr>
            <td>Web server</td>
            <td>Nginx or Apache; document root can target Laravel <code>public/</code></td>
          </tr>
          <tr>
            <td>HTTPS</td>
            <td>SSL possible on the production domain (Let’s Encrypt is fine)</td>
          </tr>
          <tr>
            <td>Disk &amp; uploads</td>
            <td>Room for photos, PDFs, and backup ZIPs (64–256&nbsp;MB upload limit)</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>Resend or SMTP account owned by the Diocese</td>
          </tr>
          <tr>
            <td>Recommended if unsure</td>
            <td>DigitalOcean Basic droplet ~$6–7/month + optional backups — same as this demo</td>
          </tr>
          <tr>
            <td>Do not send</td>
            <td>FTP passwords</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.notice} style={{ marginTop: '1.25rem' }}>
        <strong>Reply template for the Diocese IT contact:</strong> “Thank you for the vhost capacity. This
        site is React + Laravel and needs SSH + Git + PHP 8.1 + MySQL — not FTP. Please confirm the checklist
        above, or create a Diocese-owned DigitalOcean droplet (~$7/month) and send SSH access. Full details:{' '}
        <code>/docs/server-requirements</code>.”
      </div>

      <h2>Security notes for the same audience</h2>
      <ul>
        <li>HTTPS is required in production</li>
        <li>Admin changes need a signed-in Laravel session</li>
        <li>Secrets stay in the server <code>.env</code> file — not in Git</li>
        <li>Media uploads require an authenticated admin</li>
        <li>Framework updates sit under the maintenance agreement</li>
      </ul>
      <p>
        Related:{' '}
        <a href="/docs/sitemap-and-admin-guide">Administrator user guide</a> (day-to-day CMS) ·{' '}
        <a href="/docs/proposed-solution">Proposed solution</a> (evaluation overview) ·{' '}
        <a href="/docs">Documentation hub</a>
      </p>
    </div>
  )
}
