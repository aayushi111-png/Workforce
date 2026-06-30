# WOP (Workforce Operations Platform) — Executive Summary for KATBOTZ Leadership

---

## **THE PITCH (2 MINUTE VERSION)**

**Current Problem:**
- Worker data scattered across Google Sheets, Drive, Zoho, Gmail
- No centralized system of record
- HR spends 5-10 hours/week on manual data entry
- No audit trail for compliance
- Document verification done manually without tracking

**Solution:**
One unified portal where:
- Workers log in, upload documents, track goals, write weekly updates
- HR sees all workers in one place, verifies documents, assigns projects
- Everything encrypted, logged, and legally compliant
- 3-year data retention then auto-delete (DPDP Act compliant)

**Timeline:** 6 weeks build (July 1 – Aug 13) + 2 weeks test → Live Sept 4, 2026

**Cost:** ₹3-5/month for 50 workers, ₹9-15/month for 500 workers

**Built by:** Aayushi Pandey (intern) using Google Cloud, no external dependencies

---

## **THE DETAILED BREAKDOWN**

### **PART 1: THE PROBLEM (Why build this?)**

**Current Chaos:**
```
❌ Worker onboarding: Google Sheet (disorganized)
❌ Documents: Google Drive (hard to find, verify, track)
❌ Projects/Goals: Email + Sheets (no history)
❌ Performance reviews: Email (no structure)
❌ Contracts (contractors): Spreadsheet (manual alerts)
❌ Invoices (contractors): Email + Drive (no workflow)
❌ Audit trail: NONE (legal risk)
❌ HR burden: 5-10 hours/week on admin tasks

Result:
├─ Compliance risk (no audit trail)
├─ Lost documents
├─ Duplicate work by HR
├─ No performance history
└─ Contractor payment delays
```

**KATBOTZ needs:**
- Single source of truth for all worker data
- Compliance-ready audit trail (DPDP Act)
- Reduce HR admin burden
- Professional onboarding process
- Legal proof for disputes

---

### **PART 2: THE SOLUTION (What is WOP?)**

**One Portal. Everything Inside.**

**For Workers:**
```
Login: Click "Sign in with Google" (katbotz.com email)

Dashboard:
├─ My Project (assigned by HR)
├─ My Goals (set by team lead, can edit)
├─ My Weekly Summary (write what I did this week)
├─ My Documents (upload PAN, Aadhaar, Degree, etc.)
├─ My Performance (rating from team lead)
├─ My Reviews (30-day, 60-day, 90-day, annual)
├─ My To-Do List (personal task list)
└─ My Notifications (document verified, review due, etc.)

That's it. Simple, clear, no complexity.
```

**For HR:**
```
Login: Same

Dashboard:
├─ All Workers (searchable list)
├─ Click worker → see everything:
│  ├─ Profile (name, email, type, department)
│  ├─ Documents (status: pending/verified/rejected)
│  ├─ Project & Goals (assign/track)
│  ├─ Performance & Reviews (fill reviews)
│  ├─ Invoices (contractors - approve/reject/pay)
│  ├─ Contract renewals (alerts 90/60/30/7 days)
│  └─ Audit trail (who did what, when)
│
├─ Document Verification
│  ├─ View in Google Drive
│  ├─ Mark ✓ Verified or ✗ Reject
│  └─ Send notification to worker
│
├─ Project Assignment
│  ├─ Pick project name, lead, start date
│  └─ Assign to worker
│
├─ Reviews
│  ├─ 30/60/90-day auto-scheduled
│  ├─ Fill rating + feedback
│  └─ Worker sees feedback
│
└─ Offboarding
   ├─ Mark worker for exit
   ├─ System auto-deletes data 3 years later
   └─ Proof logged forever
```

---

### **PART 3: WHO GETS WHAT (7 Roles)**

