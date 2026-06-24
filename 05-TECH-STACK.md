# COMPLETE TECHNICAL SPECIFICATION

---

## 1. TECHNOLOGY STACK OVERVIEW

### Frontend Architecture
**Framework:** Next.js (React)  
**Language:** JavaScript/TypeScript  
**Hosting:** Google Cloud Run (auto-scales)  
**Cost:** Included in Cloud Run tier (₹1-2/month)

**Pages Built:**
- `/` → Login page (Google OAuth)
- `/dashboard` → Worker dashboard (documents, goals, performance, to-do)
- `/workers` → HR dashboard (all workers list)
- `/workers/[id]` → Worker profile (detailed view)
- `/admin` → Settings & configuration (HR/Senior HR only)

**Frontend Features:**
- Google OAuth button (katbotz.com only)
- Forms (documents, performance, to-do, goals)
- Tables (worker list, documents, contracts)
- Links to Google Drive (document storage)
- Real-time status updates (verified, rejected, pending)
- Notifications panel

### Backend Architecture
**Framework:** FastAPI (Python)  
**Language:** Python 3.10+  
**Hosting:** Google Cloud Run (auto-scales)  
**Cost:** Included in Cloud Run tier (₹1-2/month)

**API Endpoints (Complete List):**

**Authentication:**
```
POST /auth/login → Google OAuth verification
POST /auth/logout → End session
GET /auth/me → Current user details
```

**Workers (Admin Only):**
```
GET /api/workers → List all workers (HR/Senior HR only)
POST /api/workers → Create worker (auto from Zoho or manual)
GET /api/workers/{id} → Get worker profile
PUT /api/workers/{id} → Update worker
GET /api/workers/{id}/documents → List worker's documents
```

**Documents (Core Feature):**
```
POST /api/workers/{id}/documents → Upload document to Drive
PUT /api/workers/{id}/documents/{type} → Mark verified/rejected
GET /api/workers/{id}/documents/{type} → Get document status
DELETE /api/workers/{id}/documents/{type} → Mark for deletion
```

**Goals:**
```
POST /api/workers/{id}/goals → Add goal
PUT /api/workers/{id}/goals/{goal_id} → Update goal progress
GET /api/workers/{id}/goals → List goals
```

**Performance:**
```
POST /api/workers/{id}/performance → Submit performance form
PUT /api/workers/{id}/performance → Update rating
GET /api/workers/{id}/performance → Get performance history
```

**Reviews:**
```
POST /api/workers/{id}/reviews → Create review (30/60/90-day, annual)
PUT /api/workers/{id}/reviews/{review_id} → Fill review
GET /api/workers/{id}/reviews → Get all reviews
```

**Weekly Summary:**
```
POST /api/workers/{id}/summary → Write weekly summary
GET /api/workers/{id}/summary → Get summary history
```

**To-Do:**
```
POST /api/workers/{id}/todo → Add task
PUT /api/workers/{id}/todo/{task_id} → Mark done
DELETE /api/workers/{id}/todo/{task_id} → Delete task
GET /api/workers/{id}/todo → Get all tasks
```

**Contracts:**
```
PUT /api/workers/{id}/contract/renewal-date → Set renewal date
GET /api/workers/{id}/contract → Get contract info
```

**Offboarding:**
```
PUT /api/workers/{id}/offboarding/mark-exit → Mark for exit
GET /api/workers/{id}/offboarding → Get offboarding status
```

**Notifications:**
```
GET /api/notifications → Get user's notifications
POST /api/notifications/read/{id} → Mark as read
```

**Integrations:**
```
POST /webhooks/zoho/offer-accepted → Zoho Recruit webhook
POST /api/integrations/gusto/sync → Sync to Gusto
```

**Audit & Admin:**
```
GET /api/audit-logs → Get audit trail (Senior HR only)
GET /api/system/health → System status
```

---

## 2. DATABASE SCHEMA (FIRESTORE)

### Collections & Documents Structure

