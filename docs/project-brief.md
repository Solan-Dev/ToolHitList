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

> **OQ-01 RESOLVED:** Roles are determined by Entra security group membership → Dataverse team membership. **MVP: all users see all parts of the app — no gating required.** Post-MVP: Dataverse teams control visibility. `jsdev_BusinessUser` team sees business surface; `jsdev_TechSpecialist` team sees the enrichment form and internal comments. Build the app now with a `<RoleGate role="TechSpecialist">` wrapper component that in MVP simply renders its children unconditionally — this means gating can be switched on post-MVP without a structural refactor.

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
| Technology Touched | Multi-select Choice | Fixed list: Power Apps, Power Automate, Dataverse, SharePoint, Azure, Power BI, Copilot Studio, Other | Tech Specialist |
| Assignee | Lookup → SystemUser | Tech team member responsible for delivery | Tech Lead |
| Status / Stage | Choice (see Workflow Stages) | Current position in the lifecycle | System / Tech Lead |
| Priority | Choice: Critical / High / Medium / Low | Business priority | Business Leader |
| T-Shirt Size | Choice: XS / S / M / L / XL | Tech complexity estimate — visible to business users (read-only) | Tech Specialist |
| Technical Approach | Multi-line text | High-level approach — visible to business users (read-only) | Tech Specialist |
| Collaboration Required | Yes/No + Multi-line text | Whether other departments need to be involved | Tech Specialist |
| Dependency Notes | Multi-line text | Free-text description of dependencies | Tech Specialist |
| Due Date | Date | Target delivery date | Tech Lead |
| Time Currently Spent (hrs/wk) | Decimal Number | How long the business currently spends on this problem per week | Business Requester |
| Time Saved Estimate (hrs/wk) | Decimal Number | Estimated time saved per week post-delivery | Tech Specialist |
| Actual Time Saved (hrs/wk) | Decimal Number | Measured time saved — entered post-production by business user | Business Requester (post-production) |
| Queue Position | Integer (1–10) | Ordering within Top 10 Backlog; null for all other stages | Tech Lead |
| Created On | DateTime (auto) | Record creation timestamp | System |
| Modified On | DateTime (auto) | Last modified timestamp | System |

> **OQ-02 RESOLVED:** Both `Business Area` and `Tech Team` use Dataverse lookup tables (`jsdev_businessarea`, `jsdev_techteam`). Admins manage the lists directly in Dataverse — no code deploy needed. The request form must use a searchable typeahead `<DataverseLookupSelect>` component with debounced filtering.

> **OQ-03 RESOLVED:** `Technology Touched` is a **multi-select Choice column** on `jsdev_toolhitlistrequest`. Fixed list — no related table needed in v1.

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
| FR-02 | Business user can edit their own request while in Draft or Submitted stage | Must Have |
| FR-03 | Business user can view the Kanban board (Top 10 Backlog → In Production columns) | Must Have |
| FR-04 | Business user can filter Kanban by Team | Must Have |
| FR-05 | Business user can set Priority on their own request | Must Have |
| FR-06 | Business user can enter `Time Currently Spent` on the request form | Must Have |
| FR-07 | Business user can enter `Actual Time Saved` once request moves to Done/In Production | Must Have |
| FR-08 | Business user can post a comment on a request that is In Production | Must Have |
| FR-09 | Business user can see T-Shirt Size and Technical Approach on the request detail (read-only) | Must Have |
| FR-10 | Business user can see linked/related requests from the request detail view | Should Have |

### Inbox (Tech Lead View)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-11 | Tech Lead has an Inbox view listing all Submitted requests not yet on the Kanban | Must Have |
| FR-12 | Tech Lead can promote a Submitted request to Top 10 Backlog (validation gate enforced) | Must Have |
| FR-13 | Tech Lead can reject/return a request to Draft with a note | Should Have |

