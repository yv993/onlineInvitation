"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE COUPLE'S OWN SONG.
//
// The music slot used to take only an https URL — which quietly assumed a
// couple who hosts mp3 files somewhere. Nobody does. Now the same field
// takes THE FILE: picked here, capped at ~9 MB, POSTed to /api/audio (magic
// bytes checked server-side), and the draft carries the same-origin path —
// which the preview iframes can load, the blob can carry, the guest page can
// play, and (being same-origin) the dock's AnalyserNode can finally read a
// REAL waveform from. The URL input stays for the couple who does have a
// link. One value, two doors.
// ============================================================================

const L = {
  or: { hy: "կամ", en: "or", ru: "или" },
  upload: { hy: "Վերբեռնել ձեր երգը", en: "Upload your track", ru: "Загрузить свой трек" },
  busy: { hy: "Պահվում է…", en: "Saving…", ru: "Сохраняется…" },
  own: { hy: "Ձեր երգը", en: "Your track", ru: "Ваш трек" },
  kinds: { hy: "MP3 կամ M4A, մինչև 9 ՄԲ", en: "MP3 or M4A, up to 9 MB", ru: "MP3 или M4A, до 9 МБ" },
  tooBig: { hy: "Ֆայլը մեծ է՝ մինչև 9 ՄԲ։", en: "That file is too large — up to 9 MB.", ru: "Файл слишком большой — до 9 МБ." },
  badKind: { hy: "Միայն MP3 կամ M4A։", en: "MP3 or M4A only.", ru: "Только MP3 или M4A." },
  failed: { hy: "Չհաջողվեց պահել երգը։", en: "The track could not be saved.", ru: "Не удалось сохранить трек." },
  remove: { hy: "Հեռացնել", en: "Remove", ru: "Удалить" },
  listen: { hy: "Լսել ձեր երգը", en: "Listen to your track", ru: "Послушать ваш трек" },
} satisfies Record<string, T>;

const MAX_BYTES = 9 * 1024 * 1024;
const KINDS = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a"];

/** a File → data URL, whole — the server reads the magic bytes, not the name */
const asDataUrl = (file: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function TrackPicker({ lang, value, onChange, label, hint }: {
  lang: Lang;
  /** an uploaded /api/audio/<id> path, an https URL, or empty */
  value: string;
  onChange: (next: string) => void;
  label: T;
  hint: T;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement | null>(null);
  const uploaded = value.startsWith("/api/audio/");

  const pick = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setErr("");
    const name = file.name.toLowerCase();
    if (!KINDS.includes(file.type) && !name.endsWith(".mp3") && !name.endsWith(".m4a")) { setErr(t(lang, L.badKind)); return; }
    if (file.size > MAX_BYTES) { setErr(t(lang, L.tooBig)); return; }
    setBusy(true);
    try {
      let audio = await asDataUrl(file);
      // a browser that reports application/octet-stream still reads fine —
      // rewrite the prefix by extension so the server sees a declared type
      // it accepts (it trusts the BYTES either way)
      if (audio.startsWith("data:application/octet-stream;base64,")) {
        audio = `data:${name.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg"};base64,` + audio.slice(audio.indexOf(",") + 1);
      }
      const res = await fetch("/api/audio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audio }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string };
      if (res.ok && data.ok && data.url) onChange(data.url);
      else setErr(t(lang, L.failed));
    } catch {
      setErr(t(lang, L.failed));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="kn-f kn-tk">
      <span className="kn-f__label" id="wz-music-label">{t(lang, label)} <small className="kn-wz__small">{t(lang, hint)}</small></span>

      {uploaded ? (
        /* the uploaded song, playable right here — and removable */
        <div className="kn-tk__own">
          <span className="kn-tk__name"><Icon name="music" size={14} /> {t(lang, L.own)}</span>
          {/* a plain audio element: same-origin, preload none, the couple's ear-check */}
          <audio className="kn-tk__play" controls preload="none" src={value} aria-label={t(lang, L.listen)} />
          <button type="button" className="kn-tk__rm" aria-label={t(lang, L.remove)} title={t(lang, L.remove)} onClick={() => onChange("")}>
            <Icon name="x" size={14} />
          </button>
        </div>
      ) : (
        <input
          id="wz-music"
          className="kn-f__in"
          type="url"
          inputMode="url"
          aria-labelledby="wz-music-label"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={400}
          placeholder="https://…/our-song.mp3"
        />
      )}

      {!uploaded && (
        <p className="kn-tk__row">
          <small>{t(lang, L.or)}</small>
          <button type="button" className="kn-btn kn-btn--ghost kn-tk__btn" onClick={() => input.current?.click()} disabled={busy}>
            <Icon name="music" size={14} /> {busy ? t(lang, L.busy) : t(lang, L.upload)}
          </button>
          <small className="kn-tk__kinds">{t(lang, L.kinds)}</small>
        </p>
      )}
      {err && <p className="kn-f__err">{err}</p>}

      <input
        ref={input}
        type="file"
        accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/x-m4a"
        className="kn-sr"
        tabIndex={-1}
        onChange={(e) => void pick(e.currentTarget.files)}
      />
    </div>
  );
}
