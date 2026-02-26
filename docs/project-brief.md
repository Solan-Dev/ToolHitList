# Project Brief – ToolHitList

## Overview

| Field | Value |
|-------|-------|
| Solution Name | ToolHitList |
| Publisher Prefix | `jsdev` |
| Solution Type | Power Apps Code App (Vite + React + Tailwind v4) |
| Primary Maker | James Solan – Solan IT |
| Target Environment | Dataverse (Dev → Test/UAT → Production via Pipelines) |
| Solution Package | `TaskList` |
| Status | In Development |

ToolHitList is an internal tech request management tool for a business technology team. It provides a structured end-to-end workflow for logging, triaging, prioritising, delivering, and measuring the impact of technology requests (app builds, flow automations, data work) raised by business teams.

The tool has two distinct surfaces:
- **Business-facing** — raise, track and comment on requests; view delivery progress via a Kanban board
- **Tech-specialist-facing** — review and enrich requests with technical context, sizing, approach and collaboration needs

---

## Problem Statement

Currently, technology requests arrive ad-hoc (email, Teams messages, verbal) with no consistent structure, no visibility of queue depth, no priority management, and no measurement of the impact delivered once work completes. This creates risk of important requests being lost, duplicated or under-scoped, and prevents the team from demonstrating value through time-saving metrics.

---

## Goals & Objectives

- [x] Provide a single place for business users to raise and track tech requests with a defined, consistent schema
- [x] Give the tech team a structured triage/enrichment workflow including complexity sizing and dependency mapping
- [x] Enforce a WIP-limited priority queue (Top 10 Backlog cap) to prevent over-commitment
- [x] Capture pre- and post-delivery time metrics to quantify ROI / time saved
- [x] Enable business users to leave post-production feedback once a request goes live
- [x] Support team-based filtering on the Kanban board for multi-team visibility

---

## Non-Goals

- This is **not** a full project management or sprint planning tool (no sprints, velocity, or burn-down)
- This is **not** a general helpdesk ticketing system (IT support requests are out of scope)
- No integration with external tools (Jira, Azure DevOps) in v1
- No automated time logging via integrations — time fields are manually entered
- No public-facing or external-user access

---

## Users & Personas

| Persona | Role Description | Key Needs |
|---------|-----------------|-----------|
| **Business Requester** | Business-side employee who raises a new request | Simple request form, ability to see status on the Kanban, post-production comments |
| **Business Leader / Manager** | Approves, prioritises and monitors requests for their business area | Kanban board by team, priority assignment, dependency visibility |
| **Tech Specialist** | Developer, architect or analyst who enriches and delivers the request | Back-of-house form: approach, t-shirt size, collaboration needs, dependent requests |
| **Tech Lead / Admin** | Manages queue, moves cards, enforces WIP cap, assigns work | Full Kanban control, team filtering, WIP management |

> **Open Question OQ-01:** How are personas distinguished at runtime? Options: (a) Dataverse security roles mapped to Entra groups, (b) a `Role` field on the user's record, (c) the app shows different views based on URL path and trusts the user to self-select. **Recommendation:** Dataverse security roles — define `jsdev_BusinessUser` and `jsdev_TechSpecialist` roles.

---

## Request Record — Field Schema

