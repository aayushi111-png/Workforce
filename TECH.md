# Tech Stack (Simple)

---

## Frontend
**Next.js** (React framework)

**Pages:**
- `/` → Login page
- `/dashboard` → Worker dashboard (my checklist, performance, to-do)
- `/workers` → HR dashboard (all workers list)
- `/workers/[id]` → Worker profile (HR view)

**Features:**
- Google OAuth button (login)
- Forms (for performance, to-do)
- Tables (worker list, documents, contracts)
- Links (to Google Drive)

**Deployed to:** Vercel (free tier) or Cloud Run

---

## Backend
**FastAPI** (Python)

**Endpoints:**
```
POST /auth/login → Google OAuth verification
GET /api/workers → List all workers (HR only)
POST /api/workers → Create worker (HR only)
GET /api/workers/{id} → Get worker profile
PUT /api/workers/{id}/checklist/{doc_type} → Mark document verified
PUT /api/workers/{id}/performance → Submit performance form
PUT /api/workers/{id}/todo → Add/update to-do
PUT /api/workers/{id}/contract → Set renewal date
PUT /api/workers/{id}/offboarding → Mark for exit
GET /api/notifications → Get worker's notifications
```

**Deployed to:** Google Cloud Run (scales automatically)

---

## Database
**Firestore** (NoSQL, Google Cloud)

**Collections:**
```
workers/{worker_id}
  ├── name, email, type, department, team_lead
  ├── checklist (pan, aadhaar, degree, etc.)
  ├── performance (rating, feedback, date)
  ├── contract (renewal_date)
  ├── to_do (list of tasks)
  ├── offboarding (status, last_day, delete_after)
  └── documents_folder_link
```

**Cost:** ~$5–10/month for 500 workers

---

## Document Storage
**Google Drive**

**How it works:**
1. HR creates folder per worker: `/KATBOTZ Workforce/2026/Rohan Mehta/`
2. Worker uploads files to Drive
3. WOP stores link: `https://drive.google.com/drive/folders/1abc...`
4. HR reviews files in Drive, checks ☑ in WOP

**No code processing.** Just links + checkboxes.

---

## Authentication
**Google OAuth 2.0** (via KATBOTZ Workspace)

**How it works:**
1. Worker clicks "Sign in with Google"
2. Google login page
3. Google checks: is this a katbotz.com email?
4. Yes → Logged in
5. No → Access denied

**No passwords.** No passwords to manage.

---

## Backup
**Google Cloud Storage**

**Daily export:**
- Firestore → JSON file
- Stored in `gs://katbotz-backups/`
- Kept for 30 days
- Old ones auto-deleted

**How to restore:**
1. GCP console → Firestore
2. Click "Restore"
3. Choose date
4. Done (takes 5 min)

---

## Deployment
**Cloud Run** (Google Cloud)

**How it works:**
1. Push code to GitHub
2. GitHub → Cloud Build (automatic)
3. Build creates Docker image
4. Image deployed to Cloud Run
5. Live at workforce.katbotz.com

**No servers to manage.** Auto-scales. Costs ~$2–5/month.

---

## Database Auto-Delete Job
**Cloud Scheduler** (Google Cloud)

**Runs:** 1st of each month

**Does:**
```
For each worker where (last_day < 3 years ago AND status = "exited"):
  DELETE worker record from Firestore
  DELETE documents from Drive
  LOG: "Deleted [name] on [date]"
```

**Cost:** Free (part of Google Cloud)

---

## Monitoring
**Cloud Logging** (Google Cloud)

**Logs:**
- Every login
- Every document verified
- Every error
- Every auto-delete

**How to check:**
- GCP console → Cloud Run → Logs

**Cost:** Free (included)

---

## Total Monthly Cost (After Launch)

| Service | Cost |
|---|---|
| Cloud Run | $1–2 |
| Firestore | $2–3 |
| Cloud Storage (backups) | $0.50 |
| Cloud Scheduler (auto-delete) | Free |
| Google Drive | Free (KATBOTZ already has) |
| Domain (workforce.katbotz.com) | Free (KATBOTZ already has) |
| **Total** | **~$3–5/month** |

Basically free.

---

## Build Process (Week by Week)

**Week 1:** Frontend + Backend skeletons, deploy to Cloud Run, OAuth works

**Week 2:** Worker CRUD, document checklist, performance form

**Week 3:** Contract dates, offboarding, auto-delete job, notifications

**Week 4:** Testing, bug fixes, handover

---

## Code Structure

```
workforce/
├── frontend/
│   ├── pages/
│   │   ├── index.js (login)
│   │   ├── dashboard.js (worker home)
│   │   ├── workers.js (HR list)
│   │   └── workers/[id].js (worker profile)
│   ├── components/
│   │   ├── LoginButton.jsx
│   │   ├── DocumentChecklist.jsx
│   │   ├── PerformanceForm.jsx
│   │   └── WorkerTable.jsx
│   └── lib/
│       ├── auth.js (Google OAuth)
│       └── api.js (fetch calls)
│
├── backend/
│   ├── main.py (FastAPI app)
│   ├── models.py (data models)
│   ├── routes/
│   │   ├── auth.py
│   │   ├── workers.py
│   │   ├── documents.py
│   │   └── notifications.py
│   └── db.py (Firestore connection)
│
├── scripts/
│   └── auto_delete_job.py (monthly cleanup)
│
├── .env (secrets: GCP credentials, OAuth client ID)
├── Dockerfile (for Cloud Run)
├── docker-compose.yml (for local testing)
└── README.md
```

---

## Local Development

```bash
# Clone
git clone https://github.com/aayushi111-png/Workforce.git
cd Workforce

# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
python main.py  # http://localhost:8000

# Test
npm test
pytest  # backend tests
```

---

## Deployment

```bash
# Push to GitHub
git push origin main

# Cloud Run deploys automatically (via Cloud Build)
# Check status: gcloud builds list

# Or manual deploy:
gcloud run deploy workforce \
  --source . \
  --platform managed \
  --region us-central1
```

---

That's it. Simple tech stack. Nothing fancy. Just works.
