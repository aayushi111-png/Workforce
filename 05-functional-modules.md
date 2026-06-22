# 05 · Functional Modules

Twelve modules. Each does one job and hands off to the next, which is what turns a set of features into a single workflow.

---

## How they connect

```mermaid
flowchart LR
    M1[1 Worker Creation] --> M2[2 Document Mgmt]
    M2 --> M3[3 Verification]
    M3 --> M4[4 Compliance]
    M4 --> M5[5 Access Mgmt]
    M5 --> M6[6 Workforce Directory]
    M6 --> M7[7 Contract Lifecycle]
    M6 --> M8[8 Performance]
    M6 --> M9[9 Asset Mgmt]
    M7 --> M10[10 Offboarding]
    M8 --> M10
    M9 --> M10
    M11[11 Notifications] -.fires across all.-> M6
    M12[12 Reporting] -.reads all.-> M6
```

Module 11 (Notifications) and Module 12 (Reporting) are cross cutting: they sit beside every stage rather than inside one.

---

## Module 1 · Worker Creation

- **Purpose:** create the workforce record once an offer is accepted
- **Input:** name, contact, worker type, department, manager, joining date
- **Output:** Worker ID, profile, workspace, checklists, tasks
- **Roles:** Senior HR

## Module 2 · Document Management

- **Purpose:** collect and store every document
- **Stores:** PAN, Aadhaar, passport, agreements, certificates
- **Output:** a complete, per worker document set, files in Cloud Storage, metadata in Firestore
- **Roles:** worker uploads, HR reviews

## Module 3 · Verification Engine

- **Purpose:** track the verification status of each item
- **Mode:** manual review only at launch (automation optional later)
- **Status:** Pending, Verified, Rejected
- **Roles:** Senior HR verifies, HR Executive reviews

## Module 4 · Compliance Engine

- **Purpose:** decide whether a worker is ready to be active
- **Checks:** documents complete, verification complete, agreements signed
- **Output:** ready for activation, or a clear list of what is missing
- **Roles:** system

## Module 5 · Access Management

- **Purpose:** track company accounts and permissions
- **Tracks:** Google, GitHub, SAP, Slack
- **Status:** Requested, Provisioned, Active, Revoked
- **Roles:** HR tracks, IT provisions in the target system

## Module 6 · Workforce Directory

- **Purpose:** the searchable single source of truth for active workers
- **Holds:** current details, department, manager, location, status, projects
- **Output:** find any worker, see current state and full history
- **Roles:** HR full, Manager scoped to team

## Module 7 · Contract Lifecycle

- **Purpose:** manage contractor engagements so none lapses unnoticed
- **Tracks:** SOW, invoices, renewals, expiry alerts at 90, 60, 30, 7 days
- **Output:** live contract status and an end to end invoice flow
- **Roles:** HR manages, contractor submits invoices

## Module 8 · Performance Management

- **Purpose:** track the right reviews for each worker type, on schedule
- **Employee:** 30, 60, 90 day, probation, annual
- **Intern:** weekly, monthly, PPO recommendation
- **Contractor:** delivery evaluation, renewal recommendation
- **Roles:** Manager submits, Senior HR oversees

## Module 9 · Asset Management

- **Purpose:** track what hardware a worker holds
- **Tracks:** laptop, monitor, SIM, accessories
- **Output:** a per worker asset list, reconciled at exit
- **Roles:** HR manages

## Module 10 · Offboarding

- **Purpose:** run a clean exit with nothing left open
- **Tracks:** access revocation, asset return, exit documents
- **Rule:** cannot close while any access or asset remains outstanding
- **Roles:** Senior HR runs, Manager can request

## Module 11 · Notification Engine

- **Purpose:** send the right automated message at the right moment
- **Triggers:** missing document, contract expiry, review due, offboarding started
- **Tech:** Cloud Functions for scheduling, SendGrid or Gmail for delivery
- **Roles:** system

## Module 12 · Reporting and Analytics

- **Purpose:** give every audience the view it needs
- **Provides:** HR, contractor, compliance and leadership dashboards
- **Output:** exports to PDF and spreadsheet, plus the append only audit log
- **Roles:** Founder and Senior HR
