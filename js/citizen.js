/**
 * ============================================================================
 * Amravati Municipal Corporation (AMC) - Citizen Dashboard & Tracker Logic
 * Powers: Live Tracker, Leaflet GIS Map, and 3-Step Grievance Wizard
 * ============================================================================
 */

import { Store, MASTER_CATEGORIES, MASTER_WARDS, showToast } from './store.js';
import { t, applyTranslations } from './i18n.js';

let leafletMap = null;
let allGrievances = [];
let currentTicketTab = 'all';
let selectedTicketToken = '#GRV-2026-000202';
let uploadedWizardPhoto = null;

// Realistic ticket sample matching screenshot
const TICKETS_SAMPLE = [
  {
    token: '#GRV-2026-000202',
    title: 'Waterlogging',
    department: 'Sewerage & Drainage Department',
    location: 'Camp Main Road',
    date: '22 Oct 2026, 01:19 pm',
    icon: '🌊',
    status: 'Pending',
    assignedOfficer: 'Unassigned',
    photo: 'images/water-before.jpg'
  },
  {
    token: '#GRV-2026-000175',
    title: 'Potholes',
    department: 'Road Maintenance Department',
    location: 'Camp Main Road',
    date: '17 Oct 2026, 02:33 pm',
    icon: '🛣️',
    status: 'Resolved',
    assignedOfficer: 'Er. Amit V. Patil',
    officerRole: 'Junior Engineer (Civil & PWD)',
    officerPhone: '+91 94228 67123',
    officerEmail: 'amit.patil@amravatimc.gov.in',
    squad: 'Ward 1 Rapid Pothole Repair Squad',
    squadSize: '5 Field Technicians',
    machinery: 'Hot-Mix Asphalt Compactor & Mini Roller (AMC-R-04)',
    supervisor: 'Sunil More (Field Supervisor)',
    photo: 'images/pothole-before.jpg',
    afterPhoto: 'images/pothole-after.jpg',
    inspectionRemarks: 'Site inspection conducted by Er. Amit Patil. Asphalt leveling and sub-base compaction completed.',
    resolutionRemarks: 'Pothole filled and road leveled. Inspected and verified on site by Junior Engineer. Traffic restored.'
  },
  {
    token: '#GRV-2026-000108',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Gadge Nagar Main Road',
    date: '21 Oct 2026, 12:51 pm',
    icon: '🌊',
    status: 'In Progress',
    assignedOfficer: 'Sanjay Patil',
    officerRole: 'Senior Sanitary Inspector',
    officerPhone: '+91 98224 51098',
    officerEmail: 'sanjay.patil@amravatimc.gov.in',
    squad: 'Drainage Jetting Unit 2 (Super Sucker)',
    squadSize: '4 Crew Members',
    machinery: 'High-Pressure Sewer Jetting Machine (AMC-SJ-02)',
    supervisor: 'Ganesh Shinde (Sanitation Supervisor)',
    photo: 'images/sewer-before.jpg',
    inspectionRemarks: 'Field squad on site. High-pressure jetting unit active in clearing deep chamber blockage.',
    resolutionRemarks: 'Awaiting final chamber flow verification upon clearance.'
  },
  {
    token: '#GRV-2026-000116',
    title: 'Light not working',
    department: 'Street Lighting Department',
    location: 'Rajapeth Lane 4',
    date: '19 Oct 2026, 06:15 pm',
    icon: '💡',
    status: 'Resolved',
    assignedOfficer: 'Suresh S. Kale',
    officerRole: 'Assistant Electrical Engineer',
    officerPhone: '+91 98901 23456',
    officerEmail: 'suresh.kale@amravatimc.gov.in',
    squad: 'Ward 1 Street Lighting Maintenance Unit',
    squadSize: '3 Electricians',
    machinery: 'Hydraulic Bucket Truck (AMC-BT-01)',
    supervisor: 'Prakash Rao (Line Inspector)',
    photo: 'images/light-before.jpg',
    afterPhoto: 'images/light-after.jpg',
    inspectionRemarks: 'LED driver and faulty fuse wire replaced on Pole #42.',
    resolutionRemarks: 'Street lamp restored and functioning. Verified by Electrical Wing.'
  },
  {
    token: '#GRV-2026-000104',
    title: 'Light not working',
    department: 'Street Lighting Department',
    location: 'Shivaji Nagar Square',
    date: '13 Oct 2026, 10:52 am',
    icon: '💡',
    status: 'Pending',
    photo: 'images/light-before.jpg'
  },
  {
    token: '#GRV-2026-000102',
    title: 'Garbage overflow',
    department: 'Solid Waste Management',
    location: 'Dastur Nagar Road',
    date: '12 Oct 2026, 06:17 pm',
    icon: '🗑️',
    status: 'Resolved',
    assignedOfficer: 'Ramesh K. Tayade',
    officerRole: 'Chief Sanitary Inspector',
    officerPhone: '+91 94231 12345',
    officerEmail: 'ramesh.tayade@amravatimc.gov.in',
    squad: 'Ward 2 Solid Waste Mobile Unit',
    squadSize: '6 Sanitation Workers',
    machinery: 'Hydraulic Compactor Tipper (AMC-CT-03)',
    supervisor: 'Vijay Meshram',
    photo: 'images/pothole-before.jpg',
    afterPhoto: 'images/pothole-after.jpg',
    resolutionRemarks: 'Garbage cleared and bleaching powder disinfectant applied.'
  },
  {
    token: '#GRV-2026-000098',
    title: 'Potholes on Highway',
    department: 'Road Maintenance Department',
    location: 'Badnera Road',
    date: '12 Oct 2026, 05:21 pm',
    icon: '🛣️',
    status: 'Pending',
    photo: 'images/pothole-before.jpg'
  },
  {
    token: '#GRV-2026-000097',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Cotton Market',
    date: '12 Oct 2026, 05:18 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'images/sewer-before.jpg'
  },
  {
    token: '#GRV-2026-000096',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Rukhmini Nagar',
    date: '12 Oct 2026, 05:15 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'images/sewer-before.jpg'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  allGrievances = Store.getAll();

  setupNavigationTabs();
  setupLanguageSwitcher();
  setupImageLightbox();
  // Defer map init to next frame to avoid forced synchronous layout / reflow (getSize)
  requestAnimationFrame(() => {
    setupLeafletMap();
  });
  setupTicketFilters();
  setupReportWizardModal();
  setupTicketActionButtons();
  setupCitizenAuth();
  setupCitizenDossierDrawer();
  setupEditGrievanceModal();

  renderKpiCards();
  renderBottomCards();
  populateDropdowns();
  renderTicketList();

  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'NTIS_COMPLAINTS_V1') {
      allGrievances = Store.getAll();
      renderKpiCards();
      renderBottomCards();
      renderTicketList();
    }
  });

  window.addEventListener('NTIS_STORE_UPDATED', () => {
    allGrievances = Store.getAll();
    renderKpiCards();
    renderBottomCards();
    renderTicketList();
  });
});

// ============================================================================
// 1. Navigation Tabs Switcher
// ============================================================================
function setupNavigationTabs() {
  const btnDashboard = document.getElementById('nav-btn-dashboard');
  const btnTracker = document.getElementById('nav-btn-tracker');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewTracker = document.getElementById('view-tracker');
  const homeBtn = document.getElementById('header-home-btn');

  // Mobile Bottom Navigation Elements
  const mobileNavDashboard = document.getElementById('mobile-nav-dashboard');
  const mobileNavTracker = document.getElementById('mobile-nav-tracker');
  const mobileSnapBtn = document.getElementById('mobile-snap-btn');
  const mobileNavProfile = document.getElementById('mobile-nav-profile');
  const mobileBackBtn = document.getElementById('mobile-back-to-tickets-btn');
  const trackContainer = document.querySelector('.track-page-container');

  function switchTab(viewName) {
    if (viewName === 'dashboard') {
      btnDashboard?.classList.add('active');
      btnTracker?.classList.remove('active');
      mobileNavDashboard?.classList.add('active');
      mobileNavTracker?.classList.remove('active');
      if (viewDashboard) viewDashboard.style.display = 'flex';
      if (viewTracker) viewTracker.style.display = 'none';

      if (leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 150);
      }
    } else {
      btnTracker?.classList.add('active');
      btnDashboard?.classList.remove('active');
      mobileNavTracker?.classList.add('active');
      mobileNavDashboard?.classList.remove('active');
      if (viewDashboard) viewDashboard.style.display = 'none';
      if (viewTracker) viewTracker.style.display = 'flex';
    }
  }

  if (btnDashboard) {
    btnDashboard.addEventListener('click', () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
      switchTab('dashboard');
    });
  }

  if (btnTracker) {
    btnTracker.addEventListener('click', () => {
      window.location.hash = '#tracker';
      switchTab('tracker');
    });
  }

  // Mobile navigation bottom bar listeners
  if (mobileNavDashboard) {
    mobileNavDashboard.addEventListener('click', () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
      switchTab('dashboard');
    });
  }

  if (mobileNavTracker) {
    mobileNavTracker.addEventListener('click', () => {
      window.location.hash = '#tracker';
      switchTab('tracker');
    });
  }

  if (mobileSnapBtn) {
    mobileSnapBtn.addEventListener('click', () => {
      const snapBtn = document.getElementById('sidebar-snap-report-btn');
      if (snapBtn) snapBtn.click();
    });
  }

  if (mobileNavProfile) {
    mobileNavProfile.addEventListener('click', () => {
      const citizenBadge = document.getElementById('citizen-profile-badge');
      if (citizenBadge) citizenBadge.click();
    });
  }

  // Mobile back button from ticket detail to list
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', () => {
      const container = document.querySelector('.track-page-container');
      if (container) {
        container.classList.remove('mobile-detail-active');
      }
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
      switchTab('dashboard');
    });
  }

  // Initial tab state (default is always Dashboard Overview unless #tracker is explicitly in URL)
  if (window.location.hash === '#tracker') {
    switchTab('tracker');
  } else {
    switchTab('dashboard');
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#tracker') {
      switchTab('tracker');
    } else {
      switchTab('dashboard');
    }
  });

  // Reset demo
  const resetBtn = document.getElementById('sidebar-reset-demo-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Store.resetDemoData();
      allGrievances = Store.getAll();
      renderKpiCards();
      renderTicketList();
      showToast('Citizen demo data restored to initial state!', 'success');
    });
  }
}

