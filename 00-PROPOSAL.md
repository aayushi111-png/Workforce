# PROPOSAL AND APPROVAL

| | |
|---|---|
| **Project** | Workforce Operations Platform (WOP) |
| **Submitted by** | Aayushi Pandey (Intern) |
| **Submitted to** | KATBOTZ |
| **Date** | June 24, 2026 |
| **Timeline** | 3 weeks (July 1 – August 20, 2026) |
| **Go-Live Date** | September 1, 2026 |
| **Build Budget** | Zero (developed as intern project) |
| **Operating Cost** | ₹3–5/month (50 workers) or ₹9–15/month (500 workers) |
| **Deployment** | Connected to KATBOTZ main page (no Vercel/external deployment) |

---

## 1. PROJECT DESCRIPTION

### What is WOP?

Workforce Operations Platform is a custom-built web application that serves as the single system of record for worker onboarding, document management, project tracking, goal setting, performance reviews, and offboarding. It replaces manual processes across Google Sheets, Google Drive, and email with one organized portal.

### Problem Statement

Current state:
- Worker onboarding tracked in Google Sheets (disorganized, no audit trail)
- Documents scattered across Google Drive (difficult to locate, difficult to verify)
- No centralized project or goal tracking
- Performance reviews done via email (no history, no structure)
- No automatic compliance checks for required documents
- Manual data entry across multiple systems (Zoho Recruit, Gusto, spreadsheets)

Impact:
- HR spends 5-10 hours per week on administrative tasks
- Risk of missing document requirements during onboarding
- No clear performance history for employees
- Legal exposure (no audit trail for compliance)

### Solution

One web application where:
- Workers log in with company email (Google OAuth)
- Upload required documents (stored in Google Drive)
- HR verifies documents with two options: Verified or Rejected
- Project assignment and goal tracking (auto-synced with team lead)
- Weekly progress summaries (written by worker, read by HR)
- Automated performance reviews (scheduled at 30, 60, 90 days, and annually)
- Contract renewal tracking
- Personal to-do lists
- Automatic data deletion after 3 years (compliance requirement)
- Integration with Zoho Recruit (auto-create workers from offers)
- Integration with Gusto (auto-sync payroll and benefits)

---

## 2. SYSTEM SCOPE

### What WOP Owns

| Capability | Owned By | Details |
|-----------|----------|---------|
| Worker profiles | WOP | Name, email, type, department, team lead, joining date |
| Document management | WOP + Drive | Upload/verification in WOP, files stored in Drive |
| Project assignment | WOP | HR assigns project, sets project lead |
| Goals and tracking | WOP | Team lead sets, worker updates progress |
| Weekly summaries | WOP | Worker writes weekly updates |
| Performance reviews | WOP | 30/60/90-day, annual (team lead fills) |
| Contract tracking | WOP | HR enters dates, system shows renewals |
| Offboarding | WOP | Mark for exit, auto-delete after 3 years |
| Audit trail | WOP | Complete log of all actions |
| Access control | WOP | 7 roles with specific permissions |

### What Integrates With WOP

| System | Purpose | Integration Type |
|--------|---------|------------------|
| Zoho Recruit | Hiring | One-way pull: offer accepted triggers worker creation |
| Gusto | Payroll | Two-way sync: worker data syncs to Gusto, updates synced back |
| Google Drive | File storage | One-way link: WOP stores link, files stored in Drive |
| Google Workspace | Authentication | OAuth login for katbotz.com emails |
| Google Cloud | Infrastructure | Firestore (database), Cloud Storage (backups), Cloud Run (hosting) |

### What Stays in Other Systems

| System | Responsibility | WOP Connection |
|--------|-----------------|-----------------|
| Zoho Recruit | Hiring workflow, offer creation, negotiations | WOP receives: accepted offer → auto-create worker |
| Gusto | Payroll processing, tax handling, benefits | WOP syncs: worker data → Gusto updates |
| Google Workspace | Email, calendar, group management | WOP uses: OAuth for authentication |
| Google Drive | Historical files, legacy documents | WOP links to: documents (no duplication) |

