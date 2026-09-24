import Image from "next/image";
import Plate from "@/components/Plate";
import { t } from "@/lib/i18n";
import { MONTHS_OF } from "./Family";
import InkDay, { type InkStop } from "./InkDay";
import { bowSlots, ink, type InkArt } from "./inkArt";
import sketch from "@/assets/ink/sketch.webp";
import whatsapp from "@/assets/ink/whatsapp.webp";
import facebook from "@/assets/ink/facebook.webp";
import type { Lang, T } from "@/lib/content";
import type { TemplateSpec } from "@/lib/templates";
import type { Draft } from "@/lib/draft";

// ============================================================================
// THE INK LINE (wedding-3): the client's Figma file «Wedding», rebuilt 1:1 —
// «Vaxinak & Melanie», 1920 × 25 065, node 16-6 its paper (2026-09-24).
//
// EVERYTHING HERE IS THE FILE'S OWN: its vectors (./inkArt.ts, cut from its
// "Copy as SVG"), its four faces (app/fonts.ts — Hurricane, Montaga, Montagu
// Slab, Montserrat, read off its "Copy as CSS"), its paper texture, its
// restaurant sketch and its two inked icons. Every size and every gap is the
// file's, in its own px: globals.css scales them by --u = 1/1920 of the
// column, so the page keeps the artboard's proportions at any width.
//
// The copy that the file only filled with placeholder text (the same «We are
// so happy…» under five headings, «Dress Code» twice) is written out properly
// here, the same length; its two typos («resturant», «will happened») are not
// carried over. Everything a couple can fill binds to their draft; the one
// thing no draft carries — contact handles — shows only on previews, never on
// a published invitation, so no guest is ever handed a sample phone number.
// ============================================================================

const L = {
  invitation: { hy: "Հարսանեկան հրավեր", en: "Wedding invitation", ru: "Свадебное приглашение" },
  day: { hy: "Հարսանյաց օր", en: "Wedding day", ru: "День свадьбы" },
  dear: { hy: "Սիրելի՛ ընտանիք և ընկերներ", en: "Dear Family and friends", ru: "Дорогие родные и друзья" },
  letter: {
    hy: "Ուրախ ենք հրավիրել ձեզ կիսելու մեզ հետ այս կարևոր օրը։ Ձեր ներկայությունը մեր հարսանիքը կդարձնի առավել առանձնահատուկ։",
    // the file breaks these four lines by hand — kept, so they fall as it draws them
    en: "We are so happy to invite you\nto share this meaningful day with us.\nYour presence will make our\nwedding even more special.",
    ru: "Мы очень рады пригласить вас разделить с нами этот важный день. Ваше присутствие сделает нашу свадьбу ещё более особенной.",
  },
  withLove: { hy: "Սիրով՝", en: "With love,", ru: "С любовью," },
  where: { hy: "Որտեղ է ամեն ինչ կատարվելու", en: "Where everything will happen", ru: "Где всё произойдёт" },
  openMap: { hy: "Բացել քարտեզում", en: "Open in map", ru: "Открыть на карте" },
  dress: { hy: "Հագուստի կոդ", en: "Dress Code", ru: "Дресс-код" },
  dressNote: {
    hy: "Կուրախանանք, եթե ձեր հանդերձանքի համար ընտրեք մեր օրվա գույները։",
    en: "We would be delighted if you chose the colours of our day for what you wear.",
    ru: "Мы будем рады, если для своего наряда вы выберете цвета нашего дня.",
  },
  giftsTitle: { hy: "Նվերներ և մաղթանքներ", en: "Gifts & Wishes", ru: "Подарки и пожелания" },
  gifts: { hy: "Նվերներ", en: "Gifts", ru: "Подарки" },
  giftsNote: {
    hy: "Ձեր ներկայությունն է ամենամեծ նվերը։ Եթե ցանկանում եք ավելին, մեր ապագա տան համար ձեր ներդրումը սիրով կընդունենք։",
    en: "Your presence is the greatest gift. If you wish to add something, a contribution towards our future home will be received with love.",
    ru: "Ваше присутствие — лучший подарок. Если хотите добавить что-то, мы с любовью примем вклад в наш будущий дом.",
  },
  wish: { hy: "Մաղթանք", en: "A wish", ru: "Пожелание" },
  wishNote: {
    hy: "Թողեք մեզ մի քանի խոսք՝ մաղթանք, որը կկարդանք նորից ու նորից։",
    en: "Leave us a few words — a wish we will read again and again.",
    ru: "Оставьте нам несколько слов — пожелание, которое мы будем перечитывать снова и снова.",
  },
  care: { hy: "Հոգատարությամբ ձեզ համար", en: "With Care For You", ru: "С заботой о вас" },
  careNote: {
    hy: "Եթե հարցեր ունեք, սիրով կպատասխանենք․ գրեք կամ զանգահարեք մեզ։",
    en: "If you have any questions, we will gladly answer them — write to us or call.",
    ru: "Если у вас есть вопросы, мы с радостью ответим — напишите или позвоните нам.",
  },
  form: { hy: "Խնդրում ենք լրացնել ձևը", en: "Please Complete this Form", ru: "Пожалуйста, заполните форму" },
  fieldName: { hy: "Անուն, ազգանուն", en: "First and last name", ru: "Имя и фамилия" },
  fieldGuests: { hy: "Հյուրերի քանակը", en: "Number of guests", ru: "Количество гостей" },
  // the file's own closing line («WE ARE WAITING FOR yoU. DEAR ONES!»), set
  // all in lower case by the CSS as the file shows it; hy/ru as the chestnut's
  wait: { hy: "Սիրով սպասում ենք ձեզ", en: "We are waiting for you. Dear ones!", ru: "Мы ждём вас, дорогие!" },
} satisfies Record<string, T>;

