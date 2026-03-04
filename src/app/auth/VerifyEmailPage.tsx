import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
  };

  const handleVerifyDemo = () => {
    setIsVerified(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-2xl relative z-10 shadow-2xl text-center"
      >
        <Logo className="justify-center mb-10" size="sm" />
        
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="verify-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative">
                <Mail className="w-10 h-10 text-primary" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/5 rounded-full -z-10"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-3 text-text">Verify your email</h1>
                <p className="text-text-muted text-sm leading-relaxed">
                  We've sent a verification link to your email address. Please click the link to activate your account.
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full py-4 group" 
                  onClick={handleResend}
                  isLoading={isResending}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  Resend Verification Link
                </Button>
                
                <button 
                  onClick={handleVerifyDemo}
                  className="w-full py-2 text-xs text-text-muted/50 hover:text-text-muted transition-colors"
                >
                  (Demo: Simulate Verification)
                </button>
              </div>

              <Link to="/login" className="block text-sm text-text-muted hover:text-text transition-colors">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="verified-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-3 text-text">Email Verified!</h1>
                <p className="text-text-muted text-sm leading-relaxed">
                  Your account has been successfully verified. You're all set to start managing your media operations.
                </p>
              </div>

              <Button className="w-full py-4" onClick={() => navigate('/dashboard')}>
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-border flex items-center justify-center gap-2 text-[10px] text-text-muted uppercase tracking-widest font-bold">
          <ShieldCheck className="w-3 h-3" /> Secure Enterprise Authentication
        </div>
      </motion.div>
    </div>
  );
}
