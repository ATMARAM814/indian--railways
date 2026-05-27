import React, { useMemo, useState } from "react";
import {
  BarChart3, Building2, ClipboardList, FileBarChart2, LogOut,
  Search, ShieldCheck, UserRound, Users, UserCheck, TrainFront,
  Plus, Edit, Trash2, ArrowRightLeft, ArrowLeft, TrendingUp,
  AlertTriangle, CheckCircle, Clock, XCircle, Activity,
  MapPin, Phone, Calendar, Award, UserPlus
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
  LineChart, Line, LabelList
} from "recharts";
import "./sdom.css";

/* ═══════════════════════════════════════════
   DUMMY DATA
   ═══════════════════════════════════════════ */

const NAV = [
  { key: "dashboard",  label: "Dashboard",                icon: BarChart3 },
  { key: "pointsmen",  label: "Pointsmen",                icon: Users },
  { key: "sm",         label: "Station Masters",          icon: UserRound },
  { key: "ss",         label: "Station Superintendents",  icon: UserCheck },
  { key: "tm",         label: "Train Managers",           icon: TrainFront },
  { key: "ti",         label: "Traffic Inspectors",       icon: ShieldCheck },
  { key: "stations",   label: "Stations",                 icon: Building2 },
  { key: "records",    label: "Assessment Records",       icon: ClipboardList },
  { key: "reports",    label: "Reports & Analytics",      icon: FileBarChart2 },
];

// Enterprise palette — navy/slate only
const CHART_NAVY  = ["#1E3A5F","#2B6CB0","#4A90D9","#7EB3D8","#BFD7ED"];
const CAT_COLORS  = { A: "#1E3A5F", B: "#2B6CB0", C: "#D69E2E", D: "#C53030" };
const RISK_COLORS = { Low: "#2F855A", Medium: "#D69E2E", High: "#C53030" };
const STATUS_COLORS = { Approved: "#2F855A", Pending: "#D69E2E", Rejected: "#C53030", Overdue: "#9B2C2C" };

const STATIONS_DATA = [
  { id:"ST01", name:"Nagpur Junction",      code:"NGP",  ti:"TI NGP",  smCount:4, pmCount:86, score:91, safety:96, highRisk:2, pending:4 },
  { id:"ST02", name:"Parbhani Junction",    code:"PBN",  ti:"TI PAR",  smCount:3, pmCount:58, score:86, safety:92, highRisk:3, pending:6 },
  { id:"ST03", name:"Amla",                 code:"AMLA", ti:"TI AMLA", smCount:2, pmCount:41, score:78, safety:84, highRisk:5, pending:9 },
  { id:"ST04", name:"Wardha",               code:"WR",   ti:"TI NGP",  smCount:2, pmCount:32, score:88, safety:90, highRisk:1, pending:3 },
  { id:"ST05", name:"Betul",                code:"BZU",  ti:"TI AMLA", smCount:2, pmCount:28, score:74, safety:79, highRisk:7, pending:12 },
  { id:"ST06", name:"Purna",                code:"PUU",  ti:"TI PAR",  smCount:2, pmCount:38, score:82, safety:87, highRisk:4, pending:7 },
  { id:"ST07", name:"Ajni",                 code:"AJN",  ti:"TI NGP",  smCount:1, pmCount:18, score:93, safety:97, highRisk:0, pending:1 },
  { id:"ST08", name:"Kamptee",              code:"KTE",  ti:"TI NGP",  smCount:1, pmCount:14, score:89, safety:93, highRisk:1, pending:2 },
  { id:"ST09", name:"Multai",               code:"MAI",  ti:"TI AMLA", smCount:1, pmCount:12, score:71, safety:76, highRisk:8, pending:15 },
  { id:"ST10", name:"Jintur",               code:"JNR",  ti:"TI PAR",  smCount:1, pmCount:16, score:84, safety:88, highRisk:2, pending:5 },
];

const generate96Stations = () => {
  const divisionMap = {
    Nagpur: ["NGP", "WR", "BD", "AK", "SEGM", "AJNI", "PLO", "DMN", "MZR", "SEG", "MKU", "JL", "CSN", "ET"],
    Pune: ["PUNE", "LNL", "SVJR", "KK", "DAPD", "CCH", "PMP", "TGN", "DEHR", "KAD", "DD", "ANG", "KPG", "SNSI", "STR"],
    Mumbai: ["CSMT", "BY", "DR", "CLA", "GC", "TNA", "DIVA", "DI", "KYN", "SHAD", "ABY", "AMR", "ULNR", "VLDI"],
    Solapur: ["SUR", "KWV", "PVR", "LUR", "UMD", "BTW"],
    Bhusawal: ["BSL", "NK", "MMR", "JL", "BAU", "KNW", "HD", "DVL"]
  };

  const stationsData = [];
  const divisions = Object.keys(divisionMap);
  const categories = ["A", "B", "C", "D"];
  const risks = ["Low", "Medium", "High"];
  const statuses = ["Approved", "Pending", "Completed"];
  
  const baseNames = [
    "Nagpur Main", "Wardha Junction", "Badnera Town", "Akola Junction", "Sewagram", "Ajni Central", 
    "Pulgaon", "Dhamangaon", "Murtajapur", "Shegaon", "Malkapur", "Jalgaon Junction", "Chalisgaon", 
    "Itarsi Jn", "Bhopal Junction", "Dongargarh", "Gondia Jn", "Durg Jn", "Raipur Jn", "Bilaspur Jn",
    "Pune Junction", "Lonavala", "Shivajinagar", "Khadki", "Dapodi", "Chinchwad", "Pimpri", 
    "Taloja", "Dehu Road", "Khadala", "Daund Jn", "Ahmednagar", "Kopargaon", "Sainagar Shirdi", 
    "Satara", "Kolhapur", "Sangli", "Miraj Jn", "Londa", "Ghatprabha",
    "CSMT Terminal", "Byculla", "Dadar Central", "Kurla Jn", "Ghatkopar", "Thane Main", "Diva Jn", 
    "Dombivli", "Kalyan Jn", "Shahad", "Ambivali", "Titwala", "Ulhasnagar", "Vithalwadi", "Badlapur", 
    "Vashi", "Karjat Jn", "Igatpuri", "Bhandup", "Mulund",
    "Solapur Jn", "Kurduvadi Jn", "Pandharpur", "Latur Town", "Osmanabad", "Barsi Town",
    "Bhusawal Jn", "Nashik Road", "Manmad Jn", "Burhanpur", "Khandwa Jn", "Harda", "Devlali", 
    "Khamgaon", "Pachora", "Nandurbar", "Amravati", "Chandrapur", "Ballarshah", "Wardha East",
    "Sindi Town", "Butibori", "Kalmeshwar", "Katol", "Narkher", "Pandhurna", "Multai", "Amla Jn",
    "Betul", "Ghoradongri", "Itarsi West", "Hoshangabad", "Budni", "Obaidullaganj", "Mandideep"
  ];

  for (let i = 0; i < 96; i++) {
    const division = divisions[i % divisions.length];
    const codeList = divisionMap[division];
    const code = codeList[Math.floor(i / divisions.length) % codeList.length] + `_${10 + Math.floor(i/10)}`;
    const name = baseNames[i % baseNames.length];
    const completed = 200 + ((i * 17) % 600);
    const pending = 15 + ((i * 11) % 130);
    const avgScore = 72 + ((i * 3) % 25);
    const category = categories[i % categories.length];
    const riskLevel = i % 7 === 0 ? "High" : i % 3 === 0 ? "Medium" : "Low";
    const assessmentStatus = statuses[i % statuses.length];
    
    const day = 10 + (i % 45);
    const lastUpdatedDate = `2026-04-${day < 10 ? "0" + day : day}`;

    stationsData.push({
      id: `ST_${1001 + i}`,
      stationName: name,
      stationCode: code,
      division,
      zone: "CR",
      completed,
      pending,
      avgScore,
      category,
      riskLevel,
      assessmentStatus,
      lastUpdatedDate
    });
  }
  return stationsData;
};

const DASHBOARD_96_STATIONS = generate96Stations();

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

const stationAverageScoreData = [
  { station: "Nagpur", avgScore: 86 },
  { station: "Pune", avgScore: 89 },
  { station: "Delhi", avgScore: 84 },
  { station: "Mumbai", avgScore: 88 },
  { station: "Jalna", avgScore: 91 },
  { station: "Parbhani", avgScore: 82 }
];

const ALL_STAFF = [
  // Pointsmen
  { id:"PM_1001", name:"K. Pawar",     role:"pointsmen", station:"Parbhani Junction", ti:"TI PAR",  cat:"A", risk:"Low",    score:86, contact:"8888811111", lastDate:"2026-04-10", status:"Approved" },
  { id:"PM_1002", name:"R. Verma",     role:"pointsmen", station:"Amla",              ti:"TI AMLA", cat:"B", risk:"Medium", score:78, contact:"8888822222", lastDate:"2026-04-07", status:"Pending"  },
  { id:"PM_1003", name:"J. Shaikh",    role:"pointsmen", station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:91, contact:"8888833333", lastDate:"2026-04-05", status:"Approved" },
  { id:"PM_1004", name:"D. More",      role:"pointsmen", station:"Betul",             ti:"TI AMLA", cat:"C", risk:"High",   score:55, contact:"8888844444", lastDate:"2026-03-20", status:"Rejected" },
  { id:"PM_1005", name:"A. Ghule",     role:"pointsmen", station:"Wardha",            ti:"TI NGP",  cat:"A", risk:"Low",    score:90, contact:"8888855555", lastDate:"2026-04-12", status:"Approved" },
  { id:"PM_1006", name:"S. Bhosale",   role:"pointsmen", station:"Purna",             ti:"TI PAR",  cat:"B", risk:"Medium", score:76, contact:"8888866666", lastDate:"2026-04-08", status:"Pending"  },
  // Station Masters
  { id:"SM_2101", name:"S. Deshmukh",  role:"sm",        station:"Parbhani Junction", ti:"TI PAR",  cat:"A", risk:"Low",    score:88, contact:"9999955555", lastDate:"2026-04-01", status:"Approved" },
  { id:"SM_2201", name:"M. Patil",     role:"sm",        station:"Amla",              ti:"TI AMLA", cat:"B", risk:"Medium", score:76, contact:"9999966666", lastDate:"2026-03-15", status:"Pending"  },
  { id:"SM_2301", name:"D. Nair",      role:"sm",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:94, contact:"9999977777", lastDate:"2026-04-15", status:"Approved" },
  { id:"SM_2302", name:"K. Solanki",   role:"sm",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:90, contact:"9999978888", lastDate:"2026-04-12", status:"Approved" },
  { id:"SM_2303", name:"L. Raut",      role:"sm",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"B", risk:"Low",    score:78, contact:"9999979999", lastDate:"2026-03-22", status:"Pending"  },
  // Station Superintendents
  { id:"SS_001",  name:"R. Desai",     role:"ss",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:92, contact:"9999911111", lastDate:"2026-04-18", status:"Approved" },
  { id:"SS_002",  name:"M. Kulkarni",  role:"ss",        station:"Parbhani Junction", ti:"TI PAR",  cat:"A", risk:"Low",    score:87, contact:"9999922222", lastDate:"2026-04-10", status:"Approved" },
  // Train Managers
  { id:"TM_3001", name:"V. Sharma",    role:"tm",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:89, contact:"9999988888", lastDate:"2026-04-14", status:"Approved" },
  { id:"TM_3002", name:"P. Jadhav",    role:"tm",        station:"Amla",              ti:"TI AMLA", cat:"C", risk:"High",   score:52, contact:"9999999999", lastDate:"2026-03-10", status:"Rejected" },
  // Traffic Inspectors
  { id:"TI_1001", name:"R. Khan",      role:"ti",        station:"Parbhani Junction", ti:"TI PAR",  cat:"A", risk:"Low",    score:88, contact:"9999933333", lastDate:"2026-04-09", status:"Approved" },
  { id:"TI_1002", name:"A. Kulkarni",  role:"ti",        station:"Amla",              ti:"TI AMLA", cat:"B", risk:"Medium", score:77, contact:"9999944444", lastDate:"2026-04-08", status:"Pending"  },
  { id:"TI_1003", name:"S. Verma",     role:"ti",        station:"Nagpur Junction",   ti:"TI NGP",  cat:"A", risk:"Low",    score:91, contact:"9999955566", lastDate:"2026-04-06", status:"Approved" },
];

