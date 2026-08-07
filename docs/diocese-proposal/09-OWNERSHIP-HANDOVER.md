# 9. Ownership and handover

## 9.1 Principle

**The Diocese / Shrine owns the digital assets.** Ireme Tech builds and transfers; we do not retain the domain, hosting account, or source code as product lock-in.

---

## 9.2 Ownership checklist

| Asset | Owner | At handover |
|-------|-------|-------------|
| Domain name(s) | Diocese / Shrine | Registrar account in client name; credentials transferred |
| Hosting account | Diocese / Shrine | Panel access in client name (shared or dedicated) |
| SSL certificate | Diocese / Shrine | Issued on client hosting |
| Source code | Diocese / Shrine | Git repository access or full archive + licence to use/modify |
| Database | Diocese / Shrine | Live DB on client host + sample full export delivered |
| Media files (images, PDFs) | Diocese / Shrine | On client storage + export guidance |
| Administrator accounts | Diocese / Shrine | Master accounts on Diocese emails; developer access removed or limited by agreement |
| Documentation | Diocese / Shrine | Admin user guide + architecture/backup notes |
| Third-party API keys | Diocese / Shrine | Created under client accounts where possible (email, maps) |

---

## 9.3 Source-code repository

- Full application: `frontend/` (React) + `backend/` (Laravel) + `deploy/`.  
- Delivered via GitHub/GitLab/Bitbucket **organisation owned by the Diocese**, or export ZIP + documented structure.  
- README covers local run, deploy, and environment variables (without production secrets in Git).

---

## 9.4 Administrator accounts

1. Create Diocese-owned super admin (e.g. `communications@[shrine-domain]`).  
2. Optional editor accounts for staff.  
3. Rotate any temporary developer passwords.  
4. Document password reset via agreed email.  
5. Confirm **Users** management policy (who may create accounts).

---

## 9.5 Backup handover package

Delivered at M7:

- [ ] Hosting backup feature enabled and documented  
- [ ] One successful **full database export** file provided to Diocese  
- [ ] Media backup instructions (and optional archive)  
- [ ] Restore test note (date, who witnessed)  
- [ ] Contacts for hosting support  

---

## 9.6 Handover meeting agenda

1. Live admin walkthrough (demo checklist)  
2. Credential transfer (domain, host, Git, admin, email API)  
3. Backup drill  
4. Support / warranty window reminder  
5. Sign acceptance certificate  

---

## 9.7 Post-handover access

Any ongoing developer access is **by Diocese invitation** under a support agreement, not by silent retention of ownership.
