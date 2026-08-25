"use client";

import Icon from "@/components/Icon";
import { DressForms, RoseBloom, TableSketch } from "@/components/templates/FloralArt";
import { Corners } from "@/components/ui/Fx";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE SECOND SHELF OF BLOCKS — what the four reference invitations carry that
// the first shelf did not (2026-08-23):
//
//   Entourage   the wedding party in columns — parents, godparents, witnesses
//   GiftNote    the gift line every reference words almost identically
//   SeatNote    «two seats are kept for you» — the sage reference's card
//   AdultsNote  the adults-only sentence, said gently
//   PlanPlace   the hand-sketched guest table and the seating-plan promise
//   GuestChat   the couple's guest chat — named, NOT linked: a sample page
//               invents no destinations, so the chip is inert by design and
//               the couple's real link arrives with their order
//   QuoteBand   a scripture or a line, set alone
//
// All of it renders from template data and the house tokens; every string is
// trilingual, because these blocks face the GUEST.
// ============================================================================

const S = {
  entourage: { hy: "Մեր հարազատները", en: "The wedding party", ru: "Наши близкие" },
  gift: { hy: "Նվերների մասին", en: "About gifts", ru: "О подарках" },
  giftBody: {
    hy: "Ձեր ներկայությունը մեզ համար ամենաթանկ նվերն է։ Իսկ եթե ցանկանում եք նվեր մատուցել, երախտապարտ կլինենք ներդրման համար մեր ընտանիքի ապագայում։",
    en: "Your presence is the dearest gift of all. If you wish to give something more, we would be grateful for a contribution to our future together.",
    ru: "Ваше присутствие — самый дорогой подарок. Если захотите подарить больше, будем благодарны за вклад в наше общее будущее.",
  },
  seats: { hy: "Ձեզ համար պահված է", en: "Reserved for you", ru: "Для вас забронировано" },
  seatsWord: { hy: "տեղ", en: "seats", ru: "места" },
  adults: { hy: "Միայն մեծահասակների երեկո", en: "Adults only, please", ru: "Вечер только для взрослых" },
  adultsBody: {
    hy: "Հուսով ենք՝ կհասկանաք. մեր օրը նշում ենք առանց փոքրիկների։",
    en: "We hope you understand — our day is a grown-ups' celebration.",
    ru: "Надеемся на понимание: наш день мы отмечаем без малышей.",
  },
  plan: { hy: "Հյուրերի նստատեղերը", en: "The guest seating", ru: "Рассадка гостей" },
  planBody: {
    hy: "Կարևոր է, որ ձեզ հարմար լինի․ նստատեղերի պլանը կհրապարակվի օրվան մոտ։",
    en: "We want you comfortable — the seating plan is published closer to the day.",
    ru: "Нам важно, чтобы вам было удобно: план рассадки появится ближе к дате.",
  },
  planChip: { hy: "Պլանը՝ շուտով", en: "The plan, soon", ru: "План — скоро" },
  chat: { hy: "Հյուրերի զրուցարան", en: "The guests' chat", ru: "Чат гостей" },
  chatBody: {
    hy: "Օրվա նորությունները, փոփոխությունները և լուսանկարները՝ մեկ տեղում։ Հրավերի հետ կստանաք միանալու հղումը։",
    en: "The day's news, changes and photographs, in one place. The join link arrives with your invitation.",
    ru: "Новости дня, изменения и фотографии — в одном месте. Ссылка придёт вместе с приглашением.",
  },
  chatChip: { hy: "Միանալ զրուցարանին", en: "Join the chat", ru: "Вступить в чат" },
  chatNote: { hy: "Հղումը՝ անվանական հրավերի հետ", en: "The link comes with your personal invitation", ru: "Ссылка — с именным приглашением" },
} as const;

