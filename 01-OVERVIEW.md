# SYSTEM OVERVIEW

## System Purpose

Workforce Operations Platform (WOP) is a web-based application that provides a single system of record for all worker-related operations. It replaces fragmented workflows across Google Sheets, Google Drive, Zoho Recruit, and email with one organized, integrated platform.

---

## Worker Types (5 Types)

WOP supports 5 distinct worker types with different document requirements, features, and integrations:

| Type | Docs Required | Gusto | Invoices | Student ID | Contracts | Payroll |
|------|-----------|-------|----------|-----------|-----------|---------|
| **Indian Employee** | PAN, Aadhaar, Degree, 10/12 marks, Bank | NO | NO | NO | NO | ₹ External |
| **Indian Contractor** | PAN, Agreement, Bank | NO | YES | NO | YES | ₹ External |
| **Indian Intern** | PAN, Aadhaar, Degree, 10/12 marks, Student ID | NO | NO | YES | NO | ₹ External |
| **Global Contractor** | Tax ID, Agreement, Bank | US Only | YES | NO | YES | $ External |
| **Global Intern** | Tax ID, Passport, Degree, 10/12, Student ID | US Only | NO | YES | NO | $/₹ External |

**Key Distinctions:**
- **Gusto Sync:** Only US employees sync real-time. All Indian workers and non-US contractors handled separately.
- **Student ID:** Required for both types of interns (Indian + Global) for academic tracking.
- **Invoices:** Contractors (Indian + Global) can submit invoices. Employees and interns cannot.
- **Contracts:** Only contractors have contract management (renewal alerts 90/60/30/7 days, amendments, invoice workflow).
- **Payroll:** All payroll external to WOP except Gusto sync for US employees.

---

## User Interface Architecture

### Worker Portal

When a worker (Employee, Contractor, or Intern) logs in, they see their personalized dashboard containing:

**1. Project Information**
- Project name assigned by HR
- Project lead (team lead name)
- Project start date and current status
- Project description

**2. Goals Section**
- List of assigned goals with deadlines
- Progress status for each goal
- Ability to update progress
- Mark goal as achieved
- View historical goals

**3. Weekly Summary**
- Text area to write weekly progress update
- Displays previous weeks' summaries
- Save and submit functionality
- Visible to HR for review

**4. Documents Section**
- Checklist of required documents based on worker type
- Upload buttons for each document
- Current status of each document (Pending, Verified, Rejected)
- View verification reason if rejected
- Links to Google Drive folder

**5. Performance Section**
- Current performance rating (1-5)
- Most recent feedback from team lead
- Last updated date and reviewer name

**6. Reviews Section**
- Scheduled reviews (30-day, 60-day, 90-day, annual)
- Status of each review (Not Due, Pending, Completed)
- Completed review ratings and feedback
- View full review history

**7. Personal To-Do List**
- Add new tasks
- Check off completed tasks
- Delete tasks
- Visible to HR (read-only)

**8. Notifications**
- In-portal alerts (no email)
- Document verification status
- Review due notifications
- Contract renewal alerts
- Timestamped list

### HR Portal

When HR (HR or Senior HR role) logs in, they see administrative dashboard containing:

**1. Worker List**
- Searchable list of all workers
- Columns: Name, Type, Department, Team Lead, Status
- Filter by type, department, status
- Click worker name to open full profile

**2. Worker Profile (Detail View)**
- Complete worker information section
- Project assignment with edit capability
- Goals management (view and edit)
- Weekly summaries (view only)
- Documents section with verification controls
- Performance section (view and edit)
- Reviews section (view and fill)
- Contract information
- Offboarding status
- Audit trail of all actions

**3. Document Verification Interface**
- List of documents pending verification
- View document link (opens Google Drive)
- Two action buttons:
  - Mark Verified (approve document)
  - Reject (with reason text field)
- Status history shows all previous reviews

**4. Analytics and Reporting**
- Headcount by type and department
- Document completion rate
- Review completion rate
- Contract expiry schedule
- Offboarding status

---

## Role-Based Permission Matrix

