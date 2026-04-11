import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { CheckCircle2, Zap, Shield, Smartphone, Cloud, Calendar, Layers, BarChart3, Users, Share2, MessageSquare } from 'lucide-react';
import {
  FadeUp, Section, SectionHeader, GradientText,
  FeatureCard, CheckItem, CTABanner,
} from '../../components/marketing/MarketingComponents';

const mainFeatures = [
  {
    label: 'PUBLISH',
    title: 'The most complete publishing toolkit',
    desc: 'Schedule your content to Instagram, TikTok, LinkedIn, X, and more. Plan weeks of content in minutes with our visual calendar and direct API integrations.',
    points: ['Visual drag-and-drop calendar', 'Direct API publishing to all platforms', 'Best-time-to-post suggestions', 'Bulk scheduling & recurring posts', 'Platform-specific previews'],
    icon: Calendar,
  },
  {
    label: 'MEDIA',
    title: 'Turn any idea into the perfect post',
    desc: 'Keep all your creative assets organized in one searchable gallery. Create, organize, and repurpose content for any channel with ease.',
    points: ['Professional-grade media gallery', 'AI-powered auto-tagging', 'Bulk metadata management', 'Version history & asset variants', 'Instant shareable links'],
    icon: Layers,
    reverse: true,
  },
  {
    label: 'ANALYZE',
    title: 'Answers, not just analytics',
    desc: 'Whether it\'s basic analytics or in-depth reporting, BMS Engage helps you learn what works and how to improve across all platforms.',
    points: ['Unified performance dashboard', 'Real-time engagement metrics', 'Automated client reporting', 'Competitor benchmarking', 'ROI & conversion tracking'],
    icon: BarChart3,
  },
  {
    label: 'COLLABORATE',
    title: 'Manage, edit, and approve as a team',
    desc: 'Built-in approval flows, role-based permissions, and client portals so your whole team stays aligned. No more back-and-forth over email.',
    points: ['Role-based access control', 'Client approval portals', 'Internal commenting & feedback', 'Task assignment & tracking', 'Multi-client management'],
    icon: Users,
    reverse: true,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Platform features
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-text max-w-4xl mt-2">
              Built for{' '}
              <GradientText>high-performance</GradientText>{' '}
              teams.
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
              Every tool you need to manage, publish, and scale your social media — in one unified workspace.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Main Feature Sections ─────────────────────────────────────────────── */}
      <Section>
        <div className="space-y-24">
          {mainFeatures.map((feature, i) => (
            <FadeUp key={i} delay={0.05}>
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className={feature.reverse ? 'md:order-2' : ''}>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {feature.label}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-text mt-2">{feature.title}</h2>
                  <p className="text-text-muted leading-relaxed mb-8">{feature.desc}</p>
                  <ul className="space-y-3">
                    {feature.points.map((point, j) => <CheckItem key={j} text={point} />)}
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

      {/* ── Additional features grid ──────────────────────────────────────────── */}
      <Section className="bg-card/20 border-y border-border">
        <SectionHeader
          label="More features"
          title={<>And so <GradientText>much more</GradientText></>}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Share2, title: 'Multi-platform publishing', desc: 'Direct API publishing to all major social networks.' },
            { icon: MessageSquare, title: 'AI content assistant', desc: 'Brainstorm ideas and craft platform-specific posts.' },
            { icon: Zap, title: 'Instant sync', desc: 'Real-time updates across all devices and team members.' },
            { icon: Shield, title: 'Enterprise security', desc: 'SSO, 2FA, and granular role-based permissions.' },
            { icon: Smartphone, title: 'Mobile ready', desc: 'Manage your social media from anywhere, anytime.' },
            { icon: Cloud, title: 'Unlimited storage', desc: 'Never worry about running out of space for assets.' },
            { icon: BarChart3, title: 'White-label reports', desc: 'Send branded reports directly to your clients.' },
            { icon: Users, title: 'Team collaboration', desc: 'Manage multiple clients and teams from one dashboard.' },
          ].map((item, i) => (
            <FeatureCard key={i} icon={item.icon} title={item.title} desc={item.desc} delay={i * 0.04} />
          ))}
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Section>
        <CTABanner
          title="Ready to experience BMS Engage?"
          subtitle="Start for free — no credit card required."
          primaryLabel="Start free trial"
          primaryTo="/register"
          secondaryLabel="Book a demo"
          secondaryTo="/contact"
        />
      </Section>
    </div>
  );
}
