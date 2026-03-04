import * as React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, X, FileText, Image as ImageIcon, Film, Layers, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { MediaCategory, MediaStatus, MediaVisibility, MediaAsset } from '../../types/media';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (asset: Partial<MediaAsset>) => void;
  parentAsset?: MediaAsset;
}

export const UploadMediaModal = ({ isOpen, onClose, onUpload, parentAsset }: UploadMediaModalProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    title: '',
    category: 'Image' as MediaCategory,
    description: '',
    tags: '',
    status: 'Published' as MediaStatus,
    visibility: 'Public' as MediaVisibility,
  });

  React.useEffect(() => {
    if (isOpen) {
      if (parentAsset) {
        setFormData({
          title: parentAsset.title,
          category: parentAsset.category,
          description: parentAsset.description,
          tags: parentAsset.tags.join(', '),
          status: parentAsset.status,
          visibility: parentAsset.visibility,
        });
      } else {
        setFormData({
          title: '',
          category: 'Image',
          description: '',
          tags: '',
          status: 'Published',
          visibility: 'Public',
        });
      }
      setFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [isOpen, parentAsset]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast('Please select a file to upload', 'error');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Simulate metadata extraction
    const extension = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    const mockMetadata = {
      fileType: extension,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      mimeType: file.type,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      ...(isImage && { width: 1920, height: 1080, dpi: 72, colorModel: 'RGB' }),
      ...(isVideo && { duration: '00:30', resolution: '1080p', frameRate: 30, codec: 'H.264', bitrate: '10 Mbps', audioPresence: true }),
    };

    onUpload({
      title: formData.title || file.name.split('.')[0],
      category: formData.category,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status,
      visibility: formData.visibility,
      url: URL.createObjectURL(file), // In a real app, this would be the S3/Cloudinary URL
      metadata: mockMetadata as any,
    });

    toast(parentAsset ? 'Variant uploaded successfully!' : 'Media uploaded successfully!', 'success');
    setIsUploading(false);
    onClose();
    setFile(null);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={parentAsset ? `Upload Variant for: ${parentAsset.title}` : "Upload New Media"}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Parent Asset Context */}
        {parentAsset && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
              <img src={parentAsset.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Adding Variant to</p>
              <h4 className="text-sm font-bold text-text truncate">{parentAsset.title}</h4>
              <p className="text-xs text-text-muted">Current Version: v{parentAsset.variants.length + 1}.0</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Next Version</p>
              <p className="text-sm font-black text-primary">v{parentAsset.variants.length + 2}.0</p>
            </div>
          </div>
        )}

        {/* File Dropzone */}
        {!file ? (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group overflow-hidden",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text mb-1">Click or drag file to upload</p>
              <p className="text-sm text-text-muted">Support for all creative formats (Images, Videos, PDFs, etc.)</p>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                {file.type.startsWith('image/') ? <ImageIcon size={24} /> : file.type.startsWith('video/') ? <Film size={24} /> : <FileText size={24} />}
              </div>
              <div>
                <p className="font-bold text-text truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setFile(null)}
              className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Title" 
            placeholder="e.g. Summer Campaign Hero" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as MediaCategory})}
              className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 transition-all"
            >
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Flyer">Flyer</option>
              <option value="Graphics">Graphics</option>
            </select>
          </div>
          <Input 
            label="Tags" 
            placeholder="summer, campaign, 2024 (comma separated)" 
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as MediaStatus})}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 transition-all"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Visibility</label>
              <select 
                value={formData.visibility}
                onChange={(e) => setFormData({...formData, visibility: e.target.value as MediaVisibility})}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm text-text outline-none focus:border-primary/50 transition-all"
              >
                <option value="Public">Public</option>
                <option value="Team">Team</option>
                <option value="Private">Private</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Description</label>
          <textarea 
            placeholder="Describe this asset..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[100px] resize-none transition-all"
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-primary flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Uploading...
              </span>
              <span className="text-text">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose} disabled={isUploading}>Cancel</Button>
          <Button type="submit" isLoading={isUploading} disabled={!file}>
            {parentAsset ? 'Upload Variant' : 'Complete Upload'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
