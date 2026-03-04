import { useState } from 'react';
import { Image as ImageIcon, Calendar, Send, Hash, Smile, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_ACCOUNTS } from '../lib/mock-data';
import { cn } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

export default function ComposerPage() {
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (!caption) {
      toast('Please enter a caption before scheduling.', 'error');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast('Please select at least one platform.', 'error');
      return;
    }
    
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      toast('Post scheduled successfully across all platforms!', 'success');
      setCaption('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Post Composer</h1>
          <p className="text-text-muted">Create and schedule content across multiple platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button onClick={handleSchedule} isLoading={isScheduling}>
            <Send size={18} className="mr-2" /> Schedule Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text">Select Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {MOCK_ACCOUNTS.map(account => (
                  <button
                    key={account.id}
                    onClick={() => togglePlatform(account.platform)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                      selectedPlatforms.includes(account.platform)
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-background border-border text-text-muted hover:border-text-muted"
                    )}
                  >
                    <span className="text-sm font-bold">{account.platform}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text">Media Content</h3>
              <div className="aspect-video bg-background border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-8 group hover:bg-primary/5 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon size={28} />
                </div>
                <p className="text-sm font-bold mb-1 text-text">Select from Gallery</p>
                <p className="text-xs text-text-muted">Or drag and drop a file here</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-text">Caption</h3>
                <span className={cn("text-xs font-bold", caption.length > 2000 ? "text-red-500" : "text-text-muted")}>
                  {caption.length} / 2200
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  className="w-full bg-background border border-border rounded-2xl px-6 py-5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[200px] resize-none leading-relaxed"
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-4 text-text-muted">
                  <button className="hover:text-primary transition-colors"><Smile size={20} /></button>
                  <button className="hover:text-primary transition-colors"><Hash size={20} /></button>
                  <button className="hover:text-primary transition-colors"><MapPin size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-8 space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-text">Live Preview</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-lg">
                <span className="text-xs font-bold text-text-muted">Instagram</span>
                <ChevronDown size={14} className="text-text-muted" />
              </div>
            </div>

            <div className="max-w-[360px] mx-auto bg-background rounded-[40px] border-[8px] border-border overflow-hidden shadow-2xl">
              <div className="p-4 flex items-center gap-3 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-text">bms_agency</p>
                  <p className="text-[10px] text-text-muted">New York, NY</p>
                </div>
              </div>
              <div className="aspect-square bg-card flex items-center justify-center text-text-muted/20">
                <ImageIcon size={64} />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4 text-text/80">
                  <div className="w-5 h-5 border-2 border-text/80 rounded-full" />
                  <div className="w-5 h-5 border-2 border-text/80 rounded-full" />
                  <div className="w-5 h-5 border-2 border-text/80 rounded-full" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-text">1,284 likes</p>
                  <p className="text-xs leading-relaxed text-text">
                    <span className="font-bold mr-2">bms_agency</span>
                    {caption || "Your caption will appear here..."}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-tighter mt-2">2 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-bold text-lg text-text">Scheduling Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background border border-border rounded-2xl space-y-2 cursor-pointer hover:border-primary/50 transition-all">
                  <Calendar size={18} className="text-primary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Date</p>
                  <p className="text-sm font-bold text-text">March 15, 2024</p>
                </div>
                <div className="p-4 bg-background border border-border rounded-2xl space-y-2 cursor-pointer hover:border-primary/50 transition-all">
                  <div className="w-4 h-4 rounded-full border-2 border-primary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Time</p>
                  <p className="text-sm font-bold text-text">10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
