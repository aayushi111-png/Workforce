# 04 · Workforce Lifecycle

Every worker moves through nine stages from creation to deletion. Each stage has specific blockers and actions.

---

## Stage 1 · Created

- **Triggered by:** Senior HR creates the worker record in WOP after an offer is signed
- **Senior HR enters:** name, email, worker type (Indian Employee / Indian Contractor / Global Contractor / Global Intern), department, team lead, joining date
- **System generates:** Worker ID (e.g. WOP-2026-0041)
- **Worker gets:** email invitation to their portal with a link to log in
- **Blocker:** None. Automatically moves to Stage 2.
- **Exit condition:** Record exists → Stage 2 starts

---

## Stage 2 · Onboarding

- **Who acts:** The worker (self-service portal)
- **Worker sees:** checklist of required documents and agreements for their worker type
  - **Indian Employee checklist:** PAN card, Aadhaar image, degree certificate, relieving letter, employment agreement (to sign)
  - **Indian Contractor checklist:** PAN card, Aadhaar image, bank proof, contractor agreement (to sign)
  - **Global Contractor checklist:** Passport, tax ID, international banking details, contractor agreement (to sign)
  - **Global Intern checklist:** Passport, student ID, university letter, internship agreement (to sign)
- **Worker does:** 
  - Clicks each item, uploads the file, or signs the agreement in the portal
  - Files are stored as-is (untouched, no processing)
  - Worker sees progress: ✓ PAN uploaded, ○ Aadhaar uploaded (pending review), ○ Degree not uploaded yet, etc.
- **Notifications:** If a document is not uploaded for 3 days, worker gets a reminder email
- **Blocker:** Cannot move forward until ALL documents in the checklist are uploaded and ALL agreements are signed
- **Exit condition:** Every item ✓ submitted → Stage 3 starts

---

## Stage 3 · Verification

- **Who acts:** Senior HR (only Senior HR can verify; HR Executive can view but not approve)
- **What happens:**
  - Senior HR sees a verification queue: "Rohan Mehta: 5 documents pending review"
  - HR opens each document (image viewer for photos, PDF viewer for agreements)
  - For each document, HR chooses one:
    - ☑ **Verified** — document is good, move on
    - ✗ **Rejected** — document has issues (e.g. "blurry photo", "missing signature", "expired document")
  - If rejected, HR types the reason → worker gets an email: "Your Aadhaar image was rejected: blurry photo. Please re-upload here: [link to portal]"
  - Worker re-uploads the document, and it returns to "pending review" status
- **Important:** Documents are stored as files only. No Aadhaar number is typed, extracted, or stored anywhere. Only the image file is kept in a locked Cloud Storage bucket.
- **Blocker:** Cannot move forward until EVERY document is ☑ Verified (none can be ○ Pending or ✗ Rejected)
- **Exit condition:** All documents ☑ Verified → Stage 4 starts automatically

---

## Stage 4 · Compliance

- **Who acts:** System (automatic, no HR action needed)
- **What happens:**
  - System checks: ☑ All required documents uploaded? ☑ All documents verified? ☑ All agreements signed?
  - If all ☑: Shows "Ready for activation" in the worker record
  - If any ☐: Shows exactly what's missing (e.g. "Degree certificate: pending review", "Employment agreement: not signed")
- **Blocker:** Cannot move forward until all three checks ☑
- **Exit condition:** All checks ☑ → Stage 5 starts automatically

---

## Stage 5 · Activation

- **Who acts:** Senior HR (the only deliberate human approval in the entire flow)
- **What happens:**
  - Senior HR opens the worker record, sees status: "Ready for activation"
  - HR clicks [Activate]
  - System immediately opens the access checklist in the worker record
  - Checklist shows required systems per worker type:
    - **All workers:** ☐ Google Workspace account (create in Google admin, record ID like rohan@katbotz.com), ☐ GitHub (add to KATBOTZ org)
    - **Office staff:** ☐ Slack (add to workspace)
    - **Team Leads:** ☐ Cloud resource access (if applicable)
  - HR (or IT person) creates each account manually in the actual system (Google admin, GitHub settings, Slack admin, etc.)
  - HR then ticks ☑ Done in WOP for each account created
  - Ticking is just a record — WOP does NOT create the account, it only tracks that the account was created manually elsewhere
  - Worker sees in their portal: "Your access is being set up. [2 of 3 systems ready]"
- **Important:** WOP never creates accounts. It only records that you (the IT person) created them manually.
- **Blocker:** Cannot move forward until ALL access boxes ☑ Done (all accounts created and recorded)
- **Important — Worker login timing:**
  - Before activation: Worker has no Google Workspace account, cannot log in
  - During activation (access setup in progress): Google Workspace account is being created, but WOP might not recognize it immediately (takes ~15 min for Google to propagate)
  - After ALL access ☑ Done: Worker can log in with their Google Workspace account (e.g. rohan@katbotz.com)
