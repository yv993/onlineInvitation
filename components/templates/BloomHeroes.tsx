import type { StaticImageData } from "next/image";
import Plate from "@/components/Plate";
import { Daisy, Eucalyptus, Hydrangea, HydrangeaBed, RoseBed, RoseBloom } from "./FloralArt";
import { LeafRule } from "./blocks/Blocks2";
import { Corners } from "@/components/ui/Fx";
import { weekdayFromIso } from "@/lib/draft";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// FOUR HEROES, FOUR REFERENCES (2026-08-23) — each the opening screen of one
// of the client's phone-strip invitations, rebuilt as data-driven heroes the
// wizard can dress with a couple's own names, date and photograph:
//
//   TornHero    the torn-paper blue programme — THE WEDDING OF, the names
//               with an italic «and», the photograph wearing a giant
//               monogram, a three-cell date row, the scripture line
//   BloomHero   the hydrangea night — the date up top, drawn hydrangea heads
//               shouldering the script names out of the dark
//   RoseHero    the velvet roses — blooms in the corners, the two names
//               stacked tight and huge, the date on a chip
//   SprigHero   the eucalyptus vow — a hairline frame, the initials as a
//               monogram, the arched photograph, the invitation sentence,
//               the script names, a boxed date row
//
// The florals are FloralArt.tsx (deterministic SVG, the template's tokens);
// the photographs come through `photo`, which applyDraft has already swapped
// for the couple's own upload when there is one. Motion is the house
// vocabulary only — rise, letters, reveal, float, hover-tilt — so every one
// of these is finished and still for no-JS and reduced motion.
// ============================================================================

const MONTHS: Record<Lang, string[]> = {
  hy: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};
const parts = (lang: Lang, iso: string) => ({
  month: MONTHS[lang][Number(iso.slice(5, 7)) - 1] ?? "",
  day: iso.slice(8, 10),
  year: iso.slice(0, 4),
});

/** the three-cell date row every reference sets its day in: month | DAY | year */
function DateCells({ lang, iso }: { lang: Lang; iso: string }) {
  const p = parts(lang, iso);
  return (
    <p className="kn-bh__cells" data-rise>
      <span>{p.month}</span>
      <b data-count>{String(Number(p.day))}</b>
      <span>{p.year}</span>
    </p>
  );
}

type HeroBits = { lang: Lang; a: string; b: string; iso: string; kicker: T;
  /** an embedded preview must not plant an <h1> in the host document */
  embed?: boolean };

// ---------------------------------------------------------------- TORN BLUE
export function TornHero({ lang, a, b, iso, kicker, photo, photoAlt, quote, embed }: HeroBits & { photo: StaticImageData | string; photoAlt: string; quote?: T }) {
  const H = embed ? ("div" as const) : ("h1" as const);
  return (
    <div className="kn-bh kn-bh--torn">
      <span className="kn-bh__daisy kn-bh__daisy--tl" data-float="6"><Daisy seed={3} size={74} /></span>
      <span className="kn-bh__daisy kn-bh__daisy--br" data-float="7"><Daisy seed={11} size={92} /></span>
      <p className="kn-tp__kick" data-rise data-track>{t(lang, kicker)}</p>
      <H className="kn-bh__names" data-rise>
        <span data-letters>{a}</span>
        {b && <i>{lang === "hy" ? "և" : lang === "ru" ? "и" : "and"}</i>}
        {b && <span data-letters>{b}</span>}
      </H>
      <div className="kn-bh__photo" data-rise data-reveal data-hover-tilt>
        <Plate img={photo} alt={photoAlt} sizes="(max-width: 900px) 92vw, 520px" ratio="4 / 5" priority zoom drift={0.06} />
        <Corners />
        <span className="kn-bh__mono" aria-hidden="true">{a.slice(0, 1)}<i>&amp;</i>{b.slice(0, 1)}</span>
      </div>
      <DateCells lang={lang} iso={iso} />
      {quote && <p className="kn-bh__quote" data-rise data-ink>{t(lang, quote)}</p>}
    </div>
  );
}

