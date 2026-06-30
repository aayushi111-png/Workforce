# Workforce Portal (WOP) — Simple Version

**What is this?**
A portal where KATBOTZ workers log in with their katbotz.com email, upload documents to Google Drive, and HR checks off completion. Simple checklist system. Nothing fancy.

**What it does:**
1. Workers log in with KATBOTZ email (Google OAuth)
2. HR assigns projects + project leads to workers
3. Teams set goals (with deadlines, editable by team lead + worker)
4. Workers track goals achieved (check off as complete)
5. Workers upload documents (links go to Google Drive)
6. Workers write weekly summary (what happened this week)
7. HR sees all workers in a list
8. HR checks off completed documents
9. Performance tracker (simple form)
10. Reviews system (30/60/90-day, annual reviews)
11. Contract renewal tracking (with dates)
12. Personal to-do list (per worker)
13. Offboarding (documents saved 3 years, then deleted)

**That's it.** No automations. No emails. No complexity.

---

## Quick Facts

| | |
|---|---|
| **Build time** | 6 weeks (July 1 – Aug 13) |
| **Testing & Handover** | Aug 14 – Sept 3, 2026 |
| **Go-Live** | September 4, 2026 |
| **Monthly operating cost** | ₹3–5/month (50 workers) or ₹9–15/month (500 workers) |
| **Users** | ~50 workers + 3 HR staff |
| **Tech** | Next.js frontend, FastAPI backend, Firestore database, Google Drive storage |

---

## For Different Users

**Worker sees:**
- Login with katbotz email
- My Project (project name, project lead, description)
- My Goals (what to achieve, with deadlines) — can edit
- My Goals Achieved (what's completed so far) — can mark as done
- My Weekly Summary (write what happened this week)
- My Documents (PAN, Aadhaar, etc.) — upload to Drive
- My Performance (fill form, HR sees it)
- My Reviews (30/60/90-day, annual — see HR feedback)
- My To-Do (checklist of what to do today)
- Notifications (just alerts, nothing fancy)

**HR sees:**
- All Workers (list, searchable, with project + goals + docs status)
- Click worker → see ALL details:
  - Project assignment
  - Goals (can edit)
  - Goals achieved
  - Weekly summaries (read what they wrote)
  - Documents + checklist (☑ Done when verified in Drive)
  - Performance rating
  - Review history (30/60/90-day, annual)
  - Contract renewal date
  - Offboarding status
- That's it.

---

## Documents Needed (Per Worker Type)

**Employee (5 documents):**
- ☐ PAN card
- ☐ Aadhaar image
- ☐ Degree marksheet
- ☐ 10th/12th marksheet
- ☐ Bank proof

**Contractor (3 documents):**
- ☐ PAN card
- ☐ Agreement signed
- ☐ Bank proof

**Intern (4 documents):**
- ☐ PAN card
- ☐ Aadhaar image
- ☐ Degree marksheet
- ☐ 10th/12th marksheet

---

## How Documents Work

1. **Worker uploads** → Submits to Google Drive folder
2. **HR downloads** → Checks in Drive (just looks at it)
3. **HR marks** ☑ Done in portal (means verified)
4. **System records** → "Verified by Priya on June 23"
5. **Worker sees** ✓ Complete in their checklist

**No code processing.** No extraction. HR just looks, then checks box.

---

## Implementation

**Folder structure:**
```
frontend/ — Next.js (login page, worker dashboard, HR dashboard)
backend/ — FastAPI (API endpoints, database)
```

**Database:**
```
workers/{worker_id}
  ├── name, email, type, department, team_lead
  ├── checklist (pan: done/pending, aadhaar: done/pending, ...)
  ├── performance (rating, feedback, date updated)
  ├── contract_renewal_date
  ├── created_at
  └── to_delete_after (if offboarding, date to delete)
```

**Storage:**
- All documents in Google Drive (worker's folder)
- Firestore just tracks "completed" status
- After 3 years: delete from Drive + Firestore

---

## Ready to build?

See `PLAN.md` for week-by-week schedule.
