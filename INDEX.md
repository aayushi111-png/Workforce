# WORKFORCE OPERATIONS PLATFORM (WOP)
# SUBMISSION PACKAGE - 13 FILES

**Status:** Ready for submission to KATBOTZ

**Submitted by:** Aayushi Pandey (Intern)

**Date:** June 24, 2026

**Build Timeline:** July 1 – August 20, 2026

**Go-Live:** September 1, 2026

---

## SUBMISSION PACKAGE (13 Files)

### TIER 1: EXECUTIVE SUMMARY (Read First)

**1. BUDGET-AND-TIMELINE.md**
- Budget overview (₹0 build, ₹3-15/month operating)
- Monthly cost scaling: 50 workers to 500 workers
- Week-by-week build timeline
- Backup strategy and restore procedures
- Go-live date: Sept 1, 2026
- Approval sign-off section
- **Read time:** 2 minutes

---

### TIER 2: CORE SPECIFICATIONS (Read All)

**2. 00-PROPOSAL.md**
- Complete project proposal
- Problem statement and solution
- System scope (what WOP owns vs external)
- 15 features with worker types
- Document verification workflow
- 7 roles with permissions
- Zoho Recruit integration specs
- Gusto integration specs
- Offboarding and 3-year auto-delete
- Detailed budget analysis (₹0 build, ₹3-15/month ops)
- Timeline (3 weeks build, Aug 22 handover)
- Approval signature lines
- **Read time:** 10 minutes
- **For:** Decision makers, technical leads

**3. 01-OVERVIEW.md**
- System purpose statement
- Worker portal UI (8 sections)
- HR portal UI (4 sections)
- Role-based permission matrix (all 7 roles)
- Data storage architecture (Firestore, Drive, Cloud Storage)
- Google Drive folder structure
- Integration specifications (Zoho, Gusto)
- Data retention and auto-delete lifecycle
- Automatic deletion process
- Performance and scalability targets
- Support model
- **Read time:** 5 minutes
- **For:** Technical leads, HR managers

**4. 02-FEATURES.md**
- All 15 features listed with details
- Worker types (Employee, Contractor, Intern)
- Document requirements by type
- Document verification (Verified/Rejected)
- Project assignment and tracking
- Goals management (set, track, achieve)
- Weekly progress summaries
- Performance reviews (30/60/90-day, annual)
- Contract renewal tracking
- Personal to-do lists
- Offboarding workflow
- Zoho Recruit integration
- Gusto integration
- Auto-delete after 3 years
- Audit trail logging
- **Read time:** 3 minutes
- **For:** HR, users, product team

**5. 03-DATABASE.md**
- Firestore collection structure
- Document/subcollection schema
- Data types and field descriptions
- Indexes for performance
- Google Drive folder organization
- File naming conventions
- Document metadata storage
- Backup and export structure
- **Read time:** 5 minutes
- **For:** Technical team, database administrator

**6. 04-WORKFLOWS.md**
- Onboarding workflow (step-by-step)
- Document upload and verification workflow
- Project assignment workflow
- Goals creation and tracking workflow
- Performance review workflow
- Weekly summary submission workflow
- Contract renewal workflow
- Offboarding workflow (3-year retention)
- Auto-delete workflow
- Zoho Recruit integration workflow
- Gusto sync workflow
- User interactions and decision points
- **Read time:** 8 minutes
- **For:** HR team, operations, users

**7. 05-TECH-STACK.md**
- Technology choices (Next.js, FastAPI, Firestore)
- Frontend architecture (React, Next.js on Cloud Run)
- Backend architecture (Python, FastAPI on Cloud Run)
- Database (Firestore NoSQL structure)
- Authentication (Google OAuth)
- Storage (Google Drive for documents, Cloud Storage for backups)
- Integrations (Zoho Recruit API, Gusto API)
- Cost breakdown (₹3-5/month current, ₹9-15/month at scale)
- Scaling characteristics (free tier up to 200 workers)
- **Read time:** 5 minutes
- **For:** Technical team, infrastructure

**8. 06-TIMELINE.md**
- Build schedule: July 1 – August 20
- Testing schedule: July 21 – August 1
- Optimization: August 4 – 15
- Handover: August 18–22
- Go-live: September 1
- Post-launch support: Sept 1–30 (Aayushi on-call)
- Ownership transfer: October 1 (KATBOTZ tech person)
- Daily/weekly milestones
- Testing checkpoints
- **Read time:** 3 minutes
- **For:** Project managers, scheduling

**9. 07-SECURITY.md**
- Authentication (Google OAuth, katbotz.com domain only)
- Session management (30-minute timeout)
- Role-based access control (7 roles)
- Data encryption (at rest and in transit)
- Google Drive permissions and auditing
- Audit trail (all actions logged)
- Backup security (CMEK encryption)
- Emergency access procedures
- Legal hold procedure (for litigation)
- Data retention policy (3 years, then auto-delete)
- Compliance (DPDP Act, Labor Law)
- **Read time:** 5 minutes
- **For:** Security team, legal, HR, tech

**10. 08-HANDOVER.md**
- Handover checklist (Aug 18–22)
- Infrastructure access transfer (GitHub, GCP)
- Documentation handoff
- Operational runbook
- Emergency procedures
- Backup and restore procedures
- Monitoring and alerting setup
- Common issues and troubleshooting
- Support contact information
- **Read time:** 5 minutes
- **For:** KATBOTZ tech person, operations

---

### TIER 3: QUICK REFERENCE (Optional, For Convenience)

