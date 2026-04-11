import api from './api';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addWeeks } from 'date-fns';

export interface CampaignEvent {
  id: string;
  title: string;
  category: string;
  date: string;       // ISO — used as startDate
  endDate?: string;   // optional ISO end date
  region: string;
  tags: string[];
}

export type CampaignFilter = 'week' | 'next-week' | 'month' | 'year';
export type DateFilter = 'upcoming' | 'all';

/** Normalize a date to midnight local time for safe day-level comparisons */
export const toDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Today at midnight */
export const today = (): Date => toDay(new Date());

/** Campaign status relative to today */
export type CampaignStatus = 'upcoming' | 'ongoing' | 'completed';

export const getCampaignStatus = (event: CampaignEvent): CampaignStatus => {
  const t = today();
  const start = toDay(new Date(event.date));
  // Use endDate if present, otherwise treat the event as single-day
  const end = event.endDate ? toDay(new Date(event.endDate)) : start;

  if (end < t) return 'completed';
  if (start <= t && end >= t) return 'ongoing';
  return 'upcoming';
};

/** Apply the date filter to a list of already-fetched events */
export const applyDateFilter = (events: CampaignEvent[], dateFilter: DateFilter): CampaignEvent[] => {
  if (dateFilter === 'all') return events;
  const t = today();
  return events.filter(e => {
    // Skip events with missing/invalid dates
    if (!e.date) return false;
    const start = toDay(new Date(e.date));
    if (isNaN(start.getTime())) return false;
    const end = e.endDate ? toDay(new Date(e.endDate)) : start;
    if (isNaN(end.getTime())) return false;
    // Include ongoing + upcoming (end >= today)
    return end >= t;
  });
};

const toISO = (d: Date) => d.toISOString().split('T')[0];

export const fetchCampaignsByFilter = async (filter: CampaignFilter): Promise<CampaignEvent[]> => {
  const now = new Date();
  let from: Date, to: Date;

  switch (filter) {
    case 'week':
      from = startOfWeek(now, { weekStartsOn: 1 });
      to   = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'next-week':
      from = startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
      to   = endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 });
      break;
    case 'month':
      from = startOfMonth(now);
      to   = endOfMonth(now);
      break;
    case 'year':
      from = startOfYear(now);
      to   = endOfYear(now);
      break;
  }

  const res = await api.get(`/campaign-events?from=${toISO(from)}&to=${toISO(to)}`);
  return res.data.events ?? [];
};

const FILTER_LABELS: Record<CampaignFilter, string> = {
  'week':      'this week',
  'next-week': 'next week',
  'month':     'this month',
  'year':      'this year',
};

const STATUS_LABELS: Record<CampaignStatus, string> = {
  upcoming:  'Upcoming',
  ongoing:   'Ongoing',
  completed: 'Completed',
};

export const generateMessage = (
  events: CampaignEvent[],
  filter: CampaignFilter | null,
  dateFilter: DateFilter,
): string => {
  if (!events.length) return '';

  const rangeLabel = filter ? FILTER_LABELS[filter] : 'the selected period';

  if (dateFilter === 'all') {
    const lines = events.map(e => {
      const status = getCampaignStatus(e);
      const dateStr = new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
      return `• ${e.title} – ${dateStr} (${STATUS_LABELS[status]})`;
    }).join('\n');

    return `Hello team 👋,\n\nHere's a summary of campaigns for ${rangeLabel} (past and upcoming):\n\n${lines}\n\nLet's stay on track with ongoing and upcoming deliverables. 💪`;
  }

  // Upcoming only
  const lines = events
    .map(e => `• ${e.title} – ${new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`)
    .join('\n');

  return `Hello team 👋,\n\nHere are the upcoming campaigns for ${rangeLabel}:\n\n${lines}\n\nPlease ensure all creatives are ready before the deadlines. 🚀`;
};
