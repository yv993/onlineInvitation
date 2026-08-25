"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";
import type { ScheduleIcon } from "@/types/invitation";
import ScheduleGlyph from "./icons";

// ============================================================================
// THE DAY'S ROUTE — one line down the invitation that DRAWS ITSELF as the
// guest scrolls, spotting every place and hour of the day: where they are
// expected, at what time, and what happens there.
//
// The line is generated, not drawn by hand: the component measures each pin's
// centre and lays a smooth Catmull-Rom curve through them, so the route always
// passes exactly through its spots however long the addresses run. Motion.tsx
// scrubs it with the scroll (`data-route`): the stroke draws from the first
// stop to the last, a traveller rides the curve (`getPointAtLength`, no plugin),
// and each spot lights up as the line reaches it.
//
// THE CONTRACT, as everywhere in this project: the parked states live in JS
// only. With no JavaScript, or under `prefers-reduced-motion`, the route is
// simply drawn in full with every spot lit — a printed itinerary.
// ============================================================================

export type RouteStop = {
  id: string;
  icon: ScheduleIcon;
  time: string;
  title: T | string;
  venue: T | string;
  address?: T | string;
  mapUrl?: string;
  note?: T | string;
};

export type RouteVariant = "classic" | "cinematic" | "ticket" | "pearls" | "dusty" | "plain";

const L = {
  route: { hy: "Օրվա ընթացքը", en: "The day, step by step", ru: "Программа дня" },
  directions: { hy: "Ուղղություն", en: "Directions", ru: "Маршрут" },
  map: { hy: "Քարտեզում", en: "On the map", ru: "На карте" },
  here: { hy: "Այստեղ", en: "Here", ru: "Здесь" },
};
const s = (lang: Lang, v: T | string | undefined): string => (v === undefined ? "" : typeof v === "string" ? v : t(lang, v));
const dirUrl = (b: RouteStop, lang: Lang) => b.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s(lang, b.venue)}${b.address ? ", " + s(lang, b.address) : ""}`)}`;

/** a smooth curve through the measured pin centres (Catmull-Rom → cubic) */
function curve(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const RAIL = 72; // the rail's width in px — the line's room to wander
const X = (i: number) => (i % 2 === 0 ? 22 : 50); // the snake's turns

export default function DayRoute({ lang, stops, title, variant = "plain", directions = true, compact = false }: {
  lang: Lang;
  stops: RouteStop[];
  title?: T | string;
  variant?: RouteVariant;
  directions?: boolean;
  /** a preview: the route is short, still, and never scroll-driven */
  compact?: boolean;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const pins = useRef<Array<HTMLElement | null>>([]);
  const [geo, setGeo] = useState<{ d: string; h: number } | null>(null);

  const measure = useCallback(() => {
    const w = wrap.current;
    if (!w) return;
    const top = w.getBoundingClientRect().top;
    const pts = pins.current
      .filter((p): p is HTMLElement => Boolean(p))
      .map((p) => { const r = p.getBoundingClientRect(); return { x: Number(p.dataset.x ?? RAIL / 2), y: Math.round(r.top - top + r.height / 2) }; });
    if (pts.length < 2) return;
    const h = Math.round(w.getBoundingClientRect().height);
    const d = curve(pts);
    setGeo((cur) => (cur && cur.d === d && cur.h === h ? cur : { d, h }));
  }, []);

  useEffect(() => {
    measure();
    const w = wrap.current;
    if (!w || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(w);
    // the type settles after the fonts swap — Armenian metrics move every row
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => ro.disconnect();
  }, [measure, stops.length]);

  if (!stops.length) return null;
  const n = stops.length;
  // the server (and the first paint) get an evenly spaced route; the measured
  // one replaces it as soon as the rows have a height
  const fallbackH = n * 132;
  const fallback = curve(stops.map((_, i) => ({ x: X(i), y: Math.round(((i + 0.5) / n) * fallbackH) })));
  const d = geo?.d ?? fallback;
  const h = geo?.h ?? fallbackH;

  return (
    <section className={`iv-route iv-route--${variant}${compact ? " iv-route--compact" : ""}`} aria-label={s(lang, title) || t(lang, L.route)}>
      {title !== null && <p className="iv-sec__label" data-rise>{s(lang, title) || t(lang, L.route)}</p>}
      <div className="iv-route__wrap" ref={wrap} data-route={compact ? undefined : ""}>
        <svg className="iv-route__svg" width={RAIL} height={h} viewBox={`0 0 ${RAIL} ${h}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMin meet">
          <path className="iv-route__ghost" d={d} fill="none" />
          <path className="iv-route__line" d={d} fill="none" pathLength={1} />
          <g className="iv-route__travel"><circle r="6" cx={X(0)} cy={0} /><circle className="iv-route__travelDot" r="2.4" cx={X(0)} cy={0} /></g>
        </svg>
        <ol className="iv-route__list">
          {stops.map((b, i) => (
            <li key={b.id} className="iv-route__stop" style={{ "--i": i, "--at": (i + 0.5) / n } as React.CSSProperties} data-at={((i + 0.5) / n).toFixed(3)}>
              <span className="iv-route__pinCol">
                <span className="iv-route__pin" ref={(el) => { pins.current[i] = el; }} data-x={X(i)} style={{ left: `${X(i)}px` }}>
                  <ScheduleGlyph icon={b.icon} size={20} className="iv-route__glyph" />
                  <i className="iv-route__ping" aria-hidden="true" />
                </span>
              </span>
              <div className="iv-route__card">
                <span className="iv-route__time">{b.time}</span>
                <h3 className="iv-route__title">{s(lang, b.title)}</h3>
                <p className="iv-route__venue"><Icon name="map" size={12} /> {s(lang, b.venue)}</p>
                {b.address && <p className="iv-route__addr">{s(lang, b.address)}</p>}
                {b.note && <p className="iv-route__note">{s(lang, b.note)}</p>}
                {directions && !compact && (
                  <a className="iv-route__dir" href={dirUrl(b, lang)} target="_blank" rel="noopener noreferrer">
                    <Icon name="route" size={13} /> {t(lang, variant === "ticket" ? L.map : L.directions)}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
