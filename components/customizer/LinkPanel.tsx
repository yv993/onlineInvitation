"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { wizard, type Lang } from "@/lib/content";
import { t } from "@/lib/i18n";
import { qrMatrix } from "@/lib/qr";

// ============================================================================
// GENERATE WEB LINK — shared by the wizard and the kids' studio.
//
// POST /api/link {tpl, draft, lang, photo?} → {id, path, stored}. The panel
// shows the absolute URL, a copy button, WhatsApp/Telegram intents, a QR
// (lib/qr.ts) and, folded away, the long stateless ?p= link that needs no
// server. `stored:false` (a read-only disk) shows the long link instead of
// pretending. A new blob invalidates the minted link — the id points at the
// OLD draft — so the panel resets whenever the blob changes.
//
// PHOTO: when the caller hands in an object URL, the image is downscaled in
// a canvas (≤1200px, JPEG 0.82) and travels in the same POST as a data URL;
// the server writes data/photos/<id>.jpg and the stored draft points at
// /api/photo/<id>. Nothing leaves the device before this click.
// ============================================================================

/** the same link under each guest-language prefix — hy at the root, /en, /ru */
const GUEST_ROW = [
  { p: "", label: "ՀԱՅ" },
  { p: "/en", label: "EN" },
  { p: "/ru", label: "РУС" },
] as const;
const L3 = { hy: "Նույն հղումը՝ երեք լեզվով (ընտրածը կրկնօրինակվում է)", en: "The same link in three languages (tap one to copy)" };

