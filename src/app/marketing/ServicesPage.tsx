import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { Layers, Calendar, Share2, BarChart3, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Layers,
      title: "Media Asset Management",
      desc: "Centralize all your creative assets in a high-performance, searchable gallery designed for media professionals.",
      features: ["AI-powered auto-tagging", "Bulk metadata editing", "Version history tracking", "Instant format conversion"]
    },
    {
      icon: Calendar,
      title: "Social Media Scheduling",
      desc: "Plan and automate your content distribution across all major platforms from a single, intuitive calendar.",
      features: ["Visual content calendar", "Cross-platform previews", "Best-time-to-post AI", "Automated recurring posts"]
    },
    {
      icon: Share2,
      title: "Content Publishing",
      desc: "Direct integration with Instagram, TikTok, LinkedIn, and X. Publish content instantly or schedule for later.",
      features: ["Direct API publishing", "First comment automation", "Platform-specific captions", "Multi-account management"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      desc: "Deep-dive into your performance metrics with customizable dashboards and automated client reports.",
      features: ["Real-time engagement tracking", "Competitor benchmarking", "White-label reports", "ROI calculation"]
    },
    {
      icon: Users,
      title: "Team Workflow Management",
      desc: "Streamline collaboration between creators, managers, and clients with built-in approval workflows.",
      features: ["Role-based permissions", "Client approval portals", "Internal commenting", "Task assignment"]
    }
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
              Our Services
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
            >
              Comprehensive <span className="gradient-text">Media Operations</span> for Modern Teams.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50"
            >
              BMS Engage provides the infrastructure your agency needs to scale creative output without increasing overhead.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[32px] bg-card border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all" />
                
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <service.icon size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs text-white/70">
                      <CheckCircle2 className="text-primary" size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="ghost" size="sm" className="group/btn p-0 hover:bg-transparent text-primary">
                  Learn more <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <section className="text-center py-20 border-t border-white/5">
            <h2 className="text-4xl font-bold mb-8">Need a custom solution?</h2>
            <p className="text-white/40 mb-10 max-w-xl mx-auto">We offer enterprise-grade customization for large agencies and media conglomerates.</p>
            <Button size="lg" className="h-14 px-10">
              Talk to Our Experts
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
