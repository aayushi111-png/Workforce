# 00 · PROPOSAL AND APPROVAL

| | |
|---|---|
| **Proposal** | Build the Workforce Operations Platform (WOP) for KATBOTZ |
| **From** | Aayushi Pandey |
| **To** | KATBOTZ |
| **Date** | June 2026 |
| **Decision required** | Approve the scope, the build plan, and the open decisions in Section 10 |

> This single document answers everything at a high level and points to the detailed docs for depth. Read it top to bottom, then sign off in Section 12.

---

## 1. What I am proposing:

Build WOP as a custom platform that becomes the operational system of record for every KATBOTZ worker.

```
Zoho Recruit  →  WOP  →  Gusto
   (hire)      (operate)  (US pay)
```

WOP owns everything from the moment an offer is accepted to the moment the record is deleted: onboarding, documents, verification, compliance, activation, access, the active workforce, contracts, reviews, assets, offboarding, reporting and notifications.

---

## 2. Why?

Today the non US workforce runs on Google Sheets, Drive, email and manual follow ups. That gives no single source of truth, no audit trail, missing documents, missed renewals, inconsistent offboarding and real compliance risk. The pain doubles every time headcount doubles.

WOP replaces all of that with one platform that tracks workers, stores documents, runs the lifecycle, holds compliance and shows analytics. Detail: [01 Executive Summary](01-executive-summary.md).

---

## 3. What gets built?

Twelve modules, grouped by job:

| Group | Modules |
|-------|---------|
| Bring them in | Worker Creation, Document Management |
| Check and activate | Verification, Compliance, Access Management |
| Run the workforce | Workforce Directory, Contracts, Performance, Assets |
| Exit and oversee | Offboarding, Notifications, Reporting |

Full detail: [05 Functional Modules](05-functional-modules.md). Worker types and scope: [02 Product Blueprint](02-product-blueprint.md).

### What WOP owns vs. what stays in other systems

| System | Responsibility | WOP's role |
|---|---|---|
| **WOP** | Worker lifecycle, documents, verification, access, contracts, reviews, assets, offboarding, reports | Source of truth for operations |
| **Zoho Recruit** | Hiring, offers, negotiations, candidate pipeline | WOP receives "offer accepted" → creates worker |
| **Gusto** | Payroll, tax, benefits, direct deposit | WOP stores Gusto ID for reference, links to Gusto for details |
| **Google Workspace** | Email, calendar, groups, account management | WOP tracks: "which accounts created?" Links to Workspace admin |
| **GitHub, Slack, etc.** | Team collaboration, code, chat | WOP tracks: "which teams assigned?" IT manages manually |

**Explicitly out of scope (not in WOP):**
- Payroll calculation → Gusto owns this
- Attendance/timesheets → Google Workspace APIs or external system
- Benefits enrollment → Gusto owns this
- Time tracking for contractors → Contractor manual entry in invoice form (M7)

This keeps WOP focused: worker lifecycle, documents, access, compliance. Not payroll, not HR analytics.

---

## 4. How will it be built?

**Frontend:** Next.js. <br>**Backend:** FastAPI (Python). <br>**Records:** Firestore. <br>**Files:** Cloud Storage. <br>**Email notifications:** SendGrid triggered from FastAPI. <br>**Auth:** Google OAuth plus role based access control. <br>**Hosting:** Cloud Run. One cloud, one backend language, one frontend framework.
<br>**Where data lives:** records in Firestore, files in Cloud Storage, and the record carries the pointer to the file. Nothing stays in Sheets or Drive. Detail: [07 Database Architecture](07-database-architecture.md).
<br>**Connected to katbotz.com:** WOP is the Workforce Portal, reached from the main site. Detail: [06 System Architecture](06-system-architecture.md).

---

## 5. Who sees what

Same application, a different system for every person who logs in.

