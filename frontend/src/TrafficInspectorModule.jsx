import { useMemo, useState, useEffect } from "react";
import {
  Activity, AlertTriangle, ArrowUpDown, Award, BarChart3, Building2,
  CheckCircle2, ChevronRight, ClipboardCheck,
  FileBarChart2, Filter, LogOut, Search, ShieldCheck,
  TrendingUp, TrendingDown, UserCircle2, Users, XCircle, Eye,
  Calendar, BookOpen, Clock, HeartHandshake, HelpCircle, Download,
  FileSpreadsheet, FileText, Bell, Plus, RefreshCw, Edit, Trash2, Lock
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

/* ═══════════════════════════════════════════
   NAV CONFIG
   (Full 12 Sidebar Menu Items)
═══════════════════════════════════════════ */
const NAV = [
  { key: "dashboard",      label: "Dashboard",                    icon: BarChart3 },
  { key: "stations",       label: "Stations",                     icon: Building2 },
  { key: "allUsers",       label: "All Users",                    icon: Users },
  { key: "reviewPM",       label: "Review PM Assessments",        icon: ClipboardCheck },
  { key: "assessSM",       label: "Assess Station Masters",       icon: Users },
  { key: "myAssessment",   label: "My Assessments",               icon: FileBarChart2 },
  { key: "pmePosition",    label: "PME Position",                 icon: Activity },
  { key: "refPosition",    label: "REF Position",                 icon: Award },
  { key: "inspections",    label: "Inspections",                  icon: Eye },
  { key: "counselling",    label: "Counselling",                  icon: HeartHandshake },
  { key: "reports",        label: "Reports",                      icon: Filter },
  { key: "profile",        label: "My Profile",                   icon: UserCircle2 },
];

const TI_PROFILE = {
  designation: "Traffic Inspector (Safety Officer)",
  jurisdiction: "Parbhani-Amla Section",
  hrmsId: "TI_1001",
  dob: "1985-05-14",
  doa: "2017-04-12",
  pmeDueDate: "2029-08-20",
  pmeDoneDate: "2025-08-20",
  isolatorCertDate: "2026-02-18",
  autoTrainingDate: "2026-03-05",
  counsellingDate: "2026-05-12"
};


/* ═══════════════════════════════════════════
   HELPERS & CATEGORIES
═══════════════════════════════════════════ */
const getCat = s => s >= 80 ? "A" : s >= 50 ? "B" : s >= 26 ? "C" : "D";
const CAT_C  = { A: "#16a34a", B: "#2563eb", C: "#d97706", D: "#dc2626" };
const CAT_B  = { A: "#dcfce7", B: "#dbeafe", C: "#fef3c7", D: "#fee2e2" };
const PIE_C  = ["#16a34a", "#2563eb", "#d97706", "#dc2626"];
const RISK_C = { High: "#dc2626", Medium: "#d97706", Low: "#16a34a" };
const RISK_B = { High: "#fee2e2", Medium: "#fef3c7", Low: "#dcfce7" };

/* ═══════════════════════════════════════════
   STATIC MOCK DATA — 12 STATIONS
═══════════════════════════════════════════ */
const INIT_STATIONS = [
  { id: "ST01", name: "Parbhani Junction", code: "PBN", avgScore: 82, safetyPct: 88, highRisk: 1, pointsmenCount: 10 },
  { id: "ST02", name: "Amla Junction", code: "AMLA", avgScore: 65, safetyPct: 71, highRisk: 3, pointsmenCount: 8 },
  { id: "ST03", name: "Badnera Junction", code: "BD", avgScore: 78, safetyPct: 83, highRisk: 1, pointsmenCount: 7 },
  { id: "ST04", name: "Nagpur Junction", code: "NGP", avgScore: 89, safetyPct: 94, highRisk: 0, pointsmenCount: 12 },
  { id: "ST05", name: "Akola Junction", code: "AK", avgScore: 71, safetyPct: 76, highRisk: 2, pointsmenCount: 8 },
  { id: "ST06", name: "Wardha Junction", code: "WR", avgScore: 80, safetyPct: 85, highRisk: 1, pointsmenCount: 9 },
  { id: "ST07", name: "Betul Station", code: "BYT", avgScore: 74, safetyPct: 80, highRisk: 1, pointsmenCount: 6 },
  { id: "ST08", name: "Itarsi Junction", code: "ET", avgScore: 85, safetyPct: 91, highRisk: 1, pointsmenCount: 11 },
  { id: "ST09", name: "Chandrapur Station", code: "CD", avgScore: 68, safetyPct: 73, highRisk: 2, pointsmenCount: 7 },
  { id: "ST10", name: "Gondia Junction", code: "G", avgScore: 82, safetyPct: 87, highRisk: 0, pointsmenCount: 9 },
  { id: "ST11", name: "Dhamangaon Station", code: "DMN", avgScore: 73, safetyPct: 79, highRisk: 1, pointsmenCount: 5 },
  { id: "ST12", name: "Pulgaon Junction", code: "PLO", avgScore: 76, safetyPct: 81, highRisk: 1, pointsmenCount: 6 }
];

const INIT_USERS = [
  // Station Masters
  { id: "SM_1001", name: "S. Deshmukh", role: "Station Master", designation: "Station Master", station: "Parbhani Junction", cat: "A", lastAssessDate: "2026-03-20", score: 86, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 11001", joiningDate: "2018-02-12" },
  { id: "SM_2102", name: "A. Kulkarni", role: "Station Master", designation: "Station Master", station: "Parbhani Junction", cat: "B", lastAssessDate: "2026-02-14", score: 72, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 11002", joiningDate: "2019-05-15" },
  { id: "SM_2201", name: "M. Patil", role: "Station Master", designation: "Station Master", station: "Amla Junction", cat: "A", lastAssessDate: "2026-03-12", score: 84, pmeStatus: "Fit", refStatus: "Pending", contact: "+91 98765 11003", joiningDate: "2016-08-20" },
  { id: "SM_2202", name: "R. Sharma", role: "Station Master", designation: "Station Master", station: "Amla Junction", cat: "C", lastAssessDate: "2026-01-30", score: 54, pmeStatus: "Pending", refStatus: "Pending", contact: "+91 98765 11004", joiningDate: "2021-10-10" },
  { id: "SM_2301", name: "V. Singh", role: "Station Master", designation: "Station Master", station: "Badnera Junction", cat: "A", lastAssessDate: "2026-03-15", score: 88, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 11005", joiningDate: "2015-04-12" },
  { id: "SM_2302", name: "T. Mehta", role: "Station Master", designation: "Station Master", station: "Badnera Junction", cat: "B", lastAssessDate: "2026-02-20", score: 71, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 11006", joiningDate: "2020-03-18" },
  { id: "SM_2401", name: "K. Raghuvanshi", role: "Station Master", designation: "Station Master", station: "Nagpur Junction", cat: "A", lastAssessDate: "2026-03-22", score: 92, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 11007", joiningDate: "2014-06-25" },
  { id: "SM_2501", name: "P. Wankhede", role: "Station Master", designation: "Station Master", station: "Akola Junction", cat: "B", lastAssessDate: "2026-03-01", score: 74, pmeStatus: "Overdue", refStatus: "Expired", contact: "+91 98765 11008", joiningDate: "2017-09-08" },
  
  // Pointsmen
  { id: "PM_1001", name: "K. Pawar", role: "Pointsman", designation: "Pointsman Grade I", station: "Parbhani Junction", cat: "A", lastAssessDate: "2026-04-10", score: 80, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 22001", joiningDate: "2020-01-10" },
  { id: "PM_1002", name: "R. Verma", role: "Pointsman", designation: "Pointsman Grade I", station: "Amla Junction", cat: "B", lastAssessDate: "2026-04-09", score: 68, pmeStatus: "Fit", refStatus: "Pending", contact: "+91 98765 22002", joiningDate: "2021-06-18" },
  { id: "PM_1003", name: "D. Rane", role: "Pointsman", designation: "Pointsman Grade II", station: "Amla Junction", cat: "D", lastAssessDate: "2026-04-08", score: 44, pmeStatus: "Unfit", refStatus: "Pending", contact: "+91 98765 22003", joiningDate: "2022-11-22" },
  { id: "PM_1004", name: "J. Shaikh", role: "Pointsman", designation: "Pointsman Grade I", station: "Badnera Junction", cat: "A", lastAssessDate: "2026-04-04", score: 88, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 22004", joiningDate: "2019-12-05" },
  { id: "PM_1005", name: "A. Gade", role: "Pointsman", designation: "Pointsman Grade II", station: "Akola Junction", cat: "C", lastAssessDate: "2026-03-24", score: 58, pmeStatus: "Overdue", refStatus: "Cleared", contact: "+91 98765 22005", joiningDate: "2023-04-15" },
  { id: "PM_1006", name: "S. Meshram", role: "Pointsman", designation: "Pointsman Grade I", station: "Nagpur Junction", cat: "A", lastAssessDate: "2026-03-28", score: 94, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 22006", joiningDate: "2018-05-19" },
  { id: "PM_1007", name: "G. Chawla", role: "Pointsman", designation: "Pointsman Grade II", station: "Itarsi Junction", cat: "A", lastAssessDate: "2026-03-14", score: 82, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 22007", joiningDate: "2020-07-20" },
  { id: "PM_1008", name: "H. Singh", role: "Pointsman", designation: "Pointsman Grade I", station: "Wardha Junction", cat: "B", lastAssessDate: "2026-03-10", score: 76, pmeStatus: "Fit", refStatus: "Expired", contact: "+91 98765 22008", joiningDate: "2017-02-28" },
  { id: "PM_1009", name: "B. Yadav", role: "Pointsman", designation: "Pointsman Grade II", station: "Chandrapur Station", cat: "C", lastAssessDate: "2026-03-05", score: 51, pmeStatus: "Overdue", refStatus: "Pending", contact: "+91 98765 22009", joiningDate: "2022-09-01" },
  { id: "PM_1010", name: "N. Dewangan", role: "Pointsman", designation: "Pointsman Grade I", station: "Gondia Junction", cat: "A", lastAssessDate: "2026-03-18", score: 85, pmeStatus: "Fit", refStatus: "Cleared", contact: "+91 98765 22010", joiningDate: "2019-08-11" }
];

const MONTHLY = [
  { month: "Nov 25", assessments: 14, avgScore: 72, safetyAvg: 74 },
  { month: "Dec 25", assessments: 18, avgScore: 74, safetyAvg: 76 },
  { month: "Jan 26", assessments: 24, avgScore: 71, safetyAvg: 73 },
  { month: "Feb 26", assessments: 32, avgScore: 77, safetyAvg: 79 },
  { month: "Mar 26", assessments: 38, avgScore: 80, safetyAvg: 82 },
  { month: "Apr 26", assessments: 42, avgScore: 83, safetyAvg: 85 }
];

const INIT_PM_ASSESSMENTS = [
  {
    id: "PA_1001", pointsmanName: "K. Pawar", hrmsId: "PM_1001",
    station: "Parbhani Junction", assessingSM: "S. Deshmukh",
    submissionDate: "2026-04-10", status: "Pending",
    originalSections: [
      { title: "Knowledge of Rules",      score: 20, max: 25 },
      { title: "Alertness & Observation", score: 18, max: 25 },
      { title: "Safety Record",           score: 12, max: 15 },
      { title: "Leadership & Management", score: 11, max: 15 },
      { title: "Discipline",              score: 8,  max: 10 },
      { title: "Appearance & Neatness",   score: 7,  max: 10 },
    ],
    meta: { pmeStatus: "Fit", refStatus: "Cleared", alcoholicStatus: "Non-Alcoholic" },
    tiRemarks: "", tiModified: false, auditTrail: []
  },
  {
    id: "PA_1002", pointsmanName: "R. Verma", hrmsId: "PM_1002",
    station: "Amla Junction", assessingSM: "M. Patil",
    submissionDate: "2026-04-09", status: "Pending",
    originalSections: [
      { title: "Knowledge of Rules",      score: 17, max: 25 },
      { title: "Alertness & Observation", score: 16, max: 25 },
      { title: "Safety Record",           score: 10, max: 15 },
      { title: "Leadership & Management", score: 9,  max: 15 },
      { title: "Discipline",              score: 6,  max: 10 },
      { title: "Appearance & Neatness",   score: 6,  max: 10 },
    ],
    meta: { pmeStatus: "Fit", refStatus: "Pending", alcoholicStatus: "Non-Alcoholic" },
    tiRemarks: "", tiModified: false, auditTrail: []
  },
  {
    id: "PA_1003", pointsmanName: "D. Rane", hrmsId: "PM_1003",
    station: "Amla Junction", assessingSM: "M. Patil",
    submissionDate: "2026-04-08", status: "Pending",
    originalSections: [
      { title: "Knowledge of Rules",      score: 14, max: 25 },
      { title: "Alertness & Observation", score: 13, max: 25 },
      { title: "Safety Record",           score: 8,  max: 15 },
      { title: "Leadership & Management", score: 7,  max: 15 },
      { title: "Discipline",              score: 4,  max: 10 },
      { title: "Appearance & Neatness",   score: 4,  max: 10 },
    ],
    meta: { pmeStatus: "Unfit", refStatus: "Pending", alcoholicStatus: "Alcoholic" },
    tiRemarks: "", tiModified: false, auditTrail: []
  },
  {
    id: "PA_1004", pointsmanName: "J. Shaikh", hrmsId: "PM_1004",
    station: "Badnera Junction", assessingSM: "V. Singh",
    submissionDate: "2026-04-04", status: "Approved",
    originalSections: [
      { title: "Knowledge of Rules",      score: 23, max: 25 },
      { title: "Alertness & Observation", score: 22, max: 25 },
      { title: "Safety Record",           score: 15, max: 15 },
      { title: "Leadership & Management", score: 13, max: 15 },
      { title: "Discipline",              score: 9,  max: 10 },
      { title: "Appearance & Neatness",   score: 9,  max: 10 },
    ],
    finalSections: [
      { title: "Knowledge of Rules",      score: 23, max: 25 },
      { title: "Alertness & Observation", score: 22, max: 25 },
      { title: "Safety Record",           score: 15, max: 15 },
      { title: "Leadership & Management", score: 13, max: 15 },
      { title: "Discipline",              score: 9,  max: 10 },
      { title: "Appearance & Neatness",   score: 9,  max: 10 },
    ],
    meta: { pmeStatus: "Fit", refStatus: "Cleared", alcoholicStatus: "Non-Alcoholic" },
    tiRemarks: "Excellent field performance. Approved as submitted.",
    tiModified: false, approvalDate: "2026-04-05",
    auditTrail: [{ action: "Approved without modification", by: "TI R. Khan", date: "2026-04-05" }]
  },
];

const TI_SM_CRITERIA = [
  { key: "stationMgmt",  label: "Station Management",          weight: 5, count: 5,
    criteria: ["Efficient train handling", "Accurate scheduling", "Staff deployment", "Complaint resolution", "Log maintenance"] },
  { key: "safety",       label: "Safety & Compliance",         weight: 4, count: 5,
    criteria: ["Safety protocols followed", "Incident reporting timely", "Emergency drill conducted", "Hazard identification", "PPE enforced"] },
  { key: "staffSupervision", label: "Staff Supervision",       weight: 3, count: 5,
    criteria: ["Regular briefings conducted", "Feedback provided to staff", "Leave management", "Timekeeping enforced", "Staff morale maintained"] },
  { key: "documentation", label: "Documentation & Reporting",   weight: 3, count: 5,
    criteria: ["Daily log accurate", "Monthly report submitted", "Incident records maintained", "Assessment documents filed", "Handover notes complete"] },
  { key: "emergency",    label: "Emergency Handling",          weight: 5, count: 5,
    criteria: ["Responded to emergencies promptly", "Coordinated with control office", "Passenger management during disruption", "Track clear protocol followed", "Post-incident review done"] },
];

const defaultSMForm = () => ({
  stationMgmt:      Array(5).fill(null),
  safety:           Array(5).fill(null),
  staffSupervision: Array(5).fill(null),
  documentation:    Array(5).fill(null),
  emergency:        Array(5).fill(null),
  knowledgeMarks: "", alcoholicStatus: "", pmeStatus: "Fit",
  refStatus: "Cleared", counselling: "Not Required",
  automaticTraining: "Not Required", remarks: ""
});

const computeSMScore = form => {
  let total = 0;
  TI_SM_CRITERIA.forEach(c => {
    form[c.key].forEach(v => { if (v === "Yes") total += c.weight; });
  });
  const km = Math.min(parseInt(form.knowledgeMarks) || 0, 25);
  return { ynScore: Math.min(total, 75), knowledge: km, total: Math.min(total, 75) + km };
};

const INIT_SM_LIST = [
  { id: "SMA_5001", name: "S. Deshmukh", hrmsId: "SM_1001", station: "Parbhani Junction", lastDate: "2026-03-20", status: "Pending" },
  { id: "SMA_5002", name: "M. Patil",    hrmsId: "SM_2201", station: "Amla Junction",       lastDate: "2026-03-12", status: "Pending" },
  { id: "SMA_5003", name: "V. Singh",    hrmsId: "SM_2301", station: "Badnera Junction",   lastDate: "2026-03-15", status: "Submitted" },
  { id: "SMA_5004", name: "A. Kulkarni", hrmsId: "SM_2102", station: "Parbhani Junction",  lastDate: "2026-02-14", status: "Pending" },
];


const INIT_INSPECTIONS = [
  { id: "IN_101", date: "2026-05-10", station: "Amla Junction", officer: "TI R. Khan", observations: "Siding point interlocking operation checked. Satisfactory speed compliance.", risk: "Low", status: "Closed" },
  { id: "IN_102", date: "2026-05-18", station: "Chandrapur Station", officer: "TI R. Khan", observations: "Joint gap clearance in crossing 12B slightly wide. Safety Speed restriction of 15km/h advised.", risk: "Medium", status: "Active" },
  { id: "IN_103", date: "2026-05-24", station: "Akola Junction", officer: "TI R. Khan", observations: "Station Master logs audit. Slight delay in registering daily block clearing times.", risk: "Low", status: "Pending Action" }
];

const INIT_COUNSELLING = [
  { id: "CL_101", date: "2026-05-12", staffName: "D. Rane", designation: "Pointsman Grade II", station: "Amla Junction", topics: "Alcoholic rehabilitation counseling. Safety and alertness briefing.", duration: "45 mins", progress: "Under Monitor" },
  { id: "CL_102", date: "2026-05-20", staffName: "A. Gade", designation: "Pointsman Grade II", station: "Akola Junction", topics: "Periodic medical exam preparation. Rest compliance counseling.", duration: "30 mins", progress: "Completed" }
];

// Interactive quiz questions for self-assessments
const TI_QUIZ = [
  { q: "What whistle code must be sounded when a train is passing through a station without stopping?", opts: ["One long", "Continuous short blasts", "One long and one short", "Two short blasts"], ans: 0 },
  { q: "During track circuit failures, what token is issued to authorize train movements into block sections?", opts: ["T/369(3b)", "T/806 (Shunting Order)", "Caution Order (T/B)", "Line Clear Ticket"], ans: 0 },
  { q: "Fouling mark lines indicate:", opts: ["Defective rail marker", "Safe distance clearance boundary limit", "Points switching end point", "Speed restrictions end"], ans: 1 },
  { q: "Periodic Refresher Courses (REF) for Pointsman Grade I must be completed every:", opts: ["1 Year", "2 Years", "3 Years", "5 Years"], ans: 2 },
  { q: "A Signal showing double yellow lights warns the driver to:", opts: ["Stop immediately", "Prepare to stop at the next signal", "Proceed at full authorized speed", "Sound whistle continuously"], ans: 1 },
  { q: "How often must a Traffic Inspector audit the Station log registers?", opts: ["Weekly", "Monthly", "Quarterly", "Bi-annually"], ans: 1 },
  { q: "During a total failure of communications on double lines, which authority form is issued?", opts: ["T/A 602", "T/B 602", "T/C 602", "T/D 602"], ans: 1 },
  { q: "What whistle code indicates 'Train Parting'?", opts: ["One long, one short", "Two long, two short", "One long, one short, one long, one short", "Continuous short blasts"], ans: 2 },
  { q: "A signal with double yellow aspect warns the driver to:", opts: ["Proceed at full speed", "Prepare to stop at the next signal", "Proceed with 15km/h", "Stop immediately"], ans: 1 },
  { q: "Under normal conditions, a gate signal shows what aspect when the level crossing gate is open to road traffic?", opts: ["Red", "Yellow", "Green", "Double Yellow"], ans: 0 },
  { q: "Refresher training for Pointsman Grade I must be completed every:", opts: ["1 Year", "2 Years", "3 Years", "5 Years"], ans: 2 },
  { q: "Periodic medical examinations (PME) for Station Masters must be completed every four years until age:", opts: ["45", "50", "55", "60"], ans: 2 },
  { q: "Isolation of a running line from sidings is designed to prevent:", opts: ["Over-speeding", "Collisions due to rolling stock escape", "Signal failures", "Interlocking failures"], ans: 1 },
  { q: "What whistle code is sounded when entering a tunnel?", opts: ["One long blast", "Continuous short blasts", "Two short blasts", "Continuous long whistle"], ans: 3 },
  { q: "Fuses or detonators are used to protect track defects at a distance of:", opts: ["600m and 1200m", "500m and 1000m", "800m and 2000m", "1200m and 2000m"], ans: 0 },
  { q: "What class of station has points and signals interlocked, enabling line clear exchange?", opts: ["Class A", "Class B", "Class C", "Non-interlocked"], ans: 1 },
  { q: "The standard shunting authority form is:", opts: ["T/369(3b)", "T/806", "T/A 901", "T/511"], ans: 1 },
  { q: "If a Station Master detects a hot axle on a passing train, they must first:", opts: ["Call the division control office", "Display danger hand signal and stop the train", "Inform the next station", "Log the event"], ans: 1 },
  { q: "The maximum speed under 'Caution Order' when no speed limit is specified is:", opts: ["15 km/h", "30 km/h", "45 km/h", "20 km/h"], ans: 0 },
  { q: "Which class of station serves strictly as a block hut without point switches?", opts: ["Class A", "Class B", "Class C", "Class D"], ans: 2 },
  { q: "Who is responsible for point locking during shunting operations?", opts: ["Pointsman", "Station Master", "Cabin Master", "Train Manager"], ans: 1 },
  { q: "A flashing red aspect on a signal indicates:", opts: ["Track circuit defect", "Proceed with caution", "Stop and proceed after 1 min", "Gate signal alert"], ans: 2 },
  { q: "A trap point isolation is used to protect:", opts: ["Passenger platform lines", "Running lines from siding vehicles", "Level crossings", "Relay room locking"], ans: 1 },
  { q: "Refresher training for Traffic Inspectors must be completed every:", opts: ["3 Years", "5 Years", "2 Years", "None"], ans: 0 },
  { q: "During block instrument failure, line clear is authorized using:", opts: ["Token", "Paper Line Clear Ticket", "Cabin ticket", "Hand signal"], ans: 1 }
];

function generateTiMockResponses(score) {
  const correctCount = Math.round((score / 100) * 25);
  const arr = Array(25).fill(null);
  const indices = Array.from({ length: 25 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const correctIndices = new Set(indices.slice(0, correctCount));
  for (let i = 0; i < 25; i++) {
    const q = TI_QUIZ[i];
    if (correctIndices.has(i)) {
      arr[i] = q.ans;
    } else {
      arr[i] = (q.ans + 1) % q.opts.length;
    }
  }
  return arr;
}

const getPerformanceSummaryText = (score, sections) => {
  if (!sections || sections.length === 0) return "Self-compliance check completed successfully.";
  const lowestSec = [...sections].sort((a, b) => a.marks - b.marks)[0];
  const highestSec = [...sections].sort((a, b) => b.marks - a.marks)[0];

  let summary = `Assessment score achieved: ${score}/100 (${score >= 80 ? 'Outstanding Competency' : score >= 50 ? 'Satisfactory Operations' : 'Requires Training'}). `;
  summary += `Demonstrated excellent compliance in "${highestSec.title}" scoring ${highestSec.marks}/${highestSec.outOf} marks. `;
  if (lowestSec.marks < lowestSec.outOf) {
    summary += `However, some area of improvement is observed in "${lowestSec.title}" (${lowestSec.marks}/${lowestSec.outOf}). It is recommended to review the standard operating manuals and safety bulletins for this section.`;
  } else {
    summary += `Achieved perfect scores across all compliance parameters.`;
  }
  return summary;
};

const INIT_TI_ASSESS_HISTORY = [
  {
    id: 1, date: "2026-03-20", period: "Q1 2026", assessedBy: "AOM_GM_1001 — P. Joshi",
    totalScore: 88, category: "A", approvalStatus: "Approved",
    aomRemarks: "Outstanding supervisory performance. Excellent cross-station coordination.",
    sections: [
      { title: "Whistle Codes & Hand Signals",          marks: 18, outOf: 20 },
      { title: "Token & Line Clear Authorities",        marks: 17, outOf: 20 },
      { title: "Station Interlocking & Track Circuits", marks: 18, outOf: 20 },
      { title: "Shunting Operations & Point Locking",   marks: 17, outOf: 20 },
      { title: "Gate Signals & Siding Isolation",        marks: 18, outOf: 20 },
    ],
    userAnswers: generateTiMockResponses(88)
  },
  {
    id: 2, date: "2025-12-15", period: "Q4 2025", assessedBy: "AOM_GM_1001 — P. Joshi",
    totalScore: 81, category: "A", approvalStatus: "Approved",
    aomRemarks: "Good performance. Minor issues in documentation speed.",
    sections: [
      { title: "Whistle Codes & Hand Signals",          marks: 16, outOf: 20 },
      { title: "Token & Line Clear Authorities",        marks: 16, outOf: 20 },
      { title: "Station Interlocking & Track Circuits", marks: 17, outOf: 20 },
      { title: "Shunting Operations & Point Locking",   marks: 15, outOf: 20 },
      { title: "Gate Signals & Siding Isolation",        marks: 17, outOf: 20 },
    ],
    userAnswers: generateTiMockResponses(81)
  },
  {
    id: 3, date: "2025-09-10", period: "Q3 2025", assessedBy: "AOM_GM_1001 — P. Joshi",
    totalScore: 93, category: "A", approvalStatus: "Approved",
    aomRemarks: "Exemplary. Best performing TI in the division this quarter.",
    sections: [
      { title: "Whistle Codes & Hand Signals",          marks: 19, outOf: 20 },
      { title: "Token & Line Clear Authorities",        marks: 18, outOf: 20 },
      { title: "Station Interlocking & Track Circuits", marks: 19, outOf: 20 },
      { title: "Shunting Operations & Point Locking",   marks: 18, outOf: 20 },
      { title: "Gate Signals & Siding Isolation",        marks: 19, outOf: 20 },
    ],
    userAnswers: generateTiMockResponses(93)
  }
];


/* ═══════════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════════ */
const TiTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ti2-tooltip">
      <strong>{label}</strong>
      {payload.map(p => <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN MODULE COMPONENT
═══════════════════════════════════════════ */
export default function TrafficInspectorModule({ user, onLogout }) {
  const [activePage, setActivePage]       = useState("dashboard");
  const [statusMsg, setStatusMsg]         = useState("");

  // Notifications Bell
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "danger", message: "CRITICAL: PME overdue for SM P. Wankhede (Akola Junction)", time: "Just now", read: false },
    { id: 2, type: "warning", message: "Safety alert: Joint gap crack observed at Chandrapur Crossing 12B", time: "2 hours ago", read: false },
    { id: 3, type: "success", message: "Audit cleared: Parbhani Junction monthly logs verified.", time: "1 day ago", read: true }
  ]);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: "2026-05-27 10:00:12", event: "User session initialized.", details: "IP: 10.24.12.8" },
    { id: 2, timestamp: "2026-05-27 10:02:44", event: "Dashboard KPI matrices synced successfully.", details: "Calculations based on 12 stations" }
  ]);

  // Master Users & Stations States
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("ti_users");
    return saved ? JSON.parse(saved) : INIT_USERS;
  });
  useEffect(() => {
    localStorage.setItem("ti_users", JSON.stringify(users));
  }, [users]);

  const [stations, setStations] = useState(() => {
    const saved = localStorage.getItem("ti_stations");
    return saved ? JSON.parse(saved) : INIT_STATIONS;
  });
  useEffect(() => {
    localStorage.setItem("ti_stations", JSON.stringify(stations));
  }, [stations]);

  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [newStationData, setNewStationData] = useState({ name: "", code: "" });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    id: "",
    name: "",
    role: "Station Master",
    designation: "Station Master",
    station: "",
    contact: "",
    joiningDate: "",
    pmeStatus: "Fit",
    refStatus: "Cleared"
  });

  const [pmList, setPmList]               = useState(INIT_PM_ASSESSMENTS);
  const [smList, setSmList]               = useState(() => {
    const saved = localStorage.getItem("ti_sm_list");
    return saved ? JSON.parse(saved) : INIT_SM_LIST;
  });
  useEffect(() => {
    localStorage.setItem("ti_sm_list", JSON.stringify(smList));
  }, [smList]);

  useEffect(() => {
    // Migration: automatically update any references of SM_2101 to SM_1001 in localStorage
    const savedUsers = localStorage.getItem("ti_users");
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        let changed = false;
        const updated = parsed.map(u => {
          if (u.id === "SM_2101") {
            changed = true;
            return { ...u, id: "SM_1001" };
          }
          return u;
        });
        if (changed) {
          localStorage.setItem("ti_users", JSON.stringify(updated));
          setUsers(updated);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedSmList = localStorage.getItem("ti_sm_list");
    if (savedSmList) {
      try {
        const parsed = JSON.parse(savedSmList);
        let changed = false;
        const updated = parsed.map(s => {
          if (s.hrmsId === "SM_2101") {
            changed = true;
            return { ...s, hrmsId: "SM_1001" };
          }
          return s;
        });
        if (changed) {
          localStorage.setItem("ti_sm_list", JSON.stringify(updated));
          setSmList(updated);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const [inspections, setInspections]     = useState(INIT_INSPECTIONS);
  const [counsellings, setCounsellings]   = useState(INIT_COUNSELLING);
  
  // Interactive Self-Assessment State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tiAssessments, setTiAssessments] = useState(() => {
    const saved = localStorage.getItem("ti_assessments");
    let history = saved ? JSON.parse(saved) : INIT_TI_ASSESS_HISTORY;
    let changed = false;
    history = history.map(item => {
      if (!item.userAnswers) {
        changed = true;
        return {
          ...item,
          userAnswers: generateTiMockResponses(item.totalScore)
        };
      }
      return item;
    });
    if (changed) {
      localStorage.setItem("ti_assessments", JSON.stringify(history));
    }
    return history;
  });
  useEffect(() => {
    localStorage.setItem("ti_assessments", JSON.stringify(tiAssessments));
  }, [tiAssessments]);

  const [quizState, setQuizState]         = useState("idle"); // "idle" | "quiz" | "result"
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers]     = useState(Array(25).fill(null));
  const [latestQuizScore, setLatestQuizScore] = useState(null);

  // AOM Assigned Exam State
  const [isExamAssigned, setIsExamAssigned] = useState(() => localStorage.getItem("ti_exam_assigned") === "true");

  // Search, Filters & Expanded Blocks
  const [selectedReportUserId, setSelectedReportUserId] = useState(null);
  const [selectedSM, setSelectedSM]       = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stSearch, setStSearch]           = useState("");
  const [stCatFilter, setStCatFilter]     = useState("All");
  
  // All Users Page Controls
  const [userSearch, setUserSearch]       = useState("");
  const [userStationFilter, setUserStationFilter] = useState("All");
  const [userDesignationFilter, setUserDesignationFilter] = useState("All");
  const [userCategoryFilter, setUserCategoryFilter] = useState("All");
  const [userRiskFilter, setUserRiskFilter] = useState("All");
  
  // Edit User Modal State
  const [editingUser, setEditingUser]     = useState(null);
  const [transferringUser, setTransferringUser] = useState(null);

  // PM Review Page States
  const [reviewTab, setReviewTab]         = useState("Pending");
  const [reviewSearch, setReviewSearch]   = useState("");
  const [reviewStation, setReviewStation] = useState("All");
  const [selectedPmId, setSelectedPmId]   = useState(null);
  const [editSections, setEditSections]   = useState({});
  const [tiRemarks, setTiRemarks]         = useState({});
  const [showAudit, setShowAudit]         = useState({});
  const [rejectMode, setRejectMode]       = useState({});

  // SM Assess States
  const [activeSmId, setActiveSmId]       = useState(null);
  const [smForms, setSmForms]             = useState(() => {
    const saved = localStorage.getItem("ti_sm_forms");
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    localStorage.setItem("ti_sm_forms", JSON.stringify(smForms));
  }, [smForms]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUsers = localStorage.getItem("ti_users");
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedStations = localStorage.getItem("ti_stations");
      if (savedStations) setStations(JSON.parse(savedStations));

      const savedSmList = localStorage.getItem("ti_sm_list");
      if (savedSmList) setSmList(JSON.parse(savedSmList));

      const savedSmForms = localStorage.getItem("ti_sm_forms");
      if (savedSmForms) setSmForms(JSON.parse(savedSmForms));

      setIsExamAssigned(localStorage.getItem("ti_exam_assigned") === "true");
    };
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const current = localStorage.getItem("ti_exam_assigned") === "true";
      setIsExamAssigned(current);
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [smLocked, setSmLocked]           = useState({});

  useEffect(() => {
    if (activeSmId) {
      const smAssess = smList.find(s => s.id === activeSmId);
      if (smAssess && smAssess.examScore !== undefined) {
        setSmForms(prev => {
          const existing = prev[activeSmId];
          if (existing && existing.knowledgeMarks !== smAssess.examScore.toString()) {
            return {
              ...prev,
              [activeSmId]: {
                ...existing,
                knowledgeMarks: smAssess.examScore.toString()
              }
            };
          }
          return prev;
        });
      }
    }
  }, [smList, activeSmId]);

  // Reports Filters
  const [rpStation, setRpStation]         = useState("All");
  const [rpCat, setRpCat]                 = useState("All");
  const [rpRisk, setRpRisk]               = useState("All");
  const [rpSearch, setRpSearch]           = useState("");
  const [rpSort, setRpSort]               = useState("date-desc");

  // Inspections / Counselling forms
  const [showInspForm, setShowInspForm]   = useState(false);
  const [newInsp, setNewInsp]             = useState({ station: "Parbhani Junction", officer: "TI R. Khan", observations: "", risk: "Low" });
  const [showCounForm, setShowCounForm]   = useState(false);
  const [newCoun, setNewCoun]             = useState({ staffName: "", designation: "Pointsman Grade I", station: "Parbhani Junction", topics: "", duration: "30 mins", progress: "Under Monitor" });

  // Dashboard filtering & scroll toggle
  const [dbStationFilter, setDbStationFilter] = useState("All");
  const [dbSearchQuery, setDbSearchQuery] = useState("");

  const tiName = user?.name  || "R. Khan";
  const tiId   = user?.hrmsId || "TI_1001";

  const myStations = useMemo(() => {
    return stations.filter(st => !st.assignedTi || st.assignedTi === tiId);
  }, [stations, tiId]);

  const handleAddStationSubmit = (e) => {
    e.preventDefault();
    if (!newStationData.name.trim() || !newStationData.code.trim()) {
      setStatusMsg("Station name and code are required.");
      return;
    }
    const codeUpper = newStationData.code.trim().toUpperCase();
    if (stations.some(st => st.code.toUpperCase() === codeUpper)) {
      setStatusMsg(`Station with code ${codeUpper} already exists!`);
      return;
    }
    const newStation = {
      id: "ST_" + Date.now(),
      name: newStationData.name.trim(),
      code: codeUpper,
      avgScore: 80,
      safetyPct: 100,
      highRisk: 0,
      pointsmenCount: 0,
      assignedTi: tiId
    };
    setStations(prev => [...prev, newStation]);
    setShowAddStationModal(false);
    setNewStationData({ name: "", code: "" });
    setStatusMsg(`Station "${newStation.name}" successfully added under your jurisdiction.`);
    addAuditLog("Added New Station", `Station: ${newStation.name} (${newStation.code})`);
    triggerNotification("success", `Added Station: ${newStation.name} (${newStation.code})`);
  };

  const openAddUserModal = () => {
    setNewUserData({
      id: "",
      name: "",
      role: "Station Master",
      designation: "Station Master",
      station: myStations[0]?.name || "",
      contact: "",
      joiningDate: new Date().toISOString().slice(0, 10),
      pmeStatus: "Fit",
      refStatus: "Cleared"
    });
    setShowAddUserModal(true);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.id.trim() || !newUserData.station || !newUserData.contact.trim() || !newUserData.joiningDate) {
      setStatusMsg("Please fill out all required fields.");
      return;
    }
    
    let finalId = newUserData.id.trim();
    if (newUserData.role === "Station Master") {
      if (!finalId.startsWith("SM_")) {
        finalId = "SM_" + finalId.replace(/^SM_|^PM_/i, "");
      }
    } else if (newUserData.role === "Pointsman") {
      if (!finalId.startsWith("PM_")) {
        finalId = "PM_" + finalId.replace(/^SM_|^PM_/i, "");
      }
    }

    if (users.some(u => u.id === finalId)) {
      setStatusMsg(`User with Employee ID ${finalId} already exists!`);
      return;
    }

    const newUser = {
      id: finalId,
      name: newUserData.name.trim(),
      role: newUserData.role,
      designation: newUserData.role === "Station Master" ? "Station Master" : newUserData.designation,
      station: newUserData.station,
      cat: "A",
      lastAssessDate: new Date().toISOString().slice(0, 10),
      score: 80,
      pmeStatus: newUserData.pmeStatus,
      refStatus: newUserData.refStatus,
      contact: newUserData.contact.trim(),
      joiningDate: newUserData.joiningDate
    };

    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    
    setStatusMsg(`Personnel "${newUser.name}" successfully added and rostered.`);
    addAuditLog("Added New User", `Staff: ${newUser.name} (${newUser.id})`);
    triggerNotification("success", `Added Staff: ${newUser.name} (${newUser.id})`);
  };

  // Trigger Notifications & Audit Logs Helper
  const triggerNotification = (type, message) => {
    setNotifications(prev => [{ id: Date.now(), type, message, time: "Just now", read: false }, ...prev]);
  };

  const addAuditLog = (event, details) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs(prev => [{ id: Date.now(), timestamp, event, details }, ...prev]);
  };

  const exportAlert = (format, filename) => {
    alert(`✓ EXPORT COMPLETE: Dataset "${filename}" exported successfully in ${format} format to your local downloads directory.`);
    addAuditLog("Report Exported", `File: ${filename}.${format.toLowerCase()}`);
    triggerNotification("success", `Report "${filename}" exported safely.`);
  };

  /* ── Derived calculations ── */
  const totalPM     = users.filter(u => u.role === "Pointsman").length;
  const totalSMs    = users.filter(u => u.role === "Station Master").length;
  const pending     = pmList.filter(p=>p.status==="Pending").length;
  const highRiskAll = users.filter(u => u.pmeStatus === "Overdue" || u.refStatus === "Expired" || u.score < 50).length;
  const avgScoreAll = Math.round(users.reduce((s, u) => s + u.score, 0) / (users.length || 1));

  // Station level scores derived dynamically from user database!
  const stationStats = useMemo(() => {
    return myStations.map(st => {
      const stUsers = users.filter(u => u.station === st.name);
      const avg = stUsers.length ? Math.round(stUsers.reduce((s, u) => s + u.score, 0) / stUsers.length) : st.avgScore;
      const riskCount = stUsers.filter(u => u.pmeStatus === "Overdue" || u.refStatus === "Expired" || u.score < 50).length;
      return {
        ...st,
        avgScore: avg,
        highRisk: riskCount,
        safetyPct: Math.max(50, Math.min(100, 100 - (riskCount * 12)))
      };
    });
  }, [myStations, users]);

  const bestSt  = [...stationStats].sort((a,b)=>b.avgScore-a.avgScore)[0];
  const worstSt = [...stationStats].sort((a,b)=>a.avgScore-b.avgScore)[0];
  const highRiskSt = [...stationStats].sort((a,b)=>b.highRisk-a.highRisk)[0];

  const filteredStations = useMemo(() => {
    return stationStats.filter(st => {
      const matchesSearch = st.name.toLowerCase().includes(dbSearchQuery.toLowerCase()) || st.code.toLowerCase().includes(dbSearchQuery.toLowerCase());
      const matchesFilter = dbStationFilter === "All" || st.name === dbStationFilter;
      return matchesSearch && matchesFilter;
    });
  }, [stationStats, dbSearchQuery, dbStationFilter]);

  const stBarData = filteredStations.map(st=>({ name:st.code, nameFull: st.name, avgScore:st.avgScore, safetyPct:st.safetyPct, highRisk:st.highRisk }));

  const pieData = useMemo(()=>{
    const c = { A: 0, B: 0, C: 0, D: 0 };
    users.filter(u => u.role === "Pointsman").forEach(u => {
      c[getCat(u.score)]++;
    });
    return Object.entries(c).map(([name,value])=>({name,value}));
  }, [users]);

  const filteredPM = useMemo(()=>{
    return pmList.filter(p=>{
      const st = p.status === reviewTab;
      const s  = !reviewSearch || p.pointsmanName.toLowerCase().includes(reviewSearch.toLowerCase()) || p.hrmsId.toLowerCase().includes(reviewSearch.toLowerCase());
      const r  = reviewStation==="All" || p.station===reviewStation;
      return st && s && r;
    });
  },[pmList,reviewTab,reviewSearch,reviewStation]);

  const selectedPM = pmList.find(p=>p.id===selectedPmId)||null;

  /* ── All Users filtering ── */
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = userSearch.toLowerCase();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      const matchesStation = userStationFilter === "All" || u.station === userStationFilter;
      const matchesDesignation = userDesignationFilter === "All" || u.role === userDesignationFilter;
      const matchesCategory = userCategoryFilter === "All" || (u.cat || getCat(u.score)) === userCategoryFilter;
      
      const isHighRisk = u.pmeStatus === "Overdue" || u.refStatus === "Expired" || u.score < 50;
      const matchesRisk = userRiskFilter === "All" || (userRiskFilter === "High" && isHighRisk) || (userRiskFilter === "Non-High" && !isHighRisk);

      return matchesSearch && matchesStation && matchesDesignation && matchesCategory && matchesRisk;
    });
  }, [users, userSearch, userStationFilter, userDesignationFilter, userCategoryFilter, userRiskFilter]);

  const filteredReport = useMemo(()=>{
    let list = users.map(u => ({
      name: u.name,
      hrmsId: u.id,
      station: u.station,
      score: u.score,
      cat: u.cat || getCat(u.score),
      risk: u.pmeStatus === "Overdue" || u.refStatus === "Expired" || u.score < 50 ? "High" : u.score >= 80 ? "Low" : "Medium",
      date: u.lastAssessDate
    }));
    list = list.filter(r=>{
      const q = rpSearch.toLowerCase();
      const srch = !q||r.name.toLowerCase().includes(q)||r.station.toLowerCase().includes(q);
      const st   = rpStation==="All"||r.station===rpStation;
      const cat  = rpCat==="All"||r.cat===rpCat;
      const risk = rpRisk==="All"||r.risk===rpRisk;
      return srch&&st&&cat&&risk;
    });
    if (rpSort==="score-desc") list=[...list].sort((a,b)=>b.score-a.score);
    if (rpSort==="score-asc")  list=[...list].sort((a,b)=>a.score-b.score);
    return list;
  },[users,rpSearch,rpStation,rpCat,rpRisk,rpSort]);

  /* ── Navigation ── */
  const goTo = pg => {
    setActivePage(pg);
    setStatusMsg("");
    setSelectedPmId(null);
    setActiveSmId(null);
    setSelectedStation(null);
    setSelectedReportUserId(null);
    setBellDropdownOpen(false);
  };

  /* ── User admin actions ── */
  const handleEditUser = (userRec) => {
    setEditingUser({ ...userRec });
  };

  const saveEditedUser = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    addAuditLog("User Profile Modified", `Staff ID: ${editingUser.id}, Name: ${editingUser.name}`);
    triggerNotification("success", `Profile updated for ${editingUser.name}.`);
    setEditingUser(null);
    setStatusMsg("User profile updated successfully.");
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you absolutely sure you want to revoke operational access for ${userName} (${userId})?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addAuditLog("Revoked User Access", `Staff ID: ${userId}, Name: ${userName}`);
      triggerNotification("danger", `Revoked access: ${userName} (${userId}).`);
      setStatusMsg(`Revoked evaluation and access clearance for ${userName}.`);
    }
  };

  const handleTransferClick = (userRec) => {
    setTransferringUser({ ...userRec, targetStation: userRec.station });
  };

  const confirmTransfer = () => {
    setUsers(prev => prev.map(u => u.id === transferringUser.id ? { ...u, station: transferringUser.targetStation } : u));
    addAuditLog("Staff Station Transfer", `Staff: ${transferringUser.name} moved from ${transferringUser.station} to ${transferringUser.targetStation}`);
    triggerNotification("warning", `Transferred ${transferringUser.name} to ${transferringUser.targetStation}.`);
    setStatusMsg(`Operational deployment of ${transferringUser.name} transferred to ${transferringUser.targetStation}.`);
    setTransferringUser(null);
  };

  /* ── PM Review Actions ── */
  const openPmReview = id => {
    const rec = pmList.find(p=>p.id===id);
    if (!rec) return;
    setSelectedPmId(id);
    setEditSections(prev=>({...prev,[id]:rec.originalSections.map(s=>({...s}))}));
    setTiRemarks(prev=>({...prev,[id]:rec.tiRemarks||""}));
    setRejectMode(prev=>({...prev,[id]:false}));
  };

  const updateSec = (id,idx,val) => {
    setEditSections(prev=>{
      const arr=[...prev[id]]; arr[idx]={...arr[idx],score:Math.max(0,Math.min(arr[idx].max,Number(val)||0))};
      return {...prev,[id]:arr};
    });
  };

  const finalizePM = (id,mode,rejectNote="") => {
    setPmList(prev=>prev.map(p=>{
      if (p.id!==id) return p;
      const secs  = editSections[id]||p.originalSections;
      const total = secs.reduce((s,x)=>s+x.score,0);
      const modified = JSON.stringify(secs)!==JSON.stringify(p.originalSections);
      const audit = [...(p.auditTrail||[]),{
        action: mode==="reject"?"Rejected":(modified?"Modified & Approved":"Approved without modification"),
        by:`TI ${tiName}`, date:new Date().toISOString().slice(0,10),
        remark: mode==="reject"?rejectNote:(tiRemarks[id]||"")
      }];
      return {
        ...p, status: mode==="reject"?"Rejected":"Approved",
        finalSections:mode==="reject"?p.originalSections:secs,
        finalScore:total, tiRemarks:tiRemarks[id]||rejectNote,
        tiModified:modified, approvalDate:new Date().toISOString().slice(0,10),
        auditTrail:audit
      };
    }));
    
    // Update target Pointsman's dynamic performance score in the main users database!
    const targetAssess = pmList.find(p => p.id === id);
    if (targetAssess && mode !== "reject") {
      const finalSecs = editSections[id] || targetAssess.originalSections;
      const finalSum = finalSecs.reduce((s, x) => s + x.score, 0);
      setUsers(prev => prev.map(u => u.id === targetAssess.hrmsId ? { ...u, score: finalSum, cat: getCat(finalSum) } : u));
    }

    setSelectedPmId(null);
    setStatusMsg(mode==="reject"?"Assessment rejected. SM has been notified.":`Assessment ${mode==="approve"?"approved":"modified & approved"} successfully.`);
    addAuditLog(mode==="reject"?"Rejected PM Assessment":"Approved PM Assessment", `Staff ID: ${targetAssess?.hrmsId || ""}, Score: ${mode==="reject"?"-":liveTotal}`);
    triggerNotification("success", `Reviewed PM Assessment for ${targetAssess?.pointsmanName || ""}.`);
    setReviewTab(mode==="reject"?"Rejected":"Approved");
  };

  /* ── SM Form ── */
  const openSMForm = (id, forceUnlock = false) => {
    setActiveSmId(id);
    const smAssess = smList.find(s => s.id === id);
    setSmLocked(prev => ({
      ...prev,
      [id]: forceUnlock ? false : (smAssess ? smAssess.status === "Submitted" : false)
    }));
    setSmForms(prev => {
      const existing = prev[id] || defaultSMForm();
      if (smAssess && smAssess.examScore !== undefined) {
        return {
          ...prev,
          [id]: {
            ...existing,
            knowledgeMarks: smAssess.examScore.toString()
          }
        };
      }
      return {
        ...prev,
        [id]: existing
      };
    });
  };

  const handleSendExamAccess = (id) => {
    setSmList(prev => prev.map(s => s.id === id ? { ...s, status: "Exam Sent" } : s));
    setStatusMsg("Exam access link sent successfully to the Station Master.");
    addAuditLog("Sent Exam Access", `Exam sent to SM: ${smList.find(s => s.id === id)?.name}`);
    triggerNotification("success", `Exam access granted to SM ${smList.find(s => s.id === id)?.name}`);
  };

  const toggleSMYN = (id,key,idx,val) => {
    if (smLocked[id]) return;
    setSmForms(prev=>{
      const f={...prev[id]}; const arr=[...f[key]]; arr[idx]=arr[idx]===val?null:val;
      return {...prev,[id]:{...f,[key]:arr}};
    });
  };
  const setSMField = (id,key,val) => { if(smLocked[id])return; setSmForms(p=>({...p,[id]:{...p[id],[key]:val}})); };

  const submitSMAssessment = id => {
    const f = smForms[id];
    if (!f?.alcoholicStatus){ setStatusMsg("Alcoholic/Non-Alcoholic status is mandatory."); return; }
    const {total} = computeSMScore(f);
    
    const isAlcoholic = f.alcoholicStatus === "Alcoholic";
    const cat = isAlcoholic ? "D" : getCat(total);

    setSmList(prev=>prev.map(s=>s.id===id?{...s,status:"Submitted",score:total,category:cat}:s));
    setSmLocked(p=>({...p,[id]:true}));
    
    // Update Station Master's dynamic performance score in the main users database!
    const smAssess = smList.find(s => s.id === id);
    if (smAssess) {
      setUsers(prev => prev.map(u => u.id === smAssess.hrmsId ? {
        ...u,
        score: total,
        cat: cat,
        alcoholicStatus: f.alcoholicStatus,
        pmeStatus: f.pmeStatus,
        refStatus: f.refStatus
      } : u));
    }

    setStatusMsg("SM assessment submitted. Pending AOM approval.");
    addAuditLog("Submitted SM Assessment", `SM: ${smAssess?.name || ""}, Grand Score: ${total}`);
    triggerNotification("success", `Field evaluation logged for SM ${smAssess?.name || ""}.`);
    setActiveSmId(null);
  };

  /* ── Logging Inspections & Counselling ── */
  const submitInspection = (e) => {
    e.preventDefault();
    const newRecord = {
      id: "IN_" + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      station: newInsp.station,
      officer: newInsp.officer,
      observations: newInsp.observations,
      risk: newInsp.risk,
      status: "Active"
    };
    setInspections(prev => [newRecord, ...prev]);
    addAuditLog("Logged Station Inspection", `Station: ${newInsp.station}, Risk: ${newInsp.risk}`);
    triggerNotification("warning", `NEW INSPECTION REPORT FILED: ${newInsp.station}`);
    setStatusMsg(`Inspection audit log successfully created for ${newInsp.station}.`);
    setNewInsp({ station: "Parbhani Junction", officer: "TI R. Khan", observations: "", risk: "Low" });
    setShowInspForm(false);
  };

  const submitCounselling = (e) => {
    e.preventDefault();
    const newRecord = {
      id: "CL_" + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      staffName: newCoun.staffName,
      designation: newCoun.designation,
      station: newCoun.station,
      topics: newCoun.topics,
      duration: newCoun.duration,
      progress: newCoun.progress
    };
    setCounsellings(prev => [newRecord, ...prev]);
    addAuditLog("Logged Counselling Session", `Staff: ${newCoun.staffName}, Topics: ${newCoun.topics.slice(0,25)}...`);
    triggerNotification("success", `Counselling session registered for ${newCoun.staffName}.`);
    setStatusMsg(`Staff safety counseling briefing registered for ${newCoun.staffName}.`);
    setNewCoun({ staffName: "", designation: "Pointsman Grade I", station: "Parbhani Junction", topics: "", duration: "30 mins", progress: "Under Monitor" });
    setShowCounForm(false);
  };

  /* ── Self-Assessment Interactive Quiz ── */
  const startQuiz = () => {
    setQuizAnswers(Array(25).fill(null));
    setCurrentQuestion(0);
    setQuizState("quiz");
  };

  const handleSelectQuizOpt = (optIdx) => {
    setQuizAnswers(prev => {
      const next = [...prev];
      next[currentQuestion] = optIdx;
      return next;
    });
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizAnswers.forEach((ans, idx) => {
      if (ans === TI_QUIZ[idx].ans) correctCount++;
    });
    const finalScore = correctCount * 4; // 25 questions = 100 max
    setLatestQuizScore(finalScore);
    
    const getDomainScore = (startIdx, endIdx) => {
      let score = 0;
      for (let i = startIdx; i <= endIdx; i++) {
        if (quizAnswers[i] === TI_QUIZ[i].ans) score += 4;
      }
      return score;
    };

    // Add to assessment history in state
    const today = new Date().toISOString().slice(0, 10);
    const newRecord = {
      id: Date.now(),
      date: today,
      period: "Assigned Assessment " + today,
      assessedBy: "AOM Assigned Exam",
      totalScore: finalScore,
      category: getCat(finalScore),
      approvalStatus: "Approved",
      aomRemarks: "Assigned safety compliance assessment submitted by Traffic Inspector R. Khan.",
      sections: [
        { title: "Whistle Codes & Hand Signals", marks: getDomainScore(0, 4), outOf: 20 },
        { title: "Token & Line Clear Authorities", marks: getDomainScore(5, 9), outOf: 20 },
        { title: "Station Interlocking & Track Circuits", marks: getDomainScore(10, 14), outOf: 20 },
        { title: "Shunting Operations & Point Locking", marks: getDomainScore(15, 19), outOf: 20 },
        { title: "Gate Signals & Siding Isolation", marks: getDomainScore(20, 24), outOf: 20 }
      ],
      userAnswers: [...quizAnswers]
    };
    
    setTiAssessments(prev => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    localStorage.removeItem("ti_exam_assigned");
    setIsExamAssigned(false);
    addAuditLog("Assigned Assessment Completed", `Score: ${finalScore}/100`);
    triggerNotification("success", `Compliance check complete: Scored ${finalScore}%`);
    setQuizState("result");
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addAuditLog("Notifications Inbox Read", "Marked all alerts read.");
  };

  /* ═══════════════════════════════════════════
     RENDER: DASHBOARD
     (Highly scrollable & optimized for 12 stations)
  ═══════════════════════════════════════════ */
  const renderDashboard = ()=>(
    <div className="ti2-dashboard animate-fade-in">
      
      {/* ── Grouped analytics summary KPIs ── */}
      <div className="ti2-sum-cards">
        {[
          { label: "Total Stations",      v: myStations.length,      icon: <Building2 size={20} color="#2563eb"/>,     bg: "#eff6ff", onClick: () => goTo("stations") },
          { label: "Station Masters",     v: totalSMs,             icon: <Users size={20} color="#7c3aed"/>,         bg: "#f5f3ff", onClick: () => { goTo("allUsers"); setUserDesignationFilter("Station Master"); setUserStationFilter("All"); setUserCategoryFilter("All"); setUserRiskFilter("All"); setUserSearch(""); } },
          { label: "Total Pointsmen",     v: totalPM,              icon: <Users size={20} color="#0891b2"/>,         bg: "#ecfeff", onClick: () => { goTo("allUsers"); setUserDesignationFilter("Pointsman"); setUserStationFilter("All"); setUserCategoryFilter("All"); setUserRiskFilter("All"); setUserSearch(""); } },
          { label: "Pending Approvals",   v: pending,              icon: <ClipboardCheck size={20} color="#d97706"/>, bg: "#fef3c7", onClick: () => { goTo("reviewPM"); setReviewTab("Pending"); } },
          { label: "Average Score",       v: `${avgScoreAll}/100`, icon: <Activity size={20} color="#16a34a"/>,      bg: "#dcfce7", onClick: () => goTo("reports") },
          { label: "High-Risk Staff",     v: highRiskAll,          icon: <AlertTriangle size={20} color="#dc2626"/>, bg: "#fee2e2", onClick: () => { goTo("allUsers"); setUserRiskFilter("High"); setUserDesignationFilter("All"); setUserStationFilter("All"); setUserCategoryFilter("All"); setUserSearch(""); } },
        ].map(c=>(
          <article key={c.label} className="ti2-sum-card" style={{ cursor: c.onClick ? "pointer" : "default" }} onClick={c.onClick}>
            <div className="ti2-sum-icon" style={{ background: c.bg }}>{c.icon}</div>
            <div>
              <label>{c.label}</label>
              <strong>{c.v}</strong>
            </div>
          </article>
        ))}
      </div>

      {/* ── Smart Grouped Performance Cards ── */}
      <div className="ti2-highlights">
        {[
          { label: "Best Performing Station", st: bestSt,     icon: <TrendingUp size={15} color="#16a34a"/>,   accent: "#16a34a", bg: "#f0fdf4" },
          { label: "Worst Performing Station",st: worstSt,    icon: <TrendingDown size={15} color="#dc2626"/>, accent: "#dc2626", bg: "#fff1f2" },
          { label: "Most Improved Station",   st: myStations[9] || myStations[myStations.length - 1] || null, icon: <TrendingUp size={15} color="#2563eb"/>,   accent: "#2563eb", bg: "#eff6ff" },
          { label: "Highest Risk Station",    st: highRiskSt, icon: <AlertTriangle size={15} color="#d97706"/>, accent: "#d97706", bg: "#fffbeb" },
        ].map(h=>(
          <div key={h.label} className="ti2-highlight-card" style={{ borderTop: `3.5px solid ${h.accent}`, background: h.bg }}>
            <div className="ti2-hl-label" style={{ color: h.accent }}>{h.icon}{h.label}</div>
            <div className="ti2-hl-station">{h.st?.name || "Station"}</div>
            <div className="ti2-hl-meta">Avg {h.st?.avgScore || 0}/100 &nbsp;·&nbsp; {h.st?.highRisk || 0} high-risk staff</div>
          </div>
        ))}
      </div>

      {/* ── High-risk Station Heatmap (New Grouped Matrix) ── */}
      <div className="ti2-card">
        <div className="ti2-chart-hdr"><AlertTriangle size={15} color="#dc2626"/><h3>High-Risk Section Heatmap</h3></div>
        <p className="ti2-subtitle" style={{ marginBottom: 14 }}>Real-time compliance checklist status across all 12 stations under jurisdiction.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
          {stationStats.map(st => {
            const level = st.highRisk >= 2 ? "High" : st.highRisk > 0 ? "Medium" : "Low";
            return (
              <div key={st.id} style={{ border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "12px", background: "#f8fafc", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{st.code}</strong>
                  <span className="ti2-badge" style={{ background: RISK_B[level], color: RISK_C[level], scale: "0.9" }}>{level}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{st.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "6px" }}>
                  <span>Avg: <strong>{st.avgScore}%</strong></span>
                  <span>Compliance: <strong style={{ color: st.safetyPct >= 80 ? "#16a34a" : "#d97706" }}>{st.safetyPct}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Advanced Scrollable Charts & Station Filters ── */}
      <div className="ti2-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div className="ti2-chart-hdr" style={{ margin: 0 }}>
            <BarChart3 size={16}/>
            <h3 style={{ margin: 0 }}>Station-wise Average Performance Score &amp; Safety Compliance</h3>
          </div>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div className="ti2-search-box" style={{ padding: "6px 12px", flex: "none", width: "180px" }}>
              <Search size={12}/><input style={{ fontSize: "12px" }} placeholder="Search station..." value={dbSearchQuery} onChange={e=>setDbSearchQuery(e.target.value)}/>
            </div>
            <select className="ti2-select" style={{ padding: "6px 12px", fontSize: "12px" }} value={dbStationFilter} onChange={e=>setDbStationFilter(e.target.value)}>
              <option value="All">All Stations</option>
              {myStations.map(st => <option key={st.id} value={st.name}>{st.code} - {st.name}</option>)}
            </select>
            <button className="ti2-view-profile-btn" onClick={() => exportAlert("Excel", "Station_Performance_Matrix")} style={{ padding: "7px 12px" }}>
              <Download size={12}/> Excel
            </button>
          </div>
        </div>
        
        {/* Horizontal scrollable chart container to avoid clutters */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <div style={{ minWidth: "800px", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stBarData} margin={{ top: 8, right: 10, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }}/>
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false}/>
                <Tooltip content={<TiTooltip/>}/>
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }}/>
                <Bar dataKey="avgScore" name="Avg Performance Score (%)" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={38}/>
                <Bar dataKey="safetyPct" name="Safety Compliance Rate (%)" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={38}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Monthly Assessment Trend and Risky Staff Breakdown ── */}
      <div className="ti2-chart-row-2col">
        <div className="ti2-card">
          <div className="ti2-chart-hdr"><TrendingUp size={15}/><h3>Compliance &amp; Assessment Trends</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY} margin={{ top: 8, right: 10, left: -24, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}/>
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false}/>
              <Tooltip content={<TiTooltip/>}/>
              <Line type="monotone" dataKey="assessments" name="Tests Taken" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }}/>
              <Line type="monotone" dataKey="safetyAvg" name="Safety compliance avg" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ti2-card">
          <div className="ti2-chart-hdr"><BarChart3 size={15}/><h3>Staff Grade Distribution (Pointsmen Roster)</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={4}>
                {pieData.map((e,i)=><Cell key={e.name} fill={PIE_C[i]}/>)}
              </Pie>
              <Tooltip formatter={(v,n,p)=>[`${v} Staff`,`Category ${p.payload.name}`]}/>
              <Legend formatter={(v,e)=>`Grade ${e.payload.name} — ${e.payload.value} staff`} iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER: PROFILE
  ═══════════════════════════════════════════ */
  const renderProfile = ()=>(
    <div className="ti2-page-body animate-fade-in">
      <div className="ti2-card">
        <div className="ti2-card-hdr" style={{ marginBottom: 20 }}>
          <h2>My Profile</h2>
          <span className="ti2-pill-grey">View Only</span>
        </div>
        <div className="ti2-profile-hero">
          <div className="ti2-profile-avatar">{tiName.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div className="ti2-profile-name">{tiName}</div>
            <div className="ti2-profile-role">{TI_PROFILE.designation} &nbsp;·&nbsp; {TI_PROFILE.jurisdiction}</div>
            <div className="ti2-pm-badges" style={{ marginTop: 12 }}>
              <span className="ti2-badge" style={{ background: CAT_B["A"], color: CAT_C["A"], fontSize: 12, padding: "4px 12px" }}>Category A</span>
              <span className="ti2-pill-grey" style={{ fontSize: 12 }}>ID: {tiId}</span>
            </div>
          </div>
          <div className="ti2-profile-snaps">
            <div><label>Compliance Score</label><strong style={{ color: CAT_C["A"], fontSize: 22 }}>88<span style={{ fontSize: 13, color: "#64748b" }}>/100</span></strong></div>
            <div><label>Category</label><strong style={{ color: CAT_C["A"], fontSize: 22 }}>Grade A</strong></div>
            <div><label>Medical Exam</label><strong style={{ fontSize: 13, color: "#16a34a" }}>FIT (PME)</strong></div>
          </div>
        </div>
      </div>

      <div className="ti2-card">
        <div className="ti2-profile-sec-title">Personal Details</div>
        <div className="ti2-profile-fields">
          <div className="ti2-profile-field"><span>Full Name</span><strong>{tiName}</strong></div>
          <div className="ti2-profile-field"><span>Employee ID / HRMS ID</span><strong>{tiId}</strong></div>
          <div className="ti2-profile-field"><span>Date of Birth</span><strong>{TI_PROFILE.dob}</strong></div>
          <div className="ti2-profile-field"><span>Date of Appointment</span><strong>{TI_PROFILE.doa}</strong></div>
          <div className="ti2-profile-field"><span>Designation &amp; Role</span><strong>{TI_PROFILE.designation}</strong></div>
          <div className="ti2-profile-field"><span>Contact Number</span><strong>+91 98900 12211</strong></div>
          <div className="ti2-profile-field"><span>Assigned Division</span><strong>{TI_PROFILE.jurisdiction}</strong></div>
        </div>
      </div>

      <div className="ti2-card">
        <div className="ti2-profile-sec-title">Health &amp; Training Compliance</div>
        <div className="ti2-profile-fields">
          <div className="ti2-profile-field"><span>PME Done Date</span><strong>{TI_PROFILE.pmeDoneDate}</strong></div>
          <div className="ti2-profile-field"><span>PME Due Date</span><strong>{TI_PROFILE.pmeDueDate}</strong></div>
          <div className="ti2-profile-field"><span>Isolator Certificate Issued Date</span><strong>{TI_PROFILE.isolatorCertDate}</strong></div>
          <div className="ti2-profile-field"><span>Automatic Training Date</span><strong>{TI_PROFILE.autoTrainingDate}</strong></div>
          <div className="ti2-profile-field"><span>Counselling Date</span><strong>{TI_PROFILE.counsellingDate}</strong></div>
          <div className="ti2-profile-field" style={{ gridColumn: "1/-1" }}>
            <span>Assigned Stations Under Section ({myStations.length})</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
              {myStations.map(st => <span key={st.id} className="ti2-pill-grey" style={{ fontSize: "11px", fontWeight: "700" }}>{st.code} - {st.name}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER: STATIONS
     (Card grid layout + detailed clickable sub-view)
  ═══════════════════════════════════════════ */
  const renderStations = ()=>{
    if (selectedStation) {
      const st = selectedStation;
      const stUsers = users.filter(u => u.station === st.name);
      const stSms = stUsers.filter(u => u.role === "Station Master");
      const stPms = stUsers.filter(u => u.role === "Pointsman");
      const stInsps = inspections.filter(i => i.station === st.name);
      const riskLevel = st.highRisk >= 2 ? "High" : st.highRisk > 0 ? "Medium" : "Low";

      return (
        <div className="ti2-page-body animate-fade-in">
          <div className="ti2-card">
            <div className="ti2-card-hdr">
              <div>
                <h2>{st.name} ({st.code}) Detailed Analytics</h2>
                <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Operational safety compliance, PME/REF audits, and rosters under jurisdiction.</p>
              </div>
              <button className="ti2-link-btn" onClick={() => setSelectedStation(null)}>← Back to Stations</button>
            </div>

            <div className="ti2-profile-hero" style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1.5px dashed #cbd5e1" }}>
              <div className="ti2-station-code" style={{ width: "54px", height: "54px", fontSize: "13px" }}>{st.code}</div>
              <div style={{ flex: 1 }}>
                <div className="ti2-profile-name">{st.name}</div>
                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <span className="ti2-badge" style={{ background: RISK_B[riskLevel], color: RISK_C[riskLevel] }}>{riskLevel} Risk Level</span>
                  <span className="ti2-pill-grey">Safety Compliance Score: <strong>{st.safetyPct}%</strong></span>
                </div>
              </div>
              <div className="ti2-profile-snaps">
                <div><label>Station Masters</label><strong>{stSms.length}</strong></div>
                <div><label>Total Pointsmen</label><strong>{stPms.length}</strong></div>
                <div><label>Station Avg Score</label><strong style={{ color: "#2563eb" }}>{st.avgScore}%</strong></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "20px" }}>
              <div>
                <div className="ti2-profile-sec-title">Station Master Roster</div>
                <div className="ti2-sm-table-wrap">
                  {stSms.map(sm => (
                    <div key={sm.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <strong>{sm.name}</strong>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>ID: {sm.id} · PME: {sm.pmeStatus}</div>
                      </div>
                      <span className="ti2-badge" style={{ background: CAT_B[sm.cat], color: CAT_C[sm.cat] }}>Grade {sm.cat} ({sm.score}%)</span>
                    </div>
                  ))}
                  {stSms.length === 0 && <p className="ti2-empty">No Station Masters logged in this station roster.</p>}
                </div>
              </div>

              <div>
                <div className="ti2-profile-sec-title">Pointsmen Roster</div>
                <div className="ti2-sm-table-wrap">
                  {stPms.map(pm => (
                    <div key={pm.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <strong>{pm.name}</strong>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>ID: {pm.id} · REF: {pm.refStatus}</div>
                      </div>
                      <span className="ti2-badge" style={{ background: CAT_B[pm.cat], color: CAT_C[pm.cat] }}>Grade {pm.cat} ({pm.score}%)</span>
                    </div>
                  ))}
                  {stPms.length === 0 && <p className="ti2-empty">No Pointsmen logged in this station roster.</p>}
                </div>
              </div>
            </div>

            {/* Inspection logs for this station */}
            <div style={{ marginTop: "24px" }}>
              <div className="ti2-profile-sec-title">Field Safety Inspections Ledger ({stInsps.length})</div>
              <div className="ti2-table-wrap">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontWeight: "700", fontSize: "11px" }}>
                  <span>Date</span>
                  <span>Safety Observations</span>
                  <span>Risk Class</span>
                  <span>Audit Status</span>
                </div>
                {stInsps.map(insp => (
                  <div key={insp.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "10px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", alignItems: "center" }}>
                    <strong>{insp.date}</strong>
                    <span>{insp.observations}</span>
                    <span><span className="ti2-badge" style={{ background: RISK_B[insp.risk], color: RISK_C[insp.risk] }}>{insp.risk}</span></span>
                    <span><span className="ti2-pill-grey">{insp.status}</span></span>
                  </div>
                ))}
                {stInsps.length === 0 && <p className="ti2-empty">No safety inspections recorded for this station yet.</p>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ti2-page-body animate-fade-in">
        <div className="ti2-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2>Stations Database &amp; Audit Logs</h2>
              <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Audit evaluations, safety rosters, and risk classifications of all {myStations.length} stations.</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="ti2-primary-btn" onClick={() => setShowAddStationModal(true)} style={{ height: "36px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Plus size={13}/> Add Station
              </button>
              <button className="ti2-view-profile-btn" onClick={() => exportAlert("PDF", `${myStations.length}_Stations_Roster_Master`)} style={{ height: "36px" }}>
                <Download size={13}/> Export PDF Report
              </button>
            </div>
          </div>

          <div className="ti2-filter-row">
            <div className="ti2-search-box">
              <Search size={13}/><input placeholder="Search station name / code…" value={stSearch} onChange={e=>setStSearch(e.target.value)}/>
            </div>
            <select className="ti2-select" value={stCatFilter} onChange={e=>setStCatFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="A">Grade A Stations</option>
              <option value="B">Grade B Stations</option>
              <option value="C">Grade C Stations</option>
            </select>
          </div>

          {/* 12 Station List - Table layout */}
          <div className="ti2-table-wrap" style={{ marginTop: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr 1.5fr 2fr 1.5fr 1.5fr 1.8fr", gap: "8px", padding: "10px 16px", background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              <span>Code</span>
              <span>Station Name</span>
              <span>Compliance Score</span>
              <span>Avg Score Grade</span>
              <span>Total Staff</span>
              <span>Risk Level</span>
              <span>Action</span>
            </div>

            {stationStats.filter(st => {
              const q = stSearch.toLowerCase();
              const matchesSearch = !q || st.name.toLowerCase().includes(q) || st.code.toLowerCase().includes(q);
              const matchesCat = stCatFilter === "All" || getCat(st.avgScore) === stCatFilter;
              return matchesSearch && matchesCat;
            }).map(st => {
              const riskLevel = st.highRisk >= 2 ? "High" : st.highRisk > 0 ? "Medium" : "Low";
              const grade = getCat(st.avgScore);
              return (
                <div key={st.id} style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr 1.5fr 2fr 1.5fr 1.5fr 1.8fr", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: "700" }}>{st.code}</span>
                  <strong>{st.name}</strong>
                  <strong style={{ color: st.safetyPct >= 80 ? "#16a34a" : "#d97706" }}>{st.safetyPct}%</strong>
                  <span style={{ color: CAT_C[grade], fontWeight: "700" }}>Grade {grade} ({st.avgScore}%)</span>
                  <span>{users.filter(u => u.station === st.name).length} personnel</span>
                  <span><span className="ti2-badge" style={{ background: RISK_B[riskLevel], color: RISK_C[riskLevel] }}>{riskLevel} Risk</span></span>
                  <button className="ti2-primary-btn-sm" onClick={() => setSelectedStation(st)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", padding: "6px 12px", width: "fit-content" }}>
                    <Eye size={12}/> View Analytics
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Add Station Modal */}
          {showAddStationModal && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <form onSubmit={handleAddStationSubmit} className="ti2-card" style={{ width: "450px", margin: "16px", display: "flex", flexDirection: "column", gap: "14px", border: "1px solid #cbd5e1" }}>
                <div className="ti2-card-hdr" style={{ marginBottom: 0 }}>
                  <h3>Add New Station</h3>
                  <button type="button" onClick={() => setShowAddStationModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>×</button>
                </div>

                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Add a new station under your jurisdiction. This station will be associated with your TI account and will not be visible to other Traffic Inspectors.
                </p>

                <div className="ti2-form-field">
                  <label>Station Name <span style={{ color: "#dc2626" }}>*</span></label>
                  <input 
                    type="text" 
                    value={newStationData.name} 
                    onChange={e => setNewStationData({ ...newStationData, name: e.target.value })} 
                    placeholder="e.g. Jalna Junction" 
                    required 
                  />
                </div>
                
                <div className="ti2-form-field">
                  <label>Station Code <span style={{ color: "#dc2626" }}>*</span></label>
                  <input 
                    type="text" 
                    value={newStationData.code} 
                    onChange={e => setNewStationData({ ...newStationData, code: e.target.value })} 
                    placeholder="e.g. J or JALNA" 
                    required 
                  />
                </div>

                <div className="ti2-review-actions" style={{ marginTop: "10px" }}>
                  <button type="button" className="ti2-ghost-btn" onClick={() => setShowAddStationModal(false)}>Cancel</button>
                  <button type="submit" className="ti2-primary-btn">Add Station</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════
     RENDER: ALL USERS PAGE
     (Editable details, Transfers, search/filters)
  ═══════════════════════════════════════════ */
  const renderAllUsers = () => (
    <div className="ti2-page-body animate-fade-in">
      <div className="ti2-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2>All Users &amp; Roster Management</h2>
            <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Manage personnel, assign roles, edit details, and transfer station masters and pointsmen.</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="ti2-primary-btn" onClick={openAddUserModal} style={{ height: "36px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Plus size={13}/> Add User
            </button>
            <button className="ti2-view-profile-btn" onClick={() => exportAlert("Excel", "Section_Staff_Master_List")} style={{ height: "36px" }}>
              <FileSpreadsheet size={13}/> Export Excel Ledger
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="ti2-filter-row">
          <div className="ti2-search-box" style={{ flex: 1.5 }}>
            <Search size={13}/><input placeholder="Search user name, ID, or contact number…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}/>
          </div>
          <select className="ti2-select" value={userStationFilter} onChange={e=>setUserStationFilter(e.target.value)}>
            <option value="All">All Stations</option>
            {myStations.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
          </select>
          <select className="ti2-select" value={userDesignationFilter} onChange={e=>setUserDesignationFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Station Master">Station Masters</option>
            <option value="Pointsman">Pointsmen</option>
          </select>
          <select className="ti2-select" value={userCategoryFilter} onChange={e=>setUserCategoryFilter(e.target.value)}>
            <option value="All">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
          </select>
          <select className="ti2-select" value={userRiskFilter} onChange={e=>setUserRiskFilter(e.target.value)}>
            <option value="All">All Risks</option>
            <option value="High">High Risk Only</option>
            <option value="Non-High">Normal Compliance</option>
          </select>
        </div>

        {/* Main Users Table */}
        <div className="ti2-table-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 1.4fr 0.8fr 0.8fr 0.8fr 0.8fr 1.5fr", gap: "8px", padding: "10px 16px", background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            <span>Name</span>
            <span>Staff ID</span>
            <span>Designation</span>
            <span>Station</span>
            <span>Category</span>
            <span>PME</span>
            <span>REF</span>
            <span>Score</span>
            <span>Actions</span>
          </div>

          {filteredUsers.length === 0 && <p className="ti2-empty">No railway personnel matching filters in this section.</p>}

          {filteredUsers.map(u => {
            const grade = getCat(u.score);
            return (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 1.4fr 0.8fr 0.8fr 0.8fr 0.8fr 1.5fr", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", alignItems: "center" }}>
                <div>
                  <strong>{u.name}</strong>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>{u.contact}</div>
                </div>
                <span style={{ fontFamily: "monospace" }}>{u.id}</span>
                <span><span className="ti2-pill-grey" style={{ fontSize: "10px", fontWeight: "700" }}>{u.designation}</span></span>
                <strong>{u.station}</strong>
                <span><span className="ti2-badge" style={{ background: CAT_B[grade], color: CAT_C[grade] }}>Grade {grade}</span></span>
                <span style={{ color: u.pmeStatus === "Fit" ? "#16a34a" : "#dc2626", fontWeight: "600" }}>{u.pmeStatus}</span>
                <span style={{ color: u.refStatus === "Cleared" ? "#16a34a" : "#dc2626", fontWeight: "600" }}>{u.refStatus}</span>
                <strong>{u.score}%</strong>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button className="ti2-view-profile-btn" onClick={() => handleEditUser(u)} style={{ padding: "4px 8px" }} title="Edit Personnel details">
                    <Edit size={11}/>
                  </button>
                  <button className="ti2-link-btn-sm" onClick={() => handleTransferClick(u)} style={{ padding: "4px 8px" }} title="Transfer station">
                    <RefreshCw size={11}/>
                  </button>
                  <button className="ti2-danger-btn" onClick={() => handleDeleteUser(u.id, u.name)} style={{ padding: "4px 8px" }} title="Revoke access clearance">
                    <Trash2 size={11}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form onSubmit={saveEditedUser} className="ti2-card" style={{ width: "450px", margin: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="ti2-card-hdr" style={{ marginBottom: 0 }}>
              <h3>Edit Personnel Details</h3>
              <button type="button" onClick={() => setEditingUser(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <div className="ti2-form-field">
              <label>Full Name</label>
              <input type="text" value={editingUser.name} onChange={e=>setEditingUser({...editingUser, name: e.target.value})} required/>
            </div>
            
            <div className="ti2-form-field">
              <label>Contact Mobile</label>
              <input type="text" value={editingUser.contact} onChange={e=>setEditingUser({...editingUser, contact: e.target.value})} required/>
            </div>

            <div className="ti2-form-field">
              <label>Role / Assignment</label>
              <select value={editingUser.role} onChange={e=>setEditingUser({...editingUser, role: e.target.value, designation: e.target.value})} required>
                <option value="Station Master">Station Master</option>
                <option value="Pointsman">Pointsman</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>PME Status</label>
                <select value={editingUser.pmeStatus} onChange={e=>setEditingUser({...editingUser, pmeStatus: e.target.value})} required>
                  <option>Fit</option>
                  <option>Unfit</option>
                  <option>Overdue</option>
                </select>
              </div>
              <div className="ti2-form-field">
                <label>REF Status</label>
                <select value={editingUser.refStatus} onChange={e=>setEditingUser({...editingUser, refStatus: e.target.value})} required>
                  <option>Cleared</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>

            <div className="ti2-review-actions" style={{ marginTop: "10px" }}>
              <button type="button" className="ti2-ghost-btn" onClick={() => setEditingUser(null)}>Cancel</button>
              <button type="submit" className="ti2-primary-btn">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer User Modal */}
      {transferringUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="ti2-card" style={{ width: "420px", margin: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="ti2-card-hdr" style={{ marginBottom: 0 }}>
              <h3>Transfer Personnel Deployment</h3>
              <button type="button" onClick={() => setTransferringUser(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Transfer <strong>{transferringUser.name}</strong> from <strong>{transferringUser.station}</strong> to another station section.
            </p>

            <div className="ti2-form-field">
              <label>Select Deployment Station</label>
              <select value={transferringUser.targetStation} onChange={e=>setTransferringUser({...transferringUser, targetStation: e.target.value})}>
                {myStations.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
              </select>
            </div>

            <div className="ti2-review-actions" style={{ marginTop: "8px" }}>
              <button type="button" className="ti2-ghost-btn" onClick={() => setTransferringUser(null)}>Cancel</button>
              <button type="button" className="ti2-primary-btn" onClick={confirmTransfer}>Confirm Transfer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form onSubmit={handleAddUserSubmit} className="ti2-card" style={{ width: "480px", margin: "16px", display: "flex", flexDirection: "column", gap: "14px", border: "1px solid #cbd5e1", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="ti2-card-hdr" style={{ marginBottom: 0 }}>
              <h3>Add New Railway Personnel</h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>×</button>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Log a new Station Master or Pointsman under your jurisdiction. All sections (PME, REF, and Dashboard stats) will be dynamically updated in real-time.
            </p>

            <div className="ti2-form-field">
              <label>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
              <input 
                type="text" 
                value={newUserData.name} 
                onChange={e => setNewUserData({ ...newUserData, name: e.target.value })} 
                placeholder="e.g. Ramesh Kumar" 
                required 
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>Staff HRMS ID <span style={{ color: "#dc2626" }}>*</span></label>
                <input 
                  type="text" 
                  value={newUserData.id} 
                  onChange={e => setNewUserData({ ...newUserData, id: e.target.value })} 
                  placeholder="e.g. 2405 (will auto-prepend)" 
                  required 
                />
              </div>
              <div className="ti2-form-field">
                <label>Prefix Preview</label>
                <div style={{ padding: "9px 12px", border: "1.5px dashed #cbd5e1", background: "#f8fafc", borderRadius: "9px", fontSize: "13px", fontWeight: "700", textAlign: "center", color: "#2563eb", marginTop: "1px" }}>
                  {newUserData.role === "Station Master" ? "SM_" : "PM_"}{newUserData.id.replace(/^SM_|^PM_/i, "")}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>Role / Assignment <span style={{ color: "#dc2626" }}>*</span></label>
                <select 
                  value={newUserData.role} 
                  onChange={e => {
                    const selectedRole = e.target.value;
                    const defaultDesig = selectedRole === "Station Master" ? "Station Master" : "Pointsman Grade I";
                    setNewUserData({ ...newUserData, role: selectedRole, designation: defaultDesig });
                  }} 
                  required
                >
                  <option value="Station Master">Station Master</option>
                  <option value="Pointsman">Pointsman</option>
                </select>
              </div>

              {newUserData.role === "Pointsman" ? (
                <div className="ti2-form-field">
                  <label>Designation <span style={{ color: "#dc2626" }}>*</span></label>
                  <select 
                    value={newUserData.designation} 
                    onChange={e => setNewUserData({ ...newUserData, designation: e.target.value })} 
                    required
                  >
                    <option value="Pointsman Grade I">Pointsman Grade I</option>
                    <option value="Pointsman Grade II">Pointsman Grade II</option>
                    <option value="Pointsman Grade III">Pointsman Grade III</option>
                  </select>
                </div>
              ) : (
                <div className="ti2-form-field">
                  <label>Designation</label>
                  <input type="text" value="Station Master" disabled />
                </div>
              )}
            </div>

            <div className="ti2-form-field">
              <label>Assigned Station <span style={{ color: "#dc2626" }}>*</span></label>
              <select 
                value={newUserData.station} 
                onChange={e => setNewUserData({ ...newUserData, station: e.target.value })} 
                required
              >
                {myStations.map(st => (
                  <option key={st.id} value={st.name}>{st.name} ({st.code})</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>Contact Mobile <span style={{ color: "#dc2626" }}>*</span></label>
                <input 
                  type="text" 
                  value={newUserData.contact} 
                  onChange={e => setNewUserData({ ...newUserData, contact: e.target.value })} 
                  placeholder="e.g. +91 98765 43210" 
                  required 
                />
              </div>
              <div className="ti2-form-field">
                <label>Joining Date <span style={{ color: "#dc2626" }}>*</span></label>
                <input 
                  type="date" 
                  value={newUserData.joiningDate} 
                  onChange={e => setNewUserData({ ...newUserData, joiningDate: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>PME Status</label>
                <select value={newUserData.pmeStatus} onChange={e => setNewUserData({ ...newUserData, pmeStatus: e.target.value })}>
                  <option>Fit</option>
                  <option>Unfit</option>
                  <option>Overdue</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="ti2-form-field">
                <label>REF Status</label>
                <select value={newUserData.refStatus} onChange={e => setNewUserData({ ...newUserData, refStatus: e.target.value })}>
                  <option>Cleared</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
              </div>
            </div>

            <div className="ti2-review-actions" style={{ marginTop: "12px" }}>
              <button type="button" className="ti2-ghost-btn" onClick={() => setShowAddUserModal(false)}>Cancel</button>
              <button type="submit" className="ti2-primary-btn">Save Personnel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER: MY ASSESSMENTS PAGE
     (Interactive Quiz + timeline scorecard history)
  ═══════════════════════════════════════════ */
  const renderMyAssessment = ()=>{
    if (quizState === "quiz") {
      const q = TI_QUIZ[currentQuestion];
      const answeredCount = quizAnswers.filter(v => v !== null).length;
      const completionRate = Math.round((answeredCount / 25) * 100);

      return (
        <div className="ti2-card animate-fade-in" style={{ padding: "24px" }}>
          <div className="ti2-card-hdr" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "20px" }}>
            <h2 style={{ margin: 0 }}>Self-Compliance Assessment Test</h2>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Question {currentQuestion + 1} of 25</span>
          </div>
          <p className="ti2-subtitle" style={{ fontSize: "13px", color: "#64748b", marginTop: "-12px", marginBottom: "18px" }}>
            Verify your operational guidelines knowledge as a Traffic Inspector. All 25 questions are compulsory.
          </p>
          
          {/* Progress Bar */}
          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden", margin: "14px 0 6px 0" }}>
            <div style={{ height: "100%", background: "#2563eb", width: `${completionRate}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "20px", fontWeight: "600" }}>
            <span>Progress: {completionRate}%</span>
            <span>{answeredCount}/25 Answered</span>
          </div>
          
          {/* Question Box */}
          <div style={{ padding: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", marginTop: "10px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Compulsory Question {currentQuestion + 1}</span>
            <h4 style={{ margin: "0 0 18px 0", color: "#0f172a", fontSize: "15px", fontWeight: "700", lineHeight: "1.5" }}>
              <HelpCircle size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px", marginTop: "-2px" }}/> 
              {q.q}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {q.opts.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuizOpt(idx)}
                  style={{ padding: "14px", borderRadius: "8px", border: quizAnswers[currentQuestion] === idx ? "2px solid #2563eb" : "1.5px solid #cbd5e1", background: quizAnswers[currentQuestion] === idx ? "#eff6ff" : "#fff", color: "#0f172a", fontSize: "13px", fontWeight: "600", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ display: "inline-flex", width: "24px", height: "24px", borderRadius: "50%", background: quizAnswers[currentQuestion] === idx ? "#2563eb" : "#f1f5f9", color: quizAnswers[currentQuestion] === idx ? "#fff" : "#475569", alignItems: "center", justifyContent: "center", fontSize: "12px", fontFamily: "monospace" }}>{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div style={{ marginTop: "24px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "10px", textAlign: "center" }}>Assessment Question Navigator</span>
            <div className="pm-question-panel" style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
              {TI_QUIZ.map((item, index) => {
                const isCurrent = index === currentQuestion;
                const isAnswered = quizAnswers[index] !== null;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`pm-question-pill ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}`}
                    onClick={() => setCurrentQuestion(index)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s"
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", alignItems: "center" }}>
            <button className="ti2-ghost-btn" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(p=>p-1)} style={{ padding: "10px 18px", fontSize: "13px", fontWeight: "600" }}>← Previous</button>
            <button className="ti2-primary-btn" disabled={currentQuestion === 24} onClick={() => setCurrentQuestion(p=>p+1)} style={{ padding: "10px 18px", fontSize: "13px", fontWeight: "600" }}>Next Question →</button>
          </div>

          {/* Submit Row & Compulsory Guidance */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              {answeredCount < 25 ? (
                <span style={{ color: "#d97706", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                  ⚠️ Compulsory: {25 - answeredCount} unanswered questions remaining. Submit disabled.
                </span>
              ) : (
                <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                  ✓ All 25 questions answered. Safety compliance verification ready.
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button"
                className="ti2-ghost-btn" 
                style={{ color: "#dc2626", borderColor: "#fca5a5" }}
                onClick={() => {
                  if (confirm("Are you sure you want to cancel the self-assessment? No progress will be saved.")) {
                    setQuizState("idle");
                  }
                }}
              >
                Cancel Assessment
              </button>
              <button 
                type="button"
                className="ti2-primary-btn" 
                style={{ background: "#16a34a", opacity: answeredCount < 25 ? 0.6 : 1 }} 
                disabled={answeredCount < 25} 
                onClick={submitQuiz}
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (quizState === "result") {
      const record = selectedRecord || {
        totalScore: latestQuizScore,
        category: getCat(latestQuizScore),
        period: "Self-Check",
        date: new Date().toISOString().slice(0, 10),
        aomRemarks: "Self-compliance check completed.",
        sections: [
          { title: "Whistle Codes & Hand Signals",          marks: 0, outOf: 20 },
          { title: "Token & Line Clear Authorities",        marks: 0, outOf: 20 },
          { title: "Station Interlocking & Track Circuits", marks: 0, outOf: 20 },
          { title: "Shunting Operations & Point Locking",   marks: 0, outOf: 20 },
          { title: "Gate Signals & Siding Isolation",        marks: 0, outOf: 20 }
        ]
      };
      
      const cat = record.category || getCat(record.totalScore);
      const performanceSummary = getPerformanceSummaryText(record.totalScore, record.sections);

      return (
        <div className="ti2-card animate-fade-in" style={{ padding: "24px" }}>
          <div className="ti2-card-hdr" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "20px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}><ShieldCheck size={22} color="#16a34a"/> Detailed Evaluation Scorecard</h2>
            <button className="ti2-primary-btn" onClick={() => { setQuizState("idle"); setSelectedRecord(null); }}>← Return to Ledger</button>
          </div>

          <div className="pm-scorecard-hero" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
            <div className="pm-sc-score-circle" style={{ width: "90px", height: "90px", borderRadius: "50%", border: `6px solid ${CAT_C[cat] || "#2563eb"}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexShrink: 0, background: "#fff" }}>
              <strong style={{ fontSize: "24px", color: CAT_C[cat] || "#2563eb", fontWeight: "800" }}>{record.totalScore}</strong>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", marginTop: "-2px" }}>/100</span>
            </div>
            <div>
              <span className="pm-cat-badge-lg" style={{ background: CAT_B[cat], color: CAT_C[cat], display: "inline-block", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                Final Category: Category {cat}
              </span>
              <p className="pm-sc-period" style={{ margin: "2px 0", fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>{record.period} - Self-Compliance Audit</p>
              <p className="pm-sc-date" style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>Attempt Completed: {record.date} &nbsp;·&nbsp; Assessed By: {record.assessedBy || "Self Compliance"}</p>
            </div>
          </div>

          {/* Dynamic Performance Summary */}
          <div className="pm-performance-summary-box" style={{ background: "#eff6ff", borderLeft: "4px solid #2563eb", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "6px" }}>📊 Official Performance Evaluation Summary</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#1e3a8a", lineHeight: "1.5" }}>{performanceSummary}</p>
          </div>

          {/* Module Performance Details */}
          <div className="pm-sc-sections" style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "15px", color: "#0f172a", marginBottom: "16px", fontWeight: "700" }}>Safety Domain Competency Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {record.sections.map(s => {
                const spc = Math.round((s.marks / s.outOf) * 100);
                const barColor = spc >= 80 ? "#16a34a" : spc >= 50 ? "#2563eb" : spc >= 26 ? "#d97706" : "#dc2626";
                return (
                  <div key={s.title} className="pm-sc-section-row" style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "13px" }}>
                    <span className="pm-sc-section-name" style={{ width: "260px", fontWeight: "600", color: "#334155" }}>{s.title}</span>
                    <div className="pm-sc-bar-wrap" style={{ flexGrow: 1, height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                      <div className="pm-sc-bar-fill" style={{ width: `${spc}%`, height: "100%", background: barColor, borderRadius: "999px" }} />
                    </div>
                    <span className="pm-sc-section-marks" style={{ width: "60px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>{s.marks}/{s.outOf}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complete MCQ Question Review */}
          <div className="pm-mcq-review-panel" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
            <div className="pm-chart-header" style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} color="#475569"/>
              <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>Complete Self-Assessment Question Review</h3>
            </div>
            <p className="pm-subtitle" style={{ fontSize: "12px", color: "#64748b", marginTop: "-10px", marginBottom: "20px" }}>
              Below is the detailed response evaluation for all 25 compulsory questions. Correct responses are highlighted in green; incorrect choices are highlighted in red.
            </p>

            <div className="pm-review-questions-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {TI_QUIZ.map((q, qIndex) => {
                const selectedOpt = quizAnswers ? quizAnswers[qIndex] : null;
                const isCorrect = selectedOpt === q.ans;

                return (
                  <div key={qIndex} className={`pm-review-question-card ${isCorrect ? "correct-card" : "wrong-card"}`}>
                    <div className="pm-rq-header">
                      <span className="pm-rq-number">Question {qIndex + 1}</span>
                      {isCorrect ? (
                        <span className="pm-rq-badge success">Correct (+4 Marks)</span>
                      ) : (
                        <span className="pm-rq-badge danger">Incorrect (0 Marks)</span>
                      )}
                    </div>
                    <h4 className="pm-rq-text">{q.q}</h4>

                    <div className="pm-rq-options-grid">
                      {q.opts.map((opt, oIdx) => {
                        const wasSelected = selectedOpt === oIdx;
                        const isOptCorrect = q.ans === oIdx;
                        
                        let optClass = "";
                        if (wasSelected) {
                          optClass = isCorrect ? "opt-selected-correct" : "opt-selected-wrong";
                        } else if (isOptCorrect) {
                          optClass = "opt-correct-unselected";
                        }

                        return (
                          <div key={oIdx} className={`pm-rq-option-item ${optClass}`}>
                            <span className="font-mono opt-prefix">{["A", "B", "C", "D"][oIdx]}</span>
                            <span className="opt-label-text">{opt}</span>
                            {wasSelected && (
                              <span className="opt-user-tag">{isCorrect ? "✓ Selected" : "✗ Selected"}</span>
                            )}
                            {!wasSelected && isOptCorrect && (
                              <span className="opt-correct-tag">✓ Correct Key</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    const avgScore = Math.round(tiAssessments.reduce((s,a)=>s+a.totalScore,0)/tiAssessments.length);
    return (
      <div className="ti2-card animate-fade-in" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h2>Self-Assessments &amp; Timeline Ledger</h2>
            <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Evaluations conducted by Area Operation Managers (AOM) and self safety audits.</p>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            {isExamAssigned ? (
              <button 
                className="ti2-primary-btn" 
                onClick={startQuiz} 
                style={{ background: "#16a34a", animation: "pulse 2s infinite", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={13}/> Take Assigned Safety Assessment
              </button>
            ) : (
              <button 
                className="ti2-primary-btn" 
                disabled 
                style={{ background: "#64748b", cursor: "not-allowed", opacity: 0.8, display: "flex", alignItems: "center", gap: "6px" }}
                title="Assessment access is locked until assigned by AOM"
              >
                <Lock size={13}/> Safety Exam Locked (Awaiting AOM)
              </button>
            )}
            <button className="ti2-view-profile-btn" onClick={() => exportAlert("PDF", "TI_Assessment_History_R Khan")}>
              <Download size={13}/> Export Timeline
            </button>
          </div>
        </div>

        {/* Real-time AOM Exam Assignment Banner */}
        {isExamAssigned ? (
          <div style={{ background: "#dcfce7", borderLeft: "4px solid #16a34a", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ShieldCheck size={26} color="#16a34a" style={{ flexShrink: 0 }}/>
              <div>
                <strong style={{ color: "#14532d", fontSize: "14px", display: "block" }}>📝 Assigned Exam Dispatch Alert</strong>
                <span style={{ color: "#166534", fontSize: "12px", lineHeight: "1.4" }}>The Area Operation Manager (AOM) has assigned a standard 25-question Safety & Compliance Assessment for you. Please complete it now.</span>
              </div>
            </div>
            <button 
              className="ti2-primary-btn" 
              onClick={startQuiz} 
              style={{ background: "#16a34a", flexShrink: 0, padding: "8px 14px", fontSize: "12px", fontWeight: "700" }}
            >
              Start Assigned Exam
            </button>
          </div>
        ) : (
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderLeft: "4px solid #64748b", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Lock size={22} color="#64748b" style={{ flexShrink: 0 }}/>
            <div>
              <strong style={{ color: "#334155", fontSize: "14px", display: "block" }}>🔒 No Pending Assigned Exams</strong>
              <span style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.4" }}>You have no pending safety exams assigned to you by the AOM. Safety compliance assessments must be explicitly dispatched by the AOM before you can attempt them.</span>
            </div>
          </div>
        )}

        <div className="ti2-myassess-summary">
          {[
            { label:"Total Assessments", v: tiAssessments.length },
            { label:"Latest Score",      v: `${tiAssessments[0]?.totalScore || 0}/100` },
            { label:"Average Score",     v: `${avgScore || 0}/100` },
            { label:"Latest Category",   v: tiAssessments[0]?.category || "Grade A" },
          ].map(c=>(
            <div key={c.label} className="ti2-report-mini">
              <label>{c.label}</label>
              <strong style={c.label==="Latest Category"?{color:CAT_C[c.v]}:{}}>{c.v}</strong>
            </div>
          ))}
        </div>

        {/* Timeline representation list */}
        <div className="ti2-myassess-list">
          <div className="ti2-myassess-head">
            {["Period","Date","Total Score","Category","Assessed By","Status",""].map(h=><span key={h}>{h}</span>)}
          </div>
          {tiAssessments.map(sc=>{
            const cat=sc.category;
            return (
              <div key={sc.id} className="ti2-myassess-row" style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1.8fr 1fr 0.8fr" }}>
                <span><strong>{sc.period}</strong></span>
                <span>{sc.date}</span>
                <span><strong>{sc.totalScore}/100</strong></span>
                <span><span className="ti2-badge" style={{background:CAT_B[cat],color:CAT_C[cat]}}>Cat. {cat}</span></span>
                <span style={{fontSize:12,color:"#64748b"}}>{sc.assessedBy}</span>
                <span><span className={`ti2-status-pill ti2-status-${sc.approvalStatus.toLowerCase()}`}>{sc.approvalStatus}</span></span>
                <span style={{color:"#2563eb",fontSize:12,fontWeight:600,cursor:"pointer"}} onClick={() => { setSelectedRecord(sc); setLatestQuizScore(sc.totalScore); setQuizAnswers(sc.userAnswers || generateTiMockResponses(sc.totalScore)); setQuizState("result"); }}>Review</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════
     RENDER: PME POSITION PAGE
  ═══════════════════════════════════════════ */
  const renderPmePosition = () => {
    const due = users.filter(u => u.pmeStatus === "Due" || u.pmeStatus === "Pending");
    const fit = users.filter(u => u.pmeStatus === "Fit");
    const overdue = users.filter(u => u.pmeStatus === "Overdue" || u.pmeStatus === "Unfit");
    
    return (
      <div className="ti2-page-body animate-fade-in">
        <div className="ti2-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2>Periodic Medical Examination (PME) Position</h2>
              <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Track periodic medical exam clearances, overdue alerts, and compliance targets.</p>
            </div>
            <button className="ti2-view-profile-btn" onClick={() => exportAlert("PDF", "Section_PME_Compliance_Report")}>
              <Download size={13}/> PME Report
            </button>
          </div>

          <div className="ti2-myassess-summary" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #16a34a" }}><label>PME FIT Clearance</label><strong style={{ color: "#16a34a" }}>{fit.length} staff</strong></div>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #d97706" }}><label>PME Due / Pending</label><strong style={{ color: "#d97706" }}>{due.length} staff</strong></div>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #dc2626" }}><label>PME Overdue (High Risk)</label><strong style={{ color: "#dc2626" }}>{overdue.length} alerts</strong></div>
          </div>

          <div className="ti2-profile-sec-title" style={{ color: "#dc2626" }}>CRITICAL PME OVERDUE ALERTS ({overdue.length})</div>
          <div className="ti2-table-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 1fr 1.2fr", padding: "10px 14px", background: "#fee2e2", color: "#991b1b", fontWeight: "700", fontSize: "11px" }}>
              <span>Staff Name</span>
              <span>HRMS ID</span>
              <span>Designation</span>
              <span>Assigned Station</span>
              <span>PME Status</span>
              <span>Action Taken</span>
            </div>
            {overdue.map(u => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 1fr 1.2fr", padding: "12px 14px", borderBottom: "1px solid #fecdd3", fontSize: "13px", alignItems: "center" }}>
                <strong>{u.name}</strong>
                <span style={{ fontFamily: "monospace" }}>{u.id}</span>
                <span>{u.designation}</span>
                <strong>{u.station}</strong>
                <span style={{ color: "#dc2626", fontWeight: "800" }}>{u.pmeStatus}</span>
                <span><button className="ti2-danger-btn" style={{ padding: "4px 10px", fontSize: "11px" }} onClick={() => { triggerNotification("warning", `Counselling scheduled for ${u.name}`); setGoToCounselling(u.name); }}>Schedule Counselling</button></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const setGoToCounselling = (name) => {
    setNewCoun(prev => ({ ...prev, staffName: name, topics: "PME evaluation preparation and rest compliance briefings." }));
    goTo("counselling");
    setShowCounForm(true);
  };

  /* ═══════════════════════════════════════════
     RENDER: REF POSITION PAGE
  ═══════════════════════════════════════════ */
  const renderRefPosition = () => {
    const completed = users.filter(u => u.refStatus === "Cleared");
    const pending = users.filter(u => u.refStatus === "Pending");
    const expired = users.filter(u => u.refStatus === "Expired" || u.refStatus === "Failed");

    return (
      <div className="ti2-page-body animate-fade-in">
        <div className="ti2-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2>Refresher Course (REF) training position</h2>
              <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Monitor pointsmen safety refresher training compliance ledger.</p>
            </div>
            <button className="ti2-view-profile-btn" onClick={() => exportAlert("PDF", "REF_Refresher_Training_Position")}>
              <Download size={13}/> REF Report
            </button>
          </div>

          <div className="ti2-myassess-summary" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #16a34a" }}><label>REF Cleared / Completed</label><strong style={{ color: "#16a34a" }}>{completed.length} staff</strong></div>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #d97706" }}><label>REF Pending Class</label><strong style={{ color: "#d97706" }}>{pending.length} staff</strong></div>
            <div className="ti2-report-mini" style={{ borderLeft: "4px solid #dc2626" }}><label>REF Expired alerts</label><strong style={{ color: "#dc2626" }}>{expired.length} personnel</strong></div>
          </div>

          <div className="ti2-profile-sec-title">REF Training Alert List</div>
          <div className="ti2-table-wrap">
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 1fr 1.2fr", padding: "10px 14px", background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontWeight: "700", fontSize: "11px" }}>
              <span>Staff Name</span>
              <span>HRMS ID</span>
              <span>Designation</span>
              <span>Station Section</span>
              <span>REF Status</span>
              <span>Action Clearance</span>
            </div>
            {users.filter(u => u.refStatus !== "Cleared").map(u => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 1fr 1.2fr", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", alignItems: "center" }}>
                <strong>{u.name}</strong>
                <span style={{ fontFamily: "monospace" }}>{u.id}</span>
                <span>{u.designation}</span>
                <strong>{u.station}</strong>
                <span style={{ color: u.refStatus === "Expired" ? "#dc2626" : "#d97706", fontWeight: "800" }}>{u.refStatus}</span>
                <span><button className="ti2-primary-btn-sm" style={{ fontSize: "11px", padding: "5px 12px" }} onClick={() => { alert(`✓ Clear REF action submitted: ${u.name} scheduled for refresher training batches.`); setUsers(prev=>prev.map(x=>x.id===u.id?{...x, refStatus: "Cleared"}:x)); addAuditLog("Clear REF training", `Scheduled refresher course for ${u.name}`); }}>Clear REF</button></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════
     RENDER: INSPECTIONS PAGE
  ═══════════════════════════════════════════ */
  const renderInspections = () => (
    <div className="ti2-page-body animate-fade-in">
      <div className="ti2-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2>Field Inspection Reports &amp; Schedules</h2>
            <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Schedule field audits, document safety observations, and log track point compliance.</p>
          </div>
          <button className="ti2-primary-btn" onClick={() => setShowInspForm(!showInspForm)}>
            <Plus size={13}/> {showInspForm ? "Close Form" : "Log New Inspection"}
          </button>
        </div>

        {showInspForm && (
          <form onSubmit={submitInspection} className="ti2-assess-form" style={{ padding: "18px", border: "1px dashed #cbd5e1", borderRadius: "12px", background: "#f8fafc", marginBottom: "18px" }}>
            <div className="ti2-form-field">
              <label>Audited Station</label>
              <select value={newInsp.station} onChange={e=>setNewInsp({...newInsp, station: e.target.value})} required>
                {myStations.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
              </select>
            </div>
            
            <div className="ti2-form-field">
              <label>Risk Level Class</label>
              <select value={newInsp.risk} onChange={e=>setNewInsp({...newInsp, risk: e.target.value})} required>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="ti2-form-field" style={{ gridColumn: "1/-1" }}>
              <label>Safety Observations &amp; Point Audit Remarks</label>
              <textarea rows={3} value={newInsp.observations} onChange={e=>setNewInsp({...newInsp, observations: e.target.value})} placeholder="Describe joint clearance, signal relays, shunting speed compliance observations..." required/>
            </div>

            <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" className="ti2-ghost-btn" onClick={() => setShowInspForm(false)}>Cancel</button>
              <button type="submit" className="ti2-primary-btn">Submit Inspection Log</button>
            </div>
          </form>
        )}

        {/* Inspections ledger list */}
        <div className="ti2-table-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 3fr 1.2fr 1fr", padding: "10px 14px", background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontWeight: "700", fontSize: "11px" }}>
            <span>Inspection Date</span>
            <span>Station audited</span>
            <span>Safety Observations</span>
            <span>Risk Severity</span>
            <span>Status</span>
          </div>

          {inspections.map(i => (
            <div key={i.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 3fr 1.2fr 1fr", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", alignItems: "center" }}>
              <strong>{i.date}</strong>
              <strong>{i.station}</strong>
              <span>{i.observations}</span>
              <span><span className="ti2-badge" style={{ background: RISK_B[i.risk], color: RISK_C[i.risk] }}>{i.risk} Risk</span></span>
              <span><span className="ti2-pill-grey">{i.status}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER: COUNSELLING PAGE
  ═══════════════════════════════════════════ */
  const renderCounselling = () => (
    <div className="ti2-page-body animate-fade-in">
      <div className="ti2-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2>Staff Counselling &amp; Behaviour Records</h2>
            <p className="ti2-subtitle" style={{ margin: "2px 0 0" }}>Brief high-risk pointsmen, log safety awareness counseling sessions, and track behaviour logs.</p>
          </div>
          <button className="ti2-primary-btn" onClick={() => setShowCounForm(!showCounForm)}>
            <Plus size={13}/> {showCounForm ? "Close Form" : "Log Counselling Briefing"}
          </button>
        </div>

        {showCounForm && (
          <form onSubmit={submitCounselling} className="ti2-assess-form" style={{ padding: "18px", border: "1px dashed #cbd5e1", borderRadius: "12px", background: "#f8fafc", marginBottom: "18px" }}>
            <div className="ti2-form-field">
              <label>Staff Roster Personnel</label>
              <select value={newCoun.staffName} onChange={e=>{
                const targetUser = users.find(u => u.name === e.target.value);
                setNewCoun({ ...newCoun, staffName: e.target.value, designation: targetUser?.designation || "Pointsman", station: targetUser?.station || "Parbhani Junction" });
              }} required>
                <option value="">Select staff member…</option>
                {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.designation} - {u.station})</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="ti2-form-field">
                <label>Session Duration</label>
                <input type="text" value={newCoun.duration} onChange={e=>setNewCoun({...newCoun, duration: e.target.value})} placeholder="e.g. 45 mins" required/>
              </div>
              <div className="ti2-form-field">
                <label>Progress Status</label>
                <select value={newCoun.progress} onChange={e=>setNewCoun({...newCoun, progress: e.target.value})} required>
                  <option>Under Monitor</option>
                  <option>Completed</option>
                  <option>Recommended for REF</option>
                </select>
              </div>
            </div>

            <div className="ti2-form-field" style={{ gridColumn: "1/-1" }}>
              <label>Briefing Topics &amp; Counselling Notes</label>
              <textarea rows={3} value={newCoun.topics} onChange={e=>setNewCoun({...newCoun, topics: e.target.value})} placeholder="Focus topics: Alcoholic rehabilitation, safe shunting speeds, whistle codes compliance, alertness..." required/>
            </div>

            <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" className="ti2-ghost-btn" onClick={() => setShowCounForm(false)}>Cancel</button>
              <button type="submit" className="ti2-primary-btn">Submit Counselling Brief</button>
            </div>
          </form>
        )}

        {/* Counselling list */}
        <div className="ti2-table-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1.2fr 2.5fr 1fr 1.2fr", padding: "10px 14px", background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontWeight: "700", fontSize: "11px" }}>
            <span>Counselling Date</span>
            <span>Staff Name</span>
            <span>Designation</span>
            <span>Focus Briefing Topics</span>
            <span>Duration</span>
            <span>Progress Status</span>
          </div>

          {counsellings.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1.2fr 2.5fr 1fr 1.2fr", padding: "12px 14px", borderBottom: "1px solid #f1f5f9", fontSize: "13px", alignItems: "center" }}>
              <strong>{c.date}</strong>
              <strong>{c.staffName}</strong>
              <span><span className="ti2-pill-grey" style={{ fontSize: "10px", fontWeight: "700" }}>{c.designation}</span></span>
              <span>{c.topics}</span>
              <span>{c.duration}</span>
              <span><span className="ti2-badge" style={{ background: c.progress === "Completed" ? "#d1fae5" : "#fef3c7", color: c.progress === "Completed" ? "#065f46" : "#92400e" }}>{c.progress}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── PM REVIEW ── */
  const renderPmReview = ()=>{
    /* Detail view */
    if (selectedPM) {
      const secs = editSections[selectedPM.id]||selectedPM.originalSections;
      const liveTotal = secs.reduce((s,x)=>s+x.score,0);
      const liveCat   = getCat(liveTotal);
      const locked    = selectedPM.status!=="Pending";
      const reject    = rejectMode[selectedPM.id]||false;

      return (
        <div className="ti2-card animate-fade-in">
          <div className="ti2-card-hdr">
            <div>
              <h2>Review — {selectedPM.pointsmanName} ({selectedPM.hrmsId})</h2>
              <p style={{margin:"2px 0 0",fontSize:12,color:"#64748b"}}>{selectedPM.station} · Submitted by {selectedPM.assessingSM} on {selectedPM.submissionDate}</p>
            </div>
            <button className="ti2-link-btn" onClick={()=>setSelectedPmId(null)}>← Back</button>
          </div>

          {/* Pointsman info */}
          <div className="ti2-review-meta">
            <div><label>Pointsman</label><strong>{selectedPM.pointsmanName}</strong></div>
            <div><label>HRMS ID</label><strong>{selectedPM.hrmsId}</strong></div>
            <div><label>Station</label><strong>{selectedPM.station}</strong></div>
            <div><label>PME Status</label><strong className={selectedPM.meta.pmeStatus==="Fit"?"ti2-green":"ti2-red"}>{selectedPM.meta.pmeStatus}</strong></div>
            <div><label>REF Status</label><strong className={selectedPM.meta.refStatus==="Cleared"?"ti2-green":"ti2-amber"}>{selectedPM.meta.refStatus}</strong></div>
            <div><label>Alcoholic Status</label><strong>{selectedPM.meta.alcoholicStatus}</strong></div>
          </div>

          {/* Section-wise edit */}
          <h4 className="ti2-sec-title">Section-wise Assessment Marks</h4>
          <div className="ti2-review-sections">
            {secs.map((sec,idx)=>{
              const pct = Math.round((sec.score/sec.max)*100);
              return (
                <div key={sec.title} className="ti2-review-sec-row">
                  <span className="ti2-review-sec-name">{sec.title}</span>
                  <div className="ti2-review-bar-wrap">
                    <div className="ti2-review-bar" style={{width:`${pct}%`,background:pct>=80?"#16a34a":pct>=50?"#2563eb":"#dc2626"}}/>
                  </div>
                  {locked ? (
                    <span className="ti2-review-score-static">{sec.score}/{sec.max}</span>
                  ) : (
                    <div className="ti2-review-score-input">
                      <input type="number" min={0} max={sec.max} value={sec.score}
                        onChange={e=>updateSec(selectedPM.id,idx,e.target.value)}/>
                      <span className="ti2-sec-max">/ {sec.max}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live score */}
          <div className="ti2-live-score">
            <div><label>Grand Total</label><strong style={{color:CAT_C[liveCat],fontSize:22}}>{liveTotal}/100</strong></div>
            <div><label>Category</label><span className="ti2-badge" style={{background:CAT_B[liveCat],color:CAT_C[liveCat],fontSize:13,padding:"4px 14px"}}>Category {liveCat}</span></div>
          </div>

          {/* TI remarks */}
          {!locked && (
            <div className="ti2-form-field">
              <label>TI Remarks</label>
              <textarea rows={3} value={tiRemarks[selectedPM.id]||""} onChange={e=>setTiRemarks(p=>({...p,[selectedPM.id]:e.target.value}))} placeholder="Add remarks…"/>
            </div>
          )}

          {/* Reject input */}
          {reject && !locked && (
            <div className="ti2-form-field" style={{marginTop:10}}>
              <label style={{color:"#dc2626"}}>Rejection Reason (mandatory)</label>
              <textarea rows={2} placeholder="Enter rejection reason…" id={`reject-${selectedPM.id}`}/>
            </div>
          )}

          {/* Audit trail */}
          {selectedPM.auditTrail?.length>0 && (
            <div>
              <button className="ti2-link-btn-sm" style={{marginTop:12}} onClick={()=>setShowAudit(p=>({...p,[selectedPM.id]:!p[selectedPM.id]}))}>
                {showAudit[selectedPM.id]?"Hide":"View"} Audit Trail
              </button>
              {showAudit[selectedPM.id] && (
                <div className="ti2-audit-trail">
                  {selectedPM.auditTrail.map((a,i)=>(
                    <div key={i} className="ti2-audit-row">
                      <strong>{a.action}</strong> · {a.by} · {a.date}
                      {a.remark && <div style={{fontSize:11,color:"#64748b",marginTop:2}}>"{a.remark}"</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {locked && (
            <div className="ti2-locked-banner">
              {selectedPM.status==="Approved"?"✓ Assessment Approved and Locked":"✗ Assessment Rejected"}
              {selectedPM.tiRemarks && <div style={{marginTop:4,fontSize:12}}>Remarks: {selectedPM.tiRemarks}</div>}
            </div>
          )}

          {!locked && !reject && (
            <div className="ti2-review-actions">
              <button className="ti2-danger-btn" onClick={()=>setRejectMode(p=>({...p,[selectedPM.id]:true}))}>
                <XCircle size={14}/> Reject
              </button>
              <button className="ti2-ghost-btn" onClick={()=>finalizePM(selectedPM.id,"approve")}>
                <CheckCircle2 size={14}/> Approve as Submitted
              </button>
              <button className="ti2-primary-btn" onClick={()=>finalizePM(selectedPM.id,"modify")}>
                <CheckCircle2 size={14}/> Modify & Approve
              </button>
            </div>
          )}
          {reject && !locked && (
            <div className="ti2-review-actions">
              <button className="ti2-ghost-btn" onClick={()=>setRejectMode(p=>({...p,[selectedPM.id]:false}))}>Cancel</button>
              <button className="ti2-danger-btn" onClick={()=>{
                const note=document.getElementById(`reject-${selectedPM.id}`)?.value||"No reason provided";
                finalizePM(selectedPM.id,"reject",note);
              }}>Confirm Rejection</button>
            </div>
          )}
        </div>
      );
    }

    /* List view */
    const tabs=["Pending","Approved","Rejected"];
    return (
      <div className="ti2-card animate-fade-in">
        <div className="ti2-card-hdr"><h2>Review Pointsman Assessments</h2></div>
        <p className="ti2-subtitle">Review, edit, and approve Pointsman assessments submitted by Station Masters.</p>

        {/* Tabs */}
        <div className="ti2-tabs">
          {tabs.map(t=>(
            <button key={t} className={`ti2-tab ${reviewTab===t?"active":""}`} onClick={()=>setReviewTab(t)}>
              {t} <span className="ti2-tab-count">{pmList.filter(p=>p.status===t).length}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="ti2-filter-row">
          <div className="ti2-search-box">
            <Search size={13}/><input placeholder="Search pointsman…" value={reviewSearch} onChange={e=>setReviewSearch(e.target.value)}/>
          </div>
          <select className="ti2-select" value={reviewStation} onChange={e=>setReviewStation(e.target.value)}>
            <option value="All">All Stations</option>
            {myStations.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="ti2-table-wrap">
          <div className="ti2-pm-head ti2-pm-row">
            {["Pointsman","HRMS ID","Station","Assessing SM","Date","Score","Status","Action"].map(h=><span key={h}>{h}</span>)}
          </div>
          {filteredPM.length===0&&<p className="ti2-empty">No records in this category.</p>}
          {filteredPM.map(p=>{
            const total = (p.finalSections||p.originalSections).reduce((s,x)=>s+x.score,0);
            const cat   = getCat(total);
            return (
              <div key={p.id} className="ti2-pm-row ti2-pm-data-row">
                <span><strong>{p.pointsmanName}</strong></span>
                <span>{p.hrmsId}</span>
                <span>{p.station}</span>
                <span>{p.assessingSM}</span>
                <span>{p.submissionDate}</span>
                <span><strong>{total}/100</strong></span>
                <span>
                  <span className={`ti2-status-pill ti2-status-${p.status.toLowerCase()}`}>{p.status}</span>
                </span>
                <span>
                  <button className="ti2-link-btn-sm" onClick={()=>openPmReview(p.id)}>
                    {p.status==="Pending"?<><ClipboardCheck size={12}/> Review</>:<><Eye size={12}/> View</>}
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── ASSESS SM ── */
  const renderAssessSM = ()=>{
    if (activeSmId) {
      const sm  = smList.find(s=>s.id===activeSmId);
      const f   = smForms[activeSmId]||defaultSMForm();
      const locked = !!smLocked[activeSmId];
      const {ynScore,knowledge,total} = computeSMScore(f);
      const isAlcoholic = f.alcoholicStatus === "Alcoholic";
      const liveCat = isAlcoholic ? "D" : getCat(total);
      return (
        <div className="ti2-card animate-fade-in">
          <div className="ti2-card-hdr">
            <div><h2>Assess SM — {sm?.name}</h2><p style={{margin:"2px 0 0",fontSize:12,color:"#64748b"}}>{sm?.hrmsId} · {sm?.station}</p></div>
            <button className="ti2-link-btn" onClick={()=>setActiveSmId(null)}>← Back</button>
          </div>

          {TI_SM_CRITERIA.map((sec,si)=>(
            <div key={sec.key} className="ti2-assess-section">
              <div className="ti2-assess-sec-hdr">
                <span className="ti2-assess-sec-num">{String(si+1).padStart(2,"0")}</span>
                <div><strong>{sec.label}</strong><span className="ti2-assess-sec-meta">{sec.count} criteria · {sec.weight} marks each · Total {sec.count*sec.weight}</span></div>
                <span className="ti2-assess-live-marks">
                  {f[sec.key].filter(v=>v==="Yes").length*sec.weight} / {sec.count*sec.weight}
                </span>
              </div>
              <div className="ti2-yn-grid">
                {sec.criteria.map((cr,idx)=>(
                  <div key={idx} className="ti2-yn-row">
                    <span className="ti2-yn-label">{idx+1}. {cr}</span>
                    <div className="ti2-yn-btns">
                      {["Yes","No"].map(v=>(
                        <button key={v} disabled={locked} type="button"
                          className={`ti2-yn-btn ti2-yn-${v.toLowerCase()}${f[sec.key][idx]===v?" active":""}`}
                          onClick={()=>toggleSMYN(activeSmId,sec.key,idx,v)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Knowledge + additional fields */}
          <div className="ti2-assess-section">
            <div className="ti2-assess-sec-hdr">
              <span className="ti2-assess-sec-num">06</span>
              <div><strong>Knowledge & Administrative Details</strong><span className="ti2-assess-sec-meta">Manual entry</span></div>
              <span className="ti2-assess-live-marks">{knowledge}/25</span>
            </div>
            <div className="ti2-assess-form" style={{marginTop:12}}>
              <div className="ti2-form-field"><label>Knowledge Marks (0–25)</label>
                <input type="number" min={0} max={25} disabled={locked} value={f.knowledgeMarks} onChange={e=>setSMField(activeSmId,"knowledgeMarks",e.target.value)} placeholder="Enter MCQ marks"/></div>
              <div className="ti2-form-field"><label>Alcoholic Status <span style={{color:"#dc2626"}}>*</span></label>
                <select disabled={locked} value={f.alcoholicStatus} onChange={e=>setSMField(activeSmId,"alcoholicStatus",e.target.value)}>
                  <option value="">Select…</option><option>Non-Alcoholic</option><option>Alcoholic</option>
                </select></div>
              <div className="ti2-form-field"><label>PME Status</label>
                <select disabled={locked} value={f.pmeStatus} onChange={e=>setSMField(activeSmId,"pmeStatus",e.target.value)}>
                  <option>Fit</option><option>Unfit</option><option>Pending</option>
                </select></div>
              <div className="ti2-form-field"><label>REF Status</label>
                <select disabled={locked} value={f.refStatus} onChange={e=>setSMField(activeSmId,"refStatus",e.target.value)}>
                  <option>Cleared</option><option>Pending</option><option>Failed</option>
                </select></div>
              <div className="ti2-form-field"><label>Counselling</label>
                <select disabled={locked} value={f.counselling} onChange={e=>setSMField(activeSmId,"counselling",e.target.value)}>
                  <option>Not Required</option><option>Recommended</option><option>Mandatory</option>
                </select></div>
              <div className="ti2-form-field"><label>Automatic Training</label>
                <select disabled={locked} value={f.automaticTraining} onChange={e=>setSMField(activeSmId,"automaticTraining",e.target.value)}>
                  <option>Not Required</option><option>Recommended</option><option>Mandatory</option>
                </select></div>
              <div className="ti2-form-field" style={{gridColumn:"1/-1"}}>
                <label>Remarks for AOM</label>
                <textarea rows={3} disabled={locked} value={f.remarks} onChange={e=>setSMField(activeSmId,"remarks",e.target.value)} placeholder="Enter observations…"/>
              </div>
            </div>
          </div>

          <div className="ti2-live-score">
            <div><label>Yes/No Score</label><strong>{ynScore}/75</strong></div>
            <div><label>Knowledge</label><strong>{knowledge}/25</strong></div>
            <div><label>Grand Total</label><strong style={{color:CAT_C[liveCat],fontSize:22}}>{total}/100</strong></div>
            <div><label>Category</label><span className="ti2-badge" style={{background:CAT_B[liveCat],color:CAT_C[liveCat],fontSize:13,padding:"4px 14px"}}>Category {liveCat}</span></div>
          </div>

          {locked && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <div className="ti2-locked-banner">✓ Assessment submitted. Pending AOM Approval.</div>
              <button type="button" className="ti2-ghost-btn" style={{ border: "1px solid #7c3aed", color: "#7c3aed" }} onClick={() => setSmLocked(p => ({ ...p, [activeSmId]: false }))}>
                <Edit size={14} style={{ marginRight: 6 }}/> Unlock & Edit Assessment
              </button>
            </div>
          )}
          {!locked && (
            <div className="ti2-review-actions">
              <button className="ti2-primary-btn" onClick={()=>submitSMAssessment(activeSmId)}>
                <CheckCircle2 size={14}/> Submit for AOM Approval
              </button>
            </div>
          )}
        </div>
      );
    }

    const getStatusStyle = (status) => {
      if (status === "Exam Sent") return { background: "#f3e8ff", color: "#6b21a8" };
      if (status === "Exam Taken") return { background: "#dcfce7", color: "#166534" };
      return {};
    };

    return (
      <div className="ti2-card animate-fade-in">
        <div className="ti2-card-hdr"><h2>Assess Station Masters</h2></div>
        <p className="ti2-subtitle">Station Masters pending assessment are listed below. Open the form to conduct a structured evaluation.</p>
        
        <div className="ti2-table-wrap" style={{ marginTop: "16px" }}>
          {/* Table Header Row */}
          <div className="ti2-pm-head" style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1.5fr 1.2fr 1fr 1.3fr 2.5fr",
            gap: "12px",
            alignItems: "center",
            padding: "12px 18px",
            background: "#f8fafc",
            borderBottom: "1.5px solid #e2edf8",
            fontSize: "12px",
            fontWeight: "800",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            <span>Station Master</span>
            <span>HRMS ID</span>
            <span>Station</span>
            <span>Last Assessed</span>
            <span>Score</span>
            <span>Exam Status</span>
            <span style={{ textAlign: "right", paddingRight: "10px" }}>Action</span>
          </div>

          {/* Table Body Rows */}
          {smList.map(s=>(
            <div key={s.id} className="ti2-pm-data-row" style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1.5fr 1.2fr 1fr 1.3fr 2.5fr",
              gap: "12px",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
              transition: "background 0.15s",
              background: "#ffffff"
            }}>
              {/* Station Master Avatar & Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="ti2-pm-avatar" style={{ width: 32, height: 32, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.name.charAt(0)}</div>
                <strong style={{ color: "#0f172a", fontSize: "13px" }}>{s.name}</strong>
              </div>

              {/* HRMS ID */}
              <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>{s.hrmsId}</span>

              {/* Station */}
              <span style={{ fontSize: "13px", color: "#475569" }}>{s.station}</span>

              {/* Last Assessed Date */}
              <span style={{ fontSize: "12px", color: "#64748b" }}>{s.lastDate}</span>

              {/* Dynamic Score display */}
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                {s.score ? `${s.score}/100` : "—"}
              </span>

              {/* Exam Status Badge */}
              <div>
                <span className={`ti2-status-pill ti2-status-${s.status.toLowerCase().replace(/\s+/g,"-")}`} style={{ ...getStatusStyle(s.status), padding: "4px 10px", fontSize: "11px", fontWeight: "700" }}>
                  {s.status}
                </span>
              </div>

              {/* Actions alignment */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "flex-end" }}>
                {s.status === "Pending" && (
                  <>
                    <button className="ti2-primary-btn-sm" style={{ background: "#7c3aed", border: "none", color: "#ffffff", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={()=>handleSendExamAccess(s.id)}>
                      Send Access
                    </button>
                    <button className="ti2-primary-btn-sm" style={{ background: "none", border: "1.5px solid #cbd5e1", color: "#475569", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={()=>openSMForm(s.id)}>
                      Open Form
                    </button>
                  </>
                )}
                {s.status === "Exam Sent" && (
                  <>
                    <span style={{ fontSize: "11px", color: "#6b21a8", fontWeight: "800", background: "#f3e8ff", padding: "6px 10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12}/> Waiting for SM...
                    </span>
                    <button className="ti2-primary-btn-sm" style={{ background: "none", border: "1.5px solid #cbd5e1", color: "#475569", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={()=>openSMForm(s.id)}>
                      Open Form
                    </button>
                  </>
                )}
                {s.status === "Exam Taken" && (
                  <button className="ti2-primary-btn-sm" style={{ background: "#16a34a", border: "none", color: "#ffffff", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={()=>openSMForm(s.id)}>
                    Start Assessment
                  </button>
                )}
                {s.status === "Submitted" && (
                  <>
                    <button className="ti2-primary-btn-sm" style={{ background: "#2563eb", border: "none", color: "#ffffff", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={()=>openSMForm(s.id)}>
                      View Form
                    </button>
                    <button className="ti2-primary-btn-sm" style={{ background: "#ea580c", border: "none", color: "#ffffff", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px" }} onClick={() => openSMForm(s.id, true)}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── REPORTS ── */
  const renderReports = ()=>{
    if (selectedReportUserId) {
      const u = users.find(x => x.id === selectedReportUserId);
      if (!u) return null;

      const cat = u.cat || getCat(u.score);
      const isHighRisk = u.pmeStatus === "Overdue" || u.refStatus === "Expired" || u.score < 50;
      const risk = isHighRisk ? "High" : u.score >= 80 ? "Low" : "Medium";
      
      // Get detailed assessments from state if available
      const pmAssess = pmList.find(p => p.hrmsId === u.id);
      const smAssess = smList.find(s => s.hrmsId === u.id);
      const smForm = smForms[smAssess?.id];

      return (
        <div className="ti2-card animate-fade-in" style={{ padding: "24px" }}>
          {/* Header section with back button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2edf8", paddingBottom: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div className="ti2-pm-avatar" style={{ width: 48, height: 48, fontSize: 18, background: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>{u.name.charAt(0)}</div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: 0 }}>{u.name}</h2>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#64748b", fontWeight: "700" }}>{u.role} Dossier · {u.station}</p>
              </div>
            </div>
            <button className="ti2-link-btn" onClick={() => setSelectedReportUserId(null)} style={{ fontSize: "13px", fontWeight: "800", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
              ← Back to Reports
            </button>
          </div>

          {/* Quick Info Summary metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2edf8", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Grand Total Score</span>
              <strong style={{ display: "block", fontSize: "24px", color: CAT_C[cat], marginTop: "4px", fontWeight: "900" }}>{u.score}/100</strong>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2edf8", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Safety Grade</span>
              <div>
                <span className="ti2-badge" style={{ display: "inline-block", background: CAT_B[cat], color: CAT_C[cat], fontSize: "13px", fontWeight: "800", padding: "4px 14px", borderRadius: "8px", marginTop: "8px" }}>
                  Category {cat}
                </span>
              </div>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2edf8", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>PME Clearance</span>
              <div>
                <span className="ti2-badge" style={{ display: "inline-block", background: u.pmeStatus === "Fit" ? "#dcfce7" : "#fee2e2", color: u.pmeStatus === "Fit" ? "#16a34a" : "#dc2626", fontSize: "13px", fontWeight: "800", padding: "4px 14px", borderRadius: "8px", marginTop: "8px" }}>
                  {u.pmeStatus}
                </span>
              </div>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2edf8", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>REF Training</span>
              <div>
                <span className="ti2-badge" style={{ display: "inline-block", background: u.refStatus === "Cleared" ? "#dcfce7" : "#fee2e2", color: u.refStatus === "Cleared" ? "#16a34a" : "#dc2626", fontSize: "13px", fontWeight: "800", padding: "4px 14px", borderRadius: "8px", marginTop: "8px" }}>
                  {u.refStatus}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "24px" }}>
            {/* Left side details card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "18px" }}>
                <h3 style={{ margin: "0 0 14px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1.5px solid #e2edf8", paddingBottom: "8px" }}>Personnel Roster Details</h3>
                <dl style={{ display: "flex", flexDirection: "column", gap: "12px", margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Employee HRMS ID</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>{u.id}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Designation</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>{u.designation || u.role}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Jurisdiction Station</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>{u.station}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Contact Number</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>{u.contact || "+91 98765 11001"}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Date of Appointment</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e293b" }}>{u.joiningDate || "2019-04-12"}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Alcoholic Status</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: u.alcoholicStatus === "Alcoholic" ? "#dc2626" : "#16a34a" }}>{u.alcoholicStatus || "Non-Alcoholic"}</dd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><dt style={{ color: "#64748b", fontSize: "12px", fontWeight: "700" }}>Assigned Division Risk</dt><dd style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: RISK_C[risk] }}>{risk} Risk</dd></div>
                </dl>
              </div>

              {/* Action buttons */}
              <button className="ti2-primary-btn" onClick={() => exportAlert("PDF", `Employee_Assessment_Dossier_${u.id}`)} style={{ width: "100%", height: "42px", justifyContent: "center", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", border: "none", color: "#ffffff", gap: "6px" }}>
                <FileText size={16}/> Export Assessment Dossier (PDF)
              </button>
            </div>

            {/* Right side Performance Breakdown */}
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1.5px solid #e2edf8", paddingBottom: "8px" }}>Sectional Competency Breakdown</h3>
              
              {u.role === "Pointsman" ? (
                /* Pointsman sections competency progress bars */
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {(() => {
                    const secs = pmAssess?.finalSections || pmAssess?.originalSections || [
                      { title: "Knowledge of Rules", score: Math.round(u.score * 0.23), max: 25 },
                      { title: "Alertness & Observation", score: Math.round(u.score * 0.22), max: 25 },
                      { title: "Safety Record", score: Math.round(u.score * 0.14), max: 15 },
                      { title: "Leadership & Management", score: Math.round(u.score * 0.13), max: 15 },
                      { title: "Discipline", score: Math.round(u.score * 0.09), max: 10 },
                      { title: "Appearance & Neatness", score: Math.round(u.score * 0.09), max: 10 },
                    ];
                    return secs.map(s => {
                      const pct = Math.round((s.score / s.max) * 100);
                      return (
                        <div key={s.title}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                            <span>{s.title}</span>
                            <strong>{s.score} / {s.max} ({pct}%)</strong>
                          </div>
                          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#16a34a" : pct >= 50 ? "#2563eb" : "#dc2626", borderRadius: "999px" }}/>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                /* Station Master sections competency progress bars */
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {(() => {
                    let totalYes = smForm ? smForm.stationMgmt.filter(v => v === "Yes").length +
                                           smForm.safety.filter(v => v === "Yes").length +
                                           smForm.staffSupervision.filter(v => v === "Yes").length +
                                           smForm.documentation.filter(v => v === "Yes").length +
                                           smForm.emergency.filter(v => v === "Yes").length : 12;
                    let knowledgeMarks = smForm ? Math.min(parseInt(smForm.knowledgeMarks) || 0, 25) : Math.max(0, u.score - 60);

                    const secs = [
                      { title: "Station Management", score: smForm ? smForm.stationMgmt.filter(v => v === "Yes").length * 5 : Math.round(totalYes * 5 * 0.25), max: 25 },
                      { title: "Safety & Compliance", score: smForm ? smForm.safety.filter(v => v === "Yes").length * 4 : Math.round(totalYes * 4 * 0.25), max: 20 },
                      { title: "Staff Supervision", score: smForm ? smForm.staffSupervision.filter(v => v === "Yes").length * 3 : Math.round(totalYes * 3 * 0.20), max: 15 },
                      { title: "Documentation & Reporting", score: smForm ? smForm.documentation.filter(v => v === "Yes").length * 3 : Math.round(totalYes * 3 * 0.15), max: 15 },
                      { title: "Emergency Handling", score: smForm ? smForm.emergency.filter(v => v === "Yes").length * 5 : Math.round(totalYes * 5 * 0.25), max: 25 },
                      { title: "Knowledge (Safety Exam)", score: knowledgeMarks, max: 25 }
                    ];

                    return secs.map(s => {
                      const pct = Math.round((s.score / s.max) * 100);
                      return (
                        <div key={s.title}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                            <span>{s.title}</span>
                            <strong>{s.score} / {s.max} ({pct}%)</strong>
                          </div>
                          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#16a34a" : pct >= 50 ? "#2563eb" : "#dc2626", borderRadius: "999px" }}/>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const cats={A:0,B:0,C:0,D:0};
    filteredReport.forEach(r=>cats[r.cat || getCat(r.score)]++);
    const riskCnt={Low:0,Medium:0,High:0};
    filteredReport.forEach(r=>riskCnt[r.risk]++);

    return (
      <div className="ti2-card animate-fade-in">
        <div className="ti2-card-hdr"><h2>Reports &amp; Analytics</h2></div>
        <p className="ti2-subtitle">Cross-station performance data. Click any row to view their complete performance dossier.</p>

        {/* Filters */}
        <div className="ti2-filter-row">
          <div className="ti2-search-box">
            <Search size={13}/><input placeholder="Search staff…" value={rpSearch} onChange={e=>setRpSearch(e.target.value)}/>
          </div>
          <select className="ti2-select" value={rpStation} onChange={e=>setRpStation(e.target.value)}>
            <option value="All">All Stations</option>
            {myStations.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select className="ti2-select" value={rpCat} onChange={e=>setRpCat(e.target.value)}>
            {["All","A","B","C","D"].map(o=><option key={o}>{o}</option>)}
          </select>
          <select className="ti2-select" value={rpRisk} onChange={e=>setRpRisk(e.target.value)}>
            {["All","Low","Medium","High"].map(o=><option key={o}>{o}</option>)}
          </select>
          <div className="ti2-sort-wrap"><ArrowUpDown size={12}/>
            <select value={rpSort} onChange={e=>setRpSort(e.target.value)}>
              <option value="date-desc">Default</option>
              <option value="score-desc">High Score</option>
              <option value="score-asc">Low Score</option>
            </select>
          </div>
        </div>

        {/* Summary mini-cards */}
        <div className="ti2-report-summary">
          {[
            { label:"Filtered Staff",   v: filteredReport.length },
            { label:"Avg Score",        v: filteredReport.length? Math.round(filteredReport.reduce((s,r)=>s+r.score,0)/filteredReport.length) : "—" },
            { label:"High Risk",        v: riskCnt.High },
            { label:"Cat. A",           v: cats.A },
          ].map(c=>(
            <div key={c.label} className="ti2-report-mini"><label>{c.label}</label><strong>{c.v}</strong></div>
          ))}
        </div>

        {/* Table */}
        <div className="ti2-table-wrap" style={{marginTop:16}}>
          <div className="ti2-rp-head ti2-rp-row">
            {["Name","HRMS ID","Station","Score","Grade","Risk","Date"].map(h=><span key={h}>{h}</span>)}
          </div>
          {filteredReport.map((r,i)=>{
            const cat=r.cat;
            return (
              <div key={i} className="ti2-rp-row ti2-rp-data-row" style={{ cursor: "pointer" }} onClick={() => setSelectedReportUserId(r.hrmsId)}>
                <span><strong>{r.name}</strong></span>
                <span>{r.hrmsId}</span>
                <span>{r.station}</span>
                <span><strong>{r.score}/100</strong></span>
                <span><span className="ti2-badge" style={{background:CAT_B[cat],color:CAT_C[cat]}}>Cat. {cat}</span></span>
                <span><span className="ti2-badge" style={{background:RISK_B[r.risk],color:RISK_C[r.risk]}}>{r.risk}</span></span>
                <span>{r.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════
     RENDER: CONTENT ROUTER
  ═══════════════════════════════════════════ */
  const renderContent = ()=>{
    switch(activePage){
      case "dashboard":    return renderDashboard();
      case "profile":      return renderProfile();
      case "stations":     return renderStations();
      case "allUsers":     return renderAllUsers();
      case "reviewPM":     return renderPmReview();
      case "assessSM":     return renderAssessSM();
      case "myAssessment": return renderMyAssessment();
      case "pmePosition":  return renderPmePosition();
      case "refPosition":  return renderRefPosition();
      case "inspections":  return renderInspections();
      case "counselling":  return renderCounselling();
      case "reports":      return renderReports();
      default:             return renderDashboard();
    }
  };

  /* ═══════════════════════════════════════════
     SHELL LAYOUT
  ═══════════════════════════════════════════ */
  return (
    <div className="ti2-layout">
      
      {/* Top Navigation Header */}
      <header className="ti2-topbar">
        <div className="ti2-topbar-brand">
          <div className="ti2-topbar-logo">IR</div>
          <div>
            <h1>Indian Railway Evaluation Command</h1>
            <p>Operations Workspace: Traffic Inspector Module</p>
          </div>
        </div>

        <div className="ti2-user-strip">
          
          {/* Dynamic Real-Time Notifications Bell Dropdown */}
          <div style={{ position: "relative", marginRight: "6px" }}>
            <button
              onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
              style={{ background: "none", border: "none", color: "#e2edf8", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", padding: "6px", borderRadius: "50%" }}
            >
              <Bell size={20}/>
              {notifications.filter(n=>!n.read).length > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "16px", height: "16px", borderRadius: "50%", background: "#dc2626", color: "#ffffff", fontSize: "9px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {notifications.filter(n=>!n.read).length}
                </span>
              )}
            </button>

            {bellDropdownOpen && (
              <div style={{ position: "absolute", top: "36px", right: 0, width: "320px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "14px", boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)", zIndex: 1000, overflow: "hidden", color: "#0f172a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #e2edf8" }}>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "800" }}>Operations Alerts</h4>
                  {notifications.filter(n=>!n.read).length > 0 && (
                    <button onClick={markAllNotificationsRead} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "700", fontSize: "11px", cursor: "pointer" }}>Mark all read</button>
                  )}
                </div>
                <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", background: n.read ? "#fff" : "#f0f6ff" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.type === "danger" ? "#dc2626" : n.type === "warning" ? "#ea580c" : "#16a34a", marginTop: "4px", flexShrink: 0 }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", lineHeight: "1.4", fontWeight: n.read ? "500" : "800", color: "#1e293b" }}>{n.message}</p>
                        <span style={{ fontSize: "10px", color: "#64748b" }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="ti2-empty">No alerts in your inbox.</p>}
                </div>
              </div>
            )}
          </div>

          <div className="ti2-user-avatar">{tiName.charAt(0)}</div>
          <div>
            <strong>{tiName}</strong>
            <span>HRMS ID: {tiId}</span>
          </div>
          <button className="ti2-logout-btn" onClick={onLogout}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </header>

      {/* Main layout shell */}
      <div className="ti2-shell">
        <aside className="ti2-sidebar">
          {NAV.map(item=>{
            const Icon=item.icon;
            const active = activePage === item.key;
            return (
              <button key={item.key} className={`ti2-nav-item${active?" active":""}`}
                onClick={()=>goTo(item.key)}>
                <Icon size={16}/><span>{item.label}</span>
              </button>
            );
          })}
          

        </aside>

        <main className="ti2-main">
          {statusMsg && (
            <div className="ti2-status-banner">
              <CheckCircle2 size={13}/> {statusMsg}
              <button className="ti2-dismiss" onClick={()=>setStatusMsg("")}>×</button>
            </div>
          )}
          <div className="ti2-page-wrap">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
