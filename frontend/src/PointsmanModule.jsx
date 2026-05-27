import { useMemo, useState, useEffect } from "react";
import {
  Award,
  BarChart2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileBarChart2,
  Gauge,
  LogOut,
  PlayCircle,
  Search,
  Target,
  TrendingUp,
  UserCircle2,
  ArrowUpDown,
  ShieldCheck,
  Bell,
  ShieldAlert,
  Clock,
  Activity,
  FileText,
  AlertTriangle,
  Lock,
  RefreshCw,
  Paperclip,
  Trash2,
  Volume2,
  VolumeX,
  Plus
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

/* ─── Navigation ─── */
const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { key: "current", label: "Current Test", icon: ClipboardList },
  { key: "history", label: "Test History", icon: FileBarChart2 },
  { key: "profile", label: "Profile", icon: UserCircle2 }
];

/* ─── Static profile data with requested fields ─── */
const pointsmanProfile = {
  name: "Ravi Kumar",
  hrmsId: "PM_1001",
  stationName: "Nagpur Junction (NGP)",
  designation: "Pointsman Grade I",
  mobileNumber: "+91 98989 11223",
  pmeStatus: "FIT (Periodic Medical Exam) - Due: 2028-10-15",
  refStatus: "COMPLETED (Refresher Course) - Due: 2027-04-12",
  trainingStatus: "ACTIVE (Safety & Shunting Certified)",
  currentCategory: "A",
  department: "Operations",
  reportingOfficer: "S. Deshmukh (Station Master)",
  joiningDate: "2018-06-15"
};

/* ─── Helper: Score → Category ─── */
function getCategory(score) {
  if (score >= 80) return "A";
  if (score >= 50) return "B";
  if (score >= 26) return "C";
  return "D";
}

function getCategoryColor(cat) {
  return { A: "#16a34a", B: "#2563eb", C: "#d97706", D: "#dc2626" }[cat] || "#6b7280";
}

function getCategoryBg(cat) {
  return { A: "#dcfce7", B: "#dbeafe", C: "#fef3c7", D: "#fee2e2" }[cat] || "#f3f4f6";
}

/* ─── Seed history — ONE test type repeated ─── */
const TEST_NAME = "Pointsman Periodic Assessment";

// Helper to generate correct/incorrect response array for seeded history
function generateMockResponses(score) {
  const correctCount = Math.round((score / 100) * 25);
  const arr = Array(25).fill(null);
  const indices = Array.from({ length: 25 }, (_, i) => i);
  // shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const correctIndices = new Set(indices.slice(0, correctCount));
  for (let i = 0; i < 25; i++) {
    const q = testQuestions[i];
    if (correctIndices.has(i)) {
      arr[i] = q.answer; // correct
    } else {
      arr[i] = (q.answer + 1) % 4; // incorrect
    }
  }
  return arr;
}

/* ─── 25 MCQ questions ─── */
const rawQuestions = [
  { text: "A signal shows double yellow. The driver should:", options: ["Proceed at full speed", "Prepare to stop at next signal", "Stop immediately", "Sound horn continuously"], answer: 1 },
  { text: "When a track circuit fails, the pointsman must:", options: ["Ignore it and proceed", "Immediately inform the station master", "Wait for someone else to act", "Close the station"], answer: 1 },
  { text: "The safe distance to stand from a moving train is:", options: ["0.5 metres", "1 metre", "2 metres", "5 metres"], answer: 2 },
  { text: "A 'Line Clear' token must be:", options: ["Carried by the guard", "Exchanged only at block stations", "Kept at the engine", "Kept at the signal box"], answer: 1 },
  { text: "Points must be clipped and padlocked when:", options: ["A train is expected", "Maintenance is not needed", "No train is expected for 8 hours", "During night only"], answer: 0 },
  { text: "Which colour indicates a 'Stop' signal?", options: ["Green", "Yellow", "Red", "White"], answer: 2 },
  { text: "An emergency brake application mid-section requires:", options: ["Driver to restart immediately", "Informing the guard and station master", "Reversing to the last station", "Disconnecting the coupling"], answer: 1 },
  { text: "A detonator placed on the track signals the driver to:", options: ["Increase speed", "Stop and proceed cautiously", "Reverse immediately", "Ignore it"], answer: 1 },
  { text: "Fixed signals are distinguished from working signals by:", options: ["Being painted blue", "Having no moving parts", "Being placed lower", "Flashing continuously"], answer: 1 },
  { text: "The whistle code for 'Stop' is:", options: ["One long", "Two short", "Three short", "One short"], answer: 0 },
  { text: "When shunting, the speed limit in station limits is:", options: ["15 km/h", "25 km/h", "30 km/h", "50 km/h"], answer: 0 },
  { text: "A fouling mark indicates:", options: ["The limit of safe track clearance", "A defective rail", "Speed restriction end", "Gradient change"], answer: 0 },
  { text: "Who authorises working on a live track?", options: ["The nearest pointsman", "The gang mate", "The station master with permit", "Any senior staff"], answer: 2 },
  { text: "Verbal communication during train operations must be:", options: ["Quick and informal", "Clear, loud, and repeated back", "Whispered to avoid panic", "Written only"], answer: 1 },
  { text: "A Point Indicator showing 'Normal' means:", options: ["Points are in reverse position", "Points are in normal position", "Points are defective", "No train is expected"], answer: 1 },
  { text: "In fog, the frequency of detonator placement is:", options: ["Every 500 metres", "Every 1 km", "Every signal", "At engine only"], answer: 2 },
  { text: "When a train passes, the pointsman should:", options: ["Walk along the track", "Stand at least 2 m away and observe", "Record speed", "Signal with a flag immediately"], answer: 1 },
  { text: "A green hand signal during shunting means:", options: ["Stop", "Proceed", "Caution", "Reverse"], answer: 1 },
  { text: "Interlocking ensures that:", options: ["Signals and points cannot be in conflicting positions", "Only one train can enter the yard", "Points are locked at all times", "Signals always show green"], answer: 0 },
  { text: "A 'Caution Order' issued to a driver must be:", options: ["Signed and returned to station master", "Kept by the driver until destination", "Torn after reading", "Radioed to control"], answer: 0 },
  { text: "The correct way to hold a flag when giving an 'All Right' signal is:", options: ["Waving it rapidly overhead", "Held steadily by the side", "Stretched horizontally at arm's length", "Pointing at the engine"], answer: 2 },
  { text: "Trap points are used to:", options: ["Increase train speed", "Prevent unauthorized entry into main line", "Derail a runaway vehicle away from the main line", "Signal an emergency stop"], answer: 2 },
  { text: "The SWR (Station Working Rules) must be revised:", options: ["Every 5 years", "As and when changes occur", "Only by the GM", "Never once issued"], answer: 1 },
  { text: "Before restoring points to normal after engineering work, the pointsman must:", options: ["Inform the driver", "Check that the track is clear and inform station master", "Replace detonators", "Wait for green signal"], answer: 1 },
  { text: "If a signal cannot be lowered, the driver should be given:", options: ["A red flag and stopped", "A 'T/369' caution memo and proceed at 15 km/h", "Permission to proceed at full speed", "A verbal confirmation only"], answer: 1 }
];

const testQuestions = rawQuestions.map((q, i) => ({ id: i + 1, ...q }));

