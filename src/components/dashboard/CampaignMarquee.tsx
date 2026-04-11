/**
 * CampaignMarquee — bold digital social-media-board style ticker.
 * Big 3D-effect text, gradient glow, fast scroll.
 */
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { campaignEventService, CampaignEvent } from '../../services/campaignEventService';
import { format } from 'date-fns';

// ─── Separator between items ──────────────────────────────────────────────────
const Sep = () => (
  <span className="mx-6 text-primary/40 font-black text-2xl select-none">✦</span>
);

export const CampaignMarquee = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    campaignEventService
      .list({ from: todayStr, to: todayStr })
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  // ── No campaigns today ────────────────────────────────────────────────────
  if (events.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 mb-4 rounded-xl bg-card border border-border">
        <Zap size={13} className="text-text-muted shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Today</span>
        <div className="w-px h-3.5 bg-border shrink-0" />
        <span className="text-xs text-text-muted">No campaigns scheduled for today</span>
      </div>
    );
  }

  // ── Build items ───────────────────────────────────────────────────────────
  const items = events.map((e, i) => (
    <span key={e.id} className="inline-flex items-center">
      <span
        className="font-black uppercase tracking-tight whitespace-nowrap"
        style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
          // 3D text effect: layered text-shadow
          textShadow: [
            '0 1px 0 rgba(65,1,121,0.8)',
            '0 2px 0 rgba(65,1,121,0.6)',
            '0 3px 0 rgba(65,1,121,0.4)',
            '0 4px 8px rgba(65,1,121,0.3)',
            '0 0 20px rgba(109,40,217,0.4)',
          ].join(', '),
          // Gradient text
          background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #818cf8 70%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {e.title}
      </span>
      <Sep />
    </span>
  ));

  return (
    <div
      className="relative mb-4 overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #0c0010 0%, #130020 40%, #0a0018 100%)',
        border: '1px solid rgba(109,40,217,0.3)',
        boxShadow: '0 0 40px -10px rgba(65,1,121,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Scanline overlay for digital feel */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
        }}
      />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Left badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center">
        <div
          className="flex items-center gap-2 px-4 h-full"
          style={{
            background: 'linear-gradient(90deg, rgba(65,1,121,0.9) 0%, rgba(65,1,121,0.6) 70%, transparent 100%)',
          }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="font-black uppercase tracking-[0.2em] whitespace-nowrap"
              style={{
                fontSize: '0.6rem',
                color: '#c084fc',
                textShadow: '0 0 10px rgba(192,132,252,0.8)',
              }}
            >
              LIVE
            </span>
            <span
              className="font-black uppercase tracking-[0.15em] whitespace-nowrap"
              style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              TODAY
            </span>
          </div>
          {/* Pulsing dot */}
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/40 animate-ping" />
          </div>
        </div>
        {/* Fade edge */}
        <div className="w-8 h-full bg-gradient-to-r from-transparent to-transparent pointer-events-none" />
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden py-3 pl-28 pr-0">
        {/* Left fade */}
        <div
          className="absolute left-28 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #0c0010, transparent)' }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #0c0010, transparent)' }}
        />

        <div className="marquee-digital">
          {items}
          {/* Duplicate for seamless loop */}
          {items}
        </div>
      </div>
    </div>
  );
};
