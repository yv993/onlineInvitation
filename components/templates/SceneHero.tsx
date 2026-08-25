"use client";

import { capsDate } from "@/components/templates/SealBanner";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE SCENE HERO — the hero of «Հեքիաթի հովիտ» (birthday-4), measured from
// three animated scene invitations:
//
//   pinterest.com/pin/1020206121835971536  (Panji & Tassya, 16s, illustrated)
//     · the shot OPENS INSIDE the foliage and pulls back to reveal the valley
//     · the picture is a STACK OF FLAT LAYERS — engraved mountains, then the
//       treeline, then the house, then the flowers crowding the bottom corners
//     · a scalloped ornament band HANGS FROM THE TOP EDGE over all of it
//     · the title RESOLVES OUT OF A BLUR, letter by letter, over the sky
//     · the whole frame never stops drifting, and at the end it dives back
//       into the foliage and loops
//   pinterest.com/pin/953496552376593884   (10s, a valley behind a tree arch)
//   pinterest.com/pin/76561262410085706    (10s, a village under snow peaks)
//     · both DOLLY FORWARD THROUGH A FOREGROUND ARCH: the near layer sweeps
//       past the edges and out of frame while the far layers barely move
//     · tiny things drift across the air — motes in one, birds in the other
//
// Here the camera is the scroll: every layer carries its depth, the parallax
// is scrubbed, and the arch — a balloon arch, because this is a birthday —
// grows past the reader as they scroll into the page. All of it is DRAWN:
// paths, gradients and one deterministic pseudo-random for the scatter, so
// the server and the browser draw the same valley. No asset, no licence, no
// third-party request. The fourth link the request carried
// (pin/1283558124836454) is dead — Pinterest answers «We can't find that
// idea», so nothing was taken from it.
//
// The palette was MEASURED off the references before it was used (see
// lib/templates.ts → birthday-4 for the contrast ratios).
// ============================================================================

const L = {
  scene: { hy: "Նկարված հովիտը՝ փուչիկների կամարի հետևում", en: "The painted valley, behind a balloon arch" },
};

/** index → 0…1, integer maths only: the server and the browser must scatter
 *  the flowers, the motes and the balloons to exactly the same places.
 *  (Shared with CastleScene — the second diorama draws with the same hand.) */
export function rnd(i: number): number {
  let x = (i * 1103515245 + 12345) >>> 0;
  x ^= x >>> 15;
  return ((x * 2654435761) >>> 0) / 4294967296;
}
export const n1 = (v: number) => Number(v.toFixed(1));

// ---------------------------------------------------------------- the range
// one ridge line, reused by the peaks and by their reflection in the water
const PEAKS =
  "M0 486L96 430L150 452L232 372L300 424L366 392L452 300L520 356L566 330L648 402L712 366L790 430L858 392L940 448L1010 410L1092 462L1146 436L1200 470L1200 760L0 760Z";
const SNOW =
  "M452 300L486 340L470 344L452 332L434 344L418 338ZM232 372L262 406L246 410L232 400L216 410L202 404ZM858 392L884 424L870 428L858 418L844 428L832 422Z";

/** the wooded crest a hill layer follows */
export const crest = (x: number, y0: number, a: number) => y0 - a * Math.sin(x / 210) - (a * 0.55) * Math.cos(x / 95);

/** a row of round-crowned trees along a crest — the treeline both valley
 *  references carry between the rock and the water */
export function treeline(y0: number, amp: number, seed: number, step: number, fill: string, dark: string) {
  const out: React.ReactElement[] = [];
  for (let i = 0; i * step < 1240; i++) {
    const x = n1(i * step + rnd(i + seed) * step * 0.6 - 20);
    const y = n1(crest(x, y0, amp));
    const r = n1(7 + rnd(i + seed + 91) * 9);
    out.push(
      <g key={i}>
        <ellipse cx={x} cy={y - r * 0.6} rx={r} ry={r * 1.15} fill={fill} />
        <ellipse cx={n1(x - r * 0.5)} cy={n1(y - r * 0.2)} rx={n1(r * 0.7)} ry={n1(r * 0.8)} fill={dark} opacity="0.55" />
      </g>,
    );
  }
  return out;
}

const BALLOON = ["#F3D9C0", "#E7B7C3", "#D79854", "#FBF3E4", "#C9A66B", "#E9C9A0"];

