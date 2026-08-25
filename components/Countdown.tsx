"use client";

import { useEffect, useState } from "react";
import { countdown } from "@/lib/content";
import type { Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { pad2, remaining } from "@/lib/date";

// ============================================================================
// THE COUNTDOWN
//
// Placed THIRD — right after the invitation — not directly above the RSVP form
// where NAIVA puts it. There it counts down to the reply deadline and reads as
// a demand; here it counts to the wedding and reads as anticipation. The reply
// deadline is stated in plain words beside the form instead, which is where a
// deadline belongs.
//
// TWO THINGS THAT LOOK LIKE DETAILS AND ARE NOT:
//
// 1. It survives the wedding. A countdown pinned at 00:00:00:00 forever is how
//    every one of these cards ends its life — the link stays in a WhatsApp
//    thread for years. Past the date this swaps to a thank-you line.
//
// 2. `suppressHydrationWarning` on the digits is deliberate, not a silencer for
//    a bug. The server renders the value at request time and the client
//    re-computes it milliseconds later; those two numbers are SUPPOSED to
//    differ. The alternative — rendering blanks until mount — puts a visible
//    hole in the card on every load.
// ============================================================================

export default function Countdown({ lang, date }: { lang: Lang; date: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Aligned to the second boundary rather than a naive 1000ms interval, so
    // the digits don't visibly drift out of step with the phone's own clock.
    let id: number;
    const tick = () => {
      setNow(Date.now());
      id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => window.clearTimeout(id);
  }, []);

  const r = remaining(date, now);

  if (r.done) {
    return (
      <section className="kn-band kn-count">
        <div className="kn-col">
          <p className="kn-h2" data-rise>
            {t(lang, countdown.after)}
          </p>
        </div>
      </section>
    );
  }

  const cells = [
    { n: r.d, u: countdown.units.d },
    { n: r.h, u: countdown.units.h },
    { n: r.m, u: countdown.units.m },
    { n: r.s, u: countdown.units.s },
  ];

  return (
    <section className="kn-band kn-count" aria-labelledby="kn-count-t">
      <div className="kn-col">
        <p className="kn-label" id="kn-count-t" data-rise>
          {t(lang, countdown.title)}
        </p>

        <div className="kn-count__grid" data-rise>
          {cells.map((c, i) => (
            <div className="kn-count__cell" key={i}>
              {/* Tabular figures in the CSS keep the box from twitching as the
                  seconds roll; days are not padded because "5" reads better
                  than "05" when it is the number everybody looks at. */}
              <span className="kn-count__n" suppressHydrationWarning>
                {i === 0 ? c.n : pad2(c.n)}
              </span>
              <span className="kn-count__u">{t(lang, c.u)}</span>
            </div>
          ))}
        </div>

        {/* One polite live region instead of four spans announcing themselves
            every second, which is what an unguarded countdown does to a screen
            reader. `off` means it is read on request, not shouted. */}
        <p className="kn-sr" aria-live="off" suppressHydrationWarning>
          {r.d} {t(lang, countdown.units.d)}
        </p>
      </div>
    </section>
  );
}
