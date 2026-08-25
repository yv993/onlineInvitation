import type { WMotifId } from "@/lib/wcards";

// ============================================================================
// WEDDING MOTIFS — one SVG sprite of original botanical, floral, ornament and
// Armenian symbols, two-tone (`currentColor` + `var(--m2)`), placed by the
// wedding cards with <use>. Landscapes are layered silhouettes drawn wide.
// Nothing here is traced from a licensed card.
// ============================================================================

const M2 = "var(--m2, #fff)";

export const WMOTIFS: Record<WMotifId, React.ReactNode> = {
  leafSprig: (
    <>
      <path d="M50 96C50 60 50 30 50 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {[[22, 60], [34, 46], [46, 34], [58, 22]].map(([y, s], i) => (
        <g key={i}>
          <path d={`M50 ${y}c-14-2-${s / 2}-10-${s / 2}-20 12 4 ${s / 2 - 4} 12 ${s / 2} 20z`} fill="currentColor" transform={`translate(0 0)`} />
          <path d={`M50 ${y}c14-2 ${s / 2}-10 ${s / 2}-20-12 4-${s / 2 - 4} 12-${s / 2} 20z`} fill="currentColor" />
        </g>
      ))}
    </>
  ),
  leafBranch: (
    <>
      <path d="M6 94C30 70 60 40 96 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {[[20, 80, -40], [34, 66, -40], [48, 52, -40], [62, 38, -40], [76, 24, -40]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x - 9} cy={y} rx="9" ry="4.5" fill="currentColor" />
          <ellipse cx={x + 9} cy={y} rx="9" ry="4.5" fill="currentColor" opacity="0.85" />
        </g>
      ))}
    </>
  ),
  eucalyptus: (
    <>
      <path d="M50 96V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {[16, 30, 44, 58, 72, 86].map((y, i) => (
        <g key={i}>
          <circle cx={i % 2 ? 36 : 64} cy={y} r="8" fill="currentColor" opacity="0.9" />
          <circle cx={i % 2 ? 66 : 34} cy={y + 6} r="6.5" fill="currentColor" opacity="0.7" />
        </g>
      ))}
    </>
  ),
  olive: (
    <>
      <path d="M4 60C30 52 60 44 96 40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {[[18, 56], [34, 52], [50, 48], [66, 45], [82, 42]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y - 10} rx="3.5" ry="10" fill="currentColor" transform={`rotate(-30 ${x} ${y - 10})`} />
          <ellipse cx={x + 6} cy={y + 8} rx="3.5" ry="10" fill="currentColor" transform={`rotate(-30 ${x + 6} ${y + 8})`} opacity="0.85" />
        </g>
      ))}
      <circle cx="40" cy="62" r="4" fill={M2} /><circle cx="60" cy="56" r="4" fill={M2} />
    </>
  ),
  fern: (
    <>
      <path d="M50 96C50 60 50 30 50 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }).map((_, i) => { const y = 14 + i * 9, w = 26 - i * 1.5; return (
        <g key={i}><path d={`M50 ${y}q-${w / 2}-6-${w} 4`} stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d={`M50 ${y}q${w / 2}-6 ${w} 4`} stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" /></g>
      ); })}
    </>
  ),
  palmFrond: (
    <>
      <path d="M8 92C30 60 56 34 92 8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {Array.from({ length: 8 }).map((_, i) => { const t = i / 8, x = 14 + t * 70, y = 84 - t * 68; return (
        <g key={i}><path d={`M${x} ${y}c-14 4-22 14-26 26 12-4 22-12 26-26z`} fill="currentColor" opacity="0.9" /><path d={`M${x} ${y}c4-14 14-22 26-26-4 12-12 22-26 26z`} fill="currentColor" opacity="0.75" /></g>
      ); })}
    </>
  ),
  monstera: (
    <>
      <path d="M50 96V50" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M50 52C20 52 6 34 10 12c14 6 24 4 30 14 2-14 12-20 24-22 6 12 4 22-6 30 14-4 26 4 32 18-16 6-30 4-40 0z" fill="currentColor" />
      <path d="M32 40c6-8 8-14 8-22M50 44c-2-10 0-18 6-26M66 46c8-6 14-8 22-6" stroke={M2} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  wheat: (
    <>
      <path d="M50 96V30" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {[8, 18, 28, 38, 48].map((y, i) => (
        <g key={i}><ellipse cx="42" cy={y + 6} rx="4" ry="9" fill="currentColor" transform={`rotate(20 42 ${y + 6})`} /><ellipse cx="58" cy={y + 6} rx="4" ry="9" fill="currentColor" transform={`rotate(-20 58 ${y + 6})`} /></g>
      ))}
      <path d="M50 4v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  rose: (
    <>
      <circle cx="50" cy="50" r="34" fill="currentColor" />
      <path d="M50 24c14 0 22 12 18 24-8-6-14-8-22-6 10 4 16 12 14 22-8-4-14-10-16-18-4 10-12 16-22 16 2-10 8-18 18-22-8-2-14 0-20 6-4-14 8-24 30-22z" fill={M2} opacity="0.75" />
      <path d="M50 38c8 0 12 6 10 12-4-2-8-2-12 0 6 2 8 6 8 10-6-2-10-6-10-10-2 4-6 8-12 8 2-6 6-8 10-10-4-2-8-2-10 0 0-6 8-12 16-10z" fill="currentColor" opacity="0.6" />
      <ellipse cx="18" cy="82" rx="14" ry="6" fill="currentColor" transform="rotate(-30 18 82)" opacity="0.85" /><ellipse cx="82" cy="82" rx="14" ry="6" fill="currentColor" transform="rotate(30 82 82)" opacity="0.85" />
    </>
  ),
  peony: (
    <>
      <circle cx="50" cy="52" r="36" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx="50" cy="26" rx="10" ry="18" fill={M2} opacity="0.55" transform={`rotate(${i * 45} 50 52)`} />)}
      <circle cx="50" cy="52" r="10" fill="currentColor" opacity="0.7" />
    </>
  ),
  daisy: (
    <>
      {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx="50" cy="20" rx="7" ry="20" fill="currentColor" transform={`rotate(${i * 30} 50 50)`} />)}
      <circle cx="50" cy="50" r="13" fill={M2} />
    </>
  ),
  wildflower: (
    <>
      <path d="M50 96V40M30 96C36 76 40 62 44 50M70 96c-6-20-10-34-14-46" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="32" r="12" fill="currentColor" /><circle cx="50" cy="32" r="5" fill={M2} />
      <circle cx="40" cy="46" r="8" fill="currentColor" opacity="0.8" /><circle cx="60" cy="46" r="8" fill="currentColor" opacity="0.8" />
      <circle cx="30" cy="70" r="6" fill={M2} opacity="0.9" /><circle cx="70" cy="70" r="6" fill={M2} opacity="0.9" />
      <path d="M50 60c-8-2-14 2-16 8 8 2 14-2 16-8zM50 72c8-2 14 2 16 8-8 2-14-2-16-8z" fill="currentColor" opacity="0.7" />
    </>
  ),
  cherryBlossom: (
    <>
      <path d="M4 40C30 46 56 60 96 92" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M40 50c8-14 6-24 0-32M62 66c10-10 12-20 8-30" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.5" />
      {[[40, 18], [70, 36], [22, 56], [58, 84], [86, 78]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 5 }).map((_, j) => <ellipse key={j} cx="0" cy="-8" rx="4.5" ry="8" fill={M2} transform={`rotate(${j * 72})`} />)}
          <circle r="3" fill="currentColor" />
        </g>
      ))}
    </>
  ),
  apricotBlossom: (
    <>
      <path d="M6 30C30 40 56 62 94 92" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M36 44c6-14 4-24-2-32M64 68c8-10 10-20 6-30" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.6" />
      {[[36, 14], [72, 34], [20, 50], [56, 82], [88, 74]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 5 }).map((_, j) => <ellipse key={j} cx="0" cy="-8" rx="5" ry="8.5" fill={M2} transform={`rotate(${j * 72})`} />)}
          <circle r="3.5" fill="currentColor" />
        </g>
      ))}
    </>
  ),
  tulip: (
    <>
      <path d="M50 96V50" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 54C36 40 30 26 34 10c8 4 12 12 16 22 4-10 8-18 16-22 4 16-2 30-16 44z" fill="currentColor" />
      <path d="M50 54C46 40 46 24 50 12c4 12 4 28 0 42z" fill={M2} opacity="0.5" />
      <path d="M50 76c-10-6-18-6-26 0 8 6 16 6 26 0z" fill="currentColor" opacity="0.8" />
    </>
  ),
  lavender: (
    <>
      <path d="M50 96V30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[8, 16, 24, 32, 40, 48].map((y, i) => (
        <g key={i}><ellipse cx="44" cy={y} rx="5" ry="4" fill="currentColor" /><ellipse cx="56" cy={y + 4} rx="5" ry="4" fill="currentColor" opacity="0.85" /></g>
      ))}
      <path d="M50 70c-8-4-14-2-18 4 8 2 14 0 18-4z" fill="currentColor" opacity="0.7" />
    </>
  ),
  hydrangea: (
    <>
      {[[50, 30], [30, 44], [70, 44], [40, 62], [60, 62], [50, 78], [22, 62], [78, 62]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 4 }).map((_, j) => <ellipse key={j} cx="0" cy="-7" rx="5" ry="7" fill="currentColor" opacity="0.9" transform={`rotate(${j * 90})`} />)}
          <circle r="2.5" fill={M2} />
        </g>
      ))}
    </>
  ),
  carnation: (
    <>
      <path d="M50 96V56" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 58C30 58 20 44 24 26c8 6 12 2 14-6 6 8 12 6 12-4 4 10 10 12 14 4 4 8 8 8 14 6 4 18-8 32-28 32z" fill="currentColor" />
      <path d="M40 40q10-6 20 0M36 30q14-8 28 0" stroke={M2} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  cactus: (
    <>
      <path d="M40 96V30a10 10 0 0 1 20 0v66z" fill="currentColor" />
      <path d="M40 60H26V40a6 6 0 0 1 12 0v12h2zM60 70h14V46a6 6 0 0 0-12 0v16h-2z" fill="currentColor" />
      <path d="M46 40v46M54 40v46" stroke={M2} strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="50" cy="94" rx="30" ry="5" fill={M2} opacity="0.5" />
      <circle cx="50" cy="20" r="5" fill={M2} />
    </>
  ),
  birdOfParadise: (
    <>
      <path d="M50 96V50" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M50 52c-16-2-28-14-32-30 14 4 24 12 32 30zM50 52c4-18 14-30 30-36-2 16-12 30-30 36zM50 52c10-8 22-8 34-2-10 8-22 10-34 2z" fill="currentColor" />
      <path d="M50 52c-4-16-2-30 6-42 6 12 6 28-6 42z" fill={M2} opacity="0.7" />
    </>
  ),
  wreath: (
    <>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      {Array.from({ length: 20 }).map((_, i) => <ellipse key={i} cx="50" cy="12" rx="4" ry="8" fill="currentColor" opacity={0.7 + (i % 3) * 0.1} transform={`rotate(${i * 18} 50 50)`} />)}
      {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx="50" cy="20" r="2" fill={M2} transform={`rotate(${i * 36 + 9} 50 50)`} />)}
    </>
  ),
  laurel: (
    <>
      <path d="M20 90C10 60 16 30 40 10M80 90c10-30 4-60-20-80" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[[16, 76], [14, 60], [18, 44], [26, 30], [36, 18]].map(([x, y], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx="4" ry="9" fill="currentColor" transform={`rotate(-30 ${x} ${y})`} /><ellipse cx={100 - x} cy={y} rx="4" ry="9" fill="currentColor" transform={`rotate(30 ${100 - x} ${y})`} /></g>
      ))}
    </>
  ),
  garland: (
    <>
      <path d="M0 40q50 40 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
      {Array.from({ length: 9 }).map((_, i) => { const x = 10 + i * 10, y = 44 + Math.sin((i / 8) * Math.PI) * 18; return <ellipse key={i} cx={x} cy={y} rx="4" ry="8" fill="currentColor" transform={`rotate(${(i - 4) * 12} ${x} ${y})`} />; })}
    </>
  ),
  bouquet: (
    <>
      <path d="M50 96V60" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M40 78l20 0" stroke={M2} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="40" r="16" fill="currentColor" /><circle cx="50" cy="40" r="6" fill={M2} opacity="0.7" />
      <circle cx="30" cy="50" r="11" fill="currentColor" opacity="0.85" /><circle cx="70" cy="50" r="11" fill="currentColor" opacity="0.85" />
      <ellipse cx="22" cy="34" rx="5" ry="12" fill="currentColor" transform="rotate(-40 22 34)" opacity="0.8" /><ellipse cx="78" cy="34" rx="5" ry="12" fill="currentColor" transform="rotate(40 78 34)" opacity="0.8" />
      <circle cx="30" cy="50" r="4" fill={M2} opacity="0.7" /><circle cx="70" cy="50" r="4" fill={M2} opacity="0.7" />
    </>
  ),
  vineBorder: (
    <>
      <path d="M0 50q25-30 50 0t50 0" stroke="currentColor" strokeWidth="2" fill="none" />
      {[[12, 36], [38, 62], [62, 38], [88, 62]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c-8-2-12-8-10-16 8 2 12 8 10 16z`} fill="currentColor" />)}
      {[[25, 50], [75, 50]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c6 0 8 6 4 10-4-2-6-6-4-10z`} fill="currentColor" opacity="0.7" />)}
    </>
  ),
  grapes: (
    <>
      <path d="M50 4v14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 18c-10-8-22-6-28 4 12 4 20 2 28-4z" fill={M2} />
      {[[38, 30], [62, 30], [30, 46], [50, 44], [70, 46], [40, 62], [60, 62], [50, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" fill="currentColor" opacity={0.85 + (i % 2) * 0.15} />)}
    </>
  ),
  pomegranate: (
    <>
      <path d="M50 22c22 0 34 16 34 36 0 20-14 36-34 36S16 78 16 58c0-20 12-36 34-36z" fill="currentColor" />
      <path d="M40 22l4-12h12l4 12" fill="currentColor" /><path d="M42 12l2-6M50 10V4M58 12l-2-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 50c6 4 8 10 6 16M64 50c-6 4-8 10-6 16" stroke={M2} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="40" cy="44" r="4" fill={M2} opacity="0.5" />
    </>
  ),
  pomegranateHalf: (
    <>
      <path d="M50 20c22 0 34 16 34 36 0 20-14 36-34 36S16 76 16 56c0-20 12-36 34-36z" fill="currentColor" />
      <path d="M50 26c18 0 28 14 28 30 0 16-12 30-28 30S22 72 22 56c0-16 10-30 28-30z" fill={M2} opacity="0.85" />
      {[[36, 46], [50, 40], [64, 46], [30, 60], [44, 56], [58, 56], [70, 60], [36, 72], [50, 76], [64, 72], [50, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill="currentColor" opacity="0.9" />)}
      <path d="M40 20l4-10h12l4 10" fill="currentColor" />
    </>
  ),
  eternity: (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d="M50 50c0-18 8-30 20-34-4 12-2 24 4 34-10 4-20 4-24 0z" fill="currentColor" transform={`rotate(${i * 45} 50 50)`} opacity={0.75 + (i % 2) * 0.25} />
      ))}
      <circle cx="50" cy="50" r="6" fill={M2} />
    </>
  ),
  khachkarLace: (
    <>
      <path d="M0 50h100" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 10 }).map((_, i) => { const x = 5 + i * 10; return (
        <g key={i}><path d={`M${x} 42l5 8-5 8-5-8z`} fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx={x} cy="50" r="1.6" fill="currentColor" /><path d={`M${x} 34q5 4 0 8M${x} 66q5-4 0-8`} stroke="currentColor" strokeWidth="1.2" fill="none" /></g>
      ); })}
    </>
  ),
  duduk: (
    <>
      <path d="M8 60l72-52 8 10-72 52z" fill="currentColor" />
      <path d="M78 10l10-8 8 10-8 8z" fill={M2} />
      {[24, 34, 44, 54, 64].map((x, i) => <circle key={i} cx={x} cy={62 - i * 7.2} r="2" fill={M2} />)}
      <path d="M8 60l-4 6 8 8 4-6" fill="currentColor" opacity="0.8" />
    </>
  ),
  ararat: (
    <>
      <path d="M0 78L22 40l10 10 12-22 14 18 8-10 18 24 8-6L100 78z" fill="currentColor" />
      <path d="M22 40l6 8 4-6 6 8 6-10 4 6 6-8 4 8 6-6-4 10-6 6-8-4-6 6-8-6-6 4-6-6-8 4z" fill={M2} opacity="0.9" />
      <path d="M0 78h100v22H0z" fill="currentColor" opacity="0.35" />
      <path d="M0 84q25-8 50 0t50 0" stroke={M2} strokeWidth="1.5" fill="none" opacity="0.4" />
    </>
  ),
  sevan: (
    <>
      <path d="M0 40C20 34 40 30 60 32s30 4 40 2v60H0z" fill="currentColor" opacity="0.25" />
      <path d="M0 62h100v38H0z" fill="currentColor" />
      <path d="M50 62V50l6-8 6 8v12zM60 50h4v-14l2-4 2 4v14h4" fill={M2} />
      <path d="M40 62c6-6 12-8 20-8s14 2 20 8" fill={M2} opacity="0.7" />
      <path d="M0 74q25-6 50 0t50 0M0 86q25-6 50 0t50 0" stroke={M2} strokeWidth="1.2" fill="none" opacity="0.4" />
    </>
  ),
  tatev: (
    <>
      <path d="M0 100V70l20-14 8 6 12-22 10 10 10-6v56z" fill="currentColor" />
      <path d="M60 100V44l14-10 8 8 6-4 12 12v50z" fill="currentColor" opacity="0.8" />
      <path d="M62 44l6-6h4l2-6 2 6h4l6 6v10H62z" fill={M2} />
      <path d="M0 100h100" stroke={M2} strokeWidth="0" />
    </>
  ),
  noravank: (
    <>
      <path d="M0 100V30l16-20 12 24 6-8 10 20 8-12 8 12v54z" fill="currentColor" />
      <path d="M100 100V26L84 8 74 30l-6-6-8 20-6-8v64z" fill="currentColor" opacity="0.8" />
      <path d="M40 100V64l6-4 2-8 2 8 6 4v36z" fill={M2} />
      <path d="M50 52v-8M46 48h8" stroke={M2} strokeWidth="1.5" />
    </>
  ),
  ampersand: (
    <text x="50" y="82" textAnchor="middle" fontFamily="var(--f-display), Georgia, serif" fontStyle="italic" fontSize="96" fill="currentColor">&amp;</text>
  ),
  heart: <path d="M50 88C20 66 8 52 8 34a20 20 0 0 1 42-10 20 20 0 0 1 42 10c0 18-12 32-42 54z" fill="currentColor" />,
  rings: (
    <>
      <circle cx="38" cy="54" r="26" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="62" cy="54" r="26" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.8" />
      <path d="M62 24l4-8h4l4 8" fill={M2} />
    </>
  ),
  dove: (
    <>
      <path d="M12 56c14-4 26-2 36 6 4-14 14-24 30-28-4 10-6 20-4 30 8-2 14 0 20 4-12 8-24 12-38 10-8 6-18 8-30 6 4-6 8-10 14-12-12-2-22-8-28-16z" fill="currentColor" />
      <circle cx="74" cy="38" r="2" fill={M2} />
      <path d="M78 34l8-2-6 6" fill={M2} />
    </>
  ),
  birds: (
    <>
      <path d="M10 40q10-10 20 0 10-10 20 0M50 30q10-10 20 0 10-10 20 0M30 60q8-8 16 0 8-8 16 0" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  moon: <path d="M62 8a42 42 0 1 0 30 70A34 34 0 0 1 62 8z" fill="currentColor" />,
  stars: (
    <>
      {[[8, 12, 2], [30, 6, 1.4], [52, 18, 2.4], [74, 8, 1.6], [92, 22, 2], [18, 40, 1.4], [44, 44, 1.2], [66, 36, 2], [86, 50, 1.4], [10, 70, 2], [34, 62, 1.6], [58, 72, 1.2], [80, 78, 2.2], [24, 90, 1.4], [50, 92, 2], [94, 92, 1.4]].map(([x, y, r], i) => (
        <path key={i} d={`M${x} ${y - r * 2.4}l${r * 0.6} ${r * 1.6}h${r * 1.8}l${-r * 1.4} ${r}l${r * 0.6} ${r * 1.8}l${-r * 1.6} ${-r * 1.1}l${-r * 1.6} ${r * 1.1}l${r * 0.6} ${-r * 1.8}l${-r * 1.4} ${-r}h${r * 1.8}z`} fill="currentColor" />
      ))}
    </>
  ),
  sun: (
    <>
      <circle cx="50" cy="50" r="22" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M50 8v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />)}
    </>
  ),
  waves: <path d="M0 40c10-14 20-14 30 0s20 14 30 0 20-14 30 0 10 8 10 8v52H0z" fill="currentColor" />,
  shell: (
    <>
      <path d="M50 92L8 44a42 42 0 0 1 84 0z" fill="currentColor" />
      <path d="M50 92L26 40M50 92L40 32M50 92l10-60M50 92l24-52" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  starfish: <path d="M50 4l12 30 32 2-26 20 10 32-28-18-28 18 10-32L6 36l32-2z" fill="currentColor" />,
  compass: (
    <>
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M50 12l10 32-10 44-10-44z" fill="currentColor" /><path d="M12 50l32-10 44 10-44 10z" fill="currentColor" opacity="0.6" />
      <circle cx="50" cy="50" r="5" fill={M2} />
    </>
  ),
  mountains: (
    <>
      <path d="M0 70L20 36l14 16 16-28 20 30 12-14 18 30v30H0z" fill="currentColor" opacity="0.55" />
      <path d="M0 84l24-24 18 14 20-22 22 26 16-10v32H0z" fill="currentColor" />
      <path d="M0 96h100v4H0z" fill={M2} opacity="0.3" />
    </>
  ),
  birch: (
    <>
      <rect x="40" y="0" width="20" height="100" fill={M2} />
      <path d="M40 0h20v100H40z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {[8, 22, 40, 56, 72, 88].map((y, i) => <path key={i} d={`M${i % 2 ? 42 : 48} ${y}h${i % 2 ? 10 : 12}l-2 3h-${i % 2 ? 8 : 10}z`} fill="currentColor" opacity="0.8" />)}
    </>
  ),
  pine: <path d="M50 4l24 30H60l18 22H62l20 26H50 18l20-26H22l18-22H26z" fill="currentColor" />,
  frameOrnate: (
    <>
      <rect x="6" y="6" width="88" height="88" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 30q10-8 0-24 16 10 24 0M94 30q-10-8 0-24-16 10-24 0M6 70q10 8 0 24 16-10 24 0M94 70q-10 8 0 24-16-10-24 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  frameCorner: (
    <>
      <path d="M4 96V20q0-16 16-16h76" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 60c-2-14 4-24 14-30-4 12-2 20 4 28M40 12c14-2 24 4 30 14-12-4-20-2-28 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="18" r="3" fill="currentColor" />
    </>
  ),
  flourish: (
    <>
      <path d="M50 50c-14-14-30-14-44 0 14-8 24-4 32 6M50 50c14-14 30-14 44 0-14-8-24-4-32 6M50 50v0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 44l3 6-3 6-3-6z" fill="currentColor" />
      <path d="M22 60c-6 2-10 6-12 12M78 60c6 2 10 6 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  divider: (
    <>
      <path d="M4 50h36M60 50h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 42l5 8-5 8-5-8z" fill="currentColor" />
      <circle cx="42" cy="50" r="1.5" fill="currentColor" /><circle cx="58" cy="50" r="1.5" fill="currentColor" />
    </>
  ),
  arch: <path d="M10 96V50a40 40 0 0 1 80 0v46" fill="none" stroke="currentColor" strokeWidth="2" />,
  monogramRing: (
    <>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
    </>
  ),
  confettiDot: <circle cx="50" cy="50" r="40" fill="currentColor" />,
  watercolorBlob: (
    <path d="M50 8c14-2 26 6 34 16 10 12 12 28 6 42-6 12-20 24-36 26-16 2-32-6-42-18C2 62 2 44 10 30 18 16 34 10 50 8z" fill="currentColor" />
  ),
  inkStroke: (
    <path d="M2 56c14-16 30-22 48-20 12 2 22 8 34 6 6-1 10-4 14-8-6 12-16 20-30 22-16 2-30-4-44-2-8 2-16 6-22 12z" fill="currentColor" />
  ),
  koi: (
    <>
      <path d="M8 50c14-22 36-30 58-22 10 4 18 12 22 22-4 10-12 18-22 22-22 8-44 0-58-22z" fill="currentColor" />
      <path d="M8 50c-6-8-6-18-2-26 8 6 12 14 12 24-4 4-6 2-10 2zM8 50c-6 8-6 18-2 26 8-6 12-14 12-24-4-4-6-2-10-2z" fill="currentColor" opacity="0.8" />
      <circle cx="70" cy="44" r="3" fill={M2} />
      <path d="M40 34c6 6 8 14 6 22M52 32c6 8 8 16 6 24" stroke={M2} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  butterfly: (
    <>
      <path d="M50 50C36 26 8 18 10 40c2 14 24 14 40 10zM50 50C36 74 10 82 12 62c2-14 24-16 38-12zM50 50c14-24 42-32 40-10-2 14-24 14-40 10zM50 50c14 24 40 32 38 12-2-14-24-16-38-12z" fill="currentColor" />
      <ellipse cx="50" cy="52" rx="4" ry="16" fill={M2} />
    </>
  ),
  bee: (
    <>
      <ellipse cx="34" cy="26" rx="18" ry="10" fill={M2} opacity="0.7" transform="rotate(-25 34 26)" /><ellipse cx="66" cy="26" rx="18" ry="10" fill={M2} opacity="0.7" transform="rotate(25 66 26)" />
      <ellipse cx="50" cy="58" rx="32" ry="24" fill="currentColor" />
      <path d="M36 36v44M50 34v48M64 36v44" stroke={M2} strokeWidth="5" opacity="0.8" />
    </>
  ),
};

export default function WMotifSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(WMOTIFS) as WMotifId[]).map((k) => (
          <symbol key={k} id={`w-${k}`} viewBox="0 0 100 100" overflow="visible">{WMOTIFS[k]}</symbol>
        ))}
        {/* watercolour edge — feTurbulence roughens a wash's silhouette */}
        <filter id="w-wash" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        {/* deckled paper edge */}
        <filter id="w-deckle" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* letterpress: a soft inner shadow */}
        <filter id="w-press" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="0.8" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        {/* paper speckle */}
        <filter id="w-speckle">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        </filter>
      </defs>
    </svg>
  );
}
