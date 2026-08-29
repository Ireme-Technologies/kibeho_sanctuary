import { WhoEdits } from '../Inventory'
import styles from '../../DocsLayout.module.css'

export default function TechHosting() {
  return (
    <div>
      <div className={styles.notice}>
        <strong>Recommended:</strong> a Diocese-owned <strong>DigitalOcean Basic droplet</strong> (about{' '}
        <strong>$6–7 USD per month</strong> at current pricing). That is what this demo runs on. It gives
        SSH, Git, PHP, MySQL, and full control — without fighting FTP-only shared hosting limits.
      </div>

      <h2>If the Diocese already has vhost capacity</h2>
      <p>
        We are happy to deploy on an existing Diocese vhost <strong>when it meets the checklist</strong> in
        the <a href="/docs/server-requirements/checklist">Hosting checklist</a> chapter — especially SSH,
        PHP&nbsp;8.1+, Composer, MySQL, and a document root that can point at Laravel’s{' '}
        <code>public</code> folder.
      </p>
      <p>
        Many parish shared-hosting plans offer only <strong>FTP upload to </strong>
        <code>public_html</code>. That is <strong>not enough</strong> for this application: install needs{' '}
        <code>git pull</code>, <code>composer install</code>, and <code>php artisan migrate</code>. Uploading
        files by FTP would also risk exposing the <code>.env</code> file and source code. Please send{' '}
        <strong>SSH access</strong> (key preferred), not FTP credentials.
      </p>

      <h2>Hosting account and domain</h2>
      <p>
        Record the hosting account / team and the domain / DNS registrar login. Both must be in the name of
        the Diocese / Shrine — not Ireme Tech.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>What to prepare</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Recommended host</strong>
            </td>
            <td>
              DigitalOcean Basic droplet (~$6–7/month) — same pattern as this demo. Enable weekly backups
              (~20% of droplet cost, optional but advised).
            </td>
            <td>Diocese / Shrine</td>
          </tr>
          <tr>
            <td>Hosting account</td>
            <td>Panel login for the droplet or vhost (SSH enabled)</td>
            <td>Diocese / Shrine</td>
          </tr>
          <tr>
            <td>Domain name</td>
            <td>Production hostname (and whether <code>www</code> redirects to the apex)</td>
            <td>Diocese / Shrine</td>
          </tr>
          <tr>
            <td>DNS registrar</td>
            <td>Where the domain is paid and A / CNAME records are edited</td>
            <td>Diocese / Shrine</td>
          </tr>
          <tr>
            <td>SSL certificate</td>
            <td>Let’s Encrypt (free on DigitalOcean and most VPS hosts)</td>
            <td>Diocese / Shrine</td>
          </tr>
        </tbody>
      </table>

      <h2>What the host must allow</h2>
      <ul>
        <li>Linux vhost or VPS with SSH</li>
        <li>PHP 8.1+ with standard Laravel extensions (OpenSSL, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, Fileinfo)</li>
        <li>Composer (PHP dependency manager)</li>
        <li>MySQL or MariaDB</li>
        <li>Nginx or Apache with HTTPS</li>
        <li>
          Document root pointed at the application’s <strong>Laravel </strong>
          <code>public</code> folder — not the full project tree
        </li>
        <li>Git available over SSH</li>
        <li>Disk for the application plus photos and PDFs; plan for growth</li>
        <li>Upload limits of at least 64&nbsp;MB (256&nbsp;MB preferred) for media and backup ZIPs</li>
        <li>Writable <code>storage/</code> and <code>bootstrap/cache/</code></li>
      </ul>
      <p>
        A typical FTP-only shared-hosting plan does <strong>not</strong> meet these requirements. The
        ~$7/month droplet avoids that gap and matches how this demo is already hosted.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="Public site name, contact address, and map embed in Admin → Settings. Those are display values, not DNS."
        host="Hosting panel, DNS records, SSL, droplet size, and which folder the domain points at."
      />
    </div>
  )
}
