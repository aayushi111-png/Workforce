# SUBMISSION CHECKLIST & REPOSITORY GUIDE

---

## FOR SUBMISSION TO KATBOTZ

This repository contains the complete specification for Workforce Operations Platform (WOP).

### Start Here

**Read in this order:**

1. **BUDGET-AND-TIMELINE.md** (2 min read)
   - Budget overview (₹0 build, ₹3-15/month operating)
   - Timeline (July 1 – Aug 20 build, Sept 1 go-live)
   - Backup strategy
   - Key dates and approval sign-off

2. **00-PROPOSAL.md** (5 min read)
   - Complete project proposal
   - System scope
   - 15 features with 7 roles
   - Zoho Recruit and Gusto integration
   - Detailed budget analysis
   - Legal approval requirements

3. **01-OVERVIEW.md** (5 min read)
   - System overview
   - Worker and HR portal UI
   - Role-based permission matrix
   - Data storage architecture
   - Integration specifications

4. **02-FEATURES.md** (3 min read)
   - All 15 features listed
   - Document verification (Verified/Rejected)
   - Project tracking, goals, reviews
   - Offboarding and auto-delete
   - Weekly summaries and performance

---

## COMPLETE DOCUMENTATION

### Core Specifications (Read all)

- **00-PROPOSAL.md** - Proposal, scope, budget, approval section
- **01-OVERVIEW.md** - System overview, roles, architecture
- **02-FEATURES.md** - 15 core features listed
- **03-DATABASE.md** - Firestore schema, data structures
- **04-WORKFLOWS.md** - Step-by-step workflows for all operations
- **05-TECH-STACK.md** - Technology choices, implementation details
- **06-TIMELINE.md** - Detailed week-by-week build schedule
- **07-SECURITY.md** - Security, backup, compliance procedures
- **08-HANDOVER.md** - Handover checklist, runbook, operations

### Executive Summary

- **BUDGET-AND-TIMELINE.md** - Budget, timeline, key dates (PDF-ready)

### Quick Reference Guides

- **README.md** - Plain English overview
- **PLAN.md** - Build schedule summary
- **SPEC.md** - Complete specification
- **TECH.md** - Technology details

---

## WHAT'S BEEN SPECIFIED

### Scope (Locked)

- **15 Core Features:**
  1. Worker profiles (4 types: Employee, Contractor, Intern)
  2. Document management (upload, verify, reject)
  3. Project assignment
  4. Goals tracking
  5. Weekly summaries
  6. Performance reviews (30/60/90-day, annual)
  7. Contract tracking
  8. Personal to-do lists
  9. Offboarding (3-year retention, auto-delete)
  10. Zoho Recruit integration (auto-create workers)
  11. Gusto integration (auto-sync payroll)
  12. Audit trail (complete history)
  13. 7-role access control
  14. Notifications (in-portal)
  15. Daily backups with 30-day retention

- **7 Roles:**
  - Founder (read-only all)
  - Senior HR (full access)
  - HR (verify docs, assign projects)
  - Team Lead (team only)
  - Employee (self only)
  - Contractor (self only)
  - Intern (self only)

### Integrations

- **Zoho Recruit:** Auto-create worker when offer accepted
- **Gusto:** Auto-sync worker data to payroll
- **Google Workspace:** OAuth authentication
- **Google Drive:** Document storage
- **Google Cloud:** Infrastructure (Firestore, Cloud Run, Cloud Storage)

### Timeline

- **Build:** July 1 – Aug 20, 2026 (3 weeks)
- **Testing:** July 21 – Aug 15, 2026 (testing concurrent with build)
- **Handover:** Aug 18–22, 2026
- **Go-Live:** September 1, 2026

### Budget

- **Build Cost:** ₹0 (Aayushi as intern project)
- **Operating Cost:**
  - 50 workers: ₹3–5/month
  - 500 workers: ₹9–15/month (~$5–10 USD)
  - No per-employee licensing
  - Transparent scaling

### Infrastructure

- **Deployment:** Connected to KATBOTZ main page (no external hosting)
- **Database:** Firestore (NoSQL)
- **Backend:** FastAPI on Cloud Run
- **Frontend:** Next.js on Cloud Run
- **Storage:** Google Drive (documents) + Cloud Storage (backups)
- **Authentication:** Google OAuth (katbotz.com domain)

### Backup Strategy

- **Frequency:** Daily automatic
- **What:** Firestore export to JSON
- **Where:** gs://katbotz-backups/ (Google Cloud Storage)
- **Retention:** 30 days (auto-delete old)
- **Encryption:** CMEK (Customer-managed key)
- **Restore:** 5 minutes via GCP console
- **RTO:** 5 minutes
- **RPO:** 1 day

### Compliance

