# SYSTEM ARCHITECTURE AND DIAGRAMS

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFORCE OPERATIONS PLATFORM               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   User Interface     │         │  External Systems    │
├──────────────────────┤         ├──────────────────────┤
│  Next.js Frontend    │◄─────────┤  Google OAuth        │
│  (Port 3000)         │         │                      │
└──────────────────────┘         └──────────────────────┘
         │
         │ HTTPS
         │
┌──────────────────────┐         ┌──────────────────────┐
│  API Backend         │◄────────►│  Zoho Recruit        │
├──────────────────────┤         │  (API Integration)   │
│  FastAPI/Python      │         └──────────────────────┘
│  (Cloud Run)         │
│  (Port 8000)         │         ┌──────────────────────┐
└──────────────────────┘◄────────►│  Gusto               │
         │                        │  (API Integration)   │
         │ SQL/gRPC              └──────────────────────┘
         │
┌────────┴──────────────────────────────────────────────┐
│           GOOGLE CLOUD INFRASTRUCTURE                 │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌──────────────────┐           │
│  │    Firestore    │  │  Cloud Storage   │           │
│  │  (Database)     │  │  (File Storage)  │           │
│  └─────────────────┘  └──────────────────┘           │
│                                                         │
│  ┌──────────────────────────────────────────┐        │
│  │      Google Drive (Document Storage)     │        │
│  └──────────────────────────────────────────┘        │
│                                                         │
└────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│  Monitoring          │         │  Backups             │
├──────────────────────┤         ├──────────────────────┤
│  Cloud Logging       │         │  Daily Automated     │
│  Cloud Monitoring    │         │  Retention: 30 days  │
└──────────────────────┘         └──────────────────────┘
```

---

## 2. DATA FLOW DIAGRAM - WORKER ONBOARDING

```
┌──────────────────┐
│  Zoho Recruit    │
│  (Offer)         │
└────────┬─────────┘
         │
         │ Offer Accepted Event
         │ (Name, Email, Type, Dept, Join Date)
         ▼
┌──────────────────────────────────────┐
│  WOP API                             │
│  POST /workers (Zoho webhook)        │
└────────┬─────────────────────────────┘
         │
         │ Validate Data
         │ Check Email Domain (katbotz.com)
         │ Generate Document Checklist by Type
         ▼
┌──────────────────────────────────────┐
│  Create Worker Profile               │
└────────┬─────────────────────────────┘
         │
    ┌────┴──────────────────────┐
    │                           │
    ▼                           ▼
┌──────────────────┐      ┌───────────────────────┐
│  Firestore       │      │  Google Drive         │
│  - Profile       │      │  Create Worker Folder │
│  - Checklist     │      │  Share: Worker + HR   │
│  - Status        │      └───────────────────────┘
└──────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  Send Welcome Email                  │
│  "Log in to upload documents"        │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  Worker Logs In (Google OAuth)       │
│  Sees Document Checklist             │
│  Begins Uploading Documents          │
└──────────────────────────────────────┘
```

---

## 3. DATA FLOW DIAGRAM - DOCUMENT VERIFICATION

```
┌──────────────────┐
│  Worker Portal   │
│  Upload Document │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  WOP API                             │
│  POST /documents (Signed URL)        │
└────────┬─────────────────────────────┘
         │
         │ Validate File
         │ Check Size, Type
         ▼
┌──────────────────────────────────────┐
│  Upload to Google Drive              │
│  /KATBOTZ Workforce/2026/Worker/     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Firestore                           │
│  Create Document Record              │
│  Status: Pending                     │
│  Path: gs://drive/file-id            │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  HR Dashboard                        │
│  Sees Pending Documents              │
└────────┬─────────────────────────────┘
         │
    ┌────┴─────────────────┐
    │                      │
    ▼                      ▼
