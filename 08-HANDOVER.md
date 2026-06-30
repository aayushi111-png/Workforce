# HANDOVER CHECKLIST — Aug 28 – Sept 3

By Sept 3, hand everything over to KATBOTZ tech person so they can maintain it after you leave.

---

## Phase 1: Final Testing (Aug 18–27)

**Priya does full test with you watching:**

- [ ] Log in works (katbotz email)
- [ ] Create test worker (name, email, type)
- [ ] Upload document (PAN to Drive)
- [ ] HR verifies document (☑ Mark Done)
- [ ] Worker sees ✓ Verified
- [ ] Assign project (Project name + Lead)
- [ ] Set goals (3 goals with deadlines)
- [ ] Mark goal achieved (✓)
- [ ] Write weekly summary (what happened)
- [ ] Fill performance form (rating + feedback)
- [ ] Schedule review (30-day shows up)
- [ ] Mark worker for exit (test offboarding)
- [ ] Personal to-do list works (add + check off)
- [ ] Notifications appear
- [ ] Everything works end-to-end

**If bugs found:** Fix them immediately. No bugs → ready.

---

## Phase 2: Documentation (Aug 28–29)

### Create these files:

**RUNBOOK.md** — How to fix common issues
```
If system is down:
1. GCP console → Cloud Run
2. Redeploy latest version
3. Wait 2 minutes
4. Test: Go to site, try login

If database is corrupted:
1. GCP console → Firestore
2. Click "Restore"
3. Choose date
4. Done

If worker folder lost in Drive:
1. Search Drive by worker name
2. Restore from trash if found
3. If lost, recreate manually

==== WEBHOOK TROUBLESHOOTING ====

If Zoho is not creating workers in WOP:

1. Check WOP backend is online:
   - GCP Console → Cloud Run
   - Status should be green (running)
   - If red: Redeploy

2. Check webhook URL is correct:
   - Zoho Recruit → Settings → Webhooks
   - Should be: https://wop-backend.katbotz.com/api/zoho/worker-created
   - If wrong: Update it

3. Check webhook logs in Zoho:
   - Zoho Recruit → Settings → Webhooks
   - Click on "WOP Worker Creation"
   - See recent deliveries
   - If "Failed": Shows error message
   - Fix error, test again

4. Check WOP logs (Google Cloud Logging):
   - GCP Console → Cloud Logging
   - Filter: resource.type="cloud_run_revision"
   - Look for errors when testing
   - Common errors:
     * "Invalid email domain" = Email not @katbotz.com
     * "Missing required fields" = Zoho didn't send name/email
     * "Connection refused" = WOP backend offline

5. Test webhook manually:
   curl -X POST https://wop-backend.katbotz.com/api/zoho/worker-created \
     -H "Content-Type: application/json" \
     -d '{
       "zoho_candidate_id": "test-123",
       "candidate_name": "Test Worker",
       "email": "test@katbotz.com",
       "position": "Engineer",
       "department": "Engineering",
       "joining_date": "2026-07-01",
       "employment_type": "Employee"
     }'
   
   If success: {"status": "success", "worker_id": "worker-123"}
   If error: Shows what's wrong

6. If still not working:
   - Check FastAPI code in GitHub
   - Check @app.post("/api/zoho/worker-created") endpoint
   - Verify validation logic
   - Check Firestore write permissions
   - Check Drive API permissions
```

**CREDENTIALS.md** — Where everything is
```
GitHub: https://github.com/aayushi111-png/Workforce
  Credentials: [saved in password manager]

GCP Project: [project-name]
  Credentials: [saved in password manager]

SendGrid API Key: [if used]
  [saved in password manager]

Google OAuth App: [app-name]
  [configured in GCP console]
```

**API.md** — How the backend works
```
Endpoints (FastAPI):
  POST /auth/login → Verify Google OAuth token
  GET /api/workers → List all workers (HR only)
  POST /api/workers → Create worker (HR only)
  PUT /api/workers/{id}/documents/{type} → Mark verified (HR only)
  GET /api/workers/{id}/reviews → Get reviews
  [etc.]
```

**FAQ.md** — Common questions
```
Q: How do I add a new worker?
A: HR clicks "Create Worker" → fill form → system auto-creates checklist

Q: How do I verify documents?
A: HR clicks [View in Drive] → checks file → comes back to WOP → 
   clicks ☑ Mark Verified

Q: How long are documents kept?
A: 3 years after worker exits, then auto-deleted

[etc.]
```

---

## Phase 3: Training (Aug 30–31)

**15-minute training with KATBOTZ tech person:**

**Show them:**
1. GitHub repo (code structure)
2. GCP console (Cloud Run, Firestore, Cloud Storage)
3. How to redeploy (push → auto-deploy)
4. How to check logs (Cloud Logging)
5. How to restore from backup (Firestore restore)
6. Where credentials are stored

**They ask questions → you answer**

---

## Phase 4: Handover (Sept 1–2)

**Transfer ownership:**

- [ ] GitHub access: Add them as admin
- [ ] GCP project: Add them as admin
- [ ] Google Drive folder: Transfer ownership (or give full access)
- [ ] Password manager: Share all credentials
- [ ] All runbooks + docs: Share via email or Google Drive

**They confirm:**
- [ ] Can log into GitHub
- [ ] Can log into GCP
- [ ] Can access credentials
- [ ] Has runbooks (can read)
- [ ] Can restart service (tested)
- [ ] Can restore from backup (tested)

**Then: You're done. You leave.**

---

## Success Checklist

If all ✓, system is ready to handover:

- ✓ All features working (documents, projects, goals, reviews)
- ✓ Priya tested end-to-end (no critical bugs)
- ✓ Code pushed to GitHub
- ✓ Runbook written
- ✓ Tech person trained (15 min)
- ✓ All credentials transferred
- ✓ Backup tested (can restore)
- ✓ Logs accessible (can see errors)
- ✓ System is at workforce.katbotz.com (live)
- ✓ Tech person can restart service

---

## Post-Handover

**Tech person takes over:**
- Monitor system (check logs daily)
- Fix bugs if any (you're available as consultant)
- Handle user requests
- That's it

**You:**
- No longer responsible
- Available for emergency help (₹2,000–5,000 per issue)
- Free to focus on school

**Sept 4:** System goes live. You're out.

---

## Emergency Contact

If system breaks after Aug 22:
- KATBOTZ tech person tries to fix it
- If they can't: Call you (emergency consultant rate ₹2,000–5,000)
- You help them debug over phone/video

---

## Done.

Sept 3: Handover complete.
Sept 4: Live.
Sept 5 onwards: KATBOTZ owns it.