const MONTHLY_TREND = [
  { month:"Dec'25", score:81, safety:80 },
  { month:"Jan'26", score:83, safety:82 },
  { month:"Feb'26", score:85, safety:85 },
  { month:"Mar'26", score:87, safety:88 },
  { month:"Apr'26", score:89, safety:91 },
  { month:"May'26", score:91, safety:94 },
];

const ASSESSMENT_MONTHLY = [
  { month:"Nov", approved:380, pending:60, rejected:18, overdue:12 },
  { month:"Dec", approved:410, pending:55, rejected:22, overdue:15 },
  { month:"Jan", approved:440, pending:70, rejected:19, overdue:10 },
  { month:"Feb", approved:460, pending:65, rejected:21, overdue:9 },
  { month:"Mar", approved:490, pending:58, rejected:17, overdue:8 },
  { month:"Apr", approved:520, pending:68, rejected:20, overdue:11 },
];

const ACTIVITY = [
  { text:"PM_1003 J. Shaikh assessment approved by TI NGP.", time:"10 mins ago", color:"#16a34a" },
  { text:"SM_2201 M. Patil assessment pending TI review at Amla.", time:"45 mins ago", color:"#d97706" },
  { text:"New pointsman PM_1007 N. Bhagat added at Wardha station.", time:"2 hrs ago", color:"#2563eb" },
  { text:"TI_1001 R. Khan completed monthly inspection report.", time:"4 hrs ago", color:"#2563eb" },
  { text:"PM_1004 D. More assessment rejected — sent for counselling.", time:"6 hrs ago", color:"#dc2626" },
  { text:"SS_001 R. Desai quarterly review completed.", time:"Yesterday", color:"#16a34a" },
];