---

## 3. SYSTEM FEATURES

### Worker Types and Document Requirements

**Indian Employee**
- Required: PAN, Aadhaar image, Degree, 10th marksheet, 12th marksheet, Bank proof
- Employment: Full-time, permanent
- Salary: Enters into WOP, syncs to Gusto
- Reviews: 30-day, 60-day, 90-day, annual

**Indian Contractor**
- Required: PAN, Signed agreement, Bank proof
- Employment: Contract-based
- Invoicing: Submits invoices in WOP
- Reviews: Contract-specific (renewal-focused)

**Global Contractor**
- Required: PAN or equivalent, Signed agreement, Bank proof
- Employment: International contract
- Currency: Handled in Gusto
- Reviews: Delivery-focused

**Global Intern**
- Required: PAN or equivalent, Aadhaar/Passport, Degree, 10th/12th marksheet
- Employment: Temporary
- Reviews: Weekly check-ins, monthly summaries
- Completion: PPO recommendation or exit

### Document Verification Workflow

**Status Options:**

1. Verified
   - HR has reviewed document and confirmed it is acceptable
   - Worker sees status as "Verified by [HR name] on [date]"
   - Compliance gate counts as satisfied

2. Rejected
   - HR has determined document does not meet requirements
   - Reason provided (e.g., "Passport expired, must be valid")
   - Worker receives notification with rejection reason
   - Worker must upload complete new document
   - Document returns to "Pending" status for re-review

---

## 4. USER ROLES AND PERMISSIONS

### Role Definitions

| Role | View | Create | Edit | Delete | Approve | Special Permission |
|------|------|--------|------|--------|---------|-------------------|
| **Founder** | All data (read-only) | No | No | No | No | View all reports, view audit logs |
| **Senior HR** | All workers | Yes | Yes | Yes (mark exit) | Yes (activate) | Mark for exit, approve reviews, manage all |
| **HR** | All workers | Yes | Documents | No | Verify docs | Assign projects, edit goals, approve docs |
| **Team Lead** | Team only | No | Team goals | No | No | Edit team goals, fill team reviews |
| **Employee** | Self only | No | Own goals | No | No | Upload docs, write summaries, manage to-do |
| **Contractor** | Self only | No | Own goals | No | No | Upload docs, write summaries, manage to-do |
| **Intern** | Self only | No | Own goals | No | No | Upload docs, write summaries, manage to-do |

### Detailed Permission Matrix

**Document Verification**
- Senior HR: Can mark Verified or Rejected
- HR: Can mark Verified or Rejected
- Team Lead: Can view documents (read-only)
- All Others: Cannot view other workers' documents

**Goal Management**
- Senior HR: Can view all, edit all
- HR: Can view all, edit all
- Team Lead: Can view team goals, edit team goals, view own goals
- Worker/Contractor/Intern: Can view own goals, edit own goals

**Project Assignment**
- Senior HR: Can assign projects to any worker
- HR: Can assign projects to any worker
- Team Lead: Can view assigned projects (read-only)
- Worker/Contractor/Intern: Can view own project (read-only)

**Reviews**
- Senior HR: Can fill any review, approve reviews, view all
- HR: Can view reviews (read-only)
- Team Lead: Can fill reviews for team members
- Worker/Contractor/Intern: Can view own reviews

**Worker Management**
- Senior HR: Create, update, mark for exit
- HR: Create, update (limited)
- All Others: View only (self or team)

---

## 5. INTEGRATION SPECIFICATIONS

### Zoho Recruit Integration

**Purpose:** Automatically create worker profiles in WOP when offer is accepted in Zoho Recruit.

**Data Flow:**
1. Recruiter in Zoho Recruit marks offer status as "Accepted"
2. Zoho Recruit system sends API call to WOP with:
   - Candidate name
   - Email address
   - Position/Job title
   - Department
   - Joining date
   - Worker type (Employee, Contractor, or Intern)
