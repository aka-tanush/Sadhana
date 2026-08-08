import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { Milestone } from '../types';
import { Award, Lock, Sparkles, X, Share2, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const MilestonesPage: React.FC = () => {
  const { milestonesStatus, totalOverallCount } = useSadhana();
  const [selectedBadge, setSelectedBadge] = useState<(Milestone & { isAchieved: boolean; achievedAt?: number }) | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 text-xs font-marcellus font-bold mb-1.5 border border-amber-300/60">
            🏆 Sacred Accomplishments
          </div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <Award className="w-6 h-6 text-amber-600" />
            <span>Spiritual Milestone Badges</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Unlock sacred badges of devotion as your total chant count reaches spiritual milestones.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-white shadow-xs text-xs font-marcellus font-bold">
          Total Chants Logged: {formatNumber(totalOverallCount)}
        </div>
      </div>

      {/* Milestones Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {milestonesStatus.map(milestone => {
          return (
            <div
              key={milestone.targetCount}
              className={`glass-card p-6 border-2 flex flex-col justify-between transition-all ${
                milestone.isAchieved
                  ? 'border-amber-400 dark:border-amber-600 shadow-xl bg-gradient-to-b from-amber-500/5 to-transparent'
                  : 'border-stone-200/60 dark:border-stone-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Badge Icon Visual */}
                  <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border ${
                    milestone.isAchieved
                      ? 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white border-amber-300 shadow-amber-500/30'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 border-stone-300 dark:border-stone-700'
                  }`}>
                    <span>{milestone.isAchieved ? '🪷' : '🔒'}</span>
                    {milestone.isAchieved && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                        ✓
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      milestone.isAchieved
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {milestone.isAchieved ? 'Badge Earned!' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-1">
                  {milestone.title}
                </h3>

                {milestone.sanskritTitle && (
                  <p className="text-xs font-devanagari font-bold text-amber-800 dark:text-amber-300 mb-2">
                    {milestone.sanskritTitle}
                  </p>
                )}

                <p className="text-xs font-bold text-stone-700 dark:text-stone-300 font-mono mb-2">
                  Target: {milestone.targetCount.toLocaleString('en-IN')} Chants
                </p>

                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                  {milestone.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-stone-800">
                {milestone.isAchieved ? (
                  <button
                    onClick={() => setSelectedBadge(milestone)}
                    className="w-full btn-saffron py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Sacred Badge</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 justify-center py-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Requires {formatNumber(milestone.targetCount - totalOverallCount)} More Chants</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge View Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative max-w-sm w-full glass-card p-8 rounded-3xl border-2 border-amber-400 dark:border-amber-600 shadow-2xl text-center overflow-hidden">
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-orange-300/10 to-transparent pointer-events-none" />

            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 transition-colors z-10"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sacred Badge Emblem Display */}
            <div className="relative inline-flex flex-col items-center justify-center my-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 p-1 shadow-2xl shadow-amber-500/40 border-2 border-amber-200 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#1A0E2E] flex flex-col items-center justify-center text-white border border-amber-400/50 p-2">
                  <span className="text-4xl mb-1">🪷</span>
                  <span className="text-[10px] font-marcellus font-bold text-amber-300 uppercase tracking-widest">
                    Sacred Badge
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Unlocked</span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-marcellus font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300 mb-1">
                {selectedBadge.sanskritTitle || 'ॐ श्री परमात्मने नमः'}
              </p>
              <h3 className="text-2xl font-extrabold font-cinzel text-amber-950 dark:text-amber-100 mb-1">
                {selectedBadge.title}
              </h3>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-3 font-mono">
                {selectedBadge.targetCount.toLocaleString('en-IN')} Sacred Chants Completed
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white/60 dark:bg-stone-900/60 p-3 rounded-2xl border border-amber-200/50 dark:border-stone-800 mb-5">
                {selectedBadge.description}
              </p>

              {selectedBadge.achievedAt && (
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-marcellus mb-4">
                  Badge Earned On: {new Date(selectedBadge.achievedAt).toLocaleDateString('en-IN')}
                </p>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full btn-saffron py-2.5 px-4 text-xs font-bold rounded-2xl"
              >
                Close Badge View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

