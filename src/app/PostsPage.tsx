import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  Share2, 
  Eye,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Music2 as TikTok,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_POSTS, MOCK_ACCOUNTS } from '../lib/mock-data';
import { SocialPost, SocialPlatform } from '../types/social';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const platformIcons: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok,
};

export default function PostsPage() {
  const [activePlatform, setActivePlatform] = useState<string>('All Platforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);

  const platforms = ['All Platforms', ...MOCK_ACCOUNTS.map(a => a.platform)];

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter(post => {
      const matchesPlatform = activePlatform === 'All Platforms' || post.platforms.includes(activePlatform as SocialPlatform);
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [activePlatform, searchQuery]);

  const stats = {
    totalPosts: MOCK_POSTS.length,
    totalEngagement: MOCK_POSTS.reduce((acc, post) => acc + (post.engagement?.likes || 0) + (post.engagement?.comments || 0), 0),
    growth: 12.5,
    platformBreakdown: [
      { name: 'Instagram', value: 45, color: 'bg-pink-500' },
      { name: 'Facebook', value: 25, color: 'bg-blue-600' },
      { name: 'Twitter', value: 15, color: 'bg-sky-500' },
      { name: 'LinkedIn', value: 15, color: 'bg-blue-700' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Social Posts</h1>
          <p className="text-text-muted font-medium">Monitor and manage your live social media presence.</p>
        </div>
        <Link to="/composer">
          <Button className="h-12 px-6 rounded-xl font-bold shadow-xl shadow-primary/30">
            <Plus size={20} className="mr-2" /> Create Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-card border border-border rounded-xl pl-12 pr-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                className="h-12 px-5 bg-card border border-border rounded-xl flex items-center gap-3 text-sm font-bold text-text hover:border-primary/50 transition-all min-w-[200px]"
              >
                <Filter size={18} className="text-primary" />
                <span className="flex-1 text-left">{activePlatform}</span>
                <ChevronDown size={16} className={cn("transition-transform", isPlatformMenuOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isPlatformMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-full glass rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5"
                  >
                    {platforms.map(platform => (
                      <button 
                        key={platform}
                        onClick={() => { setActivePlatform(platform); setIsPlatformMenuOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors",
                          activePlatform === platform ? "bg-primary text-white" : "text-text-muted hover:text-text hover:bg-white/5"
                        )}
                      >
                        {platform}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-border rounded-3xl overflow-hidden hover:border-primary/30 transition-all group"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden border border-border shrink-0">
                      <img src={post.mediaUrls[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {post.platforms.map(p => {
                            const Icon = platformIcons[p] || ExternalLink;
                            return (
                              <div key={p} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-primary">
                                <Icon size={14} />
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                            {post.status} • {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'Draft'}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        post.status === 'Published' ? "bg-emerald-500/10 text-emerald-500" : 
                        post.status === 'Scheduled' ? "bg-primary/10 text-primary" : "bg-white/5 text-text-muted"
                      )}>
                        {post.status}
                      </span>
                    </div>

                    <p className="text-text leading-relaxed font-medium">
                      {post.content}
                    </p>

                    {post.status === 'Published' && post.engagement && (
                      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Heart size={16} className="text-pink-500" />
                          <span className="text-sm font-bold text-text">{post.engagement.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted">
                          <MessageSquare size={16} className="text-blue-500" />
                          <span className="text-sm font-bold text-text">{post.engagement.comments.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted">
                          <Share2 size={16} className="text-emerald-500" />
                          <span className="text-sm font-bold text-text">{post.engagement.shares.toLocaleString()}</span>
                        </div>
                        {post.engagement.views && (
                          <div className="flex items-center gap-2 text-text-muted">
                            <Eye size={16} className="text-primary" />
                            <span className="text-sm font-bold text-text">{post.engagement.views.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="glass border border-border p-8 rounded-3xl space-y-8 sticky top-24">
            <div>
              <h3 className="text-xl font-bold text-text mb-1">Analytics Summary</h3>
              <p className="text-sm text-text-muted">Last 30 days performance</p>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Engagement</p>
                  <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                    <TrendingUp size={12} /> {stats.growth}%
                  </div>
                </div>
                <p className="text-3xl font-black text-text">{stats.totalEngagement.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Platform Breakdown</h4>
                <div className="space-y-3">
                  {stats.platformBreakdown.map(p => (
                    <div key={p.name} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-text-muted">{p.name}</span>
                        <span className="text-text">{p.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${p.value}%` }}
                          className={cn("h-full rounded-full", p.color)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Link to="/analytics">
                  <Button variant="outline" className="w-full h-11 rounded-xl font-bold">
                    <BarChart3 size={16} className="mr-2" /> Detailed Reports
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