**11. README.md**
- Plain English overview
- What WOP does
- Who uses it
- Key features summary
- Quick start
- Support contact
- **Read time:** 2 minutes
- **For:** Anyone unfamiliar with project

**12. PLAN.md**
- Build schedule summary
- Key milestones
- Timeline at a glance
- **Read time:** 1 minute
- **For:** Quick reference

**13. SPEC.md**
- Complete system specification
- All features, workflows, integrations
- Consolidated reference document
- **Read time:** 10 minutes
- **For:** Comprehensive reference

---

## QUICK REFERENCE: KEY NUMBERS

| Metric | Value |
|--------|-------|
| **Build Time** | 3 weeks (July 1 – Aug 20) |
| **Build Cost** | ₹0 |
| **Monthly Cost (50 workers)** | ₹3–5 |
| **Monthly Cost (500 workers)** | ₹9–15 (~$5–10 USD) |
| **Operating Cost Growth** | ₹2–3 per 100 workers |
| **Annual Savings (vs Zoho)** | ₹179,940 (50 workers) to ₹1,799,856 (500 workers) |
| **Core Features** | 15 |
| **Roles** | 7 |
| **Integrations** | 2 major (Zoho Recruit, Gusto) |
| **Daily Backups** | Yes (30-day retention) |
| **Backup Encryption** | CMEK (Customer-managed key) |
| **Restore Time** | 5 minutes |
| **Data Retention** | 3 years after exit |
| **Auto-Delete** | Yes (no manual) |
| **Deployment** | Connected to KATBOTZ main page |
| **Go-Live** | September 1, 2026 |

---

## HOW TO USE THIS PACKAGE

### For KATBOTZ Decision Maker (Approval)
1. Read: **BUDGET-AND-TIMELINE.md** (2 min)
2. Read: **00-PROPOSAL.md** (10 min)
3. Review: Approval section in both files
4. Sign: BUDGET-AND-TIMELINE.md

**Total Time:** 15 minutes

### For KATBOTZ Technical Lead (Implementation)
1. Read: **01-OVERVIEW.md** (5 min)
2. Read: **05-TECH-STACK.md** (5 min)
3. Read: **03-DATABASE.md** (5 min)
4. Read: **07-SECURITY.md** (5 min)
5. Bookmark: **08-HANDOVER.md** (for after launch)

**Total Time:** 20 minutes

### For HR Team (Operations)
1. Read: **02-FEATURES.md** (3 min)
2. Read: **04-WORKFLOWS.md** (8 min)
3. Bookmark: **08-HANDOVER.md** (for troubleshooting)

**Total Time:** 15 minutes

### For KATBOTZ Tech Person (Post-Launch Management)
1. Read: **05-TECH-STACK.md** (5 min)
2. Read: **07-SECURITY.md** (5 min)
3. Read: **08-HANDOVER.md** (5 min)
4. Use: **08-HANDOVER.md** as operational guide

**Total Time:** 15 minutes

---

## WHAT'S SPECIFIED (LOCKED SCOPE)

### Build
- Timeline: 3 weeks (July 1 – Aug 20)
- Cost: ₹0 (Aayushi as intern project)
- Schedule: 4–5 hours/day, 5 days/week

### Operations
- Monthly Cost: ₹3–5 (50 workers) to ₹9–15 (500 workers)
- Scaling: Linear growth, ₹2–3 per 100 workers
- Deployment: Connected to KATBOTZ main page (no external hosting)

### Features
- 15 core features
- 7 distinct roles with permissions
- 2 major integrations (Zoho Recruit, Gusto)

### Data Management
- Daily automatic backups (30-day retention)
- CMEK encryption for backup storage
- 5-minute restore time (RTO)
- 3-year data retention after worker exit
- Automatic deletion (no manual required)

### Compliance
- DPDP Act 2023 compliant
- 3-year retention satisfies labor law
- Audit trail kept forever
- Legal hold capability (blocks auto-delete if litigation)

### Support
- During build: Aayushi 4–5 hours/day
- Post-launch (Sept–Oct): On-call for critical issues
- Ownership transfer: Oct 1, 2026

---

## SUBMISSION CHECKLIST

Before submitting, verify:

- [ ] All 13 files present and reviewed
- [ ] Budget and timeline agreed upon
- [ ] Legal approval for 3-year retention obtained
- [ ] Zoho and Gusto accounts confirmed ready
- [ ] Google Workspace and Cloud account confirmed
- [ ] Priya (Senior HR) confirmed available for testing
- [ ] July 1 start date confirmed
- [ ] Approval signatures obtained (in BUDGET-AND-TIMELINE.md)

---

## NEXT STEPS

1. **Present to Decision Maker:** Share BUDGET-AND-TIMELINE.md + 00-PROPOSAL.md
2. **Get Legal Confirmation:** 3-year retention is DPDP-compliant
3. **Confirm Infrastructure:** Zoho, Gusto, Workspace, GCP ready
4. **Schedule Start:** Confirm July 1 and team availability
5. **Obtain Approvals:** Sign BUDGET-AND-TIMELINE.md

---

## REPOSITORY

**GitHub:** https://github.com/aayushi111-png/Workforce

**All files committed and pushed.**

**Ready for submission.**

---

## CONTACT

- **Developer:** Aayushi Pandey (Intern)
- **Build Period:** July 1 – August 20, 2026
- **Support:** On-call Sept 1–30, 2026
- **Availability:** 4–5 hours/day, 5 days/week

---

**Document Version:** Final Submission

**Last Updated:** June 24, 2026

**Status:** READY FOR SUBMISSION

