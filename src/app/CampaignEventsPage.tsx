import { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, Flag, Globe, RefreshCw, Loader2, Tag, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { campaignEventService, CampaignEvent } from '../services/campaignEventService';
import { CampaignEventDetailModal } from '../components/campaigns/CampaignEventDetailModal';
import { GlobalCalendarPanel } from '../components/campaigns/GlobalCalendarPanel';
import { useAuth } from '../contexts/AuthContext';

const EXECUTIVE_ROLES = ['owner', 'ceo', 'coo', 'creative_director', 'head_of_production'];
import { useSearchParams } from 'react-router-dom';

const CATEGORY_COLORS: Record<string, string> = {
  Global: 'bg-primary/10 text-primary',
  Marketing: 'bg-emerald-500/10 text-emerald-500',
  Sales: 'bg-amber-500/10 text-amber-400',
  Social: 'bg-sky-500/10 text-sky-400',
  General: 'bg-white/10 text-text-muted',
};

import { AccessGuard } from '../components/AccessGuard';

function CampaignEventsPageInner() {
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General', date: '', region: 'Global', tags: '', recurrence: 'none', isMonthlyEvent: false });
  const { toast } = useToast();
  const { user } = useAuth();
  const isExecutive = EXECUTIVE_ROLES.includes(user?.agencyRole || '');
  const [searchParams] = useSearchParams();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await campaignEventService.list();
      setEvents(data);
    } catch { toast('Failed to load events', 'error'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-open event from URL param
  useEffect(() => {
    const eventId = searchParams.get('event');
    if (eventId && events.length > 0) {
      const found = events.find(e => e.id === eventId);
      if (found) { setSelectedEvent(found); setIsDetailOpen(true); }
    }
  }, [searchParams, events]);

  const handleCreate = async () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    if (!form.date) { toast('Date is required', 'error'); return; }
    setCreating(true);
    try {
      const event = await campaignEventService.create({
        title: form.title.trim(),
        category: form.category,
        date: form.date,
        region: form.region,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        recurrence: form.recurrence as any,
        isMonthlyEvent: form.isMonthlyEvent,
      });
      setEvents(prev => [event, ...prev]);
      setIsCreateOpen(false);
      setForm({ title: '', category: 'General', date: '', region: 'Global', tags: '', recurrence: 'none', isMonthlyEvent: false });
      toast('Event created', 'success');
    } catch (err: any) { toast(err?.response?.data?.error || 'Failed to create', 'error'); }
    finally { setCreating(false); }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-text mb-1">Campaign Events</h1>
          <p className="text-sm text-text-muted">Plan and manage your agency's campaign calendar.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={load} className="p-2.5 rounded-xl border border-border text-text-muted hover:text-text hover:border-primary/30 transition-all">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          {isExecutive && (
            <Button onClick={() => setIsCreateOpen(true)} className="h-10 px-4 rounded-xl font-bold shadow-xl shadow-primary/30">
              <Plus size={15} className="mr-2" /> New Event
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" spellCheck
          className="w-full h-11 bg-card border border-border rounded-xl pl-11 pr-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 transition-all" />
      </div>

      {/* Global Calendar Panel — executives only */}
      {isExecutive && (
        <GlobalCalendarPanel
          existingEvents={events}
          onAdded={event => setEvents(prev => [event, ...prev])}
        />
      )}

      {/* Events grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mb-4">
            <Flag size={28} />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">No campaign events yet</h3>
          <p className="text-sm text-text-muted mb-6">Create your first event to start planning campaigns.</p>
          {isExecutive && <Button onClick={() => setIsCreateOpen(true)}>Create First Event</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(event => (
              <motion.div key={event.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => { setSelectedEvent(event); setIsDetailOpen(true); }}
                className="glass border border-white/10 rounded-[20px] p-5 cursor-pointer hover:border-primary/40 hover:shadow-[0_10px_30px_-10px_rgba(65,1,121,0.2)] transition-all group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-text group-hover:text-primary transition-colors truncate">{event.title}</h3>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                      <Calendar size={11} /> {format(new Date(event.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className={cn('shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest', CATEGORY_COLORS[event.category] || 'bg-white/10 text-text-muted')}>
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span className="flex items-center gap-1"><Globe size={10} /> {event.region}</span>
                  {event.recurrence !== 'none' && <span className="flex items-center gap-1"><RefreshCw size={10} /> {event.recurrence}</span>}
                  {event.isMonthlyEvent && <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-bold">Monthly</span>}
                </div>
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {event.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-text-muted">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && <span className="text-[9px] text-text-muted">+{event.tags.length - 3}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Event Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Campaign Event" maxWidth="max-w-lg">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Black Friday Campaign" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 appearance-none transition-all">
                {['General','Global','Marketing','Sales','Social','Holiday','Product'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Recurrence</label>
              <select value={form.recurrence} onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 appearance-none transition-all">
                {['none','weekly','monthly','yearly'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Date *</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 transition-all" />
          </div>
          <Input label="Region" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="Global" />
          <Input label="Tags (comma separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="sale, holiday, promo" />
          <div className="flex items-center gap-3">
            <button onClick={() => setForm(f => ({ ...f, isMonthlyEvent: !f.isMonthlyEvent }))}
              className={cn('w-11 h-6 rounded-full relative transition-all', form.isMonthlyEvent ? 'bg-primary' : 'bg-white/10')}>
              <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', form.isMonthlyEvent ? 'right-1' : 'left-1')} />
            </button>
            <span className="text-sm font-bold text-text">Monthly Planning Event (auto-creates 12 months)</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} isLoading={creating} className="flex-1 shadow-lg shadow-primary/30">Create Event</Button>
          </div>
        </div>
      </Modal>

      {/* Event Detail Modal */}
      <CampaignEventDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} event={selectedEvent} />
    </div>
  );
}

export default function CampaignEventsPage() {
  return (
    <AccessGuard feature="campaigns">
      <CampaignEventsPageInner />
    </AccessGuard>
  );
}
