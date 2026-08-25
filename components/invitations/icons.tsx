import type { ScheduleIcon } from "@/types/invitation";

// The timeline's icon set — the reference (Invito) puts an icon over each stop:
// groom, bride, church, ring, restaurant. These are ours, line-drawn, one
// stroke weight, drawn for this project.
const P: Record<ScheduleIcon, React.ReactNode> = {
  groom: (<><circle cx="24" cy="12" r="6" /><path d="M12 42v-8a12 12 0 0 1 24 0v8" /><path d="M20 24l4 6 4-6M24 30v12" /></>),
  bride: (<><circle cx="24" cy="11" r="6" /><path d="M14 44c0-14 4-20 10-24 6 4 10 10 10 24z" /><path d="M18 8c-2-4 0-6 6-6s8 2 6 6" /></>),
  church: (<><path d="M24 4v10M20 8h8" /><path d="M10 44V26l14-10 14 10v18z" /><path d="M20 44v-10h8v10" /><path d="M4 44h40" /></>),
  rings: (<><circle cx="18" cy="28" r="10" /><circle cx="30" cy="28" r="10" /><path d="M30 18l3-6h-6z" /></>),
  reception: (<><path d="M8 24h32M10 24l4 16h20l4-16" /><path d="M14 24c0-8 4-14 10-14s10 6 10 14" /><path d="M24 6v4" /></>),
  photo: (<><rect x="6" y="14" width="36" height="26" rx="4" /><path d="M16 14l4-6h8l4 6" /><circle cx="24" cy="27" r="7" /></>),
  car: (<><path d="M8 30l4-12h24l4 12v10H8z" /><circle cx="15" cy="36" r="3" /><circle cx="33" cy="36" r="3" /><path d="M8 30h32" /></>),
  cake: (<><path d="M8 40h32M10 40V26h28v14" /><path d="M14 26v-8M24 26v-10M34 26v-8" /><circle cx="14" cy="15" r="2" /><circle cx="24" cy="13" r="2" /><circle cx="34" cy="15" r="2" /><path d="M10 32c4-3 8-3 12 0s8 3 12 0" /></>),
  party: (<><path d="M8 40l10-26 16 16z" /><path d="M18 14c8-2 14 4 12 12" /><path d="M30 8l2 4M38 12l-3 3M40 22h-4" /></>),
  toast: (<><path d="M14 6l-2 14a6 6 0 0 0 12 0L22 6zM34 6l-2 14a6 6 0 0 0 12 0L42 6z" /><path d="M18 26v14M38 26v14M12 40h12M32 40h12" /></>),
  font: (<><path d="M12 22h24l-4 18H16z" /><path d="M24 4v18M18 10h12" /><path d="M8 40h32" /></>),
  gala: (<><path d="M6 40h36M10 40V22l14-10 14 10v18" /><path d="M20 40v-8h8v8M24 4v8" /></>),
  speech: (<><rect x="20" y="6" width="8" height="18" rx="4" /><path d="M14 20a10 10 0 0 0 20 0M24 30v12M16 42h16" /></>),
  gift: (<><rect x="8" y="20" width="32" height="22" rx="2" /><path d="M6 14h36v6H6zM24 14v28" /><path d="M24 14c-8 0-10-8-4-8s4 8 4 8zm0 0c8 0 10-8 4-8s-4 8-4 8z" /></>),
  music: (<><path d="M18 38V10l20-4v26" /><circle cx="13" cy="38" r="5" /><circle cx="33" cy="32" r="5" /></>),
  dance: (<><circle cx="26" cy="9" r="4" /><path d="M20 44l6-16 8 4 4-8-10-6-8 4-6 10" /><path d="M20 28l-8 4" /></>),
  registry: (<><rect x="10" y="8" width="28" height="34" rx="2" /><path d="M16 18h16M16 26h16M16 34h10" /></>),
  home: (<><path d="M8 24l16-14 16 14" /><path d="M12 22v20h24V22" /><path d="M20 42v-10h8v10" /></>),
  flowers: (<><circle cx="24" cy="18" r="6" /><circle cx="24" cy="6" r="4" /><circle cx="35" cy="12" r="4" /><circle cx="13" cy="12" r="4" /><circle cx="35" cy="24" r="4" /><circle cx="13" cy="24" r="4" /><path d="M24 24v18M24 34c-6 0-8-4-10-6M24 34c6 0 8-4 10-6" /></>),
  candle: (<><rect x="18" y="20" width="12" height="22" rx="2" /><path d="M24 20v-6" /><path d="M24 4c3 3 4 6 2 9-1 2-3 2-4 0-2-3-1-6 2-9z" /></>),
  // ---- the venues themselves (2026-08-24): where the day happens, not only
  // what happens there. Same 48-box, same single stroke weight.
  restaurant: (<><path d="M14 6v16a4 4 0 0 0 8 0V6M18 22v20" /><path d="M30 6c4 0 6 4 6 8s-2 6-6 6v22" /><path d="M8 44h32" /></>),
  hall: (<><path d="M6 44V20l18-12 18 12v24" /><path d="M14 44V28h8v16M26 44V28h8v16" /><path d="M4 44h40M18 14h12" /></>),
  garden: (<><path d="M12 44V22a12 12 0 0 1 24 0v22" /><path d="M12 30c6-4 12-4 24 0M12 37c6-4 12-4 24 0" /><circle cx="24" cy="14" r="3" /><path d="M6 44h36" /></>),
  hotel: (<><rect x="8" y="10" width="32" height="32" rx="2" /><path d="M14 18h6M28 18h6M14 26h6M28 26h6" /><path d="M20 42v-8h8v8" /></>),
  farewell: (<><path d="M10 26c6-8 12-8 14 0s8 8 14 0" /><path d="M24 26v14M18 40h12" /><path d="M16 14c3-4 6-4 8 0s5 4 8 0" /></>),
  fireworks: (<><path d="M24 24V6M24 24l14-10M24 24l14 10M24 24L10 14M24 24l-14 10M24 24v18" /><circle cx="24" cy="24" r="3" /><circle cx="38" cy="8" r="2" /><circle cx="8" cy="38" r="2" /></>),
  cocktail: (<><path d="M8 12h32L24 28z" /><path d="M24 28v12M16 40h16" /><path d="M34 8a3 3 0 1 1 0-.1" /><path d="M30 14l6-8" /></>),
  vows: (<><path d="M12 8h20l6 6v26H12z" /><path d="M18 20h14M18 27h14M18 34h8" /><path d="M32 8v6h6" /></>),
};

export default function ScheduleGlyph({ icon, size = 44, className = "" }: { icon: ScheduleIcon; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[icon]}
    </svg>
  );
}
