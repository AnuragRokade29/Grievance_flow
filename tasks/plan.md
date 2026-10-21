# Implementation Plan: Admin Portal Expansion (Task Management, Meeting Schedule, Screen Master & Workbench)

## Overview
Expand the **Amravati Municipal Corporation (AMC)** Admin Portal (`admin.html`) with the full suite of administrative workflows identified from the Figma prototype (`https://list-fact-59566725.figma.site/`) and the user's reference screenshots:
1. **Task Management**: Department-level task tracking, 7 priority/status KPI cards, Officer Performance Analytics with compliance rate bars, and Assign Task workflow.
2. **Meeting Schedule**: Meetings & Events Hub with 3 KPI metric cards, Upcoming Meetings vs Meeting History tabs, department/type/date filtering, and "Schedule New Meeting" modal.
3. **Master Configuration**:
   - **Department Master**: 4 KPI cards (Total 66, Active 66, Inactive 0, Managed 193), bilingual English/Marathi department table, and "+ Add Department" drawer.
   - **Screen Master**: Module access control, role-based visibility matrix, and screen activation toggles.
4. **Enhanced Workbench (Accordion Stepper)**: Replicating the user's latest reference screenshot where each row expands into an inline dossier with a 4-stage lifecycle stepper, SLA countdown, and quick assignment triggers.

All features are implemented strictly in **pure HTML5, modular Vanilla CSS3, and modern ES6 JavaScript** with local persistence in `localStorage` and zero external dependencies.

---

## Architecture & Design Decisions

### 1. Unified 5-Layer Vanilla Architecture
```text
admin.html (Semantic Shell & Layout)
  ├── Header & Active Session Bar (Prajval Bhoyar, Municipal Admin)
  ├── Left Sidebar Navigation (Master [Dept/Screen], All Complaints, Workbench, Tasks, Meetings)
  └── Dynamic View Container
        ├── Screen 1: All Complaints (193 Queue Table)
        ├── Screen 2: Workbench (Expandable Stepper Accordion)
        ├── Screen 3: Task Management (7 Priority KPIs + Officer Analytics)
        ├── Screen 4: Meeting Schedule (Upcoming & History + Scheduler)
        ├── Screen 5: Department Master (Bilingual 66 Depts Table)
        └── Screen 6: Screen Master (Access Control Matrix)
```

### 2. State & Data Layer (`js/store.js`)
We will expand `Store` with four dedicated storage keys:
- `NTIS_COMPLAINTS_V1`: Municipal complaints with timeline steps and assignment metadata.
- `NTIS_TASKS_V1`: Internal tasks with priority (High/Medium/Low), assigned officer, department, and compliance metrics.
- `NTIS_MEETINGS_V1`: Municipal meetings (review meetings, public hearings, grievance escalations) with agenda, date/time, and attendee lists.
- `NTIS_DEPTS_V1`: 66 municipal departments with HODs and SLAs.
- `NTIS_SCREENS_V1`: Screen access definitions and role permissions.

### 3. UI/UX Design System (`css/components.css`)
- **Municipal Color Tokens**:
  - Primary Civic Navy: `#1e293b`
  - Emerald Action Green: `#059669` / `#00875a`
  - Warning/Pending Amber: `#f59e0b` / `#fffbeb`
  - Critical Red: `#dc2626` / `#fee2e2`
  - Subtle Surface: `#f8fafc` / Border `#e2e8f0`
- **Typography**: Inter + Mukta / Noto Sans Devanagari for bilingual rendering.
- **Components**:
  - Horizontal 4-stage lifecycle stepper with animated active node.
  - 7-grid priority stat cards.
  - Compliance rate progress bars (`0%` to `100%`).
  - Draggable Before/After evidence comparison slider.
  - Slide-over drawers and accessible backdrop modals.
  - Sonner-style floating toast alerts.

---

## Detailed Task Breakdown

### Phase 1: Data Model & Store Expansion (`js/store.js`)
- [x] **Task 1: Tasks & Analytics Schema**
  - Add `SEED_TASKS`: Tasks across Health, Property Tax, PWD, Trade License, and Water Supply.
  - Add `SEED_OFFICERS`: Officers (Ramesh Patil, Suresh Kumar, Anjali Nair, Mohammed Akhtar, Sunita Patil) with designation, tasks assigned, pending, completed, and compliance rate.
  - Add Store methods: `getTasks()`, `createTask(payload)`, `updateTaskStatus(id, status)`, `getOfficerAnalytics()`.
