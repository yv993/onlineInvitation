import { notFound } from "next/navigation";
import { admin } from "@/lib/content";
import { t } from "@/lib/i18n";
import { findLink, linkKeyOk, readRsvps } from "@/lib/server/store";

// a page for ONE couple and their guests — never a search result
export const metadata = { robots: { index: false, follow: false } };


// ============================================================================
// /guests/<id> — THE COUPLE'S OWN GUEST LIST (2026-08-25). The owner's
// /guests sees every answer on the server; this page sees exactly ONE minted
// link's answers, gated by the MANAGE KEY that came back with the link. This
// is the missing half of the promise the landing makes («the answers gather
// in your guest list»): before this page, a self-served couple had no door
// to their answers at all — and every couple on the same template shared one
// bucket, which the eventId thread (TemplateView) fixed the same day.
//
// Same contract as the owner page: SERVER-RENDERED, zero client JS, the key
// checked timing-safe on the server, nothing in the HTML unless it was
// right. The key travels as ?k=… — one private link the couple keeps.
// ============================================================================

export const dynamic = "force-dynamic"; // the list must never be cached
const lang = "hy" as const;

type Params = Promise<{ id: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function CoupleGuestsPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { id } = await params;
  const sp = await searchParams;
  const k = typeof sp.k === "string" ? sp.k : "";

  const link = await findLink(id);
  if (!link) notFound();

  // a link minted before manage keys existed cannot be unlocked — say so
  // instead of rendering a gate that no key will ever open
  if (!link.key) {
    return (
      <main className="kn-main kn-adm" id="card">
        <section className="kn-band">
          <div className="kn-col kn-adm__gate">
            <h1 className="kn-h2">{t(lang, admin.title)}</h1>
            <p className="kn-adm__note">{t(lang, admin.oldLink)}</p>
          </div>
        </section>
      </main>
    );
  }

  if (!linkKeyOk(link, k)) {
    return (
      <main className="kn-main kn-adm" id="card">
        <section className="kn-band">
          <div className="kn-col kn-adm__gate">
            <h1 className="kn-h2">{t(lang, admin.title)}</h1>
            {/* a plain GET form: submitting puts ?k=… in the URL, the server decides */}
            <form method="get" className="kn-adm__form">
              <label className="kn-f__label" htmlFor="kn-k">{t(lang, admin.keyLabel)}</label>
              <input id="kn-k" name="k" type="password" className="kn-f__in" autoFocus />
              <button type="submit" className="kn-btn">{t(lang, admin.enter)}</button>
            </form>
            {k && <p className="kn-adm__note">{t(lang, admin.wrongKey)}</p>}
          </div>
        </section>
      </main>
    );
  }

  // ONLY this link's answers — the eventId thread tags each RSVP with the
  // minted id, so the filter is exact
  const rows = (await readRsvps()).filter((r) => r.event === id);
  const list = [...rows].reverse();
  const coming = rows.filter((r) => r.coming === "yes");
  const stats = [
    { n: rows.length, label: admin.stats.answers },
    { n: coming.length, label: admin.stats.coming },
    { n: coming.reduce((s, r) => s + r.guests + (r.adults ?? 0) + (r.kids ?? 0), 0), label: admin.stats.people },
    { n: rows.length - coming.length, label: admin.stats.declined },
  ];
  const diets = coming.filter((r) => r.diet || r.allergy).map((r) => `${r.name}: ${r.diet ?? r.allergy}`);

  return (
    <main className="kn-main kn-adm" id="card">
      <section className="kn-band">
        <div className="kn-col">
          <h1 className="kn-h2">{t(lang, admin.title)}</h1>
          <p className="kn-adm__lead">{t(lang, admin.coupleLead)}</p>
          <p className="kn-adm__note">
            <a className="kn-btn kn-btn--ghost" href={`/invitation/${id}`} target="_blank" rel="noopener">{t(lang, admin.openInvitation)}</a>
          </p>

          <div className="kn-adm__stats">
            {stats.map((s, i) => (
              <div className="kn-adm__stat" key={i}>
                <span className="kn-adm__n">{s.n}</span>
                <span className="kn-adm__l">{t(lang, s.label)}</span>
              </div>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="kn-adm__note">{t(lang, admin.empty)}</p>
          ) : (
            <div className="kn-adm__scroll">
              <table className="kn-adm__table">
                <thead>
                  <tr>
                    <th scope="col">{t(lang, admin.cols.at)}</th>
                    <th scope="col">{t(lang, admin.cols.name)}</th>
                    <th scope="col">{t(lang, admin.cols.guests)}</th>
                    <th scope="col">{t(lang, admin.cols.side)}</th>
                    <th scope="col">{t(lang, admin.cols.coming)}</th>
                    <th scope="col">{t(lang, admin.cols.plusOne)}</th>
                    <th scope="col">{t(lang, admin.cols.diet)}</th>
                    <th scope="col">{t(lang, admin.cols.message)}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r, i) => (
                    <tr key={i} data-coming={r.coming}>
                      <td>{r.at.replace("T", " ").slice(5, 16)}</td>
                      <td>
                        {r.name}
                        {r.from && r.from !== r.name && <span className="kn-adm__from"> ({r.from})</span>}
                      </td>
                      <td>{r.guests}</td>
                      <td>{t(lang, admin.sideWord[r.side])}</td>
                      <td>{t(lang, r.coming === "yes" ? admin.yes : admin.no)}</td>
                      <td className="kn-adm__msg">{r.plusOne ?? ""}</td>
                      <td className="kn-adm__msg">{r.diet ?? r.allergy ?? ""}</td>
                      <td className="kn-adm__msg">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {diets.length > 0 && (
            <div className="kn-adm__diets">
              <h2 className="kn-adm__h3">{t(lang, admin.nudge.diets)}</h2>
              <ul>
                {diets.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}

          <p className="kn-adm__export">
            {/* the same workbook as the owner's, scoped to this link — the
                route re-checks the manage key itself */}
            <a className="kn-btn" href={`/api/rsvp/export?link=${encodeURIComponent(id)}&k=${encodeURIComponent(k)}&fmt=xlsx`}>
              {t(lang, admin.exportXlsx)}
            </a>{" "}
            <a className="kn-btn kn-btn--ghost" href={`/api/rsvp/export?link=${encodeURIComponent(id)}&k=${encodeURIComponent(k)}`}>
              {t(lang, admin.exportCsv)}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
