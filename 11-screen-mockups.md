# 11 · Screen Mockups

Rough wireframes of the key screens. Not final design — these show layout, structure, and what information lives where. Every screen adapts to the role of the person signed in.

---

## 1. Senior HR Dashboard

The first thing Senior HR sees after login. Actionable at a glance — tasks on the left, health on the right.

```
┌─────────────────────────────────────────────────────────────────────┐
│  KATBOTZ  Workforce Portal                     Priya (Senior HR) ▾  │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                       │
│  Dashboard   │  Good morning, Priya.                                │
│  Workers     │                                                       │
│  Contracts   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  Reviews     │  │  Pending    │  │  Awaiting   │  │  Expiring   │ │
│  Assets      │  │  Docs       │  │  Activation │  │  Contracts  │ │
│  Reports     │  │             │  │             │  │             │ │
│              │  │      4      │  │      2      │  │      1      │ │
│              │  │  workers    │  │  workers    │  │  in 30 days │ │
│              │  └─────────────┘  └─────────────┘  └─────────────┘ │
│              │                                                       │
│              │  ── Verification queue ──────────────────────────── │
│              │                                                       │
│              │  Rohan Mehta     Indian Employee   PAN → Pending     │
│              │  Sara Lim        Global Intern     Passport → Pending │
│              │  Dev Patel       Indian Contractor Aadhaar → Pending  │
│              │                                                       │
│              │  ── Workers awaiting activation ─────────────────── │
│              │                                                       │
│              │  Ananya Singh    All docs verified   [Activate →]    │
│              │  James Wu        All docs verified   [Activate →]    │
│              │                                                       │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 2. Worker Profile (HR View)

The full record for one worker. Every module hangs off this page.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Workers    Rohan Mehta                            [Edit] [···]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Rohan Mehta                         Status:  ● Verification        │
│  Indian Employee · Engineering                                       │
│  Joined: July 14, 2026   Team Lead: Akshat Mishra                  │
│  Worker ID: WOP-2026-0041                                           │
│                                                                      │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Documents│ Verify   │ Compliance│ Access   │ Reviews  │ Audit Log   │
├──────────┴──────────┴──────────┴──────────┴──────────┴─────────────┤
│                                                                      │
│  Document checklist                                                  │
│                                                                      │
│  ✓  PAN Card              Uploaded   [View]  ● Verified             │
│  ✗  Aadhaar Image         Uploaded   [View]  ○ Pending review       │
│  ✓  Degree Certificate    Uploaded   [View]  ● Verified             │
│  ✗  Relieving Letter      Not uploaded       — Awaiting worker      │
│  ✓  Employment Agreement  Signed             ● Verified             │
│                                                                      │
│  Compliance gate: 1 document missing, 1 pending verification        │
│  Cannot activate until complete.                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Document Verification (Senior HR)

HR opens a document and marks it verified or rejected. The rejection reason goes straight to the worker by email.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Rohan Mehta · Documents     Aadhaar Image                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────┐   Submitted: July 15       │
│  │                                     │   Type: Aadhaar Image      │
│  │                                     │   Worker: Rohan Mehta      │
│  │      [ Document image renders ]     │                            │
│  │                                     │   ─────────────────────── │
│  │                                     │                            │
│  │                                     │   Your decision:           │
│  │                                     │                            │
│  └─────────────────────────────────────┘   [✓ Mark Verified]        │
│                                                                      │
│                                            [✗ Reject]               │
│                                                                      │
│                                            Rejection reason:        │
│                                            ┌─────────────────────┐  │
│                                            │ Image is blurry,    │  │
│                                            │ please re-upload    │  │
│                                            └─────────────────────┘  │
│                                                                      │
│                                            Worker is emailed        │
│                                            automatically on reject. │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Access Management Checklist

Appears in a worker's record after activation. HR ticks each system after IT provisions it manually. Same list becomes the revocation checklist at offboarding.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Rohan Mehta · Access Management                                     │
│  Activated July 18, 2026                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Provision these systems manually, then tick each one done here.    │
│  WOP does not create accounts — it records that you did.            │
│                                                                      │
│  System              Status     Actioned by    Date                 │
│  ─────────────────────────────────────────────────────             │
│  ☑  Google Workspace  Done      Priya (HR)     July 18             │
│  ☑  GitHub (KATBOTZ)  Done      Priya (HR)     July 18             │
│  ☐  Slack workspace   Pending   —              —                    │
│  ☐  Notion            Pending   —              —                    │
│                                                                      │
│  2 of 4 systems provisioned.                                        │
│                                                                      │
│  [+ Add system]                                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Worker Self-Service Portal

What the worker themselves sees when they log in during onboarding. Simple task list — upload this, sign that.

```
┌─────────────────────────────────────────────────────────────────────┐
│  KATBOTZ  Workforce Portal                       Rohan Mehta ▾      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Welcome, Rohan. Complete your onboarding checklist below.          │
│  HR will verify your documents and activate your account.           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Your checklist                            3 of 5 complete   │   │
│  │  ──────────────────────────────────────────────────────────  │   │
│  │  ✓  PAN Card              Uploaded · Verified                │   │
│  │  ✓  Aadhaar Image         Uploaded · Under review           │   │
│  │  ✓  Degree Certificate    Uploaded · Verified               │   │
│  │  ○  Relieving Letter      [Upload ↑]                        │   │
│  │  ○  Employment Agreement  [Sign →]                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ── Upload a document ──────────────────────────────────────────── │
│                                                                      │
│  Document type:  [ Relieving Letter        ▾ ]                      │
│                                                                      │
│  [ Drag and drop your file here, or click to browse ]               │
│                                                                      │
│  Accepted formats: PDF, JPG, PNG. Max 10 MB.                       │
│                                                              [Save] │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Workforce Directory

