#!/usr/bin/env bash
#
# render-briefe.sh
#
# Rendert ausgewählte Briefe aus dem Ordner "briefe" (HTML) mit Headless Chrome
# als PDF in den Ordner "briefe-final".
#
# Verwendung:
#   ./render-briefe.sh 1 5 16 17          # Briefe mit diesen Prefix-Nummern
#   ./render-briefe.sh "1, 5, 16-17"      # Komma-Liste und Bereiche (16-17) erlaubt
#   ./render-briefe.sh                    # ohne Argumente -> interaktive Eingabe
#
# Die Nummern beziehen sich auf das Prefix der Dateien, z.B. "05" in
# "05_gesa-ingenieurgesellschaft-....html". Ein- und zweistellige Eingaben
# funktionieren ("5" findet "05_...").

set -euo pipefail

# --- Pfade ---------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/briefe"
OUT_DIR="$SCRIPT_DIR/briefe-final"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# --- Checks --------------------------------------------------------------
if [[ ! -x "$CHROME" ]]; then
    echo "Fehler: Google Chrome nicht gefunden unter:" >&2
    echo "  $CHROME" >&2
    exit 1
fi

if [[ ! -d "$SRC_DIR" ]]; then
    echo "Fehler: Quellordner nicht gefunden: $SRC_DIR" >&2
    exit 1
fi

mkdir -p "$OUT_DIR"

# --- Eingabe der Nummern -------------------------------------------------
if [[ $# -gt 0 ]]; then
    raw_input="$*"
else
    echo "Briefnummern eingeben (z.B. 1 5 16-17, Komma erlaubt):"
    read -r raw_input
fi

# Kommas und Bindestrich-Bereiche in einzelne Nummern auflösen
numbers=()
# Kommas durch Leerzeichen ersetzen, dann tokenisieren
for token in ${raw_input//,/ }; do
    if [[ "$token" == *-* ]]; then
        start="${token%%-*}"
        end="${token##*-}"
        # Nur numerische Bereiche behandeln
        if [[ "$start" =~ ^[0-9]+$ && "$end" =~ ^[0-9]+$ ]]; then
            for ((n=10#$start; n<=10#$end; n++)); do
                numbers+=("$n")
            done
            continue
        fi
    fi
    numbers+=("$token")
done

if [[ ${#numbers[@]} -eq 0 ]]; then
    echo "Keine Nummern angegeben. Abbruch." >&2
    exit 1
fi

# --- Rendern -------------------------------------------------------------
ok=0
fail=0

for num in "${numbers[@]}"; do
    if [[ ! "$num" =~ ^[0-9]+$ ]]; then
        echo "  ! Überspringe ungültige Eingabe: '$num'"
        ((fail++)) || true
        continue
    fi

    # Auf zwei Stellen auffüllen, damit "5" -> "05"
    padded="$(printf '%02d' "$((10#$num))")"

    # Passende HTML-Datei suchen (Prefix + Unterstrich)
    html_file=""
    for candidate in "$SRC_DIR/${padded}_"*.html "$SRC_DIR/${num}_"*.html; do
        if [[ -f "$candidate" ]]; then
            html_file="$candidate"
            break
        fi
    done

    if [[ -z "$html_file" ]]; then
        echo "  ! Kein Brief gefunden für Nummer $num (${padded}_*.html)"
        ((fail++)) || true
        continue
    fi

    base="$(basename "$html_file" .html)"
    out_pdf="$OUT_DIR/${base}.pdf"

    echo "  → $base.html  ->  briefe-final/$base.pdf"

    "$CHROME" \
        --headless=new \
        --disable-gpu \
        --no-pdf-header-footer \
        --no-margins \
        --virtual-time-budget=8000 \
        --run-all-compositor-stages-before-draw \
        --print-to-pdf="$out_pdf" \
        "file://$html_file" \
        >/dev/null 2>&1

    if [[ -f "$out_pdf" ]]; then
        ((ok++)) || true
    else
        echo "  ! Fehler beim Rendern von $base"
        ((fail++)) || true
    fi
done

echo ""
echo "Fertig: $ok erstellt, $fail fehlgeschlagen. Ausgabe in: $OUT_DIR"
