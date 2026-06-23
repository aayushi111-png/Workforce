# KATBOTZ Workforce Operations Platform (WOP)

> Architecture and product repository.
> Prepared for KATBOTZ.
> Source: Aayushi Pandey

---

## What is WOP?

KATBOTZ currently runs its non-US workforce on Google Sheets, Drive, and email. That works until it doesn't — missing documents, no audit trail, missed contract renewals, inconsistent offboarding.

WOP fixes all of that in one platform. It sits between two tools that already exist and stay untouched:

```
Zoho Recruit  →  WOP  →  Gusto
  (hiring)    (operate)  (US payroll)
```

- **Zoho Recruit** handles hiring. WOP does not touch it.
- **Gusto** handles US payroll. WOP does not touch it.
- **WOP** owns everything in between — from the moment someone accepts an offer to the moment their record is permanently deleted.

---

## The four worker types:

Every feature is shaped around four types, because each has a different document checklist and legal situation.

| Type | Key documents | What makes them different |
|---|---|---|
| Indian employee | Aadhaar image, PAN, degree, relieving letter | Probation reviews, employment agreement |
| Indian contractor | Aadhaar image, PAN, bank proof | Contract + SOW, invoice cycle |
| Global contractor | Passport, tax ID, international banking | No Aadhaar, international payment |
| Global intern | Passport, student ID, university letter | Internship agreement, mentor track |

---

## The nine stages every worker goes through:

A worker always has a status. The system enforces what can happen at each stage.

| Stage | Name | Who acts | What happens |
|---|---|---|---|
| 1 | Created | Senior HR | Record created after offer accepted |
| 2 | Onboarding | Worker | Worker uploads their own documents through their portal |
| 3 | Verification | Senior HR | HR manually checks every document — PAN, Aadhaar image, passport |
| 4 | Compliance | System | Auto-checks: all docs uploaded? All verified? Agreements signed? |
| 5 | Activation | Senior HR | Senior HR flips the switch. The only deliberate human approval. Worker is officially in. |
| 6 | Active | Everyone | Normal working life: reviews, contracts, assets, invoices |
| 7 | Offboarding | Senior HR | Exit checklist: revoke access, return assets, sign exit documents |
| 8 | Archive | System | Record kept for 3 years (legal requirement) |
| 9 | Deletion | System | Personal data deleted, only anonymised stats kept |

---

## Who logs in and what they see:

Same app — totally different experience depending on your role.

| Role | Sees | Can do | Cannot do |
|---|---|---|---|
| Founder | Company health dashboard, risk flags, headcount trends | View everything, run reports | Change anything |
| Senior HR | Full queue: docs to verify, workers to activate, expiring contracts | Everything operational | Nothing is off limits |
| HR Executive | Focused task list of documents to review | Review docs, request corrections | Activate workers (deliberate split: maker vs checker) |
| Team Lead | Their own team only | Submit reviews, request offboarding | See any other team |
| Employee / Contractor / Intern | Their own record only | Upload docs, sign agreements, submit invoices | See anyone else |

---

## How it is built

Think of it like a restaurant — the diner sees the menu, the waiter takes the order, the kitchen cooks, the fridge stores ingredients.

| Layer | Technology | Simple job |
|---|---|---|
| Frontend | Next.js | Draws the right screen for your role |
| Login | Google OAuth + RBAC | Proves who you are, assigns your role, guards every page and endpoint |
| Backend | FastAPI (Python) | Applies all business rules, checks permissions, processes every action |
| Records | Google Firestore | Stores worker profiles, document metadata, contracts, reviews, audit logs |
| Files | Google Cloud Storage | Stores the actual uploaded files — never public, only via a short-lived signed URL |
| Automation | Google Cloud Functions | Sends reminders, fires expiry alerts, runs scheduled jobs |
| Hosting | Google Cloud Run | Runs the app on Google's servers, charges only when someone actually uses it |

One cloud, one backend language, one frontend framework — deliberately simple to build, run, and hand over.

### The one design rule that explains everything

**Everything hangs off the Worker record.**

```
Worker
 ├── Documents      (PAN, Aadhaar image, passport...)
 ├── Verifications  (did HR check each one?)
 ├── Contracts + Invoices
 ├── Reviews
 ├── Assets         (laptop, monitor)
 ├── Tasks          (onboarding to-do list)
 ├── Access log     (what systems they were given)
 └── Audit log      (every action ever taken, append-only, never editable)
```

Files live in Cloud Storage. 
The database stores a pointer to the file, not the file itself. 
The Aadhaar number is never typed or stored anywhere — only the document image goes into a locked bucket, and Senior HR checks it visually.

---

## The 12 modules

| Group | Modules | What they do |
|---|---|---|
| Bring them in | Worker Creation, Document Management | Create the record, collect the documents |
| Check and activate | Verification, Compliance, Access Management | HR reviews docs manually, system checks completeness, HR activates |
| Run the workforce | Directory, Contracts, Performance, Assets | Day-to-day operations |
| Exit and oversee | Offboarding, Notifications, Reporting | Clean exits, reminders, analytics |

---

## How it gets built

Solo vibe coding — 4 to 5 hours a day, 5 days a week.

All 12 modules ship in one build. No phases.

| Milestone | Scope | Target |
|---|---|---|
| Build | All 12 modules — full platform, all 4 worker types, all 7 role dashboards, data migration from Sheets | July 1 – August 15, 2026 |
| Test | HR dry run with real data, bug fixes, edge cases | August 18 – 22, 2026 |
| **Handover** | **Full platform handed to KATBOTZ** | **August 22, 2026** |
| **Live use** | **Sheets retired. Real onboardings on WOP.** | **September 1, 2026** |

**Cost:** near zero during the build (free tiers). 
<br>Once live, roughly ₹0–3,000/month at 100–500 workers — because WOP is a low-traffic internal tool, not a consumer app. Cloud Run switches off when nobody is using it, so idle time costs nothing.

---

## Documents in this repo

| # | Document | What it answers |
|---|---|---|
| 00 | [Proposal and Approval](00-proposal-and-approval.md) | Everything in one place, with a sign-off page. **Read this first.** |
| 01 | [Executive Summary](01-executive-summary.md) | What WOP is, why it is needed, what changes |
| 02 | [Product Blueprint](02-product-blueprint.md) | Scope, principles, worker types, capabilities |
| 03 | [User Roles and Experiences](03-user-roles-and-experiences.md) | How each person sees a different system |
| 04 | [Workforce Lifecycle](04-workforce-lifecycle.md) | The nine stages a worker moves through |
| 05 | [Functional Modules](05-functional-modules.md) | The twelve modules and how they connect |
| 06 | [System Architecture](06-system-architecture.md) | The stack, the layers, the request path, the katbotz.com link |
| 07 | [Database Architecture](07-database-architecture.md) | The data model and where every byte is stored |
| 08 | [Security and Compliance](08-security-and-compliance.md) | Auth, encryption, audit, DPDP, Aadhaar handling, retention |
| 09 | [Integrations, Scalability, Roadmap](09-integrations-scalability-roadmap.md) | What connects, how it grows, and by when |
| 10 | [Build Plan and Budget](10-build-plan-and-budget.md) | Week-by-week plan, honest effort estimate, corrected cost figures |

---

## Status

| Field | Value |
|---|---|
| Version | v1 (architecture draft) |
| Owner | KATBOTZ |
| Prepared by | Aayushi Pandey |
| Last updated | June 2026 |
