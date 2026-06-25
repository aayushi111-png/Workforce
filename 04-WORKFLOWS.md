# WORKFLOWS — Step by Step

---

## WORKFLOW 1: Worker Onboarding

**TWO OPTIONS — BOTH ALWAYS AVAILABLE:**

---

**Option A: HR MANUALLY CREATES WORKER (Always Available)**

**When to use:** 
- Anytime HR wants to create a worker
- Direct creation without Zoho
- Override for urgent hires
- **ALWAYS available as primary option**

**How to Manually Create:**
1. HR logs into WOP
2. Clicks [+ Create Worker] button (always visible)
3. Fills form:
   - Name: [Full name]
   - Email: [name@katbotz.com]
   - Type: [Employee/Contractor/Intern/Global Contractor/Global Intern]
   - Department: [Engineering, HR, Sales, etc.]
   - Team Lead: [Select from list]
   - Location: [India/US/Other] (for currency/Gusto)
4. Clicks [Create]
5. System auto-generates:
   - Worker ID (auto)
   - Document checklist (based on type)
   - Google Drive folder
   - Welcome email
6. Worker receives email: "Your WOP account is ready"
7. Worker can log in immediately to WOP

**Time to create:** 2-3 minutes  
**Manual entry required:** Yes (but simple form)  
**No Zoho dependency:** Works anytime  

---

**Option B: ZOHO AUTO-CREATES WORKER (Automated - If Using Zoho)**

**When to use:**
- If using Zoho Recruit for hiring
- To automate worker creation
- Zero manual entry
- Faster for high-volume hiring

**How It Works (WEBHOOK):**
```
Zoho Recruit (HR accepts offer)
         ↓
    Webhook sends data automatically
         ↓
WOP auto-creates worker (zero manual entry)
         ↓
Worker gets email
```

**Detailed Steps:**
1. Recruiter in Zoho Recruit marks candidate offer: "Accepted"
2. Zoho webhook automatically sends data to WOP
3. WOP backend receives webhook:
   - Validates email (@katbotz.com)
   - Extracts: Name, email, position, department, joining date, type
   - Creates worker in Firestore (worker_id auto-generated)
   - Creates Google Drive folder for documents
   - Generates document checklist (based on worker type)
   - Sends welcome email to worker
   - Logs action in audit trail
4. Worker receives email: "Your WOP account is ready"
5. Worker can log in immediately
6. **NO MANUAL HR ENTRY NEEDED** ✓

**Webhook Setup (Once During Week 3):**
- WOP backend has endpoint: https://wop-backend.katbotz.com/api/zoho/worker-created
- Zoho Settings → Webhooks → Configure to send data to that URL
- When offer marked "Accepted" in Zoho → Auto-sends to WOP
- Worker created in seconds

**Time to create:** 5-10 seconds (automatic)  
**Manual entry required:** No (fully automated)  
**Zoho dependency:** Requires Zoho Recruit integration  

---

**Which option to use?**

| Scenario | Use Manual | Use Zoho |
|----------|-----------|----------|
| **Regular hiring** | ✓ Simpler | ✓ Faster |
| **Emergency hire** | ✓ Immediately | ❌ Need Zoho setup |
| **Contractor onboarding** | ✓ Direct | ❌ Zoho may not have |
| **Quick add** | ✓ 2-3 minutes | ❌ Setup required |
| **High volume** | ❌ Too manual | ✓ Automated |
| **Zoho integrated** | ✓ Still works | ✓ Preferred |
| **Zoho down** | ✓ Works anyway | ❌ Can't use |

**KEY: Manual creation [+ Create Worker] button is ALWAYS visible and ALWAYS works** ✓

---

**Step 2: Worker Logs In** (Same for Both Options)
1. Goes to workforce.katbotz.com
2. Clicks "Sign in with Google"
3. Enters email + password
4. Logged in (no password saved in system)

**Step 3: Worker Uploads Documents**
1. Sees checklist: ☐ PAN, ☐ Aadhaar, ☐ Degree, etc.
2. Clicks [Upload] next to PAN
3. Selects file from computer
4. Confirms upload
5. File goes to Google Drive (in their folder)
6. Status shows: ⏳ Waiting for HR verification

