# 01 · EXECUTIVE SUMMARY

## What WOP is

**Workforce Operations Platform (WOP)** is the centralized workforce management layer for KATBOTZ. It is the operational system of record for employees, contractors and interns, from onboarding until archival.

```
Zoho Recruit        WOP                 Gusto
   hire      →    operate (WOP)    →   US payroll
            offer accepted to archived
```

- **Zoho Recruit** stays the system of record for hiring. WOP does not touch it.
- **Gusto** stays the system of record for US payroll. WOP references it, never replaces it.
- **WOP** owns everything in between, for everyone Gusto does not cover.

---

## Why it is needed

### Current state

The non US workforce is run on:

- Google Sheets
- Google Drive
- Email
- Manual follow ups

### What breaks

| Problem | Consequence |
|---------|-------------|
| No central source of truth | Conflicting versions, time lost hunting for data |
| No audit trail | Cannot prove who did what and when |
| Missing documents | Onboarding stalls, compliance gaps found late |
| Manual onboarding | Quality depends on who is doing it that day |
| Missed contract renewals | Contractors lapse without anyone noticing |
| Inconsistent offboarding | Access and assets left open after exit |
| Compliance risk | Identity documents sitting in Drive with no control |

The model scales linearly: twice the workers means twice the manual effort and twice the chance of error.

---

## What changes

A single workforce platform that:

- tracks all workers
- stores all documents
- manages the full lifecycle
- maintains compliance
- provides analytics
- sends automated email notifications on key events (document rejection, onboarding complete, contract expiry, review due)

The marginal cost of onboarding worker 500 should be close to onboarding worker 5.

---

## Snapshot

| Dimension | Summary |
|-----------|---------|
| Replaces | Sheets, Drive and email for the non US workforce |
| Worker types | Indian employee, Indian contractor, global contractor, global intern |
| Primary users | Founder, Senior HR, HR Executive, Team Lead, plus self service for workers |
| Frontend | Next.js |
| Backend | FastAPI (Python) |
| Records | Google Firestore |
| Files | Google Cloud Storage |
| Email notifications | SendGrid (triggered from FastAPI) |
| Auth | Google OAuth plus role based access control |
| Scale target | 100 today, designed for 5,000 plus without redesign |

---

## Who reads what

- **Founder:** read this summary and [Roles and Experiences](03-user-roles-and-experiences.md).
- **Technical Head:** read [System Architecture](06-system-architecture.md), [Database Architecture](07-database-architecture.md), [Security](08-security-and-compliance.md).
- **HR leads:** read [Workforce Lifecycle](04-workforce-lifecycle.md) and [Functional Modules](05-functional-modules.md).

> **Confirmed:** the four worker types above are the complete set for launch.
