import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export const Select = ({ label, options, className, error, hint, icon, id, required, ...props }: SelectProps) => {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10">
            {icon}
          </div>
        )}

        <select
          id={selectId}
          required={required}
          {...props}
          className={cn(
            // Base
            'w-full h-11 appearance-none rounded-xl text-sm font-medium outline-none transition-all duration-200 cursor-pointer',
            // Padding
            icon ? 'pl-10 pr-10' : 'px-4 pr-10',
            // Colors
            'bg-card/60 border border-border text-text',
            // Focus
            'focus:border-primary/60 focus:ring-2 focus:ring-primary/15 focus:bg-card',
            // Hover
            'hover:border-border/80',
            // Option theming
            '[&>option]:bg-[var(--card)] [&>option]:text-[var(--text)]',
            // Error
            error && 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15',
            // Disabled
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-focus-within:text-primary"
          size={15}
        />
      </div>

      {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
      {hint && !error && <p className="text-[11px] text-text-muted/70 mt-1">{hint}</p>}
    </div>
  );
};