```
1. FOUNDER
   ├─ Can do ANYTHING (full authority)
   ├─ Can override any decision
   ├─ Can view all audit logs
   └─ Cannot: Delete audit logs (immutable)

2. SENIOR HR
   ├─ Create/edit/delete workers
   ├─ Approve document verification
   ├─ Mark workers for exit
   ├─ Access own audit logs
   └─ Manage integrations (Zoho, Gusto)

3. HR
   ├─ Verify documents (just check & approve)
   ├─ View all workers
   ├─ Assign projects
   ├─ Cannot: Create/delete workers
   └─ Cannot: View audit logs

4. TEAM LEAD
   ├─ See only team members
   ├─ Set goals + track progress
   ├─ Fill 30/60/90-day reviews
   ├─ Cannot: See salary/invoices
   └─ Cannot: Delete workers

5. EMPLOYEE / CONTRACTOR / INTERN
   ├─ See only own profile
   ├─ Upload documents
   ├─ Edit own goals
   ├─ Write weekly summary
   ├─ Mark goals achieved
   └─ Contractors: Submit invoices
```

---

### **PART 4: KEY FEATURES (17 Total)**

**1. Authentication (Secure)**
- Google OAuth: katbotz.com emails only
- No passwords stored in WOP
- 2FA from Google inherited
- Auto-logout after 1 hour inactivity

**2. Documents (4 States)**
- Worker uploads: PAN, Aadhaar, Degree, Marksheets, Bank proof, etc.
- Status: Pending → Under Review → Verified (or Rejected)
- HR views in Google Cloud Viewer (secure, no download)
- Stored in Cloud Storage (CMEK encrypted)

**3. Project Assignment**
- HR assigns project name + team lead
- Worker sees project + lead + start date
- Used for organizing who's doing what

**4. Goals**
- Team lead sets goals with deadlines
- Worker + Team lead both can edit
- Mark goals achieved
- Full history kept

**5. Weekly Summary**
- Worker writes: "What happened this week?"
- HR reads for progress updates
- History kept forever

**6. Performance**
- Team lead rates: 1-5 stars + feedback
- Worker + HR can see
- Updated anytime

**7. Reviews (Auto-Scheduled)**
- 30-day: Day 30 from hire
- 60-day: Day 60
- 90-day: Day 90
- Annual: Every year
- Team lead fills, worker sees, locked after submit

**8. To-Do List**
- Worker creates personal checklist
- Check off as completed
- HR can see (read-only)

**9. Contract Renewal (Contractors)**
- Start date, end date, renewal date
- Auto-alerts: 90/60/30/7 days before expiry
- Amendments tracked (scope/rate/duration changes)
- History kept

**10. Invoice Workflow (Contractors)**
- Contractor submits: Amount, period
- HR approves or rejects
- Approved invoices marked paid
- All invoices must be finalized before contractor exit

**11. Offboarding**
- HR marks worker for exit (with exit date)
- All data locked for 3 years
- Auto-deleted after 3 years (system job)
- Proof logged forever

**12. In-Portal Notifications**
- No email (all in WOP dashboard)
- Examples: "Document verified", "Review due", "Contract renews in 7 days"
- Encrypted, secure

**13. Audit Trail (Everything Logged)**
- WHO: Which user
- WHAT: Which action (created, verified, deleted, etc.)
- WHEN: Exact timestamp
- WHERE: Which worker/document
- RESULT: Success or failure

**14. Multi-Currency Support**
- Auto-select by location: India (₹), US ($), EU (€)
- No conversion (native storage)
- Contracts track currency + rate
- Amendments create new versions if rate changes

**15. Zoho Recruit Integration**
- When recruiter marks offer "Accepted" in Zoho
- Webhook auto-creates worker in WOP
- Or HR can manually create anytime (always available)
- If webhook fails: Auto-retry 3x, HR dashboard shows failures

**16. Gusto Integration (US Employees Only)**
- For US employees: Real-time sync of salary, department, position
- When all documents verified: Auto-sync to Gusto
- Gusto sets up payroll
- Indian employees: NOT synced (payroll handled separately)

**17. Legal Compliance**
- 3-year data retention (all worker data)
- Auto-delete after 3 years (DPDP Act compliant)
- Audit trail kept forever (proof of deletion)
- Immutable audit logs (Founder cannot delete)

---

### **PART 5: THE TECHNICAL STACK (Simple & Cheap)**

