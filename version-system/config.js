/**
 * Version System Configuration
 *
 * This configuration file controls all aspects of the automatic versioning system.
 * Copy this file to your project and customize as needed.
 */

const VERSION_CONFIG = {
  // ============================================================================
  // CORE SETTINGS
  // ============================================================================

  /**
   * Current version (auto-updated by the system)
   */
  currentVersion: '2.2.1',

  /**
   * Path to version manifest file (relative to project root)
   */
  manifestPath: 'versions/version-manifest.json',

  /**
   * Path to changelogs directory
   */
  changelogPath: 'versions/changelogs',

  /**
   * Path to version archives
   */
  archivePath: 'versions',

  /**
   * Files to include in version archives
   */
  archiveIncludes: [
    'index.html',
    'js/**/*',
    'css/**/*',
    'assets/**/*',
    'README.md'
  ],

  /**
   * Files to exclude from version archives
   */
  archiveExcludes: [
    'node_modules/**',
    '.git/**',
    'version-system/**',
    '*.log',
    '.env'
  ],

  // ============================================================================
  // AUTO-VERSIONING SETTINGS
  // ============================================================================

  /**
   * Enable automatic version increments on commit
   */
  autoVersionOnCommit: true,

  /**
   * Commit message keywords for version bumps
   */
  versionKeywords: {
    major: ['BREAKING CHANGE', 'major:', 'breaking:'],
    minor: ['feat:', 'feature:', 'minor:'],
    patch: ['fix:', 'patch:', 'chore:', 'docs:', 'style:', 'refactor:', 'perf:', 'test:']
  },

  /**
   * Auto-generate changelog from commit messages
   */
  autoGenerateChangelog: true,

  /**
   * Automatically archive version on increment
   */
  autoArchiveOnVersion: true,

  // ============================================================================
  // UI DISPLAY SETTINGS
  // ============================================================================

  /**
   * Show version badge in UI
   */
  showVersionBadge: true,

  /**
   * Version badge position ('header' | 'footer' | 'custom')
   */
  badgePosition: 'header',

  /**
   * Custom selector for badge insertion (if badgePosition is 'custom')
   */
  badgeSelector: null,

  /**
   * Enable version history modal
   */
  enableVersionModal: true,

  /**
   * Enable version selector dropdown
   */
  enableVersionSelector: true,

  /**
   * Show changelog on version load
   */
  showChangelogOnLoad: false,

  /**
   * Version badge style
   */
  badgeStyle: {
    position: 'inline', // 'inline' | 'floating'
    theme: 'default' // 'default' | 'minimal' | 'detailed'
  },

  // ============================================================================
  // VERSIONING RULES
  // ============================================================================

  /**
   * Version format (semantic versioning)
   */
  versionFormat: 'semver', // 'semver' | 'date' | 'custom'

  /**
   * Date format for date-based versioning
   */
  dateFormat: 'YYYY.MM.DD',

  /**
   * Minimum version (prevent going below this)
   */
  minimumVersion: '1.0.0',

  /**
   * Version prefix (e.g., 'v' for v1.0.0)
   */
  versionPrefix: '',

  // ============================================================================
  // CHANGELOG SETTINGS
  // ============================================================================

  /**
   * Changelog format
   */
  changelogFormat: 'markdown', // 'markdown' | 'json' | 'html'

  /**
   * Changelog template sections
   */
  changelogSections: [
    { key: 'breaking', title: '🚨 Breaking Changes', emoji: '🚨' },
    { key: 'features', title: '✨ New Features', emoji: '✨' },
    { key: 'improvements', title: '🔧 Improvements', emoji: '🔧' },
    { key: 'fixes', title: '🐛 Bug Fixes', emoji: '🐛' },
    { key: 'docs', title: '📚 Documentation', emoji: '📚' },
    { key: 'performance', title: '⚡ Performance', emoji: '⚡' },
    { key: 'other', title: '📦 Other Changes', emoji: '📦' }
  ],

  // ============================================================================
  // GIT INTEGRATION
  // ============================================================================

  /**
   * Enable git hooks
   */
  enableGitHooks: true,

  /**
   * Hooks to install
   */
  gitHooks: ['pre-commit', 'post-commit', 'pre-push'],

  /**
   * Automatically commit version changes
   */
  autoCommitVersionChanges: true,

  /**
   * Version commit message template
   */
  versionCommitTemplate: 'chore: bump version to {version}',

  /**
   * Git tag format
   */
  gitTagFormat: 'v{version}',

  /**
   * Create git tags for versions
   */
  createGitTags: true,

  // ============================================================================
  // NOTIFICATION SETTINGS
  // ============================================================================

  /**
   * Show notifications in console
   */
  consoleNotifications: true,

  /**
   * Show UI notifications
   */
  uiNotifications: true,

  /**
   * Notification duration (ms)
   */
  notificationDuration: 5000,

  // ============================================================================
  // ADVANCED SETTINGS
  // ============================================================================

  /**
   * Custom version increment logic (function)
   * @param {string} currentVersion - Current version
   * @param {string} type - Type of increment ('major' | 'minor' | 'patch')
   * @returns {string} New version
   */
  customVersionIncrement: null,

  /**
   * Custom changelog generator (function)
   * @param {Array} commits - Array of commit objects
   * @returns {string} Generated changelog
   */
  customChangelogGenerator: null,

  /**
   * Hooks/callbacks
   */
  hooks: {
    beforeVersionIncrement: null, // (currentVersion, type) => {}
    afterVersionIncrement: null,  // (newVersion, oldVersion) => {}
    beforeArchive: null,           // (version) => {}
    afterArchive: null,            // (version, archivePath) => {}
    onError: null                  // (error) => {}
  },

  // ============================================================================
  // INTEGRATION SETTINGS
  // ============================================================================

  /**
   * API endpoints for remote version tracking
   */
  api: {
    enabled: false,
    endpoints: {
      getVersions: null,
      createVersion: null,
      updateVersion: null
    },
    headers: {}
  },

  /**
   * External integrations
   */
  integrations: {
    github: {
      enabled: false,
      createRelease: false
    },
    npm: {
      enabled: false,
      updatePackageJson: false
    },
    docker: {
      enabled: false,
      updateTags: false
    }
  }
};

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERSION_CONFIG;
}
if (typeof window !== 'undefined') {
  window.VERSION_CONFIG = VERSION_CONFIG;
}
