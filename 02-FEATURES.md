# FEATURES — What You Can Do

---

## 1. LOGIN & SECURITY

**How:** Click "Sign in with Google" → enter @katbotz.com email → authenticate through Google

**Who:** Anyone with @katbotz.com email (external emails blocked)

**Access:** Automatically routed to role:
- Workers: See only their own profile, projects, documents
- HR: See all workers, all documents, all projects
- Team Leads: See only their team members
- Founder: Full authority — can make any changes to any data

**Security Features:**
- ✓ No passwords stored in WOP (Google handles authentication)
- ✓ OAuth tokens expire automatically (no indefinite access)
- ✓ Only @katbotz.com domain allowed (prevents unauthorized access)
- ✓ All data encrypted in transit (HTTPS)
- ✓ If employee enables 2FA in Google Account, WOP inherits that protection
- ✓ Industry-standard authentication (trusted by Fortune 500 companies)
- ✓ Even if WOP is compromised, no passwords to steal

**Data Retention (3 Years After Exit):**
- ✓ All projects assigned to worker → Saved with worker data
- ✓ All goals set for worker → Saved with worker data
- ✓ All reviews completed → Saved with worker data
- ✓ All documents uploaded → Saved with worker data
- ✓ All invoices submitted → Saved with worker data
- ✓ All work summaries written → Saved with worker data
- ✓ Complete audit trail of all actions → Saved forever (legal compliance)
- ✓ Auto-deleted after 3 years → DPDP Act compliant
- ✓ Audit logs prove when deletion occurred

**Example:**
```
Employee: Rohan Mehta
Exit Date: June 30, 2026

All his data saved:
├─ Projects: Mobile App Redesign, API Development
├─ Goals: 5 goals with completion status
├─ Reviews: 30-day, 60-day, 90-day reviews
├─ Documents: PAN, Aadhaar, Degree, Marksheets, Bank proof
├─ Performance ratings and feedback
├─ Weekly summaries (26 weeks)
├─ Audit trail: Every action logged with timestamp
└─ Auto-delete date: June 30, 2029 (3 years later)

Why 3 years?
├─ Legal compliance: Labor law requires 3-year record retention
├─ Dispute resolution: If employee sues later, evidence exists
├─ Audit proof: Complete history shows what happened when
└─ Auto-delete: Proof of deletion logged forever
```

---

## 2. DOCUMENTS (Upload Formats & Storage)

**Supported Document Formats & Limits:**

| Document | Formats | Max Size | Notes |
|----------|---------|----------|-------|
| PAN Card | PDF, JPG, PNG | 5 MB | Clear image, readable |
| Aadhaar | PDF, JPG, PNG | 5 MB | Clear image both sides |
| Degree | PDF | 10 MB | Scanned certificate |
| 10th Marksheet | PDF, JPG, PNG | 5 MB | Official document |
| 12th Marksheet | PDF, JPG, PNG | 5 MB | Official document |
| Bank Proof | PDF, JPG, PNG | 5 MB | Bank statement/cheque |
| Contracts | PDF | 10 MB | Signed document |
| Invoices | PDF | 5 MB | Invoice document |

**NOT Accepted:** Word docs, Excel, ZIP, Video, RAW, files >limit

**For US Contractors/Interns - ADDITIONAL REQUIRED:**

| Document | Formats | Max Size | Notes |
|----------|---------|----------|-------|
| **W-4 Form (US Only)** | PDF, JPG, PNG | 5 MB | **REQUIRED for US contractors/interns - IRS tax form** |

**W-4 Requirement Details:**
- **When:** Automatically required if worker location = "US" AND type = "Global Contractor" or "Global Intern"
- **Why:** US law requires W-4 on file before any payment
- **Validity:** 12 months from verification
- **Expiration:** Auto-alert at 30 days before expiry
- **Renewal:** Must renew before expiry (no payment without valid W-4)
- **Gusto Sync Blocker:** Cannot sync to Gusto without verified W-4

**How Upload Works:**

1. **Worker Uploads:**
   - Clicks [Upload] next to PAN
   - Browser opens file picker (filters to: PDF, JPG, PNG)
   - Selects file (e.g., "pan_rohan.jpg" - 2.3 MB)
   - Clicks [Upload]

2. **Backend Validation:**
   - Checks: File format (PDF/JPG/PNG only)
   - Checks: File size (≤5 MB for images, ≤10 MB for PDFs)
   - Checks: File not corrupted
   - If INVALID → Shows error, doesn't upload
   - If VALID → Proceeds to storage

3. **Stored in Cloud Storage (Primary):**
   ```
   gs://katbotz-workforce-docs/2026/worker-001/
   ├── pan.jpg (2.3 MB)
   ├── aadhaar.jpg (2.1 MB)
   ├── degree.pdf (3.5 MB)
   ├── marksheet_10th.pdf (2.8 MB)
   ├── marksheet_12th.pdf (3.1 MB)
   ├── bank_proof.jpg (1.9 MB)
   └── contract.pdf (4.2 MB)
   ```
   
   Features:
   - ✓ Encrypted with CMEK (customer-managed keys)
   - ✓ Versioning enabled (keeps old versions)
   - ✓ Private bucket (no public access)
   - ✓ Auto-replicated (redundancy)
   - ✓ 99.99% availability SLA

4. **Metadata Stored in Firestore:**
   ```
   workers/worker-001/documents/pan:
   ├── status: "Pending" (waiting for HR)
   ├── file_path: "gs://katbotz-workforce-docs/2026/worker-001/pan.jpg"
   ├── file_size: "2.3 MB"
   ├── uploaded_at: "2026-10-20T14:30:00Z"
   ├── uploaded_by: "worker-001"
   ├── versions: [v1, v2, v3...]  (old versions)
   └── verification:
       ├── status: "Pending"
       ├── verified_by: null
       ├── verified_date: null
       └── rejection_reason: null
   ```

5. **Daily Backup to Google Drive:**
   - Runs: 2 AM every night
   - Copies all documents to: `KATBOTZ Workforce (Backup)/2026/`
   - Retention: 30-day rolling (old backups auto-deleted)
   - Purpose: Recovery if Cloud Storage fails

**HR Verifies Document:**
1. Clicks [View Document] in WOP
2. System generates Signed URL (secure, temp, 1 hour)
3. Browser opens Google Cloud Viewer
4. HR sees: PDF/image (can zoom, rotate, pan)
5. HR reviews document
6. HR returns to WOP and clicks:
   - ☑ [Verify] → Status: Verified
   - ✗ [Reject + Reason] → Status: Rejected

**Worker Re-uploading (After Rejection):**
1. Sees: "Rejected: Blurry/Unclear - Please re-upload new document"
2. Uploads new file (e.g., "pan_clear.jpg")
3. Old file kept in version history
4. New file becomes current version
5. Status resets to: Pending
6. HR reviews again

**Storage Lifecycle:**

```
Uploaded (Day 0)
  ├─ Cloud Storage: Primary copy (encrypted, versioned)
  ├─ Firestore: Metadata (status, path, size)
  └─ Backup: None yet

Night 1-2 (2 AM)
  ├─ Daily backup job runs
  ├─ Copies to Google Drive: 30-day rolling backup
  └─ Old backups (>30 days) auto-deleted

HR Reviews (Days 1-3)
  ├─ Signed URL generated (temporary, secure)
  ├─ HR views in browser (no download)
  └─ Status updated: Verified or Rejected

Employee Tenure (Years 1-3)
  ├─ Cloud Storage: Primary (always available)
  ├─ Drive backup: Rolling 30-day
  ├─ Encryption: CMEK (secure)
  ├─ Versioning: All versions kept
  └─ Accessible: Anytime by HR

After Exit (Year 3+)
  ├─ System marks: "Delete on [3-year date]"
  ├─ Data locked: Can't modify/delete manually
  ├─ Scheduled job: Auto-deletes on date
  ├─ Deletion: Firestore + Cloud Storage + Drive
  └─ Audit log: "Document deleted [date]" (kept forever)

**Storage Cost for 50 Workers:**
- Cloud Storage: ~5 GB = ₹1.50/month
- Drive backup: Included in Workspace
- Total: ~₹2/month

**Version History Example:**
```
pan document:
├── v1: pan.jpg (Oct 20, 2026) - REJECTED: Blurry
├── v2: pan_clear.jpg (Oct 25, 2026) - REJECTED: Wrong side
└── v3: pan_final.jpg (Nov 1, 2026) - VERIFIED ✓

Current: v3 (pan_final.jpg)
All versions kept until worker exits (3-year retention)
```

**Status (4 States):**
- **Pending** — Not uploaded yet
- **Under Review** — Uploaded, HR is reviewing
- **Verified** — HR approved, acceptable
- **Rejected** — HR rejected, worker must re-upload new document

**HR Workflow:**
1. Document uploaded → Status: Pending
2. HR clicks "View in Drive" → Status: Under Review (auto-marked when HR opens)
3. HR reviews file in Drive
4. HR returns to WOP:
   - **Option A:** Click ☑ Mark Verified → Status: Verified
   - **Option B:** Click ✗ Reject + select reason from dropdown

**Rejection Reason Dropdown Options:**
- Unclear/Blurry (can't read)
- Expired (document is no longer valid)
- Invalid (not the right document type)
- Incomplete (missing information)
- Damage/Torn (document is damaged)
- Wrong Document (submitted wrong document)
- Illegible Signature (signature unreadable)
- Other (specify in text)

**Worker View:**
- Pending → "Waiting for upload"
- Under Review → "HR is checking"
- Verified → "✓ Approved"
- Rejected → "Rejected: Unclear/Blurry - Please re-upload new document"
  (Shows the specific reason so worker knows what to fix)

---

## 3. WORKER CREATION (Duplicate Prevention - FIX #1)

**Before Creating Worker - System Checks:**
```
When HR creates worker manually OR Zoho sends webhook:

