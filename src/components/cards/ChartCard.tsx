import * as React from 'react';
import { cn } from '../../lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({ title, subtitle, children, className }: ChartCardProps) => {
  return (
    <div className={cn("bg-card border border-border p-6 rounded-2xl flex flex-col", className)}>
      <div className="mb-6">
        <h4 className="font-bold text-lg text-text">{title}</h4>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-[300px]">
        {children}
      </div>
    </div>
  );
};
