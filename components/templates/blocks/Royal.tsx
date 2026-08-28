"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { RoseBloom } from "@/components/templates/FloralArt";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";

// ============================================================================
// ROYAL EMERALD (wedding-8, 2026-08-28) — the reference demo's anatomy
// rebuilt in our own hand: a full-page GATE whose two velvet doors swing
// open in 3D from a glowing heart, a hero that names the couple with their
// roles over a gold laurel, the SATURDAY | 16 | MAY date band, corner roses
// (our drawn RoseBloom in ivory-gold), and a field of slow gold sparkles.
// All of it plain CSS — no library, like everything in the templates.
//
// HONESTY OF MOTION: the page is rendered COMPLETE underneath; the gate
// mounts closed only after hydration, so no-JS and reduced-motion visitors
// simply see the finished invitation (the GiftBox rule).
// ============================================================================

const RL = {
  open: { hy: "Բացել", en: "Open", ru: "Открыть" },
  cordially: { hy: "Սիրով հրավիրում ենք", en: "Cordially invites you", ru: "Сердечно приглашаем" },
  groom: { hy: "ՓԵՍԱՆ", en: "THE GROOM", ru: "ЖЕНИХ" },
  bride: { hy: "ՀԱՐՍԸ", en: "THE BRIDE", ru: "НЕВЕСТА" },
  months: [
    { hy: "ՀՈՒՆՎԱՐ", en: "JANUARY", ru: "ЯНВАРЬ" }, { hy: "ՓԵՏՐՎԱՐ", en: "FEBRUARY", ru: "ФЕВРАЛЬ" },
    { hy: "ՄԱՐՏ", en: "MARCH", ru: "МАРТ" }, { hy: "ԱՊՐԻԼ", en: "APRIL", ru: "АПРЕЛЬ" },
    { hy: "ՄԱՅԻՍ", en: "MAY", ru: "МАЙ" }, { hy: "ՀՈՒՆԻՍ", en: "JUNE", ru: "ИЮНЬ" },
    { hy: "ՀՈՒԼԻՍ", en: "JULY", ru: "ИЮЛЬ" }, { hy: "ՕԳՈՍՏՈՍ", en: "AUGUST", ru: "АВГУСТ" },
    { hy: "ՍԵՊՏԵՄԲԵՐ", en: "SEPTEMBER", ru: "СЕНТЯБРЬ" }, { hy: "ՀՈԿՏԵՄԲԵՐ", en: "OCTOBER", ru: "ОКТЯБРЬ" },
    { hy: "ՆՈՅԵՄԲԵՐ", en: "NOVEMBER", ru: "НОЯБРЬ" }, { hy: "ԴԵԿՏԵՄԲԵՐ", en: "DECEMBER", ru: "ДЕКАБРЬ" },
  ],
} as const;

/** ivory-gold rose, the page's flower — one drawing, four corners */
function IvoryRose({ size = 120, seed = 11, flip = false }: { size?: number; seed?: number; flip?: boolean }) {
  return (
    <span className={`kn-royal__rose${flip ? " kn-royal__rose--flip" : ""}`} aria-hidden="true">
      <RoseBloom size={size} seed={seed} deep="#9C7B45" mid="#EFE3C9" lit="#FBF6E9" />
    </span>
  );
}

/** deterministic gold sparks — no randomness, so the server and the client draw the same sky */
const SPARKS = [
  [8, 16, 0], [22, 64, 1.3], [36, 30, 2.1], [52, 74, 0.6], [64, 12, 1.8],
  [78, 48, 0.2], [88, 80, 2.6], [14, 86, 1.1], [70, 90, 0.9], [92, 26, 1.6],
] as const;
function Sparks() {
  return (
    <span className="kn-royal__sky" aria-hidden="true">
      {SPARKS.map(([x, y, d], i) => (
        <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }}>✦</i>
      ))}
    </span>
  );
}