Step 1: Validate email
├─ Check: Is email @katbotz.com?
├─ If NO → Error: "Invalid email domain"
└─ If YES → Continue

Step 2: Check for duplicates (CRITICAL)
├─ Check: Does this email already exist in WOP?
├─ If YES → Error: "Email already registered"
├─   └─ Show who else has this email (user type, status)
└─ If NO → Continue

Step 3: Check Zoho duplicates
├─ Check: Is this email already created from Zoho?
├─ If YES → Error: "Worker already created from Zoho"
└─ If NO → Continue

Step 4: Create worker safely
└─ All checks passed → Worker created
```

**Why This Matters (FIX #1: Duplicate Email Prevention):**
```
Without this check:
├─ HR creates: rohan@katbotz.com (Employee)
├─ Zoho creates: rohan@katbotz.com (Contractor) — same email
└─ Result: TWO workers, login system confused

With this check:
├─ HR creates: rohan@katbotz.com → Success
├─ Zoho tries same email → Error: "Email already registered"
└─ Result: Only ONE worker, system safe
```

**HR sees error example:**
```
Error: Email already registered
├─ Email: rohan@katbotz.com
├─ Existing worker:
│  ├─ Name: Rohan Mehta
│  ├─ Type: Employee
│  └─ Status: Active
│
└─ Action: Use different email or check if same person
```

---

## 4. PROJECT ASSIGNMENT

**HR does:**
- Click "Assign Project"
- Pick project name (e.g., "Mobile App Redesign")
- Pick project lead (e.g., "Akshat")
- Set start date

**Worker sees:**
- Project name
- Project lead name
- Start date
- Status (In Progress, Completed, On Hold)

**Used for:** Organizing who's doing what

---

## 4. GOALS

**Who sets:** Team lead (initially)

**Who can edit:** Team lead + worker (both can modify)

**What's included:**
- Goal name (e.g., "Complete wireframes")
- Deadline (e.g., June 30)
- Status: Not Started, In Progress, Completed, On Track

**Tracking goals achieved:**
- Worker marks: "✓ This goal is done"
- Shows in "Goals Achieved" list
- HR can see progress

**Example:**
```
Goal: Complete wireframes
Deadline: June 30
Status: In Progress

↓

Goal: Get stakeholder approval
Deadline: July 5
Status: Not Started

↓

✓ Goals Achieved:
  ✓ Research existing UI issues
  ✓ Create initial mockups
```

---

## 5. WEEKLY SUMMARY

**What it is:** Worker writes what happened this week

**When:** Worker fills in anytime (usually end of week)

**Template:**
```
Week of June 17–23:

"Completed initial wireframes, had team review meeting 
with Akshat, collected feedback. Next week: iterate on 
designs based on feedback."

[Save]
```

**Who reads:** HR (to understand progress without asking)

**History:** All previous weeks saved (can look back anytime)

---

## 6. PERFORMANCE

**Who fills:** Team lead (usually)

**What's included:**
```
Rating: ⭐⭐⭐⭐☆ (1-5 stars)
Feedback: "Good progress, quick learner"
```

**Who sees:** Worker + HR

**Used for:** Quick feedback on current performance

---

## 7. REVIEWS (With Immutable Lock - FIX #7)

**Automatic schedule:**

| Review | When (from hire date) | Status |
|--------|----------------------|--------|
| 30-day | Day 30 | Team lead fills, worker sees |
| 60-day | Day 60 | Team lead fills, worker sees |
| 90-day | Day 90 | Team lead fills, worker sees |
| Annual | Year 1, Year 2, etc. | Team lead fills, worker sees |

**What's in a review:**
```
Rating: 4/5
Feedback: "Great progress on designs, quick iteration"
Reviewed by: Akshat
Date: June 23, 2026
Status: Locked (cannot be edited)
```

**Review States (FIX #7: Review Lock After Submit):**

```
STATE 1: DRAFT (Can edit)
├─ Team Lead creates review
├─ Fills rating + feedback (optional fields)
├─ Can edit freely
├─ Status: "Draft"
└─ Action: [Save Draft] or [Submit]

↓

STATE 2: SUBMITTED → LOCKED (Cannot edit)
├─ Team Lead clicks [Submit Review]
├─ System validates: Rating + feedback filled
├─ Status changes: Draft → Submitted (LOCKED)
├─ Submitted date recorded
├─ Worker gets notification
├─ If attempt to edit → Error: "Review is locked"
└─ Action: Cannot change

↓

STATE 3: IF CHANGE NEEDED (Create new)
├─ Team Lead cannot edit old review
├─ Must create NEW review instead
├─ New review replaces old (shows reason)
├─ Old review still visible (superseded)
├─ Audit trail: Shows original + replacement
└─ Action: [Create Updated Review]
```

**Why Reviews Are Locked (FIX #7):**
```
Problem (without lock):
├─ Team Lead rates Rohan: 4/5 stars (excellent)
├─ Clicks [Submit Review]
├─ Later regrets: Changes to 2/5 stars (bad)
├─ Rohan doesn't know original was 4/5
└─ Unfair + no proof

Solution (with lock):
├─ Once submitted: Review locked
├─ Cannot tamper with ratings
├─ If change needed: Create new review (audit trail shows both)
└─ Fair + transparent
```

**History:** All reviews saved (worker can see past feedback + replacements)

---

## 8. TO-DO LIST

**Personal task list:**
```
☐ Finish project report
☐ Send invoice to client
☐ Review meeting notes
✓ Upload all documents
```

**Who manages:** Worker (only they can edit their own)

**Who sees:** Worker + HR (HR can see, not edit)

**Add/Delete:** Worker clicks [+ Add Task] or [Delete]

---

## 9. CONTRACT RENEWAL & AMENDMENTS (With Rate Locking - FIX #4)

**HR enters (manual) - Original Contract (v1):**
- Contract start date
- Contract end date (locked)
- Contract rate (locked - cannot change retroactively)
- Renewal date (if applicable)

**System shows:**
- "Expires in X days"
- "Renew by [date]"
- Renewal alerts: 90, 60, 30, 7 days before expiry

**Contract Amendments (FIX #4: Rate Locking & Versioning):**

```
SCENARIO: Salary needs to change mid-contract

Original Contract (v1) — LOCKED:
├─ Rate: ₹50,000/month
├─ Start: June 1, 2026
├─ End: June 1, 2027
├─ Status: IMMUTABLE (cannot be changed)
└─ Used for: Invoices before amendment date

Amendment Needed:
├─ Reason: Performance increase / Rate adjustment / Scope change
├─ HR clicks: [Create Amendment]
├─ System creates: Amendment (v2)

Amendment (v2) — NEW VERSION:
├─ What changed: Rate 50k → 55k
├─ Effective date: Sept 1, 2026 (when change takes effect)
├─ Status: "Draft" (pending approval)
├─ Approval: Founder must approve
├─ Once approved: v2 becomes current version
├─ Audit trail: Shows who changed what, when, why
└─ Used for: Invoices from Sept 1 onwards

Which Rate Applies?
├─ Invoice dated Aug 1: Uses v1 (₹50,000)
├─ Invoice dated Sept 1: Uses v2 (₹55,000)
├─ No retroactive changes: Clear, fair, auditable
└─ History: Can always see all versions + dates
```

**Why Amendments (FIX #4: Multi-Currency Rate Locking):**
```
Problem (without amendments):
├─ Contract: "₹50,000/month for 12 months"
├─ Month 6: HR changes to ₹55,000
├─ Question: Did rate increase apply retroactively to month 1?
├─ Contractor: "We agreed on 50k!"
├─ HR: "Contract was updated"
└─ Dispute

Solution (with amendments):
├─ v1: ₹50,000 (locked, immutable)
├─ v2: ₹55,000 starting Sept 1
├─ Each invoice clear: Which version applied?
├─ Retroactive claim: Audit trail proves NO
└─ Clear, fair, legal
```

**Used for:** 
- Remembering when contracts end
- Managing salary changes (with full audit trail)
- Invoice processing (which rate applies?)
- Legal protection (amendment history proves fairness)

---

## 10. OFFBOARDING (With Invoice Protection - FIX #2)

**When worker leaves:**

**HR clicks:** [Mark for Exit]

**BEFORE Marking Exit - System Checks (FIX #2: Invoice Lock):**

```
For contractors only:

Step 1: Check for unpaid invoices
├─ Query: Any invoices with status = "Submitted"?
├─ If YES → Block exit, show error:
│  ├─ "Cannot exit with pending invoices"
│  ├─ "Pending invoices: 3"
│  └─ "Action: Approve/reject all invoices first"
└─ If NO → Continue

Step 2: Require invoice resolution
├─ HR must visit Invoices section
├─ Approve: Pay the invoice (status: Paid)
├─ Reject: Cancel the invoice (status: Rejected)
├─ Status: All invoices must have FINAL status
└─ Action: [Approve Invoice] or [Reject Invoice]

