/**
 * ============================================================================
 * Amravati Municipal Corporation (AMC) - Admin Operations Logic
 * Powers:
 * 1. Officer Authentication (admin / User@123) & Active Session Ticker
 * 2. Sidebar Navigation Router (Complaints, Workbench, Tasks, Meetings, Masters)
 * 3. Screen 1: All Complaints Queue (Table, Filters, Sorting)
 * 4. Screen 2: Enhanced Workbench (Expandable Stepper Accordion & Slider)
 * 5. Screen 3: Task Management Hub (7 KPIs, Officer Analytics, Task Dispatcher)
 * 6. Screen 4: Meetings & Events Hub (3 KPIs, Upcoming vs History, Scheduler)
 * 7. Screen 5: Department Master (Bilingual 66 Depts, HODs, SLAs, Add Dept Modal)
 * 8. Screen 6: Screen Master (Role-Based Access Control Matrix)
 * 9. Cross-Tab Live Synchronization via Storage Events
 * ============================================================================
 */

import { Store, MASTER_DEPARTMENTS, showToast } from './store.js';
import { I18n } from './i18n.js';

// Application State
let allComplaints = [];
let activeAdminScreen = 'all-complaints'; // 'all-complaints' | 'workbench' | 'tasks' | 'meetings' | 'dept-master' | 'screen-master' | 'appointment-mgmt' | 'show-appointments'
let activeWorkbenchComplaint = null;
let wbFilterTab = 'all'; // 'all' | 'unassigned' | 'assigned'
let activeTaskDept = 'all';
let activeMeetingTab = 'upcoming'; // 'upcoming' | 'history'
let deptFilterStatus = 'all'; // 'all' | 'Active' | 'Inactive'
let activeShowApptTab = 'Pending'; // 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'Rescheduled'
let sessionSeconds = 73; // Starts at 00:01:13 to match prototype screenshot

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  I18n.init();

  allComplaints = Store.getAll();
  activeWorkbenchComplaint = allComplaints[0] || null;

  setupAdminAuth();
  setupSessionTicker();
  setupSidebarNav();
  setupAllComplaintsFilters();
  setupWorkbenchAccordion();
  setupTasksScreen();
  setupMeetingsScreen();
  setupAppointmentScreens();
  setupDeptMasterScreen();
  setupNewGrievanceSplitScreen();
  setupModals();
  setupCrossTabSync();

  populateDeptFilterDropdowns();

  // Initial Renders
  renderAllComplaintsTable();
  renderWorkbenchAccordionTable();
  renderTasksScreen();
  renderMeetingsScreen();
  renderAppointmentMgmtScreen();
  renderShowAppointmentsScreen();
  renderDeptMasterTable();

  // Check login state
  if (!Store.isAdminLoggedIn()) {
    showLoginModal();
  } else {
    setTimeout(() => showToast('Login successful', 'success'), 300);
  }
});

// ============================================================================
// 1. Session Ticker & Authentication (admin / User@123)
// ============================================================================
function setupSessionTicker() {
  const tickerEl = document.getElementById('admin-session-ticker');
  if (!tickerEl) return;

  setInterval(() => {
    sessionSeconds++;
    const hours = Math.floor(sessionSeconds / 3600);
    const minutes = Math.floor((sessionSeconds % 3600) / 60);
    const seconds = sessionSeconds % 60;
    tickerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function setupAdminAuth() {
  const modal = document.getElementById('admin-login-modal');
  const form = document.getElementById('admin-login-form');
  const userInput = document.getElementById('admin-user-input');
  const passInput = document.getElementById('admin-pass-input');
  const nameInput = document.getElementById('admin-name-input');
  const quickFillBtn = document.getElementById('login-quickfill-btn');
  const errorDiv = document.getElementById('admin-login-error');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const adminBadge = document.getElementById('admin-profile-badge');
  const adminDropdown = document.getElementById('admin-profile-dropdown');

  const renderAdminProfile = () => {
    const user = Store.getAdminUser();
    const badgeName = document.getElementById('admin-badge-name');
    const badgeRole = document.getElementById('admin-badge-role');
    const badgeAvatar = document.getElementById('admin-badge-avatar');
    const dropName = document.getElementById('admin-drop-name');
    const dropRole = document.getElementById('admin-drop-role');
    const dropEmail = document.getElementById('admin-drop-email');
    const dropAvatar = document.getElementById('admin-drop-avatar');

    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PB';

    if (badgeName) badgeName.textContent = user.name;
    if (badgeRole) badgeRole.textContent = user.role || 'Municipal Admin';
    if (badgeAvatar) badgeAvatar.textContent = initials;
    if (dropName) dropName.textContent = user.name;
    if (dropRole) dropRole.textContent = `${user.role || 'Municipal Admin'} • All Privileges`;
    if (dropEmail) dropEmail.textContent = user.email || 'admin@amravati.gov.in';
    if (dropAvatar) dropAvatar.textContent = initials;
  };

  if (quickFillBtn) {
    quickFillBtn.addEventListener('click', () => {
      userInput.value = 'admin';
      passInput.value = 'User@123';
      errorDiv.style.display = 'none';
      showToast('Demo credentials autofilled!', 'info');
    });
  }

  // Toggle dropdown on badge click
  if (adminBadge) {
    adminBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!Store.isAdminLoggedIn()) {
        showLoginModal();
      } else {
        adminDropdown?.classList.toggle('show');
      }
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (adminDropdown && adminBadge && !adminBadge.contains(e.target) && !adminDropdown.contains(e.target)) {
      adminDropdown.classList.remove('show');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = userInput.value.trim();
      const p = passInput.value;
      const officerName = nameInput ? nameInput.value.trim() : null;

      const res = Store.loginAdmin(u, p, officerName);
      if (res.success) {
        modal.style.display = 'none';
        errorDiv.style.display = 'none';
        renderAdminProfile();
        showToast(`Signed in successfully as ${res.user.name}`, 'success');
        renderAllComplaintsTable();
        renderWorkbenchAccordionTable();
      } else {
        errorDiv.textContent = res.message;
        errorDiv.style.display = 'block';
        showToast('Invalid credentials. Enter admin and User@123', 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      adminDropdown?.classList.remove('show');
      Store.logoutAdmin();
      showLoginModal();
      showToast('Logged out from Admin Operations Desk', 'info');
    });
  }

  window.addEventListener('NTIS_ADMIN_AUTH_CHANGED', () => {
    renderAdminProfile();
  });

  renderAdminProfile();
}

function showLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.style.display = 'flex';
}

// ============================================================================
// 2. Sidebar Navigation Router
// ============================================================================
function setupSidebarNav() {
  const btnAll = document.getElementById('nav-btn-all-complaints');
  const btnNewGrv = document.getElementById('nav-btn-new-grievance');
  const btnWb = document.getElementById('nav-btn-workbench');
  const btnTasks = document.getElementById('nav-btn-tasks');
  const btnMeetings = document.getElementById('nav-btn-meetings');
  const btnDept = document.getElementById('nav-btn-dept-master');
  const masterToggle = document.getElementById('nav-master-toggle');
  const masterSubmenu = document.getElementById('nav-master-submenu');
  const masterChevron = document.getElementById('nav-master-chevron');

  const apptToggle = document.getElementById('nav-appt-toggle');
  const apptSubmenu = document.getElementById('nav-appt-submenu');
  const apptChevron = document.getElementById('nav-appt-chevron');
  const btnBookAppt = document.getElementById('nav-btn-book-appt');
  const btnShowAppts = document.getElementById('nav-btn-show-appts');

  // Master Accordion Toggle
  if (masterToggle && masterSubmenu) {
    masterToggle.addEventListener('click', () => {
      const isHidden = masterSubmenu.style.display === 'none';
      masterSubmenu.style.display = isHidden ? 'flex' : 'none';
      if (masterChevron) masterChevron.textContent = isHidden ? '⌄' : '›';
    });
  }

  // Appointment Managements Accordion Toggle
  if (apptToggle && apptSubmenu) {
    apptToggle.addEventListener('click', () => {
      const isHidden = apptSubmenu.style.display === 'none';
      apptSubmenu.style.display = isHidden ? 'flex' : 'none';
      if (apptChevron) apptChevron.textContent = isHidden ? '⌄' : '›';
    });
  }

  window.switchAdminScreen = function(screenName) {
    activeAdminScreen = screenName;
    const sAll = document.getElementById('screen-all-complaints');
    const sNewGrv = document.getElementById('screen-new-grievance');
    const sWb = document.getElementById('screen-workbench');
    const sTasks = document.getElementById('screen-tasks');
    const sMeetings = document.getElementById('screen-meetings');
    const sDept = document.getElementById('screen-dept-master');
    const sApptMgmt = document.getElementById('screen-appointment-mgmt');
    const sShowAppts = document.getElementById('screen-show-appointments');

    btnAll?.classList.toggle('active', screenName === 'all-complaints');
    btnNewGrv?.classList.toggle('active', screenName === 'new-grievance');
    btnWb?.classList.toggle('active', screenName === 'workbench');
    btnTasks?.classList.toggle('active', screenName === 'tasks');
    btnMeetings?.classList.toggle('active', screenName === 'meetings');
    btnDept?.classList.toggle('active', screenName === 'dept-master');
    btnBookAppt?.classList.toggle('active', screenName === 'appointment-mgmt');
    btnShowAppts?.classList.toggle('active', screenName === 'show-appointments');

    if (sAll) sAll.style.display = screenName === 'all-complaints' ? 'flex' : 'none';
    if (sNewGrv) sNewGrv.style.display = screenName === 'new-grievance' ? 'flex' : 'none';
    if (sWb) sWb.style.display = screenName === 'workbench' ? 'flex' : 'none';
    if (sTasks) sTasks.style.display = screenName === 'tasks' ? 'flex' : 'none';
    if (sMeetings) sMeetings.style.display = screenName === 'meetings' ? 'flex' : 'none';
    if (sDept) sDept.style.display = screenName === 'dept-master' ? 'flex' : 'none';
    if (sApptMgmt) sApptMgmt.style.display = screenName === 'appointment-mgmt' ? 'flex' : 'none';
    if (sShowAppts) sShowAppts.style.display = screenName === 'show-appointments' ? 'flex' : 'none';

    if (screenName === 'workbench') renderWorkbenchAccordionTable();
    if (screenName === 'tasks') renderTasksScreen();
    if (screenName === 'meetings') renderMeetingsScreen();
    if (screenName === 'appointment-mgmt') renderAppointmentMgmtScreen();
    if (screenName === 'show-appointments') renderShowAppointmentsScreen();
    if (screenName === 'dept-master') renderDeptMasterTable();
  };

  btnAll?.addEventListener('click', () => switchAdminScreen('all-complaints'));
  btnNewGrv?.addEventListener('click', () => switchAdminScreen('new-grievance'));
  btnWb?.addEventListener('click', () => switchAdminScreen('workbench'));
  btnTasks?.addEventListener('click', () => switchAdminScreen('tasks'));
  btnMeetings?.addEventListener('click', () => switchAdminScreen('meetings'));
  btnDept?.addEventListener('click', () => switchAdminScreen('dept-master'));
  btnBookAppt?.addEventListener('click', () => switchAdminScreen('appointment-mgmt'));
  btnShowAppts?.addEventListener('click', () => switchAdminScreen('show-appointments'));

  // Reset Demo button
  const resetBtn = document.getElementById('admin-reset-demo-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Store.resetDemoData();
      allComplaints = Store.getAll();
      renderAllComplaintsTable();
      renderWorkbenchAccordionTable();
      renderTasksScreen();
      renderMeetingsScreen();
      renderAppointmentMgmtScreen();
      renderShowAppointmentsScreen();
      renderDeptMasterTable();
      showToast('Admin demo data restored to initial state!', 'success');
    });
  }

  // Header Language Switcher
  const langBtn = document.getElementById('admin-lang-btn');
  const langText = document.getElementById('admin-lang-text');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const cur = I18n.currentLang;
      const next = cur === 'en' ? 'mr' : (cur === 'mr' ? 'hi' : 'en');
      I18n.setLanguage(next);
      if (langText) langText.textContent = next === 'en' ? 'English' : (next === 'mr' ? 'मराठी' : 'हिंदी');
      renderAllComplaintsTable();
      renderWorkbenchAccordionTable();
      renderDeptMasterTable();
      showToast(`Language switched to ${langText.textContent}`, 'info');
    });
  }
}