/** ONE HALF of the arch the reader passes through, drawn in its own box and
 *  anchored to a corner of the frame by CSS — the right side is this one
 *  mirrored. The foreground has to hug the edges at every width, and a layer
 *  that is sliced to fill (as the landscape ones are) loses its edges on a
 *  phone: at 390px the sliced viewBox keeps only its middle third. */
function ArchSide() {
  // the quarter arch: from the foot of the frame up to the apex
  const at = (t: number) => {
    const th = ((180 + t * 90) * Math.PI) / 180;
    return { x: n1(420 + 380 * Math.cos(th)), y: n1(640 + 560 * Math.sin(th)) };
  };
  return (
    <>
      {/* the leaves hanging from the corner, fanned out of it */}
      {Array.from({ length: 13 }, (_, i) => {
        const ang = n1(6 + i * 6.6 + rnd(i) * 5);
        const k = n1(0.75 + rnd(i + 50) * 1.15);
        return <path key={`l${i}`} d="M0 0C34 -22 78 -18 100 0C78 18 34 22 0 0Z" transform={`rotate(${ang}) scale(${k})`} fill={i % 3 ? "#4B5140" : "#5F6B4A"} opacity="0.92" />;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const ang = n1(14 + i * 9 + rnd(i + 80) * 6);
        const k = n1(0.5 + rnd(i + 90) * 0.5);
        return <path key={`l2${i}`} d="M0 0C34 -22 78 -18 100 0C78 18 34 22 0 0Z" transform={`rotate(${ang}) scale(${k})`} fill="#6E7C4E" opacity="0.8" />;
      })}
      {/* and the balloons rising along it — crowded and big at the foot,
          thinning and shrinking toward the apex, the way an arch is tied */}
      {Array.from({ length: 15 }, (_, i) => {
        const t0 = 0.08 + (i / 14) * 0.92;
        const p = at(t0);
        const r = n1(13 + (1 - t0) * 17 + rnd(i + 7) * 7);
        const cx = n1(p.x + (rnd(i + 60) - 0.5) * 64), cy = n1(p.y + (rnd(i + 200) - 0.5) * 54);
        const fill = BALLOON[i % BALLOON.length];
        const pair = i % 3 === 0;
        const r2 = n1(r * 0.62), c2x = n1(cx + r * 1.15), c2y = n1(cy + r * 0.72);
        return (
          <g key={`b${i}`} className="kn-sc__bl">
            {pair && <ellipse cx={c2x} cy={c2y} rx={r2} ry={n1(r2 * 1.16)} fill={BALLOON[(i + 3) % BALLOON.length]} />}
            <ellipse cx={cx} cy={cy} rx={r} ry={n1(r * 1.16)} fill={fill} />
            <ellipse cx={n1(cx - r * 0.34)} cy={n1(cy - r * 0.42)} rx={n1(r * 0.26)} ry={n1(r * 0.34)} fill="#FFFFFF" opacity="0.5" />
            <path d={`M${cx} ${n1(cy + r * 1.16)}l-4 7h8Z`} fill={fill} />
          </g>
        );
      })}
    </>
  );
}

/** the scalloped band that hangs from the top edge (the reference's ornament
 *  border): ogee points, a diamond pressed into each one */
function canopyPath(w: number, n: number, drop: number, top: number): string {
  const step = w / n;
  let d = `M0 0H${w}V${top}`;
  for (let i = n; i > 0; i--) {
    const x0 = i * step, x1 = (i - 1) * step, mid = (x0 + x1) / 2;
    d += `Q${n1(x0 - step * 0.06)} ${n1(top + drop * 0.62)} ${n1(mid)} ${n1(top + drop)}`;
    d += `Q${n1(x1 + step * 0.06)} ${n1(top + drop * 0.62)} ${n1(x1)} ${top}`;
  }
  return `${d}Z`;
}

