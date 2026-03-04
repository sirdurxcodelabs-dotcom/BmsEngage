import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { MOCK_ANALYTICS_DATA, MOCK_PLATFORM_DATA } from '../lib/mock-data';
import { ChartCard } from '../components/cards/ChartCard';
import { StatCard } from '../components/cards/StatCard';
import { Button } from '../components/ui/Button';
import { Download, Calendar, Filter } from 'lucide-react';

const COLORS = ['#410179', '#6D28D9', '#7C3AED', '#8B5CF6'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Performance Analytics</h1>
          <p className="text-text-muted">Track your agency's growth and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar size={18} className="mr-2" /> Last 30 Days
          </Button>
          <Button variant="outline">
            <Download size={18} className="mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Reach" value="2.4M" change="+18.2%" trend="up" />
        <StatCard label="Engagement" value="482K" change="+12.5%" trend="up" />
        <StatCard label="Followers" value="+12.4K" change="+4.2%" trend="up" />
        <StatCard label="Avg. CTR" value="3.2%" change="-0.8%" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Engagement Over Time" subtitle="Daily engagement and reach metrics">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_ANALYTICS_DATA}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#410179" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#410179" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              <Area type="monotone" dataKey="engagement" stroke="#410179" fillOpacity={1} fill="url(#colorEngagement)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Platform Comparison" subtitle="Engagement distribution across social networks">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              <Bar dataKey="reach" fill="#410179" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard title="Content Type Performance" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_PLATFORM_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {MOCK_PLATFORM_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-text">Top Performing Media</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Summer Campaign Video', reach: '1.2M', engagement: '124K', growth: '+24%' },
              { title: 'Product Launch Graphic', reach: '842K', engagement: '82K', growth: '+18%' },
              { title: 'Client Testimonial Photo', reach: '420K', engagement: '45K', growth: '+12%' },
            ].map((media, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Filter size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text group-hover:text-primary transition-colors">{media.title}</p>
                    <p className="text-xs text-text-muted">{media.reach} Reach • {media.engagement} Engagement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">{media.growth}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Growth</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
