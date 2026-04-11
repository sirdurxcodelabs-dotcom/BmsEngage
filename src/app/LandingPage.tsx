import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Layers, Calendar, BarChart3, Share2, CheckCircle2,
  Zap, Users, LayoutDashboard, MessageSquare, Clock, TrendingUp,
  Bell, Sparkles, Globe,
} from 'lucide-react';
import { MarketingNavbar } from '../components/layout/MarketingNavbar';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../contexts/AuthContext';
import {
  FadeUp, Section, SectionHeader, GradientText,
  FeatureCard, CheckItem, TestimonialCard, CTABanner, StatCard,
} from '../components/marketing/MarketingComponents';

// ─── Floating UI card ─────────────────────────────────────────────────────────
const FloatingCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`absolute hidden xl:block bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 ${className}`}>
    {children}
  </div>
);

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-8">
              <Sparkles size={12} /> Your complete social media workspace
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05] text-text">
              Manage social media{' '}
              <GradientText>without the chaos</GradientText>
            </h1>

            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Schedule posts, manage creative assets, track analytics, and collaborate with your team — all from one powerful workspace.
            </p>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] text-base"
              >
                <LayoutDashboard size={18} /> Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 px-4 rounded-xl border border-border bg-card text-text placeholder:text-text-muted text-sm w-full outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                />
                <Link
                  to={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="h-12 shrink-0 inline-flex items-center gap-2 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] text-sm whitespace-nowrap w-full sm:w-auto justify-center"
                >
                  Get started free <ArrowRight size={16} />
                </Link>
              </div>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-text-muted mt-3">No credit card required · Free forever</p>
            )}
          </motion.div>

          {/* Hero visual with floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-20 max-w-5xl mx-auto"
          >
            {/* Main dashboard mockup */}
            <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 overflow-hidden p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-6 rounded-lg bg-border/50" />
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Total Posts', value: '1,284', color: 'from-indigo-500/20 to-purple-500/20' },
                  { label: 'Scheduled', value: '42', color: 'from-cyan-500/20 to-blue-500/20' },
                  { label: 'Accounts', value: '8', color: 'from-emerald-500/20 to-teal-500/20' },
                  { label: 'Engagement', value: '4.8%', color: 'from-orange-500/20 to-amber-500/20' },
                ].map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${s.color} border border-border`}>
                    <p className="text-xs text-text-muted mb-1">{s.label}</p>
                    <p className="text-lg font-bold text-text">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 h-32 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border flex items-center justify-center">
                  <BarChart3 size={40} className="text-indigo-400/40" />
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-border flex items-center justify-center">
                  <Calendar size={32} className="text-cyan-400/40" />
                </div>
              </div>
            </div>

            {/* Floating analytics card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-6 top-8 hidden xl:block bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 w-52"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <TrendingUp size={14} className="text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-text">Growth</span>
              </div>
              <p className="text-2xl font-bold text-text mb-1">+124%</p>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
              <p className="text-xs text-text-muted mt-2">vs last month</p>
            </motion.div>

            {/* Floating notification card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -left-6 bottom-12 hidden xl:block bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 w-56"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <Bell size={14} className="text-indigo-400" />
                </div>
                <span className="text-xs font-semibold text-text">Post Published</span>
              </div>
              <p className="text-xs text-text-muted">Your Instagram post went live and got 248 likes in the first hour.</p>
            </motion.div>

            {/* Floating calendar card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -left-4 top-6 hidden xl:block bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 w-44"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <Clock size={14} className="text-cyan-400" />
                </div>
                <span className="text-xs font-semibold text-text">Scheduled</span>
              </div>
              <p className="text-xl font-bold text-text">42</p>
              <p className="text-xs text-text-muted">posts this week</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Social proof stats ────────────────────────────────────────────────── */}
      <Section className="py-16 md:py-20 border-y border-border bg-card/20">
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          <StatCard value="10,000+" label="Businesses & creators" icon={Users} delay={0} />
          <StatCard value="2M+" label="Posts published monthly" icon={Share2} delay={0.1} />
          <StatCard value="6" label="Social platforms" icon={Globe} delay={0.2} />
        </div>
      </Section>

      {/* ── Core Features (alternating) ───────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label="Core features"
          title={<>Everything you need to <GradientText>grow on social</GradientText></>}
          subtitle="From scheduling to analytics, BMS Engage handles the full lifecycle of your social media operations."
        />

        <div className="space-y-24">
          {[
            {
              label: 'PUBLISH',
              title: 'Schedule content to every platform',
              desc: 'Plan weeks of content in minutes. BMS Engage publishes directly to Instagram, TikTok, LinkedIn, X, and more — so you never miss a beat.',
              points: ['Visual drag-and-drop calendar', 'Cross-platform previews', 'Best-time-to-post AI suggestions', 'Bulk scheduling & recurring posts'],
              icon: Calendar,
            },
            {
              label: 'MEDIA',
              title: 'Centralize your creative assets',
              desc: 'Stop hunting through folders. Keep all your images, videos, and brand assets in one searchable, organized gallery built for speed.',
              points: ['AI-powered auto-tagging', 'Bulk metadata editing', 'Version history & variants', 'Instant shareable links'],
              icon: Layers,
              reverse: true,
            },
            {
              label: 'ANALYZE',
              title: 'Answers, not just analytics',
              desc: 'Understand what content works and why. Track engagement, reach, and growth across all platforms in one unified dashboard.',
              points: ['Real-time performance metrics', 'Automated client reports', 'Competitor benchmarking', 'ROI & conversion tracking'],
              icon: BarChart3,
            },
            {
              label: 'COLLABORATE',
              title: 'Work better as a team',
              desc: 'Built-in approval flows, role-based permissions, and client portals so your whole team stays aligned without the back-and-forth.',
              points: ['Approval workflows', 'Role-based access control', 'Client portals', 'Internal commenting'],
              icon: Users,
              reverse: true,
            },
          ].map((feature, i) => (
            <FadeUp key={i} delay={0.05}>
              <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center`}>
                <div className={feature.reverse ? 'md:order-2' : ''}>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {feature.label}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-text mt-2">{feature.title}</h3>
                  <p className="text-text-muted leading-relaxed mb-8">{feature.desc}</p>
                  <ul className="space-y-3">
                    {feature.points.map((pt, j) => <CheckItem key={j} text={pt} />)}
                  </ul>
                </div>
                <div className={`${feature.reverse ? 'md:order-1' : ''} relative group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-card border border-border rounded-2xl p-10 flex items-center justify-center min-h-[260px] group-hover:border-indigo-500/30 transition-colors duration-300">
                    <feature.icon size={72} className="text-indigo-400/20 group-hover:text-indigo-400/30 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* ── More features grid ────────────────────────────────────────────────── */}
      <Section className="bg-card/20 border-y border-border">
        <SectionHeader
          label="And so much more"
          title={<>Built for <GradientText>high-performance</GradientText> teams</>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Share2, title: 'Multi-platform publishing', desc: 'Direct API publishing to all major social networks.' },
            { icon: Clock, title: 'Smart scheduling', desc: 'Auto-schedule at the best times for your audience.' },
            { icon: MessageSquare, title: 'AI content assistant', desc: 'Brainstorm ideas and craft platform-specific posts.' },
            { icon: TrendingUp, title: 'Growth insights', desc: 'Learn what works and double down on it.' },
            { icon: Zap, title: 'Campaign management', desc: 'Plan and execute multi-platform campaigns with ease.' },
            { icon: Users, title: 'Team collaboration', desc: 'Manage multiple clients and teams from one dashboard.' },
            { icon: Layers, title: 'Media gallery', desc: 'Professional-grade digital asset management.' },
            { icon: BarChart3, title: 'White-label reports', desc: 'Send branded reports directly to your clients.' },
          ].map((item, i) => (
            <FeatureCard key={i} icon={item.icon} title={item.title} desc={item.desc} delay={i * 0.04} />
          ))}
        </div>
      </Section>

      {/* ── Who it's for ──────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label="Made for everyone"
          title={<>Whoever you are, <GradientText>we've got you covered</GradientText></>}
          subtitle="BMS Engage works for creators, agencies, and brands of all sizes."
        />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Sparkles,
              title: 'Creators',
              desc: 'Grow your personal brand with professional-grade tools. Save ideas, learn what content works, and post everywhere from one place.',
              points: ['Save content ideas instantly', 'Cross-post to all platforms', 'Track what grows your audience'],
            },
            {
              icon: Users,
              title: 'Agencies',
              desc: 'Manage multiple clients from one unified dashboard. Streamline approvals, reporting, and publishing without the chaos.',
              points: ['Multi-client management', 'Client approval portals', 'White-label reporting'],
            },
            {
              icon: Globe,
              title: 'Brands',
              desc: 'Maintain brand consistency across all accounts and markets. Collaborate with your team and measure what matters.',
              points: ['Brand asset library', 'Team collaboration tools', 'Advanced analytics'],
            },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={22} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">{item.desc}</p>
                <ul className="space-y-2.5">
                  {item.points.map((pt, j) => <CheckItem key={j} text={pt} />)}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <Section className="bg-gradient-to-b from-indigo-500/5 to-transparent border-y border-border">
        <SectionHeader
          label="Customer stories"
          title={<>Trusted by teams <GradientText>around the world</GradientText></>}
          subtitle="Real people, real results. Here's what our customers say."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <TestimonialCard
            quote="BMS Engage has completely transformed how we handle client media. We've saved at least 20 hours a week on manual publishing. The approval workflow alone is worth it."
            author="Sarah Jenkins"
            role="Creative Director, Vibe Media"
            delay={0}
          />
          <TestimonialCard
            quote="The most intuitive media platform I've ever used. The gallery and scheduler integration is a game-changer. Our team went from chaos to clarity in one week."
            author="Marcus Chen"
            role="Head of Social, Global Brands"
            delay={0.1}
          />
        </div>
      </Section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <Section>
        <CTABanner
          title={<>Grow your social presence <br className="hidden md:block" />with confidence</>}
          subtitle="Join thousands of businesses already using BMS Engage. No credit card required."
          primaryLabel="Get started free"
          primaryTo="/register"
          secondaryLabel="Talk to sales"
          secondaryTo="/contact"
        />
      </Section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <Logo size="md" />
              <p className="text-text-muted text-sm mt-4 leading-relaxed max-w-xs">
                The all-in-one social media workspace for modern teams and creators.
              </p>
            </div>
            {[
              {
                title: 'Features',
                links: [
                  { label: 'Publish', to: '/features' },
                  { label: 'Media Gallery', to: '/features' },
                  { label: 'Analytics', to: '/features' },
                  { label: 'Collaborate', to: '/features' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About', to: '/about' },
                  { label: 'Services', to: '/services' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'Careers', to: '#' },
                ],
              },
              {
                title: 'Support',
                links: [
                  { label: 'Help Center', to: '#' },
                  { label: 'Status', to: '#' },
                  { label: 'Privacy Policy', to: '#' },
                  { label: 'Terms of Service', to: '#' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-xs uppercase tracking-widest text-text-muted mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-text-muted hover:text-text transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-text-muted">
            <p>© 2026 BMS Engage. All rights reserved.</p>
            <p>Built for high-performance creative teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
