import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} aspect-square relative flex items-center justify-center`}>
        {/* Stylized bars mimicking the provided logo */}
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          <div className="w-1/4 h-full bg-primary rounded-full transform -rotate-12 translate-y-1"></div>
          <div className="w-1/4 h-3/4 bg-primary/80 rounded-full transform -rotate-12"></div>
          <div className="w-1/4 h-1/2 bg-secondary rounded-full transform -rotate-12 -translate-y-1"></div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tighter text-text">BMS</span>
          <span className="text-xs font-semibold tracking-widest text-secondary uppercase">Engage</span>
        </div>
      )}
    </div>
  );
};
