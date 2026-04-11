/**
 * CampaignEventSelect — portal-based searchable campaign picker.
 * Escapes overflow-hidden modal containers via createPortal.
 */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Flag, ChevronDown, Check, Search, X, Calendar, Clock } from 'lucide-react';
import { CampaignEvent } from '../../services/campaignEventService';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { format } from 'date-fns';

type DateMode = 'upcoming' | 'all';
type EventStatus = 'upcoming' | 'today' | 'past';

interface CampaignEventSelectProps {
  events: CampaignEvent[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
const toDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today = () => toDay(new Date());

const getStatus = (dateStr: string): EventStatus => {
  const d = toDay(new Date(dateStr));
  const t = today();
  if (d < t) return 'past';
  if (d.getTime() === t.getTime()) return 'today';
  return 'upcoming';
};

const STATUS_CONFIG: Record<EventStatus, { label: string; cls: string; iconCls: string; bg: string }> = {
  upcoming: { label: 'Upcoming', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', iconCls: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  today:    { label: 'Today',    cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20',          iconCls: 'text-blue-400',    bg: 'bg-blue-500/15'    },
  past:     { label: 'Past',     cls: 'bg-white/8 text-text-muted border-border',                 iconCls: 'text-text-muted',  bg: 'bg-white/8'        },
};

export const CampaignEventSelect = ({
  events,
  value,
  onChange,
  label,
  placeholder = 'None',
}: CampaignEventSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [mode, setMode] = React.useState<DateMode>('upcoming');
  const [panelStyle, setPanelStyle] = React.useState<React.CSSProperties>({});
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const selected = events.find(e => e.id === value) ?? null;

  // Position panel under trigger
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const panelHeight = Math.min(380, events.length * 56 + 120);
    const openUpward = spaceBelow < panelHeight && spaceAbove > spaceBelow;

    setPanelStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [events.length]);

  const handleOpen = () => {
    updatePosition();
    setOpen(true);
  };

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const panel = document.getElementById('campaign-select-panel');
      if (panel?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Escape to close
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Reposition on scroll/resize
  React.useEffect(() => {
    if (!open) return;
    const handler = () => updatePosition();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [open, updatePosition]);

  // Focus search on open, clear on close
  React.useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 40);
    else setSearch('');
  }, [open]);

  const filtered = React.useMemo(() => {
    const t = today();
    return events.filter(ev => {
      if (mode === 'upcoming' && toDay(new Date(ev.date)) < t) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        (ev.region || '').toLowerCase().includes(q) ||
        (ev.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [events, mode, search]);

  const upcomingCount = React.useMemo(() => {
    const t = today();
    return events.filter(ev => toDay(new Date(ev.date)) >= t).length;
  }, [events]);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const selectedStatus = selected ? getStatus(selected.date) : null;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className={cn(
          'w-full h-11 flex items-center gap-3 px-3.5 rounded-xl border text-sm transition-all duration-200 text-left',
          'bg-card/60 border-border',
          'hover:border-primary/40 hover:bg-card',
          open && 'border-primary/60 ring-2 ring-primary/15 bg-card'
        )}
      >
        {selected && selectedStatus ? (
          <>
            <div className={cn('w-[26px] h-[26px] rounded-lg flex items-center justify-center shrink-0', STATUS_CONFIG[selectedStatus].bg)}>
              <Flag size={12} className={STATUS_CONFIG[selectedStatus].iconCls} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text font-medium truncate leading-tight text-sm">{selected.title}</p>
              <p className="text-[10px] text-text-muted flex items-center gap-1">
                <Calendar size={9} />
                {format(new Date(selected.date), 'MMM d, yyyy')}
              </p>
            </div>
            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0', STATUS_CONFIG[selectedStatus].cls)}>
              {STATUS_CONFIG[selectedStatus].label}
            </span>
          </>
        ) : (
          <>
            <div className="w-[26px] h-[26px] rounded-lg bg-white/8 border border-border flex items-center justify-center shrink-0">
              <Flag size={12} className="text-text-muted" />
            </div>
            <span className="flex-1 text-text-muted/70 text-sm">{placeholder}</span>
          </>
        )}
        <ChevronDown
          size={14}
          className={cn('text-text-muted shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Portal panel */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id="campaign-select-panel"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              style={panelStyle}
              className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              {/* Search + mode toggle */}
              <div className="p-2.5 space-y-2 border-b border-border">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, category, tags…"
                    className="w-full h-9 pl-8 pr-8 rounded-lg bg-white/5 border border-border text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/50 transition-all"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Upcoming / All toggle */}
                <div className="flex gap-1 p-0.5 bg-white/5 rounded-xl border border-border">
                  <button type="button" onClick={() => setMode('upcoming')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      mode === 'upcoming' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-text-muted hover:text-text'
                    )}>
                    <Clock size={11} /> Upcoming
                    {upcomingCount > 0 && (
                      <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-black',
                        mode === 'upcoming' ? 'bg-white/20' : 'bg-primary/15 text-primary')}>
                        {upcomingCount}
                      </span>
                    )}
                  </button>
                  <button type="button" onClick={() => setMode('all')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      mode === 'all' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-text-muted hover:text-text'
                    )}>
                    <Flag size={11} /> All
                    <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] font-black',
                      mode === 'all' ? 'bg-white/20' : 'bg-white/10 text-text-muted')}>
                      {events.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="max-h-60 overflow-y-auto py-1">
                {/* None option */}
                <button type="button" onClick={() => handleSelect('')}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-white/5',
                    !value ? 'text-primary' : 'text-text-muted'
                  )}>
                  <div className="w-[26px] h-[26px] rounded-lg bg-white/8 border border-border flex items-center justify-center shrink-0">
                    <Flag size={11} className="text-text-muted" />
                  </div>
                  <span className="flex-1 text-left italic text-sm">None</span>
                  {!value && <Check size={13} className="text-primary shrink-0" />}
                </button>

                <div className="mx-3 border-t border-border/50" />

                {filtered.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Flag size={22} className="text-text-muted/30 mx-auto" />
                    <p className="text-xs text-text-muted">
                      {search ? `No campaigns match "${search}"` : mode === 'upcoming' ? 'No upcoming campaigns' : 'No campaigns found'}
                    </p>
                    {mode === 'upcoming' && !search && (
                      <button type="button" onClick={() => setMode('all')}
                        className="text-xs text-primary hover:underline font-semibold">
                        Show all campaigns →
                      </button>
                    )}
                  </div>
                ) : (
                  filtered.map(ev => {
                    const status = getStatus(ev.date);
                    const cfg = STATUS_CONFIG[status];
                    const isSelected = value === ev.id;
                    return (
                      <button key={ev.id} type="button" onClick={() => handleSelect(ev.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3.5 py-2.5 transition-all hover:bg-white/5 text-left',
                          isSelected && 'bg-primary/10 border-l-2 border-primary'
                        )}>
                        <div className={cn('w-[26px] h-[26px] rounded-lg flex items-center justify-center shrink-0', cfg.bg)}>
                          <Flag size={11} className={cfg.iconCls} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium truncate leading-tight', isSelected ? 'text-primary' : 'text-text')}>
                            {ev.title}
                          </p>
                          <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                            <Calendar size={9} />
                            {format(new Date(ev.date), 'EEE, MMM d, yyyy')}
                            {ev.category && ev.category !== 'General' && (
                              <span className="opacity-60">· {ev.category}</span>
                            )}
                          </p>
                        </div>
                        <span className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0', cfg.cls)}>
                          {cfg.label}
                        </span>
                        {isSelected && <Check size={13} className="text-primary shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