| Field | Type | Description | Who Sets It |
|-------|------|-------------|-------------|
| Title | Single line text | Short name for the request | Business Requester |
| Request Description | Multi-line text | Full description of what is needed and why | Business Requester |
| Requested By | Lookup → SystemUser | Person who originated the need (may differ from creator) | Business Requester |
| Created By | SystemUser (auto) | Logged-in user who submitted the form | System |
| Business Area | Choice / Lookup | Which part of the business this serves | Business Requester |
| Team | Choice / Lookup | Which tech team will own delivery | Tech Lead |
| Technology Touched | Multi-select Choice | e.g. Power Apps, Power Automate, Dataverse, SharePoint, Azure, Power BI | Tech Specialist |
| Assignee | Lookup → SystemUser | Tech team member responsible for delivery | Tech Lead |
| Status / Stage | Choice (see Workflow Stages) | Current position in the lifecycle | System / Tech Lead |
| Priority | Choice: Critical / High / Medium / Low | Business priority | Business Leader |
| T-Shirt Size | Choice: XS / S / M / L / XL | Tech complexity estimate | Tech Specialist |
| Technical Approach | Multi-line text | How the tech team plans to solve it | Tech Specialist |
| Collaboration Required | Yes/No + Multi-line text | Whether other departments need to be involved | Tech Specialist |
| Related Requests | N:N self-referential | Linked or dependent requests | Tech Lead / Tech Specialist |
| Dependency Notes | Multi-line text | Free-text description of dependencies | Tech Specialist |
| Time Currently Spent (hrs/wk) | Decimal Number | How long the business currently spends on this problem per week | Business Requester |
| Time Saved Estimate (hrs/wk) | Decimal Number | Estimated time saved per week post-delivery | Tech Specialist |
| Actual Time Saved (hrs/wk) | Decimal Number | Measured time saved — entered post-production by business user | Business Requester (post-production) |
| Target Delivery Date | Date | Expected completion date | Tech Lead |
| Created On | DateTime (auto) | Record creation timestamp | System |
| Modified On | DateTime (auto) | Last modified timestamp | System |

> **Open Question OQ-02:** Should `Business Area` and `Team` be free-text, a fixed Choice column, or a related lookup table? A lookup table (`jsdev_businessarea`, `jsdev_techteam`) allows the admin to manage the lists without a code deploy. **Recommendation:** Lookup tables.

> **Open Question OQ-03:** Should `Technology Touched` be a multi-select Choice or a related table? Multi-select Choice is simpler; a related table (`jsdev_technology`) allows richer metadata per technology. **Recommendation:** Multi-select Choice for v1.

---

## Workflow Stages

The request lifecycle has six stages mapped to Kanban columns. Transitions are controlled by role.

```
[Draft] → [Backlog] → [Top 10 Backlog] → [In Progress] → [Done] → [In Production]
```

| Stage | Kanban Column | Who Can Move To This Stage | Notes |
|-------|--------------|---------------------------|-------|
| **Draft** | Hidden from Kanban | Business Requester | Saved but not yet submitted |
| **Backlog** | Backlog | Business Requester (on submit) | Visible to all on board |
| **Top 10 Backlog** | Top 10 Backlog | Tech Lead | **Hard cap: max 10 items.** Attempting to add an 11th is blocked with an error message |
| **In Progress** | Doing | Tech Lead | Assignee must be set before moving here |
| **Done** | Done | Tech Lead / Assignee | Delivery complete; prompts business user to enter Actual Time Saved |
| **In Production** | In Production (separate view) | Tech Lead | Unlocks post-production comment thread and ROI calculation |

> **Open Question OQ-04:** Should the Kanban board show all six stages including Draft, or only Backlog → Done with In Production as a separate analytics/feedback view? **Recommendation:** Kanban shows Backlog → Done (4 columns). In Production is a separate "Live" tab.

> **Open Question OQ-05:** Should moving a card to Top 10 Backlog require a minimum set of fields to be filled (e.g. t-shirt size, assignee)? **Recommendation:** Yes — enforce validation gate: T-Shirt Size and Assignee required before Top 10 Backlog.

---

## Functional Requirements

### Business Surface

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Business user can create a new request via a structured form | Must Have |
| FR-02 | Business user can edit their own request while in Draft or Backlog | Must Have |
| FR-03 | Business user can view all requests on the Kanban board | Must Have |
| FR-04 | Business user can filter Kanban by Team | Must Have |
| FR-05 | Business user can set Priority on their own request | Must Have |
| FR-06 | Business user can enter `Time Currently Spent` on the request form | Must Have |
| FR-07 | Business user can enter `Actual Time Saved` once request moves to Done/In Production | Must Have |
| FR-08 | Business user can post a comment on a request that is In Production | Must Have |
| FR-09 | Business user can see linked/related requests from the Kanban card | Should Have |

