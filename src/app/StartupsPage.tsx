import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, X, Check, Loader2 } from 'lucide-react';
import { startupService, Startup } from '../services/startupService';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const isOwner = user?.activeContext === 'agency' && user?.agencyRole === 'owner';

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await startupService.list();
      setStartups(data);
    } catch {
      toast('Failed to load startups', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (s: Startup) => {
    setEditingId(s.id);
    setForm({ name: s.name, description: s.description });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast('Name is required', 'error'); return; }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await startupService.update(editingId, form.name, form.description);
        setStartups(prev => prev.map(s => s.id === editingId ? updated : s));
        toast('Startup updated', 'success');
      } else {
        const created = await startupService.create(form.name, form.description);
        setStartups(prev => [created, ...prev]);
        toast('Startup added', 'success');
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await startupService.remove(id);
      setStartups(prev => prev.filter(s => s.id !== id));
      toast('Startup removed', 'success');
    } catch {
      toast('Failed to delete startup', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text mb-2">Startups</h1>
          <p className="text-text-muted font-medium">Manage the startups and organisations under your agency.</p>
        </div>
        {isOwner && (
          <Button onClick={openCreate} className="h-11 px-5 rounded-xl font-bold shadow-xl shadow-primary/30">
            <Plus size={18} className="mr-2" /> Add Startup
          </Button>
        )}
      </div>

      {/* Inline form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-card border border-border rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-sm font-black text-text uppercase tracking-widest">
              {editingId ? 'Edit Startup' : 'New Startup'}
            </h3>
            <Input
              label="Name"
              placeholder="e.g. Acme Corp"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Brief description..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary/50 min-h-[80px] resize-none transition-all"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={saving}>
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button onClick={handleSave} isLoading={saving}>
                <Check size={16} className="mr-1" /> {editingId ? 'Save Changes' : 'Add Startup'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : startups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center text-text-muted mb-6">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">No startups yet</h3>
          <p className="text-text-muted text-sm">Add your first startup or organisation to get started.</p>
          {isOwner && (
            <Button onClick={openCreate} className="mt-6 rounded-xl font-bold">
              <Plus size={16} className="mr-2" /> Add Startup
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {startups.map(s => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text truncate">{s.name}</p>
                {s.description && (
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{s.description}</p>
                )}
                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">
                  Added {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
              {isOwner && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    {deletingId === s.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
