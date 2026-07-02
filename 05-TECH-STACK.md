# COMPLETE TECHNICAL SPECIFICATION

---

## 0. COST SUMMARY: Are These Services Free?

### **HONEST ANSWER: NO, NOT ALL FREE — But Very Cheap**

| Service | Free? | Free Tier | Cost After | Your Cost |
|---------|-------|-----------|-----------|-----------|
| **Firestore** | ❌ No | 50K reads/day | ₹6/million | ₹1-2/month |
| **Cloud Storage** | ❌ No | 5 GB/month | ₹0.17/GB | ₹0.50/month |
| **Cloud Run** | ❌ No | 2M invokes/mo | ₹0.40/100k | ₹1-2/month |
| **Google Drive** | ✅ Yes | Included in Workspace | N/A | ₹0 |
| **Google OAuth** | ✅ Yes | Unlimited | N/A | ₹0 |
| **Audit Logs** | ✅ Yes | Unlimited | N/A | ₹0 |

### **What You Actually Pay**

**Per Month (50 workers):**
```
Firestore:    ₹1-2
Cloud Storage: ₹0.50
Cloud Run:     ₹1-2
──────────────────
TOTAL:         ₹3-5/month (~$0.04-0.06 USD)
```

**Per Month (500 workers):**
```
Firestore:    ₹4-6
Cloud Storage: ₹3-5
Cloud Run:     ₹3-5
──────────────────
TOTAL:         ₹9-15/month (~$5-10 USD)
```

**Key Point:** Even with costs, it's **DRAMATICALLY cheaper** than:
- Zoho People: ₹500-1000/employee/month
- Workday: ₹10,000+/month
- ADP: ₹5,000-8,000/month

WOP cost for 500 workers: **₹9-15/month**  
Alternative HRMS: **₹250,000+/month**

**Savings: 99.99% cheaper** ✓

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

## 3. DOCUMENT STORAGE: TWO-TIER SYSTEM (Primary + Backup)

### Storage Architecture (VERY SPECIFIC RETENTION)

| Storage | Location | What | How Long | Purpose | Encrypted |
|---------|----------|------|----------|---------|-----------|
| **PRIMARY** | Cloud Storage | Actual documents | 3 YEARS after exit | Long-term legal retention | ✓ CMEK |
| **BACKUP** | Google Drive | Daily snapshots | 30 days (rolling) | Disaster recovery only | ✓ AES-256 |
| **AUDIT TRAIL** | Firestore | All actions | FOREVER | Compliance & proof | ✓ CMEK |

---

### PRIMARY STORAGE: Google Cloud Storage (3-Year Retention)

**Location:** `gs://katbotz-workforce-docs/`

**Structure:**
```
gs://katbotz-workforce-docs/
└── 2026/
    ├── worker-id-001/
    │   ├── pan.pdf (v1, v2, v3 - all kept for 3 years)
    │   ├── aadhaar.jpg (v1, v2 - all kept for 3 years)
    │   ├── degree.pdf
    │   ├── marksheet_10th.pdf
    │   ├── marksheet_12th.pdf
    │   ├── bank_proof.pdf
    │   └── contract.pdf (3 versions)
    ├── worker-id-002/
    │   └── [all documents...]
    └── [other workers]/
```

**Retention Policy (SPECIFIC):**
```
Timeline:
├─ Day 0: Worker exits (e.g., June 30, 2026)
├─ Days 1-1095 (3 years): Documents kept in Cloud Storage
│  └─ Accessible to HR
│  └─ All versions kept
│  └─ All access logged
├─ Day 1096 (June 30, 2029): Auto-delete execution
│  └─ Lifecycle policy triggers
│  └─ All files deleted from Cloud Storage
│  └─ All versions deleted
│  └─ Backup copies also deleted
│  └─ Deletion logged in audit trail
└─ Forever: Audit trail kept (proof of deletion)

Key Point: Documents stay for EXACTLY 3 YEARS (1095 days)
           Then auto-deleted (no manual action)
           Audit proof kept forever
```

**Encryption:** CMEK (Customer-Managed Encryption Keys)  
**Versioning:** Enabled (all versions kept for 3 years)  
**Audit Logging:** Complete access history  
**Cost:** ₹1-3/month for 50-500 workers  

---

### BACKUP STORAGE: Google Drive (30-Day Rolling Only)

**Location:** `KATBOTZ Workforce Backups/`

**Structure:**
```
KATBOTZ Workforce Backups/
└── 2026/ (changes daily)
    ├── Jun-23-2026/ (daily snapshot)
    │   ├── Rohan Mehta/
    │   │   └── [copies of documents as of Jun 23]
    │   ├── Sara Singh/
    │   │   └── [copies of documents as of Jun 23]
    │   └── [other workers...]
    │
    ├── Jun-24-2026/ (next day's snapshot)
    │   └── [documents from Jun 24...]
    │
    └── Jun-30-2026/ (most recent)
        └── [latest documents...]

Oldest kept: Last 30 days only
Auto-deleted: Backups older than 30 days
```

**Retention Policy (VERY SPECIFIC):**
```
Timeline Example:
├─ Jun 1: Backup created (day 1 of 30)
├─ Jun 15: Backup created (day 15 of 30) 
├─ Jun 30: Backup created (day 30 of 30)
├─ Jul 1: NEW backup created
│  └─ Jun 1 backup AUTO-DELETED (31 days old)
│  └─ Only last 30 days kept
├─ Jul 15: Backup created (day 30)
├─ Aug 1: NEW backup created
│  └─ Jun 2 backup AUTO-DELETED
│  └─ Rolling window: always last 30 days

Key Point: Drive backups are ROLLING (30 days)
           Not cumulative
           Old backups auto-deleted
           For disaster recovery ONLY (not long-term)
```

**Encryption:** AES-256 (Google Workspace standard)  
**Frequency:** Daily at 2:00 AM UTC  
**Retention:** 30-day rolling window (auto-delete old)  
**Purpose:** Disaster recovery if Cloud Storage corrupted  
**Cost:** Included in Google Workspace  

---

### AUDIT TRAIL: Firestore (FOREVER Retention)

**Location:** Firestore `audit_logs` collection

**What's Logged:**
```
Every action tracked:
├─ Jun 20: Worker uploaded PAN
├─ Jun 23: HR verified PAN
├─ Jun 30: Worker marked for exit
├─ Jun 30, 2029: Worker data deleted
│  └─ File: pan.pdf deleted
│  └─ File: aadhaar.jpg deleted
│  └─ All documents: DELETED
│  └─ Audit entry: Proof of deletion
└─ Kept FOREVER (legal proof)
```

**Retention:** PERMANENT (never deleted)  
**Encryption:** CMEK  
**Purpose:** Legal compliance & litigation defense  

---

### How Documents Flow (Detailed)