### Kanban Board

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | Kanban has four columns: Backlog, Top 10 Backlog, Doing, Done | Must Have |
| FR-11 | Top 10 Backlog column enforces a hard WIP cap of 10 items with a visible count | Must Have |
| FR-12 | Cards show: Title, Requester, Team, Priority badge, T-Shirt Size badge, Assignee avatar | Must Have |
| FR-13 | Related/dependent requests are visually linked on the board (link icon + tooltip or expand) | Should Have |
| FR-14 | Kanban can be filtered by Team | Must Have |
| FR-15 | Kanban can be filtered by Assignee | Should Have |
| FR-16 | Cards are drag-and-drop movable between columns (Tech Lead only) | Should Have |

### Tech Specialist Surface

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-17 | Tech specialist can open a request and complete the technical enrichment form | Must Have |
| FR-18 | Tech specialist can set T-Shirt Size (XS/S/M/L/XL) with a guide tooltip per size | Must Have |
| FR-19 | Tech specialist can set Technology Touched (multi-select) | Must Have |
| FR-20 | Tech specialist can set Technical Approach | Must Have |
| FR-21 | Tech specialist can flag Collaboration Required and specify which departments | Must Have |
| FR-22 | Tech specialist can link Related Requests (many-to-many, searchable lookup) | Must Have |
| FR-23 | Tech specialist can set Time Saved Estimate | Should Have |

### Impact & ROI

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-24 | System calculates weekly hours saved = Actual Time Saved - 0 (or shows delta vs estimate) | Must Have |
| FR-25 | In Production tab shows a summary of live requests with their ROI metrics | Should Have |
| FR-26 | Total hours/week saved surfaced as a headline stat somewhere visible | Should Have |

### Comments

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-27 | Post-production comment thread on each In Production request | Must Have |
| FR-28 | Comments show author name, date, and body text | Must Have |
| FR-29 | Tech team can also post internal comments (visible in tech view only) | Should Have |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | App must load within 3 seconds on a standard corporate connection |
| NFR-02 | All data access enforced through Power Apps SDK connectors — no direct API calls |
| NFR-03 | Dataverse row-level security: users can only edit their own requests (Business Requester role) |
| NFR-04 | Responsive layout: usable at 1024px+ (desktop/tablet) |
| NFR-05 | Light and dark mode supported via `data-theme` toggle |
| NFR-06 | All Dataverse tables and columns use `jsdev_` prefix |

---

## Architecture Overview

```
Power Apps Code App (Vite + React 19 + Tailwind v4 + Power Apps SDK)
  │
  ├── /                    → Kanban Board (business + tech lead view)
  ├── /requests/new        → New Request Form (business)
  ├── /requests/:id        → Request Detail (tabbed: Overview | Technical | Comments | ROI)
  ├── /live                → In Production tab (ROI summary + comment threads)
  └── /settings            → Admin: manage Teams, Business Areas (Tech Lead only)
```

**Key layers:**
- `src/pages/` — route-level page components
- `src/components/app/` — domain composites: `RequestCard`, `KanbanBoard`, `KanbanColumn`, `TShirtBadge`, `ROIMetric`, `CommentThread`
- `src/components/ui/` — design system primitives (Button, Card, Badge, Input, etc.)
- `src/hooks/` — `useRequests`, `useComments`, `useTheme`
- `src/generated/` — Dataverse service/model files (auto-generated, never manually edited)

---

## Dataverse Schema

