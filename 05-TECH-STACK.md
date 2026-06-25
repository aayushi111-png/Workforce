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

### Zoho Recruit Integration (AUTO-CREATE via Webhook)

**Purpose:** Auto-create worker when offer is accepted (no manual entry)

**What is a Webhook?**
A webhook is an automatic messenger between Zoho and WOP:
- When offer accepted in Zoho → Zoho automatically sends data to WOP
- WOP receives data and creates worker in seconds
- No manual HR work needed after initial setup

**Webhook Setup Process (2 Phases):**

**Phase 1: During WOP Development (Week 1-2)**
1. Create FastAPI endpoint in WOP backend:
   ```python
   @app.post("/api/zoho/worker-created")
   async def handle_zoho_webhook(request: Request):
       data = await request.json()
       # Validate, create worker, create Drive folder, send email
       return {"status": "success", "worker_id": worker_id}
   ```
2. Deploy to Cloud Run
3. URL becomes: `https://wop-backend.katbotz.com/api/zoho/worker-created`

**Phase 2: After WOP is Live (Week 3)**
1. Go to Zoho Recruit → Settings → Webhooks
2. Click [+ New Webhook]
3. Configure:
   - Name: "WOP Worker Creation"
   - Event: "Offer Status Changed to Accepted"
   - URL: https://wop-backend.katbotz.com/api/zoho/worker-created
   - Method: POST
4. Save
5. Test: Mark offer as "Accepted" in Zoho
6. Verify: Worker appears in WOP ✓

**Webhook Data Flow:**
```
Zoho Recruit System                    WOP Backend (FastAPI)
         │                                      │
         │ HR marks: "ACCEPTED"                 │
         │                                      │
         ├─ Webhook triggers ────────────────→ │
         │ (Automatic, no manual work)          │
         │                                      │
         │                              ✓ Receives data
         │                              ✓ Validates email
         │                              ✓ Creates worker in Firestore
         │                              ✓ Creates Drive folder
         │                              ✓ Sends welcome email
         │                              ✓ Logs in audit trail
         │                                      │
         │                              SUCCESS!
         │                          Worker Created Instantly!
```

**Webhook Endpoint:** `POST /api/zoho/worker-created`

**Data Received from Zoho:**
```json
{
  "zoho_candidate_id": "cand-12345",
  "candidate_name": "Rohan Mehta",
  "email": "rohan@katbotz.com",
  "position": "Software Engineer",
  "department": "Engineering",
  "joining_date": "2026-06-15",
  "employment_type": "Employee"
}
```

**Backend Processing Logic:**
```python
@app.post("/api/zoho/worker-created")
async def handle_zoho_webhook(request: Request):
    data = await request.json()
    
    # VALIDATION
    if not data.get("email") or not data.get("candidate_name"):
        return {"error": "Missing required fields"}
    
    if not data["email"].endswith("@katbotz.com"):
        return {"error": "Email must be @katbotz.com domain"}
    
    if data.get("employment_type") not in ["Employee", "Contractor", "Intern"]:
        return {"error": "Invalid employment type"}
    
    # CREATE WORKER
    worker_id = f"worker-{generate_unique_id()}"
    db.collection("workers").document(worker_id).set({
        "name": data["candidate_name"],
        "email": data["email"],
        "type": data["employment_type"],
        "position": data["position"],
        "department": data["department"],
        "joining_date": data["joining_date"],
        "created_from": "zoho_recruit",
        "zoho_id": data["zoho_candidate_id"],
        "status": "pending_documents",
        "created_at": datetime.now()
    })
    
    # CREATE GOOGLE DRIVE FOLDER
    folder_id = create_drive_folder(worker_id, data["candidate_name"])
    
    # SEND WELCOME EMAIL
    send_welcome_email(
        email=data["email"],
        name=data["candidate_name"],
        worker_id=worker_id
    )
    
    # LOG ACTION
    db.collection("audit_logs").add({
        "timestamp": datetime.now(),
        "action": "worker_created",
        "source": "zoho_webhook",
        "worker_id": worker_id,
        "worker_name": data["candidate_name"]
    })
    
    return {
        "status": "success",
        "message": f"Worker {data['candidate_name']} created",
        "worker_id": worker_id
    }
```