| Role | Sees | Headline action |
|------|------|-----------------|
| Founder | Everything, read plus reports | Watches health and risk |
| Senior HR | All workers | The only role that activates |
| HR Executive | All workers, cannot activate | Reviews and flags documents |
| Team Lead | Their team only | Submits reviews |
| Employee | Themselves only | Uploads, signs, completes tasks |
| Contractor | Themselves only | Submits invoices |
| Intern | Themselves only | Learning and reviews |

Full experiences, per persona: [03 User Roles and Experiences](03-user-roles-and-experiences.md).

---

## 6. How I will build it (time)

Solo vibe coding, 4 to 5 hours a day, 5 days a week, starting July 1. All 12 modules ship by handover. No phases.

These are the target dates assuming work flows smoothly. **If debugging (file uploads, integrations, data migration) requires deeper work, the timeline flexes by 3–5 days**. The handover date adjusts accordingly, but the build stays solid — no crunch, no half-built features.

| Milestone | Target date |
|---|---|
| Build complete — all 12 modules working | August 15, 2026 (±3–5 days) |
| Test week — HR dry run, bug fixes | August 18 – 22, 2026 (±3–5 days) |
| **Handover to KATBOTZ** | **August 22, 2026 (±3–5 days flexible)** |
| **Live use begins — Sheets retired** | **September 1, 2026 (or Sept 4–8 if build extends)** |

Week by week plan: [10 Build Plan and Budget](10-build-plan-and-budget.md).

---

## 7. What it costs (cash)

**To build (8 weeks): ₹3,000–5,000**
- Cloud services: ₹0–1,000 (free tiers cover most of it)
- Claude AI subscription: ₹3,000–4,000 (only during build)

**To run live (ongoing):**
- 100–500 workers: ₹0–3,000/month (scales with active sessions, not headcount)
- 1,000–5,000+ workers: ₹3,000–15,000/month

No team cost — I build it solo. Post-launch maintenance (patches, monitoring response) is a separate optional retainer to confirm before go-live. Detail and line items: [10 Build Plan and Budget](10-build-plan-and-budget.md).

---

## 8. Security and compliance commitments

- Google sign in, role based access on every endpoint, a person reaches only what their role allows.
- Files encrypted at rest, served only through short lived signed URLs.
- An append only audit log on every sensitive action.
- DPDP Act 2023 respected, with the Aadhaar approach settled before document checklists are built.
- Daily Firestore exports to a backup bucket, GCS versioning on the documents bucket, and a tested restore run before go-live.

Detail: [08 Security and Compliance](08-security-and-compliance.md).

---

## 9. Assumptions

Stated plainly so there are no surprises later.

- Zoho Recruit and Gusto stay in place and are not replaced.
- The four worker types are the full set for launch.
- Google Cloud is the platform.
- katbotz.com is already owned and available for a subdomain.
- The existing workforce data in Sheets and Drive is clean enough to migrate.
- I am building this solo, 4 to 5 hours a day, starting July 1, 2026.
- Cloud figures are planning estimates pending a live bill.

---

## 10. Decisions: already made vs need your sign-off

Most design decisions are already locked in based on the discovery session and build requirements. This section separates what's decided from what needs your confirmation.

### Already Decided (locked in, no changes)

These are the architecture and design choices that shaped the entire platform. They are set.

| # | Decision | What I am building |
|---|----------|---|
| 1 | Build over buy | Custom build on Google Cloud (not Zoho People or similar HRMS) |
| 2 | Worker types | Four types only: Indian Employee, Indian Contractor, Global Contractor, Global Intern |
| 3 | Coding cadence | 5 days a week, 4 to 5 hours a day, solo build |
| 4 | Timeline | July 1 start, August 22 handover, September 1 live — no phases |
| 5 | Backend & database | FastAPI + Firestore + Cloud Storage, REST API, no GraphQL |
| 6 | Search | Filter + prefix match at launch, no full-text search yet |
| 7 | Verification | Manual only — Senior HR reviews documents visually, no automated KYC |
| 8 | HR Executive role | Review and flag only, cannot activate (Senior HR activates only) |
| 9 | Founder access | Read-only plus reports (cannot change anything) |
| 10 | Access Management | Manual checklist only — WOP records what IT created, never creates accounts |
| 11 | Notifications | Exactly 5 email triggers via SendGrid, nothing else (no Slack, SMS, calendar) |
| 12 | Aadhaar handling | Document image stored in locked bucket, number never extracted or stored |
| 13 | Database design | Sub-collections per worker + top-level collections for cross-cutting queries |
| 14 | Hosting | Cloud Run, subdomain on katbotz.com (e.g. workforce.katbotz.com) |