/** the gold laurel under the names — two branches meeting at a bud */
function Laurel() {
  return (
    <svg className="kn-royal__laurel" viewBox="0 0 220 26" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M10 14 C 45 4, 80 4, 102 13" />
        <path d="M210 14 C 175 4, 140 4, 118 13" />
        <path d="M30 12 q 3 -6 8 -7 M52 9 q 3 -6 8 -7 M76 8 q 2 -6 7 -7" />
        <path d="M190 12 q -3 -6 -8 -7 M168 9 q -3 -6 -8 -7 M144 8 q -2 -6 -7 -7" />
      </g>
      <circle cx="110" cy="14" r="3.2" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ GATE */
export function RoyalGate({ lang, a, b, dateLine, greet }: {
  lang: Lang; a: string; b: string; dateLine: string; greet?: string;
}) {
  const [shut, setShut] = useState(false);
  const [gone, setGone] = useState(false);
  // closes only AFTER hydration: no-JS and reduced-motion keep the open page
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShut(true);
  }, []);
  useEffect(() => {
    if (!shut) return;
    document.documentElement.classList.add("kn-locked");
    return () => document.documentElement.classList.remove("kn-locked");
  }, [shut]);
  if (gone) return null;
  const open = () => { setShut(false); window.setTimeout(() => setGone(true), 1050); };
  return (
    <div className={`kn-royal__gate${shut ? " is-shut" : ""}`} aria-hidden={!shut}>
      {/* the two velvet doors — they swing away in 3D when the heart is pressed */}
      <span className="kn-royal__door kn-royal__door--l" aria-hidden="true" />
      <span className="kn-royal__door kn-royal__door--r" aria-hidden="true" />
      <div className="kn-royal__gateCard">
        <IvoryRose size={128} seed={23} />
        <IvoryRose size={104} seed={37} flip />
        <Sparks />
        <button type="button" className="kn-royal__heart" onClick={open} aria-label={t(lang, RL.open)}>
          <Icon name="heart" size={26} />
        </button>
        <p className="kn-royal__gNames"><span>{a}</span><em>&</em><span>{b}</span></p>
        <span className="kn-royal__gRule" aria-hidden="true"><Laurel /></span>
        <p className="kn-royal__gDate">{dateLine}</p>
        <p className="kn-royal__gGreet">{greet || t(lang, RL.cordially)}</p>
        <button type="button" className="kn-royal__openB" onClick={open}>{t(lang, RL.open)}</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ HERO */
export function RoyalHero({ lang, a, b, roleA, roleB, iso, kicker, embed }: {
  lang: Lang; a: string; b: string; roleA?: string; roleB?: string; iso: string; kicker: string; embed?: boolean;
}) {
  const H = embed ? ("div" as const) : ("h1" as const);
  const day = iso.slice(8, 10);
  const monthName = t(lang, RL.months[Math.max(0, Math.min(11, Number(iso.slice(5, 7)) - 1))]);
  const year = iso.slice(0, 4);
  // the weekday, from the date itself — Armenia-local, so the printed word
  // can never disagree with the calendar
  const wd = new Date(iso).toLocaleDateString(lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US", { weekday: "long", timeZone: "Asia/Yerevan" }).toUpperCase();
  return (
    <div className="kn-royal__hero">
      <IvoryRose size={150} seed={51} />
      <IvoryRose size={118} seed={64} flip />
      <Sparks />
      <p className="kn-royal__kick" data-rise data-track>{kicker}</p>
      <H className="kn-royal__names" data-rise>
        <span className="kn-royal__name" data-letters>{a}</span>
        <small className="kn-royal__role">{roleA || t(lang, RL.groom)}</small>
        {b && (
          <>
            <em className="kn-royal__amp" aria-hidden="true">&</em>
            <span className="kn-royal__name" data-letters>{b}</span>
            <small className="kn-royal__role">{roleB || t(lang, RL.bride)}</small>
          </>
        )}
      </H>
      <span className="kn-royal__gold" data-rise><Laurel /></span>
      {/* the reference's date band: WEEKDAY | DAY | MONTH, the year beneath */}
      <div className="kn-royal__band" data-rise>
        <span>{wd}</span>
        <i aria-hidden="true" />
        <b>{day}</b>
        <i aria-hidden="true" />
        <span>{monthName}</span>
      </div>
      <p className="kn-royal__year" data-rise>{year}</p>
    </div>
  );
}
