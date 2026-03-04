import { Instagram, Facebook, Twitter, Linkedin, Music2, Link2, Unlink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useState } from 'react';

interface PlatformCardProps {
  platform: string;
  name: string;
  status: 'connected' | 'disconnected';
  icon: string;
}

const iconMap: Record<string, any> = {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Music2
};

export const PlatformCard = ({ platform, name, status: initialStatus, icon }: PlatformCardProps) => {
  const Icon = iconMap[icon] || Link2;
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newStatus = status === 'connected' ? 'disconnected' : 'connected';
      setStatus(newStatus);
      toast(
        newStatus === 'connected' 
          ? `Successfully connected to ${platform}!` 
          : `Disconnected from ${platform}.`,
        newStatus === 'connected' ? 'success' : 'info'
      );
    }, 1000);
  };

  return (
    <div className="bg-card border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.1)] transition-all">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          status === 'connected' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/30"
        )}>
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg">{platform}</h4>
          <p className="text-sm text-white/40">{status === 'connected' ? name : 'Not connected'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          status === 'connected' ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/30"
        )}>
          {status}
        </div>
        <Button 
          variant={status === 'connected' ? 'outline' : 'primary'} 
          size="sm"
          onClick={handleToggle}
          isLoading={isLoading}
        >
          {status === 'connected' ? <Unlink size={14} className="mr-2" /> : <Link2 size={14} className="mr-2" />}
          {status === 'connected' ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};
