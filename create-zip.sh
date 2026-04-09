#!/bin/bash

# Name of the output archive
OUTPUT="smartwandler.zip"

# Parent directory
WORKING_DIR="."

# Create zip archive
zip -r "$OUTPUT" \
    "$WORKING_DIR/fonts" \
    "$WORKING_DIR/images" \
    "$WORKING_DIR"/*.html \
    "$WORKING_DIR"/*.css \
    "$WORKING_DIR"/*.js \
    "$WORKING_DIR/.htaccess"

echo "Archive created: $OUTPUT"