import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Music2 as TikTok, 
  Youtube, 
  Chrome as Google, 
  Apple, 
  Plus, 
  Shield, 
  CheckCircle2, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { SUPPORTED_PLATFORMS } from '../../lib/mock-data';
import { PlatformConfig, SocialAccount } from '../../types/social';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (account: SocialAccount) => void;
  existingAccounts: SocialAccount[];
}

const iconMap: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Music2: TikTok,
  Youtube,
  Google,
  Apple
};

export const ConnectAccountModal = ({ isOpen, onClose, onConnect, existingAccounts }: ConnectAccountModalProps) => {
  const [connectingId, setConnectingId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async (platform: PlatformConfig) => {
    // Prevent duplicate connections of same platform (for this demo, we'll just check platform type)
    if (existingAccounts.some(acc => acc.platform === platform.id)) {
      toast(`${platform.name} is already connected.`, 'error');
      return;
    }

    setConnectingId(platform.id);

    // Simulate OAuth Popup Flow
    try {
      // 1. Open mock popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        'about:blank',
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>Connecting to ${platform.name}</title>
              <style>
                body { font-family: sans-serif; display: flex; flex-col; align-items: center; justify-content: center; height: 100vh; background: #0E0E11; color: white; margin: 0; }
                .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #410179; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .card { background: #16161C; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); text-align: center; max-width: 400px; }
                h1 { margin: 0 0 10px; font-size: 24px; }
                p { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.5; }
                .btn { background: #410179; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px; width: 100%; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="loader"></div>
                <h1>Authorize BMS Engage</h1>
                <p>BMS Engage is requesting access to your ${platform.name} account to schedule posts and view analytics.</p>
                <button class="btn" onclick="window.opener.postMessage({ type: 'OAUTH_SUCCESS', platformId: '${platform.id}' }, '*')">Authorize Access</button>
              </div>
            </body>
          </html>
        `);
      }

      // 2. Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_SUCCESS' && event.data?.platformId === platform.id) {
          const newAccount: SocialAccount = {
            id: Date.now().toString(),
            platform: platform.id,
            username: `@bms_${platform.id.toLowerCase()}_official`,
            userId: `${platform.id.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'connected',
            connectedAt: new Date().toISOString(),
            profileImage: `https://picsum.photos/seed/${platform.id}/100/100`
          };
          
          onConnect(newAccount);
          toast(`Successfully connected to ${platform.name}!`, 'success');
          setConnectingId(null);
          onClose();
          window.removeEventListener('message', handleMessage);
          if (popup) popup.close();
        }
      };

      window.addEventListener('message', handleMessage);

    } catch (error) {
      console.error('OAuth error:', error);
      toast('Failed to connect account. Please try again.', 'error');
      setConnectingId(null);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Connect Social Account"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8">
        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
          <Shield size={24} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-text mb-1">Secure Enterprise Connection</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              BMS Engage uses official OAuth 2.0 protocols. We never store your passwords and only request the minimum permissions needed to manage your presence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const Icon = iconMap[platform.icon] || ExternalLink;
            const isConnecting = connectingId === platform.id;
            const isConnected = existingAccounts.some(acc => acc.platform === platform.id);

            return (
              <motion.div
                key={platform.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all flex flex-col justify-between gap-6 group",
                  isConnected 
                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-75" 
                    : "bg-card border-border hover:border-primary/50 hover:purple-glow"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isConnected ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-text">{platform.name}</h5>
                      {isConnected && (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 size={8} /> Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{platform.description}</p>
                  </div>
                </div>

                <Button 
                  variant={isConnected ? "outline" : "primary"}
                  className="w-full h-10 rounded-xl font-bold"
                  onClick={() => handleConnect(platform)}
                  disabled={isConnecting || isConnected}
                  isLoading={isConnecting}
                >
                  {isConnected ? 'Already Connected' : `Connect ${platform.name}`}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border flex justify-center">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-text-muted hover:text-text transition-colors"
          >
            Cancel and Return to Dashboard
          </button>
        </div>
      </div>
    </Modal>
  );
};
