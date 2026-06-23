# Workforce Portal (WOP) — Simple Version

**What is this?**
A portal where KATBOTZ workers log in with their katbotz.com email, upload documents to Google Drive, and HR checks off completion. Simple checklist system. Nothing fancy.

**What it does:**
1. Workers log in with KATBOTZ email (Google OAuth)
2. Workers see their to-do list (documents to upload, forms to fill)
3. Workers upload documents (links go to Google Drive)
4. HR sees all workers in a list
5. HR checks off completed items
6. Performance tracker (simple form)
7. Contract renewal tracking (with dates)
8. Offboarding (documents saved 3 years, then deleted)

**That's it.** No automations. No emails. No complexity.

---

## Quick Facts

| | |
|---|---|
| **Build time** | 2–3 weeks (July 1 – Aug 20) |
| **Launch date** | Aug 20, 2026 |
| **Live use** | Sept 1, 2026 |
| **Budget** | ₹1,500–2,500 (Claude + Cloud) |
| **Users** | ~50 workers + 3 HR staff |
| **Tech** | Next.js frontend, FastAPI backend, Firestore database, Google Drive storage |

---

## For Different Users

**Worker sees:**
- Login with katbotz email
- My Documents (PAN, Aadhaar, etc.) — upload to Drive
- My Performance (fill form, HR sees it)
- My To-Do (checklist of what to do today)
- Notifications (just alerts, nothing fancy)

**HR sees:**
- All Workers (list, searchable)
- Click worker → see docs + checklist + performance + contract renewal date
- Checkbox for each document (☑ Done when verified in Drive)
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
