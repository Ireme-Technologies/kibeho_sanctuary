export default function GuideOfferings() {
  return (
    <div>
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
    </div>
  )
}