- [x] **Task 2: Meetings & Events Schema**
  - Add `SEED_MEETINGS`: 3 initial meetings (1 Upcoming: "Ward 3 Pothole Escalation Review", 2 History: "Monsoon Sewerage Review", "Inter-Departmental Coordination").
  - Add Store methods: `getMeetings()`, `scheduleMeeting(payload)`, `cancelMeeting(id)`.
- [x] **Task 3: Screen Master Schema**
  - Add `SEED_SCREENS`: Definitions for Dashboard, All Complaints, Workbench, Task Manager, Meetings, Department Master, Screen Master.
  - Add role toggle permissions.

### Phase 2: Navigation & Sidebar Integration (`admin.html`, `css/components.css`)
- [x] **Task 4: Expanded Sidebar Navigation**
  - Update `admin.html` sidebar:
    - Master dropdown: `Department Master` and `Screen Master`.
    - Main nav items: `All Complaints`, `Workbench`, `Task Management`, `Meeting Schedule`.
  - Add icons, active pill indicators, and smooth accordion transitions.
- [x] **Task 5: Global Header Active Session Bar**
  - Keep Prajval Bhoyar (Municipal Admin) profile badge with logout trigger.
  - Add active session indicator (`System Administrator • Session Time: 00:01:13`).

### Phase 3: Screen Implementations (`admin.html`, `js/admin.js`, `css/components.css`)

- [x] **Task 6: Task Management Screen (Matching Figma Screenshot)**
  - **Left Sub-Sidebar**:
    - Header: `📁 TASK MANAGER` with `Dashboard` & `Assign Task` tabs.
    - Department selector list: Health, Property Tax, PWD, Trade License, Water Supply with officer counts and task badges.
  - **Top 7 KPI Metric Cards**:
    - `Total Tasks`, `Assigned`, `In Progress`, `Completed`, `High Priority` (Red), `Medium Priority` (Amber), `Low Priority` (Green).
  - **Officer Performance Analytics Table**:
    - Search officer filter.
    - Columns: Officer & Designation, Total Tasks, Assigned, Pending, In Progress, Completed, Compliance Rate (progress bar).
    - Pagination controls.
  - **Assign Task Modal**:
    - Form to create and dispatch new tasks to municipal officers.

- [x] **Task 7: Meeting Schedule Screen (Matching Figma Screenshot)**
  - **Top 3 KPI Metric Cards**:
    - `Total Meetings: 3` (Blue), `Upcoming Meetings: 1` (Green), `Completed Meetings: 1` (Purple).
  - **Action Button**:
    - `📅 Schedule New Meeting` button opening modal.
  - **Tabs Bar**:
    - `⏱ Upcoming Meetings` vs `📄 Meeting History` tabs.
  - **Filters Toolbar**:
    - Department dropdown, Meeting Type dropdown, From Date, To Date, `Download Report`, `Reset Filters`.
  - **Meetings Table & Cards**:
    - Detailed meeting items with meeting title, department, date/time, venue/link, presiding officer, and agenda.
  - **Schedule Meeting Modal**:
    - Meeting Title, Department, Meeting Type, Date, Time, Presiding Officer, Venue, and Agenda notes.

- [x] **Task 8: Enhanced Workbench Screen (Matching User Screenshots 2 & 3)**
  - **Filter Toolbar**:
    - Pills: `All 193` (Active dark green), `Unassigned 193`, `Assigned 0`.
    - Dropdowns: Search complaints, All departments, All officers, All statuses, Sort order, Date pickers.
  - **Accordion Table**:
    - Table with columns: `Complaint`, `Images / Evidence`, `Department / Area`, `Assigned officer`, `Status`, `Actions`.
    - Expandable inline row: Clicking row opens an inline card featuring:
      - Status pill, SLA remaining countdown (`47h remaining`), status updated timestamp.
      - Action button: `Assign Officer` (opens modal), `View Full Dossier →`.
      - 4-stage horizontal stepper (1. Grievance Submitted [Current], 2. Field Unit Assigned, 3. Under Review & Inspection, 4. Resolved & Closed).
  - Row action buttons: `Assign` green button, Clock SLA button.

