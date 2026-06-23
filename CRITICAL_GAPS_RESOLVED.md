# Critical Gaps — Complete Solutions

This document provides detailed answers to the 12 blocking issues identified by Technical Head review.

---

## GAP 1: SCOPE AMBIGUITY — What does WOP own?

### What WOP OWNS (12 modules cover):

| Category | What WOP Handles | Example |
|---|---|---|
| **Hiring & Onboarding** | M1-M5: Create worker, collect documents, verify, compliance check, provision access | Rohan joins → documents uploaded → verified → access checklist ticked |
| **Active Workforce** | M6-M9: Directory, contracts, performance reviews, assets | HR searches for Rohan, sees his contract expires in 20 days, schedules his 60-day review |
| **Exit** | M10-M12: Offboarding, notifications, reporting | Rohan exits → access revoked → record archived → accessible in reports |

### What STAYS IN OTHER SYSTEMS (out of WOP scope):

| System | Owns | WOP's Role |
|---|---|---|
| **Zoho Recruit** | Hiring workflow, offer creation, negotiations | WOP gets: "offer accepted" → create worker |
| **Gusto** | Payroll, tax, direct deposit, benefits enrollment | WOP links: worker record stores "Gusto ID" for reference, but doesn't calculate pay |
| **Google Workspace** | Email, calendar, groups, workspace creation | WOP tracks: "which groups assigned?" in access checklist |
| **GitHub/Slack** | Team management, code access, workspace | WOP tracks: "added to GitHub?" and "added to Slack?" in access checklist |
| **Google Drive/Sheets** | Historical data, legacy files, reference docs | Migration from Sheets → WOP. Sheets archived as read-only backup. |

### PAYROLL — Explicitly Out of Scope

- **Who manages salary?** Gusto only
- **How does WOP know salary?** WOP stores "Gusto ID" and "salary_last_verified_date" for reference
- **How does HR verify payroll is correct?** HR logs into Gusto separately (WOP provides link "Open in Gusto" from worker record)
- **Can WOP export to payroll?** Yes — M12 reporting can export worker list with Gusto IDs and departments for payroll reconciliation

### ATTENDANCE — Explicitly Out of Scope

- **Who tracks attendance?** Google Workspace (Google Admin, attendance APIs) or external system
- **Contractors logging hours?** Separate timesheets tool OR contractor invoice submission (M7) + manual hours entry by contractor
- **How does WOP know hours?** M7 Contract Lifecycle stores "hours_worked" field (contractor fills manually in invoice submission form)

### BENEFITS — Explicitly Out of Scope

- **Who manages benefits?** Gusto handles health insurance, 401k, stock options
- **How does HR enroll workers?** Direct link in WOP: "Enroll in Gusto Benefits" button → opens Gusto
- **Does WOP track benefits?** No — that's Gusto's responsibility

**SCOPE STATEMENT FOR DOCUMENTATION:**

> WOP is the system of record for worker lifecycle, documents, and access tracking. It does NOT replace payroll (Gusto), attendance (Workspace), or benefits (Gusto). WOP integrates by storing reference IDs and providing links to those systems. HR uses multiple tools: Zoho for hiring, Gusto for payroll, WOP for operations.

---

## GAP 2: CONTRACTOR/INTERN SIGN-IN — How do external workers get Workspace?

### THE ISSUE:

You said "everyone uses Workspace" but contractors/interns are external — they shouldn't have full Workspace accounts. **This is the fix:**

### SOLUTION A: Light Workspace Accounts (Recommended)

Create "Contractor" and "Intern" Workspace SKUs (cheaper than full user):

| Account Type | Workspace Tier | Cost | Access |
|---|---|---|---|
| Employee | Standard | ~$10–15/mo | Full Workspace (Gmail, Drive, Calendar, Workspace security) |
| Contractor | Single Sign-On (SSO) | ~$6–8/mo | Sign-in only, no Drive quota |
| Intern | Single Sign-On (SSO) | ~$6–8/mo | Sign-in only, no Drive quota |

**Flow:**
1. Worker activated → access checklist shows "Google Workspace account"
2. IT creates account in Google admin as "Contractor_rohan@katbotz.com" or "Intern_rohan@katbotz.com"
3. HR ticks ☑ Done in WOP with the created email
4. Worker signs in with that account (has no Drive, just authentication)

**Budget impact:** +₹100–200/month for 20–30 contractors/interns

### SOLUTION B: External Identity Provider (Azure AD, Okta)

If you don't want to create Workspace accounts:

1. Worker activated → access checklist shows "SSO account"
2. IT creates account in Azure AD / Okta
3. WOP redirects to Azure AD for login (not Workspace)
4. Worker sees only WOP interface

**Pro:** Contractors don't get any Google account  
**Con:** Requires SSO integration, more complex, week 3 needs SSO setup

---

## GAP 3: ACCESS CREATION WORKFLOW — Who requests, who creates, what if IT forgets?

### CURRENT (BROKEN):

Worker activated → HR ticks ☑ Done (but who told IT? How does IT know?)

### FIXED WORKFLOW:

#### Step 1: Request Broadcast (Automatic in WOP)

When Senior HR clicks [Activate], WOP automatically:
- Sends internal Slack message (or email) to IT: "New worker: Rohan Mehta, type: Indian Employee, needs: Google Workspace, GitHub"
- Creates ticket in IT system (Jira, Linear, or just Google Sheet shared with IT)
- Message includes: worker name, email, type, required systems

#### Step 2: IT Creates Accounts (Manual in external systems)

IT person:
1. Receives notification
2. Creates account in each system:
   - Google Workspace: rohan@katbotz.com (SSO or full)
   - GitHub: adds to KATBOTZ org
   - Slack: adds to #general + relevant channels
3. Returns to WOP (link in the notification)
4. For EACH system, enters: `rohan@katbotz.com` and clicks ☑ Done

#### Step 3: Escalation (If IT doesn't respond)

**Auto-escalation after 24 hours:**
- WOP sends reminder: "Rohan's access still pending (24h)"
- If no progress after 48h: notify Senior HR + Manager
- If no progress after 72h: mark as "DELAYED - UNBLOCK" in red

**SLA:** Google account within 24h, all systems within 48h

#### Step 4: Verification (Confirm accounts actually exist)

Optional automated check: WOP can call Google Workspace API to verify rohan@katbotz.com exists (if you enable it in week 1).

---

## GAP 4: DOCUMENT VERIFICATION DISPUTES — What if document is ambiguous?

### CURRENT (BROKEN):

Only two options: ☑ Verified or ✗ Rejected

### FIXED WORKFLOW:

Three options now:

| Option | When | What Happens | Next |
|---|---|---|---|
| ☑ **Verified** | Document is clear and valid | Status = Verified, compliance gate progresses | Move to next document |
| ✗ **Rejected** | Document is invalid (wrong person, expired, fake) | Worker gets email: "rejected: [reason]" | Worker re-uploads |
| 🤔 **Request Clarification** | Document is ambiguous (expired but clear, smudged but readable, etc.) | Worker gets email: "please provide: [clarification needed]" | Worker uploads clarification (same document ID) |

**What "Request Clarification" means:**

Senior HR adds a note: "Passport expires in 2 months. Please confirm you'll renew by [date]."

Worker uploads clarification:
- Submits a separate document (e.g., passport renewal appointment letter)
- Same document ID, status resets to ○ Pending clarification
- HR re-reviews

**Multi-reviewer workflow (if needed):**

If HR Executive wants to review before Senior HR decides:

1. Senior HR marks: 🤔 Request Clarification
2. HR Executive can add a comment: "Ask for certified copy"
3. Worker uploads certified copy
4. Senior HR then marks ☑ Verified

---

## GAP 5: OFFBOARDING UNDO — What if wrongful termination?

### CURRENT (BROKEN):

Once offboarding starts, it cascades. No pause.

### FIXED WORKFLOW:

#### Before Access Revocation Starts

Stage 7 Offboarding has two sub-stages:

| Sub-stage | Duration | Action | Can reverse? |
|---|---|---|---|
| **Prepare** (first 24h) | Day 1 of offboarding | Checklist appears, notifications sent, but NO revocation yet | YES — click [Cancel offboarding] |
| **Execute** (after 24h) | Days 2+ | Start revoking access, returning assets | NO (once access revoked, hard to undo) |

**How to reverse in Prepare stage:**

1. Senior HR clicks [Cancel offboarding] (big red button)
2. WOP triggers: "Rohan's offboarding cancelled. Restore everything? Y/N"
3. If yes: WOP sends notifications to IT "restore access" + to Rohan "ignore previous emails"
4. Offboarding record moved to "Cancelled" status (not deleted, audited)

#### After Access Revocation (harder to undo)

Once revocation starts, each revoked system needs manual restoration:
- Google Workspace: IT re-adds user to groups
- GitHub: IT re-adds to org
- Slack: IT re-adds to workspace

WOP tracks: "revocation cancelled by [name] on [date] due to [reason]"

**DPDP compliance:** This is still safe — audit log shows the full history.

---

## GAP 6: AADHAAR SECURITY ARCHITECTURE — Complete Technical Setup

### CLOUD STORAGE BUCKET CONFIGURATION

```
Bucket name: locked-aadhaar-katbotz (us-central1, India region option)

Encryption:
  - At rest: Google-managed encryption (default)
  - Future: Customer-managed encryption key (CMEK) if stricter compliance needed
  
Versioning:
  - Enabled: 30-day retention of old versions
  - Locked: Cannot delete current version (prevents accidental loss)

Access Control (IAM):
  - Bucket owner: Senior HR role only (read/write)
  - No public access
  - No API keys allowed (must use signed URLs only)
```

### GCP IAM POLICY

```
Resource: gs://locked-aadhaar-katbotz/*

Roles assigned:
  - roles/storage.objectViewer
    To: Group "senior-hr@katbotz.com" ONLY
    Condition: None (always allowed)
  
  - roles/storage.objectAdmin
    To: Group "gcp-admins@katbotz.com" 
    Condition: Via service account only (WOP's cloud run)
  
  - No other user accounts
  - No service account keys downloaded (rotate, don't share)
```