Step 3: Only after ALL invoices resolved
├─ HR returns to offboarding
├─ Click [Mark for Exit] again
├─ System confirms: All invoices resolved
└─ Proceed to exit
```

**System does:**
1. Records: Last day (e.g., June 30, 2026)
2. Locks all documents (can't modify)
3. Locks all invoices (can't change status)
4. Marks: "Delete after June 30, 2029" (3 years)
5. Auto-deletes on that date (only if all invoices finalized)

**Why Invoice Lock (FIX #2):**
```
Problem (without lock):
├─ Contractor submits invoice: ₹50,000 (May 1)
├─ HR marks contractor for exit (June 1)
├─ 3 years later: Data auto-deleted
├─ Invoice deleted with contractor
└─ ₹50,000 lost, contractor unpaid

Solution (with lock):
├─ HR marks for exit
├─ System says: "3 pending invoices"
├─ HR must: Approve/reject before exit
├─ Cannot exit until all invoices finalized
├─ Contractor always gets paid
└─ Safe
```

**Why 3 years?** Legal requirement. If worker sues later, documents exist for proof.

---

## 11. IN-PORTAL NOTIFICATIONS (No Email - Secure & Encrypted)

**What It Is:**
Workers and HR see notifications INSIDE WOP dashboard, not via email. All notifications encrypted.

---

## **HOW IN-PORTAL NOTIFICATIONS WORK**

### **1. Notification is Created (Event Triggers)**

```
Event Happens:
├─ Document verified by HR
├─ Project assigned to worker
├─ 30-day review due
├─ Invoice submitted
├─ Contract renewal alert (7 days)
└─ Offboarding scheduled

System Detects → Creates notification object
```

### **2. Notification Stored (Encrypted in Firestore)**

```
Firestore Database (Encrypted):
notifications/notification-id-001
{
  "notification_id": "notif-2026-001",
  "worker_id": "worker-001",
  "type": "document_verified",
  "title": "Your PAN document was verified",
  "message": "PAN uploaded on Jun 20 verified by Priya on Jun 23",
  "timestamp": "2026-06-23T10:30:45Z",
  "read": false,
  "priority": "medium",
  "action_url": "/worker/documents"
}

Encryption: ✓ Firestore CMEK (encrypted at rest)
```

### **3. Worker Logs In (Notifications Load)**

```
Worker logs into WOP:
  │
  └─ Browser loads dashboard
      │
      └─ JavaScript fetches notifications
          │
          ├─ API request: GET /api/worker/{id}/notifications
          │
          ├─ WOP backend retrieves from Firestore (encrypted)
          │
          ├─ Data decrypted by Firestore (automatic)
          │
          ├─ Backend sends to browser over HTTPS (encrypted)
          │
          └─ Browser displays in notification panel
```

### **4. Worker Sees Notifications (In-Portal Dashboard)**

```
┌──────────────────────────────────────────┐
│ WORKER DASHBOARD - Notifications         │
├──────────────────────────────────────────┤
│ 3 new notifications                      │
│                                          │
│ ✓ Jun 23 — Your PAN was verified        │
│   Verified by Priya, clear image        │
│   [View details]                         │
│                                          │
│ ⏳ Jun 20 — 30-day review due           │
│   Your review is scheduled for Jun 30   │
│   [Complete review]                     │
│                                          │
│ 📌 Jun 15 — Project assigned            │
│   Team Lead: Akshat                     │
│   Project: Mobile App Redesign          │
│   [View project]                        │
│                                          │
│ [Mark all as read]                      │
└──────────────────────────────────────────┘
```

### **5. Notifications Marked as Read**

```
Worker clicks notification (reads it):
  │
  └─ JavaScript sends: PATCH /api/notifications/{id}/read
      │
      ├─ WOP backend updates: "read": true
      │
      ├─ Saves to Firestore (encrypted)
      │
      └─ UI updates: "New" badge disappears

Status: Read (but never deleted)
```

---

## **ENCRYPTION: HOW NOTIFICATIONS ARE PROTECTED**

### **At Rest (In Database - Firestore)**

```
Firestore Storage:
┌───────────────────────────────────────┐
│ notifications/ collection              │
│                                        │
│ Each notification encrypted with:      │
│                                        │
│ ✓ CMEK (Customer-Managed Encryption   │
│   Keys) — Google Cloud default        │
│                                        │
│ ✓ AES-256 encryption standard          │
│                                        │
│ ✓ Key rotation: Quarterly              │
│                                        │
│ ✓ Legal hold: Can't be deleted if     │
│   litigation pending                  │
└───────────────────────────────────────┘

Result: Notification data encrypted on disk
        No one can read raw data
        Only authorized WOP app can decrypt
```

### **In Transit (From Server to Browser)**

```
WOP Server → Worker's Browser:

Step 1: Server retrieves notification
├─ Notification: "Your PAN was verified"
└─ Status: Encrypted in Firestore

Step 2: Server sends to browser
├─ Uses HTTPS protocol
├─ Encryption: TLS 1.3 (industry standard)
├─ Data encrypted: Yes
├─ Eavesdropping blocked: Yes
└─ Man-in-middle prevented: Yes

Step 3: Browser receives notification
├─ Browser decrypts (automatic)
├─ Displays in UI
└─ Never shown in plain text in network

Result: Safe from eavesdropping
        Safe from interception
        Safe from tampering
```

### **On Device (Browser/Phone)**

```
Notification displayed in WOP dashboard:
├─ Only shown to logged-in worker
├─ Only visible if browser has valid session
├─ Only visible if worker has permission
├─ Disappears on logout
├─ Not cached insecurely
└─ No local storage of sensitive data

