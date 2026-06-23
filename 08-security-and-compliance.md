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

**What is a "locked bucket"?**

A locked bucket is a Google Cloud Storage bucket with strict permissions:
- Only Senior HR can access it (via WOP)
- No public access (cannot share a link with anyone outside WOP)
- Documents are viewed through temporary signed URLs (30 seconds) that cannot be copied, printed, or downloaded
- If someone tries to access the bucket directly (outside WOP), they get "Access Denied"
- No code in WOP can extract or read the Aadhaar number from the image

**What happens:**

1. Worker uploads Aadhaar image (JPG or PDF of front and back, or photo) to their portal
2. Image file is stored in the locked bucket as-is (no processing)
   - Example path: `gs://locked-aadhaar-bucket/worker-2026-0041/aadhaar.jpg`
3. Firestore record stores ONLY the reference: 
   ```
   {
     document_type: "Aadhaar",
     file_path: "gs://locked-aadhaar-bucket/worker-2026-0041/aadhaar.jpg",
     status: "Pending",
     uploaded_date: "2026-07-15"
   }
   ```
4. Senior HR opens WOP, clicks on worker's Aadhaar document
5. WOP generates a temporary signed URL (valid for 30 seconds only)
6. Image opens in a viewer inside WOP (cannot be copied, downloaded, or shared outside)
7. HR looks at the image visually and decides:
   - ☑ Verified → Firestore updates: `{ status: "Verified", verified_by: "Priya", verified_date: "2026-07-16" }`
   - ✗ Rejected → Firestore updates: `{ status: "Rejected", rejected_reason: "blurry", rejected_by: "Priya" }`
8. Worker gets email: "Your Aadhaar was rejected: blurry. Please re-upload."

**What is NEVER stored:**
- ✗ Aadhaar number (12-digit) — not in Firestore, not in memory, not in logs
- ✗ Any extracted data from the image
- ✗ Hash of the number
- ✗ Verification API result
- ✗ KYC status
- ✗ Image download link (signed URL expires in 30 seconds)

**What IS stored:**
- ✓ Image file path in locked bucket
- ✓ Verification status (Pending / Verified / Rejected)
- ✓ Who verified it (Priya)
- ✓ When it was verified (date)
- ✓ Rejection reason if rejected (e.g. "blurry")

**Why:** Aadhaar is sensitive identity data under UIDAI and DPDP Act 2023. UIDAI does not allow number storage. DPDP requires data minimisation. Visual verification is sufficient; the number is not needed for anything.

**Before go-live, confirm:**
- Cloud Storage bucket is locked (only Senior HR via WOP can access)
- Signed URL TTL is 30 seconds (cannot be reused or shared)
- No code in WOP extracts or reads the Aadhaar number
- Audit logs do not record the number
- Image viewer in WOP disables download/print

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