### Kanban Board

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-14 | Kanban has four columns: Top 10 Backlog, Doing, Done, In Production | Must Have |
| FR-15 | Top 10 Backlog column enforces a hard WIP cap of 10 with a visible `x/10` counter | Must Have |
| FR-16 | A card can be de-escalated from Top 10 Backlog back to Submitted (frees the WIP slot) | Must Have |
| FR-17 | Cards show: Title, Business Area, Priority badge, T-Shirt Size badge, Assignee, Due Date | Must Have |
| FR-18 | Related/dependent requests shown on card via a link icon with tooltip count | Should Have |
| FR-19 | Kanban can be filtered by Team | Must Have |
| FR-20 | Kanban can be filtered by Assignee | Should Have |
| FR-21 | Cards are drag-and-drop movable between columns | Should Have |

### Tech Specialist Surface

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-22 | Tech specialist can open a request and complete the technical enrichment tab | Must Have |
| FR-23 | Tech specialist can set T-Shirt Size (XS/S/M/L/XL) with a sizing guide tooltip | Must Have |
| FR-24 | Tech specialist can set Technology Touched (multi-select Choice) | Must Have |
| FR-25 | Tech specialist can write Technical Approach (visible to business users read-only) | Must Have |
| FR-26 | Tech specialist can flag Collaboration Required and specify which departments | Must Have |
| FR-27 | Tech specialist can link Related Requests via `jsdev_requestdependency` intersect table (searchable) | Must Have |
| FR-28 | Tech specialist can set Time Saved Estimate and Due Date | Must Have |
| FR-29 | Tech specialist can post internal-only comments not visible to business users | Should Have |

### Impact & ROI

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | System displays: Estimated hrs/wk saved, Actual hrs/wk saved, and delta vs estimate on request detail | Must Have |
| FR-31 | `/live` dashboard shows all In Production requests with ROI metrics per item | Must Have |
| FR-32 | `/live` dashboard headline stats: total requests live, total hrs/wk saved, avg delivery time | Must Have |
| FR-33 | ROI dashboard filterable by Business Area and/or Team | Should Have |

### Comments

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-34 | Post-production comment thread on each In Production request (visible to all) | Must Have |
| FR-35 | Comments show author name, timestamp, and body | Must Have |
| FR-36 | Internal comments tab on request detail (Tech Specialist authored; not shown to business users) | Should Have |

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
  ├── /                    → Kanban Board (4 columns: Top 10 Backlog | Doing | Done | In Production)
  ├── /inbox               → Tech Lead Inbox (Submitted requests awaiting promotion)
  ├── /requests/new        → New Request Form (business)
  ├── /requests/:id        → Request Detail (tabbed: Overview | Technical | Comments | ROI)
  ├── /live                → ROI Dashboard (headline stats + In Production list + comment threads)
  └── /settings            → Admin: manage Teams, Business Areas
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
| `jsdev_requestcomment` | Request Comment | `jsdev_requestid` (lookup), `jsdev_body`, `jsdev_commenttype` Choice (Business/Internal), `createdby` (auto) |
| `jsdev_requestdependency` | Request Dependency | Intersect table: `jsdev_fromrequestid` (lookup → request), `jsdev_torequestid` (lookup → request), `jsdev_dependencytype` Choice (Related/Blocks/Blocked By) |
| `jsdev_techteam` | Tech Team | `jsdev_name`, `jsdev_teamlead` (lookup → SystemUser) |
| `jsdev_businessarea` | Business Area | `jsdev_name`, `jsdev_owner` (lookup → SystemUser) |

> **OQ-06 RESOLVED:** `jsdev_requestdependency` is a **manual intersect table** (not a native Dataverse N:N relationship). Two lookup columns pointing at `jsdev_toolhitlistrequest` — `jsdev_fromrequestid` and `jsdev_torequestid`. This avoids SDK limitations with self-referential N:N and gives full CRUD control via generated services.

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
| WIP cap enforced client-side only — direct Dataverse writes bypass it | Cap can be exceeded | Add a real-time Power Automate flow or low-code plugin on `jsdev_toolhitlistrequest` create/update to enforce cap server-side |
| Queue position management on de-escalation | Gaps in 1–10 sequence when cards are removed | Recalculate `jsdev_queueposition` on every promote/de-escalate action in the app |
| Role-based view switching post-MVP | Incorrect data exposure if gating switched on without testing | `<RoleGate>` component is in place from MVP; test with Dataverse team membership before enabling |

