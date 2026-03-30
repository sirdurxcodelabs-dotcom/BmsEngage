import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, CheckCircle2, XCircle, Clock, ShieldAlert, Search, RefreshCw,
  Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Shield,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';
import * as adminService from '../../services/adminService';
import type { AdminUser, AdminStats } from '../../services/adminService';

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  pending:   { label: 'Pending',   color: 'bg-amber-500/10 text-amber-500',     icon: Clock },
  rejected:  { label: 'Rejected',  color: 'bg-red-500/10 text-red-500',         icon: XCircle },
  suspended: { label: 'Suspended', color: 'bg-orange-500/10 text-orange-500',   icon: ShieldAlert },
};

const FEATURE_LABELS: Record<string, string> = {
  gallery: 'Gallery', socialAccounts: 'Social Accounts', posts: 'Posts',
  scheduler: 'Scheduler', analytics: 'Analytics', notifications: 'Notifications', settings: 'Settings',
};

const ROLE_LABELS: Record<string, string> = {
  graphic_designer: 'Graphic Designer', photographer: 'Photographer',
  videographer: 'Videographer', editor: 'Editor', producer: 'Producer',
  director: 'Director', production_manager: 'Production Manager',
  social_media_manager: 'Social Media Manager', content_strategist: 'Content Strategist',
  brand_manager: 'Brand Manager', ceo: 'CEO', coo: 'COO',
  creative_director: 'Creative Director', head_of_production: 'Head of Production',
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        adminService.getStats(),
        adminService.listUsers({ status: statusFilter || undefined, search: search || undefined }),
      ]);
      setStats(s);
      setUsers(u);
    } catch { toast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: string, status: AdminUser['accountStatus']) => {
    setUpdatingId(id);
    try {
      const updated = await adminService.updateUserStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, accountStatus: updated.accountStatus } : u));
      setStats(null); // will reload on next load
      toast(`User ${status}`, 'success');
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Failed', 'error');
    } finally { setUpdatingId(null); }
  };

  const handleFeatureToggle = async (id: string, feature: string, value: boolean) => {
    setUpdatingId(id + feature);
    try {
      const updated = await adminService.updateUserFeatures(id, { [feature]: value });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, enabledFeatures: updated.enabledFeatures } : u));
    } catch { toast('Failed to update feature', 'error'); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    setUpdatingId(id);
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast('User deleted', 'success');
    } catch { toast('Failed to delete user', 'error'); }
    finally { setUpdatingId(null); }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.total, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active', value: stats.active, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending', value: stats.pending, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Rejected', value: stats.rejected, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Suspended', value: stats.suspended, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ] : [];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Shield size={28} className="text-primary" />
            <h1 className="text-4xl font-black tracking-tight text-text">Admin Panel</h1>
          </div>
          <p className="text-text-muted font-medium">Manage users, approvals, and feature access.</p>
        </div>
        <button onClick={load} className="p-2 text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {statCards.map(s => (
            <div key={s.label} className={cn('p-5 rounded-2xl border border-white/10 glass space-y-1')}>
              <p className="text-xs font-black text-text-muted uppercase tracking-widest">{s.label}</p>
              <p className={cn('text-3xl font-black', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
          {['', 'pending', 'active', 'rejected', 'suspended'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                statusFilter === s ? 'bg-primary text-white' : 'text-text-muted hover:text-text')}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="py-20 text-center">
          <Users size={40} className="text-text-muted mx-auto mb-4 opacity-30" />
          <p className="text-text-muted font-semibold">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {users.map(u => {
              const sc = STATUS_CONFIG[u.accountStatus];
              const isExpanded = expandedId === u.id;
              const isUpdating = updatingId === u.id;

              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="glass border border-white/10 rounded-2xl overflow-hidden">
                  {/* Row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Avatar */}
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text truncate">{u.name}</p>
                      <p className="text-xs text-text-muted truncate">{u.email}</p>
                      <p className="text-[10px] text-text-muted capitalize mt-0.5">
                        {u.roles.map(r => ROLE_LABELS[r] || r).join(', ')}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0', sc.color)}>
                      {sc.label}
                    </span>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {u.accountStatus !== 'active' && (
                        <button onClick={() => handleStatus(u.id, 'active')} disabled={isUpdating}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40">
                          Approve
                        </button>
                      )}
                      {u.accountStatus === 'active' && (
                        <button onClick={() => handleStatus(u.id, 'suspended')} disabled={isUpdating}
                          className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40">
                          Suspend
                        </button>
                      )}
                      {u.accountStatus !== 'rejected' && (
                        <button onClick={() => handleStatus(u.id, 'rejected')} disabled={isUpdating}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] font-bold transition-all disabled:opacity-40">
                          Reject
                        </button>
                      )}
                      <button onClick={() => handleDelete(u.id, u.name)} disabled={isUpdating}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-text-muted hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => setExpandedId(isExpanded ? null : u.id)}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-text-muted hover:text-text">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded: feature toggles */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-2 border-t border-white/10">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">
                            Feature Access
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {Object.entries(u.enabledFeatures).map(([feature, enabled]) => {
                              const key = u.id + feature;
                              const busy = updatingId === key;
                              return (
                                <button key={feature} onClick={() => handleFeatureToggle(u.id, feature, !enabled)}
                                  disabled={busy}
                                  className={cn('flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all',
                                    enabled ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-muted'
                                  )}>
                                  <span>{FEATURE_LABELS[feature] || feature}</span>
                                  {busy ? <RefreshCw size={12} className="animate-spin" />
                                    : enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[10px] text-text-muted mt-2">
                            Joined {new Date(u.createdAt).toLocaleDateString()} · {u.verified ? 'Email verified' : 'Email not verified'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
