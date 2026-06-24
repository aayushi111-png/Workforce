# FEATURES — What You Can Do

---

## 1. LOGIN

**How:** Click "Sign in with Google" → enter katbotz email → password

**Who:** Anyone with katbotz.com email

**Access:** Automatically routed to role (worker sees own profile, HR sees all workers)

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

## 3. PROJECT ASSIGNMENT

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

## 7. REVIEWS

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
```

**History:** All reviews saved (worker can see past feedback)

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

## 9. CONTRACT RENEWAL

**HR enters (manual):**
- Contract start date
- Contract end date
- Renewal date (if applicable)

**System shows:**
- "Expires in X days"
- "Renew by [date]"

**Used for:** Remembering when contracts end, need renewal decision

---

## 10. OFFBOARDING

**When worker leaves:**

**HR clicks:** [Mark for Exit]

**System does:**
1. Records: Last day (e.g., June 30, 2026)
2. Locks all documents (can't modify)
3. Marks: "Delete after June 30, 2029" (3 years)
4. Auto-deletes on that date

**Why 3 years?** Legal requirement. If worker sues later, documents exist for proof.

---

## 11. NOTIFICATIONS

**In-portal alerts (no email):**

Worker sees:
- Jun 23 — Your PAN was verified ✓
- Jun 20 — 30-day review due in 1 week
- Jun 15 — Project assigned: Mobile App

HR sees:
- Jun 23 — Rohan's PAN verified
- Jun 20 — 30-day reviews pending: Rohan, Sara
- Jun 15 — 3 documents submitted for verification

---

## 12. AUDIT TRAIL

**What it records:**
- Who did what
- When they did it
- What changed

**Example:**
```
June 23, 10:30 AM — Priya verified PAN (Rohan)
June 23, 09:15 AM — Rohan uploaded Aadhaar
June 22, 04:45 PM — Priya verified Degree (Rohan)
```

**Who sees:** HR only (for compliance)

---

## 13. ZOHO RECRUIT INTEGRATION (AUTO-CREATE via Webhook)

**What it does:** Auto-pulls "offer accepted" from Zoho → auto-creates worker in WOP

**How It Works (WEBHOOK - Automatic Messenger):**

A webhook is an automatic connection:
- When offer accepted in Zoho → Zoho automatically sends data to WOP
- No manual work, no polling, no delays
- Worker created in seconds

```
Zoho (HR marks: "ACCEPTED")
         ↓
Webhook triggers (automatic)
         ↓
WOP receives data
         ↓
Creates worker in Firestore
Creates Drive folder
Sends welcome email
         ↓
Worker ready to log in (seconds later)
```

**Detailed Workflow:**
1. Recruiter in Zoho Recruit marks candidate offer: "Accepted"
2. Zoho webhook automatically sends data to WOP:
   - Candidate name
   - Email address (@katbotz.com)
   - Position/Job title
   - Department
   - Joining date
   - Worker type (Employee, Contractor, Intern)
3. WOP backend receives webhook data and:
   - Validates email is @katbotz.com
   - Creates worker in Firestore (auto-generates worker_id)
   - Creates Google Drive folder for documents
   - Auto-generates document checklist (based on worker type)
   - Sends welcome email to worker
   - Logs action in audit trail
4. Worker receives email: "Welcome! Your WOP account is ready"
5. Worker can log in immediately and start uploading documents

**Setup (Done Once - Week 3):**
1. WOP backend deployed with webhook endpoint:
   - URL: https://wop-backend.katbotz.com/api/zoho/worker-created
2. Configure in Zoho Recruit → Settings → Webhooks:
   - Event: "Offer Status Changed to Accepted"
   - Send to: https://wop-backend.katbotz.com/api/zoho/worker-created
3. Test: Mark offer as "Accepted" in Zoho
4. Verify: Worker appears in WOP in seconds
5. Done! Webhook runs automatically from then on

**Data Synced:**
- Name
- Email (@katbotz.com)
- Position/Department
- Worker type
- Joining date
- Offer details

**No manual data entry. No HR work. Completely automatic.** ✓

---

## 14. GUSTO INTEGRATION (SYNC ONLY - US EMPLOYEES)

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
2. **Approved** — HR approves (amount verified)
3. **Finance Review** — Finance team reviews (payment details checked)
4. **Paid** — Payment processed (marked complete)

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

**HR Approves:**
1. Sees notification: "New invoice from [Contractor]"
2. Reviews invoice
3. Verifies:
   - Amount matches contract rate
   - Work period is correct
   - Invoice format is acceptable
4. Clicks ☑ [Approve] or ✗ [Reject with reason]
5. If approved → Status: Approved

**Finance Review:**
1. Sees notification: "Invoice approved by HR, ready for payment"
2. Reviews:
   - Payment details (bank account)
   - Amount verification
   - Tax implications (1099 if US contractor)
3. Clicks ☑ [Ready for Payment] or ✗ [Reject]
4. If approved → Status: Finance Review

**Payment Processing:**
1. Finance processes payment through Gusto (US) or bank transfer (others)
2. Payment sent to contractor bank account
3. Invoice marked: ☑ [Paid]
4. Contractor notified: "Your invoice was paid on [date]"

**Example Timeline:**
```
June 30: Contractor submits invoice
July 1 09:00 AM: HR approves
July 1 10:30 AM: Finance reviews
July 2: Payment processed
July 3: Status: Paid
```

**Contractor View:**
- List of all invoices (with status)
- "Pending payment" count (Submitted + Approved + Finance Review)
- "Paid" section (completed invoices)

**HR View:**
- All contractor invoices (across all contractors)
- Filter by status
- Total outstanding (not yet paid)
- Total paid (this month, this year)

---

## 17. AUTO-DELETE (After 3 Years)

**What happens:**
1. Worker exits on June 30, 2026
2. System marks: "Delete all data on June 30, 2029"
3. June 30, 2029 arrives
4. System automatically deletes:
   - Worker profile
   - All documents
   - All data
   - From Firestore + Google Drive
5. Logs: "Worker data deleted June 30, 2029"

**No manual action needed. Automatic.**

**Why?** Legal requirement (DPDP Act). After 3 years, data can be deleted. Audit trail kept forever.

---

## Feature Summary

17 features implemented:
1. Worker profiles and types (Employee, Contractor, Intern, Global Intern, Global Contractor + Student ID)
2. Document management with 4-state verification (Pending, Under Review, Verified, Rejected)
3. Project assignment and tracking
4. Goals management (set, track, achieve)
5. Weekly progress summaries
6. Performance reviews (30/60/90-day, annual)
7. Contract management with renewal alerts (90, 60, 30, 7 days)
8. Contract amendments tracking (scope, rate, duration, SOW)
9. Invoice workflow (Submitted → Approved → Finance Review → Paid)
10. Personal to-do lists
11. Automatic data deletion after 3 years
12. Zoho Recruit integration (auto-create workers)
13. Gusto integration (US employees only)
14. 7-role access control
15. Audit trail and logging
16. In-portal notifications
17. Offboarding workflows
