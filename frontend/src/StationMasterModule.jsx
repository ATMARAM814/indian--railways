import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  Award,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart2,
  Filter,
  Gauge,
  LogOut,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCircle2,
  Users,
  XCircle,
  ArrowUpDown,
  Activity
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

/* ─── NAV ─── */
const navItems = [
  { key: "dashboard",     label: "Dashboard",            icon: BarChart3 },
  { key: "profile",       label: "My Profile",           icon: UserCircle2 },
  { key: "pointsmen",     label: "Pointsmen",            icon: Users },
  { key: "assess",        label: "Assess Pointsman",     icon: ClipboardCheck },
  { key: "myAssessment",  label: "My Assessment (by TI)",icon: FileBarChart2 },
  { key: "reports",       label: "Reports",              icon: Filter }
];

/* ─── HELPERS ─── */
function getCat(score) {
  if (score >= 80) return "A";
  if (score >= 50) return "B";
  if (score >= 26) return "C";
  return "D";
}
const CAT_COLOR   = { A: "#16a34a", B: "#2563eb", C: "#d97706", D: "#dc2626" };
const CAT_BG      = { A: "#dcfce7", B: "#dbeafe", C: "#fef3c7", D: "#fee2e2" };
const PIE_COLORS  = ["#16a34a","#2563eb","#d97706","#dc2626"];

function riskLevel(pm) {
  if (pm.safetyScore < 60 || pm.lastScore < 50)  return "High";
  if (pm.safetyScore < 75 || pm.lastScore < 65)  return "Medium";
  return "Low";
}
const RISK_COLOR = { High:"#dc2626", Medium:"#d97706", Low:"#16a34a" };
const RISK_BG    = { High:"#fee2e2", Medium:"#fef3c7", Low:"#dcfce7" };

/* ─── SM PROFILE ─── */
const smProfile = {
  name: "S. Deshmukh", employeeId: "SM_1001",
  contact: "+91 98220 44556", designation: "Station Master",
  department: "Operations", station: "Nagpur Junction",
  joiningDate: "2015-06-01", reportingOfficer: "TI_2001 — A. Kulkarni"
};