┌──────────────────┐  ┌──────────────────┐
│  Click Document  │  │  Click Document  │
│  Review in Drive │  │  Review in Drive │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  Mark Verified   │  │  Mark Rejected   │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  Firestore       │  │  Firestore       │
│  Status:         │  │  Status:         │
│  Verified        │  │  Rejected        │
│  Verified_by:    │  │  Rejection_reason│
│  Verified_date   │  │  Verified_by:    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  Worker Sees     │  │  Worker Gets     │
│  Checkmark       │  │  Notification    │
│  "Verified"      │  │  "Rejected: ..." │
│                  │  │  Must Re-upload  │
└──────────────────┘  └──────────────────┘
```

---

## 4. DATA FLOW DIAGRAM - GUSTO SYNC

```
┌──────────────────────────────┐
│  Worker Activated in WOP     │
│  All Docs Verified           │
│  Compliance Passed           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  WOP Backend                         │
│  Trigger: Worker.status = "Active"   │
└────────┬─────────────────────────────┘
         │
         │ Prepare Payload:
         │ - Name, Email, Department
         │ - Job Title, Joining Date
         │ - Salary (if provided)
         │
         ▼
┌──────────────────────────────────────┐
│  Call Gusto API                      │
│  POST /employees                     │
└────────┬─────────────────────────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌──────────────────┐  ┌──────────────────┐
│  Success         │  │  Error           │
│  (200 OK)        │  │  (4xx or 5xx)    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  Firestore       │  │  Log Error       │
│  gusto_id:       │  │  gusto_sync:     │
│  (employee ID)   │  │  "failed"        │
│  gusto_synced:   │  │  Alert HR:       │
│  true            │  │  "Gusto sync     │
└──────────────────┘  │  failed"         │
                      └──────────────────┘
         │                     │
         ▼                     ▼
         │              HR manually
         │              calls Gusto API
         │              to sync worker
         │
    After Worker Marked for Exit
    │
    ├─ Salary Changed: WOP → Gusto (1 hour)
    ├─ Department Changed: WOP → Gusto (1 hour)
    └─ Marked Exit: WOP → Gusto (Immediate)
       └─ Termination Date Set in Gusto
```

---

## 5. ROLE-BASED ACCESS CONTROL DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     LOGIN (Google OAuth)                    │
│                   (katbotz.com domain)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
         ┌────────────┐    ┌────────────┐
         │ Role Check │    │ Redirect   │
         │ in JWT     │    │ to Portal  │
         └────────┬───┘    └────────┬───┘
                  │                 │
        ┌─────────┼─────────┬───────┼──────────┐
        │         │         │       │          │
        ▼         ▼         ▼       ▼          ▼
    ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
    │ F  │  │ SH │  │ HR │  │ TL │  │ EE │  │ CT │  │ IN │
    │ (RO)   │(ALL)  │ AS │  │(TM)   │(SELF)  │(SELF)  │(SELF)
    └────┘  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘
    │       │       │       │       │       │       │
    │       │       │       │       │       │       │
    F=Founder (Read-Only All)
    SH=Senior HR (All Permissions)
    HR=HR Executive (Verify Docs, Assign Projects)
    TL=Team Lead (Team Only)
    EE=Employee (Self Only)
    CT=Contractor (Self Only)
    IN=Intern (Self Only)

    Permission Enforcement:
    - Every API endpoint checks role before returning data
    - Worker can only access own profile
    - Team Lead can only access team members
    - HR can access all workers
    - Senior HR can access all + delete/mark exit
    - Founder can view all (read-only)
```

---

## 6. DOCUMENT STATUS WORKFLOW DIAGRAM

```
┌──────────────────────┐
│  Worker Uploads Doc  │
│  (or Re-uploads)     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Firestore Document Record Created   │
│  Status: "Pending"                   │
│  Uploaded_date: [timestamp]          │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  HR Dashboard                        │
│  Document Appears in Verification    │
│  Queue                               │
└──────────┬───────────────────────────┘
           │
    ┌──────┴──────────────────┐
    │                         │
    ▼                         ▼
┌─────────────────────┐  ┌──────────────────┐
│  Mark Verified      │  │  Mark Rejected   │
│                     │  │  (with reason)   │
│  Status: Verified   │  │                  │
│  Verified_by: HR    │  │  Status:         │
│  Verified_date: now │  │  Rejected        │
└──────────┬──────────┘  │  Rejection_reason│
           │              │  Verified_by: HR │
           │              │  Verified_date:  │
           │              │  now             │
           │              └──────────┬───────┘
           │                         │
           ▼                         ▼
    ┌────────────────┐      ┌──────────────────┐
    │  Worker Views  │      │  Worker Notified │
    │  Checkmark:    │      │  Must Re-upload  │
    │  Verified      │      │  Reason: ...     │
    └────────────────┘      │                  │
                            │  Status Returns  │
                            │  to Pending      │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Worker Uploads  │
                            │  New Document    │
                            │  (Back to Pending)
                            └──────────────────┘
```

