# 09 · Integrations, Scalability, Roadmap

## Integrations

WOP does not automate account creation or provisioning in any external system. That is intentional — the access checklist in M5 gives HR full visibility and control without WOP needing API access to Google, GitHub, or Slack. The integrations below describe how WOP relates to each system today and always.

| System | How WOP relates to it |
|---|---|
| Zoho Recruit | HR manually creates the worker in WOP after an offer is accepted in Zoho. No API connection. |
| Google Workspace | Google OAuth is used for sign-in only. Account creation in Google Workspace is done manually by IT and ticked off in WOP's access checklist. |
| GitHub | GitHub team access is tracked as a checklist item. Assignment is done manually by IT and marked done in WOP. |
| Slack | Slack access is tracked as a checklist item. Done manually, marked in WOP. |
| Gusto | Reference only. WOP records that a US worker exists; Gusto handles their payroll independently. |

> **The principle:** WOP tracks what happened. Humans do the provisioning. The checklist is the record.

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
