/**
 * Generates lossless WebP variants for responsive delivery.
 * Run: npm run generate:images
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.resolve(__dirname, "../public/media");

/** @type {Array<{ input: string; widths: number[] }>} */
const ASSETS = [
  { input: "filtration.png", widths: [640, 1024] },
  { input: "uv.png", widths: [640, 1024] },
  { input: "ozone.png", widths: [640, 1024] },
  { input: "osmos.png", widths: [640, 1024] },
  { input: "back.png", widths: [768, 1376] },
  { input: "black.png", widths: [480, 704] },
  { input: "0,5.png", widths: [640, 1024] },
  { input: "1.5l.png", widths: [640, 1024] },
  { input: "mountain-lake-hero.jpg", widths: [828] },
];

const losslessWebp = { lossless: true, effort: 6 };

const resizeLosslessWebp = async (inputPath, outputPath, width) => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const targetWidth = Math.min(width, metadata.width ?? width);

  await image
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp(losslessWebp)
    .toFile(outputPath);

  const stats = await fs.stat(outputPath);
  return stats.size;
};

const main = async () => {
  let generated = 0;

  for (const asset of ASSETS) {
    const inputPath = path.join(MEDIA_DIR, asset.input);
    try {
      await fs.access(inputPath);
    } catch {
      console.warn(`Skip missing: ${asset.input}`);
      continue;
    }

    const base = asset.input.replace(/\.[^.]+$/, "");

    for (const width of asset.widths) {
      const outputName = `${base}-${width}.webp`;
      const outputPath = path.join(MEDIA_DIR, outputName);
      const bytes = await resizeLosslessWebp(inputPath, outputPath, width);
      console.log(`✓ ${outputName} (${(bytes / 1024).toFixed(0)} KB)`);
      generated += 1;
    }
  }

  console.log(`\nGenerated ${generated} lossless WebP variants in public/media/`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
