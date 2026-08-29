import { WhoEdits } from '../Inventory'

export default function TechDatabase() {
  return (
    <div>
      <h2>Credentials and the latest backup</h2>
      <p>
        Content lives in MySQL. The hosting partner creates one empty database and a user we can configure.
        Record the credentials with the hosting account — not in this public document.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Engine</td>
            <td>MySQL 5.7+ / 8.x or MariaDB equivalent</td>
          </tr>
          <tr>
            <td>What to create</td>
            <td>One empty database + user with full rights on that database</td>
          </tr>
          <tr>
            <td>Where credentials live</td>
            <td>Server environment file (not Git, not the public website)</td>
          </tr>
          <tr>
            <td>Latest content backup</td>
            <td>
              Admin ZIP downloaded from <strong>Admin → Backup &amp; restore</strong>, stored off the server
              (Diocese computer or Drive)
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        A Git clone without that ZIP restores the empty / demo site, not live Diocese content. The ZIP does
        not include database passwords — those stay in the environment file on each host.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="Pages, news, menus, and other CMS records. After large updates, download a new backup ZIP."
        host="Database name, user, password, and server-side dumps if the host offers them."
      />
    </div>
  )
}
