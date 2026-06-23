# System Specification — Simple & Clear

---

## 1. Authentication

**How:** Google OAuth (KATBOTZ Workspace only)  
**Who creates accounts:** HR manually creates katbotz email addresses  
**What happens:** Worker logs in once, they're in the system forever  
**Password:** None. Just Google login.

---

## 2. Worker Types & Documents

### Employee (5 documents)
```
☐ PAN card (image/PDF)
☐ Aadhaar image (JPG/PNG)
☐ Degree marksheet (PDF)
☐ 10th marksheet (PDF)
☐ 12th marksheet (PDF)
☐ Bank proof (PDF or image)
```

### Contractor (3 documents)
```
☐ PAN card
☐ Signed agreement (PDF)
☐ Bank proof
```

### Intern (4 documents)
```
☐ PAN card
☐ Aadhaar image
☐ Degree marksheet
☐ 10th marksheet
☐ 12th marksheet
```

---

## 3. Pages (What People See)

### Login Page
- Email field (auto-filled: katbotz.com)
- Click: "Sign in with Google"
- Done

### Worker Dashboard (Each worker sees their own)
**Section 1: My Documents**
```
PAN card
  ☐ Upload to Drive
  Status: ☑ Verified by Priya on June 23

Aadhaar image
  ☐ Upload to Drive
  Status: ☐ Pending

[etc.]
```

**Section 2: My Performance**
```
[Form to fill]
Last Updated: Rating
Feedback: [text]
[Submit button]
```

**Section 3: My Current Project**
```
My Project Assignment

Project Name: Mobile App Redesign
Project Lead: Akshat (assigned by HR)
Start Date: June 1, 2026
Status: In Progress

Description: Redesign mobile app UI/UX
```

**Section 4: My Goals**
```
Goals for This Project

☐ Complete wireframes (by June 30)
  Status: In Progress
  
☐ Get approval from stakeholders (by July 5)
  Status: Not Started
  
☐ Implement 80% of designs (by July 20)
  Status: On Track

[Edit Goals] ← Worker or Team Lead can edit

Goals Achieved:
  ✓ Research existing UI issues
  ✓ Create initial mockups
```

**Section 5: Weekly Summary**
```
Weekly Updates

Week of June 17–23:
"Completed initial wireframes, had team review meeting, 
collected feedback from Akshat. Next week: iterate on designs 
based on feedback."

[Edit] [Save]
```

**Section 6: My To-Do List (Customizable)**
```
Checklist (worker can add):
  ☐ Finish project report
  ☐ Send invoice
  ☐ Review Q3 goals
  [+ Add item]
```

**Section 7: Reviews**
```
My Performance Reviews

30-Day Review (Due: July 1)
  Status: Completed
  Rating: 4/5
  Feedback: "Great progress on designs"
  Completed by: Akshat

60-Day Review (Due: Aug 1)
  Status: Pending
  
90-Day Review (Due: Sept 1)
  Status: Scheduled

Annual Review (Due: June 2027)
  Status: Not Yet Due
  
[View Full History]
```

**Section 8: Notifications**
```
Jun 23 — Your PAN was verified ✓
Jun 22 — Akshat updated your goals
Jun 20 — 30-day review due in 1 week
Jun 19 — Contract renewal coming: Aug 1
```

---

### HR Dashboard (Priya sees all workers)

**View 1: All Workers List**
```
Name | Type | Project | Project Lead | Goals | Docs | Reviews | Status
---
Rohan | Employee | Mobile App | Akshat | 2/3 Done | 5/6 ✓ | 30d ✓ | Active
Sara | Intern | API Design | Rohini | 1/2 Done | 4/5 ✓ | Pending | Active
Amit | Contractor | Bug Fixes | Akshat | 5/5 ✓ | 2/3 ✓ | N/A | Active
```

Columns are clickable. Click "Rohan" → see his full profile.

**View 2: Worker Profile (Click on name)**
```
Rohan Mehta | Indian Employee | Team Lead: Akshat

═══ PROJECT ASSIGNMENT ═══
Project: Mobile App Redesign
Project Lead: Akshat [Change]
Start Date: June 1, 2026
Status: In Progress

═══ GOALS ═══
☐ Complete wireframes (by June 30) — In Progress
☐ Get approval (by July 5) — Not Started
☐ Implement designs (by July 20) — On Track

[Edit Goals] (Akshat or Rohan can edit)

Goals Achieved:
  ✓ Research UI issues
  ✓ Create mockups

═══ WEEKLY SUMMARY ═══
Week of June 17–23:
"Completed initial wireframes, had team review meeting..."

[Edit] [Submit]

═══ DOCUMENTS ═══
PAN: ☑ Verified by Priya, June 23 [View in Drive]
Aadhaar: ☐ Pending [View in Drive]
Degree: ☑ Verified, June 22
[etc.]

═══ PERFORMANCE ═══
Current Rating: 4.5/5
Feedback: "Good performance"
Last updated: June 23

═══ REVIEWS ═══
30-Day Review: ✓ Completed (June 23) — Rating: 4/5
60-Day Review: ⏳ Pending (Due Aug 1)
90-Day Review: Scheduled (Due Sept 1)
Annual Review: Not Yet Due

[View Full Review History]

═══ CONTRACT ═══
Type: Permanent
Start: Jan 2026
Renewal: None

═══ OFFBOARDING ═══
Status: Active
[Mark for Exit] button

═══ AUDIT TRAIL ═══
June 23 — PAN verified by Priya
June 22 — Degree verified by Priya
June 20 — Created by Priya
June 15 — Assigned to Project: Mobile App
```

