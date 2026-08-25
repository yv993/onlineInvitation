"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

// ============================================================================
// THE MOTION LAYER — the whole reason to build this rather than buy it.
//
// Both references animate with AOS.js: one fade-and-slide, fired by an
// IntersectionObserver, applied uniformly to everything. It is the most basic
// scroll library there is, and it is what the leading paid product in this
// market ships. Replacing it with a real timeline engine is the single largest
// quality gap available here, and it costs two dependencies.
//
// WHAT RUNS:
//   · Lenis, so the page scrolls with weight instead of stepping.
//   · A per-element rise, but STAGGERED BY POSITION IN ITS OWN BAND rather
//     than globally — the difference between a page where things arrive and a
//     page where everything arrives at once.
//   · Nothing pinned, nothing scrubbed. This is a card, not a showreel; the
//     guest is here to find out where the church is.
//
// WHAT GATES IT — the same contract as every project in this stack:
//   `(prefers-reduced-motion: no-preference)` only. Under reduced motion the
//   effect never registers, Lenis never constructs, and the CSS parked states
//   never apply, so the card is simply a well-set document.
//
// The parked states live in globals.css under `html.js`, written before first
// paint. Nothing here is responsible for making content visible — if this
// component throws, the page is still fully readable. That is the invariant.
// ============================================================================

gsap.registerPlugin(ScrollTrigger, CustomEase);

// The two curves the «field of stills» is timed on, exactly as the reference
// declares them: cubic-bezier(0.22, 1, 0.36, 1) carrying a card INTO focus —
// it arrives early and then settles for a long time — and CSS ease-out,
// cubic-bezier(0, 0, 0.58, 1), letting it go. (CustomEase ships inside the
// gsap package; it is not a new dependency.)
CustomEase.create("focusIn", "M0,0 C0.22,1 0.36,1 1,1");
CustomEase.create("focusOut", "M0,0 C0,0 0.58,1 1,1");

