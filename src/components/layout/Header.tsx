import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, Bell, User, Image as ImageIcon, Calendar, Flag, FileText,
  X, Sun, Moon, LogOut, Building2, RefreshCw, Menu, Loader2, Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../lib/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { switchContext } from '../../services/settingsService';
import api from '../../services/api';
import { format } from 'date-fns';

interface SearchAsset    { id: string; title: string; url: string; category: string }
interface SearchPost     { id: string; content: string; status: string; platforms: string[] }
interface SearchCampaign { id: string; title: string; date: string; category: string }
interface SearchResults  { assets: SearchAsset[]; posts: SearchPost[]; campaigns: SearchCampaign[] }

export const Header = ({ onMobileMenuClick }: { onMobileMenuClick?: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery]         = useState('');
  const [isSearchOpen, setIsSearchOpen]       = useState(false);
  const [showUserMenu, setShowUserMenu]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [switchingContext, setSwitchingContext] = useState(false);
  const [agencyName, setAgencyName]           = useState<string | null>(null);
  const [searchResults, setSearchResults]     = useState<SearchResults>({ assets: [], posts: [], campaigns: [] });
  const [searchLoading, setSearchLoading]     = useState(false);

  const searchRef      = useRef<HTMLDivElement>(null);
  const userMenuRef    = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeContext    = user?.activeContext || 'personal';
  const isAgency         = activeContext === 'agency';
  const displayAgencyName = agencyName || user?.agency?.name || 'Agency';
  const hasAgency        = !!agencyName;

  // Resolve agency name
  useEffect(() => {
    if (!user) { setAgencyName(null); return; }
    if (user.agency?.name) { setAgencyName(user.agency.name); return; }
    import('../../services/settingsService').then(m => m.getMyAgency())
      .then(info => setAgencyName(info.agency?.name ?? null))
      .catch(() => setAgencyName(null));
  }, [user?.id, user?.agency?.name]);

  // Context switch
  const handleContextSwitch = async (ctx: 'personal' | 'agency') => {
    if (ctx === activeContext || switchingContext) return;
    setSwitchingContext(true);
    try { await switchContext(ctx); await refreshUser(); navigate('/dashboard'); }
    catch { /* ignore */ }
    finally { setSwitchingContext(false); }
  };

  // Debounced search
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults({ assets: [], posts: [], campaigns: [] }); return; }
    setSearchLoading(true);
    try {
      const [mediaRes, postsRes, campaignsRes] = await Promise.allSettled([
        api.get(`/media?search=${encodeURIComponent(q)}&limit=5`),
        api.get(`/posts?limit=20`),
        isAgency ? api.get(`/campaign-events?limit=20`) : Promise.resolve({ data: { events: [] } }),
      ]);
      const ql = q.toLowerCase();
      const assets: SearchAsset[] = mediaRes.status === 'fulfilled'
        ? (mediaRes.value.data.media || [])
            .filter((m: any) => m.title?.toLowerCase().includes(ql) || (m.tags || []).some((t: string) => t.toLowerCase().includes(ql)))
            .slice(0, 5).map((m: any) => ({ id: m._id || m.id, title: m.title, url: m.url, category: m.category }))
        : [];
      const posts: SearchPost[] = postsRes.status === 'fulfilled'
        ? (postsRes.value.data.posts || [])
            .filter((p: any) => p.content?.toLowerCase().includes(ql))
            .slice(0, 4).map((p: any) => ({ id: p._id || p.id, content: p.content, status: p.status, platforms: p.platforms || [] }))
        : [];
      const campaigns: SearchCampaign[] = campaignsRes.status === 'fulfilled'
        ? (campaignsRes.value.data.events || [])
            .filter((e: any) => e.title?.toLowerCase().includes(ql) || e.category?.toLowerCase().includes(ql))
            .slice(0, 4).map((e: any) => ({ id: e._id || e.id, title: e.title, date: e.date, category: e.category }))
        : [];
      setSearchResults({ assets, posts, campaigns });
    } catch { /* silent */ }
    finally { setSearchLoading(false); }
  }, [isAgency]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!searchQuery.trim()) { setSearchResults({ assets: [], posts: [], campaigns: [] }); setSearchLoading(false); return; }
    setSearchLoading(true);
    searchTimerRef.current = setTimeout(() => runSearch(searchQuery), 350);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery, runSearch]);

  const hasResults = searchQuery.length > 0 && (
    searchResults.assets.length > 0 || searchResults.posts.length > 0 || searchResults.campaigns.length > 0
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch { /* ignore */ }
  };

  const clearSearch = () => { setSearchQuery(''); setIsSearchOpen(false); };

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6">

      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuClick}
        className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-all shrink-0"
      >
        <Menu size={19} />
      </button>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-sm relative" ref={searchRef}>
        <div className="relative">
          {searchLoading
            ? <Loader2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted animate-spin pointer-events-none" />
            : <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          }
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search assets, posts, campaigns…"
            className="w-full h-9 bg-card/60 border border-border rounded-xl pl-9 pr-9 text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {isSearchOpen && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="absolute top-[calc(100%+6px)] left-0 w-[340px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50"
            >
              {searchLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-text-muted text-sm">
                  <Loader2 size={15} className="animate-spin" /> Searching…
                </div>
              ) : !hasResults ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-text-muted">No results for "<span className="text-text">{searchQuery}</span>"</p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Assets */}
                  {searchResults.assets.length > 0 && (
                    <div>
                      <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Assets</p>
                      {searchResults.assets.map(item => (
                        <Link key={item.id} to="/gallery" onClick={clearSearch}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-border bg-black/20">
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-text group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-[10px] text-text-muted">{item.category}</p>
                          </div>
                          <ImageIcon size={12} className="text-text-muted shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Posts */}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Posts</p>
                      {searchResults.posts.map(item => (
                        <Link key={item.id} to="/posts" onClick={clearSearch}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText size={15} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-text group-hover:text-primary transition-colors">
                              {item.content.slice(0, 55)}{item.content.length > 55 ? '…' : ''}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {item.platforms.join(', ')} ·{' '}
                              <span className={cn(
                                item.status === 'published' ? 'text-emerald-400' :
                                item.status === 'scheduled' ? 'text-blue-400' : 'text-amber-400'
                              )}>{item.status}</span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Campaigns */}
                  {searchResults.campaigns.length > 0 && (
                    <div>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">Campaigns</p>
                      {searchResults.campaigns.map(item => (
                        <Link key={item.id} to={`/campaigns?event=${item.id}`} onClick={clearSearch}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Flag size={15} className="text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-text group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-[10px] text-text-muted">
                              {item.category} · {format(new Date(item.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Calendar size={12} className="text-text-muted shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right actions ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">

        {/* Context switcher */}
        {hasAgency && (
          <div className="hidden md:flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => handleContextSwitch('personal')}
              disabled={switchingContext}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeContext === 'personal' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'
              )}
            >
              <User size={12} /> Personal
            </button>
            <button
              onClick={() => handleContextSwitch('agency')}
              disabled={switchingContext}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeContext === 'agency' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text'
              )}
            >
              {switchingContext ? <RefreshCw size={12} className="animate-spin" /> : <Building2 size={12} />}
              <span className="max-w-[80px] truncate">{displayAgencyName}</span>
            </button>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="hidden sm:flex p-2 text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-all"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2 text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-all"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative pl-2 border-l border-border" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <span className="text-xs font-black text-primary">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                  </span>
              }
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-text leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-text-muted capitalize leading-tight">
                {user?.agencyRole?.replace(/_/g, ' ') || (user?.roles?.[0]?.replace(/_/g, ' ') ?? '')}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link to="/settings" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-text text-sm">
                    <Settings size={15} className="text-text-muted" /> Settings
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 text-sm">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification panel portal */}
      {createPortal(
        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />,
        document.body
      )}
    </header>
  );
};
