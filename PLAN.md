# Build Plan — 3 Weeks (July 1 – Aug 20)

**Timeline: Tight but doable.** 4.5 hours/day, 5 days/week = 22.5 hours/week × 3 weeks = 67.5 hours total.

---

## Week 1 (July 1–5) — Foundations

**Goal:** Login works. HR can create workers.

| Day | Task | Hours |
|-----|------|-------|
| 1 | Next.js + FastAPI boilerplate, deploy to Cloud Run | 4h |
| 2 | Google OAuth integration (KATBOTZ domain only) | 5h |
| 3 | Firestore setup, worker creation endpoint | 4h |
| 4 | HR dashboard: list all workers | 4h |
| 5 | Test: login, create worker, see in list | 2h |
| **Total** | | **19h** |

**Done:** System is live on workforce.katbotz.com. HR can create workers. Workers can log in.

---

## Week 2 (July 7–11) — Core Features

**Goal:** Checklist works. Documents uploadable. Projects + Goals added.

| Day | Task | Hours |
|-----|------|-------|
| 1 | Worker dashboard: my to-do list + document upload | 4h |
| 2 | Document upload form (links to Drive, records in Firestore) | 4h |
| 3 | HR checklist view: ☑ Done for each document | 4h |
| 4 | Project assignment (HR assigns project lead to worker) | 3h |
| 5 | Goals form (Team Lead sets goals, worker can edit) | 4h |
| 6 | Performance tracker form (simple: rating + feedback) | 3h |
| **Total** | | **22h** |

**Done:** Workers can upload docs. HR can verify + check off. Project assignment works. Goals can be set and edited. Performance form works.

---

## Week 3 (July 14–20) — Finishing

**Goal:** Contract tracking, reviews, weekly summary, offboarding, notifications, polish.

| Day | Task | Hours |
|-----|------|-------|
| 1 | Weekly summary form (workers write what happened each week) | 3h |
| 2 | Reviews system (30/60/90-day, annual reviews) | 4h |
| 3 | Contract tracking: renewal date alerts (simple table) | 3h |
| 4 | Offboarding: mark for exit, set delete date (3 years) | 4h |
| 5 | Notifications: simple alerts in portal (no email) | 2h |
| 6 | Personal to-do list (customizable per worker) | 2h |
| 7 | Testing + bug fixes + handover docs | 3h |
| **Total** | | **21h** |

**Done:** All features built. Testing complete. Ready for handover.

---

## Week 4 (Aug 18–22) — HR Dry Run + Launch

- Aug 18–20: Priya tests with real data
- Aug 20: Fix any bugs found
- Aug 22: Handover to KATBOTZ tech person
- Sept 1: Live use begins

---

## What Gets Built

### Week 1: Authentication + Worker Management
```
✓ Google OAuth (KATBOTZ domain)
✓ Create worker (Senior HR only)
✓ Assign type (employee/contractor/intern)
✓ Assign team lead
✓ Auto-generate checklist per type
```

### Week 2: Documents + Projects + Goals + Performance
```
✓ Worker dashboard (my checklist)
✓ Upload document link (to Drive)
✓ HR dashboard (all workers)
✓ HR checks ☑ when verified
✓ Project assignment (HR assigns project lead)
✓ Goals form (set goals, deadlines, editable by team lead + worker)
✓ Goals tracking (mark as achieved)
✓ Performance form (rating + feedback)
✓ Contract renewal dates (simple table)
```

### Week 3: Weekly Summary + Reviews + Offboarding + Polish
```
✓ Weekly summary form (workers write each week)
✓ Reviews system (30/60/90-day, annual reviews)
✓ Mark worker for exit
✓ Set "delete after 3 years" date
✓ Auto-delete after 3 years (background job)
✓ Notifications (in-portal alerts only)
✓ Personal to-do list (customizable)
✓ Testing + fixes
```

---

## Budget

| Item | Cost |
|---|---|
| Claude subscription (3 weeks) | ₹1,200 |
| GCP (Cloud Run, Firestore) | ₹300 |
| **Total** | **₹1,500** |

(Much cheaper because: no SendGrid, no complex features, fast build)

---

## Success Criteria

By Aug 20:
- ✓ Workers can log in with katbotz email
- ✓ Workers can upload documents (to Drive)
- ✓ HR can see all workers + their documents
- ✓ HR can check off completion (☑)
- ✓ HR can assign project to worker
- ✓ Goals can be set and tracked (Team Lead edits, worker edits)
- ✓ Goals achieved can be marked
- ✓ Weekly summary form works (worker writes, HR reads)
- ✓ Performance tracker works
- ✓ Reviews system works (30/60/90-day, annual)
- ✓ Contract renewal dates visible
- ✓ Offboarding process works (documents saved 3y)
- ✓ Personal to-do lists work
- ✓ Notifications show in portal
- ✓ Priya has tested it end-to-end
- ✓ Handover docs written

Then: Aayushi leaves. KATBOTZ tech person takes over.

---

## What's NOT Built (Intentionally Simple)

- ✗ Automated emails
- ✗ Scheduled jobs (except 3-year auto-delete)
- ✗ Aadhaar locked bucket (just Drive)
- ✗ SendGrid integration
- ✗ Retry logic for failures
- ✗ Complex RBAC (just: HR can see all, workers see self)
- ✗ KYC APIs
- ✗ Multiple integrations

---

## Handover (Aug 18–22)

You'll hand over:
1. GitHub repo (code)
2. Firestore credentials (database)
3. Google Drive folder structure (documents)
4. Runbook (how to restart, backup, etc.)
5. Checklist of features (what works)

KATBOTZ tech person will:
- Watch you test with Priya
- Ask questions
- Take over Sept 1

---

## Go-Live (Sept 1)

HR retires Google Sheets.
Workers start using WOP.
That's it.

Simple. Done.
