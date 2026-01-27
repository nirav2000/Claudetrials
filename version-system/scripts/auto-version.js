#!/usr/bin/env node

/**
 * Auto-Version Script
 *
 * This script is called by git hooks to automatically version the application.
 * It reads the commit message, determines the version bump, updates all files,
 * creates archives, and generates changelogs.
 *
 * Usage:
 *   node auto-version.js [commit-message]
 *   node auto-version.js --check  (dry run)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration
const configPath = path.join(__dirname, '../config.js');
let config;

try {
  // Load config
  const configContent = fs.readFileSync(configPath, 'utf8');
  // Extract VERSION_CONFIG object using a simple eval (safe since it's our file)
  const match = configContent.match(/const VERSION_CONFIG = ({[\s\S]*?});/);
  if (match) {
    config = eval('(' + match[1] + ')');
  } else {
    throw new Error('Could not parse VERSION_CONFIG from config.js');
  }
} catch (error) {
  console.error('Error loading config:', error.message);
  process.exit(1);
}

/**
 * Execute shell command
 */
function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    if (!options.ignoreError) {
      console.error(`Command failed: ${command}`);
      console.error(error.message);
    }
    return null;
  }
}

/**
 * Get the last commit message
 */
function getLastCommitMessage() {
  const message = exec('git log -1 --pretty=%B');
  return message ? message.trim() : null;
}

/**
 * Analyze commit message to determine version bump type
 */
function analyzeCommit(commitMessage) {
  if (!commitMessage) return null;

  const message = commitMessage.toLowerCase();
  const keywords = config.versionKeywords;

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
 */
function incrementVersion(version, type) {
  const parts = version.split('.').map(Number);

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
  }

  return parts.join('.');
}

/**
 * Extract description from commit message
 */
function extractDescription(commitMessage) {
  if (!commitMessage) return '';

  let description = commitMessage
    .split('\n')[0] // First line only
    .replace(/^(feat|fix|docs|style|refactor|perf|test|chore|major|minor|patch):\s*/i, '')
    .replace(/^BREAKING CHANGE:\s*/i, '');

  description = description.charAt(0).toUpperCase() + description.slice(1);

  return description;
}

/**
 * Update version in a file
 */
