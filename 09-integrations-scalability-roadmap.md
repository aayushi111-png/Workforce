# 09 · Integrations, Scalability, Roadmap

## Integrations

Phased deliberately. WOP delivers value with zero integrations at launch. Integrations come later to remove manual steps, never as a prerequisite for going live.

| System | Now | Later |
|--------|-----|-------|
| Zoho Recruit | Manual trigger, HR creates the worker after offer acceptance | Zoho Recruit API: offer accepted auto creates the worker |
| Google Workspace | Account creation tracked manually | Automated provisioning through Admin APIs |
| GitHub | Repository and team access tracked | Auto team assignment and removal |
| SAP | *(include only if KATBOTZ uses SAP — confirm before launch)* | Provisioning where APIs allow |
| Gusto | Reference only | Reference only, by design, never replaced |

> **Design principle:** the platform is fully usable before any integration exists. Integrations remove typing and reduce error; they are never the thing that blocks launch.

---

## Scalability

| Stage | Workers |
|-------|---------|
| Today | 100 |
| Expected | 500, then 1,000, then 5,000 plus |

The architecture supports growth **without redesign**:

- Multi location workforce
- Multiple departments
- Multiple business units
- Additional worker types

This holds because the stack is serverless and pay per use (Firestore, Cloud Storage, Cloud Run, Cloud Functions all scale on demand), and because worker type and role are configuration, not hard coded paths. Adding a fifth worker type is a checklist and a permission row, not a rewrite.

---

## Roadmap

> **EDIT ME:** dates assume a project start of July 2026 and a small dedicated team. They are planning targets, not commitments.

| Phase | What ships | Window |
|-------|-----------|--------|
| 0 Discovery | Design, data model, Aadhaar and DPDP decision, environments | July 2026, about 3 weeks |
| 1 MVP | Worker creation, onboarding, upload, verification, compliance, directory, migrate off Sheets | July to mid October 2026 |
| 2 Lifecycle | Contract lifecycle, performance, asset management, offboarding, access tracking | October 2026 to January 2027 |
| 3 Automation | Dashboards, notifications, renewal and expiry alerts | January to February 2027 |
| 4 Integrations | Zoho webhook, Google Workspace, GitHub (SAP if applicable) | March to April 2027 |

- **First usable release:** mid October 2026.
- **Full platform:** end April 2027.

---

## Open decisions, collected

Everything marked across this repository that needs your call, in one place:

| From | Decision |
|------|----------|
| 01 | Is the set of four worker types complete for launch |
| 02 | Confirm build over buy |
| 03 | Can HR Executive verify, or only review and flag |
| 03 | Is Founder access read only, or read plus reports |
| 04 / 07 / 08 | Retention period (assumed 3 years) |
| 06 | REST or GraphQL |
| 06 | katbotz.com hosting, and subdomain vs path |
| 07 | Sub collections or top level collections |
| 07 | Full text search at launch, or filter plus prefix |
| 08 | Aadhaar handling approach under DPDP and UIDAI |
| 10 | Coding cadence (7, 6 or 5 days a week) |
| 10 | Strictly solo, or help from Aayushi or Akshat |

The full version of this list, with my default for each, is in [00 Proposal and Approval](00-proposal-and-approval.md), Section 10.

---

## Next steps to start the build

1. Settle the Aadhaar and DPDP approach (Phase 0 compliance call).
2. Confirm worker types, checklists and the role permission matrix with HR.
3. Decide manual verification first, or automated from day one.
4. Lock the design, data model and environments in the three week Phase 0.
5. Build the MVP, aiming for real onboardings on WOP by mid October 2026.
