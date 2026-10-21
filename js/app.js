/**
 * ============================================================================
 * NTIS Civic Grievance Redressal System - Application Router & State Engine
 * Amravati Municipal Corporation (AMC)
 * ============================================================================
 */

import { I18n } from './i18n.js';

const COMPLAINTS_KEY = 'NTIS_COMPLAINTS_V1';
const DEPTS_KEY = 'NTIS_DEPTS_V1';

// Seed Municipal Departments
const SEED_DEPARTMENTS = [
  { id: 1, code: 'SWM', nameEn: 'Solid Waste Management', nameMr: 'घनकचरा व्यवस्थापन विभाग', hod: 'Dr. V. S. Kale', slaHours: 24, status: 'Active', complaintsCount: 68 },
  { id: 2, code: 'WSD', nameEn: 'Water Supply & Drainage', nameMr: 'पाणी पुरवठा व मलनिःसारण', hod: 'Er. Nilesh Wankhede', slaHours: 24, status: 'Active', complaintsCount: 52 },
  { id: 3, code: 'RND', nameEn: 'Roads & Infrastructure', nameMr: 'रस्ते व पायाभूत सुविधा', hod: 'Er. Rajesh Bansod', slaHours: 48, status: 'Active', complaintsCount: 45 },
  { id: 4, code: 'SLE', nameEn: 'Street Lights & Electrical', nameMr: 'विद्युत विभाग', hod: 'Er. Pramod Deshmukh', slaHours: 24, status: 'Active', complaintsCount: 28 },
  { id: 5, code: 'TED', nameEn: 'Traffic Engineering Department', nameMr: 'वाहतूक अभियांत्रिकी विभाग', hod: 'Er. Sanjay Raut', slaHours: 36, status: 'Active', complaintsCount: 14 },
  { id: 6, code: 'GHD', nameEn: 'Garden & Horticulture', nameMr: 'उद्यान व वृक्षसंवर्धन', hod: 'Dr. P. R. Sharma', slaHours: 72, status: 'Active', complaintsCount: 9 },
  { id: 7, code: 'REV', nameEn: 'Property Tax & Revenue', nameMr: 'मालमत्ता कर विभाग', hod: 'Shri A. K. Joshi', slaHours: 48, status: 'Inactive', complaintsCount: 4 }
];

