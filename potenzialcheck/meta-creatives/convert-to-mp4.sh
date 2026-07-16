#!/usr/bin/env bash
#
# Konvertiert animierte creative-*.html zu MP4 (+ optional GIF), 1080 x 1350 (4:5).
# Rendert die CSS-Animation deterministisch Frame für Frame per Headless-Chrome
# (über die Web-Animations-API: currentTime wird pro Frame gesetzt) und setzt die
# Frames mit ffmpeg zu einem Video zusammen. Dadurch sauberer, ruckelfreier Loop.
#
# ╔══════════════════════════════════════════════════════════════════════╗
# ║  KONFIG — hier eintragen, was du willst                              ║
# ╚══════════════════════════════════════════════════════════════════════╝

# Welche HTML-Dateien umwandeln? (eine pro Zeile, Pfad relativ zu diesem Ordner)
FILES=(
  # "creative-1-animated.html"
  # "creative-2-animated.html"
  # "creative-3-animated.html"
  # "creative-4-animated.html"
  "creative-5-animated.html"
)

DURATION=15        # Länge des Videos in Sekunden
FPS=30             # Bilder pro Sekunde (30 = flüssig; 25 reicht meist auch)
MAKE_GIF=0         # 1 = zusätzlich ein GIF erzeugen, 0 = nur MP4
GIF_WIDTH=600      # Breite des GIFs in px (kleiner = kleinere Datei)

# Tipp: Für einen NAHTLOSEN Loop bei Meta sollte DURATION ein Vielfaches der
# Animations-Länge in der HTML sein (creative-1-animated.html loopt in 3 s →
# 3, 6, 9, 12, 15 … Sekunden ergeben einen sprungfreien Übergang beim Neustart).

# ╔══════════════════════════════════════════════════════════════════════╗
# ║  Ab hier nichts mehr ändern nötig                                    ║
# ╚══════════════════════════════════════════════════════════════════════╝
set -euo pipefail
cd "$(dirname "$0")"

# ── Chrome/Chromium finden ─────────────────────────────────────────────
CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "$(command -v google-chrome 2>/dev/null || true)" \
  "$(command -v chromium 2>/dev/null || true)" \
  "$(command -v chromium-browser 2>/dev/null || true)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
[ -z "$CHROME" ] && { echo "Fehler: Kein Chrome/Chromium gefunden." >&2; exit 1; }

# ── Voraussetzungen prüfen ─────────────────────────────────────────────
command -v node   >/dev/null 2>&1 || { echo "Fehler: Node.js nicht gefunden (https://nodejs.org)." >&2; exit 1; }
command -v npm    >/dev/null 2>&1 || { echo "Fehler: npm nicht gefunden." >&2; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "Fehler: ffmpeg nicht gefunden (brew install ffmpeg)." >&2; exit 1; }

# ── puppeteer-core einmalig in einen Cache-Ordner installieren ─────────
# (steuert das vorhandene Chrome; lädt KEIN eigenes Chromium herunter)
RENDER_DIR="$HOME/.cache/smartwandler-mp4-render"
export PUPPETEER_SKIP_DOWNLOAD=1
if [ ! -d "$RENDER_DIR/node_modules/puppeteer-core" ]; then
  echo "Einmalige Einrichtung: installiere puppeteer-core …"
  mkdir -p "$RENDER_DIR"
  ( cd "$RENDER_DIR" && npm init -y >/dev/null 2>&1 && npm i puppeteer-core >/dev/null 2>&1 ) \
    || { echo "Fehler: puppeteer-core-Installation fehlgeschlagen." >&2; exit 1; }
fi

# ── Node-Renderer (schreibt Frames als PNG) ────────────────────────────
RENDERER="$RENDER_DIR/render.mjs"
cat > "$RENDERER" <<'NODE_EOF'
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [, , CHROME, HTML, OUTDIR, DURATION, FPS] = process.argv;
const fps    = Number(FPS);
const total  = Math.round(Number(DURATION) * fps);
const dt     = 1000 / fps;

fs.rmSync(OUTDIR, { recursive: true, force: true });
fs.mkdirSync(OUTDIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1160, height: 1430, deviceScaleFactor: 1 });
await page.goto('file://' + HTML, { waitUntil: 'networkidle0' });
await page.evaluate(async () => { await document.fonts.ready; });
await new Promise(r => setTimeout(r, 300));

const el = await page.$('#creative');
if (!el) { console.error('Kein Element mit id="creative" gefunden.'); process.exit(2); }

for (let i = 0; i < total; i++) {
  const t = i * dt;                       // Zeitpunkt in ms
  await page.evaluate((tt) => {
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = tt; }
  }, t);
  const num = String(i).padStart(5, '0');
  await el.screenshot({ path: `${OUTDIR}/f_${num}.png` });
}

await browser.close();
console.log(`  ${total} Frames gerendert`);
NODE_EOF

# ── Verarbeitung ───────────────────────────────────────────────────────
FRAMES="$(mktemp -d)"
trap 'rm -rf "$FRAMES"' EXIT

count=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || { echo "✗ $f nicht gefunden, übersprungen" >&2; continue; }
  base="${f%.html}"
  echo "▸ $f  →  ${base}.mp4  (${DURATION}s @ ${FPS}fps)"

  node "$RENDERER" "$CHROME" "$PWD/$f" "$FRAMES" "$DURATION" "$FPS"

  # Frames → MP4 (H.264, gerade Maße, feed-tauglich)
  ffmpeg -y -framerate "$FPS" -i "$FRAMES/f_%05d.png" \
    -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart \
    "${base}.mp4" >/dev/null 2>&1

  # optional GIF (über Palette für saubere Farben)
  if [ "$MAKE_GIF" = "1" ]; then
    pal="$(mktemp -u).png"
    ffmpeg -y -i "${base}.mp4" -vf "fps=25,scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen=stats_mode=diff" "$pal" >/dev/null 2>&1
    ffmpeg -y -i "${base}.mp4" -i "$pal" \
      -filter_complex "fps=25,scale=${GIF_WIDTH}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
      "${base}.gif" >/dev/null 2>&1
    rm -f "$pal"
    echo "  ✓ ${base}.mp4  +  ${base}.gif"
  else
    echo "  ✓ ${base}.mp4"
  fi

  rm -rf "${FRAMES:?}/"*
  count=$((count+1))
done

echo "Fertig: $count Video(s) im Ordner $(basename "$PWD")/"
