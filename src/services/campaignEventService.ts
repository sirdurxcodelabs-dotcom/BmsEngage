import api from './api';

export interface CampaignEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  isVariable: boolean;
  recurrence: 'none' | 'weekly' | 'monthly' | 'yearly';
  region: string;
  tags: string[];
  isMonthlyEvent: boolean;
  createdBy: string | null;
  createdAt: string;
}

export interface EventTemplate {
  id: string;
  eventId: string;
  agencyId: string;
  platform: 'meta' | 'twitter' | 'linkedin' | 'tiktok' | 'all';
  contentType: string;
  templateText: string;
  mediaUrl: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface ScheduledCampaign {
  id: string;
  eventId: string;
  templateId: string | null;
  agencyId: string;
  scheduledDate: string | null;
  status: 'draft' | 'scheduled' | 'published';
  createdBy: string | null;
  assignedTo: string | null;
  platforms: string[];
  caption: string;
  hashtags: string[];
  createdAt: string;
}

export interface CampaignNotification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'campaign' | 'reminder' | 'asset';
  roles: string[];
  isRead: boolean;
  relatedEventId: string | null;
  relatedCampaignId: string | null;
  createdAt: string;
}

export const campaignEventService = {
  list: async (params?: { from?: string; to?: string; category?: string }): Promise<CampaignEvent[]> => {
    const q = new URLSearchParams(params as any).toString();
    const res = await api.get(`/campaign-events${q ? `?${q}` : ''}`);
    return res.data.events;
  },
  getOne: async (id: string): Promise<CampaignEvent> => {
    const res = await api.get(`/campaign-events/${id}`);
    return res.data.event;
  },
  create: async (data: Partial<CampaignEvent>): Promise<CampaignEvent> => {
    const res = await api.post('/campaign-events', data);
    return res.data.event;
  },
  update: async (id: string, data: Partial<CampaignEvent>): Promise<CampaignEvent> => {
    const res = await api.patch(`/campaign-events/${id}`, data);
    return res.data.event;
  },
  remove: async (id: string): Promise<void> => { await api.delete(`/campaign-events/${id}`); },
};

export const eventTemplateService = {
  list: async (eventId?: string): Promise<EventTemplate[]> => {
    const res = await api.get(`/event-templates${eventId ? `?eventId=${eventId}` : ''}`);
    return res.data.templates;
  },
  create: async (data: Partial<EventTemplate>): Promise<EventTemplate> => {
    const res = await api.post('/event-templates', data);
    return res.data.template;
  },
  update: async (id: string, data: Partial<EventTemplate>): Promise<EventTemplate> => {
    const res = await api.patch(`/event-templates/${id}`, data);
    return res.data.template;
  },
  remove: async (id: string): Promise<void> => { await api.delete(`/event-templates/${id}`); },
};

export const scheduledCampaignService = {
  list: async (params?: { eventId?: string; status?: string }): Promise<ScheduledCampaign[]> => {
    const q = new URLSearchParams(params as any).toString();
    const res = await api.get(`/scheduled-campaigns${q ? `?${q}` : ''}`);
    return res.data.campaigns;
  },
  create: async (data: Partial<ScheduledCampaign>): Promise<ScheduledCampaign> => {
    const res = await api.post('/scheduled-campaigns', data);
    return res.data.campaign;
  },
  update: async (id: string, data: Partial<ScheduledCampaign>): Promise<ScheduledCampaign> => {
    const res = await api.patch(`/scheduled-campaigns/${id}`, data);
    return res.data.campaign;
  },
  remove: async (id: string): Promise<void> => { await api.delete(`/scheduled-campaigns/${id}`); },
};

export const campaignNotificationService = {
  list: async (): Promise<{ notifications: CampaignNotification[]; unreadCount: number }> => {
    const res = await api.get('/campaign-notifications');
    return res.data;
  },
  markRead: async (id: string): Promise<void> => { await api.patch(`/campaign-notifications/${id}/read`); },
  markAllRead: async (): Promise<void> => { await api.patch('/campaign-notifications/read-all'); },
  remove: async (id: string): Promise<void> => { await api.delete(`/campaign-notifications/${id}`); },
};