### SIGNED URL GENERATION (from WOP)

```
When Senior HR clicks "View Aadhaar document":
  1. WOP backend generates signed URL
  2. Parameters:
     - Duration: 30 seconds (hard-coded, not configurable by UI)
     - Method: GET only (no PUT, DELETE)
     - IP restriction: (optional) restrict to KATBOTZ office IP
  3. URL example: https://storage.googleapis.com/locked-aadhaar-katbotz/...?signature=xyz&expires=1719000030
  4. Sent to browser (never stored in WOP logs)
  5. Image viewer opens in new tab
```

### IMAGE VIEWER SECURITY (in WOP frontend)

```
<img src={signedUrl} 
  onContextMenu={(e) => e.preventDefault()}  // No right-click
  onDragStart={(e) => e.preventDefault()}     // No drag-save
  style={{
    userSelect: 'none',
    pointerEvents: 'none',  // No interaction
    WebkitUserSelect: 'none' // Safari compatibility
  }}
/>

Print disabled: @media print { img { display: none; } }
```

### KEY MANAGEMENT

```
Who has access to GCP keys?
  - Only WOP's Cloud Run service account (automatic, not manual)
  - Key rotation: Every 90 days (automatic via GCP)
  - Key download: FORBIDDEN (enforced by IAM policy)

Audit trail:
  - Every signed URL generation logged in Cloud Audit Logs
  - Shows: which HR person, when, which worker, which document
  - Audit logs retention: 90 days (configurable, keep 1 year)
```

### BACKUP SECURITY

```
Daily Firestore export:
  - Destination: gs://backup-bucket-katbotz/
  - Includes: all metadata (worker names, document paths, statuses)
  - Does NOT include: Aadhaar documents (those stay in locked bucket, separate)

Backup bucket encryption:
  - CMEK (Customer-managed encryption key)
  - Separate key from production bucket
  - Key stored in Google Key Management Service (KMS)

Restore procedure:
  - Only GCP admin can restore
  - Requires approval from Senior HR + Founder
  - Restore creates a new Firestore instance (never overwrites)
```

### DPDP COMPLIANCE CHECKLIST

- ✅ Number NOT stored anywhere (only image)
- ✅ Image in locked bucket (IAM-restricted)
- ✅ Access via signed URL only (30-second expiry)
- ✅ Audit trail (who viewed, when)
- ✅ Encryption at rest (Google-managed + option for CMEK)
- ✅ Deletion after 3 years (Stage 9 removes image + metadata)
- ✅ No third-party processors (only Google Cloud)
- ✅ Data minimisation (image only, no extraction)

---

## GAP 7: FIRESTORE SCHEMA — Complete Field Definitions

### WORKER DOCUMENT

```
workers/{workerId} {
  // Personal info
  name: string (required)
  email: string (required, unique index)
  phone: string (optional)
  dob: date (optional)
  
  // Employment info
  type: enum ["Indian Employee", "Indian Contractor", "Global Contractor", "Global Intern"]
  status: enum ["Created", "Onboarding", "Verification", "Compliance", "Activation", "Active", "Offboarding", "Archive", "Deletion"]
  joining_date: date
  last_day: date (null if not offboarding)
  department: string (index)
  team_lead: string (reference to workerId, index)
  location: string (index)
  
  // HR info
  manager_id: string (deprecated, use team_lead)
  gusto_id: string (reference to Gusto)
  zoho_recruit_id: string (reference to Zoho)
  
  // Dates
  created_at: timestamp
  updated_at: timestamp
  verified_at: timestamp (null if not verified)
  activated_at: timestamp (null if not activated)
  archived_at: timestamp (null if not archived)
  
  // Metadata
  migration_source: string (null or "sheets")
  notes: string (internal notes by HR)
}

Indexes (composite):
  - (type, status)
  - (department, status)
  - (team_lead, status)
  - (status, joining_date DESC)
  - (email) — unique
```

### DOCUMENT RECORD

```
workers/{workerId}/documents/{documentId} {
  // Document info
  type: enum ["PAN", "Aadhaar", "Passport", "Degree", "Relieving Letter", "Employment Agreement", "Bank Proof", "Experience Letter", ...]
  file_path: string (gs://bucket/worker-id/document-id.pdf)
  file_name: string (original filename)
  file_size_bytes: number
  mime_type: string (application/pdf, image/jpeg)
  
  // Upload
  uploaded_by: string (workerId)
  uploaded_at: timestamp
  uploaded_version: number (1, 2, 3 if re-uploaded)
  
  // Verification
  status: enum ["Pending", "Verified", "Rejected", "Clarification Requested"]
  verified_by: string (Senior HR user ID, null if not verified)
  verified_at: timestamp (null if not verified)
  rejected_reason: string (null unless status = "Rejected", max 500 chars)
  clarification_requested_reason: string (null unless status = "Clarification Requested")
  
  // Expiry
  expiry_date: date (null if non-expiring document)
  renewal_notice_sent: boolean (false)
  
  // Metadata
  compliance_required: boolean (true if required for activation)
}

Indexes (composite):
  - (status) — for verification queue
  - (type, status) — for compliance check
```