// ------------------------------------------------------------ HYDRANGEA NIGHT
// The navy strip, move for move: a TALL FRAMED PHOTOGRAPH standing in the
// dark (the reference's palace staircase; the couple's own upload lands here
// through the cover seam), WEDDING DAY and the date small over it, the
// script names flowing across the photograph, pom heads cropping the frame's
// top corners — and below, the full-width hydrangea bed the white greeting
// panel tears out of.
export function BloomHero({ lang, a, b, iso, kicker, photo, photoAlt, embed }: HeroBits & { photo?: StaticImageData | string; photoAlt?: string }) {
  const H = embed ? ("div" as const) : ("h1" as const);
  const p = parts(lang, iso);
  return (
    <div className="kn-bh kn-bh--bloom">
      <div className="kn-bh__pane" data-rise data-reveal>
        {/* the pom heads hug the photograph's corners, as the strip crops them */}
        <span className="kn-bh__head kn-bh__head--tl" aria-hidden="true" data-float="8"><Hydrangea seed={2} size={172} tones={["#5F76B8", "#8CA3D8", "#D7E0F4"]} /></span>
        <span className="kn-bh__head kn-bh__head--tr" aria-hidden="true" data-float="6"><Hydrangea seed={9} size={128} tones={["#B9C4E0", "#E4E9F5", "#FFFFFF"]} /></span>
        {photo && <Plate img={photo} alt={photoAlt ?? ""} sizes="(max-width: 900px) 78vw, 420px" ratio="3 / 4" priority zoom drift={0.07} />}
        <Corners inset={8} />
        <p className="kn-bh__over kn-bh__over--two kn-bh__over--onpane" data-rise data-track>
          <span>{t(lang, kicker)}</span>
          <b>{String(Number(p.day))}.{iso.slice(5, 7)}.{p.year.slice(2)}</b>
        </p>
        <H className="kn-bh__script kn-bh__script--onpane" data-rise>
          <span data-letters>{a}</span>
          {b && <span data-letters>{b}</span>}
        </H>
      </div>
      <p className="kn-tp__meta" data-rise>{t(lang, weekdayFromIso(iso))}</p>
      {/* the bed the white greeting tears out of */}
      <HydrangeaBed className="kn-rosebed kn-rosebed--hyd" />
    </div>
  );
}

// --------------------------------------------------------------- VELVET ROSES
// The reference's hero, move for move: the dark doorway photograph filling
// the top; WEDDING DAY and the date, small; the names HUGE in white with a
// ghosted ampersand behind them; and below, the full-width BED OF ROSES the
// strip tears out of. A stray bloom rides the frame's edge, as in the strip.
export function RoseHero({ lang, a, b, iso, kicker, photo, photoAlt, embed }: HeroBits & { photo?: StaticImageData | string; photoAlt?: string }) {
  const H = embed ? ("div" as const) : ("h1" as const);
  const p = parts(lang, iso);
  return (
    <div className="kn-bh kn-bh--rose">
      {photo && (
        <div className="kn-bh__door" aria-hidden="true" data-reveal>
          <Plate img={photo} alt={photoAlt ?? ""} sizes="(max-width: 900px) 100vw, 640px" ratio="3 / 4" zoom drift={0.08} />
        </div>
      )}
      {/* the reference crops big blooms off the frame's top corners — so
          does this: one heavy red bleeding off top-left, a pink riding the
          right edge at the names, a small red at the date's shoulder */}
      <span className="kn-bh__stray kn-bh__stray--tl" aria-hidden="true" data-float="8"><RoseBloom size={168} seed={31} /></span>
      <span className="kn-bh__stray" aria-hidden="true" data-float="7"><RoseBloom size={104} seed={23} deep="#A65A6C" mid="#E8AFBD" lit="#F6D4DC" /></span>
      <span className="kn-bh__stray kn-bh__stray--l" aria-hidden="true" data-float="9"><RoseBloom size={64} seed={29} /></span>
      {/* two lines, as the strip sets them: WEDDING DAY over the date */}
      <p className="kn-bh__over kn-bh__over--two" data-rise data-track>
        <span>{t(lang, kicker)}</span>
        <b>{String(Number(p.day))}.{iso.slice(5, 7)}.{p.year.slice(2)}</b>
      </p>
      <H className="kn-bh__stack" data-rise>
        <span className="kn-bh__amp" aria-hidden="true">&amp;</span>
        <span data-letters>{a}</span>
        {b && <span data-letters>{b}</span>}
      </H>
      <p className="kn-bh__chip" data-rise>{p.month} {String(Number(p.day))} · {t(lang, weekdayFromIso(iso))}</p>
      {/* the bed the strip tears out of */}
      <RoseBed className="kn-rosebed" />
    </div>
  );
}