// Language Switcher
function setupLanguageSwitcher() {
  const btn = document.getElementById('lang-toggle-btn');
  const btnText = document.getElementById('lang-btn-text');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cur = Store.getLang();
    const next = cur === 'en' ? 'mr' : 'en';
    Store.setLang(next);
    if (btnText) btnText.textContent = next === 'en' ? 'English' : 'मराठी';
    applyTranslations();
  });
}

// ============================================================================
// 2. Ticket List & Detail Rendering (Matching Screenshot 3)
// ============================================================================
function renderTicketList() {
  const container = document.getElementById('tickets-scroll-container');
  const searchInput = document.getElementById('tickets-search-input');
  if (!container) return;

  const storedList = Store.getAll().map(g => ({
    token: '#' + (g.grievanceNo || `GRV-2026-${g.id}`),
    title: g.category || 'Grievance',
    department: g.department,
    location: g.location || g.landmark || 'Amravati',
    date: g.submittedDate || '21 Oct 2026',
    icon: (g.category && g.category.includes('Pothole')) ? '🛣️' : ((g.category && (g.category.includes('manhole') || g.category.includes('Sewer') || g.category.includes('Water'))) ? '🌊' : '💡'),
    status: g.status,
    photo: (g.images && g.images.before) ? g.images.before : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
    afterPhoto: (g.images && g.images.after) ? g.images.after : (g.afterPhoto || null),
    assignedOfficer: g.assignedOfficer,
    officerRole: g.officerRole,
    officerPhone: g.officerPhone,
    officerEmail: g.officerEmail,
    squad: g.squad,
    squadSize: g.squadSize,
    machinery: g.machinery,
    supervisor: g.supervisor,
    inspectionRemarks: g.inspectionRemarks,
    resolutionRemarks: g.resolutionRemarks
  }));

  const combined = [...storedList, ...TICKETS_SAMPLE];

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const filtered = combined.filter(t => {
    const matchSearch = !query ||
      t.title.toLowerCase().includes(query) ||
      t.token.toLowerCase().includes(query) ||
      t.department.toLowerCase().includes(query);
    const matchTab = currentTicketTab === 'all' ||
      (currentTicketTab === 'pending' && t.status === 'Pending') ||
      (currentTicketTab === 'resolved' && t.status === 'Resolved');
    return matchSearch && matchTab;
  });

  const totalCount = combined.length;
  const pendingCount = combined.filter(t => t.status === 'Pending').length;
  const resolvedCount = combined.filter(t => t.status === 'Resolved').length;

  // Update headers and badge
  const titleEl = document.getElementById('my-tickets-title');
  const badgeEl = document.getElementById('nav-tracker-badge');
  if (titleEl) titleEl.textContent = `My Tickets (${totalCount})`;
  if (badgeEl) badgeEl.textContent = totalCount;

  // Update tab labels
  const tabs = document.querySelectorAll('.ticket-tab-pill');
  if (tabs.length >= 3) {
    tabs[0].textContent = `All (${totalCount})`;
    tabs[1].textContent = `Pending (${pendingCount})`;
    tabs[2].textContent = `Resolved (${resolvedCount})`;
  }

  container.innerHTML = filtered.map(t => {
    const isSelected = t.token === selectedTicketToken ? 'selected' : '';
    const isResolved = t.status === 'Resolved';
    const statusDot = isResolved ? 'style="color: #10b981;"' : (t.status === 'In Progress' ? 'style="color: #0284c7;"' : 'style="color: #f59e0b;"');
    return `
      <div class="ticket-row-tile ${isSelected}" data-token="${t.token}">
        <div class="ticket-tile-top">
          <div class="ticket-tile-title">
            <span>${t.icon}</span>
            <span>${t.title}</span>
          </div>
          <span style="font-size: 0.75rem; color: #94a3b8;">›</span>
        </div>
        <div class="ticket-tile-meta">
          <strong>${t.token}</strong> • ${t.department.slice(0, 20)}...
        </div>
        <div class="ticket-tile-date" style="display: flex; align-items: center; justify-content: space-between;">
          <span>${t.date}</span>
          <span ${statusDot} style="font-weight: 700; font-size: 0.65rem;">● ${t.status}</span>
        </div>
      </div>
    `;
  }).join('');

  // Wire tile click handlers
  container.querySelectorAll('.ticket-row-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      container.querySelectorAll('.ticket-row-tile').forEach(t => t.classList.remove('selected'));
      tile.classList.add('selected');

      const token = tile.getAttribute('data-token');
      selectedTicketToken = token;
      const item = combined.find(t => t.token === token);
      if (item) {
        updateLiveTrackerDetail(item);
      }

      // On mobile screens: activate detail view
      const trackContainer = document.querySelector('.track-page-container');
      if (trackContainer) {
        trackContainer.classList.add('mobile-detail-active');
      }
    });
  });

  // Update mobile tracker badge count
  const mobileBadge = document.getElementById('mobile-tracker-badge');
  if (mobileBadge) {
    mobileBadge.textContent = combined.length;
  }

  // Ensure initial ticket timeline is fully populated
  const initialItem = combined.find(t => t.token === selectedTicketToken) || combined[0];
  if (initialItem) {
    updateLiveTrackerDetail(initialItem);
  }
}