**workers Collection**
```
workers/{worker_id}
  ├── Basic Info
  │   ├── name: string
  │   ├── email: string (katbotz.com)
  │   ├── type: "Employee" | "Contractor" | "Intern"
  │   ├── department: string
  │   ├── team_lead: string (email)
  │   ├── joining_date: date
  │   ├── status: "Created" | "Onboarding" | "Active" | "Exiting" | "Archived"
  │
  ├── documents Subcollection
  │   └── {document_type} (e.g., "pan", "aadhaar", "degree")
  │       ├── type: string
  │       ├── drive_link: string (Google Drive link)
  │       ├── status: "Pending" | "Verified" | "Rejected"
  │       ├── verified_by: string (HR email)
  │       ├── verified_date: date
  │       ├── rejection_reason: string (if rejected)
  │       ├── uploaded_date: date
  │
  ├── goals Subcollection
  │   └── {goal_id}
  │       ├── goal_text: string
  │       ├── deadline: date
  │       ├── status: "Active" | "Achieved" | "Archived"
  │       ├── created_by: string (Team Lead)
  │       ├── created_date: date
  │       ├── progress: 0-100%
  │
  ├── performance Subcollection
  │   └── {performance_id}
  │       ├── rating: 1-5
  │       ├── feedback: string
  │       ├── submitted_by: string (Team Lead)
  │       ├── submitted_date: date
  │
  ├── reviews Subcollection
  │   └── {review_id}
  │       ├── review_type: "30-day" | "60-day" | "90-day" | "annual"
  │       ├── due_date: date
  │       ├── filled_by: string (Team Lead)
  │       ├── filled_date: date
  │       ├── rating: 1-5
  │       ├── feedback: string
  │       ├── status: "Pending" | "Completed"
  │
  ├── weekly_summaries Subcollection
  │   └── {week_id}
  │       ├── week_of: date
  │       ├── summary_text: string (max 5000 chars)
  │       ├── submitted_date: date
  │
  ├── projects Subcollection
  │   └── {project_id}
  │       ├── name: string
  │       ├── description: string
  │       ├── project_lead: string (email)
  │       ├── assigned_date: date
  │       ├── status: "Assigned" | "In Progress" | "Completed"
  │
  ├── todos Subcollection
  │   └── {todo_id}
  │       ├── task: string
  │       ├── completed: boolean
  │       ├── created_date: date
  │       ├── completed_date: date
  │
  ├── contracts Subcollection
  │   └── contract_info
  │       ├── renewal_date: date
  │       ├── last_updated: date
  │       ├── updated_by: string
  │
  ├── offboarding
  │   ├── status: "None" | "Marked" | "Archived" | "Deleted"
  │   ├── last_day: date
  │   ├── marked_date: date
  │   ├── marked_by: string
  │   ├── delete_after: date (auto-calculated: last_day + 3 years)
  │
  └── metadata
      ├── created_date: date
      ├── created_by: string
      ├── last_modified: date
      ├── last_modified_by: string
```

**audit_logs Collection (Append-Only)**
```
audit_logs/{log_id}
  ├── action: string (e.g., "document_verified", "worker_created", "goal_added")
  ├── worker_id: string
  ├── performed_by: string (user email)
  ├── timestamp: date
  ├── details: object (what changed)
  ├── ip_address: string
  └── status: "success" | "error"
```

---

## 3. DOCUMENT STORAGE: CLOUD STORAGE (Primary) + GOOGLE DRIVE (Backup)

### Architecture Decision

**Primary Storage:** Google Cloud Storage (buckets)  
**Backup Storage:** Google Drive (daily export)  
**Why this approach:**
- Auto-delete after 3 years (DPDP compliance) ✓
- Audit trail & legal proof ✓
- Legal hold capability (for litigation) ✓
- Signed URLs for HR preview (no download) ✓
- Scalable to 5000+ employees ✓
- Cost: ₹2-3/month (minimal increase) ✓

### Document Storage Flow

**Primary Storage (Cloud Storage Buckets):**
```
gs://katbotz-workforce-docs/
└── 2026/
    ├── worker-id-001/
    │   ├── pan.pdf (v1, v2, v3 - versioning)
    │   ├── aadhaar.jpg
    │   ├── degree.pdf
    │   ├── marksheet_10th.pdf
    │   ├── marksheet_12th.pdf
    │   ├── bank_proof.pdf
    │   └── contract.pdf (for contractors)
    ├── worker-id-002/
    │   └── [documents...]
    └── [other workers]/
```

