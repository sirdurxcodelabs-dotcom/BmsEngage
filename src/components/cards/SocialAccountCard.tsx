import * as React from 'react';
import {
  Facebook, Twitter, Linkedin, Music2 as TikTok,
  MoreVertical, Unlink, RefreshCw, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SocialAccount } from '../../types/social';
import { motion, AnimatePresence } from 'motion/react';

interface SocialAccountCardProps {
  account: SocialAccount;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  onRefreshToken?: (id: string) => void;
}

const iconMap: Record<string, any> = {
  meta: Facebook,
  facebook: Facebook,
  Facebook,
  twitter: Twitter,
  Twitter,
  linkedin: Linkedin,
  LinkedIn: Linkedin,
  tiktok: TikTok,
  TikTok,
};

const platformLabel: Record<string, string> = {
  meta: 'Meta (Facebook)',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};

const platformColor: Record<string, string> = {
  meta: 'bg-blue-500/10 text-blue-500',
  twitter: 'bg-sky-400/10 text-sky-400',
  linkedin: 'bg-blue-600/10 text-blue-600',
  tiktok: 'bg-pink-500/10 text-pink-500',
};

export const SocialAccountCard = ({ account, onDisconnect, onReconnect, onRefreshToken }: SocialAccountCardProps) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const platform = account.platform?.toLowerCase() || '';
  const Icon = iconMap[platform] || iconMap[account.platform] || ExternalLink;
  const label = platformLabel[platform] || account.platform;
  const colorClass = platformColor[platform] || 'bg-primary/10 text-primary';

  const isExpired = account.status === 'expired';
  const expiryDate = account.tokenExpiry ? new Date(account.tokenExpiry) : null;
  const expiresInDays = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const expiringSoon = expiresInDays !== null && expiresInDays <= 7 && expiresInDays > 0;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative glass border border-border rounded-2xl p-5 flex items-center justify-between transition-all hover:border-primary/50 hover:shadow-[0_10px_30px_-10px_rgba(65,1,121,0.2)]"
    >
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
            isExpired ? 'bg-red-500/10 text-red-500' : colorClass,
          )}>
            <Icon size={28} />
          </div>
          {!isExpired && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-card shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          )}
          {isExpired && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-card" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-lg text-text">{label}</h4>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              isExpired ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
            )}>
              {isExpired ? 'Expired' : 'Connected'}
            </span>
            {expiringSoon && !isExpired && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                <AlertTriangle size={9} /> Expires in {expiresInDays}d
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted font-medium">
            {account.displayName || account.username}
            {account.username && account.displayName && account.username !== account.displayName && (
              <span className="text-text-muted/60 ml-1">@{account.username}</span>
            )}
          </p>
          {(account as any).meta?.pageName && (
            <p className="text-xs text-primary mt-0.5">Page: {(account as any).meta.pageName}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-0.5">Connected</p>
          <p className="text-xs font-bold text-text">{new Date(account.connectedAt).toLocaleDateString()}</p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-all"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5"
              >
                {(isExpired || expiringSoon) && (
                  <button
                    onClick={() => { onReconnect(account.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-primary/5 rounded-xl transition-colors font-bold"
                  >
                    <RefreshCw size={16} /> Reconnect
                  </button>
                )}
                {onRefreshToken && !isExpired && (
                  <button
                    onClick={() => { onRefreshToken(account.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:text-text hover:bg-white/5 rounded-xl transition-colors font-bold"
                  >
                    <RefreshCw size={16} /> Refresh Token
                  </button>
                )}
                <button
                  onClick={() => { onDisconnect(account.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold"
                >
                  <Unlink size={16} /> Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