**Frontend:**
```
Technology: Next.js (React)
Hosting: Google Cloud Run (auto-scales)
Cost: Included in Cloud Run tier
```

**Backend:**
```
Technology: FastAPI (Python)
Hosting: Google Cloud Run (auto-scales)
Cost: Included in Cloud Run tier
```

**Database:**
```
Technology: Firestore (Google's database)
Features: Real-time, auto-replicated, encrypted
Cost: ₹1-2/month for 50 workers, ₹4-6/month for 500 workers
```

**Document Storage:**
```
Primary: Google Cloud Storage (CMEK encrypted, 3-year retention)
Backup: Google Drive (30-day rolling backup for disaster recovery)
Cost: ₹0.50/month for 50 workers, ₹3-5/month for 500 workers
```

**Authentication:**
```
Technology: Google OAuth (only @katbotz.com emails)
No passwords in WOP (Google handles)
Cost: FREE
```

**Audit Trail:**
```
Storage: Firestore (immutable, forever)
Encryption: CMEK AES-256
Cost: Included in Firestore tier
```

---

### **PART 6: COST BREAKDOWN (Brutally Honest)**

**Is it free?**
```
No. But it's EXTREMELY cheap.
```

**Monthly Operating Cost:**
```
50 workers:    ₹3-5/month        (~$0.04-0.06 USD)
100 workers:   ₹5-8/month
500 workers:   ₹9-15/month       (~$5-10 USD)
1000 workers:  ₹20-30/month
```

**Why so cheap?**
```
Google Cloud has generous free tiers:
├─ Firestore: 50K reads/day free (most apps stay in free tier)
├─ Cloud Storage: 5GB/month free
├─ Cloud Run: 2M invocations/month free
├─ Google OAuth: Unlimited free

Our usage for 50 workers:
├─ Firestore reads: ~5K/day (well under 50K)
├─ Cloud Storage: ~1GB/month (well under 5GB)
├─ Cloud Run: ~50K invocations/month (well under 2M)
└─ Result: All free tier, $0 cost

For 500 workers:
├─ Slightly exceed free tiers
├─ Cost: Pay-as-you-go (but cheap)
├─ Firestore: ₹0.006 per read (after free tier)
├─ Cloud Storage: ₹0.17/GB
├─ Cloud Run: ₹0.40 per 100K invocations
└─ Total: ₹9-15/month
```

**Compared to alternatives:**
```
Zoho People:   ₹500-1000/employee/month  × 50 = ₹25,000-50,000/month
Workday:       ₹10,000+/month
ADP:           ₹5,000-8,000/month

WOP:           ₹3-5/month (for 50 workers)

Savings: 99.99% cheaper
```

**Build Cost:**
```
Developer: Aayushi (intern project)
Claude AI: Free tier for MVP
GCP: Minimal ($0-5 during development)

Total build cost: Essentially $0 (intern work, using free tiers)
```

---

### **PART 7: TIMELINE (9 Weeks Total)**

**WEEK 1-6: Development (July 1 – Aug 13)**
```
Week 1: Login + Worker creation + Database
  ├─ Google OAuth working
  ├─ HR can create workers
  └─ Worker list visible in HR dashboard

Week 2: Documents + Projects + Goals
  ├─ Worker can upload documents
  ├─ HR can verify documents
  ├─ HR can assign projects
  └─ Goals can be set and tracked

Week 3: Performance + Reviews + Summary
  ├─ Performance ratings working
  ├─ Reviews system (30/60/90-day, annual)
  ├─ Weekly summary form
  └─ To-do lists working

Week 4: Contractors + Contracts + Invoices
  ├─ Contract tracking with renewal alerts
  ├─ Contract amendments
  ├─ Invoice workflow (submit → approve → pay)
  └─ Student ID for interns

Week 5: Integrations + Advanced Features
  ├─ Zoho Recruit (auto-create workers)
  ├─ Gusto sync (US employees)
  ├─ Offboarding (mark exit, auto-delete after 3 years)
  ├─ Notifications (in-portal)
  └─ Audit trail (complete logging)

Week 6: Polish + Security + Optimization
  ├─ Performance optimization
  ├─ Security hardening
  ├─ Error handling
  ├─ UI polish
  └─ Code review

Status: PRODUCTION-READY by Aug 13
```

