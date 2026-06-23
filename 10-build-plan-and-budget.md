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

## 3. Realistic timeline and module hour estimates

**Available:** 22.5 hours/week (4.5 hours/day × 5 days) × 7 weeks = 157.5 hours

**Per-module estimates:**
| Module | Hours | Week | Notes |
|--------|-------|------|-------|
| **M1** Worker Creation | 20 | 2 | Form + API + auto-checklist generation |
| **M2** Document Management | 26 | 3 | Signed URL upload + worker portal skeleton |
| **M3** Verification Engine | 23 | 3 | Queue + viewer + rejection/clarification workflow |
| **M4** Compliance Engine | 12 | 3 | Auto-gate checking all docs verified |
| **M5** Access Management | 26 | 4 | Checklist + request broadcast + escalation logic |
| **M6** Workforce Directory | 24 | 4 | Search + filters + full history |
| **M7** Contract Lifecycle | 26 | 4–5 | Start/end/renewal + 90/60/30/7 day alerts |
| **M8** Performance Reviews | 24 | 5 | Schedule logic per type + Team Lead form |
| **M9** Asset Management | 20 | 5 | Track + return at offboarding |
| **M10** Offboarding | 28 | 6 | Revocation checklist + undo workflow |
| **M11** Notifications | 30 | 6 | SendGrid + 5 triggers + retry logic |
| **M12** Reporting | 32 | 6 | CSV export + audit log + dashboards |
| **Foundations** (auth, deploy) | 20 | 1 | Next.js + FastAPI + Cloud Run |
| **RBAC hardening** | 12 | 7 | Every endpoint role-checked |
| **Data migration** | 12 | 7 | Sheets import script + validation |
| **Testing + buffer** | 22.5 | 8 | Full HR dry run + bug fixes |
| **Total** | ~335 | 8w | Total hours needed |

**Verdict:** Tight timeline. 335 hours needed, 157.5 hours available. To make it fit:
- Weeks 1–6: Focus on core features (M1–M8 complete), reduce polish
- Week 6: M10 basic, M11 basic SendGrid (skip error handling), M12 CSV export only
- Week 7: RBAC checks, migration, error handling for M11, PDF export deferred
- Week 8: Testing, bug fixes, final polish

**The 3–5 day buffer is essential** — will almost certainly be used for:
- File upload debugging (week 2–3)
- SendGrid integration (week 6)
- Data migration consistency issues (week 7)
- Test discoveries (week 8)

> **Timeline flexibility:** These dates are the planned pace — 4.5 hours a day, work flowing smoothly. If work requires deeper debugging (e.g., file uploads, SendGrid integration, data migration), the timeline extends by 3–5 days flexibly. The handover date moves accordingly. No crunch — the goal is solid work, not fast work. Track actual progress week-by-week and adjust the end date as reality becomes clear.

## 4. Week by week plan

| Week | Dates | Focus | Done means |
|---|---|---|---|
| 1 | July 1 – 5 | Foundations + Auth | Next.js and FastAPI talk to each other, Firestore and Storage connected, deployed to Cloud Run; Google sign-in works, roles exist, a page locks to a role |
| 2 | July 7 – 11 | Data model + M1 Worker Creation | Full Firestore schema in place; create any of the 4 worker types, correct document checklist generates automatically for each |
| 3 | July 14 – 18 | M2 Document Management + M3 Verification + M4 Compliance | File uploads via signed URL; worker self-service portal skeleton live; verification queue with per-document statuses; compliance gate blocks activation until all checks pass. Portal UI wired to backend — basic version, not polished |
| 4 | July 21 – 25 | M5 Access Management + M6 Workforce Directory + M7 Contracts | Access tracking per worker; searchable directory with filters; contract records with start, end, renewal dates and expiry alerts at 90, 60, 30, 7 days |
| 5 | July 28 – Aug 1 | M7 Invoices + M8 Reviews + M9 Assets | Contractor invoice submission and approval flow; review schedules per worker type (30/60/90 day, probation, annual, intern weekly); asset assignment and return tracking |
| 6 | Aug 4 – 8 | M10 Offboarding + M11 Notifications + M12 Reporting | Exit checklist with access revocation and asset return gate; SendGrid integration for 5 email triggers (rejection, activation, 3-day reminder, contract expiry, review due); analytics dashboard and audit log view; **CSV export only — PDF is post-launch** |
| 7 | Aug 11 – 15 | Dashboard polish + data migration + RBAC hardening + katbotz.com | Senior HR, Founder, Team Lead, and Employee dashboards completed and scoped correctly (others built incrementally in weeks 4–6); existing workers imported from Sheets (inspect real data in week 1 to estimate time); every endpoint role-checked; WOP reachable on workforce.katbotz.com |
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

