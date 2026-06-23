# WOP BUDGET AND TIMELINE SUMMARY

---

## BUDGET OVERVIEW

### Build Cost
| Item | Cost | Notes |
|------|------|-------|
| Development | ₹0 | Aayushi Pandey (Intern Project) |
| Google Cloud Setup | ₹0 | No setup fees |
| **Total Build Cost** | **₹0** | Zero cost to KATBOTZ |

### Operating Cost (Monthly)

**For 50 Workers (Current Projection):**
| Service | Cost | Details |
|---------|------|---------|
| Firestore (Database) | ₹1–2 | 100M reads/month in free tier |
| Cloud Storage (Backups) | ₹0.50 | Daily exports, 30-day retention |
| Cloud Run (Hosting) | ₹1–2 | 2M invocations/month in free tier |
| Google Drive | Free | Included with Workspace |
| Google OAuth | Free | No additional cost |
| **Total** | **₹3–5/month** | **~$0.50–0.75 USD** |
| **Annual** | **₹36–60** | Minimal operating cost |

**For 500 Workers (Projected Growth):**
| Service | Cost | Details |
|---------|------|---------|
| Firestore (Database) | ₹5–8 | Higher transaction volume |
| Cloud Storage (Backups) | ₹2–3 | Larger daily backups |
| Cloud Run (Hosting) | ₹2–4 | More concurrent requests |
| Google Drive | Free | Included with Workspace |
| Google OAuth | Free | No additional cost |
| **Total** | **₹9–15/month** | **~$5–10 USD** |
| **Annual** | **₹108–180** | Linear scaling |

**Scaling Pattern:**
- Every 100 additional workers ≈ ₹2–3/month increase
- No per-employee licensing (unlike SaaS)
- Predictable, transparent cost model

### Cost Comparison

**Current (50 workers):**
| System | Monthly | Annual |
|--------|---------|--------|
| Zoho People | ₹15,000 | ₹180,000 |
| WOP | ₹5 | ₹60 |
| **Savings** | **₹14,995** | **₹179,940** |

**At Scale (500 workers):**
| System | Monthly | Annual |
|--------|---------|--------|
| Zoho People | ₹150,000 | ₹1,800,000 |
| WOP | ₹12 | ₹144 |
| **Savings** | **₹149,988** | **₹1,799,856** |

---

## TIMELINE

### Build Schedule (July 1 – August 20, 2026)

**Week 1: Foundations (July 1–5)**
| Day | Task | Deliverable |
|-----|------|-------------|
| Mon | Backend setup (FastAPI), Frontend setup (Next.js), Database (Firestore) | Dev environment ready |
| Tue | Google OAuth implementation (katbotz.com domain) | Login working |
| Wed | Firestore schema design, worker creation endpoints | Database schema finalized |
| Thu | HR dashboard skeleton, worker list display | Dashboard prototype |
| Fri | Integration testing, login flow validation | System live at workforce.katbotz.com |

**Week 2: Core Features (July 7–11)**
| Day | Task | Deliverable |
|-----|------|-------------|
| Mon | Document upload to Google Drive, status tracking | Workers can upload |
| Tue | HR document verification UI (Verified/Rejected) | HR can verify docs |
| Wed | Project assignment form, goals management | Project/goal system |
| Thu | Performance form (rating + feedback) | Performance tracking |
| Fri | End-to-end testing | Core features working |

**Week 3: Advanced Features (July 14–20)**
| Day | Task | Deliverable |
|-----|------|-------------|
| Mon | Weekly summary form, history tracking | Summary system live |
| Tue | Review scheduling (30/60/90-day, annual) | Review engine ready |
| Wed | Contract renewal tracking, offboarding | Offboarding workflow |
| Thu | Notifications, to-do lists | Notifications system |
| Fri | Complete feature testing | All 15 features working |

**Week 4–5: Testing & Bug Fixes (July 21–Aug 1)**
| Item | Description |
|------|-------------|
| Functionality Testing | Priya (Senior HR) tests all workflows with real data |
| Integration Testing | Zoho Recruit and Gusto integrations tested |
| Performance Testing | Page load speed, database query optimization |
| Bug Identification | Critical, high, and medium bugs documented |
| Bug Fixes | All critical bugs fixed, high priority addressed |

**Week 6–7: Polish & Optimization (Aug 4–15)**
| Item | Description |
|------|-------------|
| Performance Optimization | Query indexing, caching, page load optimization |
| UI/UX Polish | Visual refinement, accessibility testing |
| Zoho Integration Fine-tuning | Webhook testing, error scenarios |
| Gusto Integration Fine-tuning | Sync testing, termination handling |
| Documentation | User guides, admin procedures |
| HR Training | 1-hour training with Priya (Senior HR) |