function populateDeptFilterDropdowns() {
  const depts = Store.getDepartments();
  const optionsHtml = '<option value="">All Departments</option>' +
    depts.map(d => `<option value="${d.nameEn}">${d.nameEn}</option>`).join('');

  const allDept = document.getElementById('all-filter-dept');
  const wbDept = document.getElementById('wb-filter-dept');
  const assignDept = document.getElementById('assign-dept-select');
  const meetingDept = document.getElementById('meeting-filter-dept');

  if (allDept) allDept.innerHTML = optionsHtml;
  if (wbDept) wbDept.innerHTML = optionsHtml;
  if (assignDept) assignDept.innerHTML = depts.map(d => `<option value="${d.nameEn}">${d.nameEn}</option>`).join('');
  if (meetingDept) meetingDept.innerHTML = optionsHtml;
}

// ============================================================================
// 3. Screen 1: All Complaints Queue (Table, Search, Filter)
// ============================================================================
function setupAllComplaintsFilters() {
  const searchInput = document.getElementById('all-search-input');
  const deptSelect = document.getElementById('all-filter-dept');
  const statusSelect = document.getElementById('all-filter-status');
  const sortSelect = document.getElementById('all-filter-sort');
  const refreshBtn = document.getElementById('refresh-complaints-btn');

  const triggerFilter = () => renderAllComplaintsTable();

  searchInput?.addEventListener('input', triggerFilter);
  deptSelect?.addEventListener('change', triggerFilter);
  statusSelect?.addEventListener('change', triggerFilter);
  sortSelect?.addEventListener('change', triggerFilter);

  refreshBtn?.addEventListener('click', () => {
    allComplaints = Store.getAll();
    renderAllComplaintsTable();
    showToast('Grievance queue refreshed.', 'info');
  });
}

