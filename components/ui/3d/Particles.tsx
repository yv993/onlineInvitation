"use client";

import { useEffect, useRef } from "react";
import type { Fx } from "@/lib/templates";

// ============================================================================
// PARTICLES — the ambient layer behind a template, one <canvas>, seven
// systems chosen by the registry's `fx`:
//
//   petals    rose petals falling and turning (wedding classic)
//   gold      gold dust drifting up, twinkling (jubilee, eucharist, slate)
//   sparkles  neon sparks with additive glow (product launch)
//   clouds    soft cloud puffs drifting sideways (angelic)
//   grid      a perspective cyber grid scrolling toward the viewer (summit)
//   confetti  3D-projected confetti tumbling on three axes (birthday, kids)
//   leaves    botanical leaves gliding down (boho, floral)
//
// The brief names Three.js / R3F. These systems are 2D-canvas with a hand
// projection for the 3D ones (confetti tumbles in x/y/z and is projected with
// a focal length; the grid is a real perspective transform) — a WebGL scene
// for a few hundred sprites is a 600 KB dependency for the same pixels. It is
// GPU-composited (the canvas is its own layer), capped at devicePixelRatio 2,
// PAUSED when the tab is hidden or the section is off-screen
// (IntersectionObserver), and never mounts under reduced motion — the
// template is simply still.
// ============================================================================

type P = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number; a: number; s: number; // rotation, alpha, size
  va: number; vr: number; hue: number; ph: number;
};

const COUNT: Record<Fx, number> = { petals: 46, gold: 120, sparkles: 90, clouds: 14, grid: 0, confetti: 110, leaves: 34, none: 0 };