### VERIFICATION STATUS

```
workers/{workerId}/verifications/{verificationId} {
  document_id: string
  status: enum ["Pending", "Verified", "Rejected", "Clarification"]
  reviewed_by: string
  reviewed_at: timestamp
  notes: string
  required: boolean
}
```

### ACCESS CHECKLIST

```
workers/{workerId}/access/{systemId} {
  system_name: string ("Google Workspace", "GitHub", "Slack", "Notion")
  created_id: string (rohan@katbotz.com)
  status: enum ["Pending", "Done"]
  created_by: string (HR or IT user ID)
  created_at: timestamp
  
  // For revocation at offboarding
  revocation_status: enum [null, "Pending", "Revoked"]
  revoked_at: timestamp (null if not revoked)
  revoked_by: string
}

Index:
  - (status) — for showing pending access
```

### AUDIT LOG (Top-level)

```
auditLogs/{logId} {
  worker_id: string (references workers/{workerId})
  action: enum [
    "worker_created",
    "document_uploaded",
    "document_verified",
    "document_rejected",
    "compliance_checked",
    "access_created",
    "access_revoked",
    "worker_activated",
    "offboarding_started",
    "offboarding_cancelled",
    "worker_archived",
    "worker_deleted",
    "review_scheduled",
    "review_completed"
  ]
  performed_by: string (user ID)
  performed_at: timestamp
  details: object {
    document_id: string (if relevant)
    status_before: string (if status changed)
    status_after: string (if status changed)
    reason: string (if action was rejected/cancelled)
  }
  ip_address: string (for security audit)
}

Index:
  - (worker_id, performed_at DESC) — full history for one worker
  - (action, performed_at DESC) — all actions of one type
  - (performed_at DESC) — append-only journal
```

### QUERY PATTERNS

```
Q1: Verify queue for Senior HR
  db.collection('workers')
    .where('status', '==', 'Verification')
    .orderBy('updated_at', 'desc')
    .limit(20)
  THEN for each worker:
    db.collection('workers').doc(workerId).collection('documents')
      .where('status', '==', 'Pending')
  
  Cost: 1 + (20 * 1) = 21 reads

Q2: Compliance check (all docs verified + agreements signed)
  db.collection('workers').doc(workerId).collection('documents')
    .where('compliance_required', '==', true)
    .get()
  THEN check: all have status = 'Verified'
  
  Cost: 1 read per document type

Q3: Directory search (engineers with status Active)
  db.collection('workers')
    .where('department', '==', 'Engineering')
    .where('status', '==', 'Active')
    .orderBy('name')
    .limit(50)
  
  Cost: 1 read (composite index exists)

Q4: Full audit trail for one worker
  db.collection('auditLogs')
    .where('worker_id', '==', workerId)
    .orderBy('performed_at', 'desc')
    .get()
  
  Cost: 1 read per log entry (~100 entries/worker over lifetime)
```

### SIZE ESTIMATES

```
Per Worker:
  - Profile doc: ~2 KB
  - Documents (10 avg): ~10 × 1 KB = 10 KB
  - Access checklist (5 items): ~5 KB
  - Audit log (50 entries): ~50 KB
  Total: ~70 KB per worker

At 500 workers:
  - Total Firestore size: 35 MB
  - Queries/day: ~500 (10 per active HR)
  - Monthly cost: ~$5–10 (easily within free tier)

At 5,000 workers:
  - Total Firestore size: 350 MB
  - Queries/day: ~2,000
  - Monthly cost: ~$15–30
```

---

## GAP 8: TIMELINE REALISM — Hour Estimates Per Module

### MODULE BREAKDOWN (Hours)

