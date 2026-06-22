# 08 · Security and Compliance

## Authentication

- **Google OAuth.** Staff already live in Google Workspace, so sign in is one click and there are no passwords to manage in WOP.
- Workers, contractors and interns reach their own portal by secure link or Google sign in, scoped to their own record.

## Authorization

- **Role based access control (RBAC).** Permissions are tied to role, not to individuals. The full matrix is in [Roles and Experiences](03-user-roles-and-experiences.md).
- Every backend endpoint checks the role before returning data. A Manager asking for another team's worker gets nothing.

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

### Aadhaar caution

> **DECISION NEEDED:** Aadhaar handling. Under UIDAI rules, storing raw Aadhaar numbers carries legal restrictions. Wherever possible, **store the verification result, not the raw Aadhaar number.** Settle the exact approach in Phase 0, before the document checklists are built, because it changes what the system is allowed to keep.

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
- Manager: their team only.
- Worker, contractor, intern: themselves only.

If this boundary holds, most privacy risk is contained by design.

---

## Recommended before go live

> **EDIT ME:** not in the source notes, recommended as a technical head.

- A security review or penetration test before launch.
- A short compliance advisory to lock the Aadhaar and DPDP approach.
- Documented incident and breach response, since the DPDP Act expects timely notification.