---

## Open Questions Summary

| ID | Question | Blocks |
|----|----------|--------|
| ~~OQ-01~~ | ~~How are personas distinguished at runtime?~~ | ✅ Entra group → Dataverse team. MVP = open access; post-MVP = `<RoleGate>`. |
| ~~OQ-02~~ | ~~Business Area and Team — Choice or Lookup table?~~ | ✅ Lookup tables + `<DataverseLookupSelect>` typeahead. |
| ~~OQ-03~~ | ~~Technology Touched — multi-select Choice or related table?~~ | ✅ Multi-select Choice column. Fixed list in v1. |
| ~~OQ-04~~ | ~~Kanban stages — all 6 or 4 + separate view?~~ | ✅ 4-column Kanban (Top 10 Backlog → In Production). Draft/Submitted in separate Inbox. |
| ~~OQ-05~~ | ~~Validation gate + de-escalation?~~ | ✅ T-Shirt Size + Assignee required to promote. De-escalation back to Submitted supported. |
| ~~OQ-06~~ | ~~N:N dependency — native or intersect table?~~ | ✅ Manual intersect table `jsdev_requestdependency` with two lookup columns. |
| ~~OQ-07~~ | ~~Notifications on assignment/status change?~~ | ➡️ Moved to Nice to Have (see below). |
| ~~OQ-08~~ | ~~Due dates / SLA?~~ | ✅ Due Date field added. No SLA in v1. |
| ~~OQ-09~~ | ~~Can business users see Technical Approach and T-Shirt Size?~~ | ✅ Yes — read-only on request detail Overview tab. |
| ~~OQ-10~~ | ~~Reporting/summary dashboard?~~ | ✅ `/live` ROI dashboard with headline stats, per-item metrics, and filters. |

---

## Suggested Build Order (Milestones)

| Milestone | Scope |
|-----------|-------|
| **M1 – Schema** | Create all Dataverse tables, columns, Choice fields, lookup relationships, intersect table. Run `pac code add-data-source` for each table. |
| **M2 – Request CRUD** | New Request form (with `<DataverseLookupSelect>` for Business Area/Team), Request detail view (Overview tab), edit/delete. |
| **M3 – Inbox + Kanban** | Tech Lead Inbox, promotion/de-escalation logic, WIP cap enforcement, 4-column Kanban with filters, `<RequestCard>` component. |
| **M4 – Tech Enrichment** | Technical tab on request detail: T-Shirt Size, Technology Touched, Approach, Collaboration, Dependencies (`jsdev_requestdependency`). `<RoleGate>` component (renders freely in MVP). |
| **M5 – ROI & Comments** | Impact fields, In Production stage, post-production comment thread, internal comments tab. |
| **M6 – Dashboard & Deploy** | `/live` ROI dashboard with headline stats and filters. UAT. Production deploy via Pipelines. |

---

## Nice to Have (Post-MVP)

| ID | Feature |
|----|--------|
| NTH-01 | **Notifications** — Power Automate flow sends Teams/email notification when a request is assigned, promoted to Top 10, or status changes |
| NTH-02 | **Role gating** — switch on `<RoleGate>` using Dataverse team membership via `PowerApps.getContext()` |
| NTH-03 | **Avg delivery time** — calculated field or dashboard metric: days from Submitted → Done |
| NTH-04 | **Export to Excel** — download Kanban/ROI data |
| NTH-05 | **Mobile-responsive layout** — extend below 1024px breakpoint |

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-02-26 | James Solan | Initial scaffold (empty template) |
| 2026-02-26 | James Solan / Copilot | Full requirements pass from project dump |
| 2026-02-26 | James Solan / Copilot | Resolved OQ-03 through OQ-10; all open questions closed; Nice to Have section added |