- **DPDP Act 2023:** 3-year retention after exit, then auto-delete
- **Labor Law:** Audit trail kept forever (for disputes)
- **Legal Hold:** Can block auto-delete if litigation filed
- **Data Ownership:** Fully owned by KATBOTZ

---

## CHECKLIST: BEFORE SUBMISSION

**Documentation Complete:**
- [ ] All 9 core files written (00-08)
- [ ] Budget and Timeline summary created
- [ ] Quick reference guides available
- [ ] All files error-checked and consistent

**Specifications Locked In:**
- [ ] 15 features defined
- [ ] 7 roles with permissions
- [ ] Budget: ₹0 build, ₹3-15/month operating
- [ ] Timeline: July 1 – Sept 1, 2026
- [ ] Integrations: Zoho Recruit, Gusto specified
- [ ] Backup: Daily, 30-day retention, 5-min restore
- [ ] Deployment: Connected to KATBOTZ main page

**Ready for Approval:**
- [ ] Proposal sign-off section completed
- [ ] Cost comparison vs alternatives (Zoho)
- [ ] Legal requirements identified
- [ ] Support model defined
- [ ] Handover checklist provided

**Repository Clean:**
- [ ] Only essential files included
- [ ] Unnecessary documentation removed
- [ ] All commits pushed to GitHub
- [ ] README and guides updated

---

## HOW TO USE THIS REPOSITORY

### For KATBOTZ Head/Approval Authority

1. Read **BUDGET-AND-TIMELINE.md** (quick overview)
2. Read **00-PROPOSAL.md** (complete details)
3. Review **01-OVERVIEW.md** (system architecture)
4. Sign approval section in BUDGET-AND-TIMELINE.md

### For KATBOTZ Tech Person (Post-Approval)

1. Read **01-OVERVIEW.md** (system overview)
2. Read **05-TECH-STACK.md** (technology details)
3. Read **07-SECURITY.md** (operations and backup)
4. Read **08-HANDOVER.md** (operational runbook)
5. Clone GitHub: https://github.com/aayushi111-png/Workforce

### For HR Team (Post-Launch)

1. Read **02-FEATURES.md** (what you can do)
2. Read **04-WORKFLOWS.md** (how to do it step-by-step)
3. Use **08-HANDOVER.md** (troubleshooting guide)
4. Reference **07-SECURITY.md** (if issues arise)

---

## FILE GUIDE

| File | Purpose | Read Time | For Whom |
|------|---------|-----------|----------|
| BUDGET-AND-TIMELINE.md | Executive summary | 2 min | Everyone |
| 00-PROPOSAL.md | Complete proposal | 10 min | Decision makers |
| 01-OVERVIEW.md | System architecture | 5 min | Tech, HR |
| 02-FEATURES.md | Feature list | 3 min | HR, users |
| 03-DATABASE.md | Data schema | 5 min | Tech person |
| 04-WORKFLOWS.md | Step-by-step guides | 5 min | HR, users |
| 05-TECH-STACK.md | Technology details | 5 min | Tech person |
| 06-TIMELINE.md | Build schedule | 3 min | Project lead |
| 07-SECURITY.md | Operations, backup | 5 min | Tech person, HR |
| 08-HANDOVER.md | Runbook, procedures | 5 min | Tech person, HR |
| README.md | Quick overview | 2 min | Everyone |

---

## KEY NUMBERS (At a Glance)

| Metric | Value |
|--------|-------|
| Build time | 3 weeks |
| Build cost | ₹0 |
| Monthly cost (50 workers) | ₹3–5 |
| Monthly cost (500 workers) | ₹9–15 |
| Features | 15 core |
| Roles | 7 distinct |
| Integrations | 2 major (Zoho, Gusto) |
| Backup frequency | Daily |
| Data retention | 3 years after exit |
| RTO (restore time) | 5 minutes |
| Go-live date | Sept 1, 2026 |
| Savings vs Zoho | ₹179,940/year (50 workers) |

---

## NEXT STEPS

1. **Get Approval:** Present BUDGET-AND-TIMELINE.md + 00-PROPOSAL.md to decision maker
2. **Get Legal Sign-Off:** Confirm 3-year retention is compliant (Section 8.3, 00-PROPOSAL.md)
3. **Coordinate Schedule:** Confirm Priya (Senior HR) available for testing
4. **Get GitHub Access:** Prepare GCP credentials for KATBOTZ tech person
5. **Prepare Infrastructure:** Ensure Google Workspace and Cloud account ready
6. **Launch Timeline:** Begin July 1, go-live Sept 1

---

## CONTACT & SUPPORT

- **Developer:** Aayushi Pandey (Intern)
- **GitHub:** https://github.com/aayushi111-png/Workforce
- **Build Period:** Available 4–5 hours/day, 5 days/week
- **Post-Launch:** On-call for critical issues (Sept 1–30)

---

**Ready for submission. No gaps. All specifications locked.**

