import styles from './DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav, DocsToc } from './DocsChrome'

const TOC = [
  { href: '#sitemap', label: 'Complete sitemap' },
  { href: '#content-types', label: 'Content types' },
  { href: '#admin-guide', label: 'Admin user guide' },
  { href: '#getting-started', label: 'Getting started' },
  { href: '#pages-news', label: 'Pages & news' },
  { href: '#menus-media', label: 'Menus, images & documents' },
  { href: '#translations', label: 'Translations' },
  { href: '#schedules-dirs', label: 'Schedules & directories' },
  { href: '#enquiries-users', label: 'Enquiries & users' },
  { href: '#settings', label: 'Settings & account' },
  { href: '#checklist', label: 'Non-technical checklist' },
  { href: '#future', label: 'Future upgrades' },
]

export default function SitemapAdminGuidePage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Document 2 of 2</p>
        <h1>Sitemap &amp; administrator user guide</h1>
        <p className={styles.lede}>
          Complete public site map, how every administration module works for non-technical staff, and
          recommended future upgrades after Phase 1. Use this guide while signed in at{' '}
          <a href="/admin/login" target="_blank" rel="noreferrer">
            /admin/login
          </a>
          .
        </p>
      </div>

      <DocsToolbar
        downloadHref="/docs/downloads/sitemap-and-admin-guide.md"
        downloadLabel="Download sitemap & admin guide (.md)"
      />

      <div className={styles.layout}>
        <DocsToc items={TOC} />
        <article className={styles.article}>
          <section id="sitemap">
            <h2>1. Complete sitemap</h2>
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
                  <td>Pilgrimage Calendar</td>
                  <td>
                    <code>/pilgrimage/calendar</code>
                  </td>
                  <td>Pilgrim calendar</td>
                </tr>
                <tr>
                  <td>Programs</td>
                  <td>
                    <code>/pilgrimages</code>, <code>/pilgrimages/:slug</code>
                  </td>
                  <td>Pilgrimage Services</td>
                </tr>
              </tbody>
            </table>

            <h3>D. Spirituality</h3>
            <p>
              Hub and prayer/rosary/novena/meditation pages under <code>/spirituality/…</code> (CMS).
              Testimonies: <code>/spirituality/testimonies</code> (Testimonials module).
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
              Hub, Vision, Master Plan, Donations, Annual Reports, Transparency, Partners (CMS). Current
              Projects: <code>/support/projects</code> (+ slug) via Support projects module.
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
          </section>

          <section id="content-types">
            <h2>2. Content types at a glance</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Admin menu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Informational pages</td>
                  <td>Pages</td>
                </tr>
                <tr>
                  <td>News &amp; clergy messages</td>
                  <td>News &amp; clergy messages</td>
                </tr>
                <tr>
                  <td>Mass times</td>
                  <td>Mass schedules</td>
                </tr>
                <tr>
                  <td>Pilgrim events</td>
                  <td>Pilgrim calendar</td>
                </tr>
                <tr>
                  <td>Churches / apparition sites</td>
                  <td>Churches / Apparition sites</td>
                </tr>
                <tr>
                  <td>Hotels / lodging</td>
                  <td>Accommodations</td>
                </tr>
                <tr>
                  <td>Fundraising projects</td>
                  <td>Support projects</td>
                </tr>
                <tr>
                  <td>Testimonies</td>
                  <td>Testimonials</td>
                </tr>
                <tr>
                  <td>Programs / experiences</td>
                  <td>Pilgrimage Services / Shrine Experiences</td>
                </tr>
                <tr>
                  <td>YouTube videos</td>
                  <td>Videos</td>
                </tr>
                <tr>
                  <td>Photos &amp; PDFs</td>
                  <td>Gallery / Media</td>
                </tr>
                <tr>
                  <td>UI labels</td>
                  <td>Translations</td>
                </tr>
                <tr>
                  <td>Menus &amp; contact</td>
                  <td>Settings &amp; menus</td>
                </tr>
                <tr>
                  <td>Pilgrim messages</td>
                  <td>Pilgrim Enquiries</td>
                </tr>
              </tbody>
            </table>
          </section>

          <hr />

          <section id="admin-guide">
            <h2>3. Administrator user guide</h2>
            <p>
              The CMS is available at <code>/admin</code>. Day-to-day publishing does not require coding.
              Always click <strong>Save</strong> (or <strong>Save translations</strong>) after editing.
            </p>
          </section>

          <section id="getting-started">
            <h2>4. Getting started</h2>
            <div className={styles.notice}>
              <strong>Demo content:</strong> Sample text and images will be replaced with official Shrine
              content and photographs as they are provided by the Diocese.
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
                  <td>Dashboard</td>
                  <td>See recent pilgrim enquiries at a glance</td>
                </tr>
                <tr>
                  <td>Mass schedules</td>
                  <td>Publish Mass times and languages</td>
                </tr>
                <tr>
                  <td>Pilgrim calendar</td>
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
                  <td>Support projects</td>
                  <td>Describe fundraising / development projects</td>
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
                  <td>All informational pillar pages (blocks)</td>
                </tr>
                <tr>
                  <td>Translations</td>
                  <td>Short UI labels per language</td>
                </tr>
                <tr>
                  <td>Gallery / Media</td>
                  <td>Upload images &amp; documents</td>
                </tr>
                <tr>
                  <td>Pilgrim Enquiries</td>
                  <td>Answer messages from visitors</td>
                </tr>
                <tr>
                  <td>Users</td>
                  <td>Create staff accounts (if authorised)</td>
                </tr>
                <tr>
                  <td>Settings &amp; menus</td>
                  <td>Organisation info, navigation, theme</td>
                </tr>
              </tbody>
            </table>
            <h3>Language tabs on content forms</h3>
            <p>
              Most content screens show tabs for Kinyarwanda, Français, English, Deutsch. Fill the language
              you are working on; leave others empty to use fallback. Long texts are edited here—not only in
              the Translations grid.
            </p>
          </section>

          <section id="pages-news">
            <h2>5. Create and edit a page</h2>
            <ol>
              <li>Open <strong>Pages</strong>.</li>
              <li>Select the page key matching the sitemap (e.g. Shrine → Welcome).</li>
              <li>Choose the language tab.</li>
              <li>Edit title, introduction, and content blocks. Add or replace images via the media picker.</li>
              <li>Click <strong>Save</strong>.</li>
              <li>
                Open the public URL in a new tab to verify. Hard-refresh if the browser cached an old view.
              </li>
            </ol>

            <h2>6. Publish a news article</h2>
            <ol>
              <li>Open <strong>News &amp; clergy messages</strong>.</li>
              <li>
                Create or edit: title, category (News, Events, Rector, Bishop, Press), summary, body (rich
                text toolbar), featured image, publish status.
              </li>
              <li>Complete other language tabs as translations become available.</li>
              <li>Save, then check <code>/news</code> and the article link.</li>
            </ol>
            <p>
              Tip: use headings, lists, links, and images in the rich text editor the same way you would in a
              word processor. Paste from Word carefully; prefer plain paste then re-apply formatting in the
              editor when possible.
            </p>
          </section>

          <section id="menus-media">
            <h2>7. Update a menu</h2>
            <ol>
              <li>Open <strong>Settings &amp; menus</strong>.</li>
              <li>Locate navigation (primary, utility, and/or footer).</li>
              <li>Update labels and paths. Keep paths consistent with the sitemap (e.g. <code>/support/donations</code>).</li>
              <li>Save settings.</li>
              <li>Refresh the public site header/footer.</li>
            </ol>
            <p>
              Major pillar labels can also be aligned with keys in <strong>Translations</strong> so they
              follow the active language.
            </p>

            <h2>8. Replace images and upload documents</h2>
            <ol>
              <li>Open <strong>Gallery / Media</strong>.</li>
              <li>Upload JPG/PNG/WebP for images or PDF for documents (reports, leaflets).</li>
              <li>
                Optionally mark an image <strong>show in gallery</strong> so it appears on{' '}
                <code>/gallery</code>.
              </li>
              <li>
                On a page, news item, or directory entry, choose the uploaded file as the featured or block
                image—or link the PDF from page content / Annual Reports.
              </li>
              <li>Save the content record.</li>
            </ol>
            <p>
              Prefer reasonably sized images (large enough for retina screens, not multi‑megabyte camera
              originals) for faster loading on mobile networks.
            </p>
          </section>

          <section id="translations">
            <h2>9. Manage translations</h2>
            <h3>A. Short UI labels</h3>
            <ol>
              <li>Open <strong>Translations</strong>.</li>
              <li>Select a language tab (e.g. Français).</li>
              <li>Search for a key or edit the text field.</li>
              <li>
                When the amber bar appears (“unsaved changes”), click <strong>Save translations</strong>.
              </li>
            </ol>
            <h3>B. Long page / news content</h3>
            <ol>
              <li>Open the item (Pages, News, Church, etc.).</li>
              <li>Use the language tabs on that form.</li>
              <li>Save the item.</li>
            </ol>
            <p>
              Empty translations fall back to the default language, then English—so the site never shows a
              blank critical label if fallbacks exist.
            </p>
          </section>

          <section id="schedules-dirs">
            <h2>10. Schedules and directories</h2>
            <h3>Mass schedules</h3>
            <p>
              Add day, title, time, language, and notes. Use recurrence where weekly/monthly/annual patterns
              apply. Save and verify on <code>/shrine/mass-schedule</code>.
            </p>
            <h3>Pilgrim calendar</h3>
            <p>
              Create upcoming pilgrimages with start/end date and time, optional recurrence, registration
              flag, and multilingual description. Public page: <code>/pilgrimage/calendar</code>.
            </p>
            <h3>Churches &amp; apparition sites</h3>
            <p>
              Create entries with title, summary, body, images, and translations. Slugs are generated from
              titles—staff do not need to invent URLs manually.
            </p>
            <h3>Accommodations, support projects, testimonials, services, activities, videos</h3>
            <p>
              Same pattern: create/edit form → language tabs → media → Save → check the matching public list
              and detail page. Videos store YouTube references rather than large video files on the server.
            </p>
            <h3>Home hero</h3>
            <p>
              Update homepage slides, titles, supporting text, and call-to-action buttons. Keep the first
              viewport focused: brand, one headline, short support line, CTAs—avoid overcrowding.
            </p>
          </section>

          <section id="enquiries-users">
            <h2>11. Pilgrim enquiries</h2>
            <ol>
              <li>Open <strong>Pilgrim Enquiries</strong> (or use the Dashboard).</li>
              <li>Open a thread to read the message and any documents.</li>
              <li>Reply from the admin; the pilgrim can receive email notification as configured.</li>
              <li>WhatsApp deep links may be available for quick follow-up.</li>
              <li>Update status as your pastoral office workflow requires.</li>
            </ol>

            <h2>12. Create users and permissions</h2>
            <ol>
              <li>
                If your account shows <strong>Users</strong>, open it.
              </li>
              <li>Create a user with name, email, and role (Admin or Editor).</li>
              <li>Share credentials securely (never by public chat if possible).</li>
              <li>Ask the new user to change their password immediately.</li>
            </ol>
            <p>
              Phase 1: Editors and Admins both use the CMS for content. A finer “who can edit which module”
              matrix is listed under future upgrades if the Diocese requires stricter separation.
            </p>
          </section>

          <section id="settings">
            <h2>13. Settings, branding, and account</h2>
            <ul>
              <li>
                <strong>Company / contact:</strong> official name, address, phones, email, WhatsApp, social
                links, map embed.
              </li>
              <li>
                <strong>Theme:</strong> logo and configured visual options.
              </li>
              <li>
                <strong>My account:</strong> update password; keep credentials private.
              </li>
            </ul>
            <h3>Good practice</h3>
            <ul>
              <li>Preview on mobile after major edits.</li>
              <li>Enter sensitive pastoral texts only from approved sources.</li>
              <li>After large campaigns, ask IT to run a manual database export (see proposed solution).</li>
            </ul>
          </section>

          <section id="checklist">
            <h2>14. Non-technical demonstration checklist</h2>
            <p>Use this list during Diocese evaluation sessions:</p>
            <ol>
              <li>Create and edit a page</li>
              <li>Publish a news article</li>
              <li>Update a menu</li>
              <li>Replace an image</li>
              <li>Upload a document (PDF)</li>
              <li>Manage a translation (UI key + content language tab)</li>
              <li>Create a user (authorised account)</li>
            </ol>
            <p>
              Related reading:{' '}
              <a href="/docs/proposed-solution">Proposed solution — functional &amp; technical description</a>.
            </p>
          </section>

          <section id="future">
            <h2>15. Future upgrades — recommendations</h2>
            <p>
              After Phase 1 go-live and content maturity, we recommend prioritising upgrades in this order
              (each quoted separately):
            </p>
            <table>
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Upgrade</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Complete remaining translations for all pillar pages</td>
                  <td>Pastoral reach across RW/FR/EN/DE</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Content photography / media pack refresh</td>
                  <td>Stronger first impression without code changes</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Scheduled off-site backup automation</td>
                  <td>Complements host backup + manual export</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Donation payment gateway (card / mobile money)</td>
                  <td>Converts Support pages into actionable giving</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Fine-grained staff permissions</td>
                  <td>Separate news editors from settings/users</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Pilgrim self-service enquiry portal</td>
                  <td>Pilgrims track their own requests</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Newsletter / mailing list integration</td>
                  <td>Regular communication with friends of the Shrine</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Additional languages</td>
                  <td>Architecture ready; requires translators</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>Advanced search &amp; accessibility certification</td>
                  <td>Larger archives and formal compliance needs</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>Design refresh / seasonal campaigns</td>
                  <td>Keep the site visually current without rebuilding CMS</td>
                </tr>
              </tbody>
            </table>
            <p>
              Ongoing: stay on a light maintenance retainer for security updates, uptime checks, and backup
              verification so the platform remains sustainable for five years and beyond.
            </p>
            <h3>What does not need an “upgrade”</h3>
            <p>
              Adding ordinary pages within existing pillars, publishing news, updating schedules, and
              translating existing fields are normal operations—not paid upgrades—once staff are trained.
            </p>
          </section>

          <DocsCrossNav
            prev={{ to: '/docs/proposed-solution', label: 'Proposed solution' }}
            next={{ to: '/docs', label: 'Back to documentation hub' }}
          />
        </article>
      </div>
    </div>
  )
}
