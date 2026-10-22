/**
 * ============================================================================
 * NTIS Civic Grievance Redressal System - Shared Store & Cross-Tab Engine
 * Amravati Municipal Corporation (AMC)
 * ============================================================================
 */

export const COMPLAINTS_KEY = 'NTIS_COMPLAINTS_V1';
export const DEPTS_KEY = 'NTIS_DEPTS_V1';
export const TASKS_KEY = 'NTIS_TASKS_V1';
export const MEETINGS_KEY = 'NTIS_MEETINGS_V1';
export const SCREENS_KEY = 'NTIS_SCREENS_V1';
export const APPOINTMENTS_KEY = 'NTIS_APPOINTMENTS_V1';
export const ADMIN_AUTH_KEY = 'AMC_ADMIN_LOGGED_IN';
export const CITIZEN_AUTH_KEY = 'NTIS_CITIZEN_USER_V1';
export const ADMIN_USER_KEY = 'NTIS_ADMIN_USER_V1';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'User@123'
};

export const DEFAULT_CITIZEN_USER = {
  name: 'Anurag',
  phone: '8459741554',
  ward: 'Ward 1',
  verified: true,
  loggedIn: true
};

export const DEFAULT_ADMIN_USER = {
  name: 'Prajval Bhoyar',
  role: 'Municipal Admin',
  email: 'admin@amravati.gov.in',
  designation: 'Grievance Operations Superintendent'
};

export const MASTER_DEPARTMENTS = [
  { id: 1, code: 'PWD', nameEn: 'Public Works Department', nameMr: 'सार्वजनिक बांधकाम विभाग', hod: 'Er. Rajesh Bansod', slaHours: 48, status: 'Active', complaintsCount: 42 },
  { id: 2, code: 'WSD', nameEn: 'Water Supply Department', nameMr: 'पाणी पुरवठा विभाग', hod: 'Er. Nilesh Wankhede', slaHours: 24, status: 'Active', complaintsCount: 38 },
  { id: 3, code: 'SDD', nameEn: 'Sewerage & Drainage Department', nameMr: 'मलनिस्सारण व निचरा विभाग', hod: 'Er. Sunita Kulkarni', slaHours: 24, status: 'Active', complaintsCount: 29 },
  { id: 4, code: 'SLD', nameEn: 'Street Lighting Department', nameMr: 'पथदिवे विभाग', hod: 'Er. Pramod Deshmukh', slaHours: 24, status: 'Active', complaintsCount: 24 },
  { id: 5, code: 'RMD', nameEn: 'Road Maintenance Department', nameMr: 'रस्ता देखभाल विभाग', hod: 'Er. Kavita Thakare', slaHours: 48, status: 'Active', complaintsCount: 31 },
  { id: 6, code: 'TED', nameEn: 'Traffic Engineering Department', nameMr: 'वाहतूक अभियांत्रिकी विभाग', hod: 'Er. Sanjay Raut', slaHours: 36, status: 'Active', complaintsCount: 12 },
  { id: 7, code: 'PWED', nameEn: 'Public Works Electrical Department', nameMr: 'विद्युत बांधकाम विभाग', hod: 'Er. Milind Patil', slaHours: 24, status: 'Active', complaintsCount: 9 },
  { id: 8, code: 'MBD', nameEn: 'Municipal Buildings Department', nameMr: 'महापालिका इमारत विभाग', hod: 'Er. A. K. Joshi', slaHours: 72, status: 'Active', complaintsCount: 5 },
  { id: 9, code: 'GHD', nameEn: 'Garden & Horticulture Department', nameMr: 'उद्यान व वृक्षसंवर्धन विभाग', hod: 'Dr. V. S. Kale', slaHours: 72, status: 'Active', complaintsCount: 3 }
];

export const SEED_DEPARTMENTS = MASTER_DEPARTMENTS;

export const MASTER_CATEGORIES = [
  { id: 'cat-1', nameEn: 'Potholes' },
  { id: 'cat-2', nameEn: 'Broken manhole' },
  { id: 'cat-3', nameEn: 'Surface damage' },
  { id: 'cat-4', nameEn: 'Congestion' },
  { id: 'cat-5', nameEn: 'Waste burning' },
  { id: 'cat-6', nameEn: 'Garbage dump overflow' },
  { id: 'cat-7', nameEn: 'Street Lights Non-Functional' },
  { id: 'cat-8', nameEn: 'Water pipeline leakage' },
  { id: 'cat-9', nameEn: 'Sewer blockage' },
  { id: 'cat-10', nameEn: 'Fallen tree branch' }
];

export const MASTER_WARDS = [
  { id: 'ward-1', nameEn: 'Ward 1 - Rajapeth' },
  { id: 'ward-2', nameEn: 'Ward 2 - Badnera' },
  { id: 'ward-3', nameEn: 'Ward 3 - Camp & Civil Lines' },
  { id: 'ward-4', nameEn: 'Ward 4 - Gadge Nagar' },
  { id: 'ward-5', nameEn: 'Ward 5 - Shivaji Nagar' },
  { id: 'ward-6', nameEn: 'Ward 6 - Dastur Nagar' },
  { id: 'ward-7', nameEn: 'Ward 7 - Ambadevi Ward' },
  { id: 'ward-8', nameEn: 'Ward 8 - Frezerpura' }
];

