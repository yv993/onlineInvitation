import { useId } from "react";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { kidsDateLine, kidsWords, type KidsCard, type Placed, type Slot, type Variant } from "@/lib/kids";

// ============================================================================
// THE CARD FACE — one renderer for every kids' design.
//
// An SVG in card units (300×420 portrait, 420×300 landscape, 320×320 square)
// so the same face is the catalogue tile at 220px, the studio's live card at
// 460px and the guest's phone-wide invitation — type, motifs and photo scale
// together. The words are HTML in a <foreignObject> (real wrapping, real
// fonts, both alphabets); everything else is vector.
//
// Nothing here fetches: motifs come from the page's MotifSprite by <use>,
// photos are an <image> the caller hands in (an object URL in the studio,
// /api/photo/<id> on a generated link).
// ============================================================================

export type KidsFaceProps = {
  card: KidsCard;
  variant: Variant;
  lang: Lang;
  name?: string;
  age?: number;
  second?: { name: string; age?: number };
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  venue?: string;
  address?: string;
  city?: string;
  note?: string;
  host?: string;
  rsvpBy?: string;
  photo?: string;
  className?: string;
  /** the tile hides the fine print; the studio and the guest link show it */
  details?: boolean;
  /** hide the sample date/place on the tile when the design has none */
  sample?: boolean;
};

const DIM: Record<KidsCard["shape"], [number, number]> = {
  portrait: [300, 420], landscape: [420, 300], square: [320, 320], scallop: [320, 320], wave: [300, 420], arch: [300, 420], ticket: [300, 420],
};

const slot = (v: Variant, s: Slot | undefined, d: Slot): string => v[s ?? d];

function shapePath(shape: KidsCard["shape"], W: number, H: number): string {
  switch (shape) {
    case "scallop": {
      // a square with 12 scallops a side
      const n = 12, r = W / (n * 2);
      let d = `M${r} 0`;
      for (let i = 0; i < n; i++) d += ` a${r} ${r} 0 0 1 ${r * 2} 0`;
      for (let i = 0; i < n; i++) d += ` a${r} ${r} 0 0 1 0 ${r * 2}`;
      for (let i = 0; i < n; i++) d += ` a${r} ${r} 0 0 1 ${-r * 2} 0`;
      for (let i = 0; i < n; i++) d += ` a${r} ${r} 0 0 1 0 ${-r * 2}`;
      return d + " Z";
    }
    case "wave": {
      let d = `M0 12`;
      for (let x = 0; x < W; x += 30) d += ` q15 -12 30 0`;
      d += ` L${W} ${H - 12}`;
      for (let x = W; x > 0; x -= 30) d += ` q-15 12 -30 0`;
      return d + " Z";
    }
    case "arch":
      return `M0 ${H} V${W / 2} A${W / 2} ${W / 2} 0 0 1 ${W} ${W / 2} V${H} Z`;
    case "ticket": {
      const r = 14, y1 = 96, y2 = H - 96;
      return `M0 0 H${W} V${y1 - r} a${r} ${r} 0 0 0 0 ${r * 2} V${y2 - r} a${r} ${r} 0 0 0 0 ${r * 2} V${H} H0 V${y2 + r} a${r} ${r} 0 0 0 0 ${-r * 2} V${y1 + r} a${r} ${r} 0 0 0 0 ${-r * 2} Z`;
    }
    default:
      return `M0 0 H${W} V${H} H0 Z`;
  }
}

