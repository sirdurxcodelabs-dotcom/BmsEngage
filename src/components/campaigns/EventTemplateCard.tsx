import * as React from 'react';
import { Facebook, Twitter, Linkedin, Music2 as TikTok, Globe, Wand2, Trash2 } from 'lucide-react';
import { EventTemplate } from '../../services/campaignEventService';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const PLATFORM_ICONS: Record<string, any> = {
  meta: Facebook, twitter: Twitter, linkedin: Linkedin, tiktok: TikTok, all: Globe,
};
const PLATFORM_COLORS: Record<string, string> = {
  meta: 'text-blue-500 bg-blue-500/10', twitter: 'text-sky-400 bg-sky-400/10',
  linkedin: 'text-blue-700 bg-blue-700/10', tiktok: 'text-pink-500 bg-pink-500/10',
  all: 'text-primary bg-primary/10',
};

interface Props {
  template: EventTemplate;
  onUse: (template: EventTemplate) => void;
  onDelete?: (id: string) => void;
}

export const EventTemplateCard = ({ template, onUse, onDelete }: Props) => {
  const Icon = PLATFORM_ICONS[template.platform] || Globe;
  const colorClass = PLATFORM_COLORS[template.platform] || 'text-primary bg-primary/10';

  return (
    <div className="glass border border-white/10 rounded-[20px] p-4 sm:p-5 space-y-3 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorClass)}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-xs font-black text-text uppercase tracking-widest">{template.platform === 'all' ? 'All Platforms' : template.platform}</p>
            <p className="text-[10px] text-text-muted capitalize">{template.contentType}</p>
          </div>
        </div>
        {onDelete && (
          <button onClick={() => onDelete(template.id)}
            className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {template.templateText && (
        <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{template.templateText}</p>
      )}

      {template.mediaUrl && (
        <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
          <img src={template.mediaUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}

      <Button onClick={() => onUse(template)} className="w-full h-9 rounded-xl font-bold shadow-lg shadow-primary/20">
        <Wand2 size={14} className="mr-2" /> Use Template
      </Button>
    </div>
  );
};
