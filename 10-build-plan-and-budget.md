# 10 · Build Plan and Budget

> The scenario: **you build WOP yourself, solo, vibe coding about 4 hours a day with an AI assistant.**
> The headline: your real cost is **time, not cash.** The cloud runs on free tiers while you build, and your spend stays small until real headcount arrives.

---

## 1. Honest effort estimate

This is a real application: 12 modules, 7 role specific experiences, auth and role based access, file storage, dashboards, notifications and a lifecycle engine. AI assistance speeds the typing, not the thinking, so these are realistic solo hours, not optimistic ones.

| Area | Hours |
|------|------:|
| Foundations: repo, Next.js plus FastAPI scaffold, GCP project, Firestore and Storage wired, deploy to Cloud Run | 45 |
| Auth plus role based access control (Google OAuth, role model, guarded routes) | 30 |
| Data model and base CRUD | 30 |
| M1 Worker Creation (ID, profile, type driven checklists and tasks) | 25 |
| M2 Document Management plus the worker self service portal (upload, signed URLs) | 40 |
| M3 Verification and M4 Compliance (queue, statuses, gating) | 30 |
| M5 Access Management | 12 |
| M6 Workforce Directory (search, filter, detail, history) | 30 |
| 7 role experiences (Founder, Senior HR, HR Exec, Team Lead, Employee, Contractor, Intern) | 60 |
| M7 Contract Lifecycle plus invoices | 32 |
| M8 Performance and Reviews | 25 |
| M9 Asset Management | 12 |
| M10 Offboarding | 20 |
| M11 Notifications (Cloud Functions, SendGrid, templates, schedules) | 30 |
| M12 Reporting and Analytics plus exports and audit view | 35 |
| Data migration from Sheets and Drive | 17 |
| Security, DPDP and Aadhaar handling | 22 |
| Connect to katbotz.com (subdomain, sign in, linking) | 12 |
| Testing, polish, responsive (spread across the build) | 45 |
| **Subtotal** | **552** |
| Contingency for learning and rework (about 15 percent) | 83 |
| **Full platform total** | **~635** |
| Optional Phase 4 integrations (Zoho webhook, Google Admin, GitHub) | 50 to 80 |

**MVP subset** (the thing that retires Google Sheets): foundations, auth, data model, M1, M2, M3, M4, M6, four core dashboards, migration and polish, about **300 to 360 hours.**

---

## 2. How long, at 4 hours a day

| Cadence | Hours per week | MVP | Full platform | With integrations |
|---------|---------------:|-----|---------------|-------------------|
| 7 days a week | 28 | 11 to 13 weeks (~3 months) | 20 to 23 weeks (~5 months) | 24 to 27 weeks (~6 months) |
| 6 days a week | 24 | 13 to 15 weeks | 23 to 27 weeks | 28 to 31 weeks |
| 5 days a week | 20 | 16 to 18 weeks | 28 to 32 weeks | 33 to 38 weeks |

> **My recommendation:** plan at **6 days a week.** "Every day" sounds good in week one and breaks by week six. One rest day a week is what keeps a five month solo build alive. The plan below is written in weeks of work, so a rest day just means a week takes slightly longer in calendar time, not that the plan changes.

> **DECISION NEEDED:** confirm your cadence (7, 6 or 5 days), so I can put real calendar dates on the milestones.

---

## 3. Week by week goal plan

Each week is about 28 hours of work. The rule for every week: **end the week with something that runs**, not something half wired.

| Week | Focus | Done means |
|------|-------|-----------|
| 1 | Foundations | Next.js and FastAPI talk to each other, Firestore and Storage connected, a "hello worker" page is live on Cloud Run |
| 2 | Auth and RBAC | Google sign in works, roles exist, a page can be locked to a role |
| 3 | Data model | You can create and read a Worker record, Firestore rules in place |
| 4 | M1 Worker Creation | Create any of the four worker types, correct checklist and tasks generate automatically |
| 5 | M2 part 1 | A file uploads to Cloud Storage, a document record is written, served by signed URL only |
| 6 | M2 part 2 | The worker self service portal: a worker logs in, uploads, sees their own progress |
| 7 | M3 and M4 | Verification queue with statuses, compliance gate blocks activation until complete |
| 8 | M6 Directory | Search and filter the workforce, open a worker, see history |
| 9 | Dashboards part 1 | Senior HR cockpit, HR Executive queue, Employee portal |
| 10 | Dashboards part 2 | Founder overview, Team Lead (team only), Contractor and Intern views |
| 11 | Migration and RBAC hardening | Existing workers imported from Sheets, every endpoint checks the role |
| 12 | MVP polish | Responsive, bug bash. **MVP milestone: run a real onboarding on WOP, Sheets retired** |
| 13 | M5 and M9 | Access tracking and asset tracking |
| 14 | M7 contracts | Contracts with start, end, renewal and expiry alerts |
| 15 | M7 invoices, M8 part 1 | Invoice flow, review scheduling begins |
| 16 | M8 and M10 | Reviews per worker type, offboarding checklist with revocation and asset return |
| 17 | M11 Notifications | Cloud Functions plus SendGrid, the full reminder set fires |
| 18 | M12 Reporting | Dashboards, audit log view, PDF and spreadsheet export |
| 19 | Security and compliance | DPDP and Aadhaar handling, signed URL hardening, audit coverage |
| 20 | Connect to katbotz.com | WOP reachable from the main site, sign in scoped to the company, end to end test |
| 21 | Final polish | Performance, backup and restore test. **Full platform milestone** |
| 22+ | Integrations (optional) | Zoho webhook, Google Workspace, GitHub |