function Pattern({ id, kind, color, paper, W, H }: { id: string; kind: KidsCard["pattern"]; color: string; paper: string; W: number; H: number }) {
  switch (kind) {
    case "dots":
      return <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="3.2" fill={color} /></pattern>;
    case "grid":
      return <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke={color} strokeWidth="1" /></pattern>;
    case "stripes":
      return <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="16" fill={color} /></pattern>;
    case "diagonal":
      return <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="16" fill={color} /></pattern>;
    case "scales":
      return (
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 14a14 14 0 0 1 28 0" fill="none" stroke={color} strokeWidth="2" />
          <path d="M-14 28a14 14 0 0 1 28 0M14 28a14 14 0 0 1 28 0" fill="none" stroke={color} strokeWidth="2" />
        </pattern>
      );
    case "checker":
      return <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill={color} /><rect x="10" y="10" width="10" height="10" fill={color} /></pattern>;
    case "halftone":
      return <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.6" fill={color} /></pattern>;
    case "tiles":
      return <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse"><rect x="1.5" y="1.5" width="21" height="21" rx="2" fill={color} /></pattern>;
    case "stars":
      return (
        <pattern id={id} width="70" height="70" patternUnits="userSpaceOnUse">
          {[[10, 12, 3], [42, 8, 2], [60, 30, 2.5], [24, 44, 2], [52, 58, 3], [8, 62, 2]].map(([x, y, r], i) => (
            <path key={i} d={`M${x} ${y - r * 2}l${r * 0.6} ${r * 1.4}h${r * 1.5}l${-r * 1.2} ${r}l${r * 0.5} ${r * 1.5}l${-r * 1.4} ${-r}l${-r * 1.4} ${r}l${r * 0.5} ${-r * 1.5}l${-r * 1.2} ${-r}h${r * 1.5}z`} fill={color} />
          ))}
        </pattern>
      );
    case "pixels":
      return (
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          {[[0, 0], [16, 8], [40, 8], [8, 24], [32, 24], [24, 40], [0, 40]].map(([x, y], i) => <rect key={i} x={x} y={y} width="8" height="8" fill={color} />)}
        </pattern>
      );
    case "confetti":
      return (
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="10" r="3" fill={color} /><rect x="30" y="6" width="6" height="6" fill={color} transform="rotate(20 33 9)" /><path d="M46 30l4 7h-8z" fill={color} />
          <circle cx="20" cy="40" r="2.5" fill={color} /><rect x="40" y="48" width="7" height="3" fill={color} transform="rotate(-30 43 49)" />
        </pattern>
      );
    case "zigzag":
      return <pattern id={id} width="20" height="12" patternUnits="userSpaceOnUse"><path d="M0 9l5-6 5 6 5-6 5 6" fill="none" stroke={color} strokeWidth="2" /></pattern>;
    case "hearts":
      return <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M12 20c-5-4-7-6-7-9a3.5 3.5 0 0 1 7-1.6A3.5 3.5 0 0 1 19 11c0 3-2 5-7 9z" fill={color} /><path d="M28 34c-4-3-6-5-6-7a3 3 0 0 1 6-1.4A3 3 0 0 1 34 27c0 2-2 4-6 7z" fill={color} /></pattern>;
    case "waves":
      return <pattern id={id} width="40" height="16" patternUnits="userSpaceOnUse"><path d="M0 8q10-8 20 0t20 0" fill="none" stroke={color} strokeWidth="2" /></pattern>;
    case "tieDye":
      return (
        <radialGradient id={id} cx="50%" cy="46%" r="70%">
          <stop offset="0" stopColor={paper} /><stop offset="0.18" stopColor={color} /><stop offset="0.34" stopColor={paper} />
          <stop offset="0.5" stopColor={color} stopOpacity="0.85" /><stop offset="0.66" stopColor={paper} /><stop offset="0.84" stopColor={color} /><stop offset="1" stopColor={paper} />
        </radialGradient>
      );
    default:
      void W; void H;
      return null;
  }
}

function Border({ kind, v, W, H, uid }: { kind: KidsCard["border"]; v: Variant; W: number; H: number; uid: string }) {
  switch (kind) {
    case "stripesTop":
      return (
        <>
          <defs><pattern id={`${uid}-st`} width="14" height="14" patternUnits="userSpaceOnUse"><rect width="7" height="14" fill={v.a} /><rect x="7" width="7" height="14" fill={v.b} /></pattern></defs>
          <rect width={W} height="16" fill={`url(#${uid}-st)`} />
        </>
      );
    case "checkerBand":
      return (
        <>
          <defs><pattern id={`${uid}-ck`} width="22" height="22" patternUnits="userSpaceOnUse"><rect width="11" height="11" fill={v.ink} /><rect x="11" y="11" width="11" height="11" fill={v.ink} /></pattern></defs>
          <rect width={W} height="22" fill={`url(#${uid}-ck)`} /><rect y={H - 22} width={W} height="22" fill={`url(#${uid}-ck)`} />
        </>
      );
    case "hazard":
      return (
        <>
          <defs><pattern id={`${uid}-hz`} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="24" fill={v.ink} /></pattern></defs>
          <rect width={W} height="20" fill={`url(#${uid}-hz)`} /><rect y={H - 20} width={W} height="20" fill={`url(#${uid}-hz)`} />
        </>
      );
    case "tileFrame":
      return (
        <>
          <defs><pattern id={`${uid}-tf`} width="16" height="16" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="14" height="14" rx="1.5" fill={v.c} /></pattern></defs>
          <path d={`M0 0H${W}V${H}H0Z M16 16H${W - 16}V${H - 16}H16Z`} fill={`url(#${uid}-tf)`} fillRule="evenodd" />
        </>
      );
    case "leafFrame":
      return (
        <g style={{ color: v.c }}>
          {[[18, 18, 200], [W - 18, 18, 290], [18, H - 18, 110], [W - 18, H - 18, 20]].map(([x, y, r], i) => (
            <use key={i} href="#m-leaf" x={x - 30} y={y - 30} width="60" height="60" transform={`rotate(${r} ${x} ${y})`} opacity="0.9" />
          ))}
        </g>
      );
    case "confettiFrame":
      return (
        <g>
          {Array.from({ length: 28 }).map((_, i) => {
            const t = i / 28, per = 2 * (W + H), d = t * per;
            let x = 0, y = 0;
            if (d < W) { x = d; y = 8; } else if (d < W + H) { x = W - 8; y = d - W; } else if (d < 2 * W + H) { x = W - (d - W - H); y = H - 8; } else { x = 8; y = H - (d - 2 * W - H); }
            const c = [v.a, v.b, v.c, v.d][i % 4];
            return i % 3 === 0 ? <circle key={i} cx={x} cy={y} r="3.2" fill={c} /> : <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill={c} transform={`rotate(${i * 23} ${x} ${y})`} />;
          })}
        </g>
      );
    case "squiggleFrame":
      return <rect x="10" y="10" width={W - 20} height={H - 20} rx="16" fill="none" stroke={v.a} strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />;
    case "doubleRule":
      return (
        <>
          <rect x="10" y="10" width={W - 20} height={H - 20} rx="8" fill="none" stroke={v.a} strokeWidth="2.5" />
          <rect x="16" y="16" width={W - 32} height={H - 32} rx="5" fill="none" stroke={v.a} strokeWidth="1" opacity="0.8" />
        </>
      );
    case "cornerStars":
      return (
        <g style={{ color: v.b }}>
          {[[16, 16], [W - 16, 16], [16, H - 16], [W - 16, H - 16]].map(([x, y], i) => <use key={i} href="#m-star" x={x - 9} y={y - 9} width="18" height="18" />)}
        </g>
      );
    case "fringeBottom":
      return (
        <g>
          {Array.from({ length: Math.ceil(W / 8) }).map((_, i) => (
            <rect key={i} x={i * 8 + 1} y={H - 44 + (i % 3) * 3} width="6" height="46" fill={[v.a, v.b, v.c, v.d][i % 4]} rx="2" />
          ))}
        </g>
      );
    case "buntingTop":
      return <use href="#m-bunting" x="0" y="-4" width={W} height="72" style={{ color: v.a, ["--m2" as string]: v.b }} preserveAspectRatio="none" />;
    case "neonFrame":
      return <rect x="12" y="12" width={W - 24} height={H - 24} rx="18" fill="none" stroke={v.a} strokeWidth="3" className="kc__neonRule" />;
    case "scallopFrame":
      return null; // drawn as the shape's outline
    default:
      return null;
  }
}