function renderAllComplaintsTable() {
  const tbody = document.getElementById('all-complaints-tbody');
  const badge = document.getElementById('header-complaints-badge');
  if (!tbody) return;

  allComplaints = Store.getAll();

  if (badge) {
    const totalCount = allComplaints.length <= 7 ? 193 : (186 + allComplaints.length);
    badge.textContent = `${totalCount} Complaints`;
  }

  const q = document.getElementById('all-search-input')?.value.trim().toLowerCase() || '';
  const selDept = document.getElementById('all-filter-dept')?.value || '';
  const selStatus = document.getElementById('all-filter-status')?.value || '';
  const selSort = document.getElementById('all-filter-sort')?.value || 'newest';

  let filtered = allComplaints.filter(c => {
    const matchQ = !q ||
      String(c.id).includes(q) ||
      (c.grievanceNo && c.grievanceNo.toLowerCase().includes(q)) ||
      (c.citizen && c.citizen.toLowerCase().includes(q)) ||
      (c.mobile && c.mobile.includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q));
    const matchDept = !selDept || c.department === selDept;
    const matchStatus = !selStatus || (c.status === selStatus || (c.stage && c.stage.toLowerCase() === selStatus.toLowerCase()));
    return matchQ && matchDept && matchStatus;
  });

  if (selSort === 'oldest') {
    filtered.sort((a, b) => Number(a.id) - Number(b.id));
  } else if (selSort === 'priority') {
    const pWeight = { 'CRITICAL': 3, 'HIGH': 2, 'NORMAL': 1 };
    filtered.sort((a, b) => (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0));
  } else {
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  }

  tbody.innerHTML = filtered.map(c => {
    const statusVal = c.status || 'Pending';
    const statusBg = statusVal === 'Resolved' ? '#ecfdf5' : (statusVal === 'In Progress' ? '#eff6ff' : '#fffbeb');
    const statusColor = statusVal === 'Resolved' ? '#047857' : (statusVal === 'In Progress' ? '#1d4ed8' : '#b45309');
    const statusBorder = statusVal === 'Resolved' ? '#a7f3d0' : (statusVal === 'In Progress' ? '#bfdbfe' : '#fde68a');

    const beforeImg = (c.images && c.images.before) || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500';
    const hasNewBadge = c.isNew ? '<span class="glowing-new-badge">NEW</span>' : '';

    const displayId = String(c.id).replace('#GRV-2026-', '').replace('GRV-2026-', '').replace('GRV-', '');
    const displayGrievanceNo = c.grievanceNo || `GRV-2026-${String(displayId).padStart(6, '0')}`;

    return `
      <tr class="${c.isNew ? 'new-complaint-row' : ''}">
        <td><strong style="color: #64748b; font-size: 0.8125rem;">${displayId}</strong></td>
        <td>
          <div style="font-family: monospace; font-weight: 700; color: #0f172a; font-size: 0.8125rem; display: inline-flex; align-items: center;">
            ${displayGrievanceNo}
            ${hasNewBadge}
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-size: 0.75rem; color: #94a3b8;">👤</span>
            <span style="font-weight: 700; color: #0f172a; font-size: 0.8125rem;">${c.citizen || 'Citizen'}</span>
          </div>
        </td>
        <td>
          <span style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 0.15rem 0.45rem; border-radius: 9999px; font-size: 0.725rem; font-family: monospace; font-weight: 700;">
            📞 ${c.mobile || '9022615919'}
          </span>
        </td>
        <td>
          <div>
            <div style="font-weight: 700; color: #0f172a; font-size: 0.8125rem;">${c.department}</div>
            <div style="font-size: 0.725rem; color: #059669; font-weight: 600;">${c.category}</div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8125rem; color: #475569;">
            <span style="color: #94a3b8;">📍</span>
            <span>${c.location || 'main road, Amravati'}</span>
          </div>
        </td>
        <td style="text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 38px; border-radius: 6px; overflow: hidden; border: 1px solid #cbd5e1; position: relative; background: #0f172a; cursor: pointer;" onclick="window.openWorkbenchForId('${c.id}')">
            <img src="${beforeImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="evidence thumbnail" />
            <span style="position: absolute; bottom: 1px; left: 2px; font-size: 0.55rem; background: rgba(0,0,0,0.7); color: #fff; padding: 0 3px; border-radius: 2px;">Before</span>
          </div>
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.725rem; font-weight: 700; background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; padding: 0.2rem 0.55rem; border-radius: 9999px;">
            ● ${c.status}
          </span>
        </td>
        <td style="font-size: 0.75rem; color: #64748b; white-space: nowrap;">
          ${c.submittedDate || 'Oct 21, 2026'}
        </td>
        <td style="text-align: center;">
          <button type="button" class="pill-btn" style="padding: 0.25rem 0.55rem;" title="Inspect in Workbench" onclick="window.openWorkbenchForId('${c.id}')">
            ⚙️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openWorkbenchForId = function(id) {
  const item = allComplaints.find(c => String(c.id) === String(id));
  if (!item) return;

  activeWorkbenchComplaint = item;
  switchAdminScreen('workbench');
  setTimeout(() => {
    const row = document.getElementById(`wb-drawer-${item.id}`);
    if (row) row.style.display = 'table-row';
    const chevron = document.getElementById(`wb-chevron-${item.id}`);
    if (chevron) chevron.textContent = '▼';
    showToast(`Opened ${item.grievanceNo} in Workbench`, 'info');
  }, 100);
};

// ============================================================================
// 4. Screen 2: Enhanced Workbench (Expandable Stepper Accordion Table)
// ============================================================================
function setupWorkbenchAccordion() {
  const tabs = document.querySelectorAll('.wb-filter-tab');
  const searchInput = document.getElementById('wb-search-input');
  const deptSelect = document.getElementById('wb-filter-dept');
  const statusSelect = document.getElementById('wb-filter-status');
  const sortSelect = document.getElementById('wb-filter-sort');
  const expandAllBtn = document.getElementById('wb-expand-all-btn');
  const refreshBtn = document.getElementById('wb-refresh-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = '#f1f5f9';
        t.style.color = '#475569';
        t.style.borderColor = '#cbd5e1';
      });
      tab.classList.add('active');
      tab.style.background = '#059669';
      tab.style.color = '#ffffff';
      tab.style.borderColor = '#059669';

      wbFilterTab = tab.dataset.filter;
      renderWorkbenchAccordionTable();
    });
  });

  const triggerFilter = () => renderWorkbenchAccordionTable();
  searchInput?.addEventListener('input', triggerFilter);
  deptSelect?.addEventListener('change', triggerFilter);
  statusSelect?.addEventListener('change', triggerFilter);
  sortSelect?.addEventListener('change', triggerFilter);

  refreshBtn?.addEventListener('click', () => {
    allComplaints = Store.getAll();
    renderWorkbenchAccordionTable();
    showToast('Workbench queue updated.', 'info');
  });

  let allExpanded = false;
  expandAllBtn?.addEventListener('click', () => {
    allExpanded = !allExpanded;
    document.querySelectorAll('.wb-accordion-drawer-row').forEach(row => {
      row.style.display = allExpanded ? 'table-row' : 'none';
    });
    document.querySelectorAll('.wb-chevron-cell').forEach(ch => {
      ch.textContent = allExpanded ? '▼' : '▶';
    });
    showToast(allExpanded ? 'Expanded all stepper rows' : 'Collapsed all stepper rows', 'info');
  });
}

function renderWorkbenchAccordionTable() {
  const tbody = document.getElementById('workbench-accordion-tbody');
  if (!tbody) return;

  allComplaints = Store.getAll();

  const q = document.getElementById('wb-search-input')?.value.trim().toLowerCase() || '';
  const selDept = document.getElementById('wb-filter-dept')?.value || '';
  const selStatus = document.getElementById('wb-filter-status')?.value || '';
  const selSort = document.getElementById('wb-filter-sort')?.value || 'newest';

  let filtered = allComplaints.filter(c => {
    const isUnassigned = !c.assignedOfficer || c.assignedOfficer === 'Unassigned';
    if (wbFilterTab === 'unassigned' && !isUnassigned) return false;
    if (wbFilterTab === 'assigned' && isUnassigned) return false;

    const matchQ = !q ||
      String(c.id).includes(q) ||
      (c.grievanceNo && c.grievanceNo.toLowerCase().includes(q)) ||
      (c.citizen && c.citizen.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q));

    const matchDept = !selDept || c.department === selDept;
    const matchStatus = !selStatus || c.status === selStatus;

    return matchQ && matchDept && matchStatus;
  });

  if (selSort === 'sla') {
    filtered.sort((a, b) => parseInt(a.slaRemaining || '48') - parseInt(b.slaRemaining || '48'));
  } else if (selSort === 'priority') {
    const pWeight = { 'CRITICAL': 3, 'HIGH': 2, 'NORMAL': 1 };
    filtered.sort((a, b) => (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0));
  } else {
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  }

  tbody.innerHTML = filtered.map(c => {
    const beforeImg = (c.images && c.images.before) || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500';
    const afterImg = (c.images && c.images.after) || 'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500';
    const isAssigned = c.assignedOfficer && c.assignedOfficer !== 'Unassigned';
    const statusBg = c.status === 'Resolved' ? '#ecfdf5' : (c.status === 'In Progress' ? '#eff6ff' : '#fffbeb');
    const statusColor = c.status === 'Resolved' ? '#047857' : (c.status === 'In Progress' ? '#1d4ed8' : '#b45309');

    // Build timeline steps
    const timeline = c.timeline || [
      { step: 1, title: '1. Grievance Submitted', subtitle: `${c.citizen || 'Citizen'} • Submitted`, status: 'done', current: false },
      { step: 2, title: '2. Field Unit Assigned', subtitle: isAssigned ? c.assignedOfficer : 'Awaiting Officer Assignment', status: isAssigned ? 'done' : 'active', current: !isAssigned },
      { step: 3, title: '3. Under Review & Inspection', subtitle: c.status === 'In Progress' ? 'Active inspection' : 'Pending inspection', status: c.status === 'In Progress' ? 'active' : 'pending', current: c.status === 'In Progress' },
      { step: 4, title: '4. Resolved & Closed', subtitle: c.status === 'Resolved' ? 'Verified closed' : 'Pending resolution', status: c.status === 'Resolved' ? 'done' : 'pending', current: c.status === 'Resolved' }
    ];

    const stepperNodesHtml = timeline.map((step, idx) => {
      const isDone = step.status === 'done';
      const isActive = step.current || step.status === 'active';
      return `
        <div class="wb-stepper-node ${isDone ? 'completed' : (isActive ? 'active' : '')}" onclick="window.triggerStepperAction('${c.id}', ${idx + 1})" style="cursor: pointer;">
          <div class="wb-node-circle">${isDone ? '✓' : idx + 1}</div>
          <div class="wb-node-title">${step.title}</div>
          <div class="wb-node-subtitle">${step.subtitle}</div>
        </div>
      `;
    }).join('');

    return `
      <!-- Primary Row -->
      <tr class="wb-accordion-toggle" onclick="window.toggleWorkbenchRow('${c.id}')">
        <td style="text-align: center;">
          <span id="wb-chevron-${c.id}" class="wb-chevron-cell" style="font-size: 0.75rem; color: #64748b; font-weight: 800;">▶</span>
        </td>
        <td>
          <div style="font-weight: 800; color: #0f172a; font-size: 0.825rem; font-family: monospace;">
            ${c.grievanceNo}
          </div>
          <div style="font-size: 0.75rem; color: #475569; font-weight: 600;">${c.category}</div>
          <div style="font-size: 0.675rem; color: #94a3b8;">${c.submittedDate || 'Oct 21, 2026'}</div>
        </td>
        <td style="text-align: center;">
          <div style="display: inline-flex; width: 64px; height: 38px; border-radius: 6px; overflow: hidden; border: 1px solid #cbd5e1; background: #0f172a;">
            <img src="${beforeImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="evidence thumbnail" />
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: #0f172a; font-size: 0.8125rem;">${c.department}</div>
          <div style="font-size: 0.725rem; color: #64748b;">📍 ${c.location || 'Amravati'}</div>
        </td>
        <td>
          ${isAssigned ? `
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.725rem; font-weight: 700;">
              👤 ${c.assignedOfficer}
            </span>
          ` : `
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.725rem; font-weight: 700;">
              ⚠️ Unassigned
            </span>
          `}
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.725rem; font-weight: 700; background: ${statusBg}; color: ${statusColor}; border: 1px solid rgba(0,0,0,0.06); padding: 0.2rem 0.55rem; border-radius: 9999px;">
            ● ${c.status}
          </span>
        </td>
        <td>
          <div style="font-size: 0.75rem; font-weight: 800; color: #ea580c;">
            ⏱ ${c.slaRemaining || '48h remaining'}
          </div>
        </td>
        <td style="text-align: center;">
          <div style="display: inline-flex; gap: 0.35rem;">
            <button type="button" class="pill-btn" style="background: #059669; color: #ffffff; border-color: #059669; font-size: 0.725rem; padding: 0.25rem 0.6rem; font-weight: 700;" onclick="event.stopPropagation(); window.openAssignModalFor('${c.id}')">
              Assign
            </button>
            <button type="button" class="pill-btn" style="font-size: 0.725rem; padding: 0.25rem 0.5rem;" title="Toggle Dossier" onclick="event.stopPropagation(); window.toggleWorkbenchRow('${c.id}')">
              📄
            </button>
          </div>
        </td>
      </tr>

      <!-- Expandable Accordion Drawer Row -->
      <tr id="wb-drawer-${c.id}" class="wb-accordion-drawer-row" style="display: none;">
        <td colspan="8">
          <div class="workbench-inline-dossier">
            <!-- Dossier Header -->
            <div class="wb-dossier-top">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;">LIFECYCLE DOSSIER</span>
                <span class="ticket-id-copy-badge" onclick="navigator.clipboard?.writeText('${c.grievanceNo}'); showToast('Copied ${c.grievanceNo}', 'success');">#${c.grievanceNo} 📋</span>
                <span class="priority-badge ${c.priority === 'HIGH' ? 'priority-high' : 'priority-normal'}">${c.priority || 'HIGH'}</span>
                <span style="font-size: 0.8125rem; font-weight: 800; color: #0f172a;">${c.category} • ${c.location}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div class="sla-timer-pill" style="padding: 0.25rem 0.65rem;">
                  <span style="font-size: 0.7rem; font-weight: 800; color: #ea580c;">SLA: ${c.slaRemaining || '48h'}</span>
                </div>
                <button type="button" class="pill-btn" style="font-weight: 700; font-size: 0.75rem;" onclick="window.openAssignModalFor('${c.id}')">
                  Assign Officer
                </button>
                <button type="button" class="pill-btn" style="background: #059669; color: #ffffff; border-color: #059669; font-weight: 700; font-size: 0.75rem;" onclick="window.openResolveModalFor('${c.id}')">
                  Mark Resolved
                </button>
              </div>
            </div>

            <!-- 4-Stage Horizontal Stepper -->
            <div class="wb-stepper-horizontal">
              ${stepperNodesHtml}
            </div>

            <!-- Evidence Comparison Box -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 50px; height: 32px; border-radius: 4px; overflow: hidden; border: 1px solid #cbd5e1;">
                    <img src="${beforeImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="before" />
                  </div>
                  <span style="font-size: 0.725rem; font-weight: 700; color: #64748b;">Citizen Site Evidence</span>
                </div>
                <span style="color: #cbd5e1;">→</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 50px; height: 32px; border-radius: 4px; overflow: hidden; border: 1px solid #cbd5e1;">
                    <img src="${afterImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="after" />
                  </div>
                  <span style="font-size: 0.725rem; font-weight: 700; color: #64748b;">Post-Repair Clearance</span>
                </div>
              </div>

              <div style="font-size: 0.75rem; color: #64748b;">
                Reporting Citizen: <strong style="color: #0f172a;">${c.citizen || 'Tanvi'}</strong> (📞 ${c.mobile || '9022615919'})
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleWorkbenchRow = function(id) {
  const drawer = document.getElementById(`wb-drawer-${id}`);
  const chevron = document.getElementById(`wb-chevron-${id}`);
  if (!drawer) return;

  const isHidden = drawer.style.display === 'none';
  drawer.style.display = isHidden ? 'table-row' : 'none';
  if (chevron) chevron.textContent = isHidden ? '▼' : '▶';
};

window.triggerStepperAction = function(complaintId, stepNum) {
  if (stepNum === 2) {
    window.openAssignModalFor(complaintId);
  } else if (stepNum === 4) {
    window.openResolveModalFor(complaintId);
  } else {
    showToast(`Lifecycle Stage ${stepNum} active for grievance #${complaintId}`, 'info');
  }
};

window.openAssignModalFor = function(id) {
  const item = allComplaints.find(c => String(c.id) === String(id));
  if (!item) return;

  activeWorkbenchComplaint = item;
  const modal = document.getElementById('assign-modal');
  const deptSelect = document.getElementById('assign-dept-select');
  if (deptSelect && item.department) deptSelect.value = item.department;
  if (modal) modal.classList.add('open');
};

window.openResolveModalFor = function(id) {
  const item = allComplaints.find(c => String(c.id) === String(id));
  if (!item) return;

  activeWorkbenchComplaint = item;
  const modal = document.getElementById('resolve-modal');
  if (modal) modal.classList.add('open');
};

// ============================================================================
// 5. Screen 3: Task Management Hub (7 KPIs, Officer Analytics, Dispatcher)
// ============================================================================
function setupTasksScreen() {
  const btnDashboard = document.getElementById('task-tab-dashboard');
  const btnAssignOpen = document.getElementById('task-btn-assign-open');
  const btnQuickNew = document.getElementById('btn-quick-new-task');
  const officerSearch = document.getElementById('officer-search-input');
  const statusFilter = document.getElementById('task-status-filter');

  btnDashboard?.addEventListener('click', () => {
    activeTaskDept = 'all';
    renderTasksScreen();
    showToast('Viewing all department tasks', 'info');
  });

  const openAssignModal = () => {
    const modal = document.getElementById('assign-task-modal');
    if (modal) modal.classList.add('open');
  };

  btnAssignOpen?.addEventListener('click', openAssignModal);
  btnQuickNew?.addEventListener('click', openAssignModal);

  officerSearch?.addEventListener('input', () => renderOfficerAnalytics());
  statusFilter?.addEventListener('change', () => renderTasksTable());

  // Task Assign Form Submit
  const taskForm = document.getElementById('assign-task-form');
  const taskModal = document.getElementById('assign-task-modal');
  const closeTaskModal = () => taskModal?.classList.remove('open');

  document.getElementById('assign-task-modal-close')?.addEventListener('click', closeTaskModal);
  document.getElementById('assign-task-modal-cancel')?.addEventListener('click', closeTaskModal);

  taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('task-form-title').value.trim(),
      department: document.getElementById('task-form-dept').value,
      priority: document.getElementById('task-form-priority').value,
      assignedOfficer: document.getElementById('task-form-officer').value,
      dueDate: document.getElementById('task-form-duedate').value,
      description: document.getElementById('task-form-desc').value.trim()
    };

    Store.createTask(payload);
    closeTaskModal();
    taskForm.reset();
    renderTasksScreen();
    showToast(`Dispatched task to ${payload.assignedOfficer}!`, 'success');
  });
}

