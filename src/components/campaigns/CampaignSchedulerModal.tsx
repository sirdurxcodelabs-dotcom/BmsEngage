import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Send, Sparkles, Hash, Loader2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';
import { scheduledCampaignService, ScheduledCampaign, CampaignEvent } from '../../services/campaignEventService';
import { socialService, ConnectedAccount } from '../../services/socialService';
import api from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';

const PLATFORM_LABELS: Record<string, string> = {
  meta: 'Facebook', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: CampaignEvent;
  templateId?: string;
  initialCaption?: string;
  onSaved: (campaign: ScheduledCampaign) => void;
}

export const CampaignSchedulerModal = ({ isOpen, onClose, event, templateId, initialCaption = '', onSaved }: Props) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = React.useState<ConnectedAccount[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState(initialCaption);
  const [hashtags, setHashtags] = React.useState('');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [generatingAI, setGeneratingAI] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setCaption(initialCaption);
      setHashtags('');
      setScheduledDate(event.date ? event.date.split('T')[0] + 'T09:00' : '');
      socialService.getAccounts().then(accs => setAccounts(accs.filter(a => a.isActive))).catch(() => {});
    }
  }, [isOpen, initialCaption, event.date]);

  const togglePlatform = (p: string) =>
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generateAI = async () => {
    setGeneratingAI(true);
    try {
      const { data } = await api.post('/ai/caption', { title: event.title, tags: event.tags || [], platform: selectedPlatforms[0] || '' });
      setCaption(data.caption || '');
      toast('Caption generated!', 'success');
    } catch (err: any) { toast(err?.response?.data?.error || 'AI failed', 'error'); }
    finally { setGeneratingAI(false); }
  };

  const handleSave = async (status: 'draft' | 'scheduled') => {
    if (status === 'scheduled' && !scheduledDate) { toast('Select a date and time', 'error'); return; }
    setSaving(true);
    try {
      const campaign = await scheduledCampaignService.create({
        eventId: event.id,
        templateId: templateId || undefined,
        scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        status,
        platforms: selectedPlatforms,
        caption,
        hashtags: hashtags.split(',').map(h => h.trim()).filter(Boolean),
      } as any);
      onSaved(campaign);
      toast(status === 'scheduled' ? 'Campaign scheduled!' : 'Saved as draft', 'success');
      onClose();
    } catch (err: any) { toast(err?.response?.data?.error || 'Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Schedule Campaign — ${event.title}`} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Platforms */}
        <div className="space-y-2">
          <label className="text-xs font-black text-text-muted uppercase tracking-widest">Target Platforms</label>
          {accounts.length === 0 ? (
            <p className="text-xs text-amber-400">No connected accounts. <a href="/social-accounts" className="underline">Connect accounts →</a></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {accounts.map(acc => (
                <button key={acc.id} onClick={() => togglePlatform(acc.platform)}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all',
                    selectedPlatforms.includes(acc.platform) ? 'bg-primary text-white border-primary' : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20')}>
                  {PLATFORM_LABELS[acc.platform] || acc.platform}
                  {selectedPlatforms.includes(acc.platform) && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest">Caption</label>
            <Button variant="outline" size="sm" onClick={generateAI} isLoading={generatingAI} className="h-7 text-[10px] bg-white/5 border-white/10">
              <Sparkles size={11} className="mr-1 text-primary" /> AI Caption
            </Button>
          </div>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} spellCheck
            placeholder="Write your campaign caption…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[120px] resize-none transition-all" />
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <label className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Hash size={11} /> Hashtags (comma separated)
          </label>
          <input value={hashtags} onChange={e => setHashtags(e.target.value)} spellCheck
            placeholder="#BlackFriday, #Sale, #Agency"
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 transition-all" />
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <label className="text-xs font-black text-text-muted uppercase tracking-widest">Schedule Date & Time</label>
          <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 transition-all" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSave('draft')} isLoading={saving} className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={() => handleSave('scheduled')} isLoading={saving} className="flex-1 shadow-lg shadow-primary/30">
            <Send size={14} className="mr-2" /> Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};