function Photo({ slot: p, photo, v, uid, lang }: { slot: NonNullable<KidsCard["photo"]>; photo?: string; v: Variant; uid: string; lang: Lang }) {
  const id = `${uid}-ph`;
  const x = p.shape === "full" || p.shape === "rect" ? p.x : p.x - p.w / 2;
  const y = p.shape === "full" || p.shape === "rect" ? p.y : p.y - p.h / 2;
  const clip =
    p.shape === "circle" ? <circle cx={p.x} cy={p.y} r={Math.min(p.w, p.h) / 2} />
    : p.shape === "oval" ? <ellipse cx={p.x} cy={p.y} rx={p.w / 2} ry={p.h / 2} />
    : p.shape === "arch" ? <path d={`M${x} ${y + p.h} V${y + p.w / 2} A${p.w / 2} ${p.w / 2} 0 0 1 ${x + p.w} ${y + p.w / 2} V${y + p.h} Z`} />
    : <rect x={x} y={y} width={p.w} height={p.h} />;
  const frame = p.shape !== "full" && p.shape !== "rect";
  return (
    <>
      <defs><clipPath id={id}>{clip}</clipPath></defs>
      {frame && (
        <g transform={p.rotate ? `rotate(${p.rotate} ${p.x} ${p.y})` : undefined}>
          {p.shape === "circle" ? <circle cx={p.x} cy={p.y} r={Math.min(p.w, p.h) / 2 + 5} fill={v.paper} stroke={v.a} strokeWidth="2" /> : <ellipse cx={p.x} cy={p.y} rx={p.w / 2 + 5} ry={p.h / 2 + 5} fill={v.paper} stroke={v.a} strokeWidth="2" />}
        </g>
      )}
      <g clipPath={`url(#${id})`} transform={p.rotate ? `rotate(${p.rotate} ${p.x} ${p.y})` : undefined}>
        <rect x={x} y={y} width={p.w} height={p.h} fill={`color-mix(in srgb, ${v.a} 18%, ${v.paper})`} />
        {photo ? (
          <image href={photo} x={x} y={y} width={p.w} height={p.h} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <g style={{ color: v.a }} opacity="0.75">
            <use href="#m-camera" x={p.x - 22} y={p.y - 30} width="44" height="44" />
            <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize="11" fontFamily="var(--f-kids)" fill={v.ink} opacity="0.8">{lang === "hy" ? "ձեր նկարը" : "your photo"}</text>
          </g>
        )}
        {p.shape === "full" && <rect x={x} y={y + p.h * 0.5} width={p.w} height={p.h * 0.5} fill={`url(#${uid}-scrim)`} />}
      </g>
      {p.shape === "full" && (
        <defs><linearGradient id={`${uid}-scrim`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.62" /></linearGradient></defs>
      )}
    </>
  );
}

function textBox(card: KidsCard, W: number, H: number, details: boolean): { x: number; y: number; w: number; h: number; align: "center" | "left" | "right" } {
  const L = card.layout;
  const extra = details ? 40 : 0; // the fine print needs room; the tile has none
  if (card.shape === "landscape") {
    if (L === "left") return { x: 22, y: 24, w: 200, h: 252, align: "left" };
    if (L === "right") return { x: W - 222, y: 24, w: 200, h: 252, align: "right" };
    return { x: 60, y: 30, w: W - 120, h: H - 60, align: "center" };
  }
  if (card.shape === "square" || card.shape === "scallop") {
    if (L === "bottom") return { x: 26, y: H - 150 - extra, w: W - 52, h: 128 + extra, align: "center" };
    if (L === "top") return { x: 26, y: 24, w: W - 52, h: 128 + extra, align: "center" };
    return { x: 26, y: 88 - extra / 2, w: W - 52, h: 150 + extra, align: "center" };
  }
  // portrait & friends
  if (L === "bottom") return { x: 22, y: (card.photo?.shape === "full" ? 262 : 250) - extra, w: W - 44, h: (card.photo?.shape === "full" ? 146 : 156) + extra, align: "center" };
  if (L === "top") return { x: 22, y: card.shape === "arch" ? 60 : 30, w: W - 44, h: 150 + extra, align: "center" };
  return { x: 22, y: 128 - extra / 2 - 8, w: W - 44, h: 176 + extra + 16, align: "center" };
}

export default function KidsCardFace(props: KidsFaceProps) {
  const { card, variant: v, lang, className = "", details = true, sample = true } = props;
  const uid = useId().replace(/[:]/g, "");
  const [W, H] = DIM[card.shape];
  const words = kidsWords(lang, card.headline, props.name ?? "", props.age, props.second);
  const dateLine = props.date ? kidsDateLine(lang, props.date, props.time ?? "") : sample ? kidsDateLine(lang, "2026-11-08", "12:00") : "";
  const where = [props.venue, props.address].filter(Boolean).join(", ") || (sample && !props.venue ? (lang === "hy" ? "Մեր տանը" : "At our home") : "");
  const box = textBox(card, W, H, details);
  const patternColor = slot(v, card.patternSlot, "a");
  const style = {
    "--kc-paper": v.paper, "--kc-ink": v.ink, "--kc-a": v.a, "--kc-b": v.b, "--kc-c": v.c, "--kc-d": v.d,
  } as React.CSSProperties;
  const label = `${t(lang, card.name)} — ${words.big}${words.ageBig ? " " + words.ageBig : ""}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`kc kc--${card.shape} kc--face-${card.face} kc--${card.layout}${v.dark ? " kc--dark" : ""}${details ? " kc--details" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={`${uid}-shape`}><path d={shapePath(card.shape, W, H)} /></clipPath>
        {card.pattern !== "none" && <Pattern id={`${uid}-pat`} kind={card.pattern} color={patternColor} paper={v.paper} W={W} H={H} />}
      </defs>

      <g clipPath={`url(#${uid}-shape)`}>
        <rect width={W} height={H} fill={v.paper} />
        {card.pattern === "rays" ? (
          <g opacity={card.patternOpacity ?? 0.2}>
            {Array.from({ length: 12 }).map((_, i) => {
              // rounded: server and browser trig differ in the last digit, and a
              // hydration mismatch over 1e-13 of a ray is not worth having
              const p = (deg: number) => `${(W / 2 + Math.cos((deg * Math.PI) / 180) * 500).toFixed(1)} ${(H / 2 + Math.sin((deg * Math.PI) / 180) * 500).toFixed(1)}`;
              return <path key={i} d={`M${W / 2} ${H / 2} L${p(i * 30)} L${p(i * 30 + 15)}Z`} fill={patternColor} />;
            })}
          </g>
        ) : card.pattern !== "none" ? (
          <rect width={W} height={H} fill={`url(#${uid}-pat)`} opacity={card.patternOpacity ?? 0.3} />
        ) : null}

        {card.photo && card.photo.shape === "full" && <Photo slot={card.photo} photo={props.photo} v={v} uid={uid} lang={lang} />}

        <Border kind={card.border} v={v} W={W} H={H} uid={uid} />

        {card.motifs.map((m: Placed, i) => (
          <use
            key={i}
            href={`#m-${m.m}`}
            x={m.x - m.s / 2}
            y={m.y - m.s / 2}
            width={m.s}
            height={m.s}
            transform={m.r ? `rotate(${m.r} ${m.x} ${m.y})` : undefined}
            opacity={m.o ?? 1}
            style={{ color: slot(v, m.c, "a"), ["--m2" as string]: slot(v, m.c2, "paper"), ["--m3" as string]: v.ink }}
          />
        ))}

        {card.photo && card.photo.shape !== "full" && <Photo slot={card.photo} photo={props.photo} v={v} uid={uid} lang={lang} />}

        <foreignObject x={box.x} y={box.y} width={box.w} height={box.h}>
          <div {...{ xmlns: "http://www.w3.org/1999/xhtml" }} className={`kc__txt kc__txt--${box.align}`}>
            {words.pre && <p className="kc__pre">{words.pre}</p>}
            <p className="kc__big">{words.big}</p>
            {words.ageBig && <p className="kc__age">{words.ageBig}</p>}
            {words.sub && <p className="kc__sub">{words.sub}</p>}
            {details && (
              <>
                {dateLine && <p className="kc__when">{dateLine}</p>}
                {where && <p className="kc__where">{where}{props.city ? `, ${props.city}` : ""}</p>}
                {props.note && <p className="kc__note">{props.note}</p>}
                {(props.rsvpBy || props.host) && (
                  <p className="kc__rsvp">
                    {props.rsvpBy ? `${lang === "hy" ? "Պատասխանել մինչև" : "RSVP by"} ${kidsDateLine(lang, props.rsvpBy, "").split(",").slice(1).join(",").trim() || props.rsvpBy}` : ""}
                    {props.rsvpBy && props.host ? " · " : ""}
                    {props.host ?? ""}
                  </p>
                )}
              </>
            )}
          </div>
        </foreignObject>
      </g>

      {card.shape === "scallop" && <path d={shapePath(card.shape, W, H)} fill="none" stroke={v.a} strokeWidth="3" />}
      {card.shape === "wave" && <path d={shapePath(card.shape, W, H)} fill="none" stroke={v.a} strokeWidth="2" opacity="0.6" />}
    </svg>
  );
}