const COMPLIANCE = [
  { label:"Overall Safety Compliance",      pct:91, color:"#16a34a" },
  { label:"PME Completion Rate",            pct:87, color:"#2563eb" },
  { label:"REF Completion Rate",            pct:83, color:"#7c3aed" },
  { label:"Incident Reporting Compliance",  pct:94, color:"#0891b2" },
  { label:"Disciplinary Clean Record",      pct:96, color:"#16a34a" },
];

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function riskBadge(r) {
  const map = { Low:"sdom-badge-success", Medium:"sdom-badge-warning", High:"sdom-badge-danger" };
  return <span className={`sdom-badge ${map[r] || "sdom-badge-neutral"}`}>{r}</span>;
}
function catBadge(c) {
  const map = { A:"sdom-badge-success", B:"sdom-badge-info", C:"sdom-badge-warning", D:"sdom-badge-danger" };
  return <span className={`sdom-badge ${map[c] || "sdom-badge-neutral"}`}>{c}</span>;
}
function statusBadge(s) {
  const map = { Approved:"sdom-badge-success", Pending:"sdom-badge-warning", Rejected:"sdom-badge-danger", Overdue:"sdom-badge-danger" };
  return <span className={`sdom-badge ${map[s] || "sdom-badge-neutral"}`}>{s}</span>;
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="sdom-section-title">{children}</div>
      {sub && <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: -10 }}>{sub}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function SuperAdminModule({ user, onLogout }) {
  const [page, setPage]     = useState("dashboard");
  const [view, setView]     = useState(null); // { type, data } for drill-down pages
  const [staff, setStaff]   = useState(ALL_STAFF);
  const [stations]          = useState(STATIONS_DATA);
  const [modal, setModal]   = useState(null); // add/edit form

  // Filters
  const [roleF, setRoleF]   = useState({ name:"", station:"All", ti:"All", cat:"All", risk:"All" });
  const [stF,   setStF]     = useState({ name:"" });
  const [recF,  setRecF]    = useState({ role:"All", station:"All", status:"All", name:"" });
  const [repF,  setRepF]    = useState({ role:"All", station:"All", cat:"All", risk:"All", ti:"All" });
  const [repApplied, setRepApplied] = useState(false);

  // Chart Zoom Modal states (for showing the 96 stations graphical trends)
  const [isChartZoomModalOpen, setIsChartZoomModalOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("progress"); // "progress", "score", or "category"
  const [zoomPopupPage, setZoomPopupPage] = useState(1);
  const [zoomPopupSearch, setZoomPopupSearch] = useState("");
  const [zoomPopupZone, setZoomPopupZone] = useState("All");
  const [zoomPopupDivision, setZoomPopupDivision] = useState("All");
  const [zoomPopupStationName, setZoomPopupStationName] = useState("All");
  const [zoomPopupStationCode, setZoomPopupStationCode] = useState("All");
  const [zoomPopupCategory, setZoomPopupCategory] = useState("All");
  const [zoomPopupRisk, setZoomPopupRisk] = useState("All");
  const [zoomPopupStatus, setZoomPopupStatus] = useState("All");
  const [zoomPopupStartDate, setZoomPopupStartDate] = useState("");
  const [zoomPopupEndDate, setZoomPopupEndDate] = useState("");

  const handleChartClick = (state, chartType) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const clickedStationName = state.activePayload[0].payload.station;
      if (clickedStationName) {
        setZoomPopupSearch(clickedStationName);
      }
      setSelectedChartType(chartType);
      setIsChartZoomModalOpen(true);
      setZoomPopupPage(1);
    } else {
      setSelectedChartType(chartType);
      setIsChartZoomModalOpen(true);
      setZoomPopupPage(1);
    }
  };

  const handlePieClick = (data) => {
    if (data && data.name) {
      const catLetter = data.name.replace("Category ", "").trim();
      setZoomPopupCategory(catLetter);
    } else {
      setZoomPopupCategory("All");
    }
    setSelectedChartType("category");
    setIsChartZoomModalOpen(true);
    setZoomPopupPage(1);
  };

  const STATION_OPTS = useMemo(() => ["All", ...stations.map(s => s.name)], [stations]);
  const TI_OPTS      = ["All","TI PAR","TI AMLA","TI NGP"];
  const ROLE_OPTS    = ["All","Pointsman","Station Master","Station Superintendent","Train Manager","Traffic Inspector"];
  const ROLE_MAP     = { pointsmen:"Pointsman", sm:"Station Master", ss:"Station Superintendent", tm:"Train Manager", ti:"Traffic Inspector" };

  /* ------- navigation ------- */
  function navigate(p) {
    setPage(p);
    setView(null);
    setRoleF({ name:"", station:"All", ti:"All", cat:"All", risk:"All" });
  }
  function openView(type, data) { setView({ type, data }); }
  function closeView()           { setView(null); }

  /* ------- CRUD ------- */
  function openAdd(role) {
    setModal({
      mode: "add",
      role,
      data: {
        id: `EMP_${Date.now()}`,
        name: "",
        station: stations[0].name,
        ti: "TI PAR",
        cat: "A",
        risk: "Low",
        score: 0,
        contact: "",
        lastDate: "",
        status: "Pending",
        email: "",
        division: "Nagpur",
        zone: "Central Railway",
        // Role-specific defaults matching AOmModule.jsx
        reportingSm: "",
        workLocation: "",
        shift: "",
        smStation: stations[0].name,
        smZone: "Central Railway",
        smDivision: "Nagpur",
        jurisdiction: "Nagpur Division",
        reportingAom: "P. K. Verma (Sr. DOM)",
        linkedStations: ""
      }
    });
  }
  function openEdit(s) {
    setModal({ mode:"edit", role:s.role, data:{ ...s } });
  }
  function openShift(s) {
    setModal({ mode:"shift", role:s.role, data:{ ...s } });
  }
  function saveModal() {
    if (!modal.data.name || !modal.data.id) return;
    if (modal.mode === "add") {
      setStaff(p => [...p, { ...modal.data, role: modal.role }]);
    } else {
      setStaff(p => p.map(s => s.id === modal.data.id ? { ...modal.data, role: modal.role } : s));
    }
    setModal(null);
  }
  function removeStaff(id) {
    if (window.confirm("Remove this staff member?")) setStaff(p => p.filter(s => s.id !== id));
  }

  /* ------- filtered data ------- */
  function filterByRole(roleKey) {
    return staff.filter(s =>
      s.role === roleKey &&
      (roleF.station === "All" || s.station === roleF.station) &&
      (roleF.ti      === "All" || s.ti      === roleF.ti)      &&
      (roleF.cat     === "All" || s.cat     === roleF.cat)     &&
      (roleF.risk    === "All" || s.risk    === roleF.risk)    &&
      (!roleF.name || s.name.toLowerCase().includes(roleF.name.toLowerCase()) ||
                      s.id.toLowerCase().includes(roleF.name.toLowerCase()))
    );
  }

  const recFiltered = useMemo(() => {
    const hasFilter = recF.role !== "All" || recF.station !== "All" || recF.status !== "All" || recF.name;
    if (!hasFilter) return null;
    return staff.filter(s => {
      const roleLabel = ROLE_MAP[s.role] || s.role;
      return (recF.role    === "All" || roleLabel === recF.role)      &&
             (recF.station === "All" || s.station === recF.station)   &&
             (recF.status  === "All" || s.status  === recF.status)    &&
             (!recF.name   || s.name.toLowerCase().includes(recF.name.toLowerCase()));
    });
  }, [recF, staff]);

  const repFiltered = useMemo(() => {
    if (!repApplied) return null;
    return staff.filter(s => {
      const roleLabel = ROLE_MAP[s.role] || s.role;
      return (repF.role    === "All" || roleLabel === repF.role)      &&
             (repF.station === "All" || s.station === repF.station)   &&
             (repF.cat     === "All" || s.cat     === repF.cat)       &&
             (repF.risk    === "All" || s.risk    === repF.risk)      &&
             (repF.ti      === "All" || s.ti      === repF.ti);
    });
  }, [repApplied, repF, staff]);

  /* ═══════════════════════════════════════════
     PAGES
     ═══════════════════════════════════════════ */

  /* ── DASHBOARD ── */
  function renderDashboard() {
    const counts = {
      stations:  stations.length,
      pointsmen: staff.filter(s=>s.role==="pointsmen").length,
      sm:        staff.filter(s=>s.role==="sm").length,
      ss:        staff.filter(s=>s.role==="ss").length,
      tm:        staff.filter(s=>s.role==="tm").length,
      ti:        staff.filter(s=>s.role==="ti").length,
    };
    const summaryCards = [
      { key:"stations",  label:"Stations",                count: counts.stations,  sub:"Total in Nagpur Division",   icon:<Building2 size={18}/>,  color:"#1E3A5F" },
      { key:"pointsmen", label:"Pointsmen",               count: counts.pointsmen, sub:"Operational pointsmen",       icon:<Users size={18}/>,      color:"#1E3A5F" },
      { key:"sm",        label:"Station Masters",         count: counts.sm,        sub:"Across all stations",         icon:<UserRound size={18}/>,  color:"#1E3A5F" },
      { key:"ss",        label:"Station Superintendents", count: counts.ss,        sub:"Division supervisors",        icon:<UserCheck size={18}/>,  color:"#1E3A5F" },
      { key:"tm",        label:"Train Managers",          count: counts.tm,        sub:"Active train managers",       icon:<TrainFront size={18}/>, color:"#1E3A5F" },
      { key:"ti",        label:"Traffic Inspectors",      count: counts.ti,        sub:"Jurisdiction coverage",       icon:<ShieldCheck size={18}/>,color:"#1E3A5F" },
    ];

    const roleBar = [
      { role:"Pointsmen",              count: counts.pointsmen },
      { role:"Station Masters",        count: counts.sm },
      { role:"Station Superintendents",count: counts.ss },
      { role:"Train Managers",         count: counts.tm },
      { role:"Traffic Inspectors",     count: counts.ti },
    ];

    const catData = ["A","B","C","D"].map(c => ({
      name: `Cat ${c}`, value: staff.filter(s=>s.cat===c).length, fill: CAT_COLORS[c]
    }));

    const top10    = [...stations].sort((a,b) => b.score - a.score).slice(0,10);
    const bottom10 = [...stations].sort((a,b) => a.score - b.score).slice(0,10);

    const pipeline = [
      { label:"Approved", count:4520, dot:"#1E3A5F" },
      { label:"Pending",  count:246,  dot:"#4A90D9" },
      { label:"Rejected", count:87,   dot:"#B83A3A" },
      { label:"Overdue",  count:33,   dot:"#5A6B7C" },
    ];

    return (
      <div className="sdom-fade">
        {/* Page header */}
        <h1 className="sdom-page-title">Nagpur Division Command Center</h1>
        <p className="sdom-page-subtitle">Complete strategic overview of the division — staff, performance, safety and assessment pipeline.</p>

        {/* ── Summary Cards ── */}
        <div className="sdom-summary-cards">
          {summaryCards.map(c => (
            <div className="sdom-stat-card" key={c.key}>
              <div className="sdom-stat-icon">
                <span style={{color:"#1E3A5F"}}>{c.icon}</span>
              </div>
              <div className="sdom-stat-label">{c.label}</div>
              <div className="sdom-stat-value">{c.count}</div>
              <div className="sdom-stat-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Station-wise Evaluation Progress & Average Score at the Top ── */}
        <div className="sdom-row-2">
          {/* Station-wise Evaluation Progress */}
          <div className="sdom-chart-card">
            <div className="chart-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div className="sdom-chart-title">Station-wise Evaluation Progress</div>
                <div className="sdom-chart-subtitle">Click anywhere on chart to zoom & filter 96 stations</div>
              </div>
              <button
                type="button"
                onClick={() => handleChartClick(null, "progress")}
                style={{
                  background: "var(--brand-primary, #0B1F3A)",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                View Full Screen
              </button>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stationProgressData}
                  margin={{ top: 8, right: 12, left: -20, bottom: 5 }}
                  barGap={6}
                  onClick={(state) => handleChartClick(state, "progress")}
                  style={{ cursor: "pointer" }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC" />
                  <XAxis
                    dataKey="station"
                    tick={{ fontSize: 10, fill: "#627D98" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#627D98" }} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{ fontSize: "0.85rem", borderRadius: 6, border: "1px solid #D9E2EC" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Bar
                    dataKey="completed"
                    fill="var(--brand-secondary, #1E3A5F)"
                    radius={[4, 4, 0, 0]}
                    name="Completed"
                    barSize={12}
                  />
                  <Bar
                    dataKey="pending"
                    fill="#D69E2E"
                    radius={[4, 4, 0, 0]}
                    name="Pending"
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Station-wise Average Score */}
          <div className="sdom-chart-card">
            <div className="chart-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div className="sdom-chart-title">Station-wise Average Score</div>
                <div className="sdom-chart-subtitle">Click anywhere on chart to zoom & filter 96 stations</div>
              </div>
              <button
                type="button"
                onClick={() => handleChartClick(null, "score")}
                style={{
                  background: "#1f7a5c",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                View Full Screen
              </button>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stationAverageScoreData}
                  margin={{ top: 8, right: 12, left: -20, bottom: 5 }}
                  onClick={(state) => handleChartClick(state, "score")}
                  style={{ cursor: "pointer" }}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC" />
                  <XAxis
                    dataKey="station"
                    tick={{ fontSize: 10, fill: "#627D98" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#627D98" }} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{ fontSize: "0.85rem", borderRadius: 6, border: "1px solid #D9E2EC" }} formatter={(value) => [`${value}/100`, "Average Score"]} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Bar
                    dataKey="avgScore"
                    fill="#1f7a5c"
                    radius={[4, 4, 0, 0]}
                    name="Average Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Role-wise Distribution ── */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Role-wise Staff Distribution</div>
            <div className="sdom-chart-subtitle">Staff count per role across the division</div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleBar} margin={{ top:16, right:40, left:0, bottom:8 }} barSize={52}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC" />
                  <XAxis dataKey="role" fontSize={12} tick={{fill:"#102A43",fontWeight:600}} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} tick={{fill:"#627D98"}} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}} />
                  <Bar dataKey="count" fill="#1E3A5F" radius={[5,5,0,0]}>
                    <LabelList dataKey="count" position="top" style={{ fontSize:12, fontWeight:700, fill:"#102A43" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Category + Safety ── */}
        <div className="sdom-row-2">
          <div className="sdom-chart-card">
            <div className="chart-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div className="sdom-chart-title">Category Distribution (Division-wide)</div>
                <div className="sdom-chart-subtitle">Click anywhere on chart to zoom & filter 96 stations</div>
              </div>
              <button
                type="button"
                onClick={() => handlePieClick(null)}
                style={{
                  background: "var(--brand-primary, #0B1F3A)",
                  color: "#ffffff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                View Full Screen
              </button>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ cursor: "pointer" }}>
                  <Pie 
                    data={catData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={110}
                    dataKey="value" 
                    paddingAngle={3} 
                    label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                    onClick={(data) => handlePieClick(data)}
                  >
                    {catData.map((d,i) => <Cell key={i} fill={d.fill} style={{ cursor: "pointer" }} />)}
                  </Pie>
                  <Legend onClick={(data) => handlePieClick({ name: data.value })} wrapperStyle={{ cursor: "pointer" }} />
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Safety Compliance Analytics</div>
            <div className="sdom-chart-subtitle">Division-wide compliance across all categories</div>
            <div style={{ marginTop: 16 }}>
              {COMPLIANCE.map(c => (
                <div className="sdom-compliance-item" key={c.label}>
                  <div className="sdom-compliance-header">
                    <span>{c.label}</span>
                    <span className="sdom-compliance-pct">{c.pct}%</span>
                  </div>
                  <div className="sdom-compliance-track">
                    <div className="sdom-compliance-fill" style={{ width:`${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Score Trend ── */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Division-wide Performance & Safety Trend (Last 6 Months)</div>
            <div className="sdom-chart-subtitle">Average assessment scores and safety compliance percentage over time</div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_TREND} margin={{ top:10, right:30, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis domain={[60,100]} fontSize={12} />
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}} />
                  <Legend wrapperStyle={{fontSize:"0.82rem"}} />
                  <Line type="monotone" dataKey="score"  name="Avg Score"         stroke="#1E3A5F" strokeWidth={2.5} dot={{r:4,fill:"#1E3A5F"}} />
                  <Line type="monotone" dataKey="safety" name="Safety Compliance%" stroke="#2F855A" strokeWidth={2.5} dot={{r:4,fill:"#2F855A"}} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Station Performance Top/Bottom ── */}
        <div className="sdom-row-2">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{marginBottom:4}}>Top 10 Performing Stations</div>
            <div className="sdom-chart-subtitle">Sorted by average assessment score</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead>
                  <tr><th>#</th><th>Station</th><th>Avg Score</th><th>Safety %</th><th>Pending</th></tr>
                </thead>
                <tbody>
                  {top10.map((st,i) => (
                    <tr key={st.id}>
                      <td style={{color:"#9FB3C8",fontWeight:700}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{st.name}</td>
                      <td><span style={{color:"#2F855A",fontWeight:700}}>{st.score}</span></td>
                      <td>{st.safety}%</td>
                      <td>{st.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{marginBottom:4}}>Bottom 10 — Stations Needing Attention</div>
            <div className="sdom-chart-subtitle">Sorted by average assessment score (ascending)</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead>
                  <tr><th>#</th><th>Station</th><th>Avg Score</th><th>High Risk</th><th>Pending</th></tr>
                </thead>
                <tbody>
                  {bottom10.map((st,i) => (
                    <tr key={st.id}>
                      <td style={{color:"#9FB3C8",fontWeight:700}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{st.name}</td>
                      <td><span style={{color: st.score < 75 ? "#C53030":"#D69E2E",fontWeight:700}}>{st.score}</span></td>
                      <td>{st.highRisk > 3 ? <span style={{color:"#C53030",fontWeight:700}}>{st.highRisk}</span> : st.highRisk}</td>
                      <td>{st.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Assessment Pipeline ── */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Assessment Pipeline</div>
            <div className="sdom-chart-subtitle">Current assessment status and monthly trend</div>
            <div className="sdom-pipeline-row">
              {pipeline.map(p => (
                <div className="sdom-pipeline-card" key={p.label}>
                  <div className="sdom-pipeline-dot" style={{background:p.dot}} />
                  <div>
                    <div className="sdom-pipeline-lbl">{p.label}</div>
                    <div className="sdom-pipeline-val">{p.count.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 280, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ASSESSMENT_MONTHLY} barCategoryGap="30%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC" />
                  <XAxis dataKey="month" fontSize={12} tick={{fill:"#627D98"}} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} tick={{fill:"#627D98"}} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}} />
                  <Legend wrapperStyle={{fontSize:"0.82rem"}} />
                  <Bar dataKey="approved" name="Approved" fill="#1E3A5F" barSize={12} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pending"  name="Pending"  fill="#4A90D9" barSize={12} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#B83A3A" barSize={12} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="overdue"  name="Overdue"  fill="#5A6B7C" barSize={12} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    );
  }

  /* ── ROLE MANAGEMENT (generic for PM/SM/SS/TM/TI) ── */
  function renderRole(roleKey, title) {
    if (view?.type === "staffDetail") return renderStaffDetail(view.data);
    const filtered = filterByRole(roleKey);

    return (
      <div className="sdom-fade">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h1 className="sdom-page-title">{title} Management</h1>
            <p className="sdom-page-subtitle">Search, filter and manage all {title.toLowerCase()}s in the division.</p>
          </div>
          <button className="sdom-btn-primary" onClick={() => openAdd(roleKey)}>
            <Plus size={16}/> Add New {title}
          </button>
        </div>

        {/* Filters */}
        <div className="sdom-filter-bar">
          <div className="sdom-filter-field" style={{minWidth:200}}>
            <label>Name / ID</label>
            <input value={roleF.name} onChange={e=>setRoleF(p=>({...p,name:e.target.value}))} placeholder="Search..." />
          </div>
          <div className="sdom-filter-field">
            <label>Station</label>
            <select value={roleF.station} onChange={e=>setRoleF(p=>({...p,station:e.target.value}))}>
              {STATION_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>TI Area</label>
            <select value={roleF.ti} onChange={e=>setRoleF(p=>({...p,ti:e.target.value}))}>
              {TI_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Category</label>
            <select value={roleF.cat} onChange={e=>setRoleF(p=>({...p,cat:e.target.value}))}>
              <option>All</option><option>A</option><option>B</option><option>C</option><option>D</option>
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Risk Level</label>
            <select value={roleF.risk} onChange={e=>setRoleF(p=>({...p,risk:e.target.value}))}>
              <option>All</option><option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
        </div>

        <div className="sdom-chart-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{fontWeight:700,color:"#1e293b"}}>{filtered.length} staff found</span>
          </div>
          <div className="sdom-table-wrap">
            <table className="sdom-table">
              <thead>
                <tr><th>Name</th><th>Emp ID</th><th>Station</th><th>TI Area</th><th>Category</th><th>Risk</th><th>Last Score</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} style={{textAlign:"center",padding:32,color:"#94a3b8"}}>No records found</td></tr>
                )}
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{fontWeight:700}}>{s.name}</td>
                    <td style={{color:"#64748b",fontSize:"0.85rem"}}>{s.id}</td>
                    <td>{s.station}</td>
                    <td>{s.ti}</td>
                    <td>{catBadge(s.cat)}</td>
                    <td>{riskBadge(s.risk)}</td>
                    <td style={{fontWeight:700}}>{s.score}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td>
                      <div style={{display:"flex",gap:8}}>
                        <button className="sdom-btn-outline" style={{padding:"5px 10px",fontSize:"0.8rem"}} onClick={()=>openView("staffDetail",s)}>View</button>
                        <button className="sdom-icon-btn" title="Edit" onClick={()=>openEdit(s)}><Edit size={15} color="#2563eb"/></button>
                        <button className="sdom-icon-btn" title="Shift Role" onClick={()=>openShift(s)}><ArrowRightLeft size={15} color="#d97706"/></button>
                        <button className="sdom-icon-btn" title="Remove" onClick={()=>removeStaff(s.id)}><Trash2 size={15} color="#dc2626"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── STAFF DETAIL PAGE ── */
  function renderStaffDetail(s) {
    const scoreData = MONTHLY_TREND.map((m,i) => ({ month: m.month, score: Math.max(50, s.score - 10 + i*2) }));
    return (
      <div className="sdom-fade">
        <div style={{marginBottom:24}}>
          <button className="sdom-back-btn" onClick={() => {
            if (view?.returnTo === "stationDetail") {
              setView({ type: "stationDetail", data: view.stationData });
            } else {
              closeView();
            }
          }}><ArrowLeft size={16}/> Back to List</button>
        </div>

        {/* Hero header */}
        <div className="sdom-station-header" style={{marginBottom:24}}>
          <div className="sdom-station-header-meta">
            <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.6)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Staff Profile</div>
            <div style={{fontSize:"1.8rem",fontWeight:800,marginBottom:4}}>{s.name}</div>
            <div style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.7)"}}>{ROLE_MAP[s.role] || s.role} &bull; {s.station} &bull; {s.zone || "Central Railway"}</div>
            <div style={{marginTop:12,display:"flex",gap:10}}>
              {catBadge(s.cat)}
              {riskBadge(s.risk)}
              {statusBadge(s.status)}
            </div>
          </div>
          <div className="sdom-station-header-stats">
            <div className="sdom-station-header-stat">
              <span className="val">{s.score}</span>
              <span className="lbl">Latest Score</span>
            </div>
            <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
            <div className="sdom-station-header-stat">
              <span className="val">{s.contact || "—"}</span>
              <span className="lbl">Contact</span>
            </div>
            <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
            <div className="sdom-station-header-stat">
              <span className="val">{s.lastDate || "—"}</span>
              <span className="lbl">Last Assessment</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="sdom-row-2">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{ marginBottom: "16px" }}>Personal & Professional Details</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', paddingBottom: '20px' }}>
              {[
                ["Employee ID / HRMS ID", s.id],
                ["Designation", ROLE_MAP[s.role] || s.role],
                ["Mobile Number", s.contact || "N/A"],
                ["Email ID", s.email || `${s.id?.toLowerCase()}@rail.in`],
                ["Account Status", s.status || "Active"],
                ["Current Zone", s.zone || "Central Railway"],
                ["Current Division", s.division || "Nagpur"],
                ["Current Station Placement", s.station],
                ["Reporting Officer", s.reportingAom || "P. K. Verma (Sr. DOM)"]
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{lbl}</div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Operational Specifications (styled exactly like AOmModule) */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#0f172a', fontWeight: '800', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>
                Operational Profile Specifications
              </h4>
              
              {s.role === "pointsmen" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Reporting Station Master:</strong><div style={{fontWeight: 700, color: "#1e3a5f", marginTop: 4}}>{s.reportingSm || "S. Deshmukh (SM)"}</div></div>
                  <div><strong>Assigned Shift:</strong><div style={{fontWeight: 700, color: "#1e3a5f", marginTop: 4}}>{s.shift || "Morning Shift (06:00 - 14:00)"}</div></div>
                  <div><strong>Work Location Setup:</strong><div style={{fontWeight: 700, color: "#1e3a5f", marginTop: 4}}>{s.workLocation || "Yard Area"}</div></div>
                </div>
              )}

              {(s.role === "sm" || s.role === "ss") && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Operational Station:</strong><div style={{fontWeight: 700, color: "#065f46", marginTop: 4}}>{s.smStation || s.station || "N/A"}</div></div>
                  <div><strong>Operational Division:</strong><div style={{fontWeight: 700, color: "#065f46", marginTop: 4}}>{s.smDivision || s.division || "Nagpur"}</div></div>
                  <div><strong>Operational Zone:</strong><div style={{fontWeight: 700, color: "#065f46", marginTop: 4}}>{s.smZone || s.zone || "Central Railway"}</div></div>
                </div>
              )}

              {s.role === "ti" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Jurisdiction Division:</strong><div style={{fontWeight: 700, color: "#92400e", marginTop: 4}}>{s.jurisdiction || "Nagpur Division"}</div></div>
                  <div><strong>Reporting AOM Officer:</strong><div style={{fontWeight: 700, color: "#92400e", marginTop: 4}}>{s.reportingAom || "P. K. Verma (Sr. DOM)"}</div></div>
                  <div style={{ gridColumn: 'span 3', marginTop: '6px' }}><strong>Linked Stations under supervision:</strong><div style={{fontWeight: 700, color: "#92400e", marginTop: 4}}>{s.linkedStations || "Nagpur Main, Wardha Jn, Sewagram"}</div></div>
                </div>
              )}

              {s.role === "tm" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Crew Depot:</strong><div style={{fontWeight: 700, color: "#6b21a8", marginTop: 4}}>{s.workLocation || "Nagpur Depot"}</div></div>
                  <div><strong>Assigned Section Beats:</strong><div style={{fontWeight: 700, color: "#6b21a8", marginTop: 4}}>{s.reportingSm || "NGP-BSL Section"}</div></div>
                  <div><strong>Assigned Shift Beat Type:</strong><div style={{fontWeight: 700, color: "#6b21a8", marginTop: 4}}>{s.shift || "Goods Train Beat"}</div></div>
                </div>
              )}

              {!["pointsmen", "sm", "ss", "ti", "tm"].includes(s.role) && (
                <span style={{ fontSize: '13px', color: '#64748b' }}>No dynamic operational specifications required for this designation.</span>
              )}
            </div>
          </div>

          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Score Trend</div>
            <div className="sdom-chart-subtitle">Assessment score progression</div>
            <div style={{height:300}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" fontSize={11}/>
                  <YAxis domain={[40,100]} fontSize={11}/>
                  <RTooltip/>
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{r:5}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── STATIONS ── */
  function renderStations() {
    if (view?.type === "staffDetail") return renderStaffDetail(view.data);
    if (view?.type === "stationDetail") return renderStationDetail(view.data);
    const filtered = stations.filter(st =>
      !stF.name || st.name.toLowerCase().includes(stF.name.toLowerCase()) || st.code.toLowerCase().includes(stF.name.toLowerCase())
    );

    return (
      <div className="sdom-fade">
        <h1 className="sdom-page-title">Stations</h1>
        <p className="sdom-page-subtitle">Full list of stations in Nagpur Division. Click a station to open its complete analytics dashboard.</p>

        <div className="sdom-filter-bar" style={{flexWrap:"nowrap"}}>
          <div className="sdom-filter-field" style={{flex:1}}>
            <label>Search Station</label>
            <input value={stF.name} onChange={e=>setStF({name:e.target.value})} placeholder="Station name or code..." />
          </div>
        </div>

        <div className="sdom-chart-card">
          <div className="sdom-table-wrap">
            <table className="sdom-table">
              <thead>
                <tr><th>Station Name</th><th>Code</th><th>Assigned TI</th><th>SMs</th><th>Pointsmen</th><th>Avg Score</th><th>Safety %</th><th>High Risk</th><th>Pending</th><th>Dashboard</th></tr>
              </thead>
              <tbody>
                {filtered.map(st => (
                  <tr key={st.id}>
                    <td style={{fontWeight:700}}>{st.name}</td>
                    <td><span className="sdom-badge sdom-badge-blue">{st.code}</span></td>
                    <td>{st.ti}</td>
                    <td>{st.smCount}</td>
                    <td>{st.pmCount}</td>
                    <td style={{fontWeight:700,color: st.score>=85?"#16a34a":st.score>=75?"#d97706":"#dc2626"}}>{st.score}</td>
                    <td>{st.safety}%</td>
                    <td>{st.highRisk>3?<span style={{color:"#dc2626",fontWeight:700}}>{st.highRisk}</span>:st.highRisk}</td>
                    <td>{st.pending}</td>
                    <td>
                      <button className="sdom-btn-primary" style={{padding:"7px 14px",fontSize:"0.82rem"}} onClick={()=>openView("stationDetail",st)}>
                        Open Station Dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── STATION DETAIL ── */
  function renderStationDetail(st) {
    const stStaff    = staff.filter(s => s.station === st.name);
    const pmList     = stStaff.filter(s=>s.role==="pointsmen");
    const smList     = stStaff.filter(s=>s.role==="sm");
    const tiPerson   = stStaff.find(s=>s.role==="ti") || { name:st.ti, id:"—", contact:"—", cat:"—" };

    const catCount = ["A","B","C","D"].map(c => ({ cat:`Cat ${c}`, count: stStaff.filter(s=>s.cat===c).length, fill:CAT_COLORS[c] }));
    const riskCount = [
      { name:"Low",    value: stStaff.filter(s=>s.risk==="Low").length,    fill:"#16a34a" },
      { name:"Medium", value: stStaff.filter(s=>s.risk==="Medium").length, fill:"#f59e0b" },
      { name:"High",   value: stStaff.filter(s=>s.risk==="High").length,   fill:"#ef4444" },
    ].filter(r=>r.value>0);

    const trend = MONTHLY_TREND.map(m=>({...m, score: Math.max(60, st.score - 8 + MONTHLY_TREND.indexOf(m)*2)}));

    return (
      <div className="sdom-fade">
        <div style={{marginBottom:20}}>
          <button className="sdom-back-btn" onClick={closeView}><ArrowLeft size={16}/> Back to Stations</button>
        </div>

        {/* Station Hero */}
        <div className="sdom-station-header">
          <div className="sdom-station-header-meta">
            <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Station Analytics Dashboard</div>
            <div style={{fontSize:"1.9rem",fontWeight:800,marginBottom:4}}>{st.name}</div>
            <div style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.7)"}}>Code: <b>{st.code}</b> &bull; Assigned TI: <b>{st.ti}</b></div>
            <div style={{marginTop:12,display:"flex",gap:10}}>
              <span className="sdom-badge" style={{background:"rgba(255,255,255,0.15)",color:"#fff"}}>{st.smCount} Station Masters</span>
              <span className="sdom-badge" style={{background:"rgba(255,255,255,0.15)",color:"#fff"}}>{st.pmCount} Pointsmen</span>
              <span className={`sdom-badge ${st.highRisk > 4 ? "sdom-badge-red" : "sdom-badge-green"}`}>{st.highRisk} High-Risk</span>
            </div>
          </div>
          <div className="sdom-station-header-stats">
            <div className="sdom-station-header-stat">
              <span className="val">{st.score}</span>
              <span className="lbl">Avg Score</span>
            </div>
            <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
            <div className="sdom-station-header-stat">
              <span className="val">{st.safety}%</span>
              <span className="lbl">Safety</span>
            </div>
            <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
            <div className="sdom-station-header-stat">
              <span className="val">{st.pending}</span>
              <span className="lbl">Pending</span>
            </div>
            <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
            <div className="sdom-station-header-stat">
              <span className="val">{stStaff.length}</span>
              <span className="lbl">Total Staff</span>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:24}}>
          {[
            { label:"Total Staff",         val: stStaff.length },
            { label:"Pending Assessments", val: st.pending },
            { label:"Completed",           val: stStaff.filter(s=>s.status==="Approved").length },
            { label:"High-Risk Pointsmen", val: pmList.filter(s=>s.risk==="High").length },
            { label:"Safety Compliance",   val:`${st.safety}%` },
          ].map(c => (
            <div key={c.label} className="sdom-stat-card">
              <div className="sdom-stat-value">{c.val}</div>
              <div className="sdom-stat-label">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="sdom-row-2">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Category Distribution</div>
            <div className="sdom-chart-subtitle">A/B/C/D breakdown of staff at this station</div>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catCount} barSize={46} margin={{top:16,right:24,left:0,bottom:8}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC"/>
                  <XAxis dataKey="cat" fontSize={12} tick={{fill:"#102A43",fontWeight:600}} axisLine={false} tickLine={false}/>
                  <YAxis fontSize={11} tick={{fill:"#627D98"}} axisLine={false} tickLine={false}/>
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}} cursor={{fill:"rgba(0,0,0,0.03)"}}/>
                  <Bar dataKey="count" radius={[5,5,0,0]}>
                    {catCount.map((d,i)=><Cell key={i} fill={CAT_COLORS[Object.keys(CAT_COLORS)[i]]}/>)}
                    <LabelList dataKey="count" position="top" style={{fontSize:12,fontWeight:700,fill:"#102A43"}}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Risk Distribution</div>
            <div className="sdom-chart-subtitle">Staff risk level breakdown at this station</div>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskCount} cx="50%" cy="50%" innerRadius={70} outerRadius={105}
                       dataKey="value" paddingAngle={4}
                       label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                       labelLine={false}>
                    {riskCount.map((d,i)=><Cell key={i} fill={RISK_COLORS[d.name]}/>)}
                  </Pie>
                  <Legend wrapperStyle={{fontSize:"0.82rem"}}/>
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title">Score & Safety Trend (Last 6 Months)</div>
            <div className="sdom-chart-subtitle">Monthly performance tracking for this station</div>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{top:10,right:30,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC"/>
                  <XAxis dataKey="month" fontSize={12} tick={{fill:"#627D98"}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[50,100]} fontSize={11} tick={{fill:"#627D98"}} axisLine={false} tickLine={false}/>
                  <RTooltip contentStyle={{fontSize:"0.85rem",borderRadius:6,border:"1px solid #D9E2EC"}}/>
                  <Legend wrapperStyle={{fontSize:"0.82rem"}}/>
                  <Line type="monotone" dataKey="score" name="Avg Score" stroke="#1E3A5F" strokeWidth={2.5} dot={{r:4,fill:"#1E3A5F"}}/>
                  <Line type="monotone" dataKey="safety" name="Safety %" stroke="#2F855A" strokeWidth={2.5} strokeDasharray="5 3" dot={{r:4,fill:"#2F855A"}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Station Masters */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{marginBottom:16}}>Station Masters</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead><tr><th>Name</th><th>HRMS ID</th><th>Category</th><th>Last Score</th><th>Last Assessment</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {smList.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94a3b8",padding:24}}>No Station Masters assigned</td></tr>}
                  {smList.map(s=>(
                    <tr key={s.id}>
                      <td style={{fontWeight:700}}>{s.name}</td>
                      <td style={{color:"#64748b",fontSize:"0.85rem"}}>{s.id}</td>
                      <td>{catBadge(s.cat)}</td>
                      <td style={{fontWeight:700}}>{s.score}</td>
                      <td>{s.lastDate}</td>
                      <td>{statusBadge(s.status)}</td>
                      <td><button className="sdom-btn-ghost" onClick={()=>setView({ type: "staffDetail", data: s, returnTo: "stationDetail", stationData: st })}>View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pointsmen */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{marginBottom:16}}>Pointsmen</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead><tr><th>Name</th><th>HRMS ID</th><th>Category</th><th>Risk Level</th><th>Latest Score</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {pmList.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94a3b8",padding:24}}>No Pointsmen assigned</td></tr>}
                  {pmList.map(s=>(
                    <tr key={s.id}>
                      <td style={{fontWeight:700}}>{s.name}</td>
                      <td style={{color:"#64748b",fontSize:"0.85rem"}}>{s.id}</td>
                      <td>{catBadge(s.cat)}</td>
                      <td>{riskBadge(s.risk)}</td>
                      <td style={{fontWeight:700}}>{s.score}</td>
                      <td>{statusBadge(s.status)}</td>
                      <td><button className="sdom-btn-ghost" onClick={()=>setView({ type: "staffDetail", data: s, returnTo: "stationDetail", stationData: st })}>View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TI Card */}
        <div className="sdom-row-1">
          <div className="sdom-chart-card">
            <div className="sdom-chart-title" style={{marginBottom:16}}>Assigned Traffic Inspector</div>
            <div className="sdom-ti-card">
              <div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#1e3a5f",marginBottom:4}}>{tiPerson.name}</div>
                <div style={{color:"#4b6a9b",fontSize:"0.9rem",marginBottom:8}}>Traffic Inspector &bull; {st.ti}</div>
                <div style={{display:"flex",gap:16}}>
                  <span style={{fontSize:"0.85rem",color:"#64748b"}}><b>ID:</b> {tiPerson.id}</span>
                  <span style={{fontSize:"0.85rem",color:"#64748b"}}><b>Contact:</b> {tiPerson.contact}</span>
                </div>
              </div>
              <button className="sdom-btn-outline" onClick={()=>tiPerson.role && setView({ type: "staffDetail", data: tiPerson, returnTo: "stationDetail", stationData: st })}>View Profile</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── ASSESSMENT RECORDS ── */
  function renderRecords() {
    const hasFilter = recF.role!=="All"||recF.station!=="All"||recF.status!=="All"||recF.name;
    const totalByRole = Object.entries(ROLE_MAP).map(([k,v])=>({ label:v, count: staff.filter(s=>s.role===k).length }));

    return (
      <div className="sdom-fade">
        <h1 className="sdom-page-title">Assessment Records</h1>
        <p className="sdom-page-subtitle">Division-wide assessment data. Apply filters to search specific records.</p>

        {/* Overview cards */}
        <div className="sdom-overview-cards">
          {[
            { label:"Total Assessments", val:6245, color:"#2563eb" },
            { label:"Pending",           val:246,  color:"#d97706" },
            { label:"Approved",          val:4520, color:"#16a34a" },
            { label:"Rejected",          val:87,   color:"#dc2626" },
            { label:"Overdue",           val:33,   color:"#7c3aed" },
          ].map(c=>(
            <div key={c.label} className="sdom-overview-card">
              <div className="sdom-overview-card-val" style={{color:c.color}}>{c.val.toLocaleString()}</div>
              <div className="sdom-overview-card-lbl">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Role-wise summary */}
        <div className="sdom-chart-card" style={{marginBottom:24}}>
          <div className="sdom-chart-title" style={{marginBottom:16}}>Role-wise Assessment Summary</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
            {totalByRole.map(r=>(
              <div key={r.label} style={{background:"#f8fafc",borderRadius:10,padding:"16px 20px",border:"1px solid #e2e8f0",textAlign:"center"}}>
                <div style={{fontSize:"1.5rem",fontWeight:800,color:"#0f172a"}}>{r.count}</div>
                <div style={{fontSize:"0.78rem",fontWeight:600,color:"#64748b",marginTop:4}}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="sdom-filter-bar">
          <div className="sdom-filter-field" style={{minWidth:200}}>
            <label>Name</label>
            <input value={recF.name} onChange={e=>setRecF(p=>({...p,name:e.target.value}))} placeholder="Search staff name..." />
          </div>
          <div className="sdom-filter-field">
            <label>Role</label>
            <select value={recF.role} onChange={e=>setRecF(p=>({...p,role:e.target.value}))}>
              {ROLE_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Station</label>
            <select value={recF.station} onChange={e=>setRecF(p=>({...p,station:e.target.value}))}>
              {STATION_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Status</label>
            <select value={recF.status} onChange={e=>setRecF(p=>({...p,status:e.target.value}))}>
              <option>All</option><option>Approved</option><option>Pending</option><option>Rejected</option>
            </select>
          </div>
        </div>

        {hasFilter && (
          <div className="sdom-chart-card">
            <div style={{marginBottom:12,fontWeight:700,color:"#1e293b"}}>{(recFiltered||[]).length} records found</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead><tr><th>Name</th><th>Role</th><th>Station</th><th>TI Area</th><th>Score</th><th>Category</th><th>Status</th><th>Last Date</th></tr></thead>
                <tbody>
                  {(recFiltered||[]).length === 0 && <tr><td colSpan={8} style={{textAlign:"center",color:"#94a3b8",padding:32}}>No records match the filters</td></tr>}
                  {(recFiltered||[]).map(s=>(
                    <tr key={s.id}>
                      <td style={{fontWeight:700}}>{s.name}<br/><span style={{fontSize:"0.78rem",color:"#94a3b8"}}>{s.id}</span></td>
                      <td>{ROLE_MAP[s.role]||s.role}</td>
                      <td>{s.station}</td>
                      <td>{s.ti}</td>
                      <td style={{fontWeight:700}}>{s.score}</td>
                      <td>{catBadge(s.cat)}</td>
                      <td>{statusBadge(s.status)}</td>
                      <td>{s.lastDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!hasFilter && (
          <div className="sdom-empty">
            <Search size={32} style={{marginBottom:12}}/>
            <div className="sdom-empty-title">Apply filters to search records</div>
            <div className="sdom-empty-sub">Select a role, station, or enter a staff name above to view assessment records.</div>
          </div>
        )}
      </div>
    );
  }

  /* ── REPORTS ── */
  function renderReports() {
    const divSummary = [
      { label:"Average Division Score",  val:87    },
      { label:"Safety Compliance %",     val:"91%" },
      { label:"High-Risk Staff",         val:18    },
      { label:"Pending Approvals",       val:246   },
      { label:"Total Reports Generated", val:6245  },
    ];
    const reportTypes = [
      { label:"Staff Performance Report",   sub:"Scores & trends by role"      },
      { label:"Safety Compliance Report",   sub:"PME, REF, incident data"      },
      { label:"Assessment Status Report",   sub:"Pending/Approved/Rejected"    },
      { label:"Risk Analysis Report",       sub:"High & medium risk staff"     },
      { label:"Station Performance Report", sub:"Station-wise analytics"       },
    ];

    return (
      <div className="sdom-fade">
        <h1 className="sdom-page-title">Reports & Analytics</h1>
        <p className="sdom-page-subtitle">Division-level reporting hub. Use filters below to generate specific staff reports.</p>

        {/* Summary */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,marginBottom:24}}>
          {divSummary.map(c=>(
            <div key={c.label} className="sdom-stat-card">
              <div className="sdom-stat-value">{c.val}</div>
              <div className="sdom-stat-label">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="sdom-filter-bar">
          <div className="sdom-filter-field">
            <label>Role</label>
            <select value={repF.role} onChange={e=>{setRepF(p=>({...p,role:e.target.value}));setRepApplied(false);}}>
              {ROLE_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>TI Area</label>
            <select value={repF.ti} onChange={e=>{setRepF(p=>({...p,ti:e.target.value}));setRepApplied(false);}}>
              {TI_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Station</label>
            <select value={repF.station} onChange={e=>{setRepF(p=>({...p,station:e.target.value}));setRepApplied(false);}}>
              {STATION_OPTS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Category</label>
            <select value={repF.cat} onChange={e=>{setRepF(p=>({...p,cat:e.target.value}));setRepApplied(false);}}>
              <option>All</option><option>A</option><option>B</option><option>C</option><option>D</option>
            </select>
          </div>
          <div className="sdom-filter-field">
            <label>Risk Level</label>
            <select value={repF.risk} onChange={e=>{setRepF(p=>({...p,risk:e.target.value}));setRepApplied(false);}}>
              <option>All</option><option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <button className="sdom-btn-primary" onClick={()=>setRepApplied(true)}>
              <FileBarChart2 size={16}/> Generate Report
            </button>
          </div>
        </div>

        {repApplied && repFiltered && (
          <div className="sdom-chart-card">
            <div style={{marginBottom:14,fontWeight:700,color:"#1e293b"}}>{repFiltered.length} staff in report</div>
            <div className="sdom-table-wrap">
              <table className="sdom-table">
                <thead><tr><th>Name</th><th>Role</th><th>Station</th><th>TI Area</th><th>Score</th><th>Category</th><th>Risk</th><th>Status</th></tr></thead>
                <tbody>
                  {repFiltered.length === 0 && <tr><td colSpan={8} style={{textAlign:"center",color:"#94a3b8",padding:32}}>No staff match the selected filters</td></tr>}
                  {repFiltered.map(s=>(
                    <tr key={s.id}>
                      <td style={{fontWeight:700}}>{s.name}</td>
                      <td>{ROLE_MAP[s.role]||s.role}</td>
                      <td>{s.station}</td>
                      <td>{s.ti}</td>
                      <td style={{fontWeight:700}}>{s.score}</td>
                      <td>{catBadge(s.cat)}</td>
                      <td>{riskBadge(s.risk)}</td>
                      <td>{statusBadge(s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!repApplied && (
          <div className="sdom-empty">
            <FileBarChart2 size={32} style={{marginBottom:12}}/>
            <div className="sdom-empty-title">Select filters and click "Generate Report"</div>
            <div className="sdom-empty-sub">Apply one or more filters above to generate a custom staff performance report.</div>
          </div>
        )}
      </div>
    );
  }

  /* ── ROUTER ── */
  function renderBody() {
    switch(page) {
      case "dashboard":  return renderDashboard();
      case "pointsmen":  return renderRole("pointsmen","Pointsman");
      case "sm":         return renderRole("sm","Station Master");
      case "ss":         return renderRole("ss","Station Superintendent");
      case "tm":         return renderRole("tm","Train Manager");
      case "ti":         return renderRole("ti","Traffic Inspector");
      case "stations":   return renderStations();
      case "records":    return renderRecords();
      case "reports":    return renderReports();
      default:           return renderDashboard();
    }
  }

  /* ── MODAL ── */
  function renderModal() {
    if (!modal) return null;
    const isShift = modal.mode === "shift";
    return (
      <div className="sdom-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
        <div className="sdom-modal" style={!isShift ? { width: "900px", maxWidth: "95vw" } : undefined}>
          
          {!isShift ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Header inside modal */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                <div style={{
                  background: "linear-gradient(135deg, #0d2c4d 0%, #1e40af 100%)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(13, 44, 77, 0.2)",
                  color: "#ffffff"
                }}>
                  <UserPlus size={28} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#0d2c4d", letterSpacing: "-0.5px" }}>
                    {modal.mode === "edit" ? "EDIT SYSTEM USER" : "ADD NEW SYSTEM USER"}
                  </h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    Role-Based Operational Staff Provisioning & Management Console
                  </p>
                </div>
              </div>

              {/* Section 1: General & Contact Information */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d2c4d', margin: '0 0 10px', fontSize: '15px', fontWeight: '800' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0d2c4d', display: 'inline-block' }}></span>
                  1. General & Contact Information
                </h4>
                <div style={{ height: '1px', background: '#d5dfeb', marginBottom: '16px' }}></div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="sdom-modal-field">
                    <label>Full Name *</label>
                    <input 
                      value={modal.data.name || ""} 
                      onChange={e => setModal(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} 
                      placeholder="Enter full name (e.g. A. K. Sharma)" 
                    />
                  </div>
                  <div className="sdom-modal-field">
                    <label>Mobile Number *</label>
                    <input 
                      value={modal.data.contact || ""} 
                      onChange={e => setModal(p => ({ ...p, data: { ...p.data, contact: e.target.value } }))} 
                      placeholder="Enter 10-digit mobile number" 
                    />
                  </div>
                  <div className="sdom-modal-field">
                    <label>HRMS ID / Employee ID *</label>
                    <input 
                      value={modal.data.id || ""} 
                      disabled={modal.mode === "edit"}
                      onChange={e => setModal(p => ({ ...p, data: { ...p.data, id: e.target.value } }))} 
                      placeholder="Enter unique ID (e.g. PM_8820)" 
                    />
                  </div>
                  <div className="sdom-modal-field">
                    <label>Email ID *</label>
                    <input 
                      value={modal.data.email || ""} 
                      onChange={e => setModal(p => ({ ...p, data: { ...p.data, email: e.target.value } }))} 
                      placeholder="Enter email address (e.g. user@rail.in)" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Designation & Station Placement Setup */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d2c4d', margin: '0 0 10px', fontSize: '15px', fontWeight: '800' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0d2c4d', display: 'inline-block' }}></span>
                  2. Designation & Station Placement Setup
                </h4>
                <div style={{ height: '1px', background: '#d5dfeb', marginBottom: '16px' }}></div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="sdom-modal-field">
                    <label>Role / Designation *</label>
                    <select 
                      value={modal.role} 
                      onChange={e => setModal(p => ({ ...p, role: e.target.value }))}
                    >
                      {Object.entries(ROLE_MAP).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="sdom-modal-field">
                    <label>Division *</label>
                    <select 
                      value={modal.data.division || "Nagpur"} 
                      onChange={e => {
                        const div = e.target.value;
                        setModal(p => ({ ...p, data: { ...p.data, division: div, smDivision: div } }));
                      }}
                    >
                      {["Nagpur", "Pune", "Mumbai", "Solapur", "Bhusawal"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sdom-modal-field">
                    <label>Railway Zone *</label>
                    <select 
                      value={modal.data.zone || "Central Railway"} 
                      onChange={e => {
                        const zone = e.target.value;
                        setModal(p => ({ ...p, data: { ...p.data, zone: zone, smZone: zone } }));
                      }}
                    >
                      {["Central Railway", "Western Railway", "Northern Railway", "Southern Railway", "Eastern Railway"].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="sdom-modal-field">
                    <label>Station Name *</label>
                    <select 
                      value={modal.data.station || ""} 
                      onChange={e => {
                        const stName = e.target.value;
                        setModal(p => ({ ...p, data: { ...p.data, station: stName, smStation: stName } }));
                      }}
                    >
                      {stations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="sdom-modal-field">
                    <label>Category *</label>
                    <select 
                      value={modal.data.cat || "A"} 
                      onChange={e => setModal(p => ({ ...p, data: { ...p.data, cat: e.target.value } }))}
                    >
                      <option>A</option><option>B</option><option>C</option><option>D</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Dynamic Role-Based Custom Operational Profile */}
              {modal.role === "pointsmen" && (
                <div style={{ padding: 18, background: "#f0f7ff", border: "1px solid #c2e0ff", borderRadius: 10 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d2c4d', margin: '0 0 10px', fontSize: '14px', fontWeight: '800' }}>
                    Pointsman Operational Setup
                  </h4>
                  <div style={{ height: '1px', backgroundColor: '#c2e0ff', marginBottom: '16px' }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="sdom-modal-field">
                      <label>Reporting Station Master *</label>
                      <input 
                        value={modal.data.reportingSm || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, reportingSm: e.target.value } }))} 
                        placeholder="Station Master Name"
                      />
                    </div>
                    <div className="sdom-modal-field">
                      <label>Work Location Setup *</label>
                      <select 
                        value={modal.data.workLocation || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, workLocation: e.target.value } }))}
                      >
                        <option value="">Select Location</option>
                        <option value="Yard">Yard Area</option>
                        <option value="Cabin A">Cabin A</option>
                        <option value="Cabin B">Cabin B</option>
                        <option value="Platform Area">Platform Area</option>
                        <option value="Level Crossing Gate">Level Crossing Gate</option>
                      </select>
                    </div>
                    <div className="sdom-modal-field">
                      <label>Assigned Shift *</label>
                      <select 
                        value={modal.data.shift || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, shift: e.target.value } }))}
                      >
                        <option value="">Select Shift</option>
                        <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                        <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                        <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                        <option value="General Shift (09:00 - 18:00)">General Shift (09:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {(modal.role === "sm" || modal.role === "ss") && (
                <div style={{ padding: 18, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', margin: '0 0 10px', fontSize: '14px', fontWeight: '800' }}>
                    {ROLE_MAP[modal.role]} Operational Setup
                  </h4>
                  <div style={{ height: '1px', backgroundColor: '#a7f3d0', marginBottom: '16px' }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="sdom-modal-field">
                      <label>Operational Station *</label>
                      <select 
                        value={modal.data.smStation || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, smStation: e.target.value, station: e.target.value } }))}
                      >
                        <option value="">Select Operational Station</option>
                        {stations.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="sdom-modal-field">
                      <label>Operational Zone *</label>
                      <select 
                        value={modal.data.smZone || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, smZone: e.target.value, zone: e.target.value } }))}
                      >
                        <option value="">Select Zone</option>
                        {["Central Railway", "Western Railway", "Northern Railway", "Southern Railway", "Eastern Railway"].map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                    </div>
                    <div className="sdom-modal-field">
                      <label>Operational Division *</label>
                      <select 
                        value={modal.data.smDivision || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, smDivision: e.target.value, division: e.target.value } }))}
                      >
                        <option value="">Select Division</option>
                        {["Nagpur", "Pune", "Mumbai", "Solapur", "Bhusawal"].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {modal.role === "ti" && (
                <div style={{ padding: 18, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', margin: '0 0 10px', fontSize: '14px', fontWeight: '800' }}>
                    Traffic Inspector Operational Setup
                  </h4>
                  <div style={{ height: '1px', backgroundColor: '#fde68a', marginBottom: '16px' }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="sdom-modal-field">
                      <label>Jurisdiction Division *</label>
                      <input 
                        value={modal.data.jurisdiction || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, jurisdiction: e.target.value } }))} 
                        placeholder="Enter Jurisdiction (e.g. Nagpur Division)"
                      />
                    </div>
                    <div className="sdom-modal-field">
                      <label>Reporting AOM *</label>
                      <select 
                        value={modal.data.reportingAom || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, reportingAom: e.target.value } }))}
                      >
                        <option value="">Select AOM</option>
                        <option value="A. K. Sinha (AOM/G)">A. K. Sinha (AOM/G)</option>
                        <option value="M. K. Nair (AOM/Safety)">M. K. Nair (AOM/Safety)</option>
                        <option value="R. S. Prasad (AOM/Chg)">R. S. Prasad (AOM/Chg)</option>
                        <option value="P. K. Verma (Sr. DOM)">P. K. Verma (Sr. DOM)</option>
                      </select>
                    </div>
                    <div className="sdom-modal-field">
                      <label>Linked Stations under supervision *</label>
                      <input 
                        value={modal.data.linkedStations || ""} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, linkedStations: e.target.value } }))} 
                        placeholder="E.g. Nagpur Main, Wardha Jn, Sewagram"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modal.role === "tm" && (
                <div style={{ padding: 18, background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10 }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b21a8', margin: '0 0 10px', fontSize: '14px', fontWeight: '800' }}>
                    Train Manager Operational Setup
                  </h4>
                  <div style={{ height: '1px', backgroundColor: '#e9d5ff', marginBottom: '16px' }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="sdom-modal-field">
                      <label>Crew Depot *</label>
                      <select 
                        value={modal.data.workLocation || "Nagpur Depot"} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, workLocation: e.target.value } }))}
                      >
                        <option value="Nagpur Depot">Nagpur Depot</option>
                        <option value="Pune Depot">Pune Depot</option>
                        <option value="Mumbai Depot">Mumbai Depot</option>
                        <option value="Solapur Depot">Solapur Depot</option>
                        <option value="Bhusawal Depot">Bhusawal Depot</option>
                      </select>
                    </div>
                    <div className="sdom-modal-field">
                      <label>Assigned Section Beats *</label>
                      <input 
                        value={modal.data.reportingSm || "NGP-BSL Section"} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, reportingSm: e.target.value } }))} 
                        placeholder="E.g. NGP-BSL, NGP-DURG"
                      />
                    </div>
                    <div className="sdom-modal-field">
                      <label>Assigned Shift *</label>
                      <select 
                        value={modal.data.shift || "Goods Train Beat"} 
                        onChange={e => setModal(p => ({ ...p, data: { ...p.data, shift: e.target.value } }))}
                      >
                        <option value="Mail/Express Beat">Mail/Express Beat</option>
                        <option value="Passenger Beat">Passenger Beat</option>
                        <option value="Goods Train Beat">Goods Train Beat</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="sdom-modal-title" style={{ marginBottom: 20 }}>Shift Staff Role</div>
              <div className="sdom-modal-field">
                <label>Role (Shift to)</label>
                <select value={modal.role} onChange={e=>setModal(p=>({...p,role:e.target.value}))}>
                  {Object.entries(ROLE_MAP).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="sdom-modal-actions" style={{ marginTop: 24 }}>
            <button className="sdom-btn-primary" style={{ flex: 1 }} onClick={saveModal}>
              {modal.mode === "edit" ? "🔒 UPDATE USER ACCOUNT" : "👤 ADD USER ACCOUNT"}
            </button>
            <button className="sdom-btn-ghost" style={{ flex: 1 }} onClick={()=>setModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── CHART ZOOM MODAL ── */
  const renderChartZoomModal = () => {
    if (!isChartZoomModalOpen) return null;

    // Filter math logic on DASHBOARD_96_STATIONS
    const filtered = DASHBOARD_96_STATIONS.filter(st => {
      const q = zoomPopupSearch.trim().toLowerCase();
      const matchesSearch = !q || st.stationName.toLowerCase().includes(q) || st.stationCode.toLowerCase().includes(q);
      
      const matchesZone = zoomPopupZone === "All" || st.zone === zoomPopupZone;
      const matchesDivision = zoomPopupDivision === "All" || st.division === zoomPopupDivision;
      
      const matchesName = zoomPopupStationName === "All" || !zoomPopupStationName.trim() || st.stationName.toLowerCase().includes(zoomPopupStationName.toLowerCase());
      const matchesCode = zoomPopupStationCode === "All" || !zoomPopupStationCode.trim() || st.stationCode.toLowerCase().includes(zoomPopupStationCode.toLowerCase());
      
      const matchesCategory = zoomPopupCategory === "All" || st.category === zoomPopupCategory;
      const matchesRisk = zoomPopupRisk === "All" || st.riskLevel === zoomPopupRisk;
      const matchesStatus = zoomPopupStatus === "All" || st.assessmentStatus === zoomPopupStatus;

      let matchesDate = true;
      if (zoomPopupStartDate) {
        matchesDate = matchesDate && st.lastUpdatedDate >= zoomPopupStartDate;
      }
      if (zoomPopupEndDate) {
        matchesDate = matchesDate && st.lastUpdatedDate <= zoomPopupEndDate;
      }

      return matchesSearch && matchesZone && matchesDivision && matchesName && matchesCode && matchesCategory && matchesRisk && matchesStatus && matchesDate;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const currentPage = Math.min(zoomPopupPage, totalPages);

    const paginated = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const modalChartData = paginated.map(st => ({
      station: st.stationCode,
      name: st.stationName,
      completed: st.completed,
      pending: st.pending,
      avgScore: st.avgScore
    }));

    const catA = paginated.filter(s => s.category === "A").length;
    const catB = paginated.filter(s => s.category === "B").length;
    const catC = paginated.filter(s => s.category === "C").length;
    const catD = paginated.filter(s => s.category === "D").length;
    const totalCount = catA + catB + catC + catD;

    const modalPieData = [
      { name: "Category A", value: catA, color: "#1e40af" },
      { name: "Category B", value: catB, color: "#5b21b6" },
      { name: "Category C", value: catC, color: "#92400e" },
      { name: "Category D", value: catD, color: "#9d174d" }
    ].filter(item => item.value > 0);

    const handleResetPopupFilters = () => {
      setZoomPopupSearch("");
      setZoomPopupZone("All");
      setZoomPopupDivision("All");
      setZoomPopupStationName("All");
      setZoomPopupStationCode("All");
      setZoomPopupCategory("All");
      setZoomPopupRisk("All");
      setZoomPopupStatus("All");
      setZoomPopupStartDate("");
      setZoomPopupEndDate("");
      setZoomPopupPage(1);
    };

    return (
      <div 
        className="zoom-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          overflowY: "auto",
          display: "block",
          padding: 0,
          animation: "fadeIn 0.2s ease-out"
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <div 
          className="zoom-modal-container"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 0,
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
            overflow: "visible",
            border: "none",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Modal Header */}
          <div 
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8fafc",
              position: "sticky",
              top: 0,
              zIndex: 100
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                {selectedChartType === "progress" 
                  ? "Station-wise Evaluation Progress" 
                  : selectedChartType === "score" 
                  ? "Station-wise Average Score" 
                  : "Category Distribution"}
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                Page {currentPage} of {totalPages} (Showing 10 stations per page out of {filtered.length} matching stations)
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsChartZoomModalOpen(false)}
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Close Zoom View
              </button>
            </div>
          </div>

          {/* Modal Body Container */}
          <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflow: "visible" }}>
            
            {/* 1. FILTER CONTROLS GRID */}
            <div 
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Operational Search & Diagnostics Filters
                </h4>
                <button
                  type="button"
                  onClick={handleResetPopupFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: "750",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Reset Diagnostics Filters
                </button>
              </div>
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px"
                }}
              >
                {/* Search */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Quick Search</label>
                  <input
                    type="text"
                    placeholder="Search name/code..."
                    value={zoomPopupSearch}
                    onChange={(e) => { setZoomPopupSearch(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>

                {/* Zone */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Zone</label>
                  <select
                    value={zoomPopupZone}
                    onChange={(e) => { setZoomPopupZone(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#334155" }}
                  >
                    <option value="All">All Zones</option>
                    <option value="CR">CR (Central Rly)</option>
                  </select>
                </div>

                {/* Division */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Division</label>
                  <select
                    value={zoomPopupDivision}
                    onChange={(e) => { setZoomPopupDivision(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#334155" }}
                  >
                    <option value="All">All Divisions</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Solapur">Solapur</option>
                    <option value="Bhusawal">Bhusawal</option>
                  </select>
                </div>

                {/* Station Name */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Station Name</label>
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={zoomPopupStationName === "All" ? "" : zoomPopupStationName}
                    onChange={(e) => { setZoomPopupStationName(e.target.value || "All"); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>

                {/* Station Code */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Station Code</label>
                  <input
                    type="text"
                    placeholder="Filter by code..."
                    value={zoomPopupStationCode === "All" ? "" : zoomPopupStationCode}
                    onChange={(e) => { setZoomPopupStationCode(e.target.value || "All"); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Category</label>
                  <select
                    value={zoomPopupCategory}
                    onChange={(e) => { setZoomPopupCategory(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#334155" }}
                  >
                    <option value="All">All Categories</option>
                    <option value="A">Cat. A</option>
                    <option value="B">Cat. B</option>
                    <option value="C">Cat. C</option>
                    <option value="D">Cat. D</option>
                  </select>
                </div>

                {/* Risk Level */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Risk Level</label>
                  <select
                    value={zoomPopupRisk}
                    onChange={(e) => { setZoomPopupRisk(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#334155" }}
                  >
                    <option value="All">All Risks</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Status</label>
                  <select
                    value={zoomPopupStatus}
                    onChange={(e) => { setZoomPopupStatus(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#334155" }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Date range start */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>Start Date</label>
                  <input
                    type="date"
                    value={zoomPopupStartDate}
                    onChange={(e) => { setZoomPopupStartDate(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#334155" }}
                  />
                </div>

                {/* Date range end */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>End Date</label>
                  <input
                    type="date"
                    value={zoomPopupEndDate}
                    onChange={(e) => { setZoomPopupEndDate(e.target.value); setZoomPopupPage(1); }}
                    style={{ width: "100%", padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#334155" }}
                  />
                </div>
              </div>
            </div>

            {/* 2. DYNAMIC REAL-TIME CHART BOX */}
            <div 
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "750", color: "#0f172a" }}>
                  {selectedChartType === "progress" 
                    ? "Evaluation Progress Trends (Completed vs Pending)" 
                    : selectedChartType === "score"
                    ? "Average Safety Evaluation Scores (/100)"
                    : "Category Distribution Breakdown"}
                </h4>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                  Showing 10 stations on this page
                </span>
              </div>
              
              <div style={{ height: "260px", width: "100%" }}>
                {selectedChartType === "category" ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", gap: "60px" }}>
                    <div style={{ width: "220px", height: "220px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={modalPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={88}
                            dataKey="value"
                            label={({ name, value }) => `${name.replace("Category ", "")}: ${value}`}
                          >
                            {modalPieData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <RTooltip formatter={(value) => [`${value} Station(s)`, "Count"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {modalPieData.map((item) => (
                        <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                          <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: item.color }} />
                          <span>{item.name}:</span>
                          <span style={{ color: "#0f172a" }}>{item.value} Station(s) ({((item.value / (totalCount || 1)) * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={modalChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E2EC" />
                      <XAxis
                        dataKey="station"
                        tick={{ fontSize: 10, fill: "#475569" }}
                        height={40}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "#475569" }} domain={selectedChartType === "score" ? [0, 100] : undefined} axisLine={false} tickLine={false} />
                      <RTooltip 
                        contentStyle={{ background: "#0f172a", color: "#ffffff", borderRadius: "8px", border: "none", fontSize: "12px" }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                      {selectedChartType === "progress" ? (
                        <>
                          <Bar dataKey="completed" fill="#1E3A5F" name="Completed Evaluations" radius={[4, 4, 0, 0]} barSize={12} />
                          <Bar dataKey="pending" fill="#D69E2E" name="Pending Evaluations" radius={[4, 4, 0, 0]} barSize={12} />
                        </>
                      ) : (
                        <Bar dataKey="avgScore" fill="#1f7a5c" name="Average Evaluation Score" radius={[4, 4, 0, 0]} barSize={18} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 3. DETAILED STATION DATA TABLE */}
            <div 
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155" }}>Station Name</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155" }}>Code</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155" }}>Division</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155" }}>Zone</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155", textAlign: "right" }}>Completed</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155", textAlign: "right" }}>Pending</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155", textAlign: "right" }}>Avg. Score</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155", textAlign: "center" }}>Category</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155", textAlign: "center" }}>Risk Level</th>
                    <th style={{ padding: "12px 16px", fontWeight: "700", color: "#334155" }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                        No stations matching the selected diagnostics criteria.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((st) => {
                      const riskColor = st.riskLevel === "High" ? "#ef4444" : st.riskLevel === "Medium" ? "#ea580c" : "#16a34a";
                      const riskBg = st.riskLevel === "High" ? "#fef2f2" : st.riskLevel === "Medium" ? "#fff7ed" : "#dcfce7";
                      const catBg = st.category === "A" ? "#eff6ff" : st.category === "B" ? "#f5f3ff" : st.category === "C" ? "#fffbeb" : "#fdf2f8";
                      const catColor = st.category === "A" ? "#1e40af" : st.category === "B" ? "#5b21b6" : st.category === "C" ? "#92400e" : "#9d174d";

                      return (
                        <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{st.stationName}</td>
                          <td style={{ padding: "12px 16px", fontWeight: "700", color: "#475569" }}>{st.stationCode}</td>
                          <td style={{ padding: "12px 16px", color: "#475569" }}>{st.division}</td>
                          <td style={{ padding: "12px 16px", color: "#475569" }}>{st.zone}</td>
                          <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "700", color: "#1E3A5F" }}>{st.completed}</td>
                          <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "700", color: "#D69E2E" }}>{st.pending}</td>
                          <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "700", color: "#1f7a5c" }}>{st.avgScore}/100</td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ background: catBg, color: catColor, padding: "2px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "11px" }}>
                              Cat {st.category}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ background: riskBg, color: riskColor, padding: "3px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "11px" }}>
                              {st.riskLevel}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#64748b" }}>{st.lastUpdatedDate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Modal Footer (SLIDER / TABS PAGINATION) */}
          <div 
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #e2e8f0",
              background: "#f8fafc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
              Showing {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} stations
            </div>
            
            {/* Page tabs */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setZoomPopupPage(p => Math.max(p - 1, 1))}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Previous
              </button>

              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setZoomPopupPage(pageNum)}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: isActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
                        borderRadius: "6px",
                        background: isActive ? "#2563eb" : "#ffffff",
                        color: isActive ? "#ffffff" : "#334155",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setZoomPopupPage(p => Math.min(p + 1, totalPages))}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* ── RENDER ── */
  return (
    <div className="sdom-app-layout">
      {/* Topbar */}
      <header className="sdom-topbar-fixed">
        <div className="sdom-topbar-brand">
          <div className="sdom-topbar-logo">IR</div>
          <div>
            <div className="sdom-topbar-title">Indian Railway Evaluation System</div>
            <div className="sdom-topbar-sub">Nagpur Division — Sr. DOM Command Center</div>
          </div>
        </div>
        <div className="sdom-topbar-right">
          <div className="sdom-topbar-user">
            <div className="sdom-topbar-avatar">SD</div>
            <div>
              <div className="sdom-topbar-user-name">Sr. DOM</div>
              <div className="sdom-topbar-user-role">Super Admin</div>
            </div>
          </div>
          <button onClick={onLogout} className="sdom-logout-btn">
            <LogOut size={14}/> Logout
          </button>
        </div>
      </header>

      <div className="sdom-body-layout">
        {/* Sidebar */}
        <aside className="sdom-sidebar-fixed">
          <div className="sdom-sidebar-section-label">Navigation</div>
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} className={`sdom-nav-btn ${page===item.key?"active":""}`}
                onClick={()=>navigate(item.key)}>
                <Icon size={17}/> <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main className="sdom-content-scrollable">
          {renderBody()}
        </main>
      </div>

      {renderModal()}
      {renderChartZoomModal()}
    </div>
  );
}