function updateLiveTrackerDetail(item) {
  if (!item) return;

  // Header meta
  const titleEl = document.getElementById('detail-ticket-title');
  const tokenEl = document.getElementById('detail-ticket-token');
  const deptEl = document.getElementById('detail-ticket-dept');
  const locEl = document.getElementById('detail-ticket-location');
  const dateEl = document.getElementById('detail-ticket-date');

  if (titleEl) titleEl.textContent = item.title;
  if (tokenEl) tokenEl.textContent = item.token;
  if (deptEl) deptEl.textContent = item.department;
  if (locEl) locEl.textContent = item.location;
  if (dateEl) dateEl.textContent = item.date;

  const isResolved = item.status === 'Resolved';
  const isInProgress = item.status === 'In Progress';

  // 1. Top status tag pill
  const topStatusPill = document.getElementById('detail-status-pill-top');
  if (topStatusPill) {
    topStatusPill.className = isResolved ? 'status-tag-resolved' : (isInProgress ? 'status-tag-progress' : 'status-tag-pending');
    topStatusPill.textContent = isResolved ? '● RESOLVED' : (isInProgress ? '● IN PROGRESS' : '● PENDING');
  }

  // 2. Before & After evidence box
  const imgEl = document.getElementById('detail-before-img');
  const noPhotoBox = document.getElementById('detail-no-photo-box');
  const baRowAfter = document.getElementById('ba-row-after');
  const baStatusIcon = document.getElementById('detail-ba-status-icon');
  const baStatusTitle = document.getElementById('detail-ba-status-title');
  const baStatusSub = document.getElementById('detail-ba-status-sub');

  const beforePhoto = item.photo || (item.images && item.images.before);
  if (beforePhoto) {
    if (imgEl) {
      imgEl.src = beforePhoto;
      imgEl.style.display = 'block';
      imgEl.classList.remove('hidden');
      imgEl.style.cursor = 'pointer';
      imgEl.title = 'Click to open full photo';
      imgEl.onclick = () => window.openImageLightbox(beforePhoto, 'BEFORE: Citizen Evidence', item.title);
    }
    if (noPhotoBox) {
      noPhotoBox.style.display = 'none';
      noPhotoBox.classList.add('hidden');
    }
  } else {
    if (imgEl) {
      imgEl.style.display = 'none';
      imgEl.classList.add('hidden');
    }
    if (noPhotoBox) {
      noPhotoBox.style.display = 'flex';
      noPhotoBox.classList.remove('hidden');
    }
  }

  // Handle AFTER photo row ONLY for resolved tickets with valid after photo
  const resolvedAfter = item.afterPhoto || (item.images && item.images.after);
  if (isResolved && resolvedAfter) {
    if (baRowAfter) {
      baRowAfter.style.display = 'flex';
      baRowAfter.classList.remove('hidden');
      baRowAfter.innerHTML = `
        <span class="ba-label-tag" style="color: #059669;">AFTER:</span>
        <div class="ba-thumb-container ba-thumb-after" style="cursor: pointer;" onclick="window.openImageLightbox('${resolvedAfter}', 'AFTER: Municipal Resolution Proof', '${item.title}')" title="Click to open full resolution photo">
          <img id="detail-after-img" src="${resolvedAfter}" alt="After repair" onerror="this.onerror=null; this.src='images/pothole-after.jpg';" />
          <span class="ba-after-badge"><i class="fa-solid fa-check"></i> Resolved</span>
        </div>
      `;
    }
  } else {
    if (baRowAfter) {
      baRowAfter.style.display = 'none';
      baRowAfter.classList.add('hidden');
      baRowAfter.innerHTML = '';
    }
  }

  if (baStatusTitle && baStatusSub) {
    if (isResolved) {
      baStatusTitle.textContent = 'Resolved';
      baStatusTitle.style.color = '#10b981';
      baStatusSub.textContent = item.assignedOfficer ? `Work verified & closed by ${item.assignedOfficer}` : 'Work verified & closed by AMC';
      if (baStatusIcon) baStatusIcon.textContent = '✓';
    } else if (isInProgress) {
      baStatusTitle.textContent = 'In Progress';
      baStatusTitle.style.color = '#38bdf8';
      baStatusSub.textContent = item.assignedOfficer ? `Assigned to ${item.assignedOfficer} • Field squad on site` : 'Field squad deployed on site';
      if (baStatusIcon) baStatusIcon.textContent = '⚡';
    } else {
      baStatusTitle.textContent = 'Pending Fix';
      baStatusTitle.style.color = '#f59e0b';
      baStatusSub.textContent = 'Work in progress on site';
      if (baStatusIcon) baStatusIcon.textContent = '⏰';
    }
  }

  // Row 1: Citizen Submission
  const flowDefect = document.getElementById('flow-card-defect');
  const flowDate = document.getElementById('flow-card-date');
  if (flowDefect) flowDefect.textContent = item.title;
  if (flowDate) flowDate.textContent = item.date;

  // Row 2: Field Unit Assigned
  const node2 = document.getElementById('track-node-2');
  const branch2 = document.getElementById('track-branch-2');
  const sub2 = document.getElementById('flow-card-sub-2');
  const status2 = document.getElementById('flow-card-status-2');
  const icon2 = document.getElementById('flow-card-icon-2');

  const isAssigned = isResolved || isInProgress || (item.assignedOfficer && item.assignedOfficer !== 'Unassigned');
  if (isAssigned) {
    if (node2) {
      node2.className = 'timeline-spine-node done';
      node2.innerHTML = '<span>✓</span>';
    }
    if (branch2) branch2.className = 'timeline-connector-branch left-branch done';
    const officerName = item.assignedOfficer && item.assignedOfficer !== 'Unassigned' ? item.assignedOfficer : 'Er. Amit V. Patil';
    const role = item.officerRole || 'Junior Engineer (Civil & PWD)';
    const squad = item.squad || 'Ward 1 Rapid Squad';
    const phone = item.officerPhone || '+91 94228 67123';
    if (status2) status2.textContent = `Assigned: ${officerName}`;
    if (icon2) icon2.style.color = '#059669';
    if (sub2) sub2.textContent = `Assigned to ${role} • ${squad} (${phone})`;
  } else {
    if (node2) {
      node2.className = 'timeline-spine-node';
      node2.innerHTML = '<span class="node-inner-dot"></span>';
    }
    if (branch2) branch2.className = 'timeline-connector-branch left-branch';
    if (status2) status2.textContent = 'Assigned';
    if (icon2) icon2.style.color = '#2563eb';
    if (sub2) sub2.textContent = 'We will assign an officer soon.';
  }

  // Row 3: Under Review & Inspection
  const node3 = document.getElementById('track-node-3');
  const branch3 = document.getElementById('track-branch-3');
  const sub3 = document.getElementById('flow-card-sub-3');
  const status3 = document.getElementById('flow-card-status-3');
  const icon3 = document.getElementById('flow-card-icon-3');

  if (isResolved) {
    if (node3) {
      node3.className = 'timeline-spine-node done';
      node3.innerHTML = '<span>✓</span>';
    }
    if (branch3) branch3.className = 'timeline-connector-branch left-branch done';
    if (status3) status3.textContent = 'Inspection & Work Completed';
    if (icon3) icon3.style.color = '#059669';
    if (sub3) sub3.textContent = item.inspectionRemarks || 'Physical repair, leveling, and asphalt restoration completed on site.';
  } else if (isInProgress) {
    if (node3) {
      node3.className = 'timeline-spine-node active';
      node3.innerHTML = '<span>⚡</span>';
    }
    if (branch3) branch3.className = 'timeline-connector-branch left-branch';
    if (status3) status3.textContent = 'Under Review & Active Work';
    if (icon3) icon3.style.color = '#f59e0b';
    if (sub3) sub3.textContent = item.inspectionRemarks || 'Field squad currently on site addressing the reported defect with required machinery.';
  } else {
    if (node3) {
      node3.className = 'timeline-spine-node';
      node3.innerHTML = '<span class="node-inner-dot"></span>';
    }
    if (branch3) branch3.className = 'timeline-connector-branch left-branch';
    if (status3) status3.textContent = 'Under Review';
    if (icon3) icon3.style.color = '#f59e0b';
    if (sub3) sub3.textContent = 'A large and deep pothole has formed on the road surface, which is filled with stagnant water and poses safety risks...';
  }

  // Row 4: Verified & Resolved
  const node4 = document.getElementById('track-node-4');
  const branch4 = document.getElementById('track-branch-4');
  const badge4 = document.getElementById('flow-card-badge-4');
  const sub4 = document.getElementById('flow-card-sub-4');
  const status4 = document.getElementById('flow-card-status-4');
  const icon4 = document.getElementById('flow-card-icon-4');

  if (isResolved) {
    if (node4) {
      node4.className = 'timeline-spine-node done';
      node4.innerHTML = '<span>✓</span>';
    }
    if (branch4) branch4.className = 'timeline-connector-branch left-branch done';
    if (badge4) {
      badge4.textContent = 'Closed';
      badge4.style.background = '#ecfdf5';
      badge4.style.color = '#047857';
    }
    if (status4) status4.textContent = 'Resolved & Verified';
    if (icon4) icon4.style.color = '#059669';
    if (sub4) sub4.textContent = item.resolutionRemarks || 'Inspected and before/after verification recorded by municipal engineer. Traffic restored.';
  } else {
    if (node4) {
      node4.className = 'timeline-spine-node';
      node4.innerHTML = '<span class="node-inner-dot"></span>';
    }
    if (branch4) branch4.className = 'timeline-connector-branch left-branch';
    if (badge4) {
      badge4.textContent = 'Upcoming';
      badge4.style.background = '#f1f5f9';
      badge4.style.color = '#475569';
    }
    if (status4) status4.textContent = 'Resolved';
    if (icon4) icon4.style.color = '#94a3b8';
    if (sub4) sub4.textContent = 'Officer will share work details and photos.';
  }

  // Keep Officers & Squad view synchronized
  renderOfficersSquadPanel(item);
}

// Renders the dedicated Officers & Squad dossier tab
function renderOfficersSquadPanel(item) {
  const panel = document.getElementById('officers-squad-view');
  if (!panel) return;

  const isAssigned = item.assignedOfficer && item.assignedOfficer !== 'Unassigned';
  const officerName = isAssigned ? item.assignedOfficer : 'Awaiting Officer Assignment';
  const officerRole = item.officerRole || (item.department ? `${item.department} • Ward 1` : 'Municipal Field Officer');
  const officerPhone = item.officerPhone || '+91 94228 67123';
  const officerEmail = item.officerEmail || 'ward1.officer@amravatimc.gov.in';
  const squadName = item.squad || 'Ward 1 Rapid Municipal Task Squad';
  const squadSize = item.squadSize || '5 Field Technicians';
  const machinery = item.machinery || 'Standard Municipal Maintenance Toolkit & Van';
  const supervisor = item.supervisor || 'Sunil More (Ward Field Supervisor)';
  const remarks = item.inspectionRemarks || item.resolutionRemarks || 'On-site municipal operations active under AMC SLA.';

  const avatarUrl = isAssigned 
    ? (item.department && item.department.includes('Road') ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
       : (item.department && item.department.includes('Light') ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
       : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'))
    : null;

  if (!isAssigned) {
    panel.innerHTML = `
      <div class="officer-pending-state-card">
        <div class="pending-icon-circle">🛡️</div>
        <h4>Officer Assignment In Progress</h4>
        <p>This grievance has been queued to <strong>${item.department || 'Municipal Corporation'}</strong>. A dedicated Junior Engineer will be dispatched within the SLA window.</p>
        <div class="officer-sla-pill">⏰ Escalation SLA: Active</div>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="officer-dossier-card">
      <div class="officer-profile-header">
        <div class="officer-avatar-box">
          <img src="${avatarUrl}" alt="${officerName}" class="officer-avatar-img" />
          <span class="officer-verified-badge" title="Verified AMC Officer">✓</span>
        </div>
        <div class="officer-info-col">
          <div class="officer-name-row">
            <h4>${officerName}</h4>
            <span class="badge-role-tag">${item.status === 'Resolved' ? 'Verified Officer' : 'Assigned JE'}</span>
          </div>
          <div class="officer-role-title">${officerRole}</div>
          <div class="officer-dept-label">Amravati Municipal Corporation</div>
        </div>
      </div>

      <div class="officer-actions-row">
        <a href="tel:${officerPhone.replace(/[^0-9+]/g, '')}" class="btn-officer-action btn-officer-call">
          <i class="fa-solid fa-phone"></i>
          <span>Call Officer</span>
        </a>
        <a href="mailto:${officerEmail}" class="btn-officer-action btn-officer-email">
          <i class="fa-solid fa-envelope"></i>
          <span>Official Mail</span>
        </a>
      </div>

      <div class="officer-meta-grid">
        <div class="officer-meta-item">
          <span class="meta-label">DISPATCHED SQUAD</span>
          <span class="meta-value">👷 ${squadName}</span>
        </div>
        <div class="officer-meta-item">
          <span class="meta-label">SQUAD STRENGTH</span>
          <span class="meta-value">👥 ${squadSize}</span>
        </div>
        <div class="officer-meta-item">
          <span class="meta-label">DEPLOYED MACHINERY</span>
          <span class="meta-value">🚜 ${machinery}</span>
        </div>
        <div class="officer-meta-item">
          <span class="meta-label">FIELD SUPERVISOR</span>
          <span class="meta-value">👤 ${supervisor}</span>
        </div>
      </div>

      <div class="officer-remarks-card">
        <div class="remarks-header">
          <i class="fa-solid fa-clipboard-check" style="color: #059669;"></i>
          <span>Field Inspection & Status Log</span>
        </div>
        <p class="remarks-body">"${remarks}"</p>
      </div>
    </div>
  `;
}

// ============================================================================
// Lightbox Zoom for Evidence Photos (Click to open big)
// ============================================================================
window.openImageLightbox = function(imgSrc, tag, title) {
  const modal = document.getElementById('image-lightbox-modal');
  const modalImg = document.getElementById('image-lightbox-img');
  const badge = document.getElementById('image-lightbox-badge');
  const titleEl = document.getElementById('image-lightbox-title');
  const captionEl = document.getElementById('image-lightbox-caption');

  if (!modal || !modalImg) return;
  modalImg.src = imgSrc;
  if (badge) {
    badge.textContent = tag || 'EVIDENCE';
    badge.style.background = (tag && tag.includes('AFTER')) ? '#059669' : '#0284c7';
  }
  if (titleEl) titleEl.textContent = title || 'Grievance Evidence';
  if (captionEl) {
    captionEl.textContent = (tag && tag.includes('AFTER'))
      ? 'Municipal work completed and verified on-site by AMC Field Junior Engineer.'
      : 'On-site citizen evidence photo submitted for municipal redressal.';
  }

  modal.style.display = 'flex';
};

function setupImageLightbox() {
  const modal = document.getElementById('image-lightbox-modal');
  const closeBtn = document.getElementById('image-lightbox-close-btn');
  const dismissBtn = document.getElementById('image-lightbox-dismiss-btn');

  const close = () => {
    if (modal) modal.style.display = 'none';
  };

  closeBtn?.addEventListener('click', close);
  dismissBtn?.addEventListener('click', close);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
      close();
    }
  });
}