// Seed Civic Complaints (with Before & After evidence images)
const SEED_COMPLAINTS = [
  {
    id: '#GRV-2026-08942',
    rawId: '08942',
    citizen: 'Tanvi Deshmukh',
    phone: '9022615818',
    department: 'Roads & Infrastructure',
    departmentMr: 'रस्ते व पायाभूत सुविधा',
    category: 'Severe Potholes & Surface Crater',
    ward: 'Ward 4 - Gadge Nagar',
    zone: 'Zone 3 (Central)',
    location: 'Main Road, Near Shivaji High School, Amravati',
    lodgedDate: '21 Oct 2026, 09:15 AM',
    priority: 'CRITICAL',
    slaRemaining: '18h remaining',
    slaProgressPercent: 65,
    stage: 'IN_PROGRESS', // SUBMITTED | ASSIGNED | IN_PROGRESS | RESOLVED
    assignedOfficer: 'Er. Rajesh Bansod (Deputy Engineer)',
    assignedOfficerContact: '+91 98220 12345',
    description: 'A deep pothole has expanded across the lane after heavy rains. Two-wheelers are slipping and traffic is severely choked.',
    beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=800&auto=format&fit=crop&q=80',
    timeline: [
      { step: 1, title: 'Submitted (नोंदणीकृत)', date: '21 Oct 2026, 09:15 AM', officer: 'Tanvi Deshmukh (Citizen)', note: 'Complaint lodged online via Mobile Snap & Report portal with photo geotag.', status: 'completed' },
      { step: 2, title: 'Verified & Assigned (पडताळणी व वाटप)', date: '21 Oct 2026, 11:30 AM', officer: 'Central Control Desk', note: 'Issue verified and routed to Roads & Infrastructure wing.', status: 'completed' },
      { step: 3, title: 'In Progress / On Ground (प्रगतीपथावर)', date: '21 Oct 2026, 02:45 PM', officer: 'Er. Rajesh Bansod', note: 'Cold-mix asphalt patch squad deployed on site. Leveling underway.', status: 'active' },
      { step: 4, title: 'Resolved & Closed (निकाली काढले)', date: 'Pending', officer: 'Awaiting completion signoff', note: 'Resolution proof photo inspection required before closure.', status: 'pending' }
    ]
  },
  {
    id: '#GRV-2026-08941',
    rawId: '08941',
    citizen: 'Arpita Lande',
    phone: '7350785513',
    department: 'Water Supply & Drainage',
    departmentMr: 'पाणी पुरवठा व मलनिःसारण',
    category: 'Broken Manhole Cover',
    ward: 'Ward 2 - Rajapeth',
    zone: 'Zone 2 (East)',
    location: 'Opposite State Bank, Station Road, Amravati',
    lodgedDate: '21 Oct 2026, 08:30 AM',
    priority: 'HIGH',
    slaRemaining: '22h remaining',
    slaProgressPercent: 40,
    stage: 'ASSIGNED',
    assignedOfficer: 'Er. Nilesh Wankhede',
    assignedOfficerContact: '+91 94221 44556',
    description: 'Concrete chamber cover shattered by heavy vehicle. Open hole poses pedestrian hazard.',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
    timeline: [
      { step: 1, title: 'Submitted', date: '21 Oct 2026, 08:30 AM', officer: 'Arpita Lande', note: 'Reported with photo.', status: 'completed' },
      { step: 2, title: 'Assigned', date: '21 Oct 2026, 10:00 AM', officer: 'Control Room', note: 'Assigned to Ward 2 inspector.', status: 'active' },
      { step: 3, title: 'In Progress', date: 'Pending', officer: '-', note: 'Inspection scheduled.', status: 'pending' },
      { step: 4, title: 'Resolved', date: 'Pending', officer: '-', note: 'Awaiting slab placement.', status: 'pending' }
    ]
  },
  {
    id: '#GRV-2026-08939',
    rawId: '08939',
    citizen: 'Prathmesh Joshi',
    phone: '9763709303',
    department: 'Solid Waste Management',
    departmentMr: 'घनकचरा व्यवस्थापन विभाग',
    category: 'Overflowing Community Bin',
    ward: 'Ward 1 - Camp Area',
    zone: 'Zone 1 (North)',
    location: 'Lane 3, Behind Collector Bungalow, Amravati',
    lodgedDate: '20 Oct 2026, 04:20 PM',
    priority: 'HIGH',
    slaRemaining: '6h remaining',
    slaProgressPercent: 85,
    stage: 'IN_PROGRESS',
    assignedOfficer: 'Dr. V. S. Kale',
    assignedOfficerContact: '+91 98900 11223',
    description: 'Garbage dump overflowing onto pedestrian walkway. Stray animals scattering waste.',
    beforeImage: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    timeline: [
      { step: 1, title: 'Submitted', date: '20 Oct 2026, 04:20 PM', officer: 'Citizen', note: 'Lodged online.', status: 'completed' },
      { step: 2, title: 'Assigned', date: '20 Oct 2026, 05:00 PM', officer: 'SWM Desk', note: 'Compactor vehicle scheduled.', status: 'completed' },
      { step: 3, title: 'In Progress', date: '21 Oct 2026, 08:00 AM', officer: 'Sanitation Squad', note: 'Clearance underway.', status: 'active' },
      { step: 4, title: 'Resolved', date: 'Pending', officer: '-', note: 'Site cleaning verification.', status: 'pending' }
    ]
  },
  {
    id: '#GRV-2026-08935',
    rawId: '08935',
    citizen: 'Mahesh Kadam',
    phone: '9850112233',
    department: 'Street Lights & Electrical',
    departmentMr: 'विद्युत विभाग',
    category: 'Street Lights Non-Functional',
    ward: 'Ward 5 - Shivaji Nagar',
    zone: 'Zone 2 (East)',
    location: 'Shivaji Chowk to Dastur Nagar Stretch',
    lodgedDate: '19 Oct 2026, 07:45 PM',
    priority: 'NORMAL',
    slaRemaining: 'Completed',
    slaProgressPercent: 100,
    stage: 'RESOLVED',
    assignedOfficer: 'Er. Pramod Deshmukh',
    assignedOfficerContact: '+91 97650 99887',
    description: '8 LED streetlights dark for 3 days. High accident probability.',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80',
    timeline: [
      { step: 1, title: 'Submitted', date: '19 Oct 2026, 07:45 PM', officer: 'Citizen', note: 'Lodged.', status: 'completed' },
      { step: 2, title: 'Assigned', date: '20 Oct 2026, 09:30 AM', officer: 'Electrical Wing', note: 'Assigned.', status: 'completed' },
      { step: 3, title: 'In Progress', date: '20 Oct 2026, 02:00 PM', officer: 'Line Squad', note: 'Fuse replacement.', status: 'completed' },
      { step: 4, title: 'Resolved & Closed', date: '20 Oct 2026, 06:15 PM', officer: 'Er. Pramod Deshmukh', note: 'Feed repaired and lights tested.', status: 'completed' }
    ]
  }
];

