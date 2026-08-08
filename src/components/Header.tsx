import React from 'react';
import { useSadhana } from '../context/JapaContext';
import { soundManager } from '../utils/audio';
import { Bell, Moon, Sun, Flame, Sparkles, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    totalOverallCount,
    currentStreak,
    todayPanchanga,
    selectedSadhana,
    setActiveTab
  } = useSadhana();

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const handleRingBell = () => {
    soundManager.playTempleBell(true);
    soundManager.triggerVibration(settings.vibrationEnabled, [50, 80, 120]);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-amber-50/80 dark:bg-stone-950/85 border-b border-amber-300/60 dark:border-amber-900/50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRingBell}
            aria-label="Ring Temple Bell"
            title="Ring Sacred Temple Bell"
            className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 text-white shadow-md shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all focus:outline-none border border-amber-300/50"
          >
            <span className="absolute inset-0 rounded-2xl bg-amber-400/30 animate-pulse blur-sm -z-10 group-hover:bg-amber-300/50" />
            <span className="text-2xl font-serif select-none transition-transform group-hover:rotate-12">
              🕉️
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-rozha tracking-wide bg-gradient-to-r from-amber-950 via-orange-900 to-amber-800 dark:from-amber-100 dark:via-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                Sadhana Tracker
              </h1>
              {todayPanchanga.isEkadashi && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-marcellus font-bold rounded-full bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200 border border-amber-400/80 dark:border-amber-700 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Ekadashi Vrata
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2 font-marcellus">
              <span className="text-amber-900 dark:text-amber-300 font-semibold">{todayPanchanga.tithi}</span>
              <span className="hidden sm:inline text-amber-400">•</span>
              <span className="hidden sm:inline font-medium text-stone-600 dark:text-stone-300">
                {totalOverallCount.toLocaleString('en-IN')} Total Chants
              </span>
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Active Profile Indicator */}
          <button
            onClick={() => setActiveTab('settings')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-stone-900/90 text-amber-950 dark:text-amber-200 text-xs font-marcellus font-bold border border-amber-300/60 dark:border-amber-800/60 hover:bg-amber-200/60 transition-all shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{settings.activeProfile}</span>
          </button>

          {/* Streak Badge */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200 text-xs font-marcellus font-bold border border-orange-400/50 dark:border-orange-800/60 shadow-xs">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600 animate-pulse" />
              <span>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak</span>
            </div>
          )}

          {/* Temple Bell */}
          <button
            onClick={handleRingBell}
            aria-label="Ring Bell"
            title="Ring Sacred Temple Bell"
            className="p-2.5 rounded-xl text-amber-900 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-950/80 border border-transparent hover:border-amber-300/60 active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl text-amber-900 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-950/80 border border-transparent hover:border-amber-300/60 active:scale-95 transition-all"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-amber-800" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