function Canopy() {
  const N = 16, W = 1200, TOP = 16, DROP = 58;
  const step = W / N;
  return (
    <svg viewBox="0 0 1200 92" className="kn-sc__canopySvg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="kn-sc-cn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7A964" />
          <stop offset="1" stopColor="#C98338" />
        </linearGradient>
      </defs>
      <path d={canopyPath(W, N, DROP, TOP)} fill="url(#kn-sc-cn)" />
      <rect x="0" y="0" width={W} height="12" fill="#8E5A28" />
      {Array.from({ length: N }, (_, i) => {
        const cx = n1((i + 0.5) * step), cy = TOP + DROP * 0.44;
        return <path key={i} d={`M${cx} ${n1(cy - 9)}L${n1(cx + 7)} ${cy}L${cx} ${n1(cy + 9)}L${n1(cx - 7)} ${cy}Z`} fill="#7A2E2A" opacity="0.85" />;
      })}
    </svg>
  );
}

// ============================================================================

export default function SceneHero({ lang, a, b, iso, kicker, city, weekday, compact = false, embed = false }: {
  lang: Lang;
  a: string;
  /** the age, for a birthday — set between two hairlines under the name */
  b: string;
  iso: string;
  kicker: T | string;
  city: string;
  weekday: string;
  compact?: boolean;
  embed?: boolean;
}) {
  const live = !compact;
  const H = compact || embed ? ("div" as const) : ("h1" as const);
  const layer = (name: string, depth: number, kids: React.ReactNode, extra?: Record<string, string>) => (
    <div className={`kn-sc__l kn-sc__l--${name}`} data-depth={depth} {...extra}>
      {/* xMidYMax slice: the layers fill the frame and stay registered to the
          same ground line, cropping at the sides — never letterboxed */}
      <svg viewBox="0 0 1200 760" className="kn-sc__svg" preserveAspectRatio="xMidYMax slice" aria-hidden="true">{kids}</svg>
    </div>
  );

  return (
    <div className={`kn-sc${compact ? " kn-sc--compact" : ""}`} {...(live ? { "data-scene": "" } : {})} role="img" aria-label={`${a}${b ? ` · ${b}` : ""} — ${t(lang, L.scene)}`}>
      <div className="kn-sc__stage">
        {/* the camera: everything inside sits at a real translateZ — Motion
            places the layers in depth and moves this box; without JS the
            wrapper is inert and the valley is simply the finished picture */}
        <div className="kn-sc__cam">
        {/* ---------------------------------------------------------- sky */}
        {layer("sky", 0.05, (
          <>
            <defs>
              <linearGradient id="kn-sc-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#BFD1F0" />
                <stop offset="0.5" stopColor="#E2E8F3" />
                <stop offset="1" stopColor="#F3EDE5" />
              </linearGradient>
              <radialGradient id="kn-sc-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#FFF4DC" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FFF4DC" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="1200" height="760" fill="url(#kn-sc-sky)" />
            <circle cx="948" cy="140" r="126" fill="url(#kn-sc-halo)" />
            <circle cx="948" cy="140" r="40" fill="#FDF6E7" />
            <g fill="#FFFFFF" opacity="0.5">
              <ellipse cx="330" cy="392" rx="430" ry="22" />
              <ellipse cx="820" cy="432" rx="360" ry="17" />
              <ellipse cx="560" cy="470" rx="520" ry="15" />
            </g>
          </>
        ))}

        {/* -------------------------------------------------------- peaks */}
        {layer("peaks", 0.12, (
          <>
            <defs>
              <linearGradient id="kn-sc-peak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4F6FA" />
                <stop offset="0.55" stopColor="#CBD5E5" />
                <stop offset="1" stopColor="#AEBBD1" />
              </linearGradient>
              <pattern id="kn-sc-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="#7C8698" strokeWidth="0.9" opacity="0.22" />
              </pattern>
            </defs>
            <path d={PEAKS} fill="url(#kn-sc-peak)" />
            <path d={PEAKS} fill="url(#kn-sc-hatch)" />
            <path d={SNOW} fill="#FDFDFF" opacity="0.9" />
          </>
        ))}

        {/* ------------------------------------------- the far village */}
        {layer("town", 0.2, (
          <g fill="#C3C8D4">
            {/* the tall spire both landscape references put in the middle distance */}
            <path d="M596 512V438h26v74Z" />
            <path d="M592 438L609 336L626 438Z" fill="#AEB5C4" />
            <path d="M604 336L609 306L614 336Z" fill="#AEB5C4" />
            <path d="M470 512v-52h40v52Z" />
            <path d="M466 460L490 424L514 460Z" fill="#AEB5C4" />
            <path d="M712 512v-44h34v44Z" />
            <path d="M708 468L729 438L750 468Z" fill="#AEB5C4" />
            <path d="M760 512v-30h26v30Z" />
            <path d="M756 482L773 460L790 482Z" fill="#AEB5C4" />
            <rect x="430" y="500" width="360" height="14" opacity="0.5" />
          </g>
        ))}

        {/* -------------------------------------------------------- hills */}
        {layer("hills", 0.3, (
          <>
            <path d={`M0 ${n1(crest(0, 520, 26))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50, 520, 26))}`).join("")} L1200 760L0 760Z`} fill="#A9B48C" />
            {treeline(520, 26, 3, 34, "#8E9C6E", "#6E7C4E")}
            <path d={`M0 ${n1(crest(0, 566, 18))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50 + 120, 566, 18))}`).join("")} L1200 760L0 760Z`} fill="#93A177" />
          </>
        ))}

        {/* -------------------------------------------------------- water */}
        {layer("water", 0.42, (
          <>
            <defs>
              <linearGradient id="kn-sc-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#D7E1DE" />
                <stop offset="1" stopColor="#A9BCB6" />
              </linearGradient>
              <clipPath id="kn-sc-pond"><rect x="0" y="600" width="1200" height="62" /></clipPath>
            </defs>
            <rect x="0" y="600" width="1200" height="62" fill="url(#kn-sc-water)" />
            {/* the range and the treeline, upside down in the still water —
                mirrored about the shoreline and flattened, the way a
                reflection foreshortens */}
            <g clipPath="url(#kn-sc-pond)">
              <path d={PEAKS} transform="translate(0,720) scale(1,-0.2)" fill="#8FA5A0" opacity="0.34" />
              <path d={`M0 ${n1(crest(0, 520, 26))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50, 520, 26))}`).join("")} L1200 760L0 760Z`} transform="translate(0,720) scale(1,-0.2)" fill="#7E9086" opacity="0.4" />
            </g>
            {/* the shore, and the light lying on the water */}
            <path d="M0 600H1200" stroke="#8A9A92" strokeWidth="2" opacity="0.5" />
            <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6">
              <line x1="230" y1="618" x2="452" y2="618" /><line x1="540" y1="636" x2="690" y2="636" />
              <line x1="770" y1="612" x2="960" y2="612" /><line x1="330" y1="650" x2="470" y2="650" />
              <line x1="640" y1="654" x2="812" y2="654" />
            </g>
          </>
        ))}

        {/* --------------------------------- the grove and the lit garland */}
        {layer("grove", 0.58, (
          <>
            <g fill="#5F6B4A">
              {/* poplars, the way they stand along an Armenian valley road */}
              <ellipse cx="150" cy="558" rx="20" ry="112" /><rect x="146" y="638" width="8" height="82" />
              <ellipse cx="216" cy="592" rx="16" ry="86" /><rect x="212" y="654" width="7" height="66" />
              <ellipse cx="1050" cy="564" rx="21" ry="118" /><rect x="1046" y="646" width="8" height="78" />
              <ellipse cx="986" cy="598" rx="15" ry="82" /><rect x="982" y="658" width="7" height="62" />
            </g>
            {/* the string of lights, hung between the two tallest poplars */}
            <path d="M150 452Q600 638 1050 452" fill="none" stroke="#5A4A3A" strokeWidth="2.4" opacity="0.7" />
            {Array.from({ length: 17 }, (_, i) => {
              const t0 = i / 16;
              const x = n1((1 - t0) * (1 - t0) * 150 + 2 * (1 - t0) * t0 * 600 + t0 * t0 * 1050);
              const y = n1((1 - t0) * (1 - t0) * 452 + 2 * (1 - t0) * t0 * 638 + t0 * t0 * 452);
              return (
                <g key={i} className="kn-sc__bulb">
                  <circle cx={x} cy={n1(y + 12)} r="15" fill="#FFD98A" opacity="0.3" />
                  <circle cx={x} cy={n1(y + 12)} r="9" fill="#FFE9B8" opacity="0.55" />
                  <line x1={x} y1={y} x2={x} y2={n1(y + 7)} stroke="#5A4A3A" strokeWidth="1.6" />
                  <circle cx={x} cy={n1(y + 12)} r="5.2" fill="#FFF3D2" stroke="#C9942F" strokeWidth="0.8" />
                </g>
              );
            })}
          </>
        ))}

        {/* ------------------------------------------------------- meadow */}
        {layer("meadow", 0.78, (
          <>
            <defs>
              <linearGradient id="kn-sc-grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8B9A63" />
                <stop offset="1" stopColor="#5E6C41" />
              </linearGradient>
            </defs>
            <path d="M0 666Q300 640 600 658T1200 648V760H0Z" fill="url(#kn-sc-grass)" />
            {Array.from({ length: 96 }, (_, i) => {
              const x = n1(rnd(i) * 1200);
              const y = n1(674 + rnd(i + 300) * 80);
              const r = n1(2.4 + rnd(i + 600) * 2.6);
              const c = ["#F3E1A8", "#E7B7C3", "#FDFCF7", "#E9A9B4"][i % 4];
              return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity="0.92" />;
            })}
            <g stroke="#4E5B36" strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
              {Array.from({ length: 40 }, (_, i) => {
                const x = n1(rnd(i + 900) * 1200);
                const y = n1(680 + rnd(i + 1200) * 72);
                return <line key={i} x1={x} y1={y} x2={n1(x + (i % 2 ? 5 : -5))} y2={n1(y - 14)} />;
              })}
            </g>
          </>
        ))}

        {/* -------------------------------- what drifts through the air */}
        {layer("motes", 0.9, (
          <>
            <g className="kn-sc__birds" fill="none" stroke="#4A4438" strokeWidth="2.2" strokeLinecap="round" opacity="0.65">
              <path d="M236 226q9-8 18 0q9-8 18 0" /><path d="M290 196q7-6 14 0q7-6 14 0" /><path d="M212 262q6-5 12 0q6-5 12 0" />
            </g>
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} className="kn-sc__mote" cx={n1(60 + rnd(i + 40) * 1080)} cy={n1(180 + rnd(i + 80) * 420)} r={n1(2 + rnd(i + 120) * 3)} fill="#FFF6E2" opacity="0.75" />
            ))}
          </>
        ), { "data-motes": "" })}

        {/* ------------------------------------------------- the arch */}
        {/* each side hangs in a wrapper that owns the corner and the mirror;
            the svg inside is what sways, so its transform starts clean */}
        <div className="kn-sc__l kn-sc__l--arch" data-depth="1" data-arch="">
          <span className="kn-sc__archW kn-sc__archW--l"><svg viewBox="0 0 420 640" className="kn-sc__arch" preserveAspectRatio="xMinYMin meet" aria-hidden="true"><ArchSide /></svg></span>
          <span className="kn-sc__archW kn-sc__archW--r"><svg viewBox="0 0 420 640" className="kn-sc__arch" preserveAspectRatio="xMinYMin meet" aria-hidden="true"><ArchSide /></svg></span>
        </div>
        </div>
      </div>

      {/* the ornament band, hanging from the top edge */}
      <div className="kn-sc__canopy"><Canopy /></div>

      {/* ------------------------------------------------------------ type */}
      {/* `data-rise` only on the live page: it is parked in CSS and unparked by
          Motion, and Motion skips live previews on purpose — a compact scene
          carrying it would sit at opacity 0 in the wizard's frames forever */}
      <div className="kn-sc__type">
        <p className="kn-sc__kick" {...(live ? { "data-rise": "" } : {})} data-track>{typeof kicker === "string" ? kicker : t(lang, kicker)}</p>
        <H className="kn-sc__name" {...(live ? { "data-rise": "" } : {})}>
          <span {...(live ? { "data-letters": "" } : {})}>{a}</span>
        </H>
        {b && (
          <p className="kn-sc__age" {...(live ? { "data-rise": "" } : {})}><i aria-hidden="true" /><b {...(live ? { "data-count": "" } : {})}>{b}</b><i aria-hidden="true" /></p>
        )}
        <p className="kn-sc__date" {...(live ? { "data-rise": "" } : {})}>{capsDate(lang, iso)}</p>
        <p className="kn-sc__meta" {...(live ? { "data-rise": "" } : {})}>{weekday} · {city}</p>
      </div>

      {live && (
        <span className="kn-sc__hint" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3.5l3 3 3-3" /></svg>
          {lang === "hy" ? "Ոլորեք" : "Scroll"}
        </span>
      )}
    </div>
  );
}
