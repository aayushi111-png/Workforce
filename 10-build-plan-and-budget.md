# 10 · Build Plan and Budget

> **The scenario:** vibe coding solo, 4 to 5 hours a day, 5 days a week.
> **The constraint:** submission in 1.5 months (~6 weeks), then 2 weeks of testing, then launch.
> **The headline:** 135 hours is enough to build the core HR loop — onboarding, documents, verification, compliance, activation, directory, and all 7 role dashboards. Everything else (contracts, reviews, assets, notifications, reporting) ships post-launch in a second phase.

---

## 1. What fits in 135 hours

| Phase | Hours available | What ships |
|---|---:|---|
| Build (6 weeks) | ~135 | Core platform — the thing that retires Google Sheets |
| Test (2 weeks) | — | Internal HR dry run, bug fixes, edge cases |
| Launch (week 9) | — | Go live, Sheets retired, real onboardings begin |
| Post-launch (months 3–5) | ongoing | Contracts, invoices, reviews, assets, offboarding, notifications, reporting |

**What the core platform covers:**
- All 4 worker types with type-driven document checklists
- Worker self-service upload portal
- Manual verification queue (Senior HR)
- Compliance gate and activation
- Workforce directory (search, filter, worker detail)
- All 7 role dashboards (Founder, Senior HR, HR Exec, Team Lead, Employee, Contractor, Intern)
- Data migration from Sheets
- RBAC enforced on every endpoint

**What ships post-launch (not cut, just sequenced):**
- Contract lifecycle and invoices
- Performance reviews
- Asset management
- Offboarding checklist engine
- Notification engine (automated reminders)
- Reporting and analytics exports
- katbotz.com subdomain connection

---

## 2. Cadence

| Metric | Value |
|---|---|
| Days per week | 5 |
| Hours per day | 4 to 5 (average 4.5) |
| Hours per week | ~22.5 |
| Build weeks | 6 |
| Total build hours | ~135 |

> **The rule for each session:** ship something that runs by the end of it. Not a half-wired backend. A working screen, even if basic.

---

## 3. Week by week plan

### Build phase — 6 weeks to submission

| Week | Calendar target | Focus | Done means |
|---|---|---|---|
| 1 | Week of July 1 | Foundations + Auth | Next.js and FastAPI talk to each other, Firestore and Storage connected, deployed to Cloud Run; Google sign-in works, roles exist, a page locks to a role |
| 2 | Week of July 7 | Data model + Worker Creation (M1) | Full Firestore schema in place; create any of the 4 worker types, correct checklist generates automatically |
| 3 | Week of July 14 | Document Management (M2) | File uploads to Cloud Storage, document record written, served by signed URL only; worker self-service portal live — worker logs in, uploads, sees their checklist |
| 4 | Week of July 21 | Verification (M3) + Compliance (M4) + Activation | Verification queue with per-document statuses; compliance gate blocks activation until all checks pass; Senior HR can activate a worker |
| 5 | Week of July 28 | Workforce Directory (M6) + all 7 dashboards | Search and filter the workforce; all 7 role views live (Founder overview, Senior HR cockpit, HR Exec queue, Team Lead team view, Employee portal, Contractor portal, Intern portal) |
| 6 | Week of Aug 4 | Migration + RBAC hardening + polish | Existing workers imported from Sheets; every endpoint role-checked; responsive layout, bug bash. **Submission milestone — hand off for review** |

### Test phase — 2 weeks

| Week | Calendar target | What happens |
|---|---|---|
| 7 | Week of Aug 11 | Senior HR and HR Exec do a full dry run: create a real worker, upload real documents, run through the verification queue, activate. Every bug found gets fixed same day. |
| 8 | Week of Aug 18 | Team Lead and employee portals tested with real team members. Edge cases: rejected documents, re-uploads, wrong role access attempts. Final bug bash. |

### Launch

| Milestone | Target date |
|---|---|
| **Go live — Sheets retired** | ~August 25, 2026 |
| First real onboarding on WOP | Week of August 25 |
| Post-launch phase 2 begins | September onwards |

---

## 4. Post-launch roadmap (phase 2)

These are not cut features — they are the right things to build *after* the core loop is proven with real workers.