function setupTicketFilters() {
  const filterPills = document.querySelectorAll('.ticket-tab-pill');
  const searchInput = document.getElementById('tickets-search-input');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentTicketTab = pill.getAttribute('data-tab');
      renderTicketList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => renderTicketList());
  }
}

function setupTicketActionButtons() {
  const btnEdit = document.getElementById('btn-edit-grievance');
  const btnDelete = document.getElementById('btn-delete-grievance');
  const btnShare = document.getElementById('btn-share-grievance');
  const btnNew = document.getElementById('tickets-new-btn');
  const btnInspect = document.getElementById('track-btn-inspect-evidence');

  // Sub-tabs: Live Timeline vs Officers & Squad
  const tabTimeline = document.getElementById('sub-tab-timeline');
  const tabOfficers = document.getElementById('sub-tab-officers');
  const viewTimeline = document.getElementById('timeline-flow-view');
  const viewOfficers = document.getElementById('officers-squad-view');

  if (tabTimeline && tabOfficers) {
    tabTimeline.addEventListener('click', () => {
      tabTimeline.classList.add('active');
      tabOfficers.classList.remove('active');
      if (viewTimeline) viewTimeline.style.display = 'block';
      if (viewOfficers) viewOfficers.style.display = 'none';
    });

    tabOfficers.addEventListener('click', () => {
      tabOfficers.classList.add('active');
      tabTimeline.classList.remove('active');
      if (viewTimeline) viewTimeline.style.display = 'none';
      if (viewOfficers) viewOfficers.style.display = 'block';
    });
  }

  if (btnInspect) {
    btnInspect.addEventListener('click', (e) => {
      e.preventDefault();
      const clean = String(selectedTicketToken || '').replace(/^#/, '');
      openCitizenDossier(clean);
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      openEditGrievanceModal(selectedTicketToken);
    });
  }

  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      showToast('Grievance withdrawn by citizen.', 'info');
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Grievance tracking link copied!', 'success');
    });
  }

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      const modal = document.getElementById('report-modal');
      if (modal) modal.classList.add('open');
    });
  }
}

// ============================================================================
// 3. Three-Step Report Grievance Wizard (Images 3, 4, 5)
// ============================================================================
function setupReportWizardModal() {
  const btnSnap = document.getElementById('sidebar-snap-report-btn');
  const btnMap = document.getElementById('map-report-btn');
  const modal = document.getElementById('report-modal');
  const closeBtn = document.getElementById('wizard-close-btn');

  const step1 = document.getElementById('wizard-step-1');
  const step2 = document.getElementById('wizard-step-2');
  const step3 = document.getElementById('wizard-step-3');

  const ind1 = document.getElementById('wizard-ind-1');
  const ind2 = document.getElementById('wizard-ind-2');
  const ind3 = document.getElementById('wizard-ind-3');

  const line1 = document.getElementById('wizard-line-1');
  const line2 = document.getElementById('wizard-line-2');

  const openModal = () => {
    if (modal) modal.classList.add('open');
    goToStep(1);
  };
  const closeModal = () => {
    if (modal) modal.classList.remove('open');
  };

  if (btnSnap) btnSnap.addEventListener('click', openModal);
  if (btnMap) btnMap.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function goToStep(num) {
    step1.style.display = num === 1 ? 'flex' : 'none';
    step2.style.display = num === 2 ? 'flex' : 'none';
    step3.style.display = num === 3 ? 'flex' : 'none';

    ind1.className = `wizard-step-indicator ${num === 1 ? 'active' : (num > 1 ? 'completed' : '')}`;
    ind2.className = `wizard-step-indicator ${num === 2 ? 'active' : (num > 2 ? 'completed' : '')}`;
    ind3.className = `wizard-step-indicator ${num === 3 ? 'active' : ''}`;

    line1.className = `wizard-step-line ${num >= 2 ? 'active' : ''}`;
    line2.className = `wizard-step-line ${num >= 3 ? 'active' : ''}`;
  }

  // Step 1: Upload photo
  const uploadBtn = document.getElementById('wizard-upload-btn');
  const photoInput = document.getElementById('wizard-photo-input');
  const previewDiv = document.getElementById('wizard-photo-preview');
  const previewImg = document.getElementById('wizard-preview-img');

  if (uploadBtn && photoInput) {
    uploadBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          uploadedWizardPhoto = evt.target.result;
          if (previewImg) previewImg.src = uploadedWizardPhoto;
          if (previewDiv) previewDiv.style.display = 'block';
          showToast('Evidence photo attached!', 'info');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Navigation between steps
  document.getElementById('wizard-to-step2-btn')?.addEventListener('click', () => goToStep(2));
  document.getElementById('wizard-back-to-step1')?.addEventListener('click', () => goToStep(1));

  document.getElementById('wizard-to-step3-btn')?.addEventListener('click', () => {
    const dept = document.getElementById('wiz-dept-select')?.value;
    const defect = document.getElementById('wiz-defect-select')?.value;
    const loc = document.getElementById('wiz-landmark-input')?.value;

    document.getElementById('wiz-summary-dept').textContent = dept;
    document.getElementById('wiz-summary-defect').textContent = `Defect: ${defect}`;
    document.getElementById('wiz-summary-loc').textContent = `📍 ${loc}`;

    goToStep(3);
  });

  document.getElementById('wizard-back-to-step2')?.addEventListener('click', () => goToStep(2));

  // Character counter
  const descInput = document.getElementById('wiz-desc-input');
  const counterEl = document.getElementById('wiz-char-counter');
  if (descInput && counterEl) {
    descInput.addEventListener('input', () => {
      counterEl.textContent = `${descInput.value.length} / 1000`;
    });
  }

  // Locate Me button
  document.getElementById('wiz-locate-me-btn')?.addEventListener('click', () => {
    const input = document.getElementById('wiz-landmark-input');
    if (input) input.value = 'Camp Main Road, Near Bus Stand (GPS Geotagged)';
    showToast('GPS location retrieved: Camp Main Road, Amravati', 'success');
  });

  // Voice button
  document.getElementById('wiz-voice-btn')?.addEventListener('click', () => {
    showToast('Voice transcription active (Marathi / English)...', 'info');
  });

  // Final submission
  document.getElementById('wizard-final-submit-btn')?.addEventListener('click', (e) => {
    e.preventDefault();

    const user = Store.getCitizenUser();
    const name = document.getElementById('wiz-citizen-name').value.trim() || user.name || 'Citizen';
    const phone = document.getElementById('wiz-citizen-phone').value.trim() || user.phone || '8459741554';
    const dept = document.getElementById('wiz-dept-select').value;
    const defect = document.getElementById('wiz-defect-select').value;
    const loc = document.getElementById('wiz-landmark-input').value;
    const desc = document.getElementById('wiz-desc-input').value;

    const newGrievance = Store.saveComplaint({
      citizen: name,
      mobile: phone,
      department: dept,
      category: defect,
      location: loc,
      description: desc,
      photo: uploadedWizardPhoto || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500'
    });

    closeModal();
    showToast(`✓ Grievance registered successfully! Token: ${newGrievance.grievanceNo}`, 'success');

    // Switch to tracker tab
    selectedTicketToken = '#' + newGrievance.grievanceNo;
    const trackerTabBtn = document.getElementById('nav-btn-tracker');
    if (trackerTabBtn) trackerTabBtn.click();
    renderTicketList();
  });
}

// ============================================================================
// 4. Leaflet GIS Map Canvas
// ============================================================================
function setupLeafletMap() {
  const mapContainer = document.getElementById('amravati-map');
  if (!mapContainer || typeof L === 'undefined') return;

  leafletMap = L.map('amravati-map', {
    center: [20.9374, 77.7796],
    zoom: 13,
    zoomControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafletMap);

  L.control.zoom({ position: 'topright' }).addTo(leafletMap);

  // Purple boundary polygon
  L.polygon([
    [20.9650, 77.7450],
    [20.9600, 77.8200],
    [20.9100, 77.8350],
    [20.9150, 77.7300]
  ], {
    color: '#8b5cf6',
    dashArray: '6, 6',
    weight: 2,
    fillOpacity: 0.05
  }).addTo(leafletMap);

  // Image 2 Map Markers: Green Checkmark Circle & Dark Ward Pill
  const checkmarkIcon = L.divIcon({
    className: 'custom-check-marker',
    html: `<div class="map-check-circle" role="img" aria-label="Resolved complaint marker"><i class="fa-solid fa-check"></i></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  L.marker([20.9380, 77.7720], { icon: checkmarkIcon, alt: 'Resolved complaint marker' }).addTo(leafletMap);

  const wardDarkIcon = L.divIcon({
    className: 'custom-ward-dark-marker',
    html: `<div class="map-dark-ward-pill" role="img" aria-label="Ward 1 active marker"><span class="dot-green"></span> 📍 Ward 1: Ward 1</div>`,
    iconSize: [140, 28],
    iconAnchor: [70, 14]
  });
  L.marker([20.9230, 77.7460], { icon: wardDarkIcon, alt: 'Ward 1 active marker' }).addTo(leafletMap);

  // Sample markers
  const sampleCoords = [
    { ward: 'Ward 1', lat: 20.9320, lng: 77.7550 },
    { ward: 'Ward A1', lat: 20.9374, lng: 77.7796 },
    { ward: 'Ward C1', lat: 20.9450, lng: 77.7950 }
  ];

  sampleCoords.forEach(c => {
    const pill = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="custom-map-pill" role="img" aria-label="${c.ward} active complaints">${c.ward}: Active</div>`,
      iconSize: [120, 26]
    });
    L.marker([c.lat, c.lng], { icon: pill, alt: `${c.ward} active complaints` }).addTo(leafletMap);
  });

  // Prevent map drag and clicks from hijacking horizontal swipe on bottom cards
  const bottomCardsEl = document.getElementById('map-bottom-cards');
  if (bottomCardsEl && typeof L !== 'undefined') {
    L.DomEvent.disableClickPropagation(bottomCardsEl);
    L.DomEvent.disableScrollPropagation(bottomCardsEl);
  }
}

