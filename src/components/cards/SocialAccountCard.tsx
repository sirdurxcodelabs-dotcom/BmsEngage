import * as React from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Music2 as TikTok, 
  Youtube, 
  Chrome as Google, 
  Apple, 
  MoreVertical, 
  Unlink, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SocialAccount } from '../../types/social';
import { motion, AnimatePresence } from 'motion/react';

interface SocialAccountCardProps {
  key?: React.Key;
  account: SocialAccount;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
}

const iconMap: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  TikTok,
  YouTube: Youtube,
  Google,
  Apple
};

export const SocialAccountCard = ({ account, onDisconnect, onReconnect }: SocialAccountCardProps) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const Icon = iconMap[account.platform] || ExternalLink;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative glass border border-border rounded-2xl p-5 flex items-center justify-between transition-all hover:border-primary/50 hover:shadow-[0_10px_30px_-10px_rgba(65,1,121,0.2)] hover:purple-glow"
    >
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
            account.status === 'connected' ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-red-500/10 text-red-500"
          )}>
            <Icon size={28} />
          </div>
          {account.status === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-card shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-lg text-text">{account.platform}</h4>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
              account.status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {account.status}
            </span>
          </div>
          <p className="text-sm text-text-muted font-medium">{account.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-0.5">Connected Since</p>
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
                className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5"
              >
                {account.status === 'expired' && (
                  <button 
                    onClick={() => { onReconnect(account.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-primary/5 rounded-xl transition-colors font-bold"
                  >
                    <RefreshCw size={16} /> Reconnect
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
