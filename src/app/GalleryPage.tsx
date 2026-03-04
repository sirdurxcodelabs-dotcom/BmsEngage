import { useState, useMemo } from 'react';
import { MOCK_MEDIA } from '../lib/mock-data';
import { MediaCard } from '../components/cards/MediaCard';
import { Button } from '../components/ui/Button';
import { Search, Filter, Grid, List, Plus, Upload, X, FileText, Image as ImageIcon, Film, CheckCircle2, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const categories = ['All', 'Graphics', 'Flyers', 'Videos', 'Photos'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Dialog States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeDialog, setActiveDialog] = useState<'view' | 'edit' | 'schedule' | 'delete' | null>(null);

  // Upload States
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredMedia = useMemo(() => {
    return MOCK_MEDIA.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.type.toLowerCase() === activeCategory.toLowerCase().slice(0, -1);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast(`${files.length} assets uploaded successfully!`, 'success');
      setFiles([]);
      setIsUploadOpen(false);
    }, 2000);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openDialog = (media: any, type: 'view' | 'edit' | 'schedule' | 'delete') => {
    setSelectedMedia(media);
    setActiveDialog(type);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Media Gallery</h1>
          <p className="text-text-muted">Manage and organize your agency's creative assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus size={18} className="mr-2" /> Upload Media
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all text-text"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-card rounded-xl border border-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl">
            <Filter size={18} />
          </Button>
          <div className="flex items-center gap-1 p-1 bg-card rounded-xl border border-border">
            <button className={cn(
              "p-1.5 rounded-lg transition-colors",
              "bg-primary/10 text-primary"
            )}>
              <Grid size={18} />
            </button>
            <button className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors">
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMedia.map((media) => (
          <MediaCard 
            key={media.id} 
            id={media.id} 
            type={media.type} 
            title={media.title} 
            url={media.url} 
            date={media.date}
            onView={() => openDialog(media, 'view')}
            onEdit={() => openDialog(media, 'edit')}
            onSchedule={() => openDialog(media, 'schedule')}
            onDelete={() => openDialog(media, 'delete')}
          />
        ))}
      </div>

      {/* Upload Dialog */}
      <Modal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        title="Upload Media"
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedFiles = Array.from(e.dataTransfer.files);
                setFiles(prev => [...prev, ...droppedFiles]);
              }}
              className={`
                relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all
                ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border bg-background hover:bg-primary/5'}
              `}
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Upload size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1 text-text">Drag and drop files here</h3>
              <p className="text-text-muted mb-6 text-sm">JPG, PNG, MP4, and PDF. Max 50MB.</p>
              <Button size="sm">Browse Files</Button>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={(e) => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} />
            </div>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              <AnimatePresence>
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-3 bg-card border border-border rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-text-muted">
                      {file.type.includes('image') ? <ImageIcon size={18} /> : file.type.includes('video') ? <Film size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-text">{file.name}</p>
                      <p className="text-[10px] text-text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="p-1.5 text-text-muted hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Input label="Project Name" placeholder="e.g. Summer 2024 Launch" />
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
                <textarea 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[100px] resize-none"
                  placeholder="Describe these assets..."
                />
              </div>
            </div>
            <Button 
              className="w-full" 
              disabled={files.length === 0 || isUploading}
              isLoading={isUploading}
              onClick={handleUpload}
            >
              Upload Assets
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Dialog */}
      <Modal 
        isOpen={activeDialog === 'view'} 
        onClose={() => setActiveDialog(null)} 
        title="View Asset"
        className="max-w-3xl"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-black/20">
              <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
                <p className="text-sm text-text-muted">{selectedMedia.type} • {selectedMedia.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveDialog('edit')}><Edit2 size={16} className="mr-2" /> Edit</Button>
                <Button size="sm" onClick={() => setActiveDialog('schedule')}><Calendar size={16} className="mr-2" /> Schedule</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Dialog */}
      <Modal 
        isOpen={activeDialog === 'edit'} 
        onClose={() => setActiveDialog(null)} 
        title="Edit Asset"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <Input label="Asset Title" defaultValue={selectedMedia.title} />
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
              <textarea 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[120px] resize-none"
                defaultValue="Premium creative asset for social media campaigns."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
              <Button onClick={() => {
                toast('Asset updated successfully!', 'success');
                setActiveDialog(null);
              }}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Dialog */}
      <Modal 
        isOpen={activeDialog === 'schedule'} 
        onClose={() => setActiveDialog(null)} 
        title="Schedule Asset"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={selectedMedia.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-sm font-bold">{selectedMedia.title}</p>
                <p className="text-xs text-text-muted">Ready to schedule</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" defaultValue="2024-03-15" />
              <Input label="Time" type="time" defaultValue="10:30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Select Platforms</label>
              <div className="flex gap-2">
                {['Instagram', 'Facebook', 'Twitter'].map(p => (
                  <button key={p} className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-text hover:border-primary/50 transition-all">{p}</button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => {
              toast('Asset scheduled successfully!', 'success');
              setActiveDialog(null);
            }}>Confirm Schedule</Button>
          </div>
        )}
      </Modal>

      {/* Delete Dialog */}
      <Modal 
        isOpen={activeDialog === 'delete'} 
        onClose={() => setActiveDialog(null)} 
        title="Delete Asset"
      >
        {selectedMedia && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
              <p className="text-text-muted text-sm">This action cannot be undone. You are about to delete <span className="text-text font-bold">"{selectedMedia.title}"</span>.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setActiveDialog(null)}>Cancel</Button>
              <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 shadow-red-500/20" onClick={() => {
                toast('Asset deleted successfully!', 'info');
                setActiveDialog(null);
              }}>Delete Asset</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
