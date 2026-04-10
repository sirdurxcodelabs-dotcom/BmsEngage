import * as React from 'react';
import { Globe, Plus, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
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

export const GlobalCalendarPanel = ({ existingEvents, onAdded }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [adding, setAdding] = React.useState<string | null>(null);
  const [added, setAdded] = React.useState<Set<string>>(new Set());

  const year = new Date().getFullYear();

  // Pre-mark events that already exist in the agency calendar
  React.useEffect(() => {
    const titles = new Set(existingEvents.map(e => e.title));
    const preAdded = new Set(GLOBAL_CALENDAR.filter(e => titles.has(e.title)).map(e => e.mmdd + e.title));
    setAdded(preAdded);
  }, [existingEvents]);

  const filtered = GLOBAL_CALENDAR.filter(e =>
    activeCategory === 'All' || e.category === activeCategory
  ).sort((a, b) => a.mmdd.localeCompare(b.mmdd));

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

  const handleAddAll = async (category: string) => {
    const toAdd = filtered.filter(e => {
      const key = e.mmdd + e.title;
      return (category === 'All' || e.category === category) && !added.has(key);
    });
    for (const event of toAdd) {
      await handleAdd(event);
    }
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
            <p className="text-[10px] text-text-muted">{GLOBAL_CALENDAR.length} pre-built yearly events — holidays, awareness days, sales seasons</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-text-muted shrink-0" /> : <ChevronDown size={18} className="text-text-muted shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Filter:</span>
                {['All', ...GLOBAL_CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={cn('px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      activeCategory === cat ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-text-muted hover:text-text')}>
                    {cat}
                  </button>
                ))}
                <button onClick={() => handleAddAll(activeCategory)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20">
                  <Plus size={11} /> Add All {activeCategory !== 'All' ? activeCategory : ''} Events
                </button>
              </div>

              {/* Events grid */}
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
                        <p className="text-[9px] text-text-muted">{format(eventDate, 'MMM d')} · {event.category}</p>
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
