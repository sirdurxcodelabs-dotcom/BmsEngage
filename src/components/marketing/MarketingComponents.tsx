/**
 * Shared reusable components for all marketing/landing pages.
 * Provides a consistent design system across Home, About, Services, Features, Contact.
 */
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

// ─── Fade-up animation wrapper ───────────────────────────────────────────────
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}
export const FadeUp = ({ children, delay = 0, className, once = true }: FadeUpProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}
export const Section = ({ children, className, id }: SectionProps) => (
  <section id={id} className={cn('py-20 md:py-28 px-6', className)}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// ─── Section header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}
export const SectionHeader = ({ label, title, subtitle, center = true, className }: SectionHeaderProps) => (
  <FadeUp className={cn('mb-14 md:mb-16', center && 'text-center', className)}>
    {label && (
      <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 mb-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
        {label}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mt-2">{title}</h2>
    {subtitle && (
      <p className="mt-4 text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </FadeUp>
);

// ─── Gradient text ────────────────────────────────────────────────────────────
export const GradientText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400', className)}>
    {children}
  </span>
);

// ─── Primary CTA button ───────────────────────────────────────────────────────
interface CTAButtonProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
}
export const PrimaryButton = ({ to, href, children, className, onClick, type = 'button', disabled, loading }: CTAButtonProps) => {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white',
    'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
    'shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
    'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
    'disabled:opacity-50 disabled:pointer-events-none',
    className
  );
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls}>
      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export const OutlineButton = ({ to, href, children, className, onClick }: CTAButtonProps) => {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm',
    'border border-border text-text hover:border-indigo-500/50 hover:bg-indigo-500/5',
    'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
    className
  );
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
};

// ─── Feature card ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: LucideIcon;
  label?: string;
  title: string;
  desc: string;
  delay?: number;
}
export const FeatureCard = ({ icon: Icon, label, title, desc, delay = 0 }: FeatureCardProps) => (
  <FadeUp delay={delay}>
    <div className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 block">{label}</span>
      )}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={20} className="text-indigo-400" />
      </div>
      <h4 className="font-semibold text-sm text-text mb-2">{title}</h4>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </div>
  </FadeUp>
);

// ─── Checklist item ───────────────────────────────────────────────────────────
export const CheckItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-sm text-text-muted">
    <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    {text}
  </li>
);

// ─── Testimonial card ─────────────────────────────────────────────────────────
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}
export const TestimonialCard = ({ quote, author, role, delay = 0 }: TestimonialCardProps) => (
  <FadeUp delay={delay}>
    <div className="p-8 rounded-2xl bg-card border border-border hover:border-indigo-500/20 transition-all duration-300 h-full flex flex-col">
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#818cf8">
            <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"/>
          </svg>
        ))}
      </div>
      <p className="text-text-muted text-sm leading-relaxed flex-1 mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {author[0]}
        </div>
        <div>
          <p className="font-semibold text-sm text-text">{author}</p>
          <p className="text-xs text-text-muted">{role}</p>
        </div>
      </div>
    </div>
  </FadeUp>
);

// ─── CTA Banner ───────────────────────────────────────────────────────────────
interface CTABannerProps {
  title: React.ReactNode;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}
export const CTABanner = ({
  title, subtitle,
  primaryLabel = 'Get started free', primaryTo = '/register',
  secondaryLabel = 'Contact sales', secondaryTo = '/contact',
}: CTABannerProps) => (
  <FadeUp>
    <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{title}</h2>
        {subtitle && <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">{subtitle}</p>}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={primaryTo} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm bg-white text-indigo-700 hover:bg-white/90 transition-all hover:scale-[1.02] shadow-lg">
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          <Link to={secondaryTo} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all hover:scale-[1.02]">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  </FadeUp>
);

// ─── Icon badge ───────────────────────────────────────────────────────────────
export const IconBadge = ({ icon: Icon, size = 20 }: { icon: LucideIcon; size?: number }) => (
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
    <Icon size={size} className="text-indigo-400" />
  </div>
);

// ─── Stat glass card ──────────────────────────────────────────────────────────
interface StatCardProps {
  value: string;
  label: string;
  icon?: LucideIcon;
  delay?: number;
}
export const StatCard = ({ value, label, icon: Icon, delay = 0 }: StatCardProps) => (
  <FadeUp delay={delay}>
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-center group">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <Icon size={20} className="text-indigo-400" />
        </div>
      )}
      <p className="text-2xl md:text-3xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted uppercase tracking-widest mt-1 font-medium">{label}</p>
    </div>
  </FadeUp>
);
