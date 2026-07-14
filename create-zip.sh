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
zip -r "$OUTPUT" \
    "$WORKING_DIR/fonts" \
    "$WORKING_DIR/images" \
    "$WORKING_DIR"/*.html \
    "$WORKING_DIR"/*.css \
    "$WORKING_DIR"/*.js \
    "$WORKING_DIR"/s-event.php \
    "$WORKING_DIR/.htaccess" \
    "$WORKING_DIR/potenzialcheck/index.html" \
    "$WORKING_DIR/potenzialcheck/bestaetigt.html" \
    "$WORKING_DIR/potenzialcheck/check.css" \
    "$WORKING_DIR/potenzialcheck/check.js" \
    "$WORKING_DIR/potenzialcheck/submit.php" \
    "$WORKING_DIR/video/smartwandler-demo-720p.mp4" \
    "$WORKING_DIR/video/smartwandler-demo-poster.jpg"

echo "Archive created: $OUTPUT"