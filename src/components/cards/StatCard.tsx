import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export const StatCard = ({ label, value, change, trend }: StatCardProps) => {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group">
      <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors text-text">{value}</h3>
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
          trend === 'up' && "text-emerald-500 bg-emerald-500/10",
          trend === 'down' && "text-red-500 bg-red-500/10",
          trend === 'neutral' && "text-text-muted bg-white/5"
        )}>
          {trend === 'up' && <ArrowUpRight size={14} />}
          {trend === 'down' && <ArrowDownRight size={14} />}
          {trend === 'neutral' && <Minus size={14} />}
          {change}
        </div>
      </div>
    </div>
  );
};
