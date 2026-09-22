import React, { useState, useEffect, useMemo } from 'react';

const DEFAULT_TRACKERS = [
  // ==========================================
  // --- DAILY (Speed Run) ---
  // ==========================================
  // Priority 0: Non-negotiable Core (Bullseye)
  {
    id: 'deep_work',
    pillar: 'Professional',
    name: 'Uninterrupted Deep Work Block',
    type: 'numeric',
    unit: 'hrs',
    cadence: 'daily',
    priority: 0,
    target: 2.0,
    step: 0.5,
    rationale: 'Protect 2 hours of deep, unbroken execution on your highest-leverage priority.',
  },
  {
    id: 'sleep_target',
    pillar: 'Health',
    name: 'In Bed on Time (9:30 PM)',
    type: 'boolean',
    cadence: 'daily',
    priority: 0,
    target: 1,
    rationale: 'Consistent circadian timing and sleep onset for optimal cognitive recovery.',
  },

  // Priority 1: High-Leverage Anchors (Inner Ring)
  {
    id: 'compound_lift',
    pillar: 'Health',
    name: 'Heavy Compound Lift / Resistance Session',
    type: 'boolean',
    cadence: 'daily',
    priority: 1,
    target: 1,
    rationale: 'Preserve skeletal muscle mass, bone density, and metabolic throughput.',
  },
  {
    id: 'protein_intake',
    pillar: 'Health',
    name: 'Daily Protein Intake Anchor',
    type: 'numeric',
    unit: 'g',
    cadence: 'daily',
    priority: 1,
    target: 160,
    step: 10,
    rationale: 'Supports muscle protein synthesis and serves as a natural satiety anchor.',
  },
  {
    id: 'unbroken_contract',
    pillar: 'Personal',
    name: 'Unbroken Self-Contract',
    type: 'boolean',
    cadence: 'daily',
    priority: 1,
    target: 1,
    rationale: 'Confidence is the byproduct of irrefutable proof; keep small promises to yourself.',
  },

  // Priority 2: Health & Mental Flow (Mid Ring)
  {
    id: 'daily_walk',
    pillar: 'Health',
    name: 'Brisk Walking Baseline',
    type: 'numeric',
    unit: 'hrs',
    cadence: 'daily',
    priority: 2,
    target: 2.0,
    step: 0.5,
    rationale: 'Maintain daily non-exercise physical activity and metabolic flow.',
  },
  {
    id: 'breathing_vagal',
    pillar: 'Health',
    name: 'Resonance Frequency Breathing',
    type: 'numeric',
    unit: 'min',
    cadence: 'daily',
    priority: 2,
    target: 15,
    step: 5,
    rationale: 'Diaphragmatic breathing at 5.5s cadence to train vagal tone and elevate HRV.',
  },
  {
    id: 'first_hour_sanctuary',
    pillar: 'Personal',
    name: 'First Hour Sanctuary',
    type: 'boolean',
    cadence: 'daily',
    priority: 2,
    target: 1,
    rationale: 'Never rush the first 60 minutes awake; start deliberate, calm, and proactive.',
  },

  // Priority 3: Tactical Hygiene (Outer Ring)
  {
    id: 'small_problem_immediate',
    pillar: 'Personal',
    name: 'Small Problem Handled Immediately',
    type: 'boolean',
    cadence: 'daily',
    priority: 3,
    target: 1,
    rationale: 'Address minor friction within 5 minutes before small items compound.',
  },
  {
    id: 'caloric_pause',
    pillar: 'Health',
    name: 'Energy Window / Caloric Pause',
    type: 'boolean',
    cadence: 'daily',
    priority: 3,
    target: 1,
    rationale: 'Structured eating window to prevent continuous mitochondrial surplus.',
  },

  // ==========================================
  // --- WEEKLY (Checkpoints & Sprints) ---
  // ==========================================
  {
    id: 'outreach_sprints',
    pillar: 'Professional',
    name: 'Client Outreach & Audit Sprints',
    type: 'numeric',
    unit: 'audits',
    cadence: 'weekly',
    priority: 0,
    target: 5.0,
    step: 1,
    rationale: 'Deliver targeted proof-of-concept audits and video walkthroughs.',
  },
  {
    id: 'proof_proposals',
    pillar: 'Professional',
    name: 'Proof-Sprint Proposals Pitched',
    type: 'numeric',
    unit: 'pitches',
    cadence: 'weekly',
    priority: 1,
    target: 2.0,
    step: 1,
    rationale: 'Pitch zero-risk, high-ROI 30-day proof sprints to qualified prospects.',
  },
  {
    id: 'scorecard_audit',
    pillar: 'Personal',
    name: 'Weekly Scorecard Audit & Friction Pivot',
    type: 'boolean',
    cadence: 'weekly',
    priority: 1,
    target: 1,
    rationale: 'Review completion trends, spot drop-offs under 65%, and pivot design.',
  },
  {
    id: 'flow_activity',
    pillar: 'Health',
    name: 'Immersive / High-Consequence Activity',
    type: 'numeric',
    unit: 'sessions',
    cadence: 'weekly',
    priority: 2,
    target: 2.0,
    step: 1,
    rationale: 'Fast-paced athletic movement or hobbies where focus converts thought into flow.',
  },

  // ==========================================
  // --- QUARTERLY (90-Day Milestones) ---
  // ==========================================
  {
    id: 'q_clients',
    pillar: 'Professional',
    name: 'Acquire First 3 Paying Retainer Clients',
    type: 'numeric',
    unit: 'clients',
    cadence: 'quarterly',
    priority: 0,
    target: 3.0,
    step: 1,
    rationale: 'Land initial proof clients to establish recurring revenue baseline.',
  },
  {
    id: 'q_core_service',
    pillar: 'Professional',
    name: 'Productize 1 Repeatable AI Automation Offer',
    type: 'boolean',
    cadence: 'quarterly',
    priority: 1,
    target: 1,
    rationale: 'Package custom workflows into a standardized, sellable service asset.',
  },
  {
    id: 'q_health_habits',
    pillar: 'Health',
    name: '90-Day Unbroken Sleep & Strength Baseline',
    type: 'boolean',
    cadence: 'quarterly',
    priority: 1,
    target: 1,
    rationale: 'Lock in 3 months of consistent circadian rhythm and resistance training.',
  },
];