```
════════════════════════════════════════════════════════════
STEP 1: Upload (Worker uploads PAN)
════════════════════════════════════════════════════════════
Worker uploads → Cloud Run receives
        ↓
Stored: Cloud Storage (PRIMARY)
└─ Location: gs://katbotz-workforce-docs/2026/worker-001/pan.pdf
└─ Encryption: CMEK (immediate)
└─ Retention: 3 YEARS from now
└─ Status: Kept until Jun 30, 2029

════════════════════════════════════════════════════════════
STEP 2: Access (HR verifies document)
════════════════════════════════════════════════════════════
HR clicks [View] → Signed URL generated (1 hour)
        ↓
Document viewed: Cloud Storage via secure URL
        ↓
HR marks: Verified ✓
        ↓
Stored: Firestore metadata (encrypted)
├─ Status: Verified
├─ Verified by: Priya
├─ Verified date: Jun 23, 2026
└─ Audit log: Access logged

════════════════════════════════════════════════════════════
STEP 3: Backup (Daily 2:00 AM automated export)
════════════════════════════════════════════════════════════
Scheduled job at 2:00 AM:
  │
  ├─ Reads: All documents from Cloud Storage
  ├─ Exports: Copy to Google Drive
  │  └─ Location: KATBOTZ Backups/2026/Jun-23/[worker]/
  │  └─ Retention: 30-day rolling (auto-delete old)
  │  └─ Purpose: Disaster recovery only
  │
  └─ Keeps: Last 30 days of backups

════════════════════════════════════════════════════════════
STEP 4: Retention (3 Years)
════════════════════════════════════════════════════════════
After worker exits (Jun 30, 2026):

Cloud Storage (PRIMARY):
├─ Document kept: Jun 30, 2026 → Jun 30, 2029 (exactly 3 years)
├─ Location: gs://katbotz-workforce-docs/2026/worker-001/pan.pdf
├─ Encryption: CMEK
├─ Versioning: All versions kept (v1, v2, v3)
├─ Access: Available to HR (read-only)
└─ Purpose: Legal requirement (labor law)

Google Drive (BACKUP):
├─ Daily backups created (rolling 30-day)
├─ Oldest backup kept: Last 30 days
├─ Older backups: Auto-deleted
├─ Example: If last backup is Jul 30, all Jun backups gone
└─ Purpose: Disaster recovery ONLY

Firestore (AUDIT):
├─ All actions logged: Who, what, when
├─ Deletion scheduled: Jun 30, 2029
└─ Kept: FOREVER (legal proof)

════════════════════════════════════════════════════════════
STEP 5: Auto-Delete (Day 1096 = Jun 30, 2029)
════════════════════════════════════════════════════════════
Scheduled at 1:00 AM UTC:

Cloud Storage:
├─ Lifecycle policy triggered
├─ Deletes: gs://katbotz-workforce-docs/2026/worker-001/
│  └─ ALL files deleted
│  └─ ALL versions deleted (v1, v2, v3)
└─ Result: Folder empty, then folder deleted

Google Drive:
├─ Backup job finds: 30 days passed
├─ Deletes: KATBOTZ Backups/Jun-30 (and older)
├─ Result: No older backups kept
└─ Status: Disaster recovery data deleted

Firestore (AUDIT - NEVER DELETED):
├─ Adds entry: "Worker data deleted Jun 30, 2029"
├─ Logs: Complete history still available
└─ Kept: FOREVER (legal proof of deletion)

════════════════════════════════════════════════════════════
RESULT
════════════════════════════════════════════════════════════

✓ Documents: Deleted after 3 years (DPDP compliant)
✓ Backups: 30-day rolling (disaster recovery only)
✓ Audit Trail: Kept forever (legal proof)
✓ No manual action: All automatic

════════════════════════════════════════════════════════════
```

### Security & Compliance

**Cloud Storage Features (PRIMARY - 3 Years):**
- CMEK encryption (customer-managed encryption keys)
- Signed URLs (secure, temporary access links for HR)
- Audit logging (all access logged to Cloud Logging)
- Legal hold API (block deletion if litigation)
- Lifecycle policies (auto-delete after 1095 days, logged)
- Retention policies (DPDP compliance)

**Google Drive Features (BACKUP - 30 Days):**
- AES-256 encryption (Google Workspace standard)
- Daily automated export (no manual work)
- 30-day rolling retention (auto-delete old)
- Recovery capability (restore in 5 minutes)
- Workspace sharing (HR team access)

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

### Document Access Security: 4-Layer System

**Layer 1: CMEK Encryption (Customer-Managed Keys)**
**Layer 2: Signed URLs (Temporary Access)**
**Layer 3: Browser-Only Preview (No Downloads)**
**Layer 4: Complete Access Logging (Audit Trail)**

---

#### **LAYER 1: CMEK Encryption (At Rest)**

**What is CMEK?**
```
CMEK = Customer-Managed Encryption Keys

Encryption happens automatically:
├─ Every file uploaded
├─ Encrypted with AES-256 (military-grade)
├─ Keys managed by Google Cloud KMS
├─ KATBOTZ controls the keys (not Google)
└─ Files stay encrypted on disk forever

How it works:
├─ File uploads: Employee uploads pan.pdf
├─ Encryption applied: Immediately encrypted
├─ Storage: Encrypted on disk in Cloud Storage
├─ Key management: Keys in Google Cloud KMS
└─ Access: Only WOP app can decrypt (with key)

Result:
✓ Even Google engineers can't read files (without key)
✓ If storage is stolen, files are useless (encrypted)
✓ Keys are protected separately from files
✓ You control who has access to keys
```

**Key Management (Google Cloud KMS):**
```
Key Location: Google Cloud Key Management Service
├─ Stored: Secure hardware security modules
├─ Rotation: Automatic quarterly rotation
├─ Backup: Geo-redundant backups
├─ Access: Only WOP service account can use
└─ Logging: All key access logged

Example Timeline:
├─ File encrypted with Key-v1 (Q1 2026)
├─ Key rotated: Key-v2 created (Q2 2026)
├─ File automatically re-encrypted with Key-v2
├─ Key-v1 retired (still available for old files)
└─ All rotations logged and audited
```

---

#### **LAYER 2: Signed URLs (Temporary Access)**

**What is a Signed URL?**
```
Signed URL = Temporary access link
├─ Generated: Just-in-time (when HR clicks View)
├─ Validity: 1 hour (exact)
├─ Reusable: NO (one-time URL)
├─ Contains: Cryptographic signature
└─ Verification: Google verifies signature

Technical details:
├─ Algorithm: HMAC-SHA256 (cryptographic signature)
├─ Key: WOP's private key signs the URL
├─ Expiration: Unix timestamp (1 hour from now)
├─ Scope: Specific file only (pan.pdf, not all files)
└─ Permissions: Read-only (can't modify or delete)

Example URL:
https://storage.googleapis.com/
  katbotz-workforce-docs/
  2026/worker-001/pan.pdf
  ?X-Goog-Algorithm=GOOG4-RSA-SHA256
  &X-Goog-Credential=...
  &X-Goog-Date=20260623T103000Z
  &X-Goog-Expires=3600
  &X-Goog-SignedHeaders=host
  &X-Goog-Signature=abcd1234...
```

