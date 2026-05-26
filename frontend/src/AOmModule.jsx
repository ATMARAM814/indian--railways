import { useState } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  BarChart3,
  Building2,
  BusFront,
  ClipboardCheck,
  Cog,
  FileCheck,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  ShieldCheck,
  Star,
  UserCheck,
  UserRoundSearch,
  Users
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const stationProgressData = [
  { station: "Nagpur", completed: 450, pending: 100 },
  { station: "Wardha", completed: 490, pending: 130 },
  { station: "Badnera", completed: 530, pending: 160 },
  { station: "Akola", completed: 570, pending: 190 },
  { station: "Yavatmal", completed: 610, pending: 220 },
  { station: "Parbhani", completed: 640, pending: 250 },
  { station: "Parli Vaijnath", completed: 680, pending: 95 },
  { station: "Latur", completed: 710, pending: 130 },
  { station: "Vikarabad", completed: 750, pending: 160 },
  { station: "Aurangabad", completed: 790, pending: 190 },
  { station: "Pundlik", completed: 830, pending: 210 },
  { station: "Jalna", completed: 860, pending: 240 },
  { station: "Partur", completed: 440, pending: 90 },
  { station: "Mudkhed", completed: 480, pending: 120 },
  { station: "Visapur", completed: 510, pending: 150 }
];

const categoryData = [
  { name: "Grade A", value: 14.6, color: "#57b35a" },
  { name: "Grade B", value: 37.5, color: "#3f9be6" },
  { name: "Grade C", value: 36.5, color: "#f5a623" },
  { name: "Grade D", value: 11.5, color: "#e55a54" }
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Building2, label: "Station Management" },
  { icon: ClipboardCheck, label: "Traffic Inspector" },
  { icon: FileCheck, label: "Assessments" },
  { icon: BarChart3, label: "Reports" },
  { icon: Users, label: "User Management" },
  { icon: Users, label: "Station Masters" },
  { icon: Cog, label: "Settings" },
  { icon: UserRoundSearch, label: "Profile" }
];

const summaryCards = [
  {
    icon: Users,
    iconClass: "icon-slate",
    trend: "+2.4%",
    value: "14,280",
    title: "TOTAL EMPLOYEES",
    subtitle: "Active Staff Count"
  },
  {
    icon: UserCheck,
    iconClass: "icon-green",
    trend: "+1.5%",
    value: "12,104",
    title: "EVALUATIONS COMPLETED",
    subtitle: "85% Global Rate"
  },
  {
    icon: AlertCircle,
    iconClass: "icon-orange",
    trend: "Attention",
    value: "482",
    title: "PENDING APPROVALS",
    subtitle: "Requires resolution",
    trendAlert: true
  },
  {
    icon: Star,
    iconClass: "icon-blue",
    value: "78.5",
    title: "AVERAGE SCORE",
    subtitle: "B-Grade Average"
  },
  {
    icon: ShieldCheck,
    iconClass: "icon-green",
    value: "99.2%",
    title: "SAFETY COMPLIANCE",
    subtitle: "Divisional Audit",
    status: "Standard Met"
  }
];

const designationOptions = ["Pointsman", "Station Master", "Train Manager", "Station Supervisor", "Traffic Inspector"];
const departmentOptions = ["Operations", "Administration", "Finance", "HR", "IT"];
const userTypeOptions = ["AOM", "Manager", "Employee", "Viewer"];
const reportingOfficerOptions = ["R. Kumar", "S. Deshmukh", "P. Nair", "M. Verma", "A. Singh"];

const aomReadOnlyProfile = {
  designation: "AOM / General",
  zoneHq: "Zonal Headquarters",
  division: "Central Division",
  reportingOfficer: "Super Admin - SA_1001",
  contact: "+91 99880 11223",
  email: "aom.console@rail.in"
};

const initialUserFormData = {
  employeeName: "",
  hrmsId: "",
  mobileNo: "",
  designation: "",
  department: "",
  userType: "",
  reportingOfficer: ""
};

const initialFilterData = {
  mobileNo: "",
  designation: "",
  hrmsId: "",
  department: "",
  userType: ""
};

const stationZoneOptions = ["Central Railway", "Western Railway", "Northern Railway", "Southern Railway", "Eastern Railway"];
const stationDivisionOptions = ["Nagpur", "Pune", "Mumbai", "Delhi", "Chennai"];
const stationCategoryOptions = ["A", "B", "C", "D", "Halt"];
const stationTypeOptions = ["Junction", "Terminal", "Halt"];

const initialStationFormData = {
  stationName: "",
  stationCode: "",
  zone: "",
  division: "",
  category: "",
  stationType: "",
  platforms: "",
  tracks: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  stationMasterName: "",
  contactNumber: "",
  emailId: "",
  latitude: "",
  longitude: "",
  status: "Active"
};

const initialStationFilterData = {
  zone: "",
  division: "",
  category: "",
  status: ""
};

const initialStations = [
  {
    id: 1,
    stationName: "Nagpur Junction",
    stationCode: "NGP",
    zone: "Central Railway",
    division: "Nagpur",
    category: "A",
    platforms: 8,
    tracks: 14,
    stationType: "Junction",
    status: "Active",
    createdBy: "SA_1001",
    address: "Station Road, Sitabuldi",
    city: "Nagpur",
    state: "Maharashtra",
    pincode: "440001",
    stationMasterName: "A. Patil",
    contactNumber: "9890011122",
    emailId: "ngp.station@rail.in",
    latitude: "21.1458",
    longitude: "79.0882"
  },
  {
    id: 2,
    stationName: "Pune Junction",
    stationCode: "PUNE",
    zone: "Central Railway",
    division: "Pune",
    category: "A",
    platforms: 6,
    tracks: 12,
    stationType: "Junction",
    status: "Active",
    createdBy: "SA_1001",
    address: "Railway Station Rd, Agarkar Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    stationMasterName: "R. Jadhav",
    contactNumber: "9880012233",
    emailId: "pune.station@rail.in",
    latitude: "18.5284",
    longitude: "73.8742"
  },
  {
    id: 3,
    stationName: "New Delhi",
    stationCode: "NDLS",
    zone: "Northern Railway",
    division: "Delhi",
    category: "A",
    platforms: 16,
    tracks: 24,
    stationType: "Terminal",
    status: "Active",
    createdBy: "SA_1001",
    address: "Bhavbhuti Marg, Ajmeri Gate",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110006",
    stationMasterName: "M. Sharma",
    contactNumber: "9870014455",
    emailId: "ndls.station@rail.in",
    latitude: "28.6436",
    longitude: "77.2194"
  }
];

const tiCategoryOptions = ["Senior TI", "TI", "Assistant TI"];
const tiAssessmentStatusOptions = ["Completed", "In Progress", "Pending", "Overdue"];

const initialTrafficInspectors = [
  {
    id: 1,
    name: "A. Kulkarni",
    employeeId: "TI2101",
    jurisdiction: "Nagpur",
    category: "Senior TI",
    assessmentStatus: "Completed",
    linkedStations: ["Nagpur Junction"],
    linkedSms: ["A. Patil"],
    division: "Nagpur",
    phone: "9890017788",
    email: "akulkarni@rail.in"
  },
  {
    id: 2,
    name: "R. Khan",
    employeeId: "TI2102",
    jurisdiction: "Pune",
    category: "TI",
    assessmentStatus: "In Progress",
    linkedStations: ["Pune Junction"],
    linkedSms: ["R. Jadhav"],
    division: "Pune",
    phone: "9890029911",
    email: "rkhan@rail.in"
  }
];

const hrmsTiDirectory = [
  {
    hrmsId: "TI3201",
    name: "S. Verma",
    jurisdiction: "Delhi",
    category: "TI",
    assessmentStatus: "Pending",
    division: "Delhi",
    phone: "9873312211",
    email: "sverma@rail.in"
  },
  {
    hrmsId: "TI3202",
    name: "M. Das",
    jurisdiction: "Nagpur",
    category: "Assistant TI",
    assessmentStatus: "In Progress",
    division: "Nagpur",
    phone: "9890016644",
    email: "mdas@rail.in"
  }
];

const initialTiFormData = {
  name: "",
  employeeId: "",
  jurisdiction: "",
  category: "",
  assessmentStatus: "Pending"
};

const stationAverageScoreData = [
  { station: "Nagpur", avgScore: 86 },
  { station: "Pune", avgScore: 89 },
  { station: "Delhi", avgScore: 84 },
  { station: "Mumbai", avgScore: 88 },
  { station: "Jalna", avgScore: 91 },
  { station: "Parbhani", avgScore: 82 }
];

const initialPendingAssessments = [
  {
    id: "SM_1001",
    title: "Station Master - SM_1001",
    statusLabel: "Pending Approval",
    assessedByLine: "Assessed by: TI/SS - on 2026-04-15",
    employeeLine: "Employee: R. Jadhav | Division: Pune",
    actionType: "approval"
  },
  {
    id: "TM_1001",
    title: "Train Manager - TM_1001",
    statusLabel: "Pending Approval",
    assessedByLine: "Assessed by: TI/SS - on 2026-04-14",
    employeeLine: "Employee: V. Singh | Division: Mumbai",
    actionType: "approval"
  },
  {
    id: "TI_1001",
    title: "Traffic Inspector - TI_1001",
    statusLabel: "Pending Approval",
    assessedByLine: "Assessed by: AOM/G - on 2026-04-13",
    employeeLine: "Employee: A. Kulkarni | Division: Nagpur",
    actionType: "approval"
  },
  {
    id: "SS_1001",
    title: "Station Supervisor - SS_1001",
    statusLabel: "Pending Assessment",
    assessedByLine: "Awaiting: Your Assessment - on 2026-04-12",
    employeeLine: "Employee: P. Verma | Division: Delhi",
    actionType: "assessment"
  }
];

const initialApprovedAssessments = [
  {
    id: "SM_1002",
    title: "Station Master - SM_1002",
    detail: "Approved by: AOM/G - on 2026-04-09",
    score: "Score: 92/100 - Grade: A"
  },
  {
    id: "TM_1002",
    title: "Train Manager - TM_1002",
    detail: "Approved by: AOM/G - on 2026-04-08",
    score: "Score: 88/100 - Grade: B"
  },
  {
    id: "TI_1002",
    title: "Traffic Inspector - TI_1002",
    detail: "Approved by: AOM/G - on 2026-04-07",
    score: "Score: 85/100 - Grade: B"
  }
];

const initialReportRows = [
  {
    id: "PM_1001",
    hrmsId: "PM_1001",
    name: "K. Pawar",
    designation: "Pointsman",
    assessmentStatus: "Approved",
    score: "85",
    grade: "B",
    lastAssessed: "2026-04-10"
  },
  {
    id: "SM_1001",
    hrmsId: "SM_1001",
    name: "R. Jadhav",
    designation: "Station Master",
    assessmentStatus: "Approved",
    score: "92",
    grade: "A",
    lastAssessed: "2026-04-09"
  },
  {
    id: "TM_1001",
    hrmsId: "TM_1001",
    name: "V. Singh",
    designation: "Train Manager",
    assessmentStatus: "Approved",
    score: "88",
    grade: "B",
    lastAssessed: "2026-04-08"
  },
  {
    id: "TI_1001",
    hrmsId: "TI_1001",
    name: "A. Kulkarni",
    designation: "Traffic Inspector",
    assessmentStatus: "Approved",
    score: "85",
    grade: "B",
    lastAssessed: "2026-04-07"
  },
  {
    id: "SS_1001",
    hrmsId: "SS_1001",
    name: "P. Verma",
    designation: "Station Supervisor",
    assessmentStatus: "Pending",
    score: "-",
    grade: "-",
    lastAssessed: "-"
  },
  {
    id: "SM_1002",
    hrmsId: "SM_1002",
    name: "M. Sharma",
    designation: "Station Master",
    assessmentStatus: "Approved",
    score: "90",
    grade: "A",
    lastAssessed: "2026-04-06"
  }
];

const assessmentCriteria = [
  { key: "knowledgeOfRules", label: "Knowledge of Rules", marks: 25 },
  { key: "alertnessAndObservation", label: "Alertness and observation of rules", marks: 25 },
  { key: "safetyRecord", label: "Safety Record", marks: 15 },
  { key: "leadershipAndManagement", label: "Leadership and Management", marks: 15 },
  { key: "discipline", label: "Discipline", marks: 10 },
  { key: "appearanceAndNeatness", label: "Appearance & neatness", marks: 10 }
];

