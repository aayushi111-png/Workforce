# 08 · Security and Compliance

## Authentication

- **Google OAuth.** Staff already live in Google Workspace, so sign in is one click and there are no passwords to manage in WOP.
- Workers, contractors and interns reach their own portal by secure link or Google sign in, scoped to their own record.

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

### Aadhaar handling (manual verification, no number storage)

WOP uses **manual verification** (Module 3, Decision #14). There is no automated KYC API, so there is no "verification result" to store. The approach is:

- The Aadhaar document image (front/back scan or photo) is uploaded by the worker and stored in the **locked, private Cloud Storage bucket** — accessible only to Senior HR via a short-lived signed URL.
- The Aadhaar number is **never extracted, typed into any form field, or stored in any database record** — not in Firestore, not in the audit log, not in any export.
- The storage table entry labelled "Aadhaar reference" refers to the image file path only — not the number.
- Senior HR views the document through the signed URL, checks it visually, and marks the verification status (Approved / Rejected). Only that status is written to Firestore.

This satisfies UIDAI restrictions (no number stored) and DPDP data minimisation. Confirm the bucket permission policy and signed URL TTL in week 1, before M2 is built.

---

## Retention and deletion policy

| Event | Action |
|-------|--------|
| Worker archived | Retention clock starts |
| Retention period passes | Delete documents, personal data, banking data |
| Always | Keep anonymized analytics only |

> **EDIT ME:** retention period assumed at **3 years** after archival. Confirm with legal.

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