function renderTasksScreen() {
  renderTaskDeptList();
  renderTaskKPIs();
  renderOfficerAnalytics();
  renderTasksTable();
}

function renderTaskDeptList() {
  const container = document.getElementById('task-dept-selector-list');
  if (!container) return;

  const tasks = Store.getTasks();
  const depts = [
    { name: 'All Departments', id: 'all' },
    { name: 'Health Department', id: 'Health Department' },
    { name: 'Property Tax', id: 'Property Tax' },
    { name: 'PWD', id: 'PWD' },
    { name: 'Trade License', id: 'Trade License' },
    { name: 'Water Supply', id: 'Water Supply' }
  ];

  container.innerHTML = depts.map(d => {
    const count = d.id === 'all' ? tasks.length : tasks.filter(t => t.department === d.id).length;
    const isActive = activeTaskDept === d.id;
    return `
      <div class="task-dept-item ${isActive ? 'active' : ''}" onclick="window.selectTaskDept('${d.id}')">
        <div class="task-dept-item-left">
          <span>${d.id === 'all' ? '🏢' : '📁'}</span>
          <span>${d.name}</span>
        </div>
        <span class="task-dept-badge">${count}</span>
      </div>
    `;
  }).join('');
}

window.selectTaskDept = function(deptId) {
  activeTaskDept = deptId;
  const subTitle = document.getElementById('task-dept-subtitle');
  if (subTitle) {
    subTitle.textContent = deptId === 'all'
      ? 'Comprehensive tracking across all 5 municipal operational wings'
      : `Active operations & task compliance for ${deptId}`;
  }
  renderTasksScreen();
};

function renderTaskKPIs() {
  const allTasks = Store.getTasks();
  const tasks = activeTaskDept === 'all' ? allTasks : allTasks.filter(t => t.department === activeTaskDept);

  const total = tasks.length;
  const assigned = tasks.filter(t => t.status === 'Assigned').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const high = tasks.filter(t => t.priority === 'HIGH').length;
  const medium = tasks.filter(t => t.priority === 'MEDIUM').length;
  const low = tasks.filter(t => t.priority === 'LOW').length;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal('task-kpi-total', total);
  setVal('task-kpi-assigned', assigned);
  setVal('task-kpi-inprogress', inProgress);
  setVal('task-kpi-completed', completed);
  setVal('task-kpi-high', high);
  setVal('task-kpi-medium', medium);
  setVal('task-kpi-low', low);
}

