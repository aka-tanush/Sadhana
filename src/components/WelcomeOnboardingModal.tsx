import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSadhana } from '../context/JapaContext';
import { SADHANA_PRESETS } from '../data/sadhanaPresets';
import {
  Sparkles,
  Flame,
  Plus,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Award,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SadhanaSetuLogoSVG } from './SadhanaSetuLogoSVG';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, completeOnboarding } = useAuth();
  const { createSadhana, sadhanas, setActiveTab, setSelectedSadhanaId } = useSadhana();

  const [step, setStep] = useState<number>(1);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  if (!isOpen) return null;

  const handleCreateFirstSadhana = () => {
    const preset = SADHANA_PRESETS[selectedPresetIndex] || SADHANA_PRESETS[0];
    const newSadhana = createSadhana({
      name: preset.name,
      sanskritName: preset.sanskritName,
      category: preset.category,
      targetCount: preset.defaultTargetCount,
      dailyGoal: preset.defaultDailyGoal,
      startDate: new Date().toISOString().split('T')[0],
      description: preset.description,
      colorTheme: preset.colorTheme,
      icon: preset.icon
    });
    setSelectedSadhanaId(newSadhana.id);
    setStep(3); // Go to quick feature tour
  };

  const handleFinishOnboarding = async () => {
    await completeOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl bg-amber-50/95 dark:bg-stone-900/95 border border-amber-300/80 dark:border-amber-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
      >
        {/* Sacred Om background watermark */}
        <div className="absolute -right-6 -bottom-6 text-amber-500/10 dark:text-amber-400/10 text-[180px] font-serif pointer-events-none select-none">
          ॐ
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-[#1E1B4B] border border-amber-500/50 shadow-xl mb-3">
            <SadhanaSetuLogoSVG size={52} variant="primary" showWordmark={false} />
          </div>

          <p className="text-[11px] font-marcellus font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            Auspicious Beginning
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-rozha text-amber-950 dark:text-amber-100 tracking-wide mt-0.5">
            Welcome to SadhanaSetu
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-marcellus mt-1">
            Hari Om, {userProfile?.fullName || 'Devotee'}! Step into a disciplined space of spiritual japa & devotion.
          </p>
        </div>

        {/* STEP 1: WELCOME & INTENTION */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300/70 dark:border-amber-800/60 space-y-2">
              <h3 className="text-sm font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Sanatana Sadhana Discipline</span>
              </h3>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-marcellus leading-relaxed">
                Whether you chant 108 daily Gayatri Mantras, perform a 1.25 Lakh Anusthana vow, or track daily stotras, SadhanaSetu keeps your spiritual vows structured and synced across all your devices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                    Chant Logging
                  </p>
                  <p className="text-[10px] text-stone-500 font-marcellus">
                    Real-time beads counter
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                    Anusthana Vows
                  </p>
                  <p className="text-[10px] text-stone-500 font-marcellus">
                    Calculated daily pace
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-saffron py-3.5 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <span>Create Your First Sadhana</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CREATE FIRST SADHANA */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Select a Sacred Mantra Preset</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {SADHANA_PRESETS.slice(0, 6).map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setSelectedPresetIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPresetIndex === idx
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 dark:border-amber-700 shadow-sm'
                      : 'bg-white/80 dark:bg-stone-950/60 border-amber-200 dark:border-stone-800 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                      {preset.name}
                    </span>
                    {selectedPresetIndex === idx && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  {preset.sanskritName && (
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-serif mt-0.5">
                      {preset.sanskritName}
                    </p>
                  )}
                  <p className="text-[10px] text-stone-500 font-marcellus mt-1">
                    Goal: {preset.defaultDailyGoal} chants/day
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCreateFirstSadhana}
                className="flex-1 btn-saffron py-3 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Initialize Selected Sadhana</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: QUICK TOUR */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold font-rozha text-emerald-950 dark:text-emerald-200">
                  First Sadhana Created!
                </p>
                <p className="text-[11px] text-emerald-900 dark:text-emerald-300 font-marcellus">
                  Your daily goal and targets are set and synced to Firebase.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                Quick Feature Tour:
              </h4>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 flex items-center gap-3">
                <span className="text-xl">📿</span>
                <div>
                  <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                    Add Chant Tab
                  </p>
                  <p className="text-[10px] text-stone-500 font-marcellus">
                    Interactive digital Mala bead counter with haptic click feedback
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                    Calendar & Panchanga
                  </p>
                  <p className="text-[10px] text-stone-500 font-marcellus">
                    Heatmap consistency & Vedic Tithi/Ekadashi alignment
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-950/60 border border-amber-300/60 dark:border-stone-800 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold font-rozha text-amber-950 dark:text-amber-100">
                    Milestone Badges
                  </p>
                  <p className="text-[10px] text-stone-500 font-marcellus">
                    Unlock sacred badges at 108, 1008, 10,000, 1 Lakh chants
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full btn-saffron py-3.5 rounded-xl text-xs font-marcellus font-bold flex items-center justify-center gap-2 shadow-md mt-2"
            >
              <span>Begin Sacred Sadhana Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
