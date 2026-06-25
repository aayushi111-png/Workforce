# SECURITY & COMPLIANCE

---

## Login Security

**Google OAuth only**
- No passwords stored in WOP (Google handles all authentication)
- Only @katbotz.com emails allowed (blocks external emails)
- Automatic logout after 1 hour of inactivity
- 2FA inherited from Google Account (if enabled)
- Tokens expire automatically (can't be used indefinitely)
- Industry-standard authentication (trusted by 1000+ enterprises)

---

## Data Security

**Encryption at rest:**
- Firestore: Encrypted by Google (default)
- Drive: Encrypted by Google (default)
- Backups: Encrypted

**Encryption in transit:**
- All communication over HTTPS (not HTTP)
- Browsers enforce SSL/TLS

---

## Access Control

**Who sees what:**
- Worker: Only their own profile
- Team Lead: Only their team members + can edit their goals + fill reviews
- HR: All workers, all data
- Founder: All data (read-only)

System enforces this. No exceptions.

---

## Audit Trail

**Everything is logged:**
- Who logged in, when
- Who verified documents, when
- Who edited goals, when
- Who filled reviews, when
- All deletions, when

HR can view audit log anytime.

---

## Document Storage

**Google Drive (not WOP):**
- All documents stay in Drive
- WOP only stores links
- No processing, no extraction
- HR downloads and reviews manually

**Drive access:**
- Worker folder shared with: Worker + HR
- Contractor folder shared with: Contractor + HR
- No one else has access

---

## Backup & Recovery

**Daily automatic backup:**
- Firestore exported daily to Cloud Storage
- 30 days of backups kept
- Auto-delete old backups

**How to restore (if needed):**
1. Contact GCP admin
2. GCP restores from backup
3. Takes ~5-10 minutes
4. All data back to [backup date]

---

## Data Retention (3 Years After Exit)

**All worker data saved for 3 years:**
- ✓ Documents: PAN, Aadhaar, Degree, Marksheets, Bank proof, Contracts
- ✓ Projects: All projects assigned to worker
- ✓ Goals: All goals set and tracked
- ✓ Reviews: All 30/60/90-day and annual reviews
- ✓ Performance ratings and feedback
- ✓ Weekly summaries and progress updates
- ✓ Invoices (contractors only)
- ✓ Contract details and amendments (contractors only)
- ✓ Complete audit trail of all actions
- ✓ Locked from modification (can't change or delete)

**Timeline:**
```
Day 0: Worker exits (HR marks exit date)
Days 1-1095 (3 years): All data kept, locked, accessible to HR
Day 1096: System auto-deletes all worker data
Forever: Audit trail remains (proves deletion occurred)
```

**Why 3 years?**
- Legal requirement: Labor law mandates 3-year record retention
- Dispute resolution: If employee sues later, all evidence exists
- Compliance: DPDP Act 2023 requires retention for accountability
- Audit proof: System logs prove deletion occurred and when

**After 3 years:**
- Auto-deletion: System automatically deletes all data
- No manual action needed: Happens at 1 AM on anniversary
- Proof logged: Audit trail shows "Worker data deleted [date]"
- Irreversible: Deleted data cannot be recovered

---

## DPDP Compliance (India Privacy Law)

**What we collect:**
- Name, email, type (employee/contractor/intern)
- Documents (PAN, Aadhaar, certificates)
- Performance ratings, reviews
- Project goals, weekly summaries

**Why we collect:**
- Onboarding and employment verification
- Performance tracking
- Legal compliance

**How long we keep it:**
- Active workers: Entire employment + 3 years after exit
- Then: Deleted (except audit trail)

**Who can access:**
- Worker: Only their own data
- HR: All worker data
- No one else

**Right to deletion:**
- Worker can ask: "Delete my data"
- HR can comply (except audit trail which is kept for 3 years)

---

## No Third Parties

WOP only uses Google services (not external APIs):
- Google Firestore
- Google Cloud Storage
- Google OAuth
- Google Cloud Run

No data shared with anyone. No external integrations.

---

## Before Going Live

- ✓ HTTPS enabled (secure communication)
- ✓ OAuth configured correctly (only katbotz.com)
- ✓ Firestore backups tested (restore works)
- ✓ Audit logging enabled
- ✓ Access control tested (worker can't see other workers)

---

## That's All

Simple security. No complex vaults or locks. Just: encrypt, log, keep private.
