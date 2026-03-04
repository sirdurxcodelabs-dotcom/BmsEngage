import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { Shield, Target, Users, Zap, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/30 overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mission Section */}
          <section className="mb-32">
            <div className="max-w-3xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block"
              >
                Our Mission
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
              >
                Empowering <span className="gradient-text">Creative Excellence</span> through Technology.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/50 leading-relaxed"
              >
                BMS Engage was born from a simple observation: modern media agencies are drowning in tools but starving for workflow. We built BMS Engage to be the unified operating system for the next generation of creative teams.
              </motion.p>
            </div>
          </section>

          {/* Vision Section */}
          <section className="grid md:grid-cols-2 gap-20 mb-32 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10" />
              <img 
                src="https://picsum.photos/seed/vision/800/600" 
                alt="Vision" 
                className="rounded-3xl border border-white/10 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight">The Vision</h2>
              <p className="text-white/50 text-lg leading-relaxed">
                We envision a world where creative professionals spend 90% of their time creating and only 10% managing. BMS Engage is the bridge to that future, automating the mundane so you can focus on the extraordinary.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-2xl mb-1">10M+</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Assets Managed</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-2xl mb-1">500+</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Agencies Empowered</p>
                </div>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="py-20 border-y border-white/5 mb-32">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-4">The Problem in Media Today</h2>
              <p className="text-white/40">Fragmented workflows lead to creative burnout and missed opportunities.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Tool Fatigue", desc: "Switching between 10 different apps just to publish one post." },
                { icon: Shield, title: "Asset Chaos", desc: "Losing track of high-value creative assets in messy cloud folders." },
                { icon: Users, title: "Siloed Teams", desc: "Communication gaps between designers, managers, and clients." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">The Minds Behind BMS Engage</h2>
              <p className="text-white/40">A diverse team of engineers, designers, and media experts.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Alex Rivera", role: "Founder & CEO", img: "https://picsum.photos/seed/alex/300/300" },
                { name: "Sarah Chen", role: "Head of Product", img: "https://picsum.photos/seed/sarah/300/300" },
                { name: "Marcus Thorne", role: "CTO", img: "https://picsum.photos/seed/marcus/300/300" },
                { name: "Elena Vance", role: "Design Director", img: "https://picsum.photos/seed/elena/300/300" }
              ].map((member, i) => (
                <div key={i} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-primary/50 transition-all">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">Ready to transform your <br />agency operations?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg">
                Get Started Now <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 h-14 px-8 text-lg">
                Contact Sales
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