The searchable list of all active workers. HR sees everyone. Team Leads see their team only.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Workforce Directory                                    + Add Worker │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [ 🔍 Search by name... ]   Type ▾   Dept ▾   Status ▾   TL ▾     │
│                                                                      │
│  Showing 24 of 24 workers                                           │
│                                                                      │
│  Name              Type                Dept         Status          │
│  ─────────────────────────────────────────────────────────────────  │
│  Ananya Singh      Indian Employee     Engineering  ● Active        │
│  Dev Patel         Indian Contractor   Design       ● Active        │
│  James Wu          Global Contractor   Marketing    ● Active        │
│  Kavya Nair        Indian Employee     Engineering  ○ Onboarding    │
│  Rohan Mehta       Indian Employee     Engineering  ○ Verification  │
│  Sara Lim          Global Intern       Product      ○ Verification  │
│  ···                                                                │
│                                                                      │
│  Click any row to open the full worker profile.                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Offboarding Checklist

Nothing closes until every box is ticked. HR cannot mark the exit done while an asset is unrecovered or an account is still live.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Offboarding · Ananya Singh                  Last day: Aug 31, 2026 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Access revocation                                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  ☑  Google Workspace   Revoked    Priya (HR)    Aug 28              │
│  ☑  GitHub             Revoked    Priya (HR)    Aug 28              │
│  ☐  Slack              Pending    —             —                   │
│  ☐  Notion             Pending    —             —                   │
│                                                                      │
│  Asset return                                                        │
│  ─────────────────────────────────────────────────────────────────  │
│  ☑  MacBook Pro (SN: XZ9201)    Returned   Aug 29                  │
│  ☐  Monitor (SN: LG4K-0042)     Pending    —                       │
│                                                                      │
│  Exit documents                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  ☑  Exit interview completed    Aug 28                              │
│  ☑  Relieving letter issued     Aug 29                              │
│  ☐  Final settlement confirmed  Pending                             │
│                                                                      │
│  3 items outstanding. Cannot close this exit until all are done.    │
│                                                                      │
│  [Close exit ← blocked]                                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Founder Dashboard

Read-only. Trends and flags, no operational buttons.

```
┌─────────────────────────────────────────────────────────────────────┐
│  KATBOTZ  Workforce Portal                   Akshat (Founder) ▾     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Workforce Overview                                   Export ↓      │
│                                                                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │  Total    │  │  Active   │  │  In       │  │  Exiting  │       │
│  │  Workers  │  │           │  │  Onboard  │  │  this mo  │       │
│  │           │  │           │  │           │  │           │       │
│  │    24     │  │    19     │  │     4     │  │     1     │       │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │
│                                                                      │
│  By type                          Compliance flags                  │
│  ──────────────────────────       ─────────────────────────────    │
│  Indian Employee    12  ███████   ⚠  1 contract expiring in 14 d   │
│  Indian Contractor   6  ████       ⚠  2 reviews overdue             │
│  Global Contractor   4  ██                                          │
│  Global Intern       2  █                                           │
│                                                                      │
│  Headcount over time (90 days)                                      │
│  ──────────────────────────────────────────────────────────────    │
│      24 │                                               ●──●        │
│      20 │                              ●──●──●──●──●               │
│      16 │              ●──●──●──●                                   │
│      12 │  ●──●──●                                                  │
│         └──────────────────────────────────────────────────         │
│           Jun 1        Jun 22       Jul 10      Jul 28              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Team Lead View

Scoped strictly to their team. Reviews are the primary action.

```
┌─────────────────────────────────────────────────────────────────────┐
│  KATBOTZ  Workforce Portal                    Akshat (Team Lead) ▾  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  My Team · Engineering (4 members)                                  │
│                                                                      │
│  Name           Type              Status    Next review due         │
│  ─────────────────────────────────────────────────────────────────  │
│  Ananya Singh   Indian Employee   Active    60-day · Aug 12 ⚠       │
│  Rohan Mehta    Indian Employee   Active    30-day · Aug 5          │
│  Kavya Nair     Indian Employee   Onboard   —                       │
│  Sara Lim       Global Intern     Active    Weekly · Aug 3 ⚠        │
│                                                                      │
│  ── Reviews due ────────────────────────────────────────────────── │
│                                                                      │
│  Sara Lim   Weekly check-in   Due: Aug 3   [Start review →]        │
│  Ananya     60-day review     Due: Aug 12  [Start review →]        │
│                                                                      │
│  You cannot see workers outside your team.                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Layouts are indicative. Final screens will be designed and built in Next.js during the build phase, starting July 1.*