export const SEED_TASKS = [
  { id: 1, title: 'Sanitary inspection of Camp public market stalls', department: 'Health Department', priority: 'HIGH', status: 'In Progress', assignedOfficer: 'Suresh Kumar', dueDate: '2026-10-25', description: 'Inspect food stall cleanliness and solid waste segregation compliance.' },
  { id: 2, title: 'Vector-borne disease fogging drive in Ward 2', department: 'Health Department', priority: 'MEDIUM', status: 'Completed', assignedOfficer: 'Suresh Kumar', dueDate: '2026-10-20', description: 'Deploy mosquito control squad and distribute abate larvicide.' },
  { id: 3, title: 'Hospital biomedical waste disposal audit', department: 'Health Department', priority: 'MEDIUM', status: 'Assigned', assignedOfficer: 'Suresh Kumar', dueDate: '2026-10-28', description: 'Verify color-coded bin compliance and incinerator logs.' },
  { id: 4, title: 'Commercial property tax assessment audit Zone 4', department: 'Property Tax', priority: 'HIGH', status: 'Completed', assignedOfficer: 'Mohammed Akhtar', dueDate: '2026-10-19', description: 'Re-survey carpet area of newly opened commercial complexes.' },
  { id: 5, title: 'Issue notices for unpaid municipal tax arrears', department: 'Property Tax', priority: 'MEDIUM', status: 'Assigned', assignedOfficer: 'Mohammed Akhtar', dueDate: '2026-10-29', description: 'Dispatch demand notices to defaulters exceeding 3 quarters.' },
  { id: 6, title: 'Culvert repair and structural reinforcement at Rajapeth', department: 'PWD', priority: 'HIGH', status: 'Completed', assignedOfficer: 'Ramesh Patil', dueDate: '2026-10-18', description: 'Reinforce cracked retaining wall near railway underpass.' },
  { id: 7, title: 'Hawker zoning verification along Railway Station Road', department: 'Trade License', priority: 'LOW', status: 'In Progress', assignedOfficer: 'Sunita Patil', dueDate: '2026-10-26', description: 'Mark yellow line boundaries for registered vendors.' },
  { id: 8, title: 'Renewal verification of hotel & lodging trade permits', department: 'Trade License', priority: 'MEDIUM', status: 'Assigned', assignedOfficer: 'Sunita Patil', dueDate: '2026-10-30', description: 'Inspect fire NOC and sanitation certificates for FY 2026-27.' },
  { id: 9, title: 'Illegal banner and unauthorized hoarding penalty drive', department: 'Trade License', priority: 'LOW', status: 'Completed', assignedOfficer: 'Sunita Patil', dueDate: '2026-10-15', description: 'Seize unapproved flex banners from arterial junctions.' },
  { id: 10, title: 'Pressure gauge calibration at Maltekdi filtration plant', department: 'Water Supply', priority: 'MEDIUM', status: 'In Progress', assignedOfficer: 'Anjali Nair', dueDate: '2026-10-27', description: 'Calibrate digital pressure transmitters on main feeder line.' },
  { id: 11, title: 'Underground pipeline leakage pinpointing in Gadge Nagar', department: 'Water Supply', priority: 'LOW', status: 'Assigned', assignedOfficer: 'Anjali Nair', dueDate: '2026-10-31', description: 'Use acoustic leak detector to locate drop in pressure near lane 4.' }
];

export const SEED_OFFICERS = [
  { id: 1, name: 'Ramesh Patil', designation: 'Clerk', department: 'PWD', totalTasks: 1, assigned: 0, pending: 0, inProgress: 0, completed: 1, complianceRate: 100 },
  { id: 2, name: 'Suresh Kumar', designation: 'Junior Officer', department: 'Health Department', totalTasks: 3, assigned: 1, pending: 0, inProgress: 1, completed: 1, complianceRate: 85 },
  { id: 3, name: 'Anjali Nair', designation: 'Senior Officer', department: 'Water Supply', totalTasks: 2, assigned: 1, pending: 0, inProgress: 1, completed: 0, complianceRate: 92 },
  { id: 4, name: 'Mohammed Akhtar', designation: 'Senior Officer', department: 'Property Tax', totalTasks: 2, assigned: 1, pending: 0, inProgress: 0, completed: 1, complianceRate: 95 },
  { id: 5, name: 'Sunita Patil', designation: 'Senior Officer', department: 'Trade License', totalTasks: 3, assigned: 1, pending: 0, inProgress: 1, completed: 1, complianceRate: 88 }
];

