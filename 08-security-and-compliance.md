# 08 · Security and Compliance

## Authentication

- **Google OAuth.** Staff already live in Google Workspace, so sign in is one click and there are no passwords to manage in WOP.
- **For Employees and Interns:** Sign in via KATBOTZ Workspace (standard full account)
- **For Contractors and Global Interns (external workers):** 
  - Option 1 (Recommended): Create lightweight Workspace accounts (SSO-only tier, ~$6–8/month per user). No Drive access, just authentication. Email format: `contractor-name@katbotz.com` or `intern-name@katbotz.com`
  - Option 2 (If no Workspace): Use external identity provider (Azure AD, Okta). WOP redirects to provider for login. Contractor never gets Google account.
  - Chosen: **Option 1** (simpler for KATBOTZ, familiar interface)
  
All workers sign in via Google OAuth (Workspace or external ID provider). A valid account is provisioned as part of the M5 access checklist before worker can log in.

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

**Cloud Storage Bucket Configuration (Complete Technical Setup):**

```
Bucket: locked-aadhaar-katbotz (us-central1)
  Encryption: Google-managed (default), upgradeable to CMEK if stricter compliance needed
  Versioning: Enabled (30-day retention of old versions)
  Access logging: Cloud Audit Logs capture all access
```

**GCP IAM Policy (Strict Access Control):**
- `roles/storage.objectViewer` → Group: senior-hr@katbotz.com (can view via WOP only)
- `roles/storage.objectAdmin` → Service account: WOP Cloud Run (generates signed URLs, no humans)
- **No developer access** (no direct bucket downloads, no keys shared)
- **No public access** (bucket is private, requests require authentication)

**Signed URL Generation (from WOP backend):**
- Duration: 30 seconds (hard-coded, cannot be changed via UI)
- Method: GET only (no PUT, DELETE, no modifications)
- IP restriction: (optional) restrict to KATBOTZ office IP
- URL never stored in logs (not logged, not cached, not shared)

**Image Viewer Security (Browser protection):**
```
- Right-click disabled (onContextMenu preventDefault)
- Drag-save disabled (onDragStart preventDefault)
- Print disabled (@media print { display: none })
- Download button hidden (no button in viewer)
- Pointer events disabled (cannot interact)
```

**Key Management:**
- Only WOP Cloud Run service account holds credentials (not human-managed)
- Keys rotated every 90 days (automatic, no human action)
- Key download forbidden by IAM policy
- Access audit logged in Cloud Audit Logs (who requested, when, IP)

**Backups (Separate Encryption):**
- Daily Firestore exports → `gs://backup-bucket-katbotz/` (CMEK encrypted, separate key)
- Aadhaar files → separate from documents bucket (locked bucket never exported, only metadata)
- Recovery: Only GCP admin can restore, requires approval from Senior HR + Founder

**Before go-live, confirm:**
- ✓ Cloud Storage bucket is locked (IAM policy specifies)
- ✓ Signed URL TTL is 30 seconds (hard-coded)
- ✓ No code in WOP extracts or reads the Aadhaar number
- ✓ Audit logs do not record the number
- ✓ Image viewer in WOP disables download/print
- ✓ GCP IAM policy enforced (senior-hr@katbotz.com only, service account only)
- ✓ Backup bucket encrypted with separate CMEK
- ✓ Tested restore from backup to staging environment

---

## Retention and deletion policy

| Event | Action |
|-------|--------|
| Worker archived | Retention clock starts |
| Retention period passes | Delete documents, personal data, banking data |
| Legal hold requested | Pause deletion until hold released |
| Always | Keep anonymized analytics only |

**3-year retention period assumed. Confirm with DPDP-aware legal advisor before go-live.**

### Deletion Mechanism (Automated)

**Monthly batch job (runs on the 1st of each month):**

1. Query Firestore: `workers where (status = 'Archive' AND archived_at < 3 years ago AND legal_hold_until = null)`
2. For each worker:
   - Export to audit-log-archive bucket (full history, for legal evidence)
   - Delete from Firestore: worker record, documents, verifications, reviews, contracts, assets, access logs
   - Delete from Cloud Storage: personal documents bucket, locked Aadhaar bucket
   - Keep: audit log (DPDP requirement), encrypted backups, anonymized analytics
3. Audit log entry: "Worker data deleted [worker_id] on [date]"

**Verification of deletion:**
- Firestore document count decreases
- Cloud Storage files gone (confirmed via audit logs)
- Audit trail shows deletion timestamp + who triggered it

### Legal Hold Process

**When legal requests data retention:**

1. Legal sends: "Hold data for Rohan Mehta (worker ID: WOP-2026-0041) until [date]"
2. You update Firestore: `workers/{workerId}.legal_hold_until = date("2027-09-01")`
3. Monthly deletion job checks: `if (legal_hold_until > today) { SKIP deletion }`
4. Audit log: "Legal hold applied by [you]" and later "Legal hold released by [legal]"
5. After hold period: deletion proceeds normally

**Chain of custody for audit:**
- Worker data was NOT deleted (legal hold applied)
- Full audit trail of who held it and when
- Backups are encrypted and controlled
- Proves DPDP compliance

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

## Incident & Breach Response

Before go-live, establish:

1. **Incident commander:** Named person who is notified immediately if a security incident occurs (data breach, unauthorized access, system compromise)
2. **Response steps:**
   - Disable affected user accounts immediately (if credential compromise)
   - Restore from backup if data corruption or loss
   - Audit log will show exactly what happened and when
   - Notify affected workers within 24 hours (for DPDP compliance)
   - Report to Data Protection Board within 72 hours (required by law)
3. **Tested recovery:** Restore from backup bucket before go-live to verify restore procedure works
4. **Legal escalation:** Breach of Aadhaar data especially critical — requires legal notification within 48 hours

## Recommended before go live

- A security review or penetration test before launch.
- A short compliance advisory to confirm the Aadhaar and DPDP approach with a lawyer.
- Documented incident and breach response plan (see above — incident commander, response steps, notification procedures)
- A data breach response contact assigned and communicated to KATBOTZ leadership