**Data Validation Rules:**
- Email must be @katbotz.com domain
- Name cannot be null/empty
- Joining date must be today or future
- Department must match known departments
- Employment type must be: Employee, Contractor, or Intern

**Error Handling:**
- Invalid data → Return 400 error, don't create worker
- Valid data → Create worker, return 200 + worker_id
- Webhook signature verification: Verify data really came from Zoho (security)
- Retry logic: If WOP unavailable, Zoho retries webhook

**Testing the Webhook:**
1. Mark test candidate as "Accepted" in Zoho
2. Check WOP database: Worker should appear in seconds
3. Check Firestore: Worker document created
4. Check audit logs: Action logged
5. Check email: Welcome email should be sent
6. Check Google Drive: Folder created

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

### Contract Management & Renewal Alerts (Contractors Only)

**Purpose:** Track contractor contracts and automatically alert HR before expiry

**Contract Data Stored in Firestore:**
```json
workers/contractor-001
{
  "name": "Rohan Contractor",
  "type": "Contractor",
  "contract": {
    "start_date": "2026-07-01",
    "renewal_date": "2026-12-31",      ← Key: Contract expiry date
    "duration_months": 6,
    "scope": "Build API endpoints",
    "rate": 500,                        ← ₹ or $ per hour/month
    "rate_type": "per_hour",
    "additional_sow": "Authentication module",
    "status": "active"
  },
  "renewal_alerts": {                  ← Tracks which alerts sent
    "alert_90-day": {
      "days_until_expiry": 90,
      "alerted_on": "2026-10-02T01:00:00Z",
      "alert_type": "90-day"
    },
    "alert_60-day": {...},
    "alert_30-day": {...},
    "alert_7-day": {...}
  }
}
```

**Renewal Alert System (Automated Daily Job):**

```python
@scheduler
def check_contract_renewals():
    """
    Runs EVERY DAY at 1:00 AM
    Checks all active contracts
    Sends alerts at 90, 60, 30, 7 days before expiry
    """
    
    today = datetime.now().date()
    
    # Get all contractors with active contracts
    contractors = db.collection("workers").where(
        "contract.status", "==", "active"
    ).get()
    
    for contractor_doc in contractors:
        contract = contractor_doc.get("contract")
        renewal_date = contract["renewal_date"]
        days_until_expiry = (renewal_date - today).days
        
        # Send alert at exact thresholds
        if days_until_expiry == 90:
            send_renewal_alert(contractor_doc, 90, "90-day")
        elif days_until_expiry == 60:
            send_renewal_alert(contractor_doc, 60, "60-day")
        elif days_until_expiry == 30:
            send_renewal_alert(contractor_doc, 30, "30-day")
        elif days_until_expiry == 7:
            send_renewal_alert(contractor_doc, 7, "7-day")
```

**What Gets Sent in Each Alert:**

```
90-DAY ALERT:
├─ In-portal notification: "Your contract expires in 90 days"
├─ Email to HR: Subject "Contract renewal: Rohan - 90 days"
├─ Shows: Contract scope, rate, current status
├─ Priority: Medium (planning stage)
└─ Data: Stored in renewal_alerts.alert_90-day

60-DAY ALERT:
├─ In-portal notification: "Your contract expires in 60 days"
├─ Email to HR: Subject "Contract renewal: Rohan - 60 days"
├─ Shows: Contract details + renewal discussion needed
├─ Priority: Medium (decision stage)
└─ Data: Stored in renewal_alerts.alert_60-day

30-DAY ALERT:
├─ In-portal notification: "Your contract expires in 30 days"
├─ Email to HR: Subject "Contract renewal: Rohan - 30 days"
├─ Shows: Full contract details + urgency
├─ Priority: Medium-High (final decision needed)
└─ Data: Stored in renewal_alerts.alert_30-day

7-DAY ALERT:
├─ In-portal notification: "⚠️ CONTRACT EXPIRES IN 7 DAYS"
├─ Email to HR: Subject "🔴 URGENT: Contract renewal - Rohan - 7 days"
├─ Shows: Contract details + final action deadline
├─ Priority: HIGH (last chance to act)
├─ Badge: Red "Expiring Soon" badge on contract
└─ Data: Stored in renewal_alerts.alert_7-day
```

