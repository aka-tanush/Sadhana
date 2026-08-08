import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../utils/audio';
import { Bell, Moon, Sun, Flame, Sparkles, User as UserIcon, LogIn } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { SadhanaSetuLogoSVG } from './SadhanaSetuLogoSVG';
import { LogoViewerModal } from './LogoViewerModal';

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

  const { user, userProfile } = useAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const handleRingBell = () => {
    soundManager.playTempleBell(true);
    soundManager.triggerVibration(settings.vibrationEnabled, [50, 80, 120]);
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-amber-50/80 dark:bg-stone-950/85 border-b border-amber-300/60 dark:border-amber-900/50 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogoModal(true)}
              aria-label="View SadhanaSetu Logo"
              title="Click to view full SadhanaSetu Logo"
              className="group relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1E1B4B] shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none border border-amber-500/40 p-1 cursor-pointer"
            >
              <SadhanaSetuLogoSVG size={36} variant="primary" showWordmark={false} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogoModal(true)}
                  aria-label="View SadhanaSetu Logo"
                  title="Click to view full SadhanaSetu Logo"
                  className="text-lg sm:text-xl font-rozha tracking-wide bg-gradient-to-r from-amber-950 via-orange-900 to-amber-800 dark:from-amber-100 dark:via-amber-200 dark:to-orange-200 bg-clip-text text-transparent hover:opacity-90 transition-opacity cursor-pointer"
                >
                  SadhanaSetu
                </button>
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
            {/* User Profile / Auth Button */}
            {user ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/90 dark:bg-stone-900 text-amber-950 dark:text-amber-200 text-xs font-marcellus font-bold border border-amber-300/70 dark:border-amber-800/80 hover:bg-amber-200/60 transition-all shadow-xs"
              >
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  {userProfile?.photoURL || user.photoURL ? (
                    <img src={userProfile?.photoURL || user.photoURL!} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(userProfile?.fullName || user.displayName || 'Devotee').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {userProfile?.fullName || user.displayName || 'Devotee'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-marcellus font-bold hover:bg-amber-700 transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Profile Modal */}
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Logo Viewer Modal */}
      <LogoViewerModal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} />
    </>
  );
};
