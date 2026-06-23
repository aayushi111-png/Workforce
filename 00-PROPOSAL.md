# PROPOSAL — Workforce Portal (Simple Version)

| | |
|---|---|
| **Project** | Workforce Portal (WOP) |
| **From** | Aayushi Pandey (Intern) |
| **To** | KATBOTZ |
| **Date** | June 2026 |
| **Timeline** | 3 weeks (July 1 – Aug 20, 2026) |
| **Budget** | ₹1,500–2,500 |
| **Live Date** | Sept 1, 2026 |

---

## What Is WOP?

A simple website where:
- **Workers** log in with their company email
- **Upload documents** (PAN, Aadhaar, certificates, bank details)
- **Track their projects** (what they're working on)
- **Set and track goals** (what to achieve)
- **Write weekly summaries** (what happened each week)
- **Get performance reviews** (feedback from team lead)
- **See everything in one place** instead of scattered emails/Drive/Sheets

HR verifies documents and checks ✓ Done. That's it.

---

## Why Build It?

**Current problem:**
- Worker onboarding is in Google Sheets (messy)
- Documents scattered in Drive (hard to find)
- No clear goals or project tracking
- Reviews are manual emails (no history)
- No single place to see worker status

**Solution:**
- One portal. Everything organized.
- HR sees all workers instantly.
- Workers know what's done, what's pending.
- Goals and reviews tracked automatically.
- 3 years of history kept for compliance, then deleted.

---

## What Gets Built

### Documents (Worker uploads, HR verifies)
- ☐ PAN card
- ☐ Aadhaar image
- ☐ Degree certificate
- ☐ 10th/12th marksheets
- ☐ Bank proof
- ☐ Agreements

### Projects & Goals (Team Lead assigns, Worker updates)
- Project name + description
- Goals (with deadlines)
- Track goals achieved
- Weekly summary (what happened)

### Reviews (Team Lead fills, Worker sees)
- 30-day review
- 60-day review
- 90-day review
- Annual review

### Operations
- Performance tracker (rating + feedback)
- Contract renewal dates (manual entry)
- Personal to-do list (per worker)
- Offboarding (3-year retention, then delete)

---

## Technology

**Frontend:** Next.js (React)  
**Backend:** FastAPI (Python)  
**Database:** Firestore  
**Documents:** Google Drive  
**Login:** Google OAuth (KATBOTZ email)  
**Hosting:** Cloud Run (Google Cloud)

**Cost:** ~₹3–5/month after launch

---

## Timeline

| Week | What | By When |
|------|------|---------|
| 1 | Login + worker list + database | July 5 |
| 2 | Documents + projects + goals | July 11 |
| 3 | Weekly summary + reviews + offboarding | July 20 |
| 4 | Test + bug fixes + handover | Aug 20 |
| — | **Live use begins** | **Sept 1** |

---

## Budget

| Item | Cost |
|---|---|
| Claude subscription (3 weeks) | ₹1,200 |
| Google Cloud | ₹300 |
| **Build Total** | **₹1,500** |

**Monthly after launch:** ~₹3–5 (free)

---

## Approval

- ✓ Scope locked (no emails, no complex automation)
- ✓ Timeline realistic (3 weeks, Aug 20 handover)
- ✓ Budget fixed (₹1,500 total)
- ✓ All features listed above
- ✓ Ready to start July 1

**Sign below to approve:**

KATBOTZ: ________________  Date: ________

Aayushi: ________________  Date: June 24, 2026

---

## Next Steps

1. Approval (this document)
2. Start July 1
3. Handover Aug 22 to KATBOTZ tech person
4. Go live Sept 1
