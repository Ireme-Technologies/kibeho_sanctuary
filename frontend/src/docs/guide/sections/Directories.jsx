export default function GuideDirectories() {
  return (
    <div>
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
                    See <a href="/docs/sitemap-and-admin-guide/offerings">Offerings, candles, Mass, donations, and projects</a>.
                  </p>
                  <h3>Home hero</h3>
                  <p>
                    Update homepage slides, titles, supporting text, and call-to-action buttons. Use language tabs
                    for heading, caption, and button labels (Copy from default, then translate). Keep the first
                    viewport focused: brand, one headline, short support line, CTAs—avoid overcrowding.
                  </p>
    </div>
  )
}