### Founder Role
- **Access Level:** FULL ADMINISTRATIVE AUTHORITY
- **Dashboard:** View all workers, edit any worker
- **Documents:** View, verify, reject any documents
- **Goals:** View, create, edit, delete any goals
- **Reviews:** View, fill, edit, delete any reviews
- **Reports:** Access all reports and analytics
- **Audit Log:** Full access to audit trail
- **Permissions:** CAN MAKE ANY CHANGES (full authority)
- **Special Capability:** Complete visibility, ultimate decision-maker, override any settings
- **Worker Management:** Create, edit, delete workers; mark for exit; trigger manual deletion
- **System Control:** Override any decisions, access all features
- **Note:** Founder is the ultimate authority with no restrictions

### Senior HR Role (FIX #8: Clear Role Distinction)
- **Access Level:** Full administrative access (hiring/firing authority)
- **Dashboard:** View all workers, create workers, edit worker details
- **Documents:** Approve document verification (final decision)
- **Goals:** Edit goals for any worker
- **Reviews:** Fill reviews for any worker, approve reviews
- **Contracts:** Create/edit contracts, approve amendments
- **Offboarding:** Mark workers for exit, manage deletions
- **Permissions:** Edit any worker profile (hire, fire, change department)
- **Integrations:** Manage Zoho and Gusto syncs
- **Audit Logs:** View own actions only
- **Special Capability:** Full authority over workers (except system override)
- **Cannot:** Delete audit logs, override Founder, access other HR actions

### HR Role (FIX #8: Clear Role Distinction)
- **Access Level:** Administrative access (day-to-day operations)
- **Dashboard:** View all workers, search and filter
- **Documents:** Verify documents (check and mark verified/rejected)
- **Goals:** View goals (read-only), cannot create/edit
- **Reviews:** View reviews (read-only), cannot fill
- **Contracts:** View contracts (read-only), cannot edit
- **Offboarding:** Cannot mark for exit
- **Permissions:** Cannot modify critical worker data (hire/fire)
- **Integrations:** Cannot manage Zoho/Gusto (Senior HR only)
- **Audit Logs:** Cannot access
- **Special Capability:** Day-to-day document verification and project assignment
- **Cannot:** Create/delete workers, mark for exit, edit contracts, fill reviews

### Team Lead Role (FIX #11: Salary/Invoice Privacy)
- **Access Level:** Limited to team members only
- **Dashboard:** View only team members (those under them)
- **Documents:** View team documents (read-only)
- **Goals:** Edit goals for team members, track progress
- **Reviews:** Fill 30/60/90-day and annual reviews for team
- **Permissions:** Cannot view other teams, cannot delete

**Team Lead CAN see:**
├─ Team member names, emails, departments
├─ Assigned projects
├─ Goals (own team only)
├─ Reviews (own team only)
├─ Weekly summaries
└─ Performance progress

