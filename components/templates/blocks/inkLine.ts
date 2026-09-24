// GENERATED — do not edit by hand (see inkArt.ts, which says where from).
//
// The two ornaments of the client's Figma file «Wedding» that a CLIENT
// component draws: the day's heart (InkDay's week, and the heart that runs
// down the line) and the line's tail (InkDay; Blocks' static timeline). They
// live apart from the rest so that a page's script carries these two alone —
// the rest are drawn by the server (inkArt.ts says why this matters).

import type { InkArt } from "./inkArt";

export const heart: InkArt = {
  w: 194,
  h: 192.8,
  paths: [
    { d: "M96.6 42C96.6 42 105.3 -1.1 144.8 0.1C144.8 0.1 199.8 2.8 193.4 69.1C187.1 135.3 99.4 192.9 99.4 192.9C99.4 192.9 9.7 138.5 0.9 72.6C-7.9 6.7 47 1.8 47 1.8C86.4 -0.8 96.6 42 96.6 42Z", fill: "#631729" },
  ],
};

export const tail: InkArt = {
  w: 615,
  h: 324,
  paths: [
    { d: "M519.5 -2744C519.5 -2637.5 465 -2487.5 265.5 -2447.5C68.3 -2408 -289 -2471.5 -303 -2196C-317 -1920.5 192 -1871 149.5 -1715.5C107 -1560 -352.5 -1595.5 -303 -1362C-253.5 -1128.5 199 -1227.5 248.5 -1015.5C298 -803.5 -119 -838.5 -27 -662C65 -485.5 411.5 -463.5 369 -273C326.5 -82.5 -27 -160 29.5 52C53.2 141 243 331.6 369 260C526.5 170.5 388 99.5 369 170.5C363 124.5 316.5 118.5 300 154C275 207.8 376 339.5 600.5 312.5", stroke: "black", sw: 3 },
  ],
};
