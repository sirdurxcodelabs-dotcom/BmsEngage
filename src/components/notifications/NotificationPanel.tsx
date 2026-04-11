import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, CheckCheck, X, Settings, ArrowRight, Check, Trash2,
  Flag, Image as ImageIcon, MessageSquare, AlertCircle, Zap,
  Users, FileText, Shield, RefreshCw,
} from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { respondToInvitation } from '../../services/settingsService';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PANEL_LIMIT = 12;

// ─── Type config ──────────────────────────────────────────────────────────────
type TypeConfig = { icon: React.ReactNode; color: string; bg: string };

const getTypeConfig = (type: string): TypeConfig => {
  if (type.startsWith('campaign')) return {
    icon: <Flag size={14} />, color: 'text-emerald-400', bg: 'bg-emerald-500/15',
  };
  if (type.startsWith('media')) return {
    icon: <ImageIcon size={14} />, color: 'text-purple-400', bg: 'bg-purple-500/15',
  };
  if (type === 'media_comment') return {
    icon: <MessageSquare size={14} />, color: 'text-cyan-400', bg: 'bg-cyan-500/15',
  };
  if (type === 'media_correction') return {
    icon: <AlertCircle size={14} />, color: 'text-orange-400', bg: 'bg-orange-500/15',
  };
  if (type.startsWith('post')) return {
    icon: <FileText size={14} />, color: 'text-blue-400', bg: 'bg-blue-500/15',
  };
  if (type === 'team_invite') return {
    icon: <Users size={14} />, color: 'text-primary', bg: 'bg-primary/15',
  };
  if (type.startsWith('account') || type === 'login') return {
    icon: <Shield size={14} />, color: 'text-amber-400', bg: 'bg-amber-500/15',
  };
  return { icon: <Zap size={14} />, color: 'text-primary', bg: 'bg-primary/15' };
};

// ─── Single notification card ─────────────────────────────────────────────────
const NotifCard = ({
  n, onNavigate, onMarkRead, onDelete, onInviteResponse, respondingId,
}: {
  n: Notification;
  onNavigate: (id: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onInviteResponse: (n: Notification, action: 'accept' | 'reject') => void;
  respondingId: string | null;
}) => {
  const cfg = getTypeConfig(n.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={cn(
        'group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer',
        'hover:shadow-md hover:-translate-y-0.5',
        n.read
          ? 'bg-card border-border hover:border-primary/20'
          : 'bg-primary/5 border-primary/20 hover:border-primary/40'
      )}
      onClick={() => onNavigate(n._id)}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-primary shrink-0" />
      )}

      {/* Icon */}
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.bg, cfg.color)}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className={cn('text-sm font-semibold leading-tight truncate', n.read ? 'text-text-muted' : 'text-text')}>
          {n.title}
        </p>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
        <p className="text-[10px] text-text-muted/60 mt-1.5">
          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
        </p>

        {/* Team invite inline actions */}
        {n.type === 'team_invite' && n.data?.inviteId && (
          <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onInviteResponse(n, 'accept')}
              disabled={respondingId === n.data.inviteId}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold transition-colors"
            >
              <Check size={11} /> Accept
            </button>
            <button
              onClick={() => onInviteResponse(n, 'reject')}
              disabled={respondingId === n.data.inviteId}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition-colors"
            >
              <X size={11} /> Decline
            </button>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div
        className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1"
        onClick={e => e.stopPropagation()}
      >
        {!n.read && (
          <button
            onClick={() => onMarkRead(n._id)}
            className="p-1 hover:bg-primary/10 rounded-lg text-text-muted hover:text-primary transition-colors"
            title="Mark as read"
          >
            <Check size={12} />
          </button>
        )}
        <button
          onClick={() => onDelete(n._id)}
          className="p-1 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Panel ────────────────────────────────────────────────────────────────────
export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { unreadNotifications, notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const panelItems = unreadNotifications.slice(0, PANEL_LIMIT);
  const hasMore = unreadCount > PANEL_LIMIT;

  const goTo = (path: string) => { onClose(); navigate(path); };

  const handleNavigate = (id: string) => {
    goTo(`/notifications?id=${id}`);
  };

  const handleInviteResponse = async (n: Notification, action: 'accept' | 'reject') => {
    const inviteId = n.data?.inviteId;
    if (!inviteId) return;
    setRespondingId(inviteId);
    try {
      await respondToInvitation(inviteId, action);
      await markAsRead(n._id);
      await fetchNotifications();
      if (action === 'accept') await refreshUser();
    } catch { /* ignore */ }
    finally { setRespondingId(null); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-border shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell size={16} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text leading-tight">Notifications</h2>
                    <p className="text-[11px] text-text-muted">
                      {unreadCount === 0 ? 'All caught up' : `${unreadCount} unread`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={fetchNotifications}
                    className="p-1.5 text-text-muted hover:text-text hover:bg-white/5 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={() => goTo('/settings?tab=notification-preferences')}
                    className="p-1.5 text-text-muted hover:text-text hover:bg-white/5 rounded-lg transition-colors"
                    title="Preferences"
                  >
                    <Settings size={15} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-text-muted hover:text-text hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-primary/8 hover:bg-primary/15 text-primary rounded-xl text-xs font-semibold transition-colors"
                >
                  <CheckCheck size={14} /> Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading && panelItems.length === 0 ? (
                /* Skeleton */
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border animate-pulse">
                      <div className="w-8 h-8 rounded-xl bg-white/10 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/10 rounded w-3/4" />
                        <div className="h-2.5 bg-white/8 rounded w-full" />
                        <div className="h-2 bg-white/5 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : panelItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Bell size={24} className="text-primary opacity-50" />
                  </div>
                  <p className="text-sm font-semibold text-text-muted">No unread notifications</p>
                  <p className="text-xs text-text-muted mt-1 mb-5">You're all caught up.</p>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => goTo('/notifications')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-semibold transition-colors"
                    >
                      View all notifications <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {panelItems.map(n => (
                    <NotifCard
                      key={n._id}
                      n={n}
                      onNavigate={handleNavigate}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotification}
                      onInviteResponse={handleInviteResponse}
                      respondingId={respondingId}
                    />
                  ))}
                </AnimatePresence>
              )}

              {hasMore && (
                <button
                  onClick={() => goTo('/notifications')}
                  className="w-full py-2.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  +{unreadCount - PANEL_LIMIT} more unread <ArrowRight size={13} />
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border space-y-1.5 shrink-0">
              <button
                onClick={() => goTo('/notifications')}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-primary/10 text-text-muted hover:text-primary rounded-xl text-xs font-semibold transition-colors"
              >
                View all notifications <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
