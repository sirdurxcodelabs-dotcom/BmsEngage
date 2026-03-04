import * as React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
