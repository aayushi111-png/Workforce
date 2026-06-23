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

## 3. DOCUMENT STORAGE (GOOGLE DRIVE)

### Folder Structure
```
KATBOTZ Workforce/
└── 2026/
    ├── Rohan Mehta/
    │   ├── PAN.pdf
    │   ├── Aadhaar.jpg
    │   ├── Degree.pdf
    │   ├── Marksheet_10th.pdf
    │   ├── Marksheet_12th.pdf
    │   └── Bank_Proof.pdf
    ├── Sara Lim/
    │   └── [documents...]
    └── [other workers]/
└── Archive/
    ├── 2025/
    │   └── [exited workers]
    └── [historical years]
```

### How Documents Flow
1. **Upload:** Worker uploads file → Cloud Run receives → Stores in Drive
2. **Verification:** HR clicks file in WOP → Opens Drive link → Reviews file → Marks status
3. **Status:** WOP tracks Pending/Verified/Rejected
4. **Link Storage:** WOP stores Google Drive link, not the file itself
5. **Access:** HR shares folder with worker (upload permission), HR has full access

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

### Gusto Integration (US Employees Only)

**Purpose:** Auto-sync US employee data to Gusto payroll system

**Applies To:** US-based employees only  
**Does NOT apply to:** Indian employees, contractors, interns

**Data Flow (WOP → Gusto):**
1. US employee activated in WOP
2. WOP calls Gusto API: POST /employees
3. Sends: name, email, department, joining date, salary
4. Gusto creates payroll record
5. Initiates tax form collection (W4, state taxes, etc.)

**Sync Endpoint:** `POST /api/integrations/gusto/sync`

**Data Sent to Gusto (US Employees Only):**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@katbotz.com",
  "department": "Engineering",
  "start_date": "2026-06-15",
  "salary": 120000,
  "location": "US"
}
```

**Indian Employees & Contractors:**
- NO automatic sync to Gusto
- Payroll handled separately (not in scope)
- WOP tracks salary info for reference only
- HR manages Indian payroll externally

**Error Handling:**
- Sync fails → Log error, alert Senior HR, retry hourly for 24h
- Sync succeeds → Record gusto_id, mark synced

**Updates Synced (US Employees Only):**
- Salary change: Within 1 hour
- Department change: Within 1 hour
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

## 8. SYSTEM SPECIFICATIONS BY USER TYPE

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