function AOmModule({ user, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("FY 2025-26 - Q3");
  const [searchStations, setSearchStations] = useState("");
  const [userFormData, setUserFormData] = useState(initialUserFormData);
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [pendingFilters, setPendingFilters] = useState(initialFilterData);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterData);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stations, setStations] = useState(initialStations);
  const [stationFormData, setStationFormData] = useState(initialStationFormData);
  const [stationFormErrors, setStationFormErrors] = useState({});
  const [pendingStationFilters, setPendingStationFilters] = useState(initialStationFilterData);
  const [appliedStationFilters, setAppliedStationFilters] = useState(initialStationFilterData);
  const [stationSearch, setStationSearch] = useState("");
  const [stationMasterSearch, setStationMasterSearch] = useState("");
  const [stationCurrentPage, setStationCurrentPage] = useState(1);

  // States for Pointsman Under Station Master Page
  const [selectedSMForPointsmen, setSelectedSMForPointsmen] = useState(null);
  const [selectedPointsmanForMonitoring, setSelectedPointsmanForMonitoring] = useState(null);
  const [pointsmanSearchText, setPointsmanSearchText] = useState("");
  const [pointsmanRiskFilter, setPointsmanRiskFilter] = useState("All");
  const [pointsmanStatusFilter, setPointsmanStatusFilter] = useState("All");

  const aomPointsmenSeed = [
    { id: 1, hrmsId: "PM_1001", name: "Ravi Kumar", gender: "Male", age: 38, doj: "2012-04-10", basePay: "₹28,500", lastScore: 92, safetyScore: 95, totalAssessments: 12, pmeStatus: "Fit", refStatus: "Cleared", disciplinary: "None", incidents: 0, approvalStatus: "Approved", monitoringStatus: "Active", stationCode: "NGP", stationName: "Nagpur Junction" },
    { id: 2, hrmsId: "PM_1102", name: "Sanjay Patil", gender: "Male", age: 34, doj: "2015-08-22", basePay: "₹26,200", lastScore: 78, safetyScore: 80, totalAssessments: 9, pmeStatus: "Fit", refStatus: "Cleared", disciplinary: "None", incidents: 0, approvalStatus: "Pending", monitoringStatus: "On Duty", stationCode: "NGP", stationName: "Nagpur Junction" },
    { id: 3, hrmsId: "PM_1103", name: "Deepak Nair", gender: "Male", age: 41, doj: "2009-11-05", basePay: "₹31,000", lastScore: 48, safetyScore: 62, totalAssessments: 15, pmeStatus: "Fit", refStatus: "Pending", disciplinary: "Warning", incidents: 1, approvalStatus: "Approved", monitoringStatus: "Off Duty", stationCode: "PUNE", stationName: "Pune Junction" },
    { id: 4, hrmsId: "PM_1104", name: "Ajay Sharma", gender: "Male", age: 29, doj: "2019-02-18", basePay: "₹23,400", lastScore: 84, safetyScore: 88, totalAssessments: 6, pmeStatus: "Fit", refStatus: "Cleared", disciplinary: "None", incidents: 0, approvalStatus: "Pending", monitoringStatus: "Active", stationCode: "PUNE", stationName: "Pune Junction" },
    { id: 5, hrmsId: "PM_1105", name: "Kunal Verma", gender: "Male", age: 36, doj: "2013-07-30", basePay: "₹27,800", lastScore: 35, safetyScore: 55, totalAssessments: 11, pmeStatus: "Unfit", refStatus: "Pending", disciplinary: "Warning", incidents: 2, approvalStatus: "Rejected", monitoringStatus: "Absent", stationCode: "NGP", stationName: "Nagpur Junction" },
    { id: 6, hrmsId: "PM_1106", name: "Priya Menon", gender: "Female", age: 31, doj: "2018-03-14", basePay: "₹25,100", lastScore: 67, safetyScore: 74, totalAssessments: 7, pmeStatus: "Fit", refStatus: "Cleared", disciplinary: "None", incidents: 0, approvalStatus: "Approved", monitoringStatus: "On Duty", stationCode: "NDLS", stationName: "New Delhi" },
    { id: 7, hrmsId: "PM_1107", name: "Ramesh Yadav", gender: "Male", age: 45, doj: "2005-09-01", basePay: "₹34,600", lastScore: 82, safetyScore: 90, totalAssessments: 18, pmeStatus: "Fit", refStatus: "Cleared", disciplinary: "None", incidents: 0, approvalStatus: "Approved", monitoringStatus: "Off Duty", stationCode: "NDLS", stationName: "New Delhi" },
    { id: 8, hrmsId: "PM_1108", name: "Sneha Iyer", gender: "Female", age: 28, doj: "2020-01-20", basePay: "₹22,000", lastScore: 19, safetyScore: 40, totalAssessments: 3, pmeStatus: "Unfit", refStatus: "Pending", disciplinary: "Serious", incidents: 3, approvalStatus: "Rejected", monitoringStatus: "Absent", stationCode: "NDLS", stationName: "New Delhi" }
  ];

  const [aomPointsmen, setAomPointsmen] = useState(aomPointsmenSeed);

  const getPmCat = (score) => {
    if (score >= 80) return "A";
    if (score >= 50) return "B";
    if (score >= 26) return "C";
    return "D";
  };

  const getPmRisk = (pm) => {
    if (pm.safetyScore < 60 || pm.lastScore < 50) return "High";
    if (pm.safetyScore < 75 || pm.lastScore < 65) return "Medium";
    return "Low";
  };

  const handleStationMasterClick = (sm) => {
    setSelectedSMForPointsmen(sm);
    setSelectedPointsmanForMonitoring(null);
    setPointsmanSearchText("");
    setPointsmanRiskFilter("All");
    setPointsmanStatusFilter("All");
    setActivePage("Pointsman Under Station Master");
  };

    const stationMastersDirectory = stations
      .filter((station) => Boolean(station.stationMasterName && station.stationMasterName.trim()))
      .map((station) => ({
        id: `${station.stationCode}-${station.stationMasterName}`,
        name: station.stationMasterName,
        stationName: station.stationName,
        stationCode: station.stationCode,
        division: station.division,
        zone: station.zone,
        category: station.category,
        contactNumber: station.contactNumber || "-",
        emailId: station.emailId || "-"
      }));
  
    const filteredStationMasters = stationMastersDirectory.filter((row) => {
      const q = stationMasterSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.stationName.toLowerCase().includes(q) ||
        row.stationCode.toLowerCase().includes(q) ||
        row.division.toLowerCase().includes(q)
      );
    });
  const [stationDetailId, setStationDetailId] = useState(null);
  const [isStationEditMode, setIsStationEditMode] = useState(false);
  const [tiSearch, setTiSearch] = useState("");
  const [trafficInspectors, setTrafficInspectors] = useState(initialTrafficInspectors);
  const [tiFormData, setTiFormData] = useState(initialTiFormData);
  const [tiFormErrors, setTiFormErrors] = useState({});
  const [tiAddMode, setTiAddMode] = useState("form");
  const [tiHrmsSearch, setTiHrmsSearch] = useState("");
  const [tiNotice, setTiNotice] = useState("");
  const [selectedTiId, setSelectedTiId] = useState(null);
  const [tiLinkTargetId, setTiLinkTargetId] = useState(null);
  const [tiLinkDraft, setTiLinkDraft] = useState({ stations: [], sms: [] });
  const [tiShiftDrafts, setTiShiftDrafts] = useState({});
  const [pendingAssessments, setPendingAssessments] = useState(initialPendingAssessments);
  const [approvedAssessments, setApprovedAssessments] = useState(initialApprovedAssessments);
  const [reportRows, setReportRows] = useState(initialReportRows);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [reportDesignation, setReportDesignation] = useState("All Designations");
  const [assessmentActionNotice, setAssessmentActionNotice] = useState("");
  const [assessmentRoleTab, setAssessmentRoleTab] = useState("SM");
  const [openAssessmentId, setOpenAssessmentId] = useState(null);
  const [answersByAssessment, setAnswersByAssessment] = useState({});
  const [expandedCriterionKey, setExpandedCriterionKey] = useState({});
  const [aomSettings, setAomSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    weeklyDigest: true,
    autoEscalation: true,
    reportVisibility: "All",
    defaultAssessmentTab: "SM"
  });
  const [settingsNotice, setSettingsNotice] = useState("");

  const pageSize = 8;
  const stationPageSize = 8;

  const todayIso = () => new Date().toISOString().slice(0, 10);

  const extractDesignation = (title) => title.split(" - ")[0] || "Employee";

  const resolveAssessmentTab = (title) => {
    const designation = extractDesignation(title);
    if (designation === "Station Master") return "SM";
    if (designation === "Train Manager") return "TM";
    return "TI";
  };

  const renderCategoryBadge = (category) => {
    const value = String(category || "").trim().toUpperCase();
    const isRank = ["A", "B", "C", "D"].includes(value);

    if (isRank) {
      return <span className={`category-circle category-${value.toLowerCase()}`}>{value}</span>;
    }

    return <span className="category-text-chip">{value || "-"}</span>;
  };

  const buildPrefilledAnswers = (title) => {
    const tab = resolveAssessmentTab(title);
    if (tab === "SM" || tab === "TM") {
      return {
        knowledgeOfRules: "yes",
        alertnessAndObservation: "yes",
        safetyRecord: "no",
        leadershipAndManagement: "yes",
        discipline: "yes",
        appearanceAndNeatness: "yes"
      };
    }

    return {
      knowledgeOfRules: "no",
      alertnessAndObservation: "no",
      safetyRecord: "no",
      leadershipAndManagement: "no",
      discipline: "no",
      appearanceAndNeatness: "no"
    };
  };

  const calculateAssessmentScore = (answers = {}) =>
    assessmentCriteria.reduce((total, criterion) => {
      return total + (answers[criterion.key] === "yes" ? criterion.marks : 0);
    }, 0);

  const countAnsweredCriteria = (answers = {}) =>
    assessmentCriteria.reduce((count, criterion) => {
      const value = answers[criterion.key];
      return count + (value === "yes" || value === "no" ? 1 : 0);
    }, 0);

  const computeScoreAndGrade = (target) => {
    const effectiveAnswers = answersByAssessment[target.id] || buildPrefilledAnswers(target.title);
    const score = calculateAssessmentScore(effectiveAnswers);
    const grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
    return { score, grade };
  };

  const buildAssessmentTableMeta = (item, approved = false) => {
    const designation = extractDesignation(item.title);
    const hrmsId = item.id || item.title.split(" - ")[1] || "-";
    const nameMatch = item.employeeLine?.match(/Employee:\s*([^|]+)/i);
    const employeeName = nameMatch ? nameMatch[1].trim() : "-";
    const dateLine = item.assessedByLine || item.detail || "";
    const dateMatch = dateLine.match(/(\d{4}-\d{2}-\d{2})/);
    const lastAssessed = dateMatch ? dateMatch[1] : "-";

    if (approved) {
      const scoreMatch = (item.score || "").match(/Score:\s*(\d+)\/100\s*-\s*Grade:\s*([A-D])/i);
      return {
        hrmsId,
        employeeName,
        designation,
        status: "Approved",
        score: scoreMatch ? scoreMatch[1] : "-",
        grade: scoreMatch ? scoreMatch[2].toUpperCase() : "-",
        lastAssessed
      };
    }

    const { score, grade } = computeScoreAndGrade(item);
    return {
      hrmsId,
      employeeName,
      designation,
      status: item.statusLabel || "Pending",
      score,
      grade,
      lastAssessed
    };
  };

  const handleViewAssessmentDetails = (title, detailLine, statusLabel) => {
    setAssessmentActionNotice(`Opened details for ${title}`);
    window.alert(`${title}\n${detailLine}\nStatus: ${statusLabel}`);
  };

  const handleApproveAssessment = (id) => {
    const target = pendingAssessments.find((item) => item.id === id);
    if (!target) {
      return;
    }

    const { score: computedScore, grade } = computeScoreAndGrade(target);

    setPendingAssessments((prev) => prev.filter((item) => item.id !== id));
    setApprovedAssessments((prev) => [
      {
        id: target.id,
        title: target.title,
        detail: `Approved by: AOM/G - on ${todayIso()}`,
        score: `Score: ${computedScore}/100 - Grade: ${grade}`
      },
      ...prev
    ]);
    setReportRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              assessmentStatus: "Approved",
              score: String(computedScore),
              grade,
              lastAssessed: todayIso()
            }
          : row
      )
    );
    setAssessmentActionNotice(`${target.title} approved successfully.`);
    setOpenAssessmentId((prev) => (prev === id ? null : prev));
  };

  const handleRejectAssessment = (id) => {
    const target = pendingAssessments.find((item) => item.id === id);
    setPendingAssessments((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      setAssessmentActionNotice(`${target.title} rejected.`);
    }
    setOpenAssessmentId((prev) => (prev === id ? null : prev));
  };

  const handleStartAssessment = (id) => {
    setPendingAssessments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statusLabel: "Pending Approval",
              assessedByLine: `Assessed by: AOM/G - on ${todayIso()}`,
              actionType: "approval"
            }
          : item
      )
    );
    setReportRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              assessmentStatus: "In Progress",
              lastAssessed: todayIso()
            }
          : row
      )
    );
    setAssessmentActionNotice(`Assessment started for ${id}.`);
  };

  const handleOpenAssessmentForm = (item) => {
    const tab = resolveAssessmentTab(item.title);
    setAssessmentRoleTab(tab);
    setOpenAssessmentId(item.id);
    setAnswersByAssessment((prev) => {
      if (prev[item.id]) {
        return prev;
      }
      return {
        ...prev,
        [item.id]: buildPrefilledAnswers(item.title)
      };
    });
  };

  const handleAnswerChange = (assessmentId, criterionKey, value) => {
    setAnswersByAssessment((prev) => ({
      ...prev,
      [assessmentId]: {
        ...(prev[assessmentId] || {}),
        [criterionKey]: value
      }
    }));
  };

  const handleSelectAllYes = (assessmentIds, roleTab) => {
    if (!assessmentIds || assessmentIds.length === 0) {
      setAssessmentActionNotice("No employees available in the selected option.");
      return;
    }

    const allYes = assessmentCriteria.reduce((acc, criterion) => {
      acc[criterion.key] = "yes";
      return acc;
    }, {});

    setAnswersByAssessment((prev) => {
      const next = { ...prev };
      assessmentIds.forEach((assessmentId) => {
        next[assessmentId] = { ...allYes };
      });
      return next;
    });

    setAssessmentActionNotice(`All answers marked Yes for ${assessmentIds.length} employee(s) in ${roleTab} option.`);
  };

  const handleApproveAllInSelectedOption = () => {
    const targets = pendingAssessments.filter((item) => resolveAssessmentTab(item.title) === assessmentRoleTab);
    if (targets.length === 0) {
      setAssessmentActionNotice("No employees to approve in the selected option.");
      return;
    }

    const approvedDate = todayIso();
    const approvedBatch = targets.map((target) => {
      const { score, grade } = computeScoreAndGrade(target);
      return {
        id: target.id,
        title: target.title,
        employeeLine: target.employeeLine,
        detail: `Approved by: AOM/G - on ${approvedDate}`,
        score: `Score: ${score}/100 - Grade: ${grade}`
      };
    });

    const updatesById = approvedBatch.reduce((acc, item) => {
      const scoreMatch = (item.score || "").match(/Score:\s*(\d+)\/100\s*-\s*Grade:\s*([A-D])/i);
      acc[item.id] = {
        score: scoreMatch ? scoreMatch[1] : "-",
        grade: scoreMatch ? scoreMatch[2].toUpperCase() : "-",
        lastAssessed: approvedDate
      };
      return acc;
    }, {});

    setPendingAssessments((prev) => prev.filter((item) => resolveAssessmentTab(item.title) !== assessmentRoleTab));
    setApprovedAssessments((prev) => [...approvedBatch, ...prev]);
    setReportRows((prev) =>
      prev.map((row) => {
        const updated = updatesById[row.id];
        if (!updated) {
          return row;
        }

        return {
          ...row,
          assessmentStatus: "Approved",
          score: updated.score,
          grade: updated.grade,
          lastAssessed: updated.lastAssessed
        };
      })
    );

    setOpenAssessmentId((prev) => (targets.some((item) => item.id === prev) ? null : prev));
    setAssessmentActionNotice(`Approved all ${targets.length} employee(s) in ${assessmentRoleTab} option.`);
  };

  const toggleCriterion = (assessmentId, criterionKey) => {
    setExpandedCriterionKey((prev) => {
      const mapKey = `${assessmentId}:${criterionKey}`;
      return {
        ...prev,
        [mapKey]: !prev[mapKey]
      };
    });
  };

  const handleViewReport = (row) => {
    window.alert(
      `${row.designation} - ${row.hrmsId}\nEmployee: ${row.name}\nStatus: ${row.assessmentStatus}\nScore: ${row.score}\nGrade: ${row.grade}\nLast Assessed: ${row.lastAssessed}`
    );
  };

  const handleAssessReport = (id) => {
    setReportRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              assessmentStatus: "In Progress",
              lastAssessed: todayIso()
            }
          : row
      )
    );
    setAssessmentActionNotice(`Assessment opened for ${id}.`);
  };

  const handleSettingsToggle = (key) => {
    setAomSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSettingsSelect = (key, value) => {
    setAomSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setAssessmentRoleTab(aomSettings.defaultAssessmentTab);
    setSettingsNotice("Settings saved successfully.");
  };

  const filteredReportRows = reportRows.filter((row) => {
    const searchText = reportSearchQuery.trim().toLowerCase();
    const matchesSearch =
      searchText.length === 0 ||
      row.hrmsId.toLowerCase().includes(searchText) ||
      row.name.toLowerCase().includes(searchText);
    const matchesDesignation = reportDesignation === "All Designations" || row.designation === reportDesignation;
    return matchesSearch && matchesDesignation;
  });

  const handleSidebarClick = (label) => {
    setActivePage(label);

    if (label !== "Add Station") {
      setStationFormErrors({});
    }

    if (label === "Add Station") {
      setStationFormData(initialStationFormData);
      setStationFormErrors({});
      setStationDetailId(null);
      setIsStationEditMode(false);
    }
  };

  const handleStationSubPage = (label) => {
    setActivePage(label);

    if (label === "Add Station") {
      setStationFormData(initialStationFormData);
      setStationFormErrors({});
      setStationDetailId(null);
      setIsStationEditMode(false);
    }
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUserForm = () => {
    const errors = {};
    if (!userFormData.employeeName.trim()) errors.employeeName = "Employee Name is required";
    if (!userFormData.hrmsId.trim()) errors.hrmsId = "HRMS ID is required";
    if (!userFormData.mobileNo.trim()) errors.mobileNo = "Mobile No is required";
    if (!userFormData.designation.trim()) errors.designation = "Designation is required";
    if (!userFormData.department.trim()) errors.department = "Department is required";
    if (!userFormData.userType.trim()) errors.userType = "User Type is required";
    if (!userFormData.reportingOfficer.trim()) errors.reportingOfficer = "Reporting Officer is required";
    return errors;
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const errors = validateUserForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((row) =>
          row.id === editingUserId
            ? {
                ...row,
                ...userFormData
              }
            : row
        )
      );
      setEditingUserId(null);
    } else {
      setUsers((prev) => [
        ...prev,
        {
          ...userFormData,
          id: Date.now(),
          marks: 0
        }
      ]);
    }

    setUserFormData(initialUserFormData);
    setFormErrors({});
  };

  const handleEditUser = (id) => {
    const existing = users.find((row) => row.id === id);
    if (!existing) {
      return;
    }

    setUserFormData({
      employeeName: existing.employeeName,
      hrmsId: existing.hrmsId,
      mobileNo: existing.mobileNo,
      designation: existing.designation,
      department: existing.department,
      userType: existing.userType,
      reportingOfficer: existing.reportingOfficer
    });
    setEditingUserId(id);
    setFormErrors({});
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((row) => row.id !== id));
    if (editingUserId === id) {
      setEditingUserId(null);
      setUserFormData(initialUserFormData);
      setFormErrors({});
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setAppliedFilters(pendingFilters);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((row) => {
    const normalizedSearch = tableSearch.trim().toLowerCase();
    const matchSearch =
      normalizedSearch.length === 0 ||
      row.employeeName.toLowerCase().includes(normalizedSearch) ||
      row.hrmsId.toLowerCase().includes(normalizedSearch) ||
      row.mobileNo.toLowerCase().includes(normalizedSearch);

    const matchFilters =
      (appliedFilters.mobileNo === "" || row.mobileNo.includes(appliedFilters.mobileNo)) &&
      (appliedFilters.designation === "" || row.designation === appliedFilters.designation) &&
      (appliedFilters.hrmsId === "" || row.hrmsId.toLowerCase().includes(appliedFilters.hrmsId.toLowerCase())) &&
      (appliedFilters.department === "" || row.department === appliedFilters.department) &&
      (appliedFilters.userType === "" || row.userType === appliedFilters.userType);

    return matchSearch && matchFilters;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleStationFormChange = (e) => {
    const { name, value } = e.target;
    setStationFormData((prev) => ({
      ...prev,
      [name]: name === "stationCode" ? value.toUpperCase() : value
    }));

    if (stationFormErrors[name]) {
      setStationFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleStationStatusToggle = () => {
    setStationFormData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active"
    }));
  };

  const validateStationForm = (formMode) => {
    const errors = {};
    const codeExists = stations.some(
      (station) => station.stationCode === stationFormData.stationCode.trim().toUpperCase() && station.id !== stationDetailId
    );

    if (!stationFormData.stationName.trim()) errors.stationName = "Station Name is required";
    if (!stationFormData.stationCode.trim()) errors.stationCode = "Station Code is required";
    if (codeExists) errors.stationCode = "Station Code must be unique";
    if (!stationFormData.zone) errors.zone = "Zone is required";
    if (!stationFormData.division) errors.division = "Division is required";
    if (!stationFormData.category) errors.category = "Station Category is required";
    if (!stationFormData.stationType) errors.stationType = "Station Type is required";
    if (!stationFormData.platforms) errors.platforms = "Platforms count is required";
    if (!stationFormData.tracks) errors.tracks = "Tracks count is required";
    if (!stationFormData.address.trim()) errors.address = "Address is required";
    if (!stationFormData.city.trim()) errors.city = "City is required";
    if (!stationFormData.state.trim()) errors.state = "State is required";
    if (!stationFormData.pincode.trim()) errors.pincode = "Pincode is required";
    if (!stationFormData.contactNumber.trim()) errors.contactNumber = "Contact Number is required";
    if (!stationFormData.emailId.trim()) errors.emailId = "Email ID is required";
    if (!stationFormData.latitude.trim()) errors.latitude = "Latitude is required";
    if (!stationFormData.longitude.trim()) errors.longitude = "Longitude is required";

    return errors;
  };

  const handleAddStationSubmit = (e) => {
    e.preventDefault();
    const errors = validateStationForm("create");

    if (Object.keys(errors).length > 0) {
      setStationFormErrors(errors);
      return;
    }

    setStations((prev) => [
      ...prev,
      {
        ...stationFormData,
        id: Date.now(),
        stationCode: stationFormData.stationCode.trim().toUpperCase(),
        platforms: Number(stationFormData.platforms),
        tracks: Number(stationFormData.tracks),
        createdBy: user.hrmsId
      }
    ]);

    setStationFormData(initialStationFormData);
    setStationFormErrors({});
    setActivePage("Station Management");
  };

  const handleResetStationForm = () => {
    setStationFormData(initialStationFormData);
    setStationFormErrors({});
  };

  const handleStationFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingStationFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyStationFilter = (e) => {
    e.preventDefault();
    setAppliedStationFilters(pendingStationFilters);
    setStationCurrentPage(1);
  };

  const filteredStations = stations.filter((station) => {
    const normalizedSearch = stationSearch.trim().toLowerCase();
    const matchSearch =
      normalizedSearch.length === 0 ||
      station.stationName.toLowerCase().includes(normalizedSearch) ||
      station.stationCode.toLowerCase().includes(normalizedSearch);

    const matchFilters =
      (appliedStationFilters.zone === "" || station.zone === appliedStationFilters.zone) &&
      (appliedStationFilters.division === "" || station.division === appliedStationFilters.division) &&
      (appliedStationFilters.category === "" || station.category === appliedStationFilters.category) &&
      (appliedStationFilters.status === "" || station.status === appliedStationFilters.status);

    return matchSearch && matchFilters;
  });

  const stationTotalPages = Math.max(1, Math.ceil(filteredStations.length / stationPageSize));
  const pagedStations = filteredStations.slice(
    (stationCurrentPage - 1) * stationPageSize,
    stationCurrentPage * stationPageSize
  );

  const goToPrevStationPage = () => {
    setStationCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextStationPage = () => {
    setStationCurrentPage((prev) => Math.min(stationTotalPages, prev + 1));
  };

  const openStationView = (stationId, editable = false) => {
    const target = stations.find((station) => station.id === stationId);
    if (!target) {
      return;
    }

    setStationDetailId(stationId);
    setStationFormData({
      ...target,
      platforms: String(target.platforms),
      tracks: String(target.tracks)
    });
    setStationFormErrors({});
    setIsStationEditMode(editable);
    setActivePage("View / Edit Station");
  };

  const handleUpdateStation = (e) => {
    e.preventDefault();

    const errors = validateStationForm("update");
    if (Object.keys(errors).length > 0) {
      setStationFormErrors(errors);
      return;
    }

    setStations((prev) =>
      prev.map((station) =>
        station.id === stationDetailId
          ? {
              ...station,
              ...stationFormData,
              stationCode: stationFormData.stationCode.trim().toUpperCase(),
              platforms: Number(stationFormData.platforms),
              tracks: Number(stationFormData.tracks)
            }
          : station
      )
    );

    setIsStationEditMode(false);
    setStationFormErrors({});
  };

  const handleDeleteStation = (stationId) => {
    setStations((prev) => prev.filter((station) => station.id !== stationId));
    if (stationDetailId === stationId) {
      setActivePage("Station Management");
      setStationDetailId(null);
      setIsStationEditMode(false);
    }
  };

  const handleTiFormChange = (e) => {
    const { name, value } = e.target;
    setTiFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (tiFormErrors[name]) {
      setTiFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateTiForm = () => {
    const errors = {};
    if (!tiFormData.name.trim()) errors.name = "Name is required";
    if (!tiFormData.employeeId.trim()) errors.employeeId = "Employee ID is required";
    if (!tiFormData.jurisdiction.trim()) errors.jurisdiction = "Jurisdiction is required";
    if (!tiFormData.category.trim()) errors.category = "Category is required";

    const duplicate = trafficInspectors.some(
      (row) => row.employeeId.toLowerCase() === tiFormData.employeeId.trim().toLowerCase()
    );
    if (duplicate) errors.employeeId = "Employee ID already exists";

    return errors;
  };

  const handleAddTiByForm = (e) => {
    e.preventDefault();
    const errors = validateTiForm();

    if (Object.keys(errors).length > 0) {
      setTiFormErrors(errors);
      return;
    }

    setTrafficInspectors((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...tiFormData,
        employeeId: tiFormData.employeeId.trim().toUpperCase(),
        division: tiFormData.jurisdiction,
        linkedStations: [],
        linkedSms: [],
        phone: "-",
        email: "-"
      }
    ]);

    setTiFormData(initialTiFormData);
    setTiFormErrors({});
    setTiNotice("Traffic Inspector added successfully.");
  };

  const matchedTiByHrms = hrmsTiDirectory.find(
    (row) => row.hrmsId.toLowerCase() === tiHrmsSearch.trim().toLowerCase()
  );

  const handleAddTiByHrms = () => {
    if (!matchedTiByHrms) {
      setTiNotice("No TI found with this HRMS ID.");
      return;
    }

    const alreadyExists = trafficInspectors.some(
      (row) => row.employeeId.toLowerCase() === matchedTiByHrms.hrmsId.toLowerCase()
    );

    if (alreadyExists) {
      setTiNotice("This TI already exists in the division list.");
      return;
    }

    setTrafficInspectors((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: matchedTiByHrms.name,
        employeeId: matchedTiByHrms.hrmsId,
        jurisdiction: matchedTiByHrms.jurisdiction,
        category: matchedTiByHrms.category,
        assessmentStatus: matchedTiByHrms.assessmentStatus,
        linkedStations: [],
        linkedSms: [],
        division: matchedTiByHrms.division,
        phone: matchedTiByHrms.phone,
        email: matchedTiByHrms.email
      }
    ]);

    setTiNotice(`Added ${matchedTiByHrms.name} from HRMS search.`);
    setTiHrmsSearch("");
  };

  const handleRemoveTi = (id) => {
    setTrafficInspectors((prev) => prev.filter((ti) => ti.id !== id));
    if (selectedTiId === id) {
      setSelectedTiId(null);
    }
    if (tiLinkTargetId === id) {
      setTiLinkTargetId(null);
      setTiLinkDraft({ stations: [], sms: [] });
    }
  };

  const handleOpenTiProfile = (id) => {
    setSelectedTiId(id);
  };

  const handleOpenLinkTi = (id) => {
    const selected = trafficInspectors.find((row) => row.id === id);
    if (!selected) {
      return;
    }

    setTiLinkTargetId(id);
    setTiLinkDraft({
      stations: selected.linkedStations || [],
      sms: selected.linkedSms || []
    });
  };

  const toggleMultiValue = (type, value) => {
    setTiLinkDraft((prev) => {
      const currentValues = prev[type];
      const exists = currentValues.includes(value);
      return {
        ...prev,
        [type]: exists ? currentValues.filter((entry) => entry !== value) : [...currentValues, value]
      };
    });
  };

  const handleSaveTiLinks = () => {
    setTrafficInspectors((prev) =>
      prev.map((row) =>
        row.id === tiLinkTargetId
          ? {
              ...row,
              linkedStations: tiLinkDraft.stations,
              linkedSms: tiLinkDraft.sms
            }
          : row
      )
    );

    setTiNotice("TI links updated for Stations and SMs.");
    setTiLinkTargetId(null);
    setTiLinkDraft({ stations: [], sms: [] });
  };

  const handleShiftTi = (id) => {
    const targetDivision = tiShiftDrafts[id];
    if (!targetDivision) {
      return;
    }

    setTrafficInspectors((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              jurisdiction: targetDivision,
              division: targetDivision
            }
          : row
      )
    );

    setTiNotice("TI jurisdiction updated successfully.");
  };

  const filteredTrafficInspectors = trafficInspectors.filter((row) => {
    const q = tiSearch.trim().toLowerCase();
    if (!q) {
      return true;
    }

    return row.name.toLowerCase().includes(q) || row.employeeId.toLowerCase().includes(q);
  });

  const selectedTiProfile = trafficInspectors.find((row) => row.id === selectedTiId) || null;
  const linkTargetTi = trafficInspectors.find((row) => row.id === tiLinkTargetId) || null;
  const stationLinkOptions = Array.from(new Set(stations.map((station) => station.stationName)));
  const smLinkOptions = Array.from(
    new Set(stations.map((station) => station.stationMasterName).filter((name) => Boolean(name && name.trim())))
  );

  const renderStationFormFields = (isReadOnly = false) => {
    return (
      <>
        <div className="add-user-grid station-grid">
          <div className="add-user-col">
            <div className="form-group">
              <label>Station Name *</label>
              <input
                type="text"
                name="stationName"
                value={stationFormData.stationName}
                onChange={handleStationFormChange}
                placeholder="Enter station name"
                className={stationFormErrors.stationName ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.stationName && <span className="error-text">{stationFormErrors.stationName}</span>}
            </div>

            <div className="form-group">
              <label>Station Code *</label>
              <input
                type="text"
                name="stationCode"
                value={stationFormData.stationCode}
                onChange={handleStationFormChange}
                placeholder="e.g. PUNE, NDLS"
                className={stationFormErrors.stationCode ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.stationCode && <span className="error-text">{stationFormErrors.stationCode}</span>}
            </div>

            <div className="form-group">
              <label>Zone *</label>
              <select
                name="zone"
                value={stationFormData.zone}
                onChange={handleStationFormChange}
                className={stationFormErrors.zone ? "error" : ""}
                disabled={isReadOnly}
              >
                <option value="">Select Zone</option>
                {stationZoneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {stationFormErrors.zone && <span className="error-text">{stationFormErrors.zone}</span>}
            </div>

            <div className="form-group">
              <label>Division *</label>
              <select
                name="division"
                value={stationFormData.division}
                onChange={handleStationFormChange}
                className={stationFormErrors.division ? "error" : ""}
                disabled={isReadOnly}
              >
                <option value="">Select Division</option>
                {stationDivisionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {stationFormErrors.division && <span className="error-text">{stationFormErrors.division}</span>}
            </div>

            <div className="form-group">
              <label>Station Category *</label>
              <select
                name="category"
                value={stationFormData.category}
                onChange={handleStationFormChange}
                className={stationFormErrors.category ? "error" : ""}
                disabled={isReadOnly}
              >
                <option value="">Select Category</option>
                {stationCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {stationFormErrors.category && <span className="error-text">{stationFormErrors.category}</span>}
            </div>

            <div className="form-group">
              <label>Station Type *</label>
              <select
                name="stationType"
                value={stationFormData.stationType}
                onChange={handleStationFormChange}
                className={stationFormErrors.stationType ? "error" : ""}
                disabled={isReadOnly}
              >
                <option value="">Select Station Type</option>
                {stationTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {stationFormErrors.stationType && <span className="error-text">{stationFormErrors.stationType}</span>}
            </div>
          </div>

          <div className="add-user-col">
            <div className="form-group">
              <label>Number of Platforms *</label>
              <input
                type="number"
                min="0"
                name="platforms"
                value={stationFormData.platforms}
                onChange={handleStationFormChange}
                placeholder="Enter number of platforms"
                className={stationFormErrors.platforms ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.platforms && <span className="error-text">{stationFormErrors.platforms}</span>}
            </div>

            <div className="form-group">
              <label>Number of Tracks *</label>
              <input
                type="number"
                min="0"
                name="tracks"
                value={stationFormData.tracks}
                onChange={handleStationFormChange}
                placeholder="Enter number of tracks"
                className={stationFormErrors.tracks ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.tracks && <span className="error-text">{stationFormErrors.tracks}</span>}
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={stationFormData.address}
                onChange={handleStationFormChange}
                placeholder="Enter address"
                className={stationFormErrors.address ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.address && <span className="error-text">{stationFormErrors.address}</span>}
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={stationFormData.city}
                onChange={handleStationFormChange}
                placeholder="Enter city"
                className={stationFormErrors.city ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.city && <span className="error-text">{stationFormErrors.city}</span>}
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={stationFormData.state}
                onChange={handleStationFormChange}
                placeholder="Enter state"
                className={stationFormErrors.state ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.state && <span className="error-text">{stationFormErrors.state}</span>}
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="number"
                min="0"
                name="pincode"
                value={stationFormData.pincode}
                onChange={handleStationFormChange}
                placeholder="Enter pincode"
                className={stationFormErrors.pincode ? "error" : ""}
                readOnly={isReadOnly}
              />
              {stationFormErrors.pincode && <span className="error-text">{stationFormErrors.pincode}</span>}
            </div>
          </div>
        </div>

        <div className="station-additional-grid">
          <div className="form-group">
            <label>Station Master Name (Optional)</label>
            <input
              type="text"
              name="stationMasterName"
              value={stationFormData.stationMasterName}
              onChange={handleStationFormChange}
              placeholder="Enter station master name"
              readOnly={isReadOnly}
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={stationFormData.contactNumber}
              onChange={handleStationFormChange}
              placeholder="Enter contact number"
              className={stationFormErrors.contactNumber ? "error" : ""}
              readOnly={isReadOnly}
            />
            {stationFormErrors.contactNumber && <span className="error-text">{stationFormErrors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label>Email ID *</label>
            <input
              type="email"
              name="emailId"
              value={stationFormData.emailId}
              onChange={handleStationFormChange}
              placeholder="Enter email ID"
              className={stationFormErrors.emailId ? "error" : ""}
              readOnly={isReadOnly}
            />
            {stationFormErrors.emailId && <span className="error-text">{stationFormErrors.emailId}</span>}
          </div>

          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="text"
              name="latitude"
              value={stationFormData.latitude}
              onChange={handleStationFormChange}
              placeholder="Enter latitude"
              className={stationFormErrors.latitude ? "error" : ""}
              readOnly={isReadOnly}
            />
            {stationFormErrors.latitude && <span className="error-text">{stationFormErrors.latitude}</span>}
          </div>

          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="text"
              name="longitude"
              value={stationFormData.longitude}
              onChange={handleStationFormChange}
              placeholder="Enter longitude"
              className={stationFormErrors.longitude ? "error" : ""}
              readOnly={isReadOnly}
            />
            {stationFormErrors.longitude && <span className="error-text">{stationFormErrors.longitude}</span>}
          </div>

          <div className="form-group status-toggle-group">
            <label>Status</label>
            <button
              type="button"
              className={`status-toggle-btn ${stationFormData.status === "Active" ? "active" : "inactive"}`}
              onClick={handleStationStatusToggle}
              disabled={isReadOnly}
            >
              {stationFormData.status}
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderPointsmanMonitoringDetail = (pm) => {
    const cat = getPmCat(pm.lastScore);
    const risk = getPmRisk(pm);
    
    // Mock assessment history for pointsman
    const pmAssessmentHistoryMock = {
      PM_1001: [
        { date: "2026-03-28", testMarks: 80, addMarks: 12, total: 92, grade: "A", approvalStatus: "Approved", remarks: "Excellent yard duties and signaling knowledge." },
        { date: "2025-12-15", testMarks: 74, addMarks: 10, total: 84, grade: "A", approvalStatus: "Approved", remarks: "Solid performance under winter operations." }
      ],
      PM_1102: [
        { date: "2026-03-10", testMarks: 65, addMarks: 13, total: 78, grade: "B", approvalStatus: "Pending", remarks: "Demonstrates consistent safety alertness." }
      ],
      PM_1103: [
        { date: "2026-02-15", testMarks: 38, addMarks: 10, total: 48, grade: "C", approvalStatus: "Approved", remarks: "Requires strict adherence to signal placement guidelines." }
      ],
      PM_1104: [
        { date: "2026-03-18", testMarks: 72, addMarks: 12, total: 84, grade: "A", approvalStatus: "Pending", remarks: "Very proactive and vigilant on main line siding duties." }
      ],
      PM_1105: [
        { date: "2026-01-20", testMarks: 25, addMarks: 10, total: 35, grade: "D", approvalStatus: "Rejected", remarks: "Unsatisfactory compliance on hand signaling drills." }
      ],
      PM_1106: [
        { date: "2026-03-05", testMarks: 55, addMarks: 12, total: 67, grade: "B", approvalStatus: "Approved", remarks: "Alert and prompt response to train siding movements." }
      ],
      PM_1107: [
        { date: "2026-03-20", testMarks: 70, addMarks: 12, total: 82, grade: "A", approvalStatus: "Approved", remarks: "Outstanding safety observance during high traffic shift." }
      ],
      PM_1108: [
        { date: "2026-02-01", testMarks: 12, addMarks: 7, total: 19, grade: "D", approvalStatus: "Rejected", remarks: "Severe safety oversight near point 4B. Re-training mandatory." }
      ]
    };
    
    const hist = pmAssessmentHistoryMock[pm.hrmsId] || [];

    return (
      <div className="pointsman-monitoring-detail-wrapper" style={{ animation: "fadeIn 0.3s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button 
            type="button" 
            className="sm2-monitor-btn"
            onClick={() => setSelectedPointsmanForMonitoring(null)}
            style={{
              backgroundColor: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            ← Back to Pointsman List
          </button>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Live Operations Audit Platform</span>
        </div>

        {/* HERO CARD */}
        <div className="sm2-pm-hero" style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          background: "linear-gradient(135deg, #0d2c4d 0%, #163d66 100%)",
          color: "#ffffff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(13, 44, 77, 0.15)",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div className="sm2-pm-avatar" style={{
            width: "72px",
            height: "72px",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "800",
            border: "2px solid rgba(255, 255, 255, 0.25)"
          }}>
            {pm.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>{pm.name}</h3>
            <span style={{ fontSize: "13px", opacity: 0.85, fontWeight: "500" }}>
              {pm.hrmsId} · Pointsman · {pm.stationName}
            </span>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <span style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.2px"
              }}>
                Category {cat}
              </span>
              <span style={{
                background: risk === "High" ? "#fee2e2" : risk === "Medium" ? "#fef3c7" : "#dcfce7",
                color: risk === "High" ? "#b91c1c" : risk === "Medium" ? "#b45309" : "#15803d",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: "700"
              }}>
                {risk} Risk
              </span>
              <span style={{
                background: pm.approvalStatus === "Approved" ? "#dcfce7" : pm.approvalStatus === "Pending" ? "#dbeafe" : "#fee2e2",
                color: pm.approvalStatus === "Approved" ? "#15803d" : pm.approvalStatus === "Pending" ? "#1d4ed8" : "#b91c1c",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: "700"
              }}>
                {pm.approvalStatus}
              </span>
            </div>
          </div>
          <div className="sm2-pm-quick-stats" style={{
            display: "flex",
            gap: "20px",
            background: "rgba(255, 255, 255, 0.08)",
            padding: "12px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "9px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>Latest Score</label>
              <strong style={{ fontSize: "18px", fontWeight: "800" }}>{pm.lastScore}/100</strong>
            </div>
            <div style={{ textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "9px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>Safety Score</label>
              <strong style={{ fontSize: "18px", fontWeight: "800", color: "#6ee7b7" }}>{pm.safetyScore}%</strong>
            </div>
            <div style={{ textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "9px", opacity: 0.7, fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>Assessments</label>
              <strong style={{ fontSize: "18px", fontWeight: "800" }}>{pm.totalAssessments}</strong>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          
          {/* PERSONAL INFO */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px" }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "700", color: "#0d2c4d", display: "flex", alignItems: "center", gap: "6px" }}>
              <Users size={16} /> Employee Information
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Gender</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{pm.gender}</dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Age</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{pm.age} Years</dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Date of Joining</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{pm.doj}</dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Base Pay</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>{pm.basePay}</dd>
              </div>
            </div>
          </div>

          {/* SAFETY COMPLIANCE */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px" }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "700", color: "#0d2c4d", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} /> Safety & Audit Compliance
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>PME Status</dt>
                <dd style={{ margin: 0 }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: pm.pmeStatus === "Fit" ? "#16a34a" : "#dc2626",
                    background: pm.pmeStatus === "Fit" ? "#dcfce7" : "#fee2e2",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}>{pm.pmeStatus}</span>
                </dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Refresher Course</dt>
                <dd style={{ margin: 0 }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: pm.refStatus === "Cleared" ? "#16a34a" : "#d97706",
                    background: pm.refStatus === "Cleared" ? "#dcfce7" : "#fef3c7",
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}>{pm.refStatus}</span>
                </dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Disciplinary Action</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: pm.disciplinary === "None" ? "#16a34a" : "#dc2626", fontWeight: "700" }}>{pm.disciplinary}</dd>
              </div>
              <div>
                <dt style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>Recorded Incidents</dt>
                <dd style={{ margin: 0, fontSize: "14px", color: pm.incidents === 0 ? "#16a34a" : "#dc2626", fontWeight: "700" }}>{pm.incidents}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* MONITORING STATUS SECTION */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)",
          marginBottom: "24px"
        }}>
          <h4 style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 0 16px 0",
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            <Activity size={16} color="#0d2c4d" /> Monitoring Status
          </h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {[
              { 
                status: "Active", 
                color: "#16a34a", 
                bg: "#dcfce7", 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" fill="#16a34a" fillOpacity="0.2" />
                    <circle cx="12" cy="12" r="3" fill="#16a34a" />
                  </svg>
                ),
                desc: "Available for yard operations" 
              },
              { 
                status: "On Duty", 
                color: "#d97706", 
                bg: "#fef3c7", 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                desc: "Currently executing track tasks" 
              },
              { 
                status: "Off Duty", 
                color: "#64748b", 
                bg: "#f1f5f9", 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                desc: "Resting / Shift ended" 
              },
              { 
                status: "Absent", 
                color: "#dc2626", 
                bg: "#fee2e2", 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ),
                desc: "Unexcused leave of absence" 
              }
            ].map(item => {
              const isActive = (pm.monitoringStatus || "Active") === item.status;
              return (
                <div
                  key={item.status}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    border: isActive ? `1.5px solid ${item.color}` : "1.5px solid #e2e8f0",
                    background: isActive ? item.bg : "#ffffff",
                    boxShadow: isActive ? `0 4px 14px ${item.color}15` : "none",
                    opacity: isActive ? 1 : 0.6,
                    transform: isActive ? "scale(1.02)" : "none",
                    transition: "all 0.2s ease",
                    cursor: "default"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: isActive ? item.color : "#334155"
                      }}>
                        {item.status}
                      </span>
                    </div>
                    {isActive && (
                      <span style={{
                        fontSize: "9px",
                        fontWeight: "800",
                        background: item.color,
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.2px"
                      }}>
                        Current
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: "11px",
                    color: isActive ? "#334155" : "#64748b",
                    fontWeight: isActive ? "500" : "400",
                    lineHeight: "1.4"
                  }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* HISTORICAL ASSESSMENTS TABLE */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px" }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "700", color: "#0d2c4d" }}>
            Assessment History (by SM & TI)
          </h4>
          <div className="users-table-wrapper" style={{ overflowX: "auto" }}>
            <table className="reports-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Date</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Test Score (25)</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>TI Review Score (75)</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Total (100)</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Grade</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Status</th>
                  <th style={{ padding: "12px", fontSize: "12px", fontWeight: "700", color: "#475569" }}>Officer Remarks</th>
                </tr>
              </thead>
              <tbody>
                {hist.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textShadow: "none", textAlign: "center", color: "#64748b" }}>
                      No assessment records found.
                    </td>
                  </tr>
                ) : (
                  hist.map((h, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{h.date}</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{h.testMarks}/25</td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#334155" }}>{h.addMarks}/75</td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{h.total}/100</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          background: h.grade === "A" ? "#dcfce7" : h.grade === "B" ? "#dbeafe" : h.grade === "C" ? "#fef3c7" : "#fee2e2",
                          color: h.grade === "A" ? "#15803d" : h.grade === "B" ? "#1d4ed8" : h.grade === "C" ? "#b45309" : "#b91c1c",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: "700",
                          fontSize: "11px"
                        }}>Grade {h.grade}</span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span className={`sm2-status-pill sm2-status-${h.approvalStatus.toLowerCase()}`}>{h.approvalStatus}</span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>{h.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <div className="page-header">
              <h2>Performance Overview</h2>
              <select 
                className="period-select" 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option>FY 2025-26 - Q3</option>
                <option>FY 2025-26 - Q2</option>
                <option>FY 2025-26 - Q1</option>
              </select>
            </div>

            <div className="notice-row">
              <div className="notice-card alert">
                <span>!</span>
                <p>
                  <strong>Nagpur station</strong> has the highest pending evaluations (120)
                </p>
              </div>
              <div className="notice-card success">
                <span>+</span>
                <p>
                  <strong>Jalna station</strong> is top performing this quarter
                </p>
              </div>
            </div>

            <section className="metrics-grid">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                const isClickable = [
                  "TOTAL EMPLOYEES",
                  "EVALUATIONS COMPLETED",
                  "PENDING APPROVALS"
                ].includes(card.title);

                const handleCardClick = () => {
                  if (!isClickable) return;
                  if (card.title === "TOTAL EMPLOYEES") {
                    setActivePage("User Management");
                  } else if (card.title === "EVALUATIONS COMPLETED") {
                    setActivePage("Reports");
                  } else if (card.title === "PENDING APPROVALS") {
                    setActivePage("Pending Approvals");
                  }
                };

                return (
                  <article 
                    key={card.title} 
                    className={`metric-card ${isClickable ? "clickable-card" : ""}`}
                    onClick={isClickable ? handleCardClick : undefined}
                    style={isClickable ? { cursor: "pointer" } : undefined}
                    title={isClickable ? `Click to open ${card.title.toLowerCase()}` : undefined}
                  >
                    <div className="metric-top">
                      <div className={`metric-icon ${card.iconClass}`}>
                        <Icon size={20} />
                      </div>
                      {card.trend && (
                        <span className={card.trendAlert ? "trend alert" : "trend"}>
                          {card.trend}
                        </span>
                      )}
                      {card.status && <span className="status-label">{card.status}</span>}
                    </div>
                    <div className="metric-value">{card.value}</div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </article>
                );
              })}
            </section>

            <section className="charts-grid">
              <article className="chart-card bar-chart-card">
                <div className="chart-header">
                  <h3>Station-wise Evaluation Progress</h3>
                  <input 
                    type="text" 
                    placeholder="Search station..." 
                    value={searchStations}
                    onChange={(e) => setSearchStations(e.target.value)}
                  />
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stationProgressData}
                      margin={{ top: 8, right: 12, left: -10, bottom: 25 }}
                      barGap={7}
                    >
                      <XAxis
                        dataKey="station"
                        tick={{ fontSize: 11, fill: "#6a7385" }}
                        angle={-20}
                        textAnchor="end"
                        height={52}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#6a7385" }} />
                      <Tooltip />
                      <Legend iconType="circle" />
                      <Bar
                        dataKey="completed"
                        fill="#0d2948"
                        radius={[6, 6, 0, 0]}
                        name="Completed"
                      />
                      <Bar
                        dataKey="pending"
                        fill="#f5ae3f"
                        radius={[6, 6, 0, 0]}
                        name="Pending"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="chart-card avg-score-card">
                <h3>Station-wise Average Score</h3>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stationAverageScoreData}
                      margin={{ top: 8, right: 12, left: -10, bottom: 25 }}
                      barGap={10}
                    >
                      <XAxis
                        dataKey="station"
                        tick={{ fontSize: 11, fill: "#6a7385" }}
                        angle={-20}
                        textAnchor="end"
                        height={52}
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6a7385" }} />
                      <Tooltip formatter={(value) => [`${value}/100`, "Average Score"]} />
                      <Legend iconType="circle" />
                      <Bar
                        dataKey="avgScore"
                        fill="#1f7a5c"
                        radius={[6, 6, 0, 0]}
                        name="Average Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="chart-card donut-card">
                <h3>Category Distribution</h3>
                <div className="donut-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={126}
                        dataKey="value"
                        label={({ value }) => `${value}%`}
                      >
                        {categoryData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend-row">
                  {categoryData.map((item) => (
                    <div key={item.name} className="legend-item">
                      <span style={{ backgroundColor: item.color }} />
                      {item.name}
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        );

      case "Station Management":
      case "All Stations":
        return (
          <div className="user-management-page">
            <div className="page-header">
              <h2>STATION MANAGEMENT</h2>
            </div>

            <div className="chart-card station-list-intro">
              <div>
                <h3>All Stations Directory</h3>
                <p>Manage station records, quickly search data, and keep operational information up to date.</p>
              </div>
              <div className="station-list-kpi">Total Stations: {stations.length}</div>
            </div>

            <div className="station-action-bar chart-card">
              <button type="button" className="submit-btn" onClick={() => handleStationSubPage("Add Station")}>
                Add New Station
              </button>
              <input
                type="text"
                className="users-table-search"
                placeholder="Search by Station Name / Code"
                value={stationSearch}
                onChange={(e) => {
                  setStationSearch(e.target.value);
                  setStationCurrentPage(1);
                }}
              />
            </div>

            <div className="users-filter-section chart-card">
              <form className="filter-grid station-filter-grid" onSubmit={handleApplyStationFilter}>
                <div className="form-group">
                  <label>Zone</label>
                  <select name="zone" value={pendingStationFilters.zone} onChange={handleStationFilterChange}>
                    <option value="">All Zones</option>
                    {stationZoneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Division</label>
                  <select name="division" value={pendingStationFilters.division} onChange={handleStationFilterChange}>
                    <option value="">All Divisions</option>
                    {stationDivisionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Station Category</label>
                  <select name="category" value={pendingStationFilters.category} onChange={handleStationFilterChange}>
                    <option value="">All Categories</option>
                    {stationCategoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={pendingStationFilters.status} onChange={handleStationFilterChange}>
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="filter-submit-wrap">
                  <button type="submit" className="submit-btn">Apply Filter</button>
                </div>
              </form>
            </div>

            <div className="users-list-container">
              <div className="users-table-wrapper">
                <div className="users-table station-table-wide">
                  <div className="table-header station-table-cols">
                    <div>Sr No</div>
                    <div>Station Name</div>
                    <div>Station Code</div>
                    <div>Zone</div>
                    <div>Division</div>
                    <div>Category</div>
                    <div>Platforms</div>
                    <div>Tracks</div>
                    <div>Station Type</div>
                    <div>Status</div>
                    <div>Created By</div>
                    <div>Actions</div>
                  </div>

                  {pagedStations.length === 0 ? (
                    <div className="table-empty-state">No stations found.</div>
                  ) : (
                    pagedStations.map((station, index) => (
                      <div key={station.id} className="table-row station-table-cols">
                        <div>{(stationCurrentPage - 1) * stationPageSize + index + 1}</div>
                        <div>{station.stationName}</div>
                        <div>
                          <span className="station-code-chip">{station.stationCode}</span>
                        </div>
                        <div>{station.zone}</div>
                        <div>{station.division}</div>
                        <div>{renderCategoryBadge(station.category)}</div>
                        <div>{station.platforms}</div>
                        <div>{station.tracks}</div>
                        <div>{station.stationType}</div>
                        <div>
                          <span className={station.status === "Active" ? "status-active-pill" : "status-inactive-pill"}>
                            {station.status}
                          </span>
                        </div>
                        <div>{station.createdBy}</div>
                        <div className="table-action-cell">
                          <button type="button" className="action-btn" onClick={() => openStationView(station.id, false)}>
                            View
                          </button>
                          <button type="button" className="action-btn action-edit" onClick={() => openStationView(station.id, true)}>
                            Edit
                          </button>
                          <button type="button" className="action-btn action-delete" onClick={() => handleDeleteStation(station.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="table-pagination-wrap">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToPrevStationPage}
                  disabled={stationCurrentPage === 1}
                >
                  Prev
                </button>
                <span className="pagination-text">
                  Page {stationCurrentPage} of {stationTotalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={goToNextStationPage}
                  disabled={stationCurrentPage === stationTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case "Station Masters":
        return (
          <div className="user-management-page">
            <div className="page-header">
              <h2>STATION MASTERS DIRECTORY</h2>
              <p>View all Station Masters and their mapped stations</p>
            </div>

            <div className="station-action-bar chart-card">
              <div className="station-list-kpi">Total Station Masters: {filteredStationMasters.length}</div>
              <input
                type="text"
                className="users-table-search"
                placeholder="Search by Name / Station / Code / Division"
                value={stationMasterSearch}
                onChange={(e) => setStationMasterSearch(e.target.value)}
              />
            </div>

            <div className="users-list-container">
              <div className="users-table-wrapper">
                <div className="users-table station-master-table-wide">
                  <div className="table-header station-master-table-cols">
                    <div>Sr No</div>
                    <div>Station Master Name</div>
                    <div>Station Name</div>
                    <div>Station Code</div>
                    <div>Division</div>
                    <div>Zone</div>
                    <div>Category</div>
                    <div>Contact</div>
                    <div>Email</div>
                    <div>Action</div>
                  </div>

                  {filteredStationMasters.length === 0 ? (
                    <div className="table-empty-state">No Station Masters found.</div>
                  ) : (
                    filteredStationMasters.map((row, index) => (
                      <div 
                        key={row.id} 
                        className="table-row station-master-table-cols clickable-row"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStationMasterClick(row)}
                      >
                        <div>{index + 1}</div>
                        <div><strong>{row.name}</strong></div>
                        <div>{row.stationName}</div>
                        <div>
                          <span className="station-code-chip">{row.stationCode}</span>
                        </div>
                        <div>{row.division}</div>
                        <div>{row.zone}</div>
                        <div>{renderCategoryBadge(row.category)}</div>
                        <div>{row.contactNumber}</div>
                        <div>{row.emailId}</div>
                        <div>
                          <button
                            type="button"
                            className="sm2-monitor-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStationMasterClick(row);
                            }}
                            style={{
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
                              padding: "4px 10px",
                              fontSize: "12px",
                              borderRadius: "6px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <style>{`
              .station-master-table-wide {
                min-width: 1200px;
              }

              .station-master-table-cols {
                display: grid;
                grid-template-columns: 60px 1.2fr 1.3fr 90px 0.8fr 0.8fr 80px 120px 1.2fr 100px;
                align-items: center;
                gap: 10px;
              }
            `}</style>
          </div>
        );

      case "Pointsman Under Station Master":
        if (!selectedSMForPointsmen) return null;
        
        // Find pointsmen under this station
        const stationPointsmen = aomPointsmen.filter(
          (pm) => pm.stationCode === selectedSMForPointsmen.stationCode
        );

        // Calculate KPI summaries
        const approvedCount = stationPointsmen.filter(p => p.approvalStatus === "Approved").length;
        const pendingCount = stationPointsmen.filter(p => p.approvalStatus === "Pending").length;
        const highRiskCount = stationPointsmen.filter(p => getPmRisk(p) === "High").length;

        // Apply filters
        const filteredStationPointsmen = stationPointsmen.filter((pm) => {
          const risk = getPmRisk(pm);
          const searchText = pointsmanSearchText.trim().toLowerCase();
          const matchesSearch =
            searchText.length === 0 ||
            pm.name.toLowerCase().includes(searchText) ||
            pm.hrmsId.toLowerCase().includes(searchText);
            
          const matchesRisk = pointsmanRiskFilter === "All" || risk === pointsmanRiskFilter;
          const matchesStatus = pointsmanStatusFilter === "All" || pm.approvalStatus === pointsmanStatusFilter;
          
          return matchesSearch && matchesRisk && matchesStatus;
        });

        return (
          <div className="user-management-page">
            {selectedPointsmanForMonitoring ? (
              renderPointsmanMonitoringDetail(selectedPointsmanForMonitoring)
            ) : (
              <>
                <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      Pointsman Management – {selectedSMForPointsmen.stationName}
                    </h2>
                    <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                      Operational directory under Station Master: <strong>{selectedSMForPointsmen.name}</strong> ({selectedSMForPointsmen.stationCode})
                    </p>
                  </div>
                  <button
                    type="button"
                    className="sm2-monitor-btn"
                    onClick={() => {
                      setActivePage("Station Masters");
                      setSelectedSMForPointsmen(null);
                    }}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    ← Back to Station Masters
                  </button>
                </div>

                {/* KPI Cards */}
                <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px", marginTop: "20px" }}>
                  <div className="metric-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={24} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Pointsmen</span>
                      <h3 style={{ margin: "2px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{stationPointsmen.length}</h3>
                    </div>
                  </div>
                  <div className="metric-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Approved Staff</span>
                      <h3 style={{ margin: "2px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#16a34a" }}>{approvedCount}</h3>
                    </div>
                  </div>
                  <div className="metric-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ClipboardCheck size={24} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending Assessments</span>
                      <h3 style={{ margin: "2px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#2563eb" }}>{pendingCount}</h3>
                    </div>
                  </div>
                  <div className="metric-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>High Risk Staff</span>
                      <h3 style={{ margin: "2px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#dc2626" }}>{highRiskCount}</h3>
                    </div>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="station-action-bar chart-card" style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                    <Search size={16} color="#64748b" />
                    <input
                      type="text"
                      className="users-table-search"
                      placeholder="Search by Pointsman Name / HRMS ID..."
                      value={pointsmanSearchText}
                      onChange={(e) => setPointsmanSearchText(e.target.value)}
                      style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }}
                    />
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px" }}>
                    <select 
                      value={pointsmanRiskFilter} 
                      onChange={(e) => setPointsmanRiskFilter(e.target.value)}
                      style={{
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#334155",
                        background: "#ffffff"
                      }}
                    >
                      <option value="All">All Risk Levels</option>
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                    <select 
                      value={pointsmanStatusFilter} 
                      onChange={(e) => setPointsmanStatusFilter(e.target.value)}
                      style={{
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#334155",
                        background: "#ffffff"
                      }}
                    >
                      <option value="All">All Approval Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="users-list-container">
                  <div className="users-table-wrapper">
                    <div className="users-table pointsman-list-table-wide">
                      <div className="table-header pointsman-list-table-cols">
                        <div>Sr No</div>
                        <div>Pointsman Name</div>
                        <div>HRMS ID</div>
                        <div>Grade / Category</div>
                        <div>Last Assessment Score</div>
                        <div>Last Assessed Date</div>
                        <div>Approval Status</div>
                        <div>Risk Level</div>
                        <div>Action</div>
                      </div>

                      {filteredStationPointsmen.length === 0 ? (
                        <div className="table-empty-state">No Pointsman staff found.</div>
                      ) : (
                        filteredStationPointsmen.map((pm, idx) => {
                          const cat = getPmCat(pm.lastScore);
                          const risk = getPmRisk(pm);
                          const isHighRisk = risk === "High";
                          const isMedRisk = risk === "Medium";
                          
                          return (
                            <div 
                              key={pm.id} 
                              className="table-row pointsman-list-table-cols clickable-row"
                              onClick={() => setSelectedPointsmanForMonitoring(pm)}
                              style={{ cursor: "pointer" }}
                            >
                              <div>{idx + 1}</div>
                              <div><strong>{pm.name}</strong></div>
                              <div>{pm.hrmsId}</div>
                              <div>
                                <span style={{
                                  background: cat === "A" ? "#dcfce7" : cat === "B" ? "#dbeafe" : cat === "C" ? "#fef3c7" : "#fee2e2",
                                  color: cat === "A" ? "#15803d" : cat === "B" ? "#1d4ed8" : cat === "C" ? "#b45309" : "#b91c1c",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontWeight: "700",
                                  fontSize: "11px"
                                }}>Category {cat}</span>
                              </div>
                              <div><strong>{pm.lastScore}/100</strong></div>
                              <div>
                                {pm.hrmsId === "PM_1001" ? "2026-03-28" : 
                                 pm.hrmsId === "PM_1102" ? "2026-03-10" : 
                                 pm.hrmsId === "PM_1103" ? "2026-02-15" : 
                                 pm.hrmsId === "PM_1104" ? "2026-03-18" : 
                                 pm.hrmsId === "PM_1105" ? "2026-01-20" : 
                                 pm.hrmsId === "PM_1106" ? "2026-03-05" : 
                                 pm.hrmsId === "PM_1107" ? "2026-03-20" : 
                                 pm.hrmsId === "PM_1108" ? "2026-02-01" : "—"}
                              </div>
                              <div>
                                <span className={`sm2-status-pill sm2-status-${pm.approvalStatus.toLowerCase()}`} style={{ display: "inline-block" }}>
                                  {pm.approvalStatus}
                                </span>
                              </div>
                              <div>
                                <span style={{
                                  background: isHighRisk ? "#fee2e2" : isMedRisk ? "#fef3c7" : "#dcfce7",
                                  color: isHighRisk ? "#b91c1c" : isMedRisk ? "#b45309" : "#15803d",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontWeight: "700",
                                  fontSize: "11px"
                                }}>{risk}</span>
                              </div>
                              <div>
                                <button
                                  type="button"
                                  className="sm2-monitor-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPointsmanForMonitoring(pm);
                                  }}
                                  style={{
                                    backgroundColor: "#eff6ff",
                                    color: "#2563eb",
                                    border: "1px solid #bfdbfe",
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    borderRadius: "6px",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                  }}
                                >
                                  Monitor
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <style>{`
                  .pointsman-list-table-wide {
                    min-width: 1000px;
                  }
                  .pointsman-list-table-cols {
                    display: grid;
                    grid-template-columns: 60px 1.5fr 1fr 1.2fr 1.3fr 1.3fr 1.2fr 1fr 100px;
                    align-items: center;
                    gap: 10px;
                  }
                `}</style>
              </>
            )}
          </div>
        );

      case "Add Station":
        return (
          <div className="user-management-page">
            <div className="add-user-title-wrap">
              <h2>ADD STATION</h2>
            </div>

            <div className="form-container structured-form-card">
              <form onSubmit={handleAddStationSubmit} className="user-form">
                {renderStationFormFields(false)}

                <div className="add-user-actions two-btn-actions">
                  <button type="button" className="action-btn" onClick={handleResetStationForm}>
                    Reset
                  </button>
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "View / Edit Station":
        return (
          <div className="user-management-page">
            <div className="page-header">
              <h2>VIEW / EDIT STATION</h2>
            </div>

            <div className="form-container structured-form-card">
              <form onSubmit={handleUpdateStation} className="user-form">
                {renderStationFormFields(!isStationEditMode)}

                <div className="add-user-actions two-btn-actions">
                  <button type="button" className="action-btn" onClick={() => setActivePage("Station Management")}>
                    Back
                  </button>
                  {!isStationEditMode ? (
                    <button type="button" className="submit-btn" onClick={() => setIsStationEditMode(true)}>
                      Edit Station
                    </button>
                  ) : (
                    <button type="submit" className="submit-btn">
                      Update
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        );

      case "Traffic Inspector":
        return (
          <div className="user-management-page">
            <div className="page-header">
              <h2>TRAFFIC INSPECTOR MANAGEMENT</h2>
            </div>

            <div className="chart-card ti-top-search">
              <label htmlFor="ti-top-search-input">Search (Name / HRMS ID)</label>
              <div className="ti-top-search-input-wrap">
                <Search size={16} />
                <input
                  id="ti-top-search-input"
                  type="text"
                  placeholder="Type name or HRMS ID"
                  value={tiSearch}
                  onChange={(e) => setTiSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="chart-card ti-add-section">
              <div className="ti-add-switch">
                <button
                  type="button"
                  className={`action-btn ${tiAddMode === "form" ? "action-edit" : ""}`}
                  onClick={() => {
                    setTiAddMode("form");
                    setTiNotice("");
                  }}
                >
                  Add TI via Form
                </button>
                <button
                  type="button"
                  className={`action-btn ${tiAddMode === "hrms" ? "action-edit" : ""}`}
                  onClick={() => {
                    setTiAddMode("hrms");
                    setTiNotice("");
                  }}
                >
                  Add TI via HRMS Search
                </button>
              </div>

              {tiAddMode === "form" ? (
                <form className="ti-add-form" onSubmit={handleAddTiByForm}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input name="name" value={tiFormData.name} onChange={handleTiFormChange} placeholder="Enter TI name" />
                    {tiFormErrors.name && <span className="error-text">{tiFormErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input
                      name="employeeId"
                      value={tiFormData.employeeId}
                      onChange={handleTiFormChange}
                      placeholder="Enter employee/HRMS ID"
                    />
                    {tiFormErrors.employeeId && <span className="error-text">{tiFormErrors.employeeId}</span>}
                  </div>
                  <div className="form-group">
                    <label>Jurisdiction *</label>
                    <select name="jurisdiction" value={tiFormData.jurisdiction} onChange={handleTiFormChange}>
                      <option value="">Select jurisdiction</option>
                      {stationDivisionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {tiFormErrors.jurisdiction && <span className="error-text">{tiFormErrors.jurisdiction}</span>}
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={tiFormData.category} onChange={handleTiFormChange}>
                      <option value="">Select category</option>
                      {tiCategoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {tiFormErrors.category && <span className="error-text">{tiFormErrors.category}</span>}
                  </div>
                  <div className="form-group">
                    <label>Assessment Status</label>
                    <select name="assessmentStatus" value={tiFormData.assessmentStatus} onChange={handleTiFormChange}>
                      {tiAssessmentStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ti-form-submit-wrap">
                    <button type="submit" className="submit-btn">
                      Add TI
                    </button>
                  </div>
                </form>
              ) : (
                <div className="ti-hrms-add-wrap">
                  <div className="ti-hrms-controls">
                    <div className="ti-top-search-input-wrap">
                      <UserRoundSearch size={16} />
                      <input
                        type="text"
                        placeholder="Enter HRMS ID"
                        value={tiHrmsSearch}
                        onChange={(e) => setTiHrmsSearch(e.target.value)}
                      />
                    </div>
                    <button type="button" className="submit-btn" onClick={handleAddTiByHrms}>
                      Add From HRMS
                    </button>
                  </div>
                  {matchedTiByHrms && (
                    <div className="ti-hrms-preview">
                      <strong>{matchedTiByHrms.name}</strong>
                      <span>{matchedTiByHrms.hrmsId}</span>
                      <span>{matchedTiByHrms.jurisdiction}</span>
                    </div>
                  )}
                </div>
              )}

              {tiNotice && <p className="ti-notice-text">{tiNotice}</p>}
            </div>

            <div className="users-list-container">
              <div className="users-table-wrapper">
                <div className="users-table ti-table-wide">
                  <div className="table-header ti-table-cols">
                    <div>Name</div>
                    <div>Employee ID</div>
                    <div>Jurisdiction</div>
                    <div>Category</div>
                    <div>Assessment Status</div>
                    <div>Actions</div>
                  </div>

                  {filteredTrafficInspectors.length === 0 ? (
                    <div className="table-empty-state">No Traffic Inspectors found.</div>
                  ) : (
                    filteredTrafficInspectors.map((row) => (
                      <div key={row.id} className="table-row ti-table-cols">
                        <div>
                          <button type="button" className="ti-name-link" onClick={() => handleOpenTiProfile(row.id)}>
                            {row.name}
                          </button>
                        </div>
                        <div>{row.employeeId}</div>
                        <div>{row.jurisdiction}</div>
                        <div>{renderCategoryBadge(row.category)}</div>
                        <div>
                          <span className={row.assessmentStatus === "Completed" ? "status-active-pill" : "status-inactive-pill"}>
                            {row.assessmentStatus}
                          </span>
                        </div>
                        <div className="table-action-cell ti-actions-cell">
                          <button type="button" className="action-btn" onClick={() => handleOpenTiProfile(row.id)}>
                            View
                          </button>
                          <button type="button" className="action-btn action-edit" onClick={() => handleOpenLinkTi(row.id)}>
                            Link Stations & SMs
                          </button>
                          <div className="ti-shift-inline">
                            <select
                              value={tiShiftDrafts[row.id] || ""}
                              onChange={(e) =>
                                setTiShiftDrafts((prev) => ({
                                  ...prev,
                                  [row.id]: e.target.value
                                }))
                              }
                            >
                              <option value="">Shift to...</option>
                              {stationDivisionOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="action-btn" onClick={() => handleShiftTi(row.id)}>
                              <ArrowRightLeft size={14} />
                              Shift
                            </button>
                          </div>
                          <button type="button" className="action-btn action-delete" onClick={() => handleRemoveTi(row.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {selectedTiProfile && (
              <div className="chart-card ti-profile-card">
                <div className="ti-profile-header">
                  <h3>TI Profile</h3>
                  <button type="button" className="action-btn" onClick={() => setSelectedTiId(null)}>
                    Close
                  </button>
                </div>

                <div className="ti-profile-grid">
                  <div><strong>Name:</strong> {selectedTiProfile.name}</div>
                  <div><strong>Employee ID:</strong> {selectedTiProfile.employeeId}</div>
                  <div><strong>Jurisdiction:</strong> {selectedTiProfile.jurisdiction}</div>
                  <div><strong>Category:</strong> {renderCategoryBadge(selectedTiProfile.category)}</div>
                  <div><strong>Assessment:</strong> {selectedTiProfile.assessmentStatus}</div>
                  <div><strong>Phone:</strong> {selectedTiProfile.phone}</div>
                  <div><strong>Email:</strong> {selectedTiProfile.email}</div>
                </div>

                <div className="ti-linked-meta">
                  <p><strong>Linked Stations:</strong> {selectedTiProfile.linkedStations.length ? selectedTiProfile.linkedStations.join(", ") : "None"}</p>
                  <p><strong>Linked SMs:</strong> {selectedTiProfile.linkedSms.length ? selectedTiProfile.linkedSms.join(", ") : "None"}</p>
                </div>
              </div>
            )}

            {linkTargetTi && (
              <div className="chart-card ti-link-card">
                <div className="ti-profile-header">
                  <h3>Link {linkTargetTi.name} to Stations & SMs</h3>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => {
                      setTiLinkTargetId(null);
                      setTiLinkDraft({ stations: [], sms: [] });
                    }}
                  >
                    Close
                  </button>
                </div>

                <div className="ti-link-grid">
                  <div className="ti-link-block">
                    <h4>Stations</h4>
                    {stationLinkOptions.map((stationName) => (
                      <label key={stationName} className="ti-link-option">
                        <input
                          type="checkbox"
                          checked={tiLinkDraft.stations.includes(stationName)}
                          onChange={() => toggleMultiValue("stations", stationName)}
                        />
                        <span>{stationName}</span>
                      </label>
                    ))}
                  </div>

                  <div className="ti-link-block">
                    <h4>Station Masters</h4>
                    {smLinkOptions.map((smName) => (
                      <label key={smName} className="ti-link-option">
                        <input
                          type="checkbox"
                          checked={tiLinkDraft.sms.includes(smName)}
                          onChange={() => toggleMultiValue("sms", smName)}
                        />
                        <span>{smName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="add-user-actions">
                  <button type="button" className="submit-btn" onClick={handleSaveTiLinks}>
                    Save Links
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case "User Management":
        return (
          <div className="user-management-page">
            <div className="add-user-title-wrap">
              <h2>ADD USER</h2>
            </div>

            <div className="form-container structured-form-card">
              <form onSubmit={handleSubmitUser} className="user-form">
                <div className="add-user-grid">
                  <div className="add-user-col">
                    <div className="form-group">
                      <label>Employee Name *</label>
                      <input
                        type="text"
                        name="employeeName"
                        value={userFormData.employeeName}
                        onChange={handleUserFormChange}
                        placeholder="Enter employee name"
                        className={formErrors.employeeName ? "error" : ""}
                      />
                      {formErrors.employeeName && <span className="error-text">{formErrors.employeeName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Department *</label>
                      <select
                        name="department"
                        value={userFormData.department}
                        onChange={handleUserFormChange}
                        className={formErrors.department ? "error" : ""}
                      >
                        <option value="">Select Department</option>
                        {departmentOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formErrors.department && <span className="error-text">{formErrors.department}</span>}
                    </div>

                    <div className="form-group">
                      <label>Reporting Officer *</label>
                      <select
                        name="reportingOfficer"
                        value={userFormData.reportingOfficer}
                        onChange={handleUserFormChange}
                        className={formErrors.reportingOfficer ? "error" : ""}
                      >
                        <option value="">Select Reporting Officer</option>
                        {reportingOfficerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formErrors.reportingOfficer && <span className="error-text">{formErrors.reportingOfficer}</span>}
                    </div>
                  </div>

                  <div className="add-user-col">
                    <div className="form-group">
                      <label>HRMS ID *</label>
                      <input
                        type="text"
                        name="hrmsId"
                        value={userFormData.hrmsId}
                        onChange={handleUserFormChange}
                        placeholder="Enter HRMS ID"
                        className={formErrors.hrmsId ? "error" : ""}
                      />
                      {formErrors.hrmsId && <span className="error-text">{formErrors.hrmsId}</span>}
                    </div>

                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="text"
                        name="mobileNo"
                        value={userFormData.mobileNo}
                        onChange={handleUserFormChange}
                        placeholder="Enter mobile number"
                        className={formErrors.mobileNo ? "error" : ""}
                      />
                      {formErrors.mobileNo && <span className="error-text">{formErrors.mobileNo}</span>}
                    </div>

                    <div className="form-group">
                      <label>Designation *</label>
                      <select
                        name="designation"
                        value={userFormData.designation}
                        onChange={handleUserFormChange}
                        className={formErrors.designation ? "error" : ""}
                      >
                        <option value="">Select Designation</option>
                        {designationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formErrors.designation && <span className="error-text">{formErrors.designation}</span>}
                    </div>

                    <div className="form-group">
                      <label>User Type *</label>
                      <select
                        name="userType"
                        value={userFormData.userType}
                        onChange={handleUserFormChange}
                        className={formErrors.userType ? "error" : ""}
                      >
                        <option value="">Select User Type</option>
                        {userTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formErrors.userType && <span className="error-text">{formErrors.userType}</span>}
                    </div>
                  </div>
                </div>

                <div className="add-user-actions">
                  <button type="submit" className="submit-btn">
                    {editingUserId ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>

            <div className="users-filter-section chart-card">
              <form className="filter-grid" onSubmit={handleFilterSubmit}>
                <div className="form-group">
                  <label>Mobile No</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={pendingFilters.mobileNo}
                    onChange={handleFilterChange}
                    placeholder="Filter by mobile"
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <select name="designation" value={pendingFilters.designation} onChange={handleFilterChange}>
                    <option value="">All Designations</option>
                    {designationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>HRMS ID</label>
                  <input
                    type="text"
                    name="hrmsId"
                    value={pendingFilters.hrmsId}
                    onChange={handleFilterChange}
                    placeholder="Filter by HRMS ID"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select name="department" value={pendingFilters.department} onChange={handleFilterChange}>
                    <option value="">All Departments</option>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>User Type</label>
                  <select name="userType" value={pendingFilters.userType} onChange={handleFilterChange}>
                    <option value="">All User Types</option>
                    {userTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-submit-wrap">
                  <button type="submit" className="submit-btn">Search / Submit</button>
                </div>
              </form>
            </div>

            <div className="users-list-container">
              <div className="users-table-toolbar">
                <h3>User Management List</h3>
                <input
                  type="text"
                  className="users-table-search"
                  placeholder="Search users..."
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="users-table-wrapper">
                <div className="users-table users-table-wide">
                  <div className="table-header table-cols-10">
                    <div>Sr No</div>
                    <div>Name</div>
                    <div>HRMS ID</div>
                    <div>Mobile No</div>
                    <div>Designation</div>
                    <div>Department</div>
                    <div>User Type</div>
                    <div>Reporting Officer</div>
                    <div>No. of Marks</div>
                    <div>Actions</div>
                  </div>

                  {pagedUsers.length === 0 ? (
                    <div className="table-empty-state">No users found.</div>
                  ) : (
                    pagedUsers.map((row, idx) => (
                      <div key={row.id} className="table-row table-cols-10">
                        <div>{(currentPage - 1) * pageSize + idx + 1}</div>
                        <div>{row.employeeName}</div>
                        <div>{row.hrmsId}</div>
                        <div>{row.mobileNo}</div>
                        <div>{row.designation}</div>
                        <div>{row.department}</div>
                        <div>{row.userType}</div>
                        <div>{row.reportingOfficer}</div>
                        <div>{row.marks ?? 0}</div>
                        <div className="table-action-cell">
                          <button type="button" className="action-btn action-edit" onClick={() => handleEditUser(row.id)}>
                            Edit
                          </button>
                          <button type="button" className="action-btn action-delete" onClick={() => handleDeleteUser(row.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="table-pagination-wrap">
                <button type="button" className="pagination-btn" onClick={goToPrevPage} disabled={currentPage === 1}>
                  Prev
                </button>
                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button type="button" className="pagination-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      
      case "Pending Approvals": {
        const getEmployeeName = (empLine) => {
          if (!empLine) return "—";
          const match = empLine.match(/Employee:\s*([^|]+)/i);
          return match ? match[1].trim() : empLine;
        };
        const getDivision = (empLine) => {
          if (!empLine) return "—";
          const match = empLine.match(/Division:\s*(.+)/i);
          return match ? match[1].trim() : "—";
        };
        const getAssessedBy = (byLine) => {
          if (!byLine) return "—";
          const match = byLine.match(/(?:Assessed by|Awaiting):\s*([^-]+)/i);
          return match ? match[1].trim() : byLine;
        };
        const getPendingSince = (byLine) => {
          if (!byLine) return "—";
          const match = byLine.match(/on\s+(\d{4}-\d{2}-\d{2})/i);
          return match ? match[1].trim() : "2026-04-12";
        };
        const getDesignation = (title) => {
          if (!title) return "—";
          return title.split(" - ")[0] || "Employee";
        };
        
        const handleViewDetails = (item) => {
          const tab = resolveAssessmentTab(item.title);
          setAssessmentRoleTab(tab);
          setOpenAssessmentId(item.id);
          setActivePage("Assessments");
        };

        return (
          <div className="reports-page">
            <div className="page-header" style={{ marginBottom: "20px" }}>
              <h2>Pending Approval Requests</h2>
              <p>Review safety and performance metrics, then approve or reject pending evaluations.</p>
            </div>

            {assessmentActionNotice && (
              <div className="notice-card success" style={{ marginBottom: "16px", padding: "12px 16px" }}>
                <span>✓</span>
                <p><strong>System Action:</strong> {assessmentActionNotice}</p>
                <button 
                  type="button" 
                  onClick={() => setAssessmentActionNotice("")} 
                  style={{ marginLeft: "auto", background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontWeight: "bold" }}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="reports-container">
              <div className="reports-table-section">
                <h3>Awaiting Sign-Off ({pendingAssessments.length})</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>HRMS ID</th>
                        <th>Employee Details</th>
                        <th>Designation</th>
                        <th>Submitted Score</th>
                        <th>Submitted By</th>
                        <th>Pending Since</th>
                        <th style={{ textAlign: "center" }}>Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAssessments.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                            No pending assessments require approval at this time.
                          </td>
                        </tr>
                      ) : (
                        pendingAssessments.map((item) => {
                          const { score, grade } = computeScoreAndGrade(item);
                          const empName = getEmployeeName(item.employeeLine);
                          const division = getDivision(item.employeeLine);
                          const designation = getDesignation(item.title);
                          const assessedBy = getAssessedBy(item.assessedByLine);
                          const pendingSince = getPendingSince(item.assessedByLine);

                          return (
                            <tr key={item.id}>
                              <td><strong>{item.id}</strong></td>
                              <td>
                                <div style={{ fontWeight: 600, color: "#0f172a" }}>{empName}</div>
                                <div style={{ fontSize: "11px", color: "#64748b" }}>Division: {division}</div>
                              </td>
                              <td>
                                <span style={{
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  backgroundColor: "#f1f5f9",
                                  color: "#475569",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  textTransform: "uppercase"
                                }}>
                                  {designation}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: score >= 90 ? "#16a34a" : score >= 80 ? "#2563eb" : "#dc2626" }}>
                                  {score}/100
                                </strong>
                                <span style={{
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  backgroundColor: "#eff6ff",
                                  color: "#2563eb",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  marginLeft: "6px"
                                }}>
                                  Grade {grade}
                                </span>
                              </td>
                              <td>{assessedBy}</td>
                              <td>{pendingSince}</td>
                              <td>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                  <button
                                    type="button"
                                    className="sm2-monitor-btn"
                                    onClick={() => handleViewDetails(item)}
                                    style={{
                                      backgroundColor: "#eff6ff",
                                      color: "#2563eb",
                                      border: "1px solid #bfdbfe",
                                      padding: "6px 12px",
                                      fontSize: "12px"
                                    }}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    type="button"
                                    className="sm2-monitor-btn"
                                    onClick={() => handleApproveAssessment(item.id)}
                                    style={{
                                      backgroundColor: "#f0fdf4",
                                      color: "#16a34a",
                                      border: "1px solid #bbf7d0",
                                      padding: "6px 12px",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="sm2-monitor-btn"
                                    onClick={() => handleRejectAssessment(item.id)}
                                    style={{
                                      backgroundColor: "#fef2f2",
                                      color: "#dc2626",
                                      border: "1px solid #fecaca",
                                      padding: "6px 12px",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      case "Assessments": {
        const visiblePendingAssessments = pendingAssessments.filter((item) => resolveAssessmentTab(item.title) === assessmentRoleTab);
        const activeAssessment = visiblePendingAssessments.find((item) => item.id === openAssessmentId) || null;
        const activeAnswers = activeAssessment ? answersByAssessment[activeAssessment.id] || buildPrefilledAnswers(activeAssessment.title) : {};
        const liveScore = activeAssessment ? calculateAssessmentScore(activeAnswers) : 0;
        const answeredCount = activeAssessment ? countAnsweredCriteria(activeAnswers) : 0;

        return (
          <div className="assessment-management-page">
            <div className="page-header">
              <h2>Assessment Management</h2>
              <p>SM/TM are reviewed for approval; TI is assessed and approved by AOM.</p>
            </div>

            <div className="assessment-role-tabs">
              <button
                type="button"
                className={`assessment-role-tab ${assessmentRoleTab === "SM" ? "active" : ""}`}
                onClick={() => {
                  setAssessmentRoleTab("SM");
                  setOpenAssessmentId(null);
                }}
              >
                SM Approval
              </button>
              <button
                type="button"
                className={`assessment-role-tab ${assessmentRoleTab === "TI" ? "active" : ""}`}
                onClick={() => {
                  setAssessmentRoleTab("TI");
                  setOpenAssessmentId(null);
                }}
              >
                TI Assessment + Approval
              </button>
              <button
                type="button"
                className={`assessment-role-tab ${assessmentRoleTab === "TM" ? "active" : ""}`}
                onClick={() => {
                  setAssessmentRoleTab("TM");
                  setOpenAssessmentId(null);
                }}
              >
                TM Approval
              </button>
            </div>

            {assessmentActionNotice && <div className="assessment-action-notice">{assessmentActionNotice}</div>}

            <div className="assessment-grid">
              <div className="assessment-section">
                <div className="section-header">
                  <h3>Pending in Selected Option</h3>
                  <span className="badge">{visiblePendingAssessments.length}</span>
                </div>

                <div className="assessment-actions assessment-bulk-actions">
                  <button type="button" className="btn-approve" onClick={handleApproveAllInSelectedOption}>
                    Approve All in Selected Option
                  </button>
                </div>

                {visiblePendingAssessments.length === 0 ? (
                  <p className="assessment-detail">No pending entries in this option.</p>
                ) : (
                  <div className="assessment-table-wrapper">
                    <div className="assessment-table">
                      <div className="assessment-table-header assessment-table-cols">
                        <div>HRMS ID</div>
                        <div>Employee Name</div>
                        <div>Designation</div>
                        <div>Assessment Status</div>
                        <div>Score</div>
                        <div>Grade</div>
                        <div>Last Assessed</div>
                        <div>Action</div>
                      </div>

                      {visiblePendingAssessments.map((item) => {
                        const row = buildAssessmentTableMeta(item);
                        return (
                          <div key={item.id} className="assessment-table-row assessment-table-cols">
                            <div>{row.hrmsId}</div>
                            <div>{row.employeeName}</div>
                            <div>{row.designation}</div>
                            <div>
                              <span className="status-badge pending">{row.status}</span>
                            </div>
                            <div>{row.score}</div>
                            <div>{row.grade}</div>
                            <div>{row.lastAssessed}</div>
                            <div className="assessment-actions row-actions">
                              <button type="button" className="btn-view" onClick={() => handleOpenAssessmentForm(item)}>
                                Open
                              </button>
                              {item.actionType === "assessment" && (
                                <button type="button" className="btn-assess" onClick={() => handleStartAssessment(item.id)}>
                                  Start
                                </button>
                              )}
                              <button type="button" className="btn-approve" onClick={() => handleApproveAssessment(item.id)}>
                                Approve
                              </button>
                              <button type="button" className="btn-reject" onClick={() => handleRejectAssessment(item.id)}>
                                Reject
                              </button>
                              <button
                                type="button"
                                className="btn-view"
                                onClick={() => handleViewAssessmentDetails(item.title, item.assessedByLine, item.statusLabel)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {activeAssessment && (
                <div className="assessment-section">
                  <div className="section-header">
                    <h3>Question Session: {activeAssessment.title}</h3>
                    <span className="badge">{assessmentRoleTab}</span>
                  </div>

                  <p className="assessment-detail">
                    {assessmentRoleTab === "TI"
                      ? "AOM should fill this assessment and approve."
                      : "Answers were filled earlier; AOM can review and edit before approval."}
                  </p>

                  <div className="question-toolbar">
                    <button
                      type="button"
                      className="btn-assess"
                      onClick={() => handleSelectAllYes(visiblePendingAssessments.map((item) => item.id), assessmentRoleTab)}
                    >
                      Select All Yes
                    </button>
                  </div>

                  <div className="score-preview-box">
                    <strong>Live Score: {liveScore}/100</strong>
                    <span>
                      Answered: {answeredCount}/{assessmentCriteria.length}
                    </span>
                  </div>

                  <div className="criteria-list">
                    {assessmentCriteria.map((criterion) => {
                      const mapKey = `${activeAssessment.id}:${criterion.key}`;
                      const isOpen = !!expandedCriterionKey[mapKey];
                      const currentValue = activeAnswers[criterion.key] || "";

                      return (
                        <div key={criterion.key} className="criteria-item">
                          <button
                            type="button"
                            className="criteria-toggle"
                            onClick={() => toggleCriterion(activeAssessment.id, criterion.key)}
                          >
                            <span>{criterion.label}</span>
                            <span>{criterion.marks} marks</span>
                          </button>

                          {isOpen && (
                            <div className="criteria-answer-row">
                              <label>
                                <input
                                  type="radio"
                                  name={`${activeAssessment.id}-${criterion.key}`}
                                  value="yes"
                                  checked={currentValue === "yes"}
                                  onChange={() => handleAnswerChange(activeAssessment.id, criterion.key, "yes")}
                                />
                                Yes
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name={`${activeAssessment.id}-${criterion.key}`}
                                  value="no"
                                  checked={currentValue === "no"}
                                  onChange={() => handleAnswerChange(activeAssessment.id, criterion.key, "no")}
                                />
                                No
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="assessment-actions">
                    <button type="button" className="btn-approve" onClick={() => handleApproveAssessment(activeAssessment.id)}>
                      Approve
                    </button>
                    <button type="button" className="btn-reject" onClick={() => handleRejectAssessment(activeAssessment.id)}>
                      Reject
                    </button>
                  </div>
                </div>
              )}

              <div className="assessment-section">
                <div className="section-header">
                  <h3>Approved by You</h3>
                  <span className="badge approved">{approvedAssessments.length}</span>
                </div>
                <div className="assessment-table-wrapper">
                  <div className="assessment-table">
                    <div className="assessment-table-header assessment-table-cols">
                      <div>HRMS ID</div>
                      <div>Employee Name</div>
                      <div>Designation</div>
                      <div>Assessment Status</div>
                      <div>Score</div>
                      <div>Grade</div>
                      <div>Last Assessed</div>
                      <div>Action</div>
                    </div>

                    {approvedAssessments.map((item) => {
                      const row = buildAssessmentTableMeta(item, true);
                      return (
                        <div key={item.id} className="assessment-table-row assessment-table-cols">
                          <div>{row.hrmsId}</div>
                          <div>{row.employeeName}</div>
                          <div>{row.designation}</div>
                          <div>
                            <span className="status-badge approved">{row.status}</span>
                          </div>
                          <div>{row.score}</div>
                          <div>{row.grade}</div>
                          <div>{row.lastAssessed}</div>
                          <div className="assessment-actions row-actions">
                            <button
                              type="button"
                              className="btn-view"
                              onClick={() => handleViewAssessmentDetails(item.title, item.detail, "Approved")}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              .assessment-management-page {
                padding: 20px 0;
                width: 100%;
                max-width: 100%;
                overflow-x: hidden;
              }

              .assessment-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
              }

              .assessment-role-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
                flex-wrap: wrap;
              }

              .assessment-role-tab {
                border: 1px solid #0d2948;
                color: #0d2948;
                background: #fff;
                padding: 8px 14px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
              }

              .assessment-role-tab.active {
                background: #0d2948;
                color: #fff;
              }

              .assessment-action-notice {
                margin: 0 0 16px;
                padding: 10px 14px;
                background: #e8f5e9;
                border: 1px solid #c8e6c9;
                color: #1b5e20;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
              }

              .assessment-section {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                min-width: 0;
              }

              .assessment-info-box {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
                padding: 20px;
                border-radius: 6px;
              }

              .assessment-info-box h4 {
                margin: 0 0 10px 0;
                color: #1976d2;
              }

              .assessment-info-box ul {
                margin: 0;
                padding-left: 20px;
                color: #424242;
                font-size: 13px;
              }

              .assessment-info-box li {
                margin-bottom: 8px;
              }

              .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 15px;
              }

              .section-header h3 {
                color: #333;
                margin: 0;
                font-size: 16px;
              }

              .badge {
                display: inline-block;
                background: #ff9800;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
              }

              .badge.approved {
                background: #4caf50;
              }

              .assessment-list {
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
              }

              .assessment-item {
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 15px;
                background: #fafafa;
                transition: all 0.3s ease;
              }

              .assessment-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }

              .assessment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
              }

              .assessment-header strong {
                color: #333;
                font-size: 14px;
              }

              .status-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
              }

              .status-badge.pending {
                background: #fff3cd;
                color: #856404;
              }

              .status-badge.approved {
                background: #d4edda;
                color: #155724;
              }

              .assessment-detail {
                color: #666;
                font-size: 12px;
                margin: 8px 0;
              }

              .assessment-score {
                color: #4caf50;
                font-size: 13px;
                font-weight: 600;
                margin: 8px 0 0 0;
              }

              .assessment-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                flex-wrap: wrap;
              }

              .row-actions {
                margin-top: 0;
                align-items: center;
              }

              .row-actions button {
                white-space: nowrap;
              }

              .assessment-bulk-actions {
                margin: -4px 0 12px;
              }

              .assessment-table-wrapper {
                width: 100%;
                overflow-x: auto;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                max-width: 100%;
              }

              .assessment-table {
                width: 100%;
                min-width: 0;
              }

              .assessment-table-header,
              .assessment-table-row {
                display: grid;
                align-items: center;
                gap: 8px;
                padding: 10px;
              }

              .assessment-table-cols {
                grid-template-columns: minmax(80px, 0.9fr) minmax(130px, 1.3fr) minmax(110px, 1fr) minmax(120px, 1fr) minmax(60px, 0.6fr) minmax(55px, 0.5fr) minmax(95px, 0.8fr) minmax(190px, 1.7fr);
              }

              .assessment-table-header {
                background: #1565c0;
                color: #fff;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.4px;
              }

              .assessment-table-row {
                border-bottom: 1px solid #e6e6e6;
                font-size: 13px;
                color: #1f2937;
                background: #fff;
              }

              .assessment-table-header > div,
              .assessment-table-row > div {
                min-width: 0;
                word-break: break-word;
              }

              .assessment-table-row:last-child {
                border-bottom: none;
              }

              .question-toolbar {
                margin: 12px 0;
              }

              .score-preview-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin: 8px 0 12px;
                padding: 10px 12px;
                border: 1px solid #d1e7dd;
                background: #f0fff4;
                border-radius: 6px;
                font-size: 13px;
                color: #1f2937;
              }

              .criteria-list {
                display: grid;
                gap: 10px;
              }

              .criteria-item {
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                overflow: hidden;
              }

              .criteria-toggle {
                width: 100%;
                border: none;
                background: #f8fafc;
                padding: 10px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
              }

              .criteria-answer-row {
                padding: 10px 12px;
                display: flex;
                gap: 20px;
                background: #fff;
                border-top: 1px solid #e0e0e0;
              }

              .criteria-answer-row label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: #374151;
              }

              .assessment-actions button {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
              }

              .btn-approve {
                background: #4caf50;
                color: white;
              }

              .btn-approve:hover {
                background: #45a049;
              }

              .btn-reject {
                background: #f44336;
                color: white;
              }

              .btn-reject:hover {
                background: #da190b;
              }

              .btn-assess {
                background: #2196f3;
                color: white;
              }

              .btn-assess:hover {
                background: #0b7dda;
              }

              .btn-view {
                background: #9c27b0;
                color: white;
              }

              .btn-view:hover {
                background: #7b1fa2;
              }

              @media (max-width: 1200px) {
                .assessment-table {
                  min-width: 980px;
                }
              }

              @media (max-width: 900px) {
                .assessment-table {
                  min-width: 900px;
                }
              }
            `}</style>
          </div>
        );
      }
      
      case "Reports":
        return (
          <div className="reports-page">
            <div className="page-header">
              <h2>Employee Reports</h2>
              <p>View assessments of employees in your jurisdiction</p>
            </div>

            <div className="reports-container">
              <div className="reports-filter">
                <input 
                  type="text" 
                  placeholder="Search by HRMS ID or Employee Name"
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd", width: "300px" }}
                />
                <select
                  value={reportDesignation}
                  onChange={(e) => setReportDesignation(e.target.value)}
                  style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd", marginLeft: "10px" }}
                >
                  <option>All Designations</option>
                  <option>Pointsman</option>
                  <option>Station Master</option>
                  <option>Train Manager</option>
                  <option>Traffic Inspector</option>
                  <option>Station Supervisor</option>
                </select>
              </div>

              <div className="reports-table-section">
                <h3>Subordinate Assessments</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>HRMS ID</th>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Last Assessed</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReportRows.map((row) => {
                        return (
                          <tr key={row.id}>
                            <td>{row.hrmsId}</td>
                            <td>{row.name}</td>
                            <td>{row.designation}</td>
                            <td>{row.score}</td>
                            <td>
                              <strong style={{ color: row.grade === "A" ? "#4caf50" : row.grade === "B" ? "#2196f3" : "#666" }}>
                                {row.grade}
                              </strong>
                            </td>
                            <td>{row.lastAssessed}</td>
                            <td>
                              {row.assessmentStatus === "Pending" ? (
                                <button
                                  type="button"
                                  onClick={() => handleAssessReport(row.id)}
                                  style={{ padding: "6px 12px", background: "#ff9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                >
                                  Assess
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleViewReport(row)}
                                  style={{ padding: "6px 12px", background: "#2196f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <style>{`
              .reports-page {
                padding: 20px 0;
              }

              .reports-container {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }

              .reports-filter {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e0e0e0;
              }

              .reports-table-section {
                margin-top: 20px;
              }

              .reports-table-section h3 {
                color: #333;
                margin-bottom: 15px;
              }

              .reports-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
              }

              .reports-table th {
                background: #0066cc;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: 600;
              }

              .reports-table td {
                padding: 12px 8px;
                border-bottom: 1px solid #e0e0e0;
              }

              .reports-table tr:hover {
                background: #f5f5f5;
              }

              .reports-table tbody tr:nth-child(even) {
                background: #fafafa;
              }
            `}</style>
          </div>
        );

      case "Settings":
        return (
          <div className="reports-page">
            <div className="page-header">
              <h2>Settings</h2>
              <p>Configure AOM console preferences</p>
            </div>

            <div className="reports-container settings-container">
              {settingsNotice && <div className="assessment-action-notice">{settingsNotice}</div>}

              <div className="settings-grid">
                <div className="settings-card">
                  <h3>Notification Preferences</h3>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={aomSettings.emailAlerts}
                      onChange={() => handleSettingsToggle("emailAlerts")}
                    />
                    <span>Email alerts for approvals and pending items</span>
                  </label>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={aomSettings.smsAlerts}
                      onChange={() => handleSettingsToggle("smsAlerts")}
                    />
                    <span>SMS alerts for critical safety and escalation events</span>
                  </label>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={aomSettings.weeklyDigest}
                      onChange={() => handleSettingsToggle("weeklyDigest")}
                    />
                    <span>Weekly performance digest summary</span>
                  </label>
                </div>

                <div className="settings-card">
                  <h3>Workflow Preferences</h3>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={aomSettings.autoEscalation}
                      onChange={() => handleSettingsToggle("autoEscalation")}
                    />
                    <span>Auto escalation for overdue assessments</span>
                  </label>

                  <div className="form-group">
                    <label>Default Assessment Tab</label>
                    <select
                      value={aomSettings.defaultAssessmentTab}
                      onChange={(e) => handleSettingsSelect("defaultAssessmentTab", e.target.value)}
                    >
                      <option value="SM">SM Approval</option>
                      <option value="TI">TI Assessment + Approval</option>
                      <option value="TM">TM Approval</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Report Visibility</label>
                    <select
                      value={aomSettings.reportVisibility}
                      onChange={(e) => handleSettingsSelect("reportVisibility", e.target.value)}
                    >
                      <option value="All">All Staff</option>
                      <option value="SM_TM_TI_SS">SM/TM/TI/SS</option>
                      <option value="Operational">Operational Roles Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="add-user-actions">
                <button type="button" className="submit-btn" onClick={handleSaveSettings}>
                  Save Settings
                </button>
              </div>
            </div>

            <style>{`
              .settings-container {
                display: grid;
                gap: 14px;
              }

              .settings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 14px;
              }

              .settings-card {
                border: 1px solid #dbe4ef;
                border-radius: 10px;
                padding: 14px;
                background: #f9fbfe;
              }

              .settings-card h3 {
                margin: 0 0 10px;
                color: #1f3653;
              }

              .settings-toggle {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 10px;
                color: #334155;
                font-size: 13px;
              }
            `}</style>
          </div>
        );

      case "Profile":
        return (
          <div className="reports-page">
            <div className="page-header">
              <h2>AOM Profile</h2>
              <p>Executive identity and access overview (read-only)</p>
            </div>

            <div className="reports-container premium-profile-shell">
              <section className="premium-profile-hero">
                <div className="premium-profile-identity">
                  <div className="premium-avatar">{(user?.hrmsId || "GM").substring(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="premium-eyebrow">Authorized Console Holder</p>
                    <h3>{user?.name || "AOM/General User"}</h3>
                    <span>{aomReadOnlyProfile.designation}</span>
                  </div>
                </div>

                <div className="premium-profile-tags">
                  <span>Read-Only</span>
                  <span>{aomReadOnlyProfile.zoneHq}</span>
                  <span>{aomReadOnlyProfile.division}</span>
                </div>
              </section>

              <section className="premium-profile-grid">
                <article>
                  <label>HRMS ID</label>
                  <strong>{user?.hrmsId || "GM_1001"}</strong>
                </article>
                <article>
                  <label>Designation</label>
                  <strong>{aomReadOnlyProfile.designation}</strong>
                </article>
                <article>
                  <label>Zone / Headquarters</label>
                  <strong>{aomReadOnlyProfile.zoneHq}</strong>
                </article>
                <article>
                  <label>Division</label>
                  <strong>{aomReadOnlyProfile.division}</strong>
                </article>
                <article>
                  <label>Reporting Officer</label>
                  <strong>{aomReadOnlyProfile.reportingOfficer}</strong>
                </article>
                <article>
                  <label>Contact Number</label>
                  <strong>{aomReadOnlyProfile.contact}</strong>
                </article>
                <article className="wide-card">
                  <label>Email</label>
                  <strong>{aomReadOnlyProfile.email}</strong>
                </article>
              </section>

              <section className="premium-profile-grid compact-grid">
                <article>
                  <label>Access Scope</label>
                  <strong>TI, SM, SS, TM, PM</strong>
                </article>
                <article>
                  <label>Approval Authority</label>
                  <strong>Division Operational Approvals</strong>
                </article>
                <article>
                  <label>Profile Mode</label>
                  <strong>View Only (No Edit Rights)</strong>
                </article>
              </section>
            </div>

            <style>{`
              .premium-profile-shell {
                background: linear-gradient(170deg, #fbfdff 0%, #f3f8ff 100%);
                border: 1px solid #dbe7f4;
              }

              .premium-profile-hero {
                border: 1px solid #d8e3f1;
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 14px;
                background: linear-gradient(120deg, #0f3155 0%, #1e4d7a 55%, #2a6aa3 100%);
                color: #f4f8ff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 14px;
                flex-wrap: wrap;
              }

              .premium-profile-identity {
                display: flex;
                align-items: center;
                gap: 12px;
              }

              .premium-avatar {
                width: 54px;
                height: 54px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.92);
                color: #153556;
                font-size: 20px;
                font-weight: 900;
                display: grid;
                place-items: center;
                border: 2px solid rgba(255, 255, 255, 0.5);
              }

              .premium-eyebrow {
                margin: 0;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.7px;
                opacity: 0.8;
                font-weight: 700;
              }

              .premium-profile-identity h3 {
                margin: 2px 0 3px;
                font-size: 24px;
                line-height: 1.1;
              }

              .premium-profile-identity span {
                font-size: 13px;
                opacity: 0.9;
              }

              .premium-profile-tags {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
              }

              .premium-profile-tags span {
                display: inline-flex;
                align-items: center;
                border: 1px solid rgba(255, 255, 255, 0.55);
                background: rgba(255, 255, 255, 0.14);
                color: #f2f8ff;
                border-radius: 999px;
                padding: 6px 10px;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.25px;
              }

              .premium-profile-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 10px;
                margin-bottom: 10px;
              }

              .compact-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                margin-bottom: 0;
              }

              .premium-profile-grid article {
                border: 1px solid #dfe7f1;
                border-radius: 10px;
                padding: 12px;
                background: #f8fbff;
                box-shadow: 0 4px 14px rgba(20, 48, 78, 0.06);
              }

              .premium-profile-grid article.wide-card {
                grid-column: span 2;
              }

              .premium-profile-grid label {
                display: block;
                font-size: 11px;
                color: #6b7a8f;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                margin-bottom: 5px;
                font-weight: 800;
              }

              .premium-profile-grid strong {
                color: #142841;
                font-size: 14px;
              }

              @media (max-width: 900px) {
                .premium-profile-grid article.wide-card {
                  grid-column: auto;
                }
              }
            `}</style>
          </div>
        );
      
      default:
        return (
          <div className="page-header">
            <h2>{activePage}</h2>
            <p style={{ marginTop: "20px", fontSize: "14px", color: "#6a7385" }}>
              {activePage} content will be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand-mark">IR</div>
          <h1>Indian Railway Evaluation System</h1>
        </div>
        <div className="topbar-right">
          <div className="admin-badge">
            <div className="avatar">{user.hrmsId.substring(0, 2).toUpperCase()}</div>
            <div>
              <strong>AOM Console</strong>
              <span>Zonal Headquarters</span>
            </div>
          </div>
          <button className="logout-btn" type="button" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="layout-grid">
        <aside className="sidebar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const stationPageActive = ["Station Management", "All Stations", "Add Station", "View / Edit Station"].includes(activePage);
            const assessmentsPageActive = ["Assessments", "Pending Approvals"].includes(activePage);
            const stationMastersActive = ["Station Masters", "Pointsman Under Station Master"].includes(activePage);
            const isActive = 
              item.label === "Station Management" ? stationPageActive : 
              item.label === "Assessments" ? assessmentsPageActive : 
              item.label === "Station Masters" ? stationMastersActive : 
              activePage === item.label;

            return (
              <button
                key={item.label}
                type="button"
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => handleSidebarClick(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="main-content">
          <div className="category-legend-row">
            <span className="category-legend-label">Category Legend</span>
            <div className="category-legend-circles">
              {[
                { key: "A", className: "category-a" },
                { key: "B", className: "category-b" },
                { key: "C", className: "category-c" },
                { key: "D", className: "category-d" }
              ].map((item) => (
                <span key={item.key} className={`category-circle ${item.className}`}>
                  {item.key}
                </span>
              ))}
            </div>
          </div>
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}

export default AOmModule;