**Week 8: Handover (Aug 18–22)**
| Day | Task | Outcome |
|-----|------|---------|
| Mon–Tue | Final end-to-end testing | System stable, no blockers |
| Wed | GitHub access transfer | KATBOTZ tech person has repo access |
| Thu | GCP credentials transfer | Tech person can access infrastructure |
| Fri | Final runbook review, go-live sign-off | Ready for Sept 1 launch |

### Go-Live and Post-Launch (Sept 1+)

**September 1, 2026: Go-Live**
- All users switch to WOP
- Google Sheets retired (archive only)
- System in production use

**Sept 1–30: Monitoring & Support**
- Aayushi on-call for critical issues (1-hour response)
- Daily monitoring for bugs and edge cases
- User feedback collection and fixes

**Oct 1+: Handover Complete**
- KATBOTZ tech person takes ownership
- Aayushi available as consultant only
- Monthly backup recovery tests begin

---

## INFRASTRUCTURE & DEPLOYMENT

### Infrastructure
- **Frontend:** Next.js (React) on Cloud Run
- **Backend:** FastAPI (Python) on Cloud Run
- **Database:** Firestore (NoSQL)
- **Storage:** Google Drive (documents), Cloud Storage (backups)
- **Authentication:** Google OAuth (katbotz.com domain)
- **Integration:** Zoho Recruit API, Gusto API

### Deployment
- Connected to KATBOTZ main page (no external hosting required)
- Cloud Run auto-scales with demand
- No Vercel, no Heroku, no external deployment

### Backup Strategy
**Daily Automatic Backups:**
- Firestore → JSON export
- Stored: gs://katbotz-backups/
- Retention: 30 days (auto-delete old)
- Encryption: CMEK (Customer-managed key)

**Restore Procedure:**
1. GCP Console → Firestore Backups
2. Select restoration date
3. Click "Restore"
4. Completed in ~5 minutes
5. Monthly test restore to staging

---

## PROJECT SUMMARY

| Aspect | Details |
|--------|---------|
| **Developer** | Aayushi Pandey (Intern) |
| **Build Duration** | 3 weeks (July 1–Aug 20) |
| **Launch Date** | September 1, 2026 |
| **Build Cost** | ₹0 |
| **Monthly Operating** | ₹3–15 (scales with growth) |
| **Handover Date** | August 22, 2026 |
| **Supported Workers** | 50+ (unlimited scaling) |
| **Features** | 15 core features |
| **Roles** | 7 role-based access levels |
| **Integrations** | Zoho Recruit, Gusto, Google Workspace |
| **Compliance** | DPDP Act, auto-delete after 3 years |
| **Data Retention** | 3 years after exit, then auto-delete |
| **Backup** | Daily automatic, 30-day retention |
| **Support** | On-call Sept 1–30, then on-demand |

---

## KEY DATES

| Date | Event | Status |
|------|-------|--------|
| June 24, 2026 | Proposal submitted | Approval needed |
| July 1, 2026 | Development begins | Week 1 starts |
| July 20, 2026 | All features complete | Testing begins |
| Aug 1, 2026 | Testing complete | Polish phase |
| Aug 15, 2026 | Final optimization done | Ready for handover |
| Aug 22, 2026 | Handover to tech person | KATBOTZ takes control |
| Sept 1, 2026 | Go-live | Live for all users |
| Oct 1, 2026 | Handover complete | Tech person owns system |

---

## RESOURCE REQUIREMENTS

### During Development (July–Aug)
- Aayushi: 4–5 hours/day (5 days/week)
- Priya (Senior HR): 2 hours/week (testing, feedback)
- No other resources required

### After Launch (Sept 1+)
- Aayushi: On-call 1 hour/day for critical issues
- KATBOTZ Tech Person: 2–3 hours/week (operational management)
- HR Team: Use system daily (part of job)

### Infrastructure
- Google Cloud account (already exists)
- Google Workspace (already exists)
- Zoho Recruit account (already exists)
- Gusto account (already exists)

---

## APPROVAL SIGN-OFF

**Project:** Workforce Operations Platform (WOP)

**Submitted by:** Aayushi Pandey (Intern)

**Submitted to:** KATBOTZ

**Timeline:** 3 weeks (July 1 – Aug 20, 2026), Go-live Sept 1

**Build Cost:** ₹0

**Operating Cost:** ₹3–15/month (scales with growth, ~$5–10 for 500 workers)

**Scope Locked:**
- 15 core features with 7 roles
- Zoho Recruit + Gusto integration
- Auto-delete after 3 years
- Daily backups with 30-day retention
- Connected to KATBOTZ main page

**Approval Required From:** KATBOTZ Representative

---

**KATBOTZ Representative:** __________________ Date: __________

**Aayushi Pandey:** __________________ Date: June 24, 2026

---

**For detailed specifications, see:**
- 00-PROPOSAL.md (Complete proposal)
- 01-OVERVIEW.md (System overview)
- 06-TIMELINE.md (Detailed week-by-week)
- 07-SECURITY.md (Security & backup details)

