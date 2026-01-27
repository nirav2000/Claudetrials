#!/bin/bash

# Version Archiving Script
# This script creates a complete snapshot of the application for a specific version
# Usage: ./archive-version.sh <version-number> <version-type> <description>
# Example: ./archive-version.sh 2.1.0 minor "Enhanced educational content"

set -e

# Check if version number is provided
if [ -z "$1" ]; then
    echo "Error: Version number is required"
    echo "Usage: ./archive-version.sh <version-number> <version-type> <description>"
    echo "Example: ./archive-version.sh 2.1.0 minor 'Enhanced educational content'"
    exit 1
fi

VERSION=$1
VERSION_TYPE=${2:-"patch"}
DESCRIPTION=${3:-"Version release"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION_DIR="$SCRIPT_DIR/v$VERSION"

echo "========================================="
echo "Version Archiving Script"
echo "========================================="
echo "Version: $VERSION"
echo "Type: $VERSION_TYPE"
echo "Description: $DESCRIPTION"
echo "Project Root: $PROJECT_ROOT"
echo "Version Dir: $VERSION_DIR"
echo "========================================="

# Create version directory
echo "Creating version directory..."
mkdir -p "$VERSION_DIR"

# Copy index.html as the main entry point
echo "Copying index.html..."
cp "$PROJECT_ROOT/index.html" "$VERSION_DIR/index.html"

# Copy JS directory
echo "Copying JS files..."
cp -r "$PROJECT_ROOT/js" "$VERSION_DIR/"

# Copy CSS directory
echo "Copying CSS files..."
cp -r "$PROJECT_ROOT/css" "$VERSION_DIR/"

# Copy assets if they exist
if [ -d "$PROJECT_ROOT/assets" ]; then
    echo "Copying assets..."
    cp -r "$PROJECT_ROOT/assets" "$VERSION_DIR/"
fi

# Copy any other necessary files (fonts, images, etc.)
if [ -d "$PROJECT_ROOT/fonts" ]; then
    echo "Copying fonts..."
    cp -r "$PROJECT_ROOT/fonts" "$VERSION_DIR/"
fi

# Create a README for this version
echo "Creating version README..."
cat > "$VERSION_DIR/README.md" <<EOF
# Fraction Worksheet Generator - Version $VERSION

**Version:** $VERSION
**Type:** $VERSION_TYPE
**Date:** $(date +%Y-%m-%d)
**Description:** $DESCRIPTION

## About This Archive

This is a complete snapshot of the Fraction Worksheet Generator at version $VERSION.

All files necessary to run this version are included:
- index.html (main application)
- js/ (JavaScript modules)
- css/ (Stylesheets)
- assets/ (Images, fonts, and other resources)

## Running This Version

Simply open \`index.html\` in a web browser, or serve this directory with any web server.

Example with Python:
\`\`\`bash
python -m http.server 8000
\`\`\`

Then visit: http://localhost:8000

## Changelog

See \`../changelogs/v$VERSION.md\` for detailed changelog.

---

Archived on: $(date +"%Y-%m-%d %H:%M:%S")
EOF

# Create or update the standalone HTML file (for backward compatibility)
echo "Creating standalone HTML file..."
STANDALONE_FILE="$PROJECT_ROOT/fraction-worksheet-v$VERSION.html"
if [ -f "$STANDALONE_FILE" ]; then
    echo "  Standalone file already exists: $STANDALONE_FILE"
else
    cp "$PROJECT_ROOT/index.html" "$STANDALONE_FILE"
    echo "  Created standalone file: $STANDALONE_FILE"
fi

echo ""
echo "========================================="
echo "✓ Version $VERSION archived successfully!"
echo "========================================="
echo "Archive location: $VERSION_DIR"
echo "Files included:"
find "$VERSION_DIR" -type f | wc -l | xargs echo "  - Total files:"
du -sh "$VERSION_DIR" | awk '{print "  - Total size: " $1}'
echo ""
echo "Next steps:"
echo "1. Update versions/version-manifest.json with this version"
echo "2. Create or update versions/changelogs/v$VERSION.md"
echo "3. Test the archived version by opening $VERSION_DIR/index.html"
echo "4. Commit and push the changes"
echo "========================================="
