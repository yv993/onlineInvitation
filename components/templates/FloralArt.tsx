// The same integer-only PRNG the scene heroes use — REDECLARED, not imported:
// SceneHero.tsx is a "use client" module, so its exports are client
// references, and a server component calling one throws. The maths is the
// contract; where it lives is not.
function rnd(i: number): number {
  let x = (i * 1103515245 + 12345) >>> 0;
  x ^= x >>> 15;
  return ((x * 2654435761) >>> 0) / 4294967296;
}

// ============================================================================
// THE FLORAL ART — the drawn matter of the four reference invitations
// (2026-08-23): line-drawn daisies (the torn-blue programme), hydrangea
// heads (the navy night), layered roses (the velvet taplink), eucalyptus
// sprigs (the sage vow), a hand-sketched guest table and two dress forms.
//
// All of it is DETERMINISTIC SVG — the integer-only `rnd` the scene heroes
// already trust, so the server and the client draw the same petal — and all
// of it paints with the template's own tokens (`--tp-acc`, `--tp-fg`), so
// one drawing serves four palettes. Labelled plainly: this is drawn art,
// not photography, exactly like the reference pages it follows.
// ============================================================================

/** a line-drawn daisy on a bending stem — the torn-blue programme's margin
 *  flower, drawn once and planted at any angle */
export function Daisy({ size = 90, seed = 1, className }: { size?: number; seed?: number; className?: string }) {
  const petals = 9 + Math.round(rnd(seed) * 3);
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} className={className} aria-hidden="true">
      <path d={`M50 138 C ${46 + rnd(seed + 1) * 8} 108, ${54 - rnd(seed + 2) * 8} 78, 50 52`} fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d={`M50 96 q ${12 + rnd(seed + 3) * 8} -4 ${18 + rnd(seed + 4) * 6} 6`} fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d={`M50 112 q ${-12 - rnd(seed + 5) * 8} -2 ${-17 - rnd(seed + 6) * 6} 8`} fill="none" stroke="currentColor" strokeWidth="1.3" />
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="30"
          rx="5.4"
          ry="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${(i * 360) / petals + rnd(seed + 7 + i) * 6} 50 44)`}
        />
      ))}
      <circle cx="50" cy="44" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="50" cy="44" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** A hydrangea head grown the way the rose was (the flat-floret first draft
 *  had the rose's disease): florets on a golden-angle spiral, GROWING toward
 *  the rim, painted outer-first, each a dark disc under a light disc offset
 *  outward — a pom-pom with real depth, no gradients, no defs.
 *  `tones` = [deep, mid, lit]; pass whites for the pale heads. */
export function Hydrangea({ size = 150, seed = 1, tones = ["#6E85C4", "#A9BBE3", "#E8EEF9"], className }: { size?: number; seed?: number; tones?: string[]; className?: string }) {
  const [deep, mid, lit] = tones;
  const florets: Array<{ x: number; y: number; r: number; a: number; i: number }> = [];
  for (let i = 26; i >= 0; i--) {
    const ang = i * 2.39996 + rnd(seed * 31 + i) * 0.5;
    const rad = 5.4 * Math.sqrt(i);
    florets.push({ x: 50 + Math.cos(ang) * rad * 0.94, y: 50 + Math.sin(ang) * rad * 0.88, r: 6.8 + i * 0.34, a: ang, i });
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {florets.map((f, k) => (
        <g key={k}>
          <circle cx={f.x.toFixed(1)} cy={f.y.toFixed(1)} r={f.r.toFixed(1)} fill={f.i % 2 ? deep : mid} />
          <circle
            cx={(f.x + Math.cos(f.a) * f.r * 0.28).toFixed(1)}
            cy={(f.y + Math.sin(f.a) * f.r * 0.28).toFixed(1)}
            r={(f.r * 0.64).toFixed(1)}
            fill={f.i % 2 ? mid : lit}
            opacity={0.94}
          />
          {/* the four-lobe hint that says hydrangea, not rose */}
          <circle cx={(f.x - f.r * 0.22).toFixed(1)} cy={(f.y - f.r * 0.22).toFixed(1)} r={(f.r * 0.2).toFixed(1)} fill={lit} opacity={0.75} />
        </g>
      ))}
    </svg>
  );
}

/** the full-width HYDRANGEA BED the navy strip tears into its white greeting:
 *  blue and white pom heads packed three rows deep over dark leafage */
export function HydrangeaBed({ className }: { className?: string }) {
  const white = ["#B9C4E0", "#E4E9F5", "#FFFFFF"];
  const blue = ["#5F76B8", "#8CA3D8", "#D7E0F4"];
  const soft = ["#7E93CC", "#A9BBE3", "#EDF0F7"];
  const heads: Array<{ x: number; y: number; s: number; seed: number; t: string[] }> = [
    { x: 18, y: 8, s: 130, seed: 3, t: soft },
    { x: 150, y: -10, s: 122, seed: 7, t: white },
    { x: 258, y: 12, s: 126, seed: 11, t: blue },
    { x: -42, y: 84, s: 176, seed: 13, t: blue },
    { x: 104, y: 62, s: 168, seed: 17, t: soft },
    { x: 298, y: 78, s: 156, seed: 19, t: white },
    { x: -10, y: 188, s: 208, seed: 23, t: white },
    { x: 126, y: 168, s: 236, seed: 29, t: blue },
    { x: 268, y: 194, s: 200, seed: 31, t: soft },
  ];
  return (
    <div className={className} aria-hidden="true" data-reveal="up">
      <svg viewBox="0 0 390 60" className="kn-rosebed__leaves">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx={20 + i * 33} cy={30 + (i % 3) * 9} rx={26} ry={12} fill="#10152B" transform={`rotate(${-24 + (i % 5) * 12} ${20 + i * 33} 30)`} />
        ))}
      </svg>
      {heads.map((h, i) => (
        <span key={i} className="kn-rosebed__bloom" style={{ left: h.x, top: h.y, width: h.s, height: h.s }} data-float={String(6 + (i % 3))}>
          <Hydrangea size={h.s} seed={h.seed} tones={h.t} />
        </span>
      ))}
    </div>
  );
}