**WEEK 7-8: Testing (Aug 14 – Aug 27)**
```
Week 7: Full System Testing
  ├─ Priya (Senior HR) does complete end-to-end testing
  ├─ Test all workflows with real data
  ├─ Test all integrations (Zoho, Gusto)
  ├─ Test backup and restore procedures
  └─ Document all bugs

Week 8: Bug Fixes + Handover Prep
  ├─ Fix all critical bugs
  ├─ Create operational runbook
  ├─ Prepare GitHub access transfer
  ├─ Prepare GCP credentials transfer
  └─ Train KATBOTZ tech person
```

**WEEK 9: Handover (Aug 28 – Sept 3)**
```
Aug 28–29: Transfer GitHub + Credentials
Aug 30–31: Transfer GCP project
Sept 1–2: Final verification
Sept 3: Sign-off and approval

GO-LIVE: Sept 4, 2026 ✓
```

---

### **PART 8: SECURITY & COMPLIANCE (Not Optional)**

**Authentication:**
```
✓ Google OAuth: katbotz.com only (no external emails)
✓ No passwords stored in WOP
✓ 2FA inherited from Google
✓ Tokens auto-expire
✓ Auto-logout after 1 hour inactivity
```

**Data Encryption:**
```
At Rest:
├─ Firestore: CMEK AES-256 (military-grade)
├─ Cloud Storage: CMEK AES-256
├─ Google Drive: AES-256 (Google default)

In Transit:
├─ Browser ↔ Server: HTTPS TLS 1.3
├─ Server ↔ Firestore: Encrypted
└─ All encrypted end-to-end

Result: Even Google can't read without key
```

**Data Retention (DPDP Act Compliance):**
```
Active Worker:
├─ Data kept indefinitely (as long as employed)

Exit (e.g., June 30, 2026):
├─ Data locked for 3 years (June 30, 2029)
├─ All documents kept (PAN, Aadhaar, Degree, etc.)
├─ All reviews kept (performance history)
├─ All projects kept (work history)
├─ All invoices kept (payment history)
├─ All audit trail kept

Day 3 Years Later (June 30, 2029):
├─ System auto-deletes:
│  ├─ Worker profile
│  ├─ Documents
│  ├─ Projects/Goals/Reviews
│  ├─ Contracts/Invoices
│  └─ All data (EXCEPT audit trail)
│
├─ Audit trail REMAINS FOREVER:
│  └─ Proof: "Rohan Mehta data deleted June 30, 2029"

Why 3 Years?
├─ Legal: Labor law requires 3-year record retention
├─ Disputes: If worker sues, evidence exists
├─ Compliance: DPDP Act requirement
└─ Proof: Deletion logged permanently
```

**Audit Trail (Everything Logged):**
```
What gets logged:
├─ Worker created (who, when)
├─ Document uploaded (by whom, when)
├─ Document verified (by whom, when, reason)
├─ Document rejected (by whom, when, reason)
├─ Project assigned (to whom, by whom)
├─ Goals created/updated/achieved
├─ Reviews filled
├─ Performance ratings
├─ Contract amended
├─ Invoice submitted/approved/paid
├─ Worker marked for exit
├─ Data auto-deleted
├─ Backup created/restored
└─ Every single action (complete audit trail)

Stored: Firestore (immutable, encrypted, forever)

Who can access:
├─ Founder: All logs
├─ HR: Own actions only
├─ Workers: Actions affecting their profile
└─ System: Logs automated actions

Security:
├─ Append-only (new entries, old preserved)
├─ Immutable (cannot modify or delete, even Founder)
├─ Encrypted (CMEK AES-256)
└─ Legal proof: Cannot be tampered with
```

**Legal Compliance:**
```
DPDP Act 2023 (India Privacy):
✓ Document all data processing
✓ Keep records for 3 years
✓ Delete after purpose fulfilled
✓ Proof of deletion logged
✓ Audit trail for accountability

Labor Law (India):
✓ 3-year record retention for disputes
✓ Complete worker history kept
✓ Proof of payments/reviews

Litigation Defense:
✓ Audit trail proves what happened
✓ Timestamps show when
✓ User tracking shows who
✓ Even if sued years later, evidence exists
```