**Alert Delivery:**

```python
def send_renewal_alert(contractor_doc, days_left, alert_type):
    # 1. Store alert record
    db.collection("workers").document(contractor_doc.id).update({
        f"renewal_alerts.alert_{alert_type}": {
            "days_until_expiry": days_left,
            "alerted_on": datetime.now(),
            "alert_type": alert_type
        }
    })
    
    # 2. Create in-portal notification
    db.collection("notifications").add({
        "worker_id": contractor_doc.id,
        "type": "contract_renewal_alert",
        "message": f"Contract expires in {days_left} days",
        "priority": "high" if days_left <= 7 else "medium",
        "created_at": datetime.now()
    })
    
    # 3. Send email to HR
    send_email(
        to="priya@katbotz.com",
        subject=f"Contract renewal: {contractor['name']} - {days_left} days",
        body=generate_alert_email(contractor, days_left)
    )
    
    # 4. Log in audit trail
    db.collection("audit_logs").add({
        "action": "contract_renewal_alert_sent",
        "worker_id": contractor_doc.id,
        "days_until_expiry": days_left,
        "alert_type": alert_type,
        "timestamp": datetime.now()
    })
```

**After Alert is Received - HR Options:**

```
HR clicks on contract and selects:

Option 1: RENEW
├─ Updates renewal_date: "2026-12-31" → "2027-12-31"
├─ Clears renewal_alerts (resets for new cycle)
├─ Status: "active" (continues)
├─ Logs: "Contract renewed by HR"
└─ Contractor notified: "Contract renewed"

Option 2: AMEND (Change terms)
├─ Select what changes:
│  ├─ Scope: "Build API" → "Build API + Auth"
│  ├─ Rate: 500 → 550
│  └─ Duration: 6 months → 12 months
├─ Records amendment with:
│  ├─ Old values
│  ├─ New values
│  ├─ Changed by: "Priya"
│  └─ Changed date: timestamp
├─ renewal_date updates based on new duration
├─ Clears renewal_alerts (resets for new cycle)
└─ Contractor notified: "Contract amended"

Option 3: EXPIRE (Don't renew)
├─ Status: "active" → "expired"
├─ contract_end_date: "2026-12-31"
├─ Data locked for 3 years
├─ Logs: "Contract expired naturally"
└─ Contractor notified: "Contract ended"
```

**Example Timeline:**

```
Contract Details:
- Expires: December 31, 2026
- Scope: Build API endpoints
- Rate: ₹500/hour

October 2, 2026 (90 days before)
└─ Scheduled Job Runs at 1 AM
   └─ Calculates: (Dec 31 - Oct 2) = 90 days
   └─ Sends: 90-day alert to HR
   └─ HR sees: "Plan for renewal"

November 1, 2026 (60 days before)
└─ Scheduled Job Runs at 1 AM
   └─ Calculates: (Dec 31 - Nov 1) = 60 days
   └─ Sends: 60-day alert to HR
   └─ HR sees: "Start renewal discussions"

December 1, 2026 (30 days before)
└─ Scheduled Job Runs at 1 AM
   └─ Calculates: (Dec 31 - Dec 1) = 30 days
   └─ Sends: 30-day alert to HR
   └─ HR sees: "Make renewal decision"

December 24, 2026 (7 days before)
└─ Scheduled Job Runs at 1 AM
   └─ Calculates: (Dec 31 - Dec 24) = 7 days
   └─ Sends: 7-DAY ALERT (HIGH PRIORITY) to HR
   └─ HR sees: "⚠️ URGENT - Contract expires in 7 days"
   └─ HR takes action: Renew / Amend / Expire

December 31, 2026 (Expiry Date)
└─ Contract expires
   └─ If renewed: new renewal_date set
   └─ If not renewed: status = "expired"
```

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
- Salary: ₹ INR (Indian Rupees only)
- Gusto: NO (separate payroll system)
- Invoices: NO
- Student ID: NO
- Review schedule: 30/60/90-day + annual
- Contracts: NO

