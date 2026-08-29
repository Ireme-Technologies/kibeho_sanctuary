import { WhoEdits } from '../Inventory'

export default function TechEmail() {
  return (
    <div>
      <h2>Resend account and API key ownership</h2>
      <p>
        Enquiry notifications and admin alerts use a transactional provider (Resend) or the host’s SMTP.
        The account and API key should be created under a Diocese email so ownership stays with the Shrine
        at handover.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Provider</td>
            <td>Resend (preferred) or host SMTP</td>
          </tr>
          <tr>
            <td>What it sends</td>
            <td>New pilgrim enquiries and related admin alerts</td>
          </tr>
          <tr>
            <td>API key / SMTP password</td>
            <td>Stored only in the server environment file</td>
          </tr>
          <tr>
            <td>From address</td>
            <td>A Diocese-owned mailbox the provider has verified</td>
          </tr>
          <tr>
            <td>Inbox that receives alerts</td>
            <td>
              Admin → Settings → notification email (staff can change this)
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="The address that should receive enquiry alerts, and the public contact email shown on the website."
        host="Resend (or SMTP) account, API key, and verified sending domain."
      />
    </div>
  )
}
