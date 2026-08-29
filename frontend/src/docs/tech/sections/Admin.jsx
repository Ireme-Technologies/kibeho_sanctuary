import { WhoEdits } from '../Inventory'

export default function TechAdmin() {
  return (
    <div>
      <h2>Top-level administrator accounts</h2>
      <p>
        Record the Diocese-owned master accounts at handover. Temporary developer passwords must be
        rotated. Demo logins on this evaluation site are for testing only.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Practice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Master admin</td>
            <td>Create on a Diocese mailbox (for example communications@ the shrine domain)</td>
          </tr>
          <tr>
            <td>Editors</td>
            <td>Optional staff accounts for news and pages</td>
          </tr>
          <tr>
            <td>Developer access</td>
            <td>By invitation only; remove or limit after acceptance</td>
          </tr>
          <tr>
            <td>Password reset</td>
            <td>Through the agreed Diocese email</td>
          </tr>
          <tr>
            <td>Demo evaluation login</td>
            <td>
              <code>admin@kibeho.org</code> — change on production handover
            </td>
          </tr>
        </tbody>
      </table>

      <h2>What staff change in the CMS (no developer)</h2>
      <ul>
        <li>Pages, news, menus, images, PDFs, and translations</li>
        <li>Mass schedule, pilgrimage calendar, churches, accommodations, projects</li>
        <li>
          Settings: official name, phones, public email, WhatsApp, social links, map, logo
        </li>
        <li>
          Offerings: candle and Mass amounts, MoMo Pay code, bank accounts, optional payment link
        </li>
        <li>Users (authorised managers) and their own password</li>
        <li>Download of the content backup ZIP</li>
      </ul>
      <p>
        Rule of thumb: text, image, PDF, date, menu link, or translation of an existing field → admin
        panel. New behaviour or a new page type → developer.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="All of the CMS items above, including creating editors and changing the notification email."
        host="Server users and SSH. Application bugs, new modules, and a new language code need a developer."
      />
    </div>
  )
}
