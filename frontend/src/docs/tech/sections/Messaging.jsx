import { WhoEdits } from '../Inventory'

export default function TechMessaging() {
  return (
    <div>
      <h2>WhatsApp for pilgrims</h2>
      <p>
        This site does not use a paid SMS gateway (no provider account, API UUID, or sender ID to hand
        over). Pilgrims open an official <code>wa.me</code> link. There is no bot fee.
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Where it lives</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WhatsApp number</td>
            <td>Admin → Settings (company / contact). Staff can change it.</td>
          </tr>
          <tr>
            <td>How it works</td>
            <td>Public buttons open WhatsApp with a prefilled message</td>
          </tr>
          <tr>
            <td>Maps</td>
            <td>Google Maps embed and directions link in Admin → Settings</td>
          </tr>
          <tr>
            <td>Video</td>
            <td>YouTube URLs on video / page forms in the CMS</td>
          </tr>
        </tbody>
      </table>
      <p>
        If a later phase adds SMS or a payment-confirmation gateway, that would be a separate quote and a
        new row in this inventory.
      </p>

      <h3>Admin can change vs host</h3>
      <WhoEdits
        staff="WhatsApp number, map embed, directions link, and which YouTube videos are published."
        host="Nothing for WhatsApp. Only needed later if a paid messaging API is added."
      />
    </div>
  )
}
