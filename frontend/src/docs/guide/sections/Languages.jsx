import styles from '../../DocsLayout.module.css'

export default function GuideLanguages() {
  return (
    <div>
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
    </div>
  )
}
