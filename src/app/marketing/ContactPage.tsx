import { motion } from 'motion/react';
import { MarketingNavbar } from '../../components/layout/MarketingNavbar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/30 overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left Side: Info */}
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block"
              >
                Contact Us
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
              >
                Let's Build Your <span className="gradient-text">Media OS</span> Together.
              </motion.h1>
              <p className="text-xl text-white/50 mb-12">
                Have questions about BMS Engage? Our team of media operations experts is ready to help you scale your agency.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "hello@bms-engage.com" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
                  { icon: MapPin, label: "Office", value: "Creative District, San Francisco, CA" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:border-primary/30 transition-all">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                      <p className="text-lg font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 rounded-3xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="font-bold text-lg">Book a Demo</h4>
                </div>
                <p className="text-sm text-white/60 mb-6">Want a personalized walkthrough of the platform? Schedule a 30-minute demo with our product team.</p>
                <Button className="w-full h-12">Schedule Demo <ArrowRight className="ml-2" size={18} /></Button>
              </div>
            </div>

            {/* Right Side: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-white/10 p-10 rounded-[40px] shadow-2xl relative"
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full -z-10" />
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input label="First Name" placeholder="Alex" />
                  <Input label="Last Name" placeholder="Rivera" />
                </div>
                <Input label="Work Email" type="email" placeholder="alex@agency.com" />
                <Input label="Company Name" placeholder="BMS Engage Creative" />
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">How can we help?</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 min-h-[150px] resize-none transition-all"
                    placeholder="Tell us about your agency and what you're looking for..."
                  />
                </div>

                <Button className="w-full h-14 text-lg">Send Message</Button>
                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">By submitting this form, you agree to our privacy policy.</p>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
