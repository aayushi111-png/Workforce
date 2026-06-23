# TECHNOLOGY STACK

---

## Frontend (What You See)

**Framework:** Next.js (React)  
**Language:** JavaScript  
**Pages:** Login, Worker Dashboard, HR Dashboard, Worker Profile  
**Hosting:** Cloud Run (Google)

---

## Backend (The Logic)

**Framework:** FastAPI (Python)  
**Language:** Python  
**APIs:** Handles all requests (login, documents, goals, reviews, etc.)  
**Hosting:** Cloud Run (Google)

---

## Database (Where Data Lives)

**Firestore** (Google's NoSQL database)  
Stores:
- Worker profiles
- Projects + Goals
- Weekly summaries
- Performance + Reviews
- Document statuses
- To-do lists
- Audit logs

---

## Document Storage

**Google Drive**  
Stores:
- PAN cards
- Aadhaar images
- Certificates
- Bank proofs
- Agreements

WOP just stores links to Drive files.

---

## Authentication

**Google OAuth**  
- Click "Sign in with Google"
- Google handles password
- No passwords in WOP
- Only katbotz.com emails allowed

---

## Backup

**Cloud Storage**  
Daily backup of Firestore → gs://katbotz-backups/  
Keep 30 days of backups

---

## Monitoring

**Cloud Logging**  
Logs everything (for audit trail + debugging)

---

## Cost

| Service | Monthly |
|---------|---------|
| Cloud Run | ₹1–2 |
| Firestore | ₹2–3 |
| Cloud Storage | ₹0.50 |
| Google Drive | Free |
| Google Workspace | Free |
| **Total** | **~₹3–5** |

Basically free.

---

## Architecture (Simple)

```
Worker Browser
      ↓
Next.js Frontend (workforce.katbotz.com)
      ↓
FastAPI Backend (Cloud Run)
      ↓
┌─────────────────────────────┐
│                             │
├─ Firestore (database)      │
├─ Google Drive (documents)   │
├─ Cloud Storage (backups)    │
└─────────────────────────────┘
```

No complex integrations. Just simple APIs.

---

## Deployment

1. Push code to GitHub
2. Cloud Build sees change
3. Auto-builds Docker image
4. Deploys to Cloud Run
5. Website updates live

No downtime. Automatic.

---

## That's It

Simple tech. Nothing fancy. Just works.