function renderKpiCards() {
  const total = allGrievances.length;
  const tEl = document.getElementById('kpi-disp-total');
  const pEl = document.getElementById('kpi-disp-pending');
  if (tEl) tEl.textContent = 180 + total;
  if (pEl) pEl.textContent = 180 + total;
}

function renderBottomCards() {
  const container = document.getElementById('map-bottom-cards');
  if (!container) return;

  // Curated showcase cards demonstrating realistic civic issues with before & after photos
  const showcaseList = [
    {
      id: 175,
      grievanceNo: 'GRV-2026-000175',
      title: 'Pothole & Road Repair',
      ward: 'Ward 1 - Camp',
      location: 'Camp Main Road, Opp District Court',
      status: 'Resolved',
      images: {
        before: 'images/pothole-before.jpg',
        after: 'images/pothole-after.jpg'
      }
    },
    {
      id: 202,
      grievanceNo: 'GRV-2026-000202',
      title: 'Street Waterlogging',
      ward: 'Ward 1 - Camp',
      location: 'Camp Main Road, Near Bus Stand',
      status: 'In Progress',
      images: {
        before: 'images/water-before.jpg',
        after: null
      }
    },
    {
      id: 116,
      grievanceNo: 'GRV-2026-000116',
      title: 'Street Light Restored',
      ward: 'Ward 2 - Rajapeth',
      location: 'Rajapeth Lane 4, Pillar #12',
      status: 'Resolved',
      images: {
        before: 'images/light-before.jpg',
        after: 'images/light-after.jpg'
      }
    },
    {
      id: 108,
      grievanceNo: 'GRV-2026-000108',
      title: 'Sewer Chamber Jetting',
      ward: 'Ward 3 - Gadge Nagar',
      location: 'Gadge Nagar Main Road',
      status: 'In Progress',
      images: {
        before: 'images/sewer-before.jpg',
        after: null
      }
    }
  ];

  container.innerHTML = showcaseList.map((g) => {
    const gid = g.grievanceNo || `GRV-2026-${g.id}`;
    const isResolved = g.status === 'Resolved';
    const isInProgress = g.status === 'In Progress';
    const statusStyle = isResolved ? 'background: #dcfce7; color: #15803d; border: 1px solid #86efac;' : 
                        (isInProgress ? 'background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc;' : 'background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;');
    const beforeImg = g.images.before;
    const afterImg = g.images.after;
    const votes = currentDossierVotes[gid] || (isResolved ? 18 : 6);

    return `
      <div class="complaint-card-tile" onclick="window.openCitizenDossier('${gid}')" style="cursor: pointer;" title="Click to view full dossier">
        <div class="card-tile-header">
          <span class="ward-tag">📍 ${g.ward}</span>
          <span class="status-tag-pending" style="${statusStyle}">${g.status || 'Pending'}</span>
        </div>
        <div class="card-tile-body">
          <h4>${g.title}</h4>
          <div class="card-tile-location">${g.location}</div>
        </div>
        <div class="card-split-image-box">
          <div class="split-side">
            <span class="split-pill-badge pill-before">Before</span>
            <img src="${beforeImg}" alt="Before repair" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500';" />
          </div>
          <div class="split-center-divider"></div>
          <div class="split-side" style="background: #0f172a; position: relative; overflow: hidden;">
            ${afterImg ? `
              <span class="split-pill-badge" style="position: absolute; top: 6px; right: 6px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">✓ After</span>
              <img src="${afterImg}" alt="After repair" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500';" />
            ` : `
              <span class="split-pill-badge pill-pending-fix">Pending Fix</span>
              <div class="pending-fix-placeholder">In Progress<br/>Fix will appear once resolved</div>
            `}
          </div>
        </div>
        <div class="card-tile-footer">
          <button type="button" class="btn-vote" onclick="event.stopPropagation(); window.voteCitizenCard('${gid}', this)">✓ ${votes} Votes</button>
          <button type="button" class="btn-tile-details" onclick="event.stopPropagation(); window.openCitizenDossier('${gid}')">Details →</button>
        </div>
      </div>
    `;
  }).join('');
}

function populateDropdowns() {
  const mapWard = document.getElementById('map-ward-select');
  if (mapWard) {
    mapWard.innerHTML = `<option value="">● All Wards</option>` +
      MASTER_WARDS.map(w => `<option value="${w.id}">${w.nameEn}</option>`).join('');
  }
}

