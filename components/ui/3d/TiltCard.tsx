"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ============================================================================
// TILT CARD — a stage that leans toward the pointer (desktop) or with the
// device (phones, gyroscope), with layered children separating in depth.
//
// The Framer pattern this replaces (useMotionValue → useTransform → rotateX/Y)
// is three lines of maths and a spring; here it is gsap.quickTo, which is a
// spring with a name. Children carry `data-depth` (0..1) and translate in Z
// by depth × 40px, so a card lifts off a photograph as the stage tilts.
//
// GYROSCOPE: on a device with orientation events the stage follows
// beta/gamma instead of the pointer. iOS 13+ requires an explicit permission
// obtained from a user gesture — so where `requestPermission` exists, a
// small "enable tilt" button appears and the listener only starts after the
// tap. Everywhere else it starts on mount. Under reduced motion neither
// pointer nor gyro runs and the stage stands still.
//
// `flip` turns the stage into a two-faced card: click/tap rotates it 180° on
// Y, and the back face (marked data-face="back") shows.
// ============================================================================

const MAX = 9; // degrees at the edge / at ~25° of device tilt

type DOEvent = DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export default function TiltCard({
  children,
  className = "",
  flip = false,
  gyro = true,
}: {
  children: React.ReactNode;
  className?: string;
  flip?: boolean;
  gyro?: boolean;
}) {
  const stage = useRef<HTMLDivElement | null>(null);
  const [needsPerm, setNeedsPerm] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const flippedRef = useRef(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.55, ease: "power3.out" });
    el.dataset.tilt = "";
    el.querySelectorAll<HTMLElement>("[data-depth]").forEach((l) =>
      gsap.set(l, { z: parseFloat(l.dataset.depth || "0") * 40 }),
    );

    // rotationY is shared with the flip; the tilt adds to whichever face is up
    const baseY = () => (flippedRef.current ? 180 : 0);

    // --- pointer ---------------------------------------------------------
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(baseY() + px * MAX * 2);
      rx(-py * MAX * 2);
    };
    const leave = () => {
      rx(0);
      ry(baseY());
    };
    if (fine) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
    }

    // --- gyroscope -------------------------------------------------------
    let onOri: ((e: DeviceOrientationEvent) => void) | null = null;
    const startGyro = () => {
      onOri = (e) => {
        const g = e.gamma ?? 0; // left/right, -90..90
        const b = e.beta ?? 0; // front/back, -180..180
        ry(baseY() + Math.max(-MAX, Math.min(MAX, (g / 25) * MAX)));
        rx(Math.max(-MAX, Math.min(MAX, -((b - 45) / 25) * MAX))); // 45° = phone held naturally
      };
      window.addEventListener("deviceorientation", onOri);
    };
    const DOE = (window as unknown as { DeviceOrientationEvent?: DOEvent }).DeviceOrientationEvent;
    if (gyro && !fine && DOE) {
      if (typeof DOE.requestPermission === "function") setNeedsPerm(true);
      else startGyro();
    }
    (el as HTMLDivElement & { __startGyro?: () => void }).__startGyro = startGyro;

    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      if (onOri) window.removeEventListener("deviceorientation", onOri);
      delete el.dataset.tilt;
    };
  }, [gyro]);

  const askPerm = async () => {
    const DOE = (window as unknown as { DeviceOrientationEvent?: DOEvent }).DeviceOrientationEvent;
    try {
      const r = await DOE?.requestPermission?.();
      if (r === "granted") {
        (stage.current as (HTMLDivElement & { __startGyro?: () => void }) | null)?.__startGyro?.();
        setNeedsPerm(false);
      }
    } catch {
      setNeedsPerm(false);
    }
  };

  const doFlip = () => {
    if (!flip || !stage.current) return;
    flippedRef.current = !flippedRef.current;
    setFlipped(flippedRef.current);
    gsap.to(stage.current, { rotationY: flippedRef.current ? 180 : 0, rotationX: 0, duration: 0.9, ease: "power3.inOut" });
  };

  return (
    <div className={`kn-tilt${className ? ` ${className}` : ""}`}>
      <div
        className="kn-tilt__stage"
        ref={stage}
        data-flippable={flip ? "" : undefined}
        data-flipped={flipped ? "" : undefined}
        onClick={flip ? doFlip : undefined}
        role={flip ? "button" : undefined}
        tabIndex={flip ? 0 : undefined}
        onKeyDown={flip ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), doFlip()) : undefined}
      >
        {children}
      </div>
      {needsPerm && (
        <button type="button" className="kn-tilt__perm" onClick={askPerm}>
          Enable tilt
        </button>
      )}
    </div>
  );
}
