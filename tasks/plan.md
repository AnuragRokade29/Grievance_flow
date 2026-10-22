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

---

## Phase 7: PWA Implementation & Mobile Responsive Architecture

### Overview
Transform the Amravati Municipal Corporation Civic Grievance Redressal Portal into a fully installable, offline-resilient Progressive Web App (PWA) with a first-class mobile user experience. When accessed on mobile devices (smartphones and tablets), the portal shifts from a desktop multi-pane layout to a native-feeling mobile app featuring a fixed bottom navigation bar, floating shutter action button, 2x2 responsive KPI grids, touch-friendly GIS map view, mobile master-detail ticket tracker, and off-canvas slide-out navigation drawer for the Admin Desk.

### Architecture Decisions
1. **Modern CSS & Vector Icon CDNs**:
   - Modern Normalize CDN (`modern-normalize`) to ensure consistent typography and baseline rendering across mobile iOS Safari and Android Chrome.
   - Font Awesome 6 CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`) for high-DPI vector icons across mobile bottom navigation, status indicators, and shutter buttons.
2. **PWA Standards**:
   - Web App Manifest (`manifest.json`) with standalone display, theme color `#059669`, background color `#f8fafc`, civic branding icons (192x192, 512x512, maskable), and app shortcuts.
   - Service Worker (`sw.js`) implementing Stale-While-Revalidate caching for static assets (HTML, CSS, JS, fonts, icons) and network fallback for offline civic ward usage.
   - Native PWA Install Banner (`js/pwa.js`) handling `beforeinstallprompt` to let citizens install the app to their home screens with one tap.
   - Full viewport cover (`viewport-fit=cover`) and safe-area inset support (`env(safe-area-inset-bottom)`) for notched iPhones and gesture-bar Android devices.
3. **Mobile Layout Architecture (Citizen Portal - `index.html`)**:
   - Header: Responsive compact branding with language toggle and avatar badge.
   - Bottom Navigation Bar: Persistent native app bar with 5 destinations (Dashboard, Report FAB Shutter, Live Tracker, Officer Desk, Account).
   - View 1 (Dashboard): 2x2 KPI grid, responsive map container with touch drag/zoom, and touch-snapped horizontal evidence carousel.
   - View 2 (Tracker): Master-detail responsive view. On mobile (< 768px), tapping a ticket switches to Ticket Detail with a sticky "← Back to Tickets" navigation bar.
   - Snap & Report Wizard: Responsive bottom-sheet / modal dialog with comfortable 48px touch inputs and camera shutter button.
4. **Mobile Layout Architecture (Admin Desk - `admin.html`)**:
   - Hamburger menu button in header triggering a smooth off-canvas slide drawer with backdrop overlay.
   - Horizontal scrolling data tables (`.table-responsive`) with sticky columns.
   - Responsive KPI card grids and accordion stepper flex-wrap.

---

### Task List: Phase 7

#### Phase 7.1: CDN Integration & PWA Foundations
- [ ] **Task 24: CDN Styling & Vector Icons Setup**
  - Add `modern-normalize.min.css` CDN and `font-awesome/6.5.1` CDN to `index.html` and `admin.html`.
  - Add viewport cover, theme-color `#059669`, and Apple Web App meta tags.
- [ ] **Task 25: Web App Manifest & App Icons Generation**
  - Create `manifest.json` with standalone display, orientations, theme colors, and quick shortcuts.
  - Create high-resolution SVG and PNG icons in `/icons/` (`icon-192.png`, `icon-512.png`, `icon-maskable.png`).
- [ ] **Task 26: Service Worker & PWA Controller (`sw.js`, `js/pwa.js`)**
  - Implement cache lifecycle: cache static assets, stale-while-revalidate strategy, offline fallback.
  - Implement `js/pwa.js` to register service worker and capture `beforeinstallprompt` for custom mobile install banner.

#### Checkpoint 1: PWA Shell Verified
- [ ] Manifest passes browser validation
- [ ] Service worker registers and caches shell assets successfully

#### Phase 7.2: Citizen Portal Mobile Responsiveness (`index.html`, `css/components.css`, `js/citizen.js`)
- [ ] **Task 27: Responsive Mobile Header & Safe Area Styling**
  - Compact logo + title on screens <= 768px.
  - Support `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- [ ] **Task 28: Mobile Native Bottom Navigation Bar & Shutter FAB**
  - Build `.mobile-bottom-nav` with Dashboard, Tracker (with badge), Officer Desk, Profile, and an elevated center Shutter Button (`#mobile-snap-btn`).
  - Automatically show on mobile (<= 768px) and hide on desktop (> 768px).
- [ ] **Task 29: View 1 (Map & Dashboard) Mobile Optimization**
  - Reorganize 4 KPI cards into a 2x2 responsive grid on mobile screens.
  - Ensure GIS map maintains interactive touch controls and top filter pills wrap cleanly.
  - Adjust bottom evidence carousel cards to 85vw with horizontal scroll snapping.
- [ ] **Task 30: View 2 (Live Tracker) Master-Detail Mobile Transition**
  - Implement mobile list/detail toggle: tapping a ticket smoothly opens the ticket dossier with a "← Back to Tickets" bar on mobile screens.
  - Stack two-column citizen/officer timeline into a vertical responsive stepper on mobile.
- [ ] **Task 31: Mobile Snap & Report Wizard & Modals**
  - Make Report Wizard modal responsive (fullscreen/bottom sheet on mobile with touch-friendly 44px+ inputs and large camera button).
  - Ensure Profile dropdown, OTP modal, and Inspect Evidence modals are 100% responsive without horizontal overflow.

#### Checkpoint 2: Citizen Flow Mobile Verified
- [ ] Citizen portal displays cleanly on 375px/390px/412px mobile viewports
- [ ] Bottom navigation switches between Dashboard, Tracker, and Report Wizard
- [ ] Master-Detail ticket navigation works seamlessly on mobile

#### Phase 7.3: Admin Desk Mobile Responsiveness (`admin.html`, `css/components.css`, `js/admin.js`)
- [ ] **Task 32: Admin Mobile Drawer & Hamburger Navigation**
  - Add hamburger button to `admin.html` header.
  - Implement off-canvas slide-over drawer with backdrop overlay for the admin sidebar.
- [ ] **Task 33: Responsive Tables, Accordion Stepper & KPI Grids**
  - Add touch horizontal scroll containers for 193 complaints table, tasks analytics table, and department master.
  - Ensure Workbench accordion stepper nodes wrap gracefully without clipping.

#### Checkpoint 3: Complete Mobile & PWA Verification
- [ ] Test both pages across mobile viewports (375x667, 390x844, 412x915) using browser subagent
- [ ] PWA install prompt triggers and dismisses properly

