#!/bin/bash

##
# Version System Installer
#
# This script installs and configures the auto-versioning system for your project.
#
# Usage:
#   ./install.sh [--force]
##

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION_SYSTEM_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$VERSION_SYSTEM_DIR/.." && pwd)"

# Force flag
FORCE=false
if [[ "$1" == "--force" ]]; then
  FORCE=true
fi

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Auto-Versioning System Installer                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo "📁 Project root: $PROJECT_ROOT"
echo "📦 Version system: $VERSION_SYSTEM_DIR"
echo ""

# Check if git repository
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo -e "${RED}❌ Error: Not a git repository${NC}"
  echo "   Initialize git first: git init"
  exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$PROJECT_ROOT/versions/changelogs"
mkdir -p "$PROJECT_ROOT/versions/archived"
echo -e "  ${GREEN}✓${NC} Created version directories"

# Install git hooks
echo ""
echo "🔗 Installing git hooks..."

HOOKS=("pre-commit" "post-commit")
for hook in "${HOOKS[@]}"; do
  SOURCE="$VERSION_SYSTEM_DIR/hooks/$hook"
  DEST="$PROJECT_ROOT/.git/hooks/$hook"

  # Check if hook exists
  if [ -f "$DEST" ] && [ "$FORCE" = false ]; then
    echo -e "  ${YELLOW}⚠️${NC}  Hook exists: $hook (use --force to overwrite)"
    continue
  fi

  # Copy and make executable
  cp "$SOURCE" "$DEST"
  chmod +x "$DEST"
  echo -e "  ${GREEN}✓${NC} Installed: $hook"
done

# Check for Node.js
echo ""
echo "🔍 Checking dependencies..."
if ! command -v node &> /dev/null; then
  echo -e "  ${RED}❌${NC} Node.js not found"
  echo "     Install Node.js from: https://nodejs.org/"
  exit 1
fi
NODE_VERSION=$(node --version)
echo -e "  ${GREEN}✓${NC} Node.js: $NODE_VERSION"

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
chmod +x "$VERSION_SYSTEM_DIR/scripts/auto-version.js"
chmod +x "$VERSION_SYSTEM_DIR/scripts/install.sh"
echo -e "  ${GREEN}✓${NC} Scripts are executable"

# Initialize version manifest if it doesn't exist
MANIFEST_PATH="$PROJECT_ROOT/versions/version-manifest.json"
if [ ! -f "$MANIFEST_PATH" ]; then
  echo ""
  echo "📋 Initializing version manifest..."

  # Get current version from config
  CURRENT_VERSION=$(grep "currentVersion:" "$VERSION_SYSTEM_DIR/config.js" | grep -oP "'\K[0-9.]+(?=')" || echo "1.0.0")

  cat > "$MANIFEST_PATH" << EOF
{
  "currentVersion": "$CURRENT_VERSION",
  "lastUpdated": "$(date +%Y-%m-%d)",
  "versions": [
    {
      "number": "$CURRENT_VERSION",
      "date": "$(date +%Y-%m-%d)",
      "changelogFile": "changelogs/v$CURRENT_VERSION.md",
      "type": "major",
      "description": "Initial version",
      "file": "index.html",
      "path": "index.html"
    }
  ]
}
EOF
  echo -e "  ${GREEN}✓${NC} Created manifest at: $MANIFEST_PATH"
fi

# Add version-system to .gitignore if needed
if [ -f "$PROJECT_ROOT/.gitignore" ]; then
  if ! grep -q "version-system/node_modules" "$PROJECT_ROOT/.gitignore"; then
    echo "" >> "$PROJECT_ROOT/.gitignore"
    echo "# Version System" >> "$PROJECT_ROOT/.gitignore"
    echo "version-system/node_modules/" >> "$PROJECT_ROOT/.gitignore"
    echo -e "  ${GREEN}✓${NC} Updated .gitignore"
  fi
fi

# Create initial changelog if it doesn't exist
CURRENT_VERSION=$(grep "currentVersion:" "$VERSION_SYSTEM_DIR/config.js" | grep -oP "'\K[0-9.]+(?=')" || echo "1.0.0")
CHANGELOG_PATH="$PROJECT_ROOT/versions/changelogs/v$CURRENT_VERSION.md"

if [ ! -f "$CHANGELOG_PATH" ]; then
  echo ""
  echo "📖 Creating initial changelog..."
  cat > "$CHANGELOG_PATH" << EOF
# Version $CURRENT_VERSION - Initial Release

**Release Date:** $(date +%Y-%m-%d)
**Type:** Major Release

## 🎯 Overview

Initial release of the application with auto-versioning system.

## ✨ Features

- Auto-versioning on git commits
- Automatic changelog generation
- Version archiving system
- Version history UI
- Self-contained modular system

## 📝 Technical Details

This version includes the complete auto-versioning system that will automatically:
- Detect version bumps from commit messages
- Update version numbers across all files
- Generate changelogs
- Create version archives
- Update the UI automatically
EOF
  echo -e "  ${GREEN}✓${NC} Created changelog at: $CHANGELOG_PATH"
fi

# Summary
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Installation Complete!                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "✅ Auto-versioning system is now active!"
echo ""
echo "📖 How it works:"
echo "   1. Make changes to your code"
echo "   2. Commit with conventional format:"
echo "      • feat: New feature (minor bump)"
echo "      • fix: Bug fix (patch bump)"
echo "      • BREAKING CHANGE: Major update (major bump)"
echo "   3. Version is automatically incremented"
echo "   4. Changelog is generated"
echo "   5. Version is archived"
echo ""
echo "🔍 Test it:"
echo "   git commit -m \"feat: Add new feature\" --allow-empty"
echo ""
echo "📚 Documentation:"
echo "   See version-system/README.md for detailed usage"
echo ""
