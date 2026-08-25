import type { MotifId } from "@/lib/kids";

// ============================================================================
// THE MOTIFS — one SVG sprite of small original illustrations, two-tone: the
// body paints with `currentColor`, the details with `var(--m2)`. A card places
// them with <use href="#m-…"> and sets `color` and `--m2` per placement, so
// the same dinosaur is green on one card and blue on the next.
//
// Every symbol lives in a 100×100 box, drawn flat and friendly for this
// project. Nothing here is traced from a licensed card.
// ============================================================================

const M2 = "var(--m2, #fff)";

export const MOTIFS: Record<MotifId, React.ReactNode> = {
  balloon: (
    <>
      <ellipse cx="50" cy="38" rx="26" ry="32" fill="currentColor" />
      <ellipse cx="40" cy="26" rx="7" ry="11" fill={M2} opacity="0.55" transform="rotate(-20 40 26)" />
      <path d="M44 70l6 8 6-8z" fill="currentColor" />
      <path d="M50 78c-6 8 6 12 0 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  dot: <circle cx="50" cy="50" r="40" fill="currentColor" />,
  squiggle: <path d="M8 60c12-30 24 30 36 0s24 30 36 0" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />,
  tri: <path d="M50 12l38 70H12z" fill="currentColor" />,
  star: <path d="M50 6l12.6 27.4L92 37.6 70 58.2 75.6 88 50 73.2 24.4 88 30 58.2 8 37.6l29.4-4.2z" fill="currentColor" />,
  sparkle: <path d="M50 4c4 26 12 38 46 46-34 8-42 20-46 46-4-26-12-38-46-46 34-8 42-20 46-46z" fill="currentColor" />,
  heart: <path d="M50 88C20 66 8 52 8 34a20 20 0 0 1 42-10 20 20 0 0 1 42 10c0 18-12 32-42 54z" fill="currentColor" />,
  cakeSlice: (
    <>
      <path d="M12 82L52 20l40 62z" fill="currentColor" />
      <path d="M22 70h58M28 58h44M36 46h30" stroke={M2} strokeWidth="5" strokeLinecap="round" />
      <path d="M52 20c-6-6 4-12 0-16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="14" r="6" fill={M2} />
    </>
  ),
  cupcake: (
    <>
      <path d="M22 54h56l-6 36H28z" fill="currentColor" />
      <path d="M32 58v28M44 56v30M56 56v30M68 58v28" stroke={M2} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M18 54c0-16 14-16 18-24 4 12 20 8 20-4 6 10 20 6 22 18 4 6-2 12-6 12H24c-4 0-6-2-6-2z" fill={M2} />
      <circle cx="50" cy="20" r="7" fill="currentColor" />
    </>
  ),
  layerCake: (
    <>
      <rect x="10" y="60" width="80" height="30" rx="4" fill="currentColor" />
      <rect x="20" y="40" width="60" height="22" rx="4" fill={M2} />
      <rect x="30" y="24" width="40" height="18" rx="4" fill="currentColor" />
      <path d="M40 24v-10M50 24v-12M60 24v-10" stroke={M2} strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="10" r="4" fill="currentColor" /><circle cx="50" cy="8" r="4" fill="currentColor" /><circle cx="60" cy="10" r="4" fill="currentColor" />
      <path d="M12 68h76" stroke={M2} strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
    </>
  ),
  candle: (
    <>
      <rect x="38" y="34" width="24" height="60" rx="6" fill="currentColor" />
      <path d="M44 42v44M56 46v36" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M50 8c8 8 10 14 6 22-2 4-10 4-12 0-4-8-2-14 6-22z" fill={M2} />
      <path d="M50 16c3 4 4 8 2 12-1 2-3 2-4 0-2-4-1-8 2-12z" fill="currentColor" />
    </>
  ),
  lollipop: (
    <>
      <circle cx="50" cy="34" r="28" fill="currentColor" />
      <path d="M50 34a10 10 0 1 1 10 10 20 20 0 1 1-20-20" fill="none" stroke={M2} strokeWidth="6" strokeLinecap="round" />
      <rect x="47" y="60" width="6" height="36" rx="3" fill={M2} />
    </>
  ),
  iceCream: (
    <>
      <path d="M30 46h40L50 96z" fill="currentColor" />
      <path d="M36 54l28 0M40 62h20M44 70h12" stroke={M2} strokeWidth="3" opacity="0.7" />
      <circle cx="50" cy="34" r="22" fill={M2} />
      <path d="M32 40c4 8 8 8 12 4s8-2 12 2 8 4 12 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  donut: (
    <>
      <circle cx="50" cy="50" r="40" fill="currentColor" />
      <circle cx="50" cy="50" r="13" fill={M2} />
      <path d="M30 34l6 4M62 30l-4 6M70 56l-6 2M36 66l4-5M56 70l2-6M26 52l6-2" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  gift: (
    <>
      <rect x="14" y="40" width="72" height="52" rx="6" fill="currentColor" />
      <rect x="10" y="30" width="80" height="16" rx="4" fill="currentColor" />
      <rect x="44" y="30" width="12" height="62" fill={M2} />
      <path d="M50 30c-16 2-22-14-12-16s12 10 12 16zm0 0c16 2 22-14 12-16s-12 10-12 16z" fill={M2} />
    </>
  ),
  partyHat: (
    <>
      <path d="M50 8L84 86H16z" fill="currentColor" />
      <path d="M40 32l14 30M30 56l24 30M50 8l30 62" stroke={M2} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <circle cx="50" cy="10" r="9" fill={M2} />
      <path d="M16 86c10-8 24-8 34 0s24 8 34 0" fill="none" stroke={M2} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  moon: <path d="M62 8a42 42 0 1 0 30 70A34 34 0 0 1 62 8z" fill="currentColor" />,
  cloud: (
    <>
      <path d="M26 78a16 16 0 0 1-2-32 22 22 0 0 1 42-8 18 18 0 0 1 12 40z" fill="currentColor" />
      <path d="M30 78h48" stroke={M2} strokeWidth="0" />
    </>
  ),
  rainbow: (
    <>
      <path d="M6 82a44 44 0 0 1 88 0h-11a33 33 0 0 0-66 0z" fill="currentColor" />
      <path d="M17 82a33 33 0 0 1 66 0H72a22 22 0 0 0-44 0z" fill={M2} />
      <path d="M28 82a22 22 0 0 1 44 0H61a11 11 0 0 0-22 0z" fill="currentColor" opacity="0.7" />
    </>
  ),
  sun: (
    <>
      <circle cx="50" cy="50" r="24" fill="currentColor" />
      <path d="M50 4v14M50 82v14M4 50h14M82 50h14M17 17l10 10M73 73l10 10M83 17L73 27M27 73L17 83" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  crown: (
    <>
      <path d="M10 82V34l22 18 18-32 18 32 22-18v48z" fill="currentColor" />
      <circle cx="10" cy="30" r="6" fill={M2} /><circle cx="50" cy="16" r="6" fill={M2} /><circle cx="90" cy="30" r="6" fill={M2} />
      <path d="M18 72h64" stroke={M2} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  wand: (
    <>
      <path d="M14 86L66 34" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <path d="M72 6l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill={M2} />
      <path d="M22 60l4 4M36 44l4 4" stroke={M2} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  castle: (
    <>
      <rect x="10" y="50" width="80" height="44" fill="currentColor" />
      <rect x="10" y="30" width="18" height="24" fill="currentColor" /><rect x="72" y="30" width="18" height="24" fill="currentColor" /><rect x="40" y="18" width="20" height="36" fill="currentColor" />
      <path d="M10 30v-8h6v6h6v-6h6v8M72 30v-8h6v6h6v-6h6v8M40 18v-8h6v6h8v-6h6v8" fill="currentColor" />
      <path d="M50 8v-6l8 3-8 3" fill={M2} />
      <path d="M50 94V72a10 10 0 0 0-20 0v22h20z" fill={M2} />
      <rect x="16" y="60" width="8" height="10" fill={M2} /><rect x="76" y="60" width="8" height="10" fill={M2} /><rect x="46" y="30" width="8" height="10" fill={M2} />
    </>
  ),
  butterfly: (
    <>
      <path d="M50 50C36 26 8 18 10 40c2 14 24 14 40 10zM50 50C36 74 10 82 12 62c2-14 24-16 38-12zM50 50c14-24 42-32 40-10-2 14-24 14-40 10zM50 50c14 24 40 32 38 12-2-14-24-16-38-12z" fill="currentColor" />
      <ellipse cx="50" cy="52" rx="5" ry="18" fill={M2} />
      <path d="M46 34l-6-12M54 34l6-12" stroke={M2} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  unicorn: (
    <>
      <path d="M22 88c-6-24 4-44 22-52l14-4 10-16 8 20c8 6 12 16 12 28l-4 24H70l-2-16-14 4v12z" fill="currentColor" />
      <path d="M58 32l8-26 8 24z" fill={M2} />
      <path d="M46 40c-10 8-14 20-12 34M40 44c-8 6-10 16-8 26" stroke={M2} strokeWidth="5" strokeLinecap="round" />
      <circle cx="66" cy="44" r="4" fill={M2} />
    </>
  ),
  dino: (
    <>
      <path d="M8 74c6-22 22-38 46-38 8 0 14 2 20 6l14-6-6 12c4 6 6 12 6 18l-6 6h-8v10h-8V72c-6 2-12 2-18 0v10h-8v-8c-8-2-14-6-20-12L8 74z" fill="currentColor" />
      <path d="M32 40l6-14 6 12M46 34l6-14 6 12M60 34l6-12 6 12" fill={M2} />
      <circle cx="80" cy="46" r="3" fill={M2} />
      <path d="M22 60c6 4 12 6 18 6" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  dinoEgg: (
    <>
      <path d="M50 8c22 0 34 30 34 52a34 34 0 0 1-68 0C16 38 28 8 50 8z" fill="currentColor" />
      <ellipse cx="40" cy="44" rx="6" ry="8" fill={M2} /><ellipse cx="60" cy="60" rx="7" ry="9" fill={M2} /><ellipse cx="42" cy="72" rx="5" ry="6" fill={M2} />
      <path d="M30 30l6 6 6-8 6 8 6-8 6 8 6-6" fill="none" stroke={M2} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  footprint: (
    <>
      <path d="M50 92c-16 0-26-10-26-24 0-10 8-16 26-16s26 6 26 16c0 14-10 24-26 24z" fill="currentColor" />
      <ellipse cx="26" cy="36" rx="8" ry="12" fill="currentColor" /><ellipse cx="50" cy="26" rx="9" ry="14" fill="currentColor" /><ellipse cx="74" cy="36" rx="8" ry="12" fill="currentColor" />
    </>
  ),
  rocket: (
    <>
      <path d="M50 4c16 12 22 34 18 60H32C28 38 34 16 50 4z" fill="currentColor" />
      <circle cx="50" cy="40" r="9" fill={M2} />
      <path d="M32 50L16 70l16 2zM68 50l16 20-16 2z" fill="currentColor" />
      <path d="M40 66h20l-4 12h-12z" fill={M2} />
      <path d="M44 78c0 8 3 14 6 18 3-4 6-10 6-18z" fill={M2} opacity="0.9" />
    </>
  ),
  planet: (
    <>
      <circle cx="50" cy="50" r="28" fill="currentColor" />
      <path d="M8 58c14 14 62 12 84-8-4 14-30 24-52 22S10 66 8 58z" fill={M2} />
      <path d="M12 44c14-16 60-16 78 4" fill="none" stroke={M2} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <circle cx="40" cy="42" r="5" fill={M2} opacity="0.5" />
    </>
  ),
  ufo: (
    <>
      <ellipse cx="50" cy="60" rx="44" ry="16" fill="currentColor" />
      <path d="M28 52a22 22 0 0 1 44 0z" fill={M2} />
      <circle cx="26" cy="64" r="4" fill={M2} /><circle cx="50" cy="68" r="4" fill={M2} /><circle cx="74" cy="64" r="4" fill={M2} />
      <path d="M40 78l-6 14M60 78l6 14" stroke={M2} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  fish: (
    <>
      <path d="M8 50c14-20 34-28 56-20l24-16-8 36 8 36-24-16C42 78 22 70 8 50z" fill="currentColor" />
      <circle cx="30" cy="44" r="5" fill={M2} />
      <path d="M40 60c8 4 16 4 24 0" fill="none" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  shell: (
    <>
      <path d="M50 92L8 44a42 42 0 0 1 84 0z" fill="currentColor" />
      <path d="M50 92L26 40M50 92L40 32M50 92l10-60M50 92l24-52" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  tail: (
    <>
      <path d="M50 8c14 24 20 44 14 62l24 22H12l24-22C30 52 36 32 50 8z" fill="currentColor" />
      <path d="M36 40q14 8 28 0M34 56q16 8 32 0M40 24q10 6 20 0" fill="none" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  bubble: (
    <>
      <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.35" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M28 40a26 26 0 0 1 14-14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  floatRing: (
    <>
      <circle cx="50" cy="50" r="42" fill="currentColor" />
      <path d="M50 8a42 42 0 0 1 42 42H72A22 22 0 0 0 50 28zM50 92A42 42 0 0 1 8 50h20a22 22 0 0 0 22 22z" fill={M2} />
      <circle cx="50" cy="50" r="22" fill={M2} />
    </>
  ),
  wave: <path d="M0 60c10-14 20-14 30 0s20 14 30 0 20-14 30 0 10 8 10 8v32H0z" fill="currentColor" />,
  palm: (
    <>
      <path d="M50 92l4-46" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M52 44c-20-16-38-8-44 4 16-4 30 0 44 8zM52 44c-4-24 6-38 20-42-4 14-6 28-14 40zM52 44c22-14 40-4 44 10-16-8-30-8-44 0zM52 44c8-18 26-24 40-18-14 6-26 14-36 26z" fill="currentColor" />
      <circle cx="46" cy="52" r="5" fill={M2} /><circle cx="58" cy="54" r="5" fill={M2} />
    </>
  ),
  lion: (
    <>
      <circle cx="50" cy="52" r="42" fill="currentColor" />
      <circle cx="50" cy="54" r="26" fill={M2} />
      <circle cx="40" cy="48" r="3" fill="currentColor" /><circle cx="60" cy="48" r="3" fill="currentColor" />
      <path d="M46 60h8l-4 5zM50 65c-4 6-8 6-12 2M50 65c4 6 8 6 12 2" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="30" r="8" fill={M2} /><circle cx="74" cy="30" r="8" fill={M2} />
    </>
  ),
  giraffe: (
    <>
      <path d="M40 96V50l-4-24 8-14h12l8 14-4 24v46h-8V60h-4v36z" fill="currentColor" />
      <ellipse cx="50" cy="26" rx="18" ry="16" fill="currentColor" />
      <path d="M40 4v10M60 4v10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="40" cy="4" r="4" fill={M2} /><circle cx="60" cy="4" r="4" fill={M2} />
      <circle cx="44" cy="24" r="2.5" fill={M2} /><circle cx="56" cy="24" r="2.5" fill={M2} />
      <ellipse cx="50" cy="34" rx="8" ry="5" fill={M2} />
      <circle cx="46" cy="60" r="4" fill={M2} /><circle cx="54" cy="74" r="4" fill={M2} /><circle cx="46" cy="86" r="3" fill={M2} />
    </>
  ),
  monkey: (
    <>
      <circle cx="18" cy="46" r="12" fill="currentColor" /><circle cx="82" cy="46" r="12" fill="currentColor" />
      <circle cx="18" cy="46" r="6" fill={M2} /><circle cx="82" cy="46" r="6" fill={M2} />
      <circle cx="50" cy="50" r="34" fill="currentColor" />
      <path d="M50 76c-16 0-26-10-26-22a26 22 0 0 1 52 0c0 12-10 22-26 22z" fill={M2} />
      <circle cx="40" cy="48" r="3.5" fill="currentColor" /><circle cx="60" cy="48" r="3.5" fill="currentColor" />
      <path d="M40 64c6 6 14 6 20 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M12 88C10 40 40 12 90 10c2 50-28 78-78 78z" fill="currentColor" />
      <path d="M14 86L84 16" stroke={M2} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M30 70l16-4M40 58l18-4M52 46l16-4" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="50" cy="66" rx="24" ry="20" fill="currentColor" />
      <ellipse cx="22" cy="44" rx="9" ry="12" fill="currentColor" /><ellipse cx="40" cy="28" rx="9" ry="12" fill="currentColor" /><ellipse cx="60" cy="28" rx="9" ry="12" fill="currentColor" /><ellipse cx="78" cy="44" rx="9" ry="12" fill="currentColor" />
    </>
  ),
  dog: (
    <>
      <path d="M22 30c-12 6-16 26-8 40 6 8 14 6 18 0M78 30c12 6 16 26 8 40-6 8-14 6-18 0" fill="currentColor" />
      <ellipse cx="50" cy="52" rx="32" ry="30" fill="currentColor" />
      <ellipse cx="50" cy="62" rx="18" ry="14" fill={M2} />
      <circle cx="40" cy="44" r="4" fill={M2} /><circle cx="60" cy="44" r="4" fill={M2} />
      <ellipse cx="50" cy="58" rx="6" ry="4.5" fill="currentColor" />
      <path d="M50 62v6M44 70c3 3 9 3 12 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  cat: (
    <>
      <path d="M18 60V18l22 16h20l22-16v42z" fill="currentColor" />
      <ellipse cx="50" cy="60" rx="34" ry="30" fill="currentColor" />
      <path d="M22 26l14 12M78 26L64 38" stroke={M2} strokeWidth="0" />
      <circle cx="38" cy="54" r="4" fill={M2} /><circle cx="62" cy="54" r="4" fill={M2} />
      <path d="M46 66h8l-4 4z" fill={M2} />
      <path d="M50 70c-3 4-7 4-10 1M50 70c3 4 7 4 10 1M20 64l16-2M20 74l16 0M80 64l-16-2M80 74l-16 0" fill="none" stroke={M2} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  barn: (
    <>
      <path d="M12 92V46L50 12l38 34v46z" fill="currentColor" />
      <path d="M12 46L50 12l38 34" fill="none" stroke={M2} strokeWidth="6" strokeLinejoin="round" />
      <rect x="36" y="56" width="28" height="36" fill={M2} />
      <path d="M36 56l28 36M64 56L36 92" stroke="currentColor" strokeWidth="4" />
      <rect x="44" y="30" width="12" height="12" fill={M2} />
    </>
  ),
  tractor: (
    <>
      <path d="M8 62h14V38h26l10 20h30v18H8z" fill="currentColor" />
      <rect x="26" y="42" width="16" height="14" fill={M2} />
      <circle cx="26" cy="72" r="18" fill="currentColor" /><circle cx="26" cy="72" r="8" fill={M2} />
      <circle cx="74" cy="78" r="12" fill="currentColor" /><circle cx="74" cy="78" r="5" fill={M2} />
      <rect x="18" y="26" width="6" height="14" fill="currentColor" />
    </>
  ),
  cow: (
    <>
      <path d="M12 40c-6-10 0-24 10-22l10 8M88 40c6-10 0-24-10-22l-10 8" fill="currentColor" />
      <ellipse cx="50" cy="52" rx="34" ry="30" fill="currentColor" />
      <ellipse cx="50" cy="66" rx="20" ry="13" fill={M2} />
      <circle cx="42" cy="66" r="3" fill="currentColor" /><circle cx="58" cy="66" r="3" fill="currentColor" />
      <circle cx="38" cy="46" r="4" fill={M2} /><circle cx="62" cy="46" r="4" fill={M2} />
      <path d="M26 30c8-2 14 4 12 10s-12 4-12-10zM66 34c6-6 14-2 12 6s-12 4-12-6z" fill={M2} opacity="0.85" />
    </>
  ),
  pig: (
    <>
      <path d="M18 34l-6-16 18 6M82 34l6-16-18 6" fill="currentColor" />
      <circle cx="50" cy="54" r="34" fill="currentColor" />
      <ellipse cx="50" cy="62" rx="14" ry="10" fill={M2} />
      <circle cx="45" cy="62" r="3" fill="currentColor" /><circle cx="55" cy="62" r="3" fill="currentColor" />
      <circle cx="38" cy="46" r="4" fill={M2} /><circle cx="62" cy="46" r="4" fill={M2} />
    </>
  ),
  chick: (
    <>
      <circle cx="50" cy="60" r="32" fill="currentColor" />
      <circle cx="50" cy="30" r="20" fill="currentColor" />
      <circle cx="44" cy="28" r="3" fill={M2} /><circle cx="56" cy="28" r="3" fill={M2} />
      <path d="M46 36h8l-4 6z" fill={M2} />
      <path d="M22 66c-8-2-12 6-8 12M78 66c8-2 12 6 8 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 92l-4 6M60 92l4 6M50 92v6" stroke={M2} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  truck: (
    <>
      <path d="M6 40h30l8-14h30v14h20l0 26H6z" fill="currentColor" />
      <path d="M8 40h28V26H14z" fill={M2} opacity="0.35" />
      <rect x="44" y="30" width="26" height="10" fill={M2} />
      <circle cx="24" cy="70" r="12" fill="currentColor" /><circle cx="24" cy="70" r="5" fill={M2} />
      <circle cx="74" cy="70" r="12" fill="currentColor" /><circle cx="74" cy="70" r="5" fill={M2} />
      <path d="M46 44h44v14H46z" fill={M2} opacity="0.5" />
    </>
  ),
  raceCar: (
    <>
      <path d="M4 60h10l12-14h30l16-6h20l4 20H4z" fill="currentColor" />
      <path d="M32 50h22v-6H36z" fill={M2} />
      <path d="M78 40l-8 0v-8h10z" fill="currentColor" />
      <circle cx="26" cy="66" r="12" fill="#1b1b1f" /><circle cx="26" cy="66" r="5" fill={M2} />
      <circle cx="74" cy="66" r="12" fill="#1b1b1f" /><circle cx="74" cy="66" r="5" fill={M2} />
      <circle cx="58" cy="52" r="6" fill={M2} />
    </>
  ),
  cone: (
    <>
      <path d="M36 88L46 14h8l10 74z" fill="currentColor" />
      <path d="M40 66h20M43 46h14" stroke={M2} strokeWidth="8" />
      <rect x="18" y="86" width="64" height="8" rx="3" fill="currentColor" />
    </>
  ),
  flag: (
    <>
      <path d="M18 8v88" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M22 12h66v46H22z" fill={M2} />
      <path d="M22 12h11v11h11v-11h11v11h11v-11h11v11h11v11H77v11h11v12H77V46H66v11H55V46H44v11H33V46H22V35h11V23H22z" fill="currentColor" />
    </>
  ),
  trophy: (
    <>
      <path d="M26 10h48v22c0 16-10 26-24 26S26 48 26 32z" fill="currentColor" />
      <path d="M26 16H10c0 16 8 24 18 24M74 16h16c0 16-8 24-18 24" fill="none" stroke="currentColor" strokeWidth="6" />
      <rect x="44" y="58" width="12" height="16" fill="currentColor" />
      <rect x="28" y="74" width="44" height="14" rx="3" fill="currentColor" />
      <path d="M50 22l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill={M2} />
    </>
  ),
  soccer: (
    <>
      <circle cx="50" cy="50" r="42" fill={M2} stroke="currentColor" strokeWidth="4" />
      <path d="M50 30l16 12-6 18H40l-6-18z" fill="currentColor" />
      <path d="M50 30V12M66 42l16-6M60 60l10 14M40 60L30 74M34 42L18 36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  basketball: (
    <>
      <circle cx="50" cy="50" r="42" fill="currentColor" />
      <path d="M8 50h84M50 8v84M20 20c20 16 40 44 60 60M80 20C60 36 40 64 20 80" fill="none" stroke={M2} strokeWidth="4" />
    </>
  ),
  tennis: (
    <>
      <circle cx="50" cy="50" r="42" fill="currentColor" />
      <path d="M12 26c20 6 30 30 26 60M88 26c-20 6-30 30-26 60" fill="none" stroke={M2} strokeWidth="5" />
    </>
  ),
  medal: (
    <>
      <path d="M32 6h14l10 34H24zM54 6h14l10 34H62z" fill={M2} />
      <circle cx="50" cy="64" r="28" fill="currentColor" />
      <circle cx="50" cy="64" r="20" fill="none" stroke={M2} strokeWidth="3" />
      <path d="M50 50l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill={M2} />
    </>
  ),
  gamepad: (
    <>
      <path d="M22 30h56a20 20 0 0 1 20 20l-2 22a10 10 0 0 1-18 4l-8-10H30l-8 10a10 10 0 0 1-18-4L2 50a20 20 0 0 1 20-20z" fill="currentColor" />
      <path d="M26 42v20M16 52h20" stroke={M2} strokeWidth="6" strokeLinecap="round" />
      <circle cx="70" cy="46" r="4.5" fill={M2} /><circle cx="80" cy="54" r="4.5" fill={M2} /><circle cx="60" cy="54" r="4.5" fill={M2} /><circle cx="70" cy="62" r="4.5" fill={M2} />
    </>
  ),
  pixelHeart: (
    <path d="M14 20h20v10h10V20h10v10h10V20h20v20H74v10H64v10H54v10H44V60H34V50H24V40H14z M14 30h10v10H14zM74 30h12v10H74z" fill="currentColor" />
  ),
  shuriken: (
    <>
      <path d="M50 4l12 34 34 12-34 12-12 34-12-34L4 50l34-12z" fill="currentColor" />
      <circle cx="50" cy="50" r="8" fill={M2} />
    </>
  ),
  ninja: (
    <>
      <circle cx="50" cy="52" r="38" fill="currentColor" />
      <path d="M14 46h72v14H14z" fill={M2} />
      <circle cx="38" cy="53" r="4" fill="currentColor" /><circle cx="62" cy="53" r="4" fill="currentColor" />
      <path d="M84 40l12-10-6 22M84 62l14 4-10 8" fill="none" stroke={M2} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  mask: (
    <>
      <path d="M4 40c14-10 30-12 46-6 16-6 32-4 46 6-2 22-14 34-30 34-8 0-12-4-16-8-4 4-8 8-16 8C18 74 6 62 4 40z" fill="currentColor" />
      <ellipse cx="32" cy="50" rx="10" ry="8" fill={M2} /><ellipse cx="68" cy="50" rx="10" ry="8" fill={M2} />
    </>
  ),
  bolt: <path d="M58 4L14 56h26l-8 40 46-56H50z" fill="currentColor" />,
  burst: (
    <>
      <path d="M50 4l10 18 18-10-4 20 20 4-14 14 14 14-20 4 4 20-18-10-10 18-10-18-18 10 4-20-20-4 14-14L6 32l20-4-4-20 18 10z" fill="currentColor" />
      <path d="M50 22l7 12 12-6-3 13 13 3-9 9 9 9-13 3 3 13-12-6-7 12-7-12-12 6 3-13-13-3 9-9-9-9 13-3-3-13 12 6z" fill={M2} />
    </>
  ),
  popcorn: (
    <>
      <path d="M22 44h56l-6 50H28z" fill="currentColor" />
      <path d="M34 48l4 42M50 48v42M66 48l-4 42" stroke={M2} strokeWidth="6" />
      <circle cx="32" cy="36" r="10" fill={M2} /><circle cx="50" cy="26" r="12" fill={M2} /><circle cx="68" cy="36" r="10" fill={M2} /><circle cx="42" cy="40" r="8" fill={M2} /><circle cx="60" cy="42" r="8" fill={M2} />
    </>
  ),
  clapboard: (
    <>
      <path d="M8 40h84v50H8z" fill="currentColor" />
      <path d="M12 38l4-22 78 6-4 22z" fill="currentColor" />
      <path d="M22 20l8 18M40 22l8 18M58 24l8 18M76 26l8 18" stroke={M2} strokeWidth="6" />
      <path d="M8 46h84" stroke={M2} strokeWidth="3" />
      <circle cx="30" cy="66" r="6" fill={M2} /><rect x="44" y="62" width="34" height="8" rx="4" fill={M2} />
    </>
  ),
  ticket: (
    <>
      <path d="M8 30h84v14a6 6 0 0 0 0 12v14H8V56a6 6 0 0 0 0-12z" fill="currentColor" />
      <path d="M30 34v32" stroke={M2} strokeWidth="3" strokeDasharray="4 4" />
      <path d="M40 44h40M40 54h30" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  note: (
    <>
      <ellipse cx="30" cy="76" rx="16" ry="12" fill="currentColor" transform="rotate(-20 30 76)" />
      <path d="M42 74V12l40-8v18L50 28" fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
      <ellipse cx="72" cy="60" rx="14" ry="10" fill="currentColor" transform="rotate(-20 72 60)" />
      <path d="M82 58V6" stroke="currentColor" strokeWidth="9" />
    </>
  ),
  headphones: (
    <>
      <path d="M14 66V50a36 36 0 0 1 72 0v16" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <rect x="6" y="56" width="22" height="34" rx="8" fill="currentColor" /><rect x="72" y="56" width="22" height="34" rx="8" fill="currentColor" />
      <rect x="12" y="62" width="10" height="22" rx="4" fill={M2} /><rect x="78" y="62" width="10" height="22" rx="4" fill={M2} />
    </>
  ),
  disco: (
    <>
      <path d="M50 4v10" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="54" r="40" fill="currentColor" />
      <path d="M10 54h80M50 14v80M18 34h64M18 74h64M30 20v68M70 20v68" stroke={M2} strokeWidth="3" opacity="0.8" />
      <circle cx="36" cy="40" r="6" fill={M2} opacity="0.7" />
    </>
  ),
  ribbon: (
    <>
      <path d="M8 24c20-14 30 26 50 12s28-20 34-2c-16-6-24 22-44 20S16 46 8 24z" fill="currentColor" />
      <path d="M8 24c22 26 34 4 46 20s24 22 38 6c-8 26-30 20-40 6S24 60 8 24z" fill="currentColor" opacity="0.7" />
      <path d="M8 24l6-16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  jumper: (
    <>
      <circle cx="50" cy="16" r="10" fill="currentColor" />
      <path d="M50 28v30M50 40L22 18M50 40l28-22M50 58L28 90M50 58l22 32" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  brush: (
    <>
      <path d="M62 8l30 30-40 40-30-30z" fill={M2} stroke="currentColor" strokeWidth="0" />
      <path d="M62 8l30 30-14 14L48 22z" fill="currentColor" />
      <path d="M22 48l30 30-14 10c-8 6-20 6-28 0-8-8-6-18 2-26z" fill="currentColor" />
      <path d="M8 90c8-2 12-6 14-14" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  splat: (
    <path d="M50 6c8 0 10 14 16 16s16-10 22-4-6 16-2 24 18 6 16 16-16 4-20 12 6 20-2 24-14-8-22-6-10 16-18 12-2-18-10-22-20 2-22-8 12-12 12-20S6 34 12 28s16 8 24 6S42 6 50 6z" fill="currentColor" />
  ),
  palette: (
    <>
      <path d="M50 8C24 8 6 26 6 48c0 20 14 34 30 34 8 0 10-6 8-12s0-10 8-10h10c16 0 32-10 32-26C94 20 74 8 50 8z" fill="currentColor" />
      <circle cx="30" cy="42" r="7" fill={M2} /><circle cx="46" cy="28" r="7" fill={M2} /><circle cx="66" cy="28" r="7" fill={M2} /><circle cx="78" cy="44" r="7" fill={M2} /><circle cx="26" cy="62" r="6" fill={M2} />
    </>
  ),
  crayon: (
    <>
      <path d="M20 40h60v40H20z" fill="currentColor" transform="rotate(-45 50 60)" />
      <path d="M50 8L36 30h28z" fill="currentColor" transform="rotate(-45 50 60)" />
      <path d="M50 8l-4 8h8z" fill={M2} transform="rotate(-45 50 60)" />
      <path d="M32 46h36" stroke={M2} strokeWidth="6" transform="rotate(-45 50 60)" />
    </>
  ),
  topHat: (
    <>
      <ellipse cx="50" cy="78" rx="46" ry="12" fill="currentColor" />
      <rect x="22" y="14" width="56" height="64" rx="4" fill="currentColor" />
      <rect x="22" y="58" width="56" height="10" fill={M2} />
    </>
  ),
  playingCard: (
    <>
      <rect x="20" y="8" width="60" height="84" rx="8" fill="currentColor" />
      <path d="M50 66C38 56 32 50 32 42a9 9 0 0 1 18-4 9 9 0 0 1 18 4c0 8-6 14-18 24z" fill={M2} />
      <path d="M26 14h6v10M74 86h-6v-10" stroke={M2} strokeWidth="3" />
    </>
  ),
  rabbit: (
    <>
      <path d="M32 44c-10-30-4-40 4-40s10 20 8 40M68 44c10-30 4-40-4-40s-10 20-8 40" fill="currentColor" />
      <path d="M36 40c-4-22-2-30 2-30s6 14 6 30M64 40c4-22 2-30-2-30s-6 14-6 30" fill={M2} opacity="0.7" />
      <ellipse cx="50" cy="66" rx="30" ry="28" fill="currentColor" />
      <circle cx="40" cy="60" r="4" fill={M2} /><circle cx="60" cy="60" r="4" fill={M2} />
      <path d="M46 72h8l-4 4z" fill={M2} />
      <path d="M50 76c-3 4-7 5-10 2M50 76c3 4 7 5 10 2" fill="none" stroke={M2} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  pillow: (
    <>
      <path d="M12 22c26 6 50 6 76 0-6 20-6 36 0 56-26-6-50-6-76 0 6-20 6-36 0-56z" fill="currentColor" />
      <path d="M22 30c18 4 38 4 56 0M22 70c18-4 38-4 56 0" fill="none" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  zzz: (
    <path d="M10 60h20L10 84h22M40 36h18L40 56h20M64 10h26L64 34h28" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  tent: (
    <>
      <path d="M50 12L4 90h92z" fill="currentColor" />
      <path d="M50 12L28 90h44z" fill={M2} />
      <path d="M50 12L38 90h24z" fill="currentColor" opacity="0.6" />
      <path d="M50 12l-6-8M50 12l6-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  camera: (
    <>
      <path d="M8 34h22l6-10h28l6 10h22v50H8z" fill="currentColor" />
      <circle cx="50" cy="58" r="17" fill={M2} /><circle cx="50" cy="58" r="10" fill="currentColor" />
      <circle cx="78" cy="44" r="4" fill={M2} />
    </>
  ),
  smiley: (
    <>
      <circle cx="50" cy="50" r="42" fill="currentColor" />
      <circle cx="36" cy="42" r="5" fill={M2} /><circle cx="64" cy="42" r="5" fill={M2} />
      <path d="M30 60c8 12 32 12 40 0" fill="none" stroke={M2} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  cherry: (
    <>
      <path d="M36 62C36 40 46 20 66 8M64 62c-2-24 2-40 2-54" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M66 8c10 0 20 6 26 16-10 2-20 0-26-16z" fill={M2} />
      <circle cx="34" cy="72" r="18" fill="currentColor" /><circle cx="66" cy="72" r="18" fill="currentColor" />
      <circle cx="28" cy="66" r="4" fill={M2} opacity="0.6" /><circle cx="60" cy="66" r="4" fill={M2} opacity="0.6" />
    </>
  ),
  flower: (
    <>
      <ellipse cx="50" cy="20" rx="14" ry="20" fill="currentColor" /><ellipse cx="50" cy="80" rx="14" ry="20" fill="currentColor" />
      <ellipse cx="20" cy="50" rx="20" ry="14" fill="currentColor" /><ellipse cx="80" cy="50" rx="20" ry="14" fill="currentColor" />
      <ellipse cx="29" cy="29" rx="14" ry="20" fill="currentColor" transform="rotate(-45 29 29)" /><ellipse cx="71" cy="71" rx="14" ry="20" fill="currentColor" transform="rotate(-45 71 71)" />
      <ellipse cx="71" cy="29" rx="14" ry="20" fill="currentColor" transform="rotate(45 71 29)" /><ellipse cx="29" cy="71" rx="14" ry="20" fill="currentColor" transform="rotate(45 29 71)" />
      <circle cx="50" cy="50" r="15" fill={M2} />
    </>
  ),
  mushroom: (
    <>
      <path d="M6 50C6 26 26 8 50 8s44 18 44 42z" fill="currentColor" />
      <rect x="34" y="50" width="32" height="42" rx="10" fill={M2} />
      <circle cx="30" cy="30" r="7" fill={M2} /><circle cx="54" cy="20" r="6" fill={M2} /><circle cx="70" cy="36" r="6" fill={M2} />
    </>
  ),
  bee: (
    <>
      <ellipse cx="34" cy="26" rx="18" ry="10" fill={M2} opacity="0.7" transform="rotate(-25 34 26)" /><ellipse cx="66" cy="26" rx="18" ry="10" fill={M2} opacity="0.7" transform="rotate(25 66 26)" />
      <ellipse cx="50" cy="58" rx="32" ry="24" fill="currentColor" />
      <path d="M36 36v44M50 34v48M64 36v44" stroke="var(--m3, #1c1a17)" strokeWidth="6" />
      <circle cx="26" cy="52" r="3" fill="var(--m3, #1c1a17)" />
      <path d="M82 58l10-4" stroke="var(--m3, #1c1a17)" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  beachBall: (
    <>
      <circle cx="50" cy="50" r="42" fill={M2} />
      <path d="M50 8a42 42 0 0 1 36 21L50 50zM86 71A42 42 0 0 1 50 92V50zM14 71A42 42 0 0 1 14 29L50 50z" fill="currentColor" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </>
  ),
  sunglasses: (
    <>
      <path d="M4 40h92" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 40h34v10a17 17 0 0 1-34 0zM58 40h34v10a17 17 0 0 1-34 0z" fill="currentColor" />
      <path d="M42 46h16" stroke="currentColor" strokeWidth="5" />
      <path d="M14 46l10-2M64 46l10-2" stroke={M2} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  bunting: (
    <>
      <path d="M0 20q50 30 100 0" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M8 26l6 22 8-18zM30 36l6 22 8-18zM56 36l6 22 8-18zM78 26l6 22 8-18z" fill="currentColor" />
      <path d="M30 36l6 22 8-18z" fill={M2} />
    </>
  ),
  streamer: <path d="M0 50c10-24 20-24 30 0s20 24 30 0 20-24 30 0 10 12 10 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />,
  bone: (
    <>
      <path d="M22 34h56v32H22z" fill="currentColor" />
      <circle cx="22" cy="34" r="12" fill="currentColor" /><circle cx="22" cy="66" r="12" fill="currentColor" /><circle cx="78" cy="34" r="12" fill="currentColor" /><circle cx="78" cy="66" r="12" fill="currentColor" />
    </>
  ),
  bamboo: (
    <>
      <rect x="40" y="2" width="20" height="96" rx="6" fill="currentColor" />
      <path d="M38 30h24M38 58h24M38 84h24" stroke={M2} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 40c14-6 22-2 30 6-12 2-20 2-30-6zM40 66c-14-6-22-2-30 6 12 2 20 2 30-6z" fill="currentColor" />
    </>
  ),
  monster: (
    <>
      <path d="M50 10c26 0 40 18 40 40s-8 40-40 40S10 72 10 50s14-40 40-40z" fill="currentColor" />
      <path d="M22 18l8 14M78 18l-8 14M50 6v10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="36" cy="44" r="9" fill={M2} /><circle cx="64" cy="44" r="9" fill={M2} />
      <circle cx="38" cy="45" r="4" fill="var(--m3, #1c1a17)" /><circle cx="62" cy="45" r="4" fill="var(--m3, #1c1a17)" />
      <path d="M28 64c14 12 30 12 44 0-2 14-8 22-22 22S30 78 28 64z" fill={M2} />
      <path d="M36 66l4 8 4-8M56 66l4 8 4-8" fill="currentColor" />
    </>
  ),
  cocoa: (
    <>
      <path d="M18 34h56v30a18 18 0 0 1-18 18H36a18 18 0 0 1-18-18z" fill="currentColor" />
      <path d="M74 40h8a10 10 0 0 1 0 20h-8" fill="none" stroke="currentColor" strokeWidth="6" />
      <ellipse cx="46" cy="34" rx="28" ry="6" fill={M2} />
      <path d="M34 26c-4-6 4-8 0-14M46 24c-4-6 4-8 0-14M58 26c-4-6 4-8 0-14" fill="none" stroke={M2} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  kite: (
    <>
      <path d="M50 4l36 36-36 40L14 40z" fill="currentColor" />
      <path d="M50 4v76M14 40h72" stroke={M2} strokeWidth="3" />
      <path d="M50 80c-6 6 6 8 0 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 88l-6 4M54 92l6 4" stroke={M2} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  drum: (
    <>
      <ellipse cx="50" cy="66" rx="40" ry="14" fill="currentColor" />
      <path d="M10 36v30h80V36z" fill="currentColor" />
      <ellipse cx="50" cy="36" rx="40" ry="14" fill={M2} />
      <path d="M18 40l14 24M50 46v20M82 40L68 64" stroke={M2} strokeWidth="3" opacity="0.7" />
      <path d="M30 26l30-16M70 26L40 10" stroke={M2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  guitar: (
    <>
      <path d="M62 8l14 14" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <path d="M58 30l12 12" stroke="currentColor" strokeWidth="6" />
      <path d="M62 44C50 32 30 44 30 56c-10 6-16 18-8 30s24 8 30-2c14 2 22-14 10-26z" fill="currentColor" />
      <circle cx="46" cy="64" r="8" fill={M2} />
      <path d="M40 74l22-22" stroke={M2} strokeWidth="2" opacity="0.7" />
    </>
  ),
  hoop: (
    <>
      <ellipse cx="50" cy="60" rx="46" ry="14" fill="currentColor" />
      <ellipse cx="50" cy="56" rx="38" ry="9" fill={M2} />
      <path d="M12 68v22M88 68v22M30 72v18M70 72v18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  beam: (
    <>
      <rect x="4" y="40" width="92" height="14" rx="4" fill="currentColor" />
      <path d="M20 54v36M80 54v36" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M8 44h84" stroke={M2} strokeWidth="3" opacity="0.7" />
    </>
  ),
  controllerPixel: (
    <path d="M10 30h80v10h10v30H90v10H10V70H0V40h10zM20 44v6h-6v8h6v6h8v-6h6v-8h-6v-6zM62 44v8h8v-8zM74 52v8h8v-8zM62 60v8h8v-8zM50 52v8h8v-8z" fill="currentColor" fillRule="evenodd" />
  ),
};

/** The sprite — mount once per page; every KidsCardFace on the page draws
 *  from it with <use>. Zero-sized and hidden from AT. */
export default function MotifSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true" focusable="false">
      <defs>
        {(Object.keys(MOTIFS) as MotifId[]).map((k) => (
          <symbol key={k} id={`m-${k}`} viewBox="0 0 100 100" overflow="visible">
            {MOTIFS[k]}
          </symbol>
        ))}
      </defs>
    </svg>
  );
}
