"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE WISHES WALL — the reference's guestbook, closed into OUR loop
// (2026-08-26). The RSVP form has always collected a message; those messages
// were only ever visible to the couple's dashboard. On a MINTED link the
// wall now shows them back to every guest — names and words, newest first —
// so the page fills with congratulations as the day approaches.
//
// It renders ONLY when an eventId exists (a minted link): the template demos
// never show fabricated wishes, and a wall with no answers yet says so
// honestly instead of pretending. GET /api/wishes strips everything down to
// name · time · message before it leaves the server.
//
// NO MOTION VERBS HERE (data-rise/data-ink), deliberately: this component
// mounts AFTER its fetch resolves — long after Motion's one pass — so a
// parked attribute would never be unparked and the wall would sit at
// opacity 0 forever (it did, for one build). It fades itself in with its
// own keyframe instead.
// ============================================================================

const L = {
  title: { hy: "Բարեմաղթանքներ", en: "Wishes", ru: "Пожелания" },
  hint: {
    hy: "Ձեր բարեմաղթանքը գրեք պատասխանի ձևի «Նամակ» դաշտում — այն կհայտնվի այստեղ։",
    en: "Write your wish in the RSVP form's message field — it appears here.",
    ru: "Напишите пожелание в поле «Сообщение» формы ответа — оно появится здесь.",
  },
  empty: { hy: "Դեռ բարեմաղթանք չկա — եղեք առաջինը։", en: "No wishes yet — be the first.", ru: "Пожеланий пока нет — будьте первыми." },
} satisfies Record<string, T>;

type Wish = { name: string; message: string; at: string };

export default function WishesWall({ lang, eventId }: { lang: Lang; eventId: string }) {
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  useEffect(() => {
    let dead = false;
    fetch(`/api/wishes?event=${encodeURIComponent(eventId)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!dead && j?.ok) setWishes(j.wishes as Wish[]); })
      .catch(() => { /* the wall simply stays quiet */ });
    return () => { dead = true; };
  }, [eventId]);

  // nothing arrived (or the fetch failed): no section at all beats a spinner
  if (wishes === null) return null;

  return (
    <div className="kn-tb kn-wall kn-wall--in">
      <p className="kn-tb__label">{t(lang, L.title)}</p>
      {wishes.length === 0 ? (
        <p className="kn-wall__empty">{t(lang, L.empty)}</p>
      ) : (
        <ul className="kn-wall__list">
          {wishes.map((w, i) => (
            <li className="kn-wall__it" key={i}>
              <p className="kn-wall__msg">{w.message}</p>
              <p className="kn-wall__who">{w.name} · {w.at.slice(5, 10).replace("-", ".")}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="kn-wall__hint">{t(lang, L.hint)}</p>
    </div>
  );
}
