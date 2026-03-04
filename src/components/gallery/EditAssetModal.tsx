import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2, AlertCircle, Save, History, Plus, Upload, FileText, Image as ImageIcon, Film, Layers, ChevronDown } from 'lucide-react';
import { MediaAsset, MediaStatus, MediaVisibility, MediaCategory } from '../../types/media';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MediaAsset | null;
  onSave: (updatedAsset: MediaAsset) => void;
}

export const EditAssetModal = ({ isOpen, onClose, asset, onSave }: EditAssetModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<any>(null);
  const [isReplacing, setIsReplacing] = React.useState(false);

  React.useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        category: asset.category,
        description: asset.description,
        tags: asset.tags.join(', '),
        status: asset.status,
        visibility: asset.visibility,
      });
    }
  }, [asset]);

  if (!asset || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAsset: MediaAsset = {
      ...asset,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      status: formData.status,
      visibility: formData.visibility,
      metadata: {
        ...asset.metadata,
        modifiedDate: new Date().toISOString(),
      }
    };
    onSave(updatedAsset);
    toast('Asset updated successfully', 'success');
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Flyer': return <FileText size={18} />;
      case 'Image': return <ImageIcon size={18} />;
      case 'Video': return <Film size={18} />;
      case 'Graphics': return <Layers size={18} />;
      default: return <ImageIcon size={18} />;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Edit Asset: ${asset.title}`}
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Preview & Variants */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Asset Preview</h4>
              <div className="relative aspect-square rounded-[32px] overflow-hidden border border-border bg-white/5 group">
                <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button 
                    type="button"
                    onClick={() => setIsReplacing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/40 hover:scale-105 transition-transform"
                  >
                    <Upload size={18} /> Replace File
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                  <History size={14} /> Variants ({asset.variants.length})
                </h4>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Manage All</button>
              </div>
              <div className="space-y-3">
                {asset.variants.map((v, i) => (
                  <motion.div 
                    key={v.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={v.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text truncate max-w-[120px]">{v.title}</p>
                        <p className="text-[10px] text-text-muted">v{v.version}</p>
                      </div>
                    </div>
                    <button type="button" className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
                <button 
                  type="button"
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-2xl text-xs font-bold text-text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus size={16} /> Add New Variant
                </button>
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Asset Title</label>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-text outline-none focus:border-primary/50 transition-all"
                  placeholder="Enter asset title..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as MediaCategory})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-sm font-bold text-text outline-none focus:border-primary/50 appearance-none transition-all"
                  >
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Flyer">Flyer</option>
                    <option value="Graphics">Graphics</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    {getCategoryIcon(formData.category)}
                  </div>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Tags (Comma separated)</label>
                <input 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-text outline-none focus:border-primary/50 transition-all"
                  placeholder="marketing, summer, social..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as MediaStatus})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold text-text outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Visibility</label>
                  <select 
                    value={formData.visibility}
                    onChange={(e) => setFormData({...formData, visibility: e.target.value as MediaVisibility})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-bold text-text outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="Public">Public</option>
                    <option value="Team">Team</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-sm font-medium text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[160px] resize-none transition-all leading-relaxed"
                placeholder="Add a detailed description for this asset..."
              />
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-[24px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-text mb-1">Team Notification</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Updating asset details will notify team members who have this asset in their active projects. Changes are tracked in the version history.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
          <Button variant="outline" type="button" onClick={onClose} className="h-12 px-8 rounded-xl font-bold">Cancel</Button>
          <Button type="submit" className="h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/30">
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
