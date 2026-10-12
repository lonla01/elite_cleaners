// Generates on-brand placeholder images for every entry in src/content/images.ts.
// Usage: node scripts/generate-placeholders.mjs   (overwrites existing placeholders only
// when --force is passed, so real photos dropped into public/images are never replaced).
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const force = process.argv.includes("--force");
const registry = readFileSync("src/content/images.ts", "utf8");
const entries = [
  ...registry.matchAll(/"([a-z-]+)": \{ src: "([^"]+)", width: (\d+), height: (\d+) \}/g),
];

const tones = [
  ["#1b2740", "#3a4a6b", "#b08d57"],
  ["#2b2f36", "#5a6070", "#cdb083"],
  ["#d9cfc0", "#ede7dd", "#7a5c2e"],
  ["#26365a", "#121a2b", "#cdb083"],
];

mkdirSync("public/images", { recursive: true });

for (const [i, [, key, src, w, h]] of entries.entries()) {
  const out = `public${src}`;
  if (existsSync(out) && !force) continue;
  const [a, b, accent] = tones[i % tones.length];
  const width = Number(w);
  const height = Number(h);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="l" cx="0.75" cy="0.2" r="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <line x1="${width * 0.94 - 80}" y1="${height * 0.08}" x2="${width * 0.94}" y2="${height * 0.08}" stroke="${accent}" stroke-width="2"/>
  <text x="${width * 0.94}" y="${height * 0.08 + Math.round(width / 60) + 12}" text-anchor="end" font-family="Georgia, serif" font-size="${Math.round(width / 60)}" fill="${accent}" opacity="0.9">PLACEHOLDER · ${key}</text>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 72 }).toFile(out);
  console.log(`generated ${out} (${width}×${height})`);
}