**Backup Storage (Google Drive):**
```
KATBOTZ Workforce (Backup)/
└── 2026/ (daily export)
    ├── Rohan Mehta/
    │   └── [copies of all documents]
    └── [other workers]/
```

### How Documents Flow

1. **Upload:** Worker uploads file → Cloud Run receives → Stored in Cloud Storage
2. **Access:** HR clicks document → WOP generates signed URL → Viewer opens in browser
3. **Verification:** HR reviews file → Marks status (Pending/Under Review/Verified/Rejected)
4. **Backup:** Nightly job exports to Google Drive (30-day rolling backup)
5. **Retention:** Cloud Storage lifecycle policy: auto-delete after 1095 days (3 years)
6. **Compliance:** Audit logs show who accessed what when, deletion proof

### Security & Compliance

**Cloud Storage Features:**
- CMEK encryption (customer-managed encryption keys)
- Signed URLs (secure, temporary access links for HR)
- Audit logging (all access logged to Cloud Logging)
- Legal hold API (block deletion if litigation)
- Lifecycle policies (auto-delete after 3 years, logged)
- Retention policies (DPDP compliance)
- Versioning (keep all versions until deleted)

**IAM Access Control:**
- Workers: Upload-only to their folder (signed upload URLs)
- HR/Senior HR: Full access to all documents
- Auditors: Read-only access with logging
- System: Automatic lifecycle job (no human access)

### Signed URLs for HR Preview

HR doesn't need to download - signed URLs allow browser preview:
```
HR clicks "View Document" in WOP
↓
WOP generates signed URL (valid 1 hour)
↓
URL opens in browser with Google Cloud Viewer
↓
HR sees PDF/image directly (no download)
↓
HR clicks back to WOP to mark Verified/Rejected
```

**Benefits:**
- No file downloads (faster)
- No files on local computers (security)
- HR preview in browser (convenient)
- All actions logged (audit trail)
- Temporary access (URLs expire)

---

## 4. AUTHENTICATION SYSTEM

**Method:** Google OAuth 2.0 (via KATBOTZ Workspace)

**Flow:**
1. User clicks "Sign in with Google" on login page
2. Redirected to Google login
3. Google checks: is email @katbotz.com?
4. If YES → Issues OAuth token → User logged in
5. If NO → Denies access

**Session Management:**
- Session lifetime: 8 hours maximum
- Inactivity timeout: 30 minutes
- Token stored: Browser localStorage (encrypted)
- No passwords stored anywhere

**Credentials:**
- Google OAuth Client ID: Configured in Cloud Run
- Scopes: email, profile (no Drive access from token)
- Redirect URI: https://workforce.katbotz.com/auth/callback

---

## 5. BACKUP & RECOVERY STRATEGY

**Daily Automated Backup:**

**What Gets Backed Up:**
- Firestore database (JSON export)
- All worker profiles, documents, goals, reviews, audit logs
- Does NOT include actual files (already in Drive with version history)

**Backup Process:**
1. Time: Daily at 2 AM IST
2. Method: Firestore export to Cloud Storage
3. Destination: gs://katbotz-backups/
4. Format: JSON
5. Size: ~50 MB per 50 workers
6. Encryption: CMEK (Customer-managed encryption key)

**Retention Policy:**
- Kept: 30 days (auto-delete old backups)
- Monthly: Test restore to staging environment

**How to Restore:**
1. Go to: GCP Console → Firestore
2. Click: "Backups" tab
3. Select: Restoration date
4. Click: "Restore"
5. Status: Estimated 5 minutes (no downtime)
6. Verification: Query Firestore to confirm data

**Recovery Objectives:**
- RTO (Recovery Time Objective): 5 minutes
- RPO (Recovery Point Objective): 1 day (latest backup)

---

## 6. INTEGRATION SPECIFICATIONS

### Zoho Recruit Integration

**Purpose:** Auto-create worker when offer is accepted

