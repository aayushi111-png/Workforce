# WORKFLOWS — Step by Step

---

## WORKFLOW 1: Worker Onboarding (Verification-First)

**THE SIMPLE PROCESS: Verify First, Then Create Account**

Why this way? Saves money. Don't create accounts for people who won't pass verification.

---

### **STEP 1: HR Creates Onboarding Link (2 minutes)**

**Part A: Fill Worker Details (1 minute)**

1. HR logs into WOP
2. Clicks [+ Create Worker]
3. Fills in complete worker information:
   - Name: [Full name]
   - Personal Email: [personal@gmail.com] ← Where onboarding link is sent
   - Professional Email: [name@katbotz.com] ← Will be created after verification
   - Worker Type: [Employee/Contractor/Intern/Global Contractor/Global Intern]
   - Department: [Engineering, HR, Sales, etc.]
   - Team Lead: [Select from list]
   - Location: [India/US/Other]
4. HR reviews all details
5. HR clicks [Generate Token & Link]

**Part B: System Generates Token (1 minute)**

1. System validates all fields
2. System generates a **unique token** (32-character random code)
3. System creates link: `workforce.katbotz.com/onboard/[token]`
4. System stores token in Firestore with:
   - Worker name, personal email, professional email
   - Type, department, team lead
   - Creation date, expiration date (7 days)
5. HR sees confirmation with:
   - Token: abc123xyz456def...
   - Link: workforce.katbotz.com/onboard/abc123xyz456def...
   - Expiration: June 30, 2026 (7 days)
6. HR sends this link to worker's **personal email** via email/chat/message

Available options after token generation:
- [Copy Link] — Copy to clipboard
- [Email to Worker] — Send via email
- [QR Code] — Generate QR code to scan
- [Regenerate Token] — Create new token if needed

**Time:** 2 minutes total  
**Cost:** Zero (no account created yet)  
**What happens:** Worker receives link to upload documents (using personal email, not professional yet)

---

### **STEP 2: Worker Uploads Documents (5 minutes)**

Worker clicks the link they received. **No login needed.**

They see:
- Checklist of required documents (based on their type)
- Upload buttons for each document

For example (if they're an Employee):
- ☐ PAN
- ☐ Aadhaar
- ☐ Degree
- ☐ 10th Marksheet
- ☐ 12th Marksheet
- ☐ Bank Proof

Worker:
1. Clicks [Upload] next to "PAN"
2. Selects file from their computer
3. File uploads immediately
4. Repeats for all other documents
5. Clicks [Submit All]

**Important:** Documents are uploaded to a temporary storage (not the final location yet).

**Time:** 5 minutes (quick upload)  
**Cost:** Still zero  
**What worker sees:** "Waiting for HR to verify"

---

### **STEP 3: HR Verifies Documents (5-10 minutes)**

HR logs into WOP and goes to [Pending Verification] section.

They see the worker's name and all uploaded documents.

For each document:
1. HR clicks [View] to see the document
2. Checks if it's clear, valid, and correct
3. Either:
   - Clicks ☑ [Mark Verified] — document approved
   - Clicks ✗ [Reject] and selects reason from dropdown:
     - "Unclear/Blurry"
     - "Expired"
     - "Invalid"
     - "Incomplete"
     - "Wrong Document"

If **all documents are verified** → Go to Step 4

If **any document is rejected** → HR sends message to worker: "Your PAN is blurry, please re-upload"
→ Worker re-uploads via same link
→ HR verifies again

**Time:** 5-10 minutes total  
**Cost:** Still zero (no account yet)  
**What worker sees:** "Your PAN has been rejected. Please re-upload."

---

### **STEP 4: HR Creates Google Account (1 minute)**

Once **all documents are verified** ✓

HR clicks [Create Account for Worker]

System:
- Creates @katbotz.com email account (this is what costs money)
- Moves documents from temporary storage to permanent storage
- Sends worker a welcome email: "Your account is ready. Log in here."

**Important:** Account only created AFTER verification is done.

**Time:** 1 minute  
**Cost:** ₹100/month (only for verified workers)  
**Saves:** ₹100 × 12 months = ₹1,200/year per rejected worker

---

### **STEP 5: Worker Logs In (First Time)**

Worker gets the welcome email and clicks login link.

1. Goes to workforce.katbotz.com
2. Clicks "Sign in with Google"
3. Enters email + password
4. Logged in

Worker sees:
- Their profile
- All documents they uploaded (✓ Already verified)
- **NO need to re-upload** (this is the key!)
- Project, goals, reviews sections (all ready to go)

**Time:** 1-2 minutes  
**Cost:** Nothing new  
**What worker sees:** "All your documents are verified. You're ready to start!"

---

### **Timeline Summary**

| Step | Who | Time | Cost |
|------|-----|------|------|
| 1. Create link | HR | 1 min | ₹0 |
| 2. Upload docs | Worker | 5 min | ₹0 |
| 3. Verify docs | HR | 5-10 min | ₹0 |
| 4. Create account | HR | 1 min | ₹100/month |
| 5. Worker logs in | Worker | 1-2 min | ₹0 |
| **Total** | | **~25 minutes** | **₹100/month** |

**Key Difference:**
- Old way: Create account (₹100) → Worker uploads → HR verifies → Maybe reject (money wasted)
- **New way:** HR verifies → Create account (₹100) → Worker logs in (no re-upload)

**Saves ₹1,200-1,800/year** by not creating accounts for rejected workers.

---

### **What If Documents Are Rejected?**

1. HR rejects PAN: "Document is blurry"
2. Worker gets notification in WOP: "PAN rejected — please re-upload"
3. Worker clicks same link, re-uploads PAN
4. HR verifies again
5. If approved, continue to Step 4
6. If rejected again, repeat

No account created. No money wasted.

---

### **FAQ**

**Q: What if I need to create an account quickly?**  
A: HR can skip verification and create account immediately (costs money). But verification-first is the default to save costs.

**Q: Can the worker re-upload after rejection?**  
A: Yes, same link works. They just click the same link again and re-upload.

**Q: Does the worker lose their uploads if rejected?**  
A: No, they stay in temporary storage and can be re-uploaded anytime.

**Q: How long does the verification link work?**  
A: 7 days. After that, HR creates a new link.

**Q: Do workers have to re-upload when they log in?**  
A: No! Documents uploaded during verification are automatically available in their account. Zero re-upload.

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
