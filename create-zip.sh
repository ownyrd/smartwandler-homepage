#!/bin/bash

# Name of the output archive
OUTPUT="smartwandler.zip"

# Parent directory
WORKING_DIR="."

# Create zip archive
# Hinweis: fb-capi-config.php wird absichtlich NICHT mitgenommen
# (enthält geheimen Access Token) und muss separat aufs FTP geladen werden.
zip -r "$OUTPUT" \
    "$WORKING_DIR/fonts" \
    "$WORKING_DIR/images" \
    "$WORKING_DIR"/*.html \
    "$WORKING_DIR"/*.css \
    "$WORKING_DIR"/*.js \
    "$WORKING_DIR"/fb-capi.php \
    "$WORKING_DIR/.htaccess"

echo "Archive created: $OUTPUT"