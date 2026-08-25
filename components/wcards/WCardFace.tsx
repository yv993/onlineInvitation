import { useId } from "react";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { wWords, type WCard, type WPlaced, type WSlot, type WVariant } from "@/lib/wcards";

// ============================================================================
// THE WEDDING CARD FACE — one renderer for the front and the back of every
// design. SVG in card units (300×420 portrait, 420×300 landscape, 320×320
// square); motifs by <use> from WMotifSprite; the words as HTML in a
// <foreignObject>. Foil is a CSS gradient painted through the type
// (background-clip) and through motifs (a gradient fill via --w-foil).
// ============================================================================

export type WFaceProps = {
  card: WCard;
  variant: WVariant;
  lang: Lang;
  side?: "front" | "back";
  /** the matching components share the design and swap the words */
  mode?: "invitation" | "saveTheDate" | "thankYou" | "details" | "rsvp";
  a?: string; b?: string;
  date?: string; time?: string;
  venue?: string; address?: string; city?: string;
  rsvpBy?: string; host?: string; note?: string;
  stops?: Array<{ time: string; name: string; place: string }>;
  photos?: string[];
  /** the guest's name (from ?g=) — printed on the back's greeting */
  guest?: string;
  className?: string;
};

const DIM: Record<WCard["shape"], [number, number]> = { portrait: [300, 420], landscape: [420, 300], square: [320, 320] };
const slot = (v: WVariant, s: WSlot | undefined, d: WSlot, foilId: string): string => {
  const k = s ?? d;
  if (k === "foil") return `url(#${foilId})`;
  return v[k];
};

