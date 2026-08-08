import React from 'react';
import { useSadhana } from '../context/JapaContext';
import { ProgressRing } from '../components/ProgressRing';
import { QuickAddButtons } from '../components/QuickAddButtons';
import { getTodayQuote } from '../data/quotes';
import {
  Flame,
  Plus,
  ShieldAlert,
  ArrowRight,
  Sun,
  Calendar,
  Sparkles,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    sadhanas,
    selectedSadhana,
    setSelectedSadhanaId,
    totalOverallCount,
    todayOverallCount,
    currentStreak,
    longestStreak,
    activeAnusthanasCalculated,
    todayPanchanga,
    entries,
    addChantSession,
    setActiveTab
  } = useSadhana();

  const quote = getTodayQuote();
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate greeting by hour
  const getSanskritGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return { text: 'शुभ प्रभातम्', meaning: 'Auspicious Morning' };
    if (hour >= 12 && hour < 17) return { text: 'शुभ मध्याह्नम्', meaning: 'Blessed Afternoon' };
    if (hour >= 17 && hour < 21) return { text: 'शुभ सायंकालः', meaning: 'Serene Evening' };
    return { text: 'शुभ रात्रिः', meaning: 'Peaceful Night' };
  };

  const greeting = getSanskritGreeting();

  // Find behind-schedule Anusthanas for warning banner
  const behindAnusthana = activeAnusthanasCalculated.find(
    a => !a.isOnTrack && a.remainingCount > 0
  );

  return (
    <div className="space-[#space-y-6] space-y-6 pb-12">
      {/* Hero Greeting & Panchanga Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-amber-300/80 dark:border-amber-900/60 shadow-md">
        {/* Subtle Ambient Om Background Glow */}
        <div className="absolute -right-6 -bottom-8 text-amber-600/10 dark:text-amber-400/10 text-[190px] font-serif select-none pointer-events-none font-bold">
          ॐ
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-amber-900 dark:text-amber-300 text-xs font-marcellus font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{todayFormatted}</span>
              <span className="text-amber-400">•</span>
              <span className="font-devanagari text-amber-800 dark:text-amber-300">{todayPanchanga.tithi}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-100 font-cinzel flex flex-wrap items-baseline gap-2">
              <span className="font-devanagari text-amber-700 dark:text-amber-300 font-bold">
                {greeting.text}
              </span>
              <span className="text-sm font-marcellus text-stone-600 dark:text-stone-300 font-normal">
                ({greeting.meaning})
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1.5 max-w-xl font-sans leading-relaxed">
              Welcome to your sacred space. May your spiritual discipline bring peace, clarity, and divine grace today.
            </p>

            {/* Panchanga Highlights Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {todayPanchanga.isEkadashi && (
                <span className="px-3 py-1 rounded-full text-xs font-marcellus font-bold bg-amber-600 text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pavitra Ekadashi Vrata
                </span>
              )}
              {todayPanchanga.isPurnima && (
                <span className="px-3 py-1 rounded-full text-xs font-marcellus font-bold bg-amber-100 text-amber-950 border border-amber-300/80 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  Full Moon (Purnima)
                </span>
              )}
              {todayPanchanga.festivalName && (
                <span className="px-3 py-1 rounded-full text-xs font-marcellus font-bold bg-orange-100 text-orange-950 border border-orange-300/80 flex items-center gap-1">
                  <span>🌺</span> {todayPanchanga.festivalName}
                </span>
              )}
            </div>
          </div>

          {/* Quick Streak & Overall Stats Card */}
          <div className="flex items-center gap-3.5 bg-amber-100/60 dark:bg-stone-900/90 p-4 rounded-2xl border border-amber-300/70 dark:border-amber-800/60 shadow-xs">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-amber-500 text-white shadow-md shadow-orange-600/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-marcellus font-bold">Active Streak</p>
              <p className="text-xl font-bold text-amber-950 dark:text-amber-100 font-rozha tracking-wide">
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 font-marcellus font-medium">
                Best: {longestStreak} Days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Anusthana Warning Alert Banner if behind schedule */}
      {behindAnusthana && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 dark:bg-amber-950/40 flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Anusthana Pace Notice: {behindAnusthana.title}
              </h4>
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                You need <span className="font-extrabold text-orange-600 dark:text-orange-400">{behindAnusthana.dailyRequiredCount}</span> chants today to stay on track for your target completion date.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('anusthana')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-all shrink-0 flex items-center gap-1"
          >
            <span>View Anusthana</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Selected Sadhana Progress Ring & Quick Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Progress Ring */}
        <div className="lg:col-span-5">
          {selectedSadhana ? (
            <ProgressRing
              title={`${selectedSadhana.name} Progress`}
              current={entries.filter(e => e.sadhanaId === selectedSadhana.id).reduce((s, e) => s + e.count, 0)}
              target={selectedSadhana.targetCount}
              remaining={Math.max(0, selectedSadhana.targetCount - entries.filter(e => e.sadhanaId === selectedSadhana.id).reduce((s, e) => s + e.count, 0))}
              percentage={
                selectedSadhana.targetCount > 0
                  ? Math.min(
                      100,
                      (entries.filter(e => e.sadhanaId === selectedSadhana.id).reduce((s, e) => s + e.count, 0) /
                        selectedSadhana.targetCount) *
                        100
                    )
                  : 0
              }
              dailyTotal={entries
                .filter(
                  e =>
                    e.sadhanaId === selectedSadhana.id &&
                    new Date(e.timestamp).toDateString() === new Date().toDateString()
                )
                .reduce((s, e) => s + e.count, 0)}
            />
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-stone-500">No active Sadhana selected.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Add Session Logger */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <QuickAddButtons />

          {/* Today Summary Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card p-4 text-center border border-amber-200/50">
              <p className="text-xs text-stone-500 font-medium">Today's Chants</p>
              <p className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono mt-1">
                +{formatNumber(todayOverallCount)}
              </p>
            </div>

            <div className="glass-card p-4 text-center border border-amber-200/50">
              <p className="text-xs text-stone-500 font-medium">Lifetime Chants</p>
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono mt-1">
                {formatNumber(totalOverallCount)}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 glass-card p-4 text-center border border-amber-200/50">
              <p className="text-xs text-stone-500 font-medium">Active Sadhanas</p>
              <p className="text-2xl font-black text-amber-800 dark:text-amber-200 font-mono mt-1">
                {sadhanas.filter(s => !s.isArchived).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sadhanas Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-cinzel text-amber-950 dark:text-amber-100 flex items-center gap-2">
            <span>📿</span> Active Sadhanas
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sadhanas')}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sadhanas
            .filter(s => !s.isArchived)
            .map(sadhana => {
              const isSelected = selectedSadhana?.id === sadhana.id;
              const current = entries
                .filter(e => e.sadhanaId === sadhana.id)
                .reduce((s, e) => s + e.count, 0);
              const pct = Math.min(100, (current / sadhana.targetCount) * 100);

              return (
                <div
                  key={sadhana.id}
                  onClick={() => setSelectedSadhanaId(sadhana.id)}
                  className={`glass-card p-5 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                      : 'border-amber-200/60 dark:border-amber-900/40 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/50 mb-1">
                        {sadhana.category}
                      </span>
                      <h4 className="text-base font-bold text-amber-950 dark:text-amber-100">
                        {sadhana.name}
                      </h4>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        addChantSession(108, sadhana.id, 'Morning', 'Quick Mala');
                      }}
                      title="Quick Add 108 Chants"
                      className="p-2 rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-all text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+108</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mb-3">
                    {sadhana.description || sadhana.sanskritName || 'Sacred Sadhana practice.'}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                      <span>{formatNumber(current)}</span>
                      <span>/ {formatNumber(sadhana.targetCount)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-amber-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Daily Spiritual Shloka & Reflection */}
      <div className="temple-card p-6 sm:p-7 relative overflow-hidden">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs font-marcellus font-bold uppercase tracking-wider mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Daily Shloka & Spiritual Reflection • {quote.source}</span>
        </div>

        <p className="text-xl sm:text-2xl font-devanagari font-bold text-amber-950 dark:text-amber-100 mb-3 leading-relaxed tracking-wide">
          {quote.sanskrit}
        </p>

        <p className="text-xs sm:text-sm italic font-marcellus text-amber-900 dark:text-amber-200 mb-3 leading-relaxed">
          "{quote.englishMeaning}"
        </p>

        <div className="text-xs text-stone-700 dark:text-stone-300 bg-amber-100/60 dark:bg-stone-900/80 p-3.5 rounded-xl border border-amber-300/60 dark:border-amber-800/60">
          <span className="font-marcellus font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider text-[11px] block mb-1">
            🪷 Spiritual Guidance:
          </span>
          <p className="leading-relaxed">{quote.reflection}</p>
        </div>
      </div>

      {/* Recent Activity Sessions Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Recent Session Activity</span>
          </h3>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
          >
            View Calendar
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-6">No sessions logged yet. Tap +108 above to begin!</p>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 5).map(entry => {
              const sadhana = sadhanas.find(s => s.id === entry.sadhanaId);
              const dateStr = new Date(entry.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short'
              });

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-amber-200/40 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center shrink-0">
                      📿
                    </span>
                    <div>
                      <p className="font-bold text-amber-950 dark:text-amber-100">
                        {sadhana?.name || 'General Sadhana'}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {entry.timeOfDay} • {dateStr} {entry.notes ? `• ${entry.notes}` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-amber-700 dark:text-amber-300 text-sm">
                    +{entry.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
