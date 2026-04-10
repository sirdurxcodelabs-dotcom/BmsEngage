/**
 * Global Campaign Calendar — pre-built yearly events
 * Date format: MM-DD (applied to current year on load)
 */

export interface GlobalEvent {
  title: string;
  category: string;
  mmdd: string; // MM-DD
  region: string;
  tags: string[];
  recurrence: 'yearly';
  emoji: string;
}

export const GLOBAL_CALENDAR: GlobalEvent[] = [
  // ── January ──────────────────────────────────────────────────────────────
  { title: "🎉 New Year's Day", category: 'Holiday', mmdd: '01-01', region: 'Global', tags: ['newyear', 'celebration', 'holiday'], recurrence: 'yearly', emoji: '🎉' },
  { title: '📅 New Month Planning – January', category: 'Planning', mmdd: '01-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '💑 Valentine\'s Day', category: 'Holiday', mmdd: '02-14', region: 'Global', tags: ['valentines', 'love', 'romance'], recurrence: 'yearly', emoji: '💑' },

  // ── February ─────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – February', category: 'Planning', mmdd: '02-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🌍 World Cancer Day', category: 'Awareness', mmdd: '02-04', region: 'Global', tags: ['health', 'awareness', 'cancer'], recurrence: 'yearly', emoji: '🌍' },

  // ── March ─────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – March', category: 'Planning', mmdd: '03-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '👩 International Women\'s Day', category: 'Awareness', mmdd: '03-08', region: 'Global', tags: ['womensday', 'equality', 'empowerment'], recurrence: 'yearly', emoji: '👩' },
  { title: '🌱 World Environment Day Prep', category: 'Awareness', mmdd: '03-20', region: 'Global', tags: ['environment', 'sustainability'], recurrence: 'yearly', emoji: '🌱' },

  // ── April ─────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – April', category: 'Planning', mmdd: '04-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🌍 Earth Day', category: 'Awareness', mmdd: '04-22', region: 'Global', tags: ['earthday', 'environment', 'green'], recurrence: 'yearly', emoji: '🌍' },

  // ── May ───────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – May', category: 'Planning', mmdd: '05-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '👷 International Workers\' Day', category: 'Holiday', mmdd: '05-01', region: 'Global', tags: ['laborday', 'workers', 'holiday'], recurrence: 'yearly', emoji: '👷' },
  { title: '👩‍👧 Mother\'s Day', category: 'Holiday', mmdd: '05-12', region: 'Global', tags: ['mothersday', 'family', 'love'], recurrence: 'yearly', emoji: '👩‍👧' },

  // ── June ──────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – June', category: 'Planning', mmdd: '06-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🏳️‍🌈 Pride Month Start', category: 'Awareness', mmdd: '06-01', region: 'Global', tags: ['pride', 'lgbtq', 'inclusion'], recurrence: 'yearly', emoji: '🏳️‍🌈' },
  { title: '👨‍👦 Father\'s Day', category: 'Holiday', mmdd: '06-16', region: 'Global', tags: ['fathersday', 'family', 'love'], recurrence: 'yearly', emoji: '👨‍👦' },

  // ── July ──────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – July', category: 'Planning', mmdd: '07-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🇺🇸 Independence Day (US)', category: 'Holiday', mmdd: '07-04', region: 'US', tags: ['independence', 'usa', 'holiday'], recurrence: 'yearly', emoji: '🇺🇸' },
  { title: '🌍 Nelson Mandela Day', category: 'Awareness', mmdd: '07-18', region: 'Global', tags: ['mandela', 'peace', 'justice'], recurrence: 'yearly', emoji: '🌍' },

  // ── August ────────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – August', category: 'Planning', mmdd: '08-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🇳🇬 Nigeria Independence Day', category: 'Holiday', mmdd: '10-01', region: 'Nigeria', tags: ['nigeria', 'independence', 'holiday'], recurrence: 'yearly', emoji: '🇳🇬' },

  // ── September ─────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – September', category: 'Planning', mmdd: '09-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🌍 World Literacy Day', category: 'Awareness', mmdd: '09-08', region: 'Global', tags: ['literacy', 'education', 'awareness'], recurrence: 'yearly', emoji: '🌍' },
  { title: '🧘 World Mental Health Day Prep', category: 'Awareness', mmdd: '09-25', region: 'Global', tags: ['mentalhealth', 'wellness', 'awareness'], recurrence: 'yearly', emoji: '🧘' },

  // ── October ───────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – October', category: 'Planning', mmdd: '10-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🧘 World Mental Health Day', category: 'Awareness', mmdd: '10-10', region: 'Global', tags: ['mentalhealth', 'wellness', 'awareness'], recurrence: 'yearly', emoji: '🧘' },
  { title: '🎃 Halloween', category: 'Holiday', mmdd: '10-31', region: 'Global', tags: ['halloween', 'spooky', 'holiday'], recurrence: 'yearly', emoji: '🎃' },

  // ── November ──────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – November', category: 'Planning', mmdd: '11-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🛍️ Black Friday', category: 'Sales', mmdd: '11-29', region: 'Global', tags: ['blackfriday', 'sale', 'shopping', 'deals'], recurrence: 'yearly', emoji: '🛍️' },
  { title: '💻 Cyber Monday', category: 'Sales', mmdd: '12-02', region: 'Global', tags: ['cybermonday', 'sale', 'tech', 'deals'], recurrence: 'yearly', emoji: '💻' },

  // ── December ──────────────────────────────────────────────────────────────
  { title: '📅 New Month Planning – December', category: 'Planning', mmdd: '12-01', region: 'Global', tags: ['planning', 'monthly'], recurrence: 'yearly', emoji: '📅' },
  { title: '🎄 Christmas', category: 'Holiday', mmdd: '12-25', region: 'Global', tags: ['christmas', 'holiday', 'celebration'], recurrence: 'yearly', emoji: '🎄' },
  { title: '🎆 New Year\'s Eve', category: 'Holiday', mmdd: '12-31', region: 'Global', tags: ['newyearseve', 'celebration', 'holiday'], recurrence: 'yearly', emoji: '🎆' },

  // ── Marketing / Business ──────────────────────────────────────────────────
  { title: '📊 Q1 Campaign Review', category: 'Marketing', mmdd: '03-31', region: 'Global', tags: ['q1', 'review', 'marketing', 'quarterly'], recurrence: 'yearly', emoji: '📊' },
  { title: '📊 Q2 Campaign Review', category: 'Marketing', mmdd: '06-30', region: 'Global', tags: ['q2', 'review', 'marketing', 'quarterly'], recurrence: 'yearly', emoji: '📊' },
  { title: '📊 Q3 Campaign Review', category: 'Marketing', mmdd: '09-30', region: 'Global', tags: ['q3', 'review', 'marketing', 'quarterly'], recurrence: 'yearly', emoji: '📊' },
  { title: '📊 Q4 Campaign Review', category: 'Marketing', mmdd: '12-31', region: 'Global', tags: ['q4', 'review', 'marketing', 'quarterly'], recurrence: 'yearly', emoji: '📊' },
  { title: '🛒 Mid-Year Sale', category: 'Sales', mmdd: '06-15', region: 'Global', tags: ['sale', 'midyear', 'promo'], recurrence: 'yearly', emoji: '🛒' },
  { title: '🎁 Holiday Gift Guide Launch', category: 'Marketing', mmdd: '11-15', region: 'Global', tags: ['holiday', 'giftguide', 'marketing'], recurrence: 'yearly', emoji: '🎁' },
];

export const GLOBAL_CATEGORIES = [...new Set(GLOBAL_CALENDAR.map(e => e.category))].sort();

/** Get the date for a global event in a given year */
export const getEventDate = (mmdd: string, year = new Date().getFullYear()): Date => {
  const [mm, dd] = mmdd.split('-').map(Number);
  return new Date(year, mm - 1, dd);
};
