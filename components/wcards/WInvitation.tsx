"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Motion from "@/components/Motion";
import Share from "@/components/Share";
import MusicDock from "@/components/ui/MusicDock";
import { Countdown, MapCard, TemplateRsvp } from "@/components/templates/blocks/Blocks";
import DayRoute from "@/components/invitations/DayRoute";
import { guessIcon } from "@/lib/invitations/fromDraft";
import { wcards as C, type Lang, type T } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Draft } from "@/lib/draft";
import { findBackdrop, wDateLine, type WCard, type WVariant } from "@/lib/wcards";
import EnvelopeScene from "./EnvelopeScene";
import WCardFace from "./WCardFace";
import WMotifSprite from "./WMotifs";

// ============================================================================
// THE GUEST LINK for a wedding card — /invitation/wed-<design>-<colour>?p=…&g=…
// or the short id the studio minted. The envelope, addressed to the guest,
// opens; the card comes out; then the day in tappable form: programme,
// countdown, place with a map, calendar, RSVP by side (the wedding one, with
// plus-one and diet), share.
// ============================================================================

const same = (x: string): T => ({ hy: x, en: x });

export default function WInvitation({ lang, card, variant, draft, blob, guest , eventId }: { lang: Lang; card: WCard; variant: WVariant; draft?: Draft; blob?: string; guest?: string   /** a minted link's id — RSVPs tag with THIS so each link keeps its own list */
  eventId?: string;
}) {
  const base = lang === "hy" ? "" : "/en";
  const sample = !draft;
  const a = draft?.a || (lang === "hy" ? "Նարե" : "Nare"), b = draft?.b || (lang === "hy" ? "Հայկ" : "Hayk");
  const date = draft?.date ?? "2026-10-10", time = draft?.time ?? "15:00";
  const city = draft?.city || (lang === "hy" ? "Երևան" : "Yerevan");
  const venue = draft?.venue || (lang === "hy" ? "Սուրբ Աստվածածին եկեղեցի" : "Surb Astvatsatsin Church");
  const address = draft?.address || (lang === "hy" ? "Երևան" : "Yerevan");
  const iso = `${date}T${time}:00+04:00`;
  const stops = draft?.stops?.length ? draft.stops.map((x) => ({ time: x.time, name: x.name, place: x.place || x.address })) : undefined;
  const tlStops = (stops ?? (lang === "hy"
    ? [{ time: "12:30", name: "Հարսի տուն", place: "Մաշտոցի պող. 24" }, { time: "15:00", name: "Պսակադրություն", place: venue }, { time: "18:00", name: "Հարսանյաց խնջույք", place: "«Ոսկե Այգի»" }]
    : [{ time: "12:30", name: "The bride's home", place: "24 Mashtots Ave" }, { time: "15:00", name: "The ceremony", place: venue }, { time: "18:00", name: "The banquet", place: "Voske Aygi hall" }]))
    .map((x) => ({ time: x.time, name: same(x.name), place: same(x.place) }));
  const choice = { cover: draft?.envCover ?? variant.cover, liner: draft?.envLiner ?? variant.liner, stamp: draft?.envStamp, seal: draft?.envSeal, backdrop: draft?.envBack ?? variant.backdrop };
  const backdrop = findBackdrop(choice.backdrop);
  const [settled, setSettled] = useState(false);
  const hasBack = card.features.includes("backside");
  const initials: [string, string] = [[...a][0] ?? "", [...b][0] ?? ""];
  const face = { a, b, date, time, venue, address, city, rsvpBy: draft?.rsvpBy, host: draft?.host, note: draft?.note, stops, photos: draft?.photo ? [draft.photo] : undefined, guest };

  const style = {
    "--tp-bg": variant.paper, "--tp-fg": backdrop.dark ? "#f3efe7" : "#1c1a17", "--tp-soft": backdrop.dark ? "#c9c2b4" : "#4a453d", "--tp-acc": variant.a, "--tp-acc-ink": backdrop.dark ? variant.c : variant.a, "--tp-panel": backdrop.dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)",
    "--f-tp": "var(--f-display)", "--wi-back": backdrop.css,
  } as React.CSSProperties;

  return (
    <div className={`kn-wi${backdrop.dark ? " kn-wi--dark" : ""}${settled ? " kn-wi--settled" : ""}`} style={style} data-tpl={`wed-${card.id}-${variant.id}`}>
      <WMotifSprite />
      <Motion />
      <div className="kn-ki__chrome">
        <Link href={`${base}/wedding-cards`} className="kn-tp__back"><Icon name="chevron" size={16} /> ԿՆԻՔ</Link>
        <Link href={`${lang === "hy" ? "/en" : ""}/invitation/wed-${card.id}-${variant.id}${blob ? `?p=${blob}` : ""}${guest ? `${blob ? "&" : "?"}g=${encodeURIComponent(guest)}` : ""}`} className="kn-tp__lang">{lang === "hy" ? "EN" : "ՀԱՅ"}</Link>
      </div>

      <section className="kn-wi__hero" aria-label={t(lang, C.envelope)}>
        <EnvelopeScene lang={lang} card={card} choice={choice} guest={guest} names={`${a} ${lang === "hy" ? "և" : "&"} ${b}`} city={city} initials={initials} onSettled={() => setSettled(true)}
          front={<WCardFace card={card} variant={variant} lang={lang} {...face} />}
          back={hasBack ? <WCardFace card={card} variant={variant} lang={lang} side="back" {...face} /> : undefined} />
        <a href="#details" className="kn-wi__down" aria-label={t(lang, C.details)}><Icon name="chevron" size={18} /></a>
      </section>

      <main className="kn-ki__main kn-wi__main" id="details">
        <section className="kn-ki__grid">
          <div className="kn-tb kn-ki__when" data-rise>
            <p className="kn-tb__label">{t(lang, C.when)}</p>
            <h3 data-words>{wDateLine(lang, date)}</h3>
            <p className="kn-tb__soft">{time}</p>
            <a className="kn-tb__btn" href={`/api/ics?p=${blob ?? ""}${blob ? "" : "&t=wedding-1"}`} download={`${date}.ics`}><Icon name="calendar" size={16} /> {lang === "hy" ? "Ավելացնել օրացույցում" : "Add to calendar"}</a>
          </div>
          <Countdown lang={lang} iso={iso} />
          <DayRoute
            lang={lang}
            variant="classic"
            directions
            stops={tlStops.map((x, i) => ({ id: `s${i}`, icon: guessIcon(t(lang, x.name), "wedding", i), time: x.time, title: x.name, venue: x.place, mapUrl: i === 0 ? draft?.map : undefined }))}
          />
          <MapCard lang={lang} venue={venue} address={address} city={city} url={draft?.map} />
          {(draft?.host || draft?.note || sample) && (
            <div className="kn-tb kn-ki__note" data-rise>
              {(draft?.host || sample) && (<><p className="kn-tb__label">{lang === "hy" ? "Հրավիրում են" : "Invited by"}</p><h3>{draft?.host ?? (lang === "hy" ? "Ավագյան և Մանուկյան ընտանիքները" : "The Avagyan and Manukyan families")}</h3></>)}
              {draft?.note && <p className="kn-ki__noteText">“{draft.note}”</p>}
            </div>
          )}
          <TemplateRsvp lang={lang} kind="inline" id={eventId ?? `wed-${card.id}`} />
          <div className="kn-tb kn-ki__share" data-rise><Share lang={lang} /></div>
        </section>
        <footer className="kn-ki__foot">
          <p>{a} {lang === "hy" ? "և" : "&"} {b}</p>
          <small>ԿՆԻՔ — {sample ? t(lang, C.sample) : lang === "hy" ? "թվային հրավեր" : "digital invitation"}</small>
        </footer>
      </main>
      {draft?.music && <MusicDock src={draft.music} label={draft.music.split("/").pop() ?? "music"} dark={backdrop.dark} />}
    </div>
  );
}
