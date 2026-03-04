import { Edit2, Trash2, Calendar, Eye } from 'lucide-react';

interface MediaCardProps {
  id: string;
  type: string;
  title: string;
  url: string;
  date: string;
  key?: string | number;
  onView?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
  onDelete?: () => void;
}

export const MediaCard = ({ title, url, type, date, onView, onEdit, onSchedule, onDelete }: MediaCardProps) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.2)] transition-all">
      <div className="aspect-square overflow-hidden">
        <img 
          src={url} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
        <button 
          onClick={onView}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110"
        >
          <Eye size={18} />
        </button>
        <button 
          onClick={onSchedule}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110"
        >
          <Calendar size={18} />
        </button>
        <button 
          onClick={onEdit}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-500 transition-all hover:scale-110"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {type}
          </span>
          <span className="text-[10px] text-text-muted font-medium">{date}</span>
        </div>
        <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors text-text">{title}</h4>
      </div>
    </div>
  );
};
