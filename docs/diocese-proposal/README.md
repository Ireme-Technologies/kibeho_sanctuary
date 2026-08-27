# Diocese of Gikongoro — Technical proposal pack

Prepared for: **Diocese of Gikongoro / Shrine of Our Lady of Kibeho**  
Prepared by: **Ireme Tech**  
Subject: Detailed website documentation requested before confirmation of the technical approach

## Live demo URLs (demo.iremetech.com)

Share these with the Diocese evaluation committee:

| Purpose | URL |
|---------|-----|
| **Start here — documentation hub** | `https://demo.iremetech.com/docs` |
| Proposed solution (detailed) | `https://demo.iremetech.com/docs/proposed-solution` |
| Sitemap & admin user guide | `https://demo.iremetech.com/docs/sitemap-and-admin-guide` |
| Server requirements (IT / handover) | `https://demo.iremetech.com/docs/server-requirements` |
| Public website demo | `https://demo.iremetech.com/` |
| CMS admin login | `https://demo.iremetech.com/admin/login` |
| Download — proposed solution | `https://demo.iremetech.com/evaluation-downloads/proposed-solution.md` |
| Download — sitemap & admin guide | `https://demo.iremetech.com/evaluation-downloads/sitemap-and-admin-guide.md` |
| Download — server requirements | `https://demo.iremetech.com/evaluation-downloads/server-requirements.md` |

**Demo admin:** `admin@kibeho.org` / `KibehoAdmin@202!`  

**Content note:** Demo text and images are provisional and will be updated as official content is provided.

On each document page, **Print / Save as PDF** is available in the toolbar (A4 margins ~18–20&nbsp;mm).

## How to use this pack (internal Markdown)

| File | Maps to Diocese request |
|------|-------------------------|
| [00-COVER-LETTER.md](./00-COVER-LETTER.md) | Cover reply + positioning vs WordPress |
| [01-FUNCTIONAL-REQUIREMENTS.md](./01-FUNCTIONAL-REQUIREMENTS.md) | Functional requirements (current vs later phase) |
| [02-SITEMAP.md](./02-SITEMAP.md) | Complete sitemap & content types |
| [03-CMS-AND-DEMO-GUIDE.md](./03-CMS-AND-DEMO-GUIDE.md) | CMS description + non-technical demo checklist |
| [04-MULTILINGUAL-CONCEPT.md](./04-MULTILINGUAL-CONCEPT.md) | Multilingual concept (RW / FR / EN / DE + future) |
| [05-TECHNICAL-ARCHITECTURE.md](./05-TECHNICAL-ARCHITECTURE.md) | Architecture, hosting, security, backups |
| [06-SELF-SERVICE-VS-DEVELOPER.md](./06-SELF-SERVICE-VS-DEVELOPER.md) | What staff can do alone vs with a developer |
| [07-SCOPE-SCHEDULE-ACCEPTANCE.md](./07-SCOPE-SCHEDULE-ACCEPTANCE.md) | Scope, milestones, acceptance criteria |
| [08-FINANCIAL-QUOTATION.md](./08-FINANCIAL-QUOTATION.md) | Quotation template (fill amounts before send) |
| [09-OWNERSHIP-HANDOVER.md](./09-OWNERSHIP-HANDOVER.md) | Ownership, accounts, source code, handover |
| Live docs: Server requirements | `https://demo.iremetech.com/docs/server-requirements` (Git/SSH — not FTP; React + Node.js hosting checklist) |
| [10-REFERENCES.md](./10-REFERENCES.md) | References (fill with real client sites) |

## Before sending to the Diocese

1. Replace all `[TO CONFIRM]` / `[FILL]` markers in commercial annexes (especially **prices**, **dates**, **references**).
2. Create Diocese-owned demo admin accounts (do not send development seed passwords).
3. Point reviewers to **`/docs` first**, then live site + admin.

## Proposed stack (summary)

| Layer | Choice |
|-------|--------|
| Public website | React (Vite) |
| Administration panel | Same application (`/admin`) |
| API & business logic | Node.js application services (React front end) |
| Database | MySQL |
| Hosting | Existing Diocese/Shrine hosting account (vhost / VPS with SSH) **in the client’s name** |
| Ownership | Domains, hosting, source code, database, and admin accounts belong to the Diocese |