**2. Indian Contractor**
- Required docs: PAN, Signed agreement, Bank proof
- Salary: ₹ INR (Indian Rupees only)
- Gusto: NO (separate payroll)
- Invoices: YES (full approval workflow: Submitted → Approved → Paid)
- Student ID: NO
- Review schedule: Contract-based (renewal-focused)
- Contracts: YES (scope, rate, duration, amendments, renewal alerts 90/60/30/7 days)
- Currency: ₹ (fixed, no conversion)

**3. Indian Intern**
- Required docs: PAN, Aadhaar, Degree, 10th/12th marksheets, Student ID (required)
- Salary: ₹ INR (Indian Rupees) or stipend
- Gusto: NO (separate system)
- Invoices: NO
- Student ID: YES (required field for tracking)
- Review schedule: Weekly check-ins + monthly summaries
- Completion: PPO recommendation or exit (data retained 3 years after exit)
- Contracts: NO
- Currency: ₹ (fixed, no conversion)

**4. Global Contractor (US or International)**
- Required docs: Tax ID or equivalent, Signed agreement, Bank proof
- Salary: $ USD (US) or EUR/GBP/other (International)
- Gusto: YES (US-based only, USD) / NO (International - external payroll)
- Invoices: YES (full approval workflow: Submitted → Approved → Paid)
- Student ID: NO
- Review schedule: Contract-based (delivery-focused)
- Contracts: YES (scope, rate, duration, amendments, renewal alerts 90/60/30/7 days)
- Currency: Auto-selected based on location (US=USD, EU=EUR, etc.)

**5. Global Intern**
- Required docs: Tax ID or equivalent, Passport/ID, Degree, 10th/12th marksheets, Student ID (required)
- Salary: $ USD (US) or EUR/GBP/₹ (International)
- Gusto: YES (if US-based, USD) / NO (if international)
- Invoices: NO
- Student ID: YES (required)
- Currency: Auto-selected based on location
- Review schedule: Weekly check-ins + monthly summaries
- Completion: PPO recommendation or exit (data retained 3 years after exit)
- Contracts: NO

---

## 8B. MULTI-CURRENCY SUPPORT (INR & USD + International)

### Supported Currencies

**Automatically Selected by Location:**
```
Location         → Auto Currency
────────────────────────────────
India            → ₹ INR
United States    → $ USD
Spain/EU         → € EUR
United Kingdom   → £ GBP
Canada           → $ CAD
Australia        → $ AUD
Other            → User selects
```

**Currency Rules:**

| Worker Type | Currency Options | Auto-Selected? | Conversion? |
|------------|------------------|-----------------|-------------|
| Indian Employee | ₹ INR only | YES | NO |
| Indian Contractor | ₹ INR only | YES | NO |
| Indian Intern | ₹ INR only | YES | NO |
| Global Contractor (US) | $ USD only | YES | NO |
| Global Contractor (Intl) | EUR/GBP/etc | User selects | NO |
| Global Intern (US) | $ USD only | YES | NO |
| Global Intern (Intl) | EUR/GBP/etc | User selects | NO |

**Important:** WOP stores native currency, no conversion. Finance team handles conversion externally if needed.

### How Currency Works in WOP