export default function Particles({ fx, color = "#C9A66B", className = "" }: { fx: Fx; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || fx === "none") return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, raf = 0, running = false, t0 = performance.now();
    const ps: P[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (p: P, fresh = false): P => {
      switch (fx) {
        case "petals":
        case "leaves":
          p.x = rnd(-40, W + 40); p.y = fresh ? rnd(-H, H) : rnd(-80, -10); p.z = rnd(0.4, 1);
          p.vx = rnd(-0.25, 0.25); p.vy = rnd(0.35, 0.9) * (fx === "leaves" ? 0.8 : 1); p.vz = 0;
          p.s = rnd(7, 15); p.r = rnd(0, Math.PI * 2); p.vr = rnd(-0.02, 0.02); p.a = rnd(0.5, 0.9); p.va = 0; p.hue = rnd(0, 1); p.ph = rnd(0, 6.28);
          break;
        case "gold":
          p.x = rnd(0, W); p.y = fresh ? rnd(0, H) : rnd(H, H + 40); p.z = rnd(0.3, 1);
          p.vx = rnd(-0.12, 0.12); p.vy = rnd(-0.35, -0.08); p.vz = 0;
          p.s = rnd(0.8, 2.6); p.r = 0; p.vr = 0; p.a = rnd(0.2, 0.9); p.va = 0; p.hue = 0; p.ph = rnd(0, 6.28);
          break;
        case "sparkles":
          p.x = rnd(0, W); p.y = rnd(0, H); p.z = rnd(0.3, 1);
          p.vx = rnd(-0.2, 0.2); p.vy = rnd(-0.2, 0.2); p.vz = 0;
          p.s = rnd(1, 3); p.r = 0; p.vr = 0; p.a = 0; p.va = 0; p.hue = 0; p.ph = rnd(0, 6.28);
          break;
        case "clouds":
          p.x = fresh ? rnd(-200, W) : -260; p.y = rnd(-40, H * 0.9); p.z = rnd(0.3, 1);
          p.vx = rnd(0.08, 0.22); p.vy = 0; p.vz = 0;
          p.s = rnd(90, 190); p.r = 0; p.vr = 0; p.a = rnd(0.25, 0.5); p.va = 0; p.hue = 0; p.ph = rnd(0, 6.28);
          break;
        case "confetti":
          p.x = rnd(-0.6, 0.6); p.y = fresh ? rnd(-1.2, 1.2) : rnd(-1.4, -1.1); p.z = rnd(0.5, 2.5);
          p.vx = rnd(-0.0015, 0.0015); p.vy = rnd(0.003, 0.007); p.vz = 0;
          p.s = rnd(6, 11); p.r = rnd(0, 6.28); p.vr = rnd(-0.08, 0.08); p.a = 1; p.va = rnd(-0.06, 0.06); p.hue = Math.random(); p.ph = rnd(0, 6.28);
          break;
        default:
          break;
      }
      return p;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    for (let i = 0; i < COUNT[fx]; i++) ps.push(spawn({} as P, true));

    const CONF_COLORS = [color, "#FF4FD8", "#4CC9F0", "#F3EFE7", "#FFD166", "#8C9A82"];

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      if (fx === "grid") {
        // a perspective floor: horizontal lines converging to a horizon,
        // scrolling toward the viewer; vertical lines fanning from the vanish
        const hz = H * 0.42, cx = W / 2;
        ctx.strokeStyle = color; ctx.lineWidth = 1;
        const rows = 18, speed = (t * 0.35) % 1;
        for (let i = 0; i < rows; i++) {
          const k = (i + speed) / rows; // 0 near horizon .. 1 near viewer
          const y = hz + Math.pow(k, 2.2) * (H - hz);
          ctx.globalAlpha = 0.05 + k * 0.45;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        for (let i = -12; i <= 12; i++) {
          const xB = cx + i * (W / 8);
          ctx.globalAlpha = 0.18;
          ctx.beginPath(); ctx.moveTo(cx + i * 6, hz); ctx.lineTo(xB, H); ctx.stroke();
        }
        // a soft glow at the horizon
        const g = ctx.createLinearGradient(0, hz - 60, 0, hz + 60);
        g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, color + "55"); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, hz - 60, W, 120);
        return;
      }

      for (const p of ps) {
        switch (fx) {
          case "petals":
          case "leaves": {
            p.x += p.vx + Math.sin(t * 0.9 + p.ph) * 0.35; p.y += p.vy * (0.6 + p.z * 0.6); p.r += p.vr;
            if (p.y > H + 30) spawn(p);
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r + Math.sin(t + p.ph) * 0.4);
            ctx.globalAlpha = p.a * (0.55 + p.z * 0.45);
            ctx.fillStyle = fx === "petals" ? (p.hue > 0.5 ? "#E9B4B0" : color) : (p.hue > 0.5 ? "#8C9A82" : "#B7A97A");
            ctx.beginPath();
            // a petal / leaf: two quadratic arcs
            ctx.moveTo(0, -p.s); ctx.quadraticCurveTo(p.s * 0.9, -p.s * 0.2, 0, p.s); ctx.quadraticCurveTo(-p.s * 0.9, -p.s * 0.2, 0, -p.s);
            ctx.fill(); ctx.restore();
            break;
          }
          case "gold": {
            p.x += p.vx; p.y += p.vy * (0.5 + p.z);
            if (p.y < -10) spawn(p);
            const tw = 0.5 + 0.5 * Math.sin(t * 2.2 + p.ph);
            ctx.globalAlpha = p.a * tw;
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (0.6 + p.z * 0.6), 0, 6.28); ctx.fill();
            break;
          }
          case "sparkles": {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) spawn(p);
            const tw = Math.max(0, Math.sin(t * 3 + p.ph)) ** 3;
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = tw * 0.9;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 6);
            g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 6, 0, 6.28); ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            break;
          }
          case "clouds": {
            p.x += p.vx * (0.5 + p.z);
            if (p.x > W + 260) spawn(p);
            ctx.globalAlpha = p.a;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
            g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(0.55, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.ellipse(p.x, p.y, p.s, p.s * 0.55, 0, 0, 6.28); ctx.fill();
            break;
          }
          case "confetti": {
            // 3D: position in a unit box, projected with focal length; tumble
            // on three axes → the projected quad's width/height breathe.
            p.x += p.vx; p.y += p.vy / p.z; p.r += p.vr; p.a += p.va;
            if (p.y > 1.4) spawn(p);
            const f = 1.6, sc = f / (f + p.z);
            const sx = W / 2 + p.x * W * sc, sy = H / 2 + p.y * H * 0.5 * sc;
            const w = p.s * sc * Math.abs(Math.cos(p.r)) + 1, h = p.s * 0.55 * sc * Math.abs(Math.cos(p.a)) + 1;
            ctx.save(); ctx.translate(sx, sy); ctx.rotate(p.r * 0.5 + p.a);
            ctx.globalAlpha = 0.9 * sc;
            ctx.fillStyle = CONF_COLORS[Math.floor(p.hue * CONF_COLORS.length)];
            ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
            break;
          }
          default: break;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => { if (!running) return; draw(now); raf = requestAnimationFrame(loop); };
    const start = () => { if (running) return; running = true; t0 = performance.now() - 1; raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0.01 });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [fx, color]);

  if (fx === "none") return null;
  return <canvas ref={ref} className={`kn-fx${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
