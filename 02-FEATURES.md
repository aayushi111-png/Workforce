# FEATURES — What You Can Do

---

## 1. LOGIN

**How:** Click "Sign in with Google" → enter katbotz email → password

**Who:** Anyone with katbotz.com email

**Access:** Automatically routed to role (worker sees own profile, HR sees all workers)

---

## 2. DOCUMENTS

**Worker uploads:**
- PAN card (image/PDF)
- Aadhaar image (JPG/PNG)
- Degree certificate (PDF)
- 10th/12th marksheets (PDF)
- Bank proof (image/PDF)
- Signed agreements

**HR verifies:**
1. Click [View in Drive]
2. Look at document
3. Click ☑ Mark Verified
4. Worker sees ✓ Done

**Status:**
- ☐ Pending (not uploaded yet)
- ⏳ Submitted (uploaded, waiting for verification)
- ✓ Verified (HR approved)
- ✗ Rejected (HR rejected, must re-upload)
- 🤔 Clarification Needed (upload clearer version)

**HR Options:**
1. ✓ Mark Verified (document is good)
2. ✗ Reject with reason (document is invalid, must re-upload)
3. 🤔 Request Clarification (e.g., "passport blurry, send clearer scan")
   - Worker gets email: "Please upload clearer version"
   - Worker re-uploads same document
   - HR reviews again

**Example:**
```
Aadhaar submitted, but blurry

HR option 1: ✗ Reject → Worker re-uploads completely
HR option 2: 🤔 Clarify → Worker uploads clearer scan (same Aadhaar)
```

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

## 13. ZOHO RECRUIT INTEGRATION

**What it does:** Auto-pulls "offer accepted" from Zoho → auto-creates worker in WOP

**Workflow:**
1. Recruiter marks offer as "Accepted" in Zoho Recruit
2. Zoho sends data to WOP automatically:
   - Name, email, position, joining date
   - Worker type (Employee, Contractor, Intern)
3. WOP auto-creates worker profile
4. System auto-generates document checklist
5. Worker gets email: "Welcome! Log in to upload documents"

**No manual data entry. Automatic.**

**What's synced:**
- Name
- Email
- Position/Department
- Worker type
- Joining date
- Offer details

---

## 14. GUSTO INTEGRATION

**What it does:** Auto-syncs worker data to Gusto for payroll + benefits

**Workflow:**
1. Worker activated in WOP
2. WOP sends to Gusto:
   - Name, email, department
   - Joining date
   - Salary (if entered in WOP)
3. Gusto updates: payroll, tax forms, benefits enrollment
4. HR never needs to re-enter data

**Keeps in sync:**
- Department changes
- Salary updates
- Job title changes
- Termination date (when marked for exit)

**One entry. Multiple systems. No duplication.**

---

## 15. AUTO-DELETE (After 3 Years)

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

## That's It

15 features. No complexity. Zoho + Gusto connected. Auto-delete. Everything organized.
