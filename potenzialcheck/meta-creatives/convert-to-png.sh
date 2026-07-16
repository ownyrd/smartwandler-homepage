#!/usr/bin/env bash
#
# Konvertiert alle creative-*.html in diesem Ordner zu PNGs (1080 x 1350, 4:5).
# Rendert per Headless-Chrome nur die Creative-Fläche (ohne den grauen Vorschau-Rand).
#
# Aufruf:   ./convert-to-png.sh          # 1080 x 1350 (1x)
#           SCALE=2 ./convert-to-png.sh  # 2160 x 2700 (schärfer, doppelte Auflösung)
#
# Voraussetzung: Google Chrome oder Chromium. Internet (für die Inter-Webfont).
#
set -euo pipefail
cd "$(dirname "$0")"

OUTDIR="png"
SCALE="${SCALE:-1}"      # 1 = 1080x1350, 2 = 2160x2700
mkdir -p "$OUTDIR"

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
if [ -z "$CHROME" ]; then
  echo "Fehler: Kein Chrome/Chromium gefunden. Bitte Google Chrome installieren." >&2
  exit 1
fi

# Temp-Render-Dateien immer aufräumen (auch bei Abbruch)
trap 'rm -f ./.render_*.html' EXIT

shopt -s nullglob
count=0
for f in creative-*.html; do
  base="${f%.html}"
  out="$PWD/$OUTDIR/${base}.png"

  # Temp-Kopie IM SELBEN ORDNER (damit relative Logo-Pfade weiter funktionieren):
  # Body-Rand/Backdrop entfernen, damit die 1080x1350-Flaeche exakt oben links sitzt.
  tmp="./.render_${base}.html"
  sed 's|</head>|<style>html,body{margin:0!important;padding:0!important;background:#fff!important;display:block!important}.creative{margin:0!important}</style></head>|' "$f" > "$tmp"

  "$CHROME" \
    --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
    --force-device-scale-factor="$SCALE" \
    --window-size=1080,1350 \
    --virtual-time-budget=4000 \
    --screenshot="$out" "file://$PWD/$tmp" >/dev/null 2>&1 || true

  rm -f "$tmp"

  if [ -f "$out" ]; then
    echo "✓ ${base}.png"
    count=$((count+1))
  else
    echo "✗ $f fehlgeschlagen" >&2
  fi
done

echo "Fertig: $count PNG(s) in ./$OUTDIR/  (Groesse: $((1080*SCALE))x$((1350*SCALE)))"
