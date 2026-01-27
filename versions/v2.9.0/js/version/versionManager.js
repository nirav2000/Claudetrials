/**
 * Version Manager Module
 * Handles version tracking and manifest management
 */

import { formatDate } from '../core/utils.js';

let versionManifest = null;

/**
 * Load version manifest
 * @returns {Promise<Object>} Version manifest
 */
export async function loadVersionManifest() {
    try {
        const response = await fetch('versions/version-manifest.json');
        if (!response.ok) {
            throw new Error('Failed to load version manifest');
        }
        versionManifest = await response.json();
        return versionManifest;
    } catch (error) {
        console.error('Error loading version manifest:', error);
        // Return default manifest
        versionManifest = {
            current: '2.0.0',
            versions: []
        };
        return versionManifest;
    }
}

/**
 * Get current version
 * @returns {string} Current version number
 */
export function getCurrentVersion() {
    return versionManifest?.current || '2.0.0';
}

/**
 * Get all versions
 * @returns {Array} Array of version objects
 */
export function getAllVersions() {
    return versionManifest?.versions || [];
}

/**
 * Get version by number
 * @param {string} versionNumber - Version number
 * @returns {Object|null} Version object
 */
export function getVersion(versionNumber) {
    if (!versionManifest) return null;
    return versionManifest.versions.find(v => v.number === versionNumber);
}

/**
 * Load changelog for a version
 * @param {string} versionNumber - Version number
 * @returns {Promise<string>} Changelog markdown content
 */
export async function loadChangelog(versionNumber) {
    const version = getVersion(versionNumber);
    if (!version || !version.changelogFile) {
        return `# Version ${versionNumber}\nNo changelog available.`;
    }

    try {
        const response = await fetch(`versions/${version.changelogFile}`);
        if (!response.ok) {
            throw new Error('Failed to load changelog');
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading changelog:', error);
        return `# Version ${versionNumber}\nError loading changelog.`;
    }
}

/**
 * Parse changelog markdown to HTML
 * @param {string} markdown - Markdown content
 * @returns {string} HTML content
 */
export function parseChangelog(markdown) {
    if (typeof marked !== 'undefined' && marked.parse) {
        return marked.parse(markdown);
    }

    // Fallback: basic markdown parsing
    return markdown
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^\*\*(.+?)\*\*$/gm, '<strong>$1</strong>')
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>');
}

/**
 * Get next version number
 * @param {string} currentVersion - Current version
 * @param {string} type - Version type ('major', 'minor', 'patch')
 * @returns {string} Next version number
 */
export function getNextVersion(currentVersion, type = 'patch') {
    const parts = currentVersion.split('.').map(Number);
    let [major, minor, patch] = parts;

    switch (type) {
        case 'major':
            major++;
            minor = 0;
            patch = 0;
            break;
        case 'minor':
            minor++;
            patch = 0;
            break;
        case 'patch':
        default:
            patch++;
            break;
    }

    return `${major}.${minor}.${patch}`;
}

/**
 * Create new version entry
 * @param {string} versionNumber - Version number
 * @param {string} type - Version type
 * @param {string} changelogFile - Changelog file path
 * @returns {Object} Version entry
 */
export function createVersionEntry(versionNumber, type, changelogFile) {
    return {
        number: versionNumber,
        date: formatDate(new Date()),
        changelogFile,
        type
    };
}

/**
 * Add version to manifest
 * @param {Object} versionEntry - Version entry object
 */
export function addVersionToManifest(versionEntry) {
    if (!versionManifest) {
        versionManifest = {
            current: versionEntry.number,
            versions: []
        };
    }

    versionManifest.versions.unshift(versionEntry);
    versionManifest.current = versionEntry.number;
}

/**
 * Save version manifest (for demonstration - requires server)
 * @returns {Object} Updated manifest
 */
export function saveVersionManifest() {
    // In a real application, this would send to a server
    console.log('Saving version manifest:', versionManifest);
    return versionManifest;
}

/**
 * Get version manifest as JSON string
 * @returns {string} JSON string
 */
export function getManifestJSON() {
    return JSON.stringify(versionManifest, null, 2);
}
