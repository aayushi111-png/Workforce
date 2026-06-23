# 10 · Build Plan and Budget

> **The scenario:** vibe coding solo, 4 to 5 hours a day, 5 days a week, starting July 1.
> **The commitment:** full working platform handed over by ~August 22. KATBOTZ starts using it September 1. No phases, no future promises — every module ships.
> **The headline:** 8 weeks, ~180 hours, all 12 modules functional and in use by September.

---

## 1. What ships by handover

Every module. Working, not polished to enterprise grade — but covering the real workflow end to end.

| Module | Ships by |
|---|---|
| M1 · Worker Creation | Week 2 |
| M2 · Document Management + self-service portal | Week 3 |
| M3 · Verification Engine | Week 3 |
| M4 · Compliance Engine | Week 3 |
| M5 · Access Management | Week 4 |
| M6 · Workforce Directory | Week 4 |
| M7 · Contract Lifecycle + Invoices | Week 5 |
| M8 · Performance and Reviews | Week 5 |
| M9 · Asset Management | Week 5 |
| M10 · Offboarding | Week 6 |
| M11 · Notification Engine | Week 6 |
| M12 · Reporting and Analytics | Week 6 |
| All 7 role dashboards | Week 7 |
| Data migration from Sheets | Week 7 |
| RBAC hardened on every endpoint | Week 7 |

---

## 2. Cadence

| Metric | Value |
|---|---|
| Start date | July 1, 2026 |
| Days per week | 5 |
| Hours per day | 4 to 5 (average 4.5) |
| Hours per week | ~22.5 |
| Build weeks | 7 |
| Test week | 1 |
| Total calendar time | 8 weeks |
| Handover | ~August 22, 2026 |
| Live use begins | September 1, 2026 |

> **The rule for each session:** one feature, end to end — screen, endpoint, database — before moving to the next. Nothing half-built.

---

## 3. Week by week plan

| Week | Dates | Focus | Done means |
|---|---|---|---|
| 1 | July 1 – 5 | Foundations + Auth | Next.js and FastAPI talk to each other, Firestore and Storage connected, deployed to Cloud Run; Google sign-in works, roles exist, a page locks to a role |
| 2 | July 7 – 11 | Data model + M1 Worker Creation | Full Firestore schema in place; create any of the 4 worker types, correct document checklist generates automatically for each |
| 3 | July 14 – 18 | M2 Document Management + M3 Verification + M4 Compliance | File uploads via signed URL; worker self-service portal live; verification queue with per-document statuses; compliance gate blocks activation until all checks pass; Senior HR can activate a worker |
| 4 | July 21 – 25 | M5 Access Management + M6 Workforce Directory + M7 Contracts | Access tracking per worker; searchable directory with filters; contract records with start, end, renewal dates and expiry alerts at 90, 60, 30, 7 days |
| 5 | July 28 – Aug 1 | M7 Invoices + M8 Reviews + M9 Assets | Contractor invoice submission and approval flow; review schedules per worker type (30/60/90 day, probation, annual, intern weekly); asset assignment and return tracking |
| 6 | Aug 4 – 8 | M10 Offboarding + M11 Notifications + M12 Reporting | Exit checklist with access revocation and asset return gate; automated reminders via SendGrid for missing docs, expiry alerts, review due dates; analytics dashboard, audit log view, export to PDF and spreadsheet |
| 7 | Aug 11 – 15 | All 7 role dashboards + data migration + RBAC hardening + katbotz.com | Every role view complete and scoped correctly; existing workers imported from Sheets; every endpoint role-checked; WOP reachable on workforce.katbotz.com |
| 8 | Aug 18 – 22 | Testing + bug fixes + handover | Senior HR, HR Exec, one Team Lead, one employee do a full dry run on real data. Every bug fixed. Documentation handed over. **Platform ready for use.** |

---

## 4. Handover and go-live

| Milestone | Date |
|---|---|
| Build complete | August 15, 2026 |
| Test week complete | August 22, 2026 |
| **Handover to KATBOTZ** | **August 22, 2026** |
| **Live use begins — Sheets retired** | **September 1, 2026** |

The week between handover and live use (Aug 22 – Sept 1) is the window for HR to do a final walkthrough, confirm the migrated data looks right, and run the first real onboarding end to end before Sheets is switched off.

---

## 5. Momentum rules for a solo vibe build

- **One vertical slice per session.** Screen, endpoint, database — all three, before moving on. A backend with no screen feels like nothing is done.
- **Deploy from week one.** Live on Cloud Run from day one. No scary big-deploy moment at the end.
- **Indian employee first.** Get that worker type fully working — the other three are variations, not new builds.
- **Keep a done log.** Nobody claps in a solo build. A written list of what shipped this week is the clap.
- **Timebox rabbit holes.** One session stuck on a bug: note it, move on, come back. Never let a rabbit hole eat a week focus area.

---

## 6. After handover: ownership and maintenance

**What KATBOTZ owns after handover:**
- A custom codebase on GCP. No vendor manages it — patches, monitoring responses, and DPDP breach notification duties need a named owner at KATBOTZ.
- Aadhaar document custody for the 3-year retention period.

**Confirm before go-live:** whether KATBOTZ wants a retainer arrangement with me for ongoing patches and support, or handover to an internal technical lead.

**Rough post-handover estimate (retainer model):** 4 to 8 hours per month for routine patches, dependency bumps, and minor fixes.

---

## 7. Budget: what it actually costs in cash

No team cost — I am building it. Cash is cloud plus subscriptions, near zero while building.

**Cloud cost scales with active HR/team lead sessions, not worker headcount.** A worker logs in twice during onboarding and then rarely again. 500 stored workers with their documents is roughly 5 GB — about ₹10/mo in storage. Cloud Run is scaled to zero and bills only per request.

| Item | Build phase | Live, 100–500 workers | Scale, 1,000–5,000+ |
|---|---|---|---|
| Firestore | 0, free tier | 0–500 / mo | 500–3,000 / mo |
| Cloud Storage (~10 GB at Live) | 0–200 / mo | 200–800 / mo | 800–4,000 / mo |
| Cloud Run (scale-to-zero) | 0, free tier | 0–1,000 / mo | 1,000–6,000 / mo |
| SendGrid (email notifications) | 0, free tier | 0–500 / mo | 500–2,000 / mo |
| Monitoring (Cloud Ops) | 0 | 0–500 / mo | 500–2,000 / mo |
| Domain / subdomain | 0 (katbotz.com owned) | 0 | 0 |
| **Cloud subtotal** | **~0–500 / mo** | **~0–3,000 / mo** | **~3,000–15,000 / mo** |
| AI coding subscription (Claude) | ~₹1,500–2,000 / mo | same | same |

All figures in INR, planning estimates pending a live cloud bill.

---

## 8. What could blow the timeline

| Risk | Effect | Guard |
|---|---|---|
| Notifications (M11) take longer than expected | Adds 2 to 3 days | SendGrid is well documented — timebox to one session per trigger type |
| Reporting exports (M12) get complex | Eats into week 7 | Ship CSV export first, PDF is a nice-to-have within the week |
| Migration data is messier than it looks | Adds a few days | Look at the actual Sheets in week 1, not week 7 |
| Dashboard design balloons | Pushes handover | Build Senior HR and Founder views first — others are variations |
| Bugs in test week exceed one week | Delays Sept 1 | Reserve sessions in week 7 as buffer before handing off for testing |
