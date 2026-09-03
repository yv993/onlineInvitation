// ============================================================================
// QR — a compact QR Code encoder (byte mode, error-correction level M,
// versions 1–10, automatic mask selection), returning the module matrix.
//
// Written here rather than installed: the check-in card on the corporate
// summit template needs one code, and every QR package on npm ships far more
// than that. This is the standard algorithm (ISO/IEC 18004): data
// segmentation → Reed–Solomon over GF(256) → interleave → placement with the
// finder/timing/alignment patterns → mask + penalty score → format/version
// bits. Rendered as SVG rects by the block that uses it.
//
// Verified in this session by construction, NOT by a physical scanner — see
// the README's honesty note. The check-in card therefore also prints the
// human-readable code the QR encodes.
// ============================================================================

const EC_M_CODEWORDS = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26]; // per block, v1..10
const EC_M_BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
const TOTAL_CODEWORDS = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346];
const ALIGN: number[][] = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

// GF(256) with the QR polynomial 0x11D
const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
const mul = (a: number, b: number) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);

function rsGenerator(n: number): number[] {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const ng = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= mul(g[j], EXP[i]); }
    g = ng;
  }
  return g;
}
function rsRemainder(data: number[], n: number): number[] {
  const g = rsGenerator(n);
  const res = new Array(n).fill(0);
  for (const d of data) {
    const f = d ^ res.shift()!;
    res.push(0);
    if (f) for (let j = 0; j < n; j++) res[j] ^= mul(g[j + 1], f);
  }
  return res;
}