const initialHistory = [
  {
    id: 1,
    date: "2026-03-10",
    name: TEST_NAME,
    assessmentPeriod: "March 2026",
    totalScore: 84,
    sections: [
      { title: "Signal Rules", marks: 17, outOf: 20 },
      { title: "Track Handling", marks: 16, outOf: 20 },
      { title: "Communication", marks: 17, outOf: 20 },
      { title: "Safety Response", marks: 17, outOf: 20 },
      { title: "Operational Judgement", marks: 17, outOf: 20 }
    ],
    responses: generateMockResponses(84)
  },
  {
    id: 2,
    date: "2026-02-10",
    name: TEST_NAME,
    assessmentPeriod: "February 2026",
    totalScore: 76,
    sections: [
      { title: "Signal Rules", marks: 15, outOf: 20 },
      { title: "Track Handling", marks: 16, outOf: 20 },
      { title: "Communication", marks: 14, outOf: 20 },
      { title: "Safety Response", marks: 13, outOf: 20 },
      { title: "Operational Judgement", marks: 18, outOf: 20 }
    ],
    responses: generateMockResponses(76)
  },
  {
    id: 3,
    date: "2026-01-10",
    name: TEST_NAME,
    assessmentPeriod: "January 2026",
    totalScore: 88,
    sections: [
      { title: "Signal Rules", marks: 18, outOf: 20 },
      { title: "Track Handling", marks: 18, outOf: 20 },
      { title: "Communication", marks: 17, outOf: 20 },
      { title: "Safety Response", marks: 18, outOf: 20 },
      { title: "Operational Judgement", marks: 17, outOf: 20 }
    ],
    responses: generateMockResponses(88)
  },
  {
    id: 4,
    date: "2025-12-10",
    name: TEST_NAME,
    assessmentPeriod: "December 2025",
    totalScore: 68,
    sections: [
      { title: "Signal Rules", marks: 13, outOf: 20 },
      { title: "Track Handling", marks: 14, outOf: 20 },
      { title: "Communication", marks: 14, outOf: 20 },
      { title: "Safety Response", marks: 14, outOf: 20 },
      { title: "Operational Judgement", marks: 13, outOf: 20 }
    ],
    responses: generateMockResponses(68)
  },
  {
    id: 5,
    date: "2025-11-10",
    name: TEST_NAME,
    assessmentPeriod: "November 2025",
    totalScore: 72,
    sections: [
      { title: "Signal Rules", marks: 15, outOf: 20 },
      { title: "Track Handling", marks: 14, outOf: 20 },
      { title: "Communication", marks: 14, outOf: 20 },
      { title: "Safety Response", marks: 15, outOf: 20 },
      { title: "Operational Judgement", marks: 14, outOf: 20 }
    ],
    responses: generateMockResponses(72)
  }
];

/* ─── Single active test for the current month ─── */
const currentTestSeed = {
  id: "CT-APR-2026",
  name: TEST_NAME,
  period: "April 2026"
};

/* ─── Pie chart custom label ─── */
const PIE_COLORS = { A: "#16a34a", B: "#2563eb", C: "#d97706", D: "#dc2626" };

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: inner } = payload[0];
    return (
      <div className="pm-pie-tooltip" style={{ background: '#fff', border: '1px solid #dbe5f0', padding: '8px', borderRadius: '8px' }}>
        <strong>Category {name}</strong>
        <div>{value}% &nbsp;({inner.count} attempt{inner.count !== 1 ? "s" : ""})</div>
      </div>
    );
  }
  return null;
};

// Global Web Audio synth for Emergency sound
let audioCtx = null;
let alarmOsc = null;
let alarmGain = null;
let alarmInterval = null;

function startAlarmSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
    
    alarmOsc = audioCtx.createOscillator();
    alarmGain = audioCtx.createGain();
    
    alarmOsc.connect(alarmGain);
    alarmGain.connect(audioCtx.destination);
    
    alarmOsc.type = "sine";
    alarmOsc.frequency.setValueAtTime(500, audioCtx.currentTime);
    alarmGain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    alarmOsc.start();
    
    let state = true;
    alarmInterval = setInterval(() => {
      if (!audioCtx) return;
      // sweep frequency between 500Hz and 850Hz to sound like a warning klaxon
      alarmOsc.frequency.setValueAtTime(state ? 850 : 500, audioCtx.currentTime);
      alarmGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      state = !state;
    }, 450);
  } catch (err) {
    console.error("Audio Context initiation failed:", err);
  }
}

function stopAlarmSound() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  if (alarmOsc) {
    try { alarmOsc.stop(); } catch(e) {}
    alarmOsc = null;
  }
  if (audioCtx) {
    try { audioCtx.close(); } catch(e) {}
    audioCtx = null;
  }
}

