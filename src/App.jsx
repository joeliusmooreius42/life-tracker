import React, { useState, useEffect } from 'react';

const INITIAL_TRACKERS = [
  // ==========================================
  // --- DAILY (Speed Run) ---
  // ==========================================
  // Professional
  {
    id: 'video_audits',
    pillar: 'Professional',
    name: 'Custom Video Audits Sent',
    type: 'numeric',
    unit: 'audits',
    cadence: 'daily',
    target: 5.0,
    step: 1,
    rationale: 'Send 5 screen recording audits daily showing client bottlenecks. Showing beats telling.',
  },
  {
    id: 'deep_work',
    pillar: 'Professional',
    name: 'Uninterrupted Deep Work Block',
    type: 'numeric',
    unit: 'hrs',
    cadence: 'daily',
    target: 2.0,
    step: 0.5,
    rationale: 'Protect 2-3 hours dedicated to your highest-leverage task.',
  },
  {
    id: 'niche_positioning',
    pillar: 'Professional',
    name: 'Category of One Positioning',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Intersect domain expertise with AI implementation rather than competing as a generic agency.',
  },

  // Health
  {
    id: 'sleep_target',
    pillar: 'Health',
    name: 'In Bed on Time (9:30 PM)',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Consistent circadian timing and sleep onset for recovery.',
  },
  {
    id: 'compound_lift',
    pillar: 'Health',
    name: 'Heavy Compound Lift Session',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Preserve skeletal muscle mass, bone density, and metabolic rate.',
  },
  {
    id: 'protein_intake',
    pillar: 'Health',
    name: 'Daily Protein Intake Anchor',
    type: 'numeric',
    unit: 'g',
    cadence: 'daily',
    target: 160,
    step: 10,
    rationale: 'Supports muscle protein synthesis and serves as a satiety anchor.',
  },
  {
    id: 'daily_walk',
    pillar: 'Health',
    name: 'Brisk Walking Baseline',
    type: 'numeric',
    unit: 'hrs',
    cadence: 'daily',
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
    target: 15,
    step: 5,
    rationale: 'Diaphragmatic breathing at 5.5s cadence to train vagal tone and HRV.',
  },
  {
    id: 'caloric_pause',
    pillar: 'Health',
    name: 'Energy Window / Caloric Pause',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Structured eating window to prevent continuous mitochondrial surplus.',
  },

  // Personal
  {
    id: 'first_hour_sanctuary',
    pillar: 'Personal',
    name: 'First Hour Sanctuary',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Never rush the first 60 minutes awake; start deliberate and unreactive.',
  },
  {
    id: 'small_problem_immediate',
    pillar: 'Personal',
    name: 'Small Problem Handled Immediately',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Address friction within 5 minutes before minor items compound.',
  },
  {
    id: 'unbroken_contract',
    pillar: 'Personal',
    name: 'Unbroken Self-Contract',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
    rationale: 'Confidence is the byproduct of irrefutable proof; keep your word to yourself.',
  },

  // ==========================================
  // --- WEEKLY (Checkpoints & Sprints) ---
  // ==========================================
  {
    id: 'proof_sprint_pitches',
    pillar: 'Professional',
    name: 'Proof-Sprint Pitches Sent',
    type: 'numeric',
    unit: 'pitches',
    cadence: 'weekly',
    target: 2.0,
    step: 1,
    rationale: 'Offer prospects a zero-risk 30-day proof-of-concept sprint.',
  },
  {
    id: 'offer_experiment_loop',
    pillar: 'Professional',
    name: '2-Week Offer Experiment Loop',
    type: 'boolean',
    cadence: 'weekly',
    target: 1,
    rationale: 'Audit offers as rapid 2-week tests without emotional drag.',
  },
  {
    id: 'scorecard_audit',
    pillar: 'Personal',
    name: 'Weekly Scorecard Audit & Friction Pivot',
    type: 'boolean',
    cadence: 'weekly',
    target: 1,
    rationale: 'Review completion trends, flag <65% drop-offs, and adjust.',
  },
  {
    id: 'flow_activity',
    pillar: 'Health',
    name: 'Immersive / High-Consequence Activity',
    type: 'numeric',
    unit: 'sessions',
    cadence: 'weekly',
    target: 2.0,
    step: 1,
    rationale: 'Fast-paced athletic movement/hobbies where focus turns thought into flow.',
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
    target: 3.0,
    step: 1,
    rationale: 'Land initial proof clients to establish predictable cash flow.',
  },
  {
    id: 'q_core_service',
    pillar: 'Professional',
    name: 'Productize 1 Repeatable AI Automation Offer',
    type: 'boolean',
    cadence: 'quarterly',
    target: 1,
    rationale: 'Package workflows into a standardized, sellable asset.',
  },
  {
    id: 'q_health_habits',
    pillar: 'Health',
    name: '90-Day Unbroken Sleep & Strength Cadence',
    type: 'boolean',
    cadence: 'quarterly',
    target: 1,
    rationale: 'Build an irrefutable 3-month baseline of health anchors.',
  },
];

export default function App() {
  const [cadence, setCadence] = useState('daily');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [expandedRationale, setExpandedRationale] = useState(null);

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('life_tracker_logs');
    return saved ? JSON.parse(saved) : {};
  });

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

  const getValue = (trackerId) => {
    return logs?.[currentScopeKey]?.[trackerId] ?? 0;
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

  // Filter trackers
  const activeTrackers = INITIAL_TRACKERS.filter((t) => {
    const matchesCadence = t.cadence === cadence;
    const matchesPillar = selectedPillar === 'All' || t.pillar === selectedPillar;
    return matchesCadence && matchesPillar;
  });

  // Calculate cadence completion
  const cadenceTrackers = INITIAL_TRACKERS.filter((t) => t.cadence === cadence);
  const completedCount = cadenceTrackers.filter((t) => getValue(t.id) >= t.target).length;
  const progressPercent = cadenceTrackers.length
    ? Math.round((completedCount / cadenceTrackers.length) * 100)
    : 0;

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
              {cadence} Cadence • <span className="text-slate-300 font-mono">{currentScopeKey}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Score</span>
            <p className="text-xl font-black text-emerald-400">{progressPercent}%</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
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

        {/* Progress Bar (Emerald Green) */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full mb-6 overflow-hidden border border-slate-800/80">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Tracker Cards */}
        <div className="space-y-3">
          {activeTrackers.map((tracker) => {
            const val = getValue(tracker.id);
            const isComplete = val >= tracker.target;
            const isExpanded = expandedRationale === tracker.id;

            return (
              <div
                key={tracker.id}
                className={`p-4 rounded-xl border transition-all ${
                  isComplete
                    ? 'bg-slate-900/90 border-emerald-900/60 shadow-sm shadow-emerald-950/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500/90">
                    {tracker.pillar}
                  </span>
                  <span className="text-xs text-slate-400">
                    Target: <span className="text-slate-200 font-semibold">{tracker.target}</span> {tracker.unit || ''}
                  </span>
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