/** the file's colours → the template's ink tokens */
const PAINT: Record<string, string> = {
  "#424242": "var(--ink-line)",
  "#606060": "var(--ink-rule)",
  black: "var(--ink-deep)",
  "#631729": "var(--ink-heart)",
  "#251812": "var(--ink-band)",
  "#E9E1D4": "var(--ink-vine)",
};
const paint = (c?: string) => (c ? PAINT[c] ?? c : "none");

/** one ornament's paths; `cloth` repaints the first path (a bow's fabric) */
function Paths({ a, cloth }: { a: InkArt; cloth?: string }) {
  return (
    <>
      {a.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fillRule={p.rule === "evenodd" ? "evenodd" : undefined}
          clipRule={p.rule === "evenodd" ? "evenodd" : undefined}
          // a style, not a presentation attribute: attributes cannot read var()
          style={{ fill: i === 0 && cloth ? cloth : paint(p.fill), stroke: p.stroke ? paint(p.stroke) : undefined, strokeWidth: p.sw }}
        />
      ))}
    </>
  );
}

/** draw an ornament at its design proportions — or a `box` cut out of it */
function Ornament({ a, className, box }: { a: InkArt; className?: string; box?: [number, number, number, number] }) {
  const [x, y, w, h] = box ?? [0, 0, a.w, a.h];
  return (
    <svg className={className} viewBox={`${x} ${y} ${w} ${h}`} style={{ aspectRatio: `${w} / ${h}` }} aria-hidden="true" focusable="false">
      <Paths a={a} />
    </svg>
  );
}

/** ♡ ○——○ ♡ */
const Rule = () => <Ornament a={ink.heartRule} className="kn-ink__rule" />;

/** the vine drawn under the RSVP title (TemplateRsvp's `ornament`) */
export function InkVine() {
  return <Ornament a={ink.vine} className="kn-ink__vine" />;
}

/** the RSVP title the file sets over its form, and its two field labels */
export const inkFormTitle = L.form;
export const inkFormLabels = (lang: Lang) => ({ name: t(lang, L.fieldName), guests: t(lang, L.fieldGuests) });

/** the five bows on their string, each in one dress-code colour; fewer
 *  colours hang symmetrically (3 → the upper slots, 2 → the lower) */
