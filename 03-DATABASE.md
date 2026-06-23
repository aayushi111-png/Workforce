# DATABASE SCHEMA — What Gets Stored

---

## Worker Profile

```
workers/{worker_id}
  name: "Rohan Mehta"
  email: "rohan@katbotz.com"
  type: "Employee"  // or "Contractor", "Intern"
  department: "Engineering"
  team_lead: "Akshat"
  created_at: "2026-06-01"
  
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
    pan: { status: "verified", verified_by: "Priya", verified_date: "2026-06-23" }
    aadhaar: { status: "pending" }
    degree: { status: "verified" }
    10th_marksheet: { status: "verified" }
    12th_marksheet: { status: "verified" }
    bank_proof: { status: "verified" }
  
  ═══ OTHER ═══
  contract:
    renewal_date: "2029-06-01"
  
  todo: [
    { id: 1, task: "Finish report", done: false },
    { id: 2, task: "Send invoice", done: true }
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