---

### **PART 9: GO-LIVE PLAN (Sept 4, 2026)**

**Before Go-Live:**
```
✓ All features tested
✓ All bugs fixed
✓ HR trained (Priya)
✓ Runbook documented
✓ Backup tested
✓ Credentials transferred
✓ KATBOTZ tech person ready
```

**Go-Live Day (Sept 4):**
```
Morning: Announce to all workers
├─ "Today we switch to WOP"
├─ "Google Sheets/Docs no longer used"
└─ "Everything in WOP portal from now on"

Rollout:
├─ All workers login with Google
├─ HR migrates existing data to WOP
├─ New hires use WOP from day 1
└─ Old systems archived (read-only backup)

Support:
├─ Aayushi: On-call for critical issues (Sept 4-30)
├─ Response time: Within 1 hour
├─ Types: Cannot login, cannot upload, system broken
└─ Oct 1+: KATBOTZ tech person owns
```

---

### **PART 10: SUPPORT AFTER LAUNCH**

**Sept 4-30 (First Month):**
```
Aayushi: On-call
├─ Critical issues: Respond within 1 hour
├─ Examples: Login broken, documents disappearing, integration failing
├─ Cost: No extra cost (included)

Help desk:
├─ Priya: First point of contact for HR questions
├─ Workers: Help from Priya or team lead
└─ Aayushi: Escalation if needed
```

**Oct 1+ (Ongoing):**
```
KATBOTZ Tech Person: Owner
├─ Monitor system daily
├─ Fix bugs as they appear
├─ Handle user requests
└─ Maintain integrations (Zoho, Gusto)

Aayushi: Available as Consultant
├─ Emergency issues: ₹2,000-5,000 per issue
├─ Code questions: Available
├─ But: No longer day-to-day responsibility
└─ Free to focus on school
```

**Maintenance:**
```
Backups: Automated daily (no manual work)
Updates: Cloud handles automatically
Downtime: Zero downtime (no maintenance windows needed)
Cost: Stays ₹3-15/month (no surprises)
```

---

### **PART 11: WHAT'S NOT INCLUDED (By Design)**

**Intentionally Simple (Not Building):**
```
❌ Automated emails (just in-portal notifications)
❌ Scheduled emails (manual workflow only)
❌ Calendar integration
❌ Slack notifications
❌ Advanced analytics (just basic reporting)
❌ Mobile app (web-only, responsive)
❌ Deployment to external domain (just internal)
❌ Future phases promised (no "Phase 2, Phase 3")

Why?
├─ Keep scope small (6 weeks realistic)
├─ No complexity (easy to maintain)
├─ Easy to handover (KATBOTZ tech person can own)
└─ No unfulfilled promises (what we build works)
```

---

### **PART 12: RISKS & MITIGATIONS**

**Risk: What if Aayushi leaves?**
```
Mitigation: Complete handover to KATBOTZ tech person by Sept 3
├─ Full GitHub access transferred
├─ All credentials transferred
├─ Runbook + documentation provided
├─ 15-minute training completed
├─ System is simple enough to maintain

Result: Tech person can handle independently
```

**Risk: Zoho/Gusto integration fails?**
```
Mitigation: Manual fallback always works
├─ If Zoho webhook fails: HR manually creates worker (2-3 min)
├─ If Gusto sync fails: HR manages payroll separately
├─ System doesn't break (integration is bonus, not requirement)
```

**Risk: Data loss?**
```
Mitigation: Daily automated backups
├─ Firestore: Auto-replicated across Google regions
├─ Cloud Storage: Versioning enabled, backup in Google Drive
├─ Restore time: 5 minutes
├─ Backup tested regularly

Result: Data is safe
```

**Risk: Security breach?**
```
Mitigation: Multiple layers
├─ Google OAuth (no passwords to steal)
├─ CMEK encryption (even Google can't read)
├─ Access logs (audit trail shows unauthorized access)
├─ Immutable audit logs (tampering proof)
├─ Role-based access (workers can't see others)

Result: Highly secure system
```