/** a rose seen from above: petal rings drawn as offset arcs, deep reds — the
 *  velvet reference's bloom. `tone` shifts between the two reds and the pink */
export function Rose({ size = 120, seed = 1, tone = "#8E1F2F", heart = "#5E1420", className }: { size?: number; seed?: number; tone?: string; heart?: string; className?: string }) {
  const rings = 5;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill={tone} />
      {Array.from({ length: rings }).map((_, ri) =>
        Array.from({ length: 5 + ri * 2 }).map((_, pi) => {
          const count = 5 + ri * 2;
          const a = (pi / count) * Math.PI * 2 + rnd(seed * 13 + ri * 7 + pi) * 0.5;
          const rad = 8 + ri * 8.6;
          const px = 50 + Math.cos(a) * rad;
          const py = 50 + Math.sin(a) * rad;
          const pr = 13 - ri * 1.7;
          return (
            <path
              key={`${ri}-${pi}`}
              d={`M ${px - pr} ${py} A ${pr} ${pr} 0 0 1 ${px + pr} ${py}`}
              fill="none"
              stroke={heart}
              strokeOpacity={0.55 - ri * 0.07}
              strokeWidth={2.4 - ri * 0.3}
              transform={`rotate(${(a * 180) / Math.PI + 90} ${px} ${py})`}
            />
          );
        }),
      )}
      <circle cx="50" cy="50" r="7" fill={heart} />
    </svg>
  );
}

/** a eucalyptus sprig: a bending stem with paired round leaves — the sage
 *  reference's corner flora */
export function Eucalyptus({ size = 120, seed = 1, flip = false, className }: { size?: number; seed?: number; flip?: boolean; className?: string }) {
  const leaves = 7;
  return (
    <svg viewBox="0 0 60 140" width={size * 0.43} height={size} className={className} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M30 138 C 26 100, 34 62, 28 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {Array.from({ length: leaves }).map((_, i) => {
        const y = 118 - i * 16;
        const s = 10 - i * 0.8 + rnd(seed + i) * 2;
        return (
          <g key={i}>
            <ellipse cx={30 - s - 1} cy={y} rx={s} ry={s * 0.82} fill="currentColor" opacity={0.85 - i * 0.06} />
            <ellipse cx={30 + s + 1} cy={y - 8} rx={s * 0.92} ry={s * 0.76} fill="currentColor" opacity={0.7 - i * 0.05} />
          </g>
        );
      })}
    </svg>
  );
}