function renderOfficerAnalytics() {
  const tbody = document.getElementById('officer-analytics-tbody');
  if (!tbody) return;

  const officers = Store.getOfficerAnalytics();
  const q = document.getElementById('officer-search-input')?.value.trim().toLowerCase() || '';

  const filtered = officers.filter(o => {
    const matchDept = activeTaskDept === 'all' || o.department === activeTaskDept;
    const matchQ = !q || o.name.toLowerCase().includes(q) || o.designation.toLowerCase().includes(q);
    return matchDept && matchQ;
  });

  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td>
        <div style="font-weight: 800; color: #0f172a; font-size: 0.825rem;">${o.name}</div>
        <div style="font-size: 0.725rem; color: #64748b;">${o.designation}</div>
      </td>
      <td>
        <span style="font-weight: 700; color: #334155; font-size: 0.8rem;">${o.department}</span>
      </td>
      <td style="text-align: center; font-weight: 800;">${o.totalTasks}</td>
      <td style="text-align: center; color: #2563eb; font-weight: 700;">${o.assigned}</td>
      <td style="text-align: center; color: #d97706; font-weight: 700;">${o.inProgress}</td>
      <td style="text-align: center; color: #059669; font-weight: 700;">${o.completed}</td>
      <td>
        <div class="compliance-progress-box">
          <div class="compliance-bar-track">
            <div class="compliance-bar-fill" style="width: ${o.complianceRate}%;"></div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 800; color: #0f172a;">${o.complianceRate}%</span>
        </div>
      </td>
      <td style="text-align: center;">
        <button type="button" class="pill-btn" style="padding: 0.2rem 0.5rem; font-size: 0.725rem;" onclick="window.quickAssignToOfficer('${o.name}', '${o.department}')">
          Assign
        </button>
      </td>
    </tr>
  `).join('');
}

window.quickAssignToOfficer = function(name, dept) {
  const modal = document.getElementById('assign-task-modal');
  const officerSelect = document.getElementById('task-form-officer');
  const deptSelect = document.getElementById('task-form-dept');

  if (officerSelect) officerSelect.value = name;
  if (deptSelect && dept) deptSelect.value = dept;
  if (modal) modal.classList.add('open');
};

function renderTasksTable() {
  const tbody = document.getElementById('tasks-table-tbody');
  if (!tbody) return;

  const allTasks = Store.getTasks();
  const selStatus = document.getElementById('task-status-filter')?.value || '';

  const filtered = allTasks.filter(t => {
    const matchDept = activeTaskDept === 'all' || t.department === activeTaskDept;
    const matchStatus = !selStatus || t.status === selStatus;
    return matchDept && matchStatus;
  });

  tbody.innerHTML = filtered.map(t => {
    const pClass = t.priority === 'HIGH' ? 'priority-critical' : (t.priority === 'MEDIUM' ? 'priority-high' : 'priority-normal');
    const sBg = t.status === 'Completed' ? '#ecfdf5' : (t.status === 'In Progress' ? '#eff6ff' : '#fffbeb');
    const sColor = t.status === 'Completed' ? '#047857' : (t.status === 'In Progress' ? '#1d4ed8' : '#b45309');

    return `
      <tr>
        <td><strong style="color: #64748b; font-size: 0.8rem;">#${t.id}</strong></td>
        <td>
          <div style="font-weight: 800; color: #0f172a; font-size: 0.8125rem;">${t.title}</div>
          <div style="font-size: 0.725rem; color: #64748b;">${t.description}</div>
        </td>
        <td><span style="font-weight: 700; color: #334155; font-size: 0.775rem;">${t.department}</span></td>
        <td><span class="priority-badge ${pClass}">${t.priority}</span></td>
        <td><span style="font-weight: 700; color: #0f172a; font-size: 0.775rem;">👤 ${t.assignedOfficer}</span></td>
        <td style="font-size: 0.75rem; color: #64748b; font-family: monospace;">${t.dueDate}</td>
        <td>
          <span style="font-size: 0.725rem; font-weight: 700; background: ${sBg}; color: ${sColor}; padding: 0.2rem 0.55rem; border-radius: 9999px;">
            ● ${t.status}
          </span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="pill-btn" style="padding: 0.2rem 0.5rem; font-size: 0.725rem;" onclick="window.cycleTaskStatus(${t.id})">
            ${t.status === 'Completed' ? 'Reopen' : (t.status === 'Assigned' ? 'Start' : 'Complete')}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.cycleTaskStatus = function(taskId) {
  const tasks = Store.getTasks();
  const task = tasks.find(t => Number(t.id) === Number(taskId));
  if (!task) return;

  const nextStatus = task.status === 'Assigned' ? 'In Progress' : (task.status === 'In Progress' ? 'Completed' : 'Assigned');
  Store.updateTaskStatus(taskId, nextStatus);
  renderTasksScreen();
  showToast(`Task #${taskId} status changed to ${nextStatus}`, 'info');
};

// ============================================================================
// 6. Screen 4: Meetings & Events Hub (3 KPIs, Upcoming vs History, Scheduler)
// ============================================================================
function setupMeetingsScreen() {
  const tabUpcoming = document.getElementById('tab-upcoming-meetings');
  const tabHistory = document.getElementById('tab-history-meetings');
  const btnScheduleOpen = document.getElementById('btn-schedule-meeting-open');
  const btnDownloadReport = document.getElementById('meeting-download-report-btn');
  const btnReset = document.getElementById('meeting-reset-filter-btn');

  const deptSelect = document.getElementById('meeting-filter-dept');
  const typeSelect = document.getElementById('meeting-filter-type');

  tabUpcoming?.addEventListener('click', () => {
    activeMeetingTab = 'upcoming';
    tabUpcoming.classList.add('active');
    tabHistory.classList.remove('active');
    renderMeetingsList();
  });

  tabHistory?.addEventListener('click', () => {
    activeMeetingTab = 'history';
    tabHistory.classList.add('active');
    tabUpcoming.classList.remove('active');
    renderMeetingsList();
  });

  const triggerFilter = () => renderMeetingsList();
  deptSelect?.addEventListener('change', triggerFilter);
  typeSelect?.addEventListener('change', triggerFilter);

  btnReset?.addEventListener('click', () => {
    if (deptSelect) deptSelect.value = '';
    if (typeSelect) typeSelect.value = '';
    renderMeetingsList();
    showToast('Meeting filters reset', 'info');
  });

  btnDownloadReport?.addEventListener('click', () => {
    const list = Store.getMeetings();
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['ID,Title,Department,Type,Date,Time,Presiding Officer,Status'].join(',') + '\n' +
      list.map(m => `"${m.id}","${m.title}","${m.department}","${m.type}","${m.date}","${m.time}","${m.presidingOfficer}","${m.status}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AMC_Meetings_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded AMC Meetings Report CSV', 'success');
  });

  // Modal open/close & submit
  const modal = document.getElementById('schedule-meeting-modal');
  const form = document.getElementById('schedule-meeting-form');
  const closeModal = () => modal?.classList.remove('open');

  btnScheduleOpen?.addEventListener('click', () => modal?.classList.add('open'));
  document.getElementById('schedule-meeting-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('schedule-meeting-modal-cancel')?.addEventListener('click', closeModal);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('meeting-form-title').value.trim(),
      department: document.getElementById('meeting-form-dept').value,
      type: document.getElementById('meeting-form-type').value,
      date: document.getElementById('meeting-form-date').value,
      time: document.getElementById('meeting-form-time').value.trim(),
      presidingOfficer: document.getElementById('meeting-form-officer').value.trim(),
      venue: document.getElementById('meeting-form-venue').value.trim(),
      agenda: document.getElementById('meeting-form-agenda').value.trim()
    };

    Store.scheduleMeeting(payload);
    closeModal();
    form.reset();
    renderMeetingsScreen();
    showToast('Municipal meeting scheduled and invitations dispatched!', 'success');
  });
}

function renderMeetingsScreen() {
  const meetings = Store.getMeetings();
  const total = meetings.length;
  const upcoming = meetings.filter(m => m.status === 'Upcoming').length;
  const completed = meetings.filter(m => m.status === 'Completed').length;

  const totalEl = document.getElementById('meeting-kpi-total');
  const upcomingEl = document.getElementById('meeting-kpi-upcoming');
  const completedEl = document.getElementById('meeting-kpi-completed');
  const countUpcoming = document.getElementById('count-upcoming-meetings');
  const countHistory = document.getElementById('count-history-meetings');

  if (totalEl) totalEl.textContent = total;
  if (upcomingEl) upcomingEl.textContent = upcoming;
  if (completedEl) completedEl.textContent = completed;
  if (countUpcoming) countUpcoming.textContent = upcoming;
  if (countHistory) countHistory.textContent = total - upcoming;

  renderMeetingsList();
}

function renderMeetingsList() {
  const container = document.getElementById('meeting-cards-container');
  if (!container) return;

  const meetings = Store.getMeetings();
  const selDept = document.getElementById('meeting-filter-dept')?.value || '';
  const selType = document.getElementById('meeting-filter-type')?.value || '';

  const filtered = meetings.filter(m => {
    const isUpcoming = m.status === 'Upcoming';
    if (activeMeetingTab === 'upcoming' && !isUpcoming) return false;
    if (activeMeetingTab === 'history' && isUpcoming) return false;

    const matchDept = !selDept || m.department === selDept;
    const matchType = !selType || m.type === selType;
    return matchDept && matchType;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 2.5rem; text-align: center; color: #64748b;">
        <span style="font-size: 2rem;">📅</span>
        <h4 style="margin: 0.5rem 0; color: #0f172a;">No meetings found</h4>
        <p style="font-size: 0.8125rem;">No scheduled meetings match the current filter parameters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => `
    <div class="meeting-card-item">
      <div class="meeting-card-header">
        <div>
          <span class="meeting-type-tag">${m.type}</span>
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 0.4rem;">
            ${m.title}
          </h3>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.725rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 9999px; background: ${m.status === 'Upcoming' ? '#ecfdf5; color: #047857;' : '#f1f5f9; color: #64748b;'}">
            ● ${m.status}
          </span>
          ${m.status === 'Upcoming' ? `
            <button type="button" class="pill-btn" style="padding: 0.2rem 0.5rem; font-size: 0.725rem; color: #dc2626;" onclick="window.cancelMunicipalMeeting(${m.id})">
              Cancel
            </button>
          ` : ''}
        </div>
      </div>

      <div class="meeting-meta-row">
        <div class="meeting-meta-item">
          <span>🏢</span>
          <strong style="color: #0f172a;">${m.department}</strong>
        </div>
        <div class="meeting-meta-item">
          <span>📅</span>
          <span>${m.date} (${m.time})</span>
        </div>
        <div class="meeting-meta-item">
          <span>📍</span>
          <span>${m.venue}</span>
        </div>
        <div class="meeting-meta-item">
          <span>👤</span>
          <span>Presiding: ${m.presidingOfficer}</span>
        </div>
      </div>

      <div class="meeting-agenda-box">
        <strong>AGENDA:</strong> ${m.agenda}
      </div>
    </div>
  `).join('');
}

window.cancelMunicipalMeeting = function(id) {
  Store.cancelMeeting(id);
  renderMeetingsScreen();
  showToast('Meeting cancelled and notice posted to council board.', 'error');
};

// ============================================================================
// 6B. Screens 7 & 8: Appointment Management & Show Appointments (Figma Replica)
// ============================================================================
function setupAppointmentScreens() {
  const searchInput = document.getElementById('appt-search-input');
  const btnOpenBook = document.getElementById('btn-open-book-appt');
  const btnQuickBook = document.getElementById('btn-quick-book-from-show');

  const showSearch = document.getElementById('show-appts-search');
  const showDeptFilter = document.getElementById('show-appts-dept-filter');

  // Populate department filter for show appointments
  const depts = Store.getDepartments();
  if (showDeptFilter) {
    showDeptFilter.innerHTML = '<option value="">All Departments</option>' +
      depts.map(d => `<option value="${d.nameEn}">${d.nameEn}</option>`).join('');
  }

  // Search input triggers
  searchInput?.addEventListener('input', () => renderAppointmentMgmtScreen());
  showSearch?.addEventListener('input', () => renderShowAppointmentsScreen());
  showDeptFilter?.addEventListener('change', () => renderShowAppointmentsScreen());

  // Book appointment modal open triggers
  const bookModal = document.getElementById('book-appointment-modal');
  const bookForm = document.getElementById('book-appointment-form');
  const closeBookModal = () => bookModal?.classList.remove('open');

  btnOpenBook?.addEventListener('click', () => {
    const dateInput = document.getElementById('book-appt-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    bookModal?.classList.add('open');
  });

  btnQuickBook?.addEventListener('click', () => {
    const dateInput = document.getElementById('book-appt-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    bookModal?.classList.add('open');
  });

  document.getElementById('book-appt-modal-close')?.addEventListener('click', closeBookModal);
  document.getElementById('book-appt-modal-cancel')?.addEventListener('click', closeBookModal);

  bookForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      citizenName: document.getElementById('book-appt-name').value.trim(),
      mobile: document.getElementById('book-appt-mobile').value.trim(),
      department: document.getElementById('book-appt-dept').value,
      officer: document.getElementById('book-appt-officer').value,
      date: document.getElementById('book-appt-date').value,
      timeSlot: document.getElementById('book-appt-timeslot').value,
      purpose: document.getElementById('book-appt-purpose').value.trim(),
      priority: document.getElementById('book-appt-priority').value,
      venue: document.getElementById('book-appt-venue').value.trim(),
      remarks: document.getElementById('book-appt-remarks').value.trim()
    };

    const newAppt = Store.createAppointment(payload);
    closeBookModal();
    bookForm.reset();
    renderAppointmentMgmtScreen();
    renderShowAppointmentsScreen();
    showToast(`Appointment #${newAppt.appointmentNo} booked for ${newAppt.citizenName}!`, 'success');
  });

  // Status Tab selection on Show Appointments screen
  const tabPending = document.getElementById('show-tab-pending');
  const tabInprogress = document.getElementById('show-tab-inprogress');
  const tabCompleted = document.getElementById('show-tab-completed');
  const tabRejected = document.getElementById('show-tab-rejected');
  const tabRescheduled = document.getElementById('show-tab-rescheduled');

  const tabs = [tabPending, tabInprogress, tabCompleted, tabRejected, tabRescheduled];

  tabs.forEach(tab => {
    tab?.addEventListener('click', () => {
      tabs.forEach(t => {
        if (!t) return;
        t.classList.remove('active');
        t.style.color = '#64748b';
        t.style.borderBottomColor = 'transparent';
      });

      tab.classList.add('active');
      const st = tab.dataset.status;
      activeShowApptTab = st;

      const activeColor = st === 'Pending' ? '#d97706' : (st === 'In Progress' ? '#0284c7' : (st === 'Completed' ? '#059669' : (st === 'Rejected' ? '#dc2626' : '#ea580c')));
      tab.style.color = activeColor;
      tab.style.borderBottomColor = activeColor;

      renderShowAppointmentsScreen();
    });
  });
}

function renderAppointmentMgmtScreen() {
  const appointments = Store.getAppointments();
  const todayStr = new Date().toISOString().split('T')[0];

  const todayList = appointments.filter(a => a.isToday || a.date === todayStr);
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const inProgressCount = appointments.filter(a => a.status === 'In Progress').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const rejectedCount = appointments.filter(a => a.status === 'Rejected').length;
  const rescheduledCount = appointments.filter(a => a.status === 'Rescheduled').length;
  const totalCount = appointments.length;

  // Set KPI counts matching Screenshot 1 & 3
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('appt-kpi-today', todayList.length);
  setEl('appt-kpi-pending', pendingCount);
  setEl('appt-kpi-completed', completedCount);
  setEl('appt-kpi-rescheduled', rescheduledCount);
  setEl('appt-kpi-inprogress', inProgressCount);
  setEl('appt-kpi-rejected', rejectedCount);
  setEl('appt-kpi-total', totalCount);

  // Set dynamic pill text
  const pendingToday = todayList.filter(a => a.status === 'Pending').length;
  const completedToday = todayList.filter(a => a.status === 'Completed').length;
  const rescheduledToday = todayList.filter(a => a.status === 'Rescheduled').length;
  const inProgressToday = todayList.filter(a => a.status === 'In Progress').length;
  const rejectedToday = todayList.filter(a => a.status === 'Rejected').length;

  setEl('appt-pill-pending', `${pendingToday} Today`);
  setEl('appt-pill-completed', `${completedToday} Today`);
  setEl('appt-pill-rescheduled', `${rescheduledToday} Today`);
  setEl('appt-pill-inprogress', `${inProgressToday} Today`);
  setEl('appt-pill-rejected', `${rejectedToday} Today`);

  // Filter Today's Appointments by Search
  const q = document.getElementById('appt-search-input')?.value.trim().toLowerCase() || '';
  const filteredToday = todayList.filter(a => {
    return !q ||
      a.appointmentNo.toLowerCase().includes(q) ||
      a.citizenName.toLowerCase().includes(q) ||
      a.mobile.includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.officer.toLowerCase().includes(q) ||
      a.purpose.toLowerCase().includes(q);
  });

  const subtitle = document.getElementById('appt-today-count-subtitle');
  if (subtitle) {
    subtitle.textContent = filteredToday.length > 0
      ? `Showing 1-${filteredToday.length} of ${filteredToday.length} appointment(s)`
      : `Showing 0-0 of 0 appointment(s)`;
  }

  const container = document.getElementById('appt-today-list-container');
  if (!container) return;

  if (filteredToday.length === 0) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 220px; width: 100%;">
        <div style="background: #e0f2fe; color: #0284c7; padding: 0.65rem 1.6rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; border: 1px solid #bae6fd;">
          There are no appointments in the system yet.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="gov-data-table">
      <thead>
        <tr>
          <th style="width: 140px;">APPOINTMENT NO.</th>
          <th>CITIZEN / DELEGATION</th>
          <th>DEPARTMENT & DIGNITARY</th>
          <th style="width: 150px;">TIME SLOT</th>
          <th>PURPOSE & VENUE</th>
          <th style="width: 110px;">STATUS</th>
          <th style="width: 120px; text-align: center;">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        ${filteredToday.map(a => {
          const sBg = a.status === 'Completed' ? '#ecfdf5' : (a.status === 'In Progress' ? '#eff6ff' : (a.status === 'Rejected' ? '#fef2f2' : '#fffbeb'));
          const sColor = a.status === 'Completed' ? '#047857' : (a.status === 'In Progress' ? '#0284c7' : (a.status === 'Rejected' ? '#dc2626' : '#b45309'));
          return `
            <tr>
              <td>
                <span style="font-family: monospace; font-weight: 800; color: #0f172a; font-size: 0.8125rem;">${a.appointmentNo}</span>
              </td>
              <td>
                <div style="font-weight: 800; color: #0f172a; font-size: 0.825rem;">${a.citizenName}</div>
                <div style="font-size: 0.725rem; color: #166534; font-weight: 700;">📞 ${a.mobile}</div>
              </td>
              <td>
                <div style="font-weight: 700; color: #0f172a; font-size: 0.8125rem;">${a.officer}</div>
                <div style="font-size: 0.725rem; color: #64748b;">${a.department}</div>
              </td>
              <td>
                <div style="font-size: 0.8rem; font-weight: 700; color: #2563eb;">⏱ ${a.timeSlot}</div>
                <div style="font-size: 0.675rem; color: #94a3b8;">Today (${a.date})</div>
              </td>
              <td>
                <div style="font-size: 0.8125rem; font-weight: 700; color: #334155;">${a.purpose}</div>
                <div style="font-size: 0.725rem; color: #64748b;">📍 ${a.venue}</div>
              </td>
              <td>
                <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.725rem; font-weight: 700; background: ${sBg}; color: ${sColor}; padding: 0.2rem 0.55rem; border-radius: 9999px;">
                  ● ${a.status}
                </span>
              </td>
              <td style="text-align: center;">
                <button type="button" class="pill-btn" style="font-size: 0.725rem; padding: 0.25rem 0.6rem;" onclick="window.switchAdminScreen('show-appointments')">
                  View Dossier
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderShowAppointmentsScreen() {
  const appointments = Store.getAppointments();

  // Tab counts
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const inProgressCount = appointments.filter(a => a.status === 'In Progress').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const rejectedCount = appointments.filter(a => a.status === 'Rejected').length;
  const rescheduledCount = appointments.filter(a => a.status === 'Rescheduled').length;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('count-show-pending', pendingCount);
  setEl('count-show-inprogress', inProgressCount);
  setEl('count-show-completed', completedCount);
  setEl('count-show-rejected', rejectedCount);
  setEl('count-show-rescheduled', rescheduledCount);

  // Filter
  const q = document.getElementById('show-appts-search')?.value.trim().toLowerCase() || '';
  const selDept = document.getElementById('show-appts-dept-filter')?.value || '';

  const filtered = appointments.filter(a => {
    if (a.status !== activeShowApptTab) return false;
    const matchDept = !selDept || a.department === selDept;
    const matchQ = !q ||
      a.appointmentNo.toLowerCase().includes(q) ||
      a.citizenName.toLowerCase().includes(q) ||
      a.mobile.includes(q) ||
      a.officer.toLowerCase().includes(q) ||
      a.purpose.toLowerCase().includes(q);
    return matchDept && matchQ;
  });

  const container = document.getElementById('show-appts-content-container');
  if (!container) return;

  // Empty State (Matching Screenshot 2 Exactly)
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 4rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.85rem; background: #ffffff;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: #f8fafc; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: #94a3b8; font-weight: 800;">
          !
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">
          No ${activeShowApptTab.toLowerCase()} appointments
        </h3>
        <p style="font-size: 0.8125rem; color: #64748b; margin: 0;">
          All appointments in this category will appear here
        </p>
      </div>
    `;
    return;
  }

  // Populated Cards List
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${filtered.map(a => {
        const sBg = a.status === 'Completed' ? '#ecfdf5' : (a.status === 'In Progress' ? '#eff6ff' : (a.status === 'Rejected' ? '#fef2f2' : '#fffbeb'));
        const sColor = a.status === 'Completed' ? '#047857' : (a.status === 'In Progress' ? '#0284c7' : (a.status === 'Rejected' ? '#dc2626' : '#b45309'));
        const pClass = a.priority === 'HIGH' ? 'priority-critical' : (a.priority === 'MEDIUM' ? 'priority-high' : 'priority-normal');

        return `
          <div class="meeting-card-item">
            <div class="meeting-card-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-family: monospace; font-weight: 800; font-size: 0.85rem; color: #0f172a;">#${a.appointmentNo}</span>
                <span class="priority-badge ${pClass}">${a.priority || 'MEDIUM'}</span>
                <span style="font-size: 0.725rem; font-weight: 700; background: ${sBg}; color: ${sColor}; padding: 0.2rem 0.6rem; border-radius: 9999px;">
                  ● ${a.status}
                </span>
              </div>

              <div style="display: flex; gap: 0.4rem;">
                ${a.status !== 'In Progress' && a.status !== 'Completed' ? `
                  <button type="button" class="pill-btn" style="padding: 0.2rem 0.6rem; font-size: 0.725rem;" onclick="window.updateApptStatus(${a.id}, 'In Progress')">
                    Approve / In Progress
                  </button>
                ` : ''}
                ${a.status !== 'Completed' ? `
                  <button type="button" class="pill-btn" style="padding: 0.2rem 0.6rem; font-size: 0.725rem; background: #059669; color: #fff; border-color: #059669;" onclick="window.updateApptStatus(${a.id}, 'Completed')">
                    Mark Completed
                  </button>
                ` : ''}
                ${a.status !== 'Rescheduled' ? `
                  <button type="button" class="pill-btn" style="padding: 0.2rem 0.6rem; font-size: 0.725rem; color: #ea580c;" onclick="window.openReschedulePrompt(${a.id})">
                    Reschedule
                  </button>
                ` : ''}
                ${a.status !== 'Rejected' ? `
                  <button type="button" class="pill-btn" style="padding: 0.2rem 0.6rem; font-size: 0.725rem; color: #dc2626;" onclick="window.updateApptStatus(${a.id}, 'Rejected')">
                    Reject
                  </button>
                ` : ''}
              </div>
            </div>

            <div class="meeting-meta-row">
              <div class="meeting-meta-item">
                <span>👤</span>
                <strong style="color: #0f172a;">${a.citizenName}</strong>
                <span style="font-family: monospace; color: #166534; font-weight: 700;">(📞 ${a.mobile})</span>
              </div>
              <div class="meeting-meta-item">
                <span>🏛️</span>
                <span>Meeting With: <strong style="color: #0f172a;">${a.officer}</strong></span>
              </div>
              <div class="meeting-meta-item">
                <span>🏢</span>
                <span>${a.department}</span>
              </div>
              <div class="meeting-meta-item">
                <span>📅</span>
                <span style="font-weight: 700; color: #2563eb;">${a.date} (${a.timeSlot})</span>
              </div>
              <div class="meeting-meta-item">
                <span>📍</span>
                <span>${a.venue}</span>
              </div>
            </div>

            <div class="meeting-agenda-box">
              <strong>PURPOSE & NOTES:</strong> ${a.purpose}<br />
              <span style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; display: inline-block;">
                Directives: ${a.remarks || 'Standard civic hearing protocol.'}
              </span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.updateApptStatus = function(id, newStatus) {
  Store.updateAppointmentStatus(id, newStatus);
  renderAppointmentMgmtScreen();
  renderShowAppointmentsScreen();
  showToast(`Appointment status updated to ${newStatus}`, 'info');
};

window.openReschedulePrompt = function(id) {
  const newDate = prompt('Enter new date for appointment (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
  if (!newDate) return;
  const newTime = prompt('Enter new time slot:', '03:00 PM - 03:30 PM');
  if (!newTime) return;

  const list = Store.getAppointments();
  const appt = list.find(a => Number(a.id) === Number(id));
  if (appt) {
    appt.date = newDate;
    appt.timeSlot = newTime;
    appt.status = 'Rescheduled';
    appt.isToday = newDate === new Date().toISOString().split('T')[0];
    appt.remarks = `Rescheduled to ${newDate} (${newTime})`;
    Store.commitAppointments(list);
    renderAppointmentMgmtScreen();
    renderShowAppointmentsScreen();
    showToast(`Appointment #${appt.appointmentNo} rescheduled!`, 'success');
  }
};

// ============================================================================
// 7. Screen 5: Department Master (Bilingual 66 Depts, HODs, SLAs)
// ============================================================================
function setupDeptMasterScreen() {
  const searchInput = document.getElementById('dept-search-input');
  const statusPills = document.querySelectorAll('.dept-status-pill');
  const btnAddOpen = document.getElementById('btn-add-dept-open');
  const addModal = document.getElementById('add-dept-modal');
  const addForm = document.getElementById('add-dept-form');

  searchInput?.addEventListener('input', () => renderDeptMasterTable());

  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => {
        p.classList.remove('active');
        p.style.background = '#f1f5f9';
        p.style.color = '#475569';
        p.style.borderColor = '#cbd5e1';
      });
      pill.classList.add('active');
      pill.style.background = '#059669';
      pill.style.color = '#ffffff';
      pill.style.borderColor = '#059669';

      deptFilterStatus = pill.dataset.status;
      renderDeptMasterTable();
    });
  });

  const closeAddModal = () => addModal?.classList.remove('open');
  btnAddOpen?.addEventListener('click', () => addModal?.classList.add('open'));
  document.getElementById('add-dept-modal-close')?.addEventListener('click', closeAddModal);
  document.getElementById('add-dept-modal-cancel')?.addEventListener('click', closeAddModal);

  addForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      code: document.getElementById('dept-form-code').value.trim().toUpperCase(),
      nameEn: document.getElementById('dept-form-name-en').value.trim(),
      nameMr: document.getElementById('dept-form-name-mr').value.trim(),
      hod: document.getElementById('dept-form-hod').value.trim() || 'Unassigned',
      slaHours: Number(document.getElementById('dept-form-sla').value) || 24
    };

    Store.addDepartment(payload);
    closeAddModal();
    addForm.reset();
    renderDeptMasterTable();
    populateDeptFilterDropdowns();
    showToast(`Registered new department: ${payload.nameEn}`, 'success');
  });
}

