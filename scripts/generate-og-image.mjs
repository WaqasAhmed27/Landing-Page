import sharp from "sharp";

// Builds public/og-image.jpg (1200x630), the og:image / twitter:image for every page.
// Re-run with `npm run og:image` after changing the copy or logo; the JPG is committed.

const WIDTH = 1200;
const HEIGHT = 630;
const output = "public/og-image.jpg";

const YELLOW = "#FFF248";
const GREEN = "#4ADE80";
const INK = "#111111";
const CREAM = "#FDFBEE";
const FONT = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";

// Logo card on the right: 360px white tile, 6px border, hard offset shadow.
const card = { x: 770, y: 125, size: 360, border: 6, shadow: 14, radius: 32 };
const logoSize = card.size - card.border * 2 - 60;

const grid = Array.from({ length: Math.ceil(WIDTH / 42) }, (_, i) => `M${i * 42} 0V${HEIGHT}`)
  .concat(Array.from({ length: Math.ceil(HEIGHT / 42) }, (_, i) => `M0 ${i * 42}H${WIDTH}`))
  .join("");

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${YELLOW}"/>
  <path d="${grid}" stroke="${INK}" stroke-opacity="0.08" stroke-width="1"/>
  <rect x="12" y="12" width="${WIDTH - 24}" height="${HEIGHT - 24}" fill="none" stroke="${INK}" stroke-width="8"/>

  <g font-family="${FONT}" fill="${INK}">
    <rect x="70" y="80" width="292" height="44" rx="22" fill="${GREEN}" stroke="${INK}" stroke-width="4"/>
    <text x="216" y="110" font-size="19" font-weight="900" text-anchor="middle" letter-spacing="1.5">TAPTILE · PAKISTAN</text>

    <text x="66" y="235" font-size="84" font-weight="900" letter-spacing="-2">Digital receipts</text>
    <text x="66" y="330" font-size="84" font-weight="900" letter-spacing="-2">for Pakistan.</text>

    <text x="70" y="400" font-size="28" font-weight="700" fill="#333333">One tap. Zero POS changes.</text>

    <rect x="76" y="470" width="300" height="70" rx="14" fill="${INK}"/>
    <rect x="70" y="464" width="300" height="70" rx="14" fill="${CREAM}" stroke="${INK}" stroke-width="5"/>
    <text x="220" y="511" font-size="32" font-weight="900" text-anchor="middle">taptile.pk</text>

    <text x="400" y="511" font-size="22" font-weight="700" fill="#333333">NFC · QR · No app needed</text>
  </g>

  <rect x="${card.x + card.shadow}" y="${card.y + card.shadow}" width="${card.size}" height="${card.size}" rx="${card.radius}" fill="${INK}"/>
  <rect x="${card.x}" y="${card.y}" width="${card.size}" height="${card.size}" rx="${card.radius}" fill="#FFFFFF" stroke="${INK}" stroke-width="${card.border}"/>
</svg>`;

// The source logo sits on a faint off-white square; snap near-white to white so it disappears.
const { data, info } = await sharp("public/logo-512.png").raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += info.channels) {
  if (data[i] >= 240 && data[i + 1] >= 240 && data[i + 2] >= 240) data.fill(255, i, i + 3);
}
const logo = await sharp(await sharp(data, { raw: info }).trim().png().toBuffer())
  .resize(logoSize, logoSize, { fit: "contain", background: "#FFFFFF" })
  .png()
  .toBuffer();
const offset = card.border + 30;

await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: card.x + offset, top: card.y + offset }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(output);

console.log(`Wrote ${output} (${WIDTH}x${HEIGHT})`);
