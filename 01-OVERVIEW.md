# SYSTEM OVERVIEW

## System Purpose

Workforce Operations Platform (WOP) is a web-based application that provides a single system of record for all worker-related operations. It replaces fragmented workflows across Google Sheets, Google Drive, Zoho Recruit, and email with one organized, integrated platform.

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
- **Access Level:** View all data (read-only)
- **Dashboard:** Read-only view of all workers
- **Documents:** View all documents (read-only)
- **Goals:** View all goals (read-only)
- **Reviews:** View all reviews (read-only)
- **Reports:** Access all reports and analytics
- **Audit Log:** Full access to audit trail
- **Permissions:** Cannot make any changes
- **Special Capability:** View all reports, complete visibility

### Senior HR Role
- **Access Level:** Full administrative access
- **Dashboard:** View all workers, create workers
- **Documents:** Verify, reject, or request clarification on any document
- **Goals:** Edit goals for any worker
- **Reviews:** Fill reviews for any worker, approve reviews
- **Offboarding:** Mark workers for exit, trigger deletions
- **Permissions:** Edit any worker profile (except deletion)
- **Integrations:** Manage Zoho and Gusto syncs
- **Special Capability:** Approve worker activation, mark for exit

### HR Role
- **Access Level:** Administrative access (limited)
- **Dashboard:** View all workers, create workers
- **Documents:** Verify, reject, or request clarification on any document
- **Goals:** Edit goals for any worker
- **Reviews:** View reviews (read-only), cannot fill
- **Offboarding:** Cannot mark for exit
- **Permissions:** Cannot modify critical worker data
- **Special Capability:** Assign projects, verify documents

### Team Lead Role
- **Access Level:** Limited to team members only
- **Dashboard:** View only team members (those under them)
- **Documents:** View team documents (read-only)
- **Goals:** Edit goals for team members, track progress
- **Reviews:** Fill 30/60/90-day and annual reviews for team
- **Permissions:** Cannot view other teams, cannot delete
- **Special Capability:** Edit team goals, fill team reviews

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

| Data Category | Primary Storage | Secondary Storage | Access Pattern |
|--------------|-----------------|-------------------|-----------------|
| Worker Profiles | Firestore (database) | Daily backup (Cloud Storage) | Query by ID, department, team lead |
| Documents (Files) | Google Drive | Version history (30 days) | Accessed via signed links from WOP |
| Document Metadata | Firestore (database) | Daily backup | Query by status, type, worker |
| Goals and Progress | Firestore (database) | Daily backup | Query by worker, by project |
| Weekly Summaries | Firestore (database) | Daily backup | Query by worker, by week |
| Performance Reviews | Firestore (database) | Daily backup | Query by worker, by type |
| Contract Records | Firestore (database) | Daily backup | Query by renewal date, worker |
| Audit Trail | Firestore (database) | Daily backup | Query by worker, by action, by date |
| System Backups | Cloud Storage | Encrypted with separate key | Monthly retention (30 days kept) |

### Google Drive Folder Structure

```
KATBOTZ Workforce/
├── 2026/
│   ├── Rohan Mehta/
│   │   ├── PAN.pdf
│   │   ├── Aadhaar.jpg
│   │   ├── Degree.pdf
│   │   ├── Marksheet_10th.pdf
│   │   ├── Marksheet_12th.pdf
│   │   └── Bank_Proof.pdf
│   ├── Sara Lim/
│   │   ├── [documents]
│   ├── Amit Kumar/
│   │   ├── [documents]
│   └── [other workers]
└── Archive/
    ├── 2025/
    │   └── [exited workers]
    └── [historical years]
```

**Folder Sharing:**
- Each worker folder: Shared with worker (upload permission) + HR (view permission)
- Archive folders: HR only (read-only)
- Parent folder: HR and Senior HR only

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
3. **Retention Period:** Data locked for 3 years after exit date
4. **Auto-Delete:** System automatically deletes all data 3 years after exit
5. **Audit Trail:** Kept forever (for legal compliance)

### Automatic Deletion Process

- **Schedule:** Runs first of each month
- **Criteria:** Worker exit date + 3 years = today or earlier
- **Action:** Delete worker profile, documents, goals, reviews, performance data
- **Log Entry:** Record in audit trail "Worker data deleted [date]"
- **Verification:** HR can see deletion occurred in audit logs

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