**Timeline: How Signed URLs Work**

```
10:30:00 AM - HR clicks [View Document] in WOP
└─ HR is viewing pan.pdf document

10:30:05 AM - WOP backend generates signed URL
├─ Creates: Cryptographically signed temporary URL
├─ Expiration: 1 hour from now (10:30:00 + 3600 seconds)
├─ Validity: This URL only valid for 1 hour
├─ File: pan.pdf only (no access to other files)
├─ Scope: WOP's service account only
└─ Action logged: "Generated signed URL for pan.pdf"

10:30:10 AM - Browser receives signed URL
└─ Opens in new tab: Google Cloud Viewer

10:30:30 AM - HR views document in browser
├─ Google Cloud Viewer displays: pan.pdf
├─ Access verified: Signature checked by Google
├─ Permissions: Read-only (no download button)
├─ Browser shows: Image/PDF preview
└─ Access logged: "HR viewed pan.pdf"

10:30:45 AM - HR reviews and marks Verified
├─ Returns to WOP
├─ Clicks [Verify]
├─ Closes viewer tab
└─ Signed URL no longer needed

10:31:00 AM - Signed URL still valid (30 seconds)
├─ Could click URL again: Still works (1 hour window)
└─ Would see: Same document preview

11:30:00 AM - Signed URL expires (EXACTLY 1 hour)
├─ URL becomes invalid
├─ If HR tries to use: "Access Denied"
├─ Message: "Signature expired"
└─ Status: NO access after 1 hour (ever)

11:30:01 AM - After expiration
├─ URL is dead
├─ Can't access with old URL
├─ Must generate new signed URL
└─ Triggers audit log entry: "New signed URL generated"
```

---

#### **LAYER 3: Google Cloud Viewer (Browser-Only, No Downloads)**

**How HR Sees Documents (Without Downloading)**

```
WOP Backend:
└─ Generates signed URL (1 hour validity)

Browser:
└─ Opens Google Cloud Viewer with signed URL

Google Cloud Viewer Interface:
┌──────────────────────────────┐
│ Pan Card - PAN001.pdf        │
├──────────────────────────────┤
│                              │
│    [IMAGE OF PAN CARD]       │
│    (Secure embedded viewer)  │
│                              │
│    No download button        │
│    No print option           │
│    No save option            │
│    No copy/paste             │
│    (Depends on file type)    │
│                              │
├──────────────────────────────┤
│ Page 1 of 1  [Navigation]    │
│ Zoom: [+] [-]               │
│ Full screen: [Open in new]  │
│ Back to WOP: [Close]        │
└──────────────────────────────┘

What HR CAN do:
✓ View document in browser
✓ Zoom in/out
✓ Navigate pages (if multi-page)
✓ Full screen viewing
✓ See document clearly

What HR CANNOT do:
✗ Download file to computer
✗ Save file locally
✗ Print document
✗ Copy/paste content
✗ Extract text
✗ Modify document
✗ Share document
✗ Forward link to others
```

**Why No Download?**

```
Security advantage:
├─ File never touches HR's computer
├─ No local copies to lose/leak
├─ No email sharing possible
├─ No forwarding to others
├─ No accidental uploads elsewhere
└─ Document stays in secure environment

Compliance advantage:
├─ Auditable: Can track exactly who viewed
├─ Temporal: Access limited (1 hour)
├─ Immutable: Can't save modified version
├─ Logged: Every access recorded
└─ Compliant: Meets data protection requirements
```

---

#### **LAYER 4: Complete Access Logging (Audit Trail)**

**What Gets Logged (Everything):**

```
Firestore audit_logs collection records:

DOCUMENT UPLOAD:
├─ Timestamp: 2026-06-20T14:30:00Z
├─ Action: "Document uploaded"
├─ Worker: "worker-001"
├─ Document: "pan.pdf"
├─ File size: "2.1 MB"
├─ Status: "Pending verification"
└─ IP address: "192.168.1.100"

SIGNED URL GENERATION:
├─ Timestamp: 2026-06-23T10:30:05Z
├─ Action: "Signed URL generated"
├─ Requestor: "priya@katbotz.com"
├─ Document: "worker-001/pan.pdf"
├─ Expiration: "2026-06-23T11:30:05Z"
├─ Validity period: "3600 seconds"
└─ IP address: "192.168.1.200"

DOCUMENT VIEW:
├─ Timestamp: 2026-06-23T10:30:30Z
├─ Action: "Document viewed"
├─ Viewer: "priya@katbotz.com"
├─ Document: "worker-001/pan.pdf"
├─ Viewer tool: "Google Cloud Viewer"
├─ Duration: "15 minutes"
└─ IP address: "192.168.1.200"

VERIFICATION:
├─ Timestamp: 2026-06-23T10:30:45Z
├─ Action: "Document verified"
├─ Verifier: "priya@katbotz.com"
├─ Document: "pan.pdf"
├─ Status changed: "Pending" → "Verified"
├─ Reason: "Clear image, readable"
└─ IP address: "192.168.1.200"

SIGNED URL EXPIRATION:
├─ Timestamp: 2026-06-23T11:30:00Z
├─ Action: "Signed URL expired"
├─ URL: "https://storage.googleapis.com/...abcd1234"
├─ Original expiration: "2026-06-23T11:30:05Z"
└─ Status: "Access denied" (if attempted after)
```

**What's Logged (Complete List):**

```
Access Events:
✓ Every file upload (who, when, what, size)
✓ Every signed URL generation (who, when, validity)
✓ Every document view (who, when, how long)
✓ Every verification action (who, when, result)
✓ Every rejection (who, when, reason)
✓ Every download attempt (yes/no/blocked)
✓ Every failed access attempt (who, when, why denied)

Metadata:
✓ Timestamp (exact second)
✓ User/Service account (who did it)
✓ Document path (which file)
✓ Action taken (what happened)
✓ Result (success/failure)
✓ IP address (where from)
✓ Duration (how long viewed)

Encryption:
✓ All audit logs encrypted (CMEK)
✓ Stored in Firestore (secure)
✓ Never deleted (forever retention)
✓ Immutable (can't be changed)
```

**Audit Trail Access:**

```
Who can see audit logs?

Founder:
✓ Full access to all audit logs
✓ Can filter by date, user, document
✓ Can download reports
✓ Can analyze patterns

Senior HR:
✓ Full access to all audit logs
✓ Can filter by worker, document
✓ Can see who viewed what
✓ Can audit document verification

HR:
✓ View own actions only
✓ See document verification history
✓ Cannot see other HR's actions

Everyone else:
✗ No access to audit logs

System:
✓ Automated checks (lifecycle job)
✓ Compliance reporting
✓ Legal hold verification
```

---

### **COMPLETE SECURITY FLOW (All 4 Layers)**

