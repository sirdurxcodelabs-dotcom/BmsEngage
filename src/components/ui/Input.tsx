import * as React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, suffix, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Left icon */}
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              'w-full h-11 rounded-xl text-sm text-text placeholder:text-text-muted/60 outline-none transition-all duration-200',
              // Background & border
              'bg-card/60 border border-border',
              // Padding
              icon ? 'pl-10 pr-4' : 'px-4',
              suffix ? 'pr-10' : '',
              // Focus ring
              'focus:border-primary/60 focus:ring-2 focus:ring-primary/15 focus:bg-card',
              // Hover
              'hover:border-border/80',
              // Error state
              error && 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />

          {/* Right suffix */}
          {suffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              {suffix}
            </div>
          )}
        </div>

        {/* Error or hint */}
        {error && (
          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-text-muted/70 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
