/**
 * Auto-Versioner
 *
 * Automatically detects version changes from git commits and updates
 * the version throughout the application.
 */

class AutoVersioner {
  constructor(config) {
    this.config = config || window.VERSION_CONFIG;
    this.currentVersion = this.config.currentVersion;
  }

  /**
   * Analyze commit messages to determine version bump type
   * @param {string} commitMessage - Git commit message
   * @returns {string|null} Version bump type ('major', 'minor', 'patch') or null
   */
  analyzeCommit(commitMessage) {
    if (!commitMessage) return null;

    const message = commitMessage.toLowerCase();
    const keywords = this.config.versionKeywords;

    // Check for major version bump
    for (const keyword of keywords.major) {
      if (message.includes(keyword.toLowerCase())) {
        return 'major';
      }
    }

    // Check for minor version bump
    for (const keyword of keywords.minor) {
      if (message.includes(keyword.toLowerCase())) {
        return 'minor';
      }
    }

    // Check for patch version bump
    for (const keyword of keywords.patch) {
      if (message.includes(keyword.toLowerCase())) {
        return 'patch';
      }
    }

    return null;
  }

  /**
   * Increment version number
   * @param {string} version - Current version
   * @param {string} type - Increment type ('major', 'minor', 'patch')
   * @returns {string} New version
   */
  incrementVersion(version, type) {
    // Use custom increment logic if provided
    if (this.config.customVersionIncrement) {
      return this.config.customVersionIncrement(version, type);
    }

    const parts = version.split('.').map(Number);

    if (parts.length !== 3) {
      throw new Error(`Invalid version format: ${version}`);
    }

    switch (type) {
      case 'major':
        parts[0]++;
        parts[1] = 0;
        parts[2] = 0;
        break;
      case 'minor':
        parts[1]++;
        parts[2] = 0;
        break;
      case 'patch':
        parts[2]++;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    return parts.join('.');
  }

  /**
   * Get next version based on commit message
   * @param {string} commitMessage - Git commit message
   * @returns {Object} { newVersion, type, shouldBump }
   */
  getNextVersion(commitMessage) {
    const type = this.analyzeCommit(commitMessage);

    if (!type) {
      return {
        newVersion: this.currentVersion,
        type: null,
        shouldBump: false
      };
    }

    const newVersion = this.incrementVersion(this.currentVersion, type);

    return {
      newVersion,
      type,
      shouldBump: true
    };
  }

  /**
   * Update version in config file
   * @param {string} newVersion - New version number
   * @returns {Promise<void>}
   */
  async updateConfigVersion(newVersion) {
    const configPath = this.config.configPath || 'version-system/config.js';

    try {
      // Read config file
      const response = await fetch(`/${configPath}`);
      let content = await response.text();

      // Update version
      content = content.replace(
        /currentVersion:\s*['"`][\d.]+['"`]/,
        `currentVersion: '${newVersion}'`
      );

      // Return the updated content (to be saved by caller)
      return content;
    } catch (error) {
      console.error('Error updating config version:', error);
      throw error;
    }
  }

  /**
   * Update version in HTML files
   * @param {string} newVersion - New version number
   * @returns {Array} Array of files that need updating
   */
  getFilesToUpdate(newVersion) {
    return [
      {
        path: 'version-system/config.js',
        pattern: /currentVersion:\s*['"`][\d.]+['"`]/g,
        replacement: `currentVersion: '${newVersion}'`
      },
      {
        path: 'index.html',
        pattern: /data-version=['"`][\d.]+['"`]/g,
        replacement: `data-version="${newVersion}"`
      },
      {
        path: 'index.html',
        pattern: /<meta name="version" content=['"`][\d.]+['"`]/g,
        replacement: `<meta name="version" content="${newVersion}"`
      }
    ];
  }

  /**
   * Extract version type from commit message
   * @param {string} commitMessage - Git commit message
   * @returns {string} Version type label
   */
  getVersionTypeLabel(commitMessage) {
    const type = this.analyzeCommit(commitMessage);

    const labels = {
      'major': 'Major Release',
      'minor': 'Minor Release',
      'patch': 'Patch Release'
    };

    return labels[type] || 'Release';
  }

  /**
   * Extract description from commit message
   * @param {string} commitMessage - Git commit message
   * @returns {string} Clean description
   */
  extractDescription(commitMessage) {
    if (!commitMessage) return '';

    // Remove conventional commit prefixes
    let description = commitMessage
      .replace(/^(feat|fix|docs|style|refactor|perf|test|chore|major|minor|patch):\s*/i, '')
      .replace(/^BREAKING CHANGE:\s*/i, '');

    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);

    return description;
  }

  /**
   * Generate changelog entry from commit
   * @param {string} commitMessage - Git commit message
   * @param {string} version - Version number
   * @returns {Object} Changelog entry
   */
  generateChangelogEntry(commitMessage, version) {
    const type = this.analyzeCommit(commitMessage);
    const description = this.extractDescription(commitMessage);
    const date = new Date().toISOString().split('T')[0];

    return {
      version,
      date,
      type: type || 'patch',
      typeLabel: this.getVersionTypeLabel(commitMessage),
      description,
      commitMessage,
      changes: this.categorizeChanges(commitMessage)
    };
  }

  /**
   * Categorize changes from commit message
   * @param {string} commitMessage - Git commit message
   * @returns {Object} Categorized changes
   */
  categorizeChanges(commitMessage) {
    const changes = {
      breaking: [],
      features: [],
      improvements: [],
      fixes: [],
      docs: [],
      performance: [],
      other: []
    };

    const lines = commitMessage.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 3) continue;

      if (/^BREAKING CHANGE:/i.test(trimmed)) {
        changes.breaking.push(trimmed.replace(/^BREAKING CHANGE:\s*/i, ''));
      } else if (/^feat:|^feature:/i.test(trimmed)) {
        changes.features.push(trimmed.replace(/^(feat|feature):\s*/i, ''));
      } else if (/^fix:/i.test(trimmed)) {
        changes.fixes.push(trimmed.replace(/^fix:\s*/i, ''));
      } else if (/^docs:/i.test(trimmed)) {
        changes.docs.push(trimmed.replace(/^docs:\s*/i, ''));
      } else if (/^perf:/i.test(trimmed)) {
        changes.performance.push(trimmed.replace(/^perf:\s*/i, ''));
      } else if (/^(refactor|style|chore):/i.test(trimmed)) {
        changes.improvements.push(trimmed.replace(/^(refactor|style|chore):\s*/i, ''));
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        changes.other.push(trimmed.substring(1).trim());
      }
    }

    return changes;
  }

  /**
   * Format changelog as markdown
   * @param {Object} entry - Changelog entry
   * @param {string} previousVersion - Previous version number
   * @returns {string} Formatted markdown
   */
  formatChangelogMarkdown(entry, previousVersion) {
    const sections = this.config.changelogSections;
    let markdown = `# Version ${entry.version} - ${entry.description}\n\n`;
    markdown += `**Release Date:** ${entry.date}\n`;
    markdown += `**Type:** ${entry.typeLabel}\n`;
    if (previousVersion) {
      markdown += `**Previous Version:** ${previousVersion}\n`;
    }
    markdown += `\n## 🎯 Overview\n\n${entry.description}\n\n`;

    // Add sections with changes
    for (const section of sections) {
      const changes = entry.changes[section.key];
      if (changes && changes.length > 0) {
        markdown += `## ${section.title}\n\n`;
        for (const change of changes) {
          markdown += `- ${change}\n`;
        }
        markdown += '\n';
      }
    }

    // Add commit message for reference
    markdown += `## 📝 Commit Details\n\n\`\`\`\n${entry.commitMessage}\n\`\`\`\n`;

    return markdown;
  }

  /**
   * Run the auto-versioning process
   * @param {string} commitMessage - Git commit message
   * @returns {Promise<Object>} Result object
   */
  async run(commitMessage) {
    try {
      // Call beforeVersionIncrement hook
      if (this.config.hooks?.beforeVersionIncrement) {
        await this.config.hooks.beforeVersionIncrement(this.currentVersion, commitMessage);
      }

      // Analyze commit and get next version
      const { newVersion, type, shouldBump } = this.getNextVersion(commitMessage);

      if (!shouldBump) {
        return {
          success: true,
          bumped: false,
          version: this.currentVersion,
          message: 'No version bump needed for this commit'
        };
      }

      // Generate changelog entry
      const changelogEntry = this.generateChangelogEntry(commitMessage, newVersion);

      // Get files that need updating
      const filesToUpdate = this.getFilesToUpdate(newVersion);

      // Call afterVersionIncrement hook
      if (this.config.hooks?.afterVersionIncrement) {
        await this.config.hooks.afterVersionIncrement(newVersion, this.currentVersion);
      }

      return {
        success: true,
        bumped: true,
        oldVersion: this.currentVersion,
        newVersion,
        type,
        changelogEntry,
        filesToUpdate,
        message: `Version bumped from ${this.currentVersion} to ${newVersion}`
      };

    } catch (error) {
      // Call error hook
      if (this.config.hooks?.onError) {
        this.config.hooks.onError(error);
      }

      console.error('Auto-versioning error:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoVersioner;
}
if (typeof window !== 'undefined') {
  window.AutoVersioner = AutoVersioner;
}