**Data Flow:**
1. Recruiter marks offer "Accepted" in Zoho
2. Zoho sends webhook to WOP API
3. WOP validates and creates worker profile
4. Google Drive folder created for documents
5. Worker gets welcome email

**Webhook Endpoint:** `POST /webhooks/zoho/offer-accepted`

**Data Received:**
```json
{
  "candidate_name": "Rohan Mehta",
  "email": "rohan@katbotz.com",
  "position": "Software Engineer",
  "department": "Engineering",
  "joining_date": "2026-06-15",
  "employment_type": "Employee"
}
```

**Validation:**
- Email must be @katbotz.com domain
- Name cannot be null/empty
- Joining date must be today or future
- Department must match known departments
- Employment type must be: Employee, Contractor, or Intern

**Error Handling:**
- Invalid data → Return 400 error, don't create worker
- Valid data → Create worker, return 200 + worker_id

### Gusto Integration (US Employees Only - SYNC ONLY, No Auto-Create)

**IMPORTANT:** Gusto SYNCS existing workers (doesn't auto-create). Workers must already exist in WOP.

**Purpose:** Real-time sync of US employee payroll data between WOP and Gusto

**Applies To:** US-based employees only  
**Does NOT apply to:** Indian employees, contractors, interns

**Data Flow (Real-Time Sync):**

**WOP → Gusto (HR makes changes in WOP):**
1. HR updates worker in WOP (name, salary, department, job title, etc.)
2. WOP detects change and calls Gusto API within 30 seconds
3. Gusto receives updated data and reflects in payroll system
4. Next paycheck uses updated information

**Gusto → WOP (Payroll processed):**
1. Payroll run in Gusto (bi-weekly, monthly, etc.)
2. Gusto sends back: pay date, amount, deductions, taxes, YTD
3. WOP receives and stores for HR/worker to view
4. Workers can see pay stubs in WOP (read-only)

**Sync Endpoint:** `POST /api/integrations/gusto/sync`

**Data Synced WOP → Gusto (US Employees):**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@katbotz.com",
  "department": "Engineering",
  "start_date": "2026-06-15",
  "salary": 120000,
  "location": "US",
  "job_title": "Senior Engineer"
}
```

**Data Synced Gusto → WOP:**
```json
{
  "pay_date": "2026-07-15",
  "gross_pay": 4615.38,
  "net_pay": 3400.00,
  "deductions": 500.00,
  "taxes_withheld": 715.38,
  "ytd_gross": 9230.76,
  "ytd_net": 6800.00
}
```

**Indian Employees & Contractors:**
- NO sync to Gusto (they use separate payroll)
- WOP tracks salary info for reference only
- HR manages Indian payroll externally

### How Sync IDs Are Created & Managed

**Sync ID Creation Process:**

1. **Worker Created in WOP** (from Zoho or manually):
   ```
   Worker record created:
   - wop_worker_id: "worker-001" (generated by Firestore)
   - name: "John Smith"
   - email: "john@katbotz.com"
   - location: "US"
   - gusto_id: null (not yet synced)
   - gusto_sync_status: "pending"
   ```

2. **HR Activates Worker (marks as "Active")**:
   ```
   System trigger: Worker status = "Active"
   AND location = "US"
   AND worker_type = "Employee"
   → Auto-initiate Gusto sync
   ```

3. **WOP Sends to Gusto API**:
   ```
   POST /api/integrations/gusto/sync
   
   Request:
   {
     "wop_worker_id": "worker-001",
     "first_name": "John",
     "last_name": "Smith",
     "email": "john@katbotz.com",
     "department": "Engineering",
     "start_date": "2026-06-15",
     "salary": 120000
   }
   
   Gusto Response:
   {
     "gusto_employee_id": "emp-789456",
     "status": "created",
     "created_at": "2026-06-15T10:30:00Z"
   }
   ```

4. **WOP Stores Mapping** (critical for sync):
   ```
   workers/worker-001:
   {
     name: "John Smith",
     email: "john@katbotz.com",
     
     gusto_mapping: {
       gusto_id: "emp-789456",        ← Gusto's unique ID
       synced_at: "2026-06-15T10:30:00Z",
       sync_status: "synced",
       gusto_sync_enabled: true,
       last_sync: "2026-06-15T10:30:00Z"
     }
   }
   ```

**Real-Time Sync Process:**

When HR updates worker data (salary, department, etc.):

```
1. HR updates salary in WOP
   workers/worker-001: { salary: 125000 }