export const AppStore = {
  activeScreen: 'workbench', // 'workbench' | 'all-complaints' | 'dept-master'
  activeComplaint: null,

  init() {
    I18n.init();
    if (!localStorage.getItem(COMPLAINTS_KEY)) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
    }
    if (!localStorage.getItem(DEPTS_KEY)) {
      localStorage.setItem(DEPTS_KEY, JSON.stringify(SEED_DEPARTMENTS));
    }
    this.activeComplaint = this.getComplaints()[0];
  },

  getComplaints() {
    try {
      const data = localStorage.getItem(COMPLAINTS_KEY);
      return data ? JSON.parse(data) : SEED_COMPLAINTS;
    } catch (e) {
      return SEED_COMPLAINTS;
    }
  },

  saveComplaints(list) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_STORE_UPDATED'));
  },

  getDepartments() {
    try {
      const data = localStorage.getItem(DEPTS_KEY);
      return data ? JSON.parse(data) : SEED_DEPARTMENTS;
    } catch (e) {
      return SEED_DEPARTMENTS;
    }
  },

  saveDepartments(list) {
    localStorage.setItem(DEPTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_DEPTS_UPDATED'));
  },

  addDepartment(dept) {
    const list = this.getDepartments();
    const newDept = {
      id: list.length + 1,
      code: dept.code || dept.nameEn.slice(0, 3).toUpperCase(),
      nameEn: dept.nameEn,
      nameMr: dept.nameMr || dept.nameEn,
      hod: dept.hod || 'Unassigned',
      slaHours: Number(dept.slaHours) || 24,
      status: dept.status || 'Active',
      complaintsCount: 0
    };
    list.unshift(newDept);
    this.saveDepartments(list);
    return newDept;
  },

  toggleDeptStatus(id) {
    const list = this.getDepartments();
    const found = list.find(d => d.id === Number(id));
    if (found) {
      found.status = found.status === 'Active' ? 'Inactive' : 'Active';
      this.saveDepartments(list);
    }
  },

  deleteDepartment(id) {
    let list = this.getDepartments();
    list = list.filter(d => d.id !== Number(id));
    this.saveDepartments(list);
  },

  updateComplaintStatus(id, newStatus, remarks) {
    const list = this.getComplaints();
    const grv = list.find(c => c.id === id);
    if (!grv) return;

    grv.stage = newStatus;
    const nowStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (newStatus === 'RESOLVED') {
      grv.slaRemaining = 'Completed';
      grv.slaProgressPercent = 100;
      grv.timeline[3] = {
        step: 4,
        title: 'Resolved & Closed (निकाली काढले)',
        date: nowStr,
        officer: 'Er. Rajesh Bansod',
        note: remarks || 'Site inspected and verified. Work verified complete.',
        status: 'completed'
      };
    } else if (newStatus === 'IN_PROGRESS') {
      grv.timeline[2] = {
        step: 3,
        title: 'In Progress / On Ground (प्रगतीपथावर)',
        date: nowStr,
        officer: 'Field Unit Squad',
        note: remarks || 'Crew deployed on site.',
        status: 'active'
      };
    }

    this.saveComplaints(list);
    this.activeComplaint = grv;
    return grv;
  },

  reassignDepartment(id, targetDept, targetOfficer, remarks) {
    const list = this.getComplaints();
    const grv = list.find(c => c.id === id);
    if (!grv) return;

    grv.department = targetDept;
    grv.assignedOfficer = targetOfficer || grv.assignedOfficer;
    const nowStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    grv.timeline[1] = {
      step: 2,
      title: 'Verified & Assigned (पडताळणी व वाटप)',
      date: nowStr,
      officer: grv.assignedOfficer,
      note: `Reassigned to ${targetDept}. Directive: ${remarks || 'Field inspection required'}`,
      status: 'completed'
    };

    this.saveComplaints(list);
    this.activeComplaint = grv;
    return grv;
  },

  resetToDefaults() {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
    localStorage.setItem(DEPTS_KEY, JSON.stringify(SEED_DEPARTMENTS));
    this.activeComplaint = SEED_COMPLAINTS[0];
    window.dispatchEvent(new CustomEvent('NTIS_STORE_UPDATED'));
    window.dispatchEvent(new CustomEvent('NTIS_DEPTS_UPDATED'));
  }
};
