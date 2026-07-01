# DATABASE SCHEMA — What Gets Stored

---

## Worker Profile

```
workers/{worker_id}
  name: "Rohan Mehta"
  email: "rohan@katbotz.com"
  type: "Employee"  // or "Contractor", "Global Contractor", "Intern", "Global Intern"
  department: "Engineering"
  team_lead: "Akshat"
  created_at: "2026-06-01"
  
  // Additional fields for contractors and interns
  student_id: "STU-2026-001" (interns only)
  location: "India" // or "US", "Other"
  
  ═══ GUSTO SYNC (US Employees Only) ═══
  gusto_mapping:
    gusto_id: "emp-789456" (Gusto's unique employee ID)
    gusto_sync_enabled: true
    sync_status: "synced" // or "pending", "syncing", "failed", "paused"
    first_synced_at: "2026-06-15T10:30:00Z"
    last_sync: "2026-06-20T14:00:00Z"
    last_sync_fields: ["salary", "department"]
    sync_error: null (error message if failed)
    retry_count: 0
    next_retry_at: null
  
  ═══ PROJECT ═══
  project:
    name: "Mobile App Redesign"
    project_lead: "Akshat"
    start_date: "2026-06-01"
    status: "In Progress"
    description: "Redesign mobile app UI/UX"
  
  ═══ GOALS ═══
  goals: [
    {
      id: 1,
      goal: "Complete wireframes",
      deadline: "2026-06-30",
      status: "In Progress"
    },
    {
      id: 2,
      goal: "Get stakeholder approval",
      deadline: "2026-07-05",
      status: "Not Started"
    }
  ]
  
  goals_achieved: [
    { achieved: "Research UI issues", date: "2026-06-15" },
    { achieved: "Create mockups", date: "2026-06-20" }
  ]
  
  ═══ WEEKLY SUMMARY ═══
  weekly_summary: [
    {
      week_of: "2026-06-17",
      summary: "Completed wireframes, had review meeting, collected feedback",
      submitted_date: "2026-06-23"
    }
  ]
  
  ═══ PERFORMANCE ═══
  performance:
    rating: 4.5
    feedback: "Good progress"
    updated_date: "2026-06-23"
  
  ═══ REVIEWS ═══
  reviews: [
    {
      type: "30-day",
      due_date: "2026-07-01",
      status: "completed",
      rating: 4,
      feedback: "Great progress",
      reviewed_by: "Akshat",
      completed_date: "2026-06-23"
    }
  ]
  
  ═══ DOCUMENTS ═══
  documents:
    pan: {
      status: "verified",  // States: pending, under_review, verified, rejected
      verified_by: "Priya (HR)",
      verified_date: "2026-06-23",
      rejection_reason: null
    }
    aadhaar: {
      status: "under_review",
      verified_by: null,
      verified_date: null,
      rejection_reason: null
    }
    degree: {
      status: "rejected",
      verified_by: "Priya (HR)",
      verified_date: "2026-06-20",
      rejection_reason: "Blurry/Unclear" // Dropdown options: Unclear, Expired, Invalid, Incomplete, Damaged, WrongDocument, IllegalibleSignature, Other
    }
    10th_marksheet: {
      status: "verified",
      verified_by: "Priya (HR)",
      verified_date: "2026-06-22",
      rejection_reason: null
    }
    12th_marksheet: {
      status: "verified",
      verified_by: "Priya (HR)",
      verified_date: "2026-06-23",
      rejection_reason: null
    }
    bank_proof: {
      status: "pending",
      verified_by: null,
      verified_date: null,
      rejection_reason: null
    }
  
  ═══ CONTRACT (For Contractors Only) ═══
  contract:
    start_date: "2026-06-01" (locked, immutable)
    end_date: "2026-09-01" (locked, immutable - source of truth)
    renewal_date: "2026-09-01" (calculated from end_date, not input)
    scope: "Build API endpoints"
    rate: 500 (₹ or $)
    rate_type: "per_hour" // or "per_month", "fixed"
    additional_sow: "Authentication module"
    status: "active"
    
    ✓ FIX #1: REMOVED duration_months field (was causing confusion)
    ✓ FIX #1: end_date is source of truth (not duration_months)
    ✓ FIX #1: renewal_date = end_date (always consistent)
    
  contract_amendments: [
    {
      amendment_id: 1,
      date: "2026-06-15",
      changed_by: "Priya (HR)",
      changes: {
        scope: { old: "Build API endpoints", new: "Build API + Authentication" },
        additional_sow: "Authentication module"
      }
    },
    {
      amendment_id: 2,
      date: "2026-07-01",
      changed_by: "Priya (HR)",
      changes: {
        rate: { old: 500, new: 550 }
      }
    }
  ]
  
  renewal_alerts: [
    { days_until_expiry: 90, alerted_on: "2026-06-02" },
    { days_until_expiry: 60, alerted_on: "2026-07-02" },
    { days_until_expiry: 30, alerted_on: "2026-08-02" },
    { days_until_expiry: 7, alerted_on: "2026-08-25" }
  ]
  
  ═══ INVOICES (For Contractors Only) ═══
  invoices: [
    {
      invoice_id: "INV-2026-001",
      date_submitted: "2026-06-30",
      invoice_period: "2026-06-01 to 2026-06-30",
      amount: 1000,
      currency: "GBP", // or "USD", "EUR", "INR"
      status: "Submitted", // or "Approved", "Paid"
      file_link: "https://drive.google.com/.../invoice.pdf",
      approved_by: null,
      approved_date: null,
      paid_date: null,
      
      ✓ FIX #3: EXCHANGE RATE FIELDS (for foreign currency invoices)
      exchange_rate: 119, // 1 GBP = ₹119 (entered by HR at approval)
      exchange_date: "2026-06-30", // Rate on this date
      rate_source: "manual", // or "api" (Google Finance)
      converted_amount: 119000, // GBP 1,000 × 119 = INR 119,000
    },
    {
      invoice_id: "INV-2026-002",
      date_submitted: "2026-07-30",
      invoice_period: "2026-07-01 to 2026-07-31",
      amount: 13200,
      currency: "INR", // Indian rupees (no conversion needed)
      status: "Approved",
      file_link: "https://drive.google.com/.../invoice2.pdf",
      approved_by: "Priya (HR)",
      approved_date: "2026-07-31",
      paid_date: null,
      
      ✓ FIX #3: For INR invoices, rate = 1 (no conversion)
      exchange_rate: 1, // 1 INR = ₹1 (no conversion)
      exchange_date: "2026-07-31",
      rate_source: "none", // Not applicable for INR
      converted_amount: 13200, // Same as amount (INR to INR)
    }
  ]
  
  todo: [
    { id: 1, task: "Finish report", done: false },
    { id: 2, task: "Submit invoice", done: true }
  ]
  
  offboarding:
    status: "active"
    last_day: null
    delete_after: null
  
  documents_folder_link: "https://drive.google.com/drive/folders/1abc..."
```

