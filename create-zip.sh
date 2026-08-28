#!/bin/bash

# Name of the output archive
OUTPUT="smartwandler.zip"

# Parent directory
WORKING_DIR="."

# Create zip archive
# Hinweis: fb-capi-config.php UND potenzialcheck/submit-config.php werden absichtlich
# NICHT mitgenommen (enthalten geheime Keys/Tokens) und müssen separat aufs FTP geladen
# werden. Ebenso bleiben Setup-/Referenzdateien (schema.sql, SETUP.md, *.brevo.html)
# außen vor – sie werden nicht vom Server ausgeliefert.
#
# Der *.html-Glob nimmt bewusst alle Seiten mit, damit neue Landingpages nicht
# vergessen werden. Interne Werkzeuge (Banner-Generatoren, Snippet-Sammlung) und
# die Sicherungskopie backup-landing.html werden unten per -x wieder ausgeschlossen –
# sie sollen nicht öffentlich erreichbar sein.
zip -r "$OUTPUT" \
    "$WORKING_DIR/fonts" \
    "$WORKING_DIR/images" \
    "$WORKING_DIR"/*.html \
    "$WORKING_DIR"/*.css \
    "$WORKING_DIR"/*.js \
    "$WORKING_DIR"/s-event.php \
    "$WORKING_DIR/.htaccess" \
    "$WORKING_DIR/sitemap.xml" \
    "$WORKING_DIR/robots.txt" \
    "$WORKING_DIR/potenzialcheck/index.html" \
    "$WORKING_DIR/potenzialcheck/bestaetigt.html" \
    "$WORKING_DIR/potenzialcheck/check.css" \
    "$WORKING_DIR/potenzialcheck/check.js" \
    "$WORKING_DIR/potenzialcheck/submit.php" \
    "$WORKING_DIR/potenzialcheck/cleanup-leads.php" \
    "$WORKING_DIR/video/maschinenbau-demo-720p.mp4" \
    "$WORKING_DIR/video/maschinenbau-demo-poster.jpg" \
    -x "$WORKING_DIR/backup-landing.html" \
       "$WORKING_DIR/linkedin-banner.html" \
       "$WORKING_DIR/linkedin-banner-dunkel.html" \
       "$WORKING_DIR/smartwandler-company-banner.html" \
       "$WORKING_DIR/meetergo-embedding-snippets.html"

echo "Archive created: $OUTPUT"
unzip -l "$OUTPUT" | tail -1