```
════════════════════════════════════════════════════════════
STEP 1: WORKER UPLOADS DOCUMENT
════════════════════════════════════════════════════════════

Worker clicks [Upload] → Selects pan.pdf (2.1 MB)

Layer 1 (Encryption):
├─ File sent to WOP: Encrypted during transit (HTTPS)
├─ WOP receives: pan.pdf
├─ Cloud Storage stores: WITH CMEK encryption applied
├─ Result: Encrypted at rest on disk
└─ Audit log: "Document uploaded - encrypted"

Layer 4 (Logging):
├─ Logs: "worker-001 uploaded pan.pdf"
├─ Timestamp: 2026-06-20T14:30:00Z
├─ File size: 2.1 MB
└─ Status: Pending verification

════════════════════════════════════════════════════════════
STEP 2: HR CLICKS [VIEW DOCUMENT]
════════════════════════════════════════════════════════════

Priya (HR) in WOP clicks [View Document] for pan.pdf

Layer 2 (Signed URL):
├─ WOP backend generates: Cryptographically signed URL
├─ Validity: Exactly 1 hour (3600 seconds)
├─ Signature: HMAC-SHA256 with WOP's private key
├─ Scope: Only pan.pdf (not other files)
└─ Example: https://storage.googleapis.com/...?X-Goog-Expires=3600&X-Goog-Signature=abcd1234

Layer 3 (Viewer):
├─ Browser opens: Google Cloud Viewer
├─ Shows: pan.pdf image/PDF preview
├─ No download button: Secure viewing only
├─ Available: 1 hour from generation

Layer 4 (Logging):
├─ Logs: "Signed URL generated for worker-001/pan.pdf"
├─ Generated by: priya@katbotz.com
├─ Expires: 2026-06-23T11:30:00Z
└─ Purpose: Document verification

════════════════════════════════════════════════════════════
STEP 3: HR VIEWS DOCUMENT IN BROWSER
════════════════════════════════════════════════════════════

Priya views pan.pdf in Google Cloud Viewer for 15 minutes

Layer 1 (Encryption):
├─ Cloud Storage retrieves: Encrypted file from disk
├─ Decryption: Uses CMEK key from Google Cloud KMS
├─ Only WOP can decrypt: Has credentials to access key
├─ Stream: Decrypted data sent to Priya over HTTPS

Layer 3 (Viewer):
├─ Preview: Document shown in secure Google viewer
├─ Interface: No save/download/print options
├─ Display: PDF/image rendered in browser
├─ Copy protection: Can't copy text (if enabled)

Layer 4 (Logging):
├─ Logs: "Viewed document" every 30 seconds
├─ Viewer: priya@katbotz.com
├─ Document: worker-001/pan.pdf
├─ Duration: 15 minutes total
├─ IP: 192.168.1.200
└─ Tool: Google Cloud Viewer

════════════════════════════════════════════════════════════
STEP 4: HR CLICKS [VERIFY] OR [REJECT]
════════════════════════════════════════════════════════════

Priya clicks [Verify] - Document clear and readable

Layer 1 (Encryption):
├─ Verification record: Encrypted before storage
├─ Firestore writes: Status "Verified" + CMEK encryption
└─ Result: Encrypted in database

Layer 4 (Logging):
├─ Logs: "Document verified"
├─ Verifier: priya@katbotz.com
├─ Document: worker-001/pan.pdf
├─ Status change: "Pending" → "Verified"
├─ Time: 2026-06-23T10:30:45Z
└─ Timestamp: Immutable audit entry

════════════════════════════════════════════════════════════
STEP 5: WHAT HAPPENS AFTER 1 HOUR
════════════════════════════════════════════════════════════

Original signed URL expires at: 2026-06-23T11:30:00Z

If Priya tries to use same URL after expiration:
├─ Google Cloud Storage checks: URL signature
├─ Verifies: Expiration timestamp
├─ Result: "Access Denied - Signature expired"
├─ HTTP: 403 Forbidden
└─ Audit: "Signed URL access attempt - DENIED (expired)"

If Priya needs to view again:
├─ Clicks [View Document] again in WOP
├─ WOP generates: NEW signed URL (new 1-hour window)
├─ Opens: Viewer again with fresh URL
└─ Audit: "New signed URL generated"

════════════════════════════════════════════════════════════
STEP 6: AUDIT TRAIL (FOREVER)
════════════════════════════════════════════════════════════

Complete audit record (never deleted):

Timeline:
├─ 2026-06-20 14:30: Uploaded by worker-001
├─ 2026-06-23 10:30: Signed URL generated by priya
├─ 2026-06-23 10:30-10:45: Viewed by priya (15 min)
├─ 2026-06-23 11:00: Expired access attempt - DENIED
├─ 2026-06-23 11:05: New signed URL generated by priya
├─ 2026-06-23 11:05-11:10: Viewed by priya (5 min)
├─ 2026-06-23 11:10: Verified by priya
└─ Forever: All entries kept (legal proof)

Evidence:
✓ Proof of upload (date, size, person)
✓ Proof of access (who, when, duration)
✓ Proof of verification (who, when, result)
✓ No tampering possible (encrypted, immutable)

════════════════════════════════════════════════════════════
SECURITY RESULT
════════════════════════════════════════════════════════════

✓ File encrypted at rest (CMEK - military-grade)
✓ Access encrypted in transit (HTTPS TLS 1.3)
✓ Preview secure (browser-only, no download)
✓ Access temporary (1-hour signed URLs)
✓ All access logged (complete audit trail)
✓ Forever record (legal compliance)
✓ Immutable history (can't be changed)

Security Chain:
Layer 1: CMEK Encryption (file protected)
Layer 2: Signed URLs (temporary access only)
Layer 3: Browser Preview (no local copies)
Layer 4: Audit Logging (complete history)

Result: Military-grade security for documents
════════════════════════════════════════════════════════════
```

---

### **Summary: 4-Layer Security**

| Layer | What | How | Result |
|-------|------|-----|--------|
| **1. CMEK Encryption** | File at rest | AES-256 with managed keys | Even Google can't read (without key) |
| **2. Signed URLs** | Access control | 1-hour cryptographic signatures | Temporary access, not reusable |
| **3. Browser Viewer** | Download prevention | Google Cloud Viewer, no buttons | No local copies, no sharing |
| **4. Audit Logging** | Accountability | All access recorded, encrypted | Complete history, legal proof |

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

## 5. BACKUP & RECOVERY STRATEGY (Redundant 3-Layer System)

### **Overview: Triple Backup for Every Data Type**

```
Data Type                Where Stored            Retention        Recovery Time
─────────────────────────────────────────────────────────────────────────────
Documents (Files)        Cloud Storage (Primary) 3 YEARS           N/A (Primary)
Documents (Backup)       Google Drive (Backup)   30 days rolling   ~5 min restore
Database (Primary)       Firestore               Live              N/A (Primary)
Database (Backup)        Cloud Storage Export    30 days           ~5 min restore
Audit Trail              Firestore               Forever           N/A (Primary)
```

---

### **LAYER 1: DOCUMENTS (Already Have 2 Backups)**

