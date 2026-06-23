# 08 · Security and Compliance

## Authentication

- **Google OAuth.** Staff already live in Google Workspace, so sign in is one click and there are no passwords to manage in WOP.
- Everyone signs in via Google OAuth, restricted to the KATBOTZ Workspace domain. A Google Workspace account is provisioned as part of the M5 access checklist before a worker can log in.

## Authorization

- **Role based access control (RBAC).** Permissions are tied to role, not to individuals. The full matrix is in [Roles and Experiences](03-user-roles-and-experiences.md).
- Every backend endpoint checks the role before returning data. A Team Lead asking for another team's worker gets nothing.

## Encryption

- **At rest:** all files in Cloud Storage and all records in Firestore are encrypted at rest by default.
- **In transit:** every request is over HTTPS.
- Files are never served from a public link. Access is through short lived signed URLs only.

## Audit logging

- **Every action is recorded:** user, activity, timestamp, status.
- The audit log is **append only**. It cannot be edited or overwritten, which is what makes it trustworthy in a dispute or audit.
- The log can reconstruct the full history of any worker.

---

## Data protection (DPDP Act 2023)

KATBOTZ handles sensitive identity and financial data for Indian workers, so the **Digital Personal Data Protection Act, 2023** applies.

- Collect only what is needed, for a stated purpose.
- Keep it only as long as needed, then delete it (the retention and deletion stage).
- Control who can reach it (RBAC), and prove who reached it (audit log).

### Aadhaar handling (manual verification, image only, never the number)

WOP uses **pure manual verification** — no KYC API, no number extraction, no data processing.

**What happens:**

1. Worker uploads Aadhaar image (JPG or PDF of front and back, or photo) to their portal
2. Image is stored as-is in a **locked, private Cloud Storage bucket** (no one can read it except via WOP)
3. Firestore record stores ONLY: { document_type: "Aadhaar", file_path: "gs://locked-bucket/...", status: "Pending", uploaded_date: "..." }
4. Senior HR views the image through a short-lived signed URL (expires in 30 seconds) — cannot be copied, printed, or shared
5. HR checks the image visually (is it real? is it clear? matching worker?) and marks:
   - ☑ Verified → Firestore updates: { status: "Verified" }
   - ✗ Rejected → Firestore updates: { status: "Rejected", reason: "blurry" }
6. **The Aadhaar number is never typed, extracted, read by code, or stored anywhere.** Not in Firestore, not in any log, not in any export.

**What is NOT stored:**
- ✗ Aadhaar number (12-digit)
- ✗ Any extracted data from the image
- ✗ Hash of the number
- ✗ Verification API result
- ✗ KYC status

**What IS stored:**
- ✓ Image file path
- ✓ Verification status (Pending / Verified / Rejected)
- ✓ Who verified it
- ✓ When it was verified

**Why:** Aadhaar is sensitive identity data. UIDAI (issuing authority) does not allow number storage without licensed KYC API. DPDP Act 2023 requires data minimisation — store only what you need. Visual verification is sufficient; the number is not needed.

**Before go-live, confirm:**
- Cloud Storage bucket is locked (not public)
- Signed URL TTL is 30 seconds (cannot be shared or reused)
- No code extracts or reads the Aadhaar number
- Audit logs do not record the number

---

## Retention and deletion policy

| Event | Action |
|-------|--------|
| Worker archived | Retention clock starts |
| Retention period passes | Delete documents, personal data, banking data |
| Always | Keep anonymized analytics only |

> **Pending legal confirmation:** 3 years after archival. Confirm with a DPDP-aware legal advisor before go-live.

---

## Access boundaries, restated

The single most important security property is that **a person can only ever reach the data their role allows.**

- Founder and Senior HR: all workers.
- HR Executive: all workers, but cannot activate.
- Team Lead: their team only.
- Worker, contractor, intern: themselves only.

If this boundary holds, most privacy risk is contained by design.

---

## Backups

- **Firestore:** scheduled daily exports to a dedicated Cloud Storage backup bucket, using Firestore's managed export API. Retention: 30 days of daily snapshots.
- **Cloud Storage (documents):** GCS Object Versioning enabled on the documents bucket. Previous versions of any file are retained for 30 days before deletion.
- **Tested restore:** before go-live, a restore from backup to a staging environment is run and confirmed. "Daily backups" without a tested restore is not a backup strategy.

---

## Recommended before go live

- A security review or penetration test before launch.
- A short compliance advisory to confirm the Aadhaar and DPDP approach with a lawyer.
- Documented incident and breach response: under the DPDP Act, a breach must be reported to the Data Protection Board promptly. Assign a named contact before launch.
