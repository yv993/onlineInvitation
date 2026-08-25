"use client";

import { capsDate } from "@/components/templates/SealBanner";
import { crest, n1, rnd, treeline } from "@/components/templates/SceneHero";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE CASTLE SCENE — the hero of «Ամրոցի հովիտ» (birthday-5), measured from
// ONE animated scene invitation: pinterest.com/pin/76561262410085706, the
// 10-second flythrough of a fairytale village under snow peaks. Read frame by
// frame, it holds:
//   · a great white massif filling the upper half, blue-grey in its shadows
//   · a castle in the middle distance — a stone keep, conical witch-hat
//     towers, a church spire, cottages along the slope
//   · a GOLDEN autumn forest instead of green, all the way down
//   · a teal pond with the range lying in it, and a watermill at its edge
//   · a flock of birds crossing the sky
//   · and THE GRABBED ANIMATION: the camera never stops — a slow, continuous
//     push into the valley, past a golden foliage arch, for the whole clip.
//
// The composition machinery is SceneHero's (same lens, same layer contract,
// same `data-scene` verb): layers carry `data-depth`, the scroll dollies, a
// fine pointer tilts. What is new is the `.kn-sc__drift` wrapper — a camera
// that breathes FORWARD on its own, by time and not by scroll — plus the
// turning mill wheel, the crossing flock, and leaves for motes. All of it is
// DRAWN: paths, gradients and the shared integer pseudo-random, so the server
// and the browser draw the same valley. No asset, no licence, no third-party
// request. The palette was MEASURED before use (lib/templates.ts →
// birthday-5 for the ratios).
// ============================================================================

const L = {
  scene: { hy: "Նկարված ամրոցի հովիտը՝ ձյունոտ լեռների տակ", en: "The painted castle valley under snow peaks" },
};

// one ridge line for the massif, reused upside-down in the pond
const RANGE =
  "M0 400L128 288L236 352L392 196L520 318L678 240L804 336L948 224L1064 316L1200 272L1200 760L0 760Z";
const RANGE_SNOW =
  "M392 196L436 250L414 256L392 240L368 258L346 246ZM948 224L988 272L968 278L948 262L926 278L906 268ZM128 288L162 330L146 334L128 322L110 334L94 326Z";

/** a witch-hat tower: wall, cone, a lit slit window */
function Tower({ x, y, w, h, cone }: { x: number; y: number; w: number; h: number; cone: number }) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#CFC4AC" />
      <rect x={x} y={y} width={n1(w * 0.32)} height={h} fill="#B7AB90" />
      <path d={`M${x - 5} ${y}L${cx} ${y - cone}L${x + w + 5} ${y}Z`} fill="#66707F" />
      <path d={`M${x - 5} ${y}L${cx} ${y - cone}L${cx} ${y}Z`} fill="#59636F" />
      <rect x={n1(cx - 2)} y={n1(y + h * 0.3)} width="4" height="9" fill="#6E6250" />
    </g>
  );
}

/** the golden corner foliage the flythrough opens through — one side; the
 *  right side is this one mirrored by its wrapper */
function GoldSide() {
  return (
    <>
      <path d="M0 0C120 8 208 54 246 140C176 114 88 112 0 142Z" fill="#8F7E3F" opacity="0.95" />
      {Array.from({ length: 12 }, (_, i) => {
        const ang = n1(7 + i * 7 + rnd(i + 11) * 5);
        const k = n1(0.7 + rnd(i + 47) * 1.05);
        return <path key={`g${i}`} d="M0 0C34 -22 78 -18 100 0C78 18 34 22 0 0Z" transform={`rotate(${ang}) scale(${k})`} fill={i % 3 === 0 ? "#C9A245" : i % 3 === 1 ? "#B08430" : "#8F7E3F"} opacity="0.92" />;
      })}
      {Array.from({ length: 7 }, (_, i) => {
        const ang = n1(16 + i * 10 + rnd(i + 83) * 6);
        const k = n1(0.45 + rnd(i + 95) * 0.5);
        return <path key={`g2${i}`} d="M0 0C34 -22 78 -18 100 0C78 18 34 22 0 0Z" transform={`rotate(${ang}) scale(${k})`} fill="#D9B958" opacity="0.85" />;
      })}
    </>
  );
}