export const SEED_MEETINGS = [
  {
    id: 1,
    title: 'Ward 3 Pothole & Road Escalation Review',
    department: 'Road Maintenance Department',
    type: 'Grievance Escalation',
    date: '2026-10-24',
    time: '11:00 AM - 12:30 PM',
    venue: 'AMC HQ, Conference Hall B / Video Conf',
    presidingOfficer: 'Er. Rajesh Bansod (Deputy City Engineer)',
    status: 'Upcoming',
    agenda: 'Review critical pending pothole complaints on Camp Main Road and sanction immediate asphalt patch work squads.',
    attendeesCount: 8
  },
  {
    id: 2,
    title: 'Monsoon Sewerage & Storm Drain Preparedness',
    department: 'Sewerage & Drainage Department',
    type: 'Review Meeting',
    date: '2026-10-18',
    time: '02:00 PM - 03:30 PM',
    venue: 'AMC Municipal Commissioner Chamber',
    presidingOfficer: 'Dr. V. S. Kale',
    status: 'Completed',
    agenda: 'De-silting status report of trunk sewer lines and replacement of broken manholes across Badnera and Rajapeth.',
    attendeesCount: 12
  },
  {
    id: 3,
    title: 'Public Hearing on Water Supply Pipeline Laying',
    department: 'Water Supply Department',
    type: 'Public Hearing',
    date: '2026-10-12',
    time: '10:00 AM - 01:00 PM',
    venue: 'Gadge Nagar Civic Center',
    presidingOfficer: 'Er. Nilesh Wankhede',
    status: 'Completed',
    agenda: 'Addressing citizen petitions regarding low water pressure in Ward 4 & 5 during morning peak hours.',
    attendeesCount: 25
  }
];

export const SEED_APPOINTMENTS = [
  {
    id: 1,
    appointmentNo: 'APT-2026-0001',
    citizenName: 'Adv. Prakash Deshmukh',
    mobile: '9822014589',
    department: 'Administration & Council Affairs',
    officer: 'Municipal Commissioner (Dr. Pravin Ashtikar)',
    date: '2026-10-18',
    timeSlot: '11:00 AM - 11:45 AM',
    purpose: 'Public Hearing on Development Plan (DP) road widening objections in Camp Zone',
    priority: 'HIGH',
    status: 'Completed',
    isToday: false,
    venue: 'AMC Commissioner Chamber, 2nd Floor',
    remarks: 'Hearing concluded. Joint site inspection order issued to City Engineer.'
  }
];

export const SEED_SCREENS = [
  { id: 1, code: 'SCR_CITIZEN', name: 'Citizen Public Portal', module: 'Citizen Desk', path: 'index.html', roles: { admin: true, hod: true, ward_officer: true, field_engineer: true, clerk: true } },
  { id: 2, code: 'SCR_COMPLAINTS', name: 'All Complaints Queue', module: 'Administration', path: 'admin.html#complaints', roles: { admin: true, hod: true, ward_officer: true, field_engineer: true, clerk: true } },
  { id: 3, code: 'SCR_WORKBENCH', name: 'Redressal Workbench & Stepper', module: 'Administration', path: 'admin.html#workbench', roles: { admin: true, hod: true, ward_officer: true, field_engineer: true, clerk: false } },
  { id: 4, code: 'SCR_TASKS', name: 'Task Management Hub', module: 'Operations', path: 'admin.html#tasks', roles: { admin: true, hod: true, ward_officer: true, field_engineer: false, clerk: false } },
  { id: 5, code: 'SCR_MEETINGS', name: 'Meeting Schedule & Events', module: 'Operations', path: 'admin.html#meetings', roles: { admin: true, hod: true, ward_officer: true, field_engineer: false, clerk: false } },
  { id: 6, code: 'SCR_DEPT_MASTER', name: 'Department Master', module: 'Master Config', path: 'admin.html#dept-master', roles: { admin: true, hod: false, ward_officer: false, field_engineer: false, clerk: false } },
  { id: 7, code: 'SCR_REPORTS', name: 'Reports & Escalation Dossier', module: 'Analytics', path: 'admin.html#reports', roles: { admin: true, hod: true, ward_officer: true, field_engineer: false, clerk: false } }
];

