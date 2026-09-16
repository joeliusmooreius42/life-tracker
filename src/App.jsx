import React, { useState, useEffect } from 'react';

const INITIAL_TRACKERS = [
  // --- DAILY (Speed Run) ---
  {
    id: 'deep_work',
    pillar: 'Professional',
    name: 'Uninterrupted Deep Work',
    type: 'numeric',
    unit: 'hrs',
    cadence: 'daily',
    target: 2.0,
    step: 0.5,
  },
  {
    id: 'video_audits',
    pillar: 'Professional',
    name: 'Custom Video Audits Sent',
    type: 'numeric',
    unit: 'videos',
    cadence: 'daily',
    target: 5.0,
    step: 1,
  },
  {
    id: 'sleep_target',
    pillar: 'Health',
    name: 'In Bed by 9:30 PM',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
  },
  {
    id: 'compound_lift',
    pillar: 'Health',
    name: 'Resistance / Lift Session',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
  },
  {
    id: 'self_contract',
    pillar: 'Personal',
    name: 'Unbroken Self-Contract Kept',
    type: 'boolean',
    cadence: 'daily',
    target: 1,
  },

  // --- WEEKLY (Sprint Checkpoints) ---
  {
    id: 'proof_proposals',
    pillar: 'Professional',
    name: 'Proof-Sprint Proposals Pitched',
    type: 'numeric',
    unit: 'pitches',
    cadence: 'weekly',
    target: 2.0,
    step: 1,
  },
  {
    id: 'weekly_review',
    pillar: 'Personal',
    name: 'Scorecard Audit & Friction Pivot',
    type: 'boolean',
    cadence: 'weekly',
    target: 1,
  },
  {
    id: 'weekly_recovery',
    pillar: 'Health',
    name: 'Active Flow / Outdoor Recovery',
    type: 'boolean',
    cadence: 'weekly',
    target: 1,
  },

  // --- QUARTERLY (90-Day Milestones) ---
  {
    id: 'q_clients',
    pillar: 'Professional',
    name: 'Sign First 3 Paying AI Retainer Clients',
    type: 'numeric',
    unit: 'clients',
    cadence: 'quarterly',
    target: 3.0,
    step: 1,
  },
  {
    id: 'q_core_offer',
    pillar: 'Professional',
    name: 'Productize & Document 1 Core AI Automation Service',
    type: 'boolean',
    cadence: 'quarterly',
    target: 1,
  },
  {
    id: 'q_health_baseline',
    pillar: 'Health',
    name: 'Achieve 90-Day Consistent Sleep & Training Cadence',
    type: 'boolean',
    cadence: 'quarterly',
    target: 1,
  },
];

export default function App() {
  const [cadence, setCadence] = useState('daily');
  const [selectedPillar, setSelectedPillar] = useState('All');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top App Header */}
      <header className="border-b border-slate-900 bg-slate-900/50 backdrop-blur sticky top-0 z-10 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Life Operating System</h1>
            <p className="text-xs text-slate-400 capitalize">{cadence} View • {currentScopeKey}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">Score</span>
            <p className="text-lg font-black text-blue-500">{progressPercent}%</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Cadence Segmented Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/80 mb-5 shadow-inner">
          {['daily', 'weekly', 'quarterly'].map((c) => (
            <button
              key={c}
              onClick={() => setCadence(c)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                cadence === c
                  ? 'bg-blue-600 text-white shadow-md'
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
              className={`px-3 py-1.5 rounded-full border font-medium whitespace-nowrap transition-colors ${
                selectedPillar === pillar
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-transparent text-slate-400 border-slate-900 hover:border-slate-800'
              }`}
            >
              {pillar}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full mb-6 overflow-hidden border border-slate-800">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Tracker Cards */}
        <div className="space-y-3">
          {activeTrackers.map((tracker) => {
            const val = getValue(tracker.id);
            const isComplete = val >= tracker.target;

            return (
              <div
                key={tracker.id}
                className={`p-4 rounded-xl border transition-all ${
                  isComplete
                    ? 'bg-slate-900/90 border-blue-900/60'
                    : 'bg-slate-900/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    {tracker.pillar}
                  </span>
                  <span className="text-xs text-slate-400">
                    Target: {tracker.target} {tracker.unit || ''}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`text-sm font-semibold flex-1 ${
                      isComplete ? 'text-slate-200 line-through decoration-slate-600' : 'text-white'
                    }`}
                  >
                    {tracker.name}
                  </h3>

                  {tracker.type === 'boolean' ? (
                    <button
                      onClick={() => toggleBoolean(tracker.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                        isComplete
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {isComplete ? '✓' : ''}
                    </button>
                  ) : (
                    <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1">
                      <button
                        onClick={() => updateValue(tracker.id, val - (tracker.step || 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg active:bg-slate-700 text-base"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-white min-w-[3rem] text-center">
                        {val} <span className="text-[10px] font-normal text-slate-400">{tracker.unit}</span>
                      </span>
                      <button
                        onClick={() => updateValue(tracker.id, val + (tracker.step || 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg active:bg-slate-700 text-base"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
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
