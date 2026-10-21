/**
 * ============================================================================
 * NTIS Civic Grievance Redressal System - Trilingual Engine (EN / MR / HI)
 * Normalizes all Devanagari strings with Unicode NFC
 * ============================================================================
 */

export const DICTIONARY = {
  en: {
    // Header
    corpTitle: 'Amravati Municipal Corporation',
    corpSubtitle: 'Public Grievance Redressal Department',
    home: 'Home',
    citizenPortal: 'Citizen Portal',
    officerDesk: 'Officer Desk',
    officerRole: 'OFFICER',
    officerName: 'Rajesh Patil (Ward Officer - Zone 3)',
    
    // Sidebar
    snapReport: 'Snap & Report',
    snapReportSub: 'Report Grievance',
    navigation: 'NAVIGATION',
    citizenGroup: 'CITIZEN SERVICES',
    adminGroup: 'ADMINISTRATION',
    dashboard: 'Dashboard',
    liveTracker: 'Grievance Tracker',
    master: 'Master',
    deptMaster: 'Department Master',
    allComplaints: 'All Complaints',
    workbench: 'Workbench',
    activeBadge: 'Active',
    resetDemo: 'Reset Demo Data',

    // Workbench
    ticketHeader: 'Ticket Dossier',
    copyTicketId: 'Copy ID',
    slaRemaining: 'SLA: 18h remaining',
    critical: 'CRITICAL',
    high: 'HIGH',
    normal: 'NORMAL',
    submitted: 'Submitted',
    verifiedAssigned: 'Verified & Assigned',
    inProgress: 'In Progress / On Ground',
    resolvedClosed: 'Resolved & Closed',
    evidenceComparison: 'Evidence Comparison',
    before: 'Before',
    after: 'After (Resolved)',
    inspectEvidence: 'Inspect Evidence',
    reassignDept: 'Reassign Department',
    updateStatus: 'Update Status',
    forwardEE: 'Forward to Executive Engineer',
    markResolved: 'Mark as Resolved',

    // All Complaints Table
    complaintsQueue: 'Citizen Grievances & Complaints',
    complaintsSub: 'Manage, track and filter all registered civic grievances across departments',
    searchPlaceholder: 'Search by Grievance No, Citizen or Phone...',
    allDepartments: 'All Departments',
    allStatuses: 'All Statuses',
    colId: 'Grievance ID',
    colCitizen: 'Citizen Details',
    colCategory: 'Category / Department',
    colWard: 'Ward / Zone',
    colDate: 'Lodged Date',
    colSla: 'SLA Status',
    colStage: 'Workflow Stage',
    colActions: 'Actions',

    // Department Master
    deptMasterTitle: 'Department Master',
    deptMasterSub: 'Configure and manage municipal departments, categories, and grievance types',
    addDepartment: '+ Add Department',
    totalDepts: 'Total Departments',
    activeDepts: 'Active Departments',
    inactiveDepts: 'Inactive Departments',
    grievancesManaged: 'Grievances Managed',
    deptNameEn: 'Department Name (English)',
    deptNameMr: 'Department Name (Marathi)',
    hod: 'Head of Department (HOD)',
    escalationSla: 'Escalation SLA (Hours)',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    saveDept: 'Save Department',
    cancel: 'Cancel',

    // Citizen Portal
    kpiTotal: 'TOTAL COMPLAINTS',
    kpiPending: 'PENDING',
    kpiProgress: 'IN PROGRESS',
    kpiResolved: 'RESOLVED',
    myTickets: 'My Tickets',
    newComplaint: '+ New',
    potholes: 'Potholes',
    brokenManhole: 'Broken manhole',
    sewerBlockage: 'Sewer blockage',
    lightNotWorking: 'Street light not working'
  },

  mr: {
    // Header
    corpTitle: 'अमरावती महानगरपालिका',
    corpSubtitle: 'नागरी तक्रार निवारण विभाग',
    home: 'मुख्यपृष्ठ',
    citizenPortal: 'नागरिक पोर्टल',
    officerDesk: 'अधिकारी कक्ष',
    officerRole: 'अधिकारी',
    officerName: 'राजेश पाटील (प्रभाग अधिकारी - झोन ३)',

    // Sidebar
    snapReport: 'तक्रार नोंदवा',
    snapReportSub: 'फोटो काढून तक्रार करा',
    navigation: 'नेव्हिगेशन',
    citizenGroup: 'नागरी सेवा',
    adminGroup: 'प्रशासन',
    dashboard: 'डॅशबोर्ड',
    liveTracker: 'तक्रार ट्रॅकर',
    master: 'मास्टर्स',
    deptMaster: 'विभाग मास्टर',
    allComplaints: 'सर्व तक्रारी',
    workbench: 'कार्यमंच (वर्कबेंच)',
    activeBadge: 'सक्रिय',
    resetDemo: 'डेमो डेटा रीसेट करा',

    // Workbench
    ticketHeader: 'तक्रार माहिती व कृती',
    copyTicketId: 'क्रमांक कॉपी करा',
    slaRemaining: 'SLA: १८ तास शिल्लक',
    critical: 'अतितातडीचे',
    high: 'तातडीचे',
    normal: 'सामान्य',
    submitted: 'नोंदणीकृत',
    verifiedAssigned: 'पडताळणी व वाटप',
    inProgress: 'प्रगतीपथावर',
    resolvedClosed: 'निकाली काढले',
    evidenceComparison: 'पुरावा पडताळणी',
    before: 'कामापूर्वी',
    after: 'कामानंतर (निवारण)',
    inspectEvidence: 'पुरावा पहा',
    reassignDept: 'विभाग बदला',
    updateStatus: 'स्थिती अद्ययावत करा',
    forwardEE: 'कार्यकारी अभियंत्याकडे पाठवा',
    markResolved: 'निवारण पूर्ण घोषित करा',

    // All Complaints Table
    complaintsQueue: 'नागरी तक्रारी व अर्ज',
    complaintsSub: 'सर्व विभागांमधील नोंदणीकृत नागरी तक्रारींचे व्यवस्थापन व निवारण',
    searchPlaceholder: 'तक्रार क्रमांक, नागरिक किंवा मोबाईल शोधा...',
    allDepartments: 'सर्व विभाग',
    allStatuses: 'सर्व स्थिती',
    colId: 'तक्रार क्रमांक',
    colCitizen: 'नागरिक माहिती',
    colCategory: 'प्रवर्ग / विभाग',
    colWard: 'प्रभाग / झोन',
    colDate: 'नोंदणी तारीख',
    colSla: 'SLA स्थिती',
    colStage: 'प्रक्रिया टप्पा',
    colActions: 'कृती',

    // Department Master
    deptMasterTitle: 'विभाग मास्टर व्यवस्थापन',
    deptMasterSub: 'महापालिका विभाग, प्रवर्ग आणि तक्रार प्रकारांची रचना करा',
    addDepartment: '+ नवीन विभाग जोडा',
    totalDepts: 'एकूण विभाग',
    activeDepts: 'सक्रिय विभाग',
    inactiveDepts: 'निष्क्रिय विभाग',
    grievancesManaged: 'हाताळलेल्या तक्रारी',
    deptNameEn: 'विभागाचे नाव (इंग्रजी)',
    deptNameMr: 'विभागाचे नाव (मराठी)',
    hod: 'विभाग प्रमुख (HOD)',
    escalationSla: 'निवारण SLA (तास)',
    status: 'स्थिती',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    saveDept: 'विभाग जतन करा',
    cancel: 'रद्द करा',

    // Citizen Portal
    kpiTotal: 'एकूण तक्रारी',
    kpiPending: 'प्रलंबित',
    kpiProgress: 'प्रगतीपथावर',
    kpiResolved: 'निवारण झालेल्या',
    myTickets: 'माझ्या तक्रारी',
    newComplaint: '+ नवीन तक्रार',
    potholes: 'रस्त्यावरील खड्डे',
    brokenManhole: 'तुटलेले मॅनहोल झाकण',
    sewerBlockage: 'गटार तुंबणे',
    lightNotWorking: 'पथदिवे बंद असणे'
  },

  hi: {
    // Header
    corpTitle: 'अमरावती नगर निगम',
    corpSubtitle: 'नागरिक शिकायत निवारण विभाग',
    home: 'होम',
    citizenPortal: 'नागरिक पोर्टल',
    officerDesk: 'अधिकारी डेस्क',
    officerRole: 'अधिकारी',
    officerName: 'राजेश पाटिल (वार्ड अधिकारी - जोन ३)',

    // Sidebar
    snapReport: 'शिकायत दर्ज करें',
    snapReportSub: 'फोटो खींचकर रिपोर्ट करें',
    navigation: 'नेविगेशन',
    citizenGroup: 'नागरिक सेवाएं',
    adminGroup: 'प्रशासन',
    dashboard: 'डैशबोर्ड',
    liveTracker: 'शिकायत ट्रैकर',
    master: 'मास्टर्स',
    deptMaster: 'विभाग मास्टर',
    allComplaints: 'सभी शिकायतें',
    workbench: 'वर्कबेंच',
    activeBadge: 'सक्रिय',
    resetDemo: 'डेमो डेटा रीसेट करें',

    // Workbench
    ticketHeader: 'शिकायत विवरण',
    copyTicketId: 'आईडी कॉपी करें',
    slaRemaining: 'SLA: १८ घंटे शेष',
    critical: 'अति आवश्यक',
    high: 'उच्च प्राथमिकता',
    normal: 'सामान्य',
    submitted: 'दर्ज की गई',
    verifiedAssigned: 'सत्यापित व आवंटित',
    inProgress: 'प्रगति पर',
    resolvedClosed: 'निस्तारित व बंद',
    evidenceComparison: 'साक्ष्य तुलना',
    before: 'पहले',
    after: 'बाद में (समाधान)',
    inspectEvidence: 'साक्ष्य देखें',
    reassignDept: 'विभाग पुनः आवंटित करें',
    updateStatus: 'स्थिति अपडेट करें',
    forwardEE: 'अधिशासी अभियंता को भेजें',
    markResolved: 'समाधान पूर्ण घोषित करें',

    // All Complaints Table
    complaintsQueue: 'नागरिक शिकायतें एवं मामले',
    complaintsSub: 'सभी विभागों में पंजीकृत नागरिक शिकायतों का प्रबंधन और ट्रैकिंग',
    searchPlaceholder: 'शिकायत संख्या, नागरिक या मोबाइल खोजें...',
    allDepartments: 'सभी विभाग',
    allStatuses: 'सभी स्थितियां',
    colId: 'शिकायत आईडी',
    colCitizen: 'नागरिक विवरण',
    colCategory: 'श्रेणी / विभाग',
    colWard: 'वार्ड / जोन',
    colDate: 'दर्ज करने की तिथि',
    colSla: 'SLA स्थिति',
    colStage: 'प्रक्रिया चरण',
    colActions: 'कार्रवाई',

    // Department Master
    deptMasterTitle: 'विभाग मास्टर',
    deptMasterSub: 'नगर निगम विभागों, श्रेणियों और शिकायत प्रकारों का प्रबंधन',
    addDepartment: '+ नया विभाग जोड़ें',
    totalDepts: 'कुल विभाग',
    activeDepts: 'सक्रिय विभाग',
    inactiveDepts: 'निष्क्रिय विभाग',
    grievancesManaged: 'प्रबंधित शिकायतें',
    deptNameEn: 'विभाग का नाम (अंग्रेजी)',
    deptNameMr: 'विभाग का नाम (मराठी/हिंदी)',
    hod: 'विभागाध्यक्ष (HOD)',
    escalationSla: 'निवारण समय SLA (घंटे)',
    status: 'स्थिति',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    saveDept: 'विभाग सुरक्षित करें',
    cancel: 'रद्द करें',

    // Citizen Portal
    kpiTotal: 'कुल शिकायतें',
    kpiPending: 'लंबित',
    kpiProgress: 'प्रगति पर',
    kpiResolved: 'निस्तारित',
    myTickets: 'मेरी शिकायतें',
    newComplaint: '+ नई शिकायत',
    potholes: 'सड़क पर गड्ढे',
    brokenManhole: 'मैनहोल ढक्कन टूटा होना',
    sewerBlockage: 'सीवर जाम होना',
    lightNotWorking: 'स्ट्रीट लाइट बंद होना'
  }
};

export const I18n = {
  currentLang: 'en',

  init() {
    this.currentLang = localStorage.getItem('NTIS_LANG') || 'en';
    this.applyTranslations();
  },

  setLanguage(lang) {
    if (!DICTIONARY[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('NTIS_LANG', lang);
    this.applyTranslations();
    window.dispatchEvent(new CustomEvent('NTIS_LANG_CHANGED', { detail: lang }));
  },

  t(key) {
    const dict = DICTIONARY[this.currentLang] || DICTIONARY.en;
    const val = dict[key] || DICTIONARY.en[key] || key;
    return val.normalize ? val.normalize('NFC') : val;
  },

  applyTranslations() {
    document.documentElement.lang = this.currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', this.t(key));
    });

    // Update active state on trilingual toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', lang === this.currentLang);
    });
  }
};

export const t = (key) => I18n.t(key);
export const applyTranslations = () => I18n.applyTranslations();

