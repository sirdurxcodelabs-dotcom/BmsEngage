import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      desc: "Perfect for solo creators and small teams.",
      features: ["5 Social Accounts", "1,000 Assets", "Basic Analytics", "1 User", "Standard Support"],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$129",
      desc: "The standard for growing media agencies.",
      features: ["25 Social Accounts", "Unlimited Assets", "Advanced Analytics", "5 Users", "Priority Support", "Custom Branding"],
      cta: "Get Started",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large-scale media conglomerates.",
      features: ["Unlimited Accounts", "Unlimited Assets", "White-label Reporting", "Unlimited Users", "Dedicated Account Manager", "API Access"],
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time from your settings." },
    { q: "Is there a free trial?", a: "We offer a 14-day free trial on all plans, no credit card required." },
    { q: "Do you offer agency discounts?", a: "Yes, we have special pricing for non-profits and large agency groups." },
    { q: "What platforms do you support?", a: "We currently support Instagram, TikTok, LinkedIn, X, and Facebook." }
  ];

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/30 overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block"
            >
              Pricing Plans
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
            >
              Simple Pricing for <span className="gradient-text">Serious Scale.</span>
            </motion.h1>
            <p className="text-xl text-white/50">Choose the plan that fits your agency's current needs and scale as you grow.</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-10 rounded-[40px] bg-card border transition-all relative",
                  plan.featured ? "border-primary shadow-2xl shadow-primary/20 scale-105 z-10" : "border-white/5"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-white/40 mb-8">{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-white/40">/mo</span>}
                </div>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="text-primary" size={18} />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Button variant={plan.featured ? 'primary' : 'outline'} className="w-full h-14 text-lg">
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-white/40">Everything you need to know about BMS Engage pricing.</p>
            </div>
            <div className="grid gap-6">
              {faqs.map((faq, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="text-primary shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table Placeholder */}
          <section className="text-center py-20 border-t border-white/5">
            <h2 className="text-4xl font-bold mb-8">Need more details?</h2>
            <Button variant="outline" size="lg" className="h-14 px-10">
              Download Feature Comparison (PDF)
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