3. WOP system receives data and:
   - Creates new worker profile
   - Auto-assigns team lead (based on department)
   - Auto-generates document checklist (based on worker type)
   - Creates Google Drive folder for documents
   - Sends welcome email to worker
4. Worker can immediately log in and begin uploading documents

**Data Mapping:**

| Zoho Field | WOP Field | Notes |
|-----------|-----------|-------|
| Candidate Name | Worker Name | Required |
| Email | Worker Email | Must be katbotz.com domain |
| Job Title | Position | Stored for reference |
| Department | Department | Maps to team lead assignment |
| Offer Accept Date | Created Date | System timestamp |
| Employment Type | Worker Type | Employee/Contractor/Intern |
| Joining Date | Joining Date | Calculated start date for reviews |

**Frequency:** Real-time (within 5 minutes of offer acceptance)

**Error Handling:** If integration fails, HR is notified and can manually create worker profile. No data loss.

### Gusto Integration

**Purpose:** Automatically sync worker data between WOP and Gusto for payroll and benefits.

**Data Flow (WOP to Gusto):**
1. Worker activated in WOP (all documents verified, compliance passed)
2. WOP sends to Gusto:
   - Full name
   - Email address
   - Department
   - Job title
   - Joining date
   - Salary (if entered in WOP)
3. Gusto system receives data and:
   - Creates payroll record
   - Initiates tax form collection (W4, state tax forms, etc.)
   - Sets up direct deposit
   - Enables benefits enrollment
   - Sets pay schedule

**Data Flow (Gusto to WOP - On Demand):**
1. HR views worker profile in WOP
2. Link available: "View payroll in Gusto" (opens Gusto in new tab)
3. No automatic sync back to WOP (one-way for compliance)

**Data Mapping:**

| WOP Field | Gusto Field | Frequency | Notes |
|-----------|-------------|-----------|-------|
| Worker Name | Full Name | On activation | Required |
| Email | Email | On activation | Required |
| Department | Department | On activation | For reporting |
| Joining Date | Start Date | On activation | For benefits eligibility |
| Salary | Annual Salary | When updated | Optional |
| Status (Exited) | Termination Date | On mark exit | 3-year trigger |

**Frequency:** On-demand (when worker activated or updated)

**Updates Synced:**
- Salary change: WOP to Gusto (within 1 hour)
- Department change: WOP to Gusto (within 1 hour)
- Title change: WOP to Gusto (within 1 hour)
- Marked for exit: WOP to Gusto (immediate - sets termination date)

**Error Handling:** If sync fails, HR is alerted. Manual reconciliation possible via Gusto interface. No data loss.

---

## 6. OFFBOARDING AND DATA RETENTION

### Offboarding Process

**Step 1: Mark for Exit**
- Senior HR or HR person clicks "Mark for Exit" on worker profile
- System requires: Last day (date)
- Example: "Last day: June 30, 2026"
- System automatically calculates: "Delete all data on June 30, 2029" (3 years)
- Worker status changes to "Exiting"
- Gusto automatically notified with termination date

**Step 2: Data Locked (3-year retention begins)**
- Worker documents cannot be deleted or modified
- Worker profile cannot be changed (read-only to HR)
- Data remains accessible for reference
- Audit trail continues to be recorded

**Step 3: Auto-Delete (After 3 Years)**
- System runs monthly deletion job
- Identifies all workers where: exit_date + 3 years = today
- For each identified worker:
  - Deletes worker profile from Firestore
  - Deletes all documents from Google Drive
  - Deletes goals, reviews, performance records
  - Deletes to-do lists
  - Records deletion in audit log: "Worker data deleted [date]"
- No manual action required

**What Gets Deleted:**
- Worker profile (name, email, department, etc.)
- All documents (PAN, Aadhaar, certificates, etc.)
- Goals and tracking data
- Performance reviews
- Weekly summaries
- To-do lists
- Project assignments
- Contract records

**What Gets Kept (Forever):**
- Audit log (complete history of all actions)
- Reason: Legal compliance - proves what happened, when