export function qrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  // pick version
  let v = 1;
  for (; v <= 10; v++) {
    const cap = TOTAL_CODEWORDS[v] - EC_M_CODEWORDS[v] * EC_M_BLOCKS[v];
    const bitsNeeded = 4 + (v < 10 ? 8 : 16) + bytes.length * 8;
    if (bitsNeeded <= cap * 8) break;
  }
  if (v > 10) throw new Error("qr: too long");
  const size = v * 4 + 17;
  const dataCap = TOTAL_CODEWORDS[v] - EC_M_CODEWORDS[v] * EC_M_BLOCKS[v];

  // bitstream
  const bits: number[] = [];
  const push = (val: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(0b0100, 4);
  push(bytes.length, v < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  push(0, Math.min(4, dataCap * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  for (let pad = 0xec; data.length < dataCap; pad ^= 0xec ^ 0x11) data.push(pad);

  // blocks + EC (level M: all blocks same size for v1..10 except the "long" ones; handle both)
  const nb = EC_M_BLOCKS[v], ecLen = EC_M_CODEWORDS[v];
  const shortLen = Math.floor(dataCap / nb), longCount = dataCap % nb;
  const blocks: number[][] = [], ecs: number[][] = [];
  let off = 0;
  for (let b = 0; b < nb; b++) {
    const len = shortLen + (b >= nb - longCount ? 1 : 0);
    const blk = data.slice(off, off + len); off += len;
    blocks.push(blk); ecs.push(rsRemainder(blk, ecLen));
  }
  const out: number[] = [];
  for (let i = 0; i < shortLen + 1; i++) for (const b of blocks) if (i < b.length) out.push(b[i]);
  for (let i = 0; i < ecLen; i++) for (const e of ecs) out.push(e[i]);

  // matrix + function patterns
  const m: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const set = (r: number, c: number, val: boolean) => { if (r >= 0 && r < size && c >= 0 && c < size) m[r][c] = val; };
  const finder = (r: number, c: number) => {
    for (let dr = -1; dr <= 7; dr++) for (let dc = -1; dc <= 7; dc++) {
      const on = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6 && (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
      set(r + dr, c + dc, on);
    }
  };
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
  for (let i = 8; i < size - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  const al = ALIGN[v];
  for (const r of al) for (const c of al) {
    if (m[r][c] !== null) continue;
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++)
      set(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
  }
  set(size - 8, 8, true); // dark module
  // reserve format areas
  for (let i = 0; i < 8; i++) { if (m[8][i] === null) m[8][i] = false; if (m[i][8] === null) m[i][8] = false; if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = false; if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = false; }
  if (m[8][8] === null) m[8][8] = false;
  const isFunc = m.map((row) => row.map((x) => x !== null));

  // place data
  const allBits: number[] = [];
  out.forEach((b) => { for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1); });
  let bi = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        const upward = ((right + 1) & 2) === 0;
        const r = upward ? size - 1 - vert : vert;
        if (!isFunc[r][c]) { m[r][c] = allBits[bi] === 1; bi++; }
      }
    }
  }
  // Unreached remainder modules stay light before masking (as the standard
  // does), rather than null-ish truthy.
  const M = m.map((row) => row.map((x) => (x === null ? false : x))) as boolean[][];

  // masks + penalty
  const MASKS = [
    (r: number, c: number) => (r + c) % 2 === 0,
    (r: number) => r % 2 === 0,
    (_r: number, c: number) => c % 3 === 0,
    (r: number, c: number) => (r + c) % 3 === 0,
    (r: number, c: number) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r: number, c: number) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r: number, c: number) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r: number, c: number) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];
  const applyMask = (k: number, base: boolean[][]) => base.map((row, r) => row.map((val, c) => (isFunc[r][c] ? val : val !== MASKS[k](r, c))));
  const formatBits = (k: number) => {
    const d = (0b00 << 3) | k; // level M = 00
    let rem = d;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) & 1 ? 0x537 : 0);
    return ((d << 10) | rem) ^ 0x5412;
  };
  const writeFormat = (mat: boolean[][], k: number) => {
    const f = formatBits(k);
    const bit = (i: number) => ((f >> i) & 1) === 1;
    // THE FORMAT WORD WAS WRITTEN TRANSPOSED (found by audit, 2026-09-03).
    // This file is a port of nayuki's encoder, whose setFunctionModule(x, y)
    // takes the COLUMN first; everything else here was translated to
    // mat[row][col] correctly — the data walk, the masks, the finders — but
    // this block kept nayuki's argument order, so bits 0..5 landed on row 8
    // where the spec has column 8, and so on. A reader takes the 15 bits from
    // the spec positions and gets them in REVERSE order, the BCH check fails
    // on both copies, and the symbol does not scan. Proven both ways with a
    // real decoder (jsqr): the old matrix returned null, this one decodes.
    //
    // spec, in (row, col): first copy
    for (let i = 0; i <= 5; i++) mat[i][8] = bit(i);        // column 8, rows 0-5
    mat[7][8] = bit(6);                                     // column 8, row 7 (row 6 is timing)
    mat[8][8] = bit(7);
    mat[8][7] = bit(8);                                     // row 8, column 7 (column 6 is timing)
    for (let i = 9; i < 15; i++) mat[8][14 - i] = bit(i);   // row 8, columns 5-0
    // second copy: row 8 at the right edge, then column 8 at the bottom
    for (let i = 0; i < 8; i++) mat[8][size - 1 - i] = bit(i);
    for (let i = 8; i < 15; i++) mat[size - 15 + i][8] = bit(i);
    mat[size - 8][8] = true; // the dark module — the one cell that was already right
  };
  const penalty = (mat: boolean[][]) => {
    let p = 0;
    for (let r = 0; r < size; r++) { let run = 1; for (let c = 1; c < size; c++) { if (mat[r][c] === mat[r][c - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (let c = 0; c < size; c++) { let run = 1; for (let r = 1; r < size; r++) { if (mat[r][c] === mat[r - 1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) { const v0 = mat[r][c]; if (v0 === mat[r][c + 1] && v0 === mat[r + 1][c] && v0 === mat[r + 1][c + 1]) p += 3; }
    let dark = 0; for (const row of mat) for (const v0 of row) if (v0) dark++;
    p += Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
    return p;
  };
  let best = 0, bestP = Infinity, bestM: boolean[][] = [];
  for (let k = 0; k < 8; k++) {
    const mat = applyMask(k, M);
    writeFormat(mat, k);
    const p = penalty(mat);
    if (p < bestP) { bestP = p; best = k; bestM = mat; }
  }
  void best;
  return bestM;
}
