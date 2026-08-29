import { WhoEdits } from '../Inventory'
import styles from '../../DocsLayout.module.css'

export default function TechAccess() {
  return (
    <div>
      <h2>Git over SSH — not FTP</h2>
      <div className={styles.notice}>
        <strong>Please do not send FTP credentials.</strong> The Diocese IT contact asked for FTP login — this
        app cannot be installed or maintained that way. Send SSH instead (we can provide our public key).
      </div>
      <p>
        This is a <strong>React + Laravel</strong> application, not a folder of HTML files. Install and
        updates need Git, Composer, and PHP on the server:
      </p>
      <ul>
        <li>
          <code>git pull</code> — approved source from the Diocese Git repository
        </li>
        <li>
          <code>composer install</code> — Laravel / PHP dependencies
        </li>
        <li>
          <code>php artisan migrate</code> — database updates
        </li>
        <li>
          <code>php artisan storage:link</code> — uploaded media
        </li>
        <li>
          Built React files are already in the repository’s <code>public</code> folder — the live server
          does <strong>not</strong> require Node.js unless you choose to rebuild the frontend there
        </li>
        <li>
          Database passwords and mail keys stay in a server <code>.env</code> file — never in the public web
          folder or in Git
        </li>
      </ul>

      <h2>Access the hosting partner should send</h2>
      <ol>
        <li>
          <strong>SSH</strong> — host, port, username (we can send our public SSH key)
        </li>
        <li>
          Confirmation that <strong>Git</strong> and <strong>Composer</strong> work over SSH
        </li>
        <li>
          <strong>PHP 8.1+</strong> — confirm version and that typical Laravel extensions are enabled
        </li>
        <li>
          <strong>MySQL</strong> — database name, user, password (or permission to create one)
        </li>
        <li>
          Confirmation that the <strong>document root</strong> targets Laravel’s <code>public</code> folder
        </li>
        <li>
          Production <strong>domain</strong> and whether <code>www</code> should redirect
        </li>
      </ol>
      <p>
        After install, content editors use <code>/admin</code> only. They do not need SSH, Git, or FTP.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="Nothing here. Publishing does not use SSH."
        host="SSH users, firewall, Git deploy, PHP version, Composer, and the .env file on the server."
      />
    </div>
  )
}
