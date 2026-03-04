import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { ArrowRight, BarChart3, TrendingUp, Users } from 'lucide-react';

export default function CaseStudiesPage() {
  const cases = [
    {
      client: "Vanguard Media",
      title: "Scaling Content Output by 400%",
      desc: "How a boutique agency managed 50+ clients with a team of just 5 people using BMS Engage.",
      img: "https://picsum.photos/seed/case1/800/600",
      metrics: [
        { label: "Efficiency", value: "+400%", icon: TrendingUp },
        { label: "Engagement", value: "+120%", icon: BarChart3 }
      ]
    },
    {
      client: "Luxe Brands",
      title: "Global Social Presence Unified",
      desc: "Consolidating 12 international brand accounts into one high-performance dashboard.",
      img: "https://picsum.photos/seed/case2/800/600",
      metrics: [
        { label: "Reach", value: "2.4M", icon: Users },
        { label: "Time Saved", value: "30h/wk", icon: TrendingUp }
      ]
    },
    {
      client: "TechFlow Agency",
      title: "Automating the Creative Workflow",
      desc: "Eliminating manual publishing and approval bottlenecks for a fast-paced tech agency.",
      img: "https://picsum.photos/seed/case3/800/600",
      metrics: [
        { label: "Approvals", value: "2x Faster", icon: TrendingUp },
        { label: "Errors", value: "-95%", icon: BarChart3 }
      ]
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
              Case Studies
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
            >
              Real Results for <span className="gradient-text">Real Agencies.</span>
            </motion.h1>
            <p className="text-xl text-white/50">Discover how leading creative teams are using BMS Engage to redefine their media operations.</p>
          </div>

          <div className="grid gap-20 mb-32">
            {cases.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 items-center group"
              >
                <div className={i % 2 === 1 ? "md:order-2" : "md:order-1"}>
                  <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                    <img src={item.img} alt={item.client} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-8 left-8">
                      <span className="px-4 py-1.5 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest">{item.client}</span>
                    </div>
                  </div>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : "md:order-2"}>
                  <h2 className="text-4xl font-bold mb-6">{item.title}</h2>
                  <p className="text-white/50 text-lg leading-relaxed mb-10">{item.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {item.metrics.map((metric, j) => (
                      <div key={j} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <metric.icon className="text-primary mb-4" size={24} />
                        <h4 className="text-3xl font-black mb-1">{metric.value}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="lg" className="group/btn">
                    Read Full Story <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={20} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <section className="bg-card border border-white/10 rounded-[40px] p-12 md:p-20 text-center">
            <h2 className="text-4xl font-bold mb-8">Want to see your agency here?</h2>
            <p className="text-white/40 mb-10 max-w-xl mx-auto">Join 500+ agencies that have already transformed their creative workflow with BMS Engage.</p>
            <Button size="lg" className="h-14 px-10">
              Start Your Success Story
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
