# Task Checklist: Grievance Flow (Pure HTML, CSS & Vanilla JS)

## Phase 1: Foundation & Data Architecture
- [x] **Task 1**: Core Storage & Mock Database Engine (`js/store.js`)
  - [x] Initialize `localStorage` keys: `AMC_GRIEVANCE_STORE_V3`, `AMC_DEPT_MASTER_V1`
  - [x] Add pre-seeded Amravati municipal complaints (`GRV-2026-000193`, `000192`, `000191`, `000175`, etc.)
  - [x] Provide CRUD methods: `getAll()`, `getById()`, `getDepartments()`, `assignComplaint()`, `resetDemoData()`
- [x] **Task 2**: Unified Design System (`css/style.css`, `css/components.css`)
  - [x] Exact civic green tokens (`#00875a`), amber status pills, dark split image boxes
  - [x] Leaflet map integration styles and custom map pills
  - [x] Two-column Citizen vs Officer timeline flow layout
  - [x] Slide-over drawer, Assign modal popup, and Sonner-style toast notifications
- [x] **Task 3**: Bilingual i18n Engine (`js/i18n.js`)
  - [x] Defined English / Marathi dictionary with Unicode NFC normalization
  - [x] Runtime language switcher for portal labels

## Phase 2: Citizen Flow (`index.html` & `js/citizen.js`)
- [x] **Task 4**: Citizen Interface Shell (`index.html`)
  - [x] Header: AMC Green Logo, Amravati Municipal Corporation, Home, English toggle, Anurag profile badge
  - [x] Sidebar: `Snap & Report` camera button, `Dashboard (Overview)` and `Live Tracker (Status)` with `30` badge
- [x] **Task 5**: View 1 - GIS Map Dashboard (Screenshot 1)
  - [x] 4 KPI Cards: Total 183, Pending 183, In Progress 0, Resolved 0
  - [x] Interactive Leaflet map centered on Amravati with custom ward boundary polygon
  - [x] Top floating filters (`All Wards`, `All`, `Dirty`, `Cleaned`) and `+ Report Grievance`
  - [x] Bottom horizontal carousel cards with `Before` and `Pending Fix` image split comparison
- [x] **Task 6**: View 2 - Detailed Track Screen (Screenshots 2 & 3)
  - [x] Left pane: `My Tickets (30)` with amber-accented ticket rows, category icons, tokens, date, and `+ New` button
  - [x] Right pane: Header with `#GRV-2026-000175`, `Road Maintenance Department`, `Camp Main Road`, `Edit`, `Delete`, and `Share` buttons
  - [x] `Before & After` preview box with `Inspect Evidence →`
  - [x] Two-column live timeline: `Citizen` step on left connected to `Officer` steps on right (`Assigned`, `Under Review`, `Resolved Upcoming`)
  - [x] OTP verification modal simulation (`123456`) and mobile registration

## Phase 3: Admin & Officer Operations (`admin.html` & `js/admin.js`)
- [x] **Task 7**: Admin Portal Shell (`admin.html`)
  - [x] Header with `Prajval Bhoyar (Municipal Admin)` profile
  - [x] Sidebar with `Master ⌄ -> Department Master`, `All Complaints`, and `Workbench`
- [x] **Task 8**: Screen 1 - All Complaints (Admin Screenshot 1)
  - [x] `Citizen Grievances & Complaints` with `193 Complaints` mint green badge
  - [x] Filter toolbar: search, departments dropdown, statuses, sorting, date pickers
  - [x] Responsive data table with split before/after thumbnails, phone pills, and inspect triggers
- [x] **Task 9**: Screen 2 - Department Master (Admin Screenshot 2)
  - [x] 4 KPI Cards: Total 66, Active 66, Inactive 0, Managed 193
  - [x] Search and filter pills (`All`, `Active`, `Inactive`)
  - [x] Bilingual department table (PWD, Water Supply, Sewerage & Drainage, Street Lighting, etc.)
- [x] **Task 10**: Screen 3 & 4 - Workbench & Accordion (Admin Screenshots 3 & 4)
  - [x] Tabs: `All 193`, `Unassigned 193`, `Assigned 0`
  - [x] Expandable inline row accordion showing SLA countdown and 4-stage horizontal stepper
- [x] **Task 11**: Screen 5 - Assign / Reassign Complaint Modal (Admin Screenshot 5)
  - [x] Target Department dropdown, Assign to Officer dropdown, Remarks textarea
  - [x] Saves assignment directly to `localStorage`, changes status to In Progress, updates timeline, and shows toast

