# COMPLETE WOP WORKFLOW — Everything Connected, Top to Bottom

---

## **PART 1: THE BIG PICTURE (How Everything Works Together)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFORCE OPERATIONS PLATFORM (WOP)           │
│                                                                   │
│  WORKER CREATION → ONBOARDING → WORK TRACKING → REVIEW → EXIT   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

4 MAIN SYSTEMS CONNECTED:

1. AUTHENTICATION (Google OAuth)
   └─ Workers login with @katbotz.com email (no passwords)

2. WORKER DATA (Firestore Database)
   └─ All worker info, documents, goals, reviews stored encrypted

3. DOCUMENT STORAGE (Cloud Storage + Google Drive)
   └─ Files encrypted, backed up, versioned, 3-year retention

4. INTEGRATIONS (Zoho + Gusto)
   └─ Auto-create workers (Zoho) + sync payroll (Gusto)
```

---

## **PART 2: COMPLETE WORKER LIFECYCLE (Birth to Death)**

---

### **PHASE 1: WORKER CREATION (Day 0)**

#### **Scenario A: Manual Creation (HR Creates Directly)**

```
HR (Priya) wants to create a new worker:

Step 1: HR Opens WOP
├─ URL: workforce.katbotz.com
├─ Logs in: Google OAuth (priya@katbotz.com)
└─ Sees: HR Dashboard

Step 2: HR Clicks [+ Create Worker]
├─ Button always visible (ALWAYS AVAILABLE backup)
└─ Form appears

Step 3: HR Fills Form
├─ Name: Rohan Mehta
├─ Email: rohan@katbotz.com (CHECK: Not already in system)
├─ Type: Employee
├─ Department: Engineering
├─ Team Lead: Akshat
├─ Location: India (for currency selection)
└─ Clicks [Create]

Step 4: System Validates
├─ Check 1: Is email @katbotz.com? YES ✓
├─ Check 2: Does email already exist? NO ✓
├─ Check 3: All required fields filled? YES ✓
└─ Result: VALID → Proceed

Step 5: System Creates Worker in Firestore
DATABASE WRITE:
│
├─ Table: workers
├─ Document: worker-001
├─ Fields:
│  ├─ name: "Rohan Mehta"
│  ├─ email: "rohan@katbotz.com"
│  ├─ type: "Employee" (Indian)
│  ├─ department: "Engineering"
│  ├─ team_lead: "akshat@katbotz.com"
│  ├─ location: "India"
│  ├─ status: "Created" (not yet active)
│  ├─ created_at: "2026-06-20T10:30:00Z"
│  ├─ created_by: "priya@katbotz.com"
│  └─ ENCRYPTION: CMEK AES-256
│
└─ Firestore replicated to: us-central1, europe-west1, asia-south1

Step 6: System Auto-Generates Checklist
├─ Based on type: "Employee"
├─ Required documents:
│  ├─ ☐ PAN card
│  ├─ ☐ Aadhaar
│  ├─ ☐ Degree
│  ├─ ☐ 10th marksheet
│  ├─ ☐ 12th marksheet
│  └─ ☐ Bank proof
└─ Status: All "Pending"

Step 7: System Creates Google Drive Folder
├─ Location: KATBOTZ Workforce/2026/Rohan Mehta/
├─ Subfolders:
│  ├─ Documents/
│  ├─ Projects/
│  └─ Invoices/ (if contractor)
├─ Shared with: rohan@katbotz.com, priya@katbotz.com
└─ Permissions: Worker can upload, HR can view

Step 8: Audit Log Entry
├─ WHO: priya@katbotz.com
├─ WHAT: worker_created
├─ WHEN: 2026-06-20T10:30:00Z
├─ WHERE: worker-001
├─ RESULT: success
├─ ENCRYPTED: Yes (CMEK)
└─ IMMUTABLE: Forever (cannot delete)

Step 9: Send Welcome Email
├─ To: rohan@katbotz.com
├─ Subject: "Your WOP Account is Ready"
├─ Content: "Click here to login: workforce.katbotz.com"
└─ Method: In-portal notification (NO EMAIL, just notification)

Step 10: HR Sees Success
├─ Message: "Worker created: Rohan Mehta"
├─ Worker appears in: Worker List
└─ Status: "Created" (can now log in)

═══════════════════════════════════════════════════════════════

TIME TAKEN: 2-3 minutes (HR manual entry)
WHEN TO USE: Always available, emergency hires, non-Zoho contractors
```

---

#### **Scenario B: Zoho Auto-Create (Webhook Integration)**

```
Recruiter uses Zoho Recruit to hire:

Step 1: Zoho Recruit — Job Offer Process
├─ Recruiter creates: Job opening
├─ Candidate applies
├─ Recruiter interviews candidate
├─ Decision: APPROVED
└─ Clicks: Mark Offer as "Accepted" (in Zoho)

