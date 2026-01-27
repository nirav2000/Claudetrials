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

    // Add version selector to controls
    addVersionSelectorToControls();
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
        title: 'Click to view changelog',
        style: 'cursor: pointer;'
    }, `v${version}`);

    badge.addEventListener('click', () => showChangelog(version));

    versionContainer.appendChild(badge);

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
 * Show changelog modal with all versions as cards
 * @param {string} versionNumber - Version number (optional, for scrolling to specific version)
 */
export async function showChangelog(versionNumber = null) {
    const modal = qs('#changelog-modal');
    if (!modal) return;

    modal.classList.add('show');

    const body = qs('#changelog-body');
    if (body) {
        body.innerHTML = '<p>Loading versions...</p>';
    }

    try {
        const versions = getAllVersions();
        const currentVersion = getCurrentVersion();

        if (body) {
            body.innerHTML = createVersionCardsHTML(versions, currentVersion);

            // Add click handlers for expanding version details
            const cards = body.querySelectorAll('.version-card');
            cards.forEach(card => {
                const versionNum = card.dataset.version;
                const expandBtn = card.querySelector('.expand-version-btn');
                if (expandBtn) {
                    expandBtn.addEventListener('click', () => expandVersionDetails(versionNum));
                }
            });

            // Scroll to specific version if provided
            if (versionNumber) {
                const targetCard = body.querySelector(`[data-version="${versionNumber}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }

        // Hide navigation buttons since we're showing all versions
        updateNavigationButtons(true);
    } catch (error) {
        console.error('Error showing changelog:', error);
        if (body) {
            body.innerHTML = `<p>Error loading version history.</p>`;
        }
    }
}

/**
 * Create HTML for version cards
 * @param {Array} versions - Array of version objects
 * @param {string} currentVersion - Current version number
 * @returns {string} HTML string
 */
function createVersionCardsHTML(versions, currentVersion) {
    const cardsHTML = versions.map(version => {
        const isCurrent = version.number === currentVersion;
        const typeIcon = getVersionTypeIcon(version.type);
        const typeLabel = getVersionTypeLabel(version.type);

        return `
            <div class="version-card ${isCurrent ? 'current-version' : ''}" data-version="${version.number}">
                <div class="version-card-header">
                    <div class="version-header-left">
                        <span class="version-icon">${typeIcon}</span>
                        <div class="version-title-group">
                            <h3 class="version-number">Version ${version.number}</h3>
                            <span class="version-date">${version.date}</span>
                        </div>
                    </div>
                    <div class="version-badges">
                        ${isCurrent ? '<span class="badge badge-current">Current</span>' : ''}
                        <span class="badge badge-${version.type}">${typeLabel}</span>
                    </div>
                </div>
                <div class="version-card-body">
                    <p class="version-description">${version.description || 'No description available'}</p>
                    <button class="expand-version-btn" aria-label="View full changelog">
                        View Details →
                    </button>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="version-cards-container">${cardsHTML}</div>`;
}

/**
 * Get icon for version type
 * @param {string} type - Version type
 * @returns {string} Icon emoji
 */
function getVersionTypeIcon(type) {
    const icons = {
        'major': '🎉',
        'minor': '✨',
        'patch': '🔧'
    };
    return icons[type] || '📦';
}

/**
 * Get label for version type
 * @param {string} type - Version type
 * @returns {string} Type label
 */
function getVersionTypeLabel(type) {
    const labels = {
        'major': 'Major',
        'minor': 'Minor',
        'patch': 'Patch'
    };
    return labels[type] || 'Release';
}

/**
 * Expand version details (show full changelog)
 * @param {string} versionNumber - Version number
 */
async function expandVersionDetails(versionNumber) {
    // Create a new modal for the detailed changelog
    const detailModal = createElement('div', {
        className: 'modal-overlay show',
        id: 'changelog-detail-modal'
    });

    const modalContent = createElement('div', { className: 'modal-content' });

    // Header
    const header = createElement('div', { className: 'modal-header' });
    const title = createElement('h2', {}, `Version ${versionNumber} - Full Changelog`);
    const closeBtn = createElement('button', {
        className: 'modal-close',
        'aria-label': 'Close modal'
    }, '×');

    closeBtn.addEventListener('click', () => {
        detailModal.remove();
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', {
        className: 'modal-body',
        id: 'changelog-detail-body'
    }, 'Loading changelog...');

    modalContent.appendChild(header);
    modalContent.appendChild(body);
    detailModal.appendChild(modalContent);

    document.body.appendChild(detailModal);

    // Close on outside click
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.remove();
        }
    });

    // Load and display full changelog
    try {
        const markdown = await loadChangelog(versionNumber);
        const html = parseChangelog(markdown);
        body.innerHTML = html;
    } catch (error) {
        console.error('Error loading changelog:', error);
        body.innerHTML = `<p>Error loading changelog for version ${versionNumber}.</p>`;
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
 * @param {boolean} hideButtons - Whether to hide navigation buttons
 */
function updateNavigationButtons(hideButtons = false) {
    const footer = qs('.modal-footer');

    if (footer) {
        footer.style.display = hideButtons ? 'none' : 'flex';
    }

    if (hideButtons) return;

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
    const label = createElement('label', { htmlFor: 'version-selector' }, 'Version:');

    const select = createElement('select', { id: 'version-selector' });

    // Add "Latest Version" option at the top
    const latestOption = createElement('option', {
        value: 'latest'
    }, `🚀 Latest Version (v${currentVersion}) - Current Development`);
    latestOption.selected = true;
    select.appendChild(latestOption);

    versions.forEach(version => {
        const icon = version.type === 'major' ? '🎉' : version.type === 'minor' ? '✨' : '🔧';
        const option = createElement('option', {
            value: version.number
        }, `${icon} v${version.number} - ${version.description || version.date}`);

        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'latest') {
            // Navigate to the latest version (index.html)
            window.location.href = 'index.html';
        } else {
            const selectedVersion = versions.find(v => v.number === selectedValue);
            if (selectedVersion && selectedVersion.file) {
                // Navigate to the version file
                window.location.href = selectedVersion.file;
            }
        }
    });

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

/**
 * Add version selector to controls section
 */
function addVersionSelectorToControls() {
    const controlsGrid = qs('.controls-grid');
    if (!controlsGrid) return;

    const versionSelector = createVersionSelector();
    controlsGrid.appendChild(versionSelector);
}
