import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useSadhana } from '../context/JapaContext';
import { Bell, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const MilestoneCelebrationModal: React.FC = () => {
  const { celebratingMilestone, dismissMilestoneCelebration, settings, setActiveTab } = useSadhana();

  useEffect(() => {
    if (celebratingMilestone) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EA580C', '#D97706', '#FEF08A', '#FFFFFF']
        });
      } catch {
        // Ignore canvas-confetti environment issues
      }
      soundManager.playTempleBell(settings.soundEnabled);
    }
  }, [celebratingMilestone, settings.soundEnabled]);

  if (!celebratingMilestone) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-md w-full glass-card p-6 sm:p-8 border-2 border-amber-400 dark:border-amber-600 shadow-2xl text-center overflow-hidden"
        >
          {/* Lotus Bloom Aura Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300/30 via-orange-100/10 to-transparent pointer-events-none" />

          {/* Temple Bell & Lotus Symbol */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/40">
            <motion.div
              animate={{ rotate: [-15, 15, -10, 10, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Bell className="w-10 h-10" />
            </motion.div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-300 animate-pulse" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
            🪷 Lotus Milestone Bloom
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-100 font-cinzel mb-1">
            {celebratingMilestone.sanskritTitle || celebratingMilestone.title}
          </h3>

          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-4">
            {celebratingMilestone.targetCount.toLocaleString('en-IN')} Sacred Chants Completed
          </p>

          <p className="text-stone-700 dark:text-stone-300 text-sm mb-6 leading-relaxed bg-white/70 dark:bg-stone-800/70 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/60">
            {celebratingMilestone.description}
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                dismissMilestoneCelebration();
                setActiveTab('milestones');
              }}
              className="btn-saffron py-3 px-6 text-sm font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>View Completion Certificate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playTempleBell(settings.soundEnabled);
                dismissMilestoneCelebration();
              }}
              className="py-2.5 px-4 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-amber-800 transition-colors"
            >
              Accept Blessings & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