**On decision 1 — why build instead of buying:** the honest comparison is Zoho People (₹120–250/user/month for the features needed) or a similar HRMS. At 50 staff users that is ₹6,000–12,500/month with zero maintenance cost and a vendor who owns security patches. The case for building rests on three specifics that off-the-shelf tools handle poorly: <br>(a) four distinct worker types — Indian employee, foreign employee, contractor, intern — each with a different document checklist and compliance requirement; <br>(b) the Aadhaar handling decision is sensitive enough that a custom-built, locked bucket with no Aadhaar number ever typed into a field is cleaner than trusting a third-party HRMS's compliance posture; <br>(c) WOP is positioned as part of the katbotz.com product surface, which matters for the KATBOTZ brand and gives tighter control over the worker experience. If the document-type complexity were simpler, buying would win. It is not, so building is the right call — but this is a deliberate trade-off, not a default.

---

### Need your confirmation before July 1

These four are final blockers. Once you confirm, I start July 1 with no ambiguity.

| # | Decision | What I need confirmed |
|---|----------|---|
| **A** | Coding cadence | 5 days a week, 4 to 5 hours a day — yes or no? |
| **B** | Start date | July 1, 2026 — yes or no? |
| **C** | Live-use target | September 1, 2026 (with 3–5 day flex if needed) — yes or no? |
| **D** | Aadhaar approach | Image in locked bucket, number never stored — yes or no? |

---

### Need before go-live (Week 7–8)

These don't block the start, but they must be answered before September 1 launch.

| # | Decision | What I need from you |
|---|----------|---|
| **1** | Retention period | Confirm 3 years after archival with legal advisor. This affects deletion logic. |
| **2** | katbotz.com tech stack | What is katbotz.com built on? Who manages the DNS? Needed to point workforce.katbotz.com at Cloud Run. |

---

## 11. Risks and how I handle them

| Risk | Guard |
|------|-------|
| Scope creep | The week plan is the contract, new ideas go to a backlog |
| Burnout | 5 days a week — weekends off, that is what keeps an 8 week build alive |
| Aadhaar decision drags | Settle it in week 1, before M2 |
| Role experiences balloon | Build HR and Employee first, others are variations |
| Migration data messier than it looks | Inspect the real Sheets in week 1 |

---

## 12. Approval

Please tick or strike through what is being approved.

- [ ] **Scope** as in Sections 3 to 5
- [ ] **Stack and data design** as in Section 4
- [ ] **Build plan and timeline** as in Section 6
- [ ] **Budget** as in Section 7
- [ ] **Security and compliance** commitments as in Section 8
- [ ] **Open decisions** in Section 10 (mark any to change)

**Four decisions I need confirmed before July 1:**

1. Cadence confirmed as 5 days a week, 4 to 5 hours a day: ____
2. Start date confirmed as July 1, 2026: ____
3. katbotz.com is built on: ____  and WOP should live at: ____
4. Aadhaar approach confirmed: ____

**Two items still pending — needed before go-live:**

- **Retention period:** I have assumed 3 years after a worker is archived before their personal data and documents are deleted. This needs to be confirmed with a legal advisor against KATBOTZ's DPDP obligations before the platform goes live. The number affects what gets built into the deletion logic.

- **katbotz.com tech stack:** I need to know what katbotz.com is built on and who manages the domain DNS. This is required to point the `workforce.katbotz.com` subdomain at Cloud Run. It does not block the build — Week 7 handles the connection — but it needs to be confirmed before that week begins.

> Once this page is signed, I start on July 1. Full detail for every section is in the linked documents in this repository.