## 4b. Test Plan (Week 8)

**Test users (real KATBOTZ staff):**

| Role | Tester | Tests | Time |
|------|--------|-------|------|
| Senior HR | Priya | M1–M5 (worker creation → activation), M10 (offboarding), audit log | 2h |
| HR Executive | Rohini | M3 (verification queue), M12 (reports, exports) | 1.5h |
| Team Lead | Akshat | M6 (directory), M8 (review submission) | 1.5h |
| Employee | Test account | M2 (upload docs), M6 (directory view), worker portal | 1h |
| Contractor | Test account | M2 (upload docs), M7 (invoice submit) | 1h |
| **Total test time** | | | **~7 hours** |

**Critical path test cases (blockers if failed):**

| Module | Test case | Blocker? |
|--------|-----------|----------|
| M1 | Create Indian Employee → auto-checklist generated | YES |
| M2 | Upload document → file stored + metadata in Firestore | YES |
| M3 | Mark doc ☑ Verified → worker sees status update | YES |
| M4 | All docs verified → "Ready for activation" appears | YES |
| M5 | Activate → access checklist opens, IT can tick ☑ Done | YES |
| M5 | Worker can log in after access complete | YES |
| M6 | Search works + filters by dept/status | YES |
| M10 | Offboarding revocation blocks closure until all ☑ | YES |
| M11 | SendGrid email sent for document rejection | YES |
| M12 | CSV export works (PDF optional) | YES |

