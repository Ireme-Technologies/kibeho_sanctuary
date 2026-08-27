import styles from '../../DocsLayout.module.css'

export default function GuideSignIn() {
  return (
    <div>
      <h2>4. Getting started</h2>
                  <div className={styles.notice}>
                    <strong>Photos:</strong> Unique pictures are not seeded. Pages and listings use the default
                    header image until you add the real photograph in the matching admin screen. Social profile URLs
                    also need to be added under Settings → Contact & social.
                  </div>
                  <h3>Sign in (evaluation demo)</h3>
                  <div className={styles.creds}>
                    <h2>Admin credentials</h2>
                    <dl>
                      <dt>Login URL</dt>
                      <dd>
                        <a href="/admin/login">/admin/login</a>
                      </dd>
                      <dt>Email</dt>
                      <dd>admin@kibeho.org</dd>
                      <dt>Password</dt>
                      <dd>KibehoAdmin@202!</dd>
                    </dl>
                  </div>
                  <ol>
                    <li>
                      Open <a href="/admin/login">/admin/login</a>.
                    </li>
                    <li>Enter the demo email and password above (or production credentials after handover).</li>
                    <li>Change your password under the profile menu → <strong>My account</strong> after first login on production.</li>
                  </ol>
                  <h3>Admin sidebar (what each item does)</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Menu</th>
                        <th>Use when you need to…</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CMS audit</td>
                        <td>
                          See the readiness score and jump to missing settings, pages, listings, or translations
                        </td>
                      </tr>
                      <tr>
                        <td>Dashboard</td>
                        <td>
                          See recent pilgrim enquiries, plus short cards that explain languages and page layout
                        </td>
                      </tr>
                      <tr>
                        <td>Mass schedules</td>
                        <td>Publish Mass times and languages</td>
                      </tr>
                      <tr>
                        <td>Pilgrimage events</td>
                        <td>Announce upcoming pilgrimages / events (incl. recurrence)</td>
                      </tr>
                      <tr>
                        <td>Churches / Apparition sites</td>
                        <td>Maintain sacred place directories</td>
                      </tr>
                      <tr>
                        <td>Accommodations</td>
                        <td>List lodging options for pilgrims</td>
                      </tr>
                      <tr>
                        <td>Development projects</td>
                        <td>Describe sanctuary projects: the need, the work, impact, gallery, and gift form</td>
                      </tr>
                      <tr>
                        <td>Testimonials</td>
                        <td>Publish pilgrim / spiritual testimonies</td>
                      </tr>
                      <tr>
                        <td>News &amp; clergy messages</td>
                        <td>Articles, events, Rector/Bishop/Press items</td>
                      </tr>
                      <tr>
                        <td>Pilgrimage Services</td>
                        <td>Structured pilgrimage programs</td>
                      </tr>
                      <tr>
                        <td>Shrine Experiences</td>
                        <td>Activities visitors can take part in</td>
                      </tr>
                      <tr>
                        <td>Videos (YouTube)</td>
                        <td>Curate video list</td>
                      </tr>
                      <tr>
                        <td>Home hero</td>
                        <td>Homepage banner / slides / CTAs</td>
                      </tr>
                      <tr>
                        <td>Pages</td>
                        <td>
                          Informational pillar pages: header, intro, and layout blocks — each language can have its
                          own body
                        </td>
                      </tr>
                      <tr>
                        <td>Translations</td>
                        <td>Short buttons and labels only (Donate, Contact) — not page articles</td>
                      </tr>
                      <tr>
                        <td>Gallery / Media</td>
                        <td>Upload images &amp; documents; public gallery vs permanent delete</td>
                      </tr>
                      <tr>
                        <td>Pilgrim Enquiries</td>
                        <td>Answer candle, Mass, donation, project, partnership, and pilgrimage requests</td>
                      </tr>
                      <tr>
                        <td>Users</td>
                        <td>Create staff accounts (if authorised)</td>
                      </tr>
                      <tr>
                        <td>Site menus</td>
                        <td>Main menu, top header, and footer links</td>
                      </tr>
                      <tr>
                        <td>Settings</td>
                        <td>
                          Organisation info, contact, theme, and Offerings &amp; donations (candle/Mass prices,
                          MoMo, bank, online payment)
                        </td>
                      </tr>
                      <tr>
                        <td>Backup &amp; restore</td>
                        <td>Download or restore a ZIP of all live content and photos</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3>Language tabs on content forms</h3>
                  <p>
                    After you click <strong>Edit</strong> (or while editing a page), a blue{' '}
                    <strong>Content language</strong> bar appears with tabs for Ikinyarwanda, Français, English, and
                    Deutsch. That bar is where long text and page layout are translated. The{' '}
                    <strong>Translations</strong> menu is only for short buttons. Full steps:{' '}
                    <a href="/docs/sitemap-and-admin-guide/languages">Best way to manage languages</a>.
                  </p>
    </div>
  )
}
