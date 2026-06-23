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

Near zero while building (free tiers), rising with active HR/team lead sessions — not with worker headcount. Stored workers are cheap; workers who log in twice and vanish cost almost nothing in compute.

| Phase | Monthly cloud cash (INR) |
|-------|--------------------------|
| Build phase | ~0 to 500 |
| Live, 100 to 500 workers | ~0 to 3,000 |
| Scale, 1,000 to 5,000 plus | ~3,000 to 15,000 |

The one real monthly cost during the build is my AI coding subscription. No team cost, because I build it. Post-launch maintenance (patches, monitoring response) is a separate arrangement to confirm before go-live. Detail and line items: [10 Build Plan and Budget](10-build-plan-and-budget.md).

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

## 10. Open decisions I need sign-off on

Every call that affects the build is listed here with my working default.

**On decision 1 — why build instead of buying:** the honest comparison is Zoho People (₹120–250/user/month for the features needed) or a similar HRMS. At 50 staff users that is ₹6,000–12,500/month with zero maintenance cost and a vendor who owns security patches. The case for building rests on three specifics that off-the-shelf tools handle poorly: <br>(a) four distinct worker types — Indian employee, foreign employee, contractor, intern — each with a different document checklist and compliance requirement; <br>(b) the Aadhaar handling decision is sensitive enough that a custom-built, locked bucket with no Aadhaar number ever typed into a field is cleaner than trusting a third-party HRMS's compliance posture; <br>(c) WOP is positioned as part of the katbotz.com product surface, which matters for the KATBOTZ brand and gives tighter control over the worker experience. If the document-type complexity were simpler, buying would win. It is not, so building is the right call — but this is a deliberate trade-off, not a default.

| # | Decision | My working default |
|---|----------|----------------------------------|
| 1 | Build over buy | Build custom (see rationale above) |
| 2 | Worker types complete at four | Yes |
| 3 | Coding cadence | 5 days a week, 4 to 5 hours a day |
| 4 | Building solo | Yes — I am building this myself |
| 5 | Start date and live-use deadline | July 1, 2026 build start — handover August 22, live September 1 |
| 6 | katbotz.com hosting and subdomain vs path | Subdomain, for example workforce.katbotz.com |
| 7 | Aadhaar handling under DPDP and UIDAI | Store the Aadhaar document image in the locked bucket for manual HR review; the Aadhaar number is never extracted, typed, or stored in any field |
| 8 | HR Executive can verify, or only review and flag | Review and flag only |
| 9 | Founder access read only, or read plus reports | Read plus reports |
| 10 | Retention period before deletion | 3 years after archival |
| 11 | REST or GraphQL backend | REST |
| 12 | Firestore sub collections or top level | Sub collections plus a few top level for cross cutting queries |
| 13 | Full text search at launch | Filter plus prefix match first |
| 14 | Verification approach | Manual — Senior HR reviews documents visually. No automated KYC planned. |

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