/** the wedding party, in columns — data lives on the template spec */
export function Entourage({ lang, groups }: { lang: Lang; groups: Array<{ role: T; names: string[] }> }) {
  return (
    <div className="kn-tb kn-tb--ent" data-rise>
      <p className="kn-tb__label">{t(lang, S.entourage)}</p>
      <div className="kn-ent">
        {groups.map((g, i) => (
          <div className="kn-ent__col" key={i}>
            <p className="kn-ent__role">{t(lang, g.role)}</p>
            {g.names.map((n) => (
              <p className="kn-ent__name" key={n}>{n}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GiftNote({ lang }: { lang: Lang }) {
  return (
    <div className="kn-tb kn-tb--gift" data-rise>
      <p className="kn-tb__label">{t(lang, S.gift)}</p>
      <p className="kn-tb__p">{t(lang, S.giftBody)}</p>
    </div>
  );
}

export function SeatNote({ lang, seats }: { lang: Lang; seats: number }) {
  return (
    <div className="kn-tb kn-tb--seats" data-rise>
      <p className="kn-tb__label">{t(lang, S.seats)}</p>
      {/* the sage reference's drawn chair, standing beside the number */}
      <svg viewBox="0 0 60 72" className="kn-seats__chair" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M16 6 q -4 20 -2 30 m 30 -30 q 4 20 2 30 M14 36 h 34 M16 36 q -2 20 -4 30 m 32 -30 q 2 20 4 30 M18 50 h 26" />
        <path d="M18 14 q 12 -6 26 0 M17 24 q 13 -6 27 0" strokeOpacity="0.7" />
      </svg>
      <p className="kn-seats"><b data-count>{String(seats)}</b> <span>{t(lang, S.seatsWord)}</span></p>
    </div>
  );
}

/** the couple's story, told short — the torn-blue reference's script band:
 *  a deep-blue torn panel, the title in italics, the story in white */
export function LoveStory({ lang, story }: { lang: Lang; story: T }) {
  const title = { hy: "Մեր պատմությունը", en: "Our love story", ru: "Наша история" };
  return (
    <div className="kn-tb kn-tb--story" data-rise>
      <p className="kn-story__t" data-ink>{t(lang, title)}</p>
      <p className="kn-story__p">{t(lang, story)}</p>
    </div>
  );
}

export function AdultsNote({ lang }: { lang: Lang }) {
  return (
    <div className="kn-tb kn-tb--adults" data-rise>
      <p className="kn-tb__label">{t(lang, S.adults)}</p>
      <p className="kn-tb__p">{t(lang, S.adultsBody)}</p>
    </div>
  );
}

/** the seating plan — the sketch is the content; the chip is INERT because a
 *  sample invitation invents no destinations */
export function PlanPlace({ lang }: { lang: Lang }) {
  return (
    <div className="kn-tb kn-tb--plan" data-rise>
      <p className="kn-tb__label">{t(lang, S.plan)}</p>
      <span className="kn-plan__art" data-hover-tilt><TableSketch className="kn-plan__svg" /></span>
      <p className="kn-tb__p">{t(lang, S.planBody)}</p>
      <span className="kn-chip kn-chip--mute" aria-disabled="true">{t(lang, S.planChip)}</span>
    </div>
  );
}

/** the guests' chat — named honestly, linked never (see the file's header) */
export function GuestChat({ lang }: { lang: Lang }) {
  return (
    <div className="kn-tb kn-tb--chat" data-rise>
      <p className="kn-tb__label"><Icon name="telegram" size={14} /> {t(lang, S.chat)}</p>
      <p className="kn-tb__p">{t(lang, S.chatBody)}</p>
      <span className="kn-chip kn-chip--mute" aria-disabled="true">{t(lang, S.chatChip)}</span>
      <small className="kn-chat__note">{t(lang, S.chatNote)}</small>
    </div>
  );
}

/** the white greeting panel of the velvet strip: «Dear friends», the invite
 *  line, the day set huge with a small bloom beside it, the closing line */
export function Greeting({ lang, iso }: { lang: Lang; iso: string }) {
  const S2 = {
    dear: { hy: "Սիրելի՛ բարեկամներ", en: "Dear friends!", ru: "Дорогие друзья!" },
    line: {
      hy: "Հրավիրում ենք նշելու մեր կյանքի ամենակարևոր իրադարձությունը՝ մեր հարսանիքի օրը։",
      en: "We invite you to celebrate the most important day of our lives — our wedding day.",
      ru: "Приглашаем отпраздновать самое важное событие в нашей жизни — день свадьбы!",
    },
    close: { hy: "Ուրախ կլինենք տեսնել ձեզ մեր հյուրերի շրջանում։", en: "We will be glad to see you among our guests.", ru: "Мы будем рады видеть Вас в кругу наших гостей!" },
  } as const;
  const d = `${Number(iso.slice(8, 10))}.${iso.slice(5, 7)}.${iso.slice(2, 4)}`;
  // the petals scattered on the reference's white panel, drawn still —
  // deterministic positions, so the server and the client scatter alike
  const petals = [[8, 18, -24], [86, 8, 40], [16, 74, 130], [90, 62, -60], [50, 90, 12], [72, 30, 96], [30, 40, 70], [62, 14, -40], [12, 46, 20], [80, 84, 150]];
  return (
    <div className="kn-tb kn-tb--greet" data-rise>
      <svg viewBox="0 0 100 100" className="kn-greet__petals" aria-hidden="true" preserveAspectRatio="none">
        {petals.map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={i % 3 ? 2.8 : 3.8} ry={i % 3 ? 1.5 : 2} fill={i % 2 ? "#8E1F2F" : "#B03A48"} opacity={0.85} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </svg>
      <Corners inset={12} />
      <p className="kn-greet__dear">{t(lang, S2.dear)}</p>
      <p className="kn-tb__p">{t(lang, S2.line)}</p>
      <p className="kn-greet__date" data-ink>
        {/* the small bloom tucked at the date, as in the strip */}
        <span className="kn-greet__rose" aria-hidden="true"><RoseBloom size={34} seed={41} /></span>
        {d}
      </p>
      <p className="kn-tb__p">{t(lang, S2.close)}</p>
    </div>
  );
}

/** the DETAILS band: the organizer's line and the drawn bouquet-and-bottle —
 *  the chip inert, as every sample destination is */
export function DetailsBand({ lang, art }: { lang: Lang; art?: React.ReactNode }) {
  const S3 = {
    t: { hy: "Մանրամասներ", en: "Details", ru: "Детали" },
    sub: { hy: "Խորհուրդներ", en: "Recommendations", ru: "Рекомендации" },
    body: {
      hy: "Հարսանիքի օրը ծագած ցանկացած հարցով խնդրում ենք դիմել մեր կազմակերպչին։",
      en: "For any question on the wedding day, please turn to our organizer.",
      ru: "По всем возникающим вопросам в день свадьбы просим обращаться к нашему организатору.",
    },
    ask: { hy: "Հարցնել կազմակերպչին", en: "Ask the organizer", ru: "Спросить организатора" },
    note: { hy: "Կապը՝ անվանական հրավերի հետ", en: "The contact comes with your invitation", ru: "Контакт — с именным приглашением" },
  } as const;
  return (
    <div className="kn-tb kn-tb--det" data-rise>
      <p className="kn-det__t" data-ink>{t(lang, S3.t)}</p>
      <p className="kn-det__sub">{t(lang, S3.sub)}</p>
      <p className="kn-tb__p">{t(lang, S3.body)}</p>
      <span className="kn-chip kn-chip--paper" aria-disabled="true">{t(lang, S3.ask)}</span>
      <small className="kn-chat__note">{t(lang, S3.note)}</small>
      {art}
    </div>
  );
}

/** the sage strip's two venue cards — the hour, the place, and the dark
 *  VIEW LOCATION pill (a real link when the couple pasted their map; the
 *  sample stays inert, as every sample destination does) */
export function VenueCards({ lang, stops, mapUrl }: { lang: Lang; stops: Array<{ time: string; name: T; place: T }>; mapUrl?: string }) {
  const view = { hy: "Դիտել քարտեզում", en: "View location", ru: "Смотреть на карте" };
  return (
    <div className="kn-tb kn-tb--venues" data-rise>
      {stops.slice(0, 2).map((s, i) => (
        <div className="kn-venue" key={i}>
          <p className="kn-venue__time">{s.time}</p>
          <p className="kn-venue__name" data-ink>{t(lang, s.name)}</p>
          <p className="kn-venue__place">{t(lang, s.place)}</p>
          {i === 0 && mapUrl ? (
            <a className="kn-chip kn-chip--pill" href={mapUrl} target="_blank" rel="noopener">{t(lang, view)}</a>
          ) : (
            <span className="kn-chip kn-chip--pill" aria-disabled="true">{t(lang, view)}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/** THE DRESS CODE, said properly (2026-08-24): the drawn gown and suit, the
 *  palette with every colour NAMED (a swatch a guest cannot name is a swatch
 *  they cannot shop), what is welcome, and the one thing to avoid — the ask
 *  every reference makes in words, not only in dots. Names come from the
 *  template when it has them; otherwise each colour names itself in hex, so
 *  nothing here ever invents a colour's story. */
export function DressCodeRich({ lang, colors, names, avoid }: { lang: Lang; colors: string[]; names?: T[]; avoid?: T }) {
  const S4 = {
    t: { hy: "Հագուստի կոդը", en: "Dress code", ru: "Дресс-код" },
    sub: { hy: "Արտաքին տեսք", en: "How to dress", ru: "Внешний вид" },
    body: {
      hy: "Ուրախ կլինենք տեսնել ձեզ մեր օրվա գունային գամմայում՝ նախընտրելի են երեկոյան զգեստներն ու կոստյումները։",
      en: "We would love to see you in our day's palette — evening dresses and suits, please.",
      ru: "Будем рады видеть вас в цветовой гамме нашего дня — вечерние платья и костюмы.",
    },
    avoidWord: { hy: "Խնդրում ենք խուսափել", en: "Please avoid", ru: "Просим избегать" },
    defaultAvoid: {
      hy: "սպիտակից և ճերմակի երանգներից — այն թողնենք հարսին։",
      en: "white and ivory — let us leave those to the bride.",
      ru: "белого и цвета айвори — оставим их невесте.",
    },
  } as const;
  return (
    <div className="kn-tb kn-tb--dress kn-tb--dressRich" data-rise>
      <p className="kn-tb__label" data-ink>{t(lang, S4.t)}</p>
      <p className="kn-dressR__sub">{t(lang, S4.sub)}</p>
      <span className="kn-dressR__art" data-hover-tilt><DressForms className="kn-dress__svg" /></span>
      <p className="kn-tb__p">{t(lang, S4.body)}</p>
      <ul className="kn-dressR__swatches" data-pop="">
        {colors.map((c, i) => (
          <li key={c + i}>
            <span className="kn-dressR__dot" style={{ background: c }} />
            <small>{names?.[i] ? t(lang, names[i]) : c.toUpperCase()}</small>
          </li>
        ))}
      </ul>
      <p className="kn-dressR__avoid">
        <b>{t(lang, S4.avoidWord)}:</b> {t(lang, avoid ?? S4.defaultAvoid)}
      </p>
    </div>
  );
}

/** a small drawn leaf flourish, centred — the sage strip's section divider */
export function LeafRule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 22" className={className} aria-hidden="true" fill="currentColor">
      <path d="M10 11 H 110" stroke="currentColor" strokeWidth="0.8" fill="none" strokeOpacity="0.5" />
      {[-3, -2, -1, 1, 2, 3].map((k) => (
        <ellipse key={k} cx={60 + k * 9} cy={11 + (k % 2 ? -3.4 : 3.4)} rx={4.6} ry={2.4} opacity={0.8 - Math.abs(k) * 0.09} transform={`rotate(${k * 18} ${60 + k * 9} 11)`} />
      ))}
      <circle cx="60" cy="11" r="1.6" />
    </svg>
  );
}

export function QuoteBand({ lang, quote }: { lang: Lang; quote: T }) {
  return (
    <div className="kn-tb kn-tb--quote" data-rise>
      <p className="kn-quote" data-ink>{t(lang, quote)}</p>
    </div>
  );
}

/** re-exported for the dress-code card that wants the drawn forms beside the
 *  swatches (the navy and velvet references both do) */
export function DressArt({ className }: { className?: string }) {
  return <span className={className} aria-hidden="true"><DressForms className="kn-dress__svg" /></span>;
}