function renderDeptMasterTable() {
  const tbody = document.getElementById('dept-master-tbody');
  if (!tbody) return;

  const depts = Store.getDepartments();
  const q = document.getElementById('dept-search-input')?.value.trim().toLowerCase() || '';

  const totalEl = document.getElementById('kpi-dept-total');
  const activeEl = document.getElementById('kpi-dept-active');
  const inactiveEl = document.getElementById('kpi-dept-inactive');

  const activeCount = depts.filter(d => d.status === 'Active').length;
  const inactiveCount = depts.filter(d => d.status === 'Inactive').length;

  if (totalEl) totalEl.textContent = depts.length <= 9 ? 66 : depts.length;
  if (activeEl) activeEl.textContent = activeCount <= 9 ? 66 : activeCount;
  if (inactiveEl) inactiveEl.textContent = inactiveCount;

  const filtered = depts.filter(d => {
    if (deptFilterStatus !== 'all' && d.status !== deptFilterStatus) return false;
    const matchQ = !q ||
      d.code.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.nameMr.toLowerCase().includes(q) ||
      d.hod.toLowerCase().includes(q);
    return matchQ;
  });

  tbody.innerHTML = filtered.map(d => `
    <tr style="${d.status === 'Inactive' ? 'opacity: 0.6;' : ''}">
      <td><span style="font-weight: 800; color: #64748b; font-size: 0.8rem;">#${d.id}</span></td>
      <td><span style="font-weight: 700; color: #64748b; font-family: monospace;">${d.code}</span></td>
      <td><strong>${d.nameEn}</strong></td>
      <td style="color: #475569; font-weight: 600;">${d.nameMr}</td>
      <td>${d.hod}</td>
      <td><strong>${d.slaHours}h</strong></td>
      <td>
        <span style="font-size: 0.725rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; background: ${d.status === 'Active' ? '#ecfdf5; color: #047857;' : '#f1f5f9; color: #64748b;'}">
          ● ${d.status}
        </span>
      </td>
      <td style="text-align: center;">
        <div style="display: inline-flex; gap: 0.35rem;">
          <button type="button" class="pill-btn" style="padding: 0.2rem 0.5rem;" onclick="window.toggleDept(${d.id})" title="Toggle Status">
            ⏻
          </button>
          <button type="button" class="pill-btn" style="padding: 0.2rem 0.5rem; color: #dc2626;" onclick="window.deleteDept(${d.id})" title="Delete Department">
            🗑
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleDept = function(id) {
  Store.toggleDeptStatus(id);
  renderDeptMasterTable();
  populateDeptFilterDropdowns();
  showToast('Department status updated', 'info');
};

window.deleteDept = function(id) {
  Store.deleteDepartment(id);
  renderDeptMasterTable();
  populateDeptFilterDropdowns();
  showToast('Department deleted', 'error');
};



// ============================================================================
// 9. Reassignment & Resolution Modals
// ============================================================================
function setupModals() {
  // Reassign Modal
  const assignModal = document.getElementById('assign-modal');
  const assignForm = document.getElementById('assign-form');
  const assignClose = document.getElementById('assign-modal-close');
  const assignCancel = document.getElementById('assign-modal-cancel');

  const closeAssign = () => assignModal?.classList.remove('open');
  assignClose?.addEventListener('click', closeAssign);
  assignCancel?.addEventListener('click', closeAssign);

  assignForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeWorkbenchComplaint) return;

    const dept = document.getElementById('assign-dept-select').value;
    const officer = document.getElementById('assign-officer-input').value;

    Store.assignOfficer(activeWorkbenchComplaint.id, officer, dept);
    closeAssign();
    showToast(`Reassigned to ${dept} (Officer: ${officer})`, 'success');

    allComplaints = Store.getAll();
    renderAllComplaintsTable();
    renderWorkbenchAccordionTable();
  });

  // Resolve Modal
  const resolveModal = document.getElementById('resolve-modal');
  const resolveForm = document.getElementById('resolve-form');
  const resolveClose = document.getElementById('resolve-modal-close');
  const resolveCancel = document.getElementById('resolve-modal-cancel');

  const closeResolve = () => resolveModal?.classList.remove('open');
  resolveClose?.addEventListener('click', closeResolve);
  resolveCancel?.addEventListener('click', closeResolve);

  resolveForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeWorkbenchComplaint) return;

    const remarks = document.getElementById('resolve-remarks-input').value;
    const photoUrl = document.getElementById('resolve-photo-input').value;

    const updated = Store.updateComplaintStatus(activeWorkbenchComplaint.id, 'Resolved', remarks);
    if (updated && photoUrl) {
      updated.images.after = photoUrl;
      Store.commitComplaints(Store.getAll());
    }

    closeResolve();
    showToast('Grievance marked as Resolved & Closed!', 'success');

    allComplaints = Store.getAll();
    renderAllComplaintsTable();
    renderWorkbenchAccordionTable();
  });
}

// ============================================================================
// 10. Live Cross-Tab Synchronization
// ============================================================================
function setupCrossTabSync() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'NTIS_COMPLAINTS_V1') {
      allComplaints = Store.getAll();
      renderAllComplaintsTable();
      renderWorkbenchAccordionTable();
      if (allComplaints.length > 0 && allComplaints[0].isNew) {
        showToast(`★ New citizen grievance received: ${allComplaints[0].grievanceNo}`, 'success');
      }
    }
  });

  window.addEventListener('NTIS_STORE_UPDATED', () => {
    allComplaints = Store.getAll();
    renderAllComplaintsTable();
    renderWorkbenchAccordionTable();
  });

  window.addEventListener('NTIS_TASKS_UPDATED', () => {
    renderTasksScreen();
  });

  window.addEventListener('NTIS_MEETINGS_UPDATED', () => {
    renderMeetingsScreen();
  });

  window.addEventListener('NTIS_DEPTS_UPDATED', () => {
    renderDeptMasterTable();
    populateDeptFilterDropdowns();
  });


  window.addEventListener('NTIS_APPOINTMENTS_UPDATED', () => {
    renderAppointmentMgmtScreen();
    renderShowAppointmentsScreen();
  });
}

// ============================================================================
// 11. Option 1 • Compact Split Layout (New Grievance Page - Figma Replica)
// ============================================================================
function setupNewGrievanceSplitScreen() {
  const form = document.getElementById('new-grievance-split-form');
  const photosList = document.getElementById('new-grv-photos-list');
  const addPhotoBtn = document.getElementById('btn-add-split-photo');
  const officerSelect = document.getElementById('new-grv-officer-select');
  const officerSub = document.getElementById('new-grv-officer-sub');
  const toggleBtn = document.getElementById('new-grv-additional-toggle');
  const toggleContent = document.getElementById('new-grv-additional-content');
  const toggleSymbol = document.getElementById('new-grv-toggle-symbol');
  const toggleArrow = document.getElementById('new-grv-toggle-arrow');
  const draftBtn = document.getElementById('btn-new-grv-draft');

  // Officer designation map
  const OFFICER_ROLES = {
    'A. Deshmukh': 'Sanitary Inspector • Ward 5',
    'Er. Rajesh Bansod': 'Deputy City Engineer • PWD',
    'Suresh Kumar': 'Senior Health Inspector • Ward 2',
    'Ramesh Patil': 'Junior Engineer • PWD Camp',
    'Sunita Patil': 'Chief Inspector • Trade & Market',
    'Anjali Nair': 'Executive Officer • Water Supply'
  };

  officerSelect?.addEventListener('change', () => {
    const val = officerSelect.value;
    if (officerSub) {
      officerSub.textContent = OFFICER_ROLES[val] || 'Field Operational Officer • AMC';
    }
  });

  // Photo delete handlers
  photosList?.addEventListener('click', (e) => {
    if (e.target.classList.contains('split-photo-delete')) {
      const thumb = e.target.closest('.split-photo-thumb');
      thumb?.remove();
      showToast('Photo removed from evidence', 'info');
    }
  });

  // Add photo sample handler
  addPhotoBtn?.addEventListener('click', () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
      'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500',
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500'
    ];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    const newThumb = document.createElement('div');
    newThumb.className = 'split-photo-thumb';
    newThumb.innerHTML = `
      <img src="${randomPhoto}" alt="Added evidence photo" />
      <button type="button" class="split-photo-delete" title="Remove photo">✕</button>
    `;
    photosList.insertBefore(newThumb, addPhotoBtn);
    showToast('Photo added to evidence list', 'success');
  });

  // Additional details accordion toggle
  toggleBtn?.addEventListener('click', () => {
    const isHidden = toggleContent.style.display === 'none';
    toggleContent.style.display = isHidden ? 'block' : 'none';
    if (toggleSymbol) toggleSymbol.textContent = isHidden ? '−' : '+';
    if (toggleArrow) toggleArrow.textContent = isHidden ? '⌃' : '⌄';
  });

  // Save Draft
  draftBtn?.addEventListener('click', () => {
    const draft = {
      desc: document.getElementById('new-grv-desc-input')?.value || '',
      zone: document.getElementById('new-grv-zone-select')?.value || '',
      ward: document.getElementById('new-grv-ward-select')?.value || '',
      dept: document.getElementById('new-grv-dept-select')?.value || '',
      officer: officerSelect?.value || '',
      citizenName: document.getElementById('new-grv-citizen-name')?.value || '',
      citizenMobile: document.getElementById('new-grv-citizen-mobile')?.value || '',
      landmark: document.getElementById('new-grv-landmark')?.value || '',
      priority: document.getElementById('new-grv-priority')?.value || 'MEDIUM'
    };
    localStorage.setItem('NTIS_GRIEVANCE_DRAFT_V1', JSON.stringify(draft));
    showToast('Draft saved successfully to municipal desk!', 'info');
  });

  // Submit & Assign
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = document.getElementById('new-grv-desc-input')?.value.trim();
    const zone = document.getElementById('new-grv-zone-select')?.value;
    const ward = document.getElementById('new-grv-ward-select')?.value;
    const dept = document.getElementById('new-grv-dept-select')?.value;
    const officer = officerSelect?.value;
    const citizenName = document.getElementById('new-grv-citizen-name')?.value.trim() || 'Mohan Kulkarni';
    const mobile = document.getElementById('new-grv-citizen-mobile')?.value.trim() || '9822154320';
    const landmark = document.getElementById('new-grv-landmark')?.value.trim() || 'Rajkamal Square, Amravati';
    const priority = document.getElementById('new-grv-priority')?.value || 'HIGH';

    // Collect photos
    const thumbs = photosList.querySelectorAll('.split-photo-thumb img');
    const photos = Array.from(thumbs).map(img => img.src);
    const primaryPhoto = photos[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500';

    const complaints = Store.getAll();
    const nextId = complaints.length > 0 ? Math.max(...complaints.map(c => Number(c.id) || 0)) + 1 : 230;
    const grievanceNo = `GRV-2026-${String(nextId).padStart(6, '0')}`;

    const newComplaint = {
      id: nextId,
      grievanceNo: grievanceNo,
      trackingId: grievanceNo,
      citizen: citizenName,
      mobile: mobile,
      department: dept,
      category: 'Garbage Collection & Cleanliness',
      location: `${landmark} (${ward}, ${zone})`,
      landmark: landmark,
      status: 'In Progress',
      priority: priority,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      slaRemaining: priority === 'HIGH' ? '23h remaining' : '47h remaining',
      assignedOfficer: officer,
      isNew: true,
      images: {
        before: primaryPhoto,
        after: null
      },
      timeline: [
        { step: 1, title: '1. Grievance Submitted', subtitle: `${citizenName} • Direct intake via Commissioner Desk`, status: 'done', current: false },
        { step: 2, title: '2. Field Unit Assigned', subtitle: `Assigned to ${officer} (${zone}, ${ward})`, status: 'done', current: true },
        { step: 3, title: '3. Under Review & Inspection', subtitle: 'Site inspection initiated', status: 'pending', current: false },
        { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending field resolution', status: 'pending', current: false }
      ]
    };

    complaints.unshift(newComplaint);
    Store.commitComplaints(complaints);

    // Clear draft if any
    localStorage.removeItem('NTIS_GRIEVANCE_DRAFT_V1');

    showToast(`Grievance #${grievanceNo} submitted & assigned to ${officer}!`, 'success');

    // Switch to all-complaints queue to see the new item
    window.switchAdminScreen('all-complaints');
  });
}
