import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";
import type { Draft } from "@/lib/draft";

// ============================================================================
// THE TWO FAMILIES + THE MONTH AT A GLANCE — two blocks after the reference
// editor's anatomy (2026-08-26), rebuilt in this project's own grammar:
//
//   ParentsAnnounce — both sets of parents, each column over its side's
//     child, under the line every classical invitation opens with: «with
//     joyful hearts we announce the wedding of our children». Renders ONLY
//     when the couple filled at least one parent — the samples never invent
//     families.
//
//   MiniCalendar — the event's month as a real grid, the day ringed in the
//     template's accent. Pure computation, server-rendered, no state: the
//     ring is the only ornament and it is drawn, not animated.
// ============================================================================

const L = {
  announce: {
    hy: "Ուրախությամբ հայտնում ենք մեր զավակների ամուսնության մասին",
    en: "With joyful hearts we announce the wedding of our children",
    ru: "С радостью объявляем о бракосочетании наших детей",
  },
  announceEng: {
    hy: "Ուրախությամբ հայտնում ենք մեր զավակների նշանադրության մասին",
    en: "With joyful hearts we announce the engagement of our children",
    ru: "С радостью объявляем о помолвке наших детей",
  },
  groomSide: { hy: "Փեսայի ծնողները", en: "The groom's parents", ru: "Родители жениха" },
  brideSide: { hy: "Հարսի ծնողները", en: "The bride's parents", ru: "Родители невесты" },
  groom: { hy: "Փեսա", en: "The groom", ru: "Жених" },
  bride: { hy: "Հարս", en: "The bride", ru: "Невеста" },
} satisfies Record<string, T>;

export function ParentsAnnounce({ lang, parents, a, b, engagement, announce, roleA, roleB, familyFirst, titleG, titleB, addrG, addrB }: {
  lang: Lang;
  parents: NonNullable<Draft["parents"]>;
  a: string;
  b?: string;
  engagement?: boolean;
  /** the editor's own opening message — replaces the classical line */
  announce?: string;
  /** the labels under the two names («Փեսա»/«Հարս» by default) */
  roleA?: string;
  roleB?: string;
  /** whose family (and name) stands first */
  familyFirst?: "groom" | "bride";
  /** the parents' title lines and family addresses, per side */
  titleG?: string;
  titleB?: string;
  addrG?: string;
  addrB?: string;
}) {
  const side = (label: T, title?: string, f?: string, m?: string, addr?: string) =>
    (f || m) ? (
      <div className="kn-fam__side">
        <p className="kn-fam__role">{title || t(lang, label)}</p>
        {f && <p className="kn-fam__name">{f}</p>}
        {m && <p className="kn-fam__name">{m}</p>}
        {addr && <p className="kn-fam__addr">{addr}</p>}
      </div>
    ) : null;
  const groomCol = side(L.groomSide, titleG, parents.gf, parents.gm, addrG);
  const brideCol = side(L.brideSide, titleB, parents.bf, parents.bm, addrB);
  const brideFirst = familyFirst === "bride";
  const childA = <p className="kn-fam__child" key="a"><b>{a}</b><small>{roleA || t(lang, L.groom)}</small></p>;
  const childB = b ? <p className="kn-fam__child" key="b"><b>{b}</b><small>{roleB || t(lang, L.bride)}</small></p> : null;
  return (
    <div className="kn-tb kn-fam" data-rise>
      <div className="kn-fam__sides">
        {brideFirst ? brideCol : groomCol}
        {brideFirst ? groomCol : brideCol}
      </div>
      <p className="kn-fam__announce" data-ink>{announce || t(lang, engagement ? L.announceEng : L.announce)}</p>
      <div className="kn-fam__couple">
        {brideFirst && childB ? childB : childA}
        <span className="kn-fam__amp" aria-hidden="true">&amp;</span>
        {brideFirst && childB ? childA : childB}
      </div>
    </div>
  );
}

/** the event's month, the day ringed — weekday initials per guest language */
const WD: Record<Lang, string[]> = {
  hy: ["Ե", "Ե", "Չ", "Հ", "Ո", "Շ", "Կ"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
  ru: ["П", "В", "С", "Ч", "П", "С", "В"],
};
const MONTHS: Record<Lang, string[]> = {
  hy: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};

export function MiniCalendar({ lang, iso }: { lang: Lang; iso: string }) {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7)) - 1;
  const day = Number(iso.slice(8, 10));
  if (!y || Number.isNaN(m) || !day) return null;
  const first = new Date(Date.UTC(y, m, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: Array<number | null> = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div className="kn-mcal" role="img" aria-label={`${MONTHS[lang][m]} ${y} — ${day}`}>
      <p className="kn-mcal__month">{MONTHS[lang][m]} {y}</p>
      <div className="kn-mcal__grid" aria-hidden="true">
        {WD[lang].map((w, i) => <span className="kn-mcal__wd" key={`w${i}`}>{w}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={`kn-mcal__d${d === day ? " is-day" : ""}`}>{d ?? ""}</span>
        ))}
      </div>
    </div>
  );
}
