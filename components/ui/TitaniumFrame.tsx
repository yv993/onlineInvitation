import { useId } from "react";

/** The NATURAL TITANIUM frame (client's 2026-08-31 generator, ported draw
 *  call by draw call from its canvas to SVG): side rail with the six-stop
 *  titanium gradient, power button, mmWave cutout, antenna seams, USB-C
 *  port and speaker drills, polished chamfer, black display border with the
 *  SCREEN CUT OUT (a mask, where the canvas used destination-out), the
 *  Dynamic Island with selfie lens and proximity sensor, and one diagonal
 *  sheet of glass glare OVER the hole. Vector instead of the generator's
 *  PNG: crisp at any scale, ~3KB, and no asset pipeline.
 *  Coordinates are the generator's own, centred on 0,0. */
export default function TitaniumFrame({ tone = "titanium" }: { tone?: "titanium" | "gold" }) {
  const gold = tone === "gold";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rail = `rail-${uid}`, chamfer = `chamfer-${uid}`, btn = `btn-${uid}`, glare = `glare-${uid}`, hole = `hole-${uid}`, filigree = `fil-${uid}`;
  return (
    <svg className="kn-tif" viewBox="-400 -880 800 1770" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={rail} gradientUnits="userSpaceOnUse" x1="-360" y1="-850" x2="420" y2="920">
          {gold ? (
            <>
              <stop offset="0" stopColor="#F7E9C2" /><stop offset="0.2" stopColor="#DCBA72" />
              <stop offset="0.45" stopColor="#9C7534" /><stop offset="0.7" stopColor="#F0DAA6" />
              <stop offset="0.85" stopColor="#B8913F" /><stop offset="1" stopColor="#7A5A24" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#dad4c8" /><stop offset="0.2" stopColor="#b8b0a0" />
              <stop offset="0.45" stopColor="#736b5c" /><stop offset="0.7" stopColor="#cfc8ba" />
              <stop offset="0.85" stopColor="#918776" /><stop offset="1" stopColor="#595143" />
            </>
          )}
        </linearGradient>
        {/* the engraving: one scroll motif, tiled the length of the rail.
            It is painted over the whole chassis and then covered in the
            middle by the display border, so only the metal carries it. */}
        {gold && (
          <pattern id={filigree} width="26" height="26" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#5E4518" strokeWidth="4.6" strokeLinecap="round" opacity="0.85">
              <path d="M3 13 C 3 5, 12 5, 12 13 C 12 20, 6 20, 6 14" />
              <path d="M23 13 C 23 21, 14 21, 14 13 C 14 6, 20 6, 20 12" />
            </g>
            <g fill="#5E4518" opacity="0.7">
              <path d="M13 1 c 2 2.5 2 5 0 7 c -2 -2 -2 -4.5 0 -7 z" />
              <path d="M13 25 c 2 -2.5 2 -5 0 -7 c -2 2 -2 4.5 0 7 z" />
            </g>
          </pattern>
        )}
        <linearGradient id={chamfer} gradientUnits="userSpaceOnUse" x1="-350" y1="-840" x2="350" y2="840">
          {gold ? (
            <>
              <stop offset="0" stopColor="#FFF6DF" /><stop offset="0.3" stopColor="#EFD9A4" />
              <stop offset="0.7" stopColor="#B08D4A" /><stop offset="1" stopColor="#6E5322" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#ded7cb" />
              <stop offset="0.7" stopColor="#857b6b" /><stop offset="1" stopColor="#4a4337" />
            </>
          )}
        </linearGradient>
        <linearGradient id={btn} gradientUnits="userSpaceOnUse" x1="370" y1="-350" x2="395" y2="-150">
          <stop offset="0" stopColor={gold ? "#F0DCA8" : "#c7beaf"} />
          <stop offset="1" stopColor={gold ? "#8A6A2C" : "#665d4f"} />
        </linearGradient>
        <linearGradient id={glare} gradientUnits="userSpaceOnUse" x1="-300" y1="-800" x2="300" y2="800">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" /><stop offset="0.18" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" /><stop offset="0.7" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.06" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* the cutout — the canvas generator's destination-out erased EVERY
            layer under the screen, rail included, so the mask wraps the whole
            chassis: white everywhere (buttons and port live outside the
            border, they must survive), black only at the screen hole */}
        <mask id={hole}>
          <rect x="-460" y="-960" width="920" height="1920" fill="#fff" />
          <rect x="-324" y="-814" width="648" height="1628" rx="76" fill="#000" />
        </mask>
      </defs>

      <g mask={`url(#${hole})`}>
        {/* 1 · the titanium chassis — its depth (the stacked extrusion and
            the soft ground shadows) lives on .kn-open__phBody in CSS, whose
            box matches this rect exactly */}
        <rect x="-370" y="-860" width="740" height="1720" rx="105" fill={`url(#${rail})`} />
        {gold && <rect x="-370" y="-860" width="740" height="1720" rx="105" fill={`url(#${filigree})`} />}

        {/* 2 · hardware on the rail */}
        <rect x="368" y="-360" width="24" height="210" rx="8" fill={`url(#${btn})`} />
        <rect x="368" y="50" width="16" height="260" rx="6" fill={gold ? "#8A6A2C" : "#61584b"} />
        <rect x="368" y="-600" width="24" height="6" fill={gold ? "#F6E7BE" : "#dfd8ce"} />
        <rect x="368" y="650" width="24" height="6" fill={gold ? "#F6E7BE" : "#dfd8ce"} />
        <rect x="-200" y="856" width="6" height="24" fill={gold ? "#F6E7BE" : "#dfd8ce"} />
        <rect x="-45" y="852" width="90" height="22" rx="10" fill="#1c1b18" />
        {[-140, -118, -96, -74].map((x) => <circle key={x} cx={x} cy="863" r="6" fill="#1c1b18" />)}
        {[70, 92, 114, 136, 158].map((x) => <circle key={x} cx={x} cy="863" r="6" fill="#1c1b18" />)}

        {/* 3 · polished chamfer + display border, the screen cut out */}
        <rect x="-352" y="-842" width="704" height="1684" rx="94" fill="none" stroke={`url(#${chamfer})`} strokeWidth="4" />
        <rect x="-350" y="-840" width="700" height="1680" rx="92" fill="#08080a" />
      </g>

      {/* 5 · the Dynamic Island, over the hole */}
      <rect x="-105" y="-780" width="210" height="56" rx="28" fill="#000" />
      <circle cx="62" cy="-752" r="12" fill="#0a121c" stroke="#1b2c40" strokeWidth="2" />
      <circle cx="64" cy="-754" r="4" fill="#3b82f6" />
      <circle cx="-40" cy="-752" r="7" fill="#11100e" />

      {/* 6 · the glass — one diagonal sheet of light over the open screen */}
      <rect x="-324" y="-814" width="648" height="1628" rx="76" fill={`url(#${glare})`} />
    </svg>
  );
}