---

### **PART 13: SUCCESS METRICS (How We Know It Works)**

**By Sept 4, 2026:**
```
✓ Workers can log in with katbotz email
✓ Documents can be uploaded and verified
✓ Projects can be assigned and tracked
✓ Goals can be set and tracked
✓ Reviews system works (30/60/90-day, annual)
✓ Contractors can submit invoices
✓ Contracts tracked with renewal alerts
✓ All data encrypted
✓ Complete audit trail of all actions
✓ 3-year retention policy implemented
✓ Zero manual data entry (fully automated)
✓ Zoho integration working (optional, manual backup works)
✓ Gusto integration working (US employees only)
✓ System handles 50-500 workers
✓ Response time < 2 seconds
✓ 99% uptime

HR Benefit:
├─ Reduces admin work from 5-10 hours/week → <1 hour/week
├─ Complete audit trail (legal compliance)
├─ Centralized worker data
└─ Professional worker experience
```

---

## **FINAL SUMMARY: THE ELEVATOR PITCH**

**What:** One unified portal for all worker management (onboarding, documents, projects, goals, reviews, contracts, invoices)

**Why:** Replace fragmented Google Sheets/Drive/email with secure, compliant system

**Who Built It:** Aayushi Pandey (intern) using Google Cloud

**Cost:** ₹3-5/month for 50 workers (99% cheaper than Zoho/Workday)

**Timeline:** 6 weeks build + 2 weeks test = Live Sept 4, 2026

**Security:** Google OAuth, CMEK encryption, 3-year retention, complete audit trail (DPDP compliant)

**Support:** Aayushi on-call through Sept, then KATBOTZ tech person owns it

**Risk:** Low (simple system, well-documented, easy to maintain)

**Benefit:** Professional HRMS at fraction of cost, full compliance, zero disruption to business

---

## **QUESTIONS BOSS WILL ASK**

**Q: Can we deploy to cloud so remote workers can access?**
A: Yes, WOP is on Google Cloud Run. Anyone with @katbotz.com email can access from anywhere.

**Q: What if Zoho/Gusto integration breaks?**
A: Manual fallback works. HR can create workers manually (2-3 min) or manage payroll separately.

**Q: Is the data safe?**
A: Yes. Google OAuth (no passwords), CMEK encryption (AES-256), immutable audit logs, DPDP compliant.

**Q: Can we trust Aayushi with this?**
A: Yes. Complete handover to KATBOTZ tech person by Sept 3. System is simple enough to maintain independently.

**Q: What if we outgrow 500 workers?**
A: System scales automatically. Costs go up slightly but stay cheap ($5-10/month even for 1000 workers).

**Q: What about data privacy (DPDP Act)?**
A: Full compliance. 3-year retention, auto-delete, immutable audit logs, encryption. Legal proof of all actions.

**Q: Why is it so cheap compared to Zoho?**
A: Zoho charges ₹500-1000 per employee per month. We use Google Cloud free tiers + pay-as-you-go. That's why ₹3-15/month vs ₹25,000+/month.

**Q: Can employees delete their own data?**
A: No. Only Founder/HR can manage data. Workers can't delete documents (ensures compliance).

**Q: What happens to data when worker exits?**
A: All data locked for 3 years (legal requirement). Auto-deleted after 3 years. Audit trail kept forever (proof of deletion).

---

## **WHAT TO TELL YOUR BOSS**

```
"Aayushi has built WOP — a complete HR management system that replaces 
our scattered Google Sheets/Drive/Zoho setup with one secure, compliant 
portal.

6 weeks to build. 2 weeks to test. Live Sept 4.

Cost: ₹3-5/month for 50 workers (vs ₹25,000+/month for Zoho).

Security: Google OAuth, encryption, audit trail, DPDP compliant.

Handover: Complete transfer to our tech person by Sept 3.

Risk: Low. System is simple, well-documented, tested.

Benefit: Professional HRMS, legal compliance, HR efficiency, worker 
experience — all at fraction of market cost.

Ready to launch."
```

---