/** A LUSH ROSE — the velvet reference's bloom, drawn the way roses actually
 *  grow: petals on a golden-angle spiral (137.5° apart, radius √i), each
 *  petal a dark disc under a light disc offset outward — a crescent of shade
 *  with no gradients, no defs, no ids to collide. Deterministic, so the
 *  server and the client grow the same flower. */
export function RoseBloom({ size = 150, seed = 1, deep = "#4A0E18", mid = "#8E1F2F", lit = "#B23648", className }: {
  size?: number; seed?: number; deep?: string; mid?: string; lit?: string; className?: string;
}) {
  // Petals GROW with their distance from the heart — a rose's outer petals
  // are its largest — and are painted outer-first, so each ring tucks under
  // the one inside it, the way real petals wrap.
  const petals: Array<{ x: number; y: number; r: number; a: number; i: number }> = [];
  for (let i = 30; i >= 0; i--) {
    const ang = i * 2.39996 + rnd(seed * 17 + i) * 0.34; // the golden angle
    const rad = 4.9 * Math.sqrt(i);
    petals.push({ x: 50 + Math.cos(ang) * rad * 0.94, y: 50 + Math.sin(ang) * rad * 0.9, r: 6.2 + i * 0.46, a: ang, i });
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      {petals.map((p, k) => (
        <g key={k}>
          {/* the petal's body in shade, its outer edge catching the light */}
          <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.r.toFixed(1)} fill={p.i % 2 ? deep : mid} />
          <circle
            cx={(p.x + Math.cos(p.a) * p.r * 0.3).toFixed(1)}
            cy={(p.y + Math.sin(p.a) * p.r * 0.3).toFixed(1)}
            r={(p.r * 0.62).toFixed(1)}
            fill={p.i % 2 ? mid : lit}
            opacity={0.92}
          />
        </g>
      ))}
      {/* the furled heart */}
      <circle cx="50" cy="50" r="5.6" fill={deep} />
      <path d="M 50 45 a 5 5 0 1 1 -4.6 7 a 3.4 3.4 0 1 0 3.2 -5.4" fill={mid} />
    </svg>
  );
}

/** the FULL-WIDTH BED the reference tears into its white panel: nine blooms
 *  packed edge to edge — three tall rows, no ground showing through — over
 *  dark leafage. The wrapper carries the curtain reveal. */
export function RoseBed({ className }: { className?: string }) {
  const blooms: Array<{ x: number; y: number; s: number; seed: number; pink?: boolean }> = [
    // the back row, smaller, peeking between the front blooms
    { x: 24, y: 12, s: 138, seed: 13 },
    { x: 148, y: -8, s: 128, seed: 17 },
    { x: 258, y: 16, s: 132, seed: 19 },
    // the middle row
    { x: -44, y: 92, s: 184, seed: 23 },
    { x: 300, y: 84, s: 158, seed: 5, pink: true },
    { x: 108, y: 66, s: 172, seed: 29 },
    // the front row, the largest, riding the tear
    { x: -12, y: 196, s: 216, seed: 3 },
    { x: 128, y: 172, s: 248, seed: 7 },
    { x: 268, y: 200, s: 208, seed: 11, pink: true },
  ];
  return (
    <div className={className} aria-hidden="true" data-reveal="up">
      <svg viewBox="0 0 390 60" className="kn-rosebed__leaves">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx={20 + i * 33} cy={30 + (i % 3) * 9} rx={26} ry={12} fill="#1E0A10" transform={`rotate(${-24 + (i % 5) * 12} ${20 + i * 33} 30)`} />
        ))}
      </svg>
      {blooms.map((b, i) => (
        <span key={i} className="kn-rosebed__bloom" style={{ left: b.x, top: b.y, width: b.s, height: b.s }} data-float={String(6 + (i % 3))}>
          {b.pink
            ? <RoseBloom size={b.s} seed={b.seed} deep="#A65A6C" mid="#E8AFBD" lit="#F6D4DC" />
            : <RoseBloom size={b.s} seed={b.seed} deep={i % 2 ? "#4A0E18" : "#5E1420"} mid={i % 2 ? "#8E1F2F" : "#7A1826"} />}
        </span>
      ))}
    </div>
  );
}

/** the line-drawn bouquet and the bottle of wine — the reference's closing
 *  vignette on the DETAILS band */
