import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Facebook, Twitter, Linkedin, Music2 as TikTok,
  Shield, CheckCircle2, ExternalLink,
} from 'lucide-react';
import { SocialAccount } from '../../types/social';
import { socialService } from '../../services/socialService';
import { motion } from 'motion/react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (account: SocialAccount) => void;
  existingAccounts: SocialAccount[];
}

const PLATFORMS = [
  {
    id: 'meta' as const,
    name: 'Meta (Facebook)',
    description: 'Connect your Facebook Page to schedule posts and view engagement.',
    Icon: Facebook,
    color: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white',
  },
  {
    id: 'twitter' as const,
    name: 'Twitter / X',
    description: 'Post tweets, threads, and media directly from BMS Engage.',
    Icon: Twitter,
    color: 'text-sky-400 bg-sky-400/10 group-hover:bg-sky-400 group-hover:text-white',
  },
  {
    id: 'linkedin' as const,
    name: 'LinkedIn',
    description: 'Share professional updates and articles to your LinkedIn profile.',
    Icon: Linkedin,
    color: 'text-blue-600 bg-blue-600/10 group-hover:bg-blue-600 group-hover:text-white',
  },
  {
    id: 'tiktok' as const,
    name: 'TikTok',
    description: 'Upload and schedule video content to your TikTok account.',
    Icon: TikTok,
    color: 'text-pink-500 bg-pink-500/10 group-hover:bg-pink-500 group-hover:text-white',
  },
];

export const ConnectAccountModal = ({ isOpen, onClose, existingAccounts }: ConnectAccountModalProps) => {
  const { toast } = useToast();

  const handleConnect = (platformId: 'meta' | 'twitter' | 'linkedin' | 'tiktok') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast('You must be logged in to connect an account.', 'error');
      return;
    }
    // Full-page redirect to backend OAuth initiation
    socialService.connectPlatform(platformId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Social Account" maxWidth="max-w-3xl">
      <div className="space-y-8">
        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
          <Shield size={24} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-text mb-1">Secure OAuth 2.0 Connection</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              BMS Engage uses official OAuth 2.0 protocols. We never store your passwords and only request the minimum permissions needed to manage your presence. Tokens are encrypted at rest.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map(({ id, name, description, Icon, color }) => {
            const isConnected = existingAccounts.some(
              a => a.platform === id || a.platform === name.toLowerCase()
            );

            return (
              <motion.div
                key={id}
                whileHover={{ y: -4 }}
                className={cn(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between gap-6 group',
                  isConnected
                    ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                    : 'bg-card border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-colors', color)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-text">{name}</h5>
                      {isConnected && (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 size={8} /> Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{description}</p>
                  </div>
                </div>

                <Button
                  variant={isConnected ? 'outline' : 'primary'}
                  className="w-full h-10 rounded-xl font-bold"
                  onClick={() => handleConnect(id)}
                  disabled={isConnected}
                >
                  {isConnected ? (
                    'Already Connected'
                  ) : (
                    <>
                      <ExternalLink size={14} className="mr-2" /> Connect {name}
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border flex justify-center">
          <button onClick={onClose} className="text-sm font-bold text-text-muted hover:text-text transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
