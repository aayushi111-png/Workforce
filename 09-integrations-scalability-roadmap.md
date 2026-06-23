# 09 · Integrations, Scalability, Roadmap

## Integrations

WOP is a **standalone system** — it does not integrate with, call, or automate anything in external systems. The access checklist and notifications are the entire "integration":

| System | Connection | Who acts | How it works |
|---|---|---|---|
| **Zoho Recruit** | None | Senior HR | An offer is signed in Zoho. HR manually enters the worker into WOP (name, email, worker type, etc.). No API, no sync. |
| **Google Workspace** | None | IT person | IT creates the account in Google admin console (rohan@katbotz.com). IT returns to WOP and ticks ☑ Done. WOP stores only the email, not any data from Google. |
| **GitHub** | None | IT person | IT adds the user to the KATBOTZ org in GitHub settings. IT returns to WOP and ticks ☑ Done. WOP stores only the username, not any data from GitHub. |
| **Slack** | None | IT person | IT adds the user to the KATBOTZ workspace in Slack admin. IT returns to WOP and ticks ☑ Done. WOP stores only the Slack ID, not any data from Slack. |
| **Gusto** | None | HR | US workers' payroll is handled in Gusto independently. WOP has a "worker_type: global_employee" flag. That's it. No data exchange. |
| **SendGrid** | Email only | System | SendGrid is called directly from FastAPI when 5 specific events occur (document rejected, worker activated, doc overdue, contract expiring, review due). No other data is sent. |

**What WOP does NOT do:**
- ✗ Create accounts in Google Workspace, GitHub, or Slack
- ✗ Call Google Workspace API to provision users
- ✗ Call GitHub API to add team members
- ✗ Call Slack API to invite users
- ✗ Sync data with Zoho, Gusto, or any other system
- ✗ Push or pull worker data from any external system
- ✗ Automate any provisioning or deprovisioning

**What WOP DOES:**
- ✓ Records that IT created accounts manually
- ✓ Shows a checklist of required systems per worker type
- ✓ Sends 5 automated emails (via SendGrid) at key moments
- ✓ Stores documents as files (not processed)
- ✓ Tracks verification status (Pending / Verified / Rejected)
- ✓ Tracks access checklist status (Pending / Done / Revoked)

> **Design principle:** WOP is the system of record. It does not automate external systems. It records what humans did manually in other systems.

---

## Scalability

| Stage | Workers |
|-------|---------|
| Today | 100 |
| Expected | 500, then 1,000, then 5,000 plus |

The architecture supports growth **without redesign**:

- Multi location workforce
- Multiple departments
- Multiple business units
- Additional worker types

This holds because the stack is serverless and pay per use (Firestore, Cloud Storage, and Cloud Run all scale on demand), and because worker type and role are configuration, not hard coded paths. Adding a fifth worker type is a checklist and a permission row, not a rewrite.

---

## Roadmap

Solo vibe coding, 4 to 5 hours a day, 5 days a week, starting July 1. All 12 modules ship in one build. No phases.

| Milestone | Target |
|---|---|
| Build complete — all 12 modules working | August 15, 2026 |
| Test week — HR dry run, bug fixes | August 18 – 22, 2026 |
| **Handover to KATBOTZ** | **August 22, 2026** |
| **Live use begins — Sheets retired** | **September 1, 2026** |

---

## Decisions: confirmed and open

| Decision | Status |
|---|---|
| Build custom over buy | Confirmed — custom build on Google Cloud |
| Four worker types (Indian employee, Indian contractor, global contractor, global intern) | Confirmed |
| HR Executive reviews and flags only — activation reserved for Senior HR | Confirmed |
| Founder access: read plus reports | Confirmed |
| Aadhaar: document image in locked bucket, number never stored anywhere | Confirmed |
| Verification: manual only — Senior HR reviews visually, no automated KYC | Confirmed |
| REST backend via FastAPI | Confirmed |
| WOP hosted at workforce.katbotz.com | Confirmed |
| Firestore: sub collections per worker + top-level for cross-cutting queries | Confirmed |
| Search: filter plus prefix match at launch | Confirmed |
| Cadence: 5 days a week, 4 to 5 hours a day, solo build | Confirmed |
| Notifications: email only via SendGrid — 5 triggers, no Slack bots or schedulers | Confirmed |
| Access management: manual checklist, no automated provisioning | Confirmed |
| **Retention period** | **Needs confirmation — assumed 3 years after archival, confirm with legal** |
| **katbotz.com tech stack** | **Needs confirmation — required to set up the subdomain DNS record** |

Full decision log is in [00 Proposal and Approval](00-proposal-and-approval.md), Section 10.

---

## Next steps to start the build

1. Settle the Aadhaar and DPDP approach before week 1 — it determines what the document checklist can store.
2. Confirm worker types, document checklists and the role permission matrix with HR.
3. Confirm manual verification at launch (Decision #14 — already the default).
4. Start week 1: scaffold, auth, deploy to Cloud Run.
5. Aim for handover by August 22 and real onboardings on WOP from September 1. Sheets retired on that date.
