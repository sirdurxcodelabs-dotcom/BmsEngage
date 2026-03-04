import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function SchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const mockScheduledPosts: Record<string, any[]> = {
    '2024-03-10': [{ platform: 'Instagram', time: '10:00 AM', color: 'bg-pink-500' }],
    '2024-03-15': [{ platform: 'Twitter', time: '02:30 PM', color: 'bg-purple-400' }, { platform: 'LinkedIn', time: '05:00 PM', color: 'bg-purple-600' }],
    '2024-03-22': [{ platform: 'Facebook', time: '09:00 AM', color: 'bg-purple-500' }],
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Content Scheduler</h1>
          <p className="text-text-muted">Plan and visualize your agency's content pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
          <Button>
            <Plus size={18} className="mr-2" /> Schedule Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <h2 className="text-xl font-bold text-text">{format(currentDate, 'MMMM yyyy')}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft size={18} /></Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight size={18} /></Button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const posts = mockScheduledPosts[dateStr] || [];
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[120px] p-2 border-r border-b border-border transition-all cursor-pointer hover:bg-primary/5",
                      !isCurrentMonth && "opacity-20",
                      isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/30"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                        isToday ? "bg-primary text-white" : "text-text-muted"
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {posts.map((post, j) => (
                        <div key={j} className={cn("px-2 py-1 rounded text-[9px] font-bold text-white truncate", post.color)}>
                          {post.time} {post.platform}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-text">
              <Clock size={18} className="text-primary" /> Queue Status
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Published', value: 124, color: 'bg-emerald-500' },
                { label: 'Scheduled', value: 42, color: 'bg-primary' },
                { label: 'Drafts', value: 18, color: 'bg-text-muted/20' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="text-text">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${(item.value / 184) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg text-text">Selected Date</h3>
            <div className="p-4 bg-background border border-border rounded-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">{format(selectedDate, 'EEEE')}</p>
              <p className="text-2xl font-black text-text">{format(selectedDate, 'MMMM do')}</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Posts for this day</p>
              {mockScheduledPosts[format(selectedDate, 'yyyy-MM-dd')] ? (
                mockScheduledPosts[format(selectedDate, 'yyyy-MM-dd')].map((post, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                    <div className={cn("w-2 h-8 rounded-full", post.color)} />
                    <div>
                      <p className="text-xs font-bold text-text">{post.platform}</p>
                      <p className="text-[10px] text-text-muted">{post.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                  <p className="text-xs text-text-muted italic">No posts scheduled.</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4">
                <Plus size={14} className="mr-2" /> Add Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
