import React from 'react';
import { motion } from 'motion/react';
import { useJapa } from '../context/JapaContext';

export const FloatingLotus: React.FC = () => {
  const { settings } = useJapa();

  if (!settings.floatingLotusEnabled) return null;

  const lotusPetals = [
    { id: 1, size: 28, left: '8%', delay: 0, duration: 18, opacity: 0.12 },
    { id: 2, size: 36, left: '22%', delay: 4, duration: 22, opacity: 0.15 },
    { id: 3, size: 24, left: '42%', delay: 8, duration: 20, opacity: 0.10 },
    { id: 4, size: 40, left: '68%', delay: 2, duration: 24, opacity: 0.14 },
    { id: 5, size: 30, left: '88%', delay: 6, duration: 19, opacity: 0.12 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {lotusPetals.map(petal => (
        <motion.div
          key={petal.id}
          initial={{ y: '105vh', x: 0, rotate: 0 }}
          animate={{
            y: '-10vh',
            x: [0, 25, -20, 15, 0],
            rotate: [0, 45, 90, 135, 180]
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: petal.left,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity
          }}
          className="text-amber-500 dark:text-amber-400 select-none"
        >
          {/* Lotus Flower SVG Icon */}
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-sm">
            <path d="M50 15 C40 30, 30 45, 50 85 C70 45, 60 30, 50 15 Z" />
            <path d="M50 85 C30 75, 10 50, 20 35 C35 45, 45 65, 50 85 Z" />
            <path d="M50 85 C70 75, 90 50, 80 35 C65 45, 55 65, 50 85 Z" />
            <path d="M50 85 C20 85, 5 65, 10 50 C25 60, 40 75, 50 85 Z" />
            <path d="M50 85 C80 85, 95 65, 90 50 C75 60, 60 75, 50 85 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