function updateFileVersion(filePath, newVersion) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Update different version patterns
  content = content.replace(/currentVersion:\s*['"`][\d.]+['"`]/g, `currentVersion: '${newVersion}'`);
  content = content.replace(/data-version=['"`][\d.]+['"`]/g, `data-version="${newVersion}"`);
  content = content.replace(/<meta name="version" content=['"`][\d.]+['"`]/g, `<meta name="version" content="${newVersion}"`);
  content = content.replace(/VERSION\s*=\s*['"`][\d.]+['"`]/g, `VERSION = '${newVersion}'`);
  content = content.replace(/"version":\s*"[\d.]+"/g, `"version": "${newVersion}"`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated: ${filePath}`);
    return true;
  }

  return false;
}

/**
 * Update version in manifest
 */
function updateManifest(newVersion, type, description, commitMessage) {
  const manifestPath = path.join(process.cwd(), config.manifestPath);

  let manifest = { versions: [] };

  // Load existing manifest
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
      console.error('  ⚠️  Error reading manifest, creating new one');
    }
  }

  // Create new version entry
  const date = new Date().toISOString().split('T')[0];
  const newEntry = {
    number: newVersion,
    date: date,
    changelogFile: `changelogs/v${newVersion}.md`,
    type: type,
    description: description,
    file: `fraction-worksheet-v${newVersion}.html`,
    path: `versions/v${newVersion}/index.html`,
    commit: commitMessage.substring(0, 100)
  };

  // Add to manifest
  manifest.versions = manifest.versions || [];
  manifest.versions.unshift(newEntry); // Add to beginning

  // Update current version (both fields for compatibility)
  manifest.current = newVersion;
  manifest.currentVersion = newVersion;
  manifest.lastUpdated = date;

  // Save manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`  ✓ Updated manifest: ${manifestPath}`);

  return newEntry;
}

/**
 * Generate changelog markdown
 */
function generateChangelog(version, type, description, commitMessage, previousVersion) {
  const date = new Date().toISOString().split('T')[0];
  const typeLabel = {
    'major': 'Major Release',
    'minor': 'Minor Release',
    'patch': 'Patch Release'
  }[type] || 'Release';

  let markdown = `# Version ${version} - ${description}\n\n`;
  markdown += `**Release Date:** ${date}\n`;
  markdown += `**Type:** ${typeLabel}\n`;
  if (previousVersion) {
    markdown += `**Previous Version:** ${previousVersion}\n`;
  }
  markdown += `\n## 🎯 Overview\n\n${description}\n\n`;

  // Parse commit message for changes
  const lines = commitMessage.split('\n');
  const changes = {
    breaking: [],
    features: [],
    fixes: [],
    improvements: [],
    other: []
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (/^BREAKING CHANGE:/i.test(trimmed)) {
      changes.breaking.push(trimmed.replace(/^BREAKING CHANGE:\s*/i, ''));
    } else if (/^feat:|^feature:/i.test(trimmed)) {
      changes.features.push(trimmed.replace(/^(feat|feature):\s*/i, ''));
    } else if (/^fix:/i.test(trimmed)) {
      changes.fixes.push(trimmed.replace(/^fix:\s*/i, ''));
    } else if (trimmed.startsWith('-')) {
      changes.other.push(trimmed.substring(1).trim());
    }
  }

  // Add sections
  if (changes.breaking.length > 0) {
    markdown += `## 🚨 Breaking Changes\n\n`;
    changes.breaking.forEach(change => markdown += `- ${change}\n`);
    markdown += '\n';
  }

  if (changes.features.length > 0) {
    markdown += `## ✨ New Features\n\n`;
    changes.features.forEach(change => markdown += `- ${change}\n`);
    markdown += '\n';
  }

  if (changes.fixes.length > 0) {
    markdown += `## 🐛 Bug Fixes\n\n`;
    changes.fixes.forEach(change => markdown += `- ${change}\n`);
    markdown += '\n';
  }

  if (changes.improvements.length > 0 || changes.other.length > 0) {
    markdown += `## 🔧 Improvements\n\n`;
    [...changes.improvements, ...changes.other].forEach(change => markdown += `- ${change}\n`);
    markdown += '\n';
  }

  markdown += `## 📝 Commit Message\n\n\`\`\`\n${commitMessage}\n\`\`\`\n`;

  return markdown;
}

/**
 * Save changelog
 */
function saveChangelog(version, content) {
  const changelogDir = path.join(process.cwd(), config.changelogPath);
  const changelogPath = path.join(changelogDir, `v${version}.md`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(changelogDir)) {
    fs.mkdirSync(changelogDir, { recursive: true });
  }

  fs.writeFileSync(changelogPath, content, 'utf8');
  console.log(`  ✓ Created changelog: ${changelogPath}`);

  return changelogPath;
}

/**
 * Archive current version
 */
function archiveVersion(version) {
  const archiveDir = path.join(process.cwd(), config.archivePath, `v${version}`);

  console.log(`\n📦 Archiving version ${version}...`);

  // Create archive directory
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  // Copy files
  const includes = config.archiveIncludes;
  let filesArchived = 0;

  for (const pattern of includes) {
    try {
      // Use rsync or cp for directory copying
      if (pattern.includes('**')) {
        const dir = pattern.split('/**')[0];
        const sourcePath = path.join(process.cwd(), dir);
        const destPath = path.join(archiveDir, dir);

        if (fs.existsSync(sourcePath)) {
          exec(`cp -r "${sourcePath}" "${destPath}"`);
          filesArchived++;
          console.log(`  ✓ Archived: ${dir}/`);
        }
      } else {
        const sourcePath = path.join(process.cwd(), pattern);
        const destPath = path.join(archiveDir, pattern);

        if (fs.existsSync(sourcePath)) {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(sourcePath, destPath);
          filesArchived++;
          console.log(`  ✓ Archived: ${pattern}`);
        }
      }
    } catch (error) {
      console.error(`  ⚠️  Error archiving ${pattern}:`, error.message);
    }
  }

  // Create README
  const readme = `# Version ${version}\n\nArchived on ${new Date().toISOString()}\n\nThis is a snapshot of the application at version ${version}.\n`;
  fs.writeFileSync(path.join(archiveDir, 'README.md'), readme, 'utf8');

  console.log(`  ✓ Archived ${filesArchived} items to: ${archiveDir}`);

  return archiveDir;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--check');

  console.log('\n🚀 Auto-Version System\n');
  console.log('━'.repeat(60));

  // Get commit message
  let commitMessage;
  if (args.length > 0 && !isDryRun) {
    commitMessage = args.join(' ');
  } else {
    commitMessage = getLastCommitMessage();
  }

  if (!commitMessage) {
    console.log('❌ No commit message found');
    process.exit(0);
  }

  console.log(`📝 Commit: ${commitMessage.split('\n')[0]}`);

  // Analyze commit
  const currentVersion = config.currentVersion;
  const bumpType = analyzeCommit(commitMessage);

  if (!bumpType) {
    console.log(`✓ No version bump needed (current: v${currentVersion})`);
    process.exit(0);
  }

  const newVersion = incrementVersion(currentVersion, bumpType);
  const description = extractDescription(commitMessage);

  console.log(`\n📊 Version Analysis:`);
  console.log(`  Current: v${currentVersion}`);
  console.log(`  New:     v${newVersion}`);
  console.log(`  Type:    ${bumpType.toUpperCase()}`);
  console.log(`  Desc:    ${description}`);

  if (isDryRun) {
    console.log('\n✓ Dry run completed (no changes made)');
    process.exit(0);
  }

  // Update files
  console.log(`\n📝 Updating files...`);
  const filesToUpdate = [
    'version-system/config.js',
    'index.html',
    'js/app.js',
    'package.json'
  ];

  for (const file of filesToUpdate) {
    updateFileVersion(file, newVersion);
  }

  // Update manifest
  console.log(`\n📋 Updating manifest...`);
  updateManifest(newVersion, bumpType, description, commitMessage);

  // Generate and save changelog
  if (config.autoGenerateChangelog) {
    console.log(`\n📖 Generating changelog...`);
    const changelog = generateChangelog(newVersion, bumpType, description, commitMessage, currentVersion);
    saveChangelog(newVersion, changelog);
  }

  // Archive version
  if (config.autoArchiveOnVersion) {
    archiveVersion(newVersion);
  }

  // Create git tag
  if (config.createGitTags) {
    const tag = config.gitTagFormat.replace('{version}', newVersion);
    console.log(`\n🏷️  Creating git tag: ${tag}`);
    exec(`git tag -a ${tag} -m "Release version ${newVersion}"`, { ignoreError: true });
  }

  console.log('\n━'.repeat(60));
  console.log(`✅ Version ${newVersion} created successfully!\n`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
