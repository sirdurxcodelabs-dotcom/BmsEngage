import { MOCK_ACCOUNTS } from '../lib/mock-data';
import { PlatformCard } from '../components/cards/PlatformCard';
import { Button } from '../components/ui/Button';
import { Plus, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';

export default function SocialAccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Social Accounts</h1>
          <p className="text-text-muted">Connect and manage your brand's social presence.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Connect New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_ACCOUNTS.map((account) => (
          <PlatformCard key={account.id} {...account as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-8 rounded-3xl flex gap-6 items-start">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-text">Secure Authentication</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              BMS Engage uses official OAuth 2.0 protocols to connect to your accounts. We never see or store your passwords.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border p-8 rounded-3xl flex gap-6 items-start">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-text">Account Limits</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Your current plan allows up to 10 connected accounts. You are currently using 4 slots.
            </p>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Connect Social Account"
      >
        <div className="space-y-6">
          <p className="text-sm text-text-muted">Select a platform to connect your account to BMS Engage.</p>
          <div className="grid grid-cols-2 gap-4">
            {['Instagram', 'Facebook', 'Twitter', 'TikTok', 'LinkedIn', 'YouTube'].map(platform => (
              <button 
                key={platform}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-background border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:text-primary transition-colors">
                  <Plus size={20} />
                </div>
                <span className="text-sm font-bold text-text">{platform}</span>
              </button>
            ))}
          </div>
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
