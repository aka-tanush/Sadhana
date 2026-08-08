import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { Milestone } from '../types';
import { Award, CheckCircle2, Lock, Printer, Sparkles, X, Share2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const MilestonesPage: React.FC = () => {
  const { milestonesStatus, settings, totalOverallCount } = useSadhana();
  const [selectedCertificate, setSelectedCertificate] = useState<(Milestone & { isAchieved: boolean; achievedAt?: number }) | null>(null);

  const handlePrint = () => {
    window.print();
  };

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
            <span>Spiritual Milestones & Certificates</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Unlock ceremonial certificates of completion as your total chant count reaches sacred milestones.
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
                  ? 'border-amber-400 dark:border-amber-600 shadow-xl'
                  : 'border-stone-200/60 dark:border-stone-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-lg shadow-md">
                    {milestone.isAchieved ? '🪷' : '🔒'}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      milestone.isAchieved
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}
                  >
                    {milestone.isAchieved ? 'Unlocked!' : 'In Progress'}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-cinzel text-amber-950 dark:text-amber-100 mb-1">
                  {milestone.title}
                </h3>

                {milestone.sanskritTitle && (
                  <p className="text-xs font-devanagari text-amber-800 dark:text-amber-300 mb-2">
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

              <div className="mt-4 pt-3 border-t border-amber-200/40">
                {milestone.isAchieved ? (
                  <button
                    onClick={() => setSelectedCertificate(milestone)}
                    className="w-full btn-saffron py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Completion Certificate</span>
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

      {/* Printable Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-[#FFFBF2] text-[#3D251E] p-8 sm:p-12 rounded-3xl border-4 border-[#D97706] shadow-2xl my-8">
            {/* Close & Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Decorative Border */}
            <div className="border-2 border-dashed border-[#B45309] p-6 rounded-2xl text-center relative overflow-hidden">
              <div className="text-4xl mb-2">ॐ</div>

              <p className="text-xs font-bold uppercase tracking-widest text-[#B45309] mb-1 font-serif">
                Certificate of Spiritual Accomplishment
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-[#78350F] my-2">
                SADHANA PURASCHARANA
              </h1>

              <p className="text-sm italic text-[#92400E] mb-6">
                This is solemnly awarded in recognition of sacred devotion and relentless discipline to
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1C1613] underline decoration-amber-500 decoration-2 mb-6">
                {settings.userName || 'Devoted Sadhaka'}
              </h2>

              <p className="text-sm text-[#3D251E] max-w-md mx-auto mb-6 leading-relaxed">
                For successfully fulfilling the sacred vow of chanting <br />
                <span className="font-extrabold text-[#B45309] text-base">
                  {selectedCertificate.targetCount.toLocaleString('en-IN')} Sacred Mantras
                </span>
                <br />
                achieving the milestone of <span className="font-bold">{selectedCertificate.title}</span>.
              </p>

              <div className="my-6 py-4 px-6 bg-[#FEF3C7] rounded-2xl border border-[#FCD34D] inline-block">
                <p className="text-sm font-devanagari font-bold text-[#78350F]">
                  {selectedCertificate.sanskritTitle || 'ॐ श्री परमात्मने नमः'}
                </p>
                <p className="text-xs italic text-[#92400E] mt-1">
                  "By continuous remembrance and meditation, divine light dawns in the heart."
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F59E0B]/40 flex items-center justify-between text-xs font-semibold text-[#78350F]">
                <div>
                  <p className="text-[10px] text-stone-500 uppercase">Awarded On</p>
                  <p>{selectedCertificate.achievedAt ? new Date(selectedCertificate.achievedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}</p>
                </div>

                <div className="text-center">
                  <span className="text-2xl">🪷</span>
                  <p className="text-[10px] uppercase font-bold text-[#B45309]">Sadhana Tracker Official Seal</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-stone-500 uppercase">Sanctuary Verification</p>
                  <p className="font-mono">ST-CERT-{(selectedCertificate.targetCount / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