2. WOP detects change (Firestore trigger)
   → Initiates sync

3. WOP looks up Gusto ID
   → Find: gusto_id = "emp-789456"

4. WOP calls Gusto API with Gusto ID:
   PUT /api/employees/emp-789456
   
   {
     "salary": 125000,
     "updated_at": "2026-06-20T14:00:00Z"
   }

5. Gusto API response:
   {
     "status": "updated",
     "updated_at": "2026-06-20T14:00:00Z"
   }

6. WOP records sync:
   workers/worker-001: {
     gusto_mapping: {
       gusto_id: "emp-789456",
       last_sync: "2026-06-20T14:00:00Z",
       sync_status: "synced"
     }
   }
```

**Sync ID Storage Schema:**

```
workers/{worker_id}
  ├─ name: "John Smith"
  ├─ email: "john@katbotz.com"
  ├─ location: "US"
  ├─ worker_type: "Employee"
  │
  └─ gusto_mapping:
      ├─ gusto_id: "emp-789456" (Gusto's unique ID)
      ├─ gusto_sync_enabled: true
      ├─ sync_status: "synced" (or "pending", "failed")
      ├─ first_synced_at: "2026-06-15T10:30:00Z"
      ├─ last_sync: "2026-06-20T14:00:00Z"
      ├─ last_sync_fields: ["salary", "department"]
      ├─ sync_error: null (or error message if failed)
      └─ retry_count: 0
```

**Error Handling & Retry:**

```
Sync fails (network error, invalid data, etc.):

1. System catches error
2. Logs to audit_trail:
   {
     action: "gusto_sync_failed",
     worker_id: "worker-001",
     gusto_id: "emp-789456",
     error: "Invalid salary format",
     timestamp: "2026-06-20T14:05:00Z"
   }

3. Updates worker record:
   gusto_mapping.sync_status = "failed"
   gusto_mapping.sync_error = "Invalid salary format"
   gusto_mapping.retry_count = 1

4. Automatic retry:
   - Retry every 5 minutes for first hour
   - Then every 1 hour for 24 hours
   - After 24h, alert Senior HR

5. HR can manually retry:
   Button in WOP: "Retry Gusto Sync"
   → Retries immediately
```

**Sync Status States:**

```
pending   → Worker created, not yet synced to Gusto
syncing   → Currently syncing to Gusto
synced    → Successfully synced to Gusto
failed    → Sync failed, retrying
paused    → Sync manually paused by HR
inactive  → Worker inactive (not US), no sync

Example flow:
Worker created → pending
Worker activated → syncing
Gusto responds → synced
HR updates salary → syncing (re-syncing updates)
→ synced (updates complete)
```

**Manual Sync Trigger:**

HR can manually trigger sync from WOP UI:
```
Worker Profile → Actions → "Sync to Gusto Now"
→ System immediately sends to Gusto
→ Shows: "Syncing..." → "Synced ✓" or "Error ✗"
```

**Error Handling:**
- Sync fails → Log error, alert Senior HR, retry every 5 minutes for 24h
- Sync succeeds → Record last_sync_time, update gusto_status

**Updates Synced (Real-Time - US Employees Only):**
- Salary change: Within 30 seconds
- Department change: Within 30 seconds
- Job title change: Within 30 seconds
- Marked for exit: Immediate (sets termination date in Gusto)

---

## 7. COST BREAKDOWN (DETAILED)

### Google Cloud Services

**Firestore (Database)**
- Pricing: Per read/write operations
- Free tier: 50K reads, 20K writes, 20K deletes per day
- Estimated usage (50 workers): ~10K reads/day, ~1K writes/day
- Cost: ₹1-2/month (stays in free tier)
- Scaling: Each 100 workers adds ~₹1/month

**Cloud Storage (Backups)**
- Pricing: Per GB stored
- Free tier: 5 GB first month
- Daily backup size: ~50 MB per 50 workers
- Retention: 30 days = ~1.5 GB
- Cost: ₹0.50/month (within free tier)

**Cloud Run (Hosting)**
- Pricing: Per invocation, memory-second
- Free tier: 2M invocations, 360,000 GB-seconds per month
- Estimated: ~10K requests/day
- Cost: ₹1-2/month (stays in free tier)

**Google Drive (Documents)**
- Already included in KATBOTZ Workspace
- Cost: ₹0 (no additional charge)

**Google OAuth**
- Cost: ₹0 (Google provides free)

### Monthly Cost Summary
- 50 workers: ₹3-5/month
- 500 workers: ₹9-15/month (~$5-10 USD)
- 5,000 workers: ₹75-150/month
- Scaling: ₹2-3 per 100 employees added

---

## 8. WORKER TYPES WITH DISTINCTION

### Types & Requirements (5 Worker Types)

**1. Indian Employee**
- Required docs: PAN, Aadhaar, Degree, 10th/12th marksheets, Bank proof
- Salary: ₹ (Indian Rupees)
- Gusto: NO (separate payroll system)
- Invoices: NO
- Student ID: NO
- Review schedule: 30/60/90-day + annual
- Contracts: NO

**2. Indian Contractor**
- Required docs: PAN, Signed agreement, Bank proof
- Salary: ₹ (Indian Rupees)
- Gusto: NO (separate payroll)
- Invoices: YES (full approval workflow: Submitted → Approved → Finance Review → Paid)
- Student ID: NO
- Review schedule: Contract-based (renewal-focused)
- Contracts: YES (scope, rate, duration, amendments, renewal alerts 90/60/30/7 days)

**3. Indian Intern**
- Required docs: PAN, Aadhaar, Degree, 10th/12th marksheets, Student ID (required)
- Salary: ₹ (Indian Rupees) or stipend
- Gusto: NO (separate system)
- Invoices: NO
- Student ID: YES (required field for tracking)
- Review schedule: Weekly check-ins + monthly summaries
- Completion: PPO recommendation or exit (data retained 3 years after exit)
- Contracts: NO

**4. Global Contractor (US or International)**
- Required docs: Tax ID or equivalent, Signed agreement, Bank proof
- Salary: $ or equivalent
- Gusto: YES (US-based only) / NO (International - external payroll)
- Invoices: YES (full approval workflow: Submitted → Approved → Finance Review → Paid)
- Student ID: NO
- Review schedule: Contract-based (delivery-focused)
- Contracts: YES (scope, rate, duration, amendments, renewal alerts 90/60/30/7 days)

**5. Global Intern**
- Required docs: Tax ID or equivalent, Passport/ID, Degree, 10th/12th marksheets, Student ID (required)
- Salary: $ or ₹ equivalent
- Gusto: YES (if US-based) / NO (if international)
- Invoices: NO
- Student ID: YES (required field for tracking)
- Review schedule: Weekly check-ins + monthly summaries
- Completion: PPO recommendation or exit (data retained 3 years after exit)
- Contracts: NO

---

## 9. SYSTEM SPECIFICATIONS BY USER TYPE

### Worker (Employee/Contractor/Intern) View

**Login Page:**
- Email field (pre-filled: @katbotz.com)
- "Sign in with Google" button
- No password needed

**Dashboard Sections:**

**1. My Documents**
```
Document Type: PAN Card
  Status: Verified by Priya on June 23, 2026
  Action: ☑ Verified (cannot change)

Document Type: Aadhaar
  Status: Pending (waiting for HR review)
  Action: Upload / Re-upload button
  
Document Type: Degree
  Status: Rejected (reason: Marksheet not clear)
  Action: Re-upload button
```

**2. My Current Project**
```
Project Name: Mobile App Redesign
Project Lead: Akshat (assigned by HR)
Start Date: June 1, 2026
Status: In Progress
Description: [Project description]
```

**3. My Goals**
```
Goal 1: Complete API documentation
  Deadline: June 30, 2026
  Status: In Progress (50%)
  Last updated: June 23
  Action: Update / Mark Achieved

Goal 2: Code review 100 PRs
  Deadline: June 30, 2026
  Status: Not started
  Action: Update / Mark Achieved
```

**4. Weekly Summary**
```
Week of: June 17-23, 2026
Summary: [Text box, max 5000 chars]
  - Completed API endpoints
  - Reviewed 15 PRs
  - Fixed 3 bugs
[Save button]

Previous weeks: [Dropdown to view history]
```

**5. Performance**
```
My Rating: 4.5/5
Last Updated: June 20 by Akshat
Feedback: "Excellent work on API documentation"
[View history button]
```

**6. My Reviews**
```
30-Day Review (Due June 15)
  Status: Completed on June 15
  Rating: 4/5
  Feedback: "Good progress, needs to improve testing coverage"

60-Day Review (Due July 15)
  Status: Pending
  
90-Day Review (Due August 15)
  Status: Not due yet

Annual Review
  Status: Not due yet
```

**7. Personal To-Do**
```
☐ Set up local environment
☐ Read API documentation
☑ Deploy to staging
☐ Write unit tests
[+ Add new task button]
```

**8. Notifications**
```
- Your PAN document was verified by Priya (June 23, 10:30 AM)
- Your 60-day review is due in 5 days (July 15)
- Akshat updated your goals (June 22, 2:15 PM)
```

---

### HR View

**Dashboard:**
- List of all workers (searchable)
- Filter by: department, type, status
- Action buttons per worker: View, Edit, Verify docs, Mark exit

**Worker Profile (Detail View):**
- All worker information (read/edit)
- Document verification interface
- Goal management (view/edit)
- Performance rating (set/view)
- Reviews (fill/view)
- Contract renewal dates (set)
- Offboarding status

**Document Verification Interface:**
- List of pending documents
- Link to Google Drive (opens in new tab)
- Two buttons: "Mark Verified" or "Reject + Reason"
- Status history shows all previous reviews

**Analytics Dashboard:**
- Headcount by department
- Document completion rate
- Review completion rate
- Contract expiry schedule
- Offboarding status

---

## 9. DEPLOYMENT & HOSTING

**Platform:** Google Cloud Platform (GCP)

**Services Used:**
- Cloud Run (compute) - Frontend + Backend
- Firestore (database)
- Cloud Storage (backups)
- Cloud Logging (monitoring)
- Cloud NAT (internet access for API calls)

**Deployment:**
1. GitHub repo → Cloud Build → Auto-deploy on push
2. Frontend: Docker image → Cloud Run
3. Backend: Docker image → Cloud Run
4. No Vercel, no external hosting
5. Connected directly to KATBOTZ main page

**Domain:** workforce.katbotz.com (or subdomain)

**SSL/TLS:** Auto-managed by Google Cloud

---

## 10. SECURITY IMPLEMENTATION

**Authentication:**
- Google OAuth only (katbotz.com domain)
- No password storage
- 30-minute session timeout
- Browser-lifetime sessions

**Authorization:**
- 7-role based access control
- Role checked on every API request
- Firestore security rules enforce role-based access

**Data Encryption:**
- In transit: HTTPS/TLS (enforced)
- At rest: Google-managed encryption (Firestore default)
- Backups: CMEK (Customer-managed encryption key)

**Audit Trail:**
- All actions logged to audit_logs collection
- Includes: who, what, when, IP address
- Kept forever (for legal compliance)
- Access restricted to Senior HR only

**Access Control:**
- Worker: Can access only own profile
- Team Lead: Can access team members only
- HR: Can access all workers (read/verify documents)
- Senior HR: Full access (modify, delete, mark exit)
- Founder: Read-only access to all

---

## 11. PERFORMANCE REQUIREMENTS

**Page Load Time:** < 2 seconds

**API Response Time:** < 500ms

**Database Query:** < 100ms

**Concurrent Users:** 50+ simultaneously

**Uptime Target:** 99% (7 hours downtime allowed per month)

---

**Complete Technical Specification - Ready for Implementation**

