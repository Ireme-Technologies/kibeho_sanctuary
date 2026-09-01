export default function GuideSitemap() {
  return (
    <div>
      <h2>Public sitemap (reference)</h2>
      <p>
        Primary structure follows five pillars: <strong>The Shrine</strong>, <strong>Pilgrimage</strong>,{' '}
        <strong>Spirituality</strong>, <strong>News</strong>, and <strong>Support the Shrine</strong>. Utility
        links: Schedule, Plan Your Pilgrimage, Support, Donate, Contact, and language switcher (RW · FR · EN · DE).
      </p>

      <h3>A. The Shrine</h3>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Path</th>
            <th>Managed as</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hub, Welcome, History, FAQ</td>
            <td>
              <code>/shrine/…</code>
            </td>
            <td>CMS pages</td>
          </tr>
          <tr>
            <td>Visionaries</td>
            <td>
              <code>/shrine/visionaries</code>
            </td>
            <td>Visionaries directory</td>
          </tr>
          <tr>
            <td>The Messages</td>
            <td>
              <code>/shrine/messages</code>
            </td>
            <td>Messages of Mary + CMS intro</td>
          </tr>
          <tr>
            <td>Apparition sites / Main places</td>
            <td>
              <code>/shrine/apparition-sites</code>, <code>/shrine/places</code> (+ slug)
            </td>
            <td>Sacred places</td>
          </tr>
          <tr>
            <td>Schedule</td>
            <td>
              <code>/shrine/schedule</code>
            </td>
            <td>Mass schedules + CMS</td>
          </tr>
          <tr>
            <td>Pastoral team &amp; communities</td>
            <td>
              <code>/shrine/pastoral-team</code>, <code>/shrine/communities</code>
            </td>
            <td>Directory modules</td>
          </tr>
        </tbody>
      </table>

      <h3>B. Pilgrimage</h3>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Path</th>
            <th>Managed as</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Why Kibeho, Plan, Practical guidelines, How to get here</td>
            <td>
              <code>/pilgrimage/…</code>
            </td>
            <td>CMS pages</td>
          </tr>
          <tr>
            <td>Annual celebrations</td>
            <td>
              <code>/pilgrimage/annual-celebrations</code>
            </td>
            <td>CMS + Pilgrimage events</td>
          </tr>
          <tr>
            <td>Accommodation</td>
            <td>
              <code>/pilgrimage/accommodation</code>, <code>/pilgrimage/accommodation/:slug</code>
            </td>
            <td>Accommodations</td>
          </tr>
        </tbody>
      </table>

      <h3>C. Spirituality</h3>
      <p>
        Prayer intentions, Mass request, light a candle, and share testimony use private enquiry forms (not
        published). Mass offering: USD 2.50 / EUR 2.00 — set under Settings → Offerings. Official prayers and
        books are directory modules; other pages are CMS.
      </p>

      <h3>D. News</h3>
      <p>
        Articles use categories: Chronicles, Annual Celebrations, Articles, Announcements. Gallery, video,
        audio, documentaries, broadcast, and Our Channels cover media and social links.
      </p>

      <h3>E. Support the Shrine</h3>
      <p>
        Vision (CMS), Projects (development projects with per-project donate form — funding totals are admin-only),
        Donate (<code>/support/donations</code>).
      </p>

      <h3>Legacy URLs</h3>
      <p>
        Old <code>/our-lady/*</code> paths redirect to the Shrine. Old support pages (master plan, partners,
        transparency) redirect to Support hub or Vision.
      </p>
    </div>
  )
}
