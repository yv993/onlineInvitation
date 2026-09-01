"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import Plate from "@/components/Plate";
import TiltCard from "@/components/ui/3d/TiltCard";
import Lightbox, { useLightbox } from "@/components/ui/Lightbox";
import { qrMatrix } from "@/lib/qr";
import { guessIcon } from "@/lib/invitations/fromDraft";
import { stampFromIso } from "@/lib/draft";
import type { Lang, T } from "@/lib/content";
import { t } from "@/lib/i18n";
import { pad2, remaining } from "@/lib/date";
import type { TemplateSpec } from "@/lib/templates";

// ============================================================================
// THE BLOCKS — every named feature across the templates, as small
// client components TemplateView.tsx composes from the registry's flags.
// Each takes `lang` and what it needs from the spec; none reaches for global
// state. Strings live in the L map at the bottom (bilingual, like everything).
// ============================================================================

const L = {
  // ru on every guest-visible key: the /ru guest page is these labels — the
  // couple's own words already live in the hy/en slots of the draft
  countdown: { hy: "Մնաց", en: "Until then", ru: "Осталось" },
  age: { hy: "Դառնում է", en: "Turning", ru: "Исполняется" },
  d: { hy: "օր", en: "days", ru: "дней" }, h: { hy: "ժամ", en: "hours", ru: "часов" }, m: { hy: "րոպե", en: "min", ru: "мин" }, s: { hy: "վայրկյան", en: "sec", ru: "сек" },
  after: { hy: "Օրը եկավ", en: "The day is here", ru: "День настал" },
  map: { hy: "Բացել քարտեզում", en: "Open in Maps", ru: "Открыть на карте" },
  where: { hy: "Որտեղ", en: "Where", ru: "Где" },
  order: { hy: "Օրվա ընթացքը", en: "The day", ru: "Программа дня" },
  agenda: { hy: "Օրակարգ", en: "Agenda", ru: "Программа" },
  gallery: { hy: "Նկարներ", en: "Photos", ru: "Фотографии" },
  close: { hy: "Փակել", en: "Close", ru: "Закрыть" },
  rsvp: { hy: "Հաստատել ներկայությունը", en: "RSVP", ru: "Подтвердить присутствие" },
  rsvpBy: { hy: "Խնդրում ենք պատասխանել մինչև", en: "Please reply by", ru: "Просим ответить до" },
  name: { hy: "Ձեր անունը", en: "Your name", ru: "Ваше имя" },
  guests: { hy: "Հյուրերի քանակը", en: "How many of you", ru: "Сколько вас" },
  meal: { hy: "Սնունդ", en: "Meal", ru: "Меню" },
  meals: [{ hy: "Միս", en: "Meat", ru: "Мясо" }, { hy: "Ձուկ", en: "Fish", ru: "Рыба" }, { hy: "Բուսական", en: "Vegetarian", ru: "Вегетарианское" }],
  side: { hy: "Ու՞մ կողմից եք", en: "Whose side are you on?", ru: "С чьей вы стороны?" },
  sideBride: { hy: "Հարսի", en: "The bride's", ru: "Невесты" },
  sideGroom: { hy: "Փեսայի", en: "The groom's", ru: "Жениха" },
  company: { hy: "Ընկերություն", en: "Company", ru: "Компания" },
  role: { hy: "Պաշտոն", en: "Role", ru: "Должность" },
  attendees: { hy: "Մասնակիցներ (անուններ)", en: "Attendees (names)", ru: "Участники (имена)" },
  message: { hy: "Երկու խոսք", en: "A word", ru: "Пара слов" },
  send: { hy: "Ուղարկել", en: "Send", ru: "Отправить" },
  sending: { hy: "Ուղարկվում է…", en: "Sending…", ru: "Отправляется…" },
  yes: { hy: "Կգամ", en: "I'll come", ru: "Приду" },
  no: { hy: "Չեմ կարող", en: "Can't make it", ru: "Не смогу" },
  thanks: { hy: "Ստացանք, շնորհակալություն։", en: "Received — thank you.", ru: "Получили — спасибо." },
  notSent: { hy: "Գրանցվեց այս սարքում, նամակ դեռ չի ուղարկվում։", en: "Recorded on this device; no email is sent yet.", ru: "Сохранено на этом устройстве; письмо пока не отправляется." },
  again: { hy: "Փոխել", en: "Change", ru: "Изменить" },
  toast: { hy: "Կենացների պատ", en: "Wall of toasts", ru: "Стена тостов" },
  toastPh: { hy: "Ձեր կենացը…", en: "Your toast…", ru: "Ваш тост…" },
  toastAdd: { hy: "Ավելացնել", en: "Add", ru: "Добавить" },
  toastEmpty: { hy: "Առաջին կենացը՝ ձերն է։", en: "The first toast is yours.", ru: "Первый тост — ваш." },
  godparents: { hy: "Կնքահայր և կնքամայր", en: "Godparents", ru: "Крёстные" },
  godfather: { hy: "Կնքահայր", en: "Godfather", ru: "Крёстный" },
  godmother: { hy: "Կնքամայր", en: "Godmother", ru: "Крёстная" },
  dedication: { hy: "Հավատքի, հոգատարության և ուղեկցության խոստումով։", en: "With a promise of faith, care and companionship." },
  parents: { hy: "Ծնողների համար", en: "For parents" },
  parentsNote: { hy: "Խնջույքը 3 ժամ է։ Ծնողները կարող են մնալ կամ վերադառնալ 16:00-ին։ Ալերգիաների մասին տեղեկացրեք RSVP-ում։", en: "The party runs three hours. Parents may stay or return at 16:00. Tell us about allergies in the RSVP." },
  speakers: { hy: "Բանախոսներ", en: "Speakers" },
  qr: { hy: "VIP գրանցում", en: "VIP check-in" },
  qrHint: { hy: "Ցույց տվեք մուտքի մոտ։ Կոդը՝", en: "Show at the door. Code:" },
  ics: { hy: "Ավելացնել օրացույցում", en: "Add to calendar", ru: "Добавить в календарь" },
  registry: { hy: "Նվերներ", en: "Gifts", ru: "Подарки" },
  registryHint: { hy: "Ձեր ներկայությունը բավական է։ Եթե ուզում եք՝", en: "Your presence is plenty. If you wish —", ru: "Вашего присутствия достаточно. Если хотите —" },
  dress: { hy: "Հագուստի գույները", en: "Dress code palette", ru: "Цвета дресс-кода" },
  register: { hy: "Գրանցվել", en: "Register" },
  email: { hy: "Էլ. փոստ", en: "Email" },
  pin: { hy: "Վայրը քարտեզի վրա", en: "The place on the map" },
  pinHint: { hy: "Հպեք՝ քորոցը գցելու", en: "Tap to drop the pin" },
  product: { hy: "Շարժեք՝ շրջելու", en: "Move to turn" },
  reel: { hy: "Հիշողությունների ֆոն — ձեր տեսանյութը գնում է այստեղ", en: "Memory reel — your footage goes here" },
} satisfies Record<string, T | T[]>;

