import React, { useState, useEffect, useMemo } from 'react';

/**
 * Whole-Life Tracker Application v3
 * Phase 1 (Day 0 AI Firm Scale) + Health & Personal Anchors
 * Features 2-Primitive Data Architecture, LocalStorage Sync, Custom Habit Modal,
 * Speed Run Checklist, 7-Day Consistency Scorecard, and 3-Tier Goal Hierarchy Map.
 */

const INITIAL_PILLARS = [
  {
    "id": "pil_prof",
    "name": "Professional",
    "description": "AI Firm Scale, Exit Architecture & M&A Acquisition"
  },
  {
    "id": "pil_health",
    "name": "Health",
    "description": "Mitochondrial Density, Muscle & Longevity Anchors"
  },
  {
    "id": "pil_pers",
    "name": "Personal",
    "description": "Identity Diversification, Flow & Radical Simplicity"
  }
];
const INITIAL_GOALS = [
  {
    "id": "gol_phase1_land",
    "pillar_id": "pil_prof",
    "name": "Phase 1: Land First 3 Clients (Day 0 Outreach & Proof)",
    "description": "Execute high-volume video audits and zero-risk proof sprints to acquire initial client proof cases."
  },
  {
    "id": "gol_phase2_scale",
    "pillar_id": "pil_prof",
    "name": "Phase 2: Scale & Systemize ($10k+ MRR)",
    "description": "Transition to value pricing, rapid speed-to-lead, and decision delegation filters."
  },
  {
    "id": "gol_phase3_exit",
    "pillar_id": "pil_prof",
    "name": "Phase 3: Exit Architecture & M&A Acquisition",
    "description": "Eliminate owner fulfillment bottlenecks and build deal flow pipeline for acquisition of Business #2."
  },
  {
    "id": "gol_muscle",
    "pillar_id": "pil_health",
    "name": "Preserve Skeletal Muscle & Bone Density",
    "description": "Heavy compound lifts and optimal protein intake to defend functional health span."
  },
  {
    "id": "gol_mitochondria",
    "pillar_id": "pil_health",
    "name": "Optimize Vagal Tone & Metabolic Flexibility",
    "description": "Resonance breathing, walking baseline, and caloric pauses to prevent mitochondrial ROS overload."
  },
  {
    "id": "gol_flow",
    "pillar_id": "pil_pers",
    "name": "Protect Psychological Cadence & Flow",
    "description": "First hour sanctuary and immersive high-consequence activities to drive flow state."
  },
  {
    "id": "gol_self_trust",
    "pillar_id": "pil_pers",
    "name": "Radical Simplicity & Proof-Based Self-Trust",
    "description": "Immediate resolution of small problems and keeping unbroken daily self-contracts."
  }
];
const INITIAL_TRACKERS = [
  {
    "id": "trk_outreach",
    "goal_id": "gol_phase1_land",
    "pillar_name": "Professional",
    "name": "Daily Custom Video Audits / Reach-Outs",
    "type": "numeric",
    "unit": "audits",
    "frequency": "daily",
    "target_value": 5.0,
    "rationale": "Send 5 screen recordings/day showing target business bottlenecks & sample AI automations.",
    "source": "Codie Sanchez & Speed-to-Lead"
  },
  {
    "id": "trk_proof_sprints",
    "goal_id": "gol_phase1_land",
    "pillar_name": "Professional",
    "name": "Irresistible Proof-Sprint Pitches",
    "type": "numeric",
    "unit": "pitches",
    "frequency": "weekly",
    "target_value": 2.0,
    "rationale": "Offer zero-risk, 30-day proof-of-concept sprints to demonstrate ROI upfront and trigger reciprocity.",
    "source": "Tim Ferriss (#780)"
  },
  {
    "id": "trk_category_of_one",
    "goal_id": "gol_phase1_land",
    "pillar_name": "Professional",
    "name": "Category of One Niche Positioning",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Intersect domain knowledge with AI execution rather than competing as a generic agency.",
    "source": "Tim Ferriss (#780)"
  },
  {
    "id": "trk_experiment_loop",
    "goal_id": "gol_phase1_land",
    "pillar_name": "Professional",
    "name": "2-Week Offer Experiment Loop",
    "type": "boolean",
    "unit": "check",
    "frequency": "weekly",
    "target_value": 1.0,
    "rationale": "Treat service offerings as rapid asymmetrical experiments; pivot positioning without emotional drag.",
    "source": "Tim Ferriss (#780)"
  },
  {
    "id": "trk_value_pricing",
    "goal_id": "gol_phase2_scale",
    "pillar_name": "Professional",
    "name": "Value-Based Pricing Capture",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Price AI solutions at 10%-30% of quantifiable client ROI rather than hourly billing.",
    "source": "Codie Sanchez (#1145)"
  },
  {
    "id": "trk_speed_to_lead",
    "goal_id": "gol_phase2_scale",
    "pillar_name": "Professional",
    "name": "Rapid Speed-to-Lead Response",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Respond to prospect inquiries within minutes; 80% of sales go to the first competent responder.",
    "source": "Codie Sanchez (#1145)"
  },
  {
    "id": "trk_rule_of_three",
    "goal_id": "gol_phase2_scale",
    "pillar_name": "Professional",
    "name": "Rule of Three Enforced",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Require team/contractors to present problem, proposed solution, and trade-offs before interrupting.",
    "source": "Codie Sanchez (#1145)"
  },
  {
    "id": "trk_zero_fulfillment",
    "goal_id": "gol_phase3_exit",
    "pillar_name": "Professional",
    "name": "Zero-Fulfillment Bottleneck (Owner vs. Hero)",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Ensure service delivery and sales function without direct owner labor to build a sellable asset.",
    "source": "Codie Sanchez (#1145)"
  },
  {
    "id": "trk_ma_diligence",
    "goal_id": "gol_phase3_exit",
    "pillar_name": "Professional",
    "name": "M&A Acquisition Due-Diligence",
    "type": "numeric",
    "unit": "deals",
    "frequency": "weekly",
    "target_value": 2.0,
    "rationale": "Audit target acquisition opportunities for P&L health, owner dependence, and operational leverage.",
    "source": "Codie Sanchez (#1145)"
  },
  {
    "id": "trk_resistance",
    "goal_id": "gol_muscle",
    "pillar_name": "Health",
    "name": "Heavy Compound Lift",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Preserve skeletal muscle mass & bone density (3-4x/week).",
    "source": "Biohacking Roundtable (#1148)"
  },
  {
    "id": "trk_protein",
    "goal_id": "gol_muscle",
    "pillar_name": "Health",
    "name": "Daily Protein Intake Anchor",
    "type": "numeric",
    "unit": "grams",
    "frequency": "daily",
    "target_value": 160.0,
    "rationale": "1.2-1.6g/kg target for muscle synthesis and satiety.",
    "source": "Biohacking Roundtable (#1148)"
  },
  {
    "id": "trk_breathing",
    "goal_id": "gol_mitochondria",
    "pillar_name": "Health",
    "name": "Resonance Frequency Breathing",
    "type": "numeric",
    "unit": "mins",
    "frequency": "daily",
    "target_value": 15.0,
    "rationale": "5.5s in / 5.5s out for vagal tone and HRV optimization.",
    "source": "Biohacking Roundtable (#1148)"
  },
  {
    "id": "trk_walking",
    "goal_id": "gol_mitochondria",
    "pillar_name": "Health",
    "name": "Brisk Walking Baseline",
    "type": "numeric",
    "unit": "hours",
    "frequency": "daily",
    "target_value": 2.0,
    "rationale": "2-3 hours walking baseline for metabolic health.",
    "source": "Huberman Lab & Rutter"
  },
  {
    "id": "trk_caloric_pause",
    "goal_id": "gol_mitochondria",
    "pillar_name": "Health",
    "name": "Energy Window / Caloric Pause",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Structured eating window to prevent mitochondrial overload.",
    "source": "Huberman Lab & Rutter"
  },
  {
    "id": "trk_first_hour",
    "goal_id": "gol_flow",
    "pillar_name": "Personal",
    "name": "First Hour Sanctuary",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "No reactive phone/work in first 60 minutes after waking.",
    "source": "Tim Ferriss (#780)"
  },
  {
    "id": "trk_flow_activity",
    "goal_id": "gol_flow",
    "pillar_name": "Personal",
    "name": "Immersive / High-Consequence Activity",
    "type": "boolean",
    "unit": "weekly",
    "target_value": 1.0,
    "rationale": "Flow state exercise/hobby requiring total presence.",
    "source": "Jimmy Carr (#1135)"
  },
  {
    "id": "trk_small_prob",
    "goal_id": "gol_self_trust",
    "pillar_name": "Personal",
    "name": "Small Problem Handled Immediately",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Clear minor friction today before it compounds.",
    "source": "Jimmy Carr (#1135)"
  },
  {
    "id": "trk_self_contract",
    "goal_id": "gol_self_trust",
    "pillar_name": "Personal",
    "name": "Unbroken Self-Contract",
    "type": "boolean",
    "unit": "check",
    "frequency": "daily",
    "target_value": 1.0,
    "rationale": "Keep single core daily promise to build self-trust.",
    "source": "Jimmy Carr (#1135)"
  }
];

