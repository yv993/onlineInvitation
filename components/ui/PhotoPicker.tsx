"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

// ============================================================================
// THE COUPLE'S OWN PHOTOGRAPHS.
//
// Picked here, downscaled here (canvas, longest side ≤ 1600px, JPEG 0.82 —
// a 12 MP phone photograph becomes ~300 kB before a byte leaves the device),
// then POSTed to /api/photo, which returns a same-origin path. That path is
// what the draft carries, which is why the pictures survive the trip the
// object-URL approach could not make: into the live preview's IFRAME, into
// the short link, into the guest's browser.
//
// They land in the template's own plate slots, so every effect the template
// already applies to its samples applies to these — the curtain reveal, the
// Ken Burns drift, the hover tilt, the lightbox. Nothing here knows about any
// of that, and that is the point: the picture is the only new thing.
//
// Failure is spoken plainly. A read-only disk (the demo's normal state on some
// hosts) answers 503, and the row says the photograph was not saved rather
// than showing a thumbnail that will 404 for every guest.
// ============================================================================

const L = {
  add: { hy: "Ավելացնել լուսանկարներ", en: "Add photographs", ru: "Добавить фотографии" },
  hint: {
    hy: "Առաջինը դառնում է շապիկը, մնացածը՝ պատկերասրահը։ Բոլոր էֆեկտները կիրառվում են ինքնաբերաբար։",
    ru: "Первая станет обложкой, остальные — галереей. Все эффекты применяются автоматически.",
    en: "The first becomes the cover, the rest the gallery. Every effect is applied automatically.",
  },
  busy: { hy: "Պահվում է…", en: "Saving…", ru: "Сохраняется…" },
  remove: { hy: "Հեռացնել", en: "Remove", ru: "Удалить" },
  failed: { hy: "Չհաջողվեց պահել այս նկարը։", en: "That photograph could not be saved.", ru: "Не удалось сохранить это фото." },
  unreadable: { hy: "Այս ֆայլը չստացվեց կարդալ — JPG կամ PNG ամենահուսալին է։", en: "This file could not be read — JPG or PNG works best.", ru: "Файл не удалось прочитать — надёжнее всего JPG или PNG." },
  offline: { hy: "Կապը կտրվեց նկարը պահելիս — ստուգեք ցանցը և փորձեք նորից։", en: "The connection dropped while saving — check the network and try again.", ru: "Связь оборвалась при сохранении — проверьте сеть и попробуйте снова." },
  tooMany: { hy: "Չափազանց շատ վերբեռնումներ հենց հիմա — սպասեք մի քանի րոպե։", en: "Too many uploads right now — wait a few minutes and try again.", ru: "Слишком много загрузок — подождите несколько минут." },
  notStored: { hy: "Սերվերը չկարողացավ պահել ֆայլը։ Փորձեք մի փոքր ուշ։", en: "The server could not keep the file. Try again in a moment.", ru: "Сервер не смог сохранить файл. Попробуйте чуть позже." },
  cover: { hy: "Շապիկ", en: "Cover", ru: "Обложка" },
  makeCover: { hy: "Դարձնել շապիկ", en: "Make it the cover", ru: "Сделать обложкой" },
  earlier: { hy: "Տեղափոխել առաջ", en: "Move earlier", ru: "Переместить раньше" },
  later: { hy: "Տեղափոխել հետ", en: "Move later", ru: "Переместить позже" },
  slot: { hy: "Պատկերասրահ", en: "Gallery", ru: "Галерея" },
  drag: {
    hy: "Քաշեք՝ տեղը փոխելու համար։",
    en: "Drag a photograph to change where it sits.",
    ru: "Перетащите фотографию, чтобы изменить её место.",
  },
} satisfies Record<string, T>;

/** where a photograph at this index lands in the template */
const slotOf = (lang: Lang, i: number) => (i === 0 ? t(lang, L.cover) : `${t(lang, L.slot)} ${i}`);