Step 2: Zoho Triggers Webhook
├─ Event: "Offer Status Changed to Accepted"
├─ Zoho automatically sends to WOP:
│  ├─ Webhook URL: https://wop-backend.katbotz.com/api/zoho/worker-created
│  ├─ Method: POST
│  ├─ Data: JSON payload (encrypted HTTPS)
│  └─ Headers: X-Webhook-Signature: HMAC-SHA256 (verifies it's really Zoho)
│
└─ Payload includes:
   ├─ zoho_candidate_id: "z-candidate-12345"
   ├─ candidate_name: "Rohan Mehta"
   ├─ email: "rohan@katbotz.com"
   ├─ position: "Backend Engineer"
   ├─ department: "Engineering"
   ├─ joining_date: "2026-07-01"
   └─ employment_type: "Employee"

Step 3: WOP Backend Receives Webhook
├─ Firewall: HTTPS only (encrypted in transit)
├─ Endpoint: /api/zoho/worker-created
├─ Receives: JSON data + HMAC signature
└─ Immediate action: Log receipt (even if processing fails)

Step 4: WOP Verifies Signature (SECURITY FIX #2)
├─ Extract: Signature from headers (X-Webhook-Signature)
├─ Calculate: HMAC-SHA256(payload, secret_key)
├─ Compare: Calculated signature == provided signature?
├─ If NO: Reject with 401 error "Invalid signature"
├─ If YES: Continue (we trust this is from Zoho)
└─ Prevents: Attackers spoofing fake webhooks

Step 5: Validate Webhook Data
├─ Check 1: Is email @katbotz.com? YES ✓
├─ Check 2: Does email already exist? NO ✓
├─ Check 3: All required fields present? YES ✓
└─ If any check fails: Log error, show in HR dashboard

Step 6: Create Worker (Same as Manual)
├─ Write to Firestore (worker-001)
├─ Generate checklist
├─ Create Drive folder
├─ Audit log entry
└─ Send welcome notification

Step 7: Record Zoho Link
├─ Store: zoho_candidate_id in worker record
├─ Purpose: Can query which workers came from Zoho
└─ Audit trail: "Worker auto-created from Zoho"

Step 8: Webhook Acknowledgment
├─ Return: HTTP 200 OK (tells Zoho: success)
├─ Zoho sees: "Worker auto-created in WOP"
└─ Process complete

═══════════════════════════════════════════════════════════════

TIME TAKEN: 5-10 seconds (fully automatic)
WHEN TO USE: Regular hiring from Zoho Recruit
FALLBACK: If webhook fails, HR can manually create
```

---

### **PHASE 2: ONBOARDING (Days 1-7)**

#### **Step 1: Worker Logs In**

```
Rohan receives notification: "Your WOP account is ready"

Action: Clicks link → workforce.katbotz.com

Step 1: Login Page
├─ Shows: "Sign in with Google" button
└─ Rohan clicks

Step 2: Google OAuth Flow
├─ Browser redirected to: accounts.google.com
├─ Rohan enters: rohan@katbotz.com + password
├─ Google verifies: Credentials correct
├─ Google asks: "Allow WOP to access your profile?"
├─ Rohan clicks: "Allow"
└─ Browser redirected back to: workforce.katbotz.com

Step 3: WOP Validates Token
├─ Receives: OAuth token from Google
├─ Verifies: Token is valid + not expired
├─ Extracts: Email (rohan@katbotz.com)
├─ Looks up: User in Firestore workers table
├─ Finds: worker-001 (Rohan Mehta)
├─ Matches: Email ✓, Status = "Created" ✓
└─ Result: AUTHENTICATED

Step 4: Create Session
├─ Generate: Session ID (unique token)
├─ Store: In secure cookie (HttpOnly, SameSite)
├─ Duration: 1 hour of inactivity (auto-logout)
├─ Encrypt: Yes (all in transit over HTTPS)
└─ Audit log: "Rohan logged in" (2026-06-20 10:35:00Z)

Step 5: Load Dashboard
├─ Query Firestore:
│  ├─ Get: worker-001 details
│  ├─ Get: Documents checklist
│  ├─ Get: Projects (none yet)
│  ├─ Get: Goals (none yet)
│  └─ Get: Notifications (welcome message)
│
└─ Display: Worker Dashboard
   ├─ My Project: (empty, not assigned yet)
   ├─ My Goals: (empty)
   ├─ My Documents: (6 items, all Pending)
   ├─ My Performance: (none yet)
   ├─ My Reviews: (30-day due in 30 days)
   └─ My Notifications: "Welcome to WOP!"
```

---

#### **Step 2: Worker Uploads Documents**

```
Rohan sees checklist:
├─ ☐ PAN card
├─ ☐ Aadhaar
├─ ☐ Degree
├─ ☐ 10th marksheet
├─ ☐ 12th marksheet
└─ ☐ Bank proof

Action: Clicks [Upload] next to PAN

Step 1: File Selection
├─ Browser opens: File picker
├─ Rohan selects: pan_rohan.jpg (2.1 MB)
└─ Clicks: [Upload]

Step 2: Frontend Validation
├─ Check: File format is PDF/JPG/PNG? YES ✓
├─ Check: File size ≤ 5 MB? YES (2.1 MB) ✓
├─ Check: File not corrupted? YES ✓
└─ Result: VALID → Send to backend

Step 3: Upload to Cloud Storage
├─ Connection: HTTPS TLS 1.3 (encrypted)
├─ Destination: gs://katbotz-workforce-docs/2026/worker-001/
├─ Filename: pan.jpg
├─ Encryption: Applied during upload (CMEK AES-256)
├─ Versioning: Enabled (keeps old versions)
├─ Size: 2.1 MB
└─ Duration: 2-5 seconds

Step 4: Metadata Stored in Firestore
├─ Document record created:
│  ├─ document_id: "doc-pan-001"
│  ├─ worker_id: "worker-001"
│  ├─ type: "pan"
│  ├─ file_path: "gs://katbotz-workforce-docs/2026/worker-001/pan.jpg"
│  ├─ file_size: 2145600 (bytes)
│  ├─ uploaded_at: "2026-06-20T10:40:00Z"
│  ├─ uploaded_by: "rohan@katbotz.com"
│  ├─ status: "Pending" (waiting for HR)
│  ├─ verified_by: null
│  ├─ verified_date: null
│  └─ ENCRYPTION: CMEK
│
└─ Firestore auto-replicated to 3 regions

Step 5: Daily Backup (Automatic)
├─ Time: 2 AM UTC (every night)
├─ Process: Firestore → Export to Cloud Storage → Copy to Google Drive
├─ Location: KATBOTZ Workforce (Backup)/2026/Rohan Mehta/Documents/
├─ Retention: 30-day rolling (old backups auto-deleted)
└─ Purpose: Disaster recovery only

Step 6: Audit Log Entry
├─ WHO: rohan@katbotz.com
├─ WHAT: document_uploaded
├─ WHEN: 2026-06-20T10:40:00Z
├─ WHERE: worker-001/pan.jpg
├─ RESULT: success
├─ IMMUTABLE: Forever (cannot delete/modify)

Step 7: Worker Notification
├─ In-portal message: "PAN uploaded successfully"
├─ Status: Changes from "Pending" → "Under Review" (waiting for HR)
└─ Display: "Waiting for HR verification"

Step 8: HR Notification
├─ Priya (HR) gets notification: "Rohan uploaded document"
└─ She sees: [Review Documents] in dashboard

═══════════════════════════════════════════════════════════════

REPEAT for all 6 documents (PAN, Aadhaar, Degree, Marksheets, Bank)
TIME TAKEN: ~15 minutes total (all documents)
```

---

#### **Step 3: HR Verifies Documents**

```
Priya (HR) sees notification: "Rohan Mehta uploaded 1 document"

Action: Clicks [View Documents] → Rohan's Profile

Step 1: HR Opens Worker Profile
├─ Firestore query: Get worker-001
├─ Display: All worker info + document list
├─ Sees:
│  ├─ Documents tab
│  │  ├─ ☐ PAN → Status: Pending (NEW!)
│  │  ├─ ☐ Aadhaar → Status: Pending (not uploaded yet)
│  │  └─ ... (others)
│  └─ Actions: [View] [Verify] [Reject]

Step 2: HR Clicks [View] for PAN
├─ WOP backend generates Signed URL
│  ├─ Purpose: Temporary link to view file
│  ├─ Validity: 1 hour (expires after)
│  ├─ Security: HMAC-SHA256 signature (cannot be faked)
│  ├─ Non-reusable: Each view generates new URL
│  └─ Encryption: URL itself encrypted
│
├─ Browser opens: Google Cloud Viewer
│  ├─ Tool: Secure, no download button
│  ├─ Features: Can zoom, rotate, pan
│  ├─ Security: Priya logged in (verified session)
│  └─ Access logged: Audit trail records view
│
└─ Priya reviews: PAN image on screen

Step 3: HR Reviews Image (Manual Work)
├─ Priya looks at: PAN document
├─ Checks:
│  ├─ Is image clear? YES ✓
│  ├─ Is PAN number visible? YES ✓
│  ├─ Is name readable? YES ✓
│  └─ Is document authentic looking? YES ✓
│
└─ Decision: APPROVE (click [Verify])

Step 4: HR Returns to WOP
├─ Closes: Google Cloud Viewer
├─ Returns to: Worker profile in WOP
└─ Sees: [Verify] and [Reject] buttons

Step 5: HR Clicks [Verify]
├─ Action: Approve document
├─ System updates:
│  ├─ status: "Pending" → "Verified" ✓
│  ├─ verified_by: "priya@katbotz.com"
│  ├─ verified_date: "2026-06-23T10:45:00Z"
│  └─ ENCRYPTION: CMEK (locked)
│
└─ Firestore update: COMMITTED

Step 6: Audit Log Entry
├─ WHO: priya@katbotz.com (HR)
├─ WHAT: document_verified
├─ WHEN: 2026-06-23T10:45:00Z
├─ WHERE: worker-001/pan.jpg
├─ DETAILS:
│  ├─ verification_method: "Google Cloud Viewer"
│  ├─ reason: "Clear image, readable"
│  └─ status_before: "Pending" → status_after: "Verified"
│
└─ IMMUTABLE: Forever

Step 7: Worker Notification
├─ Rohan gets notification: "Your PAN was verified ✓"
├─ In-portal message appears
├─ Status in dashboard: ☑ PAN (Done)
└─ Rohan sees: "Approved"

Step 8: If Rejected Instead
├─ Priya clicks: [Reject]
├─ Shows dropdown: Rejection reasons
│  ├─ Unclear/Blurry
│  ├─ Expired
│  ├─ Invalid
│  ├─ Incomplete
│  ├─ Damage/Torn
│  ├─ Wrong Document
│  ├─ Illegible Signature
│  └─ Other (specify)
│
├─ Priya selects: "Unclear/Blurry"
├─ System updates:
│  ├─ status: "Verified" ❌ → "Rejected"
│  ├─ rejection_reason: "Unclear/Blurry"
│  ├─ verified_by: "priya@katbotz.com"
│  └─ verified_date: "2026-06-23T10:45:00Z"
│
├─ Rohan gets notification: "PAN rejected: Unclear/Blurry - Please re-upload"
├─ Rohan can upload new file (version 2)
├─ Old version kept in history
└─ Status resets to: "Pending"

═══════════════════════════════════════════════════════════════

REPEAT for ALL documents: Must verify all 6
Only when ALL verified → Worker "Onboarding Complete"
TIME TAKEN: ~2 hours (HR reviews all documents)
```

---

### **PHASE 3: WORK ASSIGNMENT & TRACKING (Week 1 onwards)**

#### **Step 1: Project Assignment**

```
Priya (HR) assigns project to Rohan:

Action: Clicks [Assign Project]

Step 1: HR Opens Assignment Form
├─ Fields:
│  ├─ Project name: "Mobile App Redesign"
│  ├─ Project lead: "Akshat" (dropdown)
│  ├─ Start date: "2026-06-23"
│  └─ Description: "Redesign mobile app UI/UX"

Step 2: HR Submits Form
├─ Validation:
│  ├─ All fields filled? YES ✓
│  ├─ Project lead exists? YES ✓
│  └─ Start date valid? YES ✓
│
└─ System creates project record

Step 3: Firestore Update
├─ Document: worker-001/projects/project-001
├─ Fields:
│  ├─ name: "Mobile App Redesign"
│  ├─ project_lead: "akshat@katbotz.com"
│  ├─ start_date: "2026-06-23"
│  ├─ status: "Assigned"
│  ├─ assigned_by: "priya@katbotz.com"
│  ├─ assigned_date: "2026-06-23T11:00:00Z"
│  └─ ENCRYPTION: CMEK
│
└─ Audit log: "Project assigned to Rohan" (IMMUTABLE)

Step 4: Rohan Sees Project
├─ Dashboard updates automatically
├─ New section: "My Project"
│  ├─ Project name: Mobile App Redesign
│  ├─ Project lead: Akshat
│  ├─ Start date: June 23
│  └─ Description: Redesign mobile app UI/UX
│
└─ Akshat (Team Lead) notified: "Rohan assigned to your project"
```

---

#### **Step 2: Goal Setting & Tracking**

```
Akshat (Team Lead) sets goals for Rohan:

Action: Clicks [Edit Goals]

Step 1: Akshat Opens Goal Form
├─ Can create multiple goals
├─ Fields per goal:
│  ├─ Goal description: "Complete wireframes"
│  ├─ Deadline: "2026-06-30"
│  ├─ Priority: High
│  └─ Success criteria: "Wireframes for all screens"

Step 2: Akshat Adds 3 Goals
├─ Goal 1: "Complete wireframes" (Deadline: June 30)
├─ Goal 2: "Get stakeholder approval" (Deadline: July 5)
└─ Goal 3: "Implement designs" (Deadline: July 20)

Step 3: Firestore Updates
├─ Document: worker-001/goals/goal-001
├─ Fields:
│  ├─ goal_text: "Complete wireframes"
│  ├─ deadline: "2026-06-30"
│  ├─ status: "Active"
│  ├─ created_by: "akshat@katbotz.com"
│  ├─ created_date: "2026-06-23T11:15:00Z"
│  └─ ENCRYPTION: CMEK
│
└─ Audit log: "3 goals created for Rohan" (IMMUTABLE)

Step 4: Rohan Sees Goals
├─ Dashboard: New "My Goals" section
├─ Sees:
│  ├─ Goal 1: "Complete wireframes" (Deadline: June 30) [Status: Not Started]
│  ├─ Goal 2: "Get stakeholder approval" (Deadline: July 5) [Status: Not Started]
│  └─ Goal 3: "Implement designs" (Deadline: July 20) [Status: Not Started]
│
├─ Can edit: Status (click to mark progress)
└─ Can complete: [Mark Achieved]

Step 5: Rohan Updates Progress
├─ June 25: Clicks Goal 1 → Changes to "In Progress"
├─ June 28: Clicks Goal 1 → Changes to "On Track"
├─ June 30: Clicks [Mark Achieved]
│  ├─ Firestore updates: status = "Achieved"
│  ├─ Audit log: "Goal achieved" (IMMUTABLE)
│  └─ Rohan gets notification: "Wireframes goal completed!"
│
└─ Goal moves to: "Goals Achieved" section

Step 6: HR Monitors Progress
├─ Priya (HR) opens Rohan's profile
├─ Sees: 1/3 goals achieved
├─ Can edit goals if priorities change
└─ Full history kept forever
```

---

#### **Step 3: Weekly Progress Updates**

```
Rohan submits weekly summary:

Action: Clicks [Weekly Summary] → Writes update

Step 1: Rohan Fills Form
├─ Template shows: "Week of June 17–23"
├─ Questions:
│  ├─ "What happened this week?"
│  ├─ "What are you working on next?"
│  └─ "Any blockers?"
│
└─ Rohan writes:
   "Completed wireframes for home screen and login screen.
    Got feedback from Akshat. Next week: iterate on designs.
    Blocker: Waiting for design assets from marketing."

Step 2: Rohan Submits
├─ Clicks [Save]
├─ Firestore update:
│  ├─ Document: worker-001/weekly_summaries/week-25
│  ├─ Fields:
│  │  ├─ week_of: "2026-06-17"
│  │  ├─ summary_text: "Completed wireframes..."
│  │  ├─ submitted_date: "2026-06-23T17:30:00Z"
│  │  └─ ENCRYPTION: CMEK
│  │
│  └─ Audit log: "Weekly summary submitted" (IMMUTABLE)

Step 3: HR Reads Summary
├─ Priya opens: Rohan's profile
├─ Sees: Weekly summaries section
├─ Reads: Rohan's updates
├─ Understands: Progress without asking
└─ No automated emails (just in-portal notification)

Step 4: History Kept Forever
├─ All summaries archived
├─ Rohan can look back anytime
├─ After 3 years (exit): Auto-deleted + proof logged
└─ If fired: All history saved for legal proof
```

---

### **PHASE 4: REVIEWS & PERFORMANCE (Ongoing)**

#### **Step 1: 30-Day Review**

```
30 days after hire: June 20 + 30 days = July 20

System automatic trigger:
├─ Check: Rohan hired on June 20
├─ Check: Today is July 20
├─ Action: Create review record + notify Akshat
└─ Notification: "30-day review due for Rohan"

Step 1: Akshat Opens Review
├─ Firestore creates: Review record (status = "Draft")
├─ Akshat clicks: [Fill Review]
└─ Form shows:
   ├─ Worker: Rohan Mehta
   ├─ Review type: 30-day
   ├─ Due date: July 20
   └─ Questions:
      ├─ Rating: (1-5 stars)
      └─ Feedback: (text field)

Step 2: Akshat Fills Review
├─ Rating: 4/5 stars
├─ Feedback: "Great progress, quick learner, communicates well"
└─ Clicks [Submit]

Step 3: Review Locked (FIX #7)
├─ Status: "Draft" → "Submitted" (LOCKED)
├─ Cannot edit after submission
├─ Submitted date: "2026-07-20T10:30:00Z"
├─ If change needed: Create NEW review (old visible)
└─ Audit log: "30-day review submitted" (IMMUTABLE)

Step 4: Rohan Gets Notification
├─ In-portal message: "Your 30-day review is complete"
├─ Rating: 4/5 stars
├─ Feedback: "Great progress, quick learner..."
└─ Rohan sees: Feedback forever (history kept)

Step 5: Repeat
├─ 60-day review (Aug 19)
├─ 90-day review (Sept 18)
├─ Annual review (June 20, 2027)
└─ All locked after submission
```

---

### **PHASE 5: CONTRACTOR WORKFLOW (If Contractor)**

#### **Contract Setup & Invoice Tracking**

```
Different worker type: Global Contractor (India)

Step 1: HR Creates Contractor
├─ Type: "Indian Contractor"
├─ Required documents:
│  ├─ PAN
│  ├─ Agreement (contract document)
│  └─ Bank proof
│
├─ Special fields:
│  ├─ Contract start: June 1, 2026
│  ├─ Contract end: August 31, 2026 (FIX #1: SOURCE OF TRUTH)
│  ├─ Rate: ₹500/hour
│  └─ Rate type: "per_hour"
│
└─ Duration removed (was causing confusion with renewal_date)

Step 2: Contract Renewal Alerts
├─ System monitors: Contract end date (Aug 31)
├─ Sends alerts:
│  ├─ 90 days before: May 3 (alert: "Contract renews in 90 days")
│  ├─ 60 days before: June 2 (alert: "Contract renews in 60 days")
│  ├─ 30 days before: Aug 1 (alert: "Contract renews in 30 days")
│  └─ 7 days before: Aug 24 (alert: "Contract expires in 7 days")
│
└─ HR decides: Renew or let go

Step 3: Contract Amendment (FIX #4: Rate Locking)
├─ Original contract (v1): ₹500/hour (locked, immutable)
├─ If rate change needed: Create Amendment (v2)
│  ├─ What changed: Rate 500 → 550/hour
│  ├─ Effective: Sept 1, 2026
│  ├─ Approved by: Founder
│  └─ Status: Locked (cannot change)
│
├─ Each invoice uses its effective rate:
│  ├─ Invoice Aug 15: Uses v1 (₹500/hour)
│  ├─ Invoice Sept 15: Uses v2 (₹550/hour)
│  └─ Clear, auditable, fair
│
└─ Amendment history: Complete timeline visible

Step 4: Contractor Submits Invoice
├─ Contractor logs in: WOP
├─ Clicks [Submit Invoice]
├─ Form:
│  ├─ Amount: ₹10,000
│  ├─ Currency: INR
│  ├─ Period: June 2026
│  ├─ Description: 20 hours @ ₹500/hour
│  └─ Clicks [Submit]

Step 5: Invoice Stored (FIX #3: Exchange Rates)
├─ Firestore saves:
│  ├─ invoice_id: "INV-001"
│  ├─ contractor_id: "contractor-001"
│  ├─ amount: 10000
│  ├─ currency: "INR"
│  ├─ period: "June 2026"
│  ├─ status: "Submitted"
│  ├─ submitted_by: "contractor@katbotz.com"
│  ├─ submitted_date: "2026-07-01T10:30:00Z"
│  │
│  ├─ ← NEW FIELDS (FIX #3: Exchange Rate)
│  ├─ exchange_rate: 1 (INR to INR is 1:1)
│  ├─ exchange_date: "2026-07-01"
│  ├─ rate_source: "manual" (HR enters)
│  ├─ converted_amount: 10000 (₹10,000 × 1 = ₹10,000)
│  │
│  └─ ENCRYPTION: CMEK

Step 6: HR Reviews & Approves (FIX #2: Invoice Lock)
├─ Priya sees: Invoice pending approval
├─ Clicks [Approve]
├─ System checks:
│  ├─ Amount valid? YES ✓
│  ├─ Period valid? YES ✓
│  └─ Documents verified? YES ✓
│
├─ Status updates:
│  ├─ "Submitted" → "Approved"
│  ├─ approved_by: "priya@katbotz.com"
│  ├─ approved_date: "2026-07-02T10:30:00Z"
│  └─ LOCKED (cannot change after approval)
│
└─ Audit log: "Invoice approved" (IMMUTABLE)

Step 7: Foreign Currency Invoice Example (FIX #3)
├─ US Contractor submits: $500/hour invoice
├─ Amount: $10,000 (200 hours)
├─ Currency: USD
├─ Date: June 15, 2026
│
├─ HR approval process:
│  ├─ Clicks [Approve]
│  ├─ System asks: "Exchange rate for USD on June 15?"
│  │
│  ├─ Option A (Manual): HR types: 83 (1 USD = ₹83)
│  ├─ Option B (API): HR clicks [Auto-fetch] → Gets ₹83 automatically
│  │
│  └─ System stores:
│     ├─ amount: 10000
│     ├─ currency: "USD"
│     ├─ exchange_rate: 83 (₹83/USD)
│     ├─ exchange_date: "2026-06-15"
│     ├─ rate_source: "manual" or "api"
│     ├─ converted_amount: 830000 (₹10,000 × 83 = ₹830,000)
│     └─ Notes: "Exchange rate locked: USD 10,000 = INR 830,000"
│
├─ Finance report:
│  ├─ Invoice 1 (INR): ₹10,000
│  ├─ Invoice 2 (USD): ₹830,000
│  └─ Total: ₹840,000
│
└─ Clear, auditable, no confusion

Step 8: Mark as Paid
├─ Once payment processed: Priya clicks [Mark Paid]
├─ Status: "Approved" → "Paid"
├─ paid_date: "2026-07-05"
└─ Audit log: "Invoice paid" (IMMUTABLE)
```

---

### **PHASE 6: EXIT & OFFBOARDING (Year ends or earlier)**

#### **When Worker Leaves**

```
Worker decides to leave: Dec 31, 2029

Step 1: HR Marks for Exit
├─ Priya clicks: [Mark for Exit]
├─ Form:
│  ├─ Last day: Dec 31, 2029
│  ├─ Reason: (optional)
│  └─ Clicks [Confirm]

Step 2: System Checks (FIX #2: Invoice Lock)
├─ If contractor:
│  ├─ Check: Any pending invoices?
│  ├─ If YES: Block exit, show error "Approve invoices first"
│  ├─ HR must: Approve/reject ALL invoices
│  └─ Only then: Can mark for exit
│
└─ If employee: No invoice check

Step 3: System Locks Everything
├─ Worker status: "Active" → "Exiting"
├─ Documents: Locked (cannot modify)
├─ Contracts: Locked (cannot modify)
├─ Goals: Locked (cannot modify)
└─ Delete date: Dec 31, 2032 (3 years later)

Step 4: Data Retention Period Begins
├─ Timeline:
│  ├─ Dec 31, 2029: Worker exits
│  ├─ Jan 1, 2030 - Dec 31, 2032: Data retained (3 years)
│  │  ├─ All documents kept
│  │  ├─ All reviews kept
│  │  ├─ All projects kept
│  │  ├─ All invoices kept
│  │  └─ All audit logs kept
│  │
│  └─ Dec 31, 2032: Auto-delete triggered
│     ├─ Delete: Worker profile
│     ├─ Delete: Documents
│     ├─ Delete: Projects/Goals/Reviews
│     ├─ Delete: Invoices
│     ├─ BUT KEEP: Audit trail (forever)
│     └─ Proof logged: "Data deleted Dec 31, 2032"

Step 5: Legal Hold (Optional)
├─ If litigation pending: Founder sets legal hold
├─ Effect: Auto-delete skipped
├─ Duration: Specified by Founder (e.g., "Until case closes")
├─ Can renew or remove manually
└─ Audit log: "Legal hold set" → "Legal hold removed"

Step 6: Audit Trail Forever
├─ Example: June 20, 2026 - Dec 31, 2032
│
├─ Entry 1: "Worker created June 20, 2026"
├─ Entry 2: "Document verified July 5, 2026"
├─ Entry 3: "Project assigned July 10, 2026"
├─ Entry 4: "Invoice approved Aug 1, 2026"
├─ ... (1000+ more entries)
├─ Entry 999: "30-day review completed July 20, 2026"
├─ Entry 1000: "Worker data deleted Dec 31, 2032"
│
└─ ALL entries (1-1000): Kept forever (IMMUTABLE)
   ├─ Encryption: CMEK AES-256
   ├─ Location: Firestore (auto-replicated)
   ├─ Access: Founder only
   └─ Purpose: Legal proof if sued
```

---

## **PART 3: STORAGE & BACKUP (How Data Survives)**

```
DATA LIVES IN 3 PLACES:

1. PRIMARY: Firestore (Real-time)
   ├─ What: All worker data, documents metadata, audit logs
   ├─ Encryption: CMEK AES-256
   ├─ Replicated: Auto-replicated to 3 Google regions
   ├─ Backup: Daily export to Cloud Storage
   └─ Retention: 3 years (worker data) or Forever (audit logs)

2. BACKUP: Google Drive (30-day rolling)
   ├─ What: Daily snapshot of all documents
   ├─ Frequency: 2 AM UTC every night
   ├─ Format: JSON export + document copies
   ├─ Retention: 30 days (rolling, old auto-deleted)
   └─ Purpose: Disaster recovery only

3. ARCHIVE: Cloud Storage (Long-term)
   ├─ What: All document files
   ├─ Encryption: CMEK AES-256
   ├─ Versioning: Old versions kept
   ├─ Retention: 3 years (then auto-delete)
   └─ Lifecycle: Auto-delete after 1095 days

EXAMPLE: Where does Rohan's PAN go?

Rohan uploads PAN (June 20):
│
├─ 1. Immediate: Stored in Cloud Storage
│  └─ gs://katbotz-workforce-docs/2026/worker-001/pan.jpg (encrypted)
│
├─ 2. Metadata: Stored in Firestore
│  └─ workers/worker-001/documents/pan (encrypted)
│
├─ 3. Same day: Auto-replicated to 3 regions
│  ├─ us-central1 (redundancy)
│  ├─ europe-west1 (redundancy)
│  └─ asia-south1 (redundancy)
│
├─ 4. Every night: Daily backup
│  └─ KATBOTZ Workforce (Backup)/2026/Rohan Mehta/pan.jpg (copy)
│
├─ 5. For 3 years: All copies kept
│  └─ After 3 years: All deleted
│
└─ 6. Forever: Audit trail kept
   └─ "Rohan uploaded PAN June 20"
   └─ "Priya verified PAN June 23"
   └─ "Pan deleted Dec 31, 2032"
```

---

## **PART 4: SECURITY & COMPLIANCE (How We Stay Safe)**

```
3-LAYER PROTECTION:

Layer 1: AUTHENTICATION
├─ Google OAuth only (@katbotz.com emails)
├─ No passwords in WOP
├─ 2FA from Google inherited
├─ Sessions auto-expire (1 hour)
└─ All login attempts logged

Layer 2: ENCRYPTION
├─ At rest: CMEK AES-256 (Firestore, Cloud Storage)
├─ In transit: HTTPS TLS 1.3 (browser ↔ server)
├─ On device: Browser security (HttpOnly cookies)
└─ Even Google can't read (we manage keys)

Layer 3: AUDIT TRAIL
├─ Every action logged (who, what, when, where, result)
├─ Immutable (cannot delete, even Founder)
├─ Forever (never auto-deleted)
├─ Encrypted (CMEK)
└─ Legal proof: If sued, complete history exists

COMPLIANCE:

DPDP Act (India Privacy Law):
├─ Requirement: Document data processing
├─ Our solution: Audit trail (complete history)
├─ Retention: 3 years (exceeds requirement)
└─ Proof: Auto-delete logged forever

Labor Law (India):
├─ Requirement: Keep records 3 years
├─ Our solution: 3-year retention (automatic)
├─ Proof: Auto-delete timestamp logged
└─ Litigation: All evidence exists for disputes

Example: If worker sues after 2 years
├─ Audit trail shows: All actions from hire to now
├─ Proof: Document verified on date X
├─ Proof: Invoice paid on date Y
├─ Proof: Review completed on date Z
└─ Defense: Complete, auditable, immutable history
```

---

## **PART 5: INTEGRATIONS (How External Systems Connect)**

### **ZOHO RECRUIT INTEGRATION (Auto-create)**

```
Zoho → WOP

Step 1: Recruiter marks offer "Accepted" in Zoho
│
Step 2: Zoho sends webhook
├─ URL: https://wop-backend.katbotz.com/api/zoho/worker-created
├─ Method: POST (HTTP request)
├─ Data: JSON payload
│  ├─ name, email, position, department, joining_date, type
│  └─ X-Webhook-Signature: HMAC-SHA256 (security verification)
│
├─ Security (FIX #2): 
│  ├─ WOP verifies signature before trusting data
│  ├─ If signature invalid: Reject with 401 error
│  ├─ Prevents attackers from spoofing webhooks
│  └─ Only Zoho can send valid requests
│
Step 3: WOP receives webhook
├─ Logs receipt immediately (even if processing fails)
├─ Validates email, checks duplicates
├─ Creates worker in Firestore
├─ Creates Drive folder, sends notification
│
Step 4: If webhook fails
├─ Auto-retry in 1 hour
├─ Auto-retry in 2 hours
├─ Auto-retry in 4 hours
├─ After 3 failures: Show in HR dashboard
├─ HR can: [Create Worker Manually] (fallback)
│
└─ Result: No data loss, manual fallback always works

WEBHOOK FLOW:
Zoho Recruit (HR accepts offer)
         ↓
    Webhook sends data
         ↓
WOP receives + verifies signature
         ↓
Creates worker in Firestore
         ↓
Creates Drive folder
         ↓
Sends notification
         ↓
Worker ready to login (5-10 seconds)
```

### **GUSTO INTEGRATION (Sync Payroll)**

```
WOP ↔ Gusto (Bi-directional)

Scope: US EMPLOYEES ONLY
       (Not Indian, not contractors, not interns)

Step 1: HR Creates US Employee in WOP
├─ Name: Alex
├─ Location: "US"
├─ Salary: $120,000/year
├─ Clicks [Create]

Step 2: All Documents Verified
├─ HR verifies: All required documents
├─ W-4 form: VERIFIED (IRS requirement)
├─ Status: "Active"

Step 3: System Auto-syncs to Gusto
├─ Trigger: Worker status = "Active" + W-4 verified
├─ Data sent:
│  ├─ Name: Alex
│  ├─ Email: alex@katbotz.com
│  ├─ Salary: $120,000
│  ├─ Department, job title, location
│  └─ W-4 verification: YES
│
├─ Gusto receives:
│  ├─ Creates payroll record
│  ├─ Initiates tax form collection
│  ├─ Sets up direct deposit
│  └─ Enables benefits enrollment
│
└─ Result: Alex appears in Gusto immediately

Step 4: Ongoing Sync
├─ If HR changes salary: $120,000 → $130,000
├─ WOP syncs to Gusto (within 1 hour)
├─ Gusto updates payroll
├─ Next paycheck: Reflects new salary
│
├─ Sync with Rate Limiting (FIX #9):
│  ├─ Multiple syncs: Queued (don't overload Gusto)
│  ├─ Process: 10 at a time (safe rate)
│  ├─ Failed sync: Auto-retry with backoff
│  └─ HR sees: [Synced] [Pending] [Failed]
│
└─ If sync fails 3x: Alert HR

GUSTO SYNC REQUIREMENTS (FIX #6):
├─ Location: US only
├─ W-4: MUST be verified before sync
├─ If W-4 missing: Cannot sync (error)
├─ If W-4 expired: Cannot sync (error)
└─ Annual renewal: Auto-alert 30 days before expiry

EXAMPLE: Multi-currency sync impact
├─ Salary change: USD 120,000 → 130,000
├─ Change reason: Performance increase
├─ Impact: ₹325 more per pay period (approx)
│  ├─ 120,000 USD @ ₹83/USD = ₹99,60,000
│  ├─ 130,000 USD @ ₹83/USD = ₹1,07,90,000
│  ├─ Difference: ₹8,30,000/year
│  └─ Per pay period (biweekly): ₹3,19,230 more
│
└─ Gusto syncs exact amount (system calculates)
```

---

## **PART 6: FLOWS IN ACTION (Real Example)**

### **Complete Example: One Worker's First Week**

```
DAY 0: MONDAY JUNE 20, 2026

09:00 AM
├─ Recruiter marks offer "Accepted" in Zoho
├─ Zoho sends webhook to WOP
├─ System creates worker (Rohan Mehta)
├─ Google Drive folder created
├─ Notification sent: "Your account is ready"
└─ Time elapsed: 5 seconds

09:05 AM
├─ Rohan receives notification
├─ Clicks link → workforce.katbotz.com
├─ Logs in with Google OAuth
├─ Dashboard loads
├─ Sees: Document checklist (6 items pending)
└─ Decision: Start uploading documents now

09:10 AM - 09:25 AM
├─ Rohan uploads: PAN (pm1)
├─ System validates format + size
├─ Stored in Cloud Storage (encrypted)
├─ Metadata saved to Firestore
├─ Daily backup scheduled for 2 AM
├─ Status: "Pending" (waiting for HR)
└─ Audit log: "Rohan uploaded PAN"

09:30 AM - 10:00 AM
├─ Rohan uploads: Aadhaar, Degree, Marksheets, Bank proof
├─ Same process for each file
├─ All stored encrypted (CMEK)
├─ All replicated to 3 regions
└─ Audit logs for each: Immutable, forever

═════════════════════════════════════════════════════════════

DAY 2: TUESDAY JUNE 21, 2026

10:00 AM
├─ HR (Priya) comes to office
├─ Opens WOP dashboard
├─ Sees notification: "Rohan uploaded 5 documents"
├─ Clicks [Review Documents]
└─ Opens Rohan's profile

10:15 AM
├─ Priya clicks [View] for PAN
├─ WOP generates signed URL (valid 1 hour)
├─ Browser opens Google Cloud Viewer
├─ Priya reviews image (no download button)
├─ Looks clear, readable, authentic
└─ Returns to WOP

10:20 AM
├─ Priya clicks [Verify]
├─ Status updates: "Pending" → "Verified"
├─ Rohan gets notification: "PAN verified ✓"
├─ Audit log: "Priya verified PAN"
└─ Same for other 4 documents

10:45 AM
├─ All 5 documents verified
├─ Rohan's profile: "Onboarding Complete"
├─ Status: Can now start working
└─ Audit logs: 10 entries (uploads + verifications)

═════════════════════════════════════════════════════════════

DAY 3: WEDNESDAY JUNE 22, 2026

11:00 AM
├─ Priya (HR) opens WOP
├─ Clicks [Assign Project]
├─ Form:
│  ├─ Project: "Mobile App Redesign"
│  ├─ Lead: Akshat
│  └─ Start date: June 23
├─ Clicks [Assign]
└─ Firestore update + Audit log

11:05 AM
├─ Akshat (Team Lead) gets notification: "Rohan assigned to project"
├─ Clicks [Edit Goals]
├─ Creates 3 goals:
│  ├─ "Complete wireframes" (Jun 30)
│  ├─ "Get approval" (Jul 5)
│  └─ "Implement designs" (Jul 20)
└─ Firestore + Audit logs

11:10 AM
├─ Rohan gets notification: "Project assigned: Mobile App Redesign"
├─ Also sees: "3 goals created for you"
├─ Dashboard updates automatically
└─ Can now start work with clear goals

═════════════════════════════════════════════════════════════

DAY 10: FRIDAY JUNE 30, 2026

04:00 PM
├─ Rohan finishes wireframes (Goal 1)
├─ Clicks [Mark Achieved]
├─ Firestore: goal-001 status = "Achieved"
├─ Goal moves to: "Goals Achieved" section
├─ Notification: "Wireframes goal completed!"
├─ Audit log: "Goal 1 achieved by Rohan"
└─ 1/3 goals complete

04:30 PM
├─ Rohan writes weekly summary
├─ "Completed wireframes, got feedback, ready for iteration"
├─ Clicks [Save]
├─ Firestore saves summary (week 1)
├─ Priya gets notification: "Rohan submitted weekly summary"
├─ Priya reads: Understands progress
└─ Audit log: "Weekly summary submitted"

═════════════════════════════════════════════════════════════

DAY 40: JULY 20, 2026

(30 days after hire)

09:00 AM
├─ System triggers: 30-day review due
├─ Akshat gets notification: "30-day review due for Rohan"
└─ Creates review record

10:00 AM
├─ Akshat opens WOP
├─ Clicks [Fill Review]
├─ Rating: 4/5 stars
├─ Feedback: "Great progress, quick learner"
├─ Clicks [Submit]
├─ Review LOCKED (FIX #7)
├─ Cannot edit after submission
└─ If changes needed: Create new review

10:05 AM
├─ Rohan gets notification: "Your 30-day review is complete"
├─ Rating: 4/5 stars
├─ Feedback visible: "Great progress..."
├─ Rohan saved to profile forever
├─ Audit log: "30-day review submitted"
└─ If sued later: Proof of positive feedback exists

═════════════════════════════════════════════════════════════

SUMMARY (First 20 Days):

Firestore entries: 20+ (all encrypted, auto-replicated)
├─ Worker created
├─ 5 documents uploaded
├─ 5 documents verified
├─ Project assigned
├─ 3 goals created
├─ 1 goal achieved
├─ 1 weekly summary
├─ 1 30-day review
└─ All audit logs (IMMUTABLE, forever)

Backup copies: Made every night
├─ Documents in Google Drive (30-day rolling)
└─ Firestore exported to Cloud Storage

Data encrypted: Every byte
├─ Firestore: CMEK AES-256
├─ Cloud Storage: CMEK AES-256
├─ In transit: HTTPS TLS 1.3
└─ On device: Browser security

Access logged: Every action
├─ WHO: User email, IP address, browser
├─ WHAT: Specific action (upload, verify, etc.)
├─ WHEN: Exact timestamp
├─ WHERE: Which document, goal, worker
├─ RESULT: Success or failure
└─ All immutable, queryable, forever
```

---

## **SUMMARY: How Everything Works Together**

```
WORKER → WOP → FIRESTORE
         ↓
      BACKUP (Drive)
         ↓
      ARCHIVE (Cloud Storage)
         ↓
      AUDIT TRAIL (Forever)

FLOW:
1. Worker created (manual or Zoho webhook)
2. Worker logs in (Google OAuth)
3. Worker uploads documents (encrypted → Cloud Storage)
4. HR verifies documents (signed URLs → Google Cloud Viewer)
5. HR assigns project (Firestore update)
6. Team Lead sets goals (Firestore update)
7. Worker tracks progress (Firestore update)
8. HR fills reviews (Firestore update → LOCKED)
9. Contractors submit invoices (Firestore + exchange rates)
10. HR approves invoices (Firestore + exchange rates locked)
11. Worker exits (all data locked for 3 years)
12. Auto-delete (3 years later, audit trail kept forever)

EVERYTHING CONNECTED:
├─ Authentication: Google OAuth
├─ Database: Firestore (encrypted)
├─ Storage: Cloud Storage + Drive
├─ Integrations: Zoho + Gusto
├─ Audit: Immutable logs (forever)
├─ Backup: Daily, 30-day rolling
├─ Encryption: CMEK AES-256 everywhere
└─ Compliance: 3-year retention, auto-delete, proof logged

LEGAL PROOF:
├─ DPDP Act: Audit trail documents all processing
├─ Labor Law: 3-year retention (exceeds requirement)
├─ Litigation: Complete history (cannot be deleted)
└─ Immutable: Even Founder cannot tamper

RESULT: One complete, secure, auditable system of record
```

---

This is the **COMPLETE END-TO-END WORKFLOW** you can explain to your boss!

