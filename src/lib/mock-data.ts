export const MOCK_STATS = [
  { label: 'Total Posts', value: '1,284', change: '+12.5%', trend: 'up' },
  { label: 'Scheduled Posts', value: '42', change: '+3.2%', trend: 'up' },
  { label: 'Connected Accounts', value: '8', change: '0%', trend: 'neutral' },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.4%', trend: 'up' },
];

export const MOCK_MEDIA = [
  { id: '1', type: 'photo', title: 'Summer Campaign', url: 'https://picsum.photos/seed/summer/400/300', date: '2024-03-01' },
  { id: '2', type: 'video', title: 'Product Launch', url: 'https://picsum.photos/seed/launch/400/300', date: '2024-03-02' },
  { id: '3', type: 'graphic', title: 'Sale Flyer', url: 'https://picsum.photos/seed/sale/400/300', date: '2024-03-03' },
  { id: '4', type: 'photo', title: 'Team Photo', url: 'https://picsum.photos/seed/team/400/300', date: '2024-03-04' },
  { id: '5', type: 'flyer', title: 'Event Invite', url: 'https://picsum.photos/seed/event/400/300', date: '2024-03-05' },
  { id: '6', type: 'photo', title: 'New Arrival', url: 'https://picsum.photos/seed/new/400/300', date: '2024-03-06' },
];

export const MOCK_ACCOUNTS = [
  { id: '1', platform: 'Instagram', name: '@bms_agency', status: 'connected', icon: 'Instagram' },
  { id: '2', platform: 'Facebook', name: 'BMS Creative', status: 'connected', icon: 'Facebook' },
  { id: '3', platform: 'X', name: '@bms_media', status: 'connected', icon: 'Twitter' },
  { id: '4', platform: 'TikTok', name: '@bms_official', status: 'disconnected', icon: 'Music2' },
  { id: '5', platform: 'LinkedIn', name: 'BMS Agency', status: 'connected', icon: 'Linkedin' },
];

export const MOCK_ANALYTICS_DATA = [
  { name: 'Mon', engagement: 400, reach: 2400 },
  { name: 'Tue', engagement: 300, reach: 1398 },
  { name: 'Wed', engagement: 200, reach: 9800 },
  { name: 'Thu', engagement: 278, reach: 3908 },
  { name: 'Fri', engagement: 189, reach: 4800 },
  { name: 'Sat', engagement: 239, reach: 3800 },
  { name: 'Sun', engagement: 349, reach: 4300 },
];

export const MOCK_PLATFORM_DATA = [
  { name: 'Instagram', value: 45 },
  { name: 'Facebook', value: 25 },
  { name: 'X', value: 15 },
  { name: 'LinkedIn', value: 15 },
];