function Bg({ card, v, W, H, uid }: { card: WCard; v: WVariant; W: number; H: number; uid: string }) {
  switch (card.bg) {
    case "wash":
      return (
        <>
          <rect width={W} height={H} fill={v.paper} />
          <g filter="url(#w-wash)" opacity="0.5">
            <ellipse cx={W * 0.5} cy={H * 0.55} rx={W * 0.62} ry={H * 0.5} fill={v.c} />
          </g>
        </>
      );
    case "linen":
      return (
        <>
          <defs><pattern id={`${uid}-ln`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 0v4" stroke={v.ink} strokeWidth="0.35" opacity="0.12" /></pattern></defs>
          <rect width={W} height={H} fill={v.paper} /><rect width={W} height={H} fill={`url(#${uid}-ln)`} />
        </>
      );
    case "speckle":
      return (
        <>
          <rect width={W} height={H} fill={v.paper} />
          <rect width={W} height={H} filter="url(#w-speckle)" opacity="0.5" />
        </>
      );
    case "marble":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}-mb`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={v.paper} /><stop offset="0.45" stopColor={v.c} /><stop offset="0.7" stopColor={v.paper} /><stop offset="1" stopColor={v.c} /></linearGradient>
          </defs>
          <rect width={W} height={H} fill={`url(#${uid}-mb)`} />
        </>
      );
    case "deckle":
      return (
        <>
          <rect width={W} height={H} fill={v.c} />
          <rect x="7" y="7" width={W - 14} height={H - 14} fill={v.paper} filter="url(#w-deckle)" />
        </>
      );
    case "gradient":
      return (
        <>
          <defs><linearGradient id={`${uid}-gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={v.c} /><stop offset="0.6" stopColor={v.paper} /></linearGradient></defs>
          <rect width={W} height={H} fill={`url(#${uid}-gr)`} />
        </>
      );
    default:
      return <rect width={W} height={H} fill={v.paper} />;
  }
}

function Frame({ card, v, W, H, foilId }: { card: WCard; v: WVariant; W: number; H: number; foilId: string }) {
  const f = `url(#${foilId})`;
  switch (card.frame) {
    case "thin": return <rect x="12" y="12" width={W - 24} height={H - 24} fill="none" stroke={f} strokeWidth="1.2" />;
    case "double": return (<><rect x="10" y="10" width={W - 20} height={H - 20} fill="none" stroke={v.a} strokeWidth="1.4" /><rect x="15" y="15" width={W - 30} height={H - 30} fill="none" stroke={v.a} strokeWidth="0.6" /></>);
    case "corners": return (<g style={{ color: v.a }}>{[[0, 0, 0], [W, 0, 90], [W, H, 180], [0, H, 270]].map(([x, y, r], i) => <use key={i} href="#w-frameCorner" x={x - 30} y={y - 30} width="60" height="60" transform={`rotate(${r} ${x} ${y})`} />)}</g>);
    case "ornate": return (<><rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke={f} strokeWidth="1.2" /><g style={{ color: v.a }}><use href="#w-frameOrnate" x="6" y="6" width={W - 12} height={H - 12} preserveAspectRatio="none" opacity="0.9" /></g></>);
    case "arch": return <path d={`M24 ${H - 20} V${W / 2} A${W / 2 - 24} ${W / 2 - 24} 0 0 1 ${W - 24} ${W / 2} V${H - 20}`} fill="none" stroke={v.a} strokeWidth="1.4" />;
    case "botanicalCorners": return null; // the design's own motifs
    case "goldEdge": return <rect x="4" y="4" width={W - 8} height={H - 8} fill="none" stroke={f} strokeWidth="5" />;
    default: return null;
  }
}

function Photos({ card, v, photos, uid }: { card: WCard; v: WVariant; photos?: string[]; uid: string }) {
  if (!card.photo?.length) return null;
  return (
    <>
      {card.photo.map((p, i) => {
        const id = `${uid}-ph${i}`;
        const src = photos?.[i];
        const x = p.shape === "rect" || p.shape === "full" ? p.x - (p.shape === "rect" ? p.w / 2 : 0) : p.x - p.w / 2;
        const y = p.shape === "rect" || p.shape === "full" ? p.y - (p.shape === "rect" ? p.h / 2 : 0) : p.y - p.h / 2;
        const clip = p.shape === "circle" ? <circle cx={p.x} cy={p.y} r={Math.min(p.w, p.h) / 2} />
          : p.shape === "oval" ? <ellipse cx={p.x} cy={p.y} rx={p.w / 2} ry={p.h / 2} />
          : p.shape === "arch" ? <path d={`M${x} ${y + p.h} V${y + p.w / 2} A${p.w / 2} ${p.w / 2} 0 0 1 ${x + p.w} ${y + p.w / 2} V${y + p.h} Z`} />
          : <rect x={x} y={y} width={p.w} height={p.h} />;
        return (
          <g key={i}>
            <defs><clipPath id={id}>{clip}</clipPath></defs>
            {p.shape === "rect" && <rect x={x - 4} y={y - 4} width={p.w + 8} height={p.h + 8} fill={v.paper} stroke={v.c} strokeWidth="1" transform={`rotate(${i ? 4 : -3} ${p.x} ${p.y})`} />}
            <g clipPath={`url(#${id})`} transform={p.shape === "rect" ? `rotate(${i ? 4 : -3} ${p.x} ${p.y})` : undefined}>
              <rect x={x} y={y} width={p.w} height={p.h} fill={`color-mix(in srgb, ${v.a} 14%, ${v.paper})`} />
              {src ? <image href={src} x={x} y={y} width={p.w} height={p.h} preserveAspectRatio="xMidYMid slice" /> : (
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontFamily="var(--f-body)" fill={v.ink} opacity="0.7">{i + 1}</text>
              )}
            </g>
          </g>
        );
      })}
    </>
  );
}

function textBox(card: WCard, W: number, H: number, side: "front" | "back") {
  if (side === "back") return { x: 26, y: 40, w: W - 52, h: H - 80, align: "center" as const };
  const L = card.layout;
  if (card.shape === "landscape") {
    if (L === "left") return { x: 26, y: 30, w: 210, h: H - 60, align: "left" as const };
    if (L === "right") return { x: W - 236, y: 30, w: 210, h: H - 60, align: "right" as const };
    return { x: 50, y: 30, w: W - 100, h: H - 60, align: "center" as const };
  }
  if (card.shape === "square") {
    if (L === "bottom") return { x: 26, y: 150, w: W - 52, h: 150, align: "center" as const };
    return { x: 26, y: 40, w: W - 52, h: 240, align: "center" as const };
  }
  if (L === "bottom") return { x: 24, y: 220, w: W - 48, h: 180, align: "center" as const };
  if (L === "top") return { x: 24, y: 24, w: W - 48, h: 200, align: "center" as const };
  return { x: 24, y: 70, w: W - 48, h: 280, align: "center" as const };
}

export default function WCardFace(props: WFaceProps) {
  const { card, variant: v, lang, side = "front", className = "", mode = "invitation" } = props;
  const uid = useId().replace(/[:]/g, "");
  const foilId = `${uid}-foil`;
  const [W, H] = DIM[card.shape];
  const words = wWords(lang, { a: props.a, b: props.b, date: props.date, time: props.time, venue: props.venue, address: props.address, city: props.city, rsvpBy: props.rsvpBy, host: props.host, note: props.note });
  const box = textBox(card, W, H, side);
  const style = { "--w-paper": v.paper, "--w-ink": v.ink, "--w-a": v.a, "--w-b": v.b, "--w-c": v.c, "--w-foil": v.foil } as React.CSSProperties;
  const motifs: WPlaced[] = side === "front" ? card.motifs : (card.back ?? []);
  const stops = props.stops?.length ? props.stops : lang === "hy"
    ? [{ time: "12:30", name: "Հարսի տուն", place: "Մաշտոցի պող. 24" }, { time: "15:00", name: "Պսակադրություն", place: words.venue }, { time: "18:00", name: "Հարսանյաց խնջույք", place: "«Ոսկե Այգի»" }]
    : [{ time: "12:30", name: "The bride's home", place: "24 Mashtots Ave" }, { time: "15:00", name: "The ceremony", place: words.venue }, { time: "18:00", name: "The banquet", place: "Voske Aygi hall" }];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`wc wc--${card.shape} wc--face-${card.face} wc--${side}${v.dark ? " wc--dark" : ""}${className ? ` ${className}` : ""}`} style={style} role="img" aria-label={`${t(lang, card.name)} — ${words.a} ${words.amp} ${words.b}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* the foil: a diagonal metallic gradient in the variant's foil colours */}
        <linearGradient id={foilId} x1="0" y1="0" x2="1" y2="1">
          {v.foil.startsWith("linear-gradient") ? (
            [...v.foil.matchAll(/#[0-9a-fA-F]{6}/g)].map((m, i, arr) => <stop key={i} offset={i / Math.max(1, arr.length - 1)} stopColor={m[0]} />)
          ) : (
            <><stop offset="0" stopColor={v.foil} /><stop offset="1" stopColor={v.foil} /></>
          )}
        </linearGradient>
      </defs>
      <Bg card={card} v={v} W={W} H={H} uid={uid} />
      {side === "front" && card.bg !== "deckle" && <Frame card={card} v={v} W={W} H={H} foilId={foilId} />}
      {side === "front" && card.photo?.length ? <Photos card={card} v={v} photos={props.photos} uid={uid} /> : null}
      {motifs.map((m, i) => (
        <use
          key={i}
          href={`#w-${m.m}`}
          x={m.x - m.s / 2} y={m.y - m.s / 2} width={m.s} height={m.s}
          transform={`${m.r ? `rotate(${m.r} ${m.x} ${m.y})` : ""}${m.flip ? ` translate(${m.x * 2} 0) scale(-1 1)` : ""}`.trim() || undefined}
          opacity={m.o ?? 1}
          style={{ color: slot(v, m.c, "a", foilId), ["--m2" as string]: slot(v, m.c2, "paper", foilId) }}
        />
      ))}
      <foreignObject x={box.x} y={box.y} width={box.w} height={box.h}>
        <div {...{ xmlns: "http://www.w3.org/1999/xhtml" }} className={`wc__txt wc__txt--${box.align}`}>
          {side === "front" && mode === "saveTheDate" ? (
            <>
              <p className="wc__families">{lang === "hy" ? "Պահեք օրը" : "Save the date"}</p>
              <p className={`wc__names${card.foilNames ? " wc__names--foil" : ""}`}><span>{words.a}</span><i>{words.amp}</i><span>{words.b}</span></p>
              <p className="wc__date">{words.date}</p>
              <p className="wc__where">{words.where}</p>
              <p className="wc__invite">{lang === "hy" ? "Հրավերը՝ շուտով" : "Invitation to follow"}</p>
            </>
          ) : side === "front" && mode === "thankYou" ? (
            <>
              <p className="wc__families">{lang === "hy" ? "Շնորհակալություն" : "Thank you"}</p>
              <p className={`wc__names${card.foilNames ? " wc__names--foil" : ""}`}><span>{words.a}</span><i>{words.amp}</i><span>{words.b}</span></p>
              <p className="wc__invite">{lang === "hy" ? "որ այդ օրը մեզ հետ էիք" : "for being with us on our day"}</p>
              <p className="wc__date">{words.date}</p>
            </>
          ) : side === "front" && mode === "rsvp" ? (
            <>
              <p className="wc__families">{lang === "hy" ? "Խնդրում ենք պատասխանել" : "Kindly reply"}</p>
              <p className={`wc__names${card.foilNames ? " wc__names--foil" : ""}`}><span>{words.a}</span><i>{words.amp}</i><span>{words.b}</span></p>
              <p className="wc__rsvp">{words.rsvp}</p>
              <p className="wc__invite">☐ {lang === "hy" ? "Ուրախությամբ կգանք" : "Joyfully accepts"}   ☐ {lang === "hy" ? "Ցավոք չենք կարող" : "Regretfully declines"}</p>
            </>
          ) : side === "front" && mode === "details" ? (
            <>
              <p className="wc__families">{lang === "hy" ? "Մանրամասներ" : "Details"}</p>
              <ol className="wc__stops">
                {stops.map((s, i) => (<li key={i}><b>{s.time}</b><span>{s.name}</span><small>{s.place}</small></li>))}
              </ol>
              <p className="wc__where">{words.venue} · {words.where}</p>
              <p className="wc__after">{words.after}</p>
            </>
          ) : side === "front" ? (
            <>
              <p className="wc__families">{words.families}</p>
              <p className={`wc__names${card.foilNames ? " wc__names--foil" : ""}`}><span>{words.a}</span><i>{words.amp}</i><span>{words.b}</span></p>
              <p className="wc__invite">{words.invite}</p>
              <p className="wc__date">{words.date}</p>
              <p className="wc__time">{words.time}</p>
              <p className="wc__venue">{words.venue}</p>
              <p className="wc__where">{words.where}</p>
              <p className="wc__after">{words.after}</p>
              {props.note && <p className="wc__note">{props.note}</p>}
              <p className="wc__rsvp">{words.rsvp}</p>
            </>
          ) : (
            <>
              <p className="wc__mono"><span>{[...words.a][0]}</span><i>{words.amp}</i><span>{[...words.b][0]}</span></p>
              {props.guest && <p className="wc__greet">{lang === "hy" ? `Հարգելի՛ ${props.guest}` : `Dear ${props.guest}`}</p>}
              <p className="wc__families">{lang === "hy" ? "Օրվա ընթացքը" : "The day"}</p>
              <ol className="wc__stops">
                {stops.map((s, i) => (<li key={i}><b>{s.time}</b><span>{s.name}</span><small>{s.place}</small></li>))}
              </ol>
              <p className="wc__where">{words.venue} · {words.where}</p>
              <p className="wc__rsvp">{words.rsvp}</p>
              {props.note && <p className="wc__note">{props.note}</p>}
              <p className="wc__foot">ԿՆԻՔ</p>
            </>
          )}
        </div>
      </foreignObject>
    </svg>
  );
}
