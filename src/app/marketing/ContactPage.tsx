import { useState } from 'react';
import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { FadeUp, GradientText } from '../../components/marketing/MarketingComponents';

const inputCls = 'w-full h-11 px-4 rounded-xl border border-border bg-card text-text placeholder:text-text-muted text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all';
const labelCls = 'block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5';

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate send
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <MarketingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Contact us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-text max-w-2xl mt-2">
              Let's <GradientText>talk.</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl">
              Have questions about BMS Engage? Our team is ready to help you find the right plan and get started.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-start">

          {/* Left: Contact info */}
          <div className="space-y-5">
            {/* Email card */}
            <FadeUp delay={0.05}>
              <div className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text mb-1">Email us</p>
                  <p className="text-text-muted text-sm">hello@bms-engage.com</p>
                  <p className="text-text-muted text-sm">support@bms-engage.com</p>
                </div>
              </div>
            </FadeUp>

            {/* Live chat card */}
            <FadeUp delay={0.1}>
              <div className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text mb-1">Live chat</p>
                  <p className="text-text-muted text-sm">Available Monday–Friday, 9am–6pm WAT.</p>
                  <p className="text-text-muted text-sm">No bots — real people who care.</p>
                </div>
              </div>
            </FadeUp>

            {/* Book a demo card */}
            <FadeUp delay={0.15}>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-bold text-base text-text mb-2">Book a demo</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-5">
                  Want a personalized walkthrough? Schedule a 30-minute demo with our product team and see exactly how BMS Engage can work for you.
                </p>
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01]">
                  Schedule a demo <ArrowRight size={15} />
                </button>
              </div>
            </FadeUp>

            {/* Human support callout */}
            <FadeUp delay={0.2}>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <h3 className="font-bold text-sm text-text mb-2">Human support, worldwide</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Our global Customer Advocacy team is spread across time zones to make sure help is always nearby. Whether you have a quick question or need technical support, we're here for you.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right: Form */}
          <FadeUp delay={0.1}>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={28} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2">Message sent!</h3>
                  <p className="text-text-muted text-sm">We'll get back to you within one business day.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First name</label>
                      <input
                        type="text" required
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        placeholder="Alex"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Last name</label>
                      <input
                        type="text" required
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Rivera"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Work email</label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@agency.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      placeholder="Your agency name"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>How can we help?</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your team and what you're looking for..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text placeholder:text-text-muted text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : (
                      <>Send message <ArrowRight size={15} /></>
                    )}
                  </button>
                  <p className="text-center text-xs text-text-muted">
                    By submitting, you agree to our privacy policy.
                  </p>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