```
M1: Worker Creation (Create + assign team lead + generate checklist)
  - UI form + validation: 8h
  - API endpoint (create worker, sub-collections): 6h
  - Auto-generate document checklist per type: 4h
  - Send email invite to worker: 2h
  Total: 20h (allocated to Week 2)

M2: Document Management + Worker Portal (Upload + view status)
  - Signed URL upload (frontend): 8h
  - Document storage (backend): 4h
  - Worker self-service portal (display checklist + upload): 10h
  - Progress tracking (X of Y uploaded): 4h
  Total: 26h (allocated to Week 3)

M3: Verification Engine (Queue + mark Verified/Rejected)
  - Verification queue (fetch pending docs): 4h
  - Document viewer (image/PDF in browser): 6h
  - Mark Verified/Rejected + rejection reason: 6h
  - Email notification on rejection: 3h
  - "Request Clarification" workflow: 4h
  Total: 23h (allocated to Week 3)

M4: Compliance Engine (Auto-check gate)
  - Query: all docs uploaded? All verified? Agreements signed?: 6h
  - Compliance gate logic: 4h
  - "Ready for activation" status: 2h
  Total: 12h (allocated to Week 3)

M5: Access Management (Checklist + tick Done)
  - Access checklist template per worker type: 8h
  - Request broadcast to IT (Slack/email): 4h
  - IT marks "Done" + enters created ID: 4h
  - Revocation checklist (copy of access checklist): 6h
  - Escalation if pending >24h: 4h
  Total: 26h (allocated to Week 4)

M6: Workforce Directory (Search + filter)
  - Firestore query (by type, dept, status, team lead): 6h
  - UI table + sorting: 8h
  - Filter controls: 6h
  - Full history view per worker: 4h
  Total: 24h (allocated to Week 4)

M7: Contract Lifecycle (Start/end/renewal + alerts at 90/60/30/7 days)
  - Contract record creation: 6h
  - Date tracking + expiry logic: 6h
  - Email alerts (scheduled or trigger-based): 6h
  - SOW + NDA document storage: 4h
  - Renewal management: 4h
  Total: 26h (allocated to Week 4)

M8: Performance Reviews (Scheduling + submission + tracking)
  - Review schedule logic per worker type (30/60/90/probation/annual/weekly): 8h
  - Task creation in WOP: 4h
  - Review form (Team Lead submits): 8h
  - Due date tracking + reminders: 4h
  Total: 24h (allocated to Week 5)

M9: Asset Management (Assign + track + return)
  - Asset types (laptop, monitor, SIM, etc.): 4h
  - Assignment form: 6h
  - Return tracking at offboarding: 6h
  - Audit trail (who has what): 4h
  Total: 20h (allocated to Week 5)

M10: Offboarding (Access revocation + asset return + exit docs)
  - Offboarding checklist (access + assets + docs): 8h
  - Revocation workflow (manual per system): 6h
  - Can't close until all ☑: 4h
  - Undo/cancel workflow (first 24h): 4h
  - Archive + deletion (3-year retention): 6h
  Total: 28h (allocated to Week 6)

M11: Notification Engine (5 email triggers via SendGrid)
  - SendGrid account setup + API key: 2h
  - Rejection email (document rejected): 4h
  - Activation email (onboarding complete): 3h
  - Overdue reminder (doc not uploaded in 3 days): 4h
  - Contract expiry email (30 days before): 4h
  - Review due email: 3h
  - Retry logic + error handling: 6h
  - Email templates + personalization: 4h
  Total: 30h (allocated to Week 6)

M12: Reporting & Analytics (Dashboard + exports)
  - Headcount query + chart: 6h
  - Worker status breakdown: 4h
  - Contract expiry calendar: 6h
  - Audit log viewer (all actions per worker): 6h
  - CSV export: 4h
  - PDF export: 6h
  Total: 32h (allocated to Week 6)

TOTAL: 311 hours for 12 modules
```

### WEEKLY BREAKDOWN (Realistic)

```
Available: 4.5 hours/day × 5 days = 22.5 hours/week

Week 1 (Foundations): 22h (leaves 0.5h buffer)
Week 2 (M1): 20h (leaves 2.5h buffer)
Week 3 (M2+M3+M4): 61h total / 22.5 available = OVERRUN by 38.5h
  → Reduce M2 portal to skeleton (12h instead of 26h) = 49h total = OVERRUN by 26.5h
  → Further reduce: M3 rejection only, skip "Request Clarification" in week 3 (add week 7) = 37h = OVERRUN by 14.5h
  → Verdict: Week 3 PUSHES into Week 4 by ~1 week

Week 4 (M5+M6+M7): 76h / 22.5 = OVERRUN by 53.5h
  → Reduce M7 to start/end dates only (skip renewal alerts) = 60h = OVERRUN by 37.5h
  → M6 + partial M5 = 24h + 13h = 37h, carry M7 to week 5 = OVERRUN by 14.5h

Week 5 (M7 rest + M8 + M9): 52h / 22.5 = OVERRUN by 29.5h
  → Reduce M8 to basic scheduling (12h instead of 24h) = 38h = OVERRUN by 15.5h

Week 6 (M10 + M11 + M12): 90h / 22.5 = OVERRUN by 67.5h
  → Reduce M11 to basic SendGrid setup (15h instead of 30h, skip error handling) = 75h = OVERRUN by 52.5h
  → Reduce M12 to CSV export only, skip PDF (22h instead of 32h) = 65h = OVERRUN by 42.5h
  → IMPOSSIBLE to fit in one week

Week 7 (Dashboards + migration): 30h (polish + 8h migration) = 38h = OVERRUN by 15.5h
Week 8 (Testing): 22.5h
```

### REALISTIC REVISED TIMELINE

```
Week 1: Foundations ✓
Week 2: M1 Worker Creation ✓
Week 3: M2 (skeleton) + M3 + M4 ✓ (some M2 polish to week 4)
Week 4: M2 finish + M5 + M6 (partial M7 start)
Week 5: M7 finish + M8 + M9 + request-clarification workflow
Week 6: M10 + M11 (basic) + M12 (CSV only)
Week 7: Dashboards + PDF export + migration + RBAC
Week 8: Testing + bug fixes + M11 error handling + PDF polish
Week 9: BUFFER — further testing or module polish

VERDICT: 8-week timeline is TIGHT but possible IF:
  - Portal is skeleton (basic forms, no polish)
  - M11 error handling deferred to week 8+
  - M12 PDF export deferred to week 7+
  - Bug fixes in week 8 limited to blockers only
  - 3-5 day flex is mandatory (almost certain to use 2-3 days)
```

