// Generates the optimised images in public/img from the originals in images-src/.
// Run with: npm run images   (only needed when an original image changes)
//
// - The background photo is saved at several widths in AVIF and WebP, plus one
//   JPEG fallback, so each device downloads only the size it needs.
// - The APMB emblem is resized to the size it is actually shown at (x2 for
//   high-density screens).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/img';
const PHOTO = 'images-src/container-ship.jpg';
const PHOTO_WIDTHS = [640, 960, 1280, 1600, 2400];

await mkdir(OUT, { recursive: true });

for (const width of PHOTO_WIDTHS) {
  const image = sharp(PHOTO).resize({ width });
  await image.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT}/container-ship-${width}.avif`);
  await image.clone().webp({ quality: 72 }).toFile(`${OUT}/container-ship-${width}.webp`);
}
await sharp(PHOTO).resize({ width: 1600 }).jpeg({ quality: 72, progressive: true, mozjpeg: true }).toFile(`${OUT}/container-ship-1600.jpg`);

// Emblem is shown at 36-44px, so 96px covers high-density screens.
await sharp('images-src/apmb-emblem.png').resize({ width: 96 }).webp({ quality: 85 }).toFile(`${OUT}/apmb-emblem.webp`);

// Small PNG for the browser tab icon.
await sharp('images-src/apmb-emblem.png').resize({ width: 48 }).png({ compressionLevel: 9 }).toFile('public/favicon.png');

console.log('Images written to', OUT);
