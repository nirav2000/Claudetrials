# 📦 Auto-Versioning System

A complete, self-contained versioning system that automatically manages versions, changelogs, and archives for your projects.

## ✨ Features

- **Automatic Version Bumping**: Analyzes commit messages and increments versions automatically
- **Semantic Versioning**: Supports MAJOR.MINOR.PATCH versioning
- **Auto-Generated Changelogs**: Creates formatted markdown changelogs from commits
- **Version Archiving**: Automatically snapshots and archives each version
- **Beautiful UI**: Ready-to-use version badge, modal, and history display
- **Self-Contained**: Drop-in solution that works with any web project
- **Git Integration**: Seamless git hooks for automatic versioning
- **Zero Dependencies**: Pure JavaScript, works everywhere

## 🚀 Quick Start

### 1. Copy the version-system folder to your project

```bash
cp -r version-system /path/to/your/project/
```

### 2. Run the installer

```bash
cd /path/to/your/project
./version-system/scripts/install.sh
```

This will:
- Install git hooks
- Create necessary directories
- Initialize version manifest
- Set up the system

### 3. Add to your HTML

```html
<!-- Include the config (customize as needed) -->
<script src="version-system/config.js"></script>

<!-- Include the UI component -->
<script src="version-system/ui/version-component.js"></script>
```

### 4. Start using it!

```bash
# Make changes
git add .

# Commit with conventional format
git commit -m "feat: Add new awesome feature"

# Version is automatically bumped to next minor version!
```

## 📝 Commit Message Format

The system uses conventional commit format to determine version bumps:

### Major Version (X.0.0)

Commits with breaking changes:

```bash
git commit -m "BREAKING CHANGE: Redesign API structure"
git commit -m "major: Complete overhaul of core system"
```

### Minor Version (0.X.0)

New features (backwards compatible):

```bash
git commit -m "feat: Add dark mode toggle"
git commit -m "feature: Implement user authentication"
```

### Patch Version (0.0.X)

Bug fixes and small changes:

```bash
git commit -m "fix: Resolve navigation bug"
git commit -m "patch: Update documentation"
git commit -m "chore: Refactor utility functions"
```

### Skip Versioning

To skip automatic versioning:

```bash
git commit -m "docs: Update README [skip-version]"
```

## ⚙️ Configuration

Edit `version-system/config.js` to customize behavior:

### Basic Settings

```javascript
const VERSION_CONFIG = {
  currentVersion: '1.0.0',          // Starting version
  manifestPath: 'versions/version-manifest.json',
  changelogPath: 'versions/changelogs',
  archivePath: 'versions',

  // Auto-versioning
  autoVersionOnCommit: true,        // Enable auto-versioning
  autoGenerateChangelog: true,      // Auto-generate changelogs
  autoArchiveOnVersion: true,       // Auto-archive versions

  // UI Display
  showVersionBadge: true,           // Show version badge
  badgePosition: 'header',          // 'header' | 'footer' | 'custom'
  enableVersionModal: true,         // Enable version history modal
  enableVersionSelector: false,     // Enable version switcher

  // Git Integration
  createGitTags: true,              // Create git tags for versions
  gitTagFormat: 'v{version}',       // Tag format
};
```

### Advanced Configuration

```javascript
{
  // Custom version logic
  customVersionIncrement: (currentVersion, type) => {
    // Your custom logic
    return newVersion;
  },

  // Custom changelog generator
  customChangelogGenerator: (commits) => {
    // Your custom logic
    return changelogMarkdown;
  },

  // Hooks
  hooks: {
    beforeVersionIncrement: (currentVersion, type) => {
      console.log('About to bump version');
    },
    afterVersionIncrement: (newVersion, oldVersion) => {
      console.log(`Version bumped to ${newVersion}`);
    },
    beforeArchive: (version) => {
      console.log('About to archive');
    },
    afterArchive: (version, archivePath) => {
      console.log('Archive complete');
    }
  }
}
```

## 📂 Project Structure

After installation:

```
your-project/
├── version-system/
│   ├── config.js              # Configuration
│   ├── core/
│   │   └── auto-versioner.js  # Core versioning logic
│   ├── ui/
│   │   └── version-component.js  # UI components
│   ├── hooks/
│   │   ├── pre-commit         # Git pre-commit hook
│   │   └── post-commit        # Git post-commit hook
│   ├── scripts/
│   │   ├── install.sh         # Installation script
│   │   └── auto-version.js    # Auto-versioning script
│   └── README.md              # This file
├── versions/
│   ├── version-manifest.json  # Version registry
│   ├── changelogs/
│   │   ├── v1.0.0.md
│   │   ├── v1.1.0.md
│   │   └── ...
│   ├── v1.0.0/                # Archived version
│   │   ├── index.html
│   │   ├── js/
│   │   └── css/
│   └── v1.1.0/
│       └── ...
└── .git/
    └── hooks/
        ├── pre-commit         # Installed hook
        └── post-commit        # Installed hook
```

## 🎨 UI Components

### Version Badge

Displays current version in your UI. Automatically created and inserted.

