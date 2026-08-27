export default function GuideSitemap() {
  return (
    <div>
      <h2>Public sitemap (reference)</h2>
                  <p>
                    Primary structure follows the Diocese Terms of Reference (six pillars). Utility links: Mass
                    Schedule, Plan Your Pilgrimage, Support, Donate, Contact, and language switcher (RW · FR · EN ·
                    DE).
                  </p>

                  <h3>A. Our Lady of Kibeho</h3>
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
                        <td>Home / hub</td>
                        <td>
                          <code>/</code>, <code>/our-lady</code>
                        </td>
                        <td>Home + CMS</td>
                      </tr>
                      <tr>
                        <td>Apparitions, Visionaries, Messages, Recognition, History, FAQ</td>
                        <td>
                          <code>/our-lady/…</code>
                        </td>
                        <td>CMS pages</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>B. The Shrine</h3>
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
                        <td>Hub, Welcome, Holy Spring, Way of the Cross, Adorations, Map</td>
                        <td>
                          <code>/shrine/…</code>
                        </td>
                        <td>CMS pages</td>
                      </tr>
                      <tr>
                        <td>Churches / Apparition sites</td>
                        <td>
                          <code>/shrine/churches</code>, <code>/shrine/apparition-sites</code> (+ slug)
                        </td>
                        <td>Directory modules</td>
                      </tr>
                      <tr>
                        <td>Mass Schedule</td>
                        <td>
                          <code>/shrine/mass-schedule</code>
                        </td>
                        <td>Mass schedules</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>C. Pilgrimage</h3>
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
                        <td>Hub, Why Kibeho, Plan, Transport, Office, Practical info</td>
                        <td>
                          <code>/pilgrimage/…</code>
                        </td>
                        <td>CMS pages</td>
                      </tr>
                      <tr>
                        <td>Accommodation</td>
                        <td>
                          <code>/pilgrimage/accommodation</code>, <code>/hotels/:slug</code>
                        </td>
                        <td>Accommodations</td>
                      </tr>
                      <tr>
                        <td>Calendar</td>
                        <td>
                          <code>/pilgrimage/calendar</code>, <code>/pilgrimages</code>,{' '}
                          <code>/pilgrimages/:slug</code>
                        </td>
                        <td>Pilgrimage events</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>D. Spirituality</h3>
                  <p>
                    Hub and prayer/rosary/novena/meditation pages under <code>/spirituality/…</code> (CMS).
                    Testimonies: <code>/spirituality/testimonies</code> (Testimonials module).{' '}
                    <strong>Light a candle</strong> (<code>/spirituality/prayer-intentions</code>) and{' '}
                    <strong>Have a Mass said</strong> (<code>/spirituality/request-a-mass</code>) are CMS pages
                    with a public offering form. Prices and payment channels are under Settings → Offerings &amp;
                    donations; invitation text is on Pages (language tabs) and short buttons in Translations.
                  </p>

                  <h3>E. News</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Page</th>
                        <th>Path</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>All news / article</td>
                        <td>
                          <code>/news</code>, <code>/news/:slug</code>
                        </td>
                      </tr>
                      <tr>
                        <td>Events / Rector / Bishop / Press</td>
                        <td>
                          <code>/news?category=…</code>
                        </td>
                      </tr>
                      <tr>
                        <td>Photos</td>
                        <td>
                          <code>/gallery</code>
                        </td>
                      </tr>
                      <tr>
                        <td>Videos</td>
                        <td>
                          <code>/news/videos</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>F. Support the Shrine</h3>
                  <p>
                    Hub, Vision, Master Plan, Donations, Annual Reports, Transparency, Partners (CMS). Development
                    projects: <code>/support/projects</code> (+ slug) via the Development projects admin module —
                    each project has a story (the need, what we will do, the fruit) and a gift form. Public nav
                    shortens this to <strong>Projects</strong>.
                  </p>

                  <h3>Other</h3>
                  <ul>
                    <li>
                      Activities: <code>/activities</code>
                    </li>
                    <li>
                      Contact: <code>/contact</code>
                    </li>
                    <li>
                      Admin: <code>/admin</code>
                    </li>
                  </ul>
    </div>
  )
}
