# Handover Document (Aug 18–22)

By Aug 22, you must hand over everything to KATBOTZ tech person so they can maintain the system after you leave.

---

## What To Hand Over

### 1. GitHub Repository
```
git clone https://github.com/aayushi111-png/Workforce.git
```
- Give KATBOTZ admin access to the repo
- All code is here
- Deployment instructions in `DEPLOY.md`

### 2. Google Cloud (GCP) Access
- **Firestore:** Database with all worker data
- **Cloud Run:** Where the app is hosted
- **Google Drive:** Where documents are stored
- **OAuth credentials:** For login to work

**KATBOTZ needs:**
- GCP project owner role (one person)
- Google Cloud credentials file (download from GCP console)
- Backup: Export credentials to secure location

### 3. Google Drive Folder Structure
```
KATBOTZ Workforce
├── 2026 (year)
│   ├── Rohan Mehta (worker folder)
│   ├── Sara Lim
│   ├── Amit (contractor)
│   └── ...
└── Archive (old workers)
```

**HR needs to:**
- Create one folder per worker at start
- Share with worker (so they can upload)
- Share with HR (so HR can review)

### 4. Firestore Backup
- **Daily backup:** Set up automated daily exports to Cloud Storage
- **Location:** `gs://katbotz-backups/`
- **Retention:** Keep 30 days of backups
- **Restore test:** Test restoring from backup (before handover)

### 5. Runbook (How To…)

#### System is down (restart)
```
1. Go to GCP console
2. Cloud Run → Workforce
3. Click [Deploy] button → redeploy latest version
4. Wait 2 minutes
5. Test: Go to workforce.katbotz.com, try to log in
```

#### Database corrupted (restore from backup)
```
1. Go to GCP console
2. Firestore → Restore
3. Choose backup from [date]
4. Click Restore
5. Done (all worker data back to [date])
```

#### Lost Google Drive folder
```
1. Go to Drive
2. Search for worker folder by name
3. If found: restore it (might be in trash)
4. If lost: recreate folder manually (links in Firestore might be broken)
```

#### Worker password forgotten
```
KATBOTZ doesn't store passwords.
Worker clicks "Sign in with Google" → Google handles password reset.
Nothing to do.
```

#### Need to delete a worker (before 3-year timer)
```
1. Go to worker profile in WOP
2. Click [Mark for Exit]
3. System sets delete date to 3 years from now
4. On that date: auto-deleted
5. To delete earlier: manually delete from Drive + Firestore
```

---

## What You've Built (Checklist)

By Aug 20, verify:

- ✓ Workers can log in with katbotz email
- ✓ HR can see list of all workers
- ✓ HR can create new worker
- ✓ Workers can upload documents
- ✓ HR can verify documents (check ☑)
- ✓ Performance tracker works (form submission)
- ✓ Contract renewal dates visible
- ✓ Personal to-do list works (add/check/delete tasks)
- ✓ Offboarding process works (mark for exit, auto-delete after 3 years)
- ✓ Notifications show in portal
- ✓ Priya (HR) tested end-to-end
- ✓ Code is clean + documented
- ✓ Firestore backups configured
- ✓ All credentials stored securely

---

## Testing Checklist (Aug 18–20)

Have **Priya** do this:

**Day 1: Login + Create Worker**
- [ ] Log in as priya@katbotz.com
- [ ] See dashboard (empty, no workers yet)
- [ ] Click "Create Worker"
- [ ] Fill: Rohan, Indian Employee, Engineering, Akshat (team lead)
- [ ] System auto-generates checklist (PAN, Aadhaar, Degree, 10th, 12th, Bank)
- [ ] Check: Rohan can log in

**Day 2: Documents**
- [ ] Rohan uploads fake PAN to Drive
- [ ] Status shows "⏳ Pending"
- [ ] Priya opens worker profile
- [ ] Clicks ☑ "Mark PAN verified"
- [ ] Rohan sees "✓ Verified by Priya, June 23"
- [ ] Repeat for all document types

**Day 3: Performance + Contract + To-Do**
- [ ] Rohan fills performance form (rating 4/5, feedback)
- [ ] Priya sees it on his profile
- [ ] Priya sets contract renewal date (Aug 15)
- [ ] Rohan adds to-do: "Finish report"
- [ ] Rohan checks off to-do ✓
- [ ] Priya can see to-do list (read-only)

**Day 4: Offboarding**
- [ ] Create test worker "Exit Test"
- [ ] Upload 1 document
- [ ] Priya marks for exit (last day: June 30)
- [ ] System records: delete on June 30, 2029
- [ ] Verify: 3 years later, can request manual delete

**Day 5: Final Check**
- [ ] No errors in logs
- [ ] All features working
- [ ] Priya confident in using it
- [ ] You've written this runbook
- [ ] GitHub repo is clean + documented

If everything ✓: Ready for launch Sept 1.

---

## What KATBOTZ Tech Person Needs To Know

**Day 1 (Aug 22 afternoon):**
- [ ] You show them the code (10 min)
- [ ] You show them the database (10 min)
- [ ] You show them how to deploy (10 min)
- [ ] You show them the runbook (10 min)
- [ ] You show them GCP console (10 min)
- [ ] They ask questions (30 min)
- [ ] They take over GitHub + GCP access

**Maintenance post-launch:**
- Check logs daily (5 min)
- Restart if service down (2 min)
- Backup is automatic (0 min)
- That's it. System is simple.

**If bugs:**
- Bug in login? → Check Google OAuth config
- Bug in document upload? → Check Drive folder permissions
- Bug in verification? → Check Firestore data
- Bug in performance form? → Check form validation

---

## Final Checklist (Aug 22)

Before you leave:

- [ ] Code pushed to GitHub
- [ ] GCP access given to KATBOTZ
- [ ] Google Drive folder structure created
- [ ] Firestore backups configured
- [ ] Credentials stored securely (password manager)
- [ ] Runbook written + shared
- [ ] Testing checklist completed (Priya signed off)
- [ ] Tech person trained
- [ ] Tech person can restart service (tested)
- [ ] Tech person can restore from backup (tested)
- [ ] All docs pushed to GitHub
- [ ] Final deployment done
- [ ] System is live on workforce.katbotz.com

**Then: You're done. Leave on Aug 22.**

---

## Emergency Contacts

**If system goes down in Sept:**
- Call/email KATBOTZ tech person first (they own it now)
- If they can't fix: You can be called as consultant (not intern anymore)
- Charge them: ₹2,000–5,000 per issue + hourly for fixes

**Payment after Aug 22:**
- Not your responsibility
- KATBOTZ owns the system
- You're in school, not on payroll

---

Done. Simple handover. Aug 22 you're out.
