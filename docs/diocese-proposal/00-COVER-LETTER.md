# Cover letter — Response to the request for detailed website documentation

**To:** Diocese of Gikongoro / Shrine of Our Lady of Kibeho  
**From:** [FILL — Ireme Tech legal name]  
**Date:** [FILL]  
**Re:** Detailed description of the proposed system (flexibility in practice)

Dear [FILL — title / name],

Thank you for your clear request. We agree that “flexibility” must be defined in practice: who can change what, what is included now, what comes later, what it costs over five years, and who owns the result.

This pack answers each point you listed. It is based on the system already under construction for the Shrine of Our Lady of Kibeho, aligned with the Diocese Terms of Reference (six content pillars).

## Why we propose a dedicated platform rather than WordPress

WordPress is familiar and works well for many parish sites. For this project we recommend a **dedicated React + Laravel CMS** because:

1. **The information architecture is fixed by the ToR** (Our Lady, Shrine, Pilgrimage, Spirituality, News, Support). A custom admin mirrors those pillars (mass schedules, pilgrim calendar, churches, apparition sites, accommodations, support projects, translations, pilgrim enquiries) instead of forcing them into generic “posts and pages.”
2. **React.js for interactive users and loading speed** — after the first load, the site updates language, menus, lists, and admin forms without full page reloads, which feels faster on mobile networks and supports a modern pilgrim experience.
3. **Laravel API for future connections** — a proper API is how websites today connect to **payment gateways**, **members / friends management**, CRM, mailing tools, and other Diocese systems without rebuilding the front end.
4. **Multilingual is designed in from the start** (Kinyarwanda, French, English, German), with UI labels and long-form content managed separately, and room for additional languages later.
5. **Ownership and portability** — hosting and domains are registered **under the Diocese/Shrine name**; the full source code and database belong to you; you are not locked to a proprietary theme marketplace or a single plugin vendor.
6. **Hosting on your existing infrastructure** — the application runs on standard PHP + MySQL hosting (shared or dedicated) when Git/SSH (or an agreed deploy process) is available.
7. **Backup resilience** — server-side backups **plus** a documented manual export of the full database (and media) so the site can be restored or moved even if automated backup fails.
8. **Handover** — source code repository, administrator accounts, and a written admin user guide are part of delivery—not an afterthought.

**Flexibility in practice** means: shrine staff publish and update content in the admin panel without a developer; structure, new languages, new modules (including payments and membership via the API), and security updates are planned as scoped work with clear costs.

We remain available for a live demonstration with non-technical staff and for any clarification before you confirm the approach.

Respectfully,  
[FILL — name, title, contact]