- [x] **Task 9: Department Master Screen (Matching User Screenshot 1)**
  - **Header & 4 KPI Cards**:
    - `Total Departments: 66`, `Active Departments: 66`, `Inactive Departments: 0`, `Grievances Managed: 193`.
  - **Search & Filter Tabs**:
    - Search input + `All` | `Active` | `Inactive` filter tabs.
  - **Bilingual Department Table**:
    - Columns: `ID`, `Department Name` (with English + Marathi text, and dept icon), `Status` (● Active), `Actions` (View, Edit, Delete).
    - Seeded with the 9 core municipal wings (PWD, Water Supply, Sewerage & Drainage, Street Lighting, Road Maintenance, Traffic Engineering, Electrical, Municipal Buildings, Garden & Horticulture).
  - **+ Add Department Drawer**:
    - Form to add new department with code, English/Marathi names, HOD, and SLA.

- [x] **Task 10: Screen Master Screen**
  - **Access Control Matrix**:
    - Table listing all screens (`Citizen Portal`, `All Complaints`, `Workbench`, `Task Management`, `Meeting Schedule`, `Department Master`, `Reports`).
    - Roles: `Municipal Admin`, `Department HOD`, `Ward Officer`, `Field Engineer`, `Clerk`.
    - Interactive toggle checkboxes saving permissions directly into `localStorage`.

### Phase 5: Verification & Presentation Polish
- [x] **Task 11: End-to-End Verification**
  - Verify seamless switching between all 6 admin views with zero page reloads.
  - Verify Task Management metrics, officer filtering, and task creation.
  - Verify Meeting Schedule filtering, tab toggles, and new meeting scheduling.
  - Verify Workbench row expand/collapse and stepper status updating.
  - Verify cross-tab sync with `index.html`.

### Phase 6: Interactive Authentication & Profile Dropdowns (Citizen & Admin)
- [ ] **Task 12: Citizen Profile Badge, Dropdown & Dynamic Login/Registration**
  - Add `Store.getCitizenUser()`, `Store.setCitizenUser()`, `Store.loginCitizen(name, phone)`, `Store.logoutCitizen()` in `js/store.js`.
  - Add Citizen Profile Dropdown in `index.html` displaying user details, ticket link, and Logout button.
  - Add Citizen Login / Register Modal in `index.html` allowing unauthenticated / new citizens to register/login by entering their name and phone.
  - When logged out, header badge shows "Guest Citizen" / "Click to Login".
  - When logged in, header badge shows the logged-in citizen's name (e.g., "Anurag", "Pooja Sharma", etc.) and verified status.
  - Submitting new grievances auto-populates the logged-in citizen's name and mobile.
- [ ] **Task 13: Admin Profile Badge Dropdown & Dynamic Admin Re-login**
  - Add `Store.getAdminUser()`, `Store.loginAdmin()`, `Store.logoutAdmin()` supporting dynamic officer names.
  - Add Admin Profile Dropdown in `admin.html` with officer info, credentials, and Logout option.
  - Clicking Logout clears session, updates profile, and opens the Admin Login modal.
  - Logging in with credentials updates the header badge to the logged-in administrator's name.
- [ ] **Task 14: Shared Dropdown Styling & Click-Outside Dismiss**
  - Add `.profile-dropdown-menu`, `.profile-dropdown-header`, `.dropdown-item-btn` in `css/components.css`.
  - Implement outside-click listener in `citizen.js` and `admin.js` to dismiss dropdowns when clicking outside.
- [ ] **Task 15: Browser Verification**
  - Verify citizen login -> dropdown open -> logout -> guest state -> new citizen login (e.g. "Pooja Sharma") -> name update in header.
  - Verify admin dropdown open -> logout -> login modal display -> re-login -> header update.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Expanding `admin.html` beyond file size ceiling | High | Keep CSS in `css/components.css`, modularize screen renderers in `js/admin.js`, and maintain clean component templates. |
| State desynchronization across tabs | Medium | Leverage centralized `Store` commit methods that trigger both custom events and native `window.storage` events. |
| Complex accordion DOM rendering | Low | Use event delegation on table tbody for expand/collapse triggers to ensure snappy performance. |

---

## Verification Plan
1. **Automated Browser Subagent**:
   - Navigate through each sidebar tab: All Complaints -> Workbench -> Task Management -> Meeting Schedule -> Department Master -> Screen Master.
   - Capture screenshots of each screen to verify pixel-perfect fidelity against the Figma prototype and reference screenshots.
2. **Interactive Testing**:
   - Expand row 1 in Workbench -> verify 4-step stepper and SLA card open cleanly.
   - Switch to Task Management -> verify 7 KPI cards and officer analytics.
   - Switch to Meeting Schedule -> verify upcoming vs history tabs and Schedule Meeting modal.
   - Switch to Department Master -> verify 4 KPI cards and 66 departments counter.