**Primary Storage:**
```
Cloud Storage: gs://katbotz-workforce-docs/
├─ All documents stored here
├─ CMEK encrypted
├─ 3-year retention (not backup)
├─ Versioning enabled (all versions kept)
└─ If corrupted: Restore from Google Drive backup
```

**Backup #1: Google Drive**
```
Daily automated export (2:00 AM):
├─ What: Copy of all documents
├─ Where: KATBOTZ Workspace Backups/2026/[date]/
├─ Retention: 30-day rolling
├─ Recovery: Download from Drive (5-10 minutes)
└─ If needed: GCP admin can restore files
```

**Recovery Scenario - Cloud Storage Corruption:**
```
Time: 2:00 AM Daily backup runs
├─ Checks: Is Cloud Storage okay?
│  ├─ If YES: Proceed with normal backup
│  └─ If NO: Alert raised
│
Recovery Process (if Cloud Storage corrupted):
├─ Step 1: Identify corruption (2 hours)
├─ Step 2: Access Google Drive backup
├─ Step 3: Download files from Drive (5-10 min)
├─ Step 4: Re-upload to Cloud Storage (5-10 min)
├─ Total recovery: ~20-30 minutes
└─ Downtime: ~15-20 minutes (during re-upload)
```

---

### **LAYER 2: DATABASE BACKUP (Firestore)**

**Primary Storage:**
```
Firestore (Live Database):
├─ Stores: Worker profiles, goals, reviews, metadata
├─ Always online: Real-time updates
├─ Redundancy: Google auto-replicates across regions
├─ SLA: 99.95% availability
└─ If corrupted: Restore from Cloud Storage backup
```

**Backup Process (Automatic Daily):**
```
Scheduled Job: Daily at 2:00 AM UTC
├─ Process: Firestore → JSON export
├─ Destination: gs://katbotz-backups/
├─ Backup name: firestore-2026-06-23.json
├─ Size: ~50 MB per 50 workers
├─ Encryption: CMEK
├─ Format:
│  {
│    "workers": [{...}, {...}],
│    "documents": [{...}, {...}],
│    "goals": [{...}, {...}],
│    "reviews": [{...}],
│    "audit_logs": [{...}, {...}]
│  }
└─ Verification: Checksum validated
```

**Retention Policy:**
```
Backups Kept: Last 30 days (rolling)

Example:
├─ Jun 1: Backup-001 (keep)
├─ Jun 2: Backup-002 (keep)
├─ Jun 15: Backup-015 (keep)
├─ Jun 30: Backup-030 (keep - last one)
├─ Jul 1: Backup-031 created
│         Backup-001 AUTO-DELETED (31 days old)
└─ Always: Latest 30 days available

Monthly test: Full restore to staging (verify integrity)
```

---

### **LAYER 3: HOW RECOVERY WORKS (5-Minute Process)**

**Scenario: Firestore Corrupted (Data Loss)**

```
MOMENT OF DISASTER:
├─ Time: 10:00 AM on June 25
├─ Issue: Firestore database corrupted
├─ Symptom: Can't query worker data
├─ Impact: WOP can't fetch any worker records
└─ Status: "ERROR: Database connection failed"

DETECTION (5-10 minutes):
├─ Alert triggered: Firestore health check fails
├─ Notification: "Firestore unavailable"
├─ HR gets: "System temporarily unavailable"
└─ Action: Check GCP console
```

**Recovery Steps (Total: ~5 minutes):**

```
Step 1: Access GCP Console (1 minute)
├─ Go to: console.cloud.google.com
├─ Project: katbotz-workforce
├─ Service: Firestore
└─ Tab: Backups

Step 2: Select Backup to Restore (1 minute)
├─ Shows: Last 30 daily backups
├─ Latest backup: June 24, 2:00 AM
│  └─ (less than 24 hours old)
├─ Click: "Restore"
└─ Confirm: "Yes, restore to June 24"

Step 3: Restore Executes (3 minutes)
├─ Process: JSON backup → Firestore restoration
├─ Database status: OFFLINE during restore
│  ├─ Duration: 2-3 minutes
│  ├─ User impact: "System temporarily unavailable"
│  └─ No writes possible during restore
├─ New data (Jun 24 2:00 AM to 10:00 AM):
│  ├─ Lost (8 hours of data loss)
│  ├─ BUT: Last backup was Jun 24 2:00 AM
│  ├─ Latest = 8 hours old
│  └─ RPO (Recovery Point Objective): 1 day max

Step 4: Verification (30 seconds)
├─ Firestore comes back online
├─ System checks: Database responding? YES ✓
├─ Query test: Can fetch workers? YES ✓
├─ Audit log: "Firestore restored from Jun-24 backup"
└─ Status: "System operational"

Step 5: Users Resume Work (1 minute)
├─ HR refreshes browser
├─ Dashboard loads: Data from backup ✓
├─ Workers appear: All records restored ✓
└─ Impact: Back to normal operations
```

---

### **ZERO DOWNTIME? Technically NO, Practically YES**

**Honest Answer:**

```
❌ NOT Zero Downtime:
├─ During restore: Firestore is OFFLINE
├─ Duration: 2-3 minutes
├─ User experience: "System temporarily unavailable"
├─ New writes: Blocked during restore
└─ Impact: 2-3 minute interruption

✅ But Practically "Zero Downtime":
├─ Frequency: Disasters rare (Google's SLA: 99.95%)
├─ Recovery speed: 5 minutes total (not hours/days)
├─ Data loss: Maximum 1 day (not months/years)
├─ Automation: No manual intervention needed
├─ Pre-tested: Monthly restore drills verify integrity
└─ Result: Quick, automatic recovery
```

**Comparison to "Zero Downtime":**

```
True Zero Downtime (not practical):
├─ Requires: Multi-region active-active setup
├─ Cost: 3-5x higher (₹50-100/month for WOP)
├─ Complexity: Significantly higher
├─ Benefit: No 2-3 minute outage
└─ For WOP: NOT justified (disaster rate ~0.01%/year)

Current Approach (5-minute RTO):
├─ Cost: ₹3-15/month (current budget)
├─ Complexity: Simple, automated
├─ Benefit: 99.95% availability (3-5 hours downtime/year)
└─ For WOP: Perfect balance of cost/benefit
```

---

### **Recovery Scenarios: What Can Be Restored?**

**Scenario 1: Firestore Data Loss**
```
Problem: Entire Firestore database corrupted
Recovery: Restore from Cloud Storage backup
├─ What restored: All records (workers, documents, goals)
├─ Time: 5 minutes
├─ Data loss: Maximum 1 day (latest backup)
├─ Documents: NOT affected (separate storage)
└─ Result: Full recovery
```

**Scenario 2: Documents Lost (Cloud Storage Corrupted)**
```
Problem: Cloud Storage files deleted/corrupted
Recovery: Restore from Google Drive backup
├─ What restored: All document files
├─ Time: 10-15 minutes
├─ Data loss: Maximum 1 day (latest Drive backup)
├─ Database: NOT affected (separate storage)
└─ Result: Full recovery
```

