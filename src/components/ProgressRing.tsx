import React from 'react';
import { motion } from 'motion/react';
import { formatNumber } from '../utils/formatters';

interface ProgressRingProps {
  title?: string;
  current: number;
  target: number;
  remaining: number;
  percentage: number;
  dailyTotal: number;
  unitLabel?: string;
  gradientColors?: [string, string, string];
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  title = 'Sadhana Progress',
  current,
  target,
  remaining,
  percentage,
  dailyTotal,
  unitLabel = 'Chants',
  gradientColors = ['#F59E0B', '#EA580C', '#D97706']
}) => {
  const size = 260;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-card">
      {/* Top sacred title accent */}
      {title && (
        <div className="text-center mb-4">
          <span className="text-xs font-marcellus font-bold tracking-widest text-amber-900 dark:text-amber-300 uppercase">
            {title}
          </span>
        </div>
      )}

      {/* Circular Progress Container */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-md">
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="text-amber-100/80 dark:text-stone-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="saffronGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="50%" stopColor={gradientColors[1]} />
              <stop offset="100%" stopColor={gradientColors[2]} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Animated Progress Arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#saffronGoldGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#glow)"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl font-serif text-amber-600 dark:text-amber-400 mb-0.5 opacity-90 select-none">
            🕉️
          </span>

          <motion.div
            key={current}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-950 dark:text-amber-100 font-rozha"
          >
            {formatNumber(current)}
          </motion.div>

          <div className="text-xs font-marcellus font-semibold text-amber-900/90 dark:text-amber-300 mt-0.5">
            / {formatNumber(target)} {unitLabel}
          </div>

          <div className="mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-white text-xs font-marcellus font-bold shadow-xs">
            {percentage.toFixed(1)}% Completed
          </div>
        </div>
      </div>

      {/* Sub Stats Row under Progress Ring */}
      <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-amber-200/50 dark:border-amber-900/30 text-center">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">Remaining</p>
          <p className="text-base font-bold text-stone-800 dark:text-stone-200">
            {formatNumber(remaining)}
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">Today's Progress</p>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">
            +{formatNumber(dailyTotal)}
          </p>
        </div>
      </div>
    </div>
  );
};
