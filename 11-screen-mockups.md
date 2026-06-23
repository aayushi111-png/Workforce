# 11 · Screen Mockups

Rough visual layouts for every key screen. These show structure and navigation — not final design. Built in Next.js during the build phase from July 1.

---

## Navigation and role routing

When someone logs in, Google OAuth confirms their identity and their role determines which dashboard they land on. The same app, a different entry point for every role.

```mermaid
flowchart TD
    LOGIN[Google Sign-In<br/>KATBOTZ Workspace]
    LOGIN --> ROLE{What is<br/>your role?}

    ROLE -->|Founder| FD[Founder Dashboard<br/>Headcount · Risks · Reports]
    ROLE -->|Senior HR| SHR[Senior HR Dashboard<br/>Queue · Verify · Activate]
    ROLE -->|HR Executive| HRE[HR Executive Dashboard<br/>Document Review Queue]
    ROLE -->|Team Lead| TL[Team Lead Dashboard<br/>My team · Reviews due]
    ROLE -->|Employee| EMP[My Portal<br/>Checklist · Documents · Status]
    ROLE -->|Contractor| CON[My Portal<br/>Documents · Invoices · Contract]
    ROLE -->|Intern| INT[My Portal<br/>Checklist · Reviews · Progress]
```

---

## Senior HR Dashboard

The main operational screen. Everything that needs attention today, in one place.

```mermaid
flowchart LR
    subgraph NAV[" Sidebar"]
        N1[Dashboard]
        N2[Workers]
        N3[Contracts]
        N4[Reviews]
        N5[Assets]
        N6[Reports]
    end

    subgraph MAIN[" Main content"]
        subgraph CARDS[" Summary cards"]
            C1[Pending docs\n● 4 workers]
            C2[Awaiting activation\n● 2 workers]
            C3[Expiring contracts\n● 1 in 30 days]
        end

        subgraph QUEUE[" Verification queue"]
            Q1[Rohan Mehta → PAN pending]
            Q2[Sara Lim → Passport pending]
            Q3[Dev Patel → Aadhaar pending]
        end

        subgraph ACT[" Ready to activate"]
            A1[Ananya Singh → All verified → Activate]
            A2[James Wu → All verified → Activate]
        end
    end

    NAV --> MAIN
```

---

## Worker Profile

The full record for one worker. Every module is a tab on this page.

```mermaid
flowchart TD
    subgraph HEADER[" Rohan Mehta · Indian Employee · Engineering"]
        H1[Worker ID: WOP-2026-0041]
        H2[Joined: July 14 · Team Lead: Akshat]
        H3[Status: ● Verification]
    end

    subgraph TABS[" Tabs"]
        T1[Documents]
        T2[Verification]
        T3[Compliance]
        T4[Access]
        T5[Reviews]
        T6[Audit Log]
    end

    subgraph DOCS[" Documents tab — active"]
        D1[✓ PAN Card · Verified]
        D2[○ Aadhaar Image · Pending review]
        D3[✓ Degree Certificate · Verified]
        D4[✗ Relieving Letter · Not uploaded]
        D5[✓ Employment Agreement · Signed]
        D6[Compliance: 1 missing · 1 pending · Cannot activate yet]
    end

    HEADER --> TABS
    TABS --> DOCS
```

---

## Document Verification

HR opens a document from the queue and makes a decision. Rejection triggers an automatic email to the worker.

```mermaid
flowchart LR
    subgraph LEFT[" Document viewer"]
        DOC[Aadhaar Image\nRohan Mehta · Submitted July 15]
        IMG[Document renders here\nfull size · zoom available]
    end

    subgraph RIGHT[" Decision panel"]
        META[Type: Aadhaar Image\nWorker: Rohan Mehta\nSubmitted: July 15]
        V[✓ Mark Verified]
        R[✗ Reject]
        REASON[Rejection reason:\ntype here — sent to worker by email]
        NOTE[Worker is emailed automatically on reject]
    end

    LEFT --> RIGHT
    R --> REASON
    REASON --> NOTE
```

---

## Access Management Checklist

After a worker is activated, this checklist appears. HR ticks each system after IT provisions it manually. The same list becomes the revocation checklist at offboarding.

```mermaid
flowchart TD
    subgraph HEADER2[" Rohan Mehta · Access · Activated July 18"]
        INFO[Provision each system manually in that tool\nthen tick it done here · WOP records it]
    end

    subgraph LIST[" Checklist"]
        S1[☑ Google Workspace · Done · Priya · July 18]
        S2[☑ GitHub KATBOTZ · Done · Priya · July 18]
        S3[☐ Slack workspace · Pending]
        S4[☐ Notion · Pending]
        ADD[+ Add system]
    end

    subgraph STATUS2[" Status"]
        PROG[2 of 4 systems provisioned]
    end

    HEADER2 --> LIST
    LIST --> STATUS2
```

---

## Worker Self-Service Portal

What the worker sees when they log in during onboarding. Their only job here is to upload documents and sign agreements.

