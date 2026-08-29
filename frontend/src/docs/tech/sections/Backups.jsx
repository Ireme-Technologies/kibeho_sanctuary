import { WhoEdits } from '../Inventory'

export default function TechBackups() {
  return (
    <div>
      <h2>Two copies — host snapshot and staff ZIP</h2>
      <p>
        Keep both. A host snapshot is fast while that account still exists. The admin ZIP is the copy the
        Diocese can take to another company.
      </p>
      <ol>
        <li>
          <strong>Hosting snapshot (developer):</strong> DigitalOcean droplet backups / weekly snapshots,
          or the equivalent on the Diocese vhost. Restores the whole server only while that host still
          holds the snapshot.
        </li>
        <li>
          <strong>Admin ZIP (sanctuary staff):</strong> Administrators download a full content + media
          backup from <strong>Admin → Backup &amp; restore</strong> and store it off the server. Weekly,
          and again after a large update. Keep at least two copies.
        </li>
      </ol>
      <p>
        The ZIP includes pages, menus, translations, news, schedules, directories, enquiries, admin users,
        the media library, and site images. It does <strong>not</strong> include the environment file
        (database password, mail keys). Those are recreated on each host.
      </p>
      <p>
        Recovery: re-provision hosting, clone the Git repository, import the latest admin ZIP, reconnect
        SSL and DNS. Ireme Tech can help with a move or a restore test.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="Download and store the ZIP. Restore from the same admin page when rolling back content."
        host="Enable and check server snapshots. Recreate the environment file if the site is moved."
      />
    </div>
  )
}
