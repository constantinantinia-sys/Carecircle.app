```react
import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  ShieldAlert,
  Mic,
  MicOff,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Pill,
  FileText,
  Users,
  Calendar,
  Activity,
  Phone,
  Copy,
  Check,
  Sparkles,
  UserCheck,
  Lock,
  Edit3,
  Trash2,
  X,
  Stethoscope,
  ClipboardList,
  CreditCard,
  ChevronRight
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const CARE_RECIPIENT = {
  name: "Eleanor Vance",
  nickname: "Mom",
  age: 78,
  bloodType: "O+",
  allergies: ["Penicillin (Severe Rash)", "Sulfa Drugs"],
  primaryPhysician: {
    name: "Dr. Aris Thorne, MD",
    specialty: "Geriatrics & Internal Medicine",
    phone: "(916) 555-0194",
    clinic: "Mercy Senior Care Clinic"
  },
  emergencyContacts: [
    { name: "Constantin Vance", relation: "Son (Lead Coordinator)", phone: "(916) 555-0142" },
    { name: "Sarah Vance-Miller", relation: "Daughter", phone: "(916) 555-0188" }
  ]
};

const FAMILY_ROLES = [
  {
    id: "constantin",
    name: "Constantin",
    role: "Lead Coordinator",
    avatar: "CV",
    color: "bg-teal-600",
    canEdit: true,
    canManageVault: true,
    description: "Full administrative & medical vault permissions"
  },
  {
    id: "sarah",
    name: "Sarah",
    role: "Sibling Co-Lead",
    avatar: "SM",
    color: "bg-indigo-600",
    canEdit: true,
    canManageVault: true,
    description: "Can log updates, manage tasks, and edit medications"
  },
  {
    id: "elena",
    name: "Elena",
    role: "Home Aide",
    avatar: "ER",
    color: "bg-amber-600",
    canEdit: true,
    canManageVault: false,
    description: "Can log daily vitals/meds & update tasks (Vault Read-Only)"
  },
  {
    id: "uncle_bob",
    name: "Uncle Robert",
    role: "Extended Family",
    avatar: "RV",
    color: "bg-slate-600",
    canEdit: false,
    canManageVault: false,
    description: "View-only access to timeline highlights & status"
  }
];

const INITIAL_TIMELINE = [
  {
    id: "t1",
    category: "Vitals",
    content: "Morning vitals checked after breakfast: Blood pressure 122/78 mmHg, heart rate 68 bpm. Feeling energetic today.",
    author: "Elena (Home Aide)",
    timestamp: "Today, 8:45 AM",
    highlight: "BP: 122/78 • HR: 68"
  },
  {
    id: "t2",
    category: "Medication",
    content: "Administered morning Lisinopril 10mg and Vitamin D3 with a full glass of water.",
    author: "Elena (Home Aide)",
    timestamp: "Today, 8:30 AM",
    highlight: "Lisinopril 10mg"
  },
  {
    id: "t3",
    category: "Appointment",
    content: "Cardiology follow-up confirmed with Dr. Patel for next Tuesday at 10:30 AM. Fasting bloodwork not required.",
    author: "Constantin (Lead Coordinator)",
    timestamp: "Yesterday, 4:15 PM",
    highlight: "Tue 10:30 AM"
  },
  {
    id: "t4",
    category: "General",
    content: "Had a lovely 20-minute walk around the garden. Appetite was great at dinner—finished all her salmon and veggies.",
    author: "Sarah (Sibling Co-Lead)",
    timestamp: "Yesterday, 7:10 PM",
    highlight: null
  }
];

const INITIAL_TASKS = [
  {
    id: "task1",
    title: "Pick up Lisinopril 90-day refill at CVS",
    assignee: "Constantin",
    dueDate: "Friday, 5:00 PM",
    status: "Pending",
    priority: "High",
    source: "Manual"
  },
  {
    id: "task2",
    title: "Drive Mom to Cardiology Appointment",
    assignee: "Sarah",
    dueDate: "Next Tuesday, 9:45 AM",
    status: "In Progress",
    priority: "High",
    source: "Manual"
  },
  {
    id: "task3",
    title: "Restock low-sodium soups, berries & bottled water",
    assignee: "Elena",
    dueDate: "Tomorrow",
    status: "Need Backup",
    priority: "Medium",
    source: "Manual"
  },
  {
    id: "task4",
    title: "Organize weekly pill box for Sunday",
    assignee: "Elena",
    dueDate: "Completed",
    status: "Done",
    priority: "Normal",
    source: "Manual"
  }
];

const INITIAL_MEDICATIONS = [
  {
    id: "med1",
    name: "Lisinopril",
    dosage: "10 mg",
    schedule: "Once daily • Morning with food",
    purpose: "Blood Pressure",
    refillsLeft: 2,
    takenToday: true
  },
  {
    id: "med2",
    name: "Atorvastatin",
    dosage: "20 mg",
    schedule: "Once daily • Evening before bed",
    purpose: "Cholesterol",
    refillsLeft: 4,
    takenToday: false
  },
  {
    id: "med3",
    name: "Vitamin D3",
    dosage: "2000 IU",
    schedule: "Once daily • Morning",
    purpose: "Bone & Immune Support",
    refillsLeft: 5,
    takenToday: true
  }
];

const INITIAL_CARDS = [
  {
    id: "card1",
    title: "Medicare Part A & B",
    provider: "Centers for Medicare & Medicaid",
    memberId: "1EG4-TE5-MK72",
    groupNo: "N/A",
    notes: "Primary hospital & medical coverage"
  },
  {
    id: "card2",
    title: "Blue Shield Senior Supplemental",
    provider: "Blue Shield of California",
    memberId: "XEH904827193",
    groupNo: "GRP-88412",
    notes: "Rx Bin: 003858 • Copay $10 generic"
  }
];

const VOICE_PRESETS = [
  {
    label: "Log Meds + BP + CVS Refill",
    text: "Mom took her morning Lisinopril 10mg, BP was 124/80, and we need to refill her prescription at CVS by Friday."
  },
  {
    label: "Doctor Note + Grocery Pickup",
    text: "Spoke with Dr. Thorne's nurse—labs look great! Remind someone to pick up fresh berries and oat milk tomorrow."
  },
  {
    label: "Evening Update + Appointment",
    text: "Mom took her evening Atorvastatin 20mg and is resting comfortably. Schedule physical therapy appointment for Thursday."
  }
];

export default function App() {
  // Active Role & Navigation State
  const [activeRoleId, setActiveRoleId] = useState("constantin");
  const [activeTab, setActiveTab] = useState("timeline");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Core Data State
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [insuranceCards, setInsuranceCards] = useState(INITIAL_CARDS);

  // Voice-to-Action Logger State
  const [voiceInput, setVoiceInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  // Modals & Forms State
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Constantin");
  const [newTaskDue, setNewTaskDue] = useState("Tomorrow, 3:00 PM");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");

  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedSchedule, setNewMedSchedule] = useState("Once daily • Morning");
  const [newMedPurpose, setNewMedPurpose] = useState("");

  const [copiedId, setCopiedId] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState("All");

  const currentUser = FAMILY_ROLES.find((r) => r.id === activeRoleId) || FAMILY_ROLES[0];

  // Simulated Voice Recording Effect
  const toggleRecording = () => {
    if (!currentUser.canEdit) return;
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setVoiceInput("");
      // Simulate real-time transcription after 1.8s
      setTimeout(() => {
        const randomPreset = VOICE_PRESETS[Math.floor(Math.random() * VOICE_PRESETS.length)];
        setVoiceInput(randomPreset.text);
        setIsRecording(false);
      }, 1800);
    }
  };

  // Smart Voice/Text Parser -> Timeline + Auto-Task Generation
  const handleSmartLogSubmit = (e) => {
    e.preventDefault();
    if (!voiceInput.trim() || !currentUser.canEdit) return;

    const text = voiceInput.trim();
    const lower = text.toLowerCase();

    // 1. Detect Category & Extract Highlight
    let category = "General";
    let highlight = null;

    const bpMatch = text.match(/\b(\d{2,3}\/\d{2,3})\b/);
    if (bpMatch || lower.includes("bp") || lower.includes("blood pressure") || lower.includes("heart rate")) {
      category = "Vitals";
      highlight = bpMatch ? `BP: ${bpMatch[1]}` : "Vitals Logged";
    } else if (
      lower.includes("took") ||
      lower.includes("mg") ||
      lower.includes("lisinopril") ||
      lower.includes("atorvastatin") ||
      lower.includes("medication") ||
      lower.includes("pill")
    ) {
      category = "Medication";
      highlight = lower.includes("lisinopril")
        ? "Lisinopril 10mg"
        : lower.includes("atorvastatin")
        ? "Atorvastatin 20mg"
        : "Medication Taken";
    } else if (lower.includes("doctor") || lower.includes("dr.") || lower.includes("appointment") || lower.includes("nurse")) {
      category = "Appointment";
      highlight = "Care Update";
    }

    // Auto-check medication in Vault if mentioned
    if (lower.includes("lisinopril")) {
      setMedications((prev) =>
        prev.map((m) => (m.name.toLowerCase() === "lisinopril" ? { ...m, takenToday: true } : m))
      );
    }
    if (lower.includes("atorvastatin")) {
      setMedications((prev) =>
        prev.map((m) => (m.name.toLowerCase() === "atorvastatin" ? { ...m, takenToday: true } : m))
      );
    }

    // 2. Create Timeline Entry
    const newEntry = {
      id: `t-${Date.now()}`,
      category,
      content: text,
      author: `${currentUser.name} (${currentUser.role})`,
      timestamp: "Just now",
      highlight
    };
    setTimeline((prev) => [newEntry, ...prev]);

    // 3. Detect Actionable Task Keywords ("refill", "pick up", "appointment", "schedule", "remind")
    const actionKeywords = ["refill", "pick up", "pickup", "appointment", "schedule", "buy", "restock"];
    const triggeredKeyword = actionKeywords.find((kw) => lower.includes(kw));

    let createdTaskTitle = null;
    if (triggeredKeyword) {
      // Extract actionable clause after "and" or sentence containing keyword
      const sentences = text.split(/[.!]|(?:\band\b)/i);
      const actionClause =
        sentences.find((s) => actionKeywords.some((kw) => s.toLowerCase().includes(kw))) || text;

      const cleanedTask = actionClause
        .replace(/^(we need to|remind someone to|please|need to)\s+/i, "")
        .trim();
      createdTaskTitle = cleanedTask.charAt(0).toUpperCase() + cleanedTask.slice(1);

      const autoTask = {
        id: `task-${Date.now()}`,
        title: createdTaskTitle,
        assignee: currentUser.name,
        dueDate: lower.includes("friday")
          ? "Friday"
          : lower.includes("tomorrow")
          ? "Tomorrow"
          : lower.includes("thursday")
          ? "Thursday"
          : "Soon",
        status: "Pending",
        priority: "High",
        source: "AI Voice-to-Action"
      };
      setTasks((prev) => [autoTask, ...prev]);
    }

    setVoiceInput("");
    setAiFeedback({
      category,
      taskCreated: createdTaskTitle
    });

    setTimeout(() => {
      setAiFeedback(null);
    }, 5000);
  };

  // Task Management Handlers
  const updateTaskStatus = (taskId, newStatus) => {
    if (!currentUser.canEdit) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, dueDate: newStatus === "Done" ? "Completed" : t.dueDate }
          : t
      )
    );
  };

  const updateTaskAssignee = (taskId, newAssignee) => {
    if (!currentUser.canEdit) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t)));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentUser.canEdit) return;
    const task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: newTaskAssignee,
      dueDate: newTaskDue,
      status: "Pending",
      priority: newTaskPriority,
      source: "Manual"
    };
    setTasks((prev) => [task, ...prev]);
    setNewTaskTitle("");
    setShowAddTaskModal(false);
  };

  const deleteTask = (taskId) => {
    if (!currentUser.canEdit) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Medication & Vault Handlers
  const toggleMedicationTaken = (medId) => {
    if (!currentUser.canEdit) return;
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const nextState = !m.takenToday;
          if (nextState) {
            // Also log to timeline automatically
            setTimeline((tPrev) => [
              {
                id: `t-med-${Date.now()}`,
                category: "Medication",
                content: `Marked ${m.name} (${m.dosage}) as taken.`,
                author: `${currentUser.name} (${currentUser.role})`,
                timestamp: "Just now",
                highlight: `${m.name} ${m.dosage}`
              },
              ...tPrev
            ]);
          }
          return { ...m, takenToday: nextState };
        }
        return m;
      })
    );
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMedName.trim() || !currentUser.canManageVault) return;
    const med = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage.trim() || "Standard Dose",
      schedule: newMedSchedule,
      purpose: newMedPurpose.trim() || "Daily Care",
      refillsLeft: 3,
      takenToday: false
    };
    setMedications((prev) => [...prev, med]);
    setNewMedName("");
    setNewMedDosage("");
    setNewMedPurpose("");
    setShowAddMedModal(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Computed Stats
  const activeTaskCount = tasks.filter((t) => t.status !== "Done").length;
  const backupNeededCount = tasks.filter((t) => t.status === "Need Backup").length;
  const medsTakenCount = medications.filter((m) => m.takenToday).length;

  const filteredTimeline =
    timelineFilter === "All"
      ? timeline
      : timeline.filter((item) => item.category === timelineFilter);

  const getCategoryStyle = (category) => {
    switch (category) {
      case "Medication":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Vitals":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Appointment":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Progress":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Need Backup":
        return "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans pb-16">
      {/* TOP CARE CIRCLE HEADER */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Brand & Care Recipient Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      CareCircle Hub
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active Circle (4 Members)
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    {CARE_RECIPIENT.nickname} ({CARE_RECIPIENT.name}, {CARE_RECIPIENT.age})
                  </h1>
                </div>
              </div>

              {/* Mobile Emergency Button */}
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition"
              >
                <ShieldAlert className="w-4 h-4" />
                SOS Card
              </button>
            </div>

            {/* Emergency Quick-Info Button (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right text-xs text-slate-500">
                <div>Blood Type: <strong className="text-slate-800">{CARE_RECIPIENT.bloodType}</strong></div>
                <div className="text-rose-600 font-medium">Allergy: Penicillin</div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency Medical Card
              </button>
            </div>
          </div>

          {/* ROLE SWITCHER PILLS */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 mr-1 whitespace-nowrap flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Viewing as:
              </span>
              {FAMILY_ROLES.map((role) => {
                const isSelected = role.id === activeRoleId;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRoleId(role.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full ${role.color} text-white text-[10px] flex items-center justify-center font-bold`}
                    >
                      {role.avatar}
                    </span>
                    {role.name}
                    <span className="opacity-75 font-normal hidden sm:inline">({role.role})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Role Permission Indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {currentUser.canEdit ? (
                <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg font-medium border border-teal-100">
                  <UserCheck className="w-3.5 h-3.5" />
                  {currentUser.canManageVault ? "Full Coordinator Access" : "Caregiver Log & Task Access"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg font-medium border border-amber-200">
                  <Lock className="w-3.5 h-3.5" />
                  Read-Only Family View
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* ONE-TAP VOICE-TO-ACTION LOGGER */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  One-Tap Voice-to-Action Update
                </h2>
                <p className="text-xs text-slate-500">
                  Speak or type a quick update—AI automatically logs vitals, checks off meds, and creates family tasks.
                </p>
              </div>
            </div>

            {/* Sample Voice Presets for Instant Demo */}
            {currentUser.canEdit && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-400">Try sample:</span>
                {VOICE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVoiceInput(preset.text)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-medium transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentUser.canEdit ? (
            <form onSubmit={handleSmartLogSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 flex items-center">
                <button
                  type="button"
                  onClick={toggleRecording}
                  title="Simulate Voice Recording"
                  className={`absolute left-2.5 p-2 rounded-xl transition cursor-pointer ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse"
                      : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={isRecording ? "Listening... speak naturally about meds, vitals, or errands..." : voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                  disabled={isRecording}
                  placeholder='e.g., "Mom took morning Lisinopril 10mg, BP 124/80, refill prescription at CVS by Friday"'
                  className="w-full pl-13 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                disabled={!voiceInput.trim() || isRecording}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-stone-300 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Log & Parse
              </button>
            </form>
          ) : (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                You are viewing as <strong>{currentUser.name} ({currentUser.role})</strong>. Switch to Constantin, Sarah, or Elena above to post updates.
              </span>
            </div>
          )}

          {/* AI Parsing Confirmation Banner */}
          {aiFeedback && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Posted to <strong>Care Timeline ({aiFeedback.category})</strong>
                  {aiFeedback.taskCreated && (
                    <>
                      {" "}
                      & automatically added task: <strong>"{aiFeedback.taskCreated}"</strong>
                    </>
                  )}
                </span>
              </div>
              {aiFeedback.taskCreated && (
                <button
                  onClick={() => setActiveTab("tasks")}
                  className="text-emerald-800 underline font-semibold hover:text-emerald-950 cursor-pointer"
                >
                  View Task →
                </button>
              )}
            </div>
          )}
        </section>

        {/* QUICK STATUS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div
            onClick={() => setActiveTab("vault")}
            className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Medications</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {medsTakenCount} <span className="text-sm font-normal text-slate-500">/ {medications.length} taken</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("tasks")}
            className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Open Family Handoffs</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-2xl font-bold text-slate-900">{activeTaskCount}</p>
                {backupNeededCount > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {backupNeededCount} Need Backup
                  </span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("timeline")}
            className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Latest Blood Pressure</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                122/78 <span className="text-xs font-medium text-emerald-600">Normal</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "timeline"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            Live Care Timeline
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-stone-100 text-slate-600">
              {timeline.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "tasks"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Task Handoffs
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
              {activeTaskCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === "vault"
                ? "border-teal-700 text-teal-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Pill className="w-4 h-4" />
            Meds & Medical Vault
          </button>
        </div>

        {/* TAB 1: LIVE CARE TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {["All", "Medication", "Vitals", "Appointment", "General"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTimelineFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      timelineFilter === cat
                        ? "bg-teal-700 text-white"
                        : "bg-white border border-stone-200 text-slate-600 hover:bg-stone-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Real-time family feed replacing scattered group texts
              </span>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-stone-300 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getCategoryStyle(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      {item.highlight && (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
                          {item.highlight}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Logged by <strong className="text-slate-700">{item.author}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TASK HANDOFFS */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Care Coordination & Handoffs</h3>
                <p className="text-xs text-slate-500">
                  Clear ownership so errands, refills, and rides never slip through the cracks.
                </p>
              </div>
              {currentUser.canEdit && (
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Handoff Task
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    task.status === "Need Backup"
                      ? "border-rose-300 bg-rose-50/20"
                      : task.status === "Done"
                      ? "border-stone-200 opacity-75"
                      : "border-stone-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusBadgeStyle(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      {task.source === "AI Voice-to-Action" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                          <Sparkles className="w-3 h-3" /> Auto-Parsed
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {task.dueDate}
                      </span>
                    </div>
                    <h4
                      className={`text-sm sm:text-base font-bold ${
                        task.status === "Done" ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  {/* Interactive Controls: Assignee & Status */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {/* Assignee Selector */}
                    <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
                      <span className="text-[11px] text-slate-500">Owner:</span>
                      <select
                        value={task.assignee}
                        disabled={!currentUser.canEdit}
                        onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                        className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="Constantin">Constantin</option>
                        <option value="Sarah">Sarah</option>
                        <option value="Elena">Elena</option>
                      </select>
                    </div>

                    {/* Status Selector */}
                    <select
                      value={task.status}
                      disabled={!currentUser.canEdit}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Need Backup">🚨 Need Backup</option>
                      <option value="Done">✅ Done</option>
                    </select>

                    {currentUser.canEdit && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Remove task"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEDICATIONS & SECURE DOCUMENT VAULT */}
        {activeTab === "vault" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Medications Checklist (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Daily Medication Schedule</h3>
                  <p className="text-xs text-slate-500">
                    Tap to mark doses taken—automatically logs to the family timeline.
                  </p>
                </div>
                {currentUser.canManageVault && (
                  <button
                    onClick={() => setShowAddMedModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Rx
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      med.takenToday
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {med.name} <span className="text-teal-700 font-semibold">{med.dosage}</span>
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 font-medium">
                          {med.purpose}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{med.schedule}</p>
                      <p className="text-[11px] text-slate-400">Refills remaining: {med.refillsLeft}</p>
                    </div>

                    <button
                      onClick={() => toggleMedicationTaken(med.id)}
                      disabled={!currentUser.canEdit}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                        med.takenToday
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-stone-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-stone-200"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {med.takenToday ? "Taken Today" : "Mark Taken"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Insurance & Medical Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Insurance & Clinic Vault</h3>
                <p className="text-xs text-slate-500">
                  Instant pharmacy & hospital check-in cards with one-tap ID copy.
                </p>
              </div>

              <div className="space-y-3">
                {insuranceCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
                          {card.provider}
                        </span>
                        <h4 className="font-bold text-sm mt-0.5">{card.title}</h4>
                      </div>
                      <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-300">Member / Policy ID</div>
                        <div className="font-mono text-sm font-bold tracking-wide">
                          {card.memberId}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(card.memberId, card.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedId === card.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Group: {card.groupNo}</span>
                      <span>{card.notes}</span>
                    </div>
                  </div>
                ))}

                {/* Primary Physician Quick Card */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
                    <Stethoscope className="w-4 h-4" />
                    Primary Care Physician
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {CARE_RECIPIENT.primaryPhysician.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {CARE_RECIPIENT.primaryPhysician.clinic} • {CARE_RECIPIENT.primaryPhysician.specialty}
                  </div>
                  <div className="pt-1">
                    <a
                      href={`tel:${CARE_RECIPIENT.primaryPhysician.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {CARE_RECIPIENT.primaryPhysician.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: EMERGENCY MEDICAL CARD */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg leading-tight">Emergency Responder Card</h3>
                  <p className="text-xs text-rose-100">Critical medical profile for {CARE_RECIPIENT.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-slate-500">Patient & Age</div>
                  <div className="font-bold text-slate-900">{CARE_RECIPIENT.name} ({CARE_RECIPIENT.age})</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-xs text-rose-700 font-semibold">Blood Type</div>
                  <div className="font-bold text-rose-900 text-lg">{CARE_RECIPIENT.bloodType}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Severe Drug Allergies
                </div>
                <ul className="text-sm font-semibold text-amber-950 list-disc list-inside">
                  {CARE_RECIPIENT.allergies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Active Medications</div>
                <div className="flex flex-wrap gap-1.5">
                  {medications.map((m) => (
                    <span
                      key={m.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                    >
                      {m.name} {m.dosage}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">Emergency Family Contacts</div>
                <div className="space-y-2">
                  {CARE_RECIPIENT.emergencyContacts.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-slate-500">{c.relation}</div>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-bold"
                      >
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD HANDOFF TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">New Family Handoff Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Pick up blood pressure cuff batteries"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign To</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="Constantin">Constantin</option>
                    <option value="Sarah">Sarah</option>
                    <option value="Elena">Elena</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Window</label>
                  <input
                    type="text"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDICATION */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Add Prescription to Vault</h3>
              <button
                onClick={() => setShowAddMedModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g., Metformin"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g., 500 mg"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={newMedSchedule}
                  onChange={(e) => setNewMedSchedule(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Condition</label>
                <input
                  type="text"
                  value={newMedPurpose}
                  onChange={(e) => setNewMedPurpose(e.target.value)}
                  placeholder="e.g., Blood Sugar Support"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold cursor-pointer"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```