**Blocking bug SLA (week 8):**
- **Critical:** User blocked (can't log in, can't activate) → fix same day, retest
- **High:** Feature broken but has workaround (report doesn't export but CSV works) → fix within 12h
- **Medium:** Non-critical issue (styling, late email) → fix if time permits
- **Low:** Polish (button color, copy) → defer to post-launch

**Ready-to-handover criteria:**
- ✓ Zero critical blockers
- ✓ Zero high blockers
- ✓ All 12 modules pass happy-path test
- ✓ At least one person from HR did a real scenario end-to-end
- ✓ All 5 email triggers sent successfully

---

## 5. Momentum rules for a solo vibe build

- **One vertical slice per session.** Screen, endpoint, database — all three, before moving on. A backend with no screen feels like nothing is done.
- **Deploy from week one.** Live on Cloud Run from day one. No scary big-deploy moment at the end.
- **Indian employee first.** Get that worker type fully working — the other three are variations, not new builds.
- **Inspect the real data in week 1.** Look at the actual Sheets and Drive to see what data migration will really take. This informs week 7 planning and prevents surprises.
- **Test integrations early.** SendGrid, signed URLs, and Aadhaar flow should be tested in weeks 2–3, not left to the last moment.
- **Build dashboards incrementally.** Don't batch all 7 dashboards to week 7. Build Senior HR + Founder in weeks 5–6, others are simple variations.
- **CSV first, PDF later.** Reporting exports with CSV in week 6, PDF as a post-launch feature if time permits.
- **Keep a done log.** Nobody claps in a solo build. A written list of what shipped this week is the clap.
- **Timebox rabbit holes.** One session stuck on a bug: note it, move on, come back. Never let a rabbit hole eat a week focus area.

---

## 5b. Data Migration Plan (Week 7)

**What gets migrated from Google Sheets to WOP:**

| Item | How | Handled by |
|---|---|---|
| **Worker records** | Automated script reads Sheets, validates data, creates worker records in WOP (name, email, type, dept, team lead, joining date) | Script + manual verification of any problem rows |
| **Documents already uploaded** | Manual: if PAN, passport, etc. are in Drive, they are downloaded and re-uploaded to WOP's Cloud Storage with metadata. If just listed in Sheets, skipped (worker re-uploads in WOP) | HR (assisted by script for bulk upload) |
| **Contract records** | Manual: contract dates and SOWs are transcribed into WOP contracts module (no bulk import — too risky) | HR Executive (takes 1-2 hours for 20-30 contracts) |
| **Historical reviews** | Not migrated (reviews start fresh in WOP). Archive Sheets for reference. | None (historical stays in Sheets) |
| **Archive** | Old Sheets tabs stay as read-only reference, not imported | None |

**Timing:**
- Week 1: Inspect actual Sheets data quality, estimate migration complexity
- Week 7: Run migration script for worker records, manual entry for contracts
- Test week: Verify 100% of workers imported correctly, all records populated

**Risk guard:** If migration data is messier than expected (missing emails, inconsistent types, etc.), timeline extends by 2-3 days (within the 3-5 day flex).

---

## 6. After handover: ownership and maintenance

**What KATBOTZ owns after handover:**
- A custom codebase on GCP. No vendor manages it — patches, monitoring responses, and DPDP breach notification duties need a named owner at KATBOTZ.
- Aadhaar document custody for the 3-year retention period.

### Post-Launch Operations (Retainer Model)

**SLA targets:**
- **Availability:** 99% uptime (allowed downtime: ~7 hours/month)
- **Page load:** <2 seconds, database <100ms
- **Critical bugs:** 1-hour response, 4-hour fix
- **High bugs:** 4-hour response, 24-hour fix

**On-call rotation:**
- **Sept 1 – Sept 30 (launch month):** Aayushi on-call full-time (launch week, highest risk)
- **Oct 1 onwards:** Rotate every 1 week/month (Aayushi + backup)
- **Outside hours:** Slack notification for critical (page if system down)

**Monitoring & alerts:**
- Cloud Run CPU/memory (scale if >60%)
- Firestore quota exceeded (spike = bug or attack)
- SendGrid bounce rate >2%
- >10 failed operations in audit log within 1h

**Runbook examples:**
- If Cloud Run down: revert recent push or restart service
- If SendGrid down: check status page, queue pending emails for retry
- If worker can't log in: verify Google account created, check OAuth config
- If Firestore quota exceeded: check for runaway queries, possibly scale reads

**Rough estimate:** 4–8 hours/month for routine patches, dependency updates, minor bug fixes, monitoring checks

**Confirm before go-live:** Retainer model (4-8h/month) or handover to internal technical lead (KATBOTZ trains on codebase, takes all support)

---

## 7. Budget: what it actually costs in cash

No team cost — I am building it solo. All costs are cloud infrastructure and subscriptions.

**Budget is locked** (unlike the timeline which is flexible). This is the actual cost, no surprises.

### Build phase (July 1 – August 22, 8 weeks)

**Total build cost: ₹3,000–5,000 (fixed, cannot change)**

| Item | Cost | Notes |
|---|---|---|
| Cloud services (Firestore, Cloud Run, Storage, Monitoring) | ₹0–1,000 | Mostly free tier. ~₹125–250/month × 2 months. |
| Claude AI subscription | ₹3,000–4,000 | ~₹1,500–2,000/month × 2 months. Only cost during build. |
| **Total 8-week build** | **₹3,000–5,000** | One-time. |

### After handover (live operations)

**Cloud cost scales with active HR/team lead sessions, not worker headcount.** A worker logs in twice during onboarding and then rarely again. 500 stored workers with their documents is roughly 5 GB — about ₹10/mo in storage. Cloud Run is scaled to zero and bills only per request. No Claude subscription needed post-launch.

| Item | Live, 100–500 workers | Scale, 1,000–5,000+ |
|---|---|---|
| Firestore | 0–500 / mo | 500–3,000 / mo |
| Cloud Storage (~10 GB at Live) | 200–800 / mo | 800–4,000 / mo |
| Cloud Run (scale-to-zero) | 0–1,000 / mo | 1,000–6,000 / mo |
| SendGrid (email notifications) | 0–500 / mo | 500–2,000 / mo |
| Monitoring (Cloud Ops) | 0–500 / mo | 500–2,000 / mo |
| Domain / subdomain | 0 (katbotz.com owned) | 0 |
| **Monthly cloud cost** | **₹0–3,000 / mo** | **₹3,000–15,000 / mo** |
| **Post-launch maintenance** (optional retainer) | ~₹6,000–16,000 / mo | 4–8 hours/month patches + support |

All figures in INR, planning estimates pending a live cloud bill. Retainer model is optional — handover to internal technical lead is also an option.

---

## 8. What could blow the timeline

| Risk | Effect | Guard |
|---|---|---|
| **File upload / signed URL bugs in week 3** | Delays M2–M4, cascades to week 4 | Test signed URLs end-to-end in week 2; isolate file upload testing to one focused session |
| **SendGrid integration in week 6** | Adds 2–3 days if templates or error handling is complex | Use SendGrid's pre-built templates, not custom; timebox to one session per email trigger; test in week 5 if possible |
| **Sheets migration data is messy** | Adds 3–5 days in week 7 | Inspect the actual Sheets, Drive, and data quality in week 1; estimate migration time upfront |
| **Dashboard design balloons** | Pushes handover to week 8 | Build Senior HR and Founder dashboards first (2–3 hours each); others are simple variations; defer fancy filtering/analytics to post-launch |
| **RBAC hardening finds security issues** | Requires rework in week 7 or week 8 | Add endpoint role-checks incrementally in weeks 2–6, not all at once in week 7; test RBAC early |
| **Bugs in test week exceed 5 days** | Delays Sept 1 launch | Reserve 1–2 days in week 7 as buffer before handing off to HR for testing; only ship known-good features in week 8 |
