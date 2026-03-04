import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'error@example.com') {
        setStatus('error');
        setIsLoading(false);
      } else {
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden md:flex md:w-1/2 relative bg-card items-center justify-center p-12 overflow-hidden border-r border-border">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-secondary/20 blur-[120px] rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Logo size="lg" className="mb-8 justify-center" />
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-text">
              Welcome Back to <span className="gradient-text">BMS Engage</span>
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Manage your media operations, schedule content, and scale your agency with our complete publishing system.
            </p>
          </motion.div>

          {/* Abstract Glass Shapes */}
          <div className="mt-12 relative h-64">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/4 w-32 h-32 glass rounded-2xl rotate-12 flex items-center justify-center"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-lg blur-sm" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-0 right-1/4 w-40 h-40 glass rounded-3xl -rotate-6 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-xl blur-md" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Mobile Background */}
        <div className="md:hidden absolute inset-0 bg-primary/5 blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass p-8 rounded-2xl relative z-10 shadow-2xl"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-text">Sign In</h2>
            <p className="text-text-muted text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-12 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/50" />
              <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-lg group relative overflow-hidden"
              isLoading={isLoading}
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Success
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.div 
                    key="error"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" /> Error
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-primary/5 transition-all group">
              <Chrome className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-text">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-primary/5 transition-all group">
              <Apple className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-text">Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
