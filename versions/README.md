# Version Management System

This directory contains the version management system for the Fraction Worksheet Generator application.

## Directory Structure

```
versions/
├── v2.1.0/                    # Complete snapshot of version 2.1.0
│   ├── index.html            # Main application file
│   ├── js/                   # JavaScript modules
│   ├── css/                  # Stylesheets
│   ├── assets/               # Images, fonts, etc.
│   └── README.md             # Version-specific documentation
├── v2.0.0/                    # Complete snapshot of version 2.0.0
│   └── ...
├── changelogs/                # Detailed changelogs for each version
│   ├── v2.1.0.md
│   ├── v2.0.0.md
│   └── ...
├── archived/                  # Legacy/old versions
├── version-manifest.json      # Central version registry
├── archive-version.sh         # Archiving script
└── README.md                  # This file
```

## Version Archiving Process

### Automatic Archiving (Recommended)

Use the provided shell script to create a complete version archive:

```bash
cd versions
./archive-version.sh <version> <type> "<description>"
```

**Example:**
```bash
./archive-version.sh 2.2.0 minor "Added new features"
```

**Parameters:**
- `version`: Version number (e.g., 2.2.0)
- `type`: Release type - `major`, `minor`, or `patch`
- `description`: Brief description of the release

**What the script does:**
1. Creates a new directory: `versions/v{version}/`
2. Copies all application files (HTML, JS, CSS, assets)
3. Creates a version-specific README
4. Creates a standalone HTML file for backward compatibility
5. Reports the archive size and location

### Manual Archiving

If you prefer to archive manually:

1. **Create version directory:**
   ```bash
   mkdir versions/v2.2.0
   ```

2. **Copy application files:**
   ```bash
   cp index.html versions/v2.2.0/
   cp -r js/ versions/v2.2.0/
   cp -r css/ versions/v2.2.0/
   cp -r assets/ versions/v2.2.0/  # if exists
   ```

3. **Update version manifest:**
   Edit `versions/version-manifest.json` and add:
   ```json
   {
     "number": "2.2.0",
     "date": "2026-01-27",
     "changelogFile": "changelogs/v2.2.0.md",
     "type": "minor",
     "description": "Added new features",
     "file": "fraction-worksheet-v2.2.0.html",
     "path": "versions/v2.2.0/index.html"
   }
   ```

4. **Create changelog:**
   Create `versions/changelogs/v2.2.0.md` with detailed changes

5. **Update current version:**
   Update the `"current"` field in `version-manifest.json`

## Version Manifest Structure

The `version-manifest.json` file is the central registry for all versions:

```json
{
  "current": "2.1.0",
  "versions": [
    {
      "number": "2.1.0",
      "date": "2026-01-27",
      "changelogFile": "changelogs/v2.1.0.md",
      "type": "minor",
      "description": "Enhanced educational content & UX improvements",
      "file": "fraction-worksheet-v2.1.0.html",
      "path": "versions/v2.1.0/index.html"
    }
  ]
}
```

**Fields:**
- `number`: Semantic version number (MAJOR.MINOR.PATCH)
- `date`: Release date (YYYY-MM-DD)
- `changelogFile`: Path to the changelog markdown file
- `type`: Release type (`major`, `minor`, or `patch`)
- `description`: Brief description displayed in UI
- `file`: Standalone HTML file path (for backward compatibility)
- `path`: Path to the version folder's index.html (new structure)

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, major architecture changes
- **MINOR** (x.X.0): New features, non-breaking changes
- **PATCH** (x.x.X): Bug fixes, minor improvements

## Changelog Guidelines

Each version should have a detailed changelog in `changelogs/v{version}.md`:

### Template:

```markdown
# Version X.Y.Z - Brief Title

**Release Date:** YYYY-MM-DD
**Type:** Major/Minor/Patch Release
**Previous Version:** X.Y.Z

## 🎯 Overview
Brief overview of the release

## ✨ New Features
- Feature 1
- Feature 2

## 🔧 Improvements
- Improvement 1
- Improvement 2

## 🐛 Bug Fixes
- Fix 1
- Fix 2

## 📁 Technical Details
Technical implementation details

## 📊 Upgrade Notes
Notes for upgrading from previous versions
```

## Testing Archived Versions

Each archived version is a complete, standalone application:

### Browser:
Simply open `versions/v2.1.0/index.html` in a browser

### Local Server:
```bash
cd versions/v2.1.0
python -m http.server 8000
# Visit http://localhost:8000
```

## Version Switching

Users can switch between versions using:

1. **Version Selector Dropdown**: In the application header
2. **Version History Modal**: Click the version badge to see all versions
3. **Direct URL**: Navigate to specific version folders

## Backward Compatibility

The system maintains backward compatibility with old standalone HTML files:

- New versions: Use `path` field → `versions/v2.1.0/index.html`
- Old versions: Use `file` field → `fraction-worksheet-v1.4.12.html`

The application automatically uses the `path` field if available, falling back to `file` for older versions.

## Best Practices

1. **Always create a changelog** before archiving a version
2. **Test the archived version** to ensure all files are included
3. **Update the manifest** immediately after archiving
4. **Use descriptive commit messages** when committing version archives
5. **Tag releases in Git** for easy reference:
   ```bash
   git tag -a v2.1.0 -m "Version 2.1.0: Enhanced educational content"
   git push origin v2.1.0
   ```

## Maintenance

### Cleaning Old Versions

To move old versions to the archived folder:

```bash
mv versions/v1.0.0 versions/archived/
```

Update the manifest to mark versions as archived if needed.

### Disk Space Management

Each version archive is approximately 200-300KB. Monitor disk usage:

```bash
du -sh versions/*
```

## Questions?

For questions about version management, see the main project documentation or contact the development team.

---

**Last Updated:** 2026-01-27
**Maintained By:** Fraction Worksheet Generator Team
