# SECURITY & COMPLIANCE

---

## Login Security

**Google OAuth only**
- No passwords stored in WOP
- Google handles all passwords
- Only katbotz.com emails allowed
- Automatic logout after 1 hour of inactivity

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

## Document Retention

**Normal workers (employed):**
- Documents kept for duration of employment
- Can be deleted by HR anytime (with permission)

**Exited workers:**
- Documents locked for 3 years (can't modify or delete)
- After 3 years: Auto-deleted by system
- Why: Legal requirement

**Audit trail:**
- Never deleted (kept forever for legal proof)

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
