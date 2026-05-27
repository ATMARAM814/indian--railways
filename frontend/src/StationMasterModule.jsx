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
  Activity,
  Lock,
  Info,
  Shield,
  FileDown,
  Maximize2
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
  name: "S. Deshmukh",
  employeeId: "SM_1001",
  contact: "+91 98220 44556",
  designation: "Station Master",
  department: "Operations",
  station: "Nagpur Junction",
  reportingOfficer: "TI_2001 — A. Kulkarni",
  dob: "1985-04-12",
  dateOfAppointment: "2015-06-01",
  pmeDoneDate: "2024-06-02",
  pmeDueDate: "2028-06-01",
  isolatorCertificateIssuedDate: "2024-11-15",
  automaticTrainingDate: "2025-03-10",
  counsellingDate: "2026-01-20"
};

/* ─── POINTSMEN DATA ─── */
const initialPointsmen = [
  { id:1, hrmsId:"PM_1001", name:"Ravi Kumar",   gender:"Male", age:38, doj:"2012-04-10", basePay:"₹28,500", lastScore:92, safetyScore:95, totalAssessments:12, pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Pending", monitoringStatus:"Active" },
  { id:2, hrmsId:"PM_1102", name:"Sanjay Patil",  gender:"Male", age:34, doj:"2015-08-22", basePay:"₹26,200", lastScore:78, safetyScore:80, totalAssessments:9,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Pending", monitoringStatus:"On Duty"  },
  { id:3, hrmsId:"PM_1103", name:"Deepak Nair",   gender:"Male", age:41, doj:"2009-11-05", basePay:"₹31,000", lastScore:48, safetyScore:62, totalAssessments:15, pmeStatus:"Fit",      refStatus:"Pending",  disciplinary:"Warning", incidents:1, approvalStatus:"Approved", monitoringStatus:"Off Duty" },
  { id:4, hrmsId:"PM_1104", name:"Ajay Sharma",   gender:"Male", age:29, doj:"2019-02-18", basePay:"₹23,400", lastScore:84, safetyScore:88, totalAssessments:6,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Pending", monitoringStatus:"Active"  },
  { id:5, hrmsId:"PM_1105", name:"Kunal Verma",   gender:"Male", age:36, doj:"2013-07-30", basePay:"₹27,800", lastScore:35, safetyScore:55, totalAssessments:11, pmeStatus:"Unfit",    refStatus:"Pending",  disciplinary:"Warning", incidents:2, approvalStatus:"Rejected", monitoringStatus:"Absent" },
  { id:6, hrmsId:"PM_1106", name:"Priya Menon",   gender:"Female",age:31,doj:"2018-03-14",basePay:"₹25,100", lastScore:67, safetyScore:74, totalAssessments:7,  pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Approved", monitoringStatus:"On Duty" },
  { id:7, hrmsId:"PM_1107", name:"Ramesh Yadav",  gender:"Male", age:45, doj:"2005-09-01", basePay:"₹34,600", lastScore:82, safetyScore:90, totalAssessments:18, pmeStatus:"Fit",      refStatus:"Cleared",  disciplinary:"None",    incidents:0, approvalStatus:"Approved", monitoringStatus:"Off Duty" },
  { id:8, hrmsId:"PM_1108", name:"Sneha Iyer",    gender:"Female",age:28,doj:"2020-01-20",basePay:"₹22,000", lastScore:19, safetyScore:40, totalAssessments:3,  pmeStatus:"Unfit",    refStatus:"Pending",  disciplinary:"Serious", incidents:3, approvalStatus:"Rejected", monitoringStatus:"Absent" }
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
  { pointsmanId:1, hrmsId:"PM_1001", name:"Ravi Kumar",    lastDate:"2026-03-28" },
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

/* ─── SM TEST QUESTIONS (25 MCQs) ─── */
const smTestQuestions = [
  {
    id: 1,
    text: "Under Station Working Rules (SWR), what is the maximum speed permitted for a train passing through when main line points are set for loop line?",
    options: ["15 km/h", "30 km/h", "50 km/h", "As per Maximum Permissible Speed"],
    answer: 1,
    explanation: "As per standard operating manuals, the speed over loop lines is restricted to 30 km/h unless specifically authorized for 50 km/h with high-speed turnouts."
  },
  {
    id: 2,
    text: "In the Absolute Block System, what is the minimum distance required between two block stations to grant 'Line Clear'?",
    options: ["Station section length", "Block section length", "Adequate distance (usually 180m or 120m)", "Sighting board distance"],
    answer: 2,
    explanation: "Line Clear cannot be granted until the block section is clear and adequate distance (180m for absolute block, 120m for automatic block) is clear beyond the first stop signal."
  },
  {
    id: 3,
    text: "What does a double yellow aspect on a distant signal indicate to the loco pilot?",
    options: ["Proceed at Maximum Permissible Speed", "Prepare to stop at the next stop signal", "Prepare to pass next signal at caution/restricted speed", "Stop immediately"],
    answer: 2,
    explanation: "A double yellow aspect is an attention signal, warning the driver that they are approaching a signal showing a restrictive aspect (single yellow or red)."
  },
  {
    id: 4,
    text: "Who holds the ultimate administrative responsibility for the safe reception and dispatch of trains within station limits?",
    options: ["Section Controller", "Pointsman on duty", "Station Master", "Traffic Inspector"],
    answer: 2,
    explanation: "The Station Master is the overall in-charge of station limits and is personally responsible for ensuring all safety rules are followed during train reception and dispatch."
  },
  {
    id: 5,
    text: "When a passenger train is stopped at a station for an extended duration, what safety precaution must the Station Master take regarding the signals?",
    options: ["Ensure all reception signals are kept at green", "Ensure starter and advanced starter signals are kept at danger", "Inform the control room to disconnect track circuits", "Authorize the pointsman to reverse the points manually"],
    answer: 1,
    explanation: "Starter and advanced starter signals must be kept at 'Danger' to prevent accidental rolling or unauthorized departure of the train."
  },
  {
    id: 6,
    text: "If a train has parted mid-section, what is the primary duty of the Station Master upon noticing the parting?",
    options: ["Lower the Home signal for the next train", "Show red hand signal to the guard, do not lower signals for opposing directions", "Shunt the train immediately", "Call the Divisional Railway Manager"],
    answer: 1,
    explanation: "The SM must alert the train staff using a red hand signal to warn them of parting and ensure no other trains are authorized into the affected block section."
  },
  {
    id: 7,
    text: "What color of banner flag is used to protect a track section under engineering obstruction?",
    options: ["Green", "Yellow", "Red", "White"],
    answer: 2,
    explanation: "A red banner flag is placed across the rails to provide immediate visual protection for any track section undergoing maintenance or having an obstruction."
  },
  {
    id: 8,
    text: "How many detonators should be placed on the track to protect a train stalled in a block section on a double line?",
    options: ["1 detonator at 500m", "2 detonators at 1000m", "3 detonators (1 at 600m, 1 at 1200m, and 1 more 10m ahead)", "4 detonators placed randomly"],
    answer: 2,
    explanation: "According to general rules, 3 detonators must be placed: 1st at 600m, 2nd at 1200m, and the 3rd at 1210m from the stalled train to give warning in case of emergency."
  },
  {
    id: 9,
    text: "When points are blocked due to ballast or obstruction, what indication is observed on the VDU/Control Panel?",
    options: ["Steady green light", "Steady yellow light", "Flashing red/no indication (out of correspondence)", "Audible bell with green flashing light"],
    answer: 2,
    explanation: "When points cannot complete their operation and lock properly, they are 'out of correspondence,' showing a flashing red indicator or blank status on the panel."
  },
  {
    id: 10,
    text: "A 'Calling-on' signal is used under which of the following circumstances?",
    options: ["To permit a train to enter an obstructed line at slow speed", "To start a train from a loop line when starter is defective", "To warn the driver of an upcoming steep gradient", "To bypass shunting limits during night hours"],
    answer: 0,
    explanation: "A calling-on signal is a miniature signal fixed below a stop signal, used to admit a train into an occupied or obstructed line at restricted speed when the main signal cannot be cleared."
  },
  {
    id: 11,
    text: "Under what circumstances can a train pass a Semi-Automatic signal showing Red (Danger) in automatic territory?",
    options: ["After waiting for 1 minute by day / 2 minutes by night, then proceeding at restricted speed", "Only with written authority T-369(3b)", "Immediately at 15 km/h without stopping", "Only when accompanied by a pointsman"],
    answer: 0,
    explanation: "In automatic signaling territory, a loco pilot can pass a semi-automatic signal in automatic mode at danger after stopping for 1 min (day) or 2 min (night), proceeding with extreme caution at 10-15 km/h."
  },
  {
    id: 12,
    text: "What is the frequency of testing the emergency slide valves and emergency crossover operations by the Station Master?",
    options: ["Daily", "Weekly", "Fortnightly", "Monthly"],
    answer: 0,
    explanation: "Emergency crossover points and emergency signaling controls must be tested daily by the Station Master on duty to ensure high availability."
  },
  {
    id: 13,
    text: "During shunting of passenger coaches containing passengers, what is the maximum speed allowed?",
    options: ["15 km/h", "10 km/h", "5 km/h", "30 km/h"],
    answer: 0,
    explanation: "Shunting speed is strictly restricted to 15 km/h. When shunting coaching stock containing passengers, it must be performed with utmost care under direct supervisor control."
  },
  {
    id: 14,
    text: "What signal is used to indicate that the line is clear and shunting operations are authorized?",
    options: ["Shunt signal showing yellow", "Starter signal", "Home signal", "Shunt signal showing two white diagonal lights (or off position)"],
    answer: 3,
    explanation: "A position-light shunt signal in the 'off' position displays two diagonal white lights, indicating that shunting may proceed."
  },
  {
    id: 15,
    text: "To whom does a Gateman at an interlocked level crossing gate report immediately in case of gate defects?",
    options: ["Section Engineer (P-Way)", "Station Master in control of the section", "Traffic Inspector", "Divisional Safety Officer"],
    answer: 1,
    explanation: "The Gateman is under the direct operational control of the SM and must immediately report any gate defect or track obstruction to the SM on duty."
  },
  {
    id: 16,
    text: "Under the Absolute Block System, a train cannot enter the block section without obtaining:",
    options: ["Line Clear authority from the block station ahead", "Guard's hand signal", "Driver's whistle", "Passenger manifest clearance"],
    answer: 0,
    explanation: "Line Clear is the primary authority to proceed under the Absolute Block System, ensuring that the block section ahead is completely clear of other trains."
  },
  {
    id: 17,
    text: "The 'Advance Starter' signal is defined as:",
    options: ["The last stop signal of a station controlling entry into the block section", "The first stop signal of a station", "Shunting authority indicator", "Calling-on signal"],
    answer: 0,
    explanation: "The Advanced Starter is the last stop signal at a station, marking the boundary of station limits. Passing it represents entry into the block section."
  },
  {
    id: 18,
    text: "In case of total failure of communications on a single line section, which authority is given to the Loco Pilot?",
    options: ["T/B 602 (Authority to proceed during total failure)", "T/A 602", "T/C 602", "T/D 602"],
    answer: 0,
    explanation: "Form T/B 602 is the official authority issued to run trains during total failure of communication on a single line block section."
  },
  {
    id: 19,
    text: "When points are to be hand-cranked due to motor failure, what safety action is mandatory for the Station Master?",
    options: ["Ensure crank handle is locked back in the key box or kept in personal custody after use", "Rely entirely on the pointsman's verbal confirmation", "Lower the reception signals before cranking begins", "None, cranking is done independently by P-Way staff"],
    answer: 0,
    explanation: "The SM must keep the crank handle in safe custody or locked in the transmission box to prevent unauthorized point reversal during train movements."
  },
  {
    id: 20,
    text: "What form is issued to authorize a train to pass a defective Reception Stop Signal at Danger?",
    options: ["T/511", "T/512", "T/369(3b)", "T/806"],
    answer: 2,
    explanation: "Form T/369(3b) is the written authority to pass a defective reception stop signal at danger, which also contains speed restriction instructions."
  },
  {
    id: 21,
    text: "A Sighting Board is placed at what minimum distance before the First Stop Signal?",
    options: ["1400 metres", "1000 metres", "800 metres", "2000 metres"],
    answer: 0,
    explanation: "A sighting board is placed 1400 meters before the First Stop Signal (FSS) on high-speed lines to warn loco pilots of the upcoming signal location."
  },
  {
    id: 22,
    text: "What is the minimum adequate distance (overlap) required for shunting within station limits in the face of an approaching train?",
    options: ["45 metres", "180 metres", "120 metres", "90 metres"],
    answer: 1,
    explanation: "Under general safety rules, shunting must not be permitted within 180 meters of the path of an approaching train to prevent collision hazards."
  },
  {
    id: 23,
    text: "A flashing amber aspect on an auxiliary route indicator warns the driver of:",
    options: ["Severe speed restriction ahead", "Route deviation ahead onto a loop line", "Normal running speed on the main line", "Stop at next block station"],
    answer: 1,
    explanation: "A flashing amber aspect warns the loco pilot that the train is being routed onto a loop line or crossing over points, requiring an immediate speed reduction."
  },
  {
    id: 24,
    text: "During heavy rains or waterlogging exceeding rail level, what is the duty of the Station Master?",
    options: ["Suspend all traffic on the affected line and inform the controller", "Allow trains to pass at 15 km/h", "Allow trains only if the guard issues a permit", "Keep reception signals green to clear the yard"],
    answer: 0,
    explanation: "If water rises above rail level, the SM must immediately suspend train movements over that section, protect the track, and report the condition to the section controller."
  },
  {
    id: 25,
    text: "For shunting over a facing point that is not interlocked or has defective interlocking, what is the mandatory safety precaution?",
    options: ["Points must be clipped and padlocked", "Points must be clamped only", "Pointsman must hold the point lever manually", "No precaution needed, shunting speed is slow"],
    answer: 0,
    explanation: "Non-interlocked facing points must be securely clipped and padlocked before any train or shunting movement is authorized over them to prevent derailments."
  }
];

/* ─── SM SELF-ASSESSMENT HISTORY (done by TI) ─── */
const smAssessmentHistory = [
  {
    id: 1, date: "2026-03-25", period: "Q1 2026",
    assessedBy: "TI_2001 — R. Khan",
    totalScore: 86, category: "A", approvalStatus: "Approved",
    tiRemarks: "Station demonstrates strong operational discipline and safety culture.",
    sections: [
      { title:"Station Management",         marks:17, outOf:20 },
      { title:"Safety Records",             marks:18, outOf:20 },
      { title:"Staff Supervision",          marks:16, outOf:20 },
      { title:"Emergency Handling",         marks:17, outOf:20 },
      { title:"Documentation & Compliance", marks:18, outOf:20 }
    ],
    mcqResponses: [1, 2, 2, 2, 1, 1, 2, 2, 2, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0]
  },
  {
    id: 2, date: "2025-12-18", period: "Q4 2025",
    assessedBy: "TI_2001 — R. Khan",
    totalScore: 79, category: "B", approvalStatus: "Approved",
    tiRemarks: "Good performance. Minor gaps in documentation — addressed in training.",
    sections: [
      { title:"Station Management",         marks:16, outOf:20 },
      { title:"Safety Records",             marks:15, outOf:20 },
      { title:"Staff Supervision",          marks:15, outOf:20 },
      { title:"Emergency Handling",         marks:16, outOf:20 },
      { title:"Documentation & Compliance", marks:17, outOf:20 }
    ],
    mcqResponses: [1, 2, 3, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 2, 1, 0, 0, 2, 0, 2, 0, 1, 1, 1, 0]
  },
  {
    id: 3, date: "2025-09-10", period: "Q3 2025",
    assessedBy: "TI_2001 — R. Khan",
    totalScore: 91, category: "A", approvalStatus: "Approved",
    tiRemarks: "Excellent quarter. Exceptional handling of monsoon disruptions.",
    sections: [
      { title:"Station Management",         marks:19, outOf:20 },
      { title:"Safety Records",             marks:18, outOf:20 },
      { title:"Staff Supervision",          marks:18, outOf:20 },
      { title:"Emergency Handling",         marks:19, outOf:20 },
      { title:"Documentation & Compliance", marks:17, outOf:20 }
    ],
    mcqResponses: [1, 2, 2, 2, 1, 1, 2, 2, 2, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0]
  },
  {
    id: 4, date: "2025-06-14", period: "Q2 2025",
    assessedBy: "TI_2001 — R. Khan",
    totalScore: 74, category: "B", approvalStatus: "Approved",
    tiRemarks: "Satisfactory. Focus needed on staff supervision logs.",
    sections: [
      { title:"Station Management",         marks:15, outOf:20 },
      { title:"Safety Records",             marks:14, outOf:20 },
      { title:"Staff Supervision",          marks:14, outOf:20 },
      { title:"Emergency Handling",         marks:15, outOf:20 },
      { title:"Documentation & Compliance", marks:16, outOf:20 }
    ],
    mcqResponses: [1, 2, 3, 2, 1, 2, 2, 1, 2, 1, 0, 1, 0, 2, 1, 0, 0, 2, 0, 2, 1, 1, 1, 1, 0]
  }
];

/* ─── SM SELF‑ASSESSMENT (done by TI) ─── */
const smSelfAssessment = {
  date: "2026-03-25",
  period: "Q1 2026",
  assessedBy: "TI_2001 — R. Khan",
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

const formatQuarterPeriod = (periodStr) => {
  if (!periodStr) return "—";
  const match = periodStr.match(/Q([1-4])\s+(\d{4})/i);
  if (!match) return periodStr;
  const quarter = parseInt(match[1], 10);
  const year = match[2];
  switch (quarter) {
    case 1: return `01 Jan ${year} – 31 Mar ${year}`;
    case 2: return `01 Apr ${year} – 30 Jun ${year}`;
    case 3: return `01 Jul ${year} – 30 Sep ${year}`;
    case 4: return `01 Oct ${year} – 31 Dec ${year}`;
    default: return periodStr;
  }
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

  // Fullscreen Analytics States
  const [fullscreenChart, setFullscreenChart] = useState(null); // 'monthly' | 'safety' | 'performance' | null
  const [fsStartDate, setFsStartDate]         = useState("");
  const [fsEndDate, setFsEndDate]             = useState("");
  const [fsCategory, setFsCategory]           = useState("All");
  const [fsRisk, setFsRisk]                   = useState("All");
  const [fsSearch, setFsSearch]               = useState("");

  const smName = user?.name || smProfile.name;
  const smId   = user?.hrmsId || smProfile.employeeId;

  // Reactively Filtered Pointsmen for Fullscreen View
  const filteredFsPointsmen = useMemo(() => {
    return pointsmen.filter(p => {
      const q = fsSearch.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.hrmsId.toLowerCase().includes(q);
      const matchCategory = fsCategory === "All" || getCat(p.lastScore) === fsCategory;
      const matchRisk = fsRisk === "All" || riskLevel(p) === fsRisk;
      
      const pmHistoryList = pmAssessmentHistory[p.id] || [];
      const mostRecentDate = pmHistoryList.length > 0 ? pmHistoryList[0].date : p.doj;
      let matchDate = true;
      if (fsStartDate) matchDate = matchDate && mostRecentDate >= fsStartDate;
      if (fsEndDate) matchDate = matchDate && mostRecentDate <= fsEndDate;
      
      return matchSearch && matchCategory && matchRisk && matchDate;
    });
  }, [pointsmen, fsSearch, fsCategory, fsRisk, fsStartDate, fsEndDate]);

  // Reactively Recalculated Monthly Trend for Fullscreen View
  const dynamicMonthlyTrend = useMemo(() => {
    const months = [
      { label: "Nov 25", start: "2025-11-01", end: "2025-11-30", fallbackScore: 71, fallbackSafety: 68 },
      { label: "Dec 25", start: "2025-12-01", end: "2025-12-31", fallbackScore: 74, fallbackSafety: 72 },
      { label: "Jan 26", start: "2026-01-01", end: "2026-01-31", fallbackScore: 68, fallbackSafety: 70 },
      { label: "Feb 26", start: "2026-02-01", end: "2026-02-28", fallbackScore: 77, fallbackSafety: 75 },
      { label: "Mar 26", start: "2026-03-01", end: "2026-03-31", fallbackScore: 80, fallbackSafety: 79 }
    ];

    return months.map(m => {
      let totalScore = 0;
      let totalSafety = 0;
      let count = 0;

      filteredFsPointsmen.forEach(p => {
        const pmHistoryList = pmAssessmentHistory[p.id] || [];
        const matches = pmHistoryList.filter(h => h.date >= m.start && h.date <= m.end);
        matches.forEach(h => {
          totalScore += h.total;
          totalSafety += p.safetyScore;
          count++;
        });
      });

      return {
        month: m.label,
        assessments: count > 0 ? count : 5,
        avgScore: count > 0 ? Math.round(totalScore / count) : m.fallbackScore,
        safetyAvg: count > 0 ? Math.round(totalSafety / count) : m.fallbackSafety
      };
    });
  }, [filteredFsPointsmen]);

  // History State
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(`sm_history_${smId}`);
    return saved ? JSON.parse(saved) : smAssessmentHistory;
  });

  // MCQ Test State
  const [smMcqTest, setSmMcqTest] = useState(() => {
    const saved = localStorage.getItem(`sm_mcq_test_${smId}`);
    return saved ? JSON.parse(saved) : null;
  });

  // MCQ Test Assignment State
  const [testAssigned, setTestAssigned] = useState(() => {
    const saved = localStorage.getItem(`sm_test_assigned_${smId}`);
    if (saved === null) {
      localStorage.setItem(`sm_test_assigned_${smId}`, "Assigned");
      return "Assigned";
    }
    return saved;
  });

  // Active MCQ Attempt States
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [testResponses, setTestResponses] = useState(() => Array(25).fill(null));

  const startTestAttempt = () => {
    setActiveQIdx(0);
    setTestResponses(Array(25).fill(null));
    setPageMode("takeTest");
  };

  const handleSubmitTestAttempt = () => {
    const correctCount = testResponses.filter((r, idx) => r === smTestQuestions[idx].answer).length;
    const percentage = Math.round((correctCount / 25) * 100);
    const passStatus = percentage >= 60 ? "PASSED" : "FAILED";
    const today = new Date().toISOString().slice(0, 10);
    
    // Save to local storage for SM
    const testResult = {
      completed: true,
      correctCount: correctCount,
      responses: [...testResponses],
      submittedDate: today,
      percentage: percentage,
      passStatus: passStatus
    };
    localStorage.setItem(`sm_mcq_test_${smId}`, JSON.stringify(testResult));
    setSmMcqTest(testResult);

    // Update assigned status to 'Completed'
    localStorage.setItem(`sm_test_assigned_${smId}`, "Completed");
    setTestAssigned("Completed");

    // Generate a completed History record representing the Online self-exam
    const record = {
      id: Date.now(),
      date: today,
      period: "Q2 2026",
      assessedBy: "Online Self-Exam",
      totalScore: correctCount,
      category: getCat(percentage),
      approvalStatus: "Completed",
      tiRemarks: `Completed online safety competency assessment. Score: ${percentage}% (${correctCount}/25 correct). Awaiting TI evaluation.`,
      sections: [
        { title: "MCQ Safety & Rule Exam", marks: correctCount, outOf: 25 }
      ],
      mcqResponses: [...testResponses],
      isOnlineExam: true
    };

    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem(`sm_history_${smId}`, JSON.stringify(newHistory));

    // Also notify TI list in localStorage!
    let tiSmListStr = localStorage.getItem("ti_sm_list");
    let tiSmList = tiSmListStr ? JSON.parse(tiSmListStr) : null;
    if (tiSmList) {
      tiSmList = tiSmList.map(s => s.hrmsId === smId ? { ...s, status: "Submitted", score: correctCount } : s);
      localStorage.setItem("ti_sm_list", JSON.stringify(tiSmList));
    }

    setPageMode("default");
    setStatusMsg(`Assessment submitted! Score: ${percentage}% (${correctCount}/25). Status: Completed.`);
  };

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
    
    // Load MCQ score if it exists in localStorage
    const mcqDataStr = localStorage.getItem(`pm_mcq_test_${draft.hrmsId}`);
    const mcqData = mcqDataStr ? JSON.parse(mcqDataStr) : null;
    const initialMcqMarks = mcqData && mcqData.completed ? String(mcqData.correctCount) : "0";

    setAssessForm({
      ...defaultAssessForm,
      knowledgeMarks: initialMcqMarks
    });
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
          <div className="sm2-chart-hdr" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
              <TrendingUp size={15}/>
              <h3>Monthly Assessment Trend</h3>
            </div>
            <button 
              onClick={() => { setFullscreenChart("monthly"); setFsStartDate(""); setFsEndDate(""); setFsCategory("All"); setFsRisk("All"); setFsSearch(""); }} 
              style={{
                background: "none", 
                border: "none", 
                color: "#2563eb", 
                fontSize: "11px", 
                fontWeight: "700", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "all 0.15s"
              }}
              className="sm2-fullscreen-btn"
            >
              <Maximize2 size={11}/> View Full Screen
            </button>
          </div>
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
          <div className="sm2-chart-hdr" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
              <Activity size={15}/>
              <h3>Safety Compliance Trend</h3>
            </div>
            <button 
              onClick={() => { setFullscreenChart("safety"); setFsStartDate(""); setFsEndDate(""); setFsCategory("All"); setFsRisk("All"); setFsSearch(""); }} 
              style={{
                background: "none", 
                border: "none", 
                color: "#2563eb", 
                fontSize: "11px", 
                fontWeight: "700", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "all 0.15s"
              }}
              className="sm2-fullscreen-btn"
            >
              <Maximize2 size={11}/> View Full Screen
            </button>
          </div>
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
          <div className="sm2-chart-hdr" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
              <BarChart3 size={15}/>
              <h3>Performance Distribution</h3>
            </div>
            <button 
              onClick={() => { setFullscreenChart("performance"); setFsStartDate(""); setFsEndDate(""); setFsCategory("All"); setFsRisk("All"); setFsSearch(""); }} 
              style={{
                background: "none", 
                border: "none", 
                color: "#2563eb", 
                fontSize: "11px", 
                fontWeight: "700", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "all 0.15s"
              }}
              className="sm2-fullscreen-btn"
            >
              <Maximize2 size={11}/> View Full Screen
            </button>
          </div>
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
      <div className="sm2-card-hdr" style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "20px" }}>
        <h2>My Profile</h2>
        <span className="sm2-pill-grey">View Only</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {/* 🔷 PERSONAL DETAILS SECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
            <UserCircle2 size={18} color="#0d2c4d" /> Personal Details
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Employee ID / HRMS ID
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                  {smId}
                </dd>
              </div>
              <Lock size={12} color="#94a3b8" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Date of Birth
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.dob}
                </dd>
              </div>
              <Lock size={12} color="#94a3b8" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Date of Appointment
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.dateOfAppointment}
                </dd>
              </div>
              <Lock size={12} color="#94a3b8" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Reporting Officer
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.reportingOfficer}
                </dd>
              </div>
              <Lock size={12} color="#94a3b8" />
            </div>
          </div>
        </div>

        {/* 🔷 OPERATIONAL & SAFETY DATES / ADD SECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>
            <ShieldCheck size={18} color="#16a34a" /> Operational & Safety Records
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px" }}>
                <dt style={{ fontSize: "9px", fontWeight: "800", color: "#166534", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  PME Done Date
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "700", color: "#14532d" }}>
                  {smProfile.pmeDoneDate}
                </dd>
              </div>
              
              <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px" }}>
                <dt style={{ fontSize: "9px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  PME Due Date
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "700", color: "#7f1d1d" }}>
                  {smProfile.pmeDueDate}
                </dd>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Isolator Certificate Issued Date
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.isolatorCertificateIssuedDate}
                </dd>
              </div>
              <Award size={14} color="#7c3aed" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Automatic Training Date
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.automaticTrainingDate}
                </dd>
              </div>
              <CalendarCheck2 size={14} color="#2563eb" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <div>
                <dt style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Counselling Date
                </dt>
                <dd style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                  {smProfile.counsellingDate}
                </dd>
              </div>
              <ClipboardCheck size={14} color="#d97706" />
            </div>
          </div>
        </div>
      </div>
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
          <div className="sm2-table-head sm2-table-row-8">
            {["Name","HRMS ID","Grade","Last Score","Last Assessed","Approval","Risk","Action"].map(h =>
              <span key={h}>{h}</span>)}
          </div>
          {filteredPm.length === 0 && <p className="sm2-empty">No staff match the current filters.</p>}
          {filteredPm.map(p => {
            const cat = getCat(p.lastScore);
            const risk = riskLevel(p);
            return (
              <div key={p.id} className="sm2-table-row-8 sm2-table-row-btn" onClick={() => openPmDetail(p)}>
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
                <span>
                  <button className="sm2-monitor-btn" onClick={(e) => {
                    e.stopPropagation();
                    openPmDetail(p);
                  }}>
                    Monitor
                  </button>
                </span>
              </div>
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

        {/* Monitoring Status */}
        <div style={{
          marginTop: "20px",
          marginBottom: "20px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)"
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
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
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

        {/* 📈 PERFORMANCE TREND & SAFETY COMPETENCY breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginTop: "20px" }}>
          
          {/* Performance Improvement Trend Chart */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)"
          }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={16} color="#2563eb" /> Performance Improvement Trend
            </h4>
            {hist.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "13px" }}>No history to plot trend.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[...hist].reverse().map((h, i) => ({ attempt: `Eval ${i+1}`, score: h.total, date: h.date }))} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="attempt" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            <div style={{ marginTop: "12px", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
              💡 The timeline shows overall competence score growth over review periods. Target compliance rate is <strong>60% minimum</strong>.
            </div>
          </div>

          {/* Correct / Wrong Answers Audit */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.02)"
          }}>
            <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={16} color="#16a34a" /> Safety Competency Audit Breakdown
            </h4>
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
              {[
                { q: "Speed limit permitted over loop lines?", ans: "30 km/h", key: 1 },
                { q: "Signal below stop signal to admit train into occupied lines?", ans: "Calling-on signal", key: 2 },
                { q: "Maximum speed limit during shunting operations?", ans: "15 km/h", key: 3 },
                { q: "Vigilance action upon noticing hot axle on train?", ans: "Display Danger Hand Signal", key: 4 },
                { q: "Detonator count required for emergency protection?", ans: "3 Detonators", key: 5 },
                { q: "Frequency of mandatory refresher training?", ans: "Every 3 years", key: 6 },
                { q: "Who delivers key/token to loco pilots?", ans: "Authorized Pointsman", key: 7 },
                { q: "Shunting indicator signal light type?", ans: "Position Light Type", key: 8 }
              ].map((item, index) => {
                const isCorrect = pm.lastScore >= (index + 1) * 11;
                return (
                  <div key={item.key} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isCorrect ? "#f0fdf4" : "#fef2f2",
                    border: isCorrect ? "1px solid #dcfce7" : "1px solid #fee2e2"
                  }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: isCorrect ? "#16a34a" : "#dc2626",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "bold",
                      marginTop: "1px",
                      flexShrink: 0
                    }}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.q}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: isCorrect ? "#16a34a" : "#dc2626", fontWeight: "500" }}>
                        {isCorrect ? `Correct Answer: ${item.ans}` : `Incorrect (Selected wrong threshold)`}
                      </p>
                    </div>
                  </div>
                );
              })}
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
      const mcqDataStr = localStorage.getItem(`pm_mcq_test_${assessTarget.hrmsId}`);
      const mcqData = mcqDataStr ? JSON.parse(mcqDataStr) : null;
      const isMcqCompleted = mcqData && mcqData.completed;

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
                <span className="sm2-assess-sec-meta">Auto-calculated from Pointsman MCQ Test</span>
              </div>
              <span className="sm2-assess-live-marks">{knowledge} / 25</span>
            </div>
            
            <div className="sm2-mcq-card-container" style={{marginTop: 16}}>
              {isMcqCompleted ? (
                <div className="sm2-mcq-success-card">
                  <div className="sm2-mcq-card-header">
                    <div className="sm2-mcq-status">
                      <span className="sm2-status-dot green"></span>
                      <span className="sm2-status-text text-green font-semibold">MCQ Test Completed</span>
                    </div>
                    <div className="sm2-mcq-lock-badge">
                      <Lock size={12} />
                      <span>Read-Only (Synced)</span>
                    </div>
                  </div>
                  
                  <div className="sm2-mcq-card-body">
                    <div className="sm2-mcq-score-display">
                      <div className="sm2-mcq-large-score">
                        <strong>{mcqData.correctCount}</strong>
                        <span>/ 25</span>
                      </div>
                      <div className="sm2-mcq-percentage-badge">
                        {mcqData.percentage}% Score
                      </div>
                    </div>
                    
                    <div className="sm2-mcq-progress-container">
                      <div className="sm2-mcq-progress-bar">
                        <div 
                          className="sm2-mcq-progress-fill" 
                          style={{ 
                            width: `${mcqData.percentage}%`,
                            background: mcqData.percentage >= 80 ? "#16a34a" : mcqData.percentage >= 50 ? "#2563eb" : "#dc2626"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="sm2-mcq-meta-grid">
                      <div className="sm2-mcq-meta-item">
                        <span className="sm2-mcq-meta-label">Submitted On</span>
                        <strong className="sm2-mcq-meta-val">{mcqData.submittedDate}</strong>
                      </div>
                      <div className="sm2-mcq-meta-item">
                        <span className="sm2-mcq-meta-label">Assessed Entity</span>
                        <strong className="sm2-mcq-meta-val">{assessTarget.name}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sm2-mcq-pending-card">
                  <div className="sm2-mcq-card-header">
                    <div className="sm2-mcq-status">
                      <span className="sm2-status-dot amber"></span>
                      <span className="sm2-status-text text-amber font-semibold">MCQ Test Pending</span>
                    </div>
                    <div className="sm2-mcq-lock-badge">
                      <Lock size={12} />
                      <span>Read-Only</span>
                    </div>
                  </div>
                  
                  <div className="sm2-mcq-card-body pending">
                    <div className="sm2-mcq-pending-message">
                      <AlertTriangle size={24} color="#d97706" style={{marginTop: 2}} />
                      <div>
                        <h4 style={{margin:"0 0 4px", fontSize:14, color:"#b45309"}}>Action Required</h4>
                        <p style={{margin:0, fontSize:12.5, lineHeight:1.5, color:"#d97706"}}>The Pointsman (<strong>{assessTarget.name}</strong>) has not yet completed their online MCQ exam from their portal. Please request them to log in and attempt the test to sync their scores automatically.</p>
                      </div>
                    </div>
                    
                    <div className="sm2-mcq-meta-grid">
                      <div className="sm2-mcq-meta-item">
                        <span className="sm2-mcq-meta-label">Assessment Status</span>
                        <strong className="sm2-mcq-meta-val text-amber">Pending Pointsman Action</strong>
                      </div>
                      <div className="sm2-mcq-meta-item">
                        <span className="sm2-mcq-meta-label">Assessed Entity</span>
                        <strong className="sm2-mcq-meta-val">{assessTarget.name}</strong>
                      </div>
                      <div className="sm2-mcq-meta-item">
                        <span className="sm2-mcq-meta-label">Total Questions</span>
                        <strong className="sm2-mcq-meta-val">25 Questions (1 mark each)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          <p className="sm2-subtitle">Period: <strong style={{color:"#0f172a"}}>{formatQuarterPeriod(sc.period)}</strong> ({sc.period}) · Assessed by: {sc.assessedBy}</p>

          <div className="sm2-sc-hero">
            <div className="sm2-sc-circle" style={{borderColor: CAT_COLOR[cat]}}>
              <strong style={{color: CAT_COLOR[cat]}}>{sc.totalScore}</strong>
              <span>/{sc.isOnlineExam ? 25 : 100}</span>
            </div>
            <div>
              <span className="sm2-cat-badge-lg" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>
                {sc.isOnlineExam ? "Online Competency Exam" : `Category ${cat}`}
              </span>
              <p className="sm2-sc-period" title={sc.period}>{formatQuarterPeriod(sc.period)}</p>
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
          <div className="sm2-sc-sections" style={{display:"flex", flexDirection:"column", gap:10}}>
            {sc.sections.map(s => {
              const pct = Math.round((s.marks / s.outOf) * 100);
              return (
                <div key={s.title} className="sm2-sc-row" style={{background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0"}}>
                  <span className="sm2-sc-name" style={{color: "#1e293b", fontWeight: 700, width: 220}}>{s.title}</span>
                  <div className="sm2-sc-bar-wrap" style={{flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", margin: "0 16px"}}>
                    <div className="sm2-sc-bar-fill" style={{
                      width:`${pct}%`,
                      height: "100%",
                      background: pct >= 80 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 40 ? "#f59e0b" : "#ef4444"
                    }}/>
                  </div>
                  <span className="sm2-sc-marks" style={{color: "#334155", fontWeight: 700}}>{s.marks}/{s.outOf}</span>
                </div>
              );
            })}
          </div>

          <div className="sm2-ti-remarks">
            <div className="sm2-ti-rmk-hdr"><Award size={15} color="#7c3aed"/> <strong>TI Remarks</strong></div>
            <p>"{sc.tiRemarks}"</p>
          </div>

          {/* 📋 Rule-Based MCQ Exam Review (25 Questions) */}
          <h4 style={{margin:"28px 0 16px",fontSize:15,color:"#0f172a",borderBottom:"1px solid #e2e8f0",paddingBottom:8}}>
            📋 Rule-Based MCQ Exam Review (25 Questions)
          </h4>
          <div className="sm2-mcq-review-list" style={{display:"flex",flexDirection:"column",gap:20}}>
            {smTestQuestions.map((q, idx) => {
              const selectedAns = sc.mcqResponses ? sc.mcqResponses[idx] : null;
              const isCorrect = selectedAns === q.answer;
              const isUnanswered = selectedAns === null || selectedAns === undefined;
              
              let statusText = "Correct";
              let badgeColor = "#16a34a";
              let badgeBg = "#dcfce7";
              let icon = "✓";
              
              if (isUnanswered) {
                statusText = "Skipped / Unanswered";
                badgeColor = "#d97706";
                badgeBg = "#fef3c7";
                icon = "⚠️";
              } else if (!isCorrect) {
                statusText = "Wrong";
                badgeColor = "#dc2626";
                badgeBg = "#fee2e2";
                icon = "✗";
              }

              return (
                <div key={q.id} style={{
                  border:"1px solid #e2e8f0",
                  borderRadius:12,
                  padding:20,
                  background:isUnanswered ? "#fffdf5" : isCorrect ? "#fcfdfc" : "#fffcfc",
                  boxShadow:"0 2px 4px rgba(0,0,0,0.02)"
                }}>
                  {/* Header info */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,marginBottom:14}}>
                    <span style={{
                      fontWeight:700,
                      background:"#e2e8f0",
                      padding:"3px 10px",
                      borderRadius:6,
                      fontSize:12.5,
                      color:"#334155"
                    }}>Q{q.id}</span>
                    <div style={{flex:1,fontWeight:600,color:"#0f172a",fontSize:14.5,lineHeight:1.4}}>{q.text}</div>
                    <span style={{
                      background:badgeBg,
                      color:badgeColor,
                      padding:"4px 12px",
                      borderRadius:12,
                      fontSize:12,
                      fontWeight:700,
                      display:"inline-flex",
                      alignItems:"center",
                      gap:4,
                      whiteSpace:"nowrap"
                    }}>{icon} {statusText}</span>
                  </div>

                  {/* Options List JEE Exam style */}
                  <div style={{display:"flex",flexDirection:"column",gap:8,margin:"16px 0"}}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAns === oIdx;
                      const isOptionCorrect = q.answer === oIdx;
                      
                      let optBg = "#ffffff";
                      let optBorder = "1.5px solid #e2e8f0";
                      let optColor = "#334155";
                      let badge = null;

                      if (isSelected) {
                        if (isOptionCorrect) {
                          optBg = "#dcfce7";
                          optBorder = "2px solid #22c55e";
                          optColor = "#14532d";
                          badge = (
                            <span style={{
                              marginLeft:"auto",
                              fontSize:10.5,
                              fontWeight:700,
                              background:"#22c55e",
                              color:"#ffffff",
                              padding:"2px 8px",
                              borderRadius:4
                            }}>YOUR ANSWER (CORRECT)</span>
                          );
                        } else {
                          optBg = "#fee2e2";
                          optBorder = "2px solid #ef4444";
                          optColor = "#7f1d1d";
                          badge = (
                            <span style={{
                              marginLeft:"auto",
                              fontSize:10.5,
                              fontWeight:700,
                              background:"#ef4444",
                              color:"#ffffff",
                              padding:"2px 8px",
                              borderRadius:4
                            }}>YOUR ANSWER (WRONG)</span>
                          );
                        }
                      } else if (isOptionCorrect) {
                        optBg = "#eff6ff";
                        optBorder = "2px dashed #3b82f6";
                        optColor = "#1e3a8a";
                        badge = (
                          <span style={{
                            marginLeft:"auto",
                            fontSize:10.5,
                            fontWeight:700,
                            background:"#3b82f6",
                            color:"#ffffff",
                            padding:"2px 8px",
                            borderRadius:4
                          }}>CORRECT OPTION</span>
                        );
                      }

                      return (
                        <div key={opt} style={{
                          display:"flex",
                          alignItems:"center",
                          gap:12,
                          padding:"12px 16px",
                          borderRadius:8,
                          background:optBg,
                          border:optBorder,
                          color:optColor,
                          fontSize:13.5,
                          fontWeight: (isSelected || isOptionCorrect) ? 600 : 500,
                          transition:"all 0.15s ease"
                        }}>
                          <span style={{
                            fontSize:13,
                            fontWeight:700,
                            width:20,
                            opacity:0.8
                          }}>{["A", "B", "C", "D"][oIdx]}</span>
                          <span>{opt}</span>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  <div style={{
                    fontSize:12.5,
                    color:"#475569",
                    marginTop:10,
                    display:"flex",
                    gap:8,
                    alignItems:"start",
                    background:"#f8fafc",
                    border:"1px solid #edf2f7",
                    padding:"10px 14px",
                    borderRadius:8
                  }}>
                    <span style={{color:"#2563eb",fontWeight:700}}>Explanation:</span>
                    <span style={{lineHeight:1.4}}>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    const testActive = testAssigned === "Assigned" && (!smMcqTest || !smMcqTest.completed);

    /* History list */
    return (
      <section className="sm2-card">
        {/* MCQ Assessment Assignment Banner */}
        {testActive ? (
          <div style={{
            background:"linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)",
            border:"1.5px solid #fed7aa",
            borderRadius:12,
            padding:20,
            marginBottom:24,
            boxShadow:"0 4px 6px -1px rgba(0,0,0,0.05)"
          }}>
            <div style={{display:"flex", gap:16, alignItems:"start"}}>
              <div style={{
                background:"#ffedd5",
                borderRadius:50,
                width:42,
                height:42,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                flexShrink:0
              }}>
                <ShieldCheck size={22} color="#ea580c"/>
              </div>
              <div style={{flex:1}}>
                <h3 style={{margin:"0 0 6px", fontSize:16, fontWeight:700, color:"#c2410c"}}>
                  ⚠️ Pending Competency Assessment
                </h3>
                <p style={{margin:"0 0 14px", fontSize:13, color:"#9a3412", lineHeight:1.4}}>
                  Your supervisor (Traffic Inspector) has scheduled a periodic safety &amp; competency assessment for you. You must complete the 25-question MCQ exam.
                </p>
                <button
                  onClick={startTestAttempt}
                  style={{
                    background:"#ea580c",
                    color:"#ffffff",
                    border:"none",
                    padding:"10px 20px",
                    borderRadius:8,
                    fontSize:13.5,
                    fontWeight:700,
                    cursor:"pointer",
                    boxShadow:"0 4px 6px rgba(234, 88, 12, 0.2)",
                    display:"flex",
                    alignItems:"center",
                    gap:8
                  }}
                >
                  Start 25 MCQ Online Assessment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background:"#f0fdf4",
            border:"1.5px solid #bbf7d0",
            borderRadius:12,
            padding:18,
            marginBottom:24,
            display:"flex",
            alignItems:"center",
            gap:14
          }}>
            <ShieldCheck size={24} color="#16a34a"/>
            <div style={{flex:1}}>
              <h3 style={{margin:"0 0 2px", fontSize:14.5, fontWeight:700, color:"#14532d"}}>
                All assessments are up to date. No pending test available.
              </h3>
              <p style={{margin:0, fontSize:12, color:"#166534"}}>
                Your periodic safety and competency evaluation is currently active and compliant.
              </p>
            </div>
            <div style={{display:"flex", gap:16, fontSize:12, textAlign:"right"}}>
              <div>
                <span style={{color:"#166534", display:"block"}}>Last Exam Score</span>
                <strong style={{color:"#14532d", fontSize:13}}>{smMcqTest ? `${smMcqTest.correctCount}/25 (${smMcqTest.percentage}%)` : `${history[0]?.sections.find(s=>s.title.includes("MCQ"))?.marks || 22}/25 (88%)`}</strong>
              </div>
              <div style={{borderLeft:"1px solid #bbf7d0", paddingLeft:16}}>
                <span style={{color:"#166534", display:"block"}}>Next Due Date</span>
                <strong style={{color:"#14532d", fontSize:13}}>25 Sep 2026</strong>
              </div>
            </div>
          </div>
        )}

        <div className="sm2-card-hdr"><h2>My Assessment History (by TI)</h2></div>
        <p className="sm2-subtitle">All assessments conducted by the Traffic Inspector for your station. Click any row to view the detailed scorecard.</p>

        {/* Summary strip */}
        <div className="sm2-myassess-summary">
          <div className="sm2-report-mini">
            <label>Total Assessments</label>
            <strong>{history.length}</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Latest Score</label>
            <strong>{history[0]?.totalScore}/{history[0]?.isOnlineExam ? 25 : 100}</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Average TI Score</label>
            <strong>{
              (() => {
                const regs = history.filter(h => !h.isOnlineExam);
                return regs.length ? `${Math.round(regs.reduce((s, a) => s + a.totalScore, 0) / regs.length)}/100` : "—";
              })()
            }</strong>
          </div>
          <div className="sm2-report-mini">
            <label>Latest Assessment</label>
            <strong style={{color: CAT_COLOR[history[0]?.category]}}>
              {history[0]?.isOnlineExam ? "Online CBT" : `Category ${history[0]?.category}`}
            </strong>
          </div>
        </div>

        {/* List */}
        <div className="sm2-myassess-list">
          <div className="sm2-myassess-head">
            {["Period","Date","Score Scale","Category","Assessed By","Status",""].map(h =>
              <span key={h}>{h}</span>)}
          </div>
          {history.map(sc => {
            const cat = sc.category;
            return (
              <button key={sc.id} className="sm2-myassess-row" onClick={() => setMyAssessSelected(sc)}>
                <span title={`Cycle: ${sc.period}\nDuration: ${formatQuarterPeriod(sc.period)}`}>
                  <strong>{formatQuarterPeriod(sc.period)}</strong>
                </span>
                <span>{sc.date}</span>
                <span><strong>{sc.totalScore}/{sc.isOnlineExam ? 25 : 100}</strong></span>
                <span>
                  <span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>
                    {sc.isOnlineExam ? "CBT Exam" : `Cat. ${cat}`}
                  </span>
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

  /* ─── ONLINE MCQ SAFETY & RULE EXAM ATTEMPT SCREEN ─── */
  const renderTakeTest = () => {
    const question = smTestQuestions[activeQIdx];
    const answeredCount = testResponses.filter(r => r !== null && r !== undefined).length;
    const completionRate = Math.round((answeredCount / 25) * 100);
    const unansweredCount = 25 - answeredCount;

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden"
      }}>
        {/* Header Bar: TCS iON Style */}
        <header style={{
          background: "#1e293b",
          color: "#ffffff",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          height: "70px",
          flexShrink: 0
        }}>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <ShieldCheck size={28} color="#f97316"/>
            <div>
              <h1 style={{fontSize: 18, fontWeight: 800, margin: 0, color: "#ffffff", letterSpacing: "0.5px"}}>
                STATION MASTER CBT COMPETENCY EVALUATION
              </h1>
              <p style={{margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 500}}>
                Official Online Railway Rules &amp; Operational Safety Examination (2026 Cycle)
              </p>
            </div>
          </div>
          
          <div style={{display: "flex", alignItems: "center", gap: 16}}>
            <div style={{
              background: "#334155",
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              color: "#cbd5e1",
              border: "1px solid #475569"
            }}>
              ⏳ TIME ELAPSED: <span style={{color: "#3b82f6"}}>Active Session</span>
            </div>
            
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to exit the exam? Your progress will not be saved.")) {
                  setPageMode("default");
                }
              }} 
              style={{
                padding: "8px 18px", 
                borderRadius: 8, 
                fontSize: 13, 
                background: "#ef4444", 
                color: "#ffffff", 
                border: "none", 
                fontWeight: 700, 
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
                transition: "all 0.2s ease"
              }}
            >
              Exit Exam
            </button>
          </div>
        </header>

        {/* Candidate & Progress Strip */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          borderBottom: "1.5px solid #e2e8f0",
          padding: "12px 24px",
          height: "50px",
          flexShrink: 0,
          fontSize: 13.5,
          color: "#334155"
        }}>
          <div>
            Candidate Name: <strong style={{color: "#1e3a8a"}}>{smName}</strong> &nbsp;|&nbsp; HRMS ID: <strong style={{color: "#1e3a8a"}}>{smId}</strong> &nbsp;|&nbsp; Station: <strong>Nagpur Junction (NGP)</strong>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <span style={{fontWeight: 600}}>Progress: <strong style={{color: "#2563eb"}}>{answeredCount} / 25 Answered</strong> ({completionRate}%)</span>
            <div style={{width: 140, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden"}}>
              <div style={{width: `${completionRate}%`, height: "100%", background: "#2563eb", borderRadius: 4}}/>
            </div>
          </div>
        </div>

        {/* Main Split Body */}
        <div style={{
          display: "grid", 
          gridTemplateColumns: "1fr 340px", 
          flex: 1, 
          overflow: "hidden"
        }}>
          
          {/* Left Column: Spacious Question Pane */}
          <div style={{
            padding: "32px 40px", 
            display: "flex", 
            flexDirection: "column", 
            background: "#f8fafc",
            overflowY: "auto",
            height: "100%"
          }}>
            
            {/* Immersive Question Card */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 36,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginBottom: 24
            }}>
              <div>
                <span style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#2563eb",
                  background: "#dbeafe",
                  padding: "6px 14px",
                  borderRadius: 20,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px"
                }}>
                  Question {activeQIdx + 1} of 25
                </span>
                
                <h2 style={{
                  fontSize: 22, 
                  fontWeight: 700, 
                  color: "#0f172a", 
                  marginTop: 24, 
                  marginBottom: 28, 
                  lineHeight: 1.5
                }}>
                  {question.text}
                </h2>

                <div style={{display: "flex", flexDirection: "column", gap: 14}}>
                  {question.options.map((opt, oi) => {
                    const isSelected = testResponses[activeQIdx] === oi;
                    return (
                      <label key={oi} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "18px 24px",
                        border: isSelected ? "2.5px solid #2563eb" : "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        background: isSelected ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                        boxShadow: isSelected ? "0 4px 6px rgba(37, 99, 235, 0.08)" : "none",
                        transition: "all 0.15s ease"
                      }} className="sm-option-hover">
                        <input
                          type="radio"
                          name={`sm-q-${question.id}`}
                          checked={isSelected}
                          onChange={() => {
                            const updated = [...testResponses];
                            updated[activeQIdx] = oi;
                            setTestResponses(updated);
                          }}
                          style={{width: 20, height: 20, accentColor: "#2563eb"}}
                        />
                        <span style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: isSelected ? "#1e40af" : "#64748b",
                          width: 24
                        }}>{["A", "B", "C", "D"][oi]}</span>
                        <span style={{
                          fontSize: 15, 
                          color: "#1e293b", 
                          fontWeight: isSelected ? 700 : 500
                        }}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Immersive Control Footer Bar */}
            <div style={{
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "16px 24px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}>
              <button
                disabled={activeQIdx === 0}
                onClick={() => setActiveQIdx(p => Math.max(0, p - 1))}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  background: activeQIdx === 0 ? "#f1f5f9" : "#ffffff",
                  color: activeQIdx === 0 ? "#94a3b8" : "#334155",
                  border: "1.5px solid #cbd5e1",
                  cursor: activeQIdx === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                ← Previous Question
              </button>

              <div style={{fontSize: 14, color: "#64748b"}}>
                {unansweredCount > 0 ? (
                  <span style={{color: "#d97706", fontWeight: 800, display: "flex", alignItems: "center", gap: 6}}>
                    ⚠️ {unansweredCount} question{unansweredCount > 1 ? "s" : ""} remaining to unlock submission
                  </span>
                ) : (
                  <span style={{color: "#16a34a", fontWeight: 800, display: "flex", alignItems: "center", gap: 6}}>
                    ✓ All 25 questions attempted! You can now submit.
                  </span>
                )}
              </div>

              <button
                disabled={activeQIdx === 24}
                onClick={() => setActiveQIdx(p => Math.min(24, p + 1))}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  background: activeQIdx === 24 ? "#f1f5f9" : "#ffffff",
                  color: activeQIdx === 24 ? "#94a3b8" : "#334155",
                  border: "1.5px solid #cbd5e1",
                  cursor: activeQIdx === 24 ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                Next Question →
              </button>
            </div>
          </div>

          {/* Right Column: Navigator Sidebar */}
          <div style={{
            background: "#ffffff",
            borderLeft: "1.5px solid #e2e8f0",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
            height: "100%"
          }}>
            <div style={{textAlign: "center", paddingBottom: 16, borderBottom: "1.5px solid #f1f5f9"}}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#dbeafe",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                margin: "0 auto 10px"
              }}>
                {smName.charAt(0)}
              </div>
              <h3 style={{fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0}}>{smName}</h3>
              <span style={{fontSize: 12, color: "#64748b", fontWeight: 500}}>HRMS ID: {smId}</span>
            </div>

            <h4 style={{
              fontSize: 12, 
              fontWeight: 800, 
              color: "#475569", 
              textTransform: "uppercase", 
              letterSpacing: "0.6px", 
              margin: 0
            }}>
              Question Palette
            </h4>

            {/* Grid of questions */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
              maxHeight: 220,
              overflowY: "auto",
              paddingRight: 4
            }}>
              {smTestQuestions.map((q, idx) => {
                const isCurrent = idx === activeQIdx;
                const isAnswered = testResponses[idx] !== null && testResponses[idx] !== undefined;
                
                let btnBg = "#ffffff";
                let btnBorder = "1.5px solid #cbd5e1";
                let btnColor = "#475569";
                let fontWeight = "600";

                if (isCurrent) {
                  btnBg = "#dbeafe";
                  btnBorder = "2px solid #2563eb";
                  btnColor = "#1e40af";
                  fontWeight = "800";
                } else if (isAnswered) {
                  btnBg = "#dcfce7";
                  btnBorder = "1.5px solid #86efac";
                  btnColor = "#15803d";
                } else {
                  btnBg = "#fef3c7";
                  btnBorder = "1.5px solid #fde047";
                  btnColor = "#a16207";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQIdx(idx)}
                    style={{
                      height: 40,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: fontWeight,
                      background: btnBg,
                      border: btnBorder,
                      color: btnColor,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.1s ease"
                    }}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Legend section */}
            <div style={{
              borderTop: "1.5px solid #f1f5f9",
              paddingTop: 16,
              fontSize: 12,
              color: "#64748b",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <span style={{width: 16, height: 16, background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: 4}}/>
                <span style={{fontWeight: 500}}>Attempted</span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <span style={{width: 16, height: 16, background: "#fef3c7", border: "1.5px solid #fde047", borderRadius: 4}}/>
                <span style={{fontWeight: 600, color: "#a16207"}}>Unattempted</span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <span style={{width: 16, height: 16, background: "#dbeafe", border: "2px solid #2563eb", borderRadius: 4}}/>
                <span style={{fontWeight: 500}}>Current Focus</span>
              </div>
            </div>

            {/* Submission Section at Bottom */}
            <div style={{
              marginTop: "auto", 
              paddingTop: 20, 
              borderTop: "1.5px solid #f1f5f9"
            }}>
              <button
                disabled={unansweredCount > 0}
                onClick={handleSubmitTestAttempt}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 800,
                  background: unansweredCount > 0 ? "#cbd5e1" : "#16a34a",
                  color: unansweredCount > 0 ? "#94a3b8" : "#ffffff",
                  border: "none",
                  cursor: unansweredCount > 0 ? "not-allowed" : "pointer",
                  boxShadow: unansweredCount > 0 ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                Submit Examination
              </button>
              {unansweredCount > 0 && (
                <p style={{
                  fontSize: 11,
                  color: "#b45309",
                  margin: "8px 0 0",
                  textAlign: "center",
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  * All 25 questions must be answered first ({unansweredCount} remaining)
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

  const handleExportCSV = () => {
    const headers = ["Employee Name", "HRMS ID", "Score", "Grade", "Safety Score", "Risk Level", "Approval Status"];
    const csvRows = filteredReports.map(p => [
      `"${p.name || ""}"`,
      `"${p.hrmsId || ""}"`,
      `"${p.lastScore}/100"`,
      `"Cat. ${getCat(p.lastScore)}"`,
      `"${p.safetyScore}%"`,
      `"${riskLevel(p)}"`,
      `"${p.approvalStatus || ""}"`
    ]);
    const csvContent = [headers.join(","), ...csvRows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SM_Pointsmen_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── REPORTS ── */
  const renderReports = () => (
    <section className="sm2-card">
      <div className="sm2-card-hdr" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Reports</h2>
        <button
          onClick={handleExportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
            transition: "all 0.15s ease"
          }}
          className="sm-btn-hover"
        >
          <FileDown size={15} /> Export CSV
        </button>
      </div>

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
        <div className="sm2-report-head sm2-report-row-8">
          {["Name","HRMS ID","Score","Grade","Safety","Risk","Status","Action"].map(h => <span key={h}>{h}</span>)}
        </div>
        {filteredReports.map(p => {
          const cat = getCat(p.lastScore);
          const risk = riskLevel(p);
          return (
            <div key={p.id} className="sm2-report-row-8 sm2-report-row-btn" onClick={() => { openPmDetail(p); setActiveTab("pointsmen"); }}>
              <span><strong>{p.name}</strong></span>
              <span>{p.hrmsId}</span>
              <span>{p.lastScore}/100</span>
              <span><span className="sm2-badge" style={{background:CAT_BG[cat],color:CAT_COLOR[cat]}}>Cat. {cat}</span></span>
              <span>{p.safetyScore}%</span>
              <span><span className="sm2-badge" style={{background:RISK_BG[risk],color:RISK_COLOR[risk]}}>{risk}</span></span>
              <span><span className={`sm2-status-pill sm2-status-${p.approvalStatus.toLowerCase()}`}>{p.approvalStatus}</span></span>
              <span>
                <button className="sm2-monitor-btn" onClick={(e) => {
                  e.stopPropagation();
                  openPmDetail(p);
                  setActiveTab("pointsmen");
                }}>
                  Monitor
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );

  /* ─── Dispatcher ─── */
  const renderContent = () => {
    if (pageMode === "takeTest") return renderTakeTest();

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
          <div className="sm2-topbar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3v18" />
              <path d="M17 3v18" />
              <path d="M5 8h14" />
              <path d="M5 14h14" />
            </svg>
          </div>
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

        {/* ══════════════════════════════════════════
            FULLSCREEN ANALYTICS MODAL
        ══════════════════════════════════════════ */}
        {fullscreenChart && (
          <div className="sm2-fullscreen-modal">
            {/* ── Modal Header ── */}
            <div className="sm2-fullscreen-header">
              <div style={{ display: "flex", alignItems: 12, gap: 12 }}>
                <div className="sm2-fullscreen-icon-wrap">
                  {fullscreenChart === "monthly"     && <TrendingUp size={18} color="#93c5fd"/>}
                  {fullscreenChart === "safety"      && <Activity   size={18} color="#a78bfa"/>}
                  {fullscreenChart === "performance" && <BarChart3  size={18} color="#34d399"/>}
                </div>
                <div>
                  <h2>
                    {fullscreenChart === "monthly"     && "Monthly Assessment Trend — Deep Dive"}
                    {fullscreenChart === "safety"      && "Safety Compliance Trend — Deep Dive"}
                    {fullscreenChart === "performance" && "Performance Distribution — Deep Dive"}
                  </h2>
                  <p>
                    Indian Railway Evaluation System · Station Master Analytics
                  </p>
                </div>
              </div>
              <button className="sm2-fullscreen-close-btn" onClick={() => setFullscreenChart(null)}>
                ✕ Close
              </button>
            </div>

            {/* ── Filter Bar ── */}
            <div className="sm2-fullscreen-filter-bar">
              <span className="sm2-fs-filter-tag">FILTERS</span>
              <input
                type="text" placeholder="Search staff name / HRMS…"
                value={fsSearch} onChange={e => setFsSearch(e.target.value)}
                className="sm2-fs-input"
              />
              <input type="date" value={fsStartDate} onChange={e => setFsStartDate(e.target.value)} className="sm2-fs-input" />
              <span className="sm2-fs-label">to</span>
              <input type="date" value={fsEndDate} onChange={e => setFsEndDate(e.target.value)} className="sm2-fs-input" />
              <select value={fsCategory} onChange={e => setFsCategory(e.target.value)} className="sm2-fs-select">
                <option value="All">All Categories</option>
                <option value="A">Category A</option>
                <option value="B">Category B</option>
                <option value="C">Category C</option>
                <option value="D">Category D</option>
              </select>
              <select value={fsRisk} onChange={e => setFsRisk(e.target.value)} className="sm2-fs-select">
                <option value="All">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
              <button onClick={() => { setFsSearch(""); setFsStartDate(""); setFsEndDate(""); setFsCategory("All"); setFsRisk("All"); }} className="sm2-fs-reset-btn">
                Reset
              </button>
              <div className="sm2-fs-counter">
                Showing <strong>{filteredFsPointsmen.length}</strong> of {pointsmen.length} staff
              </div>
            </div>

            {/* ── Main Content ── */}
            <div className="sm2-fullscreen-content">

              {/* KPI Summary Row */}
              <div className="sm2-fs-kpi-row">
                {[
                  { label: "Avg Score", value: filteredFsPointsmen.length ? Math.round(filteredFsPointsmen.reduce((s,p)=>s+p.lastScore,0)/filteredFsPointsmen.length) + "%" : "—", color: "#60a5fa", glowColor: "rgba(96,165,250,0.15)" },
                  { label: "Avg Safety", value: filteredFsPointsmen.length ? Math.round(filteredFsPointsmen.reduce((s,p)=>s+p.safetyScore,0)/filteredFsPointsmen.length) + "%" : "—", color: "#a78bfa", glowColor: "rgba(167,139,250,0.15)" },
                  { label: "High Risk", value: filteredFsPointsmen.filter(p=>riskLevel(p)==="High").length, color: "#f87171", glowColor: "rgba(248,113,113,0.15)" },
                  { label: "Cat A Staff", value: filteredFsPointsmen.filter(p=>getCat(p.lastScore)==="A").length, color: "#34d399", glowColor: "rgba(52,211,153,0.15)" },
                  { label: "Fit (PME)", value: filteredFsPointsmen.filter(p=>p.pmeStatus==="Fit").length, color: "#fbbf24", glowColor: "rgba(251,191,36,0.15)" },
                ].map(k => (
                  <div key={k.label} className="sm2-fs-kpi-card" style={{ "--glow": k.glowColor }}>
                    <div className="sm2-fs-kpi-value" style={{ color: k.color }}>{k.value}</div>
                    <div className="sm2-fs-kpi-label">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Large Chart */}
              <div className="sm2-fs-chart-container">
                <h3>
                  {fullscreenChart === "monthly"     && "📈 Monthly Avg Score & Assessment Volume"}
                  {fullscreenChart === "safety"      && "🛡️ Monthly Safety Compliance Avg (%)"}
                  {fullscreenChart === "performance" && "🏅 Staff Category Distribution"}
                </h3>
                <div className="sm2-fs-chart-wrapper">
                  <ResponsiveContainer width="100%" height={320}>
                    {fullscreenChart === "monthly" ? (
                      <LineChart data={dynamicMonthlyTrend} margin={{top:10,right:30,left:-10,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)"/>
                        <XAxis dataKey="month" tick={{fontSize:12,fill:"#64748b"}} stroke="rgba(0,0,0,0.1)"/>
                        <YAxis tick={{fontSize:12,fill:"#64748b"}} stroke="rgba(0,0,0,0.1)"/>
                        <Tooltip contentStyle={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:8,color:"#0f172a",fontSize:12}}/>
                        <Legend wrapperStyle={{fontSize:12,color:"#4b5563"}}/>
                        <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#2563eb" strokeWidth={3} dot={{r:5,fill:"#2563eb"}} activeDot={{r:7}}/>
                        <Line type="monotone" dataKey="assessments" name="Assessments" stroke="#16a34a" strokeWidth={2.5} dot={{r:4,fill:"#16a34a"}} strokeDasharray="6 3"/>
                      </LineChart>
                    ) : fullscreenChart === "safety" ? (
                      <BarChart data={dynamicMonthlyTrend} margin={{top:10,right:30,left:-10,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)"/>
                        <XAxis dataKey="month" tick={{fontSize:12,fill:"#64748b"}} stroke="rgba(0,0,0,0.1)"/>
                        <YAxis domain={[0,100]} tick={{fontSize:12,fill:"#64748b"}} stroke="rgba(0,0,0,0.1)"/>
                        <Tooltip contentStyle={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:8,color:"#0f172a",fontSize:12}}/>
                        <Legend wrapperStyle={{fontSize:12,color:"#4b5563"}}/>
                        <Bar dataKey="safetyAvg" name="Safety Avg %" fill="#7c3aed" radius={[6,6,0,0]}/>
                        <Bar dataKey="avgScore"  name="Score Avg %"  fill="#2563eb" radius={[6,6,0,0]}/>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={(() => {
                            const counts = {A:0,B:0,C:0,D:0};
                            filteredFsPointsmen.forEach(p => { counts[getCat(p.lastScore)]++; });
                            return Object.entries(counts).filter(([,c])=>c>0).map(([cat,count])=>({name:`Cat. ${cat}`,value:count}));
                          })()}
                          cx="50%" cy="50%" innerRadius={90} outerRadius={140}
                          dataKey="value" paddingAngle={4}
                        >
                          {["#2563eb","#16a34a","#f59e0b","#dc2626"].map((c,i) => <Cell key={i} fill={c}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:8,color:"#0f172a",fontSize:12}}/>
                        <Legend wrapperStyle={{fontSize:13,color:"#4b5563"}} iconType="circle" iconSize={10}/>
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Low Performers Deep-Dive Table */}
              <div className="sm2-fs-low-perf-section">
                <h3>
                  <span style={{color:"#f87171",marginRight:6}}>⚠</span> Low Performing Staff — Direct Intervention Required
                </h3>
                <div className="sm2-fs-grid">
                  {[...filteredFsPointsmen]
                    .sort((a,b)=>a.lastScore-b.lastScore)
                    .slice(0,6)
                    .map(p => {
                      const cat  = getCat(p.lastScore);
                      const risk = riskLevel(p);
                      const rColor = risk==="High"?"#f87171":risk==="Medium"?"#fbbf24":"#34d399";
                      return (
                        <div key={p.id} className="sm2-fs-card" style={{ "--border-color": rColor }} onClick={() => {
                          setFullscreenChart(null);
                          openPmDetail(p);
                          setActiveTab("pointsmen");
                        }}>
                          <div className="sm2-fs-card-header">
                            <div>
                              <div className="sm2-fs-card-name">{p.name}</div>
                              <div className="sm2-fs-card-id">{p.hrmsId}</div>
                            </div>
                            <span className="sm2-fs-card-cat" style={{ background: CAT_BG[cat], color: CAT_COLOR[cat] }}>
                              Cat. {cat}
                            </span>
                          </div>
                          <div className="sm2-fs-card-meta-row">
                            <span className="sm2-fs-card-risk-badge" style={{
                              background: risk==="High"?"rgba(248,113,113,0.15)":risk==="Medium"?"rgba(251,191,36,0.15)":"rgba(52,211,153,0.15)",
                              color: rColor
                            }}>{risk} Risk</span>
                            <span className="sm2-fs-card-incident-lbl">{p.incidents} incident{p.incidents!==1?"s":""}</span>
                          </div>
                          <div className="sm2-fs-card-progress-item">
                            <div className="sm2-fs-card-progress-lbl">
                              <span>Score</span>
                              <span style={{color:p.lastScore<50?"#f87171":"#fbbf24"}}>{p.lastScore}/100</span>
                            </div>
                            <div className="sm2-fs-card-progress-track">
                              <div className="sm2-fs-card-progress-bar" style={{ width: `${p.lastScore}%`, background: p.lastScore<50?"#f87171":"#fbbf24" }}/>
                            </div>
                          </div>
                          <div className="sm2-fs-card-progress-item" style={{ marginTop: 10 }}>
                            <div className="sm2-fs-card-progress-lbl">
                              <span>Safety Score</span>
                              <span style={{color:p.safetyScore<60?"#f87171":"#a78bfa"}}>{p.safetyScore}%</span>
                            </div>
                            <div className="sm2-fs-card-progress-track">
                              <div className="sm2-fs-card-progress-bar" style={{ width: `${p.safetyScore}%`, background: p.safetyScore<60?"#f87171":"#a78bfa" }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {filteredFsPointsmen.length === 0 && (
                  <p style={{color:"#64748b",fontSize:13,gridColumn:"1/-1",textAlign:"center",padding:"24px 0"}}>No staff match the current filters.</p>
                )}
              </div>
            </div>

          </div>{/* end content */}
        </div>
      )}
    </div>
  );
}

export default StationMasterModule;
