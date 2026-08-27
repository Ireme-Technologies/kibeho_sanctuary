import DocsAuditPanel from '../../DocsAuditPanel'

export default function GuideAudit() {
  return (
    <div>
      <h2>2. CMS audit &amp; readiness</h2>
                  <p>
                    The audit is a content report, not a technical test. Official page copy is seeded; photos are
                    left empty so the site uses the default header until you upload real images. Click any critical
                    item to open the editor.
                  </p>
                  <DocsAuditPanel />
    </div>
  )
}
