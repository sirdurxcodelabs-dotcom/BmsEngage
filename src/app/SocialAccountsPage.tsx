import { useState, useEffect, useCallback } from 'react';
import { SocialAccountCard } from '../components/cards/SocialAccountCard';
import { ConnectAccountModal } from '../components/gallery/ConnectAccountModal';
import { Button } from '../components/ui/Button';
import { Plus, Shield, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { SocialAccount } from '../types/social';
import { socialService, ConnectedAccount } from '../services/socialService';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';

/** Map API account shape → SocialAccount used by the card */
const toSocialAccount = (a: ConnectedAccount): SocialAccount => ({
  id: a.id,
  platform: a.platform as any,
  username: a.username || a.displayName || a.accountId,
  displayName: a.displayName,
  avatar: a.avatar,
  userId: a.accountId,
  profileImage: a.avatar,
  status: a.tokenExpiry && new Date(a.tokenExpiry) < new Date() ? 'expired' : 'connected',
  connectedAt: a.createdAt,
  tokenExpiry: a.tokenExpiry,
  meta: a.meta,
});

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await socialService.getAccounts();
      setAccounts(data.map(toSocialAccount));
    } catch {
      toast('Failed to load connected accounts', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Handle OAuth callback query params: ?connected=meta or ?error=meta_failed
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    if (connected) {
      toast(`${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully!`, 'success');
      loadAccounts();
      setSearchParams({}, { replace: true });
    } else if (error) {
      const msg = error.replace(/_/g, ' ');
      toast(`Connection failed: ${msg}`, 'error');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleDisconnect = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!window.confirm(`Disconnect ${account?.platform}? This will stop all scheduled posts for this account.`)) return;
    try {
      await socialService.disconnect(id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      toast(`Disconnected from ${account?.platform}.`, 'info');
    } catch {
      toast('Failed to disconnect account.', 'error');
    }
  };

  const handleReconnect = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account) {
      socialService.connectPlatform(account.platform as any);
    }
  };

  const handleRefreshToken = async (id: string) => {
    try {
      await socialService.refreshToken(id);
      toast('Token refreshed successfully.', 'success');
      loadAccounts();
    } catch {
      toast('Failed to refresh token. Please reconnect.', 'error');
    }
  };

  const connectedCount = accounts.filter(a => a.status === 'connected').length;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Social Accounts</h1>
          <p className="text-text-muted font-medium">Connect and manage your brand's social presence across major platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAccounts}
            className="p-2.5 rounded-xl border border-border text-text-muted hover:text-text hover:border-primary/30 transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-6 rounded-xl font-bold shadow-xl shadow-primary/30"
          >
            <Plus size={20} className="mr-2" /> Connect New Account
          </Button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            Connected Accounts
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">
              {connectedCount}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {accounts.map(account => (
                <SocialAccountCard
                  key={account.id}
                  account={account}
                  onDisconnect={handleDisconnect}
                  onReconnect={handleReconnect}
                  onRefreshToken={handleRefreshToken}
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
                <p className="text-sm text-text-muted max-w-xs mb-6 leading-relaxed">
                  Connect your first social account to start scheduling posts and viewing analytics.
                </p>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Connect Your First Account
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass border border-border p-8 rounded-3xl flex gap-6 items-start hover:border-primary/30 transition-all">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-text">Secure Authentication</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              BMS Engage uses official OAuth 2.0 protocols. We never see or store your passwords. Tokens are AES-encrypted at rest and automatically refreshed before expiry.
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
              Your current plan allows up to 50 connected accounts. You are currently using {accounts.length} slot{accounts.length !== 1 ? 's' : ''}. Contact your account manager to increase limits.
            </p>
          </div>
        </div>
      </div>

      <ConnectAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={() => {}}
        existingAccounts={accounts}
      />
    </div>
  );
}