**Scenario 3: Both Cloud Storage AND Firestore Fail**
```
Problem: Multiple failures simultaneously
Recovery: 2-step process
├─ Step 1: Restore Firestore (5 min)
├─ Step 2: Restore documents from Drive (10 min)
├─ Total time: 15 minutes
├─ Data loss: Maximum 1 day (both backups same schedule)
└─ Result: Complete system recovery
```

**Scenario 4: Google Cloud Region Failure**
```
Problem: Entire Google Cloud region (e.g., us-central1) down
Recovery: Google auto-fails over to different region
├─ How: Firestore auto-replicates across regions
├─ Time: Automatic (less than 1 minute)
├─ Data loss: ZERO (no backup needed)
├─ Visibility: Might not even notice
└─ Result: Transparent recovery
```

---

### **Recovery Objectives (RTO / RPO)**

**RTO = Recovery Time Objective (How long to restore)**

```
Firestore backup restore: 5 minutes
├─ From: 1-30 days ago (30 daily backups kept)
├─ Method: 1-click in GCP console
├─ Automation: 100% automated
└─ Staffing: Needs 1 person (any GCP admin)

Documents backup restore: 10-15 minutes
├─ From: 1-30 days ago (30 daily Drive backups)
├─ Method: Download from Drive, re-upload
├─ Automation: Manual file download
└─ Staffing: Needs 1 person (any Drive user)

Target: Complete recovery within 5-15 minutes
```

**RPO = Recovery Point Objective (How much data lost)**

```
Firestore: Maximum 1 day
├─ Backup schedule: Daily 2:00 AM
├─ If disaster at 10:00 AM: Lose 8 hours
├─ If disaster at 2:10 AM: Lose 24 hours
└─ New data since backup: Lost

Documents: Maximum 1 day
├─ Backup schedule: Daily 2:00 AM
├─ Same as Firestore
└─ New files since backup: Lost

Acceptable for WOP? YES
├─ 8-24 hours of data loss is acceptable
├─ Recovery in 5-15 minutes is acceptable
└─ Automated recovery is acceptable
```

---

### **Testing & Verification**

**Monthly Restore Drill:**

```
Schedule: First Friday of each month

Process:
├─ Step 1: Select random backup (5-30 days old)
├─ Step 2: Restore to STAGING environment (test system)
├─ Step 3: Verify all data restored correctly
│  ├─ Check worker count matches
│  ├─ Check document count matches
│  ├─ Run integrity checks
│  └─ Sample queries
├─ Step 4: Document results
└─ Step 5: Keep test system running for 24 hours

Benefit:
✓ Proves backups work (catches corruption early)
✓ Tests restore process (identifies issues before needed)
✓ Trains team on recovery procedure
✓ Builds confidence in recovery capability
```

---

### **Comparison: WOP vs Enterprise HRMS**

| System | RTO | RPO | Cost | Complexity |
|--------|-----|-----|------|-----------|
| **WOP** | 5 min | 1 day | ₹3-15/mo | Simple (1-click) |
| Zoho People | 24 hrs | 24 hrs | ₹500+/mo | Complex (support needed) |
| Workday | 12 hrs | 1 hr | ₹10K+/mo | Very complex |
| SAP | 4 hrs | 30 min | ₹50K+/mo | Extremely complex |

**WOP advantage:** Quick, simple, automated recovery at fraction of cost

---

### **Summary: Backup & Recovery**

```
✓ 3-layer redundancy:
  └─ Cloud Storage primary (3-year retention)
  └─ Google Drive backup (30-day rolling)
  └─ Firestore backup (30-day rolling)

✓ Daily automated:
  └─ Firestore export: 2:00 AM UTC daily
  └─ Document backup: 2:00 AM UTC daily
  └─ No manual steps needed

✓ Fast recovery:
  └─ Firestore: 5 minutes (1-click restore)
  └─ Documents: 10-15 minutes
  └─ Total system: 15 minutes worst case

✓ Low data loss:
  └─ RPO: 1 day maximum (acceptable for HRMS)
  └─ Latest backup: Always less than 24 hours old

✓ Tested:
  └─ Monthly restore drills
  └─ Integrity verified
  └─ Team trained

NOT True Zero Downtime (2-3 min outage during restore)
BUT Practically Zero Downtime (restores happen rarely, last seconds)
```

---

## 6. INTEGRATION SPECIFICATIONS

### Gusto Integration (US Employees Only - REAL-TIME SYNC)