// ============================================================================
// 7. Citizen Profile Badge, Dropdown & Login Workflow
// ============================================================================
function setupCitizenAuth() {
  const citizenBadge = document.getElementById('citizen-profile-badge');
  const citizenDropdown = document.getElementById('citizen-profile-dropdown');
  const citizenLogoutBtn = document.getElementById('citizen-logout-btn');
  const citizenLoginModal = document.getElementById('citizen-login-modal');
  const citizenLoginForm = document.getElementById('citizen-login-form');
  const citizenLoginClose = document.getElementById('citizen-login-modal-close');
  const citizenLoginCancel = document.getElementById('citizen-login-modal-cancel');
  const citizenDropTicketsBtn = document.getElementById('citizen-drop-tickets-btn');
  const citizenDropReportBtn = document.getElementById('citizen-drop-report-btn');

  const closeLoginModal = () => citizenLoginModal?.classList.remove('open');
  citizenLoginClose?.addEventListener('click', closeLoginModal);
  citizenLoginCancel?.addEventListener('click', closeLoginModal);
  if (citizenLoginModal) {
    citizenLoginModal.addEventListener('click', (e) => {
      if (e.target === citizenLoginModal) closeLoginModal();
    });
  }

  const renderProfile = () => {
    const user = Store.getCitizenUser();
    const badgeName = document.getElementById('citizen-badge-name');
    const badgeStatus = document.getElementById('citizen-badge-status');
    const badgeAvatar = document.getElementById('citizen-avatar');
    const dropName = document.getElementById('citizen-drop-name');
    const dropPhone = document.getElementById('citizen-drop-phone');
    const dropBadge = document.getElementById('citizen-drop-badge');
    const dropAvatar = document.getElementById('citizen-drop-avatar');

    if (user && user.loggedIn) {
      if (citizenBadge) {
        citizenBadge.classList.remove('guest');
        citizenBadge.title = `Logged in as ${user.name}`;
      }
      if (badgeName) badgeName.textContent = user.name;
      if (badgeStatus) {
        badgeStatus.textContent = 'Verified';
        badgeStatus.style.color = '#10b981';
      }
      if (badgeAvatar) {
        badgeAvatar.classList.remove('guest');
        badgeAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : '👤';
      }
      if (dropName) dropName.textContent = user.name;
      if (dropPhone) dropPhone.textContent = user.phone ? `+91 ${user.phone}` : 'Mobile Verified';
      if (dropBadge) dropBadge.textContent = `Verified Citizen • ${user.ward || 'Ward 1'}`;
      if (dropAvatar) dropAvatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : '👤';

      // Prepopulate wizard
      const wizName = document.getElementById('wiz-citizen-name');
      const wizPhone = document.getElementById('wiz-citizen-phone');
      if (wizName && (!wizName.value || wizName.value === 'Anurag')) wizName.value = user.name;
      if (wizPhone && (!wizPhone.value || wizPhone.value === '8459741554')) wizPhone.value = user.phone;
    } else {
      if (citizenBadge) {
        citizenBadge.classList.add('guest');
        citizenBadge.title = 'Click to Sign In / Register';
      }
      if (badgeName) badgeName.textContent = 'Guest Citizen';
      if (badgeStatus) {
        badgeStatus.textContent = 'Click to Login';
        badgeStatus.style.color = '#d97706';
      }
      if (badgeAvatar) {
        badgeAvatar.classList.add('guest');
        badgeAvatar.textContent = '👤';
      }
    }
  };

  const openCitizenLoginModal = () => {
    citizenDropdown?.classList.remove('show');
    const nameInput = document.getElementById('citizen-login-input-name');
    const phoneInput = document.getElementById('citizen-login-input-phone');
    const user = Store.getCitizenUser();

    // If currently guest, clear or provide fresh blank slate
    if (!user || !user.loggedIn) {
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
    } else {
      if (nameInput) nameInput.value = user.name || 'Anurag';
      if (phoneInput) phoneInput.value = user.phone || '8459741554';
    }

    citizenLoginModal?.classList.add('open');
    setTimeout(() => {
      nameInput?.focus();
    }, 150);
  };

  // Toggle dropdown if logged in, open login modal if guest
  citizenBadge?.addEventListener('click', (e) => {
    e.stopPropagation();
    const user = Store.getCitizenUser();
    if (user && user.loggedIn) {
      citizenDropdown?.classList.toggle('show');
    } else {
      openCitizenLoginModal();
    }
  });

  // Quick fill buttons
  document.getElementById('citizen-quickfill-anurag')?.addEventListener('click', () => {
    const nameInput = document.getElementById('citizen-login-input-name');
    const phoneInput = document.getElementById('citizen-login-input-phone');
    if (nameInput) nameInput.value = 'Anurag';
    if (phoneInput) phoneInput.value = '8459741554';
    showToast('Autofilled: Anurag (Verified Citizen)', 'info');
  });

  document.getElementById('citizen-quickfill-pooja')?.addEventListener('click', () => {
    const nameInput = document.getElementById('citizen-login-input-name');
    const phoneInput = document.getElementById('citizen-login-input-phone');
    if (nameInput) nameInput.value = 'Pooja Sharma';
    if (phoneInput) phoneInput.value = '9876543210';
    showToast('Autofilled: Pooja Sharma (New Citizen)', 'info');
  });

  document.getElementById('citizen-quickfill-clear')?.addEventListener('click', () => {
    const nameInput = document.getElementById('citizen-login-input-name');
    const phoneInput = document.getElementById('citizen-login-input-phone');
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
    if (phoneInput) phoneInput.value = '';
  });

  // Logout action
  citizenLogoutBtn?.addEventListener('click', () => {
    Store.logoutCitizen();
    citizenDropdown?.classList.remove('show');
    renderProfile();
    showToast('You have been logged out. Browsing as Guest Citizen.', 'info');
  });

  // Login form submit
  citizenLoginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('citizen-login-input-name');
    const phoneInput = document.getElementById('citizen-login-input-phone');
    const name = nameInput?.value.trim() || 'Citizen';
    const phone = phoneInput?.value.trim() || '8459741554';

    Store.loginCitizen(name, phone);
    closeLoginModal();
    renderProfile();
    showToast(`Welcome, ${name}! Signed in successfully.`, 'success');
  });

  // Dropdown quick actions
  citizenDropTicketsBtn?.addEventListener('click', () => {
    citizenDropdown?.classList.remove('show');
    const btnTracker = document.getElementById('nav-btn-tracker');
    btnTracker?.click();
  });

  citizenDropReportBtn?.addEventListener('click', () => {
    citizenDropdown?.classList.remove('show');
    const btnSnap = document.getElementById('sidebar-snap-report-btn');
    btnSnap?.click();
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (citizenDropdown && citizenBadge && !citizenBadge.contains(e.target) && !citizenDropdown.contains(e.target)) {
      citizenDropdown.classList.remove('show');
    }
  });

  // Listen to cross-tab auth sync
  window.addEventListener('NTIS_CITIZEN_AUTH_CHANGED', () => {
    renderProfile();
  });

  renderProfile();
}

// ============================================================================
// 8. Citizen Dashboard Slide-Over Dossier Drawer & Comparison Slider Engine
// ============================================================================
let currentDossierIndex = 0;
let currentDossierList = [];
const currentDossierVotes = {};

export function setCitizenSliderPos(pct) {
  const foreground = document.getElementById('cd-foreground-layer');
  const divider = document.getElementById('cd-divider-line');
  const handle = document.getElementById('cd-handle-button');
  const clamped = Math.max(0, Math.min(100, pct));
  if (foreground) foreground.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
  if (divider) divider.style.left = `${clamped}%`;
  if (handle) handle.setAttribute('aria-valuenow', Math.round(clamped));
}

