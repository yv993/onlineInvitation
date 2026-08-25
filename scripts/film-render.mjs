// ============================================================================
// FILM → .mp4 — renders /film/<tpl> to a real vertical video a couple can
// post as a story. The film is pure CSS animation on one shared timeline
// (components/film/Film.tsx), so this does not "record" anything in real
// time: it SEEKS the Web Animations timeline frame by frame and captures a
// still of each, then hands the frames to ffmpeg. The result is exact,
// deterministic and never drops a frame.
//
//   node scripts/film-render.mjs wedding-5
//   node scripts/film-render.mjs wedding-5 --p=<draft-blob>   (a real couple)
//   node scripts/film-render.mjs wedding-5 --base=http://localhost:4101
//
// Needs: a running server (dev or prod), Edge or Chrome, and ffmpeg on PATH.
// Writes: out/film-<tpl>.mp4 (1080×1920, 25 fps, H.264 — what Instagram,
// WhatsApp status and Telegram all accept).
// ============================================================================

import { spawn, execSync, execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const tpl = process.argv[2];
if (!tpl) {
  console.error("usage: node scripts/film-render.mjs <template-id> [--p=<blob>] [--base=<url>]");
  process.exit(1);
}
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const BASE = arg("base", "http://localhost:4100");
const BLOB = arg("p", "");
const FPS = Number(arg("fps", "25"));
const DURATION = Number(arg("seconds", "23.5")); // the film's own length
const W = 1080, H = 1920;
const SCALE = 2; // capture the 540-wide stage at 2× for a 1080 master

const OUT = path.join(process.cwd(), "out");
const FRAMES = path.join(OUT, `frames-${tpl}`);
mkdirSync(FRAMES, { recursive: true });

// ---- a headless browser, driven over CDP -----------------------------------
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9971;
const browser = spawn(EDGE, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--no-first-run",
  "--disable-extensions", "--mute-audio", "--hide-scrollbars",
  `--user-data-dir=${path.join(OUT, "prof")}`, "about:blank",
], { stdio: "ignore" });

let ws;
for (let i = 0; i < 200 && !ws; i++) {
  await sleep(250);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch { /* the browser is still coming up */ }
}
await new Promise((r) => (ws.onopen = r));
let id = 0;
const waiting = new Map();
ws.onmessage = (m) => {
  const j = JSON.parse(m.data);
  const k = waiting.get(j.id);
  if (k) { waiting.delete(j.id); k(j.result); }
};
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }))?.result?.value;

await send("Page.enable");
await send("Runtime.enable");
// the stage is 9:16; give the viewport exactly the master's aspect at 1× CSS
await send("Emulation.setDeviceMetricsOverride", { width: W / SCALE, height: H / SCALE, deviceScaleFactor: SCALE, mobile: true });

const url = `${BASE}/film/${tpl}${BLOB ? `?p=${encodeURIComponent(BLOB)}` : ""}`;
console.log("→", url);
await send("Page.navigate", { url });
await sleep(9000); // fonts, images, first paint

// the stage fills the frame, and the page's own chrome steps out of the shot
await evaluate(`(() => {
  const st = document.querySelector('.kn-film__stage');
  if (!st) return 'no-stage';
  document.body.style.margin = '0';
  document.documentElement.style.background = getComputedStyle(st).backgroundColor;
  // hoist the stage to fill the viewport exactly
  st.style.position = 'fixed';
  st.style.inset = '0';
  st.style.width = '100vw';
  st.style.height = '100vh';
  st.style.maxWidth = 'none';
  st.style.aspectRatio = 'auto';
  st.style.borderRadius = '0';
  st.style.boxShadow = 'none';
  st.style.zIndex = '99999';
  // EVERYTHING ELSE DISAPPEARS. Hiding only body's children is not enough:
  // making the stage's ancestors visible again un-hides their other
  // descendants too (the floating language chip rode into the first cut
  // that way). So hide every SIBLING at every level of the stage's chain.
  let node = st;
  while (node && node.parentElement && node !== document.body) {
    for (const sib of node.parentElement.children) if (sib !== node) sib.style.display = 'none';
    node = node.parentElement;
  }
  return 'ok';
})()`);
await sleep(600);

// pause every animation on the stage: from here the CLOCK IS OURS
const count = await evaluate(`(() => {
  const all = document.getAnimations();
  all.forEach(a => { a.pause(); });
  return all.length;
})()`);
console.log("animations on the timeline:", count);

const total = Math.round(DURATION * FPS);
for (let f = 0; f < total; f++) {
  const ms = (f / FPS) * 1000;
  await evaluate(`(() => { for (const a of document.getAnimations()) { try { a.currentTime = ${ms}; } catch {} } return ${ms}; })()`);
  // one paint at the seeked time
  await evaluate(`new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(path.join(FRAMES, `f${String(f).padStart(5, "0")}.png`), Buffer.from(shot.data, "base64"));
  if (f % 25 === 0) process.stdout.write(`\r  frame ${f}/${total}`);
}
process.stdout.write(`\r  frame ${total}/${total}\n`);

ws.close();
try { execSync(`taskkill /PID ${browser.pid} /T /F`, { stdio: "ignore" }); } catch { /* already gone */ }

// ---- frames → mp4 ----------------------------------------------------------
const mp4 = path.join(OUT, `film-${tpl}.mp4`);
execFileSync("ffmpeg", [
  "-y", "-framerate", String(FPS),
  "-i", path.join(FRAMES, "f%05d.png"),
  "-vf", `scale=${W}:${H}:flags=lanczos,format=yuv420p`,
  "-c:v", "libx264", "-preset", "slow", "-crf", "18",
  "-movflags", "+faststart",
  mp4,
], { stdio: "inherit" });

rmSync(FRAMES, { recursive: true, force: true });
console.log("\n✓", mp4);