export default function CastleScene({ lang, a, b, iso, kicker, city, weekday, compact = false, embed = false }: {
  lang: Lang;
  a: string;
  /** the age — between two hairlines under the name */
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
      <svg viewBox="0 0 1200 760" className="kn-sc__svg" preserveAspectRatio="xMidYMax slice" aria-hidden="true">{kids}</svg>
    </div>
  );

  return (
    <div className={`kn-sc kn-sc--castle${compact ? " kn-sc--compact" : ""}`} {...(live ? { "data-scene": "" } : {})} role="img" aria-label={`${a}${b ? ` · ${b}` : ""} — ${t(lang, L.scene)}`}>
      <div className="kn-sc__stage">
        <div className="kn-sc__cam">
        {/* the drifting camera — Motion pushes this wrapper forward and back
            in z, forever: the grabbed animation. Inert without JS. */}
        <div className="kn-sc__drift">

        {/* ---------------------------------------------------------- sky */}
        {layer("sky", 0.05, (
          <>
            <defs>
              <linearGradient id="kn-cv-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#DDE5F4" />
                <stop offset="0.55" stopColor="#C2D0EE" />
                <stop offset="1" stopColor="#EFEBDD" />
              </linearGradient>
              <radialGradient id="kn-cv-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#FFF6DE" stopOpacity="0.9" />
                <stop offset="1" stopColor="#FFF6DE" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="1200" height="760" fill="url(#kn-cv-sky)" />
            <circle cx="252" cy="150" r="118" fill="url(#kn-cv-halo)" />
            <circle cx="252" cy="150" r="36" fill="#F8F2DE" />
            <g fill="#FFFFFF" opacity="0.5">
              <ellipse cx="760" cy="120" rx="380" ry="18" />
              <ellipse cx="420" cy="70" rx="290" ry="14" />
              <ellipse cx="900" cy="180" rx="300" ry="13" />
            </g>
          </>
        ))}

        {/* ------------------------------------------------- the massif */}
        {layer("peaks", 0.12, (
          <>
            <defs>
              <linearGradient id="kn-cv-peak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F7F9FC" />
                <stop offset="0.5" stopColor="#DDE3EE" />
                <stop offset="1" stopColor="#B6C2D8" />
              </linearGradient>
              <pattern id="kn-cv-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(34)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="#6E7A90" strokeWidth="0.9" opacity="0.2" />
              </pattern>
            </defs>
            <path d={RANGE} fill="url(#kn-cv-peak)" />
            <path d={RANGE} fill="url(#kn-cv-hatch)" />
            {/* the shadowed east faces */}
            <g fill="#AEBBD1" opacity="0.55">
              <path d="M392 196L520 318L448 318Z" />
              <path d="M948 224L1064 316L1000 316Z" />
              <path d="M128 288L236 352L182 352Z" />
            </g>
            <path d={RANGE_SNOW} fill="#FDFDFF" opacity="0.95" />
          </>
        ))}

        {/* --------------------------- far cottages (noise at card size) */}
        {layer("town", 0.18, (
          <g fill="#C6CBD7">
            <path d="M180 470v-34h30v34Z" /><path d="M176 436L195 412L214 436Z" fill="#B2B9C8" />
            <path d="M1010 462v-28h26v28Z" /><path d="M1006 434L1023 414L1040 434Z" fill="#B2B9C8" />
            <path d="M300 480v-24h22v24Z" /><path d="M296 456L311 438L326 456Z" fill="#B2B9C8" />
          </g>
        ))}

        {/* ---------------------------------------------- the castle */}
        {layer("castle", 0.26, (
          <>
            {/* the keep, crenellated */}
            <g>
              <rect x="520" y="392" width="92" height="122" fill="#CFC4AC" />
              <rect x="520" y="392" width="30" height="122" fill="#B7AB90" />
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={520 + i * 16} y="384" width="9" height="10" fill="#CFC4AC" />
              ))}
              <g fill="#6E6250">
                <rect x="538" y="416" width="7" height="12" /><rect x="560" y="416" width="7" height="12" /><rect x="582" y="416" width="7" height="12" />
                <rect x="538" y="446" width="7" height="12" /><rect x="560" y="446" width="7" height="12" /><rect x="582" y="446" width="7" height="12" />
                <path d="M556 514v-26c0-8 6-13 12-13s12 5 12 13v26Z" fill="#59524A" />
              </g>
            </g>
            <Tower x={488} y={366} w={34} h={148} cone={62} />
            <Tower x={614} y={402} w={28} h={112} cone={50} />
            {/* the flag flies on the eastern tower — off the type's column */}
            <g>
              <line x1="819" y1="388" x2="819" y2="366" stroke="#59636F" strokeWidth="2" />
              <path d="M819 366l20 6-20 6Z" fill="#A2513D" />
            </g>
            {/* the church, its spire and cross */}
            <g>
              <rect x="700" y="440" width="66" height="74" fill="#D8CCB4" />
              <path d="M696 440L733 414L770 440Z" fill="#77655B" />
              <rect x="722" y="376" width="22" height="66" fill="#CFC4AC" />
              <path d="M718 376L733 336L748 376Z" fill="#66707F" />
              <line x1="733" y1="336" x2="733" y2="324" stroke="#59636F" strokeWidth="2.4" />
              <line x1="728" y1="329" x2="738" y2="329" stroke="#59636F" strokeWidth="2.4" />
              <circle cx="733" cy="460" r="9" fill="none" stroke="#8A7458" strokeWidth="2" />
            </g>
            <Tower x={806} y={432} w={26} h={82} cone={44} />
            <Tower x={862} y={452} w={22} h={62} cone={36} />
            {/* cottages along the slope */}
            <g>
              <rect x="410" y="470" width="52" height="44" fill="#D8CCB4" /><path d="M406 470L436 448L466 470Z" fill="#8A7458" />
              <rect x="656" y="474" width="40" height="40" fill="#CFC4AC" /><path d="M652 474L676 456L700 474Z" fill="#77655B" />
              <rect x="900" y="470" width="46" height="44" fill="#D8CCB4" /><path d="M896 470L923 450L950 470Z" fill="#8A7458" />
            </g>
            <rect x="396" y="510" width="560" height="12" fill="#B7AB90" opacity="0.55" />
          </>
        ))}

        {/* --------------------------------------- the golden forest */}
        {layer("hills", 0.36, (
          <>
            <path d={`M0 ${n1(crest(0, 520, 26))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50, 520, 26))}`).join("")} L1200 760L0 760Z`} fill="#C2A752" />
            {treeline(520, 26, 5, 34, "#B08430", "#8F6A26")}
            <path d={`M0 ${n1(crest(0, 566, 18))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50 + 140, 566, 18))}`).join("")} L1200 760L0 760Z`} fill="#A8913F" />
            {/* a few dark firs against the gold */}
            <g fill="#5C6144">
              <path d="M96 560l16-46 16 46Zm4-26l12-34 12 34Z" />
              <path d="M1084 556l15-44 15 44Zm4-24l11-32 11 32Z" />
              <path d="M646 566l13-38 13 38Z" />
            </g>
          </>
        ))}

        {/* ------------------------------------------------ the pond */}
        {layer("water", 0.48, (
          <>
            <defs>
              <linearGradient id="kn-cv-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8FB1A6" />
                <stop offset="1" stopColor="#3F5D52" />
              </linearGradient>
              <clipPath id="kn-cv-pond"><rect x="0" y="592" width="1200" height="70" /></clipPath>
            </defs>
            <rect x="0" y="592" width="1200" height="70" fill="url(#kn-cv-water)" />
            {/* the massif and the forest crest lying in the water */}
            <g clipPath="url(#kn-cv-pond)">
              <path d={RANGE} transform="translate(0,712) scale(1,-0.2)" fill="#DCE4E6" opacity="0.4" />
              <path d={`M0 ${n1(crest(0, 520, 26))} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${n1(crest(i * 50, 520, 26))}`).join("")} L1200 760L0 760Z`} transform="translate(0,712) scale(1,-0.2)" fill="#6E8455" opacity="0.35" />
            </g>
            {/* the emerald shallows the reference's pond glows with */}
            <g fill="#35A183" opacity="0.4">
              <ellipse cx="330" cy="628" rx="120" ry="10" />
              <ellipse cx="760" cy="640" rx="150" ry="9" />
            </g>
            <path d="M0 592H1200" stroke="#7E958B" strokeWidth="2" opacity="0.5" />
            <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6">
              <line x1="210" y1="612" x2="420" y2="612" /><line x1="520" y1="630" x2="668" y2="630" />
              <line x1="740" y1="608" x2="930" y2="608" /><line x1="330" y1="646" x2="470" y2="646" />
            </g>
          </>
        ))}

        {/* ------------------------------- the watermill and its wheel */}
        {layer("mill", 0.62, (
          <>
            {/* the mill house at the pond's edge */}
            <g>
              <rect x="906" y="540" width="112" height="82" fill="#E3D7BE" />
              <path d="M898 540L962 498L1026 540Z" fill="#77655B" />
              <g stroke="#8A7458" strokeWidth="3">
                <line x1="934" y1="540" x2="934" y2="622" /><line x1="962" y1="540" x2="962" y2="622" /><line x1="990" y1="540" x2="990" y2="622" />
                <line x1="906" y1="580" x2="1018" y2="580" />
              </g>
              <rect x="948" y="552" width="26" height="20" fill="#E8B54E" stroke="#8A7458" strokeWidth="2" />
            </g>
            {/* the wheel: an outer group owns the place, the inner group is
                what Motion turns — its own transform starts clean */}
            <g transform="translate(893 612)">
              <g className="kn-sc__wheel">
                <circle cx="0" cy="0" r="30" fill="none" stroke="#5D4B36" strokeWidth="5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="#5D4B36" strokeWidth="2.4" />
                {Array.from({ length: 8 }, (_, i) => {
                  const t0 = (i / 8) * Math.PI * 2;
                  return <line key={i} x1="0" y1="0" x2={n1(Math.cos(t0) * 29)} y2={n1(Math.sin(t0) * 29)} stroke="#5D4B36" strokeWidth="2.6" />;
                })}
                {Array.from({ length: 8 }, (_, i) => {
                  const t0 = ((i + 0.5) / 8) * Math.PI * 2;
                  return <line key={`p${i}`} x1={n1(Math.cos(t0) * 24)} y1={n1(Math.sin(t0) * 24)} x2={n1(Math.cos(t0) * 30)} y2={n1(Math.sin(t0) * 30)} stroke="#5D4B36" strokeWidth="4.4" />;
                })}
              </g>
            </g>
            {/* a stone cottage on the far bank */}
            <g>
              <rect x="128" y="556" width="88" height="62" fill="#D8CCB4" />
              <path d="M120 556L172 520L224 556Z" fill="#8A7458" />
              <rect x="152" y="572" width="18" height="16" fill="#E8B54E" stroke="#8A7458" strokeWidth="2" />
              <rect x="188" y="572" width="14" height="46" fill="#B7AB90" />
            </g>
            {/* golden bushes at the banks */}
            <g fill="#B08430">
              <ellipse cx="252" cy="618" rx="34" ry="18" /><ellipse cx="76" cy="612" rx="28" ry="16" />
              <ellipse cx="1102" cy="620" rx="36" ry="18" /><ellipse cx="852" cy="624" rx="26" ry="14" />
            </g>
          </>
        ))}

        {/* ------------------------------------------------ the meadow */}
        {layer("meadow", 0.78, (
          <>
            <defs>
              <linearGradient id="kn-cv-grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#C9B25C" />
                <stop offset="1" stopColor="#8F7E3D" />
              </linearGradient>
            </defs>
            <path d="M0 668Q300 642 600 660T1200 650V760H0Z" fill="url(#kn-cv-grass)" />
            {Array.from({ length: 84 }, (_, i) => {
              const x = n1(rnd(i + 20) * 1200);
              const y = n1(676 + rnd(i + 320) * 78);
              const r = n1(2.2 + rnd(i + 620) * 2.6);
              const c = ["#E8D48A", "#B65C33", "#FBF6E8", "#D9A03F"][i % 4];
              return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity="0.92" />;
            })}
            <g stroke="#6B5D2C" strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
              {Array.from({ length: 36 }, (_, i) => {
                const x = n1(rnd(i + 920) * 1200);
                const y = n1(682 + rnd(i + 1220) * 70);
                return <line key={i} x1={x} y1={y} x2={n1(x + (i % 2 ? 5 : -5))} y2={n1(y - 14)} />;
              })}
            </g>
          </>
        ))}

        {/* --------------------- the air: the flock, the falling leaves */}
        {layer("motes", 0.9, (
          <>
            <g className="kn-sc__flock" fill="none" stroke="#463F32" strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
              <path d="M430 168q9-8 18 0q9-8 18 0" /><path d="M484 148q7-6 14 0q7-6 14 0" />
              <path d="M410 200q7-6 14 0q7-6 14 0" /><path d="M472 214q6-5 12 0q6-5 12 0" />
              <path d="M520 184q6-5 12 0q6-5 12 0" /><path d="M540 226q5-4 10 0q5-4 10 0" />
            </g>
            {Array.from({ length: 13 }, (_, i) => (
              <path
                key={i}
                className="kn-sc__mote"
                d="M0 0C6 -7 14 -7 18 0C14 7 6 7 0 0Z"
                transform={`translate(${n1(80 + rnd(i + 41) * 1040)} ${n1(220 + rnd(i + 87) * 380)}) rotate(${n1(rnd(i + 133) * 80 - 40)}) scale(${n1(0.7 + rnd(i + 177) * 0.8)})`}
                fill={["#D9B958", "#C9862F", "#B65C33"][i % 3]}
                opacity="0.85"
              />
            ))}
          </>
        ))}

        {/* -------------------------------------- the golden gateway */}
        <div className="kn-sc__l kn-sc__l--arch" data-depth="1" data-arch="">
          <span className="kn-sc__archW kn-sc__archW--l"><svg viewBox="0 0 420 640" className="kn-sc__arch" preserveAspectRatio="xMinYMin meet" aria-hidden="true"><GoldSide /></svg></span>
          <span className="kn-sc__archW kn-sc__archW--r"><svg viewBox="0 0 420 640" className="kn-sc__arch" preserveAspectRatio="xMinYMin meet" aria-hidden="true"><GoldSide /></svg></span>
        </div>

        </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ type */}
      {/* `data-rise` only on the live page — the same contract as SceneHero:
          Motion skips the wizard's frames, so a compact scene must not park */}
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