- **Exit condition:** All access boxes ☑ → Stage 6 starts

---

## Stage 6 · Active

- **Who acts:** Everyone — worker, team leads, HR, contractors
- **What happens:**
  - Worker is now in the system and working normally
  - Team Leads submit performance reviews on schedule (30-day, 60-day, 90-day, annual — depends on worker type)
  - HR tracks contracts, invoices, asset assignments, upcoming renewals
  - System sends reminders: "Review due for [Worker] in 3 days", "Contract expiring in 30 days"
  - Worker submits invoices (if contractor), gets paid, submits timesheets, etc.
- **Exit when:** Worker exits the company → Stage 7 begins

---

## Stage 7 · Offboarding

- **Who acts:** Senior HR (or Team Lead can request exit, but HR executes)
- **Two substages:**
  - **Prepare (first 24 hours):** Checklist appears, notifications sent, but NO revocation yet. Can cancel with [Cancel offboarding] button.
    - If disputed/wrongful termination claim: click [Cancel offboarding] → WOP sends "ignore prior emails" to worker, offboarding marked "Cancelled" (audited, not deleted)
  - **Execute (after 24 hours):** Start revoking access. Once revocation begins, harder to undo (each system must be manually restored by IT)
- **What happens:**
  - HR marks the worker for exit, last day is set (e.g. "August 31")
  - Exit checklist appears:
    - **Access revocation:** ☐ Google Workspace revoked, ☐ GitHub removed, ☐ Slack removed
    - **Asset return:** ☐ Laptop returned, ☐ Monitor returned, ☐ SIM returned
    - **Exit docs:** ☐ Exit interview completed, ☐ Relieving letter signed, ☐ Final payment confirmed
  - HR (or IT) revokes each account manually (Google admin removes user, GitHub removes from org, etc.)
  - HR ticks ☑ Revoked in WOP for each one
  - HR collects assets, ticks ☑ Returned
  - HR ticks ☑ Exit docs completed
  - **Blocker:** Exit CANNOT be closed until ALL boxes ☑. HR cannot finalize offboarding if any access is still active or any asset is missing.
- **Exit condition:** All revocation, return, and doc boxes ☑ → Stage 8 starts

---

## Stage 8 · Archive

- **Who acts:** System (automatic)
- **What happens:**
  - Worker record is locked (not deleted yet, kept for legal/audit)
  - Worker cannot log into WOP
  - Worker data is kept for the legal retention period (3 years)
  - Record is searchable only by HR and Founder, marked [Archived]
  - Documents are kept for compliance audit
- **Exit condition:** 3 years pass → Stage 9 starts

---

## Stage 9 · Deletion

- **Who acts:** System (automatic, after retention period)
- **What happens:**
  - Personal data is deleted: name, email, address, phone, bank account, financial records
  - Documents are deleted
  - Only anonymized stats remain: "had 1 employee in 2026, worked in engineering, left after 2 years"
  - Record is no longer visible in the system
- **Final:** Worker is completely removed from WOP. Record is gone.

---

## Summary of blockers and automatic gates

| Stage | Blocker | Who unblocks |
|---|---|---|
| 2 → 3 | ALL documents uploaded, ALL agreements signed | Worker (self) |
| 3 → 4 | ALL documents ☑ Verified | Senior HR (by clicking Verified) |
| 4 → 5 | ALL checks ☑ (automatic, no action) | System (automatic) |
| 5 → 6 | ALL access accounts created and ticked ☑ | Senior HR / IT (by ticking each box) |
| 6 → 7 | Worker exit initiated | Senior HR (by clicking Exit) |
| 7 → 8 | ALL access revoked, ALL assets returned, ALL exit docs done (all ☑) | Senior HR / IT (by ticking each box) |
| 8 → 9 | 3 years retention period passed | System (automatic) |

---

## Key design principles

1. **Documents are never processed:** Stored as files only. Images stay as images, PDFs stay as PDFs. No extraction, no transformation.
2. **Verification is manual:** Senior HR looks at each document and decides. No automated KYC, no API calls, no number extraction.
3. **Access creation is manual:** WOP records what was created, but does NOT create accounts. IT creates accounts, HR records it by ticking a box.
4. **Checklists are blockers:** A worker cannot move forward until every checkbox is ☑. No exceptions, no skipping.
5. **One human approval:** Only the Activate step (Stage 5) requires a deliberate human decision. Everything else either the worker does or the system checks automatically.

---

> **Retention policy:** Records are kept for 3 years after archival. This is a legal requirement under DPDP Act 2023 and needs confirmation with legal before go-live.
