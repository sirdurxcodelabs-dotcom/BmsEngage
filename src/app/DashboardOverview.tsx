import { MOCK_STATS, MOCK_MEDIA } from '../lib/mock-data';
import { StatCard } from '../components/cards/StatCard';
import { MediaCard } from '../components/cards/MediaCard';
import { Button } from '../components/ui/Button';
import { Plus, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard</h1>
          <p className="text-text-muted">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <CalendarIcon size={18} className="mr-2" /> View Calendar
          </Button>
          <Link to="/composer">
            <Button>
              <Plus size={18} className="mr-2" /> Create Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map((stat, i) => (
          <StatCard key={i} {...stat as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text">Recent Uploads</h2>
            <Link to="/gallery" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MOCK_MEDIA.slice(0, 6).map((media) => (
              <MediaCard 
                key={media.id} 
                id={media.id} 
                type={media.category} 
                title={media.title} 
                url={media.url} 
                date={new Date(media.metadata.createdDate).toLocaleDateString()} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text">Upcoming Posts</h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            {[
              { time: '10:00 AM', platform: 'Instagram', title: 'Summer Campaign Launch' },
              { time: '02:30 PM', platform: 'Twitter', title: 'Product Update Thread' },
              { time: '05:00 PM', platform: 'LinkedIn', title: 'Hiring Announcement' },
            ].map((post, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors group cursor-pointer">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-primary">{post.time.split(' ')[1]}</span>
                  <span className="text-text">{post.time.split(' ')[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{post.platform}</p>
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors text-text">{post.title}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Full Schedule
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 text-text">Upgrade to Pro</h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">Unlock advanced analytics, unlimited accounts, and AI-powered caption generation.</p>
              <Button size="sm" className="bg-white text-primary hover:bg-white/90">Upgrade Now</Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