**1. At Worker Creation:**
```
HR clicks [Create Contractor]
        ↓
System asks: Location?
├─ India → Currency auto-set to ₹ INR
├─ US → Currency auto-set to $ USD
├─ EU (Spain) → Currency auto-set to € EUR
└─ Other → Currency dropdown to select

Rate Entry:
├─ Shows: "[₹/$/€] [amount] per hour/month"
├─ Stores: Numeric amount + currency code
└─ No conversion possible
```

**2. In Database (Firestore):**
```json
workers/contractor-001
{
  "name": "Rohan",
  "location": "India",
  "currency": "INR",
  "currency_symbol": "₹",
  
  "contract": {
    "rate": 500,
    "rate_currency": "INR",
    "rate_currency_symbol": "₹"
  }
}

workers/contractor-002
{
  "name": "John Smith",
  "location": "US",
  "currency": "USD",
  "currency_symbol": "$",
  
  "contract": {
    "rate": 50,
    "rate_currency": "USD",
    "rate_currency_symbol": "$"
  }
}

workers/contractor-003
{
  "name": "Maria",
  "location": "Spain",
  "currency": "EUR",
  "currency_symbol": "€",
  
  "contract": {
    "rate": 45,
    "rate_currency": "EUR",
    "rate_currency_symbol": "€"
  }
}
```

**3. In UI Display:**
```
HR Dashboard (Multi-Currency):
┌──────────────────────────────────┐
│ CONTRACTOR LIST                  │
├──────────────────────────────────┤
│ Name       | Location | Rate     │
├──────────────────────────────────┤
│ Rohan      | India    | ₹500/hr  │
│ John Smith | US       | $50/hr   │
│ Maria      | Spain    | €45/hr   │
└──────────────────────────────────┘

Contractor Invoice:
┌──────────────────────────────────┐
│ INVOICE #INV-2026-001            │
├──────────────────────────────────┤
│ Contractor: Rohan                │
│ Rate: ₹500/hour                  │
│ Hours: 160                       │
│ Total: ₹80,000 INR               │
│ Status: Submitted                │
└──────────────────────────────────┘
```

**4. Amendment with Currency Change:**
```
Original: ₹500/hour (India)
        ↓
HR marks: Location changed to US
        ↓
System updates:
├─ Currency: INR → USD
├─ Old rate: ₹500/hour recorded
├─ New rate: Enter in USD (e.g., $20/hour)
├─ Reason: Relocation
└─ Amendment records both currencies
```

### Currency & Integrations

**Gusto (US-Only):**
```
US Contractor:
├─ Currency: $ USD (auto)
├─ Rate stored: 50 (numeric)
├─ Gusto sync: YES
└─ Gusto receives: salary in USD

Indian Contractor:
├─ Currency: ₹ INR (auto)
├─ Rate stored: 500 (numeric)
├─ Gusto sync: NO
└─ Payroll: External system (not Gusto)

International Contractor (Spain):
├─ Currency: € EUR (user selected)
├─ Rate stored: 45 (numeric)
├─ Gusto sync: NO
└─ Payroll: External system
```

**Payroll & Invoices:**
```
Indian Contractor Invoice:
├─ Amount in ₹ INR
├─ No USD conversion
└─ Finance handles if needed

US Contractor Invoice:
├─ Amount in $ USD
├─ Syncs to Gusto (USD)
└─ Payroll processed in Gusto

EU Contractor Invoice:
├─ Amount in € EUR
├─ No conversion
└─ Sent to external payroll
```

### Multi-Currency Reporting

**Monthly Payroll Report:**
```
By Currency (No Mixing):

INR (₹):
├─ Rohan (Contractor): ₹80,000
├─ Priya (Contractor): ₹72,000
└─ Total: ₹152,000

USD ($):
├─ John (Contractor): $8,000
├─ Sarah (Contractor): $8,800
└─ Total: $16,800

EUR (€):
├─ Maria (Contractor): €7,200
├─ Klaus (Contractor): €7,680
└─ Total: €14,880

Note: Finance team handles conversion if needed
```

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