export const SEED_COMPLAINTS = [
  {
    id: 202,
    grievanceNo: 'GRV-2026-000202',
    trackingId: 'GRV-2026-000202',
    citizen: 'Anurag',
    mobile: '8459741554',
    department: 'Sewerage & Drainage Department',
    category: 'Waterlogging',
    location: 'Camp Main Road, Amravati',
    landmark: 'Near District Collector Office',
    status: 'Pending',
    priority: 'HIGH',
    submittedDate: '22 Oct 2026, 01:19 pm',
    slaRemaining: '46h remaining',
    assignedOfficer: 'Unassigned',
    isNew: true,
    images: {
      before: 'images/water-before.jpg',
      after: ''
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Anurag • 01:19 PM', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned • Awaiting Officer Assignment', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'There is severe waterlogging on the road, causing...', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Officer will share work details and photos.', status: 'pending', current: false }
    ]
  },
  {
    id: 175,
    grievanceNo: 'GRV-2026-000175',
    trackingId: 'GRV-2026-000175',
    citizen: 'Pooja Sharma',
    mobile: '9822334455',
    department: 'Road Maintenance Department',
    category: 'Potholes',
    location: 'Camp Main Road, Amravati',
    landmark: 'Opposite District Court Complex',
    status: 'Resolved',
    priority: 'HIGH',
    submittedDate: '17 Oct 2026, 02:33 pm',
    resolvedDate: '18 Oct 2026, 11:20 am',
    slaRemaining: 'Resolved within 24h SLA',
    assignedOfficer: 'Er. Amit V. Patil',
    officerRole: 'Junior Engineer (Civil & PWD)',
    officerPhone: '+91 94228 67123',
    officerEmail: 'amit.patil@amravatimc.gov.in',
    squad: 'Ward 1 Rapid Pothole Repair Squad',
    squadSize: '5 Field Technicians',
    machinery: 'Hot-mix Asphalt Compactor & Roller (AMC-R-04)',
    supervisor: 'Sunil More (Field Supervisor)',
    isNew: false,
    images: {
      before: 'images/pothole-before.jpg',
      after: 'images/pothole-after.jpg'
    },
    inspectionRemarks: 'Site inspection conducted by Er. Amit Patil. Asphalt leveling and sub-base compaction completed.',
    resolutionRemarks: 'Pothole filled and road leveled. Inspected and verified on site by Junior Engineer. Traffic restored.',
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Pooja Sharma • 02:33 PM', status: 'done', current: false },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Er. Amit V. Patil (JE, PWD) • Ward 1 Squad', status: 'done', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Site repaired with hot-mix asphalt compaction', status: 'done', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Verified & closed by Junior Engineer Amit Patil', status: 'done', current: true }
    ]
  },
  {
    id: 108,
    grievanceNo: 'GRV-2026-000108',
    trackingId: 'GRV-2026-000108',
    citizen: 'Rahul Deshmukh',
    mobile: '9763709303',
    department: 'Sewerage & Drainage Department',
    category: 'Sewer blockage',
    location: 'Gadge Nagar Main Road',
    landmark: 'Near Gadge Maharaj Mandir',
    status: 'In Progress',
    priority: 'CRITICAL',
    submittedDate: '21 Oct 2026, 12:51 pm',
    slaRemaining: '18h remaining',
    assignedOfficer: 'Sanjay Patil',
    officerRole: 'Senior Sanitary Inspector',
    officerPhone: '+91 98224 51098',
    officerEmail: 'sanjay.patil@amravatimc.gov.in',
    squad: 'Drainage Jetting Unit 2 (Super Sucker)',
    squadSize: '4 Crew Members',
    machinery: 'High-Pressure Sewer Jetting Machine (AMC-SJ-02)',
    supervisor: 'Ganesh Shinde (Sanitation Supervisor)',
    isNew: false,
    images: {
      before: 'images/sewer-before.jpg',
      after: ''
    },
    inspectionRemarks: 'Field squad on site. High-pressure jetting unit active in clearing deep chamber blockage.',
    resolutionRemarks: 'Awaiting final chamber flow verification upon clearance.',
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Rahul Deshmukh • 12:51 PM', status: 'done', current: false },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Assigned to Sanjay Patil • Drainage Unit', status: 'done', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'High-pressure jetting machine deployed on site', status: 'done', current: true },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Awaiting completion and photo validation', status: 'pending', current: false }
    ]
  },
  {
    id: 116,
    grievanceNo: 'GRV-2026-000116',
    trackingId: 'GRV-2026-000116',
    citizen: 'Kavita Joshi',
    mobile: '9890123456',
    department: 'Street Lighting Department',
    category: 'Light not working',
    location: 'Rajapeth Lane 4',
    landmark: 'Near Rajapeth Flyover Pillar 12',
    status: 'Resolved',
    priority: 'MEDIUM',
    submittedDate: '19 Oct 2026, 06:15 pm',
    resolvedDate: '20 Oct 2026, 11:30 am',
    slaRemaining: 'Resolved within 24h SLA',
    assignedOfficer: 'Suresh S. Kale',
    officerRole: 'Assistant Electrical Engineer',
    officerPhone: '+91 98901 23456',
    officerEmail: 'suresh.kale@amravatimc.gov.in',
    squad: 'Ward 1 Street Lighting Maintenance Unit',
    squadSize: '3 Electricians',
    machinery: 'Hydraulic Bucket Truck (AMC-BT-01)',
    supervisor: 'Prakash Rao (Line Inspector)',
    isNew: false,
    images: {
      before: 'images/light-before.jpg',
      after: 'images/light-after.jpg'
    },
    inspectionRemarks: 'LED driver and faulty fuse wire replaced on Pole #42.',
    resolutionRemarks: 'Street lamp restored and functioning. Verified by Electrical Wing.',
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Kavita Joshi • 06:15 PM', status: 'done', current: false },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Assigned to Suresh S. Kale (AEE, Electrical)', status: 'done', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Bucket truck deployed; faulty LED driver replaced', status: 'done', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Light verified operational at night inspection', status: 'done', current: true }
    ]
  },
  {
    id: 229,
    grievanceNo: 'GRV-2026-000193',
    trackingId: 'GRV-2026-000193',
    citizen: 'Tanvi',
    mobile: '9022615919',
    department: 'Sewerage & Drainage Department',
    category: 'Broken manhole',
    location: 'main road, Amravati',
    landmark: 'Near Central Bus Stand, Main Road',
    status: 'Pending',
    priority: 'HIGH',
    submittedDate: 'Oct 21, 2026',
    slaRemaining: '47h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500',
      after: 'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500'
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Tanvi • 03:03 PM', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned • Awaiting Officer Assignment', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending on-ground deployment', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Expected after field inspection', status: 'pending', current: false }
    ]
  },
  {
    id: 228,
    grievanceNo: 'GRV-2026-000192',
    trackingId: 'GRV-2026-000192',
    citizen: 'Arpita Lande',
    mobile: '7350795513',
    department: 'Road Maintenance Department',
    category: 'Potholes',
    location: '15538T1',
    landmark: 'Opposite State Bank, Station Road',
    status: 'Pending',
    priority: 'CRITICAL',
    submittedDate: 'Oct 21, 2026',
    slaRemaining: '46h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
      after: 'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500'
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Arpita Lande • 02:15 PM', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  },
  {
    id: 227,
    grievanceNo: 'GRV-2026-000191',
    trackingId: 'GRV-2026-000191',
    citizen: 'Prathmesh',
    mobile: '9763709303',
    department: 'Road Maintenance Department',
    category: 'Potholes',
    location: 'Amravati',
    landmark: 'Rahatgaon Road Corner',
    status: 'Pending',
    priority: 'HIGH',
    submittedDate: 'Oct 21, 2026',
    slaRemaining: '45h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1584463699047-9759d57a4103?w=500',
      after: null
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Prathmesh • 01:40 PM', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  },
  {
    id: 226,
    grievanceNo: 'GRV-2026-000190',
    trackingId: 'GRV-2026-000190',
    citizen: 'Tanvi',
    mobile: '9022615919',
    department: 'Sewerage & Drainage Department',
    category: 'Broken manhole',
    location: 'Khed, Pune District',
    landmark: 'Near Water Tank',
    status: 'Pending',
    priority: 'HIGH',
    submittedDate: 'Oct 19, 2026',
    slaRemaining: '32h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500',
      after: null
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Tanvi • Oct 19', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  },
  {
    id: 225,
    grievanceNo: 'GRV-2026-000189',
    trackingId: 'GRV-2026-000189',
    citizen: 'Tanvi',
    mobile: '9022615919',
    department: 'Road Maintenance Department',
    category: 'Surface damage',
    location: 'Cotton Green Colony No-01, Amravati',
    landmark: 'Plot 42, Cotton Green',
    status: 'Pending',
    priority: 'NORMAL',
    submittedDate: 'Oct 17, 2026',
    slaRemaining: '28h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
      after: null
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Tanvi • Oct 17', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  },
  {
    id: 224,
    grievanceNo: 'GRV-2026-000188',
    trackingId: 'GRV-2026-000188',
    citizen: 'Tanvi',
    mobile: '9022615919',
    department: 'Traffic Engineering Department',
    category: 'Congestion',
    location: 'Main Road, Amravati',
    landmark: 'Near Rajapeth Flyover',
    status: 'Pending',
    priority: 'HIGH',
    submittedDate: 'Oct 17, 2026',
    slaRemaining: '24h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500',
      after: null
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Tanvi • Oct 17', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  },
  {
    id: 223,
    grievanceNo: 'GRV-2026-000187',
    trackingId: 'GRV-2026-000187',
    citizen: 'Tanvi',
    mobile: '9022615919',
    department: 'Solid Waste Management Department',
    category: 'Waste burning',
    location: 'Cotton Green Colony No-01, Amravati',
    landmark: 'Behind Community Center',
    status: 'Pending',
    priority: 'CRITICAL',
    submittedDate: 'Oct 17, 2026',
    slaRemaining: '20h remaining',
    assignedOfficer: 'Unassigned',
    isNew: false,
    images: {
      before: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500',
      after: null
    },
    timeline: [
      { step: 1, title: '1. Grievance Submitted', subtitle: 'Tanvi • Oct 17', status: 'done', current: true },
      { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned', status: 'pending', current: false },
      { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending', status: 'pending', current: false },
      { step: 4, title: '4. Resolved & Closed', subtitle: 'Pending', status: 'pending', current: false }
    ]
  }
];

export function showToast(message, type = 'info') {
  let shelf = document.getElementById('toast-shelf') || document.getElementById('toast-container');
  if (!shelf) {
    shelf = document.createElement('div');
    shelf.id = 'toast-shelf';
    document.body.appendChild(shelf);
  }
  const pill = document.createElement('div');
  pill.className = `toast-pill ${type}`;
  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  pill.innerHTML = `
    <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:${type === 'success' ? '#059669' : (type === 'error' ? '#dc2626' : '#2563eb')}; color:#fff; font-size:12px; font-weight:800;">${icon}</span>
    <span style="color:#0f172a; font-weight:600;">${message}</span>
  `;
  shelf.appendChild(pill);
  requestAnimationFrame(() => pill.classList.add('show'));
  setTimeout(() => {
    pill.classList.remove('show');
    setTimeout(() => pill.remove(), 350);
  }, 3500);
}

export const Store = {
  init() {
    try {
      const existing = localStorage.getItem(COMPLAINTS_KEY);
      if (!existing) {
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
      } else {
        let parsed = JSON.parse(existing);
        if (!Array.isArray(parsed)) parsed = [];
        let updated = false;

        // Ensure key showcase complaints are in store with realistic officer flows and images
        SEED_COMPLAINTS.slice(0, 4).forEach(sc => {
          const idx = parsed.findIndex(c => c.grievanceNo === sc.grievanceNo);
          if (idx === -1) {
            parsed.unshift(sc);
            updated = true;
          } else {
            parsed[idx] = {
              ...parsed[idx],
              status: sc.status,
              assignedOfficer: sc.assignedOfficer,
              officerRole: sc.officerRole,
              officerPhone: sc.officerPhone,
              officerEmail: sc.officerEmail,
              squad: sc.squad,
              squadSize: sc.squadSize,
              machinery: sc.machinery,
              supervisor: sc.supervisor,
              images: sc.images,
              inspectionRemarks: sc.inspectionRemarks,
              resolutionRemarks: sc.resolutionRemarks
            };
            updated = true;
          }
        });

        if (updated) {
          localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(parsed));
        }
      }
      if (!localStorage.getItem(DEPTS_KEY)) {
        localStorage.setItem(DEPTS_KEY, JSON.stringify(SEED_DEPARTMENTS));
      }
      if (!localStorage.getItem(TASKS_KEY)) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
      }
      if (!localStorage.getItem(MEETINGS_KEY)) {
        localStorage.setItem(MEETINGS_KEY, JSON.stringify(SEED_MEETINGS));
      }
      if (!localStorage.getItem(SCREENS_KEY)) {
        localStorage.setItem(SCREENS_KEY, JSON.stringify(SEED_SCREENS));
      }
    } catch (e) {
      console.warn('Storage initialization fallback', e);
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
      localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(SEED_MEETINGS));
      localStorage.setItem(SCREENS_KEY, JSON.stringify(SEED_SCREENS));
    }
  },

  getAll() {
    return this.getComplaints();
  },

  getComplaints() {
    this.init();
    try {
      const data = localStorage.getItem(COMPLAINTS_KEY);
      return data ? JSON.parse(data) : SEED_COMPLAINTS;
    } catch (e) {
      return SEED_COMPLAINTS;
    }
  },

  getDepartments() {
    this.init();
    try {
      const data = localStorage.getItem(DEPTS_KEY);
      return data ? JSON.parse(data) : SEED_DEPARTMENTS;
    } catch (e) {
      return SEED_DEPARTMENTS;
    }
  },

  saveComplaint(payload) {
    const all = this.getComplaints();
    const nextId = all.length > 0 ? Math.max(...all.map(c => Number(c.id) || 200)) + 1 : 230;
    const seqStr = String(nextId).padStart(6, '0');
    const grievanceNo = `GRV-2026-${seqStr}`;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    const newGrievance = {
      id: nextId,
      grievanceNo: grievanceNo,
      trackingId: grievanceNo,
      citizen: payload.citizen || 'Anurag',
      mobile: payload.mobile || '8459741554',
      department: payload.department || 'Road Maintenance Department',
      category: payload.category || 'Potholes',
      location: payload.location || 'Camp Main Road, Amravati',
      landmark: payload.location || 'Camp Main Road',
      status: 'Pending',
      priority: 'HIGH',
      submittedDate: formattedDate,
      slaRemaining: '48h remaining',
      assignedOfficer: 'Unassigned',
      isNew: true,
      images: {
        before: payload.photo || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
        after: null
      },
      timeline: [
        { step: 1, title: '1. Grievance Submitted', subtitle: `${payload.citizen || 'Citizen'} • ${formattedTime}`, status: 'done', current: true },
        { step: 2, title: '2. Field Unit Assigned', subtitle: 'Unassigned • Awaiting Officer Assignment', status: 'pending', current: false },
        { step: 3, title: '3. Under Review & Inspection', subtitle: 'Pending on-ground deployment', status: 'pending', current: false },
        { step: 4, title: '4. Resolved & Closed', subtitle: 'Expected after field inspection', status: 'pending', current: false }
      ]
    };

    all.unshift(newGrievance);
    this.commitComplaints(all);
    return newGrievance;
  },

  commitComplaints(list) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_STORE_UPDATED', { detail: list }));
    window.dispatchEvent(new CustomEvent('AMC_STORE_CHANGED', { detail: list }));
  },

  commitDepartments(list) {
    localStorage.setItem(DEPTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_DEPTS_UPDATED', { detail: list }));
  },

  assignOfficer(id, officerName, targetDept) {
    const list = this.getComplaints();
    const item = list.find(c => String(c.id) === String(id) || c.grievanceNo === id);
    if (!item) return null;

    item.assignedOfficer = officerName;
    if (targetDept) item.department = targetDept;
    item.status = 'In Progress';
    item.timeline[1] = { step: 2, title: '2. Field Unit Assigned', subtitle: `${officerName} • Assigned`, status: 'done', current: false };
    item.timeline[2] = { step: 3, title: '3. Under Review & Inspection', subtitle: 'Active field investigation', status: 'done', current: true };

    this.commitComplaints(list);
    return item;
  },

  updateComplaintStatus(id, newStatus, remarks) {
    const list = this.getComplaints();
    const item = list.find(c => String(c.id) === String(id) || c.grievanceNo === id);
    if (!item) return null;

    item.status = newStatus;
    if (newStatus === 'Resolved') {
      item.slaRemaining = 'Resolved';
      item.timeline[3] = { step: 4, title: '4. Resolved & Closed', subtitle: remarks || 'Resolved & verified', status: 'done', current: true };
    }
    this.commitComplaints(list);
    return item;
  },

  addDepartment(dept) {
    const list = this.getDepartments();
    const newDept = {
      id: list.length + 1,
      code: dept.code || 'DEPT',
      nameEn: dept.nameEn,
      nameMr: dept.nameMr || dept.nameEn,
      hod: dept.hod || 'Unassigned',
      slaHours: Number(dept.slaHours) || 24,
      status: 'Active',
      complaintsCount: 0
    };
    list.push(newDept);
    this.commitDepartments(list);
    return newDept;
  },

  toggleDeptStatus(id) {
    const list = this.getDepartments();
    const dept = list.find(d => Number(d.id) === Number(id));
    if (dept) {
      dept.status = dept.status === 'Active' ? 'Inactive' : 'Active';
      this.commitDepartments(list);
    }
  },

  deleteDepartment(id) {
    const list = this.getDepartments().filter(d => Number(d.id) !== Number(id));
    this.commitDepartments(list);
  },

  // Citizen authentication
  getCitizenUser() {
    this.init();
    try {
      const data = localStorage.getItem(CITIZEN_AUTH_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_CITIZEN_USER;
  },

  setCitizenUser(user) {
    localStorage.setItem(CITIZEN_AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('NTIS_CITIZEN_AUTH_CHANGED', { detail: user }));
    return user;
  },

  loginCitizen(name, phone) {
    const user = {
      name: name && name.trim() ? name.trim() : 'Citizen',
      phone: phone && phone.trim() ? phone.trim() : '8459741554',
      ward: 'Ward 1',
      verified: true,
      loggedIn: true
    };
    return this.setCitizenUser(user);
  },

  logoutCitizen() {
    const guest = {
      name: 'Guest Citizen',
      phone: '',
      ward: 'Unregistered',
      verified: false,
      loggedIn: false
    };
    return this.setCitizenUser(guest);
  },

  // Admin authentication & user profile
  isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  },

  getAdminUser() {
    this.init();
    try {
      const data = localStorage.getItem(ADMIN_USER_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_ADMIN_USER;
  },

  setAdminUser(user) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('NTIS_ADMIN_AUTH_CHANGED', { detail: user }));
    return user;
  },

  loginAdmin(username, password, officerName = null) {
    if (username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      const current = this.getAdminUser();
      const updatedUser = {
        ...current,
        name: officerName && officerName.trim() ? officerName.trim() : current.name
      };
      this.setAdminUser(updatedUser);
      return { success: true, user: updatedUser };
    }
    return { success: false, message: 'Invalid credentials. Enter admin and User@123' };
  },

  logoutAdmin() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    window.dispatchEvent(new CustomEvent('NTIS_ADMIN_AUTH_CHANGED', { detail: { loggedIn: false } }));
  },

  getStats() {
    const complaints = this.getComplaints();
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    return { total, pending, inProgress, resolved };
  },

  getLang() {
    return localStorage.getItem('NTIS_LANG') || 'en';
  },

  setLang(lang) {
    localStorage.setItem('NTIS_LANG', lang);
    window.dispatchEvent(new CustomEvent('NTIS_LANG_CHANGED', { detail: lang }));
  },

  // Tasks Management
  getTasks() {
    this.init();
    try {
      const data = localStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : SEED_TASKS;
    } catch (e) {
      return SEED_TASKS;
    }
  },

  commitTasks(list) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_TASKS_UPDATED', { detail: list }));
  },

  createTask(payload) {
    const list = this.getTasks();
    const newTask = {
      id: list.length > 0 ? Math.max(...list.map(t => Number(t.id) || 0)) + 1 : 1,
      title: payload.title || 'General Civic Task',
      department: payload.department || 'Health Department',
      priority: payload.priority || 'MEDIUM',
      status: 'Assigned',
      assignedOfficer: payload.assignedOfficer || 'Suresh Kumar',
      dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
      description: payload.description || 'Assigned via municipal dispatch'
    };
    list.unshift(newTask);
    this.commitTasks(list);
    return newTask;
  },

  updateTaskStatus(id, newStatus) {
    const list = this.getTasks();
    const task = list.find(t => Number(t.id) === Number(id));
    if (task) {
      task.status = newStatus;
      this.commitTasks(list);
    }
    return task;
  },

  getOfficerAnalytics() {
    this.init();
    const tasks = this.getTasks();
    const officers = SEED_OFFICERS.map(officer => {
      const officerTasks = tasks.filter(t => t.assignedOfficer.toLowerCase().includes(officer.name.toLowerCase()));
      const assigned = officerTasks.filter(t => t.status === 'Assigned').length;
      const inProgress = officerTasks.filter(t => t.status === 'In Progress').length;
      const completed = officerTasks.filter(t => t.status === 'Completed').length;
      const total = officerTasks.length;
      const compliance = total > 0 ? Math.round(((completed + inProgress * 0.5) / total) * 100) : officer.complianceRate;
      return {
        ...officer,
        totalTasks: total || officer.totalTasks,
        assigned: assigned,
        inProgress: inProgress,
        completed: completed,
        complianceRate: compliance
      };
    });
    return officers;
  },

  // Meetings & Events
  getMeetings() {
    this.init();
    try {
      const data = localStorage.getItem(MEETINGS_KEY);
      return data ? JSON.parse(data) : SEED_MEETINGS;
    } catch (e) {
      return SEED_MEETINGS;
    }
  },

  commitMeetings(list) {
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_MEETINGS_UPDATED', { detail: list }));
  },

  scheduleMeeting(payload) {
    const list = this.getMeetings();
    const newMeeting = {
      id: list.length > 0 ? Math.max(...list.map(m => Number(m.id) || 0)) + 1 : 1,
      title: payload.title || 'Municipal Review Session',
      department: payload.department || 'Road Maintenance Department',
      type: payload.type || 'Review Meeting',
      date: payload.date || new Date().toISOString().split('T')[0],
      time: payload.time || '11:00 AM - 12:30 PM',
      venue: payload.venue || 'AMC HQ, Conference Hall B',
      presidingOfficer: payload.presidingOfficer || 'Er. Rajesh Bansod (Deputy City Engineer)',
      status: 'Upcoming',
      agenda: payload.agenda || 'Review pending administrative grievances and departmental operations.',
      attendeesCount: Number(payload.attendeesCount) || 8
    };
    list.unshift(newMeeting);
    this.commitMeetings(list);
    return newMeeting;
  },

  cancelMeeting(id) {
    const list = this.getMeetings();
    const m = list.find(item => Number(item.id) === Number(id));
    if (m) {
      m.status = 'Cancelled';
      this.commitMeetings(list);
    }
    return m;
  },

  // Screen Access Master
  getScreens() {
    this.init();
    try {
      const data = localStorage.getItem(SCREENS_KEY);
      return data ? JSON.parse(data) : SEED_SCREENS;
    } catch (e) {
      return SEED_SCREENS;
    }
  },

  commitScreens(list) {
    localStorage.setItem(SCREENS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_SCREENS_UPDATED', { detail: list }));
  },

  toggleScreenPermission(screenId, role) {
    const list = this.getScreens();
    const screen = list.find(s => Number(s.id) === Number(screenId));
    if (screen && screen.roles) {
      screen.roles[role] = !screen.roles[role];
      this.commitScreens(list);
    }
    return screen;
  },

  // Appointments Management
  getAppointments() {
    this.init();
    try {
      const data = localStorage.getItem(APPOINTMENTS_KEY);
      return data ? JSON.parse(data) : SEED_APPOINTMENTS;
    } catch (e) {
      return SEED_APPOINTMENTS;
    }
  },

  commitAppointments(list) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('NTIS_APPOINTMENTS_UPDATED', { detail: list }));
  },

  createAppointment(payload) {
    const list = this.getAppointments();
    const nextId = list.length > 0 ? Math.max(...list.map(a => Number(a.id) || 0)) + 1 : 1;
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = payload.date === todayStr;

    const newAppt = {
      id: nextId,
      appointmentNo: `APT-2026-${String(nextId).padStart(4, '0')}`,
      citizenName: payload.citizenName || 'Citizen Applicant',
      mobile: payload.mobile || '9822000000',
      department: payload.department || 'Administration & Council Affairs',
      officer: payload.officer || 'Municipal Commissioner',
      date: payload.date || todayStr,
      timeSlot: payload.timeSlot || '11:00 AM - 11:30 AM',
      purpose: payload.purpose || 'Civic hearing and consultation',
      priority: payload.priority || 'MEDIUM',
      status: payload.status || 'Pending',
      isToday: isToday,
      venue: payload.venue || 'AMC HQ, Administrative Chambers',
      remarks: payload.remarks || 'Registered via municipal desk'
    };

    list.unshift(newAppt);
    this.commitAppointments(list);
    return newAppt;
  },

  updateAppointmentStatus(id, newStatus, remarks = '') {
    const list = this.getAppointments();
    const appt = list.find(a => Number(a.id) === Number(id) || a.appointmentNo === id);
    if (appt) {
      appt.status = newStatus;
      if (remarks) appt.remarks = remarks;
      this.commitAppointments(list);
    }
    return appt;
  },

  resetDemo() {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
    localStorage.setItem(DEPTS_KEY, JSON.stringify(SEED_DEPARTMENTS));
    localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(SEED_MEETINGS));
    localStorage.setItem(SCREENS_KEY, JSON.stringify(SEED_SCREENS));
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(SEED_APPOINTMENTS));
    window.dispatchEvent(new CustomEvent('NTIS_STORE_UPDATED', { detail: SEED_COMPLAINTS }));
    window.dispatchEvent(new CustomEvent('AMC_STORE_CHANGED', { detail: SEED_COMPLAINTS }));
    window.dispatchEvent(new CustomEvent('NTIS_TASKS_UPDATED', { detail: SEED_TASKS }));
    window.dispatchEvent(new CustomEvent('NTIS_MEETINGS_UPDATED', { detail: SEED_MEETINGS }));
    window.dispatchEvent(new CustomEvent('NTIS_SCREENS_UPDATED', { detail: SEED_SCREENS }));
    window.dispatchEvent(new CustomEvent('NTIS_APPOINTMENTS_UPDATED', { detail: SEED_APPOINTMENTS }));
  },

  resetDemoData() {
    this.resetDemo();
  },

  resetToDefaults() {
    this.resetDemo();
  }
};

// Aliases for compatibility
export const SharedStore = Store;
export const AppStore = Store;