| Table (logical name) | Display Name | Key Columns |
|----------------------|--------------|-------------|
| `jsdev_toolhitlistrequest` | Tool Hit List Request | All request fields above |
| `jsdev_requestcomment` | Request Comment | `jsdev_requestid` (lookup), `jsdev_body`, `jsdev_commenttype` (Business/Internal), `createdby` |
| `jsdev_requestdependency` | Request Dependency | `jsdev_fromrequestid`, `jsdev_torequestid` (N:N self-referential via intersect table) |
| `jsdev_techteam` | Tech Team | `jsdev_name`, `jsdev_teamlead` |
| `jsdev_businessarea` | Business Area | `jsdev_name`, `jsdev_owner` |

> **Open Question OQ-06:** Should `jsdev_requestdependency` be a true N:N relationship (Dataverse relationship) or an intersect table managed manually? Dataverse native N:N is cleaner but has SDK limitations. **Recommendation:** Native N:N relationship on `jsdev_toolhitlistrequest` (self-referential); confirm SDK support before building.

---

## Environment Setup

| Environment | URL | Branch | Deploy Command |
|-------------|-----|--------|----------------|
| Dev | `https://orgfe8637fb.crm11.dynamics.com` | `feature/*` | `npx power-apps push -s TaskList` |
| Test/UAT | `https://<test>.crm.dynamics.com` | `main` | Power Platform Pipelines |
| Production | `https://<prod>.crm.dynamics.com` | tagged release | Power Platform Pipelines |

---

## Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dataverse N:N self-referential relationship not supported by SDK `getAll` | Related tasks feature blocked | Prototype early; fallback to intersect table with two lookup columns |
| WIP cap logic must be enforced client-side AND server-side | Users could bypass the cap via direct Dataverse writes | Add a Dataverse real-time workflow/plugin to enforce cap server-side |
| Role-based view switching complexity | Incorrect data exposure | Define Dataverse security roles before any page build begins |
| Top 10 Backlog ordering — who decides position 1 vs 10? | Priority within WIP queue unclear | Add a `jsdev_queueposition` integer field (1–10) to Top 10 Backlog items |

---

## Open Questions Summary

| ID | Question | Blocks |
|----|----------|--------|
| OQ-01 | How are personas distinguished at runtime? | All role-gated features |
| OQ-02 | Business Area and Team — Choice or Lookup table? | Schema design |
| OQ-03 | Technology Touched — multi-select Choice or related table? | Schema design |
| OQ-04 | Does Kanban show all 6 stages or 4 + separate In Production view? | Kanban layout |
| OQ-05 | Validation gate before Top 10 Backlog — required fields? | Stage transition logic |
| OQ-06 | N:N self-referential relationship — native Dataverse or intersect table? | Dependency feature |
| OQ-07 | Should notifications (Teams/email) fire on assignment or status changes? | Out of scope for v1? |
| OQ-08 | Should there be due dates / SLA target fields on requests? | Schema design |
| OQ-09 | Can a Business Requester see the Technical Approach and T-Shirt Size, or is that internal only? | Request detail page permissions |
| OQ-10 | Is there a reporting/summary dashboard (total requests, avg delivery time, total hrs saved)? | In Production tab scope |

---

## Suggested Build Order (Milestones)

| Milestone | Scope |
|-----------|-------|
| **M1 – Schema** | Define and create all Dataverse tables, columns, relationships and security roles. Run `pac code add-data-source`. |
| **M2 – Request CRUD** | New Request form, Request detail view, edit/delete. Business user persona. |
| **M3 – Kanban Board** | 4-column board, WIP cap, team filter, card component. |
| **M4 – Tech Enrichment** | Technical form tab on request detail, t-shirt sizing, approach, collaboration, dependencies. |
| **M5 – ROI & Comments** | Impact fields, In Production stage, post-production comment thread. |
| **M6 – Polish & Deploy** | Reporting stats, notifications (if in scope), UAT, production deploy. |

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-02-26 | James Solan | Initial scaffold (empty template) |
| 2026-02-26 | James Solan / Copilot | Full requirements pass from project dump |
