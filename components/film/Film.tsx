import Image from "next/image";
import { t } from "@/lib/i18n";
import { stampFromIso, weekdayFromIso } from "@/lib/draft";
import type { TemplateSpec } from "@/lib/templates";
import type { Draft } from "@/lib/draft";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE FILM — the third way to invite, which the site has been promising as
// «Վիդեո-անիմացիայով / As a video animation · coming next». It is now built.
//
// A 9:16 stage that PLAYS ITSELF: five scenes cut from the invitation's own
// data and art — the names, the photograph, the day's route, the invitation
// sentence, the sign-off — each rising, holding and handing over to the next.
//
// WHY PURE CSS, NO JS CLOCK. Every move is a CSS animation with a declared
// delay on one shared timeline. That buys three things at once:
//   · it plays on arrival with no interaction (no autoplay policy applies to
//     animation, only to sound), on any phone, inside any messenger's browser;
//   · it is DETERMINISTIC — scripts/film-render.mjs seeks the Web Animations
//     timeline frame by frame and encodes a REAL .mp4 from the same page, so
//     the film a couple posts to Instagram is this exact composition;
//   · reduced motion needs no fallback logic: the CSS simply stops animating
//     and every scene is laid out as a legible poster instead (see §47).
//
// The couple's draft is applied the same way it is everywhere else: what they
// typed replaces the sample, what they left keeps the template's own words.
// ============================================================================

/** the film's own small draft application — names, day, place, programme, photos */
function apply(s: TemplateSpec, d?: Draft) {
  const same = (x: string) => ({ hy: x, en: x });
  const ev = s.event;
  const first = d?.stops[0]?.time ?? d?.time;
  return {
    a: d?.a?.trim() ? same(d.a.trim()) : ev.a,
    b: d?.b?.trim() ? same(d.b.trim()) : d?.a?.trim() ? undefined : ev.b,
    kicker: ev.kicker,
    date: d?.date ? `${d.date}T${first ?? "12:00"}:00+04:00` : ev.date,
    city: d?.city?.trim() ? same(d.city.trim()) : ev.city,
    venue: d?.venue?.trim() ? same(d.venue.trim()) : ev.venue,
    stops: d?.stops.length ? d.stops.map((x) => ({ time: x.time, name: same(x.name), place: same(x.place || x.address) })) : ev.stops,
    photos: (d?.photos ?? []) as string[],
  };
}

const L = {
  invite: {
    hy: "Ուրախ ենք հրավիրել ձեզ մեր օրվան",
    en: "We would be glad to have you with us",
    ru: "Будем рады видеть вас в наш день",
  } as T,
  rsvp: { hy: "Պատասխանը՝ հրավերի հղումով", en: "RSVP in the invitation link", ru: "Ответ — по ссылке приглашения" } as T,
  mark: { hy: "ԿՆԻՔ", en: "ԿՆԻՔ", ru: "ԿՆԻՔ" } as T,
};

/** one scene: `at` is its start on the shared timeline, `len` how long it holds */
function Scene({ at, len, className = "", children }: { at: number; len: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`kn-film__scene ${className}`} style={{ "--at": `${at}s`, "--len": `${len}s` } as React.CSSProperties}>
      {children}
    </div>
  );
}

/** a line inside a scene: `in` is its own delay AFTER the scene opens */
function Line({ in: delay = 0, className = "", children }: { in?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`kn-film__line ${className}`} style={{ "--in": `${delay}s` } as React.CSSProperties}>
      {children}
    </div>
  );
}