---

## Where Everything Lives

| What | Where | Notes |
|------|-------|-------|
| Worker info | Firestore | Name, email, type, team |
| Project data | Firestore | Name, lead, dates, status |
| Goals | Firestore | What to achieve, deadlines |
| Weekly summary | Firestore | Text updates each week |
| Performance | Firestore | Rating + feedback |
| Reviews | Firestore | 30/60/90-day, annual |
| Documents | Google Drive | PDF, images in worker's folder |
| Document status | Firestore | Pending, verified, rejected |
| To-do list | Firestore | Personal tasks |
| Audit log | Firestore | Who did what, when |

---

## Google Drive Structure

```
KATBOTZ Workforce/
├── 2026/
│   ├── Rohan Mehta/
│   │   ├── PAN.pdf
│   │   ├── Aadhaar.jpg
│   │   ├── Degree.pdf
│   │   ├── Marksheet_10th.pdf
│   │   ├── Marksheet_12th.pdf
│   │   └── Bank_Proof.pdf
│   ├── Sara Lim/
│   ├── Amit/
│   └── [other workers]
└── Archive/
    └── [exited workers]
```

---

## Size Estimate

Per worker: ~100 KB (profile + goals + reviews)
At 500 workers: ~50 MB total
Monthly cost: ~₹3–5

---

## Backup

Daily backup of Firestore to Cloud Storage:
- `gs://katbotz-backups/daily/`
- Keep 30 days of backups
- Auto-delete old ones

---

## That's It

Simple schema. Everything organized. Easy to understand.
