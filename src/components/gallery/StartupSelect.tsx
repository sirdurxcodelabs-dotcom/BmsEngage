/**
 * StartupSelect — portal-based dropdown that escapes overflow-hidden modal containers.
 * Uses getBoundingClientRect to position the panel relative to the trigger.
 */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Building2, ChevronDown, Check, Search, X } from 'lucide-react';
import { Startup } from '../../services/startupService';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'motion/react';

interface StartupSelectProps {
  startups: Startup[];
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export const StartupSelect = ({
  startups,
  value,
  onChange,
  required,
  label,
  placeholder = 'Select a startup…',
}: StartupSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [panelStyle, setPanelStyle] = React.useState<React.CSSProperties>({});
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const selected = startups.find(s => s.id === value) ?? null;

  const filtered = React.useMemo(() => {
    if (!search.trim()) return startups;
    const q = search.toLowerCase();
    return startups.filter(s => s.name.toLowerCase().includes(q));
  }, [startups, search]);

  // Position the portal panel under the trigger
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const panelHeight = Math.min(320, startups.length * 52 + 80);
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
  }, [startups.length]);

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
      // Check if click is inside the portal panel
      const panel = document.getElementById('startup-select-panel');
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

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Trigger button */}
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
        {selected ? (
          <>
            <StartupAvatar startup={selected} size={26} />
            <span className="flex-1 truncate text-text font-medium">{selected.name}</span>
          </>
        ) : (
          <>
            <div className="w-[26px] h-[26px] rounded-lg bg-white/8 border border-border flex items-center justify-center shrink-0">
              <Building2 size={13} className="text-text-muted" />
            </div>
            <span className="flex-1 text-text-muted/70 text-sm">{placeholder}</span>
          </>
        )}
        <ChevronDown
          size={14}
          className={cn('text-text-muted shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Hidden native input for HTML5 form validation */}
      {required && (
        <input
          tabIndex={-1}
          required
          value={value}
          onChange={() => {}}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          aria-hidden="true"
        />
      )}

      {/* Portal dropdown panel */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id="startup-select-panel"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              style={panelStyle}
              className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search startups…"
                    className="w-full h-9 pl-8 pr-8 rounded-lg bg-white/5 border border-border text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/50 transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Options list */}
              <div className="max-h-56 overflow-y-auto py-1">
                {/* Clear / placeholder option */}
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-white/5',
                    !value ? 'text-primary' : 'text-text-muted'
                  )}
                >
                  <div className="w-[26px] h-[26px] rounded-lg bg-white/8 border border-border flex items-center justify-center shrink-0">
                    <Building2 size={12} className="text-text-muted" />
                  </div>
                  <span className="flex-1 text-left italic text-sm">{placeholder}</span>
                  {!value && <Check size={13} className="text-primary shrink-0" />}
                </button>

                <div className="mx-3 border-t border-border/50" />

                {filtered.length === 0 ? (
                  <div className="py-8 text-center">
                    <Building2 size={22} className="text-text-muted/30 mx-auto mb-2" />
                    <p className="text-xs text-text-muted">
                      {search ? `No startups match "${search}"` : 'No startups available'}
                    </p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="mt-2 text-xs text-primary hover:underline font-semibold"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  filtered.map(s => {
                    const isSelected = value === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelect(s.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-all hover:bg-white/5 text-left',
                          isSelected && 'bg-primary/10 border-l-2 border-primary'
                        )}
                      >
                        <StartupAvatar startup={s} size={30} />
                        <span className={cn(
                          'flex-1 truncate font-medium',
                          isSelected ? 'text-primary' : 'text-text'
                        )}>
                          {s.name}
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

// ─── Startup avatar ───────────────────────────────────────────────────────────
export const StartupAvatar = ({ startup, size = 28 }: { startup: Startup; size?: number }) => (
  startup.logo
    ? <img
        src={startup.logo}
        alt={startup.name}
        className="rounded-lg object-cover shrink-0 border border-border/50"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    : <div
        className="rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-black"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      >
        {startup.name.charAt(0).toUpperCase()}
      </div>
);