```mermaid
flowchart TD
    subgraph GREET[" Welcome, Rohan"]
        MSG[Complete your onboarding checklist\nHR will verify and activate your account]
    end

    subgraph CHECKLIST[" Your checklist — 3 of 5 complete"]
        I1[✓ PAN Card · Uploaded · Verified]
        I2[✓ Aadhaar Image · Uploaded · Under review]
        I3[✓ Degree Certificate · Uploaded · Verified]
        I4[○ Relieving Letter · Upload]
        I5[○ Employment Agreement · Sign]
    end

    subgraph UPLOAD[" Upload a document"]
        SEL[Document type selector]
        DROP[Drag and drop · or click to browse\nPDF · JPG · PNG · Max 10 MB]
        SAVE[Save]
    end

    GREET --> CHECKLIST
    CHECKLIST --> UPLOAD
```

---

## Workforce Directory

The searchable single source of truth. HR sees everyone. Team Leads see their team only.

```mermaid
flowchart TD
    subgraph FILTERS[" Filters"]
        SEARCH[Search by name]
        F1[Type ▾]
        F2[Department ▾]
        F3[Status ▾]
        F4[Team Lead ▾]
    end

    subgraph TABLE[" 24 workers"]
        R1[Ananya Singh · Indian Employee · Engineering · ● Active]
        R2[Dev Patel · Indian Contractor · Design · ● Active]
        R3[James Wu · Global Contractor · Marketing · ● Active]
        R4[Kavya Nair · Indian Employee · Engineering · ○ Onboarding]
        R5[Rohan Mehta · Indian Employee · Engineering · ○ Verification]
        R6[Sara Lim · Global Intern · Product · ○ Verification]
        MORE[···]
    end

    CLICK[Click any row → open full worker profile]

    FILTERS --> TABLE
    TABLE --> CLICK
```

---

## Offboarding Checklist

The exit cannot be closed while any item is outstanding. Every access revoked, every asset returned, every document signed — then and only then does the record move to archive.

```mermaid
flowchart TD
    subgraph OB_HEADER[" Ananya Singh · Last day August 31"]
    end

    subgraph ACCESS_REV[" Access revocation"]
        AR1[☑ Google Workspace · Revoked · Aug 28]
        AR2[☑ GitHub · Revoked · Aug 28]
        AR3[☐ Slack · Pending]
        AR4[☐ Notion · Pending]
    end

    subgraph ASSETS_RET[" Asset return"]
        AS1[☑ MacBook Pro SN-XZ9201 · Returned · Aug 29]
        AS2[☐ Monitor LG4K-0042 · Pending]
    end

    subgraph EXIT_DOCS[" Exit documents"]
        ED1[☑ Exit interview · Aug 28]
        ED2[☑ Relieving letter issued · Aug 29]
        ED3[☐ Final settlement · Pending]
    end

    BLOCKED[3 items outstanding · Close exit — blocked]

    OB_HEADER --> ACCESS_REV
    OB_HEADER --> ASSETS_RET
    OB_HEADER --> EXIT_DOCS
    ACCESS_REV --> BLOCKED
    ASSETS_RET --> BLOCKED
    EXIT_DOCS --> BLOCKED
```

---

## Founder Dashboard

Read-only. Health, risk flags, and headcount trends. No buttons to change anything.

```mermaid
flowchart LR
    subgraph SUMMARY[" Workforce summary"]
        T[Total: 24]
        AC[Active: 19]
        OB2[Onboarding: 4]
        EX[Exiting this month: 1]
    end

    subgraph BREAKDOWN[" By worker type"]
        B1[Indian Employee · 12]
        B2[Indian Contractor · 6]
        B3[Global Contractor · 4]
        B4[Global Intern · 2]
    end

    subgraph FLAGS[" Compliance flags"]
        F1[⚠ 1 contract expiring in 14 days]
        F2[⚠ 2 reviews overdue]
    end

    subgraph TREND[" Headcount — last 90 days"]
        CHART[Line chart: 12 → 16 → 20 → 24]
    end

    SUMMARY --> BREAKDOWN
    SUMMARY --> FLAGS
    SUMMARY --> TREND
```

---

## Team Lead View

Scoped to their team. The only things a Team Lead can do are submit reviews and request offboarding.

```mermaid
flowchart TD
    subgraph TL_HEADER[" Akshat · Engineering Team · 4 members"]
    end

    subgraph TEAM[" My team"]
        TM1[Ananya Singh · Active · 60-day review due Aug 12 ⚠]
        TM2[Rohan Mehta · Active · 30-day review due Aug 5]
        TM3[Kavya Nair · Onboarding · No review yet]
        TM4[Sara Lim · Active · Weekly review due Aug 3 ⚠]
    end

    subgraph DUE[" Reviews due now"]
        RV1[Sara Lim · Weekly · Due Aug 3 → Start review]
        RV2[Ananya Singh · 60-day · Due Aug 12 → Start review]
    end

    SCOPE[You cannot see workers outside your team]

    TL_HEADER --> TEAM
    TEAM --> DUE
    DUE --> SCOPE
```

---

*Layouts are indicative. Final screens designed and built in Next.js during the build phase, July 1 onwards.*
