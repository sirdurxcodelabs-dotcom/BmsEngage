import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Calendar, Send, Hash, Smile, MapPin, ChevronDown, X, Clock, Globe, ShieldCheck, Plus, MoreVertical, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_ACCOUNTS } from '../lib/mock-data';
import { cn } from '../lib/utils';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';

export default function ComposerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('10:30');
  const [isScheduling, setIsScheduling] = useState(false);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState('Instagram');

  useEffect(() => {
    if (location.state) {
      if (location.state.asset) {
        setSelectedAsset(location.state.asset);
      }
      if (location.state.date) {
        setScheduledDate(location.state.date);
      }
    }
  }, [location.state]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (!caption && !selectedAsset) {
      toast('Please add some content or media before scheduling.', 'error');
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
      navigate('/scheduler');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Post Composer</h1>
          <p className="text-text-muted font-medium">Craft and schedule your next viral content across all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold">
            Save Draft
          </Button>
          <Button onClick={handleSchedule} isLoading={isScheduling} className="h-12 px-6 rounded-xl font-bold shadow-xl shadow-primary/30">
            <Send size={18} className="mr-2" /> Schedule Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass border border-border rounded-[32px] p-8 space-y-10">
            {/* Platform Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-text flex items-center gap-2">
                  <Globe size={20} className="text-primary" /> Select Platforms
                </h3>
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  {selectedPlatforms.length} Selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_ACCOUNTS.map(account => (
                  <button
                    key={account.id}
                    onClick={() => togglePlatform(account.platform)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300",
                      selectedPlatforms.includes(account.platform)
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-white/5 border-white/10 text-text-muted hover:border-white/20"
                    )}
                  >
                    <span className="text-sm font-bold">{account.platform}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" /> Media Content
              </h3>
              
              {selectedAsset ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-border group">
                  <img 
                    src={selectedAsset.url || selectedAsset.variants?.[0]?.url} 
                    alt="" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-white">{selectedAsset.title}</p>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => navigate('/gallery')}
                  className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-center p-8 group hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Plus size={32} />
                  </div>
                  <p className="text-lg font-bold mb-2 text-text">Select from Gallery</p>
                  <p className="text-sm text-text-muted max-w-xs">Browse your media library to find the perfect asset for your post.</p>
                </div>
              )}
            </div>

            {/* Caption Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-text">Caption</h3>
                <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", caption.length > 2000 ? "bg-red-500/10 text-red-500" : "bg-white/5 text-text-muted")}>
                  {caption.length} / 2200
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind? Add hashtags, mentions, and emojis..."
                  className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-7 text-base text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[250px] resize-none leading-relaxed transition-all"
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-5 text-text-muted">
                  <button className="hover:text-primary transition-colors"><Smile size={22} /></button>
                  <button className="hover:text-primary transition-colors"><Hash size={22} /></button>
                  <button className="hover:text-primary transition-colors"><MapPin size={22} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Scheduling Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass border border-border rounded-[32px] p-8 space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-text">Live Preview</h3>
              <div className="relative">
                <button 
                  onClick={() => setActivePreviewPlatform(activePreviewPlatform === 'Instagram' ? 'Facebook' : 'Instagram')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-all"
                >
                  <span className="text-xs font-bold text-text">{activePreviewPlatform}</span>
                  <ChevronDown size={14} className="text-text-muted" />
                </button>
              </div>
            </div>

            {/* Device Mockup */}
            <div className="max-w-[340px] mx-auto bg-card rounded-[48px] border-[10px] border-border overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div className="p-4 flex items-center gap-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs">B</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text">bms_agency</p>
                  <p className="text-[10px] text-text-muted">Sponsored</p>
                </div>
                <MoreVertical size={16} className="text-text-muted" />
              </div>
              
              <div className="aspect-square bg-white/5 flex items-center justify-center text-text-muted/20 overflow-hidden">
                {selectedAsset ? (
                  <img 
                    src={selectedAsset.url || selectedAsset.variants?.[0]?.url} 
                    alt="" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon size={64} className="opacity-10" />
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-text">
                    <Heart size={20} />
                    <MessageSquare size={20} />
                    <Send size={20} />
                  </div>
                  <div className="w-5 h-5 border-2 border-text rounded-sm" />
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-text">1,284 likes</p>
                  <div className="text-xs leading-relaxed text-text">
                    <span className="font-bold mr-2">bms_agency</span>
                    <span className="text-text-muted">
                      {caption || "Your caption will appear here. Add some personality to your post!"}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted uppercase tracking-tighter mt-2 font-bold">Just now</p>
                </div>
              </div>
            </div>

            {/* Scheduling Options */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <h3 className="font-bold text-lg text-text flex items-center gap-2">
                <Clock size={20} className="text-primary" /> Scheduling Options
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 cursor-pointer hover:border-primary/50 transition-all group">
                  <Calendar size={20} className="text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Date</p>
                    <input 
                      type="date" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="bg-transparent text-sm font-bold text-text outline-none w-full"
                    />
                  </div>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 cursor-pointer hover:border-primary/50 transition-all group">
                  <Clock size={20} className="text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Time</p>
                    <input 
                      type="time" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="bg-transparent text-sm font-bold text-text outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-500/80 leading-relaxed font-medium">
                  Your post is optimized for peak engagement. Scheduling for this time typically yields <span className="font-bold text-emerald-500">24% more reach</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
