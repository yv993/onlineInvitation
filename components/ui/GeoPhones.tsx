"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { StaticImageData } from "next/image";

/** THE CLIENT'S OWN DEVICE RENDERS (2026-09-01). Their two phones — the
 *  upright one in front, the leaning one behind — with the transparency
 *  ground keyed off.
 *
 *  Each render's screen is an angled quadrilateral, so a flat invitation
 *  strip cannot simply be dropped in: the corners below were measured off
 *  the pixels (as a percentage of each image's box), and the effect solves
 *  the projective transform that lands a rectangle exactly on them.
 *
 *  The corners come from fitting a LINE to each of the display's four sides
 *  and intersecting them, not from the outermost pixels: the glass has deep
 *  rounded corners, so the extreme pixels sit on the arcs, well inside the
 *  real corner, and every side ends up tilted a degree or two off. That was
 *  what stopped the card from sitting square in the bezel.
 *
 *  Sampling by row and column extremes gets that wrong too once a screen is
 *  ROTATED — near the left end of a tilted glass the topmost pixel of a
 *  column belongs to the LEFT edge, not the top one. So the sides are fitted
 *  in the quad's own frame instead, from the outermost point of each bin
 *  along the edge, which also ignores where the notch bites in. */
const PHONES = {
  gold: {
    src: "/art/phone-upright.webp",
    ratio: 820 / 2365,
    // TL, TR, BR, BL as % of the image box
    quad: [[12.8, 0.68], [97.32, 9.6], [97.32, 98.38], [12.8, 98.2]],
  },
  silver: {
    src: "/art/phone-silver.webp",
    ratio: 900 / 1497,
    // its top edge RISES 9° to the right — the old quad had it level, which
    // is what left the card crooked against the bezel
    quad: [[28.32, 11.59], [84.99, 6.22], [70.45, 91.96], [11.93, 94.01]],
  },
} as const;

/** the homography that carries the corners of a w×h box onto four points,
 *  written as the CSS matrix3d that performs it */
function matrixFor(w: number, h: number, quad: readonly (readonly number[])[]) {
  const d = quad.map(([px, py]) => [(px / 100) * w, (py / 100) * h]);
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = d;
  // unknowns a b c d e f g h for the UNIT square → d
  const M = [
    [0, 0, 1, 0, 0, 0, 0, 0, x0],
    [1, 0, 1, 0, 0, 0, -x1, 0, x1],
    [1, 1, 1, 0, 0, 0, -x2, -x2, x2],
    [0, 1, 1, 0, 0, 0, 0, -x3, x3],
    [0, 0, 0, 0, 0, 1, 0, 0, y0],
    [0, 0, 0, 1, 0, 1, -y1, 0, y1],
    [0, 0, 0, 1, 1, 1, -y2, -y2, y2],
    [0, 0, 0, 0, 1, 1, 0, -y3, y3],
  ];
  for (let c = 0; c < 8; c++) {
    let piv = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const dv = M[c][c];
    if (!dv) return null;
    for (let k = c; k <= 8; k++) M[c][k] /= dv;
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = M[r][c];
      for (let k = c; k <= 8; k++) M[r][k] -= f * M[c][k];
    }
  }
  const [a, b, c0, dd, e, f, g, hh] = M.map((r) => r[8]);
  // the screen element is w×h, so its own coordinates are divided back out:
  // column one by w, column two by h
  return `matrix3d(${a / w}, ${dd / w}, 0, ${g / w}, ${b / h}, ${e / h}, 0, ${hh / h}, 0, 0, 1, 0, ${c0}, ${f}, 0, 1)`;
}

/** The opener's device pair. Layers, outermost first — each owns ONE
 *  transform, so nothing fights:
 *    phWrap · position + the scroll drift (Motion.tsx writes its transform)
 *    ph     · the device — the gsap hover tilt lives here alone
 *    scr    · the warped screen, its matrix recomputed from the real box */
export default function GeoPhones({ a, b }: { a: StaticImageData; b: StaticImageData }) {
  const root = useRef<HTMLDivElement | null>(null);

  // the screens are laid into their quads from the MEASURED box, so the
  // fit holds at every width without a media query
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => {
      el.querySelectorAll<HTMLElement>(".kn-ph").forEach((ph) => {
        const scr = ph.querySelector<HTMLElement>(".kn-ph__scr");
        const key = ph.dataset.phone as keyof typeof PHONES | undefined;
        if (!scr || !key) return;
        const r = ph.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        // no fudge factor any more: the quads reach the real corners, so
        // growing them would push the card out over the metal
        const q = PHONES[key].quad;
        const m = matrixFor(r.width, r.height, q);
        // the quad's corners are SHARP — the intersections of the four glass
        // edges — but the glass itself is rounded, so a square card pokes out
        // over the bezel at each corner. Round the card by the display's own
        // radius (14% of its width, as the hardware has it); the matrix warps
        // that radius along with everything else.
        const dw = ((q[1][0] + q[2][0]) - (q[0][0] + q[3][0])) / 200 * r.width;
        scr.style.borderRadius = `${(dw * 0.14).toFixed(2)}px`;
        if (m) scr.style.transform = m;
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    el.querySelectorAll<HTMLElement>(".kn-ph").forEach((p) => ro.observe(p));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // the tilt is pointer delight — reduced-motion readers keep the still pose
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const el = root.current;
    if (!el) return;
    const undo: Array<() => void> = [];
    el.querySelectorAll<HTMLElement>(".kn-open__phWrap").forEach((wrap) => {
      const ph = wrap.querySelector<HTMLElement>(".kn-ph");
      if (!ph) return;
      const dir = wrap.classList.contains("kn-open__phWrap--b") ? -1 : 1;
      const enter = () => gsap.to(ph, { rotateY: 7 * dir, rotateX: -3, scale: 1.04, transformPerspective: 1200, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      const leave = () => gsap.to(ph, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
      // the listener lives on the WRAP: the device scales under the pointer,
      // and a listener on the scaled thing would chase its own hit area
      wrap.addEventListener("pointerenter", enter);
      wrap.addEventListener("pointerleave", leave);
      undo.push(() => { wrap.removeEventListener("pointerenter", enter); wrap.removeEventListener("pointerleave", leave); gsap.killTweensOf(ph); });
    });
    return () => undo.forEach((f) => f());
  }, []);

  return (
    <div className="kn-open__phones" data-rise aria-hidden="true" ref={root}>
      {/* the SILVER stands behind… */}
      <span className="kn-open__phWrap kn-open__phWrap--b" data-drifty="150">
        <span className="kn-ph kn-ph--silver" data-phone="silver" style={{ aspectRatio: String(PHONES.silver.ratio) }}>
          <img className="kn-ph__art" src={PHONES.silver.src} alt="" draggable={false} />
          <span className="kn-ph__scr">
            <Image src={b} alt="" fill sizes="320px" draggable={false} />
          </span>
        </span>
      </span>
      {/* …and the GOLD lies in front (client, 2026-09-01) */}
      <span className="kn-open__phWrap kn-open__phWrap--a" data-drifty="-140">
        <span className="kn-ph kn-ph--gold" data-phone="gold" style={{ aspectRatio: String(PHONES.gold.ratio) }}>
          <img className="kn-ph__art" src={PHONES.gold.src} alt="" draggable={false} />
          <span className="kn-ph__scr">
            <Image src={a} alt="" fill sizes="420px" draggable={false} />
          </span>
        </span>
      </span>
    </div>
  );
}