export default function LinkPanel({ lang, tpl, blob, ready, photo }: { lang: Lang; tpl: string; blob: string; ready: boolean; photo?: string | null }) {
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ url: string; stored: boolean; guests?: string } | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const base = lang === "hy" ? "" : "/en";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isKids = tpl.startsWith("kids-");
  const longUrl = ready ? `${origin}${base}/invitation/${tpl}?p=${blob}` : "";

  useEffect(() => { setOut(null); setCopied(null); }, [blob, photo]);

  const generate = async () => {
    if (!ready || busy) return;
    setBusy(true); setErr("");
    try {
      const body: Record<string, unknown> = { tpl, draft: blob, lang };
      if (photo) body.photo = await shrink(photo);
      const res = await fetch("/api/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; path?: string; stored?: boolean; guests?: string };
      if (!res.ok || !data.ok || !data.path) throw new Error("bad");
      setOut({
        url: `${window.location.origin}${data.path}`,
        stored: Boolean(data.stored),
        guests: data.guests ? `${window.location.origin}${data.guests}` : undefined,
      });
      // MY INVITATIONS (2026-08-27): the minted link is remembered on THIS
      // device, so /my can list it later — no account, no server call
      try {
        const id = data.path.split("/").pop() ?? "";
        const raw = localStorage.getItem("kn-my-links");
        const list = raw ? (JSON.parse(raw) as Array<Record<string, string>>) : [];
        if (id && !list.some((x) => x.id === id)) {
          list.unshift({ id, tpl, at: new Date().toISOString(), guests: data.guests ?? "" });
          localStorage.setItem("kn-my-links", JSON.stringify(list.slice(0, 30)));
        }
      } catch { /* a full or blocked storage loses nothing but the memory */ }
    } catch {
      setErr(t(lang, wizard.errLink));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text: string, which: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(which);
    window.setTimeout(() => setCopied((c) => (c === which ? null : c)), 1800);
  };

  const shown = out?.stored === false ? longUrl : out?.url;

  return (
    <div className="kn-wz__link">
      <p className="kn-wz__small">{t(lang, wizard.generateHint)}</p>
      <button type="button" className="kn-btn" onClick={generate} disabled={!ready || busy}>
        <Icon name="share" size={16} /> {busy ? t(lang, wizard.generating) : t(lang, wizard.generate)}
      </button>
      {err && <p className="kn-f__err" role="alert">{err}</p>}
      {out && (
        <div className="kn-wz__linkOut" role="status">
          {!out.stored && <p className="kn-f__err">{t(lang, wizard.notStored)}</p>}
          <div className="kn-wz__linkRow">
            <input className="kn-f__in kn-wz__linkIn" readOnly value={shown} onFocus={(e) => e.currentTarget.select()} aria-label="URL" />
            <button type="button" className="kn-btn kn-btn--ghost" onClick={() => copy(shown!, "short")}>{copied === "short" ? t(lang, wizard.copied) : t(lang, wizard.copy)}</button>
            <a className="kn-btn kn-btn--ghost" href={shown} target="_blank" rel="noopener">{t(lang, wizard.open)}</a>
          </div>
          {/* the guest surface speaks three languages: the SAME link, under
              each prefix — a chip per language, tap to copy that version */}
          <p className="kn-wz__small kn-wz__langRow">
            {t(lang, L3)}
            {GUEST_ROW.map(({ p, label }) => {
              const bare = shown!.replace(origin, "").replace(/^\/(en|ru)(?=\/)/, "");
              const u = `${origin}${p}${bare}`;
              return (
                <button key={label} type="button" className="kn-chip" onClick={() => copy(u, label)}>
                  {copied === label ? t(lang, wizard.copied) : label}
                </button>
              );
            })}
          </p>
          {/* THE OTHER HALF OF THE LINK (2026-08-25): where the answers
              gather. Private by nature — the manage key rides in it — so the
              row says so, plainly. */}
          {out.guests && (
            <div className="kn-wz__answers">
              <p className="kn-label">{t(lang, wizard.answersTitle)}</p>
              <p className="kn-wz__small">{t(lang, wizard.answersHint)}</p>
              <div className="kn-wz__linkRow">
                <input className="kn-f__in kn-wz__linkIn" readOnly value={out.guests} onFocus={(e) => e.currentTarget.select()} aria-label="URL" />
                <button type="button" className="kn-btn kn-btn--ghost" onClick={() => copy(out.guests!, "guests")}>{copied === "guests" ? t(lang, wizard.copied) : t(lang, wizard.copy)}</button>
                <a className="kn-btn kn-btn--ghost" href={out.guests} target="_blank" rel="noopener">{t(lang, wizard.open)}</a>
              </div>
            </div>
          )}
          <div className="kn-wz__qrRow">
            <Qr text={shown!} lang={lang} />
            <div>
              <p className="kn-label">{t(lang, wizard.qr)}</p>
              <p className="kn-wz__small">
                <a href={`https://wa.me/?text=${encodeURIComponent(shown!)}`} target="_blank" rel="noopener noreferrer" className="kn-wz__soc"><Icon name="whatsapp" size={14} /> WhatsApp</a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shown!)}`} target="_blank" rel="noopener noreferrer" className="kn-wz__soc"><Icon name="telegram" size={14} /> Telegram</a>
              </p>
              {out.stored && !(isKids && photo) && (
                <details className="kn-wz__long">
                  <summary>{t(lang, wizard.longLink)}</summary>
                  <div className="kn-wz__linkRow">
                    <input className="kn-f__in kn-wz__linkIn" readOnly value={longUrl} onFocus={(e) => e.currentTarget.select()} aria-label="URL" />
                    <button type="button" className="kn-btn kn-btn--ghost" onClick={() => copy(longUrl, "long")}>{copied === "long" ? t(lang, wizard.copied) : t(lang, wizard.copy)}</button>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** object URL → JPEG data URL, longest side ≤ 1200px */
async function shrink(src: string): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const max = 1200;
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(img, 0, 0, w, h);
  return cv.toDataURL("image/jpeg", 0.82);
}

export function Qr({ text, lang }: { text: string; lang?: Lang }) {
  const m = useMemo(() => qrMatrix(text), [text]);
  const n = m.length;
  const a = useRef<HTMLAnchorElement | null>(null);
  const path = useMemo(() => {
    let d = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x} ${y}h1v1h-1z`;
    return d;
  }, [m, n]);
  // the printable QR (2026-08-25): the same matrix drawn to a canvas at
  // 12px a module with a quiet border — a crisp PNG for the printed card
  const download = () => {
    const scale = 12, pad = 4;
    const cv = document.createElement("canvas");
    cv.width = cv.height = (n + pad * 2) * scale;
    const cx = cv.getContext("2d");
    if (!cx) return;
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = "#1C1A17";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) cx.fillRect((x + pad) * scale, (y + pad) * scale, scale, scale);
    const el = a.current;
    if (!el) return;
    el.href = cv.toDataURL("image/png");
    el.download = "kniq-qr.png";
    el.click();
  };
  return (
    <span className="kn-wz__qrWrap">
      <svg className="kn-wz__qr" viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label="QR" shapeRendering="crispEdges">
        <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
        <path d={path} fill="#1C1A17" />
      </svg>
      {lang && (
        <button type="button" className="kn-chip kn-wz__qrDl" onClick={download}>{t(lang, wizard.qrDownload)}</button>
      )}
      {/* the saving anchor — clicked from code, never shown */}
      <a ref={a} className="kn-sr" aria-hidden="true" tabIndex={-1} href="#dl" />
    </span>
  );
}
