// One-off / re-runnable image optimizer.
// Converts large source PNGs in src/assets/images to web-optimized WebP.
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "../src/assets/images");

// [sourceFile, outputFile, maxWidth, quality]
const jobs = [
  ["silkpedi_hero_bg.png", "silkpedi_hero_bg.webp", 2336, 80],
];

for (const [src, out, maxWidth, quality] of jobs) {
  const input = path.join(imagesDir, src);
  const output = path.join(imagesDir, out);
  const info = await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);
  console.log(`${src} -> ${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
