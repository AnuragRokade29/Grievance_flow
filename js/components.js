/**
 * ============================================================================
 * NTIS Civic Grievance Redressal System - Interactive UI Components
 * Before/After Slider, 4-Stage Stepper, Modals, Drawers & Sonner Toasts
 * ============================================================================
 */

import { AppStore } from './app.js';
import { I18n } from './i18n.js';

// Floating Toast System (Sonner-style Replacement for alert())
export function showToast(message, type = 'success') {
  let shelf = document.getElementById('toast-shelf');
  if (!shelf) {
    shelf = document.createElement('div');
    shelf.id = 'toast-shelf';
    document.body.appendChild(shelf);
  }

  const toast = document.createElement('div');
  toast.className = `toast-pill ${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span style="font-size: 1rem; color: ${type === 'success' ? '#059669' : (type === 'error' ? '#dc2626' : '#2563eb')}">${iconMap[type] || '✓'}</span>
    <span style="flex: 1;">${message}</span>
    <button type="button" style="background: none; border: none; font-size: 0.9rem; color: #94a3b8; cursor: pointer;" onclick="this.parentElement.remove()">✕</button>
  `;

  shelf.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 1-Click Copy Ticket ID
export function setupCopyBadge() {
  const badge = document.getElementById('ticket-id-badge');
  if (!badge) return;

  badge.addEventListener('click', () => {
    const text = badge.getAttribute('data-id') || badge.textContent.trim();
    navigator.clipboard?.writeText(text);
    showToast(`Ticket ID ${text} copied to clipboard!`, 'info');
  });
}

// Interactive Before & After Evidence Comparison Slider
export function setupBeforeAfterSlider() {
  const container = document.getElementById('evidence-slider-box');
  const afterLayer = document.getElementById('slider-after-layer');
  const handle = document.getElementById('slider-drag-handle');

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function setSliderPos(xPos) {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    afterLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPos(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPos(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for mobile/tablet
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPos(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPos(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Interactive 4-Stage Redressal Stepper Node Clicks
export function setupStepperInteractivity(complaint) {
  const nodes = document.querySelectorAll('.stepper-node-step');
  if (!nodes || !complaint) return;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const stepIdx = Number(node.getAttribute('data-step')) - 1;
      const stepData = complaint.timeline ? complaint.timeline[stepIdx] : null;

      if (stepData) {
        showToast(
          `Stage: ${stepData.title} • Date: ${stepData.date} • Officer: ${stepData.officer}`,
          stepData.status === 'completed' ? 'success' : (stepData.status === 'active' ? 'info' : 'info')
        );
      }
    });
  });
}

// Action Drawers & Modals (Reassign, Resolve, Add Department)
export function setupModalsAndDrawers() {
  // Reassign Modal
  const reassignBtn = document.getElementById('btn-reassign-dept');
  const reassignModal = document.getElementById('reassign-modal');
  const reassignClose = document.getElementById('reassign-modal-close');
  const reassignCancel = document.getElementById('reassign-modal-cancel');
  const reassignForm = document.getElementById('reassign-form');

  const closeReassign = () => reassignModal && reassignModal.classList.remove('open');
  if (reassignBtn) reassignBtn.onclick = () => reassignModal && reassignModal.classList.add('open');
  if (reassignClose) reassignClose.onclick = closeReassign;
  if (reassignCancel) reassignCancel.onclick = closeReassign;

  if (reassignForm) {
    reassignForm.onsubmit = (e) => {
      e.preventDefault();
      const targetDept = document.getElementById('reassign-dept-select').value;
      const targetOfficer = document.getElementById('reassign-officer-select').value;
      const remarks = document.getElementById('reassign-remarks').value;

      if (AppStore.activeComplaint) {
        AppStore.reassignDepartment(AppStore.activeComplaint.id, targetDept, targetOfficer, remarks);
        showToast(`Complaint reassigned to ${targetDept} successfully!`, 'success');
      }
      closeReassign();
    };
  }

  // Resolve Modal
  const resolveBtn = document.getElementById('btn-mark-resolved');
  const resolveModal = document.getElementById('resolve-modal');
  const resolveClose = document.getElementById('resolve-modal-close');
  const resolveCancel = document.getElementById('resolve-modal-cancel');
  const resolveForm = document.getElementById('resolve-form');

  const closeResolve = () => resolveModal && resolveModal.classList.remove('open');
  if (resolveBtn) resolveBtn.onclick = () => resolveModal && resolveModal.classList.add('open');
  if (resolveClose) resolveClose.onclick = closeResolve;
  if (resolveCancel) resolveCancel.onclick = closeResolve;

  if (resolveForm) {
    resolveForm.onsubmit = (e) => {
      e.preventDefault();
      const remarks = document.getElementById('resolve-remarks').value;

      if (AppStore.activeComplaint) {
        AppStore.updateComplaintStatus(AppStore.activeComplaint.id, 'RESOLVED', remarks);
        showToast(`Complaint ${AppStore.activeComplaint.id} verified and resolved!`, 'success');
      }
      closeResolve();
    };
  }

  // Department Master Slide-Over Drawer
  const addDeptBtn = document.getElementById('btn-open-add-dept');
  const deptDrawer = document.getElementById('add-dept-drawer');
  const deptDrawerClose = document.getElementById('add-dept-drawer-close');
  const deptDrawerCancel = document.getElementById('add-dept-drawer-cancel');
  const addDeptForm = document.getElementById('add-dept-form');

  const closeDeptDrawer = () => deptDrawer && deptDrawer.classList.remove('open');
  if (addDeptBtn) addDeptBtn.onclick = () => deptDrawer && deptDrawer.classList.add('open');
  if (deptDrawerClose) deptDrawerClose.onclick = closeDeptDrawer;
  if (deptDrawerCancel) deptDrawerCancel.onclick = closeDeptDrawer;

  if (addDeptForm) {
    addDeptForm.onsubmit = (e) => {
      e.preventDefault();
      const nameEn = document.getElementById('dept-name-en').value.trim();
      const nameMr = document.getElementById('dept-name-mr').value.trim();
      const hod = document.getElementById('dept-hod').value.trim();
      const sla = document.getElementById('dept-sla').value.trim();

      AppStore.addDepartment({ nameEn, nameMr, hod, slaHours: sla, status: 'Active' });
      showToast(`Department "${nameEn}" added to municipal registry!`, 'success');
      closeDeptDrawer();
      addDeptForm.reset();
    };
  }
}
