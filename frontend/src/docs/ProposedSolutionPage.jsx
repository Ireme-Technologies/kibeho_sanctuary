import styles from './DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav, DocsToc } from './DocsChrome'

const TOC = [
  { href: '#purpose', label: 'Purpose of this document' },
  { href: '#why-not-wordpress', label: 'Why not WordPress' },
  { href: '#why-react-laravel', label: 'Why React & Laravel API' },
  { href: '#functional', label: 'Functional requirements' },
  { href: '#multilingual', label: 'Multilingual concept' },
  { href: '#architecture', label: 'Technical architecture' },
  { href: '#security-backup', label: 'Security & backups' },
  { href: '#self-service', label: 'Self-service vs developer' },
  { href: '#scope', label: 'Scope, schedule & acceptance' },
  { href: '#ownership', label: 'Ownership & handover' },
  { href: '#related', label: 'Related documents & demo' },
]

export default function ProposedSolutionPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Document 1 of 2</p>
        <h1>Proposed solution — detailed system description</h1>
        <p className={styles.lede}>
          Written response to the Diocese request for precise documentation before confirming the technical
          approach. Explains what “flexibility” means in practice for administration, development, costs,
          and long-term ownership.
        </p>
      </div>

      <DocsToolbar
        downloadHref="/evaluation-downloads/proposed-solution.md"
        downloadLabel="Download proposed solution (.md)"
      />

      <div className={styles.layout}>
        <DocsToc items={TOC} />
        <article className={styles.article}>
          <section id="purpose">
            <h2>1. Purpose of this document</h2>
            <p>
              The Diocese asked for a clear shared understanding of requirements, responsibilities, costs,
              and sustainability—before continuing development. This document describes the system already
              built for the Shrine of Our Lady of Kibeho (six-pillar Terms of Reference) using a dedicated
              React + Laravel CMS hosted on infrastructure registered in the client’s name.
            </p>
            <p>
              <strong>Demo content note:</strong> Text and images shown on the live demo are provisional.
              They will be updated as official content and media become available from the Diocese / Shrine.
              Reviewers should focus on structure, CMS usability, and multilingual workflows.
            </p>
            <p>
              Companion document:{' '}
              <a href="/docs/sitemap-and-admin-guide">Sitemap &amp; administrator user guide</a> (how staff
              operate the site day to day, plus future upgrade recommendations). Demo admin login:{' '}
              <a href="/admin/login">/admin/login</a> — <code>admin@kibeho.org</code> /{' '}
              <code>KibehoAdmin@202!</code>.
            </p>
          </section>

          <section id="why-not-wordpress">
            <h2>2. Why this solution instead of WordPress</h2>
            <p>
              WordPress is familiar and suitable for many parish sites. For this project we propose a
              purpose-built platform because:
            </p>
            <ul>
              <li>
                The information architecture is fixed by the ToR (Our Lady, Shrine, Pilgrimage, Spirituality,
                News, Support). The admin mirrors those pillars—mass schedules, pilgrimage events, churches,
                apparition sites, accommodations, development projects, translations, pilgrim enquiries—rather
                than forcing them into generic “posts and pages.”
              </li>
              <li>
                <strong>React.js</strong> gives interactive users a faster experience: language, menus, and
                forms update without full page reloads—better perceived loading speed on mobile.
              </li>
              <li>
                A <strong>Laravel API</strong> is built for today’s needs: connecting later to payment
                gateways, members management, and other Diocese/external services without rebuilding the site.
              </li>
              <li>
                Multilingual (Kinyarwanda, French, English, German) is designed in from the start, with room
                for more languages later.
              </li>
              <li>
                Domains, hosting, source code, and database belong to the Diocese/Shrine—not a theme
                marketplace lock-in.
              </li>
              <li>
                Runs on existing shared or dedicated hosting (PHP + MySQL) when Git/SSH or an agreed deploy
                path is available—the same class of hosting WordPress uses.
              </li>
              <li>
                Dual backup: DigitalOcean snapshots (configured by the web developer) plus an admin ZIP that
                staff can download and keep off the server, so the site can be moved even if the host fails.
              </li>
              <li>
                Non-technical staff still publish through a visual admin panel (forms, language tabs, Save)—no
                coding for daily work.
              </li>
            </ul>
          </section>

          <section id="why-react-laravel">
            <h2>3. Why React.js and a Laravel API</h2>
            <h3>React.js — interactive experience and loading speed</h3>
            <p>
              The public website and the administration panel are built with <strong>React.js</strong>. This
              choice supports pilgrims, staff, and committee reviewers who need a responsive, modern interface:
            </p>
            <ul>
              <li>
                <strong>Faster perceived loading:</strong> after the first load, React updates only the parts
                of the page that change (language switch, menus, news lists, admin forms) instead of reloading
                the whole site for every click—important on mobile networks.
              </li>
              <li>
                <strong>Smooth interactivity:</strong> language switcher, galleries, calendars, enquiry forms,
                and the CMS itself feel immediate—filters, tabs, and rich-text editing without full page
                refreshes.
              </li>
              <li>
                <strong>One shared interface stack:</strong> visitors and editors use the same modern UI
                foundation, so the admin panel is not a separate outdated “backend theme.”
              </li>
              <li>
                <strong>Production build optimisation:</strong> Vite produces compressed assets so the shrine
                site stays lean for international visitors.
              </li>
            </ul>
            <h3>Laravel API — ready for external services</h3>
            <p>
              Content and business logic run through a <strong>Laravel API</strong> (PHP). A clean API layer
              is what organisations need today when the website must talk to other systems—not only display
              pages:
            </p>
            <ul>
              <li>
                <strong>Payment gateways</strong> (card, mobile money) can be connected later without rebuilding
                the public site—donation flows call the API securely.
              </li>
              <li>
                <strong>Members / friends of the Shrine management</strong>, CRM, or mailing tools can integrate
                via the same API pattern.
              </li>
              <li>
                <strong>Email, WhatsApp handoff, maps, and YouTube</strong> already follow this model; future
                parish or Diocese systems can plug in the same way.
              </li>
              <li>
                <strong>Mobile apps or partner portals</strong> (if ever required) can reuse the API instead of
                duplicating content.
              </li>
            </ul>
            <p>
              In short: <strong>React</strong> serves interactive users quickly; <strong>Laravel</strong>
              exposes a durable API so the Shrine can grow into payments, membership, and other external
              services when the Diocese is ready—without locking the project into WordPress plugins that are
              hard to control long term.
            </p>
          </section>

          <section id="functional">
            <h2>4. Functional requirements — Phase 1 vs later</h2>
            <h3>3.1 Included in the current project (Phase 1)</h3>
            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Functions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Public site</td>
                  <td>
                    Six-pillar IA; responsive pages; home composition; CMS informational pages; news with
                    categories; gallery; videos; mass schedule; pilgrimage events; churches &amp; apparition
                    sites; accommodations; development projects; testimonials; contact &amp; pilgrim enquiries;
                    language switcher (RW/FR/EN/DE); legacy URL redirects
                  </td>
                </tr>
                <tr>
                  <td>Administration</td>
                  <td>
                    Secure login; dashboard; pages &amp; blocks; news; menus; media/documents; translations;
                    mass schedules; calendar; directories; pilgrimage services &amp; experiences; videos; home
                    hero; settings/theme; enquiries; users (authorised); account/password
                  </td>
                </tr>
                <tr>
                  <td>Multilingual</td>
                  <td>
                    Four languages; configurable default; UI dictionary; per-record content tabs; fallback
                    chain
                  </td>
                </tr>
                <tr>
                  <td>Hosting &amp; ownership</td>
                  <td>
                    Client-named hosting &amp; domain; source repository handover; admin guide; server backup
                    enablement; manual DB/media export procedure
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>3.2 Planned only for a later phase (optional / quoted separately)</h3>
            <ul>
              <li>Full pilgrim self-service portal (track own enquiries online)</li>
              <li>Fine-grained permissions (module-level editor vs admin)</li>
              <li>Online payment gateway (card / mobile money donations)</li>
              <li>Newsletter integration, live chat, advanced site search</li>
              <li>Automated machine translation (not recommended for liturgical texts)</li>
              <li>Additional languages beyond RW/FR/EN/DE (architecture ready; content work required)</li>
              <li>Automated off-site backup to Diocese cloud drive</li>
              <li>Public commenting on news; formal WCAG certification package</li>
              <li>Extra training workshops beyond handover demo + PDF guide</li>
            </ul>

            <h3>3.3 Explicit exclusions unless change-requested</h3>
            <ul>
              <li>Rewriting Diocese email, accounting, or parish management systems</li>
              <li>Writing all pastoral content / official translations (Diocese provides; we structure &amp; train)</li>
              <li>24/7 on-call without a support contract</li>
              <li>Unlimited redesigns after final acceptance</li>
            </ul>
          </section>

          <section id="multilingual">
            <h2>5. Multilingual concept</h2>
            <p>
              Languages in Phase 1: <strong>Kinyarwanda</strong>, <strong>French</strong>,{' '}
              <strong>English</strong>, <strong>German</strong>.
            </p>
            <h3>Two layers</h3>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>What</th>
                  <th>Where staff edit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>UI dictionary</td>
                  <td>Buttons, short labels (Donate, Contact)</td>
                  <td>
                    Admin → <strong>Translations</strong> only — then Save translations
                  </td>
                </tr>
                <tr>
                  <td>Editorial content</td>
                  <td>Page titles, bodies, layout blocks, news, schedules</td>
                  <td>
                    Blue <strong>Content language</strong> bar on each form. Finish the default language,
                    then Copy from default and translate. Language tabs appear after Edit, not on the list.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Empty fields fall back to the default language, then English — that is expected until the
              language tab is filled and saved. Visitor language choice is remembered in the browser. Adding a
              future language is configuration + translation entry—not a full rebuild. Official prayers and
              episcopal texts must come from approved Diocese sources; the CMS stores and displays them.
              Step-by-step staff instructions:{' '}
              <a href="/docs/sitemap-and-admin-guide#languages">Best way to manage languages</a>.
            </p>
          </section>

          <section id="architecture">
            <h2>6. Technical architecture</h2>
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Technology</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Public website &amp; admin UI</td>
                  <td>
                    React 18 (Vite) — interactive experience and fast updates after first load
                  </td>
                </tr>
                <tr>
                  <td>API &amp; business logic</td>
                  <td>
                    Laravel (PHP 8.1+) — CMS plus API ready for payments, members, and other services
                  </td>
                </tr>
                <tr>
                  <td>Database</td>
                  <td>MySQL</td>
                </tr>
                <tr>
                  <td>Authentication</td>
                  <td>Laravel Sanctum (secure session for admin)</td>
                </tr>
                <tr>
                  <td>Rich text</td>
                  <td>TipTap editor</td>
                </tr>
                <tr>
                  <td>Email notifications</td>
                  <td>SMTP / transactional provider (e.g. Resend)</td>
                </tr>
                <tr>
                  <td>WhatsApp</td>
                  <td>Official wa.me deep links (no paid bot required)</td>
                </tr>
                <tr>
                  <td>Video</td>
                  <td>YouTube embeds</td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>React</strong> delivers a smooth public site and admin for interactive users;
              <strong> Laravel</strong> exposes the API that modern shrines need to connect payment gateways,
              membership tools, and other Diocese systems later—without rebuilding the whole website.
              Production is a single deployable app: the React build is served from Laravel’s public folder
              on one client-owned hosting account (Nginx or Apache + HTTPS).
            </p>
            <h3>Hosting requirements</h3>
            <ul>
              <li>Account ownership in the name of the Diocese / Shrine</li>
              <li>PHP 8.1+ with standard extensions; MySQL; HTTPS</li>
              <li>Git/SSH preferred, or build-then-upload workflow</li>
              <li>Disk capacity for media growth (photos, PDFs)</li>
            </ul>
          </section>

          <section id="security-backup">
            <h2>7. Security and backup concept</h2>
            <h3>Security</h3>
            <ul>
              <li>HTTPS mandatory in production</li>
              <li>Admin changes require authenticated session + CSRF protection</li>
              <li>CORS locked to official site URL(s)</li>
              <li>Secrets in server environment files—not in the public repository</li>
              <li>Authenticated media uploads; password hashing; role model (admin / editor)</li>
              <li>Framework updates under maintenance agreement</li>
            </ul>
            <h3>Backups (two options)</h3>
            <ol>
              <li>
                <strong>DigitalOcean server backup (web developer):</strong> droplet snapshots in the hosting
                panel. Ireme Tech configures and checks this. It restores the whole server quickly while the
                DigitalOcean account still exists — it is not a file the Diocese can take to another company.
              </li>
              <li>
                <strong>Admin ZIP (sanctuary staff):</strong> Administrators download a full content + media
                backup from <strong>Admin → Backup &amp; restore</strong> and store it off the server (Diocese
                computer or Drive). The same page restores the ZIP on this or a new host. See the{' '}
                <a href="/docs/sitemap-and-admin-guide#backup">administrator user guide — Backups</a>.
              </li>
              <li>
                <strong>Recovery / migration:</strong> re-provision hosting, clone the GitHub repository
                (access can be shared with Diocese IT), import the latest admin ZIP, reconnect SSL and DNS.
                Node is used to build the frontend; the live server can run without Node if the developer
                deploys compiled files. Ireme Tech is available to help with migrating or backups.
              </li>
            </ol>
          </section>

          <section id="self-service">
            <h2>8. What the Diocese can do alone vs with a developer</h2>
            <h3>Staff can do independently (after training)</h3>
            <p>
              Edit pages; publish news; change menus; upload/replace images and PDFs; manage translations;
              update mass schedules and pilgrimage events; maintain churches, sites, accommodations, development projects,
              testimonials, videos; update home hero and contact details; handle pilgrim enquiries; create
              users (authorised managers); change passwords; download a content backup ZIP from{' '}
              <strong>Backup &amp; restore</strong> and keep it off the server.
            </p>
            <h3>Needs a developer</h3>
            <p>
              New modules (shop, booking engine, payment gateway); major redesign; enabling a brand-new
              language code; hosting/DNS emergencies; security patches; bulk migration from another CMS;
              application bug fixes; advanced SEO/CDN engineering; DigitalOcean droplet snapshots; moving the
              site to a new server (GitHub, Node build, Artisan, restore). Ireme Tech can share GitHub access
              and help with migrating or backups when asked.
            </p>
            <p>
              <strong>Rule of thumb:</strong> text, image, PDF, date, menu link, or translation of existing
              fields → admin panel. New behaviour or layout type → developer / change request.
            </p>
          </section>

          <section id="scope">
            <h2>9. Project scope, milestones, and acceptance</h2>
            <h3>Included services (Phase 1)</h3>
            <ul>
              <li>IA alignment, public site + CMS, multilingual foundation, forms &amp; enquiries</li>
              <li>Deploy on client-owned hosting; staging recommended</li>
              <li>Live demo/training; administrator user guide; repository handover</li>
              <li>Backup procedures (DigitalOcean snapshots by the developer + admin ZIP for staff)</li>
              <li>Warranty window for bugs in delivered scope (duration as per quotation)</li>
            </ul>
            <h3>Acceptance criteria (website considered complete)</h3>
            <ol>
              <li>Agreed Phase 1 sitemap pages resolve without critical errors</li>
              <li>
                Non-technical staff can complete the admin demo checklist (page, news, menu, image,
                document, translations, users)
              </li>
              <li>Language switcher offers RW/FR/EN/DE with working fallback</li>
              <li>Site runs on client-owned hosting with HTTPS</li>
              <li>Domain, hosting, admin, Git, and a sample DB export are under Diocese control</li>
              <li>Admin guide + backup procedure delivered</li>
              <li>No open critical/high UAT defects</li>
              <li>Agreed training/demo completed or waived in writing</li>
            </ol>
            <p>
              Full translation of every page may continue after technical acceptance and is tracked
              separately unless content-entry was purchased.
            </p>
            <p>
              Financial quotation (initial + five-year outlook) is provided as a separate commercial annex by
              Ireme Tech—not published in this public demo document.
            </p>
          </section>

          <section id="ownership">
            <h2>10. Ownership and handover</h2>
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Domain(s), hosting, SSL</td>
                  <td>Diocese / Shrine</td>
                </tr>
                <tr>
                  <td>Source code repository</td>
                  <td>Diocese / Shrine</td>
                </tr>
                <tr>
                  <td>Database &amp; media</td>
                  <td>Diocese / Shrine</td>
                </tr>
                <tr>
                  <td>Administrator accounts</td>
                  <td>Diocese emails; developer access only by invitation</td>
                </tr>
                <tr>
                  <td>Documentation</td>
                  <td>Delivered to Diocese</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="related">
            <h2>11. Related links on this demo</h2>
            <ul>
              <li>
                <a href="/docs">Documentation hub</a>
              </li>
              <li>
                <a href="/docs/sitemap-and-admin-guide">Sitemap &amp; admin user guide</a>
              </li>
              <li>
                <a href="/" target="_blank" rel="noreferrer">
                  Live public demo
                </a>
              </li>
              <li>
                <a href="/admin/login" target="_blank" rel="noreferrer">
                  Administration panel
                </a>
              </li>
            </ul>
          </section>

          <DocsCrossNav
            prev={{ to: '/docs', label: 'Documentation hub' }}
            next={{ to: '/docs/sitemap-and-admin-guide', label: 'Sitemap & admin guide' }}
          />
        </article>
      </div>
    </div>
  )
}
