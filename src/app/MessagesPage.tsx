import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare, Plus, Calendar, ChevronRight,
  CalendarDays, BarChart2, Send, Copy, Check, X, Loader2,
  Sparkles, Trash2, CalendarX,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import {
  fetchCampaignsByFilter, applyDateFilter, generateMessage,
  getCampaignStatus, CampaignEvent, CampaignFilter, DateFilter,
} from '../services/messagingService';

// ─── Range filter button config ───────────────────────────────────────────────
const RANGE_FILTERS: { key: CampaignFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'week',      label: 'This Week',  icon: <Calendar size={13} />,     color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400' },
  { key: 'next-week', label: 'Next Week',  icon: <ChevronRight size={13} />, color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400' },
  { key: 'month',     label: 'This Month', icon: <CalendarDays size={13} />, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400' },
  { key: 'year',      label: 'This Year',  icon: <BarChart2 size={13} />,    color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400' },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  upcoming:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  ongoing:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
  completed: 'bg-white/10 text-text-muted border-white/10',
};
const STATUS_LABELS = { upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed' };

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function MessagesPage() {
  const { toast } = useToast();
  const location = useLocation();

  // ── State ─────────────────────────────────────────────────────────────────
  const [message, setMessage] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('upcoming');
  const [allFetched, setAllFetched] = useState<CampaignEvent[]>([]); // raw from API
  const [selectedCampaigns, setSelectedCampaigns] = useState<CampaignEvent[]>([]); // after date filter
  const [activeRangeFilter, setActiveRangeFilter] = useState<CampaignFilter | null>(null);
  const [loadingFilter, setLoadingFilter] = useState<CampaignFilter | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from AccessGuard "Message Admin" navigation
  useEffect(() => {
    const state = location.state as { prefill?: string } | null;
    if (state?.prefill) {
      setMessage(state.prefill);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // ── Re-filter + regenerate when dateFilter changes ────────────────────────
  useEffect(() => {
    if (!allFetched.length) return;
    const filtered = applyDateFilter(allFetched, dateFilter);
    setSelectedCampaigns(filtered);
    setMessage(generateMessage(filtered, activeRangeFilter, dateFilter));
  }, [dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch campaigns for a range and apply current date filter ─────────────
  const handleRangeClick = useCallback(async (filter: CampaignFilter) => {
    setLoadingFilter(filter);
    try {
      const events = await fetchCampaignsByFilter(filter);
      if (!events.length) {
        toast(`No campaigns found for ${filter.replace('-', ' ')}`, 'info');
        return;
      }
      // Merge with existing — deduplicate by id
      setAllFetched(prev => {
        const existing = new Set(prev.map(e => e.id));
        return [...prev, ...events.filter(e => !existing.has(e.id))];
      });
      setActiveRangeFilter(filter);

      // Apply date filter to merged set
      setAllFetched(prev => {
        const existing = new Set(prev.map(e => e.id));
        const merged = [...prev, ...events.filter(e => !existing.has(e.id))];
        const filtered = applyDateFilter(merged, dateFilter);
        setSelectedCampaigns(filtered);
        if (!filtered.length) {
          toast(
            dateFilter === 'upcoming'
              ? 'No upcoming campaigns in that range. Try switching to "All Campaigns".'
              : 'No campaigns found in that range.',
            'info'
          );
          setMessage('');
        } else {
          setMessage(generateMessage(filtered, filter, dateFilter));
        }
        return merged;
      });
    } catch {
      toast('Failed to fetch campaigns', 'error');
    } finally {
      setLoadingFilter(null);
    }
  }, [dateFilter, toast]);

  // ── Remove a single campaign tag ──────────────────────────────────────────
  const removeCampaign = (id: string) => {
    const next = selectedCampaigns.filter(e => e.id !== id);
    const nextAll = allFetched.filter(e => e.id !== id);
    setSelectedCampaigns(next);
    setAllFetched(nextAll);
    setMessage(next.length ? generateMessage(next, activeRangeFilter, dateFilter) : '');
  };

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearAll = () => {
    setSelectedCampaigns([]);
    setAllFetched([]);
    setActiveRangeFilter(null);
    setMessage('');
  };

  // ── Regenerate message ────────────────────────────────────────────────────
  const regenerate = () => {
    if (!selectedCampaigns.length) return;
    setMessage(generateMessage(selectedCampaigns, activeRangeFilter, dateFilter));
    toast('Message regenerated', 'success');
  };

  // ── Copy ──────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!message.trim()) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    toast('Message copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    if (!message.trim()) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const isEmpty = !message.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">Messages</h1>
          <p className="text-xs text-text-muted">Generate campaign reminders and share via WhatsApp</p>
        </div>
      </div>

      {/* ── Date filter radio ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-xl w-fit">
        {(['upcoming', 'all'] as DateFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              dateFilter === f
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {f === 'upcoming' ? '⏭ Upcoming Campaigns' : '📋 All Campaigns'}
          </button>
        ))}
      </div>

      {/* ── Range buttons + selected campaigns ───────────────────────────── */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
          <Plus size={13} /> Add Campaigns
        </p>

        <div className="flex flex-wrap gap-2.5">
          {RANGE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleRangeClick(f.key)}
              disabled={loadingFilter !== null}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border bg-gradient-to-br transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${f.color}`}
            >
              {loadingFilter === f.key
                ? <Loader2 size={13} className="animate-spin" />
                : f.icon
              }
              {f.label}
            </button>
          ))}
        </div>

        {/* Selected campaign cards */}
        <AnimatePresence>
          {selectedCampaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-3 border-t border-border"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all border border-border"
                >
                  <Trash2 size={10} /> Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {selectedCampaigns.map(c => {
                    const status = getCampaignStatus(c);
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                      >
                        <Calendar size={11} className="text-text-muted shrink-0" />
                        <span className="text-xs font-medium text-text">{c.title}</span>
                        <span className="text-[10px] text-text-muted">
                          {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        {/* Status badge */}
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[status]}`}>
                          {STATUS_LABELS[status]}
                        </span>
                        <button
                          onClick={() => removeCampaign(c.id)}
                          className="p-0.5 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when filter returns nothing */}
        <AnimatePresence>
          {allFetched.length > 0 && selectedCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 py-6 text-center"
            >
              <CalendarX size={28} className="text-text-muted/40" />
              <p className="text-sm font-semibold text-text">No upcoming campaigns found</p>
              <p className="text-xs text-text-muted">
                Switch to <button onClick={() => setDateFilter('all')} className="text-primary underline underline-offset-2">All Campaigns</button> to include past events.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Message composer ──────────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
            <MessageSquare size={13} /> Message
          </p>
          <div className="flex items-center gap-2">
            {selectedCampaigns.length > 0 && (
              <button
                onClick={regenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                <Sparkles size={12} /> Regenerate
              </button>
            )}
            <span className={`text-[10px] font-medium ${message.length > 1500 ? 'text-orange-400' : 'text-text-muted'}`}>
              {message.length} chars
            </span>
          </div>
        </div>

        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message or generate one from campaigns above…"
          rows={10}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 resize-none transition-all leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsApp}
            disabled={isEmpty}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 disabled:pointer-events-none transition-all hover:scale-[1.01] shadow-lg shadow-[#25D366]/20"
          >
            <WhatsAppIcon /> Send via WhatsApp
          </button>
          <button
            onClick={handleCopy}
            disabled={isEmpty}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-semibold text-sm border border-border text-text hover:border-primary/40 hover:bg-primary/5 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            {copied
              ? <><Check size={15} className="text-emerald-400" /> Copied!</>
              : <><Copy size={15} /> Copy Message</>
            }
          </button>
        </div>
      </div>

      {/* ── Empty state (no message, no campaigns) ────────────────────────── */}
      <AnimatePresence>
        {isEmpty && allFetched.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-text-muted mb-4">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-text mb-1">No message yet</h3>
            <p className="text-sm text-text-muted max-w-xs">
              Select a campaign range above to auto-generate a reminder, or type your own message.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
