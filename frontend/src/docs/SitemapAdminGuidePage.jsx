import styles from './DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav, DocsToc } from './DocsChrome'
import DocsAuditPanel from './DocsAuditPanel'

const TOC = [
  { href: '#start-here', label: 'How to use this CMS' },
  { href: '#audit', label: 'CMS audit & readiness' },
  { href: '#getting-started', label: 'Sign in' },
  { href: '#settings', label: 'Settings' },
  { href: '#offerings', label: 'Offerings & gifts' },
  { href: '#languages', label: 'Languages' },
  { href: '#menus-media', label: 'Menus & media' },
  { href: '#pages-news', label: 'Pages & news' },
  { href: '#schedules-dirs', label: 'Directories' },
  { href: '#translations', label: 'Button labels' },
  { href: '#enquiries-users', label: 'Enquiries & users' },
  { href: '#backup', label: 'Backup & restore' },
  { href: '#sitemap', label: 'Public sitemap' },
  { href: '#content-types', label: 'Content types' },
  { href: '#checklist', label: 'Checklist' },
  { href: '#new-server', label: 'New server (technical)' },
  { href: '#future', label: 'Future upgrades' },
]

export default function SitemapAdminGuidePage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Administrator guide</p>
        <h1>How to run the Shrine website</h1>
        <p className={styles.lede}>
          Follow this order: sign in, open <strong>CMS audit</strong>, finish settings and languages, then
          pages and listings. The live score below (when you are signed in) shows what still needs official
          content. Use this guide at{' '}
          <a href="/admin/login" target="_blank" rel="noreferrer">
            /admin/login
          </a>
          .
        </p>
      </div>

      <DocsToolbar
        downloadHref="/evaluation-downloads/sitemap-and-admin-guide.md"
        downloadLabel="Download sitemap & admin guide (.md)"
      />

      <div className={styles.layout}>
        <DocsToc items={TOC} />
        <article className={styles.article}>
          <section id="start-here">
            <h2>1. How to use this CMS</h2>
            <p>
              Work from the <strong>CMS audit</strong> in the admin sidebar. It scores settings, pages,
              accommodations, communities, articles, translations, and more, and links you to whatever is
              not finished. Then follow this guide in order:
            </p>
            <ol>
              <li>
                Sign in and open <a href="/admin/audit">CMS audit</a>.
              </li>
              <li>
                Complete <a href="#settings">Settings</a> (name, logo, phone, email, map).
              </li>
              <li>
                Add and publish <a href="#languages">languages</a> when translations are ready.
              </li>
              <li>
                Check <a href="#menus-media">menus and images</a>, then <a href="#pages-news">pages and news</a>.
              </li>
              <li>
                Fill <a href="#schedules-dirs">directories</a> (accommodation, churches, pastoral team, etc.).
              </li>
              <li>
                Download a <a href="#backup">backup</a> after large updates.
              </li>
            </ol>
            <p>
              The public <a href="#sitemap">sitemap</a> is a reference at the end of this page.
            </p>
          </section>

          <section id="audit">
            <h2>2. CMS audit &amp; readiness</h2>
            <p>
              The audit is a content report, not a technical test. Official page copy is seeded; photos are
              left empty so the site uses the default header until you upload real images. Click any critical
              item to open the editor.
            </p>
            <DocsAuditPanel />
          </section>

          <section id="sitemap">
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
                  <td>Pilgrimage events</td>
                  <td>Pilgrimage events</td>
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
                  <td>Development projects</td>
                  <td>Development projects</td>
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
                  <td>Menus</td>
                  <td>Site menus</td>
                </tr>
                <tr>
                  <td>Contact &amp; theme</td>
                  <td>Settings</td>
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
              Always click <strong>Save</strong> on the content form you edited (or{' '}
              <strong>Save translations</strong> only when you changed short button labels).
            </p>
            <p>
              The most important daily skill is languages: finish the default language first, then use the
              blue <strong>Content language</strong> bar on each item. See{' '}
              <a href="#languages">Best way to manage languages</a>.
            </p>
          </section>

          <section id="getting-started">
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
                  <td>Upload images &amp; documents</td>
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
              <a href="#languages">Best way to manage languages</a>.
            </p>
          </section>

          <section id="offerings">
            <h2>Offerings, candles, Mass, donations, and projects</h2>
            <p>
              Visitors can light a candle, have a Mass said, give to the mission, support a project, become a
              partner, or register for a pilgrimage. Each public page has a form: <strong>Pay now</strong>{' '}
              (MoMo in Rwanda, or online / bank transfer from abroad) or <strong>Submit a pledge</strong>{' '}
              (email or WhatsApp so the office can follow up). Staff change the amounts, the invitation
              wording, and the translations in the screens below — nothing is locked in the code.
            </p>

            <h3>What to edit where</h3>
            <table>
              <thead>
                <tr>
                  <th>You want to change…</th>
                  <th>Go to…</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Candle price, Mass offering, suggested gift chips (10 / 25 / 50 / 100), MoMo code, bank accounts, online payment URL</td>
                  <td>
                    <a href="/admin/settings?tab=offerings">Settings → Offerings &amp; donations</a>
                  </td>
                </tr>
                <tr>
                  <td>Page title, subtitle, and invitation paragraph (the warm lead above the form)</td>
                  <td>
                    <strong>Pages</strong> — Light a candle, Have a Mass said, Give to the mission, Partners,
                    Sanctuary projects. Use the language tabs, then Save page.
                  </td>
                </tr>
                <tr>
                  <td>
                    Buttons and short phrases: Pay now, Submit a pledge, Light a candle, form labels, “Other
                    ways to walk with us”
                  </td>
                  <td>
                    <strong>Translations</strong> — search <code>offer.</code>, <code>invite.</code>, or{' '}
                    <code>project.</code>, then Save translations
                  </td>
                </tr>
                <tr>
                  <td>A project’s story: the need, what we will do, impact (local / Church / world), gallery</td>
                  <td>
                    <strong>Development projects</strong> → Edit — language tabs on each field, then Save
                  </td>
                </tr>
                <tr>
                  <td>Incoming candle, Mass, donation, project, partnership, or pilgrimage requests</td>
                  <td>
                    <strong>Pilgrim Enquiries</strong> — filter by Type
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>How payment works (so you set it correctly)</h3>
            <ol>
              <li>
                <strong>Rwanda:</strong> the visitor taps MoMo Pay. Keep the USSD code accurate (including{' '}
                <code>#</code>).
              </li>
              <li>
                <strong>Abroad:</strong> if Online payment URL is filled, they see that button. If it is
                empty, they see the bank accounts instead.
              </li>
              <li>
                A pledge does not take money on the site. It sends email or WhatsApp so the office can
                confirm and collect later.
              </li>
            </ol>
            <p>
              After you change Settings or Translations, open the public pages (
              <code>/spirituality/prayer-intentions</code>, <code>/spirituality/request-a-mass</code>,{' '}
              <code>/support/donations</code>, <code>/support/projects</code>, <code>/support/partners</code>
              ) and switch RW · FR · EN · DE to confirm.
            </p>
          </section>

          <section id="languages">
            <h2>5. Best way to manage languages</h2>
            <p>
              The site has four public languages. Staff do <strong>not</strong> create four separate pages.
              Each item is one record with language tabs. Empty fields fall back to the default language, then
              English — so a missing French translation is not a blank page, it is English until you fill the
              Français tab and click Save.
            </p>

            <div className={styles.notice}>
              <strong>Use the right screen:</strong> page titles, articles, Mass notes, and body layout are
              edited on that item’s form (Pages, News, …). <strong>Translations</strong> is only for short
              chrome such as Donate, Contact, and form hints.
            </div>

            <h3>Recommended daily workflow</h3>
            <ol>
              <li>
                Sign in at <code>/admin</code>. The Dashboard cards <strong>Manage languages</strong> and{' '}
                <strong>Flexible page layout</strong> summarise this process.
              </li>
              <li>
                Finish the <strong>default language</strong> first (marked on the tab). Visitors see this when
                a translation is still empty.
              </li>
              <li>
                Open the item: <strong>Pages</strong> for pillar content, or <strong>Edit</strong> on News,
                Mass schedules, churches, and other lists.
              </li>
              <li>
                On the blue <strong>Content language</strong> bar, choose Ikinyarwanda, Français, English, or
                Deutsch. A <strong>green dot</strong> means that language already has text; an empty ring
                means it still falls back.
              </li>
              <li>
                Click <strong>Copy from default</strong> to duplicate the default-language text and layout,
                then translate in place. This is faster and keeps headings, galleries, and blocks aligned.
              </li>
              <li>
                Click <strong>Save</strong> on that form (not “Save translations”, unless you were editing
                button labels).
              </li>
              <li>
                Open the public site, switch the header language, and confirm the new text. Hard-refresh if
                the browser shows an old view.
              </li>
            </ol>

            <h3>What to translate where</h3>
            <table>
              <thead>
                <tr>
                  <th>You want to change…</th>
                  <th>Go to…</th>
                  <th>Then…</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A page title, intro, or body layout</td>
                  <td>Pages</td>
                  <td>Language tab → edit blocks → Save page</td>
                </tr>
                <tr>
                  <td>A news article or clergy message</td>
                  <td>News &amp; clergy messages → Edit</td>
                  <td>Language tab → title / body → Save</td>
                </tr>
                <tr>
                  <td>Mass times notes, pilgrimages, churches, hotels, videos</td>
                  <td>The matching admin menu → Edit</td>
                  <td>Language tab → Save</td>
                </tr>
                <tr>
                  <td>Homepage heading and caption</td>
                  <td>Home hero</td>
                  <td>Language tab → Save</td>
                </tr>
                <tr>
                  <td>Buttons such as Donate, Pay now, Light a candle, form hints</td>
                  <td>Translations</td>
                  <td>
                    Search <code>offer.</code>, <code>invite.</code>, or <code>project.</code> → edit → Save
                    translations
                  </td>
                </tr>
                <tr>
                  <td>Candle price, Mass offering, MoMo code, bank accounts, gift chips</td>
                  <td>Settings → Offerings &amp; donations</td>
                  <td>Edit numbers and channels → Save settings</td>
                </tr>
                <tr>
                  <td>A sanctuary project story (need, work, impact, gallery)</td>
                  <td>Development projects → Edit</td>
                  <td>Language tab → rich text + gallery → Save</td>
                </tr>
                <tr>
                  <td>Which language first-time visitors see</td>
                  <td>Translations</td>
                  <td>Set <strong>Default language</strong> → Save translations</td>
                </tr>
              </tbody>
            </table>

            <h3>Page layout in each language</h3>
            <p>
              On <strong>Pages</strong>, each language can have its own body: headings, rich text, notes,
              lists, galleries, YouTube, cards, steps, and schedules. Add a block with the buttons above the
              editor (do not only look for a single “Add block” at the bottom). Inside a text block, the
              formatting toolbar covers headings, bold, lists, alignment, colour, tables, images, and YouTube.
            </p>
            <p>
              If another language still has no blocks, use <strong>Copy from default</strong>, then translate
              the copied text. Until you save a layout for that language, the public site keeps showing the
              default-language body.
            </p>

            <h3>Good habits</h3>
            <ul>
              <li>Translate one page fully (all four tabs you need) before moving to the next page.</li>
              <li>Official prayers and episcopal texts must be pasted from approved sources — do not improvise.</li>
              <li>
                If the public site is still in English after you typed French, you likely edited the
                Translations grid, forgot Save on the content form, or are viewing a cached tab.
              </li>
            </ul>
          </section>

          <section id="pages-news">
            <h2>6. Create and edit a page</h2>
            <ol>
              <li>Open <strong>Pages</strong>.</li>
              <li>Select the page matching the sitemap (e.g. Shrine → Welcome).</li>
              <li>
                On the blue <strong>Content language</strong> bar, choose the language you are editing. Finish
                the default language first.
              </li>
              <li>Edit eyebrow, title, subtitle, and introduction (rich text). On story pages such as The Apparitions or the Seven Sorrows Rosary, the introduction appears as a featured lead; lists become cards automatically.</li>
              <li>
                Build the body with layout blocks: heading, paragraph, note, list, gallery, YouTube, cards,
                steps, or schedule. Click a block type to add it. Use Up / Down to reorder.
              </li>
              <li>
                For another language, click that tab, then <strong>Copy from default</strong>, translate the
                copied blocks, and keep or adjust the layout.
              </li>
              <li>Click <strong>Save page</strong>.</li>
              <li>
                Open the public URL and switch the site language to verify. Hard-refresh if the browser cached
                an old view.
              </li>
            </ol>
            <p>
              Images and URLs (hero image, button paths) are shared across languages. Button{' '}
              <em>labels</em> and all visible text are per language.
            </p>

            <h2>7. Publish a news article</h2>
            <ol>
              <li>Open <strong>News &amp; clergy messages</strong>.</li>
              <li>Click <strong>Add post</strong> or <strong>Edit</strong> — language tabs are on the form, not the list.</li>
              <li>
                Create or edit: title, category (News, Events, Rector, Bishop, Press), summary, body (rich
                text toolbar), featured image, publish status.
              </li>
              <li>
                Switch language tabs (or Copy from default) as translations become available, then Save.
              </li>
              <li>Check <code>/news</code> and the article link in each language you filled.</li>
            </ol>
            <p>
              Tip: use headings, lists, links, images, tables, and YouTube in the rich text editor the same
              way you would in a word processor. Paste from Word carefully; prefer plain paste then re-apply
              formatting in the editor when possible.
            </p>
          </section>

          <section id="menus-media">
            <h2>8. Update a menu</h2>
            <ol>
              <li>Open <strong>Site menus</strong>.</li>
              <li>Choose <strong>Main menu</strong>, <strong>Top header</strong>, or <strong>Footer</strong> so you know which location you are editing.</li>
              <li>Add an item as top-level or as a submenu under a parent, then drag to reorder.</li>
              <li>Keep paths consistent with the sitemap (e.g. <code>/support/donations</code>).</li>
              <li>Save menus, then refresh the public site.</li>
            </ol>
            <p>
              Major pillar labels can also be aligned with keys in <strong>Translations</strong> so they
              follow the active language.
            </p>

            <h2>9. Replace images and upload documents</h2>
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
            <h2>10. Short UI labels (Translations menu)</h2>
            <p>
              Use this screen only for repeating chrome: Donate, Contact, Read more, Pay now, Submit a
              pledge, form field names, and similar short phrases. Search <code>offer.</code>,{' '}
              <code>invite.</code>, or <code>project.</code> for candle, Mass, donation, and project wording.
              It does <strong>not</strong> replace language tabs on Pages or News.
            </p>
            <ol>
              <li>Open <strong>Translations</strong>.</li>
              <li>Select a language tab (e.g. Français). The default-language column stays visible as the source.</li>
              <li>Search for a key or for existing English text, then type the translation beside it.</li>
              <li>
                Optionally set the <strong>Default language</strong> used for first-time visitors and as
                fallback.
              </li>
              <li>
                When the amber bar appears (“unsaved changes”), click <strong>Save translations</strong>.
              </li>
            </ol>
            <p>
              Empty labels fall back to the default language, then English. For page articles and layout,
              return to <a href="#languages">Best way to manage languages</a>.
            </p>
          </section>

          <section id="schedules-dirs">
            <h2>11. Schedules and directories</h2>
            <h3>Mass schedules</h3>
            <p>
              Add day, title, time, language, and notes. Use recurrence where weekly/monthly/annual patterns
              apply. Save and verify on <code>/shrine/mass-schedule</code>.
            </p>
            <h3>Pilgrimage events</h3>
            <p>
              Create pilgrimage events with start/end date and time, optional recurrence, registration
              flag, and multilingual description. Use the <strong>Updates</strong> column on an event to
              add photo galleries or link a news article (year is optional). Public pages:{' '}
              <code>/pilgrimage/calendar</code> and <code>/pilgrimages/:slug</code>.
            </p>
            <h3>Churches &amp; apparition sites</h3>
            <p>
              Create entries with title, summary, body, images, and translations. Slugs are generated from
              titles—staff do not need to invent URLs manually.
            </p>
            <h3>Accommodations, development projects, testimonials, services, experiences, videos</h3>
            <p>
              Same pattern: click <strong>Edit</strong> → language tabs (Copy from default if helpful) → media
              → Save → check the matching public list and detail page. Videos store YouTube references rather
              than large video files on the server. For <strong>Development projects</strong>, fill The need,
              What we will do, and Impact (local community, the Church, the wider world), plus a gallery of
              progress or the expected outcome. Each project page includes the same gift form as Donations.
              See <a href="#offerings">Offerings, candles, Mass, donations, and projects</a>.
            </p>
            <h3>Home hero</h3>
            <p>
              Update homepage slides, titles, supporting text, and call-to-action buttons. Use language tabs
              for heading, caption, and button labels (Copy from default, then translate). Keep the first
              viewport focused: brand, one headline, short support line, CTAs—avoid overcrowding.
            </p>
          </section>

          <section id="enquiries-users">
            <h2>12. Pilgrim enquiries</h2>
            <p>
              Requests from Light a candle, Have a Mass said, Donations, project gifts, partnership, and
              pilgrimage registration all arrive here. Filter by <strong>Type</strong> (candle, mass,
              donation, project, partnership, pilgrimage) as well as channel and status.
            </p>
            <ol>
              <li>Open <strong>Pilgrim Enquiries</strong> (or use the Dashboard).</li>
              <li>Open a thread to read the message and any documents. The type is shown under the name.</li>
              <li>Reply from the admin; the pilgrim can receive email notification as configured.</li>
              <li>WhatsApp deep links may be available for quick follow-up.</li>
              <li>Update status as your pastoral office workflow requires.</li>
            </ol>

            <h2>13. Create users and permissions</h2>
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
            <h2>14. Settings, branding, and account</h2>
            <ul>
              <li>
                <strong>Company / contact:</strong> official name, address, phones, email, WhatsApp, social
                links, map embed.
              </li>
              <li>
                <strong>Offerings &amp; donations:</strong> candle price, Mass offering, suggested gift
                amounts, MoMo Pay code, online payment URL (empty = show bank accounts), and bank accounts.
                See <a href="#offerings">Offerings, candles, Mass, donations, and projects</a>.
              </li>
              <li>
                <strong>Theme:</strong> logo and configured visual options.
              </li>
              <li>
                <strong>Backup &amp; restore:</strong> see{' '}
                <a href="#backup">Backup &amp; restore</a>.
              </li>
              <li>
                <strong>My account:</strong> update password; keep credentials private.
              </li>
            </ul>
            <h3>Good practice</h3>
            <ul>
              <li>Preview on mobile after major edits.</li>
              <li>Enter sensitive pastoral texts only from approved sources.</li>
              <li>
                After large campaigns, download a full backup (see <a href="#backup">Backups</a>) and store it
                off the server.
              </li>
            </ul>
          </section>

          <section id="backup">
            <h2>15. Backup &amp; restore</h2>
            <p>
              Use <strong>Admin → Backup &amp; restore</strong> to download a ZIP of this site’s content and
              media, keep it in a safe place, and restore it here when you need to roll back or recover.
            </p>

            <h3>Download a backup (sanctuary staff)</h3>
            <p>
              Administrators can download a full copy of <em>live content</em> without SSH. Open{' '}
              <strong>Admin → Backup &amp; restore</strong> (bottom of the sidebar).
            </p>
            <ol>
              <li>Sign in as an administrator (editors cannot use this page).</li>
              <li>
                Click <strong>Download full backup</strong>. A ZIP is saved to your computer.
              </li>
              <li>
                Store that file <strong>off the web server</strong> — a Diocese computer, Google Drive / OneDrive,
                or an encrypted USB. Keep at least the last two copies.
              </li>
              <li>
                Do this <strong>weekly</strong>, and again after a large content update (new translations, many
                photos, a campaign).
              </li>
            </ol>
            <p>The ZIP includes pages, menus, translations, news, schedules, directories, enquiries, admin users, the media library, and site images (logo, hero, and other photos). It does <strong>not</strong> include server secrets (database password, mail keys). Those stay in the server <code>.env</code> file, which the developer sets on each host.</p>

            <h3>Restore from the admin ZIP</h3>
            <ol>
              <li>Download a backup of the <em>current</em> site first, in case you need to undo.</li>
              <li>On <strong>Backup &amp; restore</strong>, choose the ZIP, tick the confirmation box, then confirm twice.</li>
              <li>
                Restore replaces all current content with the file. After a move to a new server, sign in with
                an administrator account that existed in that backup.
              </li>
            </ol>
            <p>
              If the ZIP is too large for the browser, the developer can restore it on the server with{' '}
              <code>php artisan site:restore</code> (see <a href="#new-server">New server &amp; source code</a>
              ).
            </p>
            <p>
              Ireme Tech can help with a scheduled backup, a restore test, or a move to new hosting — ask
              rather than guessing if something looks wrong.
            </p>
          </section>

          <section id="new-server">
            <h2>16. New server, source code, and developer support</h2>
            <p>
              Moving host or rebuilding after a total crash is a <strong>developer task</strong>, with sanctuary
              staff providing the latest admin ZIP. The GitHub repository holds the website code (design and
              application). Live news, translations, and uploaded photos live in the database and the backup ZIP
              — a git clone alone is not a content backup.
            </p>

            <h3>What the new server needs</h3>
            <table>
              <thead>
                <tr>
                  <th>Requirement</th>
                  <th>Minimum / note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account ownership</td>
                  <td>Hosting and domain in the name of the Diocese / Shrine</td>
                </tr>
                <tr>
                  <td>PHP</td>
                  <td>8.1 or newer, with zip, GD (images), OpenSSL, Mbstring, JSON, Fileinfo</td>
                </tr>
                <tr>
                  <td>Database</td>
                  <td>MySQL 5.7+ / 8.x or MariaDB</td>
                </tr>
                <tr>
                  <td>Web server</td>
                  <td>Nginx or Apache with HTTPS (Let’s Encrypt or host SSL)</td>
                </tr>
                <tr>
                  <td>Composer</td>
                  <td>Required on the server to install the Laravel (PHP) application</td>
                </tr>
                <tr>
                  <td>Node.js &amp; npm</td>
                  <td>
                    Needed to <em>build</em> the React public site and admin. The live server does{' '}
                    <strong>not</strong> need Node if the developer builds on a laptop and deploys the compiled
                    files (the usual production method). Node is required on a machine that runs{' '}
                    <code>npm run build</code> or <code>./deploy/build-local.sh</code>.
                  </td>
                </tr>
                <tr>
                  <td>Git / GitHub</td>
                  <td>SSH or Git to pull the source. The developer can grant repository access.</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>SMTP or an API (e.g. Resend) so enquiry notifications can send</td>
                </tr>
                <tr>
                  <td>Disk</td>
                  <td>Room for the application plus the media library (photos and PDFs grow over time)</td>
                </tr>
              </tbody>
            </table>

            <h3>Artisan commands the developer uses</h3>
            <p>
              Laravel is driven from the <code>backend/</code> folder with <code>php artisan …</code>. Staff
              do not need these day to day; they matter on a new server or a restore.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Command</th>
                  <th>When it is used</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>php artisan key:generate</code>
                  </td>
                  <td>First setup of a new server (creates <code>APP_KEY</code> in <code>.env</code>)</td>
                </tr>
                <tr>
                  <td>
                    <code>php artisan migrate</code>
                  </td>
                  <td>
                    Create or update database tables. Do <strong>not</strong> run{' '}
                    <code>migrate:fresh --seed</code> on a live restore — that wipes content.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>php artisan storage:link</code>
                  </td>
                  <td>Makes uploaded photos and PDFs visible at <code>/storage/…</code></td>
                </tr>
                <tr>
                  <td>
                    <code>php artisan site:backup</code>
                  </td>
                  <td>Writes a full ZIP on the server (same contents as Admin → Backup &amp; restore)</td>
                </tr>
                <tr>
                  <td>
                    <code>php artisan site:restore /path/to/backup.zip</code>
                  </td>
                  <td>Restores that ZIP when the file is too large to upload in the browser</td>
                </tr>
                <tr>
                  <td>
                    <code>./deploy/deploy.sh</code>
                  </td>
                  <td>On the droplet: git pull, Composer, migrate, copy public images (no Node required)</td>
                </tr>
              </tbody>
            </table>
            <p>
              Typical move: clone the GitHub repository → configure <code>.env</code> → Composer → migrate →
              restore the admin ZIP → <code>storage:link</code> → point the domain DNS at the new host. The
              domain registrar is independent of DigitalOcean.
            </p>

            <h3>GitHub source code and help from Ireme Tech</h3>
            <ul>
              <li>
                The developer can <strong>share access to the source code on GitHub</strong> with Diocese IT
                (organisation or invited accounts), so the Shrine is not locked to one laptop.
              </li>
              <li>
                Ireme Tech remains <strong>available to help with migrating, backups, restores, and DigitalOcean
                snapshots</strong> — including turning on droplet backups, testing a restore, or moving to
                another host.
              </li>
              <li>
                Day-to-day publishing (pages, news, photos, languages) stays in <code>/admin</code> and does
                not require GitHub.
              </li>
            </ul>
            <p>
              Contact:{' '}
              <a href="https://iremetech.com" target="_blank" rel="noreferrer">
                iremetech.com
              </a>
              .
            </p>
          </section>

          <section id="checklist">
            <h2>17. Non-technical demonstration checklist</h2>
            <p>Use this list during Diocese evaluation sessions:</p>
            <ol>
              <li>Create and edit a page (including a layout block)</li>
              <li>Copy a page into another language with <strong>Copy from default</strong>, then Save</li>
              <li>Switch the public language switcher and confirm the translation</li>
              <li>Publish a news article with at least two language tabs</li>
              <li>Update a menu</li>
              <li>Replace an image</li>
              <li>Upload a document (PDF)</li>
              <li>Change a short UI label in <strong>Translations</strong> and Save translations</li>
              <li>Create a user (authorised account)</li>
              <li>Download a backup from Admin → Backup &amp; restore (store it off the server)</li>
            </ol>
            <p>
              Related reading:{' '}
              <a href="/docs/proposed-solution">Proposed solution — functional &amp; technical description</a>.
            </p>
          </section>

          <section id="future">
            <h2>18. Future upgrades — recommendations</h2>
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
              Adding ordinary pages within existing pillars, publishing news, updating schedules, filling
              language tabs, and translating existing fields are normal operations—not paid upgrades—once
              staff are trained.
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