**View 3: Offboarding Workers (HR only)**
```
Name | Last Day | Status | Docs Saved Until | Delete On
---
Raj | June 30 | Offboarded | June 30, 2029 | June 30, 2029
```

---

## 4. Database Schema (Super Simple)

```
workers/{worker_id}
  name: "Rohan Mehta"
  email: "rohan@katbotz.com"
  type: "Indian Employee"  // or "Contractor", "Intern"
  department: "Engineering"
  team_lead: "Akshat"
  created_at: 2026-06-01
  
  ═══ DOCUMENTS ═══
  checklist:
    pan: { status: "verified", verified_by: "Priya", verified_date: 2026-06-23 }
    aadhaar: { status: "pending", verified_by: null, verified_date: null }
    degree: { status: "verified", verified_by: "Priya", verified_date: 2026-06-22 }
    10th_marksheet: { status: "verified" ... }
    12th_marksheet: { status: "verified" ... }
    bank_proof: { status: "verified" ... }
  
  ═══ PROJECT ═══
  project:
    name: "Mobile App Redesign"
    project_lead: "Akshat"
    start_date: 2026-06-01
    status: "In Progress"  // or "Completed", "On Hold"
    description: "Redesign mobile app UI/UX"
  
  ═══ GOALS ═══
  goals:
    [
      {
        id: 1,
        goal: "Complete wireframes",
        deadline: "2026-06-30",
        status: "In Progress",  // or "Not Started", "Completed"
        editable_by: ["team_lead", "employee"]  // Who can edit this goal
      },
      {
        id: 2,
        goal: "Get stakeholder approval",
        deadline: "2026-07-05",
        status: "Not Started"
      },
      {
        id: 3,
        goal: "Implement 80% of designs",
        deadline: "2026-07-20",
        status: "On Track"
      }
    ]
  
  goals_achieved:
    [
      { achieved: "Research existing UI issues", date: 2026-06-15 },
      { achieved: "Create initial mockups", date: 2026-06-20 }
    ]
  
  ═══ WEEKLY SUMMARY ═══
  weekly_summary:
    [
      {
        week_of: "2026-06-17",
        summary: "Completed initial wireframes, had team review meeting, collected feedback from Akshat. Next week: iterate on designs based on feedback.",
        submitted_date: "2026-06-23"
      },
      {
        week_of: "2026-06-10",
        summary: "Researched existing UI issues, benchmarked competitors, created mood board."
      }
    ]
  
  ═══ PERFORMANCE ═══
  performance:
    rating: 4.5
    feedback: "Good work"
    updated_date: 2026-06-23
  
  ═══ REVIEWS ═══
  reviews:
    [
      {
        type: "30-day",
        due_date: "2026-07-01",
        status: "completed",
        rating: 4,
        feedback: "Great progress on designs",
        reviewed_by: "Akshat",
        completed_date: "2026-06-23"
      },
      {
        type: "60-day",
        due_date: "2026-08-01",
        status: "pending"
      },
      {
        type: "90-day",
        due_date: "2026-09-01",
        status: "scheduled"
      },
      {
        type: "annual",
        due_date: "2027-06-01",
        status: "not_yet_due"
      }
    ]
  
  ═══ OTHER ═══
  contract:
    renewal_date: "2029-06-01"  // or null if no renewal
    
  to_do:
    [
      { id: 1, task: "Finish project report", done: false },
      { id: 2, task: "Send invoice", done: true },
      { id: 3, task: "Review goals", done: false }
    ]
  
  offboarding:
    status: "active"  // or "exit_scheduled", "exited"
    last_day: null  // becomes 2026-06-30 if marked for exit
    delete_after: null  // becomes 2029-06-30 if exited (3 years from last day)

documents_folder_link: "https://drive.google.com/drive/folders/1abc..."
```

---

## 5. Document Workflow