function Bows({ colors }: { colors: string[] }) {
  const n = Math.min(colors.length, bowSlots.length);
  const order = n === 1 ? [2] : n === 2 ? [1, 3] : n === 3 ? [0, 2, 4] : n === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4];
  const S = ink.bowString, B = ink.bow;
  return (
    <svg className="kn-ink__bows" viewBox={`0 0 ${S.w} ${S.h}`} style={{ aspectRatio: `${S.w} / ${S.h}` }} aria-hidden="true" focusable="false">
      <defs>
        {/* one bow, drawn once; every hanging point <use>s it in its own
            cloth colour (a custom property crosses into the use's tree) */}
        <symbol id="kn-ink-bow" viewBox={`0 0 ${B.w} ${B.h}`}>
          <Paths a={B} cloth="var(--bow)" />
        </symbol>
      </defs>
      <Paths a={S} />
      {order.map((slot, i) => {
        const s = bowSlots[slot];
        return <use key={slot} href="#kn-ink-bow" x={s.x} y={s.y} width={B.w} height={B.h} style={{ ["--bow" as string]: colors[i] }} />;
      })}
    </svg>
  );
}

// the band's waves, in its own design px, measured off the path: across the
// page the top wave runs y 23–248 and the bottom 3370–3666 — cut just past each
const EDGE_TOP = 260;
const EDGE_BOT = 310;