---

## 4. Momentum rules for a solo vibe build

- **Ship a vertical slice, not a layer.** Build one feature end to end (screen, endpoint, database) before starting the next. A half built backend with no screen kills motivation.
- **Deploy from week one.** If it is live from day one, you never face a scary "big deploy" later.
- **One worker type first.** Get the Indian employee flow fully working, then the other three are variations, not new builds.
- **Keep a "done" log.** Solo builds feel slow because nobody claps. A visible list of finished weeks is the clap.
- **Timebox the rabbit holes.** If a bug eats more than one session, park it, write it down, move on, come back fresh.

---

## 5. Budget: what it actually costs in cash

Because you build it, there is **no team cost.** Cash is cloud plus a couple of subscriptions, and it is near zero while you build.

**The key insight:** cloud cost scales with active HR/team lead sessions and always-on hosting, not with worker headcount. A worker logs in twice during onboarding and then rarely again. 500 stored workers with their documents is roughly 5 GB of Storage — about ₹10/mo in storage costs. The expensive variable is compute (Cloud Run), and Cloud Run bills only for requests — idle time is free on a scaled-to-zero setup.

| Item | Build phase (you, free tiers) | Live, 100 to 500 workers | Scale, 1,000 to 5,000 plus |
|------|------|------|------|
| Firestore (records) | 0, free tier | 0 to 500 / mo | 500 to 3,000 / mo |
| Cloud Storage (files, ~10 GB at Live) | 0 to 200 / mo | 200 to 800 / mo | 800 to 4,000 / mo |
| Cloud Run (scale-to-zero) | 0, free tier | 0 to 1,000 / mo | 1,000 to 6,000 / mo |
| Cloud Functions | 0, free tier | 0 to 200 / mo | 200 to 1,000 / mo |
| Email (SendGrid) | 0, free tier | 0 to 500 / mo | 500 to 2,000 / mo |
| Monitoring (Cloud Ops) | 0 | 0 to 500 / mo | 500 to 2,000 / mo |
| Domain or subdomain | 0 (katbotz.com already owned) | 0 | 0 |
| **Cloud subtotal** | **~0 to 500 / mo** | **~0 to 3,000 / mo** | **~3,000 to 15,000 / mo** |
| Your AI assistant subscription | see EDIT ME | same | same |

> **EDIT ME:** your AI coding subscription is the one real monthly cost during the build. Drop in your actual plan (for example your Claude subscription). Everything else is free tier until workers and traffic arrive.

> **Why these numbers are lower than common estimates:** most SaaS cost calculators assume always-on VMs and heavy read/write workloads. WOP is a low-traffic internal tool — a few HR staff and team leads, not thousands of concurrent users. Cloud Run scaled to zero means you pay only when a request arrives. At 500 workers, Firestore read/write volume stays well within the first paid tier. If KATBOTZ grows past 5,000 active workers with daily activity, revisit.

All figures in INR, planning estimates pending a live cloud bill.

**One time and optional**

- Security review before go live: optional, only if you want outside eyes (skip if budget is tight, the RBAC and signed URL design already covers the basics).
- Compliance advisory for the Aadhaar and DPDP call: a short paid consult is worth it given the legal stakes.

---

## 6. After launch: ownership and maintenance

Building solo keeps team cost at zero. That is the right trade-off for a startup, but the project head should approve it knowing what comes after the build.

**What KATBOTZ owns after launch:**
- A custom codebase hosted on your GCP account. No vendor manages it for you.
- Security patches — Next.js, FastAPI, and GCP libraries release CVEs; someone has to apply them.
- The 99.5 % uptime commitment in Section 5 of the architecture doc. That requires monitoring responses, not just monitoring alerts.
- DPDP duties — if a data breach occurs, the Act requires timely notification. Someone needs to be the designated contact.
- Aadhaar document custody for the retention period.

**Bus factor:** right now that someone is the builder. Before launch, KATBOTZ should decide: (a) retainer arrangement with the builder for ongoing patches and support, or (b) the codebase and GCP project are handed over to an internal technical lead. Neither is expensive, but neither is zero cost, and leaving it undefined is how custom software rots.

**Rough post-launch maintenance estimate (retainer model):** 4 to 8 hours per month for routine patches, dependency bumps, and minor fixes. A security incident or a major feature adds to that on demand.

---

## 7. What could blow the timeline

| Risk | Effect | Guard |
|------|--------|-------|
| The 7 role experiences are more design work than expected | Adds 1 to 2 weeks | Build the HR and Employee views first, treat the rest as variations |
| Aadhaar and DPDP decision drags | Blocks the document checklist | Settle it in week 1, before you build M2 |
| Scope creep ("just one more feature") | Pushes full platform past 6 months | The week plan is the contract, new ideas go to a backlog, not into the current week |
| Burnout from "every day" | Stops the build entirely | Six days a week, one real rest day |
| Migration data is messier than it looks | Adds a few days | Look at the actual Sheets in week 1, not week 11 |

> **DECISION NEEDED:** is this strictly solo, or will Aayushi or Akshat take any part (for example design, or the migration)? A second person on dashboards alone could pull the full platform in by 3 to 4 weeks.