/* ─── POINTSMEN DATA ─── */
const initialPointsmen = [
  { id:1, hrmsId:"PM_1101", name:"Ravi Kumar",   gender:"Male", age:38, doj:"2012-04-10", basePay:"₹28,500", lastScore:92, safetyScore:95, totalAssessments:12, pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Approved" },
  { id:2, hrmsId:"PM_1102", name:"Sanjay Patil",  gender:"Male", age:34, doj:"2015-08-22", basePay:"₹26,200", lastScore:78, safetyScore:80, totalAssessments:9,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Pending"  },
  { id:3, hrmsId:"PM_1103", name:"Deepak Nair",   gender:"Male", age:41, doj:"2009-11-05", basePay:"₹31,000", lastScore:48, safetyScore:62, totalAssessments:15, pmeStatus:"Fit",      refStatus:"Pending",  disciplinary:"Warning", incidents:1, approvalStatus:"Approved" },
  { id:4, hrmsId:"PM_1104", name:"Ajay Sharma",   gender:"Male", age:29, doj:"2019-02-18", basePay:"₹23,400", lastScore:84, safetyScore:88, totalAssessments:6,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Pending"  },
  { id:5, hrmsId:"PM_1105", name:"Kunal Verma",   gender:"Male", age:36, doj:"2013-07-30", basePay:"₹27,800", lastScore:35, safetyScore:55, totalAssessments:11, pmeStatus:"Unfit",    refStatus:"Pending",  disciplinary:"Warning", incidents:2, approvalStatus:"Rejected" },
  { id:6, hrmsId:"PM_1106", name:"Priya Menon",   gender:"Female",age:31,doj:"2018-03-14",basePay:"₹25,100", lastScore:67, safetyScore:74, totalAssessments:7,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Approved" },
  { id:7, hrmsId:"PM_1107", name:"Ramesh Yadav",  gender:"Male", age:45, doj:"2005-09-01", basePay:"₹34,600", lastScore:82, safetyScore:90, totalAssessments:18, pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Approved" },
  { id:8, hrmsId:"PM_1108", name:"Sneha Iyer",    gender:"Female",age:28,doj:"2020-01-20",basePay:"₹22,000", lastScore:19, safetyScore:40, totalAssessments:3,  pmeStatus:"Unfit",    refStatus:"Pending",  disciplinary:"Serious", incidents:3, approvalStatus:"Rejected" }
];

/* ─── ASSESSMENT HISTORY per pointsman ─── */
const pmAssessmentHistory = {
  1:[{id:101,date:"2026-03-28",testMarks:80,addMarks:12,total:92,grade:"A",approvalStatus:"Approved",remarks:"Excellent performance"},{id:102,date:"2025-12-15",testMarks:74,addMarks:10,total:84,grade:"A",approvalStatus:"Approved",remarks:"Good"}],
  2:[{id:103,date:"2026-03-10",testMarks:65,addMarks:13,total:78,grade:"B",approvalStatus:"Pending",remarks:"Satisfactory"}],
  3:[{id:104,date:"2026-02-15",testMarks:38,addMarks:10,total:48,grade:"C",approvalStatus:"Approved",remarks:"Needs improvement in signals"}],
  4:[{id:105,date:"2026-03-18",testMarks:72,addMarks:12,total:84,grade:"A",approvalStatus:"Pending",remarks:"Good fieldwork"}],
  5:[{id:106,date:"2026-01-20",testMarks:25,addMarks:10,total:35,grade:"D",approvalStatus:"Rejected",tiRemarks:"TI: Score too low — re-assessment required"}],
  6:[{id:107,date:"2026-03-05",testMarks:55,addMarks:12,total:67,grade:"B",approvalStatus:"Approved",remarks:"Consistent"}],
  7:[{id:108,date:"2026-03-20",testMarks:70,addMarks:12,total:82,grade:"A",approvalStatus:"Approved",remarks:"Strong safety record"}],
  8:[{id:109,date:"2026-02-01",testMarks:12,addMarks:7, total:19,grade:"D",approvalStatus:"Rejected",tiRemarks:"TI: Multiple incidents recorded"}]
};

/* ─── DRAFT ASSESSMENTS ─── */
const initialDrafts = [
  { pointsmanId:2, hrmsId:"PM_1102", name:"Sanjay Patil",  lastDate:"2026-03-10" },
  { pointsmanId:4, hrmsId:"PM_1104", name:"Ajay Sharma",   lastDate:"2026-03-18" }
];

/* ─── YES/NO CRITERIA LABELS ─── */
const YN_SECTIONS = [
  {
    key: "alertness", title: "Alertness & Observation",
    weight: 5, outOf: 25,
    criteria: [
      "Observes track and signals diligently",
      "Responds promptly to train movements",
      "Maintains vigilance during duty hours",
      "Reports anomalies immediately",
      "Demonstrates situational awareness"
    ]
  },
  {
    key: "safety", title: "Safety Record",
    weight: 3, outOf: 15,
    criteria: [
      "Follows all safety protocols consistently",
      "No safety violations in review period",
      "Wears required PPE at all times",
      "Participates in safety drills",
      "Maintains incident-free record"
    ]
  },
  {
    key: "leadership", title: "Leadership & Management",
    weight: 3, outOf: 15,
    criteria: [
      "Guides junior staff effectively",
      "Handles peak hours without disruption",
      "Communicates clearly with team",
      "Resolves operational issues promptly",
      "Maintains duty log accurately"
    ]
  },
  {
    key: "discipline", title: "Discipline",
    weight: 2, outOf: 10,
    criteria: [
      "Reports to duty on time",
      "Follows uniform and grooming standards",
      "Complies with supervisory instructions",
      "No disciplinary action in review period",
      "Maintains respectful conduct"
    ]
  },
  {
    key: "appearance", title: "Appearance & Neatness",
    weight: 2, outOf: 10,
    criteria: [
      "Uniform worn correctly and is clean",
      "Identification badge displayed",
      "Footwear as per regulation",
      "Grooming standards maintained",
      "Duty area kept tidy"
    ]
  }
];

const defaultAssessForm = {
  knowledgeMarks: "",
  alertness:  Array(5).fill(null),
  safety:     Array(5).fill(null),
  leadership: Array(5).fill(null),
  discipline: Array(5).fill(null),
  appearance: Array(5).fill(null),
  alcoholicStatus: "",
  pmeStatus: "Fit",
  refStatus: "Cleared",
  automaticTraining: "Not Required",
  counselling: "Not Required",
  dateOfAppointment: "",
  workingSince: "",
  remarks: ""
};

/* ─── SM SELF-ASSESSMENT HISTORY (done by TI) ─── */
const smAssessmentHistory = [
  {
    id: 1, date: "2026-03-25", period: "Q1 2026",
    assessedBy: "TI_2001 — A. Kulkarni",
    totalScore: 86, category: "A", approvalStatus: "Approved",
    tiRemarks: "Station demonstrates strong operational discipline and safety culture.",
    sections: [
      { title:"Station Management",         marks:17, outOf:20 },
      { title:"Safety Records",             marks:18, outOf:20 },
      { title:"Staff Supervision",          marks:16, outOf:20 },
      { title:"Emergency Handling",         marks:17, outOf:20 },
      { title:"Documentation & Compliance", marks:18, outOf:20 }
    ]
  },
  {
    id: 2, date: "2025-12-18", period: "Q4 2025",
    assessedBy: "TI_2001 — A. Kulkarni",
    totalScore: 79, category: "B", approvalStatus: "Approved",
    tiRemarks: "Good performance. Minor gaps in documentation — addressed in training.",
    sections: [
      { title:"Station Management",         marks:16, outOf:20 },
      { title:"Safety Records",             marks:15, outOf:20 },
      { title:"Staff Supervision",          marks:15, outOf:20 },
      { title:"Emergency Handling",         marks:16, outOf:20 },
      { title:"Documentation & Compliance", marks:17, outOf:20 }
    ]
  },
  {
    id: 3, date: "2025-09-10", period: "Q3 2025",
    assessedBy: "TI_2001 — A. Kulkarni",
    totalScore: 91, category: "A", approvalStatus: "Approved",
    tiRemarks: "Excellent quarter. Exceptional handling of monsoon disruptions.",
    sections: [
      { title:"Station Management",         marks:19, outOf:20 },
      { title:"Safety Records",             marks:18, outOf:20 },
      { title:"Staff Supervision",          marks:18, outOf:20 },
      { title:"Emergency Handling",         marks:19, outOf:20 },
      { title:"Documentation & Compliance", marks:17, outOf:20 }
    ]
  },
  {
    id: 4, date: "2025-06-14", period: "Q2 2025",
    assessedBy: "TI_2001 — A. Kulkarni",
    totalScore: 74, category: "B", approvalStatus: "Approved",
    tiRemarks: "Satisfactory. Focus needed on staff supervision logs.",
    sections: [
      { title:"Station Management",         marks:15, outOf:20 },
      { title:"Safety Records",             marks:14, outOf:20 },
      { title:"Staff Supervision",          marks:14, outOf:20 },
      { title:"Emergency Handling",         marks:15, outOf:20 },
      { title:"Documentation & Compliance", marks:16, outOf:20 }
    ]
  }
];

/* ─── SM SELF‑ASSESSMENT (done by TI) ─── */
const smSelfAssessment = {
  date: "2026-03-25",
  period: "Q1 2026",
  assessedBy: "TI_2001 — A. Kulkarni",
  totalScore: 86,
  category: "A",
  approvalStatus: "Approved",
  tiRemarks: "Station demonstrates strong operational discipline and safety culture.",
  sections: [
    { title:"Station Management",         marks:17, outOf:20 },
    { title:"Safety Records",             marks:18, outOf:20 },
    { title:"Staff Supervision",          marks:16, outOf:20 },
    { title:"Emergency Handling",         marks:17, outOf:20 },
    { title:"Documentation & Compliance", marks:18, outOf:20 }
  ]
};

/* ─── MONTHLY TREND DATA ─── */
const monthlyTrend = [
  { month:"Nov 25", assessments:6, avgScore:71, safetyAvg:68 },
  { month:"Dec 25", assessments:5, avgScore:74, safetyAvg:72 },
  { month:"Jan 26", assessments:7, avgScore:68, safetyAvg:70 },
  { month:"Feb 26", assessments:8, avgScore:77, safetyAvg:75 },
  { month:"Mar 26", assessments:8, avgScore:80, safetyAvg:79 }
];

/* ─── CUSTOM TOOLTIP ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="sm2-tooltip">
        <strong>{label}</strong>
        {payload.map(p => <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>)}
      </div>
    );
  }
  return null;
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
function StationMasterModule({ user, onLogout }) {
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [pageMode, setPageMode]           = useState("default");
  const [statusMsg, setStatusMsg]         = useState("");
  const [pointsmen, setPointsmen]         = useState(initialPointsmen);
  const [drafts, setDrafts]               = useState(initialDrafts);
  const [submittedAssessments, setSubmittedAssessments] = useState([]);
  const [selectedPm, setSelectedPm]       = useState(null);
  const [assessTarget, setAssessTarget]   = useState(null);
  const [assessForm, setAssessForm]       = useState(defaultAssessForm);
  const [assessLocked, setAssessLocked]   = useState(false);
  const [myAssessSelected, setMyAssessSelected] = useState(null);
  const [pmFilter, setPmFilter]           = useState({ search:"", grade:"All", status:"All", risk:"All" });
  const [reportFilter, setReportFilter]   = useState({ search:"", grade:"All", risk:"All", sortBy:"date-desc" });

  const [smList, setSmList] = useState(() => {
    const saved = localStorage.getItem("ti_sm_list");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("ti_sm_list");
      if (saved) setSmList(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [activeTab, pageMode]);

  const [showExamModal, setShowExamModal] = useState(false);
  const [currentExamQuestion, setCurrentExamQuestion] = useState(0);
  const [examAnswers, setExamAnswers] = useState(Array(25).fill(null));
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);

  const SM_SAFETY_EXAM_QUESTIONS = [
    { q: "What is the aspect of an outer stop signal in a two-aspect signaling system?", opts: ["Green", "Yellow", "Red", "Double Yellow"], ans: 2 },
    { q: "During a track circuit failure, what paper authority is issued to authorize train movement?", opts: ["T/369(3b)", "T/806", "T/A 602", "T/D 602"], ans: 0 },
    { q: "What whistle code must be sounded when a train passes through a station without stopping?", opts: ["Continuous short", "One long", "One long, one short", "Two short"], ans: 1 },
    { q: "What is the maximum speed permitted for a shunting operation under normal conditions?", opts: ["15 km/h", "20 km/h", "30 km/h", "10 km/h"], ans: 0 },
    { q: "Fouling mark lines indicate:", opts: ["Track division boundary", "Point locking position", "Safe distance clearance boundary limit", "Speed restriction end limit"], ans: 2 },
    { q: "Periodic medical examinations (PME) for Station Masters must be completed every:", opts: ["1 Year", "2 Years", "3 Years", "4 Years"], ans: 3 },
    { q: "A double yellow signal warns drivers to:", opts: ["Stop immediately", "Sound whistle continuously", "Prepare to stop at the next signal", "Proceed at full authorized speed"], ans: 2 },
    { q: "When track circuiting is not provided, how is track clearance ensured?", opts: ["Visual verification by SM", "Token exchange", "Cabin clearance note", "All of the above"], ans: 3 },
    { q: "What color flag is used to signal shunting stoppage during daytime?", opts: ["Green flag", "Yellow flag", "Red flag", "White flag"], ans: 2 },
    { q: "Refresher training courses for SMs must be taken every:", opts: ["1 Year", "2 Years", "3 Years", "5 Years"], ans: 2 },
    { q: "What is the meaning of a flashing red aspect in a signal?", opts: ["Proceed with caution", "Stop and proceed after 1 min", "Gate signal warning", "Track defect ahead"], ans: 1 },
    { q: "When points are jammed, what must the SM check first?", opts: ["Point switches for obstruction", "Signal relay room", "Fuses in cabin", "Battery room voltage"], ans: 0 },
    { q: "What is the standard shunting authority form number?", opts: ["T/511", "T/806", "T/369(3b)", "T/A 901"], ans: 1 },
    { q: "Which class of station has points and signals interlocked?", opts: ["Class A", "Class B", "Class C", "Class D"], ans: 1 },
    { q: "What is the maximum speed under a 'Caution Order' when no speed is specified?", opts: ["15 km/h", "30 km/h", "45 km/h", "20 km/h"], ans: 0 },
    { q: "During train shunting, who is responsible for point locking verification?", opts: ["Pointsman Grade I", "Station Master", "Cabin Master", "Train Manager"], ans: 1 },
    { q: "What action must be taken immediately if a block instrument failure occurs?", opts: ["Suspend shunting", "Convert to Paper Line Clear Ticket operation", "Advise driver to proceed at 10km/h", "Notify divisional engineer"], ans: 1 },
    { q: "What aspect does a gate signal show when the gate is open to road traffic?", opts: ["Yellow aspect", "Green aspect", "Red aspect", "Flashing yellow aspect"], ans: 2 },
    { q: "The isolation of running lines from siding lines is achieved using:", opts: ["Derailment block", "Trap point", "Sand hump", "All of the above"], ans: 3 },
    { q: "A dead stop signal is indicated by which aspect?", opts: ["Steady Red", "Flashing Red", "Steady Yellow", "None"], ans: 0 },
    { q: "Who authorizes shunting into a block section ahead?", opts: ["Station Master of current station", "Divisional Controller", "SM of receiving station", "Both A and C"], ans: 3 },
    { q: "The distance from a warning board to the first stop signal is normally:", opts: ["800 meters", "1000 meters", "1200 meters", "2000 meters"], ans: 1 },
    { q: "What is the authority form number for passing a stop signal at danger?", opts: ["T/369(3b)", "T/512", "T/A 602", "T/806"], ans: 0 },
    { q: "Whistle code 'one long, one short, one long, one short' indicates:", opts: ["Train parting", "Alarm chain pulled", "Fire in train", "Entering tunnel"], ans: 0 },
    { q: "In emergency track clearing, the first protection detonator is placed at:", opts: ["600 meters", "800 meters", "1200 meters", "2000 meters"], ans: 0 }
  ];

  const smName = user?.name || smProfile.name;
  const smId   = user?.hrmsId || smProfile.employeeId;

  /* ─── Derived: stats ─── */
  const stats = useMemo(() => {
    const total     = pointsmen.length;
    const pending   = drafts.length;
    const completed = Object.values(pmAssessmentHistory).flat().length + submittedAssessments.length;
    const highRisk  = pointsmen.filter(p => riskLevel(p) === "High").length;
    const safetyPct = Math.round(
      pointsmen.reduce((s, p) => s + p.safetyScore, 0) / pointsmen.length
    );
    return { total, pending, completed, highRisk, safetyPct };
  }, [pointsmen, drafts, submittedAssessments]);

  /* ─── Pie: category dist ─── */
  const pieData = useMemo(() => {
    const counts = { A:0, B:0, C:0, D:0 };
    pointsmen.forEach(p => { counts[getCat(p.lastScore)]++; });
    return Object.entries(counts).filter(([,c]) => c > 0)
      .map(([cat, count]) => ({ name: cat, value: count }));
  }, [pointsmen]);

  /* ─── Bottom performers ─── */
  const lowPerformers = useMemo(() =>
    [...pointsmen].sort((a,b) => a.lastScore - b.lastScore).slice(0,4)
  , [pointsmen]);

  /* ─── Filtered pointsmen list ─── */
  const filteredPm = useMemo(() => {
    return pointsmen.filter(p => {
      const q = pmFilter.search.toLowerCase();
      const srch = !q || p.name.toLowerCase().includes(q) || p.hrmsId.toLowerCase().includes(q);
      const grade = pmFilter.grade === "All" || getCat(p.lastScore) === pmFilter.grade;
      const status = pmFilter.status === "All" || p.approvalStatus === pmFilter.status;
      const risk = pmFilter.risk === "All" || riskLevel(p) === pmFilter.risk;
      return srch && grade && status && risk;
    });
  }, [pointsmen, pmFilter]);

  /* ─── Filtered reports ─── */
  const filteredReports = useMemo(() => {
    let list = pointsmen.filter(p => {
      const q = reportFilter.search.toLowerCase();
      const srch = !q || p.name.toLowerCase().includes(q) || p.hrmsId.toLowerCase().includes(q);
      const grade = reportFilter.grade === "All" || getCat(p.lastScore) === reportFilter.grade;
      const risk  = reportFilter.risk === "All" || riskLevel(p) === reportFilter.risk;
      return srch && grade && risk;
    });
    if (reportFilter.sortBy === "score-desc") list = [...list].sort((a,b) => b.lastScore - a.lastScore);
    else if (reportFilter.sortBy === "score-asc") list = [...list].sort((a,b) => a.lastScore - b.lastScore);
    return list;
  }, [pointsmen, reportFilter]);

  /* ─── Navigation ─── */
  const switchTab = (tab) => { setActiveTab(tab); setPageMode("default"); setStatusMsg(""); };

  /* ─── Open PM detail ─── */
  const openPmDetail = (pm) => { setSelectedPm(pm); setPageMode("pmDetail"); };

  /* ─── Open assess form ─── */
  const openAssessForm = (draft) => {
    setAssessTarget(draft);
    setAssessForm(defaultAssessForm);
    setAssessLocked(false);
    setPageMode("assessForm");
  };

  /* ─── Yes/No toggle helper ─── */
  const toggleYN = (sectionKey, idx, val) => {
    if (assessLocked) return;
    setAssessForm(prev => {
      const next = [...prev[sectionKey]];
      next[idx] = next[idx] === val ? null : val;
      return { ...prev, [sectionKey]: next };
    });
  };

  /* ─── Live score computer ─── */
  const computeScore = (form) => {
    const knowledge = Math.min(parseInt(form.knowledgeMarks) || 0, 25);
    let ynTotal = 0;
    YN_SECTIONS.forEach(s => {
      form[s.key].forEach(v => { if (v === "Yes") ynTotal += s.weight; });
    });
    return { knowledge, ynTotal, total: knowledge + ynTotal };
  };

  /* ─── Submit assessment ─── */
  const submitAssessment = (isDraft) => {
    if (!isDraft && !assessForm.alcoholicStatus) {
      setStatusMsg("Alcoholic / Non-Alcoholic status is mandatory."); return;
    }
    const { knowledge, ynTotal, total } = computeScore(assessForm);
    const sectionBreakdown = YN_SECTIONS.map(s => ({
      title: s.title,
      marks: assessForm[s.key].filter(v => v === "Yes").length * s.weight,
      outOf: s.outOf
    }));
    const record = {
      id: Date.now(), pointsmanId: assessTarget.pointsmanId,
      hrmsId: assessTarget.hrmsId, name: assessTarget.name,
      date: new Date().toISOString().slice(0,10),
      knowledgeMarks: knowledge, ynTotal, total,
      grade: getCat(total), approvalStatus: isDraft ? "Draft" : "Pending",
      remarks: assessForm.remarks,
      sections: [
        { title: "Knowledge of Rules (MCQ)", marks: knowledge, outOf: 25 },
        ...sectionBreakdown
      ],
      meta: {
        alcoholicStatus: assessForm.alcoholicStatus,
        pmeStatus: assessForm.pmeStatus,
        refStatus: assessForm.refStatus,
        automaticTraining: assessForm.automaticTraining,
        counselling: assessForm.counselling,
        dateOfAppointment: assessForm.dateOfAppointment,
        workingSince: assessForm.workingSince
      }
    };
    setSubmittedAssessments(prev => [record, ...prev]);
    if (!isDraft) setDrafts(prev => prev.filter(d => d.pointsmanId !== assessTarget.pointsmanId));
    setPointsmen(prev => prev.map(p =>
      p.id === assessTarget.pointsmanId
        ? { ...p, lastScore: total, approvalStatus: isDraft ? p.approvalStatus : "Pending" }
        : p
    ));
    if (!isDraft) setAssessLocked(true);
    setStatusMsg(isDraft ? "Draft saved." : "Assessment submitted for TI approval. Status: Pending.");
    if (!isDraft) setPageMode("default");
  };

  /* ════ RENDERERS ════ */

  /* ── DASHBOARD ── */
  const renderDashboard = () => {
    const myAssess = smList.find(s => s.hrmsId === smId);
    const hasAssignedExam = myAssess && myAssess.status === "Exam Sent";

    return (
      <div className="sm2-dashboard">
        {hasAssignedExam && (
          <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", borderRadius: "14px", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", boxShadow: "0 10px 25px rgba(124, 58, 237, 0.25)", border: "1px solid rgba(255,255,255,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📝</div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", letterSpacing: "-0.2px" }}>Safety Compliance Exam Assigned!</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>
                  Traffic Inspector R. Khan has sent you a 25-Question Safety Compliance Knowledge Exam. Please complete it to automatically record your score.
                </p>
              </div>
            </div>
            <button className="sm2-primary-btn" style={{ background: "#ffffff", color: "#6d28d9", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontWeight: "800", padding: "10px 22px", borderRadius: "10px", border: "none", cursor: "pointer" }} onClick={() => {
              setCurrentExamQuestion(0);
              setExamAnswers(Array(25).fill(null));
              setExamSubmitted(false);
              setShowExamModal(true);
            }}>
              Take Exam Now →
            </button>
          </div>
        )}

      {/* Summary Cards */}
      <div className="sm2-summary-cards">
        {[
          { label:"Total Pointsmen",       value: stats.total,      icon:<Users size={20} color="#2563eb"/>,        bg:"#eff6ff" },
          { label:"Pending Assessments",   value: stats.pending,    icon:<ClipboardCheck size={20} color="#d97706"/>,bg:"#fef3c7" },
          { label:"Completed Assessments", value: stats.completed,  icon:<CheckCircle2 size={20} color="#16a34a"/>, bg:"#dcfce7" },
          { label:"High Risk Staff",       value: stats.highRisk,   icon:<AlertTriangle size={20} color="#dc2626"/>,bg:"#fee2e2" },
          { label:"Safety Compliance",     value:`${stats.safetyPct}%`, icon:<ShieldCheck size={20} color="#7c3aed"/>,bg:"#f5f3ff" },
        ].map(c => (
          <article key={c.label} className="sm2-sum-card">
            <div className="sm2-sum-icon" style={{ background: c.bg }}>{c.icon}</div>
            <div>
              <label>{c.label}</label>
              <strong>{c.value}</strong>
            </div>
          </article>
        ))}
      </div>

      {/* Charts Row */}
      <div className="sm2-charts-row">

        {/* Line: Score trend */}
        <div className="sm2-chart-card">
          <div className="sm2-chart-hdr"><TrendingUp size={15}/><h3>Monthly Assessment Trend</h3></div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={monthlyTrend} margin={{top:6,right:16,left:-14,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="month" tick={{fontSize:11, fill:"#6b7280"}}/>
              <YAxis tick={{fontSize:11, fill:"#6b7280"}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#2563eb" strokeWidth={2.5} dot={{r:4}} activeDot={{r:6}}/>
              <Line type="monotone" dataKey="assessments" name="Assessments" stroke="#16a34a" strokeWidth={2} dot={{r:3}} strokeDasharray="5 3"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Safety compliance */}
        <div className="sm2-chart-card">
          <div className="sm2-chart-hdr"><Activity size={15}/><h3>Safety Compliance Trend</h3></div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={monthlyTrend} margin={{top:6,right:16,left:-14,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="month" tick={{fontSize:11, fill:"#6b7280"}}/>
              <YAxis domain={[0,100]} tick={{fontSize:11, fill:"#6b7280"}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="safetyAvg" name="Safety Avg" fill="#7c3aed" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: Category dist */}
        <div className="sm2-chart-card">
          <div className="sm2-chart-hdr"><BarChart3 size={15}/><h3>Performance Distribution</h3></div>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="44%" innerRadius={52} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry,i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={(v,n,p) => [`${v} staff — Cat. ${p.payload.name}`, ""]}/>
              <Legend formatter={(v,e) => `Cat. ${e.payload.name}  (${e.payload.value})`} iconType="circle" iconSize={9} wrapperStyle={{fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low performers */}
      <div className="sm2-low-panel">
        <div className="sm2-chart-hdr" style={{marginBottom:14}}><AlertTriangle size={15} color="#dc2626"/><h3>Low Performing Staff</h3></div>
        <div className="sm2-low-list">
          {lowPerformers.map(p => {
            const cat = getCat(p.lastScore);
            const risk = riskLevel(p);
            return (
              <div key={p.id} className="sm2-low-row" onClick={() => { openPmDetail(p); setActiveTab("pointsmen"); }}>
                <div className="sm2-low-name">
                  <span className="sm2-cat-dot" style={{background:CAT_COLOR[cat]}}/>
                  <strong>{p.name}</strong>
                  <span className="sm2-low-id">{p.hrmsId}</span>
                </div>
                <div className="sm2-low-meta">
                  <span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Cat. {cat}</span>
                  <span className="sm2-badge" style={{background:RISK_BG[risk],color:RISK_COLOR[risk]}}>{risk} Risk</span>
                  <strong>{p.lastScore}/100</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

  /* ── PROFILE ── */
  const renderProfile = () => (
    <section className="sm2-card">
      <div className="sm2-card-hdr">
        <h2>My Profile</h2>
        <span className="sm2-pill-grey">View Only</span>
      </div>
      <dl className="sm2-dl-grid">
        <div><dt>Full Name</dt><dd>{smName}</dd></div>
        <div><dt>Employee ID</dt><dd>{smId}</dd></div>
        <div><dt>Designation</dt><dd>{smProfile.designation}</dd></div>
        <div><dt>Department</dt><dd>{smProfile.department}</dd></div>
        <div><dt>Station</dt><dd>{smProfile.station}</dd></div>
        <div><dt>Contact</dt><dd>{smProfile.contact}</dd></div>
        <div><dt>Joining Date</dt><dd>{smProfile.joiningDate}</dd></div>
        <div><dt>Reporting Officer</dt><dd>{smProfile.reportingOfficer}</dd></div>
      </dl>
    </section>
  );

  /* ── POINTSMEN LIST ── */
  const renderPointsmen = () => {
    if (pageMode === "pmDetail" && selectedPm) return renderPmDetail(selectedPm);
    return (
      <section className="sm2-card">
        <div className="sm2-card-hdr"><h2>Pointsmen Management</h2></div>

        {/* Filters */}
        <div className="sm2-filter-row">
          <div className="sm2-search-box">
            <Search size={14}/>
            <input placeholder="Search name / HRMS ID…" value={pmFilter.search}
              onChange={e => setPmFilter(p => ({...p, search: e.target.value}))}/>
          </div>
          {[
            { key:"grade",  label:"Grade",  opts:["All","A","B","C","D"] },
            { key:"status", label:"Status", opts:["All","Approved","Pending","Rejected"] },
            { key:"risk",   label:"Risk",   opts:["All","Low","Medium","High"] }
          ].map(f => (
            <select key={f.key} className="sm2-select"
              value={pmFilter[f.key]}
              onChange={e => setPmFilter(p => ({...p, [f.key]: e.target.value}))}>
              {f.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>

        {/* Table */}
        <div className="sm2-table-wrap">
          <div className="sm2-table-head sm2-table-row-7">
            {["Name","HRMS ID","Grade","Last Score","Last Assessed","Approval","Risk"].map(h =>
              <span key={h}>{h}</span>)}
          </div>
          {filteredPm.length === 0 && <p className="sm2-empty">No staff match the current filters.</p>}
          {filteredPm.map(p => {
            const cat = getCat(p.lastScore);
            const risk = riskLevel(p);
            return (
              <button key={p.id} className="sm2-table-row-7 sm2-table-row-btn" onClick={() => openPmDetail(p)}>
                <span className="sm2-name-cell"><strong>{p.name}</strong></span>
                <span>{p.hrmsId}</span>
                <span><span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Cat. {cat}</span></span>
                <span><strong>{p.lastScore}/100</strong></span>
                <span>{pmAssessmentHistory[p.id]?.[0]?.date || "—"}</span>
                <span>
                  <span className={`sm2-status-pill sm2-status-${p.approvalStatus.toLowerCase()}`}>
                    {p.approvalStatus}
                  </span>
                </span>
                <span><span className="sm2-badge" style={{background:RISK_BG[risk],color:RISK_COLOR[risk]}}>{risk}</span></span>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  /* ── PM DETAIL ── */
  const renderPmDetail = (pm) => {
    const cat  = getCat(pm.lastScore);
    const risk = riskLevel(pm);
    const safetyPct = pm.safetyScore;
    const hist = pmAssessmentHistory[pm.id] || [];
    return (
      <section className="sm2-card">
        <div className="sm2-card-hdr">
          <h2>Pointsman Details</h2>
          <button className="sm2-link-btn" onClick={() => setPageMode("default")}>← Back</button>
        </div>

        {/* Hero */}
        <div className="sm2-pm-hero">
          <div className="sm2-pm-avatar">{pm.name.charAt(0)}</div>
          <div>
            <h3>{pm.name}</h3>
            <span>{pm.hrmsId} · {pm.designation || "Pointsman"} · {pm.station || smProfile.station}</span>
            <div className="sm2-pm-badges">
              <span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Category {cat}</span>
              <span className="sm2-badge" style={{background:RISK_BG[risk],color:RISK_COLOR[risk]}}>{risk} Risk</span>
              <span className={`sm2-status-pill sm2-status-${pm.approvalStatus.toLowerCase()}`}>{pm.approvalStatus}</span>
            </div>
          </div>
          <div className="sm2-pm-quick-stats">
            <div><label>Latest Score</label><strong>{pm.lastScore}/100</strong></div>
            <div><label>Safety Score</label><strong>{pm.safetyScore}%</strong></div>
            <div><label>Assessments</label><strong>{pm.totalAssessments}</strong></div>
          </div>
        </div>

        {/* Personal Info */}
        <dl className="sm2-dl-grid" style={{marginBottom:20}}>
          <div><dt>Gender</dt><dd>{pm.gender}</dd></div>
          <div><dt>Age</dt><dd>{pm.age} yrs</dd></div>
          <div><dt>Date of Joining</dt><dd>{pm.doj}</dd></div>
          <div><dt>Base Pay</dt><dd>{pm.basePay}</dd></div>
        </dl>

        {/* Safety Compliance */}
        <div className="sm2-safety-block">
          <h4>Safety Compliance</h4>
          <div className="sm2-safety-grid">
            <div className="sm2-safety-item"><span>PME Status</span><strong className={pm.pmeStatus==="Fit"?"text-green":"text-red"}>{pm.pmeStatus}</strong></div>
            <div className="sm2-safety-item"><span>REF Status</span><strong className={pm.refStatus==="Cleared"?"text-green":"text-amber"}>{pm.refStatus}</strong></div>
            <div className="sm2-safety-item"><span>Disciplinary</span><strong className={pm.disciplinary==="None"?"text-green":"text-red"}>{pm.disciplinary}</strong></div>
            <div className="sm2-safety-item"><span>Incidents</span><strong className={pm.incidents===0?"text-green":"text-red"}>{pm.incidents} reported</strong></div>
          </div>
          <div className="sm2-compliance-bar-wrap">
            <div className="sm2-compliance-label">
              <span>Overall Safety Compliance</span>
              <strong style={{color: safetyPct >= 75 ? "#16a34a" : safetyPct >= 50 ? "#d97706" : "#dc2626"}}>{safetyPct}%</strong>
            </div>
            <div className="sm2-compliance-track">
              <div className="sm2-compliance-fill" style={{
                width:`${safetyPct}%`,
                background: safetyPct >= 75 ? "#16a34a" : safetyPct >= 50 ? "#d97706" : "#dc2626"
              }}/>
            </div>
          </div>
        </div>

        {/* Assessment History */}
        <div style={{marginTop:20}}>
          <h4 style={{margin:"0 0 12px",fontSize:14,color:"#0f172a"}}>Assessment History</h4>
          {hist.length === 0 ? <p className="sm2-empty">No assessments recorded yet.</p> : (
            <div className="sm2-table-wrap">
              <div className="sm2-hist-head sm2-hist-row-6">
                {["Date","Test Marks","Add. Marks","Total","Grade","Status"].map(h => <span key={h}>{h}</span>)}
              </div>
              {hist.map(r => {
                const hCat = getCat(r.total);
                return (
                  <div key={r.id} className="sm2-hist-row-6 sm2-hist-data-row">
                    <span>{r.date}</span>
                    <span>{r.testMarks}</span>
                    <span>{r.addMarks}</span>
                    <span><strong>{r.total}</strong></span>
                    <span><span className="sm2-badge" style={{background:CAT_BG[hCat],color:CAT_COLOR[hCat]}}>Cat. {hCat}</span></span>
                    <span>
                      <span className={`sm2-status-pill sm2-status-${r.approvalStatus.toLowerCase()}`}>{r.approvalStatus}</span>
                      {r.tiRemarks && <div style={{fontSize:11,color:"#dc2626",marginTop:2}}>{r.tiRemarks}</div>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  };

  /* ── ASSESS POINTSMAN ── */
  const renderAssess = () => {
    if (pageMode === "assessForm" && assessTarget) {
      const { knowledge, ynTotal, total: liveTotal } = computeScore(assessForm);
      const liveCat = getCat(liveTotal);

      return (
        <section className="sm2-card">
          <div className="sm2-card-hdr">
            <div>
              <h2>Assessment — {assessTarget.name}</h2>
              <p style={{margin:"2px 0 0",fontSize:12,color:"#64748b"}}>{assessTarget.hrmsId} · {assessTarget.lastDate}</p>
            </div>
            <button className="sm2-link-btn" onClick={() => setPageMode("default")}>← Back</button>
          </div>

          {/* ── Section 1: Knowledge of Rules ── */}
          <div className="sm2-assess-section">
            <div className="sm2-assess-sec-hdr">
              <span className="sm2-assess-sec-num">01</span>
              <div>
                <strong>Knowledge of Rules (MCQ-based)</strong>
                <span className="sm2-assess-sec-meta">Manual entry · Max 25 marks</span>
              </div>
              <span className="sm2-assess-live-marks">{knowledge} / 25</span>
            </div>
            <div className="sm2-assess-form" style={{marginTop:12}}>
              <div className="sm2-form-field" style={{gridColumn:"1 / -1",maxWidth:320}}>
                <label>Marks Obtained <span className="sm2-hint">(0 – 25)</span></label>
                <input
                  type="number" min="0" max="25"
                  disabled={assessLocked}
                  value={assessForm.knowledgeMarks}
                  onChange={e => setAssessForm(p => ({...p, knowledgeMarks: e.target.value}))}
                  placeholder="Enter Pointsman's MCQ marks"
                />
              </div>
            </div>
          </div>

          {/* ── Sections 2–6: Yes/No blocks ── */}
          {YN_SECTIONS.map((sec, si) => {
            const secScore = assessForm[sec.key].filter(v => v === "Yes").length * sec.weight;
            return (
              <div key={sec.key} className="sm2-assess-section">
                <div className="sm2-assess-sec-hdr">
                  <span className="sm2-assess-sec-num">{String(si + 2).padStart(2,"0")}</span>
                  <div>
                    <strong>{sec.title}</strong>
                    <span className="sm2-assess-sec-meta">5 criteria · {sec.weight} marks each · Total {sec.outOf}</span>
                  </div>
                  <span className="sm2-assess-live-marks">{secScore} / {sec.outOf}</span>
                </div>
                <div className="sm2-yn-grid">
                  {sec.criteria.map((label, idx) => (
                    <div key={idx} className="sm2-yn-row">
                      <span className="sm2-yn-label">{idx + 1}. {label}</span>
                      <div className="sm2-yn-btns">
                        <button
                          type="button" disabled={assessLocked}
                          className={assessForm[sec.key][idx] === "Yes" ? "sm2-yn-btn sm2-yn-yes active" : "sm2-yn-btn sm2-yn-yes"}
                          onClick={() => toggleYN(sec.key, idx, "Yes")}>
                          Yes
                        </button>
                        <button
                          type="button" disabled={assessLocked}
                          className={assessForm[sec.key][idx] === "No" ? "sm2-yn-btn sm2-yn-no active" : "sm2-yn-btn sm2-yn-no"}
                          onClick={() => toggleYN(sec.key, idx, "No")}>
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── Additional Details ── */}
          <div className="sm2-assess-section">
            <div className="sm2-assess-sec-hdr">
              <span className="sm2-assess-sec-num">07</span>
              <div><strong>Additional Details</strong><span className="sm2-assess-sec-meta">Mandatory fields</span></div>
            </div>
            <div className="sm2-assess-form" style={{marginTop:12}}>
              <div className="sm2-form-field">
                <label>Alcoholic / Non-Alcoholic <span style={{color:"#dc2626"}}>*</span></label>
                <select
                  disabled={assessLocked}
                  value={assessForm.alcoholicStatus}
                  onChange={e => setAssessForm(p => ({...p, alcoholicStatus: e.target.value}))}>
                  <option value="">Select…</option>
                  <option>Non-Alcoholic</option>
                  <option>Alcoholic</option>
                </select>
              </div>
              <div className="sm2-form-field">
                <label>PME Status</label>
                <select disabled={assessLocked} value={assessForm.pmeStatus}
                  onChange={e => setAssessForm(p => ({...p, pmeStatus: e.target.value}))}>
                  <option>Fit</option>
                  <option>Unfit</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="sm2-form-field">
                <label>REF Status</label>
                <select disabled={assessLocked} value={assessForm.refStatus}
                  onChange={e => setAssessForm(p => ({...p, refStatus: e.target.value}))}>
                  <option>Cleared</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
              <div className="sm2-form-field">
                <label>Automatic Training</label>
                <select disabled={assessLocked} value={assessForm.automaticTraining}
                  onChange={e => setAssessForm(p => ({...p, automaticTraining: e.target.value}))}>
                  <option>Not Required</option>
                  <option>Recommended</option>
                  <option>Mandatory</option>
                </select>
              </div>
              <div className="sm2-form-field">
                <label>Counselling</label>
                <select disabled={assessLocked} value={assessForm.counselling}
                  onChange={e => setAssessForm(p => ({...p, counselling: e.target.value}))}>
                  <option>Not Required</option>
                  <option>Recommended</option>
                  <option>Mandatory</option>
                </select>
              </div>
              <div className="sm2-form-field">
                <label>Date of Appointment</label>
                <input type="date" disabled={assessLocked} value={assessForm.dateOfAppointment}
                  onChange={e => setAssessForm(p => ({...p, dateOfAppointment: e.target.value}))}/>
              </div>
              <div className="sm2-form-field">
                <label>Working Since (current grade)</label>
                <input type="date" disabled={assessLocked} value={assessForm.workingSince}
                  onChange={e => setAssessForm(p => ({...p, workingSince: e.target.value}))}/>
              </div>
              <div className="sm2-form-field sm2-form-full">
                <label>Remarks for Traffic Inspector</label>
                <textarea rows={3} disabled={assessLocked} value={assessForm.remarks}
                  onChange={e => setAssessForm(p => ({...p, remarks: e.target.value}))}
                  placeholder="Enter observations, recommendations…"/>
              </div>
            </div>
          </div>

          {/* ── Live Score Bar ── */}
          <div className="sm2-live-score">
            <div>
              <label>Knowledge (MCQ)</label>
              <strong>{knowledge} / 25</strong>
            </div>
            <div>
              <label>Yes / No Sections</label>
              <strong>{ynTotal} / 75</strong>
            </div>
            <div>
              <label>Grand Total</label>
              <strong style={{color: CAT_COLOR[liveCat], fontSize:22}}>{liveTotal} / 100</strong>
            </div>
            <div>
              <label>Category</label>
              <span className="sm2-badge" style={{background:CAT_BG[liveCat],color:CAT_COLOR[liveCat],fontSize:13,padding:"4px 12px"}}>
                Category {liveCat}
              </span>
            </div>
          </div>

          {assessLocked && (
            <div className="sm2-submitted-banner">✓ Assessment submitted for TI approval. Form is now locked.</div>
          )}

          {!assessLocked && (
            <div className="sm2-assess-actions">
              <button className="sm2-ghost-btn" onClick={() => submitAssessment(true)}>Save as Draft</button>
              <button className="sm2-primary-btn" onClick={() => submitAssessment(false)}>
                Submit for TI Approval
              </button>
            </div>
          )}
        </section>
      );
    }

    return (
      <section className="sm2-card">
        <div className="sm2-card-hdr"><h2>Assess Pointsman</h2></div>
        <p className="sm2-subtitle">Pointsmen with pending assessments are listed below. Fill the full structured form and submit for Traffic Inspector approval.</p>

        {drafts.length === 0 ? (
          <div className="sm2-empty-state-center">
            <CheckCircle2 size={36} color="#16a34a"/>
            <h3>All Assessments Up-to-Date</h3>
            <p>No pending assessments at this time.</p>
          </div>
        ) : (
          <div className="sm2-assess-list">
            {drafts.map(d => (
              <div key={d.pointsmanId} className="sm2-assess-row">
                <div>
                  <strong>{d.name}</strong>
                  <span>{d.hrmsId}</span>
                </div>
                <span className="sm2-muted">Last assessed: {d.lastDate}</span>
                <button className="sm2-primary-btn-sm" onClick={() => openAssessForm(d)}>
                  Open Form
                </button>
              </div>
            ))}
          </div>
        )}

        {submittedAssessments.length > 0 && (
          <div style={{marginTop:24}}>
            <h4 style={{margin:"0 0 12px",fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.6px"}}>Submitted This Session</h4>
            {submittedAssessments.map(r => (
              <div key={r.id} className="sm2-submitted-row">
                <div><strong>{r.name}</strong><span>{r.hrmsId}</span></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span className="sm2-badge" style={{background:CAT_BG[r.grade],color:CAT_COLOR[r.grade]}}>Cat. {r.grade}</span>
                  <strong>{r.total}/100</strong>
                  <span className={`sm2-status-pill sm2-status-${r.approvalStatus.toLowerCase()}`}>{r.approvalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  /* ── MY ASSESSMENT (by TI) — history list + detail view ── */
  const renderMyAssessment = () => {
    /* Scorecard detail view */
    if (myAssessSelected) {
      const sc = myAssessSelected;
      const cat = sc.category;
      return (
        <section className="sm2-card">
          <div className="sm2-card-hdr">
            <h2>Assessment Scorecard</h2>
            <button className="sm2-link-btn" onClick={() => setMyAssessSelected(null)}>← Back to History</button>
          </div>
          <p className="sm2-subtitle">Period: {sc.period} · Assessed by: {sc.assessedBy}</p>

          <div className="sm2-sc-hero">
            <div className="sm2-sc-circle" style={{borderColor: CAT_COLOR[cat]}}>
              <strong style={{color: CAT_COLOR[cat]}}>{sc.totalScore}</strong>
              <span>/100</span>
            </div>
            <div>
              <span className="sm2-cat-badge-lg" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Category {cat}</span>
              <p className="sm2-sc-period">{sc.period}</p>
              <p className="sm2-sc-date">Date: {sc.date}</p>
              <p className="sm2-sc-by">By: {sc.assessedBy}</p>
            </div>
            <div style={{marginLeft:"auto"}}>
              <span className={`sm2-status-pill sm2-status-${sc.approvalStatus.toLowerCase()}`} style={{fontSize:13,padding:"6px 16px"}}>
                {sc.approvalStatus}
              </span>
            </div>
          </div>

          <h4 style={{margin:"20px 0 12px",fontSize:14,color:"#0f172a"}}>Section-wise Breakdown</h4>
          <div className="sm2-sc-sections">
            {sc.sections.map(s => {
              const pct = Math.round((s.marks / s.outOf) * 100);
              return (
                <div key={s.title} className="sm2-sc-row">
                  <span className="sm2-sc-name">{s.title}</span>
                  <div className="sm2-sc-bar-wrap">
                    <div className="sm2-sc-bar-fill" style={{
                      width:`${pct}%`,
                      background: pct >= 80 ? "#16a34a" : pct >= 50 ? "#2563eb" : "#dc2626"
                    }}/>
                  </div>
                  <span className="sm2-sc-marks">{s.marks}/{s.outOf}</span>
                </div>
              );
            })}
          </div>

          <div className="sm2-ti-remarks">
            <div className="sm2-ti-rmk-hdr"><Award size={15} color="#7c3aed"/> <strong>TI Remarks</strong></div>
            <p>"{sc.tiRemarks}"</p>
          </div>
        </section>
      );
    }

    /* History list */
    return (
      <section className="sm2-card">
        <div className="sm2-card-hdr"><h2>My Assessment History (by TI)</h2></div>
        <p className="sm2-subtitle">All assessments conducted by the Traffic Inspector for your station. Click any row to view the detailed scorecard.</p>

        {/* Summary strip */}
        <div className="sm2-myassess-summary">
          <div className="sm2-report-mini">
            <label>Total Assessments</label>
            <strong>{smAssessmentHistory.length}</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Latest Score</label>
            <strong>{smAssessmentHistory[0]?.totalScore}/100</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Average Score</label>
            <strong>{Math.round(smAssessmentHistory.reduce((s,a) => s + a.totalScore, 0) / smAssessmentHistory.length)}/100</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Latest Category</label>
            <strong style={{color: CAT_COLOR[smAssessmentHistory[0]?.category]}}>Category {smAssessmentHistory[0]?.category}</strong>
          </div>
        </div>

        {/* List */}
        <div className="sm2-myassess-list">
          <div className="sm2-myassess-head">
            {["Period","Date","Total Score","Category","Assessed By","Status",""].map(h =>
              <span key={h}>{h}</span>)}
          </div>
          {smAssessmentHistory.map(sc => {
            const cat = sc.category;
            return (
              <button key={sc.id} className="sm2-myassess-row" onClick={() => setMyAssessSelected(sc)}>
                <span><strong>{sc.period}</strong></span>
                <span>{sc.date}</span>
                <span><strong>{sc.totalScore}/100</strong></span>
                <span>
                  <span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Cat. {cat}</span>
                </span>
                <span style={{fontSize:11,color:"#64748b"}}>{sc.assessedBy}</span>
                <span>
                  <span className={`sm2-status-pill sm2-status-${sc.approvalStatus.toLowerCase()}`}>{sc.approvalStatus}</span>
                </span>
                <span style={{color:"#2563eb",fontSize:12,fontWeight:600}}>View →</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  /* ── REPORTS ── */
  const renderReports = () => (
    <section className="sm2-card">
      <div className="sm2-card-hdr"><h2>Reports</h2></div>

      {/* Filters */}
      <div className="sm2-filter-row">
        <div className="sm2-search-box">
          <Search size={14}/>
          <input placeholder="Search staff…" value={reportFilter.search}
            onChange={e => setReportFilter(p => ({...p, search: e.target.value}))}/>
        </div>
        <select className="sm2-select" value={reportFilter.grade}
          onChange={e => setReportFilter(p => ({...p, grade: e.target.value}))}>
          {["All","A","B","C","D"].map(o => <option key={o}>{o}</option>)}
        </select>
        <select className="sm2-select" value={reportFilter.risk}
          onChange={e => setReportFilter(p => ({...p, risk: e.target.value}))}>
          {["All","Low","Medium","High"].map(o => <option key={o}>{o}</option>)}
        </select>
        <div className="sm2-sort-wrap">
          <ArrowUpDown size={13}/>
          <select value={reportFilter.sortBy}
            onChange={e => setReportFilter(p => ({...p, sortBy: e.target.value}))}>
            <option value="date-desc">Default</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Summary mini-cards */}
      <div className="sm2-report-summary">
        {[
          { label:"Filtered Staff",   value: filteredReports.length },
          { label:"Avg Score",        value: filteredReports.length ? Math.round(filteredReports.reduce((s,p)=>s+p.lastScore,0)/filteredReports.length) : "—" },
          { label:"High Risk",        value: filteredReports.filter(p => riskLevel(p)==="High").length },
          { label:"Cat. A",           value: filteredReports.filter(p => getCat(p.lastScore)==="A").length },
        ].map(c => (
          <div key={c.label} className="sm2-report-mini">
            <label>{c.label}</label>
            <strong>{c.value}</strong>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="sm2-table-wrap" style={{marginTop:16}}>
        <div className="sm2-report-head sm2-report-row">
          {["Name","HRMS ID","Score","Grade","Safety","Risk","Status"].map(h => <span key={h}>{h}</span>)}
        </div>
        {filteredReports.map(p => {
          const cat = getCat(p.lastScore);
          const risk = riskLevel(p);
          return (
            <button key={p.id} className="sm2-report-row sm2-report-row-btn" onClick={() => { openPmDetail(p); setActiveTab("pointsmen"); }}>
              <span><strong>{p.name}</strong></span>
              <span>{p.hrmsId}</span>
              <span>{p.lastScore}/100</span>
              <span><span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Cat. {cat}</span></span>
              <span>{p.safetyScore}%</span>
              <span><span className="sm2-badge" style={{background:RISK_BG[risk],color:RISK_COLOR[risk]}}>{risk}</span></span>
              <span><span className={`sm2-status-pill sm2-status-${p.approvalStatus.toLowerCase()}`}>{p.approvalStatus}</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );

  /* ─── Dispatcher ─── */
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":    return renderDashboard();
      case "profile":      return renderProfile();
      case "pointsmen":    return renderPointsmen();
      case "assess":       return renderAssess();
      case "myAssessment": return renderMyAssessment();
      case "reports":      return renderReports();
      default: return renderDashboard();
    }
  };

  /* ─── Shell ─── */
  return (
    <div className="sm2-layout">
      <header className="sm2-topbar">
        <div className="sm2-topbar-brand">
          <div className="sm2-topbar-logo">IR</div>
          <div>
            <h1>Indian Railway Evaluation System</h1>
            <p>Station Master Module</p>
          </div>
        </div>
        <div className="sm2-user-strip">
          <div className="sm2-user-avatar">{smName.charAt(0)}</div>
          <div>
            <strong>{smName}</strong>
            <span>{smId}</span>
          </div>
          <button className="sm2-logout-btn" onClick={onLogout}>
            <LogOut size={15}/> Logout
          </button>
        </div>
      </header>

      <div className="sm2-shell">
        <aside className="sm2-sidebar">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key}
                className={`sm2-nav-item ${activeTab === item.key ? "active" : ""}`}
                onClick={() => switchTab(item.key)}>
                <Icon size={17}/>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="sm2-main">
          {statusMsg && (
            <div className="sm2-status-banner">
              <CheckCircle2 size={14}/> {statusMsg}
              <button className="sm2-dismiss" onClick={() => setStatusMsg("")}>×</button>
            </div>
          )}
          <div className="sm2-page-wrap">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Safety Exam Modal */}
      {showExamModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.65)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "650px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #cbd5e1" }}>
            <div style={{ padding: "18px 24px", background: "linear-gradient(135deg, #0d2c4d 0%, #092746 100%)", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>Safety & Rules Compliance Exam</h3>
              <button style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }} onClick={() => {
                if (window.confirm("Are you sure you want to exit the exam? Your progress will be lost.")) {
                  setShowExamModal(false);
                }
              }}>×</button>
            </div>

            {!examSubmitted ? (
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Progress Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", fontWeight: "700" }}>
                  <span>QUESTION {currentExamQuestion + 1} OF 25</span>
                  <span>{Math.round(((currentExamQuestion + 1) / 25) * 100)}% COMPLETED</span>
                </div>

                {/* Progress Bar */}
                <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#7c3aed", width: `${((currentExamQuestion + 1) / 25) * 100}%`, transition: "width 0.3s" }} />
                </div>

                {/* Question Title */}
                <div style={{ padding: "18px", background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: "12px", minHeight: "80px" }}>
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "14px", lineHeight: "1.5" }}>
                    {SM_SAFETY_EXAM_QUESTIONS[currentExamQuestion].q}
                  </h4>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {SM_SAFETY_EXAM_QUESTIONS[currentExamQuestion].opts.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const answers = [...examAnswers];
                        answers[currentExamQuestion] = idx;
                        setExamAnswers(answers);
                      }}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: examAnswers[currentExamQuestion] === idx ? "2px solid #7c3aed" : "1.5px solid #e2e8f0",
                        background: examAnswers[currentExamQuestion] === idx ? "#f5f3ff" : "#ffffff",
                        color: "#0f172a",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px" }}>
                  <button className="sm2-ghost-btn" style={{ padding: "8px 18px", fontSize: "12px" }} disabled={currentExamQuestion === 0} onClick={() => setCurrentExamQuestion(p=>p-1)}>
                    Previous
                  </button>
                  {currentExamQuestion < 24 ? (
                    <button className="sm2-primary-btn-sm" style={{ background: "#7c3aed", padding: "8px 18px", fontSize: "12px" }} disabled={examAnswers[currentExamQuestion] === null} onClick={() => setCurrentExamQuestion(p=>p+1)}>
                      Next Question
                    </button>
                  ) : (
                    <button className="sm2-primary-btn-sm" style={{ background: "#16a34a", padding: "8px 18px", fontSize: "12px" }} disabled={examAnswers.includes(null)} onClick={() => {
                      let score = 0;
                      examAnswers.forEach((ans, idx) => {
                        if (ans === SM_SAFETY_EXAM_QUESTIONS[idx].ans) score++;
                      });
                      setExamScore(score);
                      
                      const updatedSmList = smList.map(s => {
                        if (s.hrmsId === smId) {
                          return { ...s, status: "Exam Taken", examScore: score };
                        }
                        return s;
                      });
                      setSmList(updatedSmList);
                      localStorage.setItem("ti_sm_list", JSON.stringify(updatedSmList));
                      setExamSubmitted(true);
                    }}>
                      Submit Safety Exam
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px" }}>🎉</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#16a34a" }}>Safety Compliance Exam Completed!</h3>
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#64748b" }}>
                    Your safety compliance score has been successfully recorded.
                  </p>
                </div>
                
                <div style={{ padding: "14px 28px", border: "1.5px dashed #16a34a", background: "#f0fdf4", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#166534", textTransform: "uppercase", letterSpacing: "0.5px" }}>MCQ Marks Obtained</div>
                  <strong style={{ fontSize: "28px", fontWeight: "900", color: "#166534" }}>{examScore} <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>/ 25</span></strong>
                </div>

                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  This score has been synchronized automatically. Traffic Inspector R. Khan can now review and lock your final assessment.
                </p>

                <button className="sm2-primary-btn" style={{ background: "#2563eb", marginTop: "10px", width: "100%", justifyContent: "center", height: "40px" }} onClick={() => setShowExamModal(false)}>
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StationMasterModule;