| Module | Builds on | Target |
|---|---|---|
| M7 Contract Lifecycle + invoices | Workers are activated, contractor records exist | October 2026 |
| M8 Performance and Reviews | Active workers, team lead dashboards working | October–November 2026 |
| M9 Asset Management | Active workers | November 2026 |
| M10 Offboarding | Full lifecycle proven end to end | December 2026 |
| M11 Notifications (SendGrid + Cloud Functions) | All triggers exist, now automate the reminders | December 2026 |
| M12 Reporting and Analytics | Data has been accumulating since launch | January 2027 |
| Connect to katbotz.com subdomain | Full platform stable | January–February 2027 |
| Integrations (Zoho webhook, Google Workspace, GitHub) | After the platform is stable | March–April 2027 |

---

## 5. Momentum rules for a solo vibe build

- **One vertical slice per session.** Build one feature end to end — screen, endpoint, database — before starting the next. Half-built backends kill motivation.
- **Deploy from week one.** Live on Cloud Run from day one so there is never a scary big-deploy moment later.
- **One worker type first.** Get the Indian employee flow fully working, then the other three are variations, not new builds.
- **Keep a done log.** Solo builds feel slow because nobody claps. A visible list of finished sessions is the clap.
- **Timebox rabbit holes.** If a bug eats more than one session, park it, write it down, move on.

---

## 6. After launch: ownership and maintenance

Building solo keeps team cost at zero — the right trade-off for a startup. But the project head should approve it knowing what comes after.

**What KATBOTZ owns after launch:**
- A custom codebase on your GCP account. No vendor manages it.
- Security patches — Next.js, FastAPI, and GCP libraries release CVEs; someone applies them.
- The 99.5% uptime commitment requires monitoring responses, not just monitoring alerts.
- DPDP duties — a breach requires timely notification to the Data Protection Board. Someone needs to be the named contact.
- Aadhaar document custody for the retention period.

**Bus factor:** right now that someone is the builder. Before launch, confirm: (a) retainer arrangement for ongoing patches and support, or (b) handover to an internal technical lead.

**Rough post-launch estimate (retainer model):** 4 to 8 hours per month for routine patches, dependency bumps, and minor fixes. A security incident or major feature adds to that on demand.

---

## 7. Budget: what it actually costs in cash

Because you build it, there is **no team cost.** Cash is cloud plus subscriptions — near zero while building.

**The key insight:** cloud cost scales with active HR/team lead sessions and always-on hosting, not with worker headcount. A worker logs in twice during onboarding and then rarely again. 500 stored workers with their documents is roughly 5 GB of Storage — about ₹10/mo in storage costs. Cloud Run is scaled to zero and bills only per request.

| Item | Build phase | Live, 100–500 workers | Scale, 1,000–5,000+ |
|---|---|---|---|
| Firestore (records) | 0, free tier | 0–500 / mo | 500–3,000 / mo |
| Cloud Storage (~10 GB at Live) | 0–200 / mo | 200–800 / mo | 800–4,000 / mo |
| Cloud Run (scale-to-zero) | 0, free tier | 0–1,000 / mo | 1,000–6,000 / mo |
| Cloud Functions | 0, free tier | 0–200 / mo | 200–1,000 / mo |
| Email (SendGrid) | 0, free tier | 0–500 / mo | 500–2,000 / mo |
| Monitoring (Cloud Ops) | 0 | 0–500 / mo | 500–2,000 / mo |
| Domain / subdomain | 0 (katbotz.com owned) | 0 | 0 |
| **Cloud subtotal** | **~0–500 / mo** | **~0–3,000 / mo** | **~3,000–15,000 / mo** |
| AI coding subscription | see EDIT ME | same | same |

> **EDIT ME:** drop in your actual AI subscription cost (e.g. your Claude plan). Everything else is free tier until real traffic arrives.

All figures in INR, planning estimates pending a live bill.

**One-time and optional**
- Compliance advisory for the Aadhaar and DPDP approach before launch.
- Security review or pen test before going live (skip if budget is tight — the RBAC and signed URL design already covers the basics).

---

## 8. What could blow the timeline

| Risk | Effect | Guard |
|---|---|---|
| Dashboard design takes longer than expected | Adds 3 to 5 days | Build Senior HR and Employee views first — others are variations |
| Aadhaar and DPDP decision drags | Blocks M2 checklist | Settle it in week 1, before any document work starts |
| Migration data messier than it looks | Adds a few days | Look at the actual Sheets in week 1, not week 5 |
| Scope creep during build | Pushes submission past week 6 | Week plan is the contract — new ideas go to a post-launch backlog |
| Bugs found in test phase exceed 2 weeks | Delays launch | Reserve a few sessions in week 6 as buffer before handing off |