**IMPORTANT:** Gusto SYNCS existing workers (doesn't auto-create). Workers must already exist in WOP.

**Purpose:** Real-time sync of US employee payroll data between WOP and Gusto (30-second sync window)

**Applies To:** US-based employees ONLY  
**Does NOT apply to:** Indian employees, contractors, interns

---

## **HOW: 30-SECOND SYNC MECHANISM**

### **WOP → Gusto (HR Updates Trigger Sync)**

**Step 1: HR Updates in WOP (0 seconds)**
```
HR clicks on worker profile
├─ Updates: Salary $120,000 → $130,000
├─ Updates: Job Title "Engineer" → "Senior Engineer"
├─ Updates: Department "Engineering" → "Product"
└─ Clicks [Save Changes]
```

**Step 2: WOP Detects Change (0-2 seconds)**
```
WOP backend:
├─ Receives update request
├─ Validates: Is this a US employee? (checks location = "US")
├─ Validates: Is Gusto sync enabled? (checks gusto_sync_enabled = true)
├─ Validates: What changed? (salary, title, department)
└─ If valid: Proceed to sync

Status: Change detected, ready for sync
```

**Step 3: WOP Sends to Gusto API (2-5 seconds)**
```
WOP backend calls Gusto API:
├─ Endpoint: POST https://api.gusto.com/v1/employees/{id}
├─ Authentication: Bearer [Gusto API key]
├─ Method: PATCH (update only changed fields)
├─ Payload:
│  {
│    "salary": 130000,
│    "job_title": "Senior Engineer",
│    "department": "Product"
│  }
└─ Timeout: 10 seconds (retry if fails)
```

**Step 4: Gusto Receives & Processes (5-15 seconds)**
```
Gusto servers:
├─ Receive API request
├─ Validate: Employee exists in Gusto? ✓
├─ Validate: New salary within legal bounds? ✓
├─ Update Gusto database:
│  ├─ employees/john-smith/salary = 130000
│  ├─ employees/john-smith/job_title = "Senior Engineer"
│  └─ employees/john-smith/department = "Product"
├─ Mark: "Last sync: 2026-07-01 10:30:45 UTC"
└─ Return: 200 OK (success confirmation)
```

**Step 5: WOP Confirms Sync (15-20 seconds)**
```
WOP backend receives Gusto response:
├─ Status: 200 OK ✓
├─ Update Firestore:
│  └─ gusto_sync:
│     ├─ sync_status = "synced"
│     ├─ last_sync = "2026-07-01 10:30:45 UTC"
│     └─ last_sync_fields = ["salary", "job_title", "department"]
├─ Log audit trail: "Salary synced to Gusto: $120,000 → $130,000"
└─ HR sees: "✓ Synced to Gusto" (green checkmark)
```

**Step 6: HR Sees Confirmation (20-30 seconds total)**
```
WOP UI updates:
├─ Green checkmark appears: "✓ Synced to Gusto"
├─ Shows: "Last sync: just now"
├─ Shows: "Gusto has latest data"
└─ HR can close profile and continue

Total time: 30 seconds (or less)
```

**Full Timeline (John's Salary Increase Example):**
```
10:30:15 AM - HR clicks [Save Changes] (salary $120k → $130k)
10:30:17 AM - WOP detects change
10:30:19 AM - WOP sends to Gusto API
10:30:25 AM - Gusto processes & updates database
10:30:27 AM - Gusto confirms back to WOP
10:30:30 AM - HR sees "✓ Synced to Gusto"

Total: 15 seconds (within 30-second window)
```

---

## **HOW: GUSTO ALWAYS HAS LATEST DATA**

### **Real-Time Data Synchronization**

**Gusto's Database After Sync:**
```
Employee: John Smith
├─ Salary: $130,000 (UPDATED from WOP) ✓
├─ Job Title: Senior Engineer (UPDATED from WOP) ✓
├─ Department: Product (UPDATED from WOP) ✓
├─ Start Date: 2026-06-15 (unchanged)
├─ Location: US (unchanged)
├─ Last Sync: 2026-07-01 10:30:27 UTC
└─ Sync Status: CURRENT ✓

Next Payroll Run: Uses $130,000 (latest)
```

**What Happens If HR Updates Again (Same Day):**
```
10:45:00 AM - HR updates: Department "Product" → "Engineering"
10:45:05 AM - WOP detects change
10:45:07 AM - WOP sends to Gusto API
10:45:12 AM - Gusto updates: Department = "Engineering"
10:45:15 AM - Confirmation sent back to WOP

Gusto now has: 
└─ Latest salary ($130,000) ✓
└─ Latest title (Senior Engineer) ✓
└─ Latest department (Engineering) ✓

Status: ALWAYS UP-TO-DATE
```

### **Gusto's Sync Status Tracking**

**In Firestore (WOP's record of Gusto sync):**
```json
workers/john-smith/gusto_mapping
{
  "gusto_id": "emp-789456",
  "gusto_sync_enabled": true,
  "sync_status": "synced",              ← "synced" = current
  "first_synced_at": "2026-06-15T14:00:00Z",
  "last_sync": "2026-07-01T10:30:27Z",  ← Most recent sync
  "last_sync_fields": [
    "salary",
    "job_title", 
    "department"
  ],
  "sync_error": null,                    ← No errors
  "retry_count": 0,                      ← No retries needed
  "next_retry_at": null
}
```

**If Sync Fails (Gusto temporarily down):**
```json
{
  "sync_status": "pending",              ← Waiting to retry
  "last_sync": "2026-07-01T10:30:27Z",   ← Last successful sync
  "sync_error": "Connection timeout",    ← Why it failed
  "retry_count": 1,                      ← Attempted 1 retry
  "next_retry_at": "2026-07-01T10:35:27Z" ← Retry in 5 min
}

Retry Schedule:
├─ Attempt 1-12: Every 5 minutes (for 1 hour)
├─ Attempt 13-36: Every 1 hour (for 1 day)
├─ Attempt 37+: Manual review needed (escalate to HR)
└─ HR gets email: "Gusto sync failed for John Smith"
```

---

## **HOW: NEXT PAYCHECK CALCULATED WITH UPDATED INFO**

### **Payroll Calculation with Updated Salary**

**Before Update (Paycheck for June 30 - July 13):**
```
Employee: John Smith
Salary: $120,000 (annual)
Calculation:
├─ Annual salary: $120,000
├─ Per pay period (bi-weekly): $120,000 ÷ 26 = $4,615.38
├─ Gross pay (80 hours): $4,615.38
├─ Taxes withheld: ~$715
├─ Deductions: ~$500
└─ Net pay: ~$3,400

Pay date: July 15, 2026
Amount: $3,400 (with old salary)
```

**HR Updates Salary on July 1:**
```
10:30 AM - HR updates in WOP: $120,000 → $130,000
10:30:30 AM - ✓ Synced to Gusto
Gusto's database now reflects: $130,000
```

**After Update (Paycheck for July 14 - July 27):**
```
Employee: John Smith
Salary: $130,000 (UPDATED - synced from WOP)
Calculation:
├─ Annual salary: $130,000 (UPDATED)
├─ Per pay period (bi-weekly): $130,000 ÷ 26 = $5,000.00
├─ Gross pay (80 hours): $5,000.00 (INCREASED)
├─ Taxes withheld: ~$775 (higher due to higher gross)
├─ Deductions: ~$500
└─ Net pay: ~$3,725 (INCREASED by $325)

Pay date: July 28, 2026
Amount: $3,725 (with new salary)
Increase: +$325 compared to previous paycheck
```

### **Real-World Example: Salary Increase Impact**

**Scenario: John Gets Promotion on July 1**
```
Before (June 30 paycheck):
├─ Salary: $120,000/year
├─ Bi-weekly gross: $4,615.38
├─ Take-home: $3,400.00
└─ Pay date: July 15

Update on July 1 at 10:30 AM:
├─ HR updates WOP: Salary $120,000 → $130,000
├─ WOP syncs to Gusto (30-second sync)
├─ Gusto's payroll system updated
└─ Status: "✓ Synced to Gusto"

After (July 28 paycheck - NEXT PAY RUN):
├─ Salary: $130,000/year (from Gusto - synced from WOP)
├─ Bi-weekly gross: $5,000.00 (+$384.62)
├─ Take-home: $3,725.00 (+$325)
└─ Pay date: July 28

Year-to-Date (YTD) Impact:
├─ Increases by $325 per pay period
├─ Over 26 pay periods: +$8,450 extra per year
└─ Gusto shows updated YTD in next run
```

### **Gusto's Payroll Processing Timeline**

```
Timeline: John's Promotion

July 1, 10:30 AM:
└─ HR updates in WOP: Salary $130,000
└─ WOP syncs to Gusto (✓ synced)

July 1-27: Status in Gusto
└─ Employee records: $130,000 salary
└─ Next payroll setup: Uses $130,000

July 28, Payroll Run:
├─ Gusto processes bi-weekly payroll
├─ Looks up: John's salary from Gusto database
├─ Finds: $130,000 (synced from WOP on July 1)
├─ Calculates:
│  ├─ Gross: $130,000 ÷ 26 = $5,000.00 per period
│  ├─ Taxes: Calculated on $5,000
│  ├─ Deductions: Applied
│  └─ Net: $5,000 - taxes - deductions
├─ Generates: Pay stub with $5,000 gross
└─ Transfers: To John's bank account

July 28, John's Paycheck:
├─ Gross: $5,000.00 (reflecting promotion)
├─ Net: $3,725.00 (increased by $325)
└─ Status: "Based on updated salary from WOP"

July 28, WOP Shows:
├─ John's pay stub (read-only)
├─ Gross: $5,000.00
├─ Net: $3,725.00
├─ YTD Gross: $23,115.38 (updated)
└─ Source: "Synced from Gusto"
```

### **What Data Gets Used for Payroll?**

**Gusto Uses These Fields (All Synced from WOP):**
```
From WOP → To Gusto (for payroll calculation):
├─ Salary amount ($130,000)
├─ Pay frequency (bi-weekly)
├─ Job title (Senior Engineer) - for records
├─ Department (Product) - for cost center tracking
├─ Location (US) - for tax calculations
├─ Start date (2026-06-15) - for benefits eligibility
└─ Status (active) - to process payroll

Gusto Then Calculates:
├─ Gross pay per period: salary ÷ pay periods
├─ Federal income tax: Based on W4 + salary
├─ State income tax: Based on location + salary
├─ FICA (Social Security + Medicare): 7.65% of salary
├─ Benefits deductions: Health insurance, 401k, etc.
├─ Net pay: Gross - all deductions
└─ YTD totals: Running total for the year
```

---

## **SYNC FAILURES & RECOVERY**

### **If Gusto Temporarily Unavailable (What Happens)**

**Timeline: Gusto Down for 30 Minutes**

```
10:30 AM - HR updates salary in WOP
10:30:05 AM - WOP tries to send to Gusto API
10:30:10 AM - Gusto API timeout (Gusto down)
10:30:15 AM - Error: "Connection refused"

WOP Response:
├─ Status: sync_status = "pending"
├─ Error logged: "Gusto API unreachable"
├─ Retry scheduled: 5 minutes later
└─ HR notification: None yet (still retrying)

Retry Attempt 1 (10:35 AM):
├─ WOP retries: Still fails
└─ Retry scheduled: 5 minutes later

Retry Attempt 2 (10:40 AM):
├─ WOP retries: Still fails
└─ Retry scheduled: 5 minutes later

Gusto Comes Back Online (11:00 AM):

Retry Attempt 7 (11:00 AM):
├─ WOP sends update again
├─ Gusto receives and processes ✓
├─ Confirms back to WOP ✓
├─ sync_status = "synced"
└─ Last sync = "2026-07-01 11:00:42 UTC"

Result: Update eventually synced
        No manual action needed
        Gusto has latest data
```

### **Retry Logic**

```
Sync Failure Handling:
├─ Attempt 1-12: Retry every 5 minutes (1 hour total)
├─ Attempt 13-36: Retry every 1 hour (24 hours total)
├─ Attempt 37+: Send alert to HR (requires manual intervention)
│  └─ Email: "Gusto sync failed for [employee] after 24 hours"
│  └─ HR action: Check Gusto status, verify employee exists
│  └─ Manual sync: HR can trigger manual sync if needed
└─ Automatic resume: When Gusto comes back online, resume syncing

Safety: Never gives up (keeps retrying until HR intervenes)
```

---

## **SUMMARY: WOP → GUSTO REAL-TIME SYNC**

| Feature | Details |
|---------|---------|
| **Sync Time** | 30 seconds or less |
| **Trigger** | HR updates in WOP |
| **What Syncs** | Salary, job title, department, location, etc. |
| **Where** | US employees only (location = "US") |
| **Gusto Status** | Always has latest data from WOP |
| **Payroll Impact** | Next paycheck uses updated salary |
| **Failures** | Auto-retries every 5 min for 1 hour, then hourly |
| **No Manual Action** | Fully automatic, HR just clicks [Save] |

**Result: Gusto's payroll system is ALWAYS up-to-date with latest data from WOP** ✓

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

### Cost Breakdown: FREE TIERS + PAY-AS-YOU-GO

**NOT ALL FREE — Free tiers, then pay after limit:**

| Service | Free Tier | Cost After Free | Your Cost |
|---------|-----------|-----------------|-----------|
| **Firestore** | 50K reads/day | ₹6 per million ops | ₹1-2/month |
| **Cloud Storage** | 5 GB/month | ₹0.17/GB | ₹0.50/month |
| **Cloud Run** | 2M invocations/month | ₹0.40 per 100k | ₹1-2/month |
| **Google Drive** | Included in Workspace | N/A | ₹0 (already paid) |
| **Google OAuth** | Unlimited | N/A | ₹0 (free forever) |
| **Audit Logs** | Unlimited | N/A | ₹0 (free forever) |

**HONEST ANSWER: NOT FREE, BUT VERY CHEAP**

What's Free:
✓ Google OAuth: Completely free
✓ Audit logs: Completely free  
✓ Google Drive: Included in workspace (already paying)

What Costs (but stays in free tier for small use):
✓ Firestore: ₹1-2/month (free tier: 50K reads/day)
✓ Cloud Storage: ₹0.50/month (free tier: 5 GB/month)
✓ Cloud Run: ₹1-2/month (free tier: 2M invocations/month)

---

### Monthly Cost Summary (ACTUAL PRICES)

**For 50 workers:**
```
Firestore:    ₹1-2/month (within free tier)
Cloud Storage: ₹0.50/month (within free tier)
Cloud Run:     ₹1-2/month (within free tier)
Google OAuth:  ₹0 (free)
Audit logs:    ₹0 (free)
Google Drive:  ₹0 (workspace included)
──────────────────────────────
TOTAL:         ₹3-5/month (~$0.04-0.06 USD)
```

**For 500 workers:**
```
Firestore:    ₹4-6/month (uses more operations)
Cloud Storage: ₹3-5/month (larger backups)
Cloud Run:     ₹3-5/month (more requests)
Google OAuth:  ₹0 (free)
Audit logs:    ₹0 (free)
Google Drive:  ₹0 (workspace included)
──────────────────────────────
TOTAL:         ₹9-15/month (~$5-10 USD)
```

**For 5,000 workers:**
```
Firestore:    ₹30-50/month (significant ops)
Cloud Storage: ₹15-25/month (large backups)
Cloud Run:     ₹25-50/month (many requests)
Google OAuth:  ₹0 (free)
Audit logs:    ₹0 (free)
Google Drive:  ₹0 (workspace included)
──────────────────────────────
TOTAL:         ₹75-150/month (~$40-75 USD)
```

**Scaling Rule:**
```
Each 100 workers added: +₹2-3/month
(Linear scaling, free tiers very generous)
```

---

### Why So Cheap?

**Free tier limits are HUGE for small-medium companies:**

Firestore:
- Free: 50K reads, 20K writes, 20K deletes PER DAY
- 50 workers use: ~10K reads/day, ~1K writes/day
- Result: Stay in free tier ✓

Cloud Storage:
- Free: 5 GB first month, then ₹0.17/GB
- 50 workers (50 MB/day backup): ~1.5 GB/month
- Result: Stay in free tier ✓

Cloud Run:
- Free: 2M invocations/month
- WOP: ~10K requests/day = ~300K/month
- Result: Stay in free tier ✓

**Even 500 workers stay mostly in free tiers!**

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

