# OVERVIEW — What Workers & HR See

---

## For Workers

When you log in, you see:

```
📋 MY PROJECT
Project name, project lead, what we're building

🎯 MY GOALS  
What I need to achieve, deadlines, progress

📝 MY WEEKLY SUMMARY
Write what happened this week

📄 MY DOCUMENTS
Upload: PAN, Aadhaar, certificates, bank proof
See status: pending or ✓ verified

⭐ MY PERFORMANCE
Rating (1-5 stars) + feedback from team lead

📊 MY REVIEWS
30-day, 60-day, 90-day, annual reviews with feedback

✅ MY TO-DO
Personal daily task list (you manage)

🔔 NOTIFICATIONS
Alerts: doc verified, review due, goals due
```

That's everything a worker needs to see.

---

## For HR (Priya)

When you log in, you see:

```
👥 ALL WORKERS
List of everyone, searchable

📋 CLICK WORKER → SEE FULL PROFILE
  • Project assignment
  • Goals (can edit)
  • Weekly summaries (read what they wrote)
  • Documents (verify with ☑)
  • Performance rating
  • Review history (all 30/60/90/annual)
  • Contract renewal date
  • Exit status
```

One click. Everything visible.

---

## What Data Gets Stored

| What | Where | Who Sees |
|------|-------|----------|
| Name, email, type | Firestore | HR + Worker |
| Documents | Google Drive | HR + Worker |
| Project + goals | Firestore | HR + Worker |
| Weekly summary | Firestore | HR + Worker |
| Reviews | Firestore | HR + Worker |
| Performance | Firestore | HR + Worker |

**No passwords.** No sensitive data. Just organization.

---

## What Happens Over Time

**Day 1:** HR creates worker profile (name, email, type)

**Week 1:** HR assigns project, sets goals

**Ongoing:** Worker uploads documents, writes weekly summary

**HR:** Verifies documents (☑), fills reviews (every 30/60/90 days)

**Year 3:** If worker exits, data locked for 3 years

**Year 3+:** Auto-delete after 3 years (legal requirement)

---

## Who Can Do What

| Action | Employee | Team Lead | HR |
|--------|----------|-----------|-----|
| See own profile | ✓ | ✓ | — |
| See own docs | ✓ | — | — |
| Upload docs | ✓ | — | — |
| Edit own goals | ✓ | ✓ | — |
| Write weekly summary | ✓ | — | — |
| Fill performance form | ✓ | ✓ | — |
| See all workers | — | — | ✓ |
| Verify documents | — | — | ✓ |
| Assign projects | — | — | ✓ |
| Edit goals (team) | — | ✓ | — |
| Fill reviews | — | ✓ | — |
| Mark for exit | — | — | ✓ |

---

## Simple. Organized. Done.