---

## GAP 9: TEST PLAN — Who tests, what cases, blocking bugs

### TEST USERS (Week 8)

```
Senior HR (Priya — KATBOTZ):
  - Tests: M1-M5 (worker creation → activation)
  - Scenario: Create a fake "Test Worker" and complete full lifecycle to activation
  - Time: 2 hours (walks through as real HR would)

HR Executive (Rohini — KATBOTZ):
  - Tests: M3 (verification queue), M12 (reports)
  - Scenario: Review pending documents, check audit log, export a report
  - Time: 1.5 hours

Team Lead (Akshat — KATBOTZ):
  - Tests: M6 (directory), M8 (reviews)
  - Scenario: View their team in directory, schedule + submit a review
  - Time: 1.5 hours

Employee (test account, internal):
  - Tests: Worker portal self-service (M2)
  - Scenario: Upload documents, check status, see when activated
  - Time: 1 hour

Contractor (external test account):
  - Tests: Worker portal + invoice submission (M7)
  - Scenario: Upload contractor docs, submit fake invoice
  - Time: 1 hour

TOTAL test time: ~7 hours (spread across 5 days of week 8)
```

### TEST CASES (per module)

```
M1: Worker Creation
  ✓ Create Indian Employee (auto-generates document checklist for that type)
  ✓ Create Indian Contractor (different checklist)
  ✓ Create Global Intern (yet another checklist)
  ✓ Team lead assignment (verify team lead can later see in directory)
  ✗ (BLOCKER) Missing required field (name) → should show error

M2: Document Management
  ✓ Upload PAN card, verify status shows "Pending review"
  ✓ Upload same document again (version 2), old version still visible
  ✓ Upload file > 10 MB → should reject with "file too large"
  ✗ (BLOCKER) Can't upload anything due to signed URL failure → user sees empty state

M3: Verification Engine
  ✓ Senior HR sees pending documents in queue
  ✓ Mark PAN card as ☑ Verified → status updates immediately
  ✓ Mark Aadhaar as ✗ Rejected with reason "blurry" → worker gets email
  ✓ Request Clarification for passport (add note) → worker gets email
  ✗ (BLOCKER) Worker never receives rejection email → SendGrid down or API key wrong

M4: Compliance Engine
  ✓ After all docs verified + agreements signed → "Ready for Activation" appears
  ✓ If one doc still pending → "Ready" button hidden, shows "1 document pending"
  ✓ Senior HR can click "Ready" → moves to Activation stage
  ✗ (BLOCKER) Compliance gate never unlocks (stuck on "Pending") → query wrong

M5: Access Management
  ✓ Worker activated → access checklist appears with 3 systems (Google, GitHub, Slack)
  ✓ IT creates Google Workspace account, returns to WOP, enters "rohan@katbotz.com", clicks ☑ Done
  ✓ Worker can now log in with rohan@katbotz.com (Google auth works)
  ✗ (BLOCKER) Worker activated but can't log in → OAuth not updated or account not created in time

M6: Workforce Directory
  ✓ Search "Rohan" → finds the worker
  ✓ Filter by "Engineering" dept → shows only Rohan if in that dept
  ✓ Filter by "Active" status → shows only active workers
  ✗ (BLOCKER) Search returns no results → Firestore index missing or query wrong

M7: Contract Lifecycle
  ✓ Create contractor, add contract (start date, end date)
  ✓ Verify renewal alerts scheduled for 90/60/30/7 days before end date
  ✗ (BLOCKER) Contract created but renewal dates don't calculate correctly

M8: Performance Reviews
  ✓ Create Employee, verify review schedule (30, 60, 90 day) auto-populates
  ✓ Team Lead sees review task due in M6 dashboard
  ✓ Team Lead submits review → stored in Firestore
  ✗ (BLOCKER) Review task never appears for Team Lead

M9: Asset Management
  ✓ Assign MacBook to Employee
  ✓ When employee starts offboarding, asset appears in offboarding checklist
  ✓ Mark asset as returned → offboarding can now close
  ✗ (BLOCKER) Asset doesn't appear in offboarding checklist

M10: Offboarding
  ✓ Initiate offboarding for a worker (set last day)
  ✓ Revocation checklist appears with 3 systems
  ✓ Revoke Google Workspace, GitHub, Slack
  ✓ Can't close offboarding until all ☑ (system enforces blocker)
  ✓ Cancel offboarding (within first 24h) → notifications sent to "ignore"
  ✗ (BLOCKER) Offboarding can't close or revocation doesn't prevent closing

M11: Notifications
  ✓ Reject a document → worker receives email with reason
  ✓ Complete onboarding → worker + Senior HR receive email
  ✓ Document not uploaded in 3 days → worker receives reminder
  ✓ Contract expires in 30 days → Senior HR receives alert
  ✓ Review due → Team Lead receives email
  ✗ (BLOCKER) Emails not sent (SendGrid API error, missing env var, etc.)

M12: Reporting
  ✓ Export worker list to CSV → contains name, email, type, status, dept
  ✓ Audit log shows all actions for Rohan
  ✓ Headcount chart shows 1 active worker
  ✗ (BLOCKER) CSV export broken or audit log shows no entries
```

