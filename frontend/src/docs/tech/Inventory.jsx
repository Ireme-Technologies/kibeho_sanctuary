import { Link } from 'react-router-dom'
import styles from '../DocsLayout.module.css'
import { techPath } from './techNav'

export function Inventory({ rows }) {
  return (
    <ul className={styles.inventory}>
      {rows.map((row) => (
        <li key={row.label}>
          {row.slug === undefined ? (
            <div className={styles.inventoryRow}>
              <strong className={styles.inventoryLabel}>{row.label}</strong>
              <span className={styles.inventoryMeta}>{row.detail}</span>
            </div>
          ) : (
            <Link to={techPath(row.slug)} className={styles.inventoryRow}>
              <strong className={styles.inventoryLabel}>{row.label}</strong>
              <span className={styles.inventoryMeta}>{row.detail}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

/** Clear split: what sanctuary staff edit in CMS vs what the host / developer owns. */
export function WhoEdits({ staff, host }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Who</th>
          <th>What they change</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Sanctuary admin</strong>
            <br />
            <span style={{ color: 'var(--docs-muted)', fontSize: '0.9em' }}>CMS — no developer needed</span>
          </td>
          <td>{staff}</td>
        </tr>
        <tr>
          <td>
            <strong>Hosting partner / developer</strong>
          </td>
          <td>{host}</td>
        </tr>
      </tbody>
    </table>
  )
}
