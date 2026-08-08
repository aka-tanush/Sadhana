import React, { useState, MouseEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'saffron' | 'gold';
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now() + Math.random()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    saffron:
      'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:shadow-lg active:scale-[0.98]',
    gold: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-amber-950 font-bold shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/60 dark:border-amber-800/50',
    outline:
      'border border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 active:bg-amber-500/20',
    ghost:
      'text-amber-800 dark:text-amber-200 hover:bg-amber-500/10 active:bg-amber-500/20'
  };

  return (
    <button
      className={`relative overflow-hidden transition-all duration-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping duration-500"
          style={{
            top: r.y,
            left: r.x,
            width: r.size,
            height: r.size
          }}
        />
      ))}
    </button>
  );
};
