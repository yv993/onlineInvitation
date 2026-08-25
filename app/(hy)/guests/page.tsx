import Nudge from "@/components/Nudge";
import { admin, couple, site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { stampFromIso } from "@/lib/draft";
import { adminKeyOk, readOrders, readRsvps } from "@/lib/server/store";

// a page for ONE couple and their guests — never a search result
export const metadata = { robots: { index: false, follow: false } };


// ============================================================================
// /guests — the couple's dashboard. The other half of the RSVP form: iStudio
// sells "answers auto-saved to a spreadsheet" as a 5,000֏ add-on, and every
// global platform makes RSVP TRACKING the paid core. This page is that
// product: the totals a couple actually plans with (how many answers, how
// many people are coming, how the sides balance), the full table, and a CSV
// export that opens in Excel with Armenian intact.
//
// SERVER-RENDERED, ZERO CLIENT JS OF ITS OWN. The gate is a query key checked
// in constant time on the server; a wrong or missing key renders the key form
// and NOTHING else — the list is never in the HTML unless the key was right.
//
// The key travels as ?key=… — fine for this tier (the couple gets one link to
// keep), stated plainly in the README rather than dressed up as more than it
// is. The global layout already sets robots noindex on every page.
// ============================================================================

export const dynamic = "force-dynamic"; // the list must never be cached
const lang = "hy" as const;

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function GuestsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const key = typeof sp.key === "string" ? sp.key : "";
  const keySet = Boolean(process.env.RSVP_ADMIN_KEY);

  if (!adminKeyOk(key)) {
    return (
      <main className="kn-main kn-adm" id="card">
        <section className="kn-band">
          <div className="kn-col kn-adm__gate">
            <h1 className="kn-h2">{t(lang, admin.title)}</h1>
            {keySet ? (
              <>
                {/* A plain GET form: submitting puts ?key=… in the URL and the
                    server decides. No JS, no state, nothing to get wrong. */}
                <form method="get" className="kn-adm__form">
                  <label className="kn-f__label" htmlFor="kn-key">
                    {t(lang, admin.keyLabel)}
                  </label>
                  <input id="kn-key" name="key" type="password" className="kn-f__in" autoFocus />
                  <button type="submit" className="kn-btn">
                    {t(lang, admin.enter)}
                  </button>
                </form>
                {key && <p className="kn-adm__note">{t(lang, admin.wrongKey)}</p>}
              </>
            ) : (
              <p className="kn-adm__note">{t(lang, admin.disabled)}</p>
            )}
          </div>
        </section>
      </main>
    );
  }

  const rows = await readRsvps();
  const orders = [...(await readOrders())].reverse(); // newest first
  // Newest first — the couple checks "who answered since yesterday".
  const list = [...rows].reverse();

  const coming = rows.filter((r) => r.coming === "yes");
  const stats = [
    { n: rows.length, label: admin.stats.answers },
    { n: coming.length, label: admin.stats.coming },
    { n: coming.reduce((s, r) => s + r.guests, 0), label: admin.stats.people },
    { n: rows.length - coming.length, label: admin.stats.declined },
  ];

  // The dietary roll-up the caterer actually asks for: every note, with the
  // guest it belongs to, in one place.
  const diets = coming.filter((r) => r.diet).map((r) => `${r.name}: ${r.diet}`);

  // The reminder text — filled from content, with the site's own URL when it
  // is known and a relative path otherwise (a copied relative path is still a
  // useful reminder; a fabricated origin is not).
  const url = (site.url || "") + "/";
  const nudge = t(lang, admin.nudge.body)
    .replace("{names}", `${t(lang, couple.a)} և ${t(lang, couple.b)}`)
    .replace("{date}", stampFromIso(couple.date))
    .replace("{rsvpBy}", stampFromIso(couple.rsvpBy))
    .replace("{url}", url);

  return (
    <main className="kn-main kn-adm" id="card">
      <section className="kn-band">
        <div className="kn-col">
          <h1 className="kn-h2">{t(lang, admin.title)}</h1>
          <p className="kn-adm__lead">{t(lang, admin.lead)}</p>

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
                        {r.from && r.from !== r.name && (
                          <span className="kn-adm__from"> ({r.from})</span>
                        )}
                      </td>
                      <td>{r.guests}</td>
                      <td>{t(lang, admin.sideWord[r.side])}</td>
                      <td>{t(lang, r.coming === "yes" ? admin.yes : admin.no)}</td>
                      <td className="kn-adm__msg">{r.plusOne ?? ""}</td>
                      <td className="kn-adm__msg">{r.diet ?? ""}</td>
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
                {diets.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          <Nudge lang={lang} text={nudge} />

          <OrdersTable orders={orders} />

          <p className="kn-adm__export">
            {/* The Excel deliverable — a real .xlsx workbook (answers + a
                summary sheet), and the plain CSV beside it. The route
                re-checks the key itself — these links merely carry it. */}
            <a className="kn-btn" href={`/api/rsvp/export?key=${encodeURIComponent(key)}&fmt=xlsx`}>
              {t(lang, admin.exportXlsx)}
            </a>{" "}
            <a className="kn-btn kn-btn--ghost" href={`/api/rsvp/export?key=${encodeURIComponent(key)}`}>
              {t(lang, admin.exportCsv)}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

/** the studio's inbox: every order, newest first — same key, same page. The
 *  draft column opens exactly what the couple previewed when they ordered. */
function OrdersTable({ orders }: { orders: Awaited<ReturnType<typeof readOrders>> }) {
  return (
    <div className="kn-adm__orders">
      <h2 className="kn-adm__h3">{t(lang, admin.orders.title)} <small>{orders.length}</small></h2>
      {orders.length === 0 ? (
        <p className="kn-adm__note">{t(lang, admin.orders.empty)}</p>
      ) : (
        <div className="kn-adm__scroll">
          <table className="kn-adm__table">
            <thead>
              <tr>
                <th scope="col">{t(lang, admin.orders.cols.at)}</th>
                <th scope="col">{t(lang, admin.orders.cols.names)}</th>
                <th scope="col">{t(lang, admin.orders.cols.style)}</th>
                <th scope="col">{t(lang, admin.orders.cols.contact)}</th>
                <th scope="col">{t(lang, admin.orders.cols.details)}</th>
                <th scope="col">{t(lang, admin.orders.cols.preview)}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i}>
                  <td>{o.at.replace("T", " ").slice(5, 16)}</td>
                  <td>{o.names}{o.date ? ` · ${o.date}` : ""}</td>
                  <td>{o.style}</td>
                  <td className="kn-adm__msg">{o.contact}</td>
                  <td className="kn-adm__msg">{o.details}</td>
                  <td>
                    {o.draft ? (
                      <a href={`/invitation/${o.style}?p=${encodeURIComponent(o.draft)}`} target="_blank" rel="noopener">
                        {t(lang, admin.orders.cols.preview)}
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