export default function App() {
  const [cadence, setCadence] = useState('daily');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [expandedRationale, setExpandedRationale] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic Trackers loaded from LocalStorage
  const [trackers, setTrackers] = useState(() => {
    const saved = localStorage.getItem('life_tracker_definitions_v7');
    return saved ? JSON.parse(saved) : DEFAULT_TRACKERS;
  });

  // Daily / Weekly / Quarterly Logs
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('life_tracker_logs');
    return saved ? JSON.parse(saved) : {};
  });

  // New Tracker Form State
  const [newTracker, setNewTracker] = useState({
    name: '',
    pillar: 'Professional',
    cadence: 'daily',
    priority: 1,
    type: 'boolean',
    unit: '',
    target: 1,
    step: 1,
    rationale: '',
  });

  useEffect(() => {
    localStorage.setItem('life_tracker_definitions_v7', JSON.stringify(trackers));
  }, [trackers]);

  useEffect(() => {
    localStorage.setItem('life_tracker_logs', JSON.stringify(logs));
  }, [logs]);

  // Keys partitioned by cadence and date
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const weekNumber = Math.ceil(now.getDate() / 7);
  const weekKey = `${now.getFullYear()}-W${weekNumber}`;
  const quarterKey = `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`;

  const getScopeKey = (c) => {
    if (c === 'daily') return dateKey;
    if (c === 'weekly') return weekKey;
    return quarterKey;
  };

  const currentScopeKey = getScopeKey(cadence);

  const getValue = (trackerId, scopeKey = currentScopeKey) => {
    return logs?.[scopeKey]?.[trackerId] ?? 0;
  };

  const updateValue = (trackerId, nextVal) => {
    setLogs((prev) => ({
      ...prev,
      [currentScopeKey]: {
        ...(prev[currentScopeKey] || {}),
        [trackerId]: Math.max(0, nextVal),
      },
    }));
  };

  const toggleBoolean = (trackerId) => {
    const current = getValue(trackerId);
    updateValue(trackerId, current >= 1 ? 0 : 1);
  };

  // Modify Priority on the fly (cycles 0 -> 1 -> 2 -> 3 -> 0)
  const cyclePriority = (trackerId, currentPriority) => {
    const nextPriority = (currentPriority + 1) % 4;
    setTrackers((prev) =>
      prev.map((t) => (t.id === trackerId ? { ...t, priority: nextPriority } : t))
    );
  };

  // Add / Delete Trackers Dynamically
  const handleAddTracker = (e) => {
    e.preventDefault();
    if (!newTracker.name.trim()) return;

    const created = {
      id: `custom_${Date.now()}`,
      name: newTracker.name.trim(),
      pillar: newTracker.pillar,
      cadence: newTracker.cadence,
      priority: Number(newTracker.priority) || 0,
      type: newTracker.type,
      unit: newTracker.type === 'numeric' ? newTracker.unit || 'units' : '',
      target: Number(newTracker.target) || 1,
      step: Number(newTracker.step) || 1,
      rationale: newTracker.rationale.trim() || 'Custom priority milestone.',
    };

    setTrackers((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewTracker({
      name: '',
      pillar: 'Professional',
      cadence: 'daily',
      priority: 1,
      type: 'boolean',
      unit: '',
      target: 1,
      step: 1,
      rationale: '',
    });
  };

  const handleDeleteTracker = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      setTrackers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Filter trackers by cadence and pillar, then SORT by priority ascending (P0 first)
  const activeTrackers = useMemo(() => {
    return trackers
      .filter((t) => {
        const matchesCadence = t.cadence === cadence;
        const matchesPillar = selectedPillar === 'All' || t.pillar === selectedPillar;
        return matchesCadence && matchesPillar;
      })
      .sort((a, b) => (a.priority ?? 1) - (b.priority ?? 1));
  }, [trackers, cadence, selectedPillar]);

  // Priority Rings Calculation for the Momentum Meter
  const cadenceTrackers = useMemo(() => trackers.filter((t) => t.cadence === cadence), [trackers, cadence]);

  const priorityStats = useMemo(() => {
    const priorities = Array.from(new Set(cadenceTrackers.map((t) => t.priority ?? 1))).sort((a, b) => a - b);

    return priorities.map((p) => {
      const items = cadenceTrackers.filter((t) => (t.priority ?? 1) === p);
      const completed = items.filter((t) => getValue(t.id) >= t.target).length;
      const pct = items.length ? Math.round((completed / items.length) * 100) : 0;
      return {
        priority: p,
        total: items.length,
        completed,
        pct,
      };
    });
  }, [cadenceTrackers, logs, currentScopeKey]);

  // Momentum Stats & Weekly Streak
  const momentumStats = useMemo(() => {
    const dailyTrackers = trackers.filter((t) => t.cadence === 'daily');
    const todayHits = dailyTrackers.filter((t) => getValue(t.id, dateKey) >= t.target).length;
    const todayScore = dailyTrackers.length ? (todayHits / dailyTrackers.length) * 100 : 0;

    let consecutiveWeeks = 0;
    const currentYear = now.getFullYear();
    const currentWeekNum = Math.ceil(now.getDate() / 7);

    for (let i = 0; i < 12; i++) {
      const targetWeekNum = currentWeekNum - i;
      if (targetWeekNum <= 0) break;
      const wKey = `${currentYear}-W${targetWeekNum}`;
      const weekLog = logs?.[wKey];

      if (i === 0) {
        if (todayScore > 0 || (weekLog && Object.keys(weekLog).length > 0)) {
          consecutiveWeeks += 1;
        }
      } else if (weekLog && Object.keys(weekLog).length > 0) {
        consecutiveWeeks += 1;
      } else {
        break;
      }
    }

    const weeklyBonus = Math.min(consecutiveWeeks * 10, 40);
    const totalMomentum = Math.min(100, Math.round(todayScore * 0.6 + weeklyBonus));

    let tierLabel = 'Ignition';
    let tierColor = 'text-slate-400';
    let flameColor = 'text-slate-500';

    if (totalMomentum >= 85) {
      tierLabel = 'Unstoppable Flow';
      tierColor = 'text-emerald-300';
      flameColor = 'text-emerald-400 animate-pulse';
    } else if (totalMomentum >= 65) {
      tierLabel = 'In The Pocket';
      tierColor = 'text-emerald-400';
      flameColor = 'text-emerald-400';
    } else if (totalMomentum >= 35) {
      tierLabel = 'Building Drive';
      tierColor = 'text-teal-400';
      flameColor = 'text-teal-400';
    }

    return {
      totalMomentum,
      todayHits,
      totalDaily: dailyTrackers.length,
      todayScore: Math.round(todayScore),
      consecutiveWeeks,
      tierLabel,
      tierColor,
      flameColor,
    };
  }, [trackers, logs, dateKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      {/* Top App Header */}
      <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur sticky top-0 z-20 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Life Operating System
            </h1>
            <p className="text-xs text-slate-400 capitalize">
              {cadence} View • <span className="text-slate-300 font-mono">{currentScopeKey}</span>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/40 shadow-sm transition-all"
          >
            + Add Tracker
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {/* ========================================== */}
        {/* --- MOMENTUM METER AS CONCENTRIC TARGET --- */}
        {/* ========================================== */}
        <div className="mb-5 p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-900/50 shadow-xl shadow-black/50 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-base ${momentumStats.flameColor}`}>⚡</span>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">
                Momentum Meter
              </h2>
            </div>
            <span className={`text-xs font-bold ${momentumStats.tierColor}`}>
              {momentumStats.tierLabel}
            </span>
          </div>

          {/* Concentric Target SVG Circle */}
          <div className="relative w-52 h-52 my-1 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              {priorityStats.map((stat, idx) => {
                const totalRings = Math.max(priorityStats.length, 3);
                const baseRadius = 26;
                const ringStep = 64 / totalRings;
                const radius = baseRadius + (idx * ringStep);
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (circumference * stat.pct) / 100;

                const isCore = stat.priority === 0;
                const strokeColor = isCore
                  ? (stat.pct === 100 ? '#10b981' : '#34d399')
                  : stat.priority === 1
                  ? '#059669'
                  : '#0d9488';

                return (
                  <g key={stat.priority}>
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill={isCore && stat.pct === 100 ? 'rgba(16, 185, 129, 0.12)' : 'none'}
                      stroke="rgba(30, 41, 59, 0.7)"
                      strokeWidth={isCore ? '9' : '7'}
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isCore ? '9' : '7'}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Inner Center Bullseye Status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Momentum</span>
              <span className="text-3xl font-black text-emerald-400 font-mono drop-shadow">
                {momentumStats.totalMomentum}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {momentumStats.consecutiveWeeks}W Streak 🔥
              </span>
            </div>
          </div>

          {/* Priority Rings Legend */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-[11px]">
            {priorityStats.slice(0, 3).map((stat) => (
              <div
                key={stat.priority}
                className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 font-bold mb-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stat.priority === 0
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                        : stat.priority === 1
                        ? 'bg-emerald-600'
                        : 'bg-teal-600'
                    }`}
                  />
                  <span className="text-slate-300">
                    {stat.priority === 0 ? 'P0 Core' : `P${stat.priority} Ring`}
                  </span>
                </div>
                <span className="text-slate-400 font-mono font-semibold">
                  {stat.completed}/{stat.total} ({stat.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cadence Segmented Control */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4 shadow-inner">
          {['daily', 'weekly', 'quarterly'].map((c) => (
            <button
              key={c}
              onClick={() => setCadence(c)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                cadence === c
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Pillar Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
          {['All', 'Professional', 'Health', 'Personal'].map((pillar) => (
            <button
              key={pillar}
              onClick={() => setSelectedPillar(pillar)}
              className={`px-3 py-1.5 rounded-full border font-medium whitespace-nowrap transition-all ${
                selectedPillar === pillar
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/80 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {pillar}
            </button>
          ))}
        </div>

        {/* Tracker Cards (Sorted by Priority: P0 First) */}
        <div className="space-y-3">
          {activeTrackers.map((tracker) => {
            const val = getValue(tracker.id);
            const isComplete = val >= tracker.target;
            const isExpanded = expandedRationale === tracker.id;
            const currentP = tracker.priority ?? 1;
            const isCoreP0 = currentP === 0;

            return (
              <div
                key={tracker.id}
                className={`p-4 rounded-xl border transition-all ${
                  isComplete
                    ? 'bg-slate-900/90 border-emerald-900/60 shadow-sm shadow-emerald-950/30'
                    : isCoreP0
                    ? 'bg-slate-900/70 border-emerald-800/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Tappable Priority Modifier Button (Cycles 0 -> 1 -> 2 -> 3 -> 0) */}
                    <button
                      onClick={() => cyclePriority(tracker.id, currentP)}
                      title="Tap to change priority"
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider transition-all active:scale-90 flex items-center gap-1 cursor-pointer ${
                        isCoreP0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
                          : currentP === 1
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                          : currentP === 2
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-800 hover:bg-teal-900'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span>P{currentP}</span>
                      <span>{isCoreP0 ? 'Core' : 'Ring'}</span>
                      <span className="text-[8px] opacity-60">↻</span>
                    </button>

                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/90">
                      {tracker.pillar}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      Target: <span className="text-slate-200 font-semibold">{tracker.target}</span> {tracker.unit || ''}
                    </span>
                    <button
                      onClick={() => handleDeleteTracker(tracker.id, tracker.name)}
                      className="text-slate-600 hover:text-red-400 text-xs px-1 transition-colors"
                      title="Remove Tracker"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedRationale(isExpanded ? null : tracker.id)}>
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        isComplete ? 'text-slate-300 line-through decoration-emerald-600/60' : 'text-white'
                      }`}
                    >
                      {tracker.name}
                    </h3>
                  </div>

                  {tracker.type === 'boolean' ? (
                    <button
                      onClick={() => toggleBoolean(tracker.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                        isComplete
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/50'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600 active:scale-95'
                      }`}
                    >
                      {isComplete ? '✓' : ''}
                    </button>
                  ) : (
                    <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 shadow-inner">
                      <button
                        onClick={() => updateValue(tracker.id, val - (tracker.step || 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg active:bg-slate-700 text-base font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-white min-w-[3.4rem] text-center">
                        {val} <span className="text-[10px] font-normal text-slate-400">{tracker.unit}</span>
                      </span>
                      <button
                        onClick={() => updateValue(tracker.id, val + (tracker.step || 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg active:bg-slate-700 text-base font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Collapsible Rationale Note */}
                {tracker.rationale && (
                  <div className="mt-2 pt-2 border-t border-slate-800/50">
                    <button
                      onClick={() => setExpandedRationale(isExpanded ? null : tracker.id)}
                      className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? '▾ Hide rationale' : '▸ Operating rationale'}</span>
                    </button>
                    {isExpanded && (
                      <p className="text-xs text-slate-300 mt-1.5 pl-2 border-l-2 border-emerald-600/60 leading-relaxed bg-slate-950/40 py-1 rounded-r">
                        {tracker.rationale}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {activeTrackers.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500">No trackers found for this filter.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-xs text-emerald-400 font-semibold hover:underline"
              >
                + Add your first {cadence} tracker
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Dynamic Add Tracker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add Custom Tracker</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTracker} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tracker Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Read 20 pages, Cold Plunge"
                  value={newTracker.name}
                  onChange={(e) => setNewTracker({ ...newTracker, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pillar</label>
                  <select
                    value={newTracker.pillar}
                    onChange={(e) => setNewTracker({ ...newTracker, pillar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Cadence</label>
                  <select
                    value={newTracker.cadence}
                    onChange={(e) => setNewTracker({ ...newTracker, cadence: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newTracker.priority}
                    onChange={(e) => setNewTracker({ ...newTracker, priority: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value={0}>P0 (Core)</option>
                    <option value={1}>P1 (High)</option>
                    <option value={2}>P2 (Mid)</option>
                    <option value={3}>P3 (Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={newTracker.type}
                    onChange={(e) => setNewTracker({ ...newTracker, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="boolean">Checkmark (Yes/No)</option>
                    <option value="numeric">Numeric Stepper</option>
                  </select>
                </div>
                {newTracker.type === 'numeric' ? (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Unit</label>
                    <input
                      type="text"
                      placeholder="e.g., hrs, g, reps"
                      value={newTracker.unit}
                      onChange={(e) => setNewTracker({ ...newTracker, unit: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Target</label>
                    <input
                      type="number"
                      disabled
                      value={1}
                      className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl px-3 py-2 text-slate-500"
                    />
                  </div>
                )}
              </div>

              {newTracker.type === 'numeric' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Target Value</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newTracker.target}
                      onChange={(e) => setNewTracker({ ...newTracker, target: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Step (+ / -)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newTracker.step}
                      onChange={(e) => setNewTracker({ ...newTracker, step: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Operating Rationale (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Why is this habit high-leverage?"
                  value={newTracker.rationale}
                  onChange={(e) => setNewTracker({ ...newTracker, rationale: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40"
                >
                  Save Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