// Helper: LocalStorage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading LocalStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting LocalStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

export default function App() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'weekly' | 'hierarchy'
  const [trackers, setTrackers] = useLocalStorage('life_tracker_definitions_v3', INITIAL_TRACKERS);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [logs, setLogs] = useLocalStorage('life_tracker_logs_v3', {
    [getTodayKey()]: {
      trk_outreach: { value: 3.0, notes: 'Sent 3 loom video audits to target business leads.' },
      trk_category_of_one: { value: 1, notes: 'Positioned as AI Automation Specialist for Healthcare.' },
      trk_protein: { value: 160, notes: '160g protein target met.' },
      trk_first_hour: { value: 1, notes: 'Morning walk without phone.' }
    }
  });

  const todayKey = getTodayKey();
  const todayLogs = logs[todayKey] || {};

  const handleUpdateLog = (trackerId, value, notes = null) => {
    setLogs((prev) => {
      const currentDay = prev[todayKey] || {};
      const existingEntry = currentDay[trackerId] || { value: 0, notes: '' };
      
      const newEntry = {
        value,
        notes: notes !== null ? notes : existingEntry.notes
      };

      return {
        ...prev,
        [todayKey]: {
          ...currentDay,
          [trackerId]: newEntry
        }
      };
    });
  };

  const handleAddCustomHabit = (newTracker) => {
    setTrackers((prev) => [...prev, newTracker]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Global App Bar */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs font-mono">
              AI-OS
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">Whole-Life OS v3</h1>
              <span className="text-[10px] text-slate-400 font-mono">Day 0 AI Firm Scale & Health Anchors</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center space-x-1"
            >
              <span>+</span>
              <span className="hidden sm:inline">Habit</span>
            </button>

            <nav className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'today', label: 'Today', icon: '⚡' },
                { id: 'weekly', label: 'Scorecard', icon: '📊' },
                { id: 'hierarchy', label: 'Hierarchy', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pb-16">
        {activeTab === 'today' && (
          <TodayView trackers={trackers} todayLogs={todayLogs} onUpdateLog={handleUpdateLog} onOpenModal={() => setShowAddModal(true)} />
        )}
        {activeTab === 'weekly' && (
          <WeeklyView trackers={trackers} logs={logs} />
        )}
        {activeTab === 'hierarchy' && (
          <HierarchyView trackers={trackers} pillars={INITIAL_PILLARS} goals={INITIAL_GOALS} />
        )}
      </div>

      {/* Modal for adding custom habit */}
      {showAddModal && (
        <AddHabitModal
          pillars={INITIAL_PILLARS}
          goals={INITIAL_GOALS}
          onSave={handleAddCustomHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// TODAY'S SPEED RUN CHECKLIST
// -----------------------------------------------------------------------------
function TodayView({ trackers, todayLogs, onUpdateLog, onOpenModal }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [openNoteId, setOpenNoteId] = useState(null);

  const filteredTrackers = useMemo(() => {
    if (activeFilter === 'ALL') return trackers;
    return trackers.filter((t) => t.pillar_name.toLowerCase().startsWith(activeFilter.toLowerCase()) || t.goal_id === activeFilter);
  }, [trackers, activeFilter]);

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    let completed = 0;
    const total = trackers.length;

    trackers.forEach((t) => {
      const entry = todayLogs[t.id];
      const val = entry ? entry.value : 0;
      if (t.type === 'boolean') {
        if (val >= 1) completed += 1;
      } else {
        if (val >= t.target_value) completed += 1;
        else if (val > 0) completed += val / t.target_value;
      }
    });

    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    return { completedCount: Math.round(completed), totalCount: total, progressPercent: pct };
  }, [trackers, todayLogs]);

  const toggleBoolean = (id) => {
    const currentVal = todayLogs[id] ? todayLogs[id].value : 0;
    onUpdateLog(id, currentVal === 1 ? 0 : 1);
  };

  const updateNumeric = (id, delta, unit) => {
    const currentVal = todayLogs[id] ? todayLogs[id].value : 0;
    let step = 1;
    if (unit === 'hours') step = 0.5;
    if (unit === 'mins') step = 5;
    if (unit === 'grams') step = 10;
    if (unit === 'audits') step = 1;

    const nextVal = Math.max(0, parseFloat((currentVal + delta * step).toFixed(1)));
    onUpdateLog(id, nextVal);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header Banner */}
      <div className="mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Day 0 Execution Ledger</span>
            <h2 className="text-xl font-bold text-white">Today's Speed Run</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
            <p className="text-xs text-slate-400">{completedCount} of {totalCount} Targets Met</p>
          </div>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-3 border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <nav className="flex space-x-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Metrics' },
          { id: 'Prof', label: 'Professional' },
          { id: 'Health', label: 'Health' },
          { id: 'Pers', label: 'Personal' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Trackers Feed */}
      <div className="space-y-3">
        {filteredTrackers.map((t) => {
          const entry = todayLogs[t.id] || { value: 0, notes: '' };
          const val = entry.value;
          const isDone = t.type === 'boolean' ? val === 1 : val >= t.target_value;

          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border font-semibold bg-slate-800 text-slate-300 border-slate-700">
                      {t.pillar_name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Target: {t.target_value} {t.unit}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight">{t.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.rationale}</p>
                </div>

                {/* Tactile Controls */}
                <div className="flex items-center space-x-2 shrink-0">
                  {t.type === 'boolean' ? (
                    <button
                      onClick={() => toggleBoolean(t.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border transition-all ${
                        val === 1
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {val === 1 ? '✓' : ''}
                    </button>
                  ) : (
                    <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                      <button
                        onClick={() => updateNumeric(t.id, -1, t.unit)}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm flex items-center justify-center active:scale-95"
                      >
                        -
                      </button>
                      <div className="px-3 text-center min-w-[3.5rem]">
                        <span className={`text-sm font-bold font-mono ${isDone ? 'text-emerald-400' : 'text-white'}`}>
                          {val}
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-1">{t.unit}</span>
                      </div>
                      <button
                        onClick={() => updateNumeric(t.id, 1, t.unit)}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm flex items-center justify-center active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Note Row */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => setOpenNoteId(openNoteId === t.id ? null : t.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                >
                  <span>{entry.notes ? `📝 "${entry.notes}"` : '+ Add Context Note'}</span>
                </button>
                {t.type === 'numeric' && (
                  <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all"
                      style={{ width: `${Math.min(100, (val / t.target_value) * 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {openNoteId === t.id && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Log quick context..."
                    value={entry.notes || ''}
                    onChange={(e) => onUpdateLog(t.id, val, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WEEKLY SCORECARD
// -----------------------------------------------------------------------------
function WeeklyView({ trackers, logs }) {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Consistency Audit</span>
        <h2 className="text-xl font-bold text-white mb-1">Weekly Operating Scorecard</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Monitor daily habit consistency to isolate friction points vs. true momentum.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">Active Habits Roll-up</h3>
        <div className="space-y-3">
          {trackers.map((t) => (
            <div key={t.id} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-200">{t.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded">
                  Target: {t.target_value} {t.unit}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{t.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// GOAL HIERARCHY MAP VIEW
// -----------------------------------------------------------------------------
function HierarchyView({ trackers, pillars, goals }) {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">System Blueprint</span>
        <h2 className="text-xl font-bold text-white mb-1">Goal & Tracker Hierarchy</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Full 3-tier mapping connecting daily trackers to milestone goals across Professional, Health, and Personal pillars.
        </p>
      </div>

      <div className="space-y-6">
        {pillars.map((pillar) => {
          const pillarGoals = goals.filter((g) => g.pillar_id === pillar.id);

          return (
            <div key={pillar.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
              <div className="mb-4 border-b border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700">
                  {pillar.name} Pillar
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{pillar.subtitle || pillar.description}</h3>
              </div>

              <div className="space-y-4">
                {pillarGoals.map((goal) => {
                  const goalTrackers = trackers.filter((t) => t.goal_id === goal.id);

                  return (
                    <div key={goal.id} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5 space-y-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{goal.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{goal.description}</p>
                      </div>

                      <div className="space-y-2 pt-1">
                        {goalTrackers.map((t) => (
                          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded p-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-white">{t.name}</span>
                              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                                Target: {t.target_value} {t.unit}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">{t.rationale}</p>
                            {t.source && (
                              <span className="text-[9px] text-slate-500 block mt-1 italic">Grounding: {t.source}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ADD HABIT MODAL
// -----------------------------------------------------------------------------
function AddHabitModal({ pillars, goals, onSave, onClose }) {
  const [name, setName] = useState('');
  const [pillarId, setPillarId] = useState('pil_prof');
  const [goalId, setGoalId] = useState('gol_phase1_land');
  const [type, setType] = useState('boolean');
  const [unit, setUnit] = useState('check');
  const [targetValue, setTargetValue] = useState('1');
  const [rationale, setRationale] = useState('');

  const filteredGoals = useMemo(() => goals.filter((g) => g.pillar_id === pillarId), [goals, pillarId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !rationale.trim()) return;

    const selectedPillar = pillars.find((p) => p.id === pillarId);
    const newTracker = {
      id: `trk_${Date.now()}`,
      goal_id: goalId,
      pillar_name: selectedPillar ? selectedPillar.name : 'Professional',
      name: name.trim(),
      type,
      unit,
      frequency: 'daily',
      target_value: parseFloat(targetValue) || 1.0,
      rationale: rationale.trim(),
      source: 'User Custom Definition'
    };

    onSave(newTracker);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Add Custom Operating Habit</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Habit Name</label>
            <input
              type="text"
              placeholder="e.g. Zone 2 Cardio Block"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Pillar</label>
              <select
                value={pillarId}
                onChange={(e) => {
                  setPillarId(e.target.value);
                  const firstG = goals.find((g) => g.pillar_id === e.target.value);
                  if (firstG) setGoalId(firstG.id);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {pillars.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Milestone</label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {filteredGoals.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setUnit(e.target.value === 'boolean' ? 'check' : 'hours');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="boolean">Boolean (Check)</option>
                <option value="numeric">Numeric (Stepper)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Unit</label>
              <input
                type="text"
                placeholder="check, hours, grams"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Value</label>
              <input
                type="number"
                step="0.1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Operating Rationale (Why log this?)</label>
            <textarea
              rows={2}
              placeholder="State the specific leverage or health mechanism..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