## Phase 4: Polish & Presentation Readiness
- [x] **Task 12**: Verification
  - [x] Python HTTP server hosting verified on port 3300
  - [x] Browser subagent verified both pages and visual flows

## Phase 5: Admin Portal Expansion (Plan Execution)
- [x] **Task 13**: Expanded Navigation & Active Session Ticker (`admin.html`, `js/admin.js`)
  - [x] Header session timer ticker (`Session: 00:01:13` ticker)
  - [x] Sidebar items: `Master` (`Department Master`, `Screen Master`), `All Complaints`, `Workbench`, `Task Management`, `Meeting Schedule`
- [x] **Task 14**: Screen 2 - Enhanced Accordion Workbench (`admin.html`, `js/admin.js`)
  - [x] Status filter tabs (`All 193`, `Unassigned 193`, `Assigned 0`)
  - [x] Expandable inline row accordion with 4-stage horizontal lifecycle stepper, SLA timer, and site evidence
- [x] **Task 15**: Screen 3 - Task Management Hub (`admin.html`, `js/admin.js`)
  - [x] Left sub-sidebar with department wings and task badges
  - [x] 7 KPI metric cards (Total, Assigned, In Progress, Completed, High, Medium, Low Priority)
  - [x] Officer Performance Analytics table with compliance progress bars
  - [x] Operational tasks table with status cycler and Assign Task modal
- [x] **Task 16**: Screen 4 - Meetings & Events Hub (`admin.html`, `js/admin.js`)
  - [x] Top 3 KPI metric cards (Total, Upcoming, Completed)
  - [x] `Upcoming Meetings` vs `Meeting History` tabs
  - [x] Filter toolbar (Department, Type, Dates) + CSV Download report
  - [x] Schedule New Meeting modal and meeting cancellation
- [x] **Task 17**: Screen 5 & 6 - Department Master & Screen Master RBAC (`admin.html`, `js/admin.js`)
## Phase 6: Interactive Authentication & Profile Dropdowns (Citizen & Admin)
- [x] **Task 19**: Data Architecture for Citizen & Admin Profiles (`js/store.js`)
  - [x] Add `CITIZEN_AUTH_KEY = 'NTIS_CITIZEN_USER_V1'`
  - [x] Add `ADMIN_USER_KEY = 'NTIS_ADMIN_USER_V1'`
  - [x] Implement `getCitizenUser()`, `setCitizenUser()`, `loginCitizen()`, `logoutCitizen()`
  - [x] Implement `getAdminUser()`, `setAdminUser()`, dynamic `loginAdmin(u, p, name, role)`, `logoutAdmin()`
  - [x] Dispatch reactive `NTIS_CITIZEN_AUTH_CHANGED` and `NTIS_ADMIN_AUTH_CHANGED` events
- [x] **Task 20**: Citizen Header Dropdown & Login Modal (`index.html`, `js/citizen.js`)
  - [x] Header badge: displays active citizen name ("Anurag", "Verified") or guest state ("Guest Citizen", "Click to Login")
  - [x] Citizen Profile Dropdown: opens on badge click when logged in, shows name, phone, ticket stats, and "Logout" option
  - [x] Citizen Login / Registration Modal: opens when guest badge clicked, takes Name + Mobile, simulates instant OTP verification, logs citizen in, updates header badge immediately
  - [x] Auto-fill Grievance Wizard Step 3 inputs with current citizen's name & phone
- [x] **Task 21**: Admin Header Dropdown & Logout Workflow (`admin.html`, `js/admin.js`)
  - [x] Admin Profile Dropdown: opens on `#admin-profile-badge` click, shows Officer Name, Role, official email, and "Logout" option
  - [x] Logout Action: clears session, closes dropdown, opens `#admin-login-modal`
  - [x] Admin Login Modal: supports optional officer name input (defaulting to Prajval Bhoyar), updates header badge on successful login
- [x] **Task 22**: Styling & Outside Click Dismiss (`css/components.css`)
  - [x] Add `.profile-dropdown-menu`, `.profile-dropdown-card`, `.profile-dropdown-header`, `.dropdown-item-btn` with smooth pop-over transition
  - [x] Global `document.addEventListener('click')` handling to close dropdowns when clicking outside
- [x] **Task 23**: Automated Browser Verification
  - [x] Test citizen profile dropdown, logout, guest state, and logging in as new user ("Pooja Sharma")
  - [x] Test admin profile dropdown, logout, login modal display, and re-login


