import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Filter, 
  Clock, 
  LayoutGrid, 
  List, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Music2 as TikTok,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { MOCK_POSTS } from '../lib/mock-data';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const platformIcons: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok,
};

export default function SchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'Month' | 'Week' | 'Day' | 'Year'>('Month');
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const scheduledPosts = useMemo(() => {
    const posts: Record<string, any[]> = {};
    MOCK_POSTS.forEach(post => {
      if (post.scheduledDate || post.publishedDate) {
        const date = format(new Date(post.scheduledDate || post.publishedDate!), 'yyyy-MM-dd');
        if (!posts[date]) posts[date] = [];
        posts[date].push(post);
      }
    });
    return posts;
  }, []);

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    // If double click or specific action, navigate to composer
  };

  const handleCreatePost = (date?: Date) => {
    navigate('/composer', { state: { date: date ? format(date, 'yyyy-MM-dd') : format(selectedDate, 'yyyy-MM-dd') } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Content Scheduler</h1>
          <p className="text-text-muted font-medium">Plan and visualize your agency's content pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['Month', 'Week', 'Day', 'Year'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  view === v ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-muted hover:text-text"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Button onClick={() => handleCreatePost()}>
            <Plus size={18} className="mr-2" /> Schedule Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass border border-border rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-border flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-text">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg" onClick={prevMonth}><ChevronLeft size={18} /></Button>
                  <Button variant="outline" className="h-9 px-4 rounded-lg text-xs font-bold" onClick={() => setCurrentDate(new Date())}>Today</Button>
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg" onClick={nextMonth}><ChevronRight size={18} /></Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl"><Filter size={18} /></Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl"><LayoutGrid size={18} /></Button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border bg-white/5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const posts = scheduledPosts[dateStr] || [];
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <div
                    key={i}
                    onClick={() => handleDateClick(day)}
                    onDoubleClick={() => handleCreatePost(day)}
                    className={cn(
                      "min-h-[140px] p-3 border-r border-b border-border transition-all cursor-pointer group relative",
                      !isCurrentMonth && "bg-white/[0.02] opacity-30",
                      isSelected && "bg-primary/5 ring-2 ring-inset ring-primary/30 z-10",
                      !isSelected && isCurrentMonth && "hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={cn(
                        "text-xs font-black w-7 h-7 flex items-center justify-center rounded-xl transition-all",
                        isToday ? "bg-primary text-white shadow-lg shadow-primary/40" : "text-text-muted group-hover:text-text"
                      )}>
                        {format(day, 'd')}
                      </span>
                      {isCurrentMonth && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCreatePost(day); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/20 rounded-lg text-primary transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      {posts.slice(0, 3).map((post, j) => (
                        <div 
                          key={j} 
                          className={cn(
                            "px-2 py-1.5 rounded-lg text-[9px] font-bold border flex items-center gap-1.5 transition-all hover:scale-[1.02]",
                            post.status === 'Published' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-primary/10 border-primary/20 text-primary"
                          )}
                        >
                          <div className="flex -space-x-1 shrink-0">
                            {post.platforms.slice(0, 2).map((p: any) => {
                              const Icon = platformIcons[p] || ExternalLink;
                              return <Icon key={p} size={8} />;
                            })}
                          </div>
                          <span className="truncate">{post.content.substring(0, 15)}...</span>
                        </div>
                      ))}
                      {posts.length > 3 && (
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-widest pl-1">
                          + {posts.length - 3} more posts
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass border border-border p-8 rounded-[32px] space-y-8">
            <h3 className="font-bold text-xl flex items-center gap-3 text-text">
              <Clock size={22} className="text-primary" /> Queue Status
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Published', value: 124, color: 'bg-emerald-500' },
                { label: 'Scheduled', value: 42, color: 'bg-primary' },
                { label: 'Drafts', value: 18, color: 'bg-white/10' },
              ].map((item, i) => (
                <div key={i} className="space-y-2.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="text-text">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 184) * 100}%` }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass border border-border p-8 rounded-[32px] space-y-8">
            <div>
              <h3 className="font-bold text-xl text-text mb-1">Selected Date</h3>
              <p className="text-sm text-text-muted font-medium">{format(selectedDate, 'EEEE, MMMM do')}</p>
            </div>
            
            <div className="space-y-4">
              {scheduledPosts[format(selectedDate, 'yyyy-MM-dd')] ? (
                scheduledPosts[format(selectedDate, 'yyyy-MM-dd')].map((post, i) => (
                  <div key={i} className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {post.platforms.map((p: any) => {
                          const Icon = platformIcons[p] || ExternalLink;
                          return <Icon key={p} size={14} className="text-text-muted" />;
                        })}
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        post.status === 'Published' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                      )}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs text-text font-medium line-clamp-2 leading-relaxed mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                      <span>{post.scheduledDate ? format(new Date(post.scheduledDate), 'h:mm a') : 'Draft'}</span>
                      <button className="opacity-0 group-hover:opacity-100 text-primary hover:underline transition-all">Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                  <CalendarIcon size={32} className="mx-auto text-text-muted/20 mb-4" />
                  <p className="text-xs text-text-muted font-bold italic">No posts scheduled for this day.</p>
                </div>
              )}
              
              <Button onClick={() => handleCreatePost()} className="w-full h-12 rounded-xl font-bold mt-4 shadow-lg shadow-primary/20">
                <Plus size={18} className="mr-2" /> Add Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