const tt = (lang: Lang, k: keyof typeof L) => t(lang, L[k] as T);

// ---------------------------------------------------------------- COUNTDOWN
export function Countdown({ lang, iso, ageBorn }: { lang: Lang; iso: string; ageBorn?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let id: number;
    const tick = () => { setNow(Date.now()); id = window.setTimeout(tick, 1000 - (Date.now() % 1000)); };
    id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => window.clearTimeout(id);
  }, []);
  const r = remaining(iso, now);
  const age = ageBorn ? new Date(iso).getUTCFullYear() - new Date(ageBorn).getUTCFullYear() : null;
  if (r.done) return <p className="kn-tb__done">{tt(lang, "after")}</p>;
  const cells = [[r.d, "d"], [r.h, "h"], [r.m, "m"], [r.s, "s"]] as const;
  return (
    <div className="kn-tb kn-tb--count" data-rise>
      <h2 className="kn-tb__label" data-ink>{age !== null ? `${tt(lang, "age")} ${age}` : tt(lang, "countdown")}</h2>
      <div className="kn-tb__cells" data-pop="">
        {cells.map(([n, k], i) => (
          <div className="kn-tb__cell" key={k}>
            <b suppressHydrationWarning>{i === 0 ? n : pad2(n)}</b>
            <span>{tt(lang, k)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- MAP LINK
export function MapCard({ lang, venue, address, city, url, heading }: { lang: Lang; venue: string; address: string; city: string; url?: string; heading?: string }) {
  // «Երևան, Երևան» is not an address (review, 2026-08-25): equal tokens
  // collapse to one, and the search query drops its duplicate too
  const line = address && city && address.trim().toLowerCase() !== city.trim().toLowerCase() ? `${address}, ${city}` : address || city;
  const q = encodeURIComponent([venue, line].filter(Boolean).join(", "));
  const href = url || `https://www.google.com/maps/search/?api=1&query=${q}`;
  return (
    <div className="kn-tb kn-tb--map" id="where" data-rise data-hover-tilt="">
      <h2 className="kn-tb__label" data-ink>{heading || tt(lang, "where")}</h2>
      <h3>{venue}</h3>
      <p className="kn-tb__soft">{line}</p>
      <a className="kn-tb__btn" href={href} target="_blank" rel="noopener noreferrer">
        <Icon name="map" size={16} /> {tt(lang, "map")}
      </a>
    </div>
  );
}

// ---------------------------------------------------------------- TIMELINE
export function Timeline({ lang, stops, kind }: { lang: Lang; stops: TemplateSpec["event"]["stops"]; kind: "parallax" | "tabs" | "order" | "zigzag" | "winding" }) {
  const [tab, setTab] = useState(0);
  // the WINDING day plan (wedding-12): one continuous S-curve threading the
  // milestones, each node a dot on the bend, the words beside it
  if (kind === "winding") {
    const RH = 100; // one row of the curve, in viewBox units
    const xs = stops.map((_, i) => (i % 2 ? 77 : 23));
    const d = xs.map((x, i) => {
      const y = RH / 2 + i * RH;
      if (i === 0) return `M ${x} ${y}`;
      const py = RH / 2 + (i - 1) * RH;
      return `C ${xs[i - 1]} ${py + RH * 0.55}, ${x} ${y - RH * 0.55}, ${x} ${y}`;
    }).join(" ");
    return (
      <div className="kn-tb kn-wd" data-rise>
        <h2 className="kn-tb__label" data-ink>{tt(lang, "order")}</h2>
        <div className="kn-wd__field" style={{ "--rows": stops.length } as React.CSSProperties}>
          <svg className="kn-wd__path" viewBox={`0 0 100 ${stops.length * RH}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="5 6" strokeLinecap="round" />
          </svg>
          <ol className="kn-wd__list">
            {stops.map((s, i) => (
              <li key={i} className={`kn-wd__it${i % 2 ? " kn-wd__it--r" : ""}`} data-rise style={{ "--i": i } as React.CSSProperties}>
                <span className="kn-wd__dot" aria-hidden="true" />
                <span className="kn-wd__body">
                  <span className="kn-wd__ic" aria-hidden="true"><Icon name={s.icon ?? guessIcon(t(lang, s.name), "wedding", i)} size={22} /></span>
                  <b>{s.time}</b>
                  <span>{t(lang, s.name)}</span>
                  <small>{t(lang, s.place)}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
  // the postcard's day plan: a dashed spine down the centre, each stop a dot
  // on it, the words alternating left and right of the line
  if (kind === "zigzag") {
    return (
      <div className="kn-tb kn-zz" data-rise>
        <h2 className="kn-tb__label" data-ink>{tt(lang, "order")}</h2>
        <ol className="kn-zz__list">
          {stops.map((s, i) => (
            <li key={i} className={`kn-zz__it${i % 2 ? " kn-zz__it--r" : ""}`} data-rise style={{ "--i": i } as React.CSSProperties}>
              <span className="kn-zz__dot" aria-hidden="true" />
              <span className="kn-zz__body">
                <b>{s.time}</b>
                <span>{t(lang, s.name)}</span>
                <small>{t(lang, s.place)}</small>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (kind === "tabs") {
    return (
      <div className="kn-tb" data-rise>
        <h2 className="kn-tb__label" data-ink>{tt(lang, "agenda")}</h2>
        <div className="kn-tabs" role="tablist">
          {stops.map((s, i) => (
            <button key={i} role="tab" aria-selected={tab === i} className="kn-tabs__b" onClick={() => setTab(i)}>{s.time}</button>
          ))}
        </div>
        <div className="kn-tabs__panel" role="tabpanel">
          <h3>{t(lang, stops[tab].name)}</h3>
          <p className="kn-tb__soft">{t(lang, stops[tab].place)}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`kn-tb kn-tl${kind === "parallax" ? " kn-tl--px" : ""}`} data-rise>
      <h2 className="kn-tb__label" data-ink>{tt(lang, "order")}</h2>
      <ol className="kn-tl__list">
        {stops.map((s, i) => (
          <li key={i} className="kn-tl__it" data-rise style={{ "--i": i } as React.CSSProperties}>
            <span className="kn-tl__time">{s.time}</span>
            <span className="kn-tl__dot" aria-hidden="true" />
            <span className="kn-tl__body">
              <b>{t(lang, s.name)}</b>
              <small>{t(lang, s.place)}</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------- GALLERY
export function Gallery({ lang, items, kind }: { lang: Lang; items: Array<{ img: TemplateSpec["gallery"][number]["img"] | string; alt: T }>; kind: "masonry" | "grid" | "ring" }) {
  const lb = useLightbox();
  const lbItems = items.map((g) => ({ img: g.img, alt: t(lang, g.alt) }));
  // the 3D ring needs enough photographs to close its circle
  const ring = kind === "ring" && items.length >= 3;
  if (ring) {
    // ring radius from the item width (170px) so neighbours never overlap
    const r = Math.round((170 / 2 + 16) / Math.tan(Math.PI / items.length));
    return (
      <div className="kn-tb" data-rise>
        <h2 className="kn-tb__label" data-ink>{tt(lang, "gallery")}</h2>
        <div className="kn-ring" style={{ "--kn-ringR": `${r}px` } as React.CSSProperties}>
          <div className="kn-ring__scale">
            <div className="kn-ring__spin">
              {items.map((g, i) => (
                <button key={i} type="button" className="kn-ring__it" style={{ "--kn-a": `${Math.round((360 / items.length) * i)}deg` } as React.CSSProperties} onClick={() => lb.open(i)} aria-label={t(lang, g.alt)}>
                  {typeof g.img === "string" ? (
                    <Image src={g.img} alt={t(lang, g.alt)} sizes="170px" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <Image src={g.img} alt={t(lang, g.alt)} sizes="170px" placeholder="blur" fill style={{ objectFit: "cover" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Lightbox items={lbItems} index={lb.i} onClose={lb.close} onIndex={lb.setI} closeLabel={tt(lang, "close")} />
      </div>
    );
  }
  return (
    <div className="kn-tb" data-rise>
      <h2 className="kn-tb__label" data-ink>{tt(lang, "gallery")}</h2>
      <div className={kind === "masonry" ? "kn-mas" : "kn-tg"}>
        {items.map((g, i) => (
          <button key={i} type="button" className="kn-tg__it" onClick={() => lb.open(i)} aria-label={t(lang, g.alt)} data-reveal={["up", "left", "right"][i % 3]} data-hover-tilt="">
            {/* an uploaded photograph has no build-time blur, and no intrinsic
                size next/image can read — it fills the same frame instead */}
            {typeof g.img === "string" ? (
              <span className="kn-tg__fill"><Image src={g.img} alt={t(lang, g.alt)} sizes="(max-width:640px) 50vw, 33vw" fill style={{ objectFit: "cover" }} /></span>
            ) : (
              <Image src={g.img} alt={t(lang, g.alt)} sizes="(max-width:640px) 50vw, 33vw" placeholder="blur" style={{ width: "100%", height: kind === "masonry" ? "auto" : "100%", objectFit: "cover" }} />
            )}
          </button>
        ))}
      </div>
      <Lightbox items={lbItems} index={lb.i} onClose={lb.close} onIndex={lb.setI} closeLabel={tt(lang, "close")} />
    </div>
  );
}

// ---------------------------------------------------------------- RSVP
/** plain yes and no — the L map's pair answers «are you coming?», which
 *  reads as nonsense under the shuttle question */
const AYE: T = { hy: "Այո", en: "Yes", ru: "Да" };
const NAY: T = { hy: "Ոչ", en: "No", ru: "Нет" };

/** the shuttle question, asked verbatim in each guest language */
const TRANSPORT: T = {
  hy: "Ձեզ անհրաժե՞շտ է տեղ տրանսպորտում կամ այլ ծառայություն",
  en: "Do you require a seat on transportation or another service?",
  ru: "Нужно ли вам место в транспорте или другая услуга?",
};

export function TemplateRsvp({ lang, kind, id, askSide = false, askTransport = false, maxGuests = 20, questions, by }: { lang: Lang; kind: "modal" | "inline" | "guests" | "meal" | "team"; id: string; /** weddings and engagements seat guests by side (lib/content.ts → occasionHasSides) */ askSide?: boolean; /** the couple runs a shuttle and needs to count seats */ askTransport?: boolean; /** the largest party one reply may bring */ maxGuests?: number; /** the couple's own extra questions, asked verbatim */ questions?: string[]; /** «reply by» — printed for the guest AND sent, so the API can close the form */ by?: string }) {
  const [open, setOpen] = useState(kind !== "modal");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ stored: boolean; delivered: boolean } | null>(null);
  const [coming, setComing] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(2);
  const [meal, setMeal] = useState(0);
  // optional on purpose: a guest of both families answers with neither chip,
  // and the API records "both" — the same default the engine's modal uses
  const [side, setSide] = useState<"bride" | "groom" | null>(null);
  // optional on purpose, like the side: a guest who ignores it is recorded
  // as needing nothing, and the couple counts only the seats asked for
  const [ride, setRide] = useState<boolean | null>(null);
  const born = useRef(Date.now());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (kind !== "modal" || !open) return;
    document.documentElement.classList.add("kn-locked");
    ref.current?.querySelector<HTMLElement>("input,button")?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => { document.documentElement.classList.remove("kn-locked"); window.removeEventListener("keydown", k); };
  }, [kind, open]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const qa = (questions ?? [])
      .map((q, i) => ({ q, a: String(fd.get(`q${i}`) ?? "").trim().slice(0, 200) }))
      .filter((x) => x.a)
      .map((x) => `${x.q} — ${x.a}`);
    const extra = [
      ...qa,
      askTransport && ride !== null ? `${t(lang, TRANSPORT)} — ${t(lang, ride ? AYE : NAY)}` : "",
      kind === "meal" ? `${tt(lang, "meal")}: ${t(lang, L.meals[meal])}` : "",
      kind === "team" ? `${tt(lang, "company")}: ${fd.get("company") ?? ""} · ${tt(lang, "role")}: ${fd.get("role") ?? ""} · ${fd.get("attendees") ?? ""}` : "",
      `[${id}]`,
    ].filter(Boolean).join(" · ");
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: String(fd.get("name") ?? ""), guests, side: side ?? "both", coming, message: `${extra} ${String(fd.get("message") ?? "")}`.slice(0, 1000), lang, event: id, deadline: by ? `${by}T23:59:59+04:00` : undefined, elapsed: Date.now() - born.current, website: String(fd.get("website") ?? "") }),
      });
      const d = (await r.json().catch(() => ({}))) as { stored?: boolean; delivered?: boolean };
      setDone({ stored: Boolean(d.stored), delivered: Boolean(d.delivered) });
    } catch { setBusy(false); }
  };

  const form = done ? (
    <div className="kn-tb__doneBox" role="status">
      <h3>{tt(lang, "thanks")}</h3>
      {!done.stored && !done.delivered && <p className="kn-tb__soft">{tt(lang, "notSent")}</p>}
      <button type="button" className="kn-tb__btn kn-tb__btn--ghost" onClick={() => { setDone(null); setBusy(false); born.current = Date.now(); }}>{tt(lang, "again")}</button>
    </div>
  ) : (
    <form className="kn-tf" onSubmit={submit} noValidate>
      {by && <p className="kn-tf__by">{tt(lang, "rsvpBy")} {stampFromIso(`${by}T12:00:00+04:00`)}</p>}
      <label><span>{tt(lang, "name")}</span><input name="name" required maxLength={80} /></label>
      {kind === "team" && (
        <>
          <label><span>{tt(lang, "company")}</span><input name="company" maxLength={80} /></label>
          <label><span>{tt(lang, "role")}</span><input name="role" maxLength={80} /></label>
          <label><span>{tt(lang, "attendees")}</span><input name="attendees" maxLength={200} /></label>
        </>
      )}
      <div className="kn-tf__row">
        <span>{tt(lang, "guests")}</span>
        <div className="kn-stepperN">
          <button type="button" aria-label="−" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
          <b>{guests}</b>
          <button type="button" aria-label="+" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}>+</button>
        </div>
      </div>
      {(questions ?? []).map((q, i) => (
        <label key={`q${i}`}><span>{q}</span><input name={`q${i}`} maxLength={200} /></label>
      ))}
      {kind === "meal" && (
        <div className="kn-tf__row">
          <span>{tt(lang, "meal")}</span>
          <div className="kn-tf__chips">
            {L.meals.map((m, i) => <button key={i} type="button" aria-pressed={meal === i} onClick={() => setMeal(i)}>{t(lang, m)}</button>)}
          </div>
        </div>
      )}
      {askSide && (
        <div className="kn-tf__row">
          <span>{tt(lang, "side")}</span>
          <div className="kn-tf__chips">
            {/* tapping the pressed chip clears it — the answer stays optional */}
            <button type="button" aria-pressed={side === "bride"} onClick={() => setSide((s) => (s === "bride" ? null : "bride"))}>{tt(lang, "sideBride")}</button>
            <button type="button" aria-pressed={side === "groom"} onClick={() => setSide((s) => (s === "groom" ? null : "groom"))}>{tt(lang, "sideGroom")}</button>
          </div>
        </div>
      )}
      {askTransport && (
        <div className="kn-tf__row kn-tf__row--ask">
          <span>{t(lang, TRANSPORT)}</span>
          <div className="kn-tf__chips">
            {/* tapping the pressed chip clears it — the answer stays optional */}
            <button type="button" aria-pressed={ride === true} onClick={() => setRide((r) => (r === true ? null : true))}>{t(lang, AYE)}</button>
            <button type="button" aria-pressed={ride === false} onClick={() => setRide((r) => (r === false ? null : false))}>{t(lang, NAY)}</button>
          </div>
        </div>
      )}
      <div className="kn-tf__chips kn-tf__chips--yn">
        <button type="button" aria-pressed={coming === "yes"} onClick={() => setComing("yes")}>{tt(lang, "yes")}</button>
        <button type="button" aria-pressed={coming === "no"} onClick={() => setComing("no")}>{tt(lang, "no")}</button>
      </div>
      <label><span>{tt(lang, "message")}</span><textarea name="message" rows={2} maxLength={500} /></label>
      <input name="website" className="kn-sr" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="kn-tb__btn" disabled={busy}>{busy ? tt(lang, "sending") : tt(lang, "send")}</button>
    </form>
  );

  if (kind === "modal") {
    return (
      <div className="kn-tb" id="rsvp">
        <button type="button" className="kn-tb__btn" onClick={() => setOpen(true)}>{tt(lang, "rsvp")}</button>
        {open && (
          <div className="kn-modal" role="dialog" aria-modal="true" aria-label={tt(lang, "rsvp")}>
            <button type="button" className="kn-modal__veil" aria-label={tt(lang, "close")} onClick={() => setOpen(false)} />
            <div className="kn-modal__panel kn-modal__panel--form" ref={ref}>
              <button type="button" className="kn-modal__x" aria-label={tt(lang, "close")} onClick={() => setOpen(false)}><Icon name="x" size={20} /></button>
              <h2 className="kn-tb__label" data-ink style={{ padding: "1.4rem 1.6rem 0" }}>{tt(lang, "rsvp")}</h2>
              <div style={{ padding: "0.6rem 1.6rem 1.6rem" }}>{form}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="kn-tb kn-tb--rsvp" id="rsvp">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "rsvp")}</h2>
      {form}
    </div>
  );
}

// ---------------------------------------------------------------- TOAST BOARD
export function ToastBoard({ lang }: { lang: Lang }) {
  const [list, setList] = useState<string[]>([]);
  const [v, setV] = useState("");
  const add = () => { const s = v.trim(); if (!s) return; setList((l) => [s, ...l].slice(0, 30)); setV(""); };
  return (
    <div className="kn-tb">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "toast")}</h2>
      <div className="kn-toast__in">
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder={tt(lang, "toastPh")} maxLength={140} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button type="button" className="kn-tb__btn" onClick={add}>{tt(lang, "toastAdd")}</button>
      </div>
      <ul className="kn-toast__list">
        {list.length === 0 && <li className="kn-tb__soft">{tt(lang, "toastEmpty")}</li>}
        {list.map((s, i) => <li key={i} className="kn-toast__it">🥂 {s}</li>)}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- SMALL CARDS
export function Godparents({ lang, names }: { lang: Lang; names?: { a: string; b: string } }) {
  const ga = names?.a || "Արամ Սարգսյան";
  const gb = names?.b || "Անի Հակոբյան";
  return (
    <div className="kn-tb kn-tb--god">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "godparents")}</h2>
      <div className="kn-god">
        <div><small>{tt(lang, "godfather")}</small><b>{ga}</b></div>
        <span className="kn-god__cross" aria-hidden="true">✝</span>
        <div><small>{tt(lang, "godmother")}</small><b>{gb}</b></div>
      </div>
      <p className="kn-tb__soft" style={{ textAlign: "center" }}>{tt(lang, "dedication")}</p>
    </div>
  );
}

export function ParentsNote({ lang }: { lang: Lang }) {
  return (
    <details className="kn-tb kn-tb--details">
      <summary>{tt(lang, "parents")} <Icon name="chevron" size={16} /></summary>
      <p className="kn-tb__soft">{tt(lang, "parentsNote")}</p>
    </details>
  );
}

export function Speakers({ lang }: { lang: Lang }) {
  const sp = [
    { n: "Անի Գրիգորյան", r: { hy: "CTO, ArmSoft", en: "CTO, ArmSoft" } },
    { n: "Դավիթ Մկրտչյան", r: { hy: "Հիմնադիր, Luys AI", en: "Founder, Luys AI" } },
    { n: "Sona Petrosyan", r: { hy: "Դիզայնի ղեկավար", en: "Head of Design" } },
    { n: "Արամ Ավետիսյան", r: { hy: "Ներդրող", en: "Investor" } },
  ];
  return (
    <div className="kn-tb">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "speakers")}</h2>
      <div className="kn-spk">
        {sp.map((s, i) => (
          <div className="kn-spk__c" key={i} data-rise>
            <span className="kn-spk__av" aria-hidden="true">{[...s.n][0]}</span>
            <b>{s.n}</b>
            <small>{t(lang, s.r)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QrCheckin({ lang, url, code }: { lang: Lang; url: string; code: string }) {
  const m = useMemo(() => qrMatrix(url), [url]);
  const n = m.length;
  return (
    <div className="kn-tb kn-tb--qr">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "qr")}</h2>
      <div className="kn-qr">
        <svg viewBox={`0 0 ${n + 8} ${n + 8}`} width="164" height="164" role="img" aria-label={code} shapeRendering="crispEdges">
          <rect width="100%" height="100%" fill="#fff" />
          {m.map((row, r) => row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c + 4} y={r + 4} width="1" height="1" fill="#111" /> : null)))}
        </svg>
        <div>
          <p className="kn-tb__soft">{tt(lang, "qrHint")}</p>
          <b className="kn-qr__code">{code}</b>
        </div>
      </div>
    </div>
  );
}

export function IcsButton({ lang, id }: { lang: Lang; id: string }) {
  return (
    <a className="kn-tb__btn" href={`/api/ics?t=${id}`} download={`${id}.ics`}>
      <Icon name="calendar" size={16} /> {tt(lang, "ics")}
    </a>
  );
}

export function Registry({ lang }: { lang: Lang }) {
  return (
    <div className="kn-tb">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "registry")}</h2>
      <p className="kn-tb__soft">{tt(lang, "registryHint")}</p>
      <div className="kn-reg">
        {/* TODO(owner): real registry links. Rendered as disabled chips until set. */}
        {["Zangak", "Yerevan Mall", "Ամուր"].map((s) => (
          <span key={s} className="kn-reg__b" aria-disabled="true">{s}</span>
        ))}
      </div>
    </div>
  );
}

export function DressCode({ lang, colors }: { lang: Lang; colors: string[] }) {
  return (
    <div className="kn-tb kn-tb--dress">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "dress")}</h2>
      <div className="kn-dress" data-pop="">
        {colors.map((c) => <span key={c} style={{ background: c }} title={c} />)}
      </div>
    </div>
  );
}

export function RegisterForm({ lang, id }: { lang: Lang; id: string }) {
  return <TemplateRsvp lang={lang} kind="team" id={id} />;
}

export function PinDrop({ lang }: { lang: Lang }) {
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="kn-tb">
      <h2 className="kn-tb__label" data-ink>{tt(lang, "pin")}</h2>
      <button type="button" className="kn-pin" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPin({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }); }} aria-label={tt(lang, "pinHint")}>
        <span className="kn-pin__grid" aria-hidden="true" />
        {pin ? <span className="kn-pin__p" style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}>📍</span> : <span className="kn-pin__hint">{tt(lang, "pinHint")}</span>}
      </button>
    </div>
  );
}

export function ProductTilt({ lang, img, alt }: { lang: Lang; img: TemplateSpec["cover"] | string; alt: string }) {
  return (
    <div className="kn-tb kn-tb--prod">
      <TiltCard flip>
        <div className="kn-prod" data-depth="0">
          <Plate img={img} alt={alt} sizes="(max-width: 640px) 80vw, 420px" ratio="4 / 5" zoom />
        </div>
        <div className="kn-prod__back" data-face="back" aria-hidden="true">
          <b>Aura One</b>
          <span>40h · ANC · 32Ω</span>
        </div>
      </TiltCard>
      <p className="kn-tb__soft" style={{ textAlign: "center" }}>{tt(lang, "product")}</p>
    </div>
  );
}

export function ReelNote({ lang }: { lang: Lang }) {
  return <p className="kn-tb__reelNote">{tt(lang, "reel")}</p>;
}