export function openCitizenDossier(id) {
  currentDossierList = Store.getAll();
  if (!currentDossierList || currentDossierList.length === 0) return;

  let idx = currentDossierList.findIndex(g => String(g.id) === String(id) || g.grievanceNo === id || g.trackingId === id);
  if (idx === -1) idx = 0;
  currentDossierIndex = idx;
  const g = currentDossierList[currentDossierIndex];
  if (!g) return;

  // 1. Header Badges
  const grvNoEl = document.getElementById('cd-grievance-no');
  const statusEl = document.getElementById('cd-status-badge');
  const dispGrievanceNo = g.grievanceNo || g.trackingId || ('GRV-2026-' + String(g.id).padStart(6, '0'));
  
  if (grvNoEl) grvNoEl.textContent = dispGrievanceNo;
  if (statusEl) {
    statusEl.textContent = `● ${g.status || 'Pending'}`;
    if (g.status === 'Resolved') {
      statusEl.style.background = '#ecfdf5';
      statusEl.style.color = '#047857';
      statusEl.style.borderColor = '#a7f3d0';
    } else if (g.status === 'In Progress') {
      statusEl.style.background = '#eff6ff';
      statusEl.style.color = '#1d4ed8';
      statusEl.style.borderColor = '#bfdbfe';
    } else {
      statusEl.style.background = '#fffbeb';
      statusEl.style.color = '#b45309';
      statusEl.style.borderColor = '#fde68a';
    }
  }

  // 2. Issue Title & SLA Banner
  const titleEl = document.getElementById('cd-issue-title');
  const slaTextEl = document.getElementById('cd-sla-text');
  const slaStatusEl = document.getElementById('cd-sla-status');
  if (titleEl) titleEl.textContent = g.title || g.category || 'Civic Issue';
  if (slaTextEl) slaTextEl.textContent = `SLA Target: ${g.slaHours ? g.slaHours + 'h' : '24h'}`;
  if (slaStatusEl) {
    if (g.status === 'Resolved') {
      slaStatusEl.textContent = 'Resolved within SLA';
      slaStatusEl.style.color = '#059669';
    } else {
      slaStatusEl.textContent = '100% On Track';
      slaStatusEl.style.color = '#059669';
    }
  }

  // 3. Before & After Slider Setup
  const beforeImgEl = document.getElementById('cd-slider-before-img');
  const afterContentEl = document.getElementById('cd-slider-after-content');
  const beforeUrl = (g.images && g.images.before) ? g.images.before : 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500';
  const afterUrl = (g.images && g.images.after) ? g.images.after : null;

  if (beforeImgEl) beforeImgEl.src = beforeUrl;

  if (afterContentEl) {
    if (afterUrl) {
      afterContentEl.innerHTML = `
        <img src="${afterUrl}" alt="After resolution" style="width: 100%; height: 100%; object-fit: cover; user-select: none; pointer-events: none;" draggable="false" />
        <span style="position: absolute; top: 10px; right: 10px; padding: 2px 9px; border-radius: 9999px; background: rgba(16, 185, 129, 0.95); color: #ffffff; font-size: 10px; font-weight: 900; letter-spacing: 0.025em; box-shadow: 0 4px 6px rgba(0,0,0,0.3); pointer-events: none; z-index: 10;">
          After
        </span>
      `;
    } else {
      afterContentEl.innerHTML = `
        <div style="width: 100%; height: 100%; background: radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; color: #ffffff;">
          <div style="position: relative; width: 44px; height: 44px; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: center;">
            <span style="position: absolute; inset: 0; border-radius: 50%; background: #10b981; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <div style="position: relative; width: 40px; height: 40px; border-radius: 50%; background: #064e3b; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; color: #34d399; font-size: 16px;">
              ⚡
            </div>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #f8fafc; letter-spacing: 0.025em; margin-bottom: 0.25rem;">
            Work In Progress
          </div>
          <p style="font-size: 0.75rem; color: #94a3b8; max-width: 240px; margin: 0; line-height: 1.4;">
            Municipal resolution proof will appear here once the field squad completes the fix.
          </p>
        </div>
      `;
    }
  }

  // Reset slider position to 50%
  setCitizenSliderPos(50);

  // 4. Resolution Timeline Card
  const progressBadge = document.getElementById('cd-timeline-progress-badge');
  const stepsContainer = document.getElementById('cd-timeline-steps-container');

  const isResolved = g.status === 'Resolved';
  const isInProgress = g.status === 'In Progress';

  if (progressBadge) {
    if (isResolved) {
      progressBadge.textContent = '4/4 Resolved';
      progressBadge.style.background = '#ecfdf5';
      progressBadge.style.color = '#047857';
      progressBadge.style.borderColor = '#a7f3d0';
    } else if (isInProgress) {
      progressBadge.textContent = '2/4 In Progress';
      progressBadge.style.background = '#eff6ff';
      progressBadge.style.color = '#1d4ed8';
      progressBadge.style.borderColor = '#bfdbfe';
    } else {
      progressBadge.textContent = '1/4 Submitted';
      progressBadge.style.background = '#fef3c7';
      progressBadge.style.color = '#92400e';
      progressBadge.style.borderColor = '#fde68a';
    }
  }

  // 4 steps definition
  const officerName = g.assignedOfficer && g.assignedOfficer !== 'Unassigned' ? g.assignedOfficer : (g.department || 'Ward Field Squad');
  const dateStr = g.submittedDate || 'Oct 21, 2026';
  
  const stepItems = [
    {
      num: 1,
      title: '1. Grievance Submitted',
      sub: `${g.citizen || 'Citizen'} • Submitted`,
      time: dateStr,
      status: 'done'
    },
    {
      num: 2,
      title: '2. Field Unit Assigned',
      sub: `Assigned to ${officerName}`,
      time: isResolved || isInProgress ? dateStr : 'Pending',
      status: isResolved || isInProgress ? 'done' : 'active'
    },
    {
      num: 3,
      title: '3. Field Action Deployed',
      sub: isResolved ? 'Road asphalt leveling & patch work completed' : (isInProgress ? 'Field squad dispatched on-site' : 'Pending squad mobilization'),
      time: isResolved ? 'Completed' : (isInProgress ? 'Active' : 'Awaiting'),
      status: isResolved ? 'done' : (isInProgress ? 'active' : 'pending')
    },
    {
      num: 4,
      title: '4. Verified & Resolved',
      sub: isResolved ? 'Verified by Ward Municipal Inspector' : 'Final inspection and photo validation',
      time: isResolved ? 'Closed' : 'Estimated 24h',
      status: isResolved ? 'done' : 'pending'
    }
  ];

  if (stepsContainer) {
    stepsContainer.innerHTML = stepItems.map((step, sIdx) => {
      const isLast = sIdx === stepItems.length - 1;
      let iconContent = step.status === 'done' ? '✓' : step.num;
      let iconClass = `cd-step-icon ${step.status}`;
      return `
        <div class="cd-timeline-step-row">
          <div class="cd-step-marker">
            <div class="${iconClass}">${iconContent}</div>
            ${!isLast ? `<div class="cd-step-line" style="${step.status === 'done' ? 'background: #059669;' : ''}"></div>` : ''}
          </div>
          <div class="cd-step-content">
            <div class="cd-step-title">${step.title}</div>
            <div class="cd-step-sub">${step.sub}</div>
          </div>
          <div class="cd-step-time">${step.time}</div>
        </div>
      `;
    }).join('');
  }

  // 5. Vote Count
  const currentVotes = currentDossierVotes[g.id] || 0;
  const voteLabel = document.getElementById('cd-vote-label');
  if (voteLabel) voteLabel.textContent = `${currentVotes} Votes`;

  // Open Drawer
  const drawer = document.getElementById('citizen-dossier-drawer');
  const backdrop = document.getElementById('citizen-dossier-backdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
}

export function setupCitizenDossierDrawer() {
  const drawer = document.getElementById('citizen-dossier-drawer');
  const backdrop = document.getElementById('citizen-dossier-backdrop');
  const btnClose = document.getElementById('cd-btn-close');
  const btnBack = document.getElementById('cd-btn-back');
  const btnPrev = document.getElementById('cd-btn-prev');
  const btnNext = document.getElementById('cd-btn-next');
  const btnShare = document.getElementById('cd-btn-share');
  const btnVote = document.getElementById('cd-btn-vote');
  const btnReportSimilar = document.getElementById('cd-btn-report-similar');
  const sliderBox = document.getElementById('cd-slider-box');
  const handleBtn = document.getElementById('cd-handle-button');

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  };

  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (btnBack) btnBack.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Keyboard navigation & dismissal
  document.addEventListener('keydown', (e) => {
    if (!drawer || !drawer.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeDrawer();
    } else if (e.key === 'ArrowLeft' && e.altKey) {
      btnPrev?.click();
    } else if (e.key === 'ArrowRight' && e.altKey) {
      btnNext?.click();
    }
  });

  // Previous & Next navigation
  btnPrev?.addEventListener('click', () => {
    if (!currentDossierList.length) currentDossierList = Store.getAll();
    if (!currentDossierList.length) return;
    currentDossierIndex = (currentDossierIndex - 1 + currentDossierList.length) % currentDossierList.length;
    openCitizenDossier(currentDossierList[currentDossierIndex].id);
  });

  btnNext?.addEventListener('click', () => {
    if (!currentDossierList.length) currentDossierList = Store.getAll();
    if (!currentDossierList.length) return;
    currentDossierIndex = (currentDossierIndex + 1) % currentDossierList.length;
    openCitizenDossier(currentDossierList[currentDossierIndex].id);
  });

  // Share button
  btnShare?.addEventListener('click', async () => {
    const g = currentDossierList[currentDossierIndex];
    const grvId = g ? (g.grievanceNo || g.trackingId || g.id) : '';
    const shareData = {
      title: `Grievance #${grvId} - Amravati Civic Portal`,
      text: `Tracking status of grievance #${grvId} (${g?.category || 'Civic Issue'}): ${g?.status || 'Pending'}`,
      url: window.location.href
    };
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?id=${grvId}`);
      showToast(`Link for grievance #${grvId} copied to clipboard!`, 'success');
    }
  });

  // Upvote in Drawer
  btnVote?.addEventListener('click', () => {
    const g = currentDossierList[currentDossierIndex];
    if (!g) return;
    const gid = g.id;
    currentDossierVotes[gid] = (currentDossierVotes[gid] || 0) + 1;
    const voteLabel = document.getElementById('cd-vote-label');
    if (voteLabel) voteLabel.textContent = `${currentDossierVotes[gid]} Votes`;
    renderBottomCards();
    showToast(`✓ Upvoted! Community priority updated for #${g.grievanceNo || gid}.`, 'success');
  });

  // Report Similar Issue button
  btnReportSimilar?.addEventListener('click', () => {
    const g = currentDossierList[currentDossierIndex];
    closeDrawer();

    const reportModal = document.getElementById('report-modal');
    if (reportModal) {
      reportModal.classList.add('open');
      if (g) {
        const deptSel = document.getElementById('wiz-dept-select');
        const defectSel = document.getElementById('wiz-defect-select');
        const landmarkInput = document.getElementById('wiz-landmark-input');
        if (deptSel && g.department) deptSel.value = g.department;
        if (defectSel && g.category) defectSel.value = g.category;
        if (landmarkInput && (g.landmark || g.location)) landmarkInput.value = g.landmark || g.location;
      }
      showToast(`Reporting similar issue for ${g?.category || 'Civic defect'}`, 'info');
    }
  });

  // Slider Dragging (Pointer and Touch)
  if (sliderBox) {
    let isDragging = false;

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const rect = sliderBox.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const offsetX = clientX - rect.left;
      const pct = (offsetX / rect.width) * 100;
      setCitizenSliderPos(pct);
    };

    const onPointerUp = () => {
      isDragging = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    const startDrag = (e) => {
      isDragging = true;
      onPointerMove(e);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);
    };

    sliderBox.addEventListener('mousedown', startDrag);
    sliderBox.addEventListener('touchstart', startDrag, { passive: true });
  }

  // Handle keyboard arrow navigation on slider
  if (handleBtn) {
    handleBtn.addEventListener('keydown', (e) => {
      let currentVal = parseFloat(handleBtn.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft') {
        setCitizenSliderPos(Math.max(0, currentVal - 5));
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setCitizenSliderPos(Math.min(100, currentVal + 5));
        e.preventDefault();
      }
    });
  }
}

// Card tile upvoting
window.voteCitizenCard = function(id, btnElement) {
  currentDossierVotes[id] = (currentDossierVotes[id] || 0) + 1;
  if (btnElement) {
    btnElement.textContent = `✓ ${currentDossierVotes[id]} Votes`;
    btnElement.style.background = '#dcfce7';
    btnElement.style.color = '#15803d';
  }
  showToast(`✓ Upvoted grievance #${id}!`, 'success');
};

// Expose on global window object
window.openCitizenDossier = openCitizenDossier;
window.setupCitizenDossierDrawer = setupCitizenDossierDrawer;

// ============================================================================
// 9. Edit Grievance Modal Engine (Exact Match to User Reference Screenshot)
// ============================================================================
let activeEditingToken = null;
let currentEditPhoto = null;