```html
<!-- Auto-inserted after h1 -->
<h1>My App</h1>
<div class="version-badge">v1.0.0</div>
```

Click to open version history modal.

### Version History Modal

Beautiful modal showing all versions with:
- Version number and date
- Type badge (Major/Minor/Patch)
- Description
- View details button

### Changelog Viewer

Detailed view of each version's changelog with formatted markdown.

## 🔧 Manual Usage

If you need to control versioning manually:

### Check what version would be bumped

```bash
node version-system/scripts/auto-version.js --check
```

### Manually bump version

```bash
node version-system/scripts/auto-version.js "feat: New feature"
```

### Generate changelog

Changelogs are auto-generated on version bump. Format:

```markdown
# Version X.Y.Z - Description

**Release Date:** YYYY-MM-DD
**Type:** Major/Minor/Patch Release
**Previous Version:** X.Y.Z

## 🎯 Overview
...

## ✨ New Features
- Feature 1
- Feature 2

## 🐛 Bug Fixes
- Fix 1
- Fix 2
```

## 📦 Archiving

Each version is automatically archived to `versions/vX.Y.Z/` with:
- Complete source code snapshot
- All assets
- README with version info

Archives are created on version bump if `autoArchiveOnVersion: true`.

## 🔌 Integration

### With Build Tools

Add to your build process:

```json
{
  "scripts": {
    "version:check": "node version-system/scripts/auto-version.js --check",
    "build": "npm run build:app && npm run version:check"
  }
}
```

### With CI/CD

```yaml
# .github/workflows/deploy.yml
steps:
  - name: Check version
    run: node version-system/scripts/auto-version.js --check

  - name: Build and deploy
    run: npm run build
```

### With npm

Update `package.json` version automatically:

```javascript
// In config.js
integrations: {
  npm: {
    enabled: true,
    updatePackageJson: true
  }
}
```

## 🎯 Examples

### Example 1: Feature Development

```bash
# Start feature
git checkout -b feature/dark-mode

# Implement feature
# ... make changes ...

# Commit (triggers minor version bump)
git commit -m "feat: Add dark mode toggle with system preference detection"

# Result:
# ✓ Version bumped: 1.2.0 → 1.3.0
# ✓ Changelog created: versions/changelogs/v1.3.0.md
# ✓ Version archived: versions/v1.3.0/
# ✓ Git tag created: v1.3.0
```

### Example 2: Bug Fix

```bash
# Fix bug
git commit -m "fix: Resolve infinite loop in navigation"

# Result:
# ✓ Version bumped: 1.3.0 → 1.3.1
# ✓ Changelog updated
# ✓ Patch archived
```

### Example 3: Breaking Change

```bash
# Major refactor
git commit -m "BREAKING CHANGE: Redesign API - endpoints renamed, auth required"

# Result:
# ✓ Version bumped: 1.3.1 → 2.0.0
# ✓ Major version archived
# ✓ Breaking changes documented in changelog
```

## 🛠️ Troubleshooting

### Versions not incrementing

1. Check git hooks are installed:
   ```bash
   ls -la .git/hooks/
   ```

2. Verify hooks are executable:
   ```bash
   chmod +x .git/hooks/post-commit
   ```

3. Check commit message format:
   ```bash
   # Must include: feat:, fix:, BREAKING CHANGE:, etc.
   ```

### UI not showing

1. Verify scripts are included in HTML:
   ```html
   <script src="version-system/config.js"></script>
   <script src="version-system/ui/version-component.js"></script>
   ```

2. Check browser console for errors

3. Ensure VERSION_CONFIG is loaded:
   ```javascript
   console.log(window.VERSION_CONFIG);
   ```

### Manifest not found

1. Run installer:
   ```bash
   ./version-system/scripts/install.sh
   ```

2. Or create manually:
   ```bash
   mkdir -p versions/changelogs
   echo '{"versions":[]}' > versions/version-manifest.json
   ```

## 📚 API Reference

### VersionComponent

```javascript
// Manual initialization
const vc = new VersionComponent(config);
await vc.init();

// Show modal programmatically
vc.showVersionModal();

// Show notification
vc.showNotification('Title', 'Message');

// Get current version
console.log(vc.currentVersion);

// Get all versions
console.log(vc.versions);
```

### AutoVersioner

```javascript
const AutoVersioner = require('./core/auto-versioner.js');
const versioner = new AutoVersioner(config);

// Analyze commit
const type = versioner.analyzeCommit('feat: New feature');
// Returns: 'minor'

// Increment version
const newVersion = versioner.incrementVersion('1.0.0', 'minor');
// Returns: '1.1.0'

// Run auto-versioning
const result = await versioner.run(commitMessage);
```

## 🤝 Contributing

This is a self-contained system. To improve it:

1. Make changes to version-system files
2. Test in a project
3. Update documentation
4. Share improvements

## 📄 License

Free to use in any project. No attribution required.

## 🎉 Credits

Built to solve the problem of manual version management once and for all.

---

**Made with ❤️ for developers who hate manual versioning**

For support or questions, create an issue in your project repository.