/** move the photograph at `i` to `j`, both ends in range */
function swap(list: string[], i: number, j: number): string[] {
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** lift the photograph at `from` out of the list and set it down at `to` —
 *  what a drag means, as against the neighbour-swap the arrows do */
function moveTo(list: string[], from: number, to: number): string[] {
  if (from === to || to < 0 || to >= list.length) return list;
  const next = [...list];
  const [held] = next.splice(from, 1);
  next.splice(to, 0, held);
  return next;
}

/** a File → JPEG data URL, longest side ≤ max, drawn through a canvas so the
 *  original never leaves the device and the upload stays small */
async function shrink(file: File, max = 1600): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * k));
    const h = Math.max(1, Math.round(img.naturalHeight * k));
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(img, 0, 0, w, h);
    return cv.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function PhotoPicker({ lang, value, onChange, max = 8, label }: {
  lang: Lang;
  /** same-origin /api/photo/<id> paths, in order — the first is the cover */
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  label?: T;
}) {
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement | null>(null);
  // The drag. The held index lives in a REF as well as in state: state drives
  // the styling, but a drop must read the CURRENT index — a handler closing
  // over state sees whatever React last rendered, which is stale whenever the
  // drop lands before a re-render. The ref is always right.
  const heldRef = useRef<number | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  // A SESSION OUTLIVES ITS FILES. The picked paths are remembered (the wizard
  // in sessionStorage, an order in its blob) but the photographs live on the
  // server's disk, which can be pruned, redeployed or read-only. A path that
  // no longer resolves would render as a broken box captioned «Your
  // photograph» — so on mount every remembered path is asked for, and the dead
  // ones are dropped. Silent on purpose: the couple never chose to lose them,
  // and an error about a file they cannot restore helps nobody.
  // The callback and the list are read through refs: `onChange` is an inline
  // arrow at every call site, so a dependency on it makes this effect re-run
  // on every render — and the first run's cleanup would cancel the check
  // before its answers came back, which is exactly how it failed the first
  // time. Keyed on the LENGTH, it runs once, when photographs first appear.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current || !valueRef.current.length) return;
    checked.current = true;
    void (async () => {
      const list = valueRef.current;
      const ok = await Promise.all(
        list.map(async (src) => {
          try {
            return (await fetch(src, { method: "HEAD", cache: "no-store" })).ok;
          } catch {
            return false;
          }
        }),
      );
      if (ok.every(Boolean)) return;
      onChangeRef.current(list.filter((_, i) => ok[i]));
    })();
  }, [value.length]);

  const lift = (i: number) => { heldRef.current = i; setHeld(i); };
  const release = () => { heldRef.current = null; setHeld(null); setOver(null); };
  const drop = (to: number, ev: React.DragEvent) => {
    // the payload is the fallback: a drag that began in another document, or
    // any browser that lost our ref, still lands correctly
    const raw = Number(ev.dataTransfer.getData("text/plain"));
    const from = heldRef.current ?? (Number.isInteger(raw) ? raw : null);
    if (from !== null && from !== to) onChange(moveTo(value, from, to));
    release();
  };

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr("");
    const room = max - value.length;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    if (!list.length) return;
    setBusy((n) => n + list.length);
    const saved: string[] = [];
    for (const file of list) {
      try {
        let photo: string;
        try {
          photo = await shrink(file);
        } catch {
          // the browser could not decode it — a HEIC straight off a phone, most days
          setErr(t(lang, L.unreadable));
          continue;
        }
        const post = () => fetch("/api/photo", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ photo }),
        });
        let res: Response;
        try {
          res = await post();
        } catch {
          // a dropped connection gets ONE quiet retry — a server that was
          // restarting is usually back a moment later
          await new Promise((r) => setTimeout(r, 900));
          try { res = await post(); } catch { setErr(t(lang, L.offline)); continue; }
        }
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string };
        if (res.ok && data.ok && data.url) saved.push(data.url);
        else if (res.status === 429) setErr(t(lang, L.tooMany));
        else if (res.status === 503) setErr(t(lang, L.notStored));
        else setErr(t(lang, L.failed));
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (saved.length) onChange([...value, ...saved].slice(0, max));
    if (input.current) input.current.value = "";
  };

  return (
    <div className="kn-pp">
      <span className="kn-f__label">
        {t(lang, label ?? L.add)}{" "}
        <small className="kn-pp__hint">
          {t(lang, L.hint)}
          {value.length > 1 ? ` ${t(lang, L.drag)}` : ""}
        </small>
      </span>

      {value.length > 0 && (
        /* THE PLACEMENT IS THE ORDER. The first photograph is the template's
           cover; the rest fill its gallery in this order — which is also the
           order the fold-out templates take their two faces from. Each tile
           says where it lands and carries the moves that put it elsewhere. */
        <ul className="kn-pp__list">
          {value.map((src, i) => (
            <li
              key={src}
              className={`kn-pp__it${held === i ? " is-held" : ""}${over === i && held !== i ? " is-over" : ""}`}
              draggable
              onDragStart={(ev) => { lift(i); ev.dataTransfer.effectAllowed = "move"; ev.dataTransfer.setData("text/plain", String(i)); }}
              onDragOver={(ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; setOver(i); }}
              onDragLeave={() => setOver((cur) => (cur === i ? null : cur))}
              onDrop={(ev) => { ev.preventDefault(); drop(i, ev); }}
              onDragEnd={release}
            >
              {/* the couple's own file, already downscaled and same-origin:
                  a plain <img>, because next/image would re-fetch it through
                  the optimiser for a thumbnail nobody keeps. draggable=false
                  on the image so the browser drags the TILE, not the picture. */}
              <img src={src} alt="" draggable={false} />
              <span className={`kn-pp__slot${i === 0 ? " kn-pp__slot--cover" : ""}`}>{slotOf(lang, i)}</span>
              <button type="button" className="kn-pp__x" aria-label={t(lang, L.remove)} onClick={() => onChange(value.filter((_, j) => j !== i))}>
                <Icon name="x" size={14} />
              </button>
              <span className="kn-pp__moves">
                <button type="button" aria-label={t(lang, L.earlier)} title={t(lang, L.earlier)} disabled={i === 0} onClick={() => onChange(swap(value, i, i - 1))}>
                  <Icon name="chevron" size={12} className="kn-pp__prev" />
                </button>
                {i > 0 && (
                  <button type="button" className="kn-pp__star" aria-label={t(lang, L.makeCover)} title={t(lang, L.makeCover)} onClick={() => onChange([src, ...value.filter((_, j) => j !== i)])}>
                    <Icon name="seal" size={12} />
                  </button>
                )}
                <button type="button" aria-label={t(lang, L.later)} title={t(lang, L.later)} disabled={i === value.length - 1} onClick={() => onChange(swap(value, i, i + 1))}>
                  <Icon name="chevron" size={12} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="kn-pp__row">
        <button type="button" className="kn-btn kn-btn--ghost" onClick={() => input.current?.click()} disabled={busy > 0 || value.length >= max}>
          <Icon name="check" size={16} /> {busy > 0 ? t(lang, L.busy) : t(lang, L.add)}
        </button>
        <small className="kn-pp__count">{value.length} / {max}</small>
      </p>
      {err && <p className="kn-f__err">{err}</p>}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="kn-sr"
        tabIndex={-1}
        onChange={(e) => void add(e.currentTarget.files)}
      />
    </div>
  );
}
