/**
 * Version UI Module
 * Handles version display and changelog modal
 */

import { createElement, qs } from '../core/domHelpers.js';
import {
    getCurrentVersion,
    getAllVersions,
    loadChangelog,
    parseChangelog
} from './versionManager.js';

let currentChangelogVersion = null;

/**
 * Initialize version UI
 */
export function initializeVersionUI() {
    const currentVersion = getCurrentVersion();
    currentChangelogVersion = currentVersion;

    // Create version display in header
    createVersionDisplay(currentVersion);

    // Create changelog modal
    createChangelogModal();
}

/**
 * Create version display in header
 * @param {string} version - Current version
 */
function createVersionDisplay(version) {
    const header = qs('h1');
    if (!header) return;

    const versionContainer = createElement('div', { className: 'header-version' });

    const badge = createElement('span', {
        className: 'version-badge',
        title: 'Click to view changelog'
    }, `v${version}`);

    badge.addEventListener('click', () => showChangelog(version));

    const viewBtn = createElement('button', {
        className: 'view-changelog-btn',
        type: 'button'
    }, 'View Changelog');

    viewBtn.addEventListener('click', () => showChangelog(version));

    versionContainer.appendChild(badge);
    versionContainer.appendChild(viewBtn);

    header.parentNode.insertBefore(versionContainer, header.nextSibling);
}

/**
 * Create changelog modal
 */
function createChangelogModal() {
    const modal = createElement('div', {
        className: 'modal-overlay',
        id: 'changelog-modal'
    });

    const modalContent = createElement('div', { className: 'modal-content' });

    // Header
    const header = createElement('div', { className: 'modal-header' });
    const title = createElement('h2', {}, 'Version History');
    const closeBtn = createElement('button', {
        className: 'modal-close',
        'aria-label': 'Close modal'
    }, '×');

    closeBtn.addEventListener('click', closeChangelogModal);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', {
        className: 'modal-body',
        id: 'changelog-body'
    }, 'Loading...');

    // Footer with navigation
    const footer = createElement('div', { className: 'modal-footer' });

    const prevBtn = createElement('button', {
        className: 'btn-secondary',
        id: 'changelog-prev-btn'
    }, '← Previous Version');

    const nextBtn = createElement('button', {
        className: 'btn-secondary',
        id: 'changelog-next-btn'
    }, 'Next Version →');

    prevBtn.addEventListener('click', showPreviousVersion);
    nextBtn.addEventListener('click', showNextVersion);

    footer.appendChild(prevBtn);
    footer.appendChild(nextBtn);

    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeChangelogModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeChangelogModal();
        }
    });
}

/**
 * Show changelog for a version
 * @param {string} versionNumber - Version number
 */
export async function showChangelog(versionNumber) {
    const modal = qs('#changelog-modal');
    if (!modal) return;

    currentChangelogVersion = versionNumber;

    modal.classList.add('show');

    const body = qs('#changelog-body');
    if (body) {
        body.innerHTML = '<p>Loading changelog...</p>';
    }

    try {
        const markdown = await loadChangelog(versionNumber);
        const html = parseChangelog(markdown);

        if (body) {
            body.innerHTML = html;
        }

        updateNavigationButtons();
    } catch (error) {
        console.error('Error showing changelog:', error);
        if (body) {
            body.innerHTML = `<p>Error loading changelog for version ${versionNumber}.</p>`;
        }
    }
}

/**
 * Close changelog modal
 */
export function closeChangelogModal() {
    const modal = qs('#changelog-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Show previous version changelog
 */
function showPreviousVersion() {
    const versions = getAllVersions();
    const currentIndex = versions.findIndex(v => v.number === currentChangelogVersion);

    if (currentIndex < versions.length - 1) {
        const prevVersion = versions[currentIndex + 1];
        showChangelog(prevVersion.number);
    }
}

/**
 * Show next version changelog
 */
function showNextVersion() {
    const versions = getAllVersions();
    const currentIndex = versions.findIndex(v => v.number === currentChangelogVersion);

    if (currentIndex > 0) {
        const nextVersion = versions[currentIndex - 1];
        showChangelog(nextVersion.number);
    }
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    const versions = getAllVersions();
    const currentIndex = versions.findIndex(v => v.number === currentChangelogVersion);

    const prevBtn = qs('#changelog-prev-btn');
    const nextBtn = qs('#changelog-next-btn');

    if (prevBtn) {
        prevBtn.disabled = currentIndex >= versions.length - 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentIndex <= 0;
    }
}

/**
 * Create version selector dropdown
 * @returns {HTMLElement} Version selector
 */
export function createVersionSelector() {
    const versions = getAllVersions();
    const currentVersion = getCurrentVersion();

    const container = createElement('div', { className: 'control-group' });
    const label = createElement('label', {}, 'Version');

    const select = createElement('select', { id: 'version-selector' });

    versions.forEach(version => {
        const option = createElement('option', {
            value: version.number,
            selected: version.number === currentVersion
        }, `v${version.number} (${version.date})`);

        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        showChangelog(e.target.value);
    });

    container.appendChild(label);
    container.appendChild(select);

    return container;
}