Browser Security:
├─ HttpOnly cookies (JavaScript can't access)
├─ SameSite policy (prevents CSRF)
├─ Content Security Policy (prevents XSS)
└─ Secure flag (only sent over HTTPS)
```

---

## **ALL DOCUMENTS: WHERE STORED & HOW ENCRYPTED**

### **PRIMARY STORAGE: Google Cloud Storage**

```
Location: gs://katbotz-workforce-docs/2026/worker-001/
          ├─ pan.pdf
          ├─ aadhaar.jpg
          ├─ degree.pdf
          ├─ contract.pdf
          └─ invoices/invoice.pdf

Encryption:
├─ CMEK: Customer-Managed Encryption Keys
├─ Algorithm: AES-256 (military-grade)
├─ Key management: Google Cloud KMS
├─ Automatic encryption: Every file
├─ No plain text: Files encrypted immediately on upload
├─ 99.99% SLA: Google Cloud Storage reliability
└─ Versioning enabled: Keep all versions

Access Control:
├─ Private bucket: Not publicly accessible
├─ Worker: Can upload to their folder
├─ HR: Can view via signed URLs (temporary, 1 hour)
├─ Audit logging: All access logged
└─ Immutable: Once uploaded, can't be modified

Backup: Daily export to Google Drive (also encrypted)
```

### **BACKUP STORAGE: Google Drive**

```
Location: KATBOTZ Workforce Backups/2026/Rohan Mehta/
          ├─ Documents/
          │  ├─ pan.pdf
          │  ├─ aadhaar.jpg
          │  └─ degree.pdf
          │
          └─ Projects/
             └─ [project files]

Encryption:
├─ Google Workspace encryption: Default
├─ Encryption in transit: HTTPS
├─ Encryption at rest: AES-256
├─ 30-day rolling retention: Old backups auto-deleted
└─ No manual access: Backups are for recovery only

Purpose: Backup only (primary is Cloud Storage)
```

---

## **HOW DOCUMENT UPLOADS ARE ENCRYPTED**

### **Upload Process (5 Steps)**

```
Step 1: Worker Selects File (Local Computer)
└─ File: pan.pdf (on worker's computer, not encrypted yet)

Step 2: Browser to WOP (HTTPS - Encrypted)
└─ Worker clicks [Upload]
└─ Browser opens file
└─ Sends to WOP backend over HTTPS
└─ Encryption: TLS 1.3 (in transit)
└─ No eavesdropping possible

Step 3: WOP Backend Validation (Encrypted)
└─ Receives file: pan.pdf
└─ Validates: Format (PDF), Size (≤10 MB)
└─ Status: Valid → Proceed to storage

Step 4: Upload to Cloud Storage (Encrypted)
└─ Backend uploads to: gs://katbotz-workforce-docs/2026/worker-001/
└─ Encryption applied: CMEK (AES-256)
└─ File stored: Encrypted on disk
└─ Versioning: Previous versions kept (v1, v2, v3, etc.)

Step 5: Metadata Saved to Firestore (Encrypted)
└─ Document record created:
   {
     "document_id": "doc-001",
     "file_path": "gs://katbotz-workforce-docs/2026/worker-001/pan.pdf",
     "status": "Pending",
     "uploaded_at": "2026-06-20T14:30:00Z",
     "file_size": 2145678,
     "version": 1
   }
└─ Metadata encrypted: CMEK in Firestore
└─ Audit log entry: "Worker uploaded PAN"

Result:
├─ File encrypted in Cloud Storage ✓
├─ Metadata encrypted in Firestore ✓
├─ Audit trail logged ✓
├─ Backup created in Drive ✓
└─ All encrypted end-to-end ✓
```

---

## **HOW HR VIEWS DOCUMENTS (Securely)**

```
HR Verification Process:

HR clicks [View Document]:
  │
  └─ WOP backend generates signed URL
      │
      ├─ URL is temporary (expires in 1 hour)
      ├─ URL is unique (can't be reused)
      ├─ URL is secure (requires valid session)
      │
      └─ Browser opens Google Cloud Viewer
          │
          ├─ Document displayed: pan.pdf
          ├─ No download button (secure view only)
          ├─ HR can review in browser
          └─ Access logged in audit trail

HR returns to WOP:
  │
  └─ Clicks [Verify] or [Reject]
      │
      ├─ Updates status: "Verified" or "Rejected"
      ├─ Saves to Firestore (encrypted)
      ├─ Sends notification to worker
      └─ Logs in audit trail

Result:
├─ Document reviewed securely (no download) ✓
├─ HR can't extract/modify file ✓
├─ Access is temporary (1 hour) ✓
├─ Audit trail shows who viewed when ✓
└─ File stays encrypted in Cloud Storage ✓
```

---

## **ENCRYPTION SUMMARY TABLE**

| Where | Encryption | Standard | Key Management | Details |
|-------|-----------|----------|-----------------|---------|
| **Cloud Storage (Files)** | ✓ Yes | AES-256 | CMEK (Google KMS) | Primary document storage |
| **Firestore (Metadata)** | ✓ Yes | AES-256 | CMEK (Google KMS) | Document records, notifications |
| **Google Drive (Backup)** | ✓ Yes | AES-256 | Google default | 30-day rolling backup |
| **In Transit (Upload)** | ✓ Yes | TLS 1.3 | HTTPS | Browser to WOP server |
| **In Transit (API)** | ✓ Yes | TLS 1.3 | HTTPS | WOP server to browser |
| **Notifications** | ✓ Yes | AES-256 | CMEK | In Firestore, in transit, in browser |
| **Audit Trail** | ✓ Yes | AES-256 | CMEK | Complete action history |
| **Passwords** | N/A | N/A | Google OAuth | Not stored in WOP (Google handles) |

---

## **NOTIFICATIONS VS EMAIL**

| Feature | In-Portal Notifications | Email |
|---------|------------------------|-------|
| **Delivery** | Instant (in WOP) | Delayed (email server) |
| **Encryption** | ✓ HTTPS + Firestore CMEK | ✓ Email encryption (TLS) |
| **Privacy** | ✓ Only in WOP (no external) | ⚠️ Sent to external email |
| **Control** | ✓ HR controls format | ❌ Email system controls |
| **Spam** | ✓ No spam risk | ⚠️ Can be marked spam |
| **Compliance** | ✓ Data stays internal | ⚠️ Shared with email provider |
| **Real-time** | ✓ Yes (instant) | ⚠️ Minutes delay |

**Choice: In-portal only** = More secure + More private + More control

---

## **COMPLETE NOTIFICATION FLOW (Example)**

```
════════════════════════════════════════════════════════════
SCENARIO: HR Verifies Rohan's PAN Document
════════════════════════════════════════════════════════════

10:30 AM — Rohan uploads PAN.pdf
├─ File uploaded to: gs://katbotz-workforce-docs/2026/worker-001/
├─ Encryption: CMEK-AES-256 applied
├─ Metadata saved: Firestore (encrypted)
├─ Audit log: "Rohan uploaded PAN"
└─ Status: Pending verification

10:35 AM — HR Verifies Document
├─ HR in WOP clicks [View Document]
├─ WOP generates temporary signed URL
├─ Browser opens Google Cloud Viewer
├─ HR reviews: PAN.pdf (no download)
├─ HR returns to WOP
├─ HR clicks [Verify]
└─ Status updated: Verified

10:35:30 AM — Notification Created (Encrypted)
├─ System creates notification object
├─ Content: "Your PAN was verified ✓"
├─ Encrypted: CMEK in Firestore
├─ Audit log: "Priya verified PAN (Rohan)"
└─ Notification stored: Firestore

10:36 AM — Rohan Logs Into WOP
├─ Browser fetches dashboard
├─ API request: GET /api/notifications
├─ Server retrieves from Firestore (encrypted)
├─ Data decrypted by Firestore (automatic)
├─ Sent to browser over HTTPS (encrypted)
├─ Browser displays notification
└─ Rohan sees: "Jun 23 — Your PAN was verified ✓"

Result:
✓ Document encrypted end-to-end
✓ Notification encrypted end-to-end
✓ All access logged
✓ No email sent (private)
✓ Complete audit trail
════════════════════════════════════════════════════════════
```

---

## 12. AUDIT TRAIL (Complete Action History — Forever)

**Complete Logging System: Every Action Tracked**

```
WHO    → User/service account that performed action
WHAT   → Specific action (upload, verify, approve, delete, etc.)
WHEN   → Exact timestamp (date, time, timezone)
WHERE  → Which resource affected (worker ID, document ID, etc.)
RESULT → Success/failure and any errors
```

---

### **WHAT GETS LOGGED (Everything)**

**Worker Management:**
```
✓ Worker created (who, when, type)
✓ Worker details updated (who changed what, when)
✓ Worker marked for exit (who, when, exit date)
✓ Worker reactivated (who, when)
✓ Worker deleted/restored (who, when, reason)
```

**Documents:**
```
✓ Document uploaded (by whom, when, filename, size)
✓ Signed URL generated (by whom, when, validity)
✓ Document viewed (by whom, when, duration)
✓ Document verified (by whom, when, reason)
✓ Document rejected (by whom, when, rejection reason)
✓ Document re-uploaded (by whom, when)
✓ Document deleted (by whom, when, reason)
```

**Projects & Goals:**
```
✓ Project assigned (who assigned, when, to whom)
✓ Goal created (who, when, goal text, deadline)
✓ Goal updated (who changed what, when)
✓ Goal marked complete (by whom, when)
✓ Goal deleted (who, when, reason)
```

**Reviews & Performance:**
```
✓ Review created (by whom, when, for whom)
✓ Review submitted (by whom, when, rating)
✓ Review updated (who changed what, when)
✓ Performance rating changed (by whom, from X to Y, when)
✓ Feedback added (by whom, when, text)
```

**Contracts (Contractors):**
```
✓ Contract created (who, when)
✓ Contract details updated (who changed what, when)
✓ Amendment recorded (who, what changed, when)
✓ Contract marked for renewal (who, when)
✓ Contract expired (system, when)
✓ Renewal alert sent (system, when, which alert)
```

**Invoices (Contractors):**
```
✓ Invoice submitted (by whom, when, amount)
✓ Invoice approved (by whom, when)
✓ Invoice rejected (by whom, when, reason)
✓ Invoice marked paid (by whom, when)
```

**Offboarding:**
```
✓ Worker marked for exit (who, when, exit date)
✓ Offboarding workflow started (system, when)
✓ Data deletion scheduled (system, when, deletion date)
✓ Data auto-deleted (system, when)
✓ Deletion logged (proof, permanent)
```

**Access & Security:**
```
✓ Login attempt (user, when, success/failure)
✓ Permission check (user accessed what, when, allowed/denied)
✓ Failed access attempt (user, what tried to access, when, reason denied)
✓ Role changed (who changed, for whom, when, old → new role)
```

**System Events:**
```
✓ Backup created (system, when, size, status)
✓ Backup restored (who, when, from which backup)
✓ Data imported (who, when, what imported)
✓ Webhook received (from where, when, what data)
✓ Integration synced (system, when, what synced)
```

---

### **WHERE SAVED: Firestore (Encrypted, Forever, IMMUTABLE - FIX #3)**

**Storage Location:**
```
Firestore Database
├─ Collection: audit_logs
├─ Location: Same as other worker data
├─ Encryption: CMEK (AES-256, military-grade)
├─ Redundancy: Auto-replicated across Google regions
├─ Retention: FOREVER (never auto-deleted)
└─ Immutability: LOCKED (cannot be modified or deleted, even by Founder)
```

**Immutability Details (FIX #3: Audit Logs Are Tamper-Proof):**

```
CRITICAL SECURITY: Audit logs CANNOT be deleted or modified by ANYONE

Attempts to modify:
├─ DELETE audit log entry → Error 403: "Forbidden"
├─ EDIT audit log entry → Error 403: "Forbidden"
├─ MODIFY audit log entry → Error 403: "Forbidden"
└─ WHO: Even Founder, even system admin

Only allowed:
├─ CREATE: Add new entries (system only)
├─ READ: View entries (based on role)
└─ APPEND: Add to logs (never overwrite)

Why (FIX #3: Founder Cannot Delete Evidence):**
```
Problem (without immutability):
├─ Audit log: "Rohan was paid ₹50,000 on June 1"
├─ Founder (full authority): Deletes this log entry
├─ Result: No proof Rohan was paid
├─ If Rohan sues: No evidence to defend
└─ Legal disaster

Solution (with immutability):
├─ Founder cannot delete logs
├─ Founder can VIEW all logs
├─ Founder cannot MODIFY any logs
├─ Evidence stays forever
├─ Legal protection: Proof exists
└─ DPDP Act compliant
```

**Structure of Each Audit Entry:**

```json
audit_logs/entry-20260623-103000-001
{
  "entry_id": "audit-2026-06-23-10-30-00-priya-verified-pan",
  "timestamp": "2026-06-23T10:30:00Z",
  "timestamp_unix": 1776950400,
  
  "WHO":
  {
    "user_id": "priya@katbotz.com",
    "user_role": "HR",
    "ip_address": "192.168.1.200",
    "user_agent": "Mozilla/5.0 Chrome/95.0"
  },
  
  "WHAT":
  {
    "action": "document_verified",
    "action_category": "document_management",
    "resource_type": "document",
    "resource_id": "worker-001/pan.pdf",
    "details": {
      "document_type": "PAN",
      "status_before": "Pending",
      "status_after": "Verified",
      "reason": "Clear image, readable",
      "verification_method": "Google Cloud Viewer"
    }
  },
  
  "RESULT":
  {
    "status": "success",
    "error_code": null,
    "error_message": null,
    "changes_applied": 1
  },
  
  "CONTEXT":
  {
    "worker_id": "worker-001",
    "worker_name": "Rohan Mehta",
    "request_id": "req-20260623-103000-abc123",
    "session_id": "sess-priya-20260623-093000"
  },
  
  "ENCRYPTION":
  {
    "encrypted": true,
    "encryption_key": "cmek-katbotz-workforce",
    "key_version": 2,
    "encryption_time": "2026-06-23T10:30:00Z"
  },
  
  "IMMUTABLE": true
  └─ This entry cannot be modified or deleted
}
```

---

### **DETAILED EXAMPLE: One Worker's Complete Audit Trail**

```
╔════════════════════════════════════════════════════════════╗
║ COMPLETE AUDIT TRAIL: ROHAN MEHTA (worker-001)            ║
╚════════════════════════════════════════════════════════════╝

June 20, 2026 @ 14:30:00 UTC
├─ ACTION: Zoho auto-created worker
├─ WHO: System (webhook from Zoho Recruit)
├─ WHAT: New worker profile created
│  ├─ Name: Rohan Mehta
│  ├─ Email: rohan@katbotz.com
│  ├─ Type: Employee (Indian)
│  └─ Source: Zoho Recruit webhook
├─ RESULT: Success
└─ LOGGED: ✓

June 20, 2026 @ 14:30:30 UTC
├─ ACTION: Worker created notification sent
├─ WHO: System
├─ WHAT: Welcome email sent
│  ├─ To: rohan@katbotz.com
│  ├─ Subject: Your WOP account is ready
│  └─ Status: Sent
├─ RESULT: Success
└─ LOGGED: ✓

June 20, 2026 @ 14:35:00 UTC
├─ ACTION: Worker logged in (first time)
├─ WHO: rohan@katbotz.com
├─ WHAT: Successful login
│  ├─ IP: 192.168.1.101
│  ├─ Method: Google OAuth
│  └─ Session created
├─ RESULT: Success
└─ LOGGED: ✓

June 20, 2026 @ 14:35:30 UTC
├─ ACTION: Document uploaded
├─ WHO: rohan@katbotz.com (worker)
├─ WHAT: PAN document uploaded
│  ├─ Filename: PAN-rohan.pdf
│  ├─ Size: 2.1 MB
│  ├─ Status: Pending verification
│  └─ Location: gs://katbotz-workforce-docs/2026/worker-001/pan.pdf
├─ RESULT: Success
└─ LOGGED: ✓

June 23, 2026 @ 10:30:05 UTC
├─ ACTION: Signed URL generated
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: Document preview link created
│  ├─ Document: worker-001/pan.pdf
│  ├─ Validity: 1 hour (expires 11:30:05)
│  └─ IP: 192.168.1.200
├─ RESULT: Success
└─ LOGGED: ✓

June 23, 2026 @ 10:30:30 UTC
├─ ACTION: Document viewed
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: Document accessed for review
│  ├─ Document: PAN (pan.pdf)
│  ├─ Duration: 15 minutes (until 10:45:30)
│  ├─ Tool: Google Cloud Viewer
│  └─ IP: 192.168.1.200
├─ RESULT: Success
└─ LOGGED: ✓ (every 30 seconds)

June 23, 2026 @ 10:45:30 UTC
├─ ACTION: Document verified
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: Document status changed
│  ├─ Document: PAN
│  ├─ Status before: Pending
│  ├─ Status after: Verified
│  ├─ Reason: Clear image, readable
│  └─ Signed URL expired at: 11:30:05
├─ RESULT: Success
└─ LOGGED: ✓

June 23, 2026 @ 14:00:00 UTC
├─ ACTION: Project assigned
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: Project assigned to worker
│  ├─ Project: Mobile App Redesign
│  ├─ Project Lead: Akshat
│  ├─ Start Date: June 23, 2026
│  └─ Worker: Rohan Mehta
├─ RESULT: Success
└─ LOGGED: ✓

June 23, 2026 @ 15:00:00 UTC
├─ ACTION: Goals created
├─ WHO: akshat@katbotz.com (Team Lead)
├─ WHAT: 3 goals created for worker
│  ├─ Goal 1: Complete wireframes (deadline June 30)
│  ├─ Goal 2: Get stakeholder approval (deadline July 5)
│  └─ Goal 3: Implement designs (deadline July 20)
├─ RESULT: Success (3 goals created)
└─ LOGGED: ✓ (one entry per goal)

June 30, 2026 @ 16:00:00 UTC
├─ ACTION: Goal marked complete
├─ WHO: rohan@katbotz.com (worker)
├─ WHAT: Goal status changed
│  ├─ Goal: Complete wireframes
│  ├─ Status: Completed
│  ├─ Completion date: June 30, 2026
│  └─ Achievement: On schedule
├─ RESULT: Success
└─ LOGGED: ✓

June 30, 2026 @ 17:30:00 UTC
├─ ACTION: 30-day review created
├─ WHO: akshat@katbotz.com (Team Lead)
├─ WHAT: Review filled for worker
│  ├─ Rating: 4.5/5 stars
│  ├─ Feedback: Great progress, quick learner
│  ├─ Date: June 30, 2026 (30 days from hire)
│  └─ Status: Submitted
├─ RESULT: Success
└─ LOGGED: ✓

June 30, 2026 @ 18:00:00 UTC
├─ ACTION: Review notification sent
├─ WHO: System
├─ WHAT: Worker notified of review completion
│  ├─ To: rohan@katbotz.com
│  ├─ Message: Your 30-day review is complete
│  └─ Rating: 4.5/5
├─ RESULT: Success
└─ LOGGED: ✓

... (similar entries for future milestones)

DECEMBER 31, 2029 @ 23:59:59 UTC
├─ ACTION: Worker marked for exit
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: Worker scheduled for exit
│  ├─ Last day: December 31, 2029
│  ├─ Auto-delete date: December 31, 2032 (3 years)
│  └─ Reason: Resignation
├─ RESULT: Success
└─ LOGGED: ✓

DECEMBER 31, 2032 @ 01:00:00 UTC
├─ ACTION: Worker data deleted
├─ WHO: System (auto-delete job)
├─ WHAT: All worker data deleted (3-year retention complete)
│  ├─ Deleted: Worker profile
│  ├─ Deleted: Documents
│  ├─ Deleted: Goals, reviews, projects
│  ├─ Deleted: Firestore records
│  └─ Kept: This audit entry (forever)
├─ RESULT: Success
└─ LOGGED: ✓ (PERMANENT PROOF)

FOREVER (After deletion):
├─ AUDIT TRAIL: COMPLETE
├─ IMMUTABLE: Cannot be changed
├─ ACCESSIBLE: Founder can view full history
└─ COMPLIANCE: Proof of all actions and deletion
```

---

### **WHO CAN ACCESS AUDIT LOGS**

```
Founder:
├─ Full access to ALL audit logs
├─ Can filter by: date, user, worker, action
├─ Can download: Reports, exports
├─ Can analyze: Patterns, compliance
└─ Purpose: Complete oversight

Senior HR:
├─ Can see: Audit logs for their actions
├─ Can see: Document verification history
├─ Can see: Worker lifecycle events
├─ Cannot see: Other HR's actions
└─ Purpose: Verify own work

HR:
├─ Can see: Document verification history
├─ Can see: Their own actions
├─ Cannot see: Payroll, deletions, other HR
└─ Purpose: Compliance proof

Workers:
├─ Can see: Actions affecting their profile
├─ Cannot see: Other workers' data
├─ Cannot see: HR actions on them
└─ Purpose: Transparency (if enabled)

System:
├─ Logs: Automated actions (backups, webhooks)
├─ Cannot modify: Any logs
└─ Purpose: Transparency
```

---

### **QUERYING AUDIT LOGS (Examples)**

**Query 1: All actions by Priya today**
```
SELECT * FROM audit_logs 
WHERE user_id = "priya@katbotz.com" 
  AND DATE(timestamp) = "2026-06-23"
ORDER BY timestamp DESC

Results:
├─ 10:30:05 — Signed URL generated (pan.pdf)
├─ 10:30:30 — Document viewed (15 min)
├─ 10:45:30 — Document verified (pan)
├─ 14:00:00 — Project assigned (to Rohan)
└─ ... (more actions)
```

**Query 2: All document verifications for worker-001**
```
SELECT * FROM audit_logs 
WHERE resource_id LIKE "worker-001/%" 
  AND action = "document_verified"
ORDER BY timestamp DESC

Results:
├─ 2026-06-23 10:45:30 — PAN verified (Clear image)
├─ 2026-06-22 04:45:00 — Degree verified (Legible)
└─ 2026-06-21 09:30:00 — Aadhaar verified (Both sides)
```

**Query 3: All data deletions (for compliance report)**
```
SELECT * FROM audit_logs 
WHERE action_category = "data_management" 
  AND action = "worker_deleted"
ORDER BY timestamp DESC

Results:
├─ 2032-12-31 01:00:00 — worker-001 deleted (3-year retention complete)
├─ 2032-12-24 01:00:00 — worker-002 deleted (3-year retention complete)
└─ ... (all deletions, with proof)
```

---

### **ENCRYPTION & IMMUTABILITY**

**Encryption:**
```
Algorithm: AES-256 (military-grade)
Key: CMEK (Customer-Managed Encryption Keys)
Storage: Google Cloud KMS
Key rotation: Automatic quarterly
Result: Even Google can't read audit logs
```

**Immutability:**
```
├─ Once written: Cannot be modified
├─ Cannot be deleted: Except if illegal hold lifted
├─ Append-only: New entries added, old preserved
├─ Tamper-proof: Hash verification on read
└─ Compliance: Proves no tampering occurred
```

---

### **LEGAL COMPLIANCE**

**DPDP Act (India Privacy Law):**
```
Requirement: Document all data processing
✓ WOP compliance:
├─ All actions logged
├─ Timestamps recorded
├─ User identity tracked
├─ Purpose documented
├─ Retention tracked
└─ Deletion proof kept
```

**Labor Law:**
```
Requirement: Keep records 3 years for disputes
✓ WOP compliance:
├─ Complete audit trail
├─ Timestamps (proof of when)
├─ User identity (proof of who)
├─ Changes tracked (proof of what)
└─ Permanent after deletion (proof of compliance)
```

**Litigation:**
```
If sued: Complete audit trail as evidence
├─ "Prove what happened on June 23"
│  └─ Audit log shows every action
├─ "Prove we deleted the data"
│  └─ Audit log shows deletion timestamp
├─ "Prove we didn't access after exit"
│  └─ Audit log shows no access after exit date
└─ "Prove worker consented"
   └─ Audit log shows worker uploaded documents
```

---

### **SUMMARY: Audit Trail System**

```
✓ WHAT: Every action logged (who, what, when, result)
✓ WHERE: Firestore (encrypted, immutable)
✓ HOW LONG: FOREVER (never deleted, even after data deletion)
✓ ENCRYPTED: CMEK AES-256 (military-grade)
✓ IMMUTABLE: Cannot be modified or deleted
✓ ACCESSIBLE: Founder full access, HR limited access
✓ QUERYABLE: SQL queries for compliance reports
✓ COMPLIANT: DPDP Act + Labor Law + Litigation defense

RESULT: Complete, auditable proof of all actions
```

---

## 13. WORKER CREATION (ALWAYS MANUAL OPTION AVAILABLE)

**What it does:** HR can create any worker manually at any time using [+ Create Worker] button

**MANUAL CREATION — ALWAYS AVAILABLE:**

HR can create a worker anytime by clicking [+ Create Worker]:
```
HR clicks: [+ Create Worker]
         ↓
Fills form:
├─ Name
├─ Email (@katbotz.com)
├─ Type (Employee/Contractor/Intern/Global)
├─ Department
├─ Team Lead
└─ Location (for Gusto/currency)
         ↓
Clicks: [Create]
         ↓
System auto-generates:
├─ Worker ID
├─ Document checklist
├─ Drive folder
├─ Welcome email
         ↓
Worker logs in immediately
```

**When to Use Manual Creation:**
✓ Emergency hire (need worker now)  
✓ Direct onboarding (not from Zoho)  
✓ Contractor onboarding (Zoho may not track)  
✓ Quick addition (2-3 minute form)  
✓ Zoho not available (system down)  
✓ Any time HR decides to add worker  

**Time Required:** 2-3 minutes  
**Manual Entry:** Yes (simple form)  
**Dependency:** None (works anytime)  

**KEY: [+ Create Worker] button is ALWAYS visible and ALWAYS works** ✓

---

## 14. VERIFICATION-FIRST ONBOARDING (Verify Before Creating Account)

**What it does:** Verify documents BEFORE creating accounts to save ₹1,200-1,800/year on rejections

**How It Works (Verification-First):**

```
STEP 1: HR generates token & link (2 min)
   ├─ HR fills worker details
   ├─ Clicks [Generate Token & Link]
   └─ Unique link created (7-day expiration)

STEP 2: Worker uploads documents (5 min)
   ├─ Worker clicks link (no login needed)
   ├─ Uploads: PAN, Aadhaar, Degree, Marksheets, Bank proof
   └─ Documents in temporary storage

STEP 3: HR verifies documents (5-10 min)
   ├─ HR views documents in temp storage
   ├─ Marks: ✓ Verified OR ✗ Rejected (with reason)
   └─ If rejected: Worker re-uploads via same link

STEP 4: HR creates account (1 min)
   ├─ Only if ALL documents verified ✓
   ├─ Creates @katbotz.com account
   └─ Moves documents to permanent storage
   └─ Cost: ₹100/month (only for verified workers)

STEP 5: Worker logs in
   ├─ Documents already verified (no re-upload)
   └─ Ready to start work immediately
```

**Key Benefits:**
- ✓ Save ₹1,200-1,800/year by not paying for rejected workers
- ✓ Workers upload documents ONCE (no re-upload needed)
- ✓ HR controls verification before spending money
- ✓ Simple process (no webhooks, no automation)
- ✓ Always works (no external dependencies)

**Timeline Summary:**
| Step | Who | Time | Cost |
|------|-----|------|------|
| 1. Generate token | HR | 2 min | ₹0 |
| 2. Upload docs | Worker | 5 min | ₹0 |
| 3. Verify docs | HR | 5-10 min | ₹0 |
| 4. Create account | HR | 1 min | ₹100/month |
| 5. Log in | Worker | 1-2 min | ₹0 |

---

## 15. GUSTO INTEGRATION (SYNC ONLY - US EMPLOYEES)

**What it does:** Real-time sync of worker data between WOP and Gusto for US employees only

**IMPORTANT:** Gusto SYNCS (doesn't auto-create). Workers must already exist in WOP.

**Scope:** US employees only  
**Does NOT sync:** Indian employees, contractors, interns

**Workflow (WOP → Gusto):**
1. HR updates worker in WOP:
   - Change salary
   - Change department
   - Change job title
   - Change address
2. WOP automatically syncs to Gusto (within 30 seconds)
3. Gusto payroll updated with latest data
4. Next paycheck reflects changes

**Gusto Sync Requirements (FIX #6: W-4 Required):**
```
Before syncing US employee to Gusto, verify:
├─ Worker location: "US"
├─ W-4 document: UPLOADED and VERIFIED
├─ W-4 status: Not expired
├─ If missing/expired: Cannot sync (error)
└─ Result: Compliant with IRS requirements
```

**Gusto Sync Rate Limiting (FIX #9: Queue System)**
```
Why queue?
├─ Gusto API limit: 30 requests/minute
├─ Problem: 50 employees sync at once → Overload
├─ Solution: Queue them, process safely

How it works:
├─ Sync request received
├─ Added to queue (first-in, first-out)
├─ Process: 10 at a time (safe rate)
├─ Failed sync: Auto-retry with exponential backoff
├─ HR sees: [Synced] [Pending] [Failed]
└─ Result: No surprises, all syncs complete eventually
```

**Workflow (Gusto → WOP):**
1. Payroll processed in Gusto (bi-weekly, monthly)
2. Gusto sends back to WOP:
   - Pay date and amount
   - Taxes withheld
   - Deductions
   - YTD totals
3. HR can view payroll history in worker profile
4. Workers can see pay stubs (read-only)

**Real-Time Sync:**
- Salary changes: Within 30 seconds
- Department changes: Within 30 seconds
- Job title changes: Within 30 seconds
- Marked for exit: Immediate (sets termination date in Gusto)

**One entry. Always in sync. No duplication.**

**Indian Employees & Contractors:**
- NO sync to Gusto
- Use separate payroll system (external)
- WOP tracks salary for reference only

---

## 15. CONTRACT MANAGEMENT (Contractors Only)

**What's Tracked:**
- Contract start date
- Contract end date (renewal date)
- Scope (scope of work)
- Rate (per hour or per month)
- Duration (contract length)
- Additional SOW (additional statements of work)
- Amendment history (all changes tracked)

**Renewal Alerts (Automated - Daily Check):**

How it works:
```
Every day at 1 AM, system checks all active contracts
                ↓
For each contractor, calculates: Days until expiry
                ↓
If days = 90, 60, 30, or 7 → Send alert
                ↓
HR sees in-portal notification
Contractor sees in-portal notification
```

**4 Alerts Sent (Automatically):**

- **90 days before expiry:** Alert to HR
  - Message: "Contract expires in 90 days"
  - Priority: Medium
  - Action: "Think about renewal"

- **60 days before expiry:** Second alert to HR
  - Message: "Contract expires in 60 days"
  - Priority: Medium
  - Action: "Start renewal discussions"

- **30 days before expiry:** Escalation to Senior HR
  - Message: "Contract expires in 30 days"
  - Priority: Medium-High
  - Action: "Make renewal decision"

- **7 days before expiry:** Final alert + Badge
  - Message: "⚠️ CONTRACT EXPIRES IN 7 DAYS"
  - Priority: HIGH
  - Action: "URGENT - Final action needed"

**Alert System Details:**

1. **Daily Automated Check:**
   - Runs at 1:00 AM every day
   - Checks all contractors with active contracts
   - Calculates days until each contract expires
   - Sends alerts at exact thresholds (90, 60, 30, 7 days)

2. **Alert Delivery:**
   - In-portal notification (appears in dashboard)
   - Email to HR team
   - Logged in audit trail
   - Shows contract details (scope, rate, expiry date)

3. **Alert Tracking:**
   - System records which alerts were sent
   - Prevents duplicate alerts (only sends once per threshold)
   - Stores: Date sent, Days remaining, Alert type

4. **Example Timeline:**
   ```
   Contract expires: December 31, 2026
   
   October 2, 2026 (90 days before)
   └─ Alert sent: "Contract expires in 90 days"
   
   November 1, 2026 (60 days before)
   └─ Alert sent: "Contract expires in 60 days"
   
   December 1, 2026 (30 days before)
   └─ Alert sent: "Contract expires in 30 days"
   
   December 24, 2026 (7 days before)
   └─ Alert sent: "⚠️ CONTRACT EXPIRES IN 7 DAYS"
   
   December 31, 2026 (Expiry)
   └─ Contract expires (no auto-renewal)
   ```

**Contract Amendments Tracking (Full History):**

**How to Create Amendment:**
1. HR clicks on contractor's contract
2. Clicks [Amend Contract]
3. Selects what changed:
   - ☐ Scope (new scope of work)
   - ☐ Rate (change hourly/monthly rate)
   - ☐ Duration (extend or shorten contract)
4. For each selected:
   - Shows current value (read-only)
   - Enter new value
   - Reason for change (optional text)
5. Clicks [Save Amendment]

**What Gets Recorded:**
- Amendment ID (auto-numbered: Amendment #1, #2, #3...)
- Change type (scope / rate / duration)
- Old value (what it was before)
- New value (what it is now)
- Reason (why it changed)
- Changed by (HR person's name)
- Changed date (timestamp)
- Approval status (auto-approved by HR)

**Firestore Storage:**
```
contract_amendments: [
  {
    amendment_id: 1,
    date: "2026-10-15",
    type: "scope",
    old_value: "Build API endpoints",
    new_value: "Build API + Authentication",
    reason: "Scope expansion",
    changed_by: "Priya (HR)"
  },
  {
    amendment_id: 2,
    date: "2026-11-01",
    type: "rate",
    old_value: 500,
    new_value: 550,
    reason: "Performance bonus",
    changed_by: "Priya (HR)"
  },
  {
    amendment_id: 3,
    date: "2026-12-01",
    type: "duration",
    old_value: "6 months",
    new_value: "12 months",
    reason: "Contract extension",
    changed_by: "Priya (HR)"
  }
]
```

**What Updates:**
- Current contract fields updated (scope, rate, duration)
- Amendment appended to history (not deleted)
- If duration changed: renewal_date recalculates
- If rate changed: next invoice uses new rate
- Full history preserved (immutable, can't edit)

**Example:**
```
Original Contract (July 1, 2026):
├─ Scope: "Build API endpoints"
├─ Rate: ₹500/hour
└─ Duration: 6 months

Amendment 1 (Oct 15):
├─ Scope: "Build API endpoints" → "Build API + Authentication"

Amendment 2 (Nov 1):
├─ Rate: ₹500/hour → ₹550/hour (2nd invoice onwards)

Amendment 3 (Dec 1):
├─ Duration: 6 months → 12 months
└─ New renewal date: July 1, 2027 (instead of Dec 31)

Current Status:
├─ Scope: "Build API + Authentication" ✓
├─ Rate: ₹550/hour ✓
├─ Duration: 12 months ✓
└─ History: 3 amendments recorded ✓
```

**Who can see:**
- HR: Full amendment history + can create new amendments
- Senior HR: Full amendment history + can create
- Contractor: Can see all amendments affecting their contract
- Everyone else: No access

**Why Amendments Matter:**
✓ Compliance: Full audit trail for audits/disputes
✓ Transparency: Contractor sees all changes
✓ Negotiation history: Shows improvements (rate increases)
✓ Invoicing accuracy: Uses correct current rate
✓ Renewal tracking: Handles duration changes automatically
✓ No deletions: Immutable history prevents "I never agreed to that"

---

## 16. INVOICE WORKFLOW (Contractors Only)

**Invoice States:**
1. **Submitted** — Contractor submits invoice
2. **Approved** — HR reviews and approves (amount, rate, payment details verified)
3. **Paid** — Payment processed (marked complete)

**Contractor Submits Invoice:**
1. Click "Submit Invoice"
2. Enter invoice details:
   - Invoice number (e.g., INV-2026-001)
   - Amount (₹)
   - Period (June 1–30, 2026)
   - Description of work
   - Invoice date
3. Upload invoice file (PDF/image)
4. Click [Submit]
5. Status: Submitted

**HR Approves & Processes (FIX #3: Exchange Rate Handling):**
1. Sees notification: "New invoice from [Contractor]"
2. Reviews invoice and verifies:
   - Amount matches contract rate (₹500/hr × 160 hrs = ₹80,000 ✓)
   - Work period is correct
   - Invoice format is acceptable
   - Bank account details correct (for payment)
   - Tax implications if applicable

3. ✓ FIX #3: If invoice is in foreign currency (e.g., GBP, USD, EUR):
   - System displays: "Invoice Amount: GBP 1,000"
   - HR action: Enter or fetch exchange rate
   - Option A (Manual): HR types: "119" (1 GBP = ₹119)
   - Option B (Automatic): HR clicks [Auto-fetch rate]
     - System calls Google Finance API
     - Gets: Current rate for that date
     - Shows: ₹119
   - System calculates: GBP 1,000 × 119 = INR 119,000
   - Display: "Invoice: GBP 1,000 (INR 119,000 @ ₹119/GBP on June 30)"
   - Stores: exchange_rate: 119, rate_source: "manual"

4. Clicks ☑ [Approve & Process] or ✗ [Reject with reason]
5. If approved:
   - Status changes: Approved
   - Exchange rate LOCKED (cannot change)
   - Payment process initiated (amount in INR or original currency per contract)
   - HR (or finance partner) transfers funds
   - Invoice marked: ☑ [Paid]
   - Contractor notified: "Your invoice was paid on [date]"
   - Audit trail: "Invoice approved: GBP 1,000 @ ₹119/GBP"

**Example Timeline:**
```
June 30: Contractor submits invoice (₹80,000)
July 1 09:00 AM: HR reviews invoice
   ├─ Verifies: ₹500/hr × 160 hrs = ₹80,000 ✓
   ├─ Checks: Bank account on file
   ├─ Confirms: Dates match work period
   └─ Approves & initiates payment
July 2: Payment processed (bank transfer)
July 3: Status: Paid
```

**Contractor View:**
- List of all invoices (with status)
- "Pending payment" count (Submitted + Approved)
- "Paid" section (completed invoices)

**HR View:**
- All contractor invoices (across all contractors)
- Filter by status
- Total outstanding (not yet paid)
- Total paid (this month, this year)
- Payment tracking per contractor

---

## 17. AUTO-DELETE (After 3 Years)

**What Gets Deleted:**
- ✓ Worker profile (name, email, department, etc.)
- ✓ All documents (PAN, Aadhaar, Degree, etc.)
- ✓ All projects assigned
- ✓ All goals and progress tracking
- ✓ All reviews (30/60/90-day, annual)
- ✓ All performance ratings and feedback
- ✓ All weekly summaries
- ✓ All invoices (contractors)
- ✓ All contracts and amendments
- ✓ Personal to-do lists
- ✗ Audit trail (KEPT FOREVER — never deleted)

**HOW: Automatic Deletion Process**

**Scheduled Job (Runs Daily at 1 AM UTC):**
```
Step 1: Check all exited workers
Step 2: Calculate: exit_date + 3 years = deletion_date
Step 3: If today >= deletion_date:
   a) Delete from Firestore (database)
   b) Delete from Cloud Storage (documents)
   c) Delete from Google Drive (backups)
   d) Log deletion in audit trail
   e) Send HR notification email
Step 4: Process repeats daily (ensures nothing is missed)
```

**WHERE: Complete Deletion From All Systems**

**1. Firestore Database → DELETED**
```
Firestore /workers collection:
├─ Before: worker-001 record exists (all documents, goals, reviews)
└─ After: worker-001 record DELETED (completely removed)

Firestore /documents collection:
├─ Before: 20 documents for worker-001 (PAN, Aadhaar, etc.)
└─ After: All 20 documents DELETED (by worker_id filter)

Firestore /projects collection:
├─ Before: 3 projects for worker-001
└─ After: All 3 projects DELETED

Firestore /goals, /reviews, /invoices, /contracts:
├─ Before: All records for worker-001 exist
└─ After: ALL DELETED by worker_id
```

**2. Cloud Storage Buckets → DELETED**
```
gs://katbotz-workforce-docs/2026/worker-001/
├─ Before: Folder contains:
│  ├─ pan.pdf (3 versions)
│  ├─ aadhaar.jpg (2 versions)
│  ├─ degree.pdf (1 version)
│  ├─ contract.pdf (5 versions)
│  └─ 20+ other files
└─ After: ENTIRE FOLDER DELETED (all versions removed)

Lifecycle Policy (automatic):
├─ Deletes all versioned files
├─ Clears storage immediately
└─ No recovery possible
```

**3. Google Drive (Backups) → DELETED**
```
KATBOTZ Workforce Backups/2026/Rohan Mehta/
├─ Before: Daily backup folder with:
│  ├─ Documents/ (snapshots)
│  ├─ Projects/ (project details)
│  ├─ Reviews/ (PDFs)
│  └─ Invoices/ (invoice files)
└─ After: ENTIRE FOLDER DELETED

Drive Trash:
├─ Moves to trash
├─ Auto-empties after 30 days
└─ Permanently removed
```

**4. Audit Trail (Database) → KEPT FOREVER**
```
audit_logs/ collection:
├─ Before: 100+ logs for worker-001
│  ├─ "Uploaded PAN on June 1"
│  ├─ "Verified Aadhaar on June 5"
│  ├─ "Marked for exit on June 30"
│  └─ ...
└─ After: ALL LOGS KEPT + NEW ENTRY ADDED
   └─ "Rohan Mehta data deleted on June 30, 2029"

Audit Trail is PERMANENT PROOF:
├─ Everything that happened is logged
├─ Deletion itself is logged (with timestamp)
├─ Never deleted (legal compliance)
└─ Accessible to HR forever
```

**Complete Example: Rohan's 3-Year Lifecycle**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YEAR 0: June 30, 2026 - Worker Exits
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HR marks Rohan for exit:
├─ Exit date: June 30, 2026
├─ All data locked (can't modify)
├─ Auto-delete date calculated: June 30, 2029
└─ Audit log: "Rohan marked for exit"

Status: Data is ACTIVE but LOCKED (3 years countdown starts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YEARS 1-3: July 1, 2026 - June 29, 2029 - Retention Period
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All data remains accessible:
├─ Firestore: ✓ Worker profile exists
├─ Cloud Storage: ✓ Documents accessible
├─ Google Drive: ✓ Daily backups continue
├─ HR can view: ✓ All projects, goals, reviews
└─ Data locked: ✓ Can't be deleted manually

Status: Data AVAILABLE but LOCKED (for litigation defense)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YEAR 3: June 30, 2029 at 1:00 AM UTC - AUTO-DELETE EXECUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Automatic deletion job runs:

1:00:01 AM - Firestore Deletion:
└─ DELETE: workers/worker-001
└─ DELETE: All documents, projects, goals, reviews, invoices
└─ Status: REMOVED from database ✓

1:00:15 AM - Cloud Storage Deletion:
└─ DELETE: gs://katbotz-workforce-docs/2026/worker-001/
└─ DELETE: All versions of all files
└─ Status: Folder and contents REMOVED ✓

1:00:30 AM - Google Drive Deletion:
└─ DELETE: KATBOTZ Backups/Rohan Mehta/
└─ Status: Folder moved to trash (auto-empties in 30 days) ✓

1:00:45 AM - Audit Trail Log:
└─ ADD: "Rohan Mehta data deleted on June 30, 2029 1:00:42 AM UTC"
└─ Status: LOGGED forever (never deleted) ✓

1:05 AM - Email Notification:
└─ TO: HR Team
└─ SUBJECT: "Auto-deletion completed for 1 worker"
└─ BODY: "Rohan Mehta - deleted June 30, 2029"

Status: ALL DATA DELETED (except audit trail)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION: Check if Deletion Worked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HR can verify:
✓ Search WOP for "Rohan" → No results found
✓ Check Cloud Storage → Folder gone
✓ Check Google Drive → Folder gone (in trash)
✓ Check audit trail → "Data deleted June 30, 2029"
✓ Try to recover → No recovery option

Status: DELETION CONFIRMED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOREVER: Audit Trail Preserved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Even 10 years later:
├─ Rohan's data: DELETED (no recovery)
├─ Audit trail: COMPLETE (all actions logged)
│  ├─ "June 1, 2026: Rohan onboarded"
│  ├─ "June 30, 2026: Rohan marked for exit"
│  ├─ "June 30, 2029: Rohan data deleted"
│  └─ ...100+ audit entries
└─ Legal proof: PERMANENT (if litigation arises)
```

**No manual action needed. Completely automatic.**

**Why 3 Years?**
- Legal requirement: Labor law requires 3-year retention
- Dispute resolution: If employee sues later, evidence exists
- DPDP compliance: Requires accountability period
- Audit proof: Shows when and how data was deleted

---

## 18. MULTI-CURRENCY SUPPORT (INR & USD + International)

**Supported Currencies:**

Every contractor has a currency based on their location:

```
Location         → Auto Currency
────────────────────────────────
India            → ₹ INR
United States    → $ USD
Spain/EU         → € EUR
United Kingdom   → £ GBP
Canada           → $ CAD
Australia        → $ AUD
Other            → User selects from dropdown
```

**How It Works:**

1. **At Contractor Creation:**
   - HR clicks [Create Contractor]
   - Enters: Name, Email, Location (dropdown)
   - System auto-sets currency based on location
   - Example: Rohan (India) → ₹ INR, John Smith (US) → $ USD
   - No currency conversion in WOP

2. **Rate Entry (Stored in Native Currency):**
   - HR enters rate for contract
   - Rate shows: "₹500 per hour" or "$50 per hour" or "€45 per hour"
   - System stores: Numeric rate (500) + currency code (INR)
   - No conversion between currencies

3. **In Invoices & Reporting:**
   ```
   Indian Contractor:
   ├─ Invoice: ₹500/hour × 160 hours = ₹80,000 INR
   
   US Contractor:
   ├─ Invoice: $50/hour × 160 hours = $8,000 USD
   
   EU Contractor:
   ├─ Invoice: €45/hour × 160 hours = €7,200 EUR
   ```

4. **Multi-Currency Dashboard:**
   ```
   HR sees all contractors with native currency:
   
   Contractor List:
   ├─ Rohan (India): ₹500/hour
   ├─ John Smith (US): $50/hour
   ├─ Maria (Spain): €45/hour
   
   Monthly Payroll (No Mixing):
   ├─ INR Total: ₹152,000
   ├─ USD Total: $16,800
   ├─ EUR Total: €14,880
   └─ Finance handles conversion externally if needed
   ```

5. **Gusto Integration (US Only):**
   - US contractors with $ USD sync to Gusto
   - Indian contractors with ₹ INR: NO Gusto sync (external payroll)
   - EU contractors with € EUR: NO Gusto sync (external payroll)

6. **Amendment with Currency Change:**
   - If contractor relocates (e.g., India → US)
   - HR marks location change in amendment
   - Currency auto-updates: ₹ → $
   - System records old and new currency in amendment history

**Key Point:** WOP stores every contractor in their native currency. No automatic conversion. Finance team handles currency conversion externally if needed.

---

## 19. SETTINGS & ADMIN CONFIGURATION

**What it does:** Complete admin panel for configuring and customizing WOP

**Who uses it:** Founder (full access), Senior HR (most settings), HR (limited settings)

**What can be configured:**

**1. User & Role Management**
- Add/edit/remove HR team members
- Assign roles: HR or Senior HR
- Manage user permissions
- View all users with activity

**2. Worker Type Configuration**
- Customize document requirements (add beyond defaults)
- Mark documents optional/required
- Configure verification rules
- Changes apply to new workers only

**3. Department & Team Management**
- Add/edit/archive departments
- Assign team leads to departments
- Reassign workers to different departments
- View headcount by department

**4. Document Verification Settings**
- Auto-verification rules (after X days)
- Customize rejection reasons
- Set re-upload limits
- Configure document expiry alerts

**5. Review Schedule Settings**
- Enable/disable review types (30/60/90-day, annual)
- Add custom review intervals
- Set notification reminders
- Configure review form fields

**6. Contract & Invoice Settings**
- Customize renewal alert days (90, 60, 30, 7 days)
- Configure invoice approval flow
- Set payment deadlines
- Configure multi-currency support
- Track contract amendments

**7. Notification Settings**
- Enable/disable notification types
- Customize notification messages
- Set notification retention
- Configure notification recipients

**8. Audit & Compliance**
- View immutable audit logs
- Manage legal holds
- Monitor compliance status
- Export audit trail

**9. Integration Settings**
- Configure Gusto sync (US employees)
- Manage Google Workspace connection
- Test integrations
- Monitor sync status

**10. Backup & Recovery**
- Configure backup schedule
- Create manual backups
- Restore from backup
- Validate backup integrity

**11. Data Retention & Deletion**
- View auto-delete schedule
- Manage legal holds (block deletion)
- Perform emergency manual deletion
- View deletion history

**12. System Status**
- Monitor system health
- View performance metrics
- Check storage usage
- Review error logs

**13. Branding (Optional)**
- Upload company logo
- Customize colors (primary/secondary)
- Set system name
- Customize email templates (future)

**Access Control:**
```
Founder: ✓ Modify all settings
Senior HR: ✓ Modify most settings (except legal hold, data deletion)
HR: ✓ Modify notifications and branding only
Team Lead: ✗ View only (read-only)
Worker: ✗ No access
```

**Key Features:**
- Settings organized by category (easy to find)
- Locked settings for compliance (cannot change retention, audit logs)
- Changes logged in audit trail
- No downtime required for configuration
- Real-time updates (apply immediately)
- Preview changes before saving
- Rollback to previous settings available

**Location:** Settings menu → 13 categories

**Example Workflow:**
```
Founder needs to extend contract renewal alerts

Step 1: Settings → Contracts & Invoices
Step 2: Current: Alert at [90, 60, 30, 7 days]
Step 3: Change to: [90, 60, 45, 30, 14, 7 days]
Step 4: [Save Changes]
Step 5: New contracts use new alert schedule
Step 6: Existing contracts keep old schedule (locked)
Step 7: Action logged in audit trail
```

**See:** [11-SETTINGS.md](11-SETTINGS.md) for detailed settings documentation

---

## Feature Summary

19 features implemented:
1. Worker profiles and types (Employee, Contractor, Intern, Global Intern, Global Contractor + Student ID)
2. Document management with 4-state verification (Pending, Under Review, Verified, Rejected)
3. Project assignment and tracking
4. Goals management (set, track, achieve)
5. Weekly progress summaries
6. Performance reviews (30/60/90-day, annual)
7. Contract management with renewal alerts (90, 60, 30, 7 days)
8. Contract amendments tracking (scope, rate, duration, SOW)
9. Invoice workflow (Submitted → Approved by HR → Paid)
10. Personal to-do lists
11. Automatic data deletion after 3 years
12. Verification-first onboarding (verify before creating accounts)
13. Gusto integration (US employees only)
14. 7-role access control
15. Audit trail and logging
16. In-portal notifications
17. Offboarding workflows
18. Multi-currency support (INR, USD, EUR, GBP, etc.)
19. Settings & admin configuration (13 categories)