export default function Film({ lang, s, draft }: { lang: Lang; s: TemplateSpec; draft?: Draft }) {
  const e = apply(s, draft);
  const th = s.theme;
  const names = e.b ? `${t(lang, e.a)} · ${t(lang, e.b)}` : t(lang, e.a);
  const mono = t(lang, e.a).slice(0, 1) + (e.b ? t(lang, e.b).slice(0, 1) : "");
  // the couple's own pictures first; the template's plates behind them
  const shots: Array<string | typeof s.cover> = [
    e.photos[0] ?? s.cover,
    e.photos[1] ?? s.gallery[0]?.img ?? s.cover,
  ];
  const stops = e.stops.slice(0, 3);
  const style = {
    "--tp-bg": th.bg, "--tp-fg": th.fg, "--tp-soft": th.fgSoft,
    "--tp-acc": th.accent, "--tp-acc-ink": th.accentInk, "--tp-panel": th.panel,
  } as React.CSSProperties;

  return (
    <div className={`kn-film${th.dark ? " kn-film--dark" : ""}`} style={style} data-tpl={s.id}>
      {/* the 9:16 stage — everything inside it is the film; the chrome that
          surrounds it (replay, share) lives outside, so a capture is clean */}
      <div className="kn-film__stage" role="img" aria-label={`${names} — ${stampFromIso(e.date)}`}>
        {/* ---------------------------------------------- 1 the names (0–5s) */}
        <Scene at={0} len={5} className="kn-film__scene--open">
          <Line in={0.5}><p className="kn-film__kick">{t(lang, e.kicker)}</p></Line>
          <Line in={1.1}><p className="kn-film__mono" aria-hidden="true">{mono}</p></Line>
          <Line in={1.5}><h1 className="kn-film__names">{t(lang, e.a)}</h1></Line>
          {e.b && <Line in={1.9}><p className="kn-film__amp" aria-hidden="true">{lang === "hy" ? "և" : "&"}</p></Line>}
          {e.b && <Line in={2.2}><h2 className="kn-film__names">{t(lang, e.b)}</h2></Line>}
          <Line in={2.8}><span className="kn-film__rule" aria-hidden="true" /></Line>
        </Scene>

        {/* ------------------------------------------ 2 the photograph (4.5–10) */}
        <Scene at={4.5} len={5.5} className="kn-film__scene--photo">
          <div className="kn-film__plate">
            <Image src={shots[0] as string} alt="" fill sizes="480px" priority />
          </div>
          <div className="kn-film__over">
            <Line in={0.8}><p className="kn-film__day">{stampFromIso(e.date)}</p></Line>
            <Line in={1.3}><p className="kn-film__soft">{t(lang, weekdayFromIso(e.date))} · {t(lang, e.city)}</p></Line>
          </div>
        </Scene>

        {/* --------------------------------------------- 3 the day's route (9.5–15) */}
        <Scene at={9.5} len={5.5} className="kn-film__scene--route">
          <Line in={0.4}><p className="kn-film__kick">{t(lang, e.venue)}</p></Line>
          <ol className="kn-film__stops">
            {stops.map((st, i) => (
              <li key={i} className="kn-film__line" style={{ "--in": `${0.9 + i * 0.55}s` } as React.CSSProperties}>
                <b>{st.time}</b>
                <span>{t(lang, st.name)}</span>
                <small>{t(lang, st.place)}</small>
              </li>
            ))}
          </ol>
        </Scene>

        {/* ------------------------------------- 4 the second picture (14.5–19.5) */}
        <Scene at={14.5} len={5} className="kn-film__scene--photo kn-film__scene--photo2">
          <div className="kn-film__plate">
            <Image src={shots[1] as string} alt="" fill sizes="480px" />
          </div>
          <div className="kn-film__over">
            <Line in={0.7}><p className="kn-film__invite">{t(lang, L.invite)}</p></Line>
          </div>
        </Scene>

        {/* ---------------------------------------------- 5 the sign-off (19–23.5) */}
        <Scene at={19} len={4.5} className="kn-film__scene--end">
          <Line in={0.4}><p className="kn-film__mono" aria-hidden="true">{mono}</p></Line>
          <Line in={0.8}><h2 className="kn-film__names kn-film__names--end">{names}</h2></Line>
          <Line in={1.3}><p className="kn-film__day kn-film__day--end">{stampFromIso(e.date)}</p></Line>
          <Line in={1.9}><p className="kn-film__soft">{t(lang, L.rsvp)}</p></Line>
          <Line in={2.5}><p className="kn-film__mark">{t(lang, L.mark)}</p></Line>
        </Scene>
      </div>
    </div>
  );
}
