# SECURITY & COMPLIANCE

---

## Login Security

**Google OAuth only**
- No passwords stored in WOP (Google handles all authentication)
- Only @katbotz.com emails allowed (blocks external emails)
- Automatic logout after 1 hour of inactivity
- 2FA inherited from Google Account (if enabled)
- Tokens expire automatically (can't be used indefinitely)
- Industry-standard authentication (trusted by 1000+ enterprises)

---

## Data Security

**Encryption at rest:**
- Firestore: Encrypted by Google (default)
- Drive: Encrypted by Google (default)
- Backups: Encrypted

**Encryption in transit:**
- All communication over HTTPS (not HTTP)
- Browsers enforce SSL/TLS

---

## Access Control

**Who sees what:**
- Worker: Only their own profile
- Team Lead: Only their team members + can edit their goals + fill reviews
- HR: All workers, all data
- Founder: All data (read-only)

System enforces this. No exceptions.

---

## Audit Trail

**Everything is logged:**
- Who logged in, when
- Who verified documents, when
- Who edited goals, when
- Who filled reviews, when
- All deletions, when

HR can view audit log anytime.

---

## Document Storage

**Google Drive (not WOP):**
- All documents stay in Drive
- WOP only stores links
- No processing, no extraction
- HR downloads and reviews manually

**Drive access:**
- Worker folder shared with: Worker + HR
- Contractor folder shared with: Contractor + HR
- No one else has access

---

## Backup & Recovery

**Daily automatic backup:**
- Firestore exported daily to Cloud Storage
- 30 days of backups kept
- Auto-delete old backups

**How to restore (if needed):**
1. Contact GCP admin
2. GCP restores from backup
3. Takes ~5-10 minutes
4. All data back to [backup date]

---

## Data Retention (3 Years After Exit)

**All worker data saved for 3 years:**
- ✓ Documents: PAN, Aadhaar, Degree, Marksheets, Bank proof, Contracts
- ✓ Projects: All projects assigned to worker
- ✓ Goals: All goals set and tracked
- ✓ Reviews: All 30/60/90-day and annual reviews
- ✓ Performance ratings and feedback
- ✓ Weekly summaries and progress updates
- ✓ Invoices (contractors only)
- ✓ Contract details and amendments (contractors only)
- ✓ Complete audit trail of all actions
- ✓ Locked from modification (can't change or delete)

**Timeline:**
```
Day 0: Worker exits (HR marks exit date)
Days 1-1095 (3 years): All data kept, locked, accessible to HR
Day 1096: System auto-deletes all worker data
Forever: Audit trail remains (proves deletion occurred)
```

**Why 3 years?**
- Legal requirement: Labor law mandates 3-year record retention
- Dispute resolution: If employee sues later, all evidence exists
- Compliance: DPDP Act 2023 requires retention for accountability
- Audit proof: System logs prove deletion occurred and when

**After 3 Years: HOW & WHERE Data Gets Deleted**

### **HOW: Auto-Deletion Process (Fully Automatic)**

**Scheduled Deletion Job:**
```
Trigger: Daily at 1:00 AM UTC
Process:
├─ Check all workers marked "exited"
├─ Calculate: exit_date + 3 years = deletion_date
├─ If today >= deletion_date:
│  ├─ Delete from Firestore (database)
│  ├─ Delete from Cloud Storage (documents)
│  ├─ Delete from Google Drive (backups)
│  ├─ Log deletion in audit trail
│  └─ Send HR notification email
└─ Process repeats daily (catches any missed deletions)

Status: "Deleted on [date]"
Irreversible: No recovery possible (data gone)
```

### **WHERE: Complete Deletion Across All Systems**

**1. Firestore (Database) - DELETED**
```
Before deletion:
workers/worker-001/
├─ name: "Rohan Mehta"
├─ email: "rohan@katbotz.com"
├─ documents: [PAN, Aadhaar, Degree, ...]
├─ projects: [Mobile App, API Dev, ...]
├─ goals: [5 goals with status]
├─ reviews: [30-day, 60-day, 90-day, annual]
├─ invoices: [INV-001, INV-002, ...]
└─ contracts: [contract-001 with amendments]

After deletion:
workers/worker-001/
└─ DELETED (record removed from database)
```

**2. Cloud Storage (Documents) - DELETED**
```
Before deletion:
gs://katbotz-workforce-docs/2026/worker-001/
├─ pan.pdf (versioning enabled, 3 versions kept)
├─ aadhaar.jpg (versioning enabled, 2 versions kept)
├─ degree.pdf
├─ marksheet_10th.pdf
├─ marksheet_12th.pdf
├─ bank_proof.pdf
├─ contract.pdf (3 versions with amendments)
└─ invoices/ (5 invoices stored)

After deletion:
gs://katbotz-workforce-docs/2026/worker-001/
└─ DELETED (entire folder removed, all versions deleted)

Note: Lifecycle policy automatically deletes versioned files
```

**3. Google Drive (Backup) - DELETED**
```
Before deletion:
KATBOTZ Workforce Backups/2026/
└─ Rohan Mehta/
   ├─ Documents/ (daily backups)
   ├─ Projects/ (project details)
   ├─ Reviews/ (review PDFs)
   └─ Invoices/ (invoice files)

After deletion:
KATBOTZ Workforce Backups/2026/
└─ Rohan Mehta/
   └─ DELETED (entire folder removed)

Note: Drive trash auto-empties after 30 days
```

**4. Firestore Metadata - DELETED**
```
Before deletion:
documents/ collection:
├─ doc-001: {worker_id: "worker-001", status: "Verified", ...}
├─ doc-002: {worker_id: "worker-001", status: "Verified", ...}
└─ doc-003: {worker_id: "worker-001", status: "Verified", ...}

After deletion:
documents/ collection:
└─ All records with worker_id="worker-001" DELETED
```

**5. Audit Trail - KEPT FOREVER (NEVER DELETED)**
```
Before deletion:
audit_logs/ collection:
├─ log-1: "Rohan uploaded PAN on June 1"
├─ log-2: "Priya verified PAN on June 5"
├─ log-3: "Rohan marked for exit on June 30"
└─ ...100+ logs for this worker

After deletion:
audit_logs/ collection:
├─ log-1: "Rohan uploaded PAN on June 1" ← STILL HERE
├─ log-2: "Priya verified PAN on June 5" ← STILL HERE
├─ log-3: "Rohan marked for exit on June 30" ← STILL HERE
├─ log-101: "Worker data deleted on June 30, 2029" ← NEW ENTRY
└─ ...all logs preserved forever
```

### **Safety Mechanisms**

**Prevent Accidental Deletion:**
```
✓ Only delete if: marked "exited" AND exit_date + 3 years <= today
✓ Double-check: Run dry-run first, verify before actual deletion
✓ Logging: Every deletion logged with timestamp and reason
✓ No cascade: Only worker data deleted, not company-wide data
✓ Irreversible: Deleted from all backups too (no recovery)
```

**Verification:**
```
HR can verify deletion by:
1. Search for worker in WOP → "No results found" ✓
2. Check Drive folder → Folder gone ✓
3. Check Cloud Storage → Folder gone ✓
4. Check audit trail → "Worker deleted [date]" ✓
5. No data recovery possible ✓
```

**Example Timeline: Rohan's Deletion**

```
June 30, 2026: Rohan exits
└─ HR marks: Exit date = June 30, 2026
└─ System calculates: Delete date = June 30, 2029

June 30, 2029: Auto-Deletion Executes at 1:00 AM
├─ Firestore:
│  └─ DELETE workers/worker-001 ✓
│  └─ DELETE all documents with worker_id="worker-001" ✓
│  └─ DELETE all projects/goals/reviews/invoices ✓
│
├─ Cloud Storage:
│  └─ DELETE gs://katbotz-workforce-docs/2026/worker-001/ ✓
│  └─ DELETE all versioned files ✓
│
├─ Google Drive:
│  └─ DELETE KATBOTZ Workforce Backups/2026/Rohan Mehta/ ✓
│  └─ Move to Drive trash (auto-empties in 30 days) ✓
│
└─ Audit Trail:
   ├─ DELETE: NO (kept forever)
   └─ ADD: "Rohan Mehta data deleted on June 30, 2029 at 1:00 AM UTC" ✓

June 30, 2029 1:05 AM: Email to HR
└─ "Auto-deletion completed for 1 worker (Rohan Mehta)"
└─ "Deletion timestamp: June 30, 2029 1:00:42 AM UTC"
└─ "Audit log entry: log-102"
```

**No manual action needed: Happens automatically**
- No manual action needed
- No confirmation required
- No recovery options
- Proof logged forever

---

## DPDP Compliance (India Privacy Law)

**What we collect:**
- Name, email, type (employee/contractor/intern)
- Documents (PAN, Aadhaar, certificates)
- Performance ratings, reviews
- Project goals, weekly summaries

**Why we collect:**
- Onboarding and employment verification
- Performance tracking
- Legal compliance

**How long we keep it:**
- Active workers: Entire employment + 3 years after exit
- Then: Deleted (except audit trail)

**Who can access:**
- Worker: Only their own data
- HR: All worker data
- No one else

**Right to deletion:**
- Worker can ask: "Delete my data"
- HR can comply (except audit trail which is kept for 3 years)

---

## No Third Parties

WOP only uses Google services (not external APIs):
- Google Firestore
- Google Cloud Storage
- Google OAuth
- Google Cloud Run

No data shared with anyone. No external integrations.

---

## Before Going Live

- ✓ HTTPS enabled (secure communication)
- ✓ OAuth configured correctly (only katbotz.com)
- ✓ Firestore backups tested (restore works)
- ✓ Audit logging enabled
- ✓ Access control tested (worker can't see other workers)

---

## That's All

Simple security. No complex vaults or locks. Just: encrypt, log, keep private.
