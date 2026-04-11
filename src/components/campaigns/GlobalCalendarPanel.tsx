import * as React from 'react';
import { Globe, Plus, ChevronDown, ChevronUp, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GLOBAL_CALENDAR, GLOBAL_CATEGORIES, GlobalEvent, getEventDate } from '../../lib/globalCalendar';
import { campaignEventService, CampaignEvent } from '../../services/campaignEventService';
import { useToast } from '../ui/Toast';
import { format } from 'date-fns';

interface Props {
  existingEvents: CampaignEvent[];
  onAdded: (event: CampaignEvent) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const GlobalCalendarPanel = ({ existingEvents, onAdded }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [activeMonth, setActiveMonth] = React.useState<number | null>(null); // 1-12 or null = all
  const [adding, setAdding] = React.useState<string | null>(null);
  const [added, setAdded] = React.useState<Set<string>>(new Set());

  const year = new Date().getFullYear();

  // Pre-mark events that already exist in the agency calendar
  React.useEffect(() => {
    const titles = new Set(existingEvents.map(e => e.title));
    const preAdded = new Set(GLOBAL_CALENDAR.filter(e => titles.has(e.title)).map(e => e.mmdd + e.title));
    setAdded(preAdded);
  }, [existingEvents]);

  const filtered = GLOBAL_CALENDAR.filter(e => {
    if (activeCategory !== 'All' && e.category !== activeCategory) return false;
    if (activeMonth !== null) {
      const month = parseInt(e.mmdd.split('-')[0], 10);
      if (month !== activeMonth) return false;
    }
    return true;
  }).sort((a, b) => a.mmdd.localeCompare(b.mmdd));

  // Count events per month for the badge
  const monthCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    GLOBAL_CALENDAR.forEach(e => {
      if (activeCategory !== 'All' && e.category !== activeCategory) return;
      const m = parseInt(e.mmdd.split('-')[0], 10);
      counts[m] = (counts[m] || 0) + 1;
    });
    return counts;
  }, [activeCategory]);

  const handleAdd = async (event: GlobalEvent) => {
    const key = event.mmdd + event.title;
    if (added.has(key)) return;
    setAdding(key);
    try {
      const created = await campaignEventService.create({
        title: event.title,
        category: event.category,
        date: getEventDate(event.mmdd, year).toISOString(),
        region: event.region,
        tags: event.tags,
        recurrence: 'yearly',
        isMonthlyEvent: false,
      });
      setAdded(prev => new Set([...prev, key]));
      onAdded(created);
      toast(`"${event.title}" added to your calendar`, 'success');
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Failed to add event', 'error');
    } finally { setAdding(null); }
  };

  const handleAddAll = async () => {
    const toAdd = filtered.filter(e => !added.has(e.mmdd + e.title));
    for (const event of toAdd) await handleAdd(event);
  };

  return (
    <div className="glass border border-white/10 rounded-[20px] overflow-hidden">
      {/* Header toggle */}
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Globe size={18} />
          </div>
          <div className="text-left">
            <p className="font-black text-sm text-text">Global Campaign Calendar</p>
            <p className="text-[10px] text-text-muted">{GLOBAL_CALENDAR.length} pre-built yearly events â€” holidays, awareness days, sales seasons</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-text-muted shrink-0" /> : <ChevronDown size={18} className="text-text-muted shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-white/10 pt-4">

              {/* â”€â”€ Month filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Month</span>
                  {activeMonth !== null && (
                    <button
                      onClick={() => setActiveMonth(null)}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Show all months
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const monthNum = i + 1;
                    const count = monthCounts[monthNum] || 0;
                    const isActive = activeMonth === monthNum;
                    return (
                      <button
                        key={m}
                        onClick={() => setActiveMonth(isActive ? null : monthNum)}
                        className={cn(
                          'relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all',
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white/5 border border-white/10 text-text-muted hover:text-text hover:border-primary/30'
                        )}
                      >
                        <span>{m}</span>
                        {count > 0 && (
                          <span className={cn(
                            'text-[8px] font-black mt-0.5',
                            isActive ? 'text-white/70' : 'text-primary/60'
                          )}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* â”€â”€ Category filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Category:</span>
                {['All', ...GLOBAL_CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={cn('px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      activeCategory === cat ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-text-muted hover:text-text')}>
                    {cat}
                  </button>
                ))}
                <button onClick={handleAddAll}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20">
                  <Plus size={11} />
                  Add All {filtered.length > 0 ? `(${filtered.length})` : ''}
                  {activeMonth !== null ? ` ${MONTHS[activeMonth - 1]}` : ''}
                  {activeCategory !== 'All' ? ` ${activeCategory}` : ''}
                </button>
              </div>

              {/* â”€â”€ Results summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              {(activeMonth !== null || activeCategory !== 'All') && (
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Showing <span className="text-text font-bold">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}</span>
                  {activeMonth !== null && <span>in <span className="text-primary font-bold">{MONTHS[activeMonth - 1]}</span></span>}
                  {activeCategory !== 'All' && <span>Â· <span className="text-primary font-bold">{activeCategory}</span></span>}
                </div>
              )}

              {/* â”€â”€ Events grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm font-semibold text-text-muted">No events found</p>
                  <p className="text-xs text-text-muted mt-1">
                    {activeMonth !== null ? `No events in ${MONTHS[activeMonth - 1]}` : 'Try a different filter'}
                    {activeCategory !== 'All' ? ` for ${activeCategory}` : ''}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {filtered.map(event => {
                    const key = event.mmdd + event.title;
                    const isAdded = added.has(key);
                    const isAdding = adding === key;
                    const eventDate = getEventDate(event.mmdd, year);

                    return (
                      <div key={key}
                        className={cn('flex items-center gap-3 p-3 rounded-xl border transition-all',
                          isAdded ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:border-primary/30')}>
                        <span className="text-lg shrink-0">{event.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text truncate">{event.title.replace(/^[^\s]+ /, '')}</p>
                          <p className="text-[9px] text-text-muted">{format(eventDate, 'MMM d')} Â· {event.category}</p>
                        </div>
                        <button onClick={() => !isAdded && handleAdd(event)} disabled={isAdded || isAdding}
                          className={cn('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                            isAdded ? 'bg-emerald-500/20 text-emerald-500 cursor-default' :
                            'bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50')}>
                          {isAdding ? <Loader2 size={12} className="animate-spin" /> :
                           isAdded ? <Check size={12} /> : <Plus size={12} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] text-text-muted text-center">
                Events are added to your agency calendar for {year}. They recur yearly automatically.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
