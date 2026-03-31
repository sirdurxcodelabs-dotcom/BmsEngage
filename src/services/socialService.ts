import api from './api';

export interface ConnectedAccount {
  id: string;
  platform: 'meta' | 'twitter' | 'linkedin' | 'tiktok';
  accountId: string;
  username: string;
  displayName: string;
  avatar: string;
  tokenExpiry: string | null;
  isActive: boolean;
  meta?: { pageId: string; pageName: string };
  tiktok?: { openId: string };
  createdAt: string;
}

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export const socialService = {
  /** Redirect browser to OAuth initiation endpoint (full page redirect) */
  connectPlatform: (platform: 'meta' | 'twitter' | 'linkedin' | 'tiktok') => {
    const token = localStorage.getItem('token');
    // Pass JWT as query param so the backend auth middleware can read it on the redirect
    window.location.href = `${BASE_URL}/api/social/auth/${platform}?token=${token}`;
  },

  getAccounts: async (): Promise<ConnectedAccount[]> => {
    const res = await api.get('/social/accounts');
    return res.data.accounts;
  },

  disconnect: async (id: string): Promise<void> => {
    await api.delete(`/social/accounts/${id}`);
  },

  refreshToken: async (id: string): Promise<{ tokenExpiry: string }> => {
    const res = await api.post(`/social/accounts/${id}/refresh-token`);
    return res.data;
  },
};
