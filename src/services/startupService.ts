import api from './api';

export interface Startup {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  createdAt: string;
}

export const startupService = {
  list: async (): Promise<Startup[]> => {
    const res = await api.get('/startups');
    return res.data.startups;
  },
  create: async (name: string, description: string): Promise<Startup> => {
    const res = await api.post('/startups', { name, description });
    return res.data.startup;
  },
  update: async (id: string, name: string, description: string): Promise<Startup> => {
    const res = await api.patch(`/startups/${id}`, { name, description });
    return res.data.startup;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/startups/${id}`);
  },
  uploadLogo: async (id: string, file: File): Promise<Startup> => {
    const form = new FormData();
    form.append('logo', file);
    const res = await api.post(`/startups/${id}/logo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.startup;
  },
};
