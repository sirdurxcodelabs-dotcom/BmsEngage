import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Zap, Shield, Globe, BarChart3, Users, Smartphone, Cloud } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FeaturesPage() {
  const features = [
    {
      title: "Online Gallery System",
      desc: "A professional-grade digital asset management system built for speed. Organize, tag, and search through thousands of assets in milliseconds.",
      img: "https://picsum.photos/seed/feat1/800/600",
      points: ["Masonry-style visual grid", "AI-powered content recognition", "Bulk metadata management", "Custom collection sharing"]
    },
    {
      title: "Smart Calendar Scheduler",
      desc: "Visualize your entire content strategy. Drag and drop assets directly onto the calendar to schedule them across all platforms.",
      img: "https://picsum.photos/seed/feat2/800/600",
      points: ["Multi-platform visual timeline", "Automated posting windows", "Draft & approval states", "Holiday & event overlays"],
      reverse: true
    },
    {
      title: "Multi-platform Publishing",
      desc: "Stop logging into multiple accounts. Publish directly to Instagram, TikTok, LinkedIn, and X from one unified interface.",
      img: "https://picsum.photos/seed/feat3/800/600",
      points: ["Direct API integrations", "First comment automation", "Platform-specific previews", "Account tagging & location"]
    },
    {
      title: "Engagement Analytics",
      desc: "Understand what works. Track engagement, reach, and conversion metrics across all platforms in real-time.",
      img: "https://picsum.photos/seed/feat4/800/600",
      points: ["Unified performance dashboard", "Automated client reporting", "Competitor tracking", "ROI & conversion metrics"],
      reverse: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/30 overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block"
            >
              Platform Features
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
            >
              Built for <span className="gradient-text">High-Performance</span> Teams.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50"
            >
              Every tool you need to manage, publish, and scale your media operations in one unified creative OS.
            </motion.p>
          </div>

          {/* Feature Sections */}
          <div className="space-y-40 mb-40">
            {features.map((feature, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-20 items-center">
                <div className={feature.reverse ? "order-2" : "order-1"}>
                  <h2 className="text-4xl font-bold mb-6">{feature.title}</h2>
                  <p className="text-white/50 text-lg leading-relaxed mb-8">{feature.desc}</p>
                  <ul className="space-y-4">
                    {feature.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-3 text-white/70">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="text-primary" size={14} />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={cn(
                  "relative group",
                  feature.reverse ? "order-1" : "order-2"
                )}>
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  <div className="bg-card rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden">
                    <img src={feature.img} alt={feature.title} className="rounded-2xl w-full" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Features */}
          <div className="grid md:grid-cols-4 gap-8 mb-32">
            {[
              { icon: Zap, title: "Instant Sync", desc: "Real-time updates across all devices." },
              { icon: Shield, title: "Enterprise Security", desc: "SSO, 2FA, and granular permissions." },
              { icon: Smartphone, title: "Mobile Ready", desc: "Manage your agency on the go." },
              { icon: Cloud, title: "Unlimited Storage", desc: "Never worry about space again." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-card border border-white/5 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 mx-auto">
                  <item.icon size={24} />
                </div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <section className="text-center py-20 bg-white/[0.02] rounded-[40px] border border-white/5">
            <h2 className="text-4xl font-bold mb-8">Ready to experience BMS Engage?</h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-14 px-10">Start Free Trial</Button>
              <Button variant="outline" size="lg" className="h-14 px-10">Book a Demo</Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
