import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Globe,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SadhanaSetuLogoSVG } from './SadhanaSetuLogoSVG';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithApple,
    signInWithGithub,
    signInGuest,
    sendPasswordReset,
    sendVerificationEmail,
    authError,
    setAuthError
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode === 'guest' ? 'signin' : initialMode);
  
  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-stone-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score: 50, label: 'Medium', color: 'bg-amber-500' };
    if (score === 4) return { score: 75, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 100, label: 'Very Strong', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoadingAction('signin');
    setSuccessMessage(null);
    try {
      await signInWithEmail(email, password, rememberMe);
      onClose();
    } catch (err) {
      // handled in context
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setAuthError('Please accept the Terms of Service & Privacy Policy');
      return;
    }
    setLoadingAction('signup');
    setSuccessMessage(null);
    try {
      await signUpWithEmail(fullName, email, password);
      setSuccessMessage('Account created! Verification email sent. Welcome to SadhanaSetu.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      // handled
    } finally {
      setLoadingAction(null);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }
    setLoadingAction('forgot');
    try {
      await sendPasswordReset(email);
      setSuccessMessage('Password reset link sent to your email.');
    } catch (err) {
      // handled
    } finally {
      setLoadingAction(null);
    }
  };

  const handleProviderLogin = async (providerName: string, action: () => Promise<void>) => {
    setLoadingAction(providerName);
    setSuccessMessage(null);
    try {
      await action();
      onClose();
    } catch (err) {
      // handled
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-amber-50/95 dark:bg-stone-900/95 border border-amber-300/80 dark:border-amber-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
      >
        {/* Sacred Om background icon */}
        <div className="absolute -right-8 -top-8 text-amber-500/10 dark:text-amber-400/10 text-[160px] font-serif pointer-events-none select-none">
          ॐ
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-amber-900 dark:hover:text-amber-200 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-950/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-[#1E1B4B] border border-amber-500/50 shadow-md mb-3">
            <SadhanaSetuLogoSVG size={44} variant="primary" showWordmark={false} />
          </div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100">
            {mode === 'signin' && 'Sign In to SadhanaSetu'}
            {mode === 'signup' && 'Create Sacred Devotee Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-marcellus mt-1">
            Securely save & sync your spiritual progress across all your devices
          </p>
        </div>

        {/* Tabs Switcher */}
        <div className="flex bg-amber-200/60 dark:bg-stone-950/80 p-1 rounded-2xl mb-6 border border-amber-300/50 dark:border-amber-900/50">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setAuthError(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-marcellus font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-marcellus font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Alert Messages */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{authError}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="devotee@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] font-marcellus text-amber-700 dark:text-amber-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-amber-800"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-marcellus text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember Me / Keep Signed In</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'signin'}
              className="w-full btn-saffron py-3 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {loadingAction === 'signin' ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Srikanth Sharma"
                  className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="devotee@example.com"
                  className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-amber-800"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Bar */}
              {password && (
                <div className="mt-1.5">
                  <div className="flex justify-between items-center text-[10px] text-stone-500 mb-0.5">
                    <span>Password Strength:</span>
                    <span className="font-bold">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="terms" className="text-xs font-marcellus text-stone-700 dark:text-stone-300">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-amber-800 dark:text-amber-300 font-bold underline"
                >
                  Terms & Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'signup'}
              className="w-full btn-saffron py-3 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {loadingAction === 'signup' ? 'Registering...' : 'Register Devotee Account'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-stone-600 dark:text-stone-300 font-marcellus leading-relaxed">
              Enter your registered email address below and we will send you a password reset link.
            </p>

            <div>
              <label className="block text-xs font-marcellus font-bold text-amber-950 dark:text-amber-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="devotee@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'forgot'}
              className="w-full btn-saffron py-3 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {loadingAction === 'forgot' ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs font-marcellus text-amber-800 dark:text-amber-300 font-bold hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* SOCIAL AUTH DIVIDER & BUTTONS */}
        {mode !== 'forgot' && (
          <div className="mt-6 pt-5 border-t border-amber-300/60 dark:border-amber-900/60">
            <p className="text-[11px] font-marcellus font-bold uppercase tracking-wider text-center text-stone-500 dark:text-stone-400 mb-3">
              Or Sign In With
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleProviderLogin('google', signInWithGoogle)}
                disabled={!!loadingAction}
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border border-amber-300/70 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 hover:bg-amber-100/60 dark:hover:bg-stone-800 text-amber-950 dark:text-amber-100 text-xs font-marcellus font-bold transition-all shadow-xs"
              >
                <span className="text-base">🌐</span>
                <span>Google</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleProviderLogin('microsoft', signInWithMicrosoft)}
                disabled={!!loadingAction}
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border border-amber-300/70 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 hover:bg-amber-100/60 dark:hover:bg-stone-800 text-amber-950 dark:text-amber-100 text-xs font-marcellus font-bold transition-all shadow-xs"
              >
                <span className="text-base">🪟</span>
                <span>Microsoft</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleProviderLogin('apple', signInWithApple)}
                disabled={!!loadingAction}
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border border-amber-300/70 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 hover:bg-amber-100/60 dark:hover:bg-stone-800 text-amber-950 dark:text-amber-100 text-xs font-marcellus font-bold transition-all shadow-xs"
              >
                <span className="text-base">🍏</span>
                <span>Apple</span>
              </button>
            </div>

            {/* Guest Sign-In */}
            <button
              type="button"
              onClick={() => handleProviderLogin('guest', signInGuest)}
              disabled={!!loadingAction}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-amber-400 dark:border-amber-700 bg-amber-100/40 dark:bg-amber-950/40 hover:bg-amber-200/50 text-amber-900 dark:text-amber-200 text-xs font-marcellus font-bold transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Continue as Anonymous Guest</span>
            </button>
          </div>
        )}

        {/* TERMS MODAL */}
        <AnimatePresence>
          {showTermsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
              <div className="bg-amber-50 dark:bg-stone-900 border border-amber-300 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold font-rozha text-amber-950 dark:text-amber-100 mb-2">
                  Terms of Service & Privacy
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 space-y-2 leading-relaxed">
                  <span>
                    SadhanaSetu is designed strictly for personal spiritual discipline and devotion. Your individual Sadhana counts, logs, and profile data are stored securely in your private cloud partition on Firebase Firestore.
                  </span>
                  <br /><br />
                  <span>
                    We respect user privacy and will never share or sell your data. You may export or delete your account at any time.
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="mt-4 w-full btn-saffron py-2 rounded-xl text-xs font-marcellus font-bold"
                >
                  I Understand
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
