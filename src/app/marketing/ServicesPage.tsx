import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Layers, Calendar, Share2, BarChart3, Users, Zap, CheckCircle2 } from 'lucide-react';
import {
  FadeUp, Section, SectionHeader, GradientText,
  CTABanner,
} from '../../components/marketing/MarketingComponents';

const services = [
  {
    icon: Calendar,
    label: 'PUBLISH',
    title: 'Social Media Scheduling',
    desc: 'Plan and automate your content distribution across all major platforms from a single, intuitive calendar.',
    features: ['Visual content calendar', 'Cross-platform previews', 'Best-time-to-post AI', 'Automated recurring posts'],
    gradient: 'from-indigo-500/15 to-purple-500/15',
    border: 'hover:border-indigo-500/40',
    glow: 'hover:shadow-indigo-500/10',
  },
  {
    icon: Layers,
    label: 'MEDIA',
    title: 'Media Asset Management',
    desc: 'Centralize all your creative assets in a high-performance, searchable gallery designed for media professionals.',
    features: ['AI-powered auto-tagging', 'Bulk metadata editing', 'Version history tracking', 'Instant sharing links'],
    gradient: 'from-purple-500/15 to-pink-500/15',
    border: 'hover:border-purple-500/40',
    glow: 'hover:shadow-purple-500/10',
  },
  {
    icon: Share2,
    label: 'CONNECT',
    title: 'Multi-Platform Publishing',
    desc: 'Direct integration with Instagram, TikTok, LinkedIn, and X. Publish content instantly or schedule for later.',
    features: ['Direct API publishing', 'First comment automation', 'Platform-specific captions', 'Multi-account management'],
    gradient: 'from-cyan-500/15 to-blue-500/15',
    border: 'hover:border-cyan-500/40',
    glow: 'hover:shadow-cyan-500/10',
  },
  {
    icon: BarChart3,
    label: 'ANALYZE',
    title: 'Analytics & Reporting',
    desc: 'Deep-dive into your performance metrics with customizable dashboards and automated client reports.',
    features: ['Real-time engagement tracking', 'Competitor benchmarking', 'White-label reports', 'ROI calculation'],
    gradient: 'from-emerald-500/15 to-teal-500/15',
    border: 'hover:border-emerald-500/40',
    glow: 'hover:shadow-emerald-500/10',
  },
  {
    icon: Users,
    label: 'COLLABORATE',
    title: 'Team Workflow Management',
    desc: 'Streamline collaboration between creators, managers, and clients with built-in approval workflows.',
    features: ['Role-based permissions', 'Client approval portals', 'Internal commenting', 'Task assignment'],
    gradient: 'from-orange-500/15 to-amber-500/15',
    border: 'hover:border-orange-500/40',
    glow: 'hover:shadow-orange-500/10',
  },
  {
    icon: Zap,
    label: 'AUTOMATE',
    title: 'Campaign Automation',
    desc: 'Plan and execute multi-platform campaigns with automated scheduling, notifications, and performance tracking.',
    features: ['Campaign calendar', 'Automated notifications', 'Performance tracking', 'Multi-platform coordination'],
    gradient: 'from-rose-500/15 to-pink-500/15',
    border: 'hover:border-rose-500/40',
    glow: 'hover:shadow-rose-500/10',
  },
];

export default function ServicesPage() {
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
              Our services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-text max-w-4xl mt-2">
              Everything your team needs to{' '}
              <GradientText>grow on social.</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
              BMS Engage provides the infrastructure your agency needs to scale creative output without increasing overhead.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Services Grid ────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className={`group p-8 rounded-2xl bg-card border border-border ${service.border} hover:shadow-xl ${service.glow} transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 block">{service.label}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} border border-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon size={22} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">{service.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1">{service.desc}</p>
                <ul className="space-y-2.5">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-xs text-text-muted">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* ── Enterprise CTA ───────────────────────────────────────────────────── */}
      <Section className="bg-card/20 border-t border-border">
        <CTABanner
          title={<>Need a <GradientText>custom solution?</GradientText></>}
          subtitle="We offer enterprise-grade customization for large agencies and media conglomerates. Let's talk about what you need."
          primaryLabel="Talk to our team"
          primaryTo="/contact"
          secondaryLabel="Start for free"
          secondaryTo="/register"
        />
      </Section>
    </div>
  );
}
