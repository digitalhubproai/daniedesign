import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/art";
mkdirSync(OUT, { recursive: true });

const clamp = (v) => Math.max(0, Math.min(255, v));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixRGB(c1, c2, t) {
  return [
    lerp(c1[0], c2[0], t),
    lerp(c1[1], c2[1], t),
    lerp(c1[2], c2[2], t),
  ];
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mesh-style abstract art:
 * layered radial gradients (blobs), linear base gradient, grain, vignette.
 * Pure raster: no SVG involved.
 */
async function renderArt(file, width, height, opts) {
  const rand = mulberry32(opts.seed ?? 7);
  const baseTop = hexToRgb(opts.baseTop);
  const baseBottom = hexToRgb(opts.baseBottom);

  const blobs = Array.from({ length: opts.blobs ?? 5 }, () => {
    const colors = opts.palette;
    return {
      x: rand() * width,
      y: rand() * height,
      r: (0.25 + rand() * 0.5) * Math.max(width, height),
      c: hexToRgb(colors[Math.floor(rand() * colors.length)]),
      power: 1.5 + rand() * 2.5,
      opacity: 0.25 + rand() * 0.45,
    };
  });

  const grain = opts.grain ?? 10;
  const vignette = opts.vignette ?? 0.45;

  const buf = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const t = y / height;
      let r = mixRGB(baseTop, baseBottom, t);
      let g = r[1];
      let b = r[2];
      r = r[0];

      for (const blob of blobs) {
        const dx = x - blob.x;
        const dy = y - blob.y;
        const d = Math.sqrt(dx * dx + dy * dy) / blob.r;
        if (d < 1) {
          const f = Math.pow(1 - d, blob.power) * blob.opacity;
          r = mixRGB([r, g, b], blob.c, f);
          g = r[1];
          b = r[2];
          r = r[0];
        }
      }

      const nx = (x / width - 0.5) * 2;
      const ny = (y / height - 0.5) * 2;
      const vd = Math.sqrt(nx * nx + ny * ny);
      const vf = 1 - Math.max(0, vd - 0.55) * vignette;
      r *= vf;
      g *= vf;
      b *= vf;

      const n = (rand() - 0.5) * grain;
      buf[i] = clamp(r + n);
      buf[i + 1] = clamp(g + n);
      buf[i + 2] = clamp(b + n);
      buf[i + 3] = 255;
    }
  }

  await sharp(buf, { raw: { width, height, channels: 4 } })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/${file}`);
  console.log("generated", file, `${width}x${height}`);
}

const jobs = [
  { file: "hero.jpg", width: 1150, height: 1400, opts: { seed: 11, baseTop: "#111113", baseBottom: "#1c1c20", palette: ["#c8ff4d", "#3a6b35", "#0f3d2e", "#1f2430"], blobs: 6, grain: 9 } },
  { file: "service-branding.jpg", width: 1400, height: 1000, opts: { seed: 21, baseTop: "#15120d", baseBottom: "#241c12", palette: ["#ff5c39", "#ffb25c", "#7a2e1c", "#2e2318"], blobs: 5, grain: 8 } },
  { file: "service-uiux.jpg", width: 1400, height: 1000, opts: { seed: 22, baseTop: "#0c1016", baseBottom: "#14202e", palette: ["#38bdf8", "#6366f1", "#0e3a52", "#182636"], blobs: 5, grain: 8 } },
  { file: "service-dev.jpg", width: 1400, height: 1000, opts: { seed: 23, baseTop: "#101013", baseBottom: "#1d1b26", palette: ["#a78bfa", "#f472b6", "#2b2450", "#171522"], blobs: 5, grain: 8 } },
  { file: "service-marketing.jpg", width: 1400, height: 1000, opts: { seed: 24, baseTop: "#0f120f", baseBottom: "#1a2418", palette: ["#c8ff4d", "#84cc16", "#1d2b16", "#10180e"], blobs: 5, grain: 8 } },
  { file: "work-01.jpg", width: 1800, height: 1200, opts: { seed: 31, baseTop: "#12100c", baseBottom: "#26200f", palette: ["#ffb25c", "#ff5c39", "#8a4d1f", "#3a2c12"], blobs: 6, grain: 7 } },
  { file: "work-02.jpg", width: 1200, height: 1500, opts: { seed: 32, baseTop: "#0f1013", baseBottom: "#1a1d24", palette: ["#e2e8f0", "#475569", "#334155", "#0f172a"], blobs: 5, grain: 7 } },
  { file: "work-03.jpg", width: 2000, height: 1100, opts: { seed: 33, baseTop: "#101313", baseBottom: "#1e2622", palette: ["#c8ff4d", "#4ade80", "#123b26", "#17211c"], blobs: 7, grain: 7 } },
  { file: "work-04.jpg", width: 1200, height: 1500, opts: { seed: 34, baseTop: "#140e14", baseBottom: "#2a1526", palette: ["#f472b6", "#e879f9", "#5b1e4a", "#241020"], blobs: 5, grain: 7 } },
  { file: "work-05.jpg", width: 1800, height: 1200, opts: { seed: 35, baseTop: "#0d1016", baseBottom: "#101b2e", palette: ["#38bdf8", "#818cf8", "#12304a", "#0d1726"], blobs: 6, grain: 7 } },
  { file: "work-06.jpg", width: 2000, height: 1100, opts: { seed: 36, baseTop: "#131012", baseBottom: "#2a1a20", palette: ["#fb7185", "#ff5c39", "#5e1f2e", "#24151a"], blobs: 7, grain: 7 } },
  { file: "work-07.jpg", width: 1200, height: 1500, opts: { seed: 37, baseTop: "#101210", baseBottom: "#1a2418", palette: ["#a3e635", "#c8ff4d", "#1d3a1c", "#131a12"], blobs: 5, grain: 7 } },
  { file: "work-08.jpg", width: 1600, height: 1000, opts: { seed: 38, baseTop: "#13110f", baseBottom: "#241e18", palette: ["#fcd34d", "#f59e0b", "#6b4215", "#241c12"], blobs: 5, grain: 7 } },
  { file: "story.jpg", width: 1600, height: 1100, opts: { seed: 41, baseTop: "#101013", baseBottom: "#1b1b22", palette: ["#c8ff4d", "#e2e8f0", "#2b2b36", "#14141a"], blobs: 6, grain: 7 } },
  { file: "creative-01.jpg", width: 900, height: 1100, opts: { seed: 51, baseTop: "#14100c", baseBottom: "#2e2112", palette: ["#ffb25c", "#ff5c39", "#8a4d1f", "#1d150c"], blobs: 5, grain: 8 } },
  { file: "creative-02.jpg", width: 900, height: 1100, opts: { seed: 52, baseTop: "#0c1016", baseBottom: "#16202e", palette: ["#38bdf8", "#6366f1", "#0e3a52", "#121c2a"], blobs: 5, grain: 8 } },
  { file: "creative-03.jpg", width: 900, height: 1100, opts: { seed: 53, baseTop: "#101310", baseBottom: "#1c261a", palette: ["#c8ff4d", "#84cc16", "#1d2b16", "#111a10"], blobs: 5, grain: 8 } },
  { file: "creative-04.jpg", width: 900, height: 1100, opts: { seed: 54, baseTop: "#120e14", baseBottom: "#261626", palette: ["#f472b6", "#a78bfa", "#4a1e4a", "#1c121c"], blobs: 5, grain: 8 } },
  { file: "contact.jpg", width: 1400, height: 1000, opts: { seed: 61, baseTop: "#0e0e10", baseBottom: "#1c1c20", palette: ["#c8ff4d", "#38bdf8", "#22262e", "#121216"], blobs: 6, grain: 8 } },
];

for (const j of jobs) {
  await renderArt(j.file, j.width, j.height, j.opts);
}
console.log("done");