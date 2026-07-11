import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'blue' | 'green' | 'purple' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = 'none',
  hoverEffect = false,
  ...props
}) => {
  const glowClasses = {
    blue: 'border-neonBlue/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]',
    green: 'border-emeraldGreen/20 shadow-[0_0_15px_rgba(0,255,135,0.1)]',
    purple: 'border-stadiumPurple/20 shadow-[0_0_15px_rgba(127,0,255,0.1)]',
    none: 'border-white/5 shadow-glass',
  };

  return (
    <div
      className={twMerge(
        'glass rounded-2xl p-6 border transition-all duration-300',
        glowClasses[glowColor],
        hoverEffect && 'glass-hover hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
