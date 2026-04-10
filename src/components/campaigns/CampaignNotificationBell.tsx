import * as React from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { campaignNotificationService, CampaignNotification } from '../../services/campaignEventService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const TYPE_COLORS: Record<string, string> = {
  event: 'text-primary', campaign: 'text-emerald-500', reminder: 'text-amber-400', asset: 'text-cyan-400',
};

export const CampaignNotificationBell = () => {
  const [notifications, setNotifications] = React.useState<CampaignNotification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const load = React.useCallback(async () => {
    try {
      const { notifications: n, unreadCount: u } = await campaignNotificationService.list();
      setNotifications(n);
      setUnreadCount(u);
    } catch { /* silent */ }
  }, []);

  React.useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = async (n: CampaignNotification) => {
    if (!n.isRead) {
      await campaignNotificationService.markRead(n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
      setUnreadCount(c => Math.max(0, c - 1));
    }
    if (n.relatedEventId) navigate(`/campaigns?event=${n.relatedEventId}`);
    setOpen(false);
  };

  const handleMarkAll = async () => {
    await campaignNotificationService.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await campaignNotificationService.remove(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - (notifications.find(n => n.id === id)?.isRead ? 0 : 1)));
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setOpen(v => !v)}
        className="p-2 text-text-muted hover:text-text hover:bg-primary/5 rounded-xl transition-all relative"
        title="Campaign Notifications">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs font-black text-text uppercase tracking-widest">Campaign Alerts</p>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAll} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                    <Check size={10} /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 text-text-muted hover:text-text rounded-lg transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-xs text-text-muted">No campaign notifications</div>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => handleClick(n)}
                  className={cn('flex items-start gap-3 px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-white/5 transition-colors group',
                    !n.isRead && 'bg-primary/5')}>
                  <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', !n.isRead ? 'bg-amber-500' : 'bg-transparent')} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-bold', TYPE_COLORS[n.type] || 'text-text')}>{n.title}</p>
                    <p className="text-[11px] text-text-muted leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[9px] text-text-muted mt-1">{format(new Date(n.createdAt), 'MMM d, h:mm a')}</p>
                  </div>
                  <button onClick={e => handleDelete(e, n.id)}
                    className="p-1 text-text-muted hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