**Legal Requirement:**
- India DPDP Act 2023 requires: personal data deleted after use period ends
- India Labor Law requires: 3-year record retention for labor disputes
- WOP complies: keeps data 3 years, then deletes automatically
- Audit trail kept forever: proves deletion occurred

---

## 7. TIMELINE

### Schedule Overview

| Phase | Duration | Dates | Deliverable |
|-------|----------|-------|------------|
| Development Week 1 | 5 days | July 1-5 | Login system, worker list, database |
| Development Week 2 | 5 days | July 7-11 | Documents, projects, goals |
| Development Week 3 | 5 days | July 14-20 | Reviews, weekly summary, offboarding |
| Testing & Fixes | 2 weeks | July 21-Aug 1 | Bug fixes, HR testing |
| Final Polish | 2 weeks | Aug 4-15 | Performance optimization, training |
| Handover | 1 week | Aug 18-22 | Transfer to KATBOTZ tech person |
| Go-Live | 1 day | Sept 1 | Launch to all users |

### Detailed Weekly Breakdown

**Week 1: Foundations (July 1-5)**
- Day 1: Next.js frontend + FastAPI backend setup, initial deployment to Cloud Run
- Day 2: Google OAuth implementation (katbotz.com domain restriction)
- Day 3: Firestore database schema design, worker creation endpoints
- Day 4: HR dashboard skeleton, worker list display
- Day 5: Integration testing, login flow validation
- Status: System is live at workforce.katbotz.com, basic operations working

**Week 2: Core Features (July 7-11)**
- Day 1: Worker self-service portal, document upload form (to Drive)
- Day 2: Document storage implementation, status tracking in Firestore
- Day 3: HR document verification UI, mark Verified or Rejected
- Day 4: Project assignment form, goals management interface
- Day 5: Performance form, testing end-to-end
- Status: Workers can upload, HR can verify, projects can be assigned

**Week 3: Complete Features (July 14-20)**
- Day 1: Weekly summary form, history tracking
- Day 2: Review scheduling logic, 30/60/90-day/annual reviews
- Day 3: Contract renewal tracking, date management
- Day 4: Offboarding workflow, auto-delete job configuration
- Day 5: Notifications, personal to-do lists, final testing
- Status: All features implemented, ready for testing phase

**Week 4-5: Testing (July 21-Aug 1)**
- Priya (Senior HR) performs full system test with real data
- Document uploads and verifications tested
- Project assignments and goals tested
- Weekly summaries and reviews tested
- Offboarding tested (with test worker, not deleted)
- Bug identification and fixes
- Status: Critical bugs fixed, system stable

**Week 6-7: Polish & Optimization (Aug 4-15)**
- Performance optimization (query speed, page load time)
- UI refinement and polish
- Zoho Recruit integration testing
- Gusto integration testing
- HR training and documentation
- Status: Ready for handover

**Week 8: Handover (Aug 18-22)**
- Final end-to-end testing with Priya
- 15-minute training with KATBOTZ tech person
- Transfer of GitHub access, GCP credentials
- Transfer of runbook and documentation
- System running smoothly, no blockers
- Status: KATBOTZ tech person is ready to take over

**Go-Live (Sept 1)**
- All users switch to WOP
- Google Sheets retired
- System in production use

---

## 8. BUDGET

### Build Cost

| Item | Cost | Notes |
|------|------|-------|
| Development | ₹0 | Aayushi as intern project |
| Google Cloud setup | ₹0 | No setup fees |
| **Total Build Cost** | **₹0** | No cost to KATBOTZ |

### Operating Cost (Monthly) - Scaling Analysis

**Current Phase (Est. 50 workers):**

| Service | Cost | Details |
|---------|------|---------|
| Firestore (Database) | ₹1–2 | 100M reads/month in free tier |
| Cloud Storage (Backups) | ₹0.50 | Daily exports, 30-day retention |
| Cloud Run (Hosting) | ₹1–2 | 2M invocations/month in free tier |
| Google Drive (Documents) | Free | KATBOTZ already has Workspace |
| Google OAuth | Free | Google provides at no cost |
| **Total Monthly** | **₹3–5** | Essentially free |
| **Total Annual** | **₹36–60** | ~$0.50–0.75 USD per month |

