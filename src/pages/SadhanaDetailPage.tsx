import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { ProgressRing } from '../components/ProgressRing';
import { QuickAddButtons } from '../components/QuickAddButtons';
import { TimeOfDay } from '../types';
import {
  Flame,
  Calendar,
  Clock,
  RotateCcw,
  Edit3,
  Trash2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { formatNumber, getLocalDateString } from '../utils/formatters';

export const SadhanaDetailPage: React.FC = () => {
  const {
    sadhanas,
    selectedSadhana,
    setSelectedSadhanaId,
    entries,
    editEntry,
    deleteEntry,
    currentStreak,
    longestStreak
  } = useSadhana();

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editCount, setEditCount] = useState<number>(108);
  const [editTimeOfDay, setEditTimeOfDay] = useState<TimeOfDay>('Morning');
  const [editNotes, setEditNotes] = useState<string>('');

  if (!selectedSadhana) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-stone-500">No active Sadhana selected.</p>
      </div>
    );
  }

  // Calculate statistics for selected Sadhana
  const sadhanaEntries = entries.filter(e => e.sadhanaId === selectedSadhana.id);
  const currentCount = sadhanaEntries.reduce((s, e) => s + e.count, 0);
  const remainingCount = Math.max(0, selectedSadhana.targetCount - currentCount);
  const percentage = selectedSadhana.targetCount > 0 ? Math.min(100, (currentCount / selectedSadhana.targetCount) * 100) : 0;

  const todayStr = getLocalDateString(new Date());
  const todayCount = sadhanaEntries
    .filter(e => getLocalDateString(new Date(e.timestamp)) === todayStr)
    .reduce((s, e) => s + e.count, 0);

  // Daily goal progress percentage
  const dailyGoalPct = selectedSadhana.dailyGoal > 0 ? Math.min(100, (todayCount / selectedSadhana.dailyGoal) * 100) : 0;

  // Estimated completion date based on last 7 days average
  const getEstimatedCompletionDate = () => {
    if (remainingCount === 0) return 'Completed! 🎉';
    const totalCountLast7Days = sadhanaEntries
      .filter(e => e.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000)
      .reduce((s, e) => s + e.count, 0);
    const avgDaily = Math.max(1, totalCountLast7Days / 7);
    const daysNeeded = Math.ceil(remainingCount / avgDaily);

    const est = new Date();
    est.setDate(est.getDate() + daysNeeded);
    return est.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const estimatedDate = getEstimatedCompletionDate();

  const handleStartEdit = (entry: typeof entries[0]) => {
    setEditingSessionId(entry.id);
    setEditCount(entry.count);
    setEditTimeOfDay(entry.timeOfDay);
    setEditNotes(entry.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSessionId) {
      editEntry(editingSessionId, editCount, editTimeOfDay, editNotes);
      setEditingSessionId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Sadhana Switcher Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🕉️</span>
          <div>
            <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase tracking-widest">
              Active Session Sadhana
            </p>
            <h2 className="text-lg font-bold font-rozha text-amber-950 dark:text-amber-100 tracking-wide">
              {selectedSadhana.name}
            </h2>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="relative w-full sm:w-auto">
          <select
            value={selectedSadhana.id}
            onChange={e => setSelectedSadhanaId(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 text-xs font-marcellus font-bold rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/90 dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          >
            {sadhanas
              .filter(s => !s.isArchived)
              .map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Grid: Progress Ring & Quick Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Ring Column */}
        <div className="lg:col-span-5 space-y-4">
          <ProgressRing
            title={`${selectedSadhana.name} Completion`}
            current={currentCount}
            target={selectedSadhana.targetCount}
            remaining={remainingCount}
            percentage={percentage}
            dailyTotal={todayCount}
          />

          {/* Goal & Streak Card */}
          <div className="glass-card p-5 space-y-3 border border-amber-200/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-600 dark:text-stone-400">Daily Goal Progress</span>
              <span className="font-bold font-mono text-amber-900 dark:text-amber-200">
                {todayCount} / {selectedSadhana.dailyGoal} ({dailyGoalPct.toFixed(0)}%)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-amber-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: `${dailyGoalPct}%` }}
              />
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/40">
                <p className="text-[10px] text-stone-500">Current Streak</p>
                <p className="text-sm font-extrabold text-orange-600 font-mono mt-0.5">
                  🔥 {currentStreak} Days
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/40">
                <p className="text-[10px] text-stone-500">Est. Completion</p>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mt-1">
                  📅 {estimatedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Session Column */}
        <div className="lg:col-span-7 space-y-6">
          <QuickAddButtons />

          {/* Session History List for this Sadhana */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Chant Session Logs for {selectedSadhana.name}</span>
            </h3>

            {sadhanaEntries.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-8">
                No sessions logged for this Sadhana yet. Tap quick buttons above!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto no-scrollbar pr-1">
                {sadhanaEntries.map(entry => {
                  const dateStr = new Date(entry.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short'
                  });

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-amber-200/50 dark:border-stone-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center shrink-0">
                          {entry.timeOfDay === 'Morning' && '🌅'}
                          {entry.timeOfDay === 'Afternoon' && '☀️'}
                          {entry.timeOfDay === 'Evening' && '🌆'}
                          {entry.timeOfDay === 'Night' && '🌙'}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-950 dark:text-amber-100">
                              {entry.timeOfDay} Session
                            </span>
                            <span className="text-[10px] font-semibold text-stone-500">
                              • {dateStr}
                            </span>
                          </div>
                          {entry.notes && (
                            <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                              "{entry.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-800 dark:text-amber-300 text-sm">
                          +{entry.count}
                        </span>

                        <button
                          onClick={() => handleStartEdit(entry)}
                          className="p-1 rounded text-stone-400 hover:text-amber-700"
                          title="Edit Session"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Session Modal */}
      {editingSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-sm w-full glass-card p-6 border-2 border-amber-400">
            <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-4">
              Edit Session Entry
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Chant Count
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editCount}
                  onChange={e => setEditCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Time of Day
                </label>
                <select
                  value={editTimeOfDay}
                  onChange={e => setEditTimeOfDay(e.target.value as TimeOfDay)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSessionId(null)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-saffron py-2 text-xs font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
