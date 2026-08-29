"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import Image from "next/image";
import Icon from "./Icon";
import { auth, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { service } from "@/lib/photos";

// ============================================================================
// /login — one field, one button, no password.
//
// PORTED, not pasted. The reference component came in Tailwind + shadcn with
// `var(--color-*)` tokens; KNIQ is plain CSS on a five-dependency budget, so
// what carried over is the IDEAS, in `kn-` classes: the cursor-following glow
// behind the panel, the input whose edge lights where the pointer is, the
// sweep across the button, and the split with a photograph on the right.
// What did NOT carry over is the password field and the social row — the sign
// -in is a magic link, so there is nothing to put in them.
//
// The mouse coordinates are the one piece of state worth keeping in React:
// they are read by inline `style` on two elements and nothing else re-renders.
// Both effects are hover-only and decorative — a reader on a phone, or with
// reduced motion, loses nothing but a glow.
// ============================================================================

type Sent = "idle" | "sending" | "sent" | "bad";

export default function LoginPage({
  lang,
  ready,
  linkExpired = false,
  next,
}: {
  lang: Lang;
  /** false when no Supabase project is configured — the form is replaced by
   *  an honest note rather than a field that cannot lead anywhere */
  ready: boolean;
  linkExpired?: boolean;
  next?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<Sent>("idle");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [inPanel, setInPanel] = useState(false);
  const [edge, setEdge] = useState(-1); // x of the pointer over the field, -1 = away

  const track = (e: MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, next }),
      });
      const j = await r.json().catch(() => ({}));
      // the server answers the same way for every address that CAN be sent to;
      // only a malformed address comes back as a real complaint
      setState(j?.reason === "email" ? "bad" : "sent");
    } catch {
      // a dropped connection is not a wrong address — say the neutral thing
      // rather than accusing the reader's typing
      setState("sent");
    }
  }

  return (
    <main className="kn-login" id="card">
      <div className="kn-login__card">
        <div
          className="kn-login__side"
          onMouseMove={track}
          onMouseEnter={() => setInPanel(true)}
          onMouseLeave={() => setInPanel(false)}
        >
          <div
            className={`kn-login__glow${inPanel ? " is-on" : ""}`}
            aria-hidden="true"
            style={{ transform: `translate(${pos.x - 260}px, ${pos.y - 260}px)` }}
          />

          <div className="kn-login__body">
            <span className="kn-login__seal" aria-hidden="true">
              <Icon name="seal" size={26} />
            </span>
            <h1 className="kn-login__h">{t(lang, auth.title)}</h1>

            {!ready ? (
              <>
                <p className="kn-login__p">{t(lang, auth.offTitle)}</p>
                <p className="kn-login__note">{t(lang, auth.offBody)}</p>
              </>
            ) : state === "sent" ? (
              <div className="kn-login__sent" role="status">
                <p className="kn-login__h2">{t(lang, auth.sentTitle)}</p>
                <p className="kn-login__p">{t(lang, auth.sentBody)}</p>
                <button type="button" className="kn-btn kn-btn--ghost" onClick={() => setState("idle")}>
                  {t(lang, auth.again)}
                </button>
              </div>
            ) : (
              <>
                <p className="kn-login__p">{t(lang, auth.lead)}</p>
                {linkExpired && (
                  <p className="kn-login__err" role="alert">
                    {t(lang, auth.badLink)}
                  </p>
                )}

                <form className="kn-login__form" onSubmit={submit} noValidate>
                  <label className="kn-f__label" htmlFor="kn-login-email">
                    {t(lang, auth.email)}
                  </label>
                  <span className="kn-login__field">
                    <input
                      id="kn-login-email"
                      className="kn-f__in"
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (state === "bad") setState("idle"); }}
                      onMouseMove={(e) => setEdge(e.clientX - e.currentTarget.getBoundingClientRect().left)}
                      onMouseLeave={() => setEdge(-1)}
                      placeholder="anahit@example.am"
                      aria-invalid={state === "bad"}
                    />
                    {edge >= 0 && (
                      <span
                        className="kn-login__edge"
                        aria-hidden="true"
                        style={{ background: `radial-gradient(34px circle at ${edge}px 1px, var(--gold-ink), transparent 70%)` }}
                      />
                    )}
                  </span>

                  {state === "bad" && (
                    <p className="kn-login__err" role="alert">
                      {t(lang, auth.badEmail)}
                    </p>
                  )}

                  <button type="submit" className="kn-btn kn-login__go" disabled={state === "sending"}>
                    <span>{t(lang, state === "sending" ? auth.sending : auth.send)}</span>
                    <i className="kn-login__sweep" aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* the plate is one of our own, already in the bundle — no new asset
            and no third-party host, which the CSP would refuse anyway */}
        <div className="kn-login__plate" aria-hidden="true">
          <Image src={service.hero.img} alt="" fill sizes="(max-width: 899px) 0px, 46vw" placeholder="blur" />
        </div>
      </div>
    </main>
  );
}