**Projected Growth Phase (500 workers):**

| Service | Cost | Details |
|---------|------|---------|
| Firestore (Database) | ₹5–8 | Higher transaction volume |
| Cloud Storage (Backups) | ₹2–3 | Larger daily exports (500 workers) |
| Cloud Run (Hosting) | ₹2–4 | More concurrent requests |
| Google Drive (Documents) | Free | Still within Workspace quota |
| Google OAuth | Free | Google provides at no cost |
| **Total Monthly** | **₹9–15** | **~$5–10 USD equivalent** |
| **Total Annual** | **₹108–180** | Linear growth with headcount |

**Cost Model:**
- No per-employee licensing (unlike SaaS)
- Cost grows with actual usage (reads, writes, storage)
- Free tier covers usage up to ~200 workers
- Predictable scaling: ₹3–5/month per 100 employees added

### Backup Strategy

**Daily Automatic Backup:**

What gets backed up:
- Firestore database (all worker profiles, goals, reviews, documents metadata)
- Does NOT include actual document files (already in Google Drive with version history)
- Backup size: ~50 MB per 50 workers

Backup process:
1. Firestore → Auto-export to JSON file
2. Stored in: gs://katbotz-backups/ (Google Cloud Storage bucket)
3. Frequency: Daily at 2 AM IST
4. Retention: Keep 30 days (oldest auto-deleted)
5. Encryption: CMEK (Customer-managed encryption key) in Google KMS

How to restore (if needed):
1. GCP Console → Firestore → Backups
2. Select date to restore from
3. Click "Restore"
4. Estimated time: 5 minutes (no downtime)
5. Data restored to point-in-time selected

Disaster recovery:
- RTO (Recovery Time Objective): 5 minutes
- RPO (Recovery Point Objective): 1 day (latest backup)
- Monthly test restore to staging environment (verification)

### Cost Comparison: WOP vs Zoho People

**At 50 workers (Current):**

| Metric | Zoho People | WOP | Savings |
|--------|-------------|-----|----------|
| Monthly Cost | ₹15,000 | ₹5 | ₹14,995 |
| Annual Cost | ₹180,000 | ₹60 | ₹179,940 |
| 5-Year Cost | ₹900,000 | ₹300 | ₹899,700 |

**At 500 workers (Projected Growth):**

| Metric | Zoho People | WOP | Savings |
|--------|-------------|-----|----------|
| Monthly Cost | ₹150,000 | ₹12 | ₹149,988 |
| Annual Cost | ₹1,800,000 | ₹144 | ₹1,799,856 |
| 5-Year Cost | ₹9,000,000 | ₹720 | ₹8,999,280 |

**Key Insight:** WOP cost scales logarithmically. Zoho cost scales linearly per employee. At 500 workers, WOP saves KATBOTZ ₹1.8M per year.

---

## 9. APPROVAL SIGN-OFF

This proposal locks in:
- Scope: 15 features with 7 roles, Zoho/Gusto integration, auto-delete
- Timeline: 3 weeks development, August 22 handover, September 1 go-live
- Budget: Zero development cost, ₹3-5/month operating cost
- Technology: Next.js, FastAPI, Firestore, Cloud Run, Google Drive
- Integrations: Zoho Recruit (auto-create), Gusto (auto-sync)
- Compliance: 3-year retention, auto-delete, audit trail forever

**Approval Required From:**

KATBOTZ Representative: _________________ Date: _________

Aayushi Pandey (Developer): _________________ Date: June 24, 2026

---

## 10. NEXT STEPS

1. Obtain approval signature (above)
2. Schedule brief kickoff meeting (if needed)
3. July 1: Begin development
4. Aug 22: Hand over to KATBOTZ tech person
5. Sept 1: Go-live and retire Google Sheets
