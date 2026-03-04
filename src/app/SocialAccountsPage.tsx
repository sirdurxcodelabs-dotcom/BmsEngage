import { MOCK_ACCOUNTS } from '../lib/mock-data';
import { SocialAccountCard } from '../components/cards/SocialAccountCard';
import { ConnectAccountModal } from '../components/gallery/ConnectAccountModal';
import { Button } from '../components/ui/Button';
import { Plus, Shield, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SocialAccount } from '../types/social';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(MOCK_ACCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleConnect = (newAccount: SocialAccount) => {
    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
  };

  const handleDisconnect = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (window.confirm(`Are you sure you want to disconnect ${account?.platform}? This will stop all scheduled posts.`)) {
      setAccounts(accounts.filter(a => a.id !== id));
      toast(`Disconnected from ${account?.platform}.`, 'info');
    }
  };

  const handleReconnect = (id: string) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, status: 'connected' } : a));
    toast('Account reconnected successfully.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Social Accounts</h1>
          <p className="text-text-muted font-medium">Connect and manage your brand's social presence across major platforms.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 rounded-xl font-bold shadow-xl shadow-primary/30"
        >
          <Plus size={20} className="mr-2" /> Connect New Account
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            Connected Accounts 
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">{accounts.length}</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {accounts.map((account) => (
              <SocialAccountCard 
                key={account.id} 
                account={account as any}
                onDisconnect={handleDisconnect}
                onReconnect={handleReconnect}
              />
            ))}
          </AnimatePresence>
          
          {accounts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">No accounts connected</h3>
              <p className="text-sm text-text-muted max-w-xs mb-6 leading-relaxed">Connect your first social account to start scheduling posts and viewing analytics.</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                Connect Your First Account
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass border border-border p-8 rounded-3xl flex gap-6 items-start hover:border-primary/30 transition-all">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-text">Secure Authentication</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              BMS Engage uses official OAuth 2.0 protocols to connect to your accounts. We never see or store your passwords. Your data is encrypted and protected at all times.
            </p>
          </div>
        </div>
        <div className="glass border border-border p-8 rounded-3xl flex gap-6 items-start hover:border-primary/30 transition-all">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <Info size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-text">Account Limits</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Your current enterprise plan allows up to 50 connected accounts. You are currently using {accounts.length} slots. Contact your account manager to increase limits.
            </p>
          </div>
        </div>
      </div>

      <ConnectAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleConnect}
        existingAccounts={accounts}
      />
    </div>
  );
}
