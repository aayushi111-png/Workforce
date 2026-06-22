# KATBOTZ Workforce Operations Platform (WOP)

> Architecture and product repository.
> Prepared for the Technical Head, KATBOTZ.
> Source: discovery session, 16 June 2026 (Akshat Mishra, Aayushi Pandey).

---

## What this is

WOP is the central workforce layer for KATBOTZ. It sits between recruitment and payroll and becomes the operational system of record for every worker who is not handled by US payroll.

```
Zoho Recruit  →  WOP  →  Gusto
   (hire)      (operate)  (US pay)
```

This repository is the full architecture, written to be read and edited by you. Every document is plain Markdown so it can live on GitHub, be diffed, and be changed by anyone on the team.

---

## How to read it

Start at `01` and move down. Each document is self contained and scannable: short lines, tables, and diagrams rather than walls of text.

| # | Document | What it answers |
|---|----------|-----------------|
| 00 | [Proposal and Approval](00-proposal-and-approval.md) | Everything in one, with a sign off page. **Read this first.** |
| 01 | [Executive Summary](01-executive-summary.md) | What WOP is, why it is needed, what changes |
| 02 | [Product Blueprint](02-product-blueprint.md) | Scope, principles, the worker types, the capabilities |
| 03 | [User Roles and Experiences](03-user-roles-and-experiences.md) | How each person sees and feels a different system |
| 04 | [Workforce Lifecycle](04-workforce-lifecycle.md) | The nine stages a worker moves through |
| 05 | [Functional Modules](05-functional-modules.md) | The twelve modules and how they connect |
| 06 | [System Architecture](06-system-architecture.md) | The stack, the layers, the request path, the katbotz.com link |
| 07 | [Database Architecture](07-database-architecture.md) | The data model and where every byte is stored |
| 08 | [Security and Compliance](08-security-and-compliance.md) | Auth, encryption, audit, DPDP, retention |
| 09 | [Integrations, Scalability, Roadmap](09-integrations-scalability-roadmap.md) | What connects, how it grows, and by when |
| 10 | [Build Plan and Budget](10-build-plan-and-budget.md) | Solo build planner at 4 hours a day, and what it costs |

---

## How to edit it

- Edit any `.md` file directly. Headings, tables and bullet lists are standard Markdown.
- Diagrams are written in **Mermaid** inside fenced code blocks. GitHub renders them automatically. Change the text, the picture updates.
- Anything that needs a real decision or a real number is marked with a callout:

> **DECISION NEEDED:** text describing the call you need to make.

> **EDIT ME:** a placeholder value to replace with the real one.

---

## Conventions

- This document set avoids dashes as punctuation by house style. Compound terms are written open (for example "role based access", "self service", "single source of truth").
- "Worker" is the umbrella term for an employee, contractor or intern.
- "Non US workforce" means everyone not run through Gusto: Indian employees, Indian contractors, global contractors and global interns.

---

## Status

| Field | Value |
|-------|-------|
| Version | v1 (architecture draft) |
| Owner | Technical Head, KATBOTZ |
| Prepared by | (you) |
| Last updated | June 2026 |
