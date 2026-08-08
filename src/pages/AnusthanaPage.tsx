import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { ShieldCheck, Plus, AlertCircle, CheckCircle2, Calendar, Trash2, X, Sparkles } from 'lucide-react';
import { formatNumber, getLocalDateString } from '../utils/formatters';

export const AnusthanaPage: React.FC = () => {
  const {
    sadhanas,
    activeAnusthanasCalculated,
    createAnusthana,
    deleteAnusthana,
    setActiveTab,
    setSelectedSadhanaId
  } = useSadhana();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [sanskritTitle, setSanskritTitle] = useState('');
  const [sadhanaId, setSadhanaId] = useState(sadhanas[0]?.id || '');
  const [startDate, setStartDate] = useState(getLocalDateString(new Date()));

  const today = new Date();
  const defaultEnd = new Date(today);
  defaultEnd.setDate(today.getDate() + 40);
  const [endDate, setEndDate] = useState(getLocalDateString(defaultEnd));

  const [targetCount, setTargetCount] = useState<number>(24000);
  const [numberOfDays, setNumberOfDays] = useState<number>(40);
  const [notes, setNotes] = useState('');

  const PRESET_ANUSTHANAS = [
    { title: 'Gayatri Purascharana', target: 24000, days: 40 },
    { title: 'Mahamrityunjaya Anusthana', target: 125000, days: 41 },
    { title: 'Lakshmi Siddhi Japa', target: 100000, days: 40 },
    { title: 'Sri Vidya Navavarana Anusthana', target: 10000, days: 9 }
  ];

  const handleApplyPreset = (p: typeof PRESET_ANUSTHANAS[0]) => {
    setTitle(p.title);
    setTargetCount(p.target);
    setNumberOfDays(p.days);

    const end = new Date(startDate);
    end.setDate(end.getDate() + p.days);
    setEndDate(getLocalDateString(end));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sadhanaId) return;

    createAnusthana({
      title,
      sanskritTitle,
      sadhanaId,
      startDate,
      endDate,
      targetCount,
      numberOfDays,
      notes
    });

    setShowModal(false);
    setTitle('');
    setSanskritTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 text-xs font-marcellus font-bold mb-1.5 border border-amber-300/60">
            🪔 Sacred Vrata & Purascharana
          </div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <span>Anusthana Tracker</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl mt-1">
            A discipline-bound spiritual vow with calculated daily pace targets to guarantee on-time completion.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-saffron px-5 py-3 rounded-xl text-xs font-marcellus font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Anusthana</span>
        </button>
      </div>

      {/* Active Anusthanas List */}
      <div className="space-y-4">
        {activeAnusthanasCalculated.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-stone-500 text-sm mb-4">No active Anusthana created yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-saffron px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Anusthana</span>
            </button>
          </div>
        ) : (
          activeAnusthanasCalculated.map(anusthana => {
            const percentage = Math.min(
              100,
              (anusthana.currentCount / anusthana.targetCount) * 100
            );

            return (
              <div
                key={anusthana.id}
                className="glass-card p-6 border-2 border-amber-200/80 dark:border-amber-900/50 relative"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-200/40">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                        Anusthana Vrata
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {anusthana.startDate} to {anusthana.endDate} ({anusthana.numberOfDays} Days)
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-cinzel text-amber-950 dark:text-amber-100">
                      {anusthana.title}
                    </h3>
                    {anusthana.sanskritTitle && (
                      <p className="text-xs font-devanagari text-amber-800 dark:text-amber-300">
                        {anusthana.sanskritTitle}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteAnusthana(anusthana.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-100/60 transition-colors self-start md:self-auto"
                    title="Delete Anusthana"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Daily Schedule Pace Banner */}
                <div className={`p-4 rounded-2xl mb-4 text-xs font-bold flex items-center gap-3 border ${
                  anusthana.isOnTrack
                    ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-emerald-300/50'
                    : 'bg-orange-500/15 text-orange-950 dark:text-orange-200 border-orange-400/60'
                }`}>
                  {anusthana.isOnTrack ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                  )}

                  <div className="flex-1">
                    {anusthana.isOnTrack ? (
                      <span>
                        On Schedule! You have chanted <span className="font-extrabold">{anusthana.todayChanted}</span> today (Required: {anusthana.dailyRequiredCount}).
                      </span>
                    ) : (
                      <span>
                        Notice: You need <span className="font-extrabold text-orange-600 underline text-sm">{anusthana.dailyRequiredCount}</span> chants today to stay on track for completion ({anusthana.daysRemaining} days remaining).
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSadhanaId(anusthana.sadhanaId);
                      setActiveTab('detail');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shrink-0"
                  >
                    Chant Now
                  </button>
                </div>

                {/* Stats & Progress */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs mb-4">
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-stone-800/60 border border-amber-200/40">
                    <p className="text-[10px] text-stone-500">Current Progress</p>
                    <p className="text-base font-bold text-amber-950 dark:text-amber-100 font-mono mt-0.5">
                      {formatNumber(anusthana.currentCount)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/60 dark:bg-stone-800/60 border border-amber-200/40">
                    <p className="text-[10px] text-stone-500">Remaining Count</p>
                    <p className="text-base font-bold text-orange-600 font-mono mt-0.5">
                      {formatNumber(anusthana.remainingCount)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/60 dark:bg-stone-800/60 border border-amber-200/40">
                    <p className="text-[10px] text-stone-500">Daily Required</p>
                    <p className="text-base font-bold text-amber-700 font-mono mt-0.5">
                      {anusthana.dailyRequiredCount} / Day
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/60 dark:bg-stone-800/60 border border-amber-200/40">
                    <p className="text-[10px] text-stone-500">Days Remaining</p>
                    <p className="text-base font-bold text-stone-800 font-mono mt-0.5">
                      {anusthana.daysRemaining} Days
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-amber-900 dark:text-amber-200 font-mono">
                    <span>Overall Anusthana Progress</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-amber-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Anusthana Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-lg w-full glass-card p-6 border-2 border-amber-400 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 mb-4">
              <h3 className="text-lg font-bold font-cinzel text-amber-950 dark:text-amber-100">
                Create Sacred Anusthana
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Classic Anusthana Templates</span>
              </p>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {PRESET_ANUSTHANAS.map(p => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300/50 whitespace-nowrap"
                  >
                    {p.title} ({p.days}d)
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Anusthana Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gayatri Purascharana 24,000"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Link to Sadhana Mantra *
                </label>
                <select
                  value={sadhanaId}
                  onChange={e => setSadhanaId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                >
                  {sadhanas.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Target Count Goal
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={targetCount}
                    onChange={e => setTargetCount(parseInt(e.target.value, 10) || 108)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={numberOfDays}
                    onChange={e => {
                      const num = parseInt(e.target.value, 10) || 1;
                      setNumberOfDays(num);
                      const end = new Date(startDate);
                      end.setDate(end.getDate() + num);
                      setEndDate(getLocalDateString(end));
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-saffron py-2.5 text-xs font-bold rounded-xl"
                >
                  Save Anusthana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