export function openEditGrievanceModal(tokenOrId) {
  const modal = document.getElementById('edit-grievance-modal');
  if (!modal) return;

  const targetToken = tokenOrId || selectedTicketToken || '#GRV-2026-000175';
  activeEditingToken = targetToken;
  const clean = String(targetToken).replace(/^#/, '');

  // 1. Find from Store or TICKETS_SAMPLE
  const all = Store.getAll();
  let item = all.find(c => String(c.id) === clean || c.grievanceNo === clean || c.trackingId === clean || ('#' + c.grievanceNo) === targetToken);
  
  if (!item) {
    const sample = TICKETS_SAMPLE.find(t => t.token === targetToken || t.token.replace(/^#/, '') === clean);
    if (sample) {
      item = {
        grievanceNo: sample.token.replace(/^#/, ''),
        department: sample.department,
        category: sample.title,
        title: sample.title,
        location: sample.location,
        landmark: sample.location,
        citizen: 'Arpita Lande',
        mobile: '7249876434',
        description: 'The streetlight fixture on the pole is not functioning properly, causing darkness in the area. Please inspect and repair the light at the earliest.',
        images: { before: sample.photo }
      };
    } else {
      item = {
        grievanceNo: clean,
        department: 'Street Lighting Department',
        category: 'Light not working',
        title: 'Light not working',
        location: 'Rajapeth Main Road, Amravati',
        landmark: 'Rajapeth Main Road',
        citizen: 'Arpita Lande',
        mobile: '7249876434',
        description: 'The streetlight fixture on the pole is not functioning properly, causing darkness in the area. Please inspect and repair the light at the earliest.',
        images: { before: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500' }
      };
    }
  }

  // 2. Populate Header
  const tokenBadge = document.getElementById('eg-token-badge');
  if (tokenBadge) {
    const dispToken = targetToken.startsWith('#') ? targetToken : ('#' + (item.grievanceNo || item.id));
    tokenBadge.textContent = dispToken;
  }

  // 3. Populate Department & Defect Type
  const deptSelect = document.getElementById('eg-dept-select');
  const defectSelect = document.getElementById('eg-defect-select');
  if (deptSelect && item.department) {
    deptSelect.value = item.department;
    if (deptSelect.selectedIndex === -1) {
      const opt = document.createElement('option');
      opt.value = item.department;
      opt.textContent = item.department;
      deptSelect.appendChild(opt);
      deptSelect.value = item.department;
    }
  }
  if (defectSelect && (item.category || item.title)) {
    const defectVal = item.category || item.title;
    defectSelect.value = defectVal;
    if (defectSelect.selectedIndex === -1) {
      const opt = document.createElement('option');
      opt.value = defectVal;
      opt.textContent = defectVal;
      defectSelect.appendChild(opt);
      defectSelect.value = defectVal;
    }
  }

  // 4. Populate Landmark
  const landmarkInput = document.getElementById('eg-landmark-input');
  if (landmarkInput) {
    landmarkInput.value = item.landmark || item.location || 'Camp Main Road, Amravati';
  }

  // 5. Populate Description & Counter
  const descTextarea = document.getElementById('eg-desc-textarea');
  const charCount = document.getElementById('eg-char-count');
  const defaultDesc = item.description || (item.category ? `The ${item.category.toLowerCase()} at ${item.location || 'the specified location'} requires immediate municipal maintenance and inspection.` : 'Please inspect and repair the civic defect at the earliest.');
  if (descTextarea) {
    descTextarea.value = defaultDesc;
    if (charCount) charCount.textContent = defaultDesc.length;
  }

  // 6. Populate Citizen Info
  const citizenNameInput = document.getElementById('eg-citizen-name');
  const citizenPhoneInput = document.getElementById('eg-citizen-phone');
  if (citizenNameInput) citizenNameInput.value = item.citizen || 'Arpita Lande';
  if (citizenPhoneInput) citizenPhoneInput.value = item.mobile || '7249876434';

  // 7. Populate Evidence Photo
  currentEditPhoto = (item.images && item.images.before) ? item.images.before : (item.photo || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500');
  const photoImg = document.getElementById('eg-photo-preview-img');
  const photoItem = document.getElementById('eg-photo-preview-item');
  const photoCounter = document.getElementById('eg-photo-counter');
  if (photoImg && currentEditPhoto) {
    photoImg.src = currentEditPhoto;
    if (photoItem) photoItem.style.display = 'block';
    if (photoCounter) photoCounter.textContent = '1/5 PHOTOS';
  }

  // 8. Open modal
  modal.classList.add('open');
}

export function setupEditGrievanceModal() {
  const modal = document.getElementById('edit-grievance-modal');
  const btnClose = document.getElementById('eg-btn-close');
  const btnBackHeader = document.getElementById('eg-btn-back-header');
  const btnBackFooter = document.getElementById('eg-btn-back-footer');
  const form = document.getElementById('edit-grievance-form');
  const btnUpload = document.getElementById('eg-btn-upload-photo');
  const btnCamera = document.getElementById('eg-btn-camera');
  const fileInput = document.getElementById('eg-photo-file-input');
  const btnRemovePhoto = document.getElementById('eg-btn-remove-photo');
  const btnLocate = document.getElementById('eg-btn-locate-me');
  const btnVoice = document.getElementById('eg-btn-voice');
  const descTextarea = document.getElementById('eg-desc-textarea');
  const charCount = document.getElementById('eg-char-count');

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
  };

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnBackHeader) btnBackHeader.addEventListener('click', closeModal);
  if (btnBackFooter) btnBackFooter.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('open') && e.key === 'Escape') {
      closeModal();
    }
  });

  // Character counter
  if (descTextarea && charCount) {
    descTextarea.addEventListener('input', () => {
      charCount.textContent = descTextarea.value.length;
    });
  }

  // File Upload
  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          currentEditPhoto = evt.target.result;
          const photoImg = document.getElementById('eg-photo-preview-img');
          const photoItem = document.getElementById('eg-photo-preview-item');
          const photoCounter = document.getElementById('eg-photo-counter');
          if (photoImg) photoImg.src = currentEditPhoto;
          if (photoItem) photoItem.style.display = 'block';
          if (photoCounter) photoCounter.textContent = '1/5 PHOTOS';
          showToast('Evidence photo attached successfully!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Camera Action
  if (btnCamera && fileInput) {
    btnCamera.addEventListener('click', () => {
      fileInput.setAttribute('capture', 'environment');
      fileInput.click();
      showToast('Camera initiated for evidence capture', 'info');
    });
  }

  // Remove photo
  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      currentEditPhoto = null;
      const photoItem = document.getElementById('eg-photo-preview-item');
      const photoCounter = document.getElementById('eg-photo-counter');
      if (photoItem) photoItem.style.display = 'none';
      if (photoCounter) photoCounter.textContent = '0/5 PHOTOS';
      showToast('Photo evidence removed', 'info');
    });
  }

  // Locate Me
  if (btnLocate) {
    btnLocate.addEventListener('click', () => {
      const landmarkInput = document.getElementById('eg-landmark-input');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (landmarkInput) {
              landmarkInput.value = `Camp Main Road, Amravati (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`;
            }
            showToast('📍 GPS Location detected & filled!', 'success');
          },
          () => {
            if (landmarkInput) {
              landmarkInput.value = 'Camp Main Road, Amravati (GPS: 20.9320° N, 77.7550° E)';
            }
            showToast('📍 Municipal GPS coordinates tagged!', 'info');
          }
        );
      } else {
        if (landmarkInput) {
          landmarkInput.value = 'Camp Main Road, Amravati (GPS: 20.9320° N, 77.7550° E)';
        }
        showToast('📍 Municipal GPS coordinates tagged!', 'info');
      }
    });
  }

  // Voice dictation
  if (btnVoice && descTextarea) {
    let recognition = null;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.onstart = () => {
        btnVoice.classList.add('recording');
        showToast('🎙️ Listening... speak your grievance description', 'info');
      };
      recognition.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        descTextarea.value = (descTextarea.value + ' ' + transcript).trim();
        if (charCount) charCount.textContent = descTextarea.value.length;
        showToast('Voice dictation added!', 'success');
      };
      recognition.onend = () => {
        btnVoice.classList.remove('recording');
      };
      recognition.onerror = () => {
        btnVoice.classList.remove('recording');
      };
    }

    btnVoice.addEventListener('click', () => {
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
          recognition.stop();
        }
      } else {
        const sampleText = ' The streetlight fixture on the pole is not functioning properly, causing darkness in the area. Please inspect and repair the light at the earliest.';
        descTextarea.value = (descTextarea.value + sampleText).trim();
        if (charCount) charCount.textContent = descTextarea.value.length;
        showToast('🎙️ Simulated voice dictation inserted!', 'info');
      }
    });
  }

  // Form submit / Save Changes
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dept = document.getElementById('eg-dept-select')?.value;
      const defect = document.getElementById('eg-defect-select')?.value;
      const landmark = document.getElementById('eg-landmark-input')?.value;
      const desc = document.getElementById('eg-desc-textarea')?.value;
      const citizenName = document.getElementById('eg-citizen-name')?.value;
      const citizenPhone = document.getElementById('eg-citizen-phone')?.value;

      const clean = String(activeEditingToken || selectedTicketToken || '').replace(/^#/, '');
      const all = Store.getComplaints();
      let item = all.find(c => String(c.id) === clean || c.grievanceNo === clean || c.trackingId === clean);

      if (item) {
        item.department = dept;
        item.category = defect;
        item.title = defect;
        item.location = landmark;
        item.landmark = landmark;
        item.description = desc;
        item.citizen = citizenName;
        item.mobile = citizenPhone;
        if (currentEditPhoto) {
          if (!item.images) item.images = {};
          item.images.before = currentEditPhoto;
        }
        Store.commitComplaints(all);
      } else {
        const sample = TICKETS_SAMPLE.find(t => t.token === activeEditingToken || t.token.replace(/^#/, '') === clean);
        if (sample) {
          sample.title = defect;
          sample.department = dept;
          sample.location = landmark;
          if (currentEditPhoto) sample.photo = currentEditPhoto;
        }
      }

      // Update Tracker Details panel
      const detailTitle = document.getElementById('detail-ticket-title');
      const detailDept = document.getElementById('detail-ticket-dept');
      const detailLoc = document.getElementById('detail-ticket-location');
      const detailImg = document.getElementById('detail-before-img');
      const defectEl = document.getElementById('flow-card-defect');

      if (detailTitle) detailTitle.textContent = defect;
      if (detailDept) detailDept.textContent = dept;
      if (detailLoc) detailLoc.textContent = landmark;
      if (defectEl) defectEl.textContent = defect;
      if (detailImg && currentEditPhoto) detailImg.src = currentEditPhoto;

      // Re-render ticket list and bottom cards
      renderTicketList();
      renderBottomCards();

      closeModal();
      showToast(`✓ Grievance ${activeEditingToken || ''} updated successfully!`, 'success');
    });
  }
}

window.openEditGrievanceModal = openEditGrievanceModal;
window.setupEditGrievanceModal = setupEditGrievanceModal;

