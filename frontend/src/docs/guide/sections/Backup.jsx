export default function GuideBackup() {
  return (
    <div>
      <h2>15. Backup &amp; restore</h2>
                  <p>
                    Use <strong>Admin → Backup &amp; restore</strong> to download a ZIP of this site’s content and
                    media, keep it in a safe place, and restore it here when you need to roll back or recover.
                  </p>

                  <h3>Download a backup (sanctuary staff)</h3>
                  <p>
                    Administrators can download a full copy of <em>live content</em> without SSH. Open{' '}
                    <strong>Admin → Backup &amp; restore</strong> (bottom of the sidebar).
                  </p>
                  <ol>
                    <li>Sign in as an administrator (editors cannot use this page).</li>
                    <li>
                      Click <strong>Download full backup</strong>. A ZIP is saved to your computer.
                    </li>
                    <li>
                      Store that file <strong>off the web server</strong> — a Diocese computer, Google Drive / OneDrive,
                      or an encrypted USB. Keep at least the last two copies.
                    </li>
                    <li>
                      Do this <strong>weekly</strong>, and again after a large content update (new translations, many
                      photos, a campaign).
                    </li>
                  </ol>
                  <p>The ZIP includes pages, menus, translations, news, schedules, directories, enquiries, admin users, the media library, and site images (logo, hero, and other photos). It does <strong>not</strong> include server secrets (database password, mail keys). Those stay in the server <code>.env</code> file, which the developer sets on each host.</p>

                  <h3>Restore from the admin ZIP</h3>
                  <ol>
                    <li>Download a backup of the <em>current</em> site first, in case you need to undo.</li>
                    <li>On <strong>Backup &amp; restore</strong>, choose the ZIP, tick the confirmation box, then confirm twice.</li>
                    <li>
                      Restore replaces all current content with the file. After a move to a new server, sign in with
                      an administrator account that existed in that backup.
                    </li>
                  </ol>
                  <p>
                    If the ZIP is too large for the browser, ask the developer to restore it on the server (see{' '}
                    <a href="/docs/server-requirements">Server requirements</a>).
                  </p>
                  <p>
                    Ireme Tech can help with a scheduled backup, a restore test, or a move to new hosting — ask
                    rather than guessing if something looks wrong.
                  </p>
    </div>
  )
}
