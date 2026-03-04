import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Image as ImageIcon, Calendar, BarChart3, Link2, X, Sun, Moon } from 'lucide-react';
import { MOCK_MEDIA, MOCK_ACCOUNTS } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../lib/ThemeContext';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredMedia = MOCK_MEDIA.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAccounts = MOCK_ACCOUNTS.filter(item => 
    item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = searchQuery.length > 0 && (filteredMedia.length > 0 || filteredAccounts.length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="w-96 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search media, accounts, analytics..." 
            className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-10 py-2 text-sm outline-none focus:border-primary/50 transition-all text-text"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isSearchOpen && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[480px] overflow-y-auto"
            >
              {!hasResults ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-muted italic">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="p-2 space-y-4">
                  {filteredMedia.length > 0 && (
                    <div>
                      <h4 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Media Assets</h4>
                      <div className="space-y-1">
                        {filteredMedia.map(item => (
                          <Link 
                            key={item.id} 
                            to="/gallery" 
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                              <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors text-text">{item.title}</p>
                              <p className="text-[10px] text-text-muted uppercase tracking-tighter">{item.category} • {new Date(item.metadata.createdDate).toLocaleDateString()}</p>
                            </div>
                            <ImageIcon size={14} className="text-text-muted" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredAccounts.length > 0 && (
                    <div>
                      <h4 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">Social Accounts</h4>
                      <div className="space-y-1">
                        {filteredAccounts.map(item => (
                          <Link 
                            key={item.id} 
                            to="/social-accounts" 
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                              <Link2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors text-text">{item.platform}</p>
                              <p className="text-[10px] text-text-muted">{item.username}</p>
                            </div>
                            <div className={cn(
                              "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                              item.status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-text-muted"
                            )}>
                              {item.status}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-2 border-t border-border">
                    <button className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-text-muted hover:text-text transition-colors">
                      <BarChart3 size={14} /> View Advanced Search
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-text-muted hover:text-text hover:bg-primary/5 rounded-xl transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-text-muted hover:text-text hover:bg-primary/5 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">Alex Rivera</p>
            <p className="text-xs text-text-muted uppercase tracking-tighter">Admin</p>
          </div>
          <Link to="/settings" className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-text-muted hover:text-text transition-all">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};