### BLOCKING BUG SLA (Week 8)

| Bug Type | Definition | Fix SLA |
|---|---|---|
| **Critical blocker** | User cannot proceed (can't log in, can't activate worker, data lost) | Fix before EOD (same day), retest, pass |
| **High blocker** | Feature broken but has workaround (report doesn't export but CSV works) | Fix within 12h, retest |
| **Medium bug** | Non-critical issue (styling off, email late by 1 min) | Fix if time permits, not blocking handover |
| **Low bug** | Polish (button color, minor copy change) | Defer to post-launch |

**Criteria for "ready to hand over":**
- Zero critical blockers
- Zero high blockers
- All 12 modules pass happy-path test
- At least one person from HR has used it for real scenario
- All 5 email triggers sent successfully

---

## GAP 10: POST-LAUNCH OPERATIONS — SLA, on-call, monitoring

### SLA (Service Level Agreement)

```
Availability:
  - 99% uptime target (allowed downtime: ~7 hours/month)
  - Response time: <2 seconds for page load
  - Database response: <100ms for typical query

Support Response:
  - Critical (user blocked): 1 hour response, 4 hour fix
  - High (feature broken): 4 hour response, 24 hour fix
  - Medium: 24 hour response
  - Low: best effort

Escalation:
  - Critical: Senior HR → you → GCP support
  - High: Senior HR → you
  - Medium: Slack channel (not urgent)
```

### ON-CALL ROTATION

```
Sept 1 – Sept 30 (Launch month):
  - Week 1 (Sept 1-7): You on-call (launch week, highest risk)
  - Week 2-4: Rotate every 3 days (you, Senior HR, IT person if available)
  - If no IT person: you + Senior HR alternate weeks

Oct 1 onwards:
  - You on-call 1 week/month (4 weeks rotation)
  - Senior HR as backup escalation
  - Outside hours: auto-page you for critical (Slack notification)

On-call duties:
  - Monitor Cloud Logging / Slack alerts
  - Response to critical bugs: triage + fix or workaround
  - Restart services if needed (GCP console access)
  - Do NOT merge code on-call (testing poor, mistakes likely)
```

### MONITORING & ALERTS

```
Metrics to track:
  - Cloud Run CPU/memory (scale if >60% sustained)
  - Firestore read/write rate (spike = bug or attack)
  - Cloud Storage API errors (access denied, quota)
  - SendGrid delivery rate (>2% bounce = config issue)
  - Page load time (JS error = breaks portal)

Alerts threshold:
  - Cloud Run down: instant page alert
  - Firestore quota exceeded: Slack alert
  - SendGrid bounce rate >2%: daily digest
  - >10 failed operations in audit log within 1h: Slack alert
```

### RUNBOOK EXAMPLES

```
If Cloud Run is down:
  1. Check Cloud Run service status (console)
  2. Check recent deployments (did week 8 push contain bug?)
  3. If recent push broken: revert to previous version
  4. Restart service (GCP console button)
  5. Test sign-in + create worker
  6. Slack announcement: "outage [time] - caused by [reason] - fixed"
  7. Post-mortem in [date]

If SendGrid down:
  1. Check SendGrid status page
  2. If SendGrid is down: wait 30 min, retry
  3. If SendGrid is up but WOP not sending: check API key
  4. Test via curl: curl -X POST https://api.sendgrid.com/v3/mail/send...
  5. If curl works, check WOP backend logs for errors
  6. Restart Cloud Run service
  7. Queue pending emails (resend from DB)

If worker can't log in:
  1. Verify Google account exists in Google Admin console
  2. Verify email matches WOP record exactly
  3. Check browser cookies (clear cache, try incognito)
  4. If still broken: Google OAuth config wrong (check credentials.json)
  5. Escalate: contact Google Cloud support if credentials corrupted
```

---

## GAP 11: DPDP COMPLIANCE — Legal hold and deletion process

### LEGAL HOLD PROCEDURE

```
When: Worker sues KATBOTZ or legal sends request for data retention

Process:
  1. Legal sends: "Hold data for Rohan Mehta (worker ID: WOP-2026-0041) until [date]"
  2. You update Firestore: workers/{workerId}
     - Add field: legal_hold_until: date("2027-09-01")
  3. Automated deletion job (runs monthly):
     - Before deleting stage 9 record:
       - Check if legal_hold_until > today
       - If true: SKIP deletion, continue next month
       - If false: PROCEED with deletion
  4. Audit log: "Legal hold applied by [you]" and "Legal hold released by [legal]"
  5. Post-mortem: track how long hold lasted

Verification:
  - Audit log proves: worker data was held, not deleted
  - Backups are encrypted (prove chain of custody)
```

### DELETION WORKFLOW (Stage 9)

```
Trigger: 3 years after worker moves to Stage 8 (Archive)

Process (automated, monthly batch job):
  1. Query: workers where (status = 'Archive' AND archived_at < 3 years ago AND legal_hold_until = null)
  2. For each worker:
     a. Export to audit-log-archive bucket (for legal evidence)
        - Full record: name, email, dates, all actions
        - No personal data in this export (minimized)
     b. Delete from Firestore:
        - workers/{workerId} — DELETE
        - workers/{workerId}/documents/* — DELETE all
        - workers/{workerId}/verifications/* — DELETE all
        - workers/{workerId}/access/* — DELETE all
        - workers/{workerId}/reviews/* — DELETE all
        - workers/{workerId}/contracts/* — DELETE all (keep SOW in Storage with permission rules)
        - (Keep: audit logs, encrypted backups, anonymized analytics)
     c. Delete from Cloud Storage:
        - locked-aadhaar-bucket/worker-id/* — DELETE
        - documents-bucket/worker-id/* — DELETE
        - backup bucket: old snapshots auto-expire (30 day retention)
     d. Audit log: "Worker data deleted (legal retention complete)"
  3. Verification:
     - Firestore document count decreases
     - Cloud Storage files gone (check if audit-log-archive mentions them)
     - Anonymized analytics still exist for headcount/trends

What is NOT deleted:
  - Audit log (this is DPDP requirement — chain of custody)
  - Anonymized analytics ("had 1 employee in Engineering, left after 2 years")
  - Encrypted backups (stored separately, access restricted)
```

### DPDP AUDIT TRAIL

```
At any time, KATBOTZ legal can ask: "Prove you didn't keep Rohan's data after 3 years"

You show:
  1. Firestore query: workers/{WOP-2026-0041} → "NOT FOUND" (deleted)
  2. Cloud Storage: gs://locked-aadhaar-bucket/worker-0041/* → NO FILES
  3. Audit log: "Worker data deleted [date]" entry
  4. Backup audit: "Archive backup from [date], last backup before deletion [date]"
  5. Analytics: "Anonymized: 1 employee (role: engineer, location: India, tenure: 2y)"

Chain of custody:
  - Who deleted? (audit log entry has user ID)
  - When deleted? (timestamp)
  - Why deleted? (legal retention rule, 3 years)
  - Verified deleted? (audit log + spot checks)
```

---

## GAP 12: EMAIL FAILURES — Retry logic and dead-letter queue

### SENDGRID INTEGRATION WITH RETRY

```
Current (broken): Fire and forget
  → If SendGrid down, worker never knows docs were rejected

Fixed: Retry + audit trail

Architecture:
  1. FastAPI tries to send email via SendGrid
  2. If success: log to audit log "Email sent: rejection to rohan@katbotz.com"
  3. If failure (500 error, timeout, quota):
     - Log error: audit log + Cloud Logging
     - Queue to "pending_emails" collection in Firestore:
       {
         worker_id: "WOP-2026-0041",
         email_type: "document_rejected",
         recipient: "rohan@katbotz.com",
         reason: "PAN card rejected: blurry",
         created_at: now,
         retry_count: 0,
         next_retry: now + 1 hour,
         status: "pending"
       }
     - Respond to HR: "Notification queued. Will retry automatically."

Retry job (runs every hour):
  1. Query: pending_emails where (next_retry < now AND retry_count < 3)
  2. For each pending email:
     a. Try SendGrid again
     b. If success:
        - Delete from pending_emails
        - Log: "Email sent (retry #1)"
     c. If failure:
        - Increment retry_count
        - Set next_retry = now + (retry_count * 1 hour)
        - If retry_count >= 3:
          - Move status to "failed"
          - Alert HR: "Email failed 3 times, manual send needed"
  3. End of job:
     - Log: "Retry job completed. X succeeded, Y still pending, Z failed."

Fallback:
  - HR can see pending_emails in WOP dashboard
  - HR button: "Resend manually" → copies email text, opens Gmail
  - HR button: "Mark sent" → removes from queue, logs as manual send
```

### DEAD-LETTER MONITORING

```
Dashboard widget: "Pending Notifications"
  - Shows: 0 pending, 2 pending 1h+, 1 pending 24h+, 1 failed 3x
  - Color code: green (0), yellow (any pending), red (failed)
  - Click: see list of emails + reason + resend option

Weekly report:
  - How many notifications sent/failed
  - Which email types failed most (rejection? contract expiry?)
  - SendGrid error breakdown (quota? auth? timeout?)
  - Action: if >5% fail rate, escalate to investigate

Escalation:
  - If >10 emails fail in same hour: auto-alert Senior HR
  - If SendGrid quota exceeded: alert you + try rate limiting (slow down sends)
```

---

## SUMMARY

These 12 solutions address every critical gap. Update the documentation with these sections before final submission.
EOF
cat /tmp/tech_head_review.md | head -100
