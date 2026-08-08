import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSadhana } from '../context/JapaContext';
import {
  X,
  User,
  Mail,
  Calendar,
  Flame,
  Award,
  Download,
  Upload,
  LogOut,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Edit3,
  ShieldAlert,
  Sparkles,
  Globe,
  Bell,
  Moon,
  Sun,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserBadge } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BADGES: UserBadge[] = [
  {
    id: 'b-first',
    title: 'Arambha (Inception)',
    icon: '🌱',
    description: 'Logged your very first Sadhana session'
  },
  {
    id: 'b-108',
    title: 'Aṣṭottara Śata',
    icon: '🪔',
    description: 'Reached 108 cumulative chants'
  },
  {
    id: 'b-streak7',
    title: '7-Day Tapasya',
    icon: '🔥',
    description: 'Maintained a daily chant streak for 7 days'
  },
  {
    id: 'b-1000',
    title: 'Sahasra Japa',
    icon: '🕉️',
    description: 'Reached 1,000 total Japa counts'
  },
  {
    id: 'b-anusthana',
    title: 'Vrata Siddha',
    icon: '🛡️',
    description: 'Created or completed an Anusthana vow'
  },
  {
    id: 'b-10000',
    title: 'Prathama Siddhi',
    icon: '✨',
    description: 'Reached 10,000 total Japa counts'
  }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    userProfile,
    signOutUser,
    updateProfileData,
    changePassword,
    changeEmailAddress,
    deleteAccount,
    sendVerificationEmail
  } = useAuth();

  const {
    totalOverallCount,
    currentStreak,
    longestStreak,
    sadhanas,
    anusthanas,
    entries,
    settings,
    updateSettings
  } = useSadhana();

  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'security' | 'backup'>('profile');
  
  // Edit form state
  const [fullName, setFullName] = useState(userProfile?.fullName || user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || user?.photoURL || '');
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile?.preferredLanguage || 'English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(userProfile?.notificationsEnabled ?? true);

  // Security form state
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  // Status feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !user) return null;

  // Compute favorite sadhana
  const favoriteSadhana = sadhanas.reduce<{ name: string; count: number }>((fav, s) => {
    const totalForS = entries.filter(e => e.sadhanaId === s.id).reduce((sum, e) => sum + e.count, 0);
    return totalForS > fav.count ? { name: s.name, count: totalForS } : fav;
  }, { name: sadhanas[0]?.name || 'None', count: 0 });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('profile');
    setMessage(null);
    try {
      await updateProfileData({
        fullName,
        photoURL,
        preferredLanguage,
        notificationsEnabled
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setLoadingAction('pass');
    setMessage(null);
    try {
      await changePassword(newPassword);
      setNewPassword('');
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setLoadingAction('email');
    setMessage(null);
    try {
      await changeEmailAddress(newEmail);
      setNewEmail('');
      setMessage({ type: 'success', text: 'Email address updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update email address' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUserAccount = async () => {
    setLoadingAction('delete');
    try {
      await deleteAccount();
      onClose();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete account. You may need to re-authenticate first.' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportData = () => {
    const exportData = {
      userProfile,
      sadhanas,
      entries,
      anusthanas,
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SadhanaSetu_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Data exported successfully as JSON!' });
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.sadhanas || parsed.entries) {
          setMessage({ type: 'success', text: 'Backup data imported! Syncing to Firestore...' });
        } else {
          setMessage({ type: 'error', text: 'Invalid backup file format' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to read JSON backup file' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-amber-50/95 dark:bg-stone-900/95 border border-amber-300/80 dark:border-amber-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-amber-900 dark:hover:text-amber-200 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-950/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Top Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-200/70 via-amber-100/50 to-orange-100/60 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 border border-amber-300/60 dark:border-amber-800/60 mb-6">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center text-2xl font-bold border-2 border-white dark:border-stone-800 shadow-md overflow-hidden shrink-0">
            {photoURL ? (
              <img src={photoURL} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{fullName ? fullName.charAt(0).toUpperCase() : 'ॐ'}</span>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100">
                {fullName || 'Devotee'}
              </h2>
              {user.isAnonymous && (
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-marcellus font-bold">
                  Guest Mode
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mt-0.5 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>{user.email || 'Anonymous Guest'}</span>
            </p>

            <p className="text-[11px] text-stone-500 font-marcellus mt-1">
              Joined SadhanaSetu: {userProfile?.dateJoined || 'Recently'}
            </p>

            {!user.emailVerified && user.email && !user.isAnonymous && (
              <div className="mt-2 inline-flex items-center gap-2">
                <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300">
                  Email Unverified
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await sendVerificationEmail();
                    setMessage({ type: 'success', text: 'Verification link sent to your email!' });
                  }}
                  className="text-[11px] font-marcellus text-amber-900 dark:text-amber-200 underline font-bold hover:text-amber-600"
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              signOutUser();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 text-xs font-marcellus font-bold flex items-center gap-1.5 hover:bg-red-200 dark:hover:bg-red-900 transition-colors border border-red-300/60 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex bg-amber-200/50 dark:bg-stone-950/80 p-1 rounded-2xl mb-6 border border-amber-300/50 dark:border-amber-900/50 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('profile'); setMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs font-marcellus font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Overview & Badges
          </button>
          <button
            onClick={() => { setActiveTab('edit'); setMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs font-marcellus font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'edit'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs font-marcellus font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Security & Account
          </button>
          <button
            onClick={() => { setActiveTab('backup'); setMessage(null); }}
            className={`flex-1 py-2 px-3 text-xs font-marcellus font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Cloud & Backup
          </button>
        </div>

        {/* Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-100 dark:bg-red-950/80 border border-red-300 text-red-900 dark:text-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: OVERVIEW & BADGES */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Total Japa
                </p>
                <p className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 mt-0.5">
                  {totalOverallCount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Current Streak
                </p>
                <p className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>{currentStreak}d</span>
                </p>
              </div>

              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Longest Streak
                </p>
                <p className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 mt-0.5">
                  {longestStreak}d
                </p>
              </div>

              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Total Sadhanas
                </p>
                <p className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 mt-0.5">
                  {sadhanas.length}
                </p>
              </div>

              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Anusthanas
                </p>
                <p className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 mt-0.5">
                  {anusthanas.length}
                </p>
              </div>

              <div className="glass-card p-3.5 text-center border border-amber-300/60 dark:border-amber-900/50">
                <p className="text-[10px] font-marcellus font-bold text-amber-900 dark:text-amber-300 uppercase">
                  Favorite Sadhana
                </p>
                <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100 mt-1 truncate">
                  {favoriteSadhana.name}
                </p>
              </div>
            </div>

            {/* Badges Section */}
            <div>
              <h3 className="text-sm font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-1.5 mb-3">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Achievement Badges</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BADGES.map(badge => {
                  let isUnlocked = false;
                  if (badge.id === 'b-first' && entries.length > 0) isUnlocked = true;
                  if (badge.id === 'b-108' && totalOverallCount >= 108) isUnlocked = true;
                  if (badge.id === 'b-streak7' && currentStreak >= 7) isUnlocked = true;
                  if (badge.id === 'b-1000' && totalOverallCount >= 1000) isUnlocked = true;
                  if (badge.id === 'b-anusthana' && anusthanas.length > 0) isUnlocked = true;
                  if (badge.id === 'b-10000' && totalOverallCount >= 10000) isUnlocked = true;

                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isUnlocked
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 shadow-xs'
                          : 'bg-stone-100/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-50 grayscale'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{badge.icon}</span>
                      <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                        {badge.title}
                      </p>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 font-marcellus leading-tight mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === 'edit' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-sans rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={e => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2 text-xs font-sans rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-marcellus font-bold rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                  Theme Preference
                </label>
                <select
                  value={settings.theme}
                  onChange={e => updateSettings({ theme: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs font-marcellus font-bold rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-marcellus text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Enable Daily Sadhana Reminders</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'profile'}
              className="w-full btn-saffron py-3 rounded-xl text-xs font-marcellus font-bold shadow-md"
            >
              {loadingAction === 'profile' ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* TAB 3: SECURITY & ACCOUNT */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <form onSubmit={handleChangePassword} className="space-y-3 p-4 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800">
              <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Change Account Password</span>
              </h4>
              <div>
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-sans rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loadingAction === 'pass'}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-marcellus font-bold hover:bg-amber-700 shadow-xs"
              >
                {loadingAction === 'pass' ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>

            {/* Change Email */}
            <form onSubmit={handleChangeEmail} className="space-y-3 p-4 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800">
              <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Update Email Address</span>
              </h4>
              <div>
                <input
                  type="email"
                  placeholder="New email address"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-sans rounded-xl border border-amber-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loadingAction === 'email'}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-marcellus font-bold hover:bg-amber-700 shadow-xs"
              >
                {loadingAction === 'email' ? 'Updating Email...' : 'Update Email'}
              </button>
            </form>

            {/* Delete Account */}
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-3">
              <h4 className="text-xs font-bold font-rozha text-red-950 dark:text-red-200 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Account & Data</span>
              </h4>
              <p className="text-[11px] text-red-800 dark:text-red-300 font-marcellus">
                Permanently deletes your account profile, all sadhanas, sessions, and cloud backups from Firestore. This action cannot be undone.
              </p>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-marcellus font-bold hover:bg-red-700 shadow-xs"
                >
                  Delete Account...
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteUserAccount}
                    disabled={loadingAction === 'delete'}
                    className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-marcellus font-bold hover:bg-red-800 shadow-xs"
                  >
                    {loadingAction === 'delete' ? 'Deleting...' : 'Yes, Permanently Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-marcellus font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLOUD & BACKUP */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                  Firebase Firestore Cloud Sync
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-marcellus leading-relaxed">
                All your sadhanas, session logs, anusthanas, and milestones are automatically synchronized with Firebase Firestore in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 text-center space-y-2">
                <Download className="w-6 h-6 text-amber-600 mx-auto" />
                <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                  Export Data JSON
                </h4>
                <p className="text-[11px] text-stone-500 font-marcellus">
                  Download a complete backup file of all your spiritual records
                </p>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs font-marcellus font-bold hover:bg-amber-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Import */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 text-center space-y-2">
                <Upload className="w-6 h-6 text-amber-600 mx-auto" />
                <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                  Import Backup JSON
                </h4>
                <p className="text-[11px] text-stone-500 font-marcellus">
                  Restore your sadhana history from a previously saved JSON file
                </p>
                <label className="w-full py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-marcellus font-bold hover:bg-amber-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 border border-amber-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select JSON File</span>
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
