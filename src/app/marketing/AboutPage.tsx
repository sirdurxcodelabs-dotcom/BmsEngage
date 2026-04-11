import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Heart, Target, Users, Zap, ArrowRight } from 'lucide-react';
import {
  FadeUp, Section, SectionHeader, GradientText,
  StatCard, CTABanner, IconBadge,
} from '../../components/marketing/MarketingComponents';

export default function AboutPage() {
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
              About BMS Engage
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-text max-w-4xl mt-2">
              We believe social media management{' '}
              <GradientText>shouldn't be complicated.</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
              BMS Engage was built for agencies, creators, and brands who are tired of juggling a dozen tools just to publish one post. We built the unified workspace that makes social media simple again.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <Section className="py-16 md:py-20 border-y border-border bg-card/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="10,000+" label="Businesses & creators" icon={Users} delay={0} />
          <StatCard value="2M+" label="Posts published monthly" icon={Zap} delay={0.1} />
          <StatCard value="6" label="Social platforms" icon={Target} delay={0.2} />
          <StatCard value="500+" label="Agencies empowered" icon={Heart} delay={0.3} />
        </div>
      </Section>

      {/* ── Mission ──────────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeUp>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Our mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-text mt-2">
              Spend more time creating,{' '}
              <GradientText>less time managing.</GradientText>
            </h2>
            <p className="text-text-muted leading-relaxed mb-5">
              We envision a world where creative professionals spend 90% of their time creating and only 10% managing. BMS Engage is the bridge to that future — automating the mundane so you can focus on the extraordinary.
            </p>
            <p className="text-text-muted leading-relaxed">
              Since day one, we've been committed to building tools that are powerful enough for agencies but simple enough for solo creators. No bloat, no complexity — just the tools you need to grow.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card border border-border rounded-2xl p-12 flex items-center justify-center min-h-[280px] group-hover:border-indigo-500/30 transition-colors">
                <Target size={80} className="text-indigo-400/20" />
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────────────── */}
      <Section className="bg-card/20 border-y border-border">
        <SectionHeader
          label="Our values"
          title={<>What <GradientText>drives us</GradientText></>}
          subtitle="The principles that guide every decision we make."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: 'Customer first', desc: 'Every decision starts with what\'s best for the people using our platform.' },
            { icon: Zap, title: 'Simplicity', desc: 'Powerful tools don\'t have to be complicated. We obsess over making things easy.' },
            { icon: Users, title: 'Transparency', desc: 'We\'re open about how we build, what we charge, and where we\'re headed.' },
            { icon: Target, title: 'Impact', desc: 'We measure success by the growth we help our customers achieve.' },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={20} className="text-indigo-400" />
                </div>
                <h4 className="font-semibold text-sm text-text mb-2">{item.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* ── Team ─────────────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label="The team"
          title={<>The minds behind <GradientText>BMS Engage</GradientText></>}
          subtitle="A diverse team of engineers, designers, and media experts."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { name: 'Alex Rivera', role: 'Founder & CEO' },
            { name: 'Sarah Chen', role: 'Head of Product' },
            { name: 'Marcus Thorne', role: 'CTO' },
            { name: 'Elena Vance', role: 'Design Director' },
          ].map((member, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group text-center p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl group-hover:scale-110 transition-transform">
                  {member.name[0]}
                </div>
                <h4 className="font-semibold text-sm text-text">{member.name}</h4>
                <p className="text-xs text-text-muted mt-1">{member.role}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Section>
        <CTABanner
          title="Ready to transform your workflow?"
          subtitle="Join thousands of teams already using BMS Engage."
          primaryLabel="Get started free"
          primaryTo="/register"
          secondaryLabel="Contact sales"
          secondaryTo="/contact"
        />
      </Section>
    </div>
  );
}