export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ---- smooth scroll ---------------------------------------------------
      const lenis = new Lenis({
        duration: 1.05,
        // Touch is left alone deliberately: a phone's native scroll is already
        // excellent, and hijacking it is how these cards end up feeling
        // sticky on the device most guests will use.
        smoothWheel: true,
        touchMultiplier: 1,
      });

      // Published for SiteNav's anchor scrolling — with Lenis driving the
      // scroll, native scrollIntoView and CSS scroll-behavior fight it.
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const onRaf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onRaf);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      // Listeners the vocabulary attaches outside GSAP (the diorama's pointer
      // tilt): matchMedia reverts tweens, never listeners, so they sign out
      // through here in the cleanup below.
      const detach: Array<() => void> = [];

      // ---- the rise --------------------------------------------------------
      // Grouped by section so the stagger is local. A single global stagger
      // over forty elements means the last one waits for the first thirty-nine.
      const sections = gsap.utils.toArray<HTMLElement>("section, footer");
      // Live previews (the wizard's compact/embed renders inside their own
      // scroll frames, the example cards' faces) never take scroll-driven
      // motion: their triggers would sit in a frame the window never scrolls.
      const LIVE = ".iv--compact, .iv--embed, .kn-tp--embed, .kn-pl__view, .kn-ex__media, .kn-pv, .kn-ex__live";
      const live = (el: Element) => Boolean(el.closest(LIVE));
      const pick = <E extends Element>(sel: string, scope?: Element) => gsap.utils.toArray<E>(sel, scope).filter((el) => !live(el));

      sections.forEach((sec) => {
        // A band that carries data-rise ITSELF (the engine's RSVP / epigraph /
        // godparents / speakers sections) rises with its first child — the
        // scope query alone would leave it parked at opacity 0 forever.
        // The engine's compact live previews (`.iv--compact`, six per wizard)
        // are pinned visible in CSS and skipped here, or their ~90 parked
        // items would pad the band's stagger by seconds.
        const items = gsap.utils.toArray<HTMLElement>("[data-rise]", sec).filter((el) => !live(el));
        if (sec.matches("[data-rise]")) items.unshift(sec);
        if (!items.length) return;

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          // 90ms apart, but a band never takes longer than ~2.4s to finish —
          // the wizard's preview pane holds a hundred risers
          stagger: Math.min(0.09, 2.4 / items.length),
          scrollTrigger: {
            trigger: sec,
            // 88% rather than the usual 80: the bands are tall and a guest on
            // a phone should see the type land, not find it already landed.
            start: "top 88%",
            once: true,
          },
        });
      });

      // The hero is above the fold and has no scroll to trigger on — it plays
      // on arrival, after the envelope hands over. `.iv-hero` is the engine's
      // <header> (TemplateRenderer mounts Motion only once its gate is open, so
      // "arrival" there is the tap on the gate).
      const heroItems = pick<HTMLElement>(".kn-hero [data-rise], .iv-hero [data-rise]");
      if (heroItems.length) {
        gsap.to(heroItems, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.15,
        });
      }

      // ---- THE MOTION VOCABULARY — data attributes any card may carry -------
      // All parked states below are set HERE in JS (never in CSS), so a no-JS
      // or reduced-motion visitor gets the finished page. Every attribute is a
      // one-word verb the markup speaks; the examples share the vocabulary.
      const ST = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });

      // data-reveal — an image frame wipes in while the picture inside settles
      // from 1.12 to 1 (the editorial «curtain» reveal). The attribute's value
      // picks the direction: "" | "up" from the bottom (the default), "left" /
      // "right" from a side, "iris" as an opening circle — so a gallery can
      // alternate and read as pages turning, not a grid stamping in.
      pick<HTMLElement>("[data-reveal]").forEach((el) => {
        const img = el.querySelector<HTMLElement>("img, video, svg");
        const dir = el.dataset.reveal || "up";
        const from =
          dir === "left" ? "inset(0 100% 0 0)" :
          dir === "right" ? "inset(0 0 0 100%)" :
          dir === "iris" ? "circle(4% at 50% 52%)" :
          "inset(100% 0 0 0)";
        const to = dir === "iris" ? "circle(120% at 50% 52%)" : dir === "left" ? "inset(0 0% 0 0)" : dir === "right" ? "inset(0 0 0 0%)" : "inset(0% 0 0 0)";
        gsap.set(el, { clipPath: from });
        const tl = gsap.timeline({ scrollTrigger: ST(el, "top 88%"), onComplete: () => gsap.set(el, { clearProps: "clipPath" }) });
        tl.to(el, { clipPath: to, duration: 1.1, ease: "power3.out" });
        if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power2.out", clearProps: img.hasAttribute("data-kenburns") ? "" : "transform" }, 0);
      });

      // data-kenburns — the slow breath of a hero picture (18s, yoyo)
      pick<HTMLElement>("[data-kenburns]").forEach((el) => {
        // inside a reveal, the breath starts once the reveal has settled the picture
        gsap.to(el, { scale: 1.08, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1, delay: el.closest("[data-reveal]") ? 1.8 : 0 });
      });

      // data-focus — THE FIELD OF STILLS. A grid where every card RISES from
      // below tipped forward and out of focus, settles square and sharp as it
      // crosses the middle of the screen, then tilts away over the top edge.
      // The whole passage is SCRUBBED to the scroll — reversible, never
      // half-played — from the moment the card's box enters the viewport
      // («top bottom») to the moment it leaves it («bottom top»), so the
      // sharpest pose is exactly the middle of that journey.
      //
      // The reference's numbers, kept: 900px of perspective, a 70° tilt, ±100%
      // of travel, 300px of depth, ±40% sideways, 5° of roll, 20° of skew and
      // 8px of blur at both ends — and its mirror, the verb's value "L" or "R"
      // flipping the sideways half so the two columns lean away from one
      // another. Its ease pair too (see focusIn / focusOut above).
      //
      // ONE NUMBER IS DELIBERATELY NOT THE REFERENCE'S. It fades its stills to
      // BLACK — brightness(0), contrast(4) — because its page is black. This
      // page is paper, and has a dark theme as well, so the ends fade on
      // OPACITY instead: the same disappearance on either ground, and a card
      // face that never turns into a black rectangle on cream.
      //
      // The element carries the verb and is the TRIGGER; its first child is
      // what moves — so a card's name, badge and colourways travel with it and
      // stay part of the same still. A [data-focus-in] inside is stretched
      // 1.8 → 1 in y: the counter-stretch that keeps a tipped card from
      // reading as squashed, applied to the picture only, never to the type.
      pick<HTMLElement>("[data-focus]").forEach((el) => {
        const card = el.firstElementChild as HTMLElement | null;
        if (!card) return;
        const s = el.dataset.focus === "R" ? 1 : -1;
        const inner = card.querySelector<HTMLElement>("[data-focus-in]");
        // dir = 1 is the pose it rises FROM (below, tipped forward), dir = −1
        // the pose it leaves IN (above, tipped back) — the reference's two
        // ends, mirrored through the middle in every channel but the sideways
        // one, which leans the same way at both ends
        const away = (dir: 1 | -1) => ({
          yPercent: dir * 100, z: 300, rotationX: dir * 70,
          xPercent: s * 40, rotation: -dir * s * 5, skewX: dir * s * 20,
          opacity: 0, filter: "blur(8px)",
        });
        gsap.set(card, { transformPerspective: 900, transformOrigin: "50% 50%", force3D: true });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
        tl.fromTo(card, away(1), {
          yPercent: 0, z: 0, rotationX: 0, xPercent: 0, rotation: 0, skewX: 0,
          opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "focusIn",
        }).to(card, { ...away(-1), duration: 0.5, ease: "focusOut" });
        if (inner) {
          tl.fromTo(inner, { scaleY: 1.8 }, { scaleY: 1, duration: 0.5, ease: "focusIn" }, 0)
            .to(inner, { scaleY: 1.8, duration: 0.5, ease: "focusOut" }, 0.5);
        }
      });

      // data-shift — THE CHAPTER'S NAME HANDS THE STAGE OVER. The head stands
      // BIG AND CENTRED as its chapter arrives (that is its authored layout),
      // and the scroll then walks it TO THE LEFT and shrinks it, clearing the
      // middle for the examples underneath. It is the move the reference
      // portfolio (marieguillaume.com/weddings) plays on each chapter name,
      // rebuilt on scrub instead of its slider: reversible, never half-played.
      //
      // The FINISHED pose is the element's own place — centred, full size —
      // so a no-JS or reduced-motion visitor gets exactly the designed head;
      // the migration exists only while the scroll is carrying it.
      //
      // Measured from LAYOUT, never from getBoundingClientRect: the rect of
      // an element already carrying this tween would feed its own transform
      // back into the maths. offsetLeft ignores transforms entirely, and
      // `invalidateOnRefresh` re-reads it after a resize or a font swap.
      pick<HTMLElement>("[data-shift]").forEach((el) => {
        const sec = (el.closest("section") ?? el.parentElement) as HTMLElement | null;
        const home = el.parentElement;
        if (!sec || !home) return;
        const docX = (n: HTMLElement | null) => { let x = 0; for (let e = n; e; e = e.offsetParent as HTMLElement | null) x += e.offsetLeft; return x; };
        gsap.set(el, { transformOrigin: "0% 50%" });
        // value "top" = a head living in the HERO, which starts at the page's
        // top: a section-geometry window would already be mid-play at load,
        // so its window is absolute scroll instead — begin after the first
        // sixty pixels, done two-thirds of a viewport in.
        const atTop = el.dataset.shift === "top";
        gsap.to(el, {
          // land the head's left edge on its column's left edge
          x: () => docX(home) - docX(el),
          scale: 0.58,
          ease: "none",
          scrollTrigger: atTop
            ? { start: 60, end: () => window.innerHeight * 0.66, scrub: 0.6, invalidateOnRefresh: true }
            : { trigger: sec, start: "top 30%", end: "top -22%", scrub: 0.6, invalidateOnRefresh: true },
        });
      });

      // data-away — the hero's cargo steps aside: the long pitch fades and
      // lifts as the visitor scrolls toward the examples, so the words never
      // fight the work. Absolute scroll offsets, not element geometry — the
      // block sits at the top of the page, where a trigger-based window
      // would already be mid-play at load. The finished pose is the visible
      // one; reduced motion and no-JS simply keep the words.
      pick<HTMLElement>("[data-away]").forEach((el) => {
        gsap.to(el, {
          opacity: 0,
          y: -36,
          ease: "none",
          scrollTrigger: { start: 50, end: () => window.innerHeight * 0.55, scrub: 0.5, invalidateOnRefresh: true },
        });
      });

      // data-spotlight — a card lights under the cursor: a soft pool that
      // follows the pointer across its face, written as two custom properties
      // the CSS paints from. Adapted from the spotlight cards in the
      // feturesss21 collection (RealEstate/SpotlightCard, robot/card-spotlight)
      // into this project's idiom — no library, no state, one listener that
      // signs out through `detach`. A hover state only: nothing is parked, and
      // a touch visitor simply never meets it.
      if (window.matchMedia("(pointer: fine)").matches) {
        pick<HTMLElement>("[data-spotlight]").forEach((el) => {
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--sx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
            el.style.setProperty("--sy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
            el.style.setProperty("--so", "1");
          };
          const leave = () => el.style.setProperty("--so", "0");
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          detach.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
        });
      }

      // data-letters / data-words — type arrives in pieces. The element is
      // split at runtime (aria-label keeps the whole name readable), each piece
      // rises from under a soft blur, staggered; a pick of the hero plays on
      // arrival, anything lower plays when scrolled to.
      const split = (el: HTMLElement, mode: "letters" | "words"): HTMLElement[] => {
        if (el.dataset.split) return Array.from(el.querySelectorAll<HTMLElement>(".kn-w"));
        const text = el.textContent ?? "";
        if (!text.trim()) return [];
        el.setAttribute("aria-label", text);
        el.dataset.split = "1";
        const parts = mode === "words" ? text.split(/(\s+)/) : Array.from(text);
        el.textContent = "";
        const out: HTMLElement[] = [];
        for (const p of parts) {
          if (mode === "words" && /^\s+$/.test(p)) { el.append(p); continue; }
          const w = document.createElement("span");
          w.className = "kn-w";
          w.textContent = p;
          w.setAttribute("aria-hidden", "true");
          el.append(w);
          out.push(w);
        }
        return out;
      };
      (["letters", "words"] as const).forEach((mode) => {
        pick<HTMLElement>(`[data-${mode}]`).forEach((el) => {
          const pieces = split(el, mode);
          if (!pieces.length) return;
          const inHero = Boolean(el.closest(".kn-hero, .iv-hero, .kn-tp__hero"));
          gsap.set(pieces, { opacity: 0, y: mode === "letters" ? "0.35em" : "0.5em", filter: "blur(6px)" });
          gsap.to(pieces, {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: mode === "letters" ? 0.7 : 0.8,
            ease: "power3.out",
            stagger: Math.min(mode === "letters" ? 0.045 : 0.07, 1.6 / pieces.length),
            delay: inHero ? 0.35 : 0,
            ...(inHero ? {} : { scrollTrigger: ST(el) }),
          });
        });
      });

      // data-track — a letterspaced kicker settles from wide to its spacing
      pick<HTMLElement>("[data-track]").forEach((el) => {
        gsap.from(el, { letterSpacing: "0.75em", duration: 1.4, ease: "power3.out", ...(el.closest(".kn-hero, .iv-hero, .kn-tp__hero") ? { delay: 0.2 } : { scrollTrigger: ST(el) }) });
      });

      // data-ink — a title wipes on left to right, the way a pen crosses the
      // paper. Skips anything that is itself a data-rise member: two writers
      // on one element's y would fight.
      pick<HTMLElement>("[data-ink]").filter((el) => !el.hasAttribute("data-rise")).forEach((el) => {
        gsap.set(el, { clipPath: "inset(-0.25em 100% -0.25em 0)", y: 6 });
        gsap.to(el, {
          clipPath: "inset(-0.25em 0% -0.25em 0)", y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: ST(el), onComplete: () => gsap.set(el, { clearProps: "clipPath" }),
        });
      });

      // data-count — a numeral climbs to its authored value on arrival (an
      // age, a jubilee year). The DOM ships the finished number, so no-JS and
      // reduced motion read it as written; JS rewinds it only to play it.
      pick<HTMLElement>("[data-count]").forEach((el) => {
        const raw = (el.textContent || "").trim();
        if (!/^\d{1,4}$/.test(raw)) return;
        const end = parseInt(raw, 10);
        el.setAttribute("aria-label", raw);
        const o = { v: end };
        gsap.fromTo(o, { v: 0 }, {
          v: end, duration: Math.min(1.6, 0.6 + end * 0.02), ease: "power2.out",
          onUpdate: () => { el.textContent = String(Math.round(o.v)); },
          scrollTrigger: ST(el, "top 92%"),
        });
      });

      // data-hover-tilt — on a fine pointer a card leans a few degrees toward
      // the cursor. A hover state, not an entrance: nothing is parked, and a
      // touch visitor simply never meets it.
      if (window.matchMedia("(pointer: fine)").matches) {
        pick<HTMLElement>("[data-hover-tilt]").forEach((el) => {
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
          gsap.set(el, { transformPerspective: 700 });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(((e.clientY - r.top) / r.height - 0.5) * -5);
          };
          const leave = () => { rx(0); ry(0); };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          detach.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
        });
      }

      // data-float — an ornament breathes: ±8px and a degree or two, forever
      pick<HTMLElement>("[data-float]").forEach((el, i) => {
        const d = parseFloat(el.dataset.float || "5") || 5;
        gsap.to(el, { y: "-=8", rotation: i % 2 ? "+=2" : "-=2", duration: d, ease: "sine.inOut", yoyo: true, repeat: -1, delay: (i % 5) * 0.3 });
      });

      // data-pop — the children pop in one after another (pearls down a
      // string, calendar days, swatches, hearts)
      pick<HTMLElement>("[data-pop]").forEach((el) => {
        const kids = Array.from(el.children) as HTMLElement[];
        if (!kids.length) return;
        gsap.set(kids, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
        gsap.to(kids, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2)", stagger: Math.min(0.05, 1.4 / kids.length), scrollTrigger: ST(el) });
      });

      // data-stamp — stamped down: big, turned, transparent → seated
      pick<HTMLElement>("[data-stamp]").forEach((el) => {
        gsap.from(el, { scale: 1.6, rotation: "-=18", opacity: 0, duration: 0.7, ease: "back.out(1.6)", transformOrigin: "50% 50%", scrollTrigger: ST(el, "top 90%") });
      });

      // data-route — THE DAY'S ROUTE draws itself with the scroll: the line is
      // scrubbed from the first spot to the last, a traveller rides the curve
      // (getPointAtLength — plain SVG, no plugin), and every spot lights up as
      // the line reaches it. Parked here, never in CSS: no-JS and reduced
      // motion get the finished itinerary.
      pick<HTMLElement>("[data-route]").forEach((wrap) => {
        const line = wrap.querySelector<SVGPathElement>(".iv-route__line");
        const travel = wrap.querySelector<SVGGElement>(".iv-route__travel");
        const spots = Array.from(wrap.querySelectorAll<HTMLElement>(".iv-route__stop"));
        if (!line) return;
        gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(spots, { opacity: 0, y: 18 });
        if (travel) gsap.set(travel, { opacity: 0 });
        const lit = new Set<HTMLElement>();
        const place = (p: number) => {
          if (!travel) return;
          const len = line.getTotalLength();
          if (!len) return;
          const pt = line.getPointAtLength(Math.max(0, Math.min(1, p)) * len);
          gsap.set(travel, { x: pt.x - Number(travel.dataset.x0 ?? 0), y: pt.y, opacity: p > 0.002 && p < 0.999 ? 1 : 0 });
        };
        // the traveller's circles are authored at x = the first turn; move it
        // relative to that so a plain translate lands it on the curve
        const c0 = travel?.querySelector("circle");
        if (travel && c0) { travel.dataset.x0 = c0.getAttribute("cx") ?? "0"; }
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 78%",
            end: "bottom 72%",
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              place(p);
              spots.forEach((el) => {
                const at = parseFloat(el.dataset.at || "0");
                const on = p >= at - 0.06;
                if (on && !lit.has(el)) { lit.add(el); gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }); el.classList.add("is-on"); }
              });
            },
          },
        });
        // a route that is already past when the page opens must not stay parked
        ScrollTrigger.addEventListener("refresh", () => { if (line.getTotalLength()) place(0); });
      });

      // data-dash — a dashed path marches (the flight path), 20s a lap
      pick<SVGElement>("[data-dash]").forEach((el) => {
        const paths = el.matches("path") ? [el] : Array.from(el.querySelectorAll<SVGPathElement>("path[stroke-dasharray]"));
        paths.forEach((p) => gsap.to(p, { strokeDashoffset: -120, duration: 20, ease: "none", repeat: -1 }));
      });

      // data-scene — THE DIORAMA, behind a real lens. The stage carries CSS
      // perspective (P below must match it), and every layer is placed at its
      // TRUE depth: translateZ from data-depth, pre-scaled by (P − z)/P about
      // the frame's centre so the projected at-rest frame is EXACTLY the flat
      // no-JS page — the compensation is exact because each layer is oversized
      // symmetrically about that centre. Then the cameras move it:
      //   · the scroll DOLLIES the layers toward the lens, each advancing by
      //     its own share — the arch blows past the reader while the range
      //     holds, the pass-through both landscape references open with;
      //   · a fine pointer TILTS the box a few degrees under the cursor, the
      //     type counter-tilting in front — real parallax, the planes truly
      //     sit apart in z;
      //   · the canopy swings from its rail, the arch sides sway, the
      //     balloons bob, and the air keeps drifting.
      // On arrival the stack assembles back to front (the pull-back out of
      // the foliage the illustrated reference opens with). All parked here,
      // never in CSS: no-JS and reduced motion get the finished valley.
      pick<HTMLElement>("[data-scene]").forEach((scene) => {
        const cam = scene.querySelector<HTMLElement>(".kn-sc__cam");
        const layers = Array.from(scene.querySelectorAll<HTMLElement>("[data-depth]"));
        if (!cam || !layers.length) return;
        const arch = scene.querySelector<HTMLElement>("[data-arch]");
        const type = scene.querySelector<HTMLElement>(".kn-sc__type");
        const stage = scene.querySelector<HTMLElement>(".kn-sc__stage");
        const P = 1100; // .kn-sc__stage { perspective: 1100px } — keep in step
        const RANGE = 620; // how deep the sky sits behind the arch
        const DOLLY = 430; // how far the scroll walks in
        // THE HELD SHOT: the scene pins for most of a viewport while the
        // scroll walks the camera through it — the reference clips play in
        // place, and now so does the dolly. Reduced motion and no-JS never
        // construct this, so the static page keeps its normal flow.
        ScrollTrigger.create({ trigger: scene, start: "top top", end: "+=85%", pin: true, anticipatePin: 1 });
        const st = { trigger: scene, start: "top top", end: "+=85%", scrub: 0.5 };

        layers.forEach((l) => {
          const d = parseFloat(l.dataset.depth || "0");
          const z = -(1 - d) * RANGE;
          gsap.set(l, { z, scale: (P - z) / P, transformOrigin: "50% 50%", force3D: true });
          // the dolly: z only — the growth comes from the perspective itself
          gsap.to(l, { z: z + DOLLY * d, ease: "none", immediateRender: false, scrollTrigger: st });
        });

        // the pull-back: the far layers land first, the arch last
        gsap.set(layers, { opacity: 0, y: 30 });
        gsap.to(layers, { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.085 });
        if (arch) gsap.to(arch, { opacity: 0.3, ease: "none", immediateRender: false, scrollTrigger: st });
        if (type) gsap.fromTo(type, { yPercent: 0 }, { yPercent: -14, opacity: 0.2, ease: "none", immediateRender: false, scrollTrigger: st });
        // the hint bobs until the reader obliges, then bows out in the first
        // twelfth of the held shot
        const hint = scene.querySelector<HTMLElement>(".kn-sc__hint");
        if (hint) {
          gsap.to(hint, { y: 6, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(hint, { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: scene, start: "top top", end: "+=12%", scrub: true } });
        }

        // THE GRABBED ANIMATION (the castle valley's reference clip): a
        // camera that never stops. The drift wrapper breathes forward in z —
        // a true dolly, since the planes keep their own depths under it — with
        // a hint of lateral pan; it rides on its own wrapper so the pointer's
        // quickTo rotations on the cam never fight it. Where there is no
        // drift, the stage keeps its old 2D breath.
        const drift = scene.querySelector<HTMLElement>(".kn-sc__drift");
        if (drift) {
          gsap.to(drift, { z: 92, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
          gsap.to(drift, { x: 14, rotationY: 0.8, duration: 23, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5 });
        } else if (stage) {
          // the frame never quite stops moving
          gsap.to(stage, { scale: 1.045, duration: 24, ease: "sine.inOut", yoyo: true, repeat: -1 });
        }

        // the mill wheel turns (geometry symmetric about its hub, so the
        // bbox centre IS the axle); the flock crosses the sky and comes round
        scene.querySelectorAll<SVGGElement>(".kn-sc__wheel").forEach((w) => {
          gsap.to(w, { rotation: 360, duration: 12, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        });
        const flock = scene.querySelector<SVGElement>(".kn-sc__flock");
        if (flock) {
          gsap.fromTo(flock, { x: -320 }, { x: 1560, duration: 36, ease: "none", repeat: -1, repeatDelay: 5 });
          gsap.to(flock, { y: -22, duration: 4.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        }

        // the pointer is the second camera — a fine pointer only, and never a
        // parked state: at rest every angle reads 0
        if (window.matchMedia("(pointer: fine)").matches) {
          const rx = gsap.quickTo(cam, "rotationX", { duration: 0.8, ease: "power2.out" });
          const ry = gsap.quickTo(cam, "rotationY", { duration: 0.8, ease: "power2.out" });
          const tx = type ? gsap.quickTo(type, "rotationX", { duration: 1, ease: "power2.out" }) : null;
          const ty = type ? gsap.quickTo(type, "rotationY", { duration: 1, ease: "power2.out" }) : null;
          if (type) gsap.set(type, { transformPerspective: 900 });
          const move = (e: PointerEvent) => {
            const r = scene.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            ry(nx * 4);
            rx(ny * -2.6);
            ty?.(nx * -1.7);
            tx?.(ny * 1.2);
          };
          const leave = () => { rx(0); ry(0); tx?.(0); ty?.(0); };
          scene.addEventListener("pointermove", move);
          scene.addEventListener("pointerleave", leave);
          detach.push(() => { scene.removeEventListener("pointermove", move); scene.removeEventListener("pointerleave", leave); });
        }

        // the hung things swing in depth. The mirrored arch side is rotated on
        // the INNER svg, never on the scaleX(-1) wrapper — GSAP would read
        // that matrix back as a 180° rotation and turn the sway inside out.
        const canopy = scene.querySelector<HTMLElement>(".kn-sc__canopy");
        if (canopy) {
          gsap.set(canopy, { transformPerspective: 800, transformOrigin: "50% 0%" });
          gsap.to(canopy, { keyframes: [{ rotationX: 2.4 }, { rotationX: 0 }, { rotationX: -2.4 }, { rotationX: 0 }], duration: 9, ease: "sine.inOut", repeat: -1 });
        }
        scene.querySelectorAll<SVGSVGElement>(".kn-sc__arch").forEach((a, i) => {
          gsap.set(a, { transformPerspective: 700, transformOrigin: "0% 0%" });
          gsap.to(a, { keyframes: [{ rotationY: 5 }, { rotationY: 0 }, { rotationY: -3 }, { rotationY: 0 }], duration: 12, ease: "sine.inOut", repeat: -1, delay: i * 1.4 });
        });
        scene.querySelectorAll<SVGGElement>(".kn-sc__bl").forEach((b, i) => {
          gsap.to(b, { y: i % 2 ? 7 : -7, rotation: i % 2 ? 2 : -2, duration: 3.2 + (i % 5) * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: (i % 7) * 0.35, transformOrigin: "50% 50%" });
        });
        scene.querySelectorAll<SVGElement>(".kn-sc__mote").forEach((m, i) => {
          gsap.to(m, { x: (i % 2 ? 1 : -1) * (26 + i * 4), y: -34 - i * 3, opacity: 0.2, duration: 9 + (i % 5) * 2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
        });
        const birds = scene.querySelector<SVGElement>(".kn-sc__birds");
        if (birds) gsap.to(birds, { x: 170, y: -26, duration: 24, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      // ---- the venue drawings draw themselves ------------------------------
      // Every stroke in Sketch.tsx carries pathLength="1", so dasharray/offset
      // work in normalised units regardless of each path's real length. The
      // parked state (offset 1 = invisible) is set HERE and only here — never
      // in CSS — so reduced-motion and no-JS visitors get the finished
      // drawing, per the same contract as every parked state on the card.
      gsap.utils.toArray<SVGSVGElement>(".kn-sketch").forEach((svg) => {
        const strokes = svg.querySelectorAll<SVGPathElement>("path");
        if (!strokes.length) return;
        gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.to(strokes, {
          strokeDashoffset: 0,
          duration: 1.7,
          ease: "power2.inOut",
          // One stroke after another, the order they are declared — which is
          // the order a hand would draw them: ground, walls, door, dome, cross.
          stagger: 0.12,
          scrollTrigger: { trigger: svg, start: "top 82%", once: true },
        });
      });

      // ---- photographs: drift + settle ------------------------------------
      // Every Plate.tsx frame carries a mover. `data-drift` = scroll-parallax:
      // the picture travels a fraction of its own height across the viewport,
      // slower than the page — a photograph on paper, not a sticker on it.
      // The mover is oversized by the same fraction (Plate sets `inset`), so
      // the travel can never expose the frame's edge. Scrubbed, not tweened:
      // it must be reversible and pinned to scroll position, or fast scrolling
      // leaves pictures mid-flight.
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((mv) => {
        const d = parseFloat(mv.dataset.drift || "0");
        if (!d) return;
        gsap.fromTo(
          mv,
          { yPercent: -d * 100 * 0.5 },
          {
            yPercent: d * 100 * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: mv.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // `data-zoom` = the slow settle from 1.08 to 1 as a plate enters — the
      // Ken Burns every editorial site quietly uses. Once, on entry.
      gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((mv) => {
        gsap.fromTo(
          mv,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.9,
            ease: "power2.out",
            scrollTrigger: { trigger: mv.parentElement, start: "top 85%", once: true },
          },
        );
      });

      // ---- the landing hero plate: a slow, continuous breath ---------------
      // Not scroll-driven — the hero is above the fold. A 14s float on the
      // picture only (the frame is still), so the page has a pulse before the
      // visitor has moved. Yoyo, so it never jumps.
      const heroMv = document.querySelector<HTMLElement>(".kn-svc__heroPlate .kn-plate__mv");
      if (heroMv) {
        gsap.to(heroMv, {
          scale: 1.06,
          yPercent: -1.5,
          duration: 14,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // A late refresh: fonts swap in after this effect runs, and Armenian
      // metrics differ enough from the fallback to move every trigger.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        detach.forEach((f) => f());
        gsap.ticker.remove(onRaf);
        delete (window as unknown as { __lenis?: unknown }).__lenis;
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