export function InkPage({
  lang, embed, a, b, iso, time, stops, venue, address, mapUrl, photo, photoAlt, endPhoto, endAlt,
  dress, draft, heading, sample, rsvp, parents, wishes, thanks,
}: {
  lang: Lang;
  embed?: boolean;
  a: string;
  b: string;
  iso: string;
  time?: string;
  stops: InkStop[];
  venue: string;
  address: string;
  mapUrl?: string;
  photo: TemplateSpec["cover"] | string;
  photoAlt: string;
  endPhoto: TemplateSpec["cover"] | string;
  endAlt: string;
  dress?: string[];
  draft?: Draft;
  /** the couple's own hero line; the file's «Wedding invitation» otherwise */
  heading?: string;
  /** a preview, not a published invitation: sample contacts may show */
  sample: boolean;
  rsvp?: React.ReactNode;
  parents?: React.ReactNode;
  wishes?: React.ReactNode;
  thanks?: React.ReactNode;
}) {
  // an embed is a guest, not a page — it must not plant its own <h1>
  const H = embed ? ("div" as const) : ("h1" as const);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const day = m ? `${Number(m[3])} ${MONTHS_OF[lang][Number(m[2]) - 1]}` : "";
  const gifts = draft?.gifts?.filter((g) => g.label || g.value) ?? [];
  const showGifts = draft?.show?.gifts !== false;
  const showDress = draft?.show?.dress !== false && (dress?.length ?? 0) > 0;
  const showMap = draft?.show?.map !== false;

  return (
    // lang: the invitation's own language, which the editor's may not be
    <div className="kn-ink" lang={lang}>
      {/* ------------------------------------------------------------ HERO */}
      <section className="kn-ink__hero" aria-label={t(lang, L.invitation)}>
        <H className="kn-ink__names">
          <span>{a}</span>
          {b && (<> <i>&amp;</i><span>{b}</span></>)}
        </H>
        <Ornament a={ink.arrowRule} className="kn-ink__arrow" />
        <p className="kn-ink__label kn-ink__label--inv">{heading || t(lang, L.invitation)}</p>
        <div className="kn-ink__photo">
          <Plate img={photo} alt={photoAlt} sizes="(max-width: 640px) 62vw, 380px" ratio="1182 / 1220" priority={!embed} />
        </div>
        <p className="kn-ink__label kn-ink__label--day">{t(lang, L.day)}</p>
        <p className="kn-ink__date">
          <b>{day}</b>
          {time && <span>{time}</span>}
        </p>
        <Ornament a={ink.heartLoop} className="kn-ink__loop1" />
      </section>

      {/* ---------------------------------------------------------- LETTER */}
      <section className="kn-ink__letter">
        <h2 className="kn-ink__title kn-ink__title--dear">{t(lang, L.dear)}</h2>
        <p className="kn-ink__body kn-ink__body--letter">
          {t(lang, L.letter)}
          <br />
          <br />
          {t(lang, L.withLove)}
        </p>
        {/* set as the file sets it, «Vaxinak &Melanie»: the ampersand's
            swash runs into the next name, as in the names above */}
        <p className="kn-ink__sig">
          {a}
          {b && (<> <i>&amp;</i>{b}</>)}
        </p>
        <Rule />
      </section>
      {/* a section of its own: Motion rises [data-rise] only inside a section
          or footer, and the families' block carries one — loose here, it
          stayed parked at opacity 0 on every guest's page (never in the
          editor, which pins the parked states visible) */}
      {parents && <section className="kn-ink__fam">{parents}</section>}

      {/* ------------------------------------------------------------- DAY */}
      <section className="kn-ink__day">
        <InkDay lang={lang} iso={iso} stops={stops} />
        <Rule />
      </section>

      {/* ----------------------------------------------------------- VENUE */}
      <section className="kn-ink__venue">
        <h2 className="kn-ink__title kn-ink__title--where">{t(lang, L.where)}</h2>
        <span className="kn-ink__hair" aria-hidden="true" />
        <p className="kn-ink__place">
          {venue && <b>{venue}</b>}
          {address && <span>{address}</span>}
        </p>
        <div className="kn-ink__sketch">
          <Image src={sketch} alt="" sizes="(max-width: 640px) 94vw, 590px" placeholder="blur" />
        </div>
        {/* the file always offers the map: a pasted link wins, otherwise a
            search for the venue itself — the fallback MapCard uses */}
        {showMap && (venue || address || mapUrl) && (
          <a
            className="kn-ink__map"
            href={mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue, address].filter(Boolean).join(", "))}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(lang, L.openMap)}
          </a>
        )}
      </section>

      {/* ----------------------------------------------------------- DRESS */}
      {showDress && (
        <section className="kn-ink__dress">
          <Rule />
          <h2 className="kn-ink__title kn-ink__title--dress">{t(lang, L.dress)}</h2>
          <p className="kn-ink__body kn-ink__body--dress">{t(lang, L.dressNote)}</p>
          <Bows colors={dress!} />
        </section>
      )}

      {/* ----------------------------------------------------------- GIFTS */}
      {showGifts && (
        <section className="kn-ink__gifts">
          <Rule />
          <h2 className="kn-ink__title kn-ink__title--gifts">{t(lang, L.giftsTitle)}</h2>
          <div className="kn-ink__note">
            <h3>{t(lang, L.gifts)}</h3>
            {gifts.length ? (
              <ul className="kn-ink__body">
                {gifts.map((g, i) => (
                  <li key={i}><b>{g.label}</b>{g.value && <> — {g.value}</>}{g.note && <> · {g.note}</>}</li>
                ))}
              </ul>
            ) : (
              <p className="kn-ink__body">{t(lang, L.giftsNote)}</p>
            )}
          </div>
          <div className="kn-ink__note">
            <h3>{t(lang, L.wish)}</h3>
            <p className="kn-ink__body">{t(lang, L.wishNote)}</p>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ CARE */}
      <Ornament a={ink.longLoop} className="kn-ink__loop2" />
      {sample && (
        <section className="kn-ink__care">
          <h2 className="kn-ink__title kn-ink__title--care">{t(lang, L.care)}</h2>
          <p className="kn-ink__body kn-ink__body--care">{t(lang, L.careNote)}</p>
          {/* sample handles: previews only (see the header) */}
          <ul className="kn-ink__contacts">
            <li><Image src={whatsapp} alt="WhatsApp" className="kn-ink__ico kn-ink__ico--wa" /><span>+374 99 12 34 56<br />WhatsApp</span></li>
            <li><Image src={facebook} alt="Facebook" className="kn-ink__ico kn-ink__ico--fb" /><span>facebook.com/{a.toLowerCase().replace(/[^a-z]/g, "") || "nare"}.wedding<br />Facebook</span></li>
          </ul>
        </section>
      )}

      {/* ------------------------------------------------------------ BAND */}
      {rsvp && (
        <div className="kn-ink__band">
          <Ornament a={ink.band} box={[0, 0, ink.band.w, EDGE_TOP]} className="kn-ink__edge" />
          <div className="kn-ink__bandIn">{rsvp}</div>
          <Ornament a={ink.band} box={[0, ink.band.h - EDGE_BOT, ink.band.w, EDGE_BOT]} className="kn-ink__edge" />
        </div>
      )}
      {wishes}
      {thanks}

      {/* ----------------------------------------------------------- CLOSE */}
      <section className="kn-ink__close">
        <Ornament a={ink.heartLine} className="kn-ink__loop3" />
        <p className="kn-ink__wait">{t(lang, L.wait)}</p>
        <div className="kn-ink__end">
          <Plate img={endPhoto} alt={endAlt} sizes="(max-width: 640px) 100vw, 600px" ratio="1920 / 2147" />
        </div>
      </section>
    </div>
  );
}