// ------------------------------------------------------------- EUCALYPTUS VOW
// The sage strip's first panel, top to bottom exactly as it runs: the
// scripture small under the branches · the initials as a monogram · OUR
// WEDDING between rule lines · the photograph, rectangular, a sprig
// overlapping its top edge · the invitation sentence · THE PARENTS in two
// columns · the script names with the «&» between the lines · the honour
// line · the month over the boxed date row · a drawn leaf rule to close.
export function SprigHero({ lang, a, b, iso, kicker, photo, photoAlt, invite, quote, groups, embed }: HeroBits & {
  photo: StaticImageData | string; photoAlt: string; invite?: T; quote?: T;
  groups?: Array<{ role: T; names: string[] }>;
}) {
  const H = embed ? ("div" as const) : ("h1" as const);
  const honor = {
    hy: "Պատիվ ունենք հրավիրելու ձեզ մեր հարսանիքին",
    en: "We have the honor of inviting you to our wedding",
    ru: "Имеем честь пригласить вас на нашу свадьбу",
  };
  return (
    <div className="kn-bh kn-bh--sprig">
      <span className="kn-bh__sprig kn-bh__sprig--tl" data-float="6"><Eucalyptus seed={4} size={130} /></span>
      <span className="kn-bh__sprig kn-bh__sprig--br" data-float="8"><Eucalyptus seed={12} size={150} flip /></span>
      {quote && <p className="kn-bh__verse" data-rise>{t(lang, quote)}</p>}
      <p className="kn-bh__init" data-rise aria-hidden="true">{a.slice(0, 1)}<i>|</i>{b.slice(0, 1)}</p>
      <p className="kn-tp__kick kn-bh__kickRules" data-rise data-track>{t(lang, kicker)}</p>
      <div className="kn-bh__frame" data-rise data-reveal data-hover-tilt>
        <span className="kn-bh__frameSprig" aria-hidden="true" data-float="7"><Eucalyptus seed={21} size={110} flip /></span>
        <Plate img={photo} alt={photoAlt} sizes="(max-width: 900px) 88vw, 460px" ratio="4 / 5" priority zoom drift={0.05} />
        <Corners inset={9} />
      </div>
      {invite && <p className="kn-bh__invite" data-rise>{t(lang, invite)}</p>}
      {groups && groups.length > 0 && (
        <div className="kn-bh__parents" data-rise>
          {groups.slice(0, 2).map((g, i) => (
            <div className="kn-bh__parcol" key={i}>
              <p className="kn-bh__parrole">{t(lang, g.role)}</p>
              {g.names.map((n) => <p className="kn-bh__parname" key={n}>{n}</p>)}
            </div>
          ))}
        </div>
      )}
      <H className="kn-bh__script kn-bh__script--ink" data-rise>
        <span data-letters>{a}</span>
        {b && <i className="kn-bh__scriptAmp" aria-hidden="true">&amp;</i>}
        {b && <span data-letters>{b}</span>}
      </H>
      <p className="kn-bh__invite" data-rise>{t(lang, honor)}</p>
      <p className="kn-bh__month" data-rise>{parts(lang, iso).month}</p>
      <div className="kn-bh__boxDate" data-rise>
        <span>{t(lang, weekdayFromIso(iso))}</span>
        <b data-count>{String(Number(iso.slice(8, 10)))}</b>
        <span>{iso.slice(0, 4)}</span>
      </div>
      <LeafRule className="kn-bh__leafrule" />
    </div>
  );
}