---

## 7. OFFBOARDING AND AUTO-DELETE WORKFLOW

```
┌─────────────────────────────────┐
│  HR Marks Worker for Exit       │
│  Selects Last Day (e.g., 6/30)  │
└────────────┬────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Firestore Update                    │
│  Status: Exiting                     │
│  Last_day: 2026-06-30                │
│  Delete_after: 2029-06-30 (auto-calc)│
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Notify Gusto (via API)              │
│  Termination Date: 2026-06-30        │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  3-Year Retention Period             │
│  Documents Locked (Read-only)        │
│  Data Cannot Be Modified             │
│  Profile Shows "Archived"            │
└────────────┬───────────────────────┘
             │
   [Waits 3 years: June 30, 2029]
             │
             ▼
┌──────────────────────────────────────┐
│  Monthly Auto-Delete Job Runs        │
│  (1st of each month)                 │
│  Checks: delete_after <= today       │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  If Criteria Met: Auto-Delete        │
│                                      │
│  1. Delete from Firestore:           │
│     - Worker profile                 │
│     - Goals, reviews, performance    │
│     - To-do lists                    │
│     - Project assignments            │
│                                      │
│  2. Delete from Google Drive:        │
│     - All documents in worker folder │
│                                      │
│  3. Log Action:                      │
│     - Audit log entry created        │
│     - "Worker data deleted [date]"   │
└────────────┬───────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Deletion Complete                   │
│  Audit Log Kept Forever              │
│  (Proof deletion occurred)           │
└──────────────────────────────────────┘
```

---

## 8. INTEGRATION SEQUENCE DIAGRAM

```
TIMELINE: Worker Hired to Active

Day 0: Offer Accepted
│
├─ Event: Zoho Recruit marks offer "Accepted"
│
├─ [5 minutes]
│  └─ Zoho → WOP API → Create Worker Profile
│     └─ Firestore + Google Drive folder created
│     └─ Welcome email sent
│
Day 0-7: Onboarding
│
├─ Worker logs in (Google OAuth)
│  └─ Uploads documents to Google Drive
│  └─ Firestore tracks status (Pending)
│
├─ HR verifies documents
│  └─ Firestore status (Verified/Rejected)
│
Day 7: Activation
│
├─ All compliance checks pass
│
├─ Senior HR clicks "Activate"
│  └─ WOP → Gusto API
│     └─ Create payroll record
│     └─ Employee record created in Gusto
│     └─ Gusto sends tax forms to employee
│
Day 7-30: Active Employment
│
├─ Any changes in WOP synced to Gusto:
│  ├─ Salary change: Within 1 hour
│  ├─ Department change: Within 1 hour
│  ├─ Title change: Within 1 hour
│
Day 365+: Normal Operations
│
├─ Reviews scheduled automatically (30/60/90 day, annual)
│
├─ Contract renewals tracked
│
├─ Weekly summaries tracked
│

Exit Day (e.g., 2026-06-30)
│
├─ HR marks "Mark for Exit"
│  └─ WOP → Gusto API
│     └─ Gusto sets termination date
│     └─ Payroll ends on that date
│
├─ Data locked for 3 years
│  └─ Can view but cannot modify
│

3 Years Later (2029-06-30)
│
└─ Auto-delete job runs
   └─ All worker data deleted
   └─ Audit log entry recorded
```

---