**Team Lead CANNOT see (FIX #11: Privacy Protection):**
├─ Salary amounts (locked)
├─ Invoice amounts (locked)
├─ Contract rates (locked)
├─ Worker type (employee/contractor/intern distinction)
├─ Documents section (HR only)
└─ Other team leads' reviews

- **Special Capability:** Edit team goals, fill team reviews, track progress
- **Reason for restrictions:** Salary and invoice amounts are confidential (FIX #11)

### Employee Role
- **Access Level:** Self-service only
- **Dashboard:** View only own profile
- **Documents:** Upload documents, view own documents
- **Goals:** View own goals, edit own goals, mark achieved
- **Weekly Summary:** Write weekly summary, view own history
- **Performance:** Fill performance form, view own rating
- **Reviews:** View own reviews only
- **Permissions:** Cannot view other workers, cannot edit except own goals
- **Special Capability:** Self-service document upload and goal tracking

### Contractor Role
- **Access Level:** Self-service only
- **Dashboard:** View only own profile
- **Documents:** Upload documents, view own documents
- **Goals:** View own goals, edit own goals, mark achieved
- **Invoices:** Submit invoices (if applicable)
- **Performance:** Fill performance form, view own rating
- **Reviews:** View own reviews only
- **Permissions:** Cannot view other workers, limited to own profile
- **Special Capability:** Invoice submission, self-service document upload

### Intern Role
- **Access Level:** Self-service only
- **Dashboard:** View only own profile
- **Documents:** Upload documents, view own documents
- **Goals:** View own goals, edit own goals, mark achieved
- **Weekly Summary:** Write weekly summary, view own history
- **Performance:** Fill performance form, view own rating
- **Reviews:** View own reviews (weekly check-ins)
- **Permissions:** Cannot view other workers, cannot edit except own goals
- **Special Capability:** Frequent review updates (weekly), self-service

---

## Data Storage Architecture

### Where Data is Stored

| Data Category | Primary Storage | Backup Storage | Retention | Access Pattern |
|--------------|-----------------|-----------------|-----------|-----------------|
| Worker Profiles | Firestore | Daily backup (Firestore) | 3 years | Query by ID, department, team lead |
| Documents (Files) | Cloud Storage (3 yr) | Google Drive (30-day) | 3 years (primary) / 30 days (backup) | Signed URLs from WOP |
| Document Metadata | Firestore | Daily backup (Firestore) | 3 years | Query by status, type, worker |
| Goals and Progress | Firestore | Daily backup (Firestore) | 3 years | Query by worker, by project |
| Weekly Summaries | Firestore | Daily backup (Firestore) | 3 years | Query by worker, by week |
| Performance Reviews | Firestore | Daily backup (Firestore) | 3 years | Query by worker, by type |
| Contract Records | Firestore | Daily backup (Firestore) | 3 years | Query by renewal date, worker |
| Audit Trail | Firestore | Daily backup (Firestore) | FOREVER | Query by worker, by action, by date |

### Document Storage Structure

**Primary: Cloud Storage Buckets**
```
gs://katbotz-workforce-docs/
├── 2026/
│   ├── worker-001/
│   │   ├── pan.pdf (versioning enabled)
│   │   ├── aadhaar.jpg
│   │   ├── degree.pdf
│   │   ├── marksheet_10th.pdf
│   │   ├── marksheet_12th.pdf
│   │   └── bank_proof.pdf
│   ├── worker-002/
│   │   └── [documents...]
│   └── [other workers...]
```

**Backup: Google Drive**
```
KATBOTZ Workforce (Backup)/
├── 2026/ (daily export)
│   ├── Rohan Mehta/
│   │   └── [document copies]
│   └── [other workers...]
└── Archive/
    ├── 2025/
    │   └── [exited workers]
    └── [historical years]
```

**Access Pattern (VERY SPECIFIC RETENTION):**
- Workers: Upload-only to their folder (signed upload URLs)
- HR: View via signed URLs (no download needed)
- Primary Storage (Cloud Storage): Files kept for 3 YEARS after worker exit
- Backup Storage (Google Drive): Daily export with 30-day rolling retention (disaster recovery only)
- Auto-delete: Cloud Storage lifecycle policy deletes after 1095 days (3 years)
- Backup auto-delete: Google Drive backups older than 30 days automatically deleted
- Audit Trail: ALL access logged to Cloud Logging (kept forever for legal compliance)

---

## System Integration Points

### Zoho Recruit Integration

**Direction:** Inbound (Zoho to WOP)

**Trigger:** When recruiter marks offer as "Accepted" in Zoho Recruit

**Data Transmitted:**
- Candidate name
- Email address
- Position/job title
- Department
- Expected joining date
- Employment type (Employee, Contractor, Intern)

**Action in WOP:**
- Create new worker profile automatically
- Generate document checklist based on type
- Create Google Drive folder for documents
- Send welcome email to worker
- Worker can immediately log in

**Frequency:** Real-time (within 5 minutes)

### Gusto Integration (US Employees Only)

**Scope:** US-based employees only  
**Does NOT apply to:** Indian employees, contractors, interns

**Direction:** Outbound (WOP to Gusto)

**Trigger:** When US employee is activated in WOP (all documents verified)

**Data Transmitted:**
- Full name
- Email address
- Department
- Job title
- Joining date
- Salary (if provided)
- Location: US

**Action in Gusto:**
- Create payroll record
- Initiate tax form collection (W4, state taxes)
- Set up direct deposit
- Enable benefits enrollment
- Set pay schedule

**Frequency:** On activation, then on any update

**Updates Synced (US Employees Only):**
- Salary change: WOP to Gusto (within 1 hour)
- Department change: WOP to Gusto (within 1 hour)
- Position change: WOP to Gusto (within 1 hour)
- Marked for exit: WOP to Gusto (immediate termination date)

**Indian Employees & Contractors:**
- No automatic sync to Gusto
- Payroll handled separately (out of scope for WOP)
- HR manages payroll externally

---

## Data Retention and Deletion

### Normal Lifecycle

1. **Active Employee:** Data kept indefinitely (as long as employed)
2. **Exit Date:** HR marks worker for exit with last day date
3. **Retention Period:** Data locked for 3 years after exit date (all data saved)
4. **Auto-Delete:** System automatically deletes all data 3 years after exit
5. **Audit Trail:** Kept forever (for legal compliance & deletion proof)

### What Gets Saved (All Worker Data for 3 Years)

**All projects, goals, reviews, and documents saved with worker record:**
- ✓ Worker profile (name, email, type, department, team lead, joining date)
- ✓ All projects assigned (project name, lead, start date, status)
- ✓ All goals set and tracked (goal description, deadline, status)
- ✓ All reviews completed (30/60/90-day, annual reviews with ratings/feedback)
- ✓ Performance ratings and feedback from team lead
- ✓ All documents uploaded (PAN, Aadhaar, Degree, Marksheets, Bank proof)
- ✓ Weekly summaries and progress updates
- ✓ Personal to-do lists and tasks
- ✓ Invoices submitted (contractors only)
- ✓ Contract details and amendments (contractors only)
- ✓ Complete audit trail (every action with timestamp and user)

### Automatic Deletion Process

- **Schedule:** Runs daily at 1 AM, checks all exited workers
- **Criteria:** Worker exit date + 3 years = today or earlier
- **Action:** Delete worker profile, documents, goals, reviews, performance data (everything except audit trail)
- **Log Entry:** Record in audit trail "Worker data deleted [date]" — this entry stays forever
- **Verification:** HR can see deletion occurred in audit logs anytime
- **Irreversible:** Deleted data cannot be recovered (no undelete option)

### Legal Compliance

- **DPDP Act 2023:** Requires deletion of personal data after purpose is fulfilled
- **Labor Law:** Requires 3-year record retention for disputes
- **WOP Compliance:** Meets both by retaining 3 years, then auto-deleting
- **Audit Trail:** Kept forever to prove deletion occurred and when

---

## Performance and Scalability

### Current Design Supports

- Up to 500 employees: ₹3-5/month cost
- Up to 1,000 employees: ₹15-30/month cost
- Up to 5,000 employees: ₹75-150/month cost
- Up to 10,000 employees: ₹200-400/month cost

### Architecture Characteristics

- Stateless backend (scales horizontally)
- Serverless infrastructure (auto-scales with demand)
- Database query optimization (indexes on common filters)
- Backup automation (no manual intervention)
- No sessions stored (stateless authentication)

---

## System Availability and Support

### Uptime Target

- 99% availability (allows ~7 hours downtime per month)
- Response time: Less than 2 seconds for page loads
- Database queries: Less than 100 milliseconds

### Support Model (Post-Launch)

**Phase 1 (Sept 1-30):** Aayushi on-call, responds within 1 hour to critical issues

**Phase 2 (Oct 1+):** KATBOTZ tech person owns system, Aayushi available as consultant

**Critical Issue Definition:** User blocked from work (cannot log in, cannot upload documents)

**Maintenance Windows:** None required (cloud-based, auto-updates)

---

## This Document

This overview provides:
- Role-based interface specifications
- Permission matrix for all 7 roles
- Data storage architecture
- Integration specifications
- Retention and deletion procedures
- Performance targets
- Support model

For detailed feature specifications, see 02-FEATURES.md
For technical implementation details, see 05-TECH-STACK.md
For complete workflows, see 04-WORKFLOWS.md