**Step 4: HR Verifies Documents**
1. HR clicks on Worker name
2. Sees: PAN — ⏳ Pending
3. Clicks [View in Drive]
4. Opens Drive, looks at file
5. Returns to WOP
6. Clicks ☑ [Mark Verified]
7. System records: ✓ Verified by Priya on June 23
8. Worker sees: ✓ Done

**Done:** All documents verified = Worker is ready to start

---

## WORKFLOW 2: Project Assignment & Goals

**Step 1: HR Assigns Project**
1. HR clicks on Worker
2. Clicks [Assign Project]
3. Enters: Project name, Project Lead (team lead name), Start date
4. Clicks [Save]

**Step 2: Team Lead Sets Goals**
1. Team Lead logs in
2. Sees Worker's profile
3. Clicks [Edit Goals]
4. Adds goals:
   - "Complete wireframes by June 30"
   - "Get approval by July 5"
   - "Implement designs by July 20"
5. Clicks [Save]

**Step 3: Worker Tracks Goals**
1. Worker logs in
2. Sees goals with deadlines
3. As work progresses, marks goals as: In Progress, On Track, Completed
4. When goal done, clicks ☑ [Mark Achieved]
5. Shows up in "Goals Achieved" section

**Step 4: HR Monitors**
1. HR sees goals progress anytime
2. Can edit goals if priorities change
3. Dashboard shows: 2/3 goals complete

---

## WORKFLOW 3: Weekly Summary & Reviews

**Step 1: Worker Writes Weekly Summary (Every Friday)**
1. Worker logs in
2. Clicks [Weekly Summary]
3. Sees template:
   ```
   Week of June 17–23:
   
   "What happened this week?
   What's next week?"
   ```
4. Writes: "Completed wireframes, had review meeting, got feedback"
5. Clicks [Save]

**Step 2: Team Lead Fills 30-Day Review (Day 30)**
1. Team Lead sees notification: "30-day review due for Rohan"
2. Clicks [Fill Review]
3. Fills:
   - Rating: 4/5 stars
   - Feedback: "Great progress, quick learner"
4. Clicks [Submit]

**Step 3: Worker Sees Review**
1. Worker logs in
2. Sees: "Your 30-day review is complete"
3. Clicks [View Review]
4. Reads: Rating 4/5, Feedback from Akshat
5. Can see it forever (no deletion)

**Step 4: Repeat**
- 60-day review (Day 60)
- 90-day review (Day 90)
- Annual review (Year 1, Year 2, etc.)

---

## WORKFLOW 4: Offboarding

**Step 1: HR Marks for Exit**
1. Worker decides to leave (or gets fired)
2. HR clicks on Worker profile
3. Clicks [Mark for Exit]
4. Enters: Last Day (e.g., June 30, 2026)
5. Clicks [Confirm]

**Step 2: System Locks Everything**
1. Worker profile marked "Exiting"
2. Documents locked (can't be deleted/modified)
3. System sets: "Delete all data on June 30, 2029" (3 years later)
4. HR gets alert: "Raj exiting June 30, delete date set to June 30, 2029"

**Step 3: Auto-Delete (After 3 Years)**
1. June 30, 2029 arrives
2. System automatically deletes:
   - Worker record from WOP
   - Documents from Google Drive
   - All data
3. Logs: "Raj's data deleted on June 30, 2029"

**Why 3 years?** Legal. If worker sues later, we have proof of what happened.

---

## WORKFLOW 5: Performance Tracking (Ongoing)

**Anytime:**
1. Team Lead logs in
2. Clicks on Worker
3. Sees current performance rating
4. Can update anytime: Rating (1-5) + Feedback
5. Clicks [Save]

**Worker sees:**
- Current rating
- Most recent feedback
- Last updated date

---

## WORKFLOW 6: Contract Renewal (Manual)

**HR does (one-time setup):**
1. Clicks on Worker (Contractor or Employee)
2. Clicks [Contract Details]
3. Enters:
   - Start date: Jan 1, 2026
   - End date: Dec 31, 2026
   - Renewal date: (if applicable)
4. Clicks [Save]

**System shows:**
- "Contract renews in X days"
- HR gets reminder as date approaches

**HR manually decides:** Renew or let go

---

## That's All Workflows

Simple, straightforward, no complexity.
