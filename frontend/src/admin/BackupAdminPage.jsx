import { useEffect, useState } from 'react'
import { downloadSiteBackup, fetchBackupStatus, restoreSiteBackup } from '@api/cms'
import { useAuth } from '@context/AuthContext'
import { useContent } from '@context/ContentContext'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import styles from './admin.module.css'

function formatCount(n) {
  return new Intl.NumberFormat().format(Number(n) || 0)
}

export default function BackupAdminPage() {
  const { user } = useAuth()
  const { refresh } = useContent()
  const [status, setStatus] = useState(null)
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [exporting, setExporting] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [file, setFile] = useState(null)
  const [understood, setUnderstood] = useState(false)

  const canBackup = Boolean(user?.is_master_admin || user?.role === 'super_admin')

  const load = async () => setStatus(await fetchBackupStatus())

  useEffect(() => {
    if (!canBackup) return
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load backup status' }))
  }, [canBackup])

  if (!canBackup) {
    return (
      <div className={styles.card}>
        <h1>Backup &amp; restore</h1>
        <p className={styles.error}>Only administrators can download or restore site backups. Editors cannot use this page.</p>
      </div>
    )
  }

  const handleExport = async () => {
    setExporting(true)
    setFlash({ type: 'success', message: '' })
    try {
      await downloadSiteBackup()
      setFlash({
        type: 'success',
        message: 'Backup downloaded. Keep this ZIP off the server (Diocese computer, Google Drive, or an encrypted USB).',
      })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Backup download failed.' })
    } finally {
      setExporting(false)
    }
  }

  const handleRestore = async () => {
    if (!file) {
      setFlash({ type: 'error', message: 'Choose a backup ZIP first.' })
      return
    }
    if (!understood) {
      setFlash({ type: 'error', message: 'Tick the box to confirm you understand this replaces all current content.' })
      return
    }
    const ok = await confirmDelete(
      'Restore this backup and replace all current site content, media, menus, and enquiries?',
      {
        confirmLabel: 'Restore',
        finalMessage: 'This cannot be undone. Permanently replace all current site data with this backup?',
      },
    )
    if (!ok) return

    setRestoring(true)
    setFlash({ type: 'success', message: '' })
    try {
      const result = await restoreSiteBackup(file)
      await refresh?.()
      await load()
      setFile(null)
      setUnderstood(false)
      setFlash({
        type: 'success',
        message: result.message + (result.notice ? ` ${result.notice}` : ''),
      })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Restore failed.' })
    } finally {
      setRestoring(false)
    }
  }

  const tables = status?.tables || {}

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Backup &amp; restore</h1>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        duration={flash.type === 'error' ? 10000 : 8000}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.howtoGrid}>
        <article className={styles.howtoCard}>
          <h2>Why this exists</h2>
          <p>
            DigitalOcean can snapshot the whole droplet, but those copies stay on DigitalOcean. If that account
            or region failed, or you move to another host, you need a file you control.
          </p>
          <p>
            Download a backup after important edits and keep it <strong>off this server</strong> — a Diocese
            computer, Google Drive, or an encrypted USB. The Git repository holds the code, not live news,
            translations, or uploaded photos.
          </p>
        </article>
        <article className={styles.howtoCard}>
          <h2>What a backup contains</h2>
          <p>
            Pages, menus, translations, news, schedules, directories, enquiries, admin users, the media library,
            and site images (logo, hero, and other <code>/images</code> files).
          </p>
          <p>
            It does <strong>not</strong> include the server <code>.env</code> (database password, mail keys).
            Those are set once on each new host. Domain DNS stays at your registrar, independent of DigitalOcean.
          </p>
        </article>
      </div>

      <div className={styles.card} style={{ marginTop: '1.25rem' }}>
        <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Download a backup</h2>
        <p className={styles.muted} style={{ marginBottom: '0.85rem' }}>
          {status
            ? `${formatCount(status.row_count)} content rows · ${formatCount(status.storage_files)} uploaded files · ${formatCount(status.public_images)} site images`
            : 'Loading current counts…'}
        </p>
        {!status?.zip_available ? (
          <p className={styles.error}>PHP zip support is missing on this server. Ask hosting to enable the zip extension.</p>
        ) : null}
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={handleExport} disabled={exporting || !status?.zip_available}>
            {exporting ? 'Preparing backup…' : 'Download full backup'}
          </button>
        </div>
        <p className={styles.muted} style={{ marginTop: '0.75rem' }}>
          Recommended: once a week, and again after a large content update. Keep at least the last two copies.
        </p>
      </div>

      <div className={styles.card} style={{ marginTop: '1.25rem' }}>
        <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Restore on this site</h2>
        <p className={styles.muted}>
          Use this after moving to a new server, or to roll back to an earlier copy. Download a backup of the
          <em> current </em> site first — restore replaces everything that is here now.
        </p>
        <div className={styles.field} style={{ marginTop: '1rem' }}>
          <label htmlFor="backup-file">Backup ZIP</label>
          <input
            id="backup-file"
            type="file"
            accept=".zip,application/zip"
            disabled={restoring}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? <p className={styles.muted}>{file.name}</p> : null}
        </div>
        <label className={styles.muted} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: '0.75rem 0' }}>
          <input
            type="checkbox"
            checked={understood}
            disabled={restoring}
            onChange={(e) => setUnderstood(e.target.checked)}
          />
          <span>
            I understand this will replace all current pages, media, menus, translations, users, and enquiries
            with the contents of this file.
          </span>
        </label>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleRestore}
            disabled={restoring || !file || !understood}
          >
            {restoring ? 'Restoring…' : 'Restore from backup'}
          </button>
        </div>
        {status?.php ? (
          <p className={styles.muted} style={{ marginTop: '0.75rem' }}>
            This server accepts uploads up to {status.php.upload_max_filesize} (POST {status.php.post_max_size}).
            If the ZIP is larger, copy it to the server and run{' '}
            <code>php artisan site:restore /path/to/backup.zip</code>.
          </p>
        ) : null}
      </div>

      {status ? (
        <div className={styles.card} style={{ marginTop: '1.25rem' }}>
          <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Current data on this server</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Area</th>
                <th>Rows</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tables).map(([name, count]) => (
                <tr key={name}>
                  <td>{name.replace(/_/g, ' ')}</td>
                  <td>{formatCount(count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