/* ─── Main component ─── */
function PointsmanModule({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [screenMode, setScreenMode] = useState("default");
  const [history, setHistory] = useState(initialHistory);
  const [historyDateSearch, setHistoryDateSearch] = useState("");
  const [historySortOrder, setHistorySortOrder] = useState("date-desc");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentTest, setCurrentTest] = useState(currentTestSeed);
  const [activeTest, setActiveTest] = useState(null);
  const [responses, setResponses] = useState(Array(25).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [statusText, setStatusText] = useState("");

  /* ─── Extra State Additions ─── */
  // 1. MCQ Timer (30 minutes = 1800 seconds)
  const [assessmentTimeLeft, setAssessmentTimeLeft] = useState(1800);
  const [isAssessmentTimerRunning, setIsAssessmentTimerRunning] = useState(false);

  // 2. Secure Login Session Timer (15 minutes = 900 seconds)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(900);

  // 3. Real-Time Notifications
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "danger", message: "CRITICAL: PME Medical examination scheduled on 2026-06-10.", time: "10 mins ago", read: false },
    { id: 2, type: "warning", message: "Safety Directive: New speed restriction (15km/h) active at Siding Points 12B.", time: "2 hours ago", read: false },
    { id: 3, type: "info", message: "Circular Update: SWR (Station Working Rules) Amendment v4.2 published.", time: "1 day ago", read: true },
    { id: 4, type: "success", message: "Training status updated: Periodic Shunting Refresher completed.", time: "3 days ago", read: true }
  ]);

  // 4. Audit Activity Logs
  const [profileSubTab, setProfileSubTab] = useState("details"); // "details" | "audit"
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, timestamp: "2026-05-27 10:00:12", category: "Auth", action: "User session initialized (IP: 10.244.15.68)", user: "Ravi Kumar" },
    { id: 2, timestamp: "2026-05-27 10:01:45", category: "Profile", action: "PME & REF health profile retrieved", user: "Ravi Kumar" },
    { id: 3, timestamp: "2026-05-27 10:03:10", category: "System", action: "Audited dashboard integrity checklist successfully", user: "Ravi Kumar" }
  ]);

  // 5. Emergency Alert & Siren State
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("Obstruction on Track");
  const [emergencyLocation, setEmergencyLocation] = useState("Nagpur Yard Line 2");
  const [alarmMuted, setAlarmMuted] = useState(false);

  // 6. Safety Reports
  const [safetySubTab, setSafetySubTab] = useState("track"); // "track" | "incident" | "history"
  const [safetyReports, setSafetyReports] = useState([
    { id: 101, type: "Track Defect", defect: "Rail Joint Crack", location: "KM 104/2 Near Gate", severity: "High - Urgent Action", status: "RESOLVED", date: "2026-05-24", desc: "Visible hair crack on joint fishplate." },
    { id: 102, type: "Abnormal Incident", defect: "Hot Axle Exchanged Flag", location: "Line 1 Main", severity: "Medium - Investigating", status: "UNDER REPAIR", date: "2026-05-26", desc: "Detected sparks during all-right hand signal. Notified Station Master." }
  ]);

  // File Upload State Mock
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Form Fields: Track Issue
  const [trackLocation, setTrackLocation] = useState("");
  const [trackLine, setTrackLine] = useState("Line 1");
  const [trackDefect, setTrackDefect] = useState("Rail Fracture");
  const [trackSeverity, setTrackSeverity] = useState("High - Urgent Action");
  const [trackDesc, setTrackDesc] = useState("");

  // Form Fields: Abnormal Incident
  const [incidentType, setIncidentType] = useState("Hot Axle");
  const [incidentTrain, setIncidentTrain] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentAction, setIncidentAction] = useState("");

  const fullName = user?.name && user.name !== "Pointsman User" ? user.name : pointsmanProfile.name;
  const employeeId = user?.hrmsId || pointsmanProfile.hrmsId;

  // Track user notifications unread count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  /* ─── EFFECT: Secure Session CountDown ─── */
  useEffect(() => {
    const sessionTimer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(sessionTimer);
          stopAlarmSound();
          alert("Secure Session Timeout (15 mins reached). For safety, you are logged out of the Indian Railways Operations Panel.");
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(sessionTimer);
  }, [onLogout]);

  /* ─── EFFECT: Assessment MCQ Countdown Timer ─── */
  useEffect(() => {
    let timer = null;
    if (isAssessmentTimerRunning && assessmentTimeLeft > 0) {
      timer = setInterval(() => {
        setAssessmentTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsAssessmentTimerRunning(false);
            submitTest(true); // force auto-submit!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAssessmentTimerRunning, assessmentTimeLeft]);

  /* ─── Derived metrics ─── */
  const latestScore = history.length ? history[0].totalScore : null;
  const latestCategory = latestScore !== null ? getCategory(latestScore) : "—";
  const averageScore = history.length
    ? Math.round(history.reduce((s, i) => s + i.totalScore, 0) / history.length)
    : 0;
  const answeredCount = responses.filter(v => v !== null).length;
  const completionRate = Math.round((answeredCount / 25) * 100);

  /* ─── Dynamic Performance Summary ─── */
  const performanceSummaryText = useMemo(() => {
    if (!selectedRecord) return "";
    const { totalScore, sections } = selectedRecord;
    const lowestSec = [...sections].sort((a, b) => a.marks - b.marks)[0];
    const highestSec = [...sections].sort((a, b) => b.marks - a.marks)[0];

    let summary = `Assessment score achieved: ${totalScore}/100 (${totalScore >= 80 ? 'Outstanding Competency' : totalScore >= 50 ? 'Satisfactory Operations' : 'Requires Training'}). `;
    summary += `Demonstrated excellent competency in "${highestSec.title}" scoring ${highestSec.marks}/${highestSec.outOf} marks. `;
    if (lowestSec.marks < lowestSec.outOf) {
      summary += `However, low-scoring markers are observed in "${lowestSec.title}" (${lowestSec.marks}/${lowestSec.outOf}). It is highly recommended to study the Station Working Rules (SWR) for points locking/shunting and undergo periodic coaching.`;
    } else {
      summary += `Achieved flawless accuracy in all modules. Recommended to maintain this premium standard in daily track shunting.`;
    }
    return summary;
  }, [selectedRecord]);

  /* ─── Chart data ─── */
  const trendData = useMemo(() =>
    [...history].reverse().map(r => ({
      date: r.assessmentPeriod.slice(0, 7),
      score: r.totalScore
    })), [history]);

  const pieData = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    history.forEach(r => { counts[getCategory(r.totalScore)]++; });
    const total = history.length || 1;
    return Object.entries(counts)
      .filter(([, c]) => c > 0)
      .map(([cat, count]) => ({
        name: cat,
        value: Math.round((count / total) * 100),
        count
      }));
  }, [history]);

  /* ─── Filtered / sorted history ─── */
  const filteredHistory = useMemo(() => {
    let list = history.filter(item =>
      historyDateSearch.trim() === "" || item.date.includes(historyDateSearch.trim())
    );
    if (historySortOrder === "score-asc") list = [...list].sort((a, b) => a.totalScore - b.totalScore);
    else if (historySortOrder === "score-desc") list = [...list].sort((a, b) => b.totalScore - a.totalScore);
    else if (historySortOrder === "date-asc") list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    return list;
  }, [history, historyDateSearch, historySortOrder]);

  /* ─── Navigation ─── */
  const goToNavPage = (key) => {
    setActiveNav(key);
    setScreenMode("default");
    setStatusText("");
  };

  const openScorecard = (record) => {
    setSelectedRecord(record);
    setActiveNav("history");
    setScreenMode("scorecard");
  };

  const logActivity = (category, action) => {
    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: Date.now(),
      timestamp: time,
      category,
      action,
      user: fullName
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const triggerNotification = (type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  /* ─── Test Actions ─── */
  const startTest = () => {
    setActiveTest(currentTest);
    setResponses(Array(25).fill(null));
    setCurrentQuestion(0);
    setStatusText("");
    setAssessmentTimeLeft(1800);
    setIsAssessmentTimerRunning(true);
    setActiveNav("current");
    setScreenMode("attempt");
    logActivity("Assessment", "Periodic assessment test started. Timer initialized (30:00).");
  };

  const handleSelectOption = (idx) => {
    setResponses(prev => { const n = [...prev]; n[currentQuestion] = idx; return n; });
  };

  const evaluateTest = () => {
    let correct = 0;
    const sec = [0, 0, 0, 0, 0];
    responses.forEach((r, i) => {
      const si = Math.floor(i / 5);
      if (r === testQuestions[i].answer) { correct++; sec[si] += 4; }
    });
    const sections = [
      "Signal Rules", 
      "Track Handling", 
      "Communication", 
      "Safety Response", 
      "Operational Judgement"
    ].map((title, i) => ({ title, marks: sec[i], outOf: 20 }));
    return { totalScore: correct * 4, sections };
  };

  const submitTest = (isAutoSubmit = false) => {
    setIsAssessmentTimerRunning(false);
    const { totalScore, sections } = evaluateTest();
    const today = new Date().toISOString().slice(0, 10);
    const record = {
      id: Date.now(),
      date: today,
      name: TEST_NAME,
      assessmentPeriod: activeTest ? activeTest.period : "April 2026",
      totalScore,
      sections,
      responses: [...responses]
    };
    setHistory(prev => [record, ...prev]);
    setCurrentTest(null);
    setSelectedRecord(record);
    setActiveTest(null);
    setActiveNav("history");
    setScreenMode("scorecard");
    
    const label = isAutoSubmit ? "Auto-submitted (Time Expired)" : "Submitted Successfully";
    setStatusText(`Assessment evaluation completed! ${label}.`);
    logActivity("Assessment", `Submitted test with score ${totalScore}% (Cat. ${getCategory(totalScore)})`);
    triggerNotification("success", `Assessment complete! Score: ${totalScore}/100. Grade: Category ${getCategory(totalScore)}`);
  };

  /* ─── Secure Session Actions ─── */
  const refreshSession = () => {
    setSessionTimeLeft(900);
    logActivity("Auth", "User secure login session refreshed to 15:00.");
    triggerNotification("success", "Operations login session renewed safely.");
  };

  /* ─── File Attachment Handlers ─── */
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB"
      }));
      setAttachedFiles(prev => [...prev, ...files]);
      logActivity("Safety", `Attached safety evidence: ${files.map(x=>x.name).join(', ')}`);
    }
  };

  const removeAttachedFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  /* ─── Form Submission: Track Issue ─── */
  const submitTrackIssue = (e) => {
    e.preventDefault();
    if (!trackLocation.trim() || !trackDesc.trim()) {
      alert("Please fill in location and description details.");
      return;
    }
    const newReport = {
      id: Date.now(),
      type: "Track Defect",
      defect: trackDefect,
      location: `${trackLine} - KM ${trackLocation}`,
      severity: trackSeverity,
      status: "PENDING MASTER ACTION",
      date: new Date().toISOString().slice(0, 10),
      desc: trackDesc,
      attachments: [...attachedFiles]
    };
    setSafetyReports(prev => [newReport, ...prev]);
    
    logActivity("Safety", `Safety track defect reported: ${trackDefect} at KM ${trackLocation}`);
    triggerNotification("danger", `SAFETY REPORT SUBMITTED: Defect: ${trackDefect} | Loc: KM ${trackLocation}`);
    
    // Reset
    setTrackLocation("");
    setTrackDesc("");
    setAttachedFiles([]);
    setFileInputKey(Date.now());
    setSafetySubTab("history");
    setStatusText("Safety report logged. Forwarded to Station Master & P-Way inspector.");
  };

  /* ─── Form Submission: Incident ─── */
  const submitIncidentReport = (e) => {
    e.preventDefault();
    if (!incidentTrain.trim() || !incidentAction.trim()) {
      alert("Please enter Train Number and Actions taken.");
      return;
    }
    const newReport = {
      id: Date.now(),
      type: "Abnormal Incident",
      defect: incidentType,
      location: `Train ${incidentTrain} (${incidentTime || "Current"})`,
      severity: "High - Immediate Action",
      status: "STATION INVESTIGATION ACTIVE",
      date: new Date().toISOString().slice(0, 10),
      desc: incidentAction,
      attachments: [...attachedFiles]
    };
    setSafetyReports(prev => [newReport, ...prev]);
    
    logActivity("Safety", `Abnormal incident logged: ${incidentType} in Train ${incidentTrain}`);
    triggerNotification("warning", `INCIDENT ALERT: ${incidentType} detected on Train ${incidentTrain}.`);
    
    // Reset
    setIncidentTrain("");
    setIncidentAction("");
    setIncidentTime("");
    setAttachedFiles([]);
    setFileInputKey(Date.now());
    setSafetySubTab("history");
    setStatusText("Abnormal incident report logged and dispatched to Division Controller.");
  };

  /* ─── Emergency Broadcast Actions ─── */
  const openEmergencyDialog = () => {
    setEmergencyModalOpen(true);
  };

  const triggerEmergencyBroadcast = () => {
    setEmergencyModalOpen(false);
    setEmergencyActive(true);
    setAlarmMuted(false);
    startAlarmSound();
    
    logActivity("EMERGENCY", `CRITICAL: Pulse emergency alert triggered! Type: ${emergencyType} at ${emergencyLocation}`);
    triggerNotification("danger", `🚨 BROADCAST ACTIVE: ${emergencyType} at ${emergencyLocation}. Dispatching rescue!`);
    setStatusText("EMERGENCY BROADCAST TRANSMITTING SYSTEM-WIDE!");
  };

  const clearEmergencyState = () => {
    setEmergencyActive(false);
    stopAlarmSound();
    logActivity("EMERGENCY", "Emergency alert acknowledged and cleared.");
    triggerNotification("success", "Emergency alert deactivated. Operational line clear reinstated.");
    setStatusText("Emergency broadcast deactivated. Tracks returned to safe normal status.");
  };

  const toggleAlarmMute = () => {
    if (alarmMuted) {
      startAlarmSound();
      setAlarmMuted(false);
    } else {
      stopAlarmSound();
      setAlarmMuted(true);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    logActivity("System", "Notifications inbox marked read.");
  };

  /* ═══════════════════════════════════════
     RENDER: PROFILE & AUDIT
  ═══════════════════════════════════════ */
  /* ═══════════════════════════════════════
     RENDER: DASHBOARD
  ═══════════════════════════════════════ */
  const renderDashboardPage = () => (
    <div className="pm-dashboard-layout">
      {/* Summary cards */}
      <div className="pm-summary-cards">
        <article className="pm-sum-card">
          <div className="pm-sum-icon" style={{ background: "#eff6ff" }}>
            <Target size={20} color="#2563eb" />
          </div>
          <div>
            <label>Latest Score</label>
            <strong>{latestScore !== null ? `${latestScore}/100` : "—"}</strong>
          </div>
        </article>

        <article className="pm-sum-card">
          <div className="pm-sum-icon" style={{ background: "#f0fdf4" }}>
            <Gauge size={20} color="#16a34a" />
          </div>
          <div>
            <label>Average Score</label>
            <strong>{averageScore}/100</strong>
          </div>
        </article>

        <article className="pm-sum-card">
          <div className="pm-sum-icon" style={{ background: getCategoryBg(latestCategory) }}>
            <ShieldCheck size={20} color={getCategoryColor(latestCategory)} />
          </div>
          <div>
            <label>Current Category</label>
            <strong style={{ color: getCategoryColor(latestCategory) }}>
              {latestCategory !== "—" ? `Category ${latestCategory}` : "—"}
            </strong>
          </div>
        </article>

        <article className="pm-sum-card">
          <div className="pm-sum-icon" style={{ background: "#fdf4ff" }}>
            <Award size={20} color="#9333ea" />
          </div>
          <div>
            <label>Total Attempts</label>
            <strong>{history.length}</strong>
          </div>
        </article>
      </div>

      <div className="pm-charts-row">
        {/* Performance Trends Chart */}
        <div className="pm-chart-card">
          <div className="pm-chart-header">
            <TrendingUp size={16} />
            <h3>Assessment Performance Trend</h3>
          </div>
          {trendData.length < 2 ? (
            <p className="pm-empty-state">At least 2 attempts needed to show trend.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }}
                  formatter={(v) => [`${v}/100`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie Chart */}
        <div className="pm-chart-card">
          <div className="pm-chart-header">
            <BarChart2 size={16} />
            <h3>Category Grade Distribution</h3>
          </div>
          {pieData.length === 0 ? (
            <p className="pm-empty-state">No data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     RENDER: PROFILE
  ═══════════════════════════════════════ */
  const renderProfilePage = () => (
    <div className="pm-page-card">
      <div className="pm-chart-header" style={{ marginBottom: 20 }}>
        <UserCircle2 size={18} />
        <h3 style={{ fontSize: "16px", color: "#0f172a" }}>Personnel Operations File</h3>
        <span className="pm-badge-view-only" style={{ marginLeft: "auto" }}>View Only</span>
      </div>
      
      <dl className="pm-dl-grid" style={{ marginBottom: 24 }}>
        <div><dt>Full Name</dt><dd>{fullName}</dd></div>
        <div><dt>HRMS Employee ID</dt><dd>{employeeId}</dd></div>
        <div><dt>Designation</dt><dd>{pointsmanProfile.designation}</dd></div>
        <div><dt>Department</dt><dd>{pointsmanProfile.department}</dd></div>
        <div><dt>Station limits</dt><dd>{pointsmanProfile.stationName}</dd></div>
        <div><dt>Mobile Number</dt><dd>{pointsmanProfile.mobileNumber}</dd></div>
        <div><dt>Reporting Officer</dt><dd>{pointsmanProfile.reportingOfficer}</dd></div>
        <div><dt>Joining Date</dt><dd>{pointsmanProfile.joiningDate}</dd></div>
      </dl>

      <div className="pm-profile-rail-divider" style={{ margin: "20px 0" }}></div>
      
      <div className="pm-chart-header" style={{ marginBottom: 16, marginTop: 10 }}>
        <ShieldCheck size={18} color="#16a34a" />
        <h3 style={{ fontSize: "16px", color: "#0f172a" }}>Safety & Compliance Health Profile</h3>
      </div>
      <dl className="pm-dl-grid pm-dl-green" style={{ marginBottom: 24 }}>
        <div>
          <dt>PME Status (Periodic Medical)</dt>
          <dd className="pm-text-bold text-success" style={{ color: "#16a34a" }}>{pointsmanProfile.pmeStatus}</dd>
        </div>
        <div>
          <dt>REF Status (Refresher Training)</dt>
          <dd className="pm-text-bold text-success" style={{ color: "#16a34a" }}>{pointsmanProfile.refStatus}</dd>
        </div>
        <div>
          <dt>Training status</dt>
          <dd className="pm-text-bold text-success" style={{ color: "#16a34a" }}>{pointsmanProfile.trainingStatus}</dd>
        </div>
        <div>
          <dt>Current Category SUGGESTION</dt>
          <dd className="pm-text-bold text-primary" style={{ color: "#2563eb" }}>Category {latestCategory} (Verified)</dd>
        </div>
      </dl>

      <div className="pm-profile-actions" style={{ marginTop: 24 }}>
        <button className="pm-edit-disabled-btn" disabled title="Profile modifications require Station Master admin role" style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#94a3b8", cursor: "not-allowed" }}>
          Edit Profile Settings (Disabled - Read Only)
        </button>
        <p className="pm-disabled-note" style={{ margin: "8px 0 0", fontSize: "12px", color: "#64748b" }}>To update PME date or change Station limits, contact the DPO operations cell.</p>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════
     RENDER: TEST HISTORY
  ═══════════════════════════════════════ */
  const renderHistoryPage = () => (
    <section className="pm-page-card">
      <div className="pm-page-header">
        <h2>Periodic Evaluation Archive</h2>
      </div>
      <p className="pm-subtitle">Historical records of standard Pointsman competency trials.</p>

      <div className="pm-filters-row">
        <div className="pm-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Filter by date (YYYY-MM)"
            value={historyDateSearch}
            onChange={e => setHistoryDateSearch(e.target.value)}
          />
        </div>
        <div className="pm-sort-select-wrap">
          <ArrowUpDown size={14} />
          <select value={historySortOrder} onChange={e => setHistorySortOrder(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
      </div>

      <div className="pm-history-cards">
        {filteredHistory.length === 0 && (
          <p className="pm-empty-state">No records match your filter.</p>
        )}
        {filteredHistory.map((record, idx) => {
          const cat = getCategory(record.totalScore);
          return (
            <button key={record.id} className="pm-history-card-item" onClick={() => openScorecard(record)}>
              <div className="pm-hc-left">
                <span className="pm-attempt-number">Attempt #{filteredHistory.length - idx}</span>
                <span className="pm-hc-period">{record.assessmentPeriod}</span>
                <span className="pm-hc-date">{record.date}</span>
              </div>
              <div className="pm-hc-right">
                <div className="pm-hc-score">{record.totalScore}<span>/100</span></div>
                <span
                  className="pm-cat-badge"
                  style={{ background: getCategoryBg(cat), color: getCategoryColor(cat) }}
                >
                  Cat. {cat}
                </span>
              </div>
              <span className="pm-hc-arrow">View Scorecard & Review →</span>
            </button>
          );
        })}
      </div>
    </section>
  );

  /* ═══════════════════════════════════════
     RENDER: SCORECARD & QUESTION REVIEW
  ═══════════════════════════════════════ */
  const renderScorecardPage = () => {
    if (!selectedRecord) return (
      <section className="pm-page-card">
        <p className="pm-empty-state">Select a record from History to review.</p>
      </section>
    );

    const cat = getCategory(selectedRecord.totalScore);

    return (
      <section className="pm-page-card">
        <div className="pm-page-header">
          <h2>Detailed Evaluation Scorecard</h2>
          <button className="pm-link-btn" onClick={() => setScreenMode("default")}>← Return to History</button>
        </div>

        <div className="pm-scorecard-hero">
          <div className="pm-sc-score-circle" style={{ borderColor: getCategoryColor(cat) }}>
            <strong style={{ color: getCategoryColor(cat) }}>{selectedRecord.totalScore}</strong>
            <span>/100</span>
          </div>
          <div>
            <span className="pm-cat-badge-lg" style={{ background: getCategoryBg(cat), color: getCategoryColor(cat) }}>
              Final Category Suggestion: Category {cat}
            </span>
            <p className="pm-sc-period">{selectedRecord.assessmentPeriod} Trial</p>
            <p className="pm-sc-date">Attempt Completed: {selectedRecord.date}</p>
          </div>
        </div>

        {/* Dynamic Performance Summary */}
        <div className="pm-performance-summary-box">
          <h4>📊 Official Performance Evaluation Summary</h4>
          <p>{performanceSummaryText}</p>
        </div>

        <div className="pm-sc-sections">
          <h3 style={{ fontSize: "16px", color: "#0e2e4f", marginBottom: "14px" }}>Module Performance Details</h3>
          {selectedRecord.sections.map(s => {
            const spc = Math.round((s.marks / s.outOf) * 100);
            return (
              <div key={s.title} className="pm-sc-section-row">
                <span className="pm-sc-section-name">{s.title}</span>
                <div className="pm-sc-bar-wrap">
                  <div className="pm-sc-bar-fill"
                    style={{ width: `${spc}%`, background: getCategoryColor(getCategory(spc)) }} />
                </div>
                <span className="pm-sc-section-marks">{s.marks}/{s.outOf}</span>
              </div>
            );
          })}
        </div>

        {/* Complete MCQ Question Review Review */}
        <div className="pm-mcq-review-panel" style={{ marginTop: "24px" }}>
          <div className="pm-chart-header" style={{ marginBottom: "16px" }}>
            <Clock size={16} />
            <h3>Complete Assessment Question Review</h3>
          </div>
          <p className="pm-subtitle" style={{ marginTop: "-12px", marginBottom: "18px" }}>
            Below is the full evaluation breakdown of all 25 compulsory questions. Correct responses are highlighted in green; incorrect in red.
          </p>

          <div className="pm-review-questions-list">
            {testQuestions.map((q, qIndex) => {
              const selectedOpt = selectedRecord.responses ? selectedRecord.responses[qIndex] : null;
              const isCorrect = selectedOpt === q.answer;

              return (
                <div key={q.id} className={`pm-review-question-card ${isCorrect ? "correct-card" : "wrong-card"}`}>
                  <div className="pm-rq-header">
                    <span className="pm-rq-number">Question {q.id}</span>
                    {isCorrect ? (
                      <span className="pm-rq-badge success">Correct (+4 Marks)</span>
                    ) : (
                      <span className="pm-rq-badge danger">Incorrect (0 Marks)</span>
                    )}
                  </div>
                  <h4 className="pm-rq-text">{q.text}</h4>

                  <div className="pm-rq-options-grid">
                    {q.options.map((opt, oIdx) => {
                      const wasSelected = selectedOpt === oIdx;
                      const isOptCorrect = q.answer === oIdx;
                      
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
      </section>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: CURRENT TEST (SCHEDULED)
  ═══════════════════════════════════════ */
  const renderCurrentTestsPage = () => (
    <section className="pm-page-card">
      <div className="pm-page-header">
        <h2>Assigned Competency Trials</h2>
      </div>
      <p className="pm-subtitle">Mandatory periodically scheduled evaluation of SWR Rules and points shunting safety clearance.</p>

      <div className="pm-current-tests">
        {!currentTest ? (
          <div className="pm-no-test-banner">
            <CheckCircle2 size={40} color="#16a34a" />
            <h3>All caught up!</h3>
            <p>Your periodic evaluation for April 2026 is fully completed. Grade successfully filed to Station Supervisor records.</p>
          </div>
        ) : (
          <article className="pm-test-card-premium">
            <div className="pm-tc-header">
              <ClipboardList size={22} color="#2563eb" />
              <div>
                <h3>{currentTest.name}</h3>
                <p>Scheduled Period: <strong>{currentTest.period}</strong></p>
              </div>
            </div>
            <div className="pm-tc-meta-row">
              <span className="pm-mini-pill">📝 25 Compulsory Questions</span>
              <span className="pm-mini-pill">⏱ 30:00 Countdown Timer</span>
              <span className="pm-mini-pill">🎯 MCQ Single Key Option</span>
              <span className="pm-mini-pill">⚠️ Answering All Required to Submit</span>
            </div>
            <div className="pm-tc-sections-preview">
              {["Signal Rules", "Track Handling", "Communication", "Safety Response", "Operational Judgement"].map(s => (
                <span key={s} className="pm-tc-section-chip">{s}</span>
              ))}
            </div>
            <button className="pm-start-btn" onClick={startTest}>
              <PlayCircle size={18} /> Initialize Assessment Command
            </button>
          </article>
        )}
      </div>
    </section>
  );

  /* ═══════════════════════════════════════
     RENDER: TEST ATTEMPT (WITH TIMER)
  ═══════════════════════════════════════ */
  const renderAttemptPage = () => {
    if (!activeTest) return renderCurrentTestsPage();
    const question = testQuestions[currentQuestion];
    
    // Timer Warning classes
    const minutes = Math.floor(assessmentTimeLeft / 60);
    const seconds = assessmentTimeLeft % 60;
    const isTimerWarning = assessmentTimeLeft < 300; // less than 5 mins

    return (
      <section className="pm-page-card">
        <div className="pm-page-header">
          <h2>Standard Examination Trial</h2>
          <button className="pm-link-btn danger" onClick={() => {
            if (confirm("Are you sure you want to cancel the trial? No progress will be saved.")) {
              setIsAssessmentTimerRunning(false);
              setScreenMode("default");
              logActivity("Assessment", "Periodic assessment cancelled by user.");
            }
          }}>← Abort Trial</button>
        </div>

        {/* Top Timer Bar */}
        <div className={`pm-assessment-timer-bar ${isTimerWarning ? "timer-flashing-danger" : ""}`}>
          <div className="timer-label">
            <Clock size={16} />
            <span>EXAMINATION TIME REMAINING</span>
          </div>
          <div className="timer-clock">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="pm-attempt-meta" style={{ marginTop: "14px" }}>
          <strong>{activeTest.name} — {activeTest.period}</strong>
          <span>Question {currentQuestion + 1} of 25 &nbsp;|&nbsp; {answeredCount}/25 Completed</span>
        </div>

        {/* Progress bar */}
        <div className="pm-progress-container-expanded">
          <div className="pm-progress-track">
            <div className="pm-progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="pm-progress-ratio-label">{answeredCount}/25 Answered ({completionRate}%)</span>
        </div>

        {/* Question Panel */}
        <div className="pm-question-card">
          <p className="pm-q-number">COMPULSORY QUESTION {currentQuestion + 1}</p>
          <h3>{question.text}</h3>
          
          <div className="pm-options-list">
            {question.options.map((opt, oi) => {
              const checked = responses[currentQuestion] === oi;
              return (
                <label key={oi} className={`pm-option ${checked ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={checked}
                    onChange={() => handleSelectOption(oi)}
                  />
                  <span className="pm-opt-letter">{["A", "B", "C", "D"][oi]}</span>
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Question grid navigator */}
        <div className="pm-question-panel">
          {testQuestions.map((item, index) => {
            const isCurrent = index === currentQuestion;
            const isAnswered = responses[index] !== null;
            return (
              <button
                key={item.id}
                className={`pm-question-pill ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {item.id}
              </button>
            );
          })}
        </div>

        <div className="pm-attempt-actions">
          <button
            className="pm-secondary-btn"
            onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft size={15} /> Previous Question
          </button>
          
          <button
            className="pm-secondary-btn"
            onClick={() => setCurrentQuestion(p => Math.min(24, p + 1))}
            disabled={currentQuestion === 24}
          >
            Next Question <ChevronRight size={15} />
          </button>
        </div>

        {/* Submit Row */}
        <div className="pm-submit-row">
          <button 
            className="pm-primary-btn" 
            onClick={() => submitTest(false)}
            disabled={answeredCount < 25}
            title={answeredCount < 25 ? "Please select responses for all 25 questions to enable submit." : "Submit trial answers"}
          >
            Submit Assessment Trial
          </button>
          <p className="pm-submit-note">
            {25 - answeredCount > 0 ? (
              <span className="text-warning-bold">⚠️ Compulsory Requirement: {25 - answeredCount} unanswered questions remaining. Submit option disabled.</span>
            ) : (
              <span className="text-success-bold">✓ All 25 questions answered. Security clearance ready. Submit enabled.</span>
            )}
          </p>
        </div>
      </section>
    );
  };

  /* ═══════════════════════════════════════
     RENDER: SAFETY & EMERGENCY MODULE
  ═══════════════════════════════════════ */
  const renderSafetyPage = () => (
    <section className="pm-page-card">
      <div className="pm-page-header">
        <h2>Safety Broadcast & Incident Reports</h2>
        <button className="pm-emergency-trigger-btn animate-pulse" onClick={openEmergencyDialog}>
          🚨 TRIGGER SYSTEM EMERGENCY ALERT
        </button>
      </div>
      <p className="pm-subtitle font-semibold">Immediate access to railway safety logs, abnormal track defect forms, and division-wide broadcasts.</p>

      {/* Safety Sub-Tabs */}
      <div className="pm-subnav-tabs" style={{ marginBottom: "16px" }}>
        <button 
          className={`pm-subtab-btn ${safetySubTab === "track" ? "active" : ""}`}
          onClick={() => setSafetySubTab("track")}
        >
          <AlertTriangle size={16} /> Report Track Defect
        </button>
        <button 
          className={`pm-subtab-btn ${safetySubTab === "incident" ? "active" : ""}`}
          onClick={() => setSafetySubTab("incident")}
        >
          <FileText size={16} /> Log Abnormal Incident
        </button>
        <button 
          className={`pm-subtab-btn ${safetySubTab === "history" ? "active" : ""}`}
          onClick={() => setSafetySubTab("history")}
        >
          <ShieldCheck size={16} /> View Filed Safety Tickets ({safetyReports.length})
        </button>
      </div>

      {safetySubTab === "track" && (
        <form onSubmit={submitTrackIssue} className="pm-safety-form">
          <div className="pm-safety-form-grid">
            <div className="pm-form-field">
              <label>Siding / Station Line Location</label>
              <select value={trackLine} onChange={e => setTrackLine(e.target.value)}>
                <option value="Line 1 Main">Line 1 Main</option>
                <option value="Line 2 Loop">Line 2 Loop</option>
                <option value="Siding Line A">Siding Line A</option>
                <option value="Marshalling Yard Point 14">Marshalling Yard Point 14</option>
                <option value="Cross-over 11A">Cross-over 11A</option>
              </select>
            </div>
            <div className="pm-form-field">
              <label>KM Mark Location (e.g. 102/4)</label>
              <input 
                type="text" 
                placeholder="Enter KM Mark" 
                value={trackLocation} 
                onChange={e => setTrackLocation(e.target.value)} 
                required 
              />
            </div>
            <div className="pm-form-field">
              <label>Track Defect Class</label>
              <select value={trackDefect} onChange={e => setTrackDefect(e.target.value)}>
                <option value="Rail Fracture">Rail Joint Crack / Fracture</option>
                <option value="Points Jammed">Siding Point Jam / Failure</option>
                <option value="Track Obstruction">Obstruction on Siding (Fouling)</option>
                <option value="Ballast Washout">Ballast Washout / Sinkage</option>
                <option value="Vegetation Overgrowth">High Vegetation Blockage</option>
              </select>
            </div>
            <div className="pm-form-field">
              <label>Severity Category</label>
              <select value={trackSeverity} onChange={e => setTrackSeverity(e.target.value)}>
                <option value="High - Urgent Action">High - Urgent (Suspend Movements)</option>
                <option value="Medium - Caution Advised">Medium - Caution (15 km/h restriction)</option>
                <option value="Low - Monitor Area">Low - Watchful (Monitor daily)</option>
              </select>
            </div>
            <div className="pm-form-field pm-field-wide">
              <label>Defect Observations & Technical Details</label>
              <textarea 
                rows="4" 
                placeholder="Explain the visual findings, track alignment defects, or points feedback failures in detail..."
                value={trackDesc}
                onChange={e => setTrackDesc(e.target.value)}
                required
              />
            </div>
            
            {/* File Attachment Upload Mock */}
            <div className="pm-form-field pm-field-wide pm-upload-area">
              <label><Paperclip size={14} /> Upload Details (Photos, Track Reports, Audio Logs)</label>
              <div className="pm-file-selector-box">
                <input 
                  key={fileInputKey}
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  className="pm-hidden-file-input" 
                  id="safety-evidence-files" 
                />
                <label htmlFor="safety-evidence-files" className="pm-file-upload-label">
                  <Plus size={18} /> Click to Choose Files to Upload
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div className="pm-attached-files-list">
                  <h5>Evidence Files Queued ({attachedFiles.length}):</h5>
                  <ul>
                    {attachedFiles.map((file, fIdx) => (
                      <li key={fIdx}>
                        <span>📎 {file.name} ({file.size})</span>
                        <button type="button" onClick={() => removeAttachedFile(fIdx)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="pm-safety-submit-btn">
            Log Track defect safety ticket
          </button>
        </form>
      )}

      {safetySubTab === "incident" && (
        <form onSubmit={submitIncidentReport} className="pm-safety-form">
          <div className="pm-safety-form-grid">
            <div className="pm-form-field">
              <label>Abnormal incident Type</label>
              <select value={incidentType} onChange={e => setIncidentType(e.target.value)}>
                <option value="Hot Axle">Hot Axle / Sparks on Wheel</option>
                <option value="Flat Tyre">Flat Tyre / Heavy Impact Thuds</option>
                <option value="Brake Binding">Brake Binding (Heavy Smoke)</option>
                <option value="Hanging Parts">Hanging Coupling / Gear Parts</option>
                <option value="SPAD Incident">SPAD (Signal Passed at Danger)</option>
                <option value="Open Siding Gate">Unlocked Siding Gate during transit</option>
              </select>
            </div>
            <div className="pm-form-field">
              <label>Train Number & Name (e.g. 12289 Duronto)</label>
              <input 
                type="text" 
                placeholder="Enter Train Details" 
                value={incidentTrain} 
                onChange={e => setIncidentTrain(e.target.value)} 
                required 
              />
            </div>
            <div className="pm-form-field">
              <label>Time of Observation</label>
              <input 
                type="datetime-local" 
                value={incidentTime} 
                onChange={e => setIncidentTime(e.target.value)} 
              />
            </div>
            <div className="pm-form-field">
              <label>Immediate Safety Actions Taken</label>
              <input 
                type="text" 
                placeholder="e.g. Flagged Red, informed SM on Walkie-Talkie" 
                value={incidentAction} 
                onChange={e => setIncidentAction(e.target.value)} 
                required
              />
            </div>
            <div className="pm-form-field pm-field-wide">
              <label>Incident Details & Hand-Signal Remarks</label>
              <textarea 
                rows="4" 
                placeholder="Describe the train movement, shunting speeds, visual smoke, wheel fire, or hand signal exchanges..."
                value={trackDesc}
                onChange={e => setTrackDesc(e.target.value)}
              />
            </div>
            
            {/* File Upload Incident Details */}
            <div className="pm-form-field pm-field-wide pm-upload-area">
              <label><Paperclip size={14} /> Upload Incident Photos / Logs</label>
              <div className="pm-file-selector-box">
                <input 
                  key={fileInputKey}
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  className="pm-hidden-file-input" 
                  id="incident-evidence-files" 
                />
                <label htmlFor="incident-evidence-files" className="pm-file-upload-label">
                  <Plus size={18} /> Choose Evidence Logs
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div className="pm-attached-files-list">
                  <h5>Attached Evidence Logs ({attachedFiles.length}):</h5>
                  <ul>
                    {attachedFiles.map((file, fIdx) => (
                      <li key={fIdx}>
                        <span>📎 {file.name} ({file.size})</span>
                        <button type="button" onClick={() => removeAttachedFile(fIdx)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="pm-safety-submit-btn warning">
            File Critical Incident Report
          </button>
        </form>
      )}

      {safetySubTab === "history" && (
        <div className="pm-safety-records-list">
          <h3 style={{ fontSize: "16px", color: "#0e2e4f", marginBottom: "14px" }}>Submitted Safety Reports Ledger</h3>
          <div className="pm-safety-ledger-grid">
            {safetyReports.map(report => (
              <article key={report.id} className="pm-safety-ticket-card">
                <div className="pm-ticket-header">
                  <span className={`pm-ticket-type-badge ${report.type === "Track Defect" ? "defect" : "incident"}`}>
                    {report.type}
                  </span>
                  <span className="pm-ticket-date font-mono">{report.date}</span>
                </div>
                <h4>{report.defect}</h4>
                <div className="pm-ticket-details">
                  <div><strong>Loc:</strong> {report.location}</div>
                  <div><strong>Severity:</strong> <span className="text-danger-bold">{report.severity}</span></div>
                </div>
                <p className="pm-ticket-desc">{report.desc}</p>
                {report.attachments && report.attachments.length > 0 && (
                  <div className="pm-ticket-attachments">
                    <strong>Attachments ({report.attachments.length}):</strong>
                    <ul>
                      {report.attachments.map((at, idx) => <li key={idx} className="font-mono text-small">📎 {at.name} ({at.size})</li>)}
                    </ul>
                  </div>
                )}
                <div className="pm-ticket-footer">
                  <span>Ticket #{report.id}</span>
                  <span className={`pm-ticket-status ${report.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {report.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  /* ─── Content dispatcher ─── */
  const renderBodyContent = () => {
    if (screenMode === "scorecard") return renderScorecardPage();
    if (screenMode === "attempt") return renderAttemptPage();
    if (activeNav === "dashboard") return renderDashboardPage();
    if (activeNav === "profile") return renderProfilePage();
    if (activeNav === "history") return renderHistoryPage();
    if (activeNav === "safety") return renderSafetyPage();
    return renderCurrentTestsPage();
  };

  /* ═══════════════════════════════════════
     SHELL LAYOUT
  ═══════════════════════════════════════ */
  return (
    <div className={`pm-layout ${emergencyActive ? "emergency-glow-active" : ""}`}>
      
      {/* ── Flashing Emergency Alert Banner ── */}
      {emergencyActive && (
        <div className="pm-emergency-siren-banner">
          <div className="siren-message">
            <span className="siren-light animate-flash">🚨 ALERT</span>
            <strong>MANDATORY EMERGENCY BROADCAST ACTIVE: {emergencyType} detected at {emergencyLocation}! All train & siding movements are frozen immediately.</strong>
          </div>
          <div className="siren-controls">
            <button className="pm-siren-mute-btn" onClick={toggleAlarmMute}>
              {alarmMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              {alarmMuted ? "Unmute Alarm" : "Mute Sound"}
            </button>
            <button className="pm-siren-clear-btn" onClick={clearEmergencyState}>
              Clear & Safe Return
            </button>
          </div>
        </div>
      )}

      <header className="pm-topbar">
        <div className="pm-topbar-brand">
          <div className="pm-topbar-logo">IR</div>
          <div>
            <h1>Indian Railway Evaluation Command</h1>
            <p>Operations Workspace: Pointsman Module</p>
          </div>
        </div>



        <div className="pm-user-strip">
          {/* ── Real-Time Notifications Bell Dropdown ── */}
          <div className="pm-notification-bell-container">
            <button className="pm-bell-btn" onClick={() => setBellDropdownOpen(!bellDropdownOpen)}>
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="pm-bell-badge">{unreadNotificationsCount}</span>
              )}
            </button>

            {bellDropdownOpen && (
              <div className="pm-bell-dropdown">
                <div className="pm-bell-header">
                  <h4>Operations Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <button onClick={markAllNotificationsRead}>Mark read</button>
                  )}
                </div>
                <div className="pm-bell-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`pm-bell-item ${n.read ? 'read' : 'unread'} type-${n.type}`}>
                      <div className="pm-bell-item-dot"></div>
                      <div className="pm-bell-item-content">
                        <p>{n.message}</p>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="pm-bell-empty">No alerts received today.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pm-user-avatar">{fullName.charAt(0)}</div>
          <div>
            <strong>{fullName}</strong>
            <span>HRMS ID: {employeeId}</span>
          </div>
          <button className="pm-logout-btn" onClick={() => { stopAlarmSound(); onLogout(); }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="pm-content-shell">
        <aside className="pm-sidebar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.key && screenMode === "default";
            return (
              <button
                key={item.key}
                className={`pm-nav-item ${isActive ? "active" : ""}`}
                onClick={() => { goToNavPage(item.key); setBellDropdownOpen(false); }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          

        </aside>

        <main className="pm-main-panel">
          <div className="pm-main-header-band">
            <div>
              <p className="pm-hero-eyebrow">Nagpur Junction Operations</p>
              <h2 className="pm-main-title">
                {screenMode === "scorecard" ? "Detailed Evaluation scorecard"
                  : screenMode === "attempt" ? "Competency Examination Attempt"
                  : navItems.find(i => i.key === activeNav)?.label || "Workspace"}
              </h2>
            </div>
            <div className="pm-header-kpis">
              <div className="pm-hkpi">
                <Award size={14} />
                <span>{history.length} Assessments</span>
              </div>
              <div className="pm-hkpi">
                <Gauge size={14} />
                <span>Avg {averageScore}</span>
              </div>
              <div className="pm-hkpi" style={{ color: getCategoryColor(latestCategory) }}>
                <ShieldCheck size={14} />
                <span>Cat. {latestCategory}</span>
              </div>
            </div>
          </div>

          {statusText && (
            <div className="pm-status-banner">
              <CheckCircle2 size={15} /> {statusText}
            </div>
          )}

          {renderBodyContent()}
        </main>
      </div>

      {/* ── EMERGENCY BROADCAST SETUP MODAL ── */}
      {emergencyModalOpen && (
        <div className="pm-emergency-modal-overlay">
          <div className="pm-emergency-modal">
            <div className="modal-header">
              <h2>🚨 CONFIRM URGENT DIVISION-WIDE BROADCAST</h2>
              <button onClick={() => setEmergencyModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="danger-notice">
                WARNING: Triggering this broadcast sends an audio warning signal and locks shunting/movement panels on all active Station Master & Superintendent terminals! Use for genuine safety emergencies only.
              </p>
              <div className="modal-fields">
                <label>Emergency Category</label>
                <select value={emergencyType} onChange={e => setEmergencyType(e.target.value)}>
                  <option value="Obstruction on Track">Obstruction on Siding (Fouling Clearance)</option>
                  <option value="Derailment Danger">Visible Rail Crack / Splitting Point</option>
                  <option value="Signal Failure">Critical Signal Lock Failure</option>
                  <option value="Hot Axle Fire Spark">Hot Axle / Spark Smoke in Incoming train</option>
                  <option value="Other Danger">Other Major Track Danger</option>
                </select>
                
                <label>Vulnerable Location / Track</label>
                <input 
                  type="text" 
                  value={emergencyLocation} 
                  onChange={e => setEmergencyLocation(e.target.value)} 
                  placeholder="e.g. Line 2 Loop Siding, KM 102/4" 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setEmergencyModalOpen(false)}>Cancel</button>
              <button className="confirm-btn" onClick={triggerEmergencyBroadcast}>
                CONFIRM & BROADCAST ALARM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PointsmanModule;