## 9. CLOUD INFRASTRUCTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  COMPUTE LAYER                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cloud Run (Serverless)                                 │   │
│  │  ├─ FastAPI Backend (Port 8000)                         │   │
│  │  ├─ Auto-scales (0 → N instances)                       │   │
│  │  ├─ No servers to manage                                │   │
│  │  └─ Costs based on invocations                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  DATABASE LAYER           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Firestore (NoSQL Database)                             │   │
│  │  ├─ collections/documents/subcollections structure      │   │
│  │  ├─ Real-time synchronization                           │   │
│  │  ├─ Automatic scaling                                   │   │
│  │  ├─ Costs based on reads/writes/deletes                 │   │
│  │  └─ Backup: Daily automated exports                     │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
│  STORAGE LAYER          │                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cloud Storage (Object Storage)                          │   │
│  │  ├─ Bucket: katbotz-backups (encrypted backups)          │   │
│  │  ├─ Retention: 30 days                                   │   │
│  │  ├─ Costs based on storage used                          │   │
│  │  └─ Auto-delete old versions                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  EXTERNAL STORAGE                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Google Drive                                            │   │
│  │  ├─ /KATBOTZ Workforce/2026/[Worker folders]           │   │
│  │  ├─ Shared with workers + HR                            │   │
│  │  ├─ Documents stored as-is (no processing)              │   │
│  │  └─ 30-day version history                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  MONITORING & LOGGING                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cloud Logging                                           │   │
│  │  ├─ All API requests logged                              │   │
│  │  ├─ Error tracking                                       │   │
│  │  ├─ Performance metrics                                  │   │
│  │  └─ Searchable audit trail                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  NETWORKING                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cloud NAT (Outbound Internet)                           │   │
│  │  ├─ For API calls to Zoho/Gusto                         │   │
│  │  ├─ Hide internal IP addresses                           │   │
│  │  └─ One-way outbound only                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. MONTHLY COST BREAKDOWN DIAGRAM

```
OPERATING COST ANALYSIS (Per Month)

For 50 Employees
┌──────────────────────────────────────────┐
│  Firestore                               │
│  ├─ Read operations: ~100K/month         │
│  │  (Most in free tier: 50K free reads)  │
│  ├─ Write operations: ~50K/month         │
│  │  (Most in free tier: 20K free writes) │
│  ├─ Delete operations: ~1K/month         │
│  │  (Included in free tier)              │
│  ├─ Cost: ₹1-2 (mostly free tier)       │
│  └─ Status: ✓ Free tier covers use       │
├──────────────────────────────────────────┤
│  Cloud Storage (Backups)                 │
│  ├─ Daily export: ~50MB/day              │
│  ├─ Retained: 30 days                    │
│  ├─ Used: ~1.5GB                         │
│  ├─ Free tier: 5GB                       │
│  ├─ Cost: ₹0.50 (within free tier)      │
│  └─ Status: ✓ Free tier covers use       │
├──────────────────────────────────────────┤
│  Cloud Run (Backend)                     │
│  ├─ Requests: ~10K/month                 │
│  │  (Free tier: 2M invocations)          │
│  ├─ Memory: 512MB per instance           │
│  ├─ CPU: Shared                          │
│  ├─ Cost: ₹1-2 (mostly free tier)       │
│  └─ Status: ✓ Free tier covers use       │
├──────────────────────────────────────────┤
│  Google Drive (Documents)                │
│  ├─ ~500 documents/month                 │
│  ├─ ~100MB total storage                 │
│  ├─ Using KATBOTZ Workspace quota        │
│  ├─ Cost: ₹0 (included with Workspace)  │
│  └─ Status: ✓ No additional cost         │
├──────────────────────────────────────────┤
│  Google OAuth (Authentication)           │
│  ├─ ~1K login attempts/month             │
│  ├─ Free tier: unlimited                 │
│  ├─ Cost: ₹0                             │
│  └─ Status: ✓ Always free                │
├──────────────────────────────────────────┤
│  TOTAL MONTHLY COST: ₹3-5               │
│  TOTAL ANNUAL COST: ₹36-60              │
│  Cost per employee per year: ₹0.72       │
└──────────────────────────────────────────┘

Scaling Analysis:
500 employees:  ₹3-5/month   (minimal increase)
1,000 employees: ₹5-10/month  (still free tier mostly)
5,000 employees: ₹75-150/month (leaves free tier)
10,000 employees: ₹200-400/month (significant growth)

Note: Cost remains essentially flat until Google Cloud free tier is exhausted
```