export function BouquetBottle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      {/* the wrapped bouquet */}
      <path d="M28 112 L64 62 M76 112 L44 60 M52 112 L52 64" strokeOpacity="0.9" />
      <path d="M28 112 h 48 l -10 -22 h -28 z" strokeOpacity="0.6" />
      {[[44, 46], [62, 40], [78, 52]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="13" />
          <path d={`M ${cx - 7} ${cy} a 7 7 0 0 1 14 0 M ${cx - 3.4} ${cy - 4} a 4 4 0 0 1 7 3`} strokeOpacity="0.8" />
        </g>
      ))}
      <path d="M34 58 q -8 -10 -2 -20 M88 62 q 10 -8 6 -20" strokeOpacity="0.7" />
      {/* the bottle */}
      <path d="M150 112 v -44 q 0 -10 8 -14 v -22 h 12 v 22 q 8 4 8 14 v 44 z" />
      <path d="M158 26 h 12 M154 74 h 22 M154 92 h 22" strokeOpacity="0.7" />
    </svg>
  );
}

/** the guest table, hand-sketched: a clothed round table, two bow-backed
 *  chairs, candles and a bottle — the velvet reference's seating-plan card */
export function TableSketch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {/* the cloth */}
      <ellipse cx="120" cy="62" rx="62" ry="16" />
      <path d="M58 62 C 56 96, 66 116, 74 122 M182 62 C 184 96, 174 116, 166 122" />
      <path d="M74 122 q 46 12 92 0" />
      <path d="M78 96 q 42 10 84 0" strokeOpacity="0.5" />
      {/* the leg */}
      <path d="M120 124 v 10 m -14 6 q 14 -8 28 0" />
      {/* what stands on it */}
      <path d="M96 48 v -14 m 0 0 a 3 6 0 1 1 0.01 0" strokeOpacity="0.8" />
      <path d="M108 50 v -10 m 0 0 a 2.6 5 0 1 1 0.01 0" strokeOpacity="0.8" />
      <path d="M150 52 v -20 q 0 -6 5 -6 q 5 0 5 6 v 20" strokeOpacity="0.9" />
      <ellipse cx="128" cy="52" rx="9" ry="3.2" strokeOpacity="0.8" />
      <ellipse cx="140" cy="56" rx="7" ry="2.6" strokeOpacity="0.6" />
      {/* two chairs, bows on their backs */}
      <path d="M34 70 q -10 24 -4 52 m 26 -50 q 8 24 2 50 M28 122 h 34 M32 84 q 16 -8 30 0" />
      <path d="M44 66 q -6 -8 -12 -2 q 6 8 12 2 q 6 6 12 0 q -6 -8 -12 2" strokeOpacity="0.9" />
      <path d="M206 70 q 10 24 4 52 m -26 -50 q -8 24 -2 50 M178 122 h 34 M180 84 q 16 -8 30 0" />
      <path d="M196 66 q -6 -8 -12 -2 q 6 8 12 2 q 6 6 12 0 q -6 -8 -12 2" strokeOpacity="0.9" />
    </svg>
  );
}

/** two dress forms — the gown and the suit, line-drawn, for the dress-code
 *  card the navy and velvet references both open with */
export function DressForms({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {/* the gown on its stand */}
      <path d="M62 14 q -8 10 -6 18 q 3 10 6 12 q 3 -2 6 -12 q 2 -8 -6 -18" />
      <path d="M56 44 q -18 34 -12 56 q 18 8 36 0 q 6 -22 -12 -56" />
      <path d="M52 66 q 10 6 20 0 M48 84 q 14 8 28 0" strokeOpacity="0.55" />
      <path d="M62 100 v 8 m -10 6 h 20" />
      {/* the suit on its hanger */}
      <path d="M138 10 q 0 6 6 8 l -22 12 h 44 l -22 -12" />
      <path d="M122 30 q -6 30 -2 56 q 18 6 40 0 q 4 -26 -2 -56 z" />
      <path d="M138 30 l 4 26 l 4 -26 M132 30 l 10 14 l 10 -14" strokeOpacity="0.8" />
      <path d="M126 52 l -8 10 M154 52 l 8 10" strokeOpacity="0.7" />
      <path d="M140 96 v 10 m -8 6 h 16" />
    </svg>
  );
}