**Worker uploads:**
1. Click "Upload PAN" → file picker
2. Select file → upload to Google Drive (in worker's folder)
3. WOP records: `{status: "pending", uploaded_date: 2026-06-23}`
4. Worker sees: "⏳ Pending review by HR"

**HR verifies:**
1. HR opens worker profile
2. Sees "PAN: ⏳ Pending"
3. Clicks "View in Drive" → opens Drive folder
4. Looks at the image
5. Returns to WOP
6. Clicks ☑ "Mark verified"
7. System records: `{status: "verified", verified_by: "Priya", verified_date: 2026-06-23}`
8. Worker sees: "✓ Verified by Priya on June 23"

**No code processing.** HR just looks and clicks.

---

## 6. Performance Tracker

**What it is:** Simple form each worker fills

**Fields:**
```
Rating (1–5 stars)
Feedback (text, max 500 chars)
Last updated: [auto-filled date]
```

**Who fills:** Worker or Team Lead (whoever is assigned)  
**Who sees:** Worker + HR + Team Lead  
**Update frequency:** Whenever (no schedule, no automation)

---

## 7. Contract Renewal Tracking

**What it shows (HR dashboard):**
```
Amit (Contractor)
  Contract end: Sept 1, 2026
  Renewal: Not scheduled yet
  [Set renewal date] button
```

**HR manually enters:**
- Contract start date
- Contract end date
- Renewal date (if applicable)

**System shows:**
- "Contract renews in X days" (on HR dashboard)
- That's it. No automatic emails.

---

## 8. Offboarding Process

**Step 1: HR marks worker for exit**
- HR clicks [Mark for Exit] on worker profile
- Pops up: "Last day?" → HR enters date (e.g., June 30)
- System records: `{status: "exit_scheduled", last_day: "2026-06-30", delete_after: "2029-06-30"}`

**Step 2: Documents are locked for 3 years**
- Documents stay in Firestore + Drive
- Can't be deleted or modified
- HR can still view

**Step 3: Auto-delete after 3 years**
- On June 30, 2029: system automatically deletes
- Removes from Firestore
- Removes from Drive (HR can archive manually first)
- Audit log shows: "Deleted on 2029-06-30"

**That's all.** No checklist, no asset return, no ceremony. Just lock, then delete.

---

## 9. Notifications (Simple)

**Where:** In-portal only (not email)  
**What triggers:**
- Document verified ✓
- Document pending (overdue by 1 week)
- Contract renewal coming (30 days before)
- Performance update (when Team Lead fills form)

**How shown:**
```
Notifications (bell icon)
  Jun 23 — Your PAN was verified ✓
  Jun 20 — Aadhaar is pending (1 week overdue)
  Jun 15 — Contract renewal coming: Aug 1
```

Worker sees when they log in. That's it. No email.

---

## 10. To-Do List (Personal)

**What it is:** Each worker has a custom checklist for their day

**Worker can:**
- Add tasks: "Finish Q3 report", "Send invoice", "Call client"
- Check off when done ☑
- Delete tasks

**HR sees:**
- HR can view but NOT edit (read-only)

**No automation.** Worker manages it.

---

## 11. What's Stored Where

| Data | Stored in | Notes |
|------|-----------|-------|
| Worker name, email, type, status | Firestore | System of record |
| Document checklist status | Firestore | "verified" or "pending" |
| Performance data | Firestore | Rating + feedback |
| Project assignment | Firestore | Project name, project lead, dates |
| Goals | Firestore | What to achieve, deadline, status |
| Weekly summary | Firestore | Worker's written update each week |
| Reviews | Firestore | 30/60/90-day, annual reviews with ratings |
| Actual document files | Google Drive | PDF, image, etc. |
| To-do list | Firestore | Per worker |
| Audit trail | Firestore | Who did what, when |

**Google Drive structure:**
```
KATBOTZ Workforce
├── 2026 (year)
│   ├── Rohan Mehta
│   │   ├── PAN.pdf
│   │   ├── Aadhaar.jpg
│   │   ├── Degree.pdf
│   │   └── Bank_Proof.pdf
│   ├── Sara Lim
│   └── ...
└── Archive
```

---

## 12. User Roles (Simple)

**Senior HR (Priya):**
- Create workers
- See all workers + documents
- Verify documents (check ☑)
- View performance
- Mark for exit

**HR Executive (Rohini):**
- See all workers + documents
- View performance
- Cannot verify documents
- Cannot mark for exit

**Team Lead (Akshat):**
- See only their team
- Fill in performance forms
- View their team's documents
- Cannot verify
- Cannot create workers

**Worker/Contractor/Intern:**
- See only their own profile
- Upload documents
- Fill performance form
- Manage personal to-do list

---

## 13. Security (Simple)

- **Login:** Google OAuth (KATBOTZ domain)
- **Data:** Encrypted in Firestore + Drive
- **Access:** Role-based (HR sees all, worker sees self)
- **Audit:** Who did what, when (logged in Firestore)

That's it. No locked buckets, no complex IAM, no magic.

---

## 14. Auto-Delete Job (Only Automation)

**Runs:** Once per month (background job)

**What it does:**
```
For each worker where (last_day < 3 years ago AND status = "exited"):
  1. Delete worker record from Firestore
  2. Delete documents from Drive folder
  3. Log: "Deleted [worker_name] on [date]"
```

**Manual fallback:** HR can manually delete from Drive if urgent

---

## Done.

That's the entire system. No complexity. Just checkboxes and documents.
