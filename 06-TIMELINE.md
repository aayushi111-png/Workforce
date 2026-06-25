# BUILD TIMELINE — 6 Weeks (1.5 Months)

**Start:** July 1, 2026  
**Development End:** August 13, 2026  
**Duration:** 6 weeks  
**Testing & Polish:** August 14–27  
**Handover:** August 28 – September 3  
**Go-Live:** September 4, 2026

---

## WEEK 1 (July 1–5) — Foundations

**Goal:** Login works. HR can see workers list. Database is ready.

**Daily breakdown:**
- **Day 1 (July 1):** Next.js + FastAPI setup, deploy to Cloud Run
- **Day 2 (July 2):** Google OAuth login (katbotz.com emails only)
- **Day 3 (July 3):** Firestore database setup, worker creation
- **Day 4 (July 4):** HR dashboard: list all workers
- **Day 5 (July 5):** Test: Can log in? Can create worker? Can see list?

**Status:** System is live at workforce.katbotz.com. Workers can log in.

---

## WEEK 2 (July 7–11) — Core Features (Part 1)

**Goal:** Documents, Projects, Goals working.

**Daily breakdown:**
- **Day 1 (July 7):** Worker dashboard skeleton + document upload form
- **Day 2 (July 8):** Document upload to Drive, status tracking (Pending/Under Review/Verified/Rejected)
- **Day 3 (July 9):** HR document verification UI with 4 states
- **Day 4 (July 10):** Project assignment (HR assigns project + project lead)
- **Day 5 (July 11):** Goals form (set goals, track progress)

**Status:** Documents, projects, goals functional.

---

## WEEK 3 (July 14–18) — Core Features (Part 2)

**Goal:** Performance, reviews, to-do, weekly summaries.

**Daily breakdown:**
- **Day 1 (July 14):** Performance form (rating + feedback)
- **Day 2 (July 15):** Review scheduling (30/60/90-day, annual)
- **Day 3 (July 16):** Personal to-do lists (create, check, delete)
- **Day 4 (July 17):** Weekly summary form (per worker)
- **Day 5 (July 18):** Test all features end-to-end

**Status:** All 15 core features implemented.

---

## WEEK 4 (July 21–25) — Contractor & Contract Management

**Goal:** Contractor-specific features, contract tracking, renewal alerts, amendments, invoices.

**Daily breakdown:**
- **Day 1 (July 21):** Contractor distinguishment (Intern vs Global Contractor) + Student ID field
- **Day 2 (July 22):** Contract storage schema (scope, rate, duration, SOW, amendments)
- **Day 3 (July 23):** Renewal alert system (90, 60, 30, 7 days before expiry)
- **Day 4 (July 24):** Contract amendment workflow (tracking scope/rate/duration changes)
- **Day 5 (July 25):** Invoice workflow (Submitted → Approved by HR → Paid)

**Status:** Full contractor + contract management system.

---

## WEEK 5 (July 28 – Aug 1) — Integrations & Advanced Features

**Goal:** Zoho Recruit, Gusto, offboarding, auto-delete, notifications.

**Daily breakdown:**
- **Day 1 (July 28):** Zoho Recruit integration (auto-create workers from offers)
- **Day 2 (July 29):** Gusto integration (US employees only, auto-sync)
- **Day 3 (July 30):** Offboarding workflow (mark for exit, 3-year retention, auto-delete)
- **Day 4 (July 31):** Notifications system (in-portal alerts)
- **Day 5 (Aug 1):** Audit trail + logging (all actions recorded)

**Status:** All integrations and advanced features live.

---

## WEEK 6 (Aug 4–8) — Polish & Optimization

**Goal:** Performance, security, error handling, code cleanup.

**Daily breakdown:**
- **Day 1 (Aug 4):** Performance optimization (query indexing, caching)
- **Day 2 (Aug 5):** Security hardening (encryption, session management)
- **Day 3 (Aug 6):** Error handling (Zoho, Gusto sync failures, retries)
- **Day 4 (Aug 7):** UI/UX polish (visual refinement, accessibility)
- **Day 5 (Aug 8):** Code review and cleanup

**Status:** Production-ready codebase.

---

## WEEK 7–8 (Aug 11–27) — Testing & Handover Prep

**Week 7 (Aug 11–15) — Full System Testing**
- Priya (Senior HR) performs complete end-to-end testing
- Test all workflows with real data
- Test all integrations (Zoho, Gusto)
- Test backup and restore procedures
- Document all bugs and issues
- **Status:** Bug identification complete

**Week 8 (Aug 18–27) — Bug Fixes & Handover Prep**
- Fix all critical and high-priority bugs
- Create operational documentation
- Prepare GitHub access transfer
- Prepare GCP credentials transfer
- Final infrastructure checks
- HR training session with Priya
- **Status:** All systems green, ready for handover

---

## HANDOVER PERIOD (Aug 28 – Sept 3)

**Aug 28–29:** Transfer GitHub access to KATBOTZ tech person  
**Aug 30–31:** Transfer GCP credentials and infrastructure  
**Sept 1–2:** Final verification by KATBOTZ tech person  
**Sept 3:** Sign-off and approval  

---

## GO-LIVE (Sept 4, 2026)

All users switch to WOP  
Google Sheets/Docs retired  
System in full production use

---

## TOTAL TIME BREAKDOWN

| Phase | Duration | Dates |
|-------|----------|-------|
| Development | 6 weeks | July 1 – Aug 13 |
| Testing | 2 weeks | Aug 14 – Aug 27 |
| Handover | 1 week | Aug 28 – Sept 3 |
| **Total** | **9 weeks** | **July 1 – Sept 3** |
| **Go-Live** | — | **Sept 4, 2026** |

---

## DAILY COMMITMENT

- **Duration:** July 1 – August 13 (6 weeks)
- **Hours per day:** 4–5 hours
- **Days per week:** 5 days (Mon–Fri)
- **Total hours:** ~150 hours
- **Developer:** Aayushi Pandey

---

## SUPPORT MODEL

**Sept 4–30:** Aayushi on-call for critical issues (1-hour response)  
**Oct 1+:** KATBOTZ tech person owns system

