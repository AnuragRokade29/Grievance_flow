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
let selectedTicketToken = '#GRV-2026-000175';
let uploadedWizardPhoto = null;

// Realistic ticket sample matching screenshot
const TICKETS_SAMPLE = [
  {
    token: '#GRV-2026-000175',
    title: 'Potholes',
    department: 'Road Maintenance Department',
    location: 'Camp Main Road',
    date: '17 Oct 2026, 02:33 pm',
    icon: '🛣️',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500'
  },
  {
    token: '#GRV-2026-000116',
    title: 'Light not working',
    department: 'Street Lighting Department',
    location: 'Rajapeth Lane 4',
    date: '13 Oct 2026, 04:06 pm',
    icon: '💡',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500'
  },
  {
    token: '#GRV-2026-000108',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Gadge Nagar Main Road',
    date: '13 Oct 2026, 12:51 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500'
  },
  {
    token: '#GRV-2026-000104',
    title: 'Light not working',
    department: 'Street Lighting Department',
    location: 'Shivaji Nagar Square',
    date: '13 Oct 2026, 10:52 am',
    icon: '💡',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500'
  },
  {
    token: '#GRV-2026-000102',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Dastur Nagar',
    date: '12 Oct 2026, 06:17 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500'
  },
  {
    token: '#GRV-2026-000098',
    title: 'Light not working',
    department: 'Street Lighting Department',
    location: 'Badnera Road',
    date: '12 Oct 2026, 05:21 pm',
    icon: '💡',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500'
  },
  {
    token: '#GRV-2026-000097',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Cotton Market',
    date: '12 Oct 2026, 05:18 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500'
  },
  {
    token: '#GRV-2026-000096',
    title: 'Sewer blockage',
    department: 'Sewerage & Drainage Department',
    location: 'Rukhmini Nagar',
    date: '12 Oct 2026, 05:15 pm',
    icon: '🌊',
    status: 'Pending',
    photo: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  allGrievances = Store.getAll();

  setupNavigationTabs();
  setupLanguageSwitcher();
  setupLeafletMap();
  setupTicketFilters();
  setupReportWizardModal();
  setupTicketActionButtons();
  setupCitizenAuth();

  renderKpiCards();
  renderBottomCards();
  populateDropdowns();
  renderTicketList();

  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'NTIS_COMPLAINTS_V1') {
      allGrievances = Store.getAll();
      renderKpiCards();
      renderTicketList();
    }
  });

  window.addEventListener('NTIS_STORE_UPDATED', () => {
    allGrievances = Store.getAll();
    renderKpiCards();
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

  function switchTab(viewName) {
    if (viewName === 'dashboard') {
      btnDashboard?.classList.add('active');
      btnTracker?.classList.remove('active');
      if (viewDashboard) viewDashboard.style.display = 'flex';
      if (viewTracker) viewTracker.style.display = 'none';

      if (leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 150);
      }
    } else {
      btnTracker?.classList.add('active');
      btnDashboard?.classList.remove('active');
      if (viewDashboard) viewDashboard.style.display = 'none';
      if (viewTracker) viewTracker.style.display = 'flex';
    }
  }

  if (btnDashboard) btnDashboard.addEventListener('click', () => switchTab('dashboard'));
  if (btnTracker) btnTracker.addEventListener('click', () => switchTab('tracker'));
  if (homeBtn) homeBtn.addEventListener('click', () => switchTab('dashboard'));

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
    location: g.location || 'Amravati',
    date: g.submittedDate || '21 Oct 2026',
    icon: (g.category && g.category.includes('Pothole')) ? '🛣️' : ((g.category && g.category.includes('manhole')) ? '🌊' : '💡'),
    status: g.status,
    photo: (g.images && g.images.before) ? g.images.before : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500'
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
        <div class="ticket-tile-date">${t.date}</div>
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
        document.getElementById('detail-ticket-title').textContent = item.title;
        document.getElementById('detail-ticket-token').textContent = item.token;
        document.getElementById('detail-ticket-dept').textContent = item.department;
        document.getElementById('detail-ticket-location').textContent = item.location;
        document.getElementById('detail-ticket-date').textContent = item.date;

        const defectEl = document.getElementById('flow-card-defect');
        const dateEl = document.getElementById('flow-card-date');
        if (defectEl) defectEl.textContent = item.title;
        if (dateEl) dateEl.textContent = item.date;

        const img = document.getElementById('detail-before-img');
        if (img) img.src = item.photo;
      }
    });
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

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      showToast('Grievance loaded into wizard for revision.', 'info');
      const modal = document.getElementById('report-modal');
      if (modal) modal.classList.add('open');
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

  // Sample markers
  const sampleCoords = [
    { ward: 'Ward 1', lat: 20.9320, lng: 77.7550 },
    { ward: 'Ward A1', lat: 20.9374, lng: 77.7796 },
    { ward: 'Ward C1', lat: 20.9450, lng: 77.7950 }
  ];

  sampleCoords.forEach(c => {
    const pill = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="custom-map-pill">${c.ward}: Active</div>`,
      iconSize: [120, 26]
    });
    L.marker([c.lat, c.lng], { icon: pill }).addTo(leafletMap);
  });
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

  container.innerHTML = allGrievances.slice(0, 4).map(g => `
    <div class="complaint-card-tile">
      <div class="card-tile-header">
        <span class="ward-tag">📍 Ward 1</span>
        <span class="status-tag-pending">Pending</span>
      </div>
      <div class="card-tile-body">
        <h4>${g.title || g.category}</h4>
        <div class="card-tile-location">${g.location || 'main road, Amravati'}</div>
      </div>
      <div class="card-split-image-box">
        <div class="split-side">
          <span class="split-pill-badge pill-before">Before</span>
          <img src="${(g.images && g.images.before) ? g.images.before : 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500'}" alt="Before" />
        </div>
        <div class="split-center-divider"></div>
        <div class="split-side" style="background: #0f172a;">
          <span class="split-pill-badge pill-pending-fix">Pending Fix</span>
          <div class="pending-fix-placeholder">In Progress<br/>Fix will appear once resolved</div>
        </div>
      </div>
      <div class="card-tile-footer">
        <button type="button" class="btn-vote">✓ 0 Votes</button>
        <button type="button" class="btn-tile-details" onclick="document.getElementById('nav-btn-tracker').click()">Details →</button>
      </div>
    </div>
  `).join('');
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